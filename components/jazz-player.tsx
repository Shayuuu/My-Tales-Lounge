"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, VolumeX } from "lucide-react";

export function JazzPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Using a free jazz track - you can replace with your own audio file
    // Place your audio file in public/audio/jazz.mp3 and use "/audio/jazz.mp3"
    // For now, using a free music service (you may need to add your own file)
    const audioUrl = "/audio/jazz.mp3"; // Place your jazz.mp3 file in public/audio/
    
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    // Handle audio loading errors gracefully
    audioRef.current.addEventListener("error", () => {
      console.log("Jazz audio not available. Add your own audio file to public/audio/jazz.mp3");
    });

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Handle autoplay restrictions
      });
    }
    setPlaying(!playing);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="w-full justify-start gap-2 text-lounge-accent"
    >
      {playing ? <VolumeX size={16} /> : <Music size={16} />}
      <span className="text-sm">{playing ? "Mute Jazz" : "Play Jazz"}</span>
    </Button>
  );
}

