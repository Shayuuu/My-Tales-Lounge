import { notFound } from "next/navigation";
import { BookReader } from "@/components/BookReader";
import { getStories } from "@/lib/storage";

async function getStory(id: string) {
  const stories = getStories();
  return stories.find((s: any) => s.id === id);
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await getStory(id);

  if (!story || !story.pdf_url) {
    notFound();
  }

  return <BookReader story={story} />;
}

