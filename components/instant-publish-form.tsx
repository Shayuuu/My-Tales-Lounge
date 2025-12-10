"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GenreCoasters, type GenreId } from "@/components/genre-coasters";

export function InstantPublishForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<GenreId>("slice-of-life");
  const [curatorNote, setCuratorNote] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error || "Could not publish. Please try again.");
        console.error("Publish error:", data);
      } else {
        setStatus("Published! Redirecting...");
        form.reset();
        
        // Dispatch event to refresh the feed
        window.dispatchEvent(new Event("storyPublished"));
        
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      setStatus("Could not publish. Please try again.");
    }

    setPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Story title"
        />
      </div>
      <GenreCoasters
        selected={selectedGenre}
        onSelect={setSelectedGenre}
        required
      />
      <input type="hidden" name="genre" value={selectedGenre} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author_name">Author Name</Label>
          <Input
            id="author_name"
            name="author_name"
            placeholder="Your name"
            defaultValue="You"
          />
        </div>
        <div>
          <Label htmlFor="author_username">@username</Label>
          <Input
            id="author_username"
            name="author_username"
            placeholder="username"
            defaultValue="author"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="content">Story text</Label>
        <Textarea
          id="content"
          name="content"
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
      <div>
        <Label htmlFor="curator_note">Curator Note (optional)</Label>
        <Input
          id="curator_note"
          name="curator_note"
          placeholder="A handwritten note for readers..."
          value={curatorNote}
          onChange={(e) => setCuratorNote(e.target.value)}
        />
      </div>
      <Button disabled={pending} className="w-full">
        {pending ? "Publishing..." : "Publish Instantly"}
      </Button>
      {status && (
        <p className="text-sm text-lounge-accent text-center">{status}</p>
      )}
    </form>
  );
}

