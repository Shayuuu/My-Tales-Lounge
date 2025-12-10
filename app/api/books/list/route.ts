import { NextResponse } from "next/server";
import { readBooks, readChapters } from "@/lib/books-storage";

export const runtime = "nodejs";

export async function GET() {
  const books = readBooks();
  const chapters = readChapters();
  return NextResponse.json({ books, chapters });
}

