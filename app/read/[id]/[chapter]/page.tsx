import { notFound } from "next/navigation";
import { getStories } from "@/lib/storage";
import { readBooks, readChapters } from "@/lib/books-storage";

type Params = {
  id: string;
  chapter: string;
};

function getChapterData(storyId: string, chapterId: string) {
  const stories = getStories();
  const story = stories.find((s: any) => s.id === storyId);
  if (!story) return null;
  const chapters = story.chapters || [];
  const chapter = chapters.find((c: any) => c.id === chapterId);
  return { story, chapter, chapters };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id, chapter } = await params;
  const data = getChapterData(id, chapter);

  if (!data || !data.chapter) {
    // Fallback to books/chapters storage for auto-split PDFs
    const books = readBooks();
    const chaptersAll = readChapters();
    const book = books.find((b) => b.id === id);
    const ch = chaptersAll.find((c) => c.id === chapter && c.book_id === id);
    if (!book || !ch) {
      notFound();
    }
    const chapters = chaptersAll
      .filter((c) => c.book_id === id)
      .sort((a, b) => a.chapter_number - b.chapter_number);
    const idx = chapters.findIndex((c) => c.id === ch.id);
    const prev = idx > 0 ? chapters[idx - 1] : null;
    const next = idx + 1 < chapters.length ? chapters[idx + 1] : null;
    return (
      <main className="min-h-screen bg-black text-neutral-100">
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-neutral-400">{book.title}</p>
            <h1 className="text-3xl font-bold">
              {`Chapter ${ch.chapter_number}: ${ch.title}`}
            </h1>
            <p className="text-xs text-neutral-500">
              Pages {ch.page_start + 1}–{ch.page_end + 1}
            </p>
          </div>

          <div className="p-4 rounded-lg border border-lounge-accent/30 bg-lounge-card/60 text-sm text-neutral-200 space-y-3">
            <p>Open in flip reader at this chapter:</p>
            <a
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-lounge-accent text-black font-semibold"
              href={`/read/${book.id}?page=${ch.page_start}`}
            >
              Open Reader
            </a>
          </div>

          <div className="flex items-center justify-between gap-2 pt-4 text-sm">
            {prev ? (
              <a
                className="text-lounge-accent hover:underline"
                href={`/read/${book.id}/${prev.id}`}
              >
                ← Previous
              </a>
            ) : (
              <span className="text-neutral-500">Start of book</span>
            )}
            {next ? (
              <a
                className="text-lounge-accent hover:underline"
                href={`/read/${book.id}/${next.id}`}
              >
                Next →
              </a>
            ) : (
              <span className="text-neutral-500">You reached the latest chapter</span>
            )}
          </div>
        </div>
      </main>
    );
  }

  const { story, chapter: ch, chapters } = data;

  const ordered = chapters
    .slice()
    .sort((a: any, b: any) => (a.number || 0) - (b.number || 0));
  const currentIndex = ordered.findIndex((c: any) => c.id === ch.id);
  const prev = currentIndex > 0 ? ordered[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < ordered.length - 1 ? ordered[currentIndex + 1] : null;

  const isLocked =
    ch.status === "upcoming" ||
    (ch.release_date && new Date(ch.release_date).getTime() > Date.now());

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-neutral-400">{story.title}</p>
          <h1 className="text-3xl font-bold">
            {ch.number ? `Chapter ${ch.number}: ` : ""}{ch.title}
          </h1>
          {ch.release_date && (
            <p className="text-xs text-neutral-500">
              Release: {new Date(ch.release_date).toLocaleString()}
            </p>
          )}
        </div>

        {isLocked ? (
          <div className="p-4 rounded-lg border border-amber-300/40 bg-amber-900/20 text-amber-100">
            This chapter is locked until release.
          </div>
        ) : (
          <>
            {ch.author_note && (
              <div className="p-4 rounded-lg border border-lounge-accent/30 bg-lounge-card/60 text-sm text-neutral-200">
                <p className="text-lounge-accent font-semibold mb-1">Author's note</p>
                <p className="whitespace-pre-wrap">{ch.author_note}</p>
              </div>
            )}
            <article className="prose prose-invert max-w-none whitespace-pre-wrap leading-7 bg-white/5 border border-white/10 rounded-xl p-5">
              {ch.content || "Chapter content coming soon."}
            </article>
          </>
        )}

        <div className="flex items-center justify-between gap-2 pt-4 text-sm">
          {prev ? (
            <a
              className="text-lounge-accent hover:underline"
              href={`/read/${story.id}/${prev.id}`}
            >
              ← Previous
            </a>
          ) : (
            <span className="text-neutral-500">Start of story</span>
          )}
          {next ? (
            <a
              className="text-lounge-accent hover:underline"
              href={`/read/${story.id}/${next.id}`}
            >
              Next →
            </a>
          ) : (
            <span className="text-neutral-500">You reached the latest chapter</span>
          )}
        </div>
      </div>
    </main>
  );
}

