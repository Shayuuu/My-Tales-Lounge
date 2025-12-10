"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export function JournalPreview({ userId }: { userId: string }) {
  const [entries, setEntries] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadEntries() {
      const { data } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(3);

      if (data) {
        setEntries(data);
      }
    }

    loadEntries();
  }, [userId, supabase]);

  if (entries.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen size={20} />
          Your Journal
        </h3>
        <Link
          href="/my-journal"
          className="text-sm text-lounge-accent hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-lounge-card border border-white/5 rounded-lg p-4 hover:border-lounge-accent/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{entry.mood_emoji}</span>
              <span className="text-xs text-neutral-400">
                {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
            <p className="text-sm text-neutral-300 line-clamp-3">
              {entry.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

