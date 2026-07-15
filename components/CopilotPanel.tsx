"use client";

import { useEffect, useRef, useState } from "react";
import type { Question } from "@/lib/questions";
import type { CopilotMode } from "@/lib/types";
import { COSTS } from "@/lib/levels";
import { useStore } from "@/lib/store";

type Message = { role: "user" | "assistant"; content: string };

type Props = {
  question: Question;
  revealed: boolean;
  onRevealed: () => void;
};

export default function CopilotPanel({ question, revealed, onRevealed }: Props) {
  const { state, spendKhwarz } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [question.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function ask(mode: CopilotMode, text?: string) {
    if (busy) return;
    const cost = COSTS[mode];
    if (!spendKhwarz(cost)) return;

    const userLabel =
      mode === "tip" ? "Give me a tip" : mode === "answer" ? "Reveal the answer" : (text ?? "");
    setMessages((m) => [...m, { role: "user", content: userLabel }, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, questionId: question.id, userMessage: text }),
      });
      if (!res.ok || !res.body) throw new Error("Copilot request failed");

      if (mode === "answer") onRevealed();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const token = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + token };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Something went wrong while contacting the copilot. Please try again.",
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  const canAfford = (cost: number) => state.khwarz >= cost;
  const insufficient = "Not enough khwarz. Earn 2 khwarz for every fully correct answer.";

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col border-l border-[var(--border)] bg-white">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
        <span aria-hidden>✨</span>
        <span className="text-sm font-semibold">Khwarz Copilot</span>
        <span className="ml-auto notion-tag bg-[var(--gray-bg)] text-[var(--gray-text)]">⚡ {state.khwarz}</span>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="rounded-md bg-[var(--callout)] px-3 py-3 text-xs text-[var(--muted)]">
            Stuck on this question? Ask for a tip, ask your own question, or reveal the full answer. Each action
            spends khwarz, and revealed questions earn no rewards.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-lg bg-[var(--accent)] px-3 py-2 text-sm text-white"
                  : "max-w-[95%] rounded-lg bg-[var(--callout)] px-3 py-2 text-sm whitespace-pre-wrap"
              }
            >
              {m.content || <span className="khwarz-cursor" />}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            className="notion-btn notion-btn-secondary text-xs"
            onClick={() => ask("tip")}
            disabled={busy || !canAfford(COSTS.tip)}
            title={!canAfford(COSTS.tip) ? insufficient : "A guiding hint that never spoils the answer"}
          >
            💡 Tip · 1 ⚡
          </button>
          <button
            className="notion-btn notion-btn-secondary text-xs"
            onClick={() => ask("answer")}
            disabled={busy || revealed || !canAfford(COSTS.answer)}
            title={
              revealed
                ? "Already revealed for this question"
                : !canAfford(COSTS.answer)
                  ? insufficient
                  : "Full worked solution. Revealed questions earn no rewards."
            }
          >
            🔓 Reveal answer · 5 ⚡
          </button>
        </div>

        <form
          className="mt-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const text = input.trim();
            if (!text) return;
            setInput("");
            ask("chat", text);
          }}
        >
          <input
            className="notion-input flex-1"
            placeholder="Ask about this question · 1 ⚡"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy || !canAfford(COSTS.chat)}
            title={!canAfford(COSTS.chat) ? insufficient : undefined}
          />
          <button
            type="submit"
            className="notion-btn notion-btn-primary"
            disabled={busy || input.trim().length === 0 || !canAfford(COSTS.chat)}
            aria-label="Send"
          >
            ↑
          </button>
        </form>
      </div>
    </aside>
  );
}
