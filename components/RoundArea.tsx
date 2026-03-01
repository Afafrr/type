"use client";
//mostly ai generated
import Countdown from "@/components/Countdown";
import TypingInput from "@/components/TypingInput";
import type { RoundInfo } from "@/lib/types";
import { useEffect, useState } from "react";

export type RoundAreaProps = {
  roundInfo: RoundInfo | null;
  userId: string;
  onRoundComplete?: () => void;
  className?: string;
};

export default function RoundArea({ roundInfo, userId, onRoundComplete, className }: RoundAreaProps) {
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [roundDuration, setRoundDuration] = useState(0);
  const [pendingDuration, setPendingDuration] = useState(0);
  const [pendingSentence, setPendingSentence] = useState("");
  const [activeSentence, setActiveSentence] = useState("");
  const [roundCompleted, setRoundCompleted] = useState(false);

  useEffect(() => {
    if (!roundInfo) {
      setCountdownSeconds(0);
      setRoundDuration(0);
      setPendingDuration(0);
      setPendingSentence("");
      setActiveSentence("");
      setRoundCompleted(false);
      return;
    }

    setRoundCompleted(false);
    setActiveSentence("");
    setPendingSentence(roundInfo.sentence);
    setCountdownSeconds(roundInfo.startsIn);
    setPendingDuration(roundInfo.duration);
    setRoundDuration(0);
  }, [roundInfo]);

  const finishRound = () => {
    if (roundCompleted) return;
    setRoundCompleted(true);
    setRoundDuration(0);
    setActiveSentence("");
    onRoundComplete?.();
  };

  return (
    <div className={className}>
      {countdownSeconds > 0 && (
        <Countdown
          durationSeconds={countdownSeconds}
          onComplete={() => {
            setActiveSentence(pendingSentence);
            setPendingSentence("");
            setCountdownSeconds(0);
            setRoundDuration(pendingDuration);
            setPendingDuration(0);
          }}
          className="text-2xl self-end mr-20"
        />
      )}
      {roundDuration > 0 && (
        <Countdown
          durationSeconds={roundDuration}
          onComplete={() => {
            finishRound();
          }}
          className="text-2xl self-end mr-20"
        />
      )}
      {<TypingInput sentence={activeSentence} userId={userId} sendProgress={() => {}} onComplete={finishRound} />}
    </div>
  );
}
