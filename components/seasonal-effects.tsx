"use client";

import { useEffect, useState } from "react";

type Season = "winter" | "spring" | "summer" | "autumn";

export function SeasonalEffects() {
  const [season, setSeason] = useState<Season>("winter");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 12 || month <= 2) setSeason("winter");
    else if (month >= 3 && month <= 5) setSeason("spring");
    else if (month >= 6 && month <= 8) setSeason("summer");
    else setSeason("autumn");
  }, []);

  if (!mounted) {
    return null; // Don't render on server
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {season === "winter" && <SnowEffect />}
      {season === "spring" && <CherryBlossomsEffect />}
      {season === "summer" && <FirefliesEffect />}
      {season === "autumn" && <LeavesEffect />}
    </div>
  );
}

function SnowEffect() {
  const flakes = Array.from({ length: 30 }, (_, i) => i);
  return (
    <>
      {flakes.map((i) => (
        <div
          key={i}
          className="absolute text-white/60 text-xs"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `snowfall ${3 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          ❄
        </div>
      ))}
      <style jsx>{`
        @keyframes snowfall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

function CherryBlossomsEffect() {
  const [petals] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 2,
    }))
  );

  return (
    <>
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute text-pink-300/40 text-xs"
          style={{
            left: `${petal.left}%`,
            top: `${petal.top}%`,
            animation: `petalfall ${petal.duration}s ease-in-out infinite`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          🌸
        </div>
      ))}
      <style jsx>{`
        @keyframes petalfall {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(50vh) translateX(20px) rotate(180deg); }
        }
      `}</style>
    </>
  );
}

function FirefliesEffect() {
  const [fireflies] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 3,
    }))
  );

  return (
    <>
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
          style={{
            left: `${firefly.left}%`,
            top: `${firefly.top}%`,
            boxShadow: "0 0 6px 2px rgba(255, 255, 0, 0.8)",
            animation: `firefly ${firefly.duration}s ease-in-out infinite`,
            animationDelay: `${firefly.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes firefly {
          0%, 100% { opacity: 0; transform: translate(0, 0); }
          25% { opacity: 1; }
          50% { opacity: 0.5; transform: translate(30px, -30px); }
          75% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

function LeavesEffect() {
  const [leaves] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 2,
    }))
  );

  return (
    <>
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute text-orange-400/50 text-xs"
          style={{
            left: `${leaf.left}%`,
            top: `${leaf.top}%`,
            animation: `leaffall ${leaf.duration}s ease-in-out infinite`,
            animationDelay: `${leaf.delay}s`,
          }}
        >
          🍂
        </div>
      ))}
      <style jsx>{`
        @keyframes leaffall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          100% { transform: translateY(100vh) translateX(50px) rotate(360deg); }
        }
      `}</style>
    </>
  );
}

