import { LoungeShell } from "@/components/lounge-shell";
import { RainBg } from "@/components/rain-bg";
import { MyBookshelf } from "@/components/my-bookshelf";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyShelfPage() {
  return (
    <main className="relative min-h-screen">
      <RainBg />
      <LoungeShell
        title="My Bookshelf"
        action={
          <Button variant="ghost" asChild>
            <Link href="/">← Back to Lounge</Link>
          </Button>
        }
      >
        <MyBookshelf />
      </LoungeShell>
    </main>
  );
}

