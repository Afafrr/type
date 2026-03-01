"use client";
//ai generated component
import { useEffect, useState } from "react";

export type CountdownProps = {
  durationSeconds: number;
  onComplete?: () => void;
  className?: string;
};

export default function Countdown({ durationSeconds, onComplete, className }: CountdownProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(Math.max(0, Math.ceil(durationSeconds)));

  useEffect(() => {
    const totalSeconds = Math.max(0, Math.ceil(durationSeconds));
    setRemainingSeconds(totalSeconds);

    if (totalSeconds === 0) {
      onComplete?.();
      return;
    }

    const endAt = Date.now() + totalSeconds * 1000;
    const intervalId = setInterval(() => {
      const secondsLeft = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemainingSeconds(secondsLeft);
      if (secondsLeft === 0) {
        clearInterval(intervalId);
        onComplete?.();
      }
    }, 250);

    return () => clearInterval(intervalId);
  }, [durationSeconds, onComplete]);

  return <span className={className}>{remainingSeconds}</span>;
}
