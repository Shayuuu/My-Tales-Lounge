"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, Save, MinusCircle, Combine } from "lucide-react";
import { toast } from "sonner";

type Book = {
  id: string;
  title: string;
  author_name?: string | null;
  total_chapters: number;
};

type Chapter = {
  id: string;
  book_id: string;
  title: string;
  chapter_number: number;
  page_start: number;
  page_end: number;
  reading_time_min: number;
};

export function AdminBooksList() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Record<string, Chapter[]>>({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      const resp = await fetch("/api/books/list");
      const json = await resp.json();
      const grouped: Record<string, Chapter[]> = {};
      (json.chapters || []).forEach((c: Chapter) => {
        if (!grouped[c.book_id]) grouped[c.book_id] = [];
        grouped[c.book_id].push(c);
      });
      Object.keys(grouped).forEach((k) => {
        grouped[k].sort((a, b) => a.chapter_number - b.chapter_number);
      });
      setBooks(json.books || []);
      setChapters(grouped);
      setLoading(false);
    }
    load();
  }, []);

  const move = (bookId: string, idx: number, dir: number) => {
    setChapters((prev) => {
      const list = [...(prev[bookId] || [])];
      const target = idx + dir;
      if (target < 0 || target >= list.length) return prev;
      [list[idx], list[target]] = [list[target], list[idx]];
      return { ...prev, [bookId]: list };
    });
  };

  const updateTitle = (bookId: string, idx: number, value: string) => {
    setChapters((prev) => {
      const list = [...(prev[bookId] || [])];
      list[idx] = { ...list[idx], title: value };
      return { ...prev, [bookId]: list };
    });
  };

  const save = async (bookId: string) => {
    const payload = chapters[bookId] || [];
    const resp = await fetch("/api/books/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, chapters: payload }),
    });
    if (!resp.ok) {
      const j = await resp.json();
      toast.error(j.error || "Failed to save");
      return;
    }
    toast.success("Chapters updated");
  };

  const remove = (bookId: string, idx: number) => {
    setChapters((prev) => {
      const list = [...(prev[bookId] || [])];
      list.splice(idx, 1);
      return { ...prev, [bookId]: list };
    });
  };

  const mergeWithPrev = (bookId: string, idx: number) => {
    setChapters((prev) => {
      const list = [...(prev[bookId] || [])];
      if (idx <= 0) return prev;
      const prevCh = list[idx - 1];
      const cur = list[idx];
      const merged = {
        ...prevCh,
        title: `${prevCh.title} · ${cur.title}`,
        page_end: Math.max(prevCh.page_end, cur.page_end),
        reading_time_min: prevCh.reading_time_min + cur.reading_time_min,
      };
      list.splice(idx - 1, 2, merged);
      return { ...prev, [bookId]: list };
    });
  };

  if (loading) {
    return <p className="text-neutral-400">Loading auto books…</p>;
  }

  if (books.length === 0) {
    return <p className="text-neutral-400">No auto-split books yet.</p>;
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Card key={book.id} className="bg-lounge-card border border-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">{book.author_name || "Anon"}</p>
              <h3 className="text-lg font-semibold">{book.title}</h3>
            </div>
            <Button size="sm" variant="outline" onClick={() => save(book.id)}>
              <Save size={16} className="mr-1" /> Save
            </Button>
          </div>
          <div className="space-y-2">
            {(chapters[book.id] || []).map((ch, idx) => (
              <div
                key={ch.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-lounge-soft/50 border border-white/5"
              >
                <div className="flex flex-col gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => move(book.id, idx, -1)}
                  >
                    <ArrowUp size={14} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => move(book.id, idx, 1)}
                  >
                    <ArrowDown size={14} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-amber-300"
                    onClick={() => mergeWithPrev(book.id, idx)}
                    title="Merge with previous"
                  >
                    <Combine size={14} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-red-300"
                    onClick={() => remove(book.id, idx)}
                    title="Delete chapter"
                  >
                    <MinusCircle size={14} />
                  </Button>
                </div>
                <div className="flex-1 space-y-1">
                  <Input
                    value={ch.title}
                    onChange={(e) => updateTitle(book.id, idx, e.target.value)}
                    className="bg-black/30"
                  />
                  <p className="text-xs text-neutral-500">
                    Pages {ch.page_start + 1}–{ch.page_end + 1} · {ch.reading_time_min} min
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

