"use client";

import { createContext, useContext, useState } from "react";

type AuthContextType = {
  user: null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading] = useState(false);

  const signOut = async () => {
    // no-op: Supabase removed
  };

  return (
    <AuthContext.Provider value={{ user: null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

