"use client";

import ActiveUsers from "@/components/ActiveUsers";
import NamePrompt from "@/components/NamePrompt";
import RoundArea from "@/components/RoundArea";
import StartBtn from "@/components/StartBtn";
import type { RoundInfo } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const CHANNEL_NAME = "game:1:messages";
  const [playerName, setPlayerName] = useState("");
  const [roundInfo, setRoundInfo] = useState<RoundInfo | null>(null);

  // Create a Supabase channel for presence tracking
  const usersChannel = useMemo(() => {
    if (!playerName) return null;
    return supabase.channel(CHANNEL_NAME, {
      config: { presence: { key: playerName } },
    });
  }, [playerName]);

  // Listen for round start events
  useEffect(() => {
    usersChannel?.on<RoundInfo>("broadcast", { event: "round_start" }, ({ payload }) => {
      console.log(payload);
      setRoundInfo(payload);
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
      <RoundArea roundInfo={roundInfo} userId={playerName} className="m-5 flex flex-col" />
    </div>
  );
}
