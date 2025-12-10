"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./auth/auth-provider";
import { createClient } from "@/lib/supabase-client";
// import { format } from "date-fns";
import { motion } from "framer-motion";

export function JournalView() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadEntries() {
      const { data } = await supabase
        .from("journal_entries")
        .select("*, stories(title)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setEntries(data);
      }
      setLoading(false);
    }

    loadEntries();
  }, [user, supabase]);

  if (loading) {
    return <p className="text-neutral-400">Loading your journal...</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-400">Your journal is empty</p>
        <p className="text-sm text-neutral-500 mt-2">
          Finish a story to add your first entry
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-lounge-card border border-white/5 rounded-lg p-6"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">{entry.mood_emoji}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{entry.stories?.title || "Untitled"}</h4>
                <span className="text-xs text-neutral-400">
                  {new Date(entry.created_at).toLocaleString("en-US", { 
                    month: "short", 
                    day: "numeric", 
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                  })}
                </span>
              </div>
              {entry.note && (
                <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
                  {entry.note}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

