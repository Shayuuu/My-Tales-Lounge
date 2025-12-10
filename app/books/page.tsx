import { readBooks, readChapters } from "@/lib/books-storage";
import { LoungeShell } from "@/components/lounge-shell";
import { RainBg } from "@/components/rain-bg";
import Link from "next/link";

export default function BooksPage() {
  const books = readBooks();
  const chapters = readChapters();

  return (
    <main className="relative min-h-screen">
      <RainBg />
      <LoungeShell title="Library">
        <div className="grid gap-4 md:grid-cols-3">
          {books.map((book) => {
            const count = chapters.filter((c) => c.book_id === book.id).length;
            return (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="block p-4 rounded-lg border border-white/5 hover:border-lounge-accent/50 bg-lounge-soft/40"
              >
                <div className="aspect-[2/3] bg-lounge-card rounded-md mb-3 overflow-hidden">
                  {book.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">
                      No cover
                    </div>
                  )}
                </div>
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-xs text-neutral-400">{book.author_name || "Anon"}</p>
                <p className="text-xs text-neutral-500 mt-1">{count} chapters · PDF</p>
              </Link>
            );
          })}
        </div>
      </LoungeShell>
    </main>
  );
}

