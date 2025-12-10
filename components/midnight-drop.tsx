"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./auth/auth-provider";
import { createClient } from "@/lib/supabase-client";
import { StoryCard } from "./story-card";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export function MidnightDrop() {
  const { user } = useAuth();
  const [story, setStory] = useState<any>(null);
  const [show, setShow] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const checkMidnight = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Only show between 00:00 and 00:05
      if (hour === 0 && minute <= 5) {
        loadMidnightDrop();
      } else {
        setShow(false);
        setStory(null);
      }
    };

    async function loadMidnightDrop() {
      if (!user) return; // Type guard
      // Check if user already viewed today's drop
      const today = new Date().toISOString().split("T")[0];
      const viewedResp = await supabase
        .from("midnight_views")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();
      const viewed = (viewedResp as any).data ?? null;

      if (viewed) return; // Already viewed

      // Get a midnight drop story
      const storyResp = await supabase
        .from("stories")
        .select("*")
        .eq("is_approved", true)
        .eq("midnight_drop", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      const data = (storyResp as any).data ?? null;

      if (data) {
        setStory(data);
        setShow(true);

        // Mark as viewed
        await supabase.from("midnight_views").insert({
          user_id: user.id,
          story_id: data.id,
          date: today,
        });
      }
    }

    checkMidnight();
    const interval = setInterval(checkMidnight, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [user, supabase]);

  if (!show || !story) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="max-w-2xl w-full bg-lounge-card border-2 border-purple-500/50 rounded-xl p-8 relative"
        >
          <div className="absolute top-4 right-4">
            <Sparkles className="text-purple-400 animate-pulse" size={24} />
          </div>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Secret Midnight Drop
            </h2>
            <p className="text-neutral-400">
              This story vanishes in {5 - new Date().getMinutes()} minutes...
            </p>
          </div>
          <StoryCard story={story} onReact={async () => {}} />
          <p className="text-xs text-center text-neutral-500 mt-4">
            Available only from 00:00 to 00:05
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

