"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export function BedtimeStoryPicker() {
  const [stories, setStories] = useState<any[]>([]);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [todayStory, setTodayStory] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      // Load all approved stories
      const storiesResp = await supabase
        .from("stories")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      const allStories = (storiesResp as any).data ?? null;

      if (allStories) {
        setStories(allStories);
      }

      // Load today's bedtime story
      const today = new Date().toISOString().split("T")[0];
      const todayResp = await supabase
        .from("bedtime_stories")
        .select("*, stories(*)")
        .eq("date", today)
        .single();
      const todayData = (todayResp as any).data ?? null;

      if (todayData) {
        setTodayStory(todayData.stories);
        setSelectedStory(todayData.story_id);
      }
    }

    loadData();
  }, [supabase]);

  const handleSave = async () => {
    if (!selectedStory) {
      toast.error("Please select a story");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase
      .from("bedtime_stories")
      .upsert({
        date: today,
        story_id: selectedStory,
      });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Bedtime story set for today! 🕯️");
      const selected = stories.find((s) => s.id === selectedStory);
      setTodayStory(selected);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-lounge-card">
        <h2 className="text-xl font-semibold mb-4">Today's Bedtime Story</h2>
        {todayStory ? (
          <div className="p-4 bg-lounge-soft/50 rounded-lg">
            <p className="font-semibold">{todayStory.title}</p>
            <p className="text-sm text-neutral-400">by {todayStory.author_name}</p>
          </div>
        ) : (
          <p className="text-neutral-400">No story selected for today</p>
        )}
      </Card>

      <Card className="p-6 bg-lounge-card">
        <h2 className="text-xl font-semibold mb-4">Select Story for Today</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => setSelectedStory(story.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedStory === story.id
                  ? "bg-lounge-accent/20 border-2 border-lounge-accent"
                  : "bg-lounge-soft/50 hover:bg-lounge-soft border-2 border-transparent"
              }`}
            >
              <p className="font-medium">{story.title}</p>
              <p className="text-xs text-neutral-400">by {story.author_name}</p>
            </button>
          ))}
        </div>
        <Button
          onClick={handleSave}
          className="w-full mt-4 bg-lounge-accent hover:bg-lounge-accent/90"
        >
          Set as Today's Bedtime Story
        </Button>
      </Card>
    </div>
  );
}

