"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import KhwarzChip from "./KhwarzChip";
import { useStore } from "@/lib/store";

export default function TopBar() {
  const pathname = usePathname();
  const { level, ready } = useStore();

  const crumbs =
    pathname === "/practice"
      ? [
          { label: "Home", href: "/" },
          { label: "Force and Motion", href: "/practice" },
          { label: "Practice", href: null },
        ]
      : [{ label: "Home", href: null }];

  return (
    <header className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
      <nav className="flex items-center gap-1 text-sm">
        {crumbs.map((c, i) => (
          <span key={c.label} className="flex items-center gap-1">
            {i > 0 && <span className="text-[var(--faint)]">/</span>}
            {c.href ? (
              <Link href={c.href} className="notion-hover px-1.5 py-0.5 text-[var(--muted)]">
                {c.label}
              </Link>
            ) : (
              <span className="px-1.5 py-0.5">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <span className="notion-tag bg-[var(--blue-bg)] text-[var(--blue-text)]">
          Lv {ready ? level.level : "-"} · {ready ? level.name : "..."}
        </span>
        <KhwarzChip />
      </div>
    </header>
  );
}
