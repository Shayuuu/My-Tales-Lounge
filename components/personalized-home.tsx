"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./auth/auth-provider";
import { createClient } from "@/lib/supabase-client";
import { ContinueReading } from "./continue-reading";
import { YourBookshelf } from "./your-bookshelf";
import { JournalPreview } from "./journal-preview";
import { WarmBlanketRing } from "./warm-blanket-ring";

export function PersonalizedHome() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadProfile() {
      // For now, use localStorage as fallback
      const savedProfile = localStorage.getItem(`profile-${user.id}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        // Try Supabase if available
        try {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (data) {
            setProfile(data);
            localStorage.setItem(`profile-${user.id}`, JSON.stringify(data));
          }
        } catch (error) {
          // Supabase not configured, use defaults
          setProfile({
            username: user.email?.split("@")[0] || "Reader",
            blanket_progress: 0,
          });
        }
      }
      setLoading(false);
    }

    loadProfile();
  }, [user, supabase]);

  if (!user || loading) return null;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const displayName = profile?.username || profile?.full_name || user.email?.split("@")[0] || "Reader";

  return (
    <div className="space-y-8 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {greeting()}, {displayName} 🕯️
          </h2>
          <p className="text-neutral-400 mt-1">Welcome back to your cozy corner</p>
        </div>
        <WarmBlanketRing progress={profile?.blanket_progress || 0} />
      </div>

      <ContinueReading userId={user.id} />
      <YourBookshelf userId={user.id} />
      <JournalPreview userId={user.id} />
    </div>
  );
}

