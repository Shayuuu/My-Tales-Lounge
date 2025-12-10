import { createBrowserClient } from "@supabase/ssr";

type StubResult<T = any> = Promise<{ data: T; error: null }>;

function makeStubTable() {
  const stub = {
    select: () => stub,
    eq: () => stub,
    gt: () => stub,
    lt: () => stub,
    order: () => stub,
    limit: () => stub,
    contains: () => stub,
    single: (): StubResult => Promise.resolve({ data: null, error: null }),
    upsert: (): StubResult => Promise.resolve({ data: null, error: null }),
    insert: (): StubResult => Promise.resolve({ data: null, error: null }),
    update: (): StubResult => Promise.resolve({ data: null, error: null }),
    delete: (): StubResult => Promise.resolve({ data: null, error: null }),
  };
  return stub;
}

function makeStubClient() {
  return {
    auth: {
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      getUser: () =>
        Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      signUp: () => Promise.resolve({ data: null, error: null }),
      signInWithOtp: () => Promise.resolve({ data: null, error: null }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      exchangeCodeForSession: () => Promise.resolve({ data: null, error: null }),
    },
    from: () => makeStubTable(),
    storage: {
      from: () => ({
        upload: (): StubResult => Promise.resolve({ data: null, error: null }),
        getPublicUrl: (_path: string) => ({ data: { publicUrl: "" } }),
      }),
    },
  };
}

export function createClient() {
  const hasEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasEnv) {
    return makeStubClient();
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
