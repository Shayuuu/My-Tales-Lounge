"use client";

import { useEffect, useState } from "react";
import { Flame, Heart } from "lucide-react";

export function StreakCounter() {
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(0);

  useEffect(() => {
    // Load from localStorage
    const savedStreak = localStorage.getItem("reading-streak");
    const savedHearts = localStorage.getItem("hearts-given");
    const lastVisit = localStorage.getItem("last-visit-date");
    
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
      // Check if consecutive day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastVisit === yesterdayStr) {
        // Consecutive day - increment streak
        const newStreak = (parseInt(savedStreak || "0") + 1);
        setStreak(newStreak);
        localStorage.setItem("reading-streak", newStreak.toString());
      } else if (lastVisit && lastVisit !== today) {
        // Missed a day - reset streak
        setStreak(1);
        localStorage.setItem("reading-streak", "1");
      } else {
        // First visit
        setStreak(1);
        localStorage.setItem("reading-streak", "1");
      }
      
      localStorage.setItem("last-visit-date", today);
    } else {
      // Same day - keep current streak
      setStreak(parseInt(savedStreak || "0"));
    }
    
    setHearts(parseInt(savedHearts || "0"));
    
    // Listen for heart reactions
    const handleHeart = () => {
      const current = parseInt(localStorage.getItem("hearts-given") || "0");
      const newCount = current + 1;
      setHearts(newCount);
      localStorage.setItem("hearts-given", newCount.toString());
    };
    
    window.addEventListener("heart-given", handleHeart);
    return () => window.removeEventListener("heart-given", handleHeart);
  }, []);

  if (streak === 0 && hearts === 0) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-neutral-300">
      {streak > 0 && (
        <div className="flex items-center gap-1.5">
          <Flame className="text-orange-400" size={14} />
          <span className="whitespace-nowrap">{streak} nights</span>
        </div>
      )}
      {hearts > 0 && (
        <div className="flex items-center gap-1.5">
          <Heart className="text-pink-400" size={14} />
          <span className="whitespace-nowrap">{hearts} hearts</span>
        </div>
      )}
    </div>
  );
}

