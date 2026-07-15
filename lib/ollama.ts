// Strip any trailing slashes so `${OLLAMA_URL}/api/chat` never doubles up.
export const OLLAMA_URL = (process.env.OLLAMA_URL ?? "http://localhost:11434").replace(/\/+$/, "");
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "gemma3";
// Optional bearer token for hosted Ollama endpoints behind an auth proxy.
export const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY ?? "";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

/**
 * Call Ollama /api/chat. When `format` is "json" the full response is awaited
 * and returned as a string. Otherwise the raw streaming Response is returned
 * so the caller can pipe it through.
 */
export async function ollamaChat(messages: ChatMessage[], options?: { json?: boolean }): Promise<Response> {
  const controller = new AbortController();
  // Streaming replies only need the connection guarded; a non-streaming JSON
  // reply is generated in full before headers arrive, so give it much longer.
  const timer = setTimeout(() => controller.abort(), options?.json ? 120000 : 15000);
  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(OLLAMA_API_KEY ? { Authorization: `Bearer ${OLLAMA_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: !options?.json,
        ...(options?.json ? { format: "json" } : {}),
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Ollama responded with status ${res.status}`);
    }
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/** Convert an Ollama NDJSON chat stream into a plain text stream of tokens. */
export function ollamaTextStream(res: Response): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  return new ReadableStream({
    async start(controller) {
      const reader = res.body!.getReader();
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const parsed = JSON.parse(line) as { message?: { content?: string } };
              const token = parsed.message?.content;
              if (token) controller.enqueue(encoder.encode(token));
            } catch {
              // Skip malformed lines rather than breaking the stream.
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}
