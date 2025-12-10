"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./auth/auth-provider";
import { createClient } from "@/lib/supabase-client";
import { motion, AnimatePresence } from "framer-motion";

export function WelcomeScreen() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    // Check if user has seen welcome screen
    const hasSeenWelcome = localStorage.getItem(`welcome-${user.id}`);
    if (hasSeenWelcome) return;

    async function loadName() {
      const { data } = await supabase
        .from("profiles")
        .select("username, full_name")
        .eq("id", user.id)
        .single();

      if (data) {
        setName(data.username || data.full_name || user.email?.split("@")[0] || "Reader");
        setShow(true);
        localStorage.setItem(`welcome-${user.id}`, "true");
      }
    }

    loadName();
  }, [user, supabase]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{
              filter: [
                "drop-shadow(0 0 10px rgba(199, 161, 122, 0.5))",
                "drop-shadow(0 0 20px rgba(199, 161, 122, 0.8))",
                "drop-shadow(0 0 10px rgba(199, 161, 122, 0.5))",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl mb-4"
          >
            🕯️
          </motion.div>
          <h1 className="text-4xl font-bold">
            Welcome home, {name}
          </h1>
          <p className="text-xl text-neutral-400">
            Your cozy reading journey begins here
          </p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={() => setShow(false)}
            className="mt-8 px-8 py-3 bg-lounge-accent hover:bg-lounge-accent/90 rounded-lg font-semibold"
          >
            Enter the Lounge
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

