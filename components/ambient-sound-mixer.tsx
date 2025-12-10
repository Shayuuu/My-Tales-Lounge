"use client";

import { useState, useEffect, useRef } from "react";
import { X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Sound = {
  id: string;
  name: string;
  icon: string;
  url: string;
};

const SOUNDS: Sound[] = [
  { id: "rain", name: "Rain", icon: "🌧️", url: "/audio/rain.mp3" },
  { id: "fireplace", name: "Fireplace", icon: "🔥", url: "/audio/fireplace.mp3" },
  { id: "jazz", name: "Jazz", icon: "🎷", url: "/audio/jazz.mp3" },
  { id: "thunder", name: "Thunder", icon: "⛈️", url: "/audio/thunder.mp3" },
  { id: "cafe", name: "Café", icon: "☕", url: "/audio/cafe.mp3" },
];

export function AmbientSoundMixer() {
  const [isOpen, setIsOpen] = useState(false);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const soundsRef = useRef<Record<string, any>>({});

  useEffect(() => {
    // Load saved volumes
    const saved = localStorage.getItem("ambient-volumes");
    if (saved) {
      const parsed = JSON.parse(saved);
      setVolumes(parsed);
      SOUNDS.forEach((sound) => {
        if (parsed[sound.id] > 0) {
          loadSound(sound.id, parsed[sound.id]);
        }
      });
    }
  }, []);

  const loadSound = async (id: string, volume: number) => {
    const sound = SOUNDS.find((s) => s.id === id);
    if (!sound) return;

    try {
      const { Howl } = await import("howler");
      if (soundsRef.current[id]) {
        soundsRef.current[id].volume(volume);
        if (volume > 0 && !soundsRef.current[id].playing()) {
          soundsRef.current[id].play();
        } else if (volume === 0) {
          soundsRef.current[id].stop();
        }
        return;
      }

      const howl = new Howl({
        src: [sound.url],
        loop: true,
        volume: volume,
        onloaderror: () => {
          console.log(`Audio file not found: ${sound.url}`);
        },
      });

      soundsRef.current[id] = howl;
      if (volume > 0) {
        howl.play();
      }
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  };

  const handleVolumeChange = (id: string, volume: number) => {
    const newVolumes = { ...volumes, [id]: volume };
    setVolumes(newVolumes);
    localStorage.setItem("ambient-volumes", JSON.stringify(newVolumes));
    loadSound(id, volume);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start gap-2"
      >
        <Volume2 size={16} />
        <span className="text-sm">Ambient Sounds</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="fixed right-4 top-24 w-80 bg-lounge-card border border-white/10 shadow-xl rounded-lg z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Ambient Sounds</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X size={18} />
                </Button>
              </div>

              <div className="space-y-4">
                {SOUNDS.map((sound) => (
                  <div key={sound.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{sound.icon}</span>
                        <span>{sound.name}</span>
                      </span>
                      <span className="text-xs text-neutral-400">
                        {Math.round((volumes[sound.id] || 0) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volumes[sound.id] || 0}
                      onChange={(e) =>
                        handleVolumeChange(sound.id, parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-lounge-soft rounded-lg appearance-none cursor-pointer accent-lounge-accent"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
