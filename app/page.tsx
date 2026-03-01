"use client";

import ActiveUsers from "@/components/ActiveUsers";
import NamePrompt from "@/components/NamePrompt";
import { supabase } from "@/lib/supabase";
import { useMemo, useState } from "react";

export default function Home() {
  const [playerName, setPlayerName] = useState("");

  const usersChannel = useMemo(() => {
    if (!playerName) return null;
    return supabase.channel("game:1:users", {
      config: { presence: { key: playerName } },
    });
  }, [playerName]);

  return (
    <div>
      <NamePrompt isOpen={!playerName} onSubmitName={setPlayerName} />
      <ActiveUsers channel={usersChannel} userId={playerName} />
    </div>
  );
}
