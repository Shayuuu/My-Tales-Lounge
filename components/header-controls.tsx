"use client";

import { useState } from "react";
import { Settings, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StreakCounter } from "./streak-counter";
import { LiveCounter } from "./live-counter";
import { CandlelightModeToggle } from "./candlelight-mode";
import { AmbientSoundMixer } from "./ambient-sound-mixer";
import { JazzPlayer } from "./jazz-player";
import { useAuth } from "./auth/auth-provider";
import { motion, AnimatePresence } from "framer-motion";

export function HeaderControls({ onLoginClick }: { onLoginClick?: () => void }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-20 flex items-center gap-3">
      {/* Stats - Always visible */}
      {user && (
        <div className="flex items-center gap-3 px-3 py-2 bg-lounge-card/80 backdrop-blur-sm rounded-lg border border-white/5 shadow-lg">
          <StreakCounter />
          <div className="w-px h-4 bg-white/10" />
          <LiveCounter />
        </div>
      )}

      {!user && onLoginClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLoginClick}
          className="bg-lounge-card/80 backdrop-blur-sm border border-white/5"
        >
          <LogIn size={18} className="mr-2" />
          Sign In
        </Button>
      )}

      {/* Settings Toggle */}
      {user && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="bg-lounge-card/80 backdrop-blur-sm border border-white/5"
        >
          <Settings size={18} />
        </Button>
      )}

      {/* Settings Dropdown */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setSettingsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-12 right-0 z-40 bg-lounge-card border border-white/10 rounded-lg shadow-xl p-4 min-w-[200px] space-y-2"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold">Settings</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSettingsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X size={14} />
                </Button>
              </div>
              <div className="space-y-2">
                <CandlelightModeToggle />
                <AmbientSoundMixer />
                <JazzPlayer />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

