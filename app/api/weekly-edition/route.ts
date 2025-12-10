import { NextResponse } from "next/server";
import { getApprovedStories, getHotStories } from "@/lib/storage";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Get top 10 hot stories
    const hotStories = getHotStories().slice(0, 10);
    
    if (hotStories.length === 0) {
      return NextResponse.json({ error: "No stories available" }, { status: 400 });
    }

    // Generate simple HTML for PDF (you can enhance this)
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Weekly Tales - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: serif; padding: 40px; background: #f9f6f0; }
            h1 { text-align: center; color: #2a1f1a; }
            .story { margin: 40px 0; padding: 20px; border-bottom: 1px solid #ddd; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .author { color: #666; font-style: italic; }
            .content { margin-top: 15px; line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>Weekly Tales Edition</h1>
          <p style="text-align: center; color: #666;">${new Date().toLocaleDateString()}</p>
          ${hotStories.map((story: any) => `
            <div class="story">
              <div class="title">${story.title}</div>
              <div class="author">by ${story.author_name || "Unknown"}</div>
              ${story.content ? `<div class="content">${story.content.substring(0, 500)}...</div>` : ""}
            </div>
          `).join("")}
        </body>
      </html>
    `;

    // Save HTML (for now - you can use puppeteer or similar to convert to PDF)
    const editionDir = path.join(process.cwd(), "public", "editions");
    if (!fs.existsSync(editionDir)) {
      fs.mkdirSync(editionDir, { recursive: true });
    }

    const filename = `weekly-${Date.now()}.html`;
    const filepath = path.join(editionDir, filename);
    fs.writeFileSync(filepath, html);

    return NextResponse.json({
      success: true,
      url: `/editions/${filename}`,
      stories: hotStories.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

