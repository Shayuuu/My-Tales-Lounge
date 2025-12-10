"use client";

import { useMemo } from "react";

export function ReadingTimeBadge({
  content,
  pdfUrl,
}: {
  content: string | null;
  pdfUrl: string | null;
}) {
  const readingTime = useMemo(() => {
    if (pdfUrl) {
      // Estimate PDF reading time (average 200 words per page, assume 10 pages)
      return "8 min";
    }
    if (content) {
      const words = content.split(/\s+/).length;
      const minutes = Math.ceil(words / 200); // Average reading speed
      return `${minutes} min`;
    }
    return "5 min";
  }, [content, pdfUrl]);

  const getTimeLabel = () => {
    const time = parseInt(readingTime);
    if (time <= 3) return "quick read";
    if (time <= 8) return "perfect for bedtime";
    if (time <= 15) return "cozy read";
    return "deep dive";
  };

  return (
    <span className="text-xs text-neutral-400">
      {readingTime} · {getTimeLabel()}
    </span>
  );
}

