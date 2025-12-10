import { NextRequest, NextResponse } from "next/server";
import { updateStory, getStories } from "@/lib/storage";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { type } = await request.json();
    const { id } = await params;

    if (!type || (type !== "like" && type !== "coffee")) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    const stories = getStories();
    const story = stories.find((s: any) => s.id === id);

    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    const field = type === "like" ? "likes" : "coffees";
    const currentValue = story[field] || 0;

    const updated = updateStory(id, {
      [field]: currentValue + 1,
    });

    return NextResponse.json({ success: true, story: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

