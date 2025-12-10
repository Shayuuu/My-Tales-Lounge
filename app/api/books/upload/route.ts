import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import pdfParse from "pdf-parse";
import { addBookWithChapters } from "@/lib/books-storage";

function makeCoverPlaceholder(title: string) {
  const safe = encodeURIComponent(title.slice(0, 40) || "Cozy Tale");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%2321293a' offset='0'/><stop stop-color='%23344b61' offset='1'/></linearGradient></defs><rect width='600' height='900' fill='url(%23g)'/><text x='50%' y='50%' fill='%23e2d5c3' font-size='42' font-family='Georgia,serif' text-anchor='middle'>${safe}</text><text x='50%' y='65%' fill='%23c9b89f' font-size='22' font-family='Georgia,serif' text-anchor='middle'>My Tales Lounge</text></svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
}

// Regex patterns for headings
const headingRegexes = [
  /(?:^|\s)(chapter\s+\d+)(?=$|\s|:)/i,
  /(?:^|\s)(chapter\s+one)/i,
  /(?:^|\s)(chap\.\s*\d+)/i,
  /(?:^|\s)(ch\.\s*\d+)/i,
  /^(?:\d+)\.\s+.+/i,
  /^(?:\d+)\s*[–-]\s*.+/i,
  /^(prologue|epilogue|part\s+one|part\s+i|part\s+\d+|part\s+[ivxlc]+)$/i,
];

function detectHeadings(pages: string[]) {
  const hits: { page: number; title: string }[] = [];
  pages.forEach((text, idx) => {
    const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    for (const line of lines.slice(0, 10)) {
      if (headingRegexes.some((re) => re.test(line))) {
        hits.push({ page: idx, title: line });
        break;
      }
    }
  });
  return hits;
}

function buildChapters(pages: string[]) {
  const headings = detectHeadings(pages);
  const chapterStarts =
    headings.length > 0
      ? headings.map((h) => ({ page: h.page, title: h.title }))
      : Array.from({ length: Math.ceil(pages.length / 15) }, (_, i) => ({
          page: i * 15,
          title: `Part ${i + 1}`,
        }));

  const chapters = chapterStarts.map((h, idx) => {
    const start = h.page;
    const end =
      idx + 1 < chapterStarts.length
        ? Math.max(chapterStarts[idx + 1].page - 1, start)
        : pages.length - 1;
    const title =
      h.title && h.title.trim().length > 0
        ? h.title
        : `Chapter ${idx + 1}`;
    const text = pages.slice(start, end + 1).join(" ");
    const words = text.split(/\s+/).filter(Boolean).length;
    const reading_time_min = Math.max(1, Math.round(words / 200));
    return {
      title,
      chapter_number: idx + 1,
      page_start: start,
      page_end: end,
      reading_time_min,
      status: "released" as const,
      release_date: null,
    };
  });

  const blurbText = pages[chapterStarts[0].page] || "";
  const blurb = blurbText.trim().slice(0, 300);

  return { chapters, blurb };
}

export const runtime = "nodejs"; // pdf-parse needs node

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("pdf") as File | null;
    const title = (form.get("title") as string) || "Untitled";
    const author = (form.get("author") as string) || "Anon";

    if (!file) {
      return NextResponse.json({ error: "No PDF provided" }, { status: 400 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF too large (max 50MB)" }, { status: 400 });
    }

    // Save PDF to public/uploads
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const dest = path.join(uploadsDir, filename);
    fs.writeFileSync(dest, buffer);
    const pdfUrl = `/uploads/${filename}`;

    // Parse PDF
    const parsed = await pdfParse(buffer, { pagerender: undefined });
    const pages = parsed.text
      .split(/\f/) // form feed between pages
      .map((p) => p.trim());

    const { chapters, blurb } = buildChapters(pages);

    const cover_url = makeCoverPlaceholder(title);

    const { book, chapters: savedChapters } = addBookWithChapters(
      {
        title,
        author_name: author,
        pdf_url: pdfUrl,
        cover_url,
        blurb,
        total_chapters: chapters.length,
      },
      chapters.map((c) => ({
        ...c,
        pdf_url: pdfUrl,
      }))
    );

    return NextResponse.json({ book, chapters: savedChapters });
  } catch (error: any) {
    console.error("Upload parse error", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process PDF" },
      { status: 500 }
    );
  }
}

