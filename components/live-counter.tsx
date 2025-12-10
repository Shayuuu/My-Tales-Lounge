"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export function LiveCounter() {
  const [count, setCount] = useState(1); // Start with 1 (you)

  useEffect(() => {
    // Simple visitor counter - increments on page load
    // In a real app, you'd use a proper analytics service
    const stored = localStorage.getItem("visitor_id");
    if (!stored) {
      localStorage.setItem("visitor_id", crypto.randomUUID());
    }
    
    // Simulate visitor count (you can enhance this later)
    setCount(Math.floor(Math.random() * 10) + 1);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-xs text-neutral-300">
      <Users size={14} />
      <span className="whitespace-nowrap">{count} in lounge</span>
    </div>
  );
}

