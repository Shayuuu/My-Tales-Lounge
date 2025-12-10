"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookmarkButton({ storyId }: { storyId: string }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = localStorage.getItem("my-bookshelf");
    if (bookmarks) {
      const ids = JSON.parse(bookmarks);
      setBookmarked(ids.includes(storyId));
    }
  }, [storyId]);

  const toggle = () => {
    const bookmarks = localStorage.getItem("my-bookshelf");
    const ids = bookmarks ? JSON.parse(bookmarks) : [];

    if (bookmarked) {
      const newIds = ids.filter((id: string) => id !== storyId);
      localStorage.setItem("my-bookshelf", JSON.stringify(newIds));
      setBookmarked(false);
    } else {
      ids.push(storyId);
      localStorage.setItem("my-bookshelf", JSON.stringify(ids));
      setBookmarked(true);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={bookmarked ? "text-lounge-accent" : ""}
    >
      {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
    </Button>
  );
}

