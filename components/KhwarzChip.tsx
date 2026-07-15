"use client";

import { useStore } from "@/lib/store";

export default function KhwarzChip() {
  const { state, ready } = useStore();
  return (
    <span
      className="notion-tag gap-1 bg-[var(--gray-bg)] text-[var(--gray-text)]"
      title="Khwarz is your question currency. A tip costs 1, a revealed answer costs 5, and a correct answer earns 2."
    >
      <span aria-hidden>⚡</span>
      {ready ? state.khwarz : "-"} khwarz
    </span>
  );
}
