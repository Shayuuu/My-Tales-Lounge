import { LoungeShell } from "@/components/lounge-shell";
import { RainBg } from "@/components/rain-bg";
import { GiftView } from "@/components/gift-view";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function GiftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const giftResp = await supabase
    .from("gifted_links")
    .select("*, stories(*)")
    .eq("id", id)
    .single();
  const gift = (giftResp as any).data ?? null;

  if (!gift || new Date(gift.expires_at) < new Date()) {
    notFound();
  }

  return (
    <main className="relative min-h-screen">
      <RainBg />
      <LoungeShell title="A Gift for You">
        <GiftView gift={gift} />
      </LoungeShell>
    </main>
  );
}

