"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function useEndStoryMagic(
  currentPage: number,
  totalPages: number,
  isBook: boolean
) {
  const [showMagic, setShowMagic] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Only trigger when we have real pages and are beyond the first page
    if (hasShown) return;
    if (totalPages <= 1) return;
    if (currentPage <= 0) return;

    const progress = isBook
      ? ((currentPage + 1) / totalPages) * 100
      : 100; // For text stories, assume 100% when viewed

    if (progress >= 95 && !hasShown) {
      setShowMagic(true);
      setHasShown(true);

      // Play sparkle sound
      const audio = new Audio("/audio/sparkle.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore if audio file doesn't exist
      });

      setTimeout(() => {
        setShowMagic(false);
      }, 4000);
    }
  }, [currentPage, totalPages, isBook, hasShown]);

  return showMagic;
}

export function EndStoryMagicMessage({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="text-center space-y-3 px-6 py-6 bg-black/20 rounded-2xl border border-white/10 shadow-xl max-w-xl w-full"
          >
            <div className="text-5xl sm:text-6xl mb-2">🕯️</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-lounge-accent mb-1 leading-tight">
              You just turned the last page
            </h2>
            <p className="text-base sm:text-xl text-neutral-300">
              Thank you for spending tonight with us.
            </p>
            <div className="flex justify-center gap-2 mt-4 sm:mt-6 text-xl sm:text-2xl">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  ✨
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

