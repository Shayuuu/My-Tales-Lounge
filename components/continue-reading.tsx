"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { StoryCard } from "./story-card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function ContinueReading({ userId }: { userId: string }) {
  const [stories, setStories] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadProgress() {
      // Try Supabase first, fallback to localStorage
      try {
        const { data } = await supabase
          .from("reading_progress")
          .select("*, stories(*)")
          .eq("user_id", userId)
          .gt("progress_percent", 5)
          .lt("progress_percent", 95)
          .order("updated_at", { ascending: false })
          .limit(5);

        if (data && data.length > 0) {
          setStories(data.map((rp: any) => ({
            ...rp.stories,
            progress: rp.progress_percent,
            lastPage: rp.last_page,
          })));
          return;
        }
      } catch (error) {
        // Supabase not configured, use localStorage
      }

      // Fallback to localStorage
      const allKeys = Object.keys(localStorage);
      const progressKeys = allKeys.filter(key => key.startsWith(`last-page-`));
      
      if (progressKeys.length === 0) return;

      try {
        const response = await fetch("/api/stories?page=0&pageSize=1000");
        const data = await response.json();
        
        if (data.stories) {
          const inProgress = data.stories
            .map((story: any) => {
              const lastPage = localStorage.getItem(`last-page-${story.id}`);
              if (!lastPage) return null;
              
              // Estimate progress from last page (assuming PDF)
              const progress = story.pdf_url ? (parseInt(lastPage) / 10) * 100 : 50;
              
              if (progress > 5 && progress < 95) {
                return {
                  ...story,
                  progress,
                  lastPage: parseInt(lastPage),
                };
              }
              return null;
            })
            .filter(Boolean)
            .slice(0, 5);
          
          setStories(inProgress);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }

    loadProgress();
  }, [userId, supabase]);

  if (stories.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Continue Reading</h3>
        <Link
          href="/continue"
          className="text-sm text-lounge-accent hover:underline flex items-center gap-1"
        >
          See all <ChevronRight size={16} />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            className="min-w-[300px] flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <StoryCard
                story={story}
                onReact={async () => {}}
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 rounded px-2 py-1">
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div
                    className="bg-lounge-accent h-1.5 rounded-full transition-all"
                    style={{ width: `${story.progress}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-300 mt-1">
                  {Math.round(story.progress)}% complete
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
