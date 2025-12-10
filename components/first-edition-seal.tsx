"use client";

import { motion } from "framer-motion";

export function FirstEditionSeal() {
  return (
    <motion.div
      className="absolute -top-2 -right-2 z-10"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300">
          <div className="text-center text-yellow-900 font-bold text-xs leading-tight">
            <div>FIRST</div>
            <div>EDITION</div>
          </div>
        </div>
        <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-pulse" />
      </div>
    </motion.div>
  );
}

