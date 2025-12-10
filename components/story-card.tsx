"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactionBar } from "./reaction-bar";
import { getGenre } from "@/lib/genres";
import { HandwrittenTitle } from "./handwritten-title";
import { FirstEditionSeal } from "./first-edition-seal";
import { BookmarkButton } from "./bookmark-button";
import { ReadingTimeBadge } from "./reading-time-badge";
import { VoiceReader } from "./voice-reader";
import { GiftStory } from "./gift-story";
import { Lamp } from "lucide-react";
import { motion } from "framer-motion";
import { ChapterList } from "./chapter-list";
import { useMemo } from "react";
import Link from "next/link";

type Story = {
  id: string;
  title: string;
  content: string | null;
  pdf_url: string | null;
  author_name: string | null;
  author_username: string | null;
  mood_color: string | null;
  genre?: string;
  is_first_edition?: boolean;
  curator_note?: string | null;
  likes: number | null;
  coffees: number | null;
  created_at: string;
  chapters?: any[];
};

export function StoryCard({
  story,
  onReact,
}: {
  story: Story;
  onReact: (type: "like" | "coffee") => Promise<void>;
}) {
  const genre = story.genre ? getGenre(story.genre as any) : null;
  const isNew = new Date(story.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
  const isHot = (story.likes || 0) + (story.coffees || 0) * 2 > 10;
  const nextChapter = useMemo(() => {
    if (!story.chapters || story.chapters.length === 0) return null;
    const upcoming = story.chapters
      .filter((c: any) => c.status === "upcoming" || (c.release_date && new Date(c.release_date).getTime() > Date.now()))
      .sort(
        (a: any, b: any) =>
          new Date(a.release_date || Date.now()).getTime() -
          new Date(b.release_date || Date.now()).getTime()
      );
    return upcoming[0] || null;
  }, [story.chapters]);

  return (
    <Card
      className={`relative overflow-hidden border bg-lounge-card shadow-lounge ${
        isHot
          ? "border-yellow-500/50 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
          : "border-lounge-accent/10"
      }`}
      style={{
        background: genre
          ? `linear-gradient(135deg, ${genre.tint} 0%, rgba(199,161,122,0.1) 100%)`
          : undefined,
      }}
    >
      {story.is_first_edition && <FirstEditionSeal />}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 0%, rgba(199,161,122,0.1) 100%)`,
        }}
      />
      <div className="relative p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-lounge-accent/70">
                @{story.author_username ?? "anon"}
              </p>
              {genre && (
                <span className="text-xs flex items-center gap-1">
                  {genre.icon} {genre.name}
                </span>
              )}
              {isNew && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex items-center gap-1 text-amber-400"
                >
                  <Lamp size={12} />
                  <span className="text-xs">New</span>
                </motion.div>
              )}
            </div>
            <h3 className="text-xl font-semibold">
              <HandwrittenTitle>{story.title}</HandwrittenTitle>
            </h3>
            <div className="mt-1">
              <ReadingTimeBadge content={story.content} pdfUrl={story.pdf_url} />
            </div>
          </div>
          <span className="text-xs text-neutral-400">
            {new Date(story.created_at).toLocaleDateString()}
          </span>
        </div>
        {story.content && (
          <p className="text-sm leading-relaxed text-neutral-200 whitespace-pre-wrap line-clamp-6">
            {story.content}
          </p>
        )}
        {story.pdf_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={`/read/${story.id}`}>
              📖 Read Book
            </a>
          </Button>
        )}
        {!story.pdf_url && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/stories/${story.id}`}>View Story</Link>
          </Button>
        )}
        {nextChapter && (
          <div className="mt-2 rounded-lg border border-amber-300/30 bg-amber-900/20 px-3 py-2 text-xs text-amber-100">
            Next chapter: <strong>{nextChapter.title}</strong>{" "}
            {nextChapter.release_date && (
              <span>
                · {new Date(nextChapter.release_date).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
        {story.chapters && story.chapters.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-neutral-400 mb-1">Chapters</p>
            <ChapterList
              chapters={story.chapters}
              onRead={(ch) => {
                window.location.href = `/read/${story.id}/${ch.id}`;
              }}
            />
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <ReactionBar storyId={story.id} onReact={onReact} />
            <BookmarkButton storyId={story.id} />
            <VoiceReader storyId={story.id} content={story.content} />
            <GiftStory storyId={story.id} />
          </div>
          <div className="text-xs text-neutral-400">
            ❤️ {story.likes ?? 0} · ☕ {story.coffees ?? 0}
          </div>
        </div>
        {story.curator_note && (
          <div className="pt-2 border-t border-white/5">
            <p className="text-sm text-lounge-accent/80 italic font-serif">
              — {story.curator_note} ♡
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

