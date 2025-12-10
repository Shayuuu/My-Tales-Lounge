import { notFound } from "next/navigation";
import { readBooks, readChapters } from "@/lib/books-storage";
import { LoungeShell } from "@/components/lounge-shell";
import { RainBg } from "@/components/rain-bg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function BookPage({ params }: { params: { id: string } }) {
  const book = readBooks().find((b) => b.id === params.id);
  if (!book) notFound();
  const chapters = readChapters()
    .filter((c) => c.book_id === book.id)
    .sort((a, b) => a.chapter_number - b.chapter_number);

  return (
    <main className="relative min-h-screen">
      <RainBg />
      <LoungeShell
        title={book.title}
        action={
          <Button variant="ghost" asChild>
            <Link href="/">← Back</Link>
          </Button>
        }
      >
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="aspect-[2/3] bg-lounge-soft rounded-lg border border-white/5 flex items-center justify-center text-neutral-500">
              {book.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span>No cover</span>
              )}
            </div>
            <p className="text-sm text-neutral-400">
              {book.blurb || "A cozy new tale."}
            </p>
            <p className="text-xs text-neutral-500">
              {book.total_chapters} chapters · {book.author_name || "Anon"}
            </p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen size={18} /> Chapters
            </h3>
            <div className="space-y-2">
              {chapters.map((ch) => (
                <Link
                  key={ch.id}
                  href={`/read/${book.id}/${ch.id}`}
                  className="block p-3 rounded-lg border border-white/5 hover:border-lounge-accent/50 bg-lounge-soft/40"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{`Chapter ${ch.chapter_number}: ${ch.title}`}</p>
                      <p className="text-xs text-neutral-400">
                        {ch.reading_time_min} min · pages {ch.page_start + 1}–{ch.page_end + 1}
                      </p>
                    </div>
                    <span className="text-xs text-lounge-accent">Read</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </LoungeShell>
    </main>
  );
}

