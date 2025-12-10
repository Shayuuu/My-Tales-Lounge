import { NextRequest, NextResponse } from "next/server";
import { readChapters, saveChapters } from "@/lib/books-storage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { bookId, chapters } = await req.json();
    if (!bookId || !Array.isArray(chapters)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const existing = readChapters();
    const filtered = existing.filter((c) => c.book_id !== bookId);
    const updated = chapters.map((c: any, idx: number) => ({
      ...c,
      chapter_number: idx + 1,
      book_id: bookId,
    }));
    saveChapters([...filtered, ...updated]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update chapters" },
      { status: 500 }
    );
  }
}

