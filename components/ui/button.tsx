import * as React from "react";
import { cn } from "./utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const buttonVariants = {
  variant: {
    default: "bg-lounge-accent text-black hover:opacity-90 shadow-soft",
    ghost: "bg-transparent hover:bg-lounge-soft text-lounge-accent",
    outline: "border border-lounge-accent/40 text-lounge-accent hover:bg-lounge-soft",
    danger: "bg-red-500 text-white hover:bg-red-600",
  },
  size: {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-12 px-5 text-base",
  },
};

export function Button({
  className,
  variant = "default",
  size = "md",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? "div" : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-lounge-bg",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      {...props}
    />
  );
}

