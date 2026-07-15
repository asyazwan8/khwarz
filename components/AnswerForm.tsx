"use client";

type Props = {
  working: string;
  finalAnswer: string;
  onWorkingChange: (v: string) => void;
  onFinalAnswerChange: (v: string) => void;
  onSubmit: () => void;
  submitting: boolean;
};

export default function AnswerForm({
  working,
  finalAnswer,
  onWorkingChange,
  onFinalAnswerChange,
  onSubmit,
  submitting,
}: Props) {
  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <label htmlFor="working" className="mb-1 block text-sm font-medium">
          Your working
          <span className="ml-2 text-xs font-normal text-[var(--muted)]">
            Show your formula, substitution and reasoning. Working earns marks, just like in SPM Paper 2.
          </span>
        </label>
        <textarea
          id="working"
          className="notion-input min-h-28 resize-y font-[ui-monospace,monospace] text-[13px]"
          placeholder={"Example:\nF = ma\nF = 2 x 3"}
          value={working}
          onChange={(e) => onWorkingChange(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div>
        <label htmlFor="final" className="mb-1 block text-sm font-medium">
          Final answer
          <span className="ml-2 text-xs font-normal text-[var(--muted)]">Include the unit.</span>
        </label>
        <input
          id="final"
          className="notion-input"
          placeholder="Example: 6 N"
          value={finalAnswer}
          onChange={(e) => onFinalAnswerChange(e.target.value)}
          disabled={submitting}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        className="notion-btn notion-btn-primary"
        disabled={submitting || finalAnswer.trim().length === 0}
      >
        {submitting ? "Marking your answer..." : "Submit for marking"}
      </button>
    </form>
  );
}
