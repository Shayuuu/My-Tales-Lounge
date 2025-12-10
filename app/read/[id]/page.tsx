import { notFound } from "next/navigation";
import { BookReader } from "@/components/BookReader";
import { getStories } from "@/lib/storage";
import { readBooks, readChapters } from "@/lib/books-storage";

async function getStory(id: string) {
  const stories = getStories();
  return stories.find((s: any) => s.id === id);
}

export default async function ReadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const sp = searchParams ? await searchParams : {};
  const initialPage = sp?.page ? parseInt(sp.page as string, 10) || 0 : 0;

  // Prefer auto books storage if exists
  const books = readBooks();
  const book = books.find((b) => b.id === id);
  if (book) {
    const chapters = readChapters()
      .filter((c) => c.book_id === id)
      .sort((a, b) => a.chapter_number - b.chapter_number);
    const storyLike = {
      id: book.id,
      title: book.title,
      pdf_url: book.pdf_url,
      author_name: book.author_name || "Unknown",
    };
    return (
      <BookReader
        story={storyLike as any}
        initialPage={initialPage}
        chapters={chapters.map((c) => ({
          id: c.id,
          title: c.title,
          page_start: c.page_start,
          page_end: c.page_end,
        }))}
      />
    );
  }

  const story = await getStory(id);

  if (!story || !story.pdf_url) {
    notFound();
  }

  return <BookReader story={story} initialPage={initialPage} />;
}

