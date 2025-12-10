"use client";

import { LoungeShell } from "@/components/lounge-shell";
import { RainBg } from "@/components/rain-bg";
import { Button } from "@/components/ui/button";
import { InfiniteFeed } from "@/components/infinite-feed";
import { TonightSpecial } from "@/components/tonight-special";
import { SeasonalEffects } from "@/components/seasonal-effects";
import { HeaderControls } from "@/components/header-controls";
import { HappyQuote } from "@/components/happy-quote";
import { NextChapterBanner } from "@/components/next-chapter-banner";
import { PersonalizedHome } from "@/components/personalized-home";
import { BedtimeStoryBanner } from "@/components/bedtime-story-banner";
import { OneMoreChapter } from "@/components/one-more-chapter";
import { MidnightDrop } from "@/components/midnight-drop";
import { WelcomeScreen } from "@/components/welcome-screen";
import { SessionCelebration } from "@/components/session-celebration";
import { RainSound } from "@/components/rain-sound";
import { useAuth } from "@/components/auth/auth-provider";
import { getFeaturedStory } from "@/lib/storage";
import Link from "next/link";

export default function Page() {
  const { user } = useAuth();
  const featuredStory = getFeaturedStory();

  return (
    <main className="relative min-h-screen">
      <RainBg />
      <RainSound />
      <SeasonalEffects />
      <WelcomeScreen />
      <BedtimeStoryBanner />
      <MidnightDrop />
      <SessionCelebration />
      <HeaderControls />
      <LoungeShell
        title="Welcome to the cozy lounge"
        action={
          <div className="flex items-center gap-3">
            {user && (
              <>
                <Button asChild className="bg-lounge-accent hover:bg-lounge-accent/90">
                  <Link href="/admin">Write a Tale</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                  <Link href="/my-shelf">📚 My Shelf</Link>
                </Button>
              </>
            )}
          </div>
        }
      >
        <NextChapterBanner />
        {user && <PersonalizedHome />}
        {featuredStory && <TonightSpecial story={featuredStory} />}
        {user && <OneMoreChapter />}
        <p className="text-neutral-300 max-w-2xl">
          Curl up with a mug. Approved tales flow below. Reactions: ❤️ ☕
        </p>
        <InfiniteFeed />
        <div className="mt-12 pt-8 border-t border-white/5">
          <HappyQuote />
        </div>
      </LoungeShell>
    </main>
  );
}
