import { supabaseServer } from "@/lib/supabase-server";
import type {
  RoundInfo,
  RoundStartBroadcastMessage,
  RoundStartBroadcastPayload,
  StartRoundErrorResponse,
  StartRoundRequest,
} from "@/lib/types";
import { NextResponse } from "next/server";

//sec
const ROUND_STARTS_IN = 3;
const ROUND_DURATION = 30;
const ROUND_SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "Sphinx of black quartz, judge my vow.",
  "Crazy Fredrick bought many very exquisite opal jewels.",
];

const pickSentence = (round: number) => ROUND_SENTENCES[round % ROUND_SENTENCES.length];

export async function POST(req: Request) {
  const obj: RoundInfo = {
    startsIn: ROUND_STARTS_IN,
    duration: ROUND_DURATION,
    sentence: pickSentence(Date.now()),
  };
  const body = (await req.json()) as StartRoundRequest;

  if (body.type === "startRound") {
    const startAt = Date.now() + ROUND_STARTS_IN * 1000;

    const payload: RoundStartBroadcastPayload = {
      roundId: String(startAt),
      sentence: obj.sentence,
      startsIn: ROUND_STARTS_IN,
      duration: ROUND_DURATION,
    };

    const message: RoundStartBroadcastMessage = {
      type: "broadcast",
      event: "round_start",
      payload,
    };

    await supabaseServer.channel(body.channelName).send(message);

    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json<StartRoundErrorResponse>({ error: "Invalid request" }, { status: 400 });
}
