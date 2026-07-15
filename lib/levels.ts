export const STARTING_KHWARZ = 10;
export const INITIAL_XP = 60; // mock placement assessment result, puts the student at Level 2

export const XP_PER_MARK = 10;

export const COSTS = {
  tip: 1,
  chat: 1,
  answer: 5,
} as const;

export const REWARDS = {
  full: 2,
  partial: 1,
} as const;

export type LevelInfo = {
  level: number;
  name: string;
  minXp: number;
};

export const LEVELS: LevelInfo[] = [
  { level: 1, name: "Novice", minXp: 0 },
  { level: 2, name: "Apprentice", minXp: 50 },
  { level: 3, name: "Practitioner", minXp: 120 },
  { level: 4, name: "Scholar", minXp: 220 },
  { level: 5, name: "Master", minXp: 360 },
];

export function levelForXp(xp: number): LevelInfo {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXp) current = l;
  }
  return current;
}

export function nextLevelFor(xp: number): LevelInfo | null {
  const current = levelForXp(xp);
  const next = LEVELS.find((l) => l.level === current.level + 1);
  return next ?? null;
}

/** Progress toward the next level as a fraction between 0 and 1. */
export function levelProgress(xp: number): number {
  const current = levelForXp(xp);
  const next = nextLevelFor(xp);
  if (!next) return 1;
  return Math.min(1, (xp - current.minXp) / (next.minXp - current.minXp));
}
