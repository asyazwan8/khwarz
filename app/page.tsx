import Link from "next/link";
import LevelCard from "@/components/LevelCard";
import ChapterList from "@/components/ChapterList";

export default function Home() {
  return (
    <div className="mx-auto max-w-[820px] px-8 pt-14 pb-24 sm:px-12">
      <div className="text-5xl" aria-hidden>
        🚀
      </div>
      <h1 className="mt-3 text-[40px] leading-tight font-bold">SPM Physics Practice</h1>
      <p className="mt-2 text-[var(--muted)]">
        A question bank for SPM students. Practice one subjective question at a time, show your working, and let the
        copilot mark it like a real examiner.
      </p>

      <div className="notion-callout mt-8">
        <span className="text-lg" aria-hidden>
          💡
        </span>
        <p className="text-sm">
          <strong>How khwarz works.</strong> You start with 10 khwarz. Asking the copilot for a tip or a question costs
          1 khwarz, revealing the full answer costs 5, and every fully correct answer earns you 2 back. Spend them
          wisely.
        </p>
      </div>

      <h2 className="mt-10 mb-3 text-xl font-semibold">My level</h2>
      <LevelCard />

      <div className="mt-4 flex items-center gap-2">
        <Link href="/practice" className="notion-btn notion-btn-primary">
          Start practicing
        </Link>
        <span className="text-xs text-[var(--muted)]">Force and Motion · SPM Form 4, Chapter 2</span>
      </div>

      <h2 className="mt-12 mb-3 text-xl font-semibold">Chapters</h2>
      <ChapterList />
    </div>
  );
}
