# Khwarz

A Khanmigo-style practice question bank demo for Malaysia SPM Physics, built with Next.js and styled like Notion.

Khwarz is not a tutor. It is a question bank where students keep practicing. The demo covers one chapter, Force and Motion, with SPM Paper 2 style subjective questions: the student types their working and final answer, and an AI examiner marks it against a real marking scheme.

## Features

- **Assessment layer (stubbed).** The dashboard shows your current level from a mock placement assessment.
- **Subjective questions with AI marking.** Type your working and final answer. A local Gemma model marks it criterion by criterion, like an SPM examiner. Showing your working earns method marks.
- **Khwarz currency.** You start with 10 khwarz. A copilot tip or question costs 1, revealing the full answer costs 5, and a fully correct answer earns 2 back. Partially correct answers earn 1.
- **Level system.** Marks convert to XP (10 XP per mark). Levels: Novice, Apprentice, Practitioner, Scholar, Master. Harder questions unlock as you level up.
- **Copilot panel.** A Notion AI style side panel to ask for tips, ask your own questions, or reveal the worked solution. Revealed questions earn no rewards.
- **Offline fallback.** If Ollama is not running, marking falls back to a built-in checker and the copilot serves built-in hints, so the demo never breaks.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install [Ollama](https://ollama.com) and pull a Gemma model:

   ```bash
   ollama pull gemma3
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Configuration

| Environment variable | Default                  | Purpose                                                     |
| -------------------- | ------------------------ | ----------------------------------------------------------- |
| `OLLAMA_URL`         | `http://localhost:11434` | Ollama server root, no trailing `/api/chat` and no trailing slash |
| `OLLAMA_MODEL`       | `gemma3`                 | Model used for marking and the copilot                      |
| `OLLAMA_API_KEY`     | (empty)                  | Optional bearer token sent as `Authorization: Bearer` if your Ollama sits behind an auth proxy |

Set `OLLAMA_URL` to the server root only (the app appends `/api/chat` itself), for example `https://ollama.example.com`. A trailing slash is trimmed automatically. Leave `OLLAMA_API_KEY` unset when the endpoint needs no auth.

### Deploying on Vercel

Vercel functions cannot reach `localhost`, so point `OLLAMA_URL` at a publicly reachable Ollama host. In the Vercel project, open Settings, Environment Variables and add `OLLAMA_URL` (and `OLLAMA_API_KEY` if required), then redeploy. Without a reachable host the app still runs fully through the built-in offline marker and hints.

Progress (khwarz, XP, answered questions) is stored in the browser's localStorage. Use the reset button on the chapter complete screen to start over, or clear site data.

## Project layout

- `app/` pages, layout and API routes (`/api/evaluate` for marking, `/api/copilot` for tips and answers)
- `components/` Notion-styled UI components
- `lib/questions.ts` the Force and Motion question bank with marking schemes
- `lib/levels.ts` khwarz costs, rewards and level thresholds
- `lib/store.tsx` client-side player state
- `lib/fallbackMarker.ts` offline marker used when Ollama is unreachable
