"use client";

import { useStore } from "@/lib/store";
import { nextLevelFor, levelProgress } from "@/lib/levels";

export default function LevelCard() {
  const { state, level, ready } = useStore();
  if (!ready) {
    return <div className="h-32 rounded-md border border-[var(--border)]" />;
  }

  const next = nextLevelFor(state.xp);
  const progress = levelProgress(state.xp);

  return (
    <div className="rounded-md border border-[var(--border)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[var(--faint)] uppercase">My level</p>
          <p className="mt-1 text-2xl font-bold">
            Level {level.level} · {level.name}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Based on your placement assessment and practice so far.
          </p>
        </div>
        <span className="text-3xl" aria-hidden>
          🎯
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <span>{state.xp} XP</span>
          <span>
            {next ? `${next.minXp - state.xp} XP to Level ${next.level}, ${next.name}` : "Max level reached"}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--gray-bg)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
