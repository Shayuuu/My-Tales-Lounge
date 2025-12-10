type StubResult<T = any> = Promise<{ data: T; error: null }>;

function makeQueryBuilder() {
  const qb: any = {
    select: () => qb,
    eq: () => qb,
    gt: () => qb,
    lt: () => qb,
    order: () => qb,
    limit: () => qb,
    contains: () => qb,
    single: (): StubResult => Promise.resolve({ data: null, error: null }),
    upsert: (): StubResult => Promise.resolve({ data: null, error: null }),
    insert: (): StubResult => Promise.resolve({ data: null, error: null }),
    update: (): StubResult => Promise.resolve({ data: null, error: null }),
    delete: (): StubResult => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: null, error: null }),
  };
  return qb;
}

export function createClient() {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      signUp: () => Promise.resolve({ data: null, error: null }),
      signInWithOtp: () => Promise.resolve({ data: null, error: null }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      exchangeCodeForSession: () => Promise.resolve({ data: null, error: null }),
    },
    from: () => makeQueryBuilder(),
    storage: {
      from: () => ({
        upload: (): StubResult => Promise.resolve({ data: null, error: null }),
        getPublicUrl: (_path: string) => ({ data: { publicUrl: "" } }),
      }),
    },
  };
}
