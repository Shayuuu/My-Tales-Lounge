import { NextRequest, NextResponse } from "next/server";
import { getApprovedStories, addStory, getFeaturedStory } from "@/lib/storage";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "6");
    const genre = searchParams.get("genre");

    let allStories = getApprovedStories(genre || undefined);
    console.log("Total approved stories:", allStories.length);
    
    // Exclude featured story from main feed (it's shown separately)
    const featured = getFeaturedStory();
    if (featured) {
      allStories = allStories.filter((s: any) => s.id !== featured.id);
    }
    
    // Sort by created_at descending
    allStories.sort((a: any, b: any) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });

    // Paginate
    const start = page * pageSize;
    const end = start + pageSize;
    const stories = allStories.slice(start, end);
    const hasMore = end < allStories.length;

    console.log(`Page ${page}: Returning ${stories.length} stories, hasMore: ${hasMore}`);
    return NextResponse.json({ stories, hasMore });
  } catch (error: any) {
    console.error("Error in GET /api/stories:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const author_name = formData.get("author_name") as string || "You";
    const author_username = formData.get("author_username") as string || "author";
    const genre = formData.get("genre") as string || "slice-of-life";
    const curator_note = formData.get("curator_note") as string || null;
    const pdf = formData.get("pdf") as File | null;

    let pdfUrl: string | null = null;

    // Handle PDF upload
    if (pdf && pdf.size > 0) {
      if (pdf.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "PDF too large (max 10MB)" },
          { status: 400 }
        );
      }

      const bytes = await pdf.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const timestamp = Date.now();
      const filename = `${timestamp}-${pdf.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      
      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const filepath = path.join(uploadsDir, filename);
      fs.writeFileSync(filepath, buffer);
      pdfUrl = `/uploads/${filename}`;
    }

    const storyContent = content?.trim() || null;
    
    if (!storyContent && !pdfUrl) {
      return NextResponse.json(
        { error: "Please provide either story text or a PDF" },
        { status: 400 }
      );
    }

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const story = addStory({
      title: title.trim(),
      content: storyContent,
      pdf_url: pdfUrl,
      cover_url: null,
      author_name: author_name?.trim() || "You",
      author_username: author_username?.trim() || "author",
      genre: genre,
      curator_note: curator_note,
      mood_color: null,
    });

    console.log("Story published:", story.id);
    return NextResponse.json({ success: true, story });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

