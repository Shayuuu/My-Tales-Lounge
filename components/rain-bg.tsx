"use client";

import { useEffect, useState } from "react";

export function RainBg() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    root.style.setProperty("overflow-x", "hidden");
  }, []);

  // Only render on client to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/hayden-scott-lyTgIeUBOUE-unsplash.jpg')",
          filter: "brightness(0.5)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
    </div>
  );
}

