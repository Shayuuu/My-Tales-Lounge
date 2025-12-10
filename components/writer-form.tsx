"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export function WriterForm() {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const supabase = createClient();
    let pdfUrl: string | null = null;

    const pdf = formData.get("pdf") as File | null;
    if (pdf && pdf.size > 0) {
      if (pdf.size > 10 * 1024 * 1024) {
        setStatus("PDF too large (max 10MB).");
        setPending(false);
        return;
      }

      const filePath = `submissions/${Date.now()}-${pdf.name}`;
      const { error, data } = await supabase.storage
        .from("story-pdfs")
        .upload(filePath, pdf, { upsert: true });

      if (error) {
        setStatus("Upload failed. Please try again.");
        setPending(false);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("story-pdfs")
        .getPublicUrl(data.path);
      pdfUrl = publicUrl.publicUrl;
    }

    const storyText = formData.get("story_text") as string;
    if (!storyText && !pdfUrl) {
      setStatus("Please provide either story text or a PDF.");
      setPending(false);
      return;
    }

    const { error } = await supabase.from("submissions").insert({
      name: formData.get("name"),
      username: formData.get("username"),
      message: formData.get("message") || null,
      story_text: storyText || null,
      pdf_url: pdfUrl,
      status: "pending",
    });

    if (error) {
      setStatus("Could not submit. Please try again.");
    } else {
      setStatus("Submitted! We'll review your tale soon.");
      form.reset();
    }

    setPending(false);
  };

  return (
    <Card className="border border-white/5 bg-lounge-card shadow-soft p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Your name"
          />
        </div>
        <div>
          <Label htmlFor="username">Desired @username</Label>
          <Input
            id="username"
            name="username"
            required
            placeholder="username"
          />
        </div>
        <div>
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us your vibe..."
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="story_text">Paste story text</Label>
          <Textarea
            id="story_text"
            name="story_text"
            placeholder="Paste your tale here..."
            rows={6}
          />
        </div>
        <div>
          <Label htmlFor="pdf">Or upload PDF (max 10MB)</Label>
          <Input
            id="pdf"
            name="pdf"
            type="file"
            accept="application/pdf"
          />
        </div>
        <Button disabled={pending} className="w-full">
          {pending ? "Sending..." : "Submit to Lounge"}
        </Button>
        {status && (
          <p className="text-sm text-lounge-accent text-center">{status}</p>
        )}
      </form>
    </Card>
  );
}

