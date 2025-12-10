import fs from "fs";
import path from "path";
import crypto from "crypto";

export type Book = {
  id: string;
  title: string;
  author_name?: string | null;
  pdf_url: string;
  cover_url?: string | null;
  blurb?: string | null;
  total_chapters: number;
  created_at: string;
};

export type Chapter = {
  id: string;
  book_id: string;
  title: string;
  chapter_number: number;
  page_start: number;
  page_end: number;
  reading_time_min: number;
  status: "released" | "upcoming";
  release_date?: string | null;
  pdf_url: string;
  created_at: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKS_FILE = path.join(DATA_DIR, "books.json");
const CHAPTERS_FILE = path.join(DATA_DIR, "chapters.json");

function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(BOOKS_FILE)) fs.writeFileSync(BOOKS_FILE, "[]");
  if (!fs.existsSync(CHAPTERS_FILE)) fs.writeFileSync(CHAPTERS_FILE, "[]");
}

export function readBooks(): Book[] {
  ensureFiles();
  return JSON.parse(fs.readFileSync(BOOKS_FILE, "utf-8"));
}

export function readChapters(): Chapter[] {
  ensureFiles();
  return JSON.parse(fs.readFileSync(CHAPTERS_FILE, "utf-8"));
}

export function saveBooks(books: Book[]) {
  ensureFiles();
  fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2));
}

export function saveChapters(chapters: Chapter[]) {
  ensureFiles();
  fs.writeFileSync(CHAPTERS_FILE, JSON.stringify(chapters, null, 2));
}

export function addBookWithChapters(book: Omit<Book, "id" | "created_at">, chapters: Omit<Chapter, "id" | "created_at">[]) {
  ensureFiles();
  const books = readBooks();
  const chs = readChapters();
  const bookId = crypto.randomUUID();
  const created = new Date().toISOString();
  const newBook: Book = { ...book, id: bookId, created_at: created };
  const newChapters: Chapter[] = chapters.map((c, idx) => ({
    ...c,
    id: crypto.randomUUID(),
    book_id: bookId,
    chapter_number: idx + 1,
    created_at: created,
  }));
  books.push(newBook);
  chs.push(...newChapters);
  saveBooks(books);
  saveChapters(chs);
  return { book: newBook, chapters: newChapters };
}

