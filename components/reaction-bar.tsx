"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReactionBar({
  storyId,
  onReact,
}: {
  storyId: string;
  onReact: (type: "like" | "coffee") => Promise<void>;
}) {
  const [burst, setBurst] = useState<"like" | "coffee" | null>(null);

  const trigger = (type: "like" | "coffee") => {
    setBurst(type);
    if (type === "like") {
      window.dispatchEvent(new Event("heart-given"));
    }
    onReact(type).finally(() => {
      setTimeout(() => setBurst(null), 800);
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => trigger("like")}
        aria-label="Heart"
      >
        <Heart className="text-pink-400" size={18} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => trigger("coffee")}
        aria-label="Coffee"
      >
        <Coffee className="text-amber-300" size={18} />
      </Button>
      <AnimatePresence>
        {burst && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1.1 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-xl"
          >
            {burst === "like" ? "❤️" : "☕"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

