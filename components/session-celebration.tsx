"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./auth/auth-provider";
import { createClient } from "@/lib/supabase-client";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export function SessionCelebration() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    async function checkSessionProgress() {
      // Count stories finished in this session (last 2 hours)
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      
      const { data } = await supabase
        .from("reading_progress")
        .select("story_id")
        .eq("user_id", user.id)
        .eq("progress_percent", 100)
        .gte("updated_at", twoHoursAgo);

      if (data && data.length >= 5 && !localStorage.getItem(`celebrated-${user.id}`)) {
        setShow(true);
        localStorage.setItem(`celebrated-${user.id}`, "true");

        // Paper heart confetti
        const duration = 2000;
        const animationEnd = Date.now() + duration;

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#ff6b9d", "#c7a17a"],
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#ff6b9d", "#c7a17a"],
          });
        }, 250);

        setTimeout(() => setShow(false), 4000);
      }
    }

    const interval = setInterval(checkSessionProgress, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [user, supabase]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-lounge-card border border-lounge-accent/30 rounded-xl p-6 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <Heart className="text-pink-400 animate-pulse" size={24} />
          <div>
            <p className="font-semibold">What a reading session! ✨</p>
            <p className="text-sm text-neutral-400">
              You've finished 5 stories tonight
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

