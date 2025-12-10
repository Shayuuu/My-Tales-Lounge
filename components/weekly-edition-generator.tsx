"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function WeeklyEditionGenerator() {
  const [generating, setGenerating] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const generate = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/weekly-edition");
      const data = await response.json();
      if (data.success) {
        setUrl(data.url);
      }
    } catch (error) {
      console.error("Error generating edition:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-400">
        Generate a weekly PDF zine of top 10 stories
      </p>
      <Button onClick={generate} disabled={generating}>
        <FileText size={16} className="mr-2" />
        {generating ? "Generating..." : "Generate Weekly Edition"}
      </Button>
      {url && (
        <div className="p-3 bg-lounge-soft/50 rounded-lg">
          <p className="text-sm text-lounge-accent">
            Edition generated! <a href={url} target="_blank" className="underline">View</a>
          </p>
        </div>
      )}
    </div>
  );
}

