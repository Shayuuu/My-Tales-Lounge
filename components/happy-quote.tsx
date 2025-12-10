"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const QUOTES = [
  "May your night be soft and your stories warm.",
  "Every page you turn adds a little light to the room.",
  "Your next favorite memory is just a sentence away.",
  "Slow down, sip something cozy, and let the tale hug you.",
  "You deserve a gentle story and a calmer heart tonight.",
  "Somewhere in these lines, a friend is waiting for you.",
  "Rest your mind here; the world can wait a few pages.",
  "Tiny joys are hidden in quiet paragraphs—enjoy them.",
  "For you: a calm breath, a warm glow, and kind words.",
  "Stay awhile; the lounge is warmer when you're here."
];

export function HappyQuote() {
  // Avoid hydration mismatch by rendering a stable first quote on server,
  // then picking a random one on the client after mount.
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    const idx = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[idx]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-lounge-card border border-white/5 rounded-xl p-6 shadow-soft"
    >
      <div className="flex items-center gap-3 mb-3">
        <Sparkles className="text-lounge-accent" size={20} />
        <h3 className="text-lg font-semibold">A cozy note for you</h3>
      </div>
      <p className="text-neutral-200 text-lg leading-relaxed">{quote}</p>
    </motion.div>
  );
}

