"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Lock, Clock } from "lucide-react";

type Chapter = {
  id: string;
  title: string;
  number?: number;
  summary?: string;
  release_date?: string; // ISO
  status?: "released" | "upcoming";
};

export function ChapterList({
  chapters,
  onRead,
}: {
  chapters?: Chapter[];
  onRead?: (chapter: Chapter) => void;
}) {
  const ordered = useMemo(() => {
    if (!chapters || chapters.length === 0) return [];
    return [...chapters].sort((a, b) => (a.number || 0) - (b.number || 0));
  }, [chapters]);

  const formatCountdown = (releaseDate?: string) => {
    if (!releaseDate) return null;
    const target = new Date(releaseDate).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return "Unlocked";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${days}d ${hours}h`;
  };

  if (!ordered.length) {
    return (
      <div className="text-xs text-neutral-400">
        Weekly chapters coming soon. Stay tuned!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {ordered.map((ch) => {
        const isUpcoming = ch.status === "upcoming";
        const releaseText = ch.release_date
          ? new Date(ch.release_date).toLocaleDateString()
          : null;
        const countdown = formatCountdown(ch.release_date);
        return (
          <div
            key={ch.id}
            className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2 border border-white/5"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                {isUpcoming ? <Clock size={14} /> : <BookOpen size={14} />}
                <span className="truncate">
                  {ch.number ? `Ch ${ch.number}: ` : ""}{ch.title}
                </span>
              </div>
              {ch.summary && (
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {ch.summary}
                </p>
              )}
              {isUpcoming && releaseText && (
                <p className="text-[11px] text-amber-300 mt-1 flex items-center gap-2">
                  <span>Unlocks {releaseText}</span>
                  {countdown && <span className="text-amber-200/80">({countdown})</span>}
                </p>
              )}
            </div>
            <div className="shrink-0">
              {isUpcoming ? (
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Lock size={12} /> Locked
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRead && onRead(ch)}
                  className="text-xs px-2 py-1"
                >
                  Read
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

