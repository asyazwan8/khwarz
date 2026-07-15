"use client";

import { useEffect, useState } from "react";
import { QUESTIONS, getQuestion, type Question } from "@/lib/questions";
import { REWARDS, XP_PER_MARK } from "@/lib/levels";
import { useStore } from "@/lib/store";
import type { EvaluationResult } from "@/lib/types";
import QuestionCard from "@/components/QuestionCard";
import AnswerForm from "@/components/AnswerForm";
import MarkingResult from "@/components/MarkingResult";
import CopilotPanel from "@/components/CopilotPanel";

function pickNext(history: Record<string, unknown>, level: number): Question | null {
  const remaining = QUESTIONS.filter((q) => !history[q.id]);
  if (remaining.length === 0) return null;
  // Serve questions at the student's level first, easier ones as backfill,
  // and harder ones only when nothing else is left.
  const cap = Math.min(3, Math.max(1, level - 1));
  const score = (q: Question) => (q.difficulty > cap ? 10 + q.difficulty : cap - q.difficulty);
  return [...remaining].sort((a, b) => score(a) - score(b) || a.id.localeCompare(b.id))[0];
}

export default function PracticePage() {
  const { state, ready, level, addXp, earnKhwarz, markRevealed, recordResult, resetProgress } = useStore();

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [working, setWorking] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [reward, setReward] = useState({ khwarz: 0, xp: 0, revealed: false });
  const [error, setError] = useState<string | null>(null);
  const [showCopilot, setShowCopilot] = useState(true);

  useEffect(() => {
    if (ready && currentId === null && result === null) {
      const q = pickNext(state.history, level.level);
      if (q) setCurrentId(q.id);
    }
  }, [ready, currentId, result, state.history, level.level]);

  const question = currentId ? getQuestion(currentId) : undefined;
  const doneCount = Object.keys(state.history).length;
  const remainingCount = QUESTIONS.filter((q) => !state.history[q.id]).length;

  async function submit() {
    if (!question || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, working, finalAnswer }),
      });
      if (!res.ok) throw new Error("Evaluation failed");
      const data = (await res.json()) as EvaluationResult;

      const wasRevealed = !!state.revealed[question.id];
      let khwarzReward = 0;
      let xpReward = 0;
      if (!wasRevealed) {
        xpReward = data.total * XP_PER_MARK;
        if (data.total === data.maxTotal) khwarzReward = REWARDS.full;
        else if (data.total >= data.maxTotal / 2) khwarzReward = REWARDS.partial;
      }

      recordResult(question.id, data.total, data.maxTotal);
      if (xpReward > 0) addXp(xpReward);
      if (khwarzReward > 0) earnKhwarz(khwarzReward);

      setReward({ khwarz: khwarzReward, xp: xpReward, revealed: wasRevealed });
      setResult(data);
    } catch {
      setError("Could not mark your answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    setResult(null);
    setWorking("");
    setFinalAnswer("");
    setError(null);
    const q = pickNext(state.history, level.level);
    setCurrentId(q ? q.id : null);
  }

  if (!ready) {
    return <div className="p-12 text-sm text-[var(--muted)]">Loading your progress...</div>;
  }

  if (!question) {
    return (
      <div className="mx-auto max-w-[720px] px-8 pt-16 sm:px-12">
        <div className="text-5xl" aria-hidden>
          🎓
        </div>
        <h1 className="mt-3 text-3xl font-bold">Chapter complete</h1>
        <p className="mt-2 text-[var(--muted)]">
          You have answered every Force and Motion question in this demo. Other chapters are locked, but you can reset
          and practice this chapter again.
        </p>
        <button
          onClick={() => {
            resetProgress();
            setCurrentId(null);
            setResult(null);
            setWorking("");
            setFinalAnswer("");
          }}
          className="notion-btn notion-btn-primary mt-6"
        >
          Reset progress and practice again
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[720px] px-8 pt-10 pb-24 sm:px-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Force and Motion</h1>
              <p className="mt-0.5 text-sm text-[var(--muted)]">
                Question {Math.min(result ? doneCount : doneCount + 1, QUESTIONS.length)} of {QUESTIONS.length} · type your answer like an
                SPM Paper 2 question
              </p>
            </div>
            <button
              className="notion-btn notion-btn-secondary"
              onClick={() => setShowCopilot((v) => !v)}
              aria-pressed={showCopilot}
            >
              ✨ Copilot
            </button>
          </div>

          <div className="mt-5">
            <QuestionCard question={question} />
          </div>

          {result === null ? (
            <AnswerForm
              working={working}
              finalAnswer={finalAnswer}
              onWorkingChange={setWorking}
              onFinalAnswerChange={setFinalAnswer}
              onSubmit={submit}
              submitting={submitting}
            />
          ) : (
            <MarkingResult result={result} reward={reward} onNext={next} hasNext={remainingCount > 0} />
          )}

          {error && <p className="mt-3 text-sm text-[#eb5757]">{error}</p>}
        </div>
      </div>

      {showCopilot && (
        <CopilotPanel
          question={question}
          revealed={!!state.revealed[question.id]}
          onRevealed={() => markRevealed(question.id)}
        />
      )}
    </div>
  );
}
