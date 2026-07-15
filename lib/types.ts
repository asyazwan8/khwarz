export type MarkedCriterion = {
  id: string;
  name: string;
  awarded: number;
  max: number;
  comment: string;
};

export type EvaluationResult = {
  criteria: MarkedCriterion[];
  total: number;
  maxTotal: number;
  feedback: string;
  /** True when the offline marker was used because Ollama was unreachable. */
  fallback: boolean;
};

export type CopilotMode = "tip" | "answer" | "chat";
