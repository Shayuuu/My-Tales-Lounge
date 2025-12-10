"use client";

import { useState, useEffect } from "react";
import { InstantPublishForm } from "./instant-publish-form";
import { Card } from "@/components/ui/card";

export function WritersLounge() {
  const [approvedCount, setApprovedCount] = useState(0);

  useEffect(() => {
    async function loadCount() {
      try {
        const response = await fetch("/api/stories?page=0&pageSize=1000");
        const data = await response.json();
        if (data.stories) {
          setApprovedCount(data.stories.length);
        }
      } catch (error) {
        console.error("Error loading story count:", error);
      }
    }
    loadCount();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-lounge-card border-lounge-accent/20">
        <h2 className="text-xl font-semibold mb-2">Welcome, Writer!</h2>
        <p className="text-neutral-300 mb-4">
          You've been approved! Share your stories instantly here.
        </p>
        <div className="text-sm text-neutral-400">
          <p>Your stories published: {approvedCount}</p>
        </div>
      </Card>

      <Card className="p-6 bg-lounge-card">
        <h2 className="text-xl font-semibold mb-4">Publish New Story</h2>
        <InstantPublishForm />
      </Card>

      <Card className="p-6 bg-lounge-card">
        <h2 className="text-xl font-semibold mb-4">Writer Chat</h2>
        <div className="space-y-3">
          <div className="p-3 bg-lounge-soft/50 rounded-lg">
            <p className="text-sm text-neutral-300">
              Chat feature coming soon! Connect with other writers here.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

