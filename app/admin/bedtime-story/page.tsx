import { LoungeShell } from "@/components/lounge-shell";
import { RainBg } from "@/components/rain-bg";
import { BedtimeStoryPicker } from "@/components/bedtime-story-picker";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BedtimeStoryPage() {
  return (
    <main className="relative min-h-screen">
      <RainBg />
      <LoungeShell
        title="Daily Bedtime Story"
        action={
          <Button variant="ghost" asChild>
            <Link href="/admin">← Back to Admin</Link>
          </Button>
        }
      >
        <BedtimeStoryPicker />
      </LoungeShell>
    </main>
  );
}

