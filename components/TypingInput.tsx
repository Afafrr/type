"use client";
// AI generated component
import { useEffect, useState } from "react";

export type TypingInputProps = {
  sentence: string;
  sendProgress: (progress: string) => void;
  onComplete?: () => void;
};

export default function TypingInput({ sentence, sendProgress, onComplete }: TypingInputProps) {
  const [input, setInput] = useState("");
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    setInput("");
    setHasCompleted(false);
  }, [sentence]);

  // Helper to compare input and sentence
  const getHighlighted = () => {
    return sentence.split("").map((char, idx) => {
      if (input[idx] === undefined)
        return <span key={idx}>{char === " " ? <span className="inline-block w-3">&nbsp;</span> : char}</span>;
      if (input[idx] === char) {
        return (
          <span key={idx} className={char === " " ? "bg-green-200" : "text-green-600 font-bold"}>
            {char === " " ? <span className="inline-block w-3">&nbsp;</span> : char}
          </span>
        );
      } else {
        return (
          <span key={idx} className={char === " " ? "bg-red-200" : "text-red-500 font-bold"}>
            {char === " " ? <span className="inline-block w-3">&nbsp;</span> : char}
          </span>
        );
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    sendProgress(value);
    if (!hasCompleted && sentence.length > 0 && value === sentence) {
      setHasCompleted(true);
      onComplete?.();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <div className="mb-2 min-h-[2.5em] text-lg font-mono break-all">{getHighlighted()}</div>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        className="w-full p-2 border rounded font-mono text-lg"
        placeholder="Type the sentence..."
        autoFocus
      />
    </div>
  );
}
