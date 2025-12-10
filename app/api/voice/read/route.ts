import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storyId, text, position } = await request.json();

    // Check if audio already exists
    const { data: existing } = await supabase
      .from("voice_audio_cache")
      .select("audio_url")
      .eq("story_id", storyId)
      .single();

    if (existing?.audio_url) {
      return NextResponse.json({ audioUrl: existing.audio_url });
    }

    // Generate audio using ElevenLabs API
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "Voice API not configured" },
        { status: 500 }
      );
    }

    // Use ElevenLabs text-to-speech
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text.substring(0, 5000), // Limit text length
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate audio");
    }

    const audioBuffer = await response.arrayBuffer();
    
    // Upload to Supabase Storage
    const fileName = `${storyId}-${Date.now()}.mp3`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("voice-audio")
      .upload(fileName, audioBuffer, {
        contentType: "audio/mpeg",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("voice-audio").getPublicUrl(fileName);

    // Cache the URL
    await supabase.from("voice_audio_cache").insert({
      story_id: storyId,
      audio_url: publicUrl,
    });

    return NextResponse.json({ audioUrl: publicUrl });
  } catch (error: any) {
    console.error("Voice reading error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

