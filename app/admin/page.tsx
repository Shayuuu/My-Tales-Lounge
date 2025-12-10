import { LoungeShell } from "@/components/lounge-shell";
import { RainBg } from "@/components/rain-bg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InstantPublishForm } from "@/components/instant-publish-form";
import { AdminStoryList } from "@/components/admin-story-list";
import { FeaturedStoryManager } from "@/components/featured-story-manager";
import { WeeklyEditionGenerator } from "@/components/weekly-edition-generator";
import { AdminBooksList } from "@/components/admin-books-list";

export default function AdminPage() {
  return (
    <main className="relative min-h-screen">
      <RainBg />
      <LoungeShell
        title="Admin Lounge"
        action={
          <Button variant="ghost" asChild>
            <Link href="/">← Back to Lounge</Link>
          </Button>
        }
      >
        <div className="space-y-6">
          <div className="bg-lounge-card border border-white/5 rounded-xl p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Publish Your Story</h2>
            <InstantPublishForm />
          </div>
          
          <div className="bg-lounge-card border border-white/5 rounded-xl p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Tonight's Special</h2>
            <FeaturedStoryManager />
          </div>
          
          <div className="bg-lounge-card border border-white/5 rounded-xl p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Weekly Edition</h2>
            <WeeklyEditionGenerator />
          </div>
          
          <div className="bg-lounge-card border border-white/5 rounded-xl p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Manage Stories</h2>
            <p className="text-sm text-neutral-400 mb-4">
              All published stories. Click delete to remove.
            </p>
            <AdminStoryList />
          </div>

          <div className="bg-lounge-card border border-white/5 rounded-xl p-6 shadow-soft">
            <h2 className="text-xl font-semibold mb-4">Auto PDF Books</h2>
            <p className="text-sm text-neutral-400 mb-4">
              Review auto-detected chapters, rename and reorder, then save.
            </p>
            <AdminBooksList />
          </div>
        </div>
      </LoungeShell>
    </main>
  );
}

