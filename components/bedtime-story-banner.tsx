"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./auth/auth-provider";
import { createClient } from "@/lib/supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BedtimeStoryBanner() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [story, setStory] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const checkBedtime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Check if it's between 22:00 and 22:59
      if (hour === 22) {
        loadBedtimeStory();
      }
    };

    async function loadBedtimeStory() {
      if (!user) return; // Type guard for TS

      const profileResp = await supabase
        .from("profiles")
        .select("bedtime_hour")
        .eq("id", user.id)
        .single();
      const profile = (profileResp as any).data ?? null;

      const bedtimeHour = profile?.bedtime_hour || 22;
      const now = new Date();
      
      if (now.getHours() === bedtimeHour) {
        // Get today's bedtime story
        const today = new Date().toISOString().split("T")[0];
        const { data } = await supabase
          .from("bedtime_stories")
          .select("*, stories(*)")
          .eq("date", today)
          .single();

        if (data) {
          setStory(data.stories);
          setShow(true);
        }
      }
    }

    checkBedtime();
    const interval = setInterval(checkBedtime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, supabase]);

  if (!show || !story) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-900/90 via-yellow-900/90 to-amber-900/90 border-b border-yellow-500/30 p-4"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="text-yellow-300" size={24} />
            <div>
              <p className="text-yellow-100 font-semibold">
                Your bedtime story is ready 🕯️
              </p>
              <p className="text-yellow-200/80 text-sm">{story.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="bg-yellow-500 hover:bg-yellow-600">
              <Link href={`/read/${story.id}`}>Read Now</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShow(false)}
              className="text-yellow-100"
            >
              <X size={18} />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

