"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

export function AuthButton() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    const supabase = createClient();
    const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || "";
    await supabase.auth.signInWithOtp({
      email: ownerEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    alert("Check your email for the magic link!");
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  if (loading) return null;

  if (session) {
    return (
      <Button variant="ghost" size="sm" onClick={signOut}>
        <LogOut size={16} className="mr-2" />
        Sign Out
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={signIn}>
      <LogIn size={16} className="mr-2" />
      Sign In
    </Button>
  );
}

