import * as React from "react";
import { cn } from "./utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-white/5 rounded", className)}
      {...props}
    />
  );
}

