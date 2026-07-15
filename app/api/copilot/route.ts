import { NextRequest, NextResponse } from "next/server";
import { getQuestion } from "@/lib/questions";
import { ollamaChat, ollamaTextStream } from "@/lib/ollama";
import type { CopilotMode } from "@/lib/types";

export const runtime = "nodejs";

type CopilotBody = {
  mode?: CopilotMode;
  questionId?: string;
  userMessage?: string;
};

const MODE_RULES: Record<CopilotMode, string> = {
  tip: [
    "The student asked for a TIP.",
    "Give one short, guiding hint of at most three sentences.",
    "NEVER state the final answer, the final numeric value, or the full method.",
    "Point them to the right concept or formula and let them do the work.",
  ].join(" "),
  answer: [
    "The student paid to REVEAL the full answer.",
    "Give the complete worked solution step by step: formula, substitution, and the final answer with its unit.",
    "Keep it compact and clear, like a marking scheme model answer.",
  ].join(" "),
  chat: [
    "The student asked a QUESTION about the problem.",
    "Answer their question helpfully in at most four sentences.",
    "NEVER state the final answer or the final numeric value unless they have already found it themselves.",
  ].join(" "),
};

export async function POST(req: NextRequest) {
  let body: CopilotBody;
  try {
    body = (await req.json()) as CopilotBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const mode: CopilotMode = body.mode === "answer" || body.mode === "chat" ? body.mode : "tip";
  const question = body.questionId ? getQuestion(body.questionId) : undefined;
  if (!question) {
    return NextResponse.json({ error: "Unknown questionId" }, { status: 400 });
  }
  const userMessage = (body.userMessage ?? "").slice(0, 1000);

  const system = [
    "You are Khwarz Copilot, a friendly physics practice assistant for Malaysian SPM students.",
    "You are helping with this Force and Motion question:",
    `Question: ${question.text}`,
    question.given?.length ? `Given: ${question.given.join("; ")}` : "",
    `Model answer (for your reference only): ${question.modelAnswer}`,
    "",
    MODE_RULES[mode],
    "Use plain English suitable for a 17 year old. Do not use markdown headings.",
  ]
    .filter(Boolean)
    .join("\n");

  const userContent =
    mode === "chat" && userMessage
      ? userMessage
      : mode === "answer"
        ? "Please show me the full worked solution."
        : "Please give me a tip for this question.";

  try {
    const res = await ollamaChat([
      { role: "system", content: system },
      { role: "user", content: userContent },
    ]);
    return new Response(ollamaTextStream(res), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("copilot: Ollama call failed, serving fallback:", err);
    // Ollama unreachable: serve the built-in fallback so the demo keeps working.
    const fallback =
      mode === "answer"
        ? question.modelAnswer
        : mode === "tip"
          ? question.fallbackHint
          : `I cannot reach the AI model right now, but here is a built-in hint: ${question.fallbackHint}`;
    const note = "\n\n(Offline mode: start Ollama to get live AI replies.)";
    return new Response(fallback + note, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Khwarz-Fallback": "1",
      },
    });
  }
}
