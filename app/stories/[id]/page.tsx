import { notFound } from "next/navigation";
import Link from "next/link";
import { getStories } from "@/lib/storage";
import { ChapterList } from "@/components/chapter-list";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/bookmark-button";
import { ReactionBar } from "@/components/reaction-bar";
import { ReadingTimeBadge } from "@/components/reading-time-badge";
import { getGenre } from "@/lib/genres";

type Story = {
  id: string;
  title: string;
  content: string | null;
  pdf_url: string | null;
  cover_url?: string | null;
  author_name: string | null;
  author_username: string | null;
  genre?: string;
  curator_note?: string | null;
  likes?: number | null;
  coffees?: number | null;
  chapters?: any[];
  created_at?: string;
};

async function getStory(id: string): Promise<Story | null> {
  const stories = getStories();
  return stories.find((s: any) => s.id === id) || null;
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await getStory(id);

  if (!story) {
    notFound();
  }

  const genre = story.genre ? getGenre(story.genre as any) : null;

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft">
          <div className="w-full md:w-1/3">
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden border border-white/10 bg-black/40">
              {story.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={story.cover_url}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">
                  No cover
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <span>by @{story.author_username || "anon"}</span>
              {genre && (
                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-lounge-accent border border-white/10">
                  {genre.name}
                </span>
              )}
              {story.created_at && (
                <span className="text-xs text-neutral-500">
                  {new Date(story.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold">{story.title}</h1>
            <ReadingTimeBadge content={story.content} pdfUrl={story.pdf_url} />

            <div className="flex items-center gap-3 pt-2">
              <Button asChild className="bg-lounge-accent hover:bg-lounge-accent/90">
                <Link href={story.pdf_url ? `/read/${story.id}` : "#content"}>
                  {story.pdf_url ? "Read Book" : "Start Reading"}
                </Link>
              </Button>
              <BookmarkButton storyId={story.id} />
              <div className="text-xs text-neutral-400">
                ❤️ {story.likes ?? 0} · ☕ {story.coffees ?? 0}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4" id="content">
          <h2 className="text-xl font-semibold">About</h2>
          {story.content ? (
            <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
              {story.content}
            </p>
          ) : (
            <p className="text-sm text-neutral-400">No description yet.</p>
          )}
          {story.curator_note && (
            <p className="text-sm text-lounge-accent/90 italic border-t border-white/5 pt-3">
              — {story.curator_note}
            </p>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Chapters</h2>
            {story.pdf_url && (
              <Button asChild size="sm" variant="ghost">
                <Link href={`/read/${story.id}`}>Open Book</Link>
              </Button>
            )}
          </div>
          {story.chapters && story.chapters.length > 0 ? (
            <ChapterList
              chapters={story.chapters}
              onRead={(ch) => {
                window.location.href = `/read/${story.id}/${ch.id}`;
              }}
            />
          ) : (
            <p className="text-sm text-neutral-400">No chapters yet.</p>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Reactions</h2>
            <span className="text-xs text-neutral-500">
              ❤️ {story.likes ?? 0} · ☕ {story.coffees ?? 0}
            </span>
          </div>
          <ReactionBar storyId={story.id} onReact={async () => {}} />
        </div>
      </div>
    </main>
  );
}

