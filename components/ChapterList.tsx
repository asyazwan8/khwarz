"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { QUESTIONS } from "@/lib/questions";

const LOCKED = [
  { icon: "💪", label: "Forces and Pressure" },
  { icon: "🌡️", label: "Heat" },
  { icon: "🌊", label: "Waves" },
  { icon: "💡", label: "Light and Optics" },
  { icon: "🔌", label: "Electricity" },
  { icon: "🧲", label: "Electromagnetism" },
  { icon: "☢️", label: "Radioactivity" },
];

export default function ChapterList() {
  const { state, ready } = useStore();
  const done = ready ? Object.keys(state.history).length : 0;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-1.5 text-xs font-medium text-[var(--faint)]">
        <span>Chapter</span>
        <span>Status</span>
      </div>

      <Link
        href="/practice"
        className="notion-hover -mx-1 flex items-center gap-3 border-b border-[var(--border)] px-1 py-2.5"
      >
        <span className="text-lg" aria-hidden>
          🚀
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">Force and Motion</p>
          <p className="text-xs text-[var(--muted)]">
            {done} of {QUESTIONS.length} questions completed
          </p>
        </div>
        <span className="notion-tag bg-[var(--green-bg)] text-[var(--green-text)]">Open</span>
      </Link>

      {LOCKED.map((c) => (
        <div
          key={c.label}
          className="-mx-1 flex cursor-not-allowed items-center gap-3 border-b border-[var(--border)] px-1 py-2.5 opacity-60"
          title="Locked in this demo"
        >
          <span className="text-lg" aria-hidden>
            {c.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{c.label}</p>
            <p className="text-xs text-[var(--muted)]">Coming soon</p>
          </div>
          <span className="notion-tag bg-[var(--gray-bg)] text-[var(--gray-text)]">Demo 🔒</span>
        </div>
      ))}
    </div>
  );
}
