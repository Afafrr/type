"use client";
//AI generated component
import { useState } from "react";

type NamePromptProps = {
  isOpen: boolean;
  onSubmitName: (name: string) => void;
};

export default function NamePrompt({ isOpen, onSubmitName }: NamePromptProps) {
  const [nameInput, setNameInput] = useState("");
  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    onSubmitName(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-bold">Enter your name</h2>
        <p className="mt-1 text-sm text-gray-600">This will be shown to other players.</p>
        <input
          type="text"
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value)}
          className="mt-4 w-full rounded border p-2"
          placeholder="Your name"
          autoFocus
        />
        <button
          type="submit"
          className="mt-4 w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-500"
        >
          Join Game
        </button>
      </form>
    </div>
  );
}
