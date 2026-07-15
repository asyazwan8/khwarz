import type { Question } from "@/lib/questions";

const DIFFICULTY: Record<number, { label: string; bg: string; text: string }> = {
  1: { label: "Easy", bg: "var(--green-bg)", text: "var(--green-text)" },
  2: { label: "Medium", bg: "var(--yellow-bg)", text: "var(--yellow-text)" },
  3: { label: "Hard", bg: "var(--red-bg)", text: "var(--red-text)" },
};

export default function QuestionCard({ question }: { question: Question }) {
  const diff = DIFFICULTY[question.difficulty];
  return (
    <div className="rounded-md border border-[var(--border)] p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="notion-tag bg-[var(--gray-bg)] text-[var(--gray-text)]">{question.topic}</span>
        <span className="notion-tag" style={{ background: diff.bg, color: diff.text }}>
          {diff.label}
        </span>
        <span className="ml-auto text-xs font-medium text-[var(--muted)]">
          [{question.marks} mark{question.marks > 1 ? "s" : ""}]
        </span>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed">{question.text}</p>

      {question.given && question.given.length > 0 && (
        <div className="mt-4 rounded-md bg-[var(--callout)] px-4 py-3">
          <p className="text-xs font-semibold text-[var(--faint)] uppercase">Given</p>
          <ul className="mt-1 space-y-0.5 text-sm">
            {question.given.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
