"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type Story = {
  id: string;
  title: string;
  author_name: string | null;
  is_featured?: boolean;
  is_approved?: boolean;
};

export function FeaturedStoryManager() {
  const [stories, setStories] = useState<Story[]>([]);
  const [featuredId, setFeaturedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        // Fetch all stories from API
        const response = await fetch("/api/stories?page=0&pageSize=1000");
        const data = await response.json();
        
        if (data.stories) {
          const allStories = data.stories;
          setStories(allStories);
          
          // Find featured story
          const featured = allStories.find((s: Story) => s.is_featured);
          setFeaturedId(featured?.id || null);
        }
      } catch (error) {
        console.error("Error loading stories:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStories();
  }, []);

  const handleFeature = async (storyId: string) => {
    try {
      // Call API to set featured story
      const response = await fetch(`/api/stories/${storyId}/feature`, {
        method: "POST",
      });

      if (response.ok) {
        setFeaturedId(storyId);
        // Update local state
        setStories((prev) =>
          prev.map((s) => ({
            ...s,
            is_featured: s.id === storyId,
          }))
        );
        window.dispatchEvent(new Event("storyPublished"));
      }
    } catch (error) {
      console.error("Error featuring story:", error);
    }
  };

  if (loading) {
    return <p className="text-sm text-neutral-400">Loading stories...</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-400">
        Select a story to feature as "Tonight's Special"
      </p>
      <div className="max-h-64 overflow-y-auto space-y-2">
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex items-center justify-between p-3 bg-lounge-soft/50 rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium">{story.title}</p>
              <p className="text-xs text-neutral-400">by {story.author_name}</p>
            </div>
            <Button
              variant={featuredId === story.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleFeature(story.id)}
              className={featuredId === story.id ? "bg-yellow-500" : ""}
            >
              <Star
                size={16}
                className={featuredId === story.id ? "fill-current" : ""}
              />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

