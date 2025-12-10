"use client";

import { useEffect, useRef, useState } from "react";

export function RainSound() {
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);
  const resumeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Only run on the client
    // Use the provided audio in /public/audio
    const src = "/audio/WhatsApp Audio 2025-12-09 at 14.48.21.mpeg";
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.15; // gentle volume
    soundRef.current = audio;

    const play = async () => {
      try {
        await audio.play();
        setReady(true);
      } catch {
        // Autoplay blocked; user can start after any interaction
        const resume = async () => {
          try {
            await audio.play();
            setReady(true);
            if (resumeRef.current) {
              window.removeEventListener("click", resumeRef.current);
              window.removeEventListener("touchstart", resumeRef.current);
              resumeRef.current = null;
            }
          } catch {
            /* ignore */
          }
        };
        resumeRef.current = resume;
        window.addEventListener("click", resume);
        window.addEventListener("touchstart", resume, { passive: true });
      }
    };

    play();

    return () => {
      soundRef.current?.pause();
      soundRef.current = null;
      if (resumeRef.current) {
        window.removeEventListener("click", resumeRef.current);
        window.removeEventListener("touchstart", resumeRef.current);
      }
    };
  }, []);

  if (!ready) return null;
  return null;
}

