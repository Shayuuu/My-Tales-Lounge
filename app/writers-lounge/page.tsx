import { LoungeShell } from "@/components/lounge-shell";
import { RainBg } from "@/components/rain-bg";
import { WritersLounge } from "@/components/writers-lounge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WritersLoungePage() {
  return (
    <main className="relative min-h-screen">
      <RainBg />
      <LoungeShell
        title="Writers' Lounge"
        action={
          <Button variant="ghost" asChild>
            <Link href="/">← Back to Lounge</Link>
          </Button>
        }
      >
        <WritersLounge />
      </LoungeShell>
    </main>
  );
}

