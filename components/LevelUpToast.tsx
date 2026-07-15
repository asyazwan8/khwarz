"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function LevelUpToast() {
  const { pendingLevelUp, dismissLevelUp } = useStore();

  useEffect(() => {
    if (!pendingLevelUp) return;
    const t = setTimeout(dismissLevelUp, 6000);
    return () => clearTimeout(t);
  }, [pendingLevelUp, dismissLevelUp]);

  if (!pendingLevelUp) return null;

  return (
    <div className="khwarz-toast fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-lg bg-[#0f0f0f] px-4 py-3 text-sm text-white shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <span aria-hidden>🎉</span>
        <span>
          Level up! You are now Level {pendingLevelUp.level}, {pendingLevelUp.name}.
        </span>
        <button
          onClick={dismissLevelUp}
          className="ml-2 rounded px-1.5 text-[#9b9a97] hover:bg-white/10 hover:text-white"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
