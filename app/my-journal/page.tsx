import { LoungeShell } from "@/components/lounge-shell";
import { RainBg } from "@/components/rain-bg";
import { JournalView } from "@/components/journal-view";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyJournalPage() {
  return (
    <main className="relative min-h-screen">
      <RainBg />
      <LoungeShell
        title="Your Journal"
        action={
          <Button variant="ghost" asChild>
            <Link href="/">← Back to Lounge</Link>
          </Button>
        }
      >
        <JournalView />
      </LoungeShell>
    </main>
  );
}

