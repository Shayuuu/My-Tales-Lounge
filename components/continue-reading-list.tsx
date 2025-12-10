"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./auth/auth-provider";
import { createClient } from "@/lib/supabase-client";
import { StoryCard } from "./story-card";
import Link from "next/link";

export function ContinueReadingList() {
  const { user } = useAuth();
  const [stories, setStories] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    async function loadProgress() {
      const resp = await supabase
        .from("reading_progress")
        .select("*, stories(*)")
        .eq("user_id", user.id)
        .gt("progress_percent", 5)
        .lt("progress_percent", 95)
        .order("updated_at", { ascending: false });
      const data = (resp as any).data ?? null;

      if (data) {
        setStories(data.map((rp: any) => ({
          ...rp.stories,
          progress: rp.progress_percent,
          lastPage: rp.last_page,
        })));
      }
    }

    loadProgress();
  }, [user, supabase]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-400">Please sign in to see your reading progress</p>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-400">No stories in progress</p>
        <p className="text-sm text-neutral-500 mt-2">
          Start reading to see your progress here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <div key={story.id} className="relative">
          <StoryCard story={story} onReact={async () => {}} />
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded px-3 py-2">
            <div className="w-full bg-white/20 rounded-full h-2 mb-1">
              <div
                className="bg-lounge-accent h-2 rounded-full transition-all"
                style={{ width: `${story.progress}%` }}
              />
            </div>
            <p className="text-xs text-neutral-300">
              {Math.round(story.progress)}% complete · Continue from page {story.lastPage + 1}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

