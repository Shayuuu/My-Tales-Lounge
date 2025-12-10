"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CandlelightModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("candlelight-mode");
    if (saved === "true") {
      setEnabled(true);
      document.documentElement.classList.add("candlelight-mode");
    }
  }, []);

  const toggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    localStorage.setItem("candlelight-mode", newState.toString());
    
    if (newState) {
      document.documentElement.classList.add("candlelight-mode");
    } else {
      document.documentElement.classList.remove("candlelight-mode");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={`w-full justify-start ${enabled ? "text-amber-300" : ""}`}
    >
      <Flame size={16} className="mr-2" />
      <span className="text-sm">{enabled ? "Candlelight" : "Normal"}</span>
    </Button>
  );
}

