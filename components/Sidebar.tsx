"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useStore } from "@/lib/store";
import { QUESTIONS } from "@/lib/questions";

const NAV = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/practice", icon: "✏️", label: "Practice" },
];

const LOCKED_CHAPTERS = [
  { icon: "🌡️", label: "Heat" },
  { icon: "🌊", label: "Waves" },
  { icon: "💡", label: "Light and Optics" },
  { icon: "🔌", label: "Electricity" },
  { icon: "🧲", label: "Electromagnetism" },
  { icon: "☢️", label: "Radioactivity" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state, ready } = useStore();
  const done = ready ? Object.keys(state.history).length : 0;

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--sidebar)]">
      <div className="flex items-center gap-2 px-3 py-3">
        <Logo />
        <span className="text-sm font-semibold">Khwarz</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`notion-hover flex items-center gap-2 px-2 py-1 text-sm font-medium ${
                active ? "bg-[var(--hover)] text-[var(--text)]" : "text-[var(--muted)]"
              }`}
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        <p className="mt-5 mb-1 px-2 text-xs font-semibold text-[var(--faint)]">SPM Physics chapters</p>

        <Link
          href="/practice"
          className={`notion-hover flex items-center gap-2 px-2 py-1 text-sm font-medium ${
            pathname === "/practice" ? "text-[var(--text)]" : "text-[var(--muted)]"
          }`}
        >
          <span className="w-5 text-center">🚀</span>
          <span className="flex-1 truncate">Force and Motion</span>
          <span className="text-xs text-[var(--faint)]">
            {done}/{QUESTIONS.length}
          </span>
        </Link>

        {LOCKED_CHAPTERS.map((c) => (
          <div
            key={c.label}
            className="flex cursor-not-allowed items-center gap-2 px-2 py-1 text-sm font-medium text-[var(--faint)]"
            title="Locked in this demo"
          >
            <span className="w-5 text-center opacity-60">{c.icon}</span>
            <span className="flex-1 truncate">{c.label}</span>
            <span className="text-xs">🔒</span>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--faint)]">
        Demo build. Progress is saved in this browser.
      </div>
    </aside>
  );
}
