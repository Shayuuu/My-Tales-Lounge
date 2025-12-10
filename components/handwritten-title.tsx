"use client";

import { useMemo } from "react";

const HANDWRITTEN_FONTS = [
  "Caveat",
  "Sacramento",
  "Reenie Beanie",
  "Dancing Script",
  "Indie Flower",
  "Shadows Into Light",
];

export function HandwrittenTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const font = useMemo(() => {
    return HANDWRITTEN_FONTS[
      Math.floor(Math.random() * HANDWRITTEN_FONTS.length)
    ];
  }, []);

  return (
    <span
      className={className}
      style={{
        fontFamily: `"${font}", cursive`,
        fontWeight: 400,
      }}
    >
      {children}
    </span>
  );
}

