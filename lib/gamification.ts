export const POINTS = {
  sessionComplete: 20,
  dailyLog: 10,
  streak3Bonus: 30,
  streak7Bonus: 100
} as const;

export function calculateLevel(points: number): number {
  if (points >= 700) return 4;
  if (points >= 300) return 3;
  if (points >= 100) return 2;
  return 1;
}
