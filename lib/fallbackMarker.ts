import type { Question } from "./questions";
import type { EvaluationResult } from "./types";

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function extractNumbers(text: string): number[] {
  const matches = text.match(/-?\d+(?:\.\d+)?/g);
  return matches ? matches.map(Number) : [];
}

function hasUnit(answer: string, unit: string, aliases?: string[]): boolean {
  const cleaned = answer.toLowerCase().replace(/\s+/g, "");
  const candidates = [unit, ...(aliases ?? [])].map((u) => u.toLowerCase().replace(/\s+/g, ""));
  return candidates.some((u) => u.length > 0 && cleaned.includes(u));
}

/**
 * Simple offline marker used when Ollama is unreachable. Numeric answers are
 * checked against the expected value and unit; working is scanned for the
 * keywords attached to each marking criterion.
 */
export function markOffline(question: Question, working: string, finalAnswer: string): EvaluationResult {
  const combined = normalize(`${working} ${finalAnswer}`);

  let numericCorrect = false;
  let unitCorrect = false;
  if (question.expected.type === "numeric") {
    const numbers = extractNumbers(finalAnswer);
    numericCorrect = numbers.some((n) => Math.abs(n - (question.expected as { value: number }).value) <= (question.expected as { tolerance: number }).tolerance);
    unitCorrect = hasUnit(finalAnswer, question.expected.unit, question.expected.unitAliases);
  }

  const criteria = question.markingScheme.map((c) => {
    if (c.id === "answer" && question.expected.type === "numeric") {
      let awarded = 0;
      let comment = "The final value does not match the expected answer.";
      if (numericCorrect && unitCorrect) {
        awarded = c.max;
        comment = "Correct value with the correct unit.";
      } else if (numericCorrect) {
        awarded = Math.max(c.max - 1, c.max > 1 ? c.max - 1 : 0);
        comment = "Correct value, but the unit is missing or wrong.";
      }
      return { id: c.id, name: c.name, awarded, max: c.max, comment };
    }

    const matched = (c.keywords ?? []).some((k) => combined.includes(k.toLowerCase()));
    return {
      id: c.id,
      name: c.name,
      awarded: matched ? c.max : 0,
      max: c.max,
      comment: matched ? "This step was found in your working." : "This step was not found in your working.",
    };
  });

  const total = criteria.reduce((sum, c) => sum + c.awarded, 0);
  const maxTotal = question.marks;

  return {
    criteria,
    total,
    maxTotal,
    feedback:
      total === maxTotal
        ? "Full marks. Your answer and working match the marking scheme."
        : "Marked offline with a basic checker. Show your formula, substitution and final answer with a unit to collect every mark.",
    fallback: true,
  };
}
