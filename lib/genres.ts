export const GENRES = [
  { id: "mystery", name: "Mystery", icon: "🥃", color: "#8B4513", tint: "rgba(139, 69, 19, 0.1)" },
  { id: "romance", name: "Romance", icon: "🍷", color: "#DC143C", tint: "rgba(220, 20, 60, 0.1)" },
  { id: "horror", name: "Horror", icon: "🖤", color: "#1a1a1a", tint: "rgba(0, 0, 0, 0.2)" },
  { id: "slice-of-life", name: "Slice of Life", icon: "☕", color: "#D2691E", tint: "rgba(210, 105, 30, 0.1)" },
  { id: "fantasy", name: "Fantasy", icon: "✨", color: "#9370DB", tint: "rgba(147, 112, 219, 0.1)" },
  { id: "sci-fi", name: "Sci-Fi", icon: "🚀", color: "#00CED1", tint: "rgba(0, 206, 209, 0.1)" },
  { id: "poetry", name: "Poetry", icon: "✒️", color: "#FF69B4", tint: "rgba(255, 105, 180, 0.1)" },
  { id: "true-story", name: "True Story", icon: "🕯️", color: "#FFD700", tint: "rgba(255, 215, 0, 0.1)" },
] as const;

export type GenreId = typeof GENRES[number]["id"];

export function getGenre(id: GenreId) {
  return GENRES.find(g => g.id === id);
}

