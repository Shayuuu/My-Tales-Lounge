import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const STORIES_FILE = path.join(DATA_DIR, "stories.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure directories exist
export function ensureDirectories() {
  if (typeof window !== "undefined") return;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORIES_FILE)) {
    fs.writeFileSync(STORIES_FILE, JSON.stringify([], null, 2));
  }
}

// Read stories from file
export function getStories() {
  // Avoid running fs on the client
  if (typeof window !== "undefined") return [];
  ensureDirectories();
  try {
    const data = fs.readFileSync(STORIES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write stories to file
export function saveStories(stories: any[]) {
  if (typeof window !== "undefined") return;
  ensureDirectories();
  fs.writeFileSync(STORIES_FILE, JSON.stringify(stories, null, 2));
}

// Generate a simple ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Add a new story
export function addStory(story: any) {
  if (typeof window !== "undefined") return null;
  const stories = getStories();
  const newStory = {
    id: generateId(),
    ...story,
    genre: story.genre || "slice-of-life",
    is_featured: false,
    curator_note: story.curator_note || null,
    is_first_edition: false, // Will be set on first approval
    likes: 0,
    coffees: 0,
    chapters: story.chapters || [],
    is_approved: true,
    created_at: new Date().toISOString(),
  };
  stories.push(newStory);
  saveStories(stories);
  return newStory;
}

// Update story (for reactions)
export function updateStory(id: string, updates: any) {
  if (typeof window !== "undefined") return null;
  const stories = getStories();
  const index = stories.findIndex((s: any) => s.id === id);
  if (index !== -1) {
    stories[index] = { ...stories[index], ...updates };
    saveStories(stories);
    return stories[index];
  }
  return null;
}

// Get approved stories only
export function getApprovedStories(genre?: string) {
  if (typeof window !== "undefined") return [];
  const stories = getStories().filter((s: any) => s.is_approved === true);
  if (genre) {
    return stories.filter((s: any) => s.genre === genre);
  }
  return stories;
}

// Get featured story
export function getFeaturedStory() {
  if (typeof window !== "undefined") return null;
  const stories = getStories();
  return stories.find((s: any) => s.is_featured === true && s.is_approved === true);
}

// Set featured story
export function setFeaturedStory(storyId: string) {
  if (typeof window !== "undefined") return;
  const stories = getStories();
  // Unfeature all others
  stories.forEach((s: any) => {
    s.is_featured = s.id === storyId;
  });
  saveStories(stories);
}

// Get hot stories (high engagement in last 7 days)
export function getHotStories() {
  if (typeof window !== "undefined") return [];
  const stories = getApprovedStories();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return stories
    .filter((s: any) => new Date(s.created_at) > sevenDaysAgo)
    .map((s: any) => ({
      ...s,
      hotScore: (s.likes || 0) + (s.coffees || 0) * 2,
    }))
    .sort((a: any, b: any) => b.hotScore - a.hotScore)
    .slice(0, 5);
}

// Delete a story by ID
export function deleteStory(id: string) {
  if (typeof window !== "undefined") return false;
  const stories = getStories();
  const filteredStories = stories.filter((s: any) => s.id !== id);
  saveStories(filteredStories);
  return filteredStories.length < stories.length;
}

