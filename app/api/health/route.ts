import { NextResponse } from "next/server";
import { OLLAMA_URL, OLLAMA_MODEL, OLLAMA_API_KEY } from "@/lib/ollama";

export const runtime = "nodejs";

/**
 * Diagnostic endpoint. Hits the configured Ollama host with a tiny prompt and
 * reports exactly what happened, without leaking the API key. Open /api/health
 * in a browser after deploying to confirm the Ollama connection works.
 */
export async function GET() {
  const info = {
    ollamaUrl: OLLAMA_URL,
    model: OLLAMA_MODEL,
    apiKeySet: Boolean(OLLAMA_API_KEY),
    reachable: false as boolean,
    httpStatus: null as number | null,
    ok: false as boolean,
    error: null as string | null,
    sample: null as string | null,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(OLLAMA_API_KEY ? { Authorization: `Bearer ${OLLAMA_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [{ role: "user", content: "Reply with the single word OK." }],
        stream: false,
      }),
      signal: controller.signal,
    });
    info.reachable = true;
    info.httpStatus = res.status;
    info.ok = res.ok;
    const text = await res.text();
    if (res.ok) {
      try {
        const parsed = JSON.parse(text) as { message?: { content?: string } };
        info.sample = parsed.message?.content?.slice(0, 200) ?? text.slice(0, 200);
      } catch {
        info.sample = text.slice(0, 200);
      }
    } else {
      // Surface the server's error body so a bad model name or auth is obvious.
      info.error = text.slice(0, 400);
    }
  } catch (err) {
    info.error = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  } finally {
    clearTimeout(timer);
  }

  return NextResponse.json(info, { status: info.ok ? 200 : 502 });
}
