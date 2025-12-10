"use client";

import { useEffect, useState } from "react";
import { StoryCard } from "./story-card";
import { Bookmark } from "lucide-react";

type Story = {
  id: string;
  title: string;
  content: string | null;
  pdf_url: string | null;
  author_name: string | null;
  author_username: string | null;
  genre?: string;
  likes: number | null;
  coffees: number | null;
  created_at: string;
};

export function MyBookshelf() {
  const [bookmarkedStories, setBookmarkedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookmarkedStories() {
      const bookmarks = localStorage.getItem("my-bookshelf");
      if (!bookmarks) {
        setLoading(false);
        return;
      }

      const bookmarkIds = JSON.parse(bookmarks);
      
      // Fetch all stories from API
      try {
        const response = await fetch("/api/stories?page=0&pageSize=1000");
        const data = await response.json();
        
        if (data.stories) {
          const bookmarked = data.stories.filter((s: Story) =>
            bookmarkIds.includes(s.id)
          );
          setBookmarkedStories(bookmarked);
        }
      } catch (error) {
        console.error("Error loading bookmarked stories:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBookmarkedStories();
  }, []);

  const react = async (id: string, type: "like" | "coffee") => {
    try {
      const response = await fetch(`/api/stories/${id}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarkedStories((prev) =>
          prev.map((s) => (s.id === id ? data.story : s))
        );
      }
    } catch (error) {
      console.error("Error reacting:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-400">Loading your bookshelf...</p>
      </div>
    );
  }

  if (bookmarkedStories.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark className="mx-auto mb-4 text-lounge-accent/50" size={48} />
        <p className="text-neutral-400">Your bookshelf is empty</p>
        <p className="text-sm text-neutral-500 mt-2">
          Bookmark stories to save them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarkedStories.map((story) => (
          <div key={story.id} className="relative">
            <StoryCard
              story={story}
              onReact={(t) => react(story.id, t)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

