"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { StoryCard } from "./story-card";
import { Skeleton } from "@/components/ui/skeleton";
import { GenreFilter, type GenreId } from "@/components/genre-coasters";

type Story = {
  id: string;
  title: string;
  content: string | null;
  pdf_url: string | null;
  author_name: string | null;
  author_username: string | null;
  mood_color: string | null;
  genre?: string;
  likes: number | null;
  coffees: number | null;
  created_at: string;
};

const PAGE_SIZE = 6;

export function InfiniteFeed() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [done, setDone] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<GenreId | null>(null);
  const loader = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async (pageNum: number) => {
    setLoading(true);

    try {
      const genreParam = selectedGenre ? `&genre=${selectedGenre}` : "";
      const response = await fetch(
        `/api/stories?page=${pageNum}&pageSize=${PAGE_SIZE}${genreParam}`
      );
      
      if (!response.ok) {
        console.error("Failed to fetch stories:", response.statusText);
        setDone(true);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.error) {
        console.error("API error:", data.error);
        setDone(true);
      } else if (data.stories && data.stories.length > 0) {
        if (pageNum === 0) {
          // Initial load - replace stories
          setStories(data.stories);
        } else {
          // Load more - append stories
          setStories((prev) => [...prev, ...data.stories]);
        }
        setPage(pageNum + 1);
        if (!data.hasMore) {
          setDone(true);
        }
      } else {
        console.log("No stories in response");
        setDone(true);
      }
    } catch (error) {
      console.error("Error loading stories:", error);
      setDone(true);
    }

    setLoading(false);
  }, [selectedGenre]);

  const react = async (id: string, type: "like" | "coffee") => {
    try {
      const response = await fetch(`/api/stories/${id}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        const data = await response.json();
        setStories((prev) =>
          prev.map((s) => (s.id === id ? data.story : s))
        );
      }
    } catch (error) {
      console.error("Error reacting:", error);
    }
  };

  // Reset and reload when genre changes
  useEffect(() => {
    setStories([]);
    setPage(0);
    setDone(false);
    loadMore(0);
  }, [selectedGenre, loadMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loader.current || done || stories.length === 0 || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(page);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loader.current, page, done, loading, stories.length, loadMore]);

  // Refresh feed when a new story is published
  useEffect(() => {
    const handleStoryPublished = () => {
      setStories([]);
      setPage(0);
      setDone(false);
      setLoading(true);
      
      const genreParam = selectedGenre ? `&genre=${selectedGenre}` : "";
      fetch(`/api/stories?page=0&pageSize=${PAGE_SIZE}${genreParam}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.stories && data.stories.length > 0) {
            setStories(data.stories);
            setPage(1);
            setDone(!data.hasMore);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error refreshing stories:", error);
          setLoading(false);
        });
    };

    window.addEventListener("storyPublished", handleStoryPublished);
    return () => window.removeEventListener("storyPublished", handleStoryPublished);
  }, [selectedGenre]);

  if (loading && stories.length === 0) {
    return (
      <div className="space-y-4">
        <GenreFilter selected={selectedGenre || undefined} onSelect={setSelectedGenre} />
        <div className="space-y-2">
          <Skeleton className="h-32 w-full bg-white/5" />
          <Skeleton className="h-32 w-full bg-white/5" />
        </div>
      </div>
    );
  }

  if (stories.length === 0 && !loading) {
    return (
      <div className="space-y-4">
        <GenreFilter selected={selectedGenre || undefined} onSelect={setSelectedGenre} />
        <div className="text-center py-12 text-neutral-400">
          <p>No stories yet. Be the first to share a tale!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GenreFilter selected={selectedGenre || undefined} onSelect={setSelectedGenre} />
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          onReact={(t) => react(story.id, t)}
        />
      ))}
      {!done && stories.length > 0 && (
        <div ref={loader} className="space-y-2">
          {loading && (
            <>
              <Skeleton className="h-32 w-full bg-white/5" />
              <Skeleton className="h-32 w-full bg-white/5" />
            </>
          )}
        </div>
      )}
    </div>
  );
}
