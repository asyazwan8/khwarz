"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { INITIAL_XP, STARTING_KHWARZ, levelForXp, type LevelInfo } from "./levels";

export type HistoryEntry = {
  marks: number;
  maxMarks: number;
  revealed: boolean;
  completedAt: number;
};

type PlayerState = {
  khwarz: number;
  xp: number;
  history: Record<string, HistoryEntry>;
  revealed: Record<string, boolean>;
};

const DEFAULT_STATE: PlayerState = {
  khwarz: STARTING_KHWARZ,
  xp: INITIAL_XP,
  history: {},
  revealed: {},
};

const STORAGE_KEY = "khwarz-player-v1";

type Store = {
  state: PlayerState;
  ready: boolean;
  level: LevelInfo;
  pendingLevelUp: LevelInfo | null;
  dismissLevelUp: () => void;
  spendKhwarz: (amount: number) => boolean;
  earnKhwarz: (amount: number) => void;
  addXp: (amount: number) => void;
  markRevealed: (questionId: string) => void;
  recordResult: (questionId: string, marks: number, maxMarks: number) => void;
  resetProgress: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);
  const [pendingLevelUp, setPendingLevelUp] = useState<LevelInfo | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PlayerState>;
        setState({ ...DEFAULT_STATE, ...parsed });
      }
    } catch {
      // Corrupt storage, start fresh.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const spendKhwarz = useCallback(
    (amount: number): boolean => {
      if (state.khwarz < amount) return false;
      setState((s) => ({ ...s, khwarz: s.khwarz - amount }));
      return true;
    },
    [state.khwarz]
  );

  const earnKhwarz = useCallback((amount: number) => {
    if (amount <= 0) return;
    setState((s) => ({ ...s, khwarz: s.khwarz + amount }));
  }, []);

  const addXp = useCallback((amount: number) => {
    if (amount <= 0) return;
    setState((s) => {
      const before = levelForXp(s.xp);
      const after = levelForXp(s.xp + amount);
      if (after.level > before.level) setPendingLevelUp(after);
      return { ...s, xp: s.xp + amount };
    });
  }, []);

  const markRevealed = useCallback((questionId: string) => {
    setState((s) => ({ ...s, revealed: { ...s.revealed, [questionId]: true } }));
  }, []);

  const recordResult = useCallback((questionId: string, marks: number, maxMarks: number) => {
    setState((s) => ({
      ...s,
      history: {
        ...s.history,
        [questionId]: {
          marks,
          maxMarks,
          revealed: !!s.revealed[questionId],
          completedAt: Date.now(),
        },
      },
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setState(DEFAULT_STATE);
    setPendingLevelUp(null);
  }, []);

  const dismissLevelUp = useCallback(() => setPendingLevelUp(null), []);

  const store: Store = {
    state,
    ready,
    level: levelForXp(state.xp),
    pendingLevelUp,
    dismissLevelUp,
    spendKhwarz,
    earnKhwarz,
    addXp,
    markRevealed,
    recordResult,
    resetProgress,
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
