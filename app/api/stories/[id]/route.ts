import { NextRequest, NextResponse } from "next/server";
import { getStories, saveStories } from "@/lib/storage";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Story ID is required" },
        { status: 400 }
      );
    }

    const stories = getStories();
    const filteredStories = stories.filter((s: any) => s.id !== id);

    if (filteredStories.length === stories.length) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    saveStories(filteredStories);
    console.log("Story deleted:", id);

    return NextResponse.json({ success: true, message: "Story deleted" });
  } catch (error: any) {
    console.error("Error deleting story:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

