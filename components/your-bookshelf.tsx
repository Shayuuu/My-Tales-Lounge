"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { StoryCard } from "./story-card";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export function YourBookshelf({ userId }: { userId: string }) {
  const [stories, setStories] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadBookshelf() {
      // For now, use localStorage as fallback until Supabase is set up
      const bookmarks = localStorage.getItem("my-bookshelf");
      if (!bookmarks) return;

      const bookmarkIds = JSON.parse(bookmarks);
      
      // Fetch stories from API
      try {
        const response = await fetch("/api/stories?page=0&pageSize=1000");
        const data = await response.json();
        
        if (data.stories) {
          const bookmarked = data.stories.filter((s: any) =>
            bookmarkIds.includes(s.id)
          );
          setStories(bookmarked.slice(0, 6));
        }
      } catch (error) {
        console.error("Error loading bookshelf:", error);
      }
    }

    loadBookshelf();
  }, [userId, supabase]);

  if (stories.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen size={20} />
          Your Bookshelf
        </h3>
        <Link
          href="/my-shelf"
          className="text-sm text-lounge-accent hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.slice(0, 3).map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onReact={async () => {}}
          />
        ))}
      </div>
    </div>
  );
}

