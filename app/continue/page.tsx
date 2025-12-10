import { LoungeShell } from "@/components/lounge-shell";
import { RainBg } from "@/components/rain-bg";
import { ContinueReadingList } from "@/components/continue-reading-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContinuePage() {
  return (
    <main className="relative min-h-screen">
      <RainBg />
      <LoungeShell
        title="Continue Reading"
        action={
          <Button variant="ghost" asChild>
            <Link href="/">← Back to Lounge</Link>
          </Button>
        }
      >
        <ContinueReadingList />
      </LoungeShell>
    </main>
  );
}

