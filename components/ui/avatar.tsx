import * as React from "react";
import { cn } from "./utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
}

export function Avatar({ className, src, alt, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-lounge-soft",
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-lounge-accent/20 flex items-center justify-center text-lounge-accent text-sm font-medium">
          {alt?.[0]?.toUpperCase() || "?"}
        </div>
      )}
    </div>
  );
}

