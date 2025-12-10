"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase-client";

type Submission = {
  id: string;
  name: string | null;
  username: string | null;
  message: string | null;
  story_text: string | null;
  pdf_url: string | null;
  created_at: string;
};

export function AdminSubmissionCard({
  sub,
  onChange,
}: {
  sub: Submission;
  onChange: () => void;
}) {
  const router = useRouter();

  const approve = async () => {
    const supabase = createClient();
    
    // Insert into stories table
    const { error: insertError } = await supabase.from("stories").insert({
      title: sub.message || `Tale from ${sub.name}` || "Untitled Tale",
      content: sub.story_text,
      pdf_url: sub.pdf_url,
      cover_url: null,
      author_name: sub.name,
      author_username: sub.username,
      mood_color: null,
      likes: 0,
      coffees: 0,
      is_approved: true,
    });

    if (insertError) {
      alert("Error approving: " + insertError.message);
      return;
    }

    // Delete from submissions
    await supabase.from("submissions").delete().eq("id", sub.id);
    router.refresh();
    onChange();
  };

  const reject = async () => {
    const supabase = createClient();
    await supabase
      .from("submissions")
      .update({ status: "rejected" })
      .eq("id", sub.id);
    router.refresh();
    onChange();
  };

  return (
    <Card className="bg-lounge-card border border-white/5 shadow-soft p-5 space-y-3">
      <div className="flex justify-between text-sm text-neutral-400">
        <span>@{sub.username}</span>
        <span>{new Date(sub.created_at).toLocaleString()}</span>
      </div>
      <p className="text-lg font-semibold">{sub.name}</p>
      {sub.message && (
        <p className="text-neutral-200">{sub.message}</p>
      )}
      {sub.story_text && (
        <pre className="whitespace-pre-wrap text-sm bg-black/30 p-3 rounded-lg max-h-64 overflow-auto">
          {sub.story_text}
        </pre>
      )}
      {sub.pdf_url && (
        <Button variant="outline" asChild>
          <a href={sub.pdf_url} target="_blank" rel="noreferrer">
            Open PDF
          </a>
        </Button>
      )}
      <div className="flex gap-3">
        <Button
          onClick={approve}
          className="flex-1 bg-green-500 hover:bg-green-600"
        >
          Approve & Publish
        </Button>
        <Button onClick={reject} variant="danger" className="flex-1">
          Reject
        </Button>
      </div>
    </Card>
  );
}

