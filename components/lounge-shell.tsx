"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LoungeShell({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6 relative z-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-lounge-accent/80 mb-1">My Tales Lounge</p>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        {action}
      </div>
      <div className="bg-black/55 backdrop-blur-sm border border-white/5 rounded-2xl p-4 sm:p-6 shadow-soft">
        {children}
      </div>
    </div>
  );
}

