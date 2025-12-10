"use client";

import { GENRES, type GenreId } from "@/lib/genres";
import { motion } from "framer-motion";
import { useState } from "react";

export function GenreCoasters({
  selected,
  onSelect,
  required = false,
}: {
  selected?: GenreId;
  onSelect: (genre: GenreId) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-neutral-200">
        Choose a Genre {required && <span className="text-lounge-accent">*</span>}
      </label>
      <div className="grid grid-cols-4 gap-3">
        {GENRES.map((genre) => (
          <motion.button
            key={genre.id}
            type="button"
            onClick={() => onSelect(genre.id)}
            className={`
              relative p-4 rounded-lg border-2 transition-all
              ${selected === genre.id
                ? "border-lounge-accent bg-lounge-accent/20 shadow-lg scale-105"
                : "border-white/10 bg-lounge-soft/50 hover:border-white/20 hover:bg-lounge-soft"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: selected === genre.id ? `0 0 20px ${genre.color}40` : undefined,
            }}
          >
            <div className="text-3xl mb-1">{genre.icon}</div>
            <div className="text-xs font-medium text-center">{genre.name}</div>
            {selected === genre.id && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-lounge-accent rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function GenreFilter({
  selected,
  onSelect,
}: {
  selected?: GenreId;
  onSelect: (genre: GenreId | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelect(null)}
        className={`
          px-4 py-2 rounded-full text-sm font-medium transition-all
          ${!selected
            ? "bg-lounge-accent text-black"
            : "bg-lounge-soft text-neutral-300 hover:bg-lounge-soft/80"
          }
        `}
      >
        All Stories
      </button>
      {GENRES.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelect(genre.id)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
            ${selected === genre.id
              ? "bg-lounge-accent text-black"
              : "bg-lounge-soft text-neutral-300 hover:bg-lounge-soft/80"
            }
          `}
        >
          <span>{genre.icon}</span>
          <span>{genre.name}</span>
        </button>
      ))}
    </div>
  );
}

