"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Chapter = {
  id: string;
  title: string;
  release_date?: string;
  status?: string;
};

type Story = {
  id: string;
  title: string;
  chapters?: Chapter[];
};

export function NextChapterBanner() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/stories?page=0&pageSize=100")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setStories(data.stories || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
    return () => {
      mounted = false;
    };
  }, []);

  const next = useMemo(() => {
    const upcoming: { story: Story; chapter: Chapter }[] = [];
    stories.forEach((s) => {
      (s.chapters || []).forEach((c) => {
        const isFuture =
          c.status === "upcoming" ||
          (c.release_date && new Date(c.release_date).getTime() > Date.now());
        if (isFuture) {
          upcoming.push({ story: s, chapter: c });
        }
      });
    });
    upcoming.sort((a, b) => {
      const ta = new Date(a.chapter.release_date || Date.now()).getTime();
      const tb = new Date(b.chapter.release_date || Date.now()).getTime();
      return ta - tb;
    });
    return upcoming[0] || null;
  }, [stories]);

  const countdown = useMemo(() => {
    if (!next?.chapter.release_date) return null;
    const target = new Date(next.chapter.release_date).getTime();
    const diff = target - Date.now();
    if (diff <= 0) return "Releasing now";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${days}d ${hours}h`;
  }, [next]);

  if (!loaded || !next) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-amber-900/30 border border-amber-300/30 text-amber-100 rounded-xl px-4 py-3 flex items-center gap-3"
      >
        <Clock size={18} />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">
            Next chapter: {next.chapter.title}
          </p>
          <p className="text-xs text-amber-200/90 truncate">
            {next.story.title}
            {countdown ? ` · ${countdown}` : ""}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

