"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth/auth-provider";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
import { toast } from "sonner";

export function VoiceReader({ storyId, content }: { storyId: string; content: string | null }) {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    // Load saved position
    async function loadPosition() {
      const { data } = await supabase
        .from("voice_reading_progress")
        .select("position")
        .eq("user_id", user.id)
        .eq("story_id", storyId)
        .single();

      if (data) {
        setPosition(data.position);
      }
    }

    loadPosition();
  }, [user, storyId, supabase]);

  const handlePlay = async () => {
    if (!content) {
      toast.error("No text content available for voice reading");
      return;
    }

    try {
      // Call API to generate/retrieve audio
      const response = await fetch("/api/voice/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, text: content, position }),
      });

      const data = await response.json();
      if (data.audioUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio(data.audioUrl);
          audioRef.current.currentTime = position;

          audioRef.current.addEventListener("timeupdate", () => {
            if (audioRef.current) {
              setPosition(audioRef.current.currentTime);
              // Save progress every 5 seconds
              if (Math.floor(audioRef.current.currentTime) % 5 === 0) {
                saveProgress(audioRef.current.currentTime);
              }
            }
          });

          audioRef.current.addEventListener("ended", () => {
            setIsPlaying(false);
            setPosition(0);
          });
        }

        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      toast.error("Failed to start voice reading");
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      saveProgress(audioRef.current.currentTime);
    }
  };

  const saveProgress = async (pos: number) => {
    if (!user) return;

    await supabase.from("voice_reading_progress").upsert({
      user_id: user.id,
      story_id: storyId,
      position: pos,
      updated_at: new Date().toISOString(),
    });
  };

  if (!user) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={isPlaying ? handlePause : handlePlay}
      className="gap-2"
    >
      {isPlaying ? (
        <>
          <Pause size={16} />
          Pause
        </>
      ) : (
        <>
          <Volume2 size={16} />
          Listen
        </>
      )}
    </Button>
  );
}

