"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Story = {
  id: string;
  title: string;
  content: string | null;
  pdf_url: string | null;
  author_name: string | null;
  author_username: string | null;
  mood_color: string | null;
  likes: number | null;
  coffees: number | null;
  created_at: string;
};

export function AdminStoryList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStories = async () => {
    try {
      const response = await fetch("/api/stories?page=0&pageSize=100");
      const data = await response.json();
      if (data.stories) {
        setStories(data.stories);
      }
    } catch (error) {
      console.error("Error loading stories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const deleteStory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/stories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setStories((prev) => prev.filter((s) => s.id !== id));
        // Dispatch event to refresh home page feed
        window.dispatchEvent(new Event("storyPublished"));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete story");
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("Failed to delete story");
    }
  };

  if (loading) {
    return <p className="text-neutral-400">Loading stories...</p>;
  }

  if (stories.length === 0) {
    return <p className="text-neutral-400">No stories yet.</p>;
  }

  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <Card
          key={story.id}
          className="relative overflow-hidden border border-lounge-accent/10 bg-lounge-card shadow-soft"
        >
          <div className="p-5">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-lounge-accent/70">
                      @{story.author_username ?? "anon"}
                    </p>
                    <h3 className="text-xl font-semibold">{story.title}</h3>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {new Date(story.created_at).toLocaleDateString()}
                  </span>
                </div>
                {story.content && (
                  <p className="text-sm leading-relaxed text-neutral-200 whitespace-pre-wrap line-clamp-3">
                    {story.content}
                  </p>
                )}
                {story.pdf_url && (
                  <a
                    href={story.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-lounge-accent hover:underline"
                  >
                    📄 Open PDF
                  </a>
                )}
                <div className="text-xs text-neutral-400 pt-2">
                  ❤️ {story.likes ?? 0} · ☕ {story.coffees ?? 0}
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteStory(story.id)}
                className="shrink-0"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

