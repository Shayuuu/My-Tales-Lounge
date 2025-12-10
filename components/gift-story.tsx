"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "./auth/auth-provider";

export function GiftStory({ storyId }: { storyId: string }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [giftLink, setGiftLink] = useState("");
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  const handleCreateGift = async () => {
    if (!user) {
      toast.error("Please log in to gift stories");
      return;
    }

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { data, error } = await supabase
        .from("gifted_links")
        .insert({
          story_id: storyId,
          created_by: user.id,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const link = `${window.location.origin}/gift/${data.id}`;
      setGiftLink(link);
      setIsOpen(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to create gift link");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(giftLink);
    setCopied(true);
    toast.success("Link copied! 🎁");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCreateGift}
        className="gap-2"
      >
        <Gift size={16} />
        Gift
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/80 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-lounge-card border border-lounge-accent/30 rounded-xl p-8 max-w-md w-full relative">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="text-6xl mb-4"
                  >
                    🕯️
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">Gift a Story</h3>
                  <p className="text-neutral-400">
                    Share this magical tale with someone special
                  </p>
                </div>

                <div className="bg-lounge-soft/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-neutral-300 mb-2">Gift Link:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={giftLink}
                      readOnly
                      className="flex-1 bg-lounge-card border border-white/10 rounded px-3 py-2 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="shrink-0"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-center text-neutral-500 mb-4">
                  This link expires in 7 days
                </p>

                <Button
                  className="w-full bg-lounge-accent hover:bg-lounge-accent/90"
                  onClick={() => setIsOpen(false)}
                >
                  Done
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

