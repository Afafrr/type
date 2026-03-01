export type LeaderboardRow = {
  playerId: string;
  typed: string;
  typedCount: number;
  progressPct: number;
  accuracyPct: number;
  wpm: number;
  isComplete: boolean;
};

type BuildLeaderboardRowsParams = {
  progressByPlayer: Record<string, string>;
  sentence: string;
  now: number;
  roundStartsAt: number | null;
  roundEndsAt: number | null;
};

export function buildLeaderboardRows({
  progressByPlayer,
  sentence,
  now,
  roundStartsAt,
  roundEndsAt,
}: BuildLeaderboardRowsParams): LeaderboardRow[] {
  const sentenceLength = sentence.length;
  const effectiveNow = roundEndsAt ? Math.min(now, roundEndsAt) : now;
  const elapsedMinutes = roundStartsAt ? Math.max(0, (effectiveNow - roundStartsAt) / 60000) : 0;

  return Object.entries(progressByPlayer).map(([playerId, typed]) => {
    const typedCount = typed.length;
    const progressPct = sentenceLength > 0 ? Math.min(100, (typedCount / sentenceLength) * 100) : 0;
    let correctChars = 0;
    
    for (let i = 0; i < typedCount && i < sentenceLength; i += 1) {
      if (typed[i] === sentence[i]) correctChars += 1;
    }
    const accuracyPct = typedCount > 0 ? (correctChars / typedCount) * 100 : 0;
    const wpm = elapsedMinutes > 0 ? correctChars / 5 / elapsedMinutes : 0;

    return {
      playerId,
      typed,
      typedCount,
      progressPct,
      accuracyPct,
      wpm,
      isComplete: sentenceLength > 0 && typedCount >= sentenceLength,
    };
  });
}
