"use client";

import ActiveUsers from "@/components/ActiveUsers";
import Leaderboard from "@/components/Leaderboard";
import NamePrompt from "@/components/NamePrompt";
import RoundArea from "@/components/RoundArea";
import StartBtn from "@/components/StartBtn";
import type { RoundProgressBroadcastPayload, RoundStartBroadcastPayload } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const CHANNEL_NAME = "game:1:messages";
  const [playerName, setPlayerName] = useState("");
  const [roundInfo, setRoundInfo] = useState<RoundStartBroadcastPayload | null>(null);
  const [progressByPlayer, setProgressByPlayer] = useState<Record<string, string>>({});
  const [roundStartsAt, setRoundStartsAt] = useState<number | null>(null);
  const [roundEndsAt, setRoundEndsAt] = useState<number | null>(null);
  const lastMetricsSentAt = useRef(0);

  // Create a Supabase channel for presence tracking
  const usersChannel = useMemo(() => {
    if (!playerName) return null;
    return supabase.channel(CHANNEL_NAME, {
      config: { presence: { key: playerName }, broadcast: { self: true } },
    });
  }, [playerName]);

  //called on keystroke
  const handleSendProgress = useCallback(
    (typed: string) => {
      if (!usersChannel || !playerName) return;
      //threshold
      const now = Date.now();
      if (now - lastMetricsSentAt.current < 200) return;
      lastMetricsSentAt.current = now;

      const payload: RoundProgressBroadcastPayload = {
        playerId: playerName,
        playerName,
        typed,
      };

      setProgressByPlayer((prev) => ({ ...prev, [playerName]: typed }));
      usersChannel.send({
        type: "broadcast",
        event: "round_progress",
        payload,
      });
    },
    [usersChannel, playerName],
  );

  useEffect(() => {
    // Listen for round start events
    usersChannel?.on<RoundStartBroadcastPayload>("broadcast", { event: "round_start" }, ({ payload }) => {
      setRoundInfo(payload);
      const startsAt = Date.now() + payload.startsIn * 1000;
      setRoundStartsAt(startsAt);
      setRoundEndsAt(startsAt + payload.duration * 1000);
    });
    // Listen for currently typed progress
    usersChannel?.on<RoundProgressBroadcastPayload>("broadcast", { event: "round_progress" }, ({ payload }) => {
      setProgressByPlayer((prev) => ({ ...prev, [payload.playerId]: payload.typed }));
    });

    return () => {
      if (usersChannel) supabase.removeChannel(usersChannel);
    };
  }, [usersChannel]);

  return (
    <div className="m-10">
      <NamePrompt isOpen={!playerName} onSubmitName={setPlayerName} />
      <ActiveUsers channel={usersChannel} userId={playerName} />

      <StartBtn channelName={CHANNEL_NAME} onResponse={() => {}} />
      <RoundArea
        roundInfo={roundInfo}
        playerId={playerName}
        playerName={playerName}
        onProgress={handleSendProgress}
        onRoundComplete={() => {
          setRoundEndsAt((prev) => (prev ? Math.min(prev, Date.now()) : Date.now()));
        }}
        className="m-5 flex flex-col"
      />
      <Leaderboard
        roundInfo={roundInfo}
        progressByPlayer={progressByPlayer}
        roundStartsAt={roundStartsAt}
        roundEndsAt={roundEndsAt}
        className="m-5"
      />
    </div>
  );
}
