"use client";

import { ReactNode, useMemo } from "react";
import { createClient } from "@/lib/supabase-client";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

export function SessionProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}

