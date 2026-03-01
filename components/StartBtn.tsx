"use client";
//AI generated component
import type { StartRoundRequest, StartRoundResponse } from "@/lib/types";

export default function StartBtn({
  onResponse,
  channelName,
}: {
  onResponse?: (response: StartRoundResponse) => void;
  channelName: string;
}) {
  const handleClick = async () => {
    try {
      const payload: StartRoundRequest = { type: "startRound", channelName };
      const res = await fetch("/api/round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as StartRoundResponse;
      if (onResponse) onResponse(data);
    } catch (error) {
      if (onResponse) onResponse({ error: "Failed to send round request" });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-3 bg-blue-500 text-white rounded-lg font-bold text-base shadow hover:bg-cyan-400 transition-colors duration-200 cursor-pointer"
    >
      Start Round
    </button>
  );
}
