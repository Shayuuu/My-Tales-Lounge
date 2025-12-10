"use client";

import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { getGenre } from "@/lib/genres";
import Link from "next/link";
import { motion } from "framer-motion";

type Story = {
  id: string;
  title: string;
  author_name: string | null;
  author_username: string | null;
  genre: string;
  created_at: string;
};

export function TonightSpecial({ story }: { story: Story | null }) {
  if (!story) return null;

  const genre = getGenre(story.genre as any);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="relative overflow-hidden border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-900/30 via-amber-900/20 to-yellow-800/30 shadow-[0_0_40px_rgba(255,215,0,0.3)]">
        <div className="absolute top-2 right-2">
          <Star className="text-yellow-400 fill-yellow-400" size={24} />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
              Bartender's Recommendation Tonight
            </span>
          </div>
          <Link href={`/read/${story.id}`}>
            <h2 className="text-2xl font-bold mb-2 text-yellow-100 hover:text-yellow-50 transition-colors">
              {story.title}
            </h2>
          </Link>
          <div className="flex items-center gap-3 text-sm text-yellow-200/80">
            <span>by {story.author_name || "Unknown"}</span>
            {genre && (
              <span className="flex items-center gap-1">
                {genre.icon} {genre.name}
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

