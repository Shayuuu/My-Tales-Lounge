"use client";

import { motion } from "framer-motion";
import { StoryCard } from "./story-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";

export function GiftView({ gift }: { gift: any }) {
  const story = gift.stories;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center space-y-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-6xl mb-4"
      >
        🕯️
      </motion.div>
      <h2 className="text-3xl font-bold">Someone gifted you a story</h2>
      <p className="text-neutral-400">
        A tale chosen with care, just for you
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <StoryCard story={story} onReact={async () => {}} />
      </motion.div>

      <div className="flex items-center justify-center gap-2 text-neutral-400 text-sm">
        <Heart size={16} className="text-pink-400" />
        <span>This gift expires in {Math.ceil((new Date(gift.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days</span>
      </div>

      <Button asChild className="bg-lounge-accent hover:bg-lounge-accent/90">
        <Link href={`/read/${story.id}`}>Start Reading</Link>
      </Button>
    </motion.div>
  );
}

