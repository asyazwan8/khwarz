import { NextRequest, NextResponse } from "next/server";
import { getQuestion } from "@/lib/questions";
import { markOffline } from "@/lib/fallbackMarker";
import { ollamaChat } from "@/lib/ollama";
import type { EvaluationResult, MarkedCriterion } from "@/lib/types";

export const runtime = "nodejs";

type EvaluateBody = {
  questionId?: string;
  working?: string;
  finalAnswer?: string;
};

export async function POST(req: NextRequest) {
  let body: EvaluateBody;
  try {
    body = (await req.json()) as EvaluateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const question = body.questionId ? getQuestion(body.questionId) : undefined;
  if (!question) {
    return NextResponse.json({ error: "Unknown questionId" }, { status: 400 });
  }
  const working = (body.working ?? "").slice(0, 4000);
  const finalAnswer = (body.finalAnswer ?? "").slice(0, 500);

  try {
    const schemeText = question.markingScheme
      .map((c) => `- id "${c.id}": ${c.name} (${c.max} mark${c.max > 1 ? "s" : ""})`)
      .join("\n");

    const system = [
      "You are a strict but fair SPM Physics examiner in Malaysia marking a student's answer to a subjective question.",
      "Award marks only when the student's working or final answer genuinely shows the step described by each criterion.",
      "Award partial credit per criterion where the scheme allows more than 1 mark.",
      "A correct final value without a unit loses 1 mark on the final answer criterion.",
      "Reply ONLY with JSON in exactly this shape:",
      '{"criteria":[{"id":"<criterion id>","awarded":<number>,"comment":"<one short sentence>"}],"feedback":"<two or three encouraging sentences of feedback for the student>"}',
      "Include every criterion id exactly once. Do not add any other keys.",
    ].join("\n");

    const user = [
      `Question: ${question.text}`,
      question.given?.length ? `Given: ${question.given.join("; ")}` : "",
      `Model answer: ${question.modelAnswer}`,
      `Marking scheme:\n${schemeText}`,
      "",
      `Student's working: ${working || "(none provided)"}`,
      `Student's final answer: ${finalAnswer || "(none provided)"}`,
    ]
      .filter(Boolean)
      .join("\n");

    const res = await ollamaChat(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { json: true }
    );

    const data = (await res.json()) as { message?: { content?: string } };
    const content = data.message?.content ?? "";
    const parsed = JSON.parse(content) as {
      criteria?: { id?: string; awarded?: number; comment?: string }[];
      feedback?: string;
    };

    const criteria: MarkedCriterion[] = question.markingScheme.map((c) => {
      const found = parsed.criteria?.find((p) => p.id === c.id);
      const awardedRaw = typeof found?.awarded === "number" ? found.awarded : 0;
      const awarded = Math.max(0, Math.min(c.max, Math.round(awardedRaw)));
      return {
        id: c.id,
        name: c.name,
        awarded,
        max: c.max,
        comment: found?.comment?.slice(0, 300) || (awarded === c.max ? "Awarded." : "Not shown in your answer."),
      };
    });

    const total = criteria.reduce((sum, c) => sum + c.awarded, 0);
    const result: EvaluationResult = {
      criteria,
      total,
      maxTotal: question.marks,
      feedback: (parsed.feedback ?? "").slice(0, 800) || "Marked by AI examiner.",
      fallback: false,
    };
    return NextResponse.json(result);
  } catch (err) {
    console.error("evaluate: Ollama marking failed, marking offline:", err);
    // Ollama unreachable or returned something unusable: mark offline instead.
    return NextResponse.json(markOffline(question, working, finalAnswer));
  }
}
