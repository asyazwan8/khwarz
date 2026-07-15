"use client";

import type { EvaluationResult } from "@/lib/types";

type Props = {
  result: EvaluationResult;
  reward: { khwarz: number; xp: number; revealed: boolean };
  onNext: () => void;
  hasNext: boolean;
};

export default function MarkingResult({ result, reward, onNext, hasNext }: Props) {
  const full = result.total === result.maxTotal;
  return (
    <div className="mt-4 rounded-md border border-[var(--border)] p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Marking scheme</h3>
        <span
          className="notion-tag"
          style={
            full
              ? { background: "var(--green-bg)", color: "var(--green-text)" }
              : result.total > 0
                ? { background: "var(--yellow-bg)", color: "var(--yellow-text)" }
                : { background: "var(--red-bg)", color: "var(--red-text)" }
          }
        >
          {result.total} / {result.maxTotal} marks
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {result.criteria.map((c) => (
          <li key={c.id} className="flex items-start gap-2.5 text-sm">
            <span aria-hidden className="mt-0.5">
              {c.awarded === c.max ? "✅" : c.awarded > 0 ? "🟡" : "❌"}
            </span>
            <div>
              <p className="font-medium">
                {c.name}
                <span className="ml-2 text-xs font-normal text-[var(--muted)]">
                  {c.awarded}/{c.max}
                </span>
              </p>
              <p className="text-xs text-[var(--muted)]">{c.comment}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="notion-callout mt-4">
        <span aria-hidden>🧑‍🏫</span>
        <p className="text-sm">{result.feedback}</p>
      </div>

      {result.fallback && (
        <p className="mt-3 text-xs text-[var(--faint)]">
          Marked offline with a basic checker because Ollama is not reachable. Start Ollama for full AI marking.
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">
          {reward.revealed
            ? "The answer was revealed for this question, so no rewards were given."
            : reward.khwarz > 0 || reward.xp > 0
              ? `You earned ${reward.xp} XP${reward.khwarz > 0 ? ` and ${reward.khwarz} khwarz ⚡` : ""}.`
              : "No marks this time. Try the next one, a tip only costs 1 khwarz."}
        </p>
        <button onClick={onNext} className="notion-btn notion-btn-primary">
          {hasNext ? "Next question" : "Finish"}
        </button>
      </div>
    </div>
  );
}
