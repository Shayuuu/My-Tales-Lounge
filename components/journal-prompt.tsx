"use client";

import { useState } from "react";
import { useAuth } from "./auth/auth-provider";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";

const MOODS = ["😊", "😌", "😢", "🤔", "😍", "😴", "🔥", "💫"];

export function JournalPrompt({
  storyId,
  onClose,
}: {
  storyId: string;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    if (!user || !mood) {
      toast.error("Please select a mood");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        story_id: storyId,
        mood_emoji: mood,
        note: note.trim() || null,
      });

      if (error) throw error;

      toast.success("Saved to your journal ✨");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-lounge-card border border-white/10 rounded-xl p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">How did this make you feel tonight?</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-400 mb-2">Choose a mood:</p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setMood(emoji)}
                    className={`text-3xl p-2 rounded-lg transition-all ${
                      mood === emoji
                        ? "bg-lounge-accent/20 scale-110"
                        : "hover:bg-lounge-soft/50"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-neutral-400 mb-2">Add a note (optional):</p>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What thoughts did this story bring?"
                rows={4}
                className="bg-lounge-soft border-white/10"
              />
            </div>

            <Button
              className="w-full bg-lounge-accent hover:bg-lounge-accent/90"
              onClick={handleSave}
              disabled={!mood || saving}
            >
              {saving ? "Saving..." : "Save to Journal"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

