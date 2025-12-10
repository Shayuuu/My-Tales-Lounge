"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";
import Link from "next/link";
import { StoryCard } from "./story-card";

export function OneMoreChapter() {
  const [story, setStory] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadShortStory() {
      const { data } = await supabase
        .from("stories")
        .select("*")
        .eq("is_approved", true)
        .contains("tags", ["short-sweet"])
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setStory(data);
      }
    }

    loadShortStory();
  }, [supabase]);

  if (!story) return null;

  return (
    <div className="bg-lounge-card border border-lounge-accent/20 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Moon className="text-lounge-accent" size={24} />
        <div>
          <h3 className="text-xl font-semibold">One More Chapter Tonight?</h3>
          <p className="text-sm text-neutral-400">
            A short & sweet tale perfect for bedtime
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 items-center">
        <StoryCard story={story} onReact={async () => {}} />
        <div className="space-y-3">
          <p className="text-neutral-300 text-sm">
            Just a few minutes of cozy reading before you drift off...
          </p>
          <Button asChild className="w-full bg-lounge-accent hover:bg-lounge-accent/90">
            <Link href={`/read/${story.id}`}>Start Reading</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

