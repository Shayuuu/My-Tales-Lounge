# My Tales Lounge

A cozy, production-ready Next.js 15 web app for sharing stories with a beautiful dark lounge aesthetic.

## Features

- 🌧️ Ambient rain animation
- 🎷 Optional jazz background music
- ❤️☕ Simple reactions (heart and coffee)
- 📄 PDF story support
- 👤 Owner-only instant publishing
- 📝 Writer submission system with admin approval
- 📊 Live visitor counter
- ♾️ Infinite scroll feed

## Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** for styling
- **Supabase** (Auth + Database + Storage)
- **shadcn/ui** components
- **Framer Motion** for animations
- **Lucide Icons**

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this secure!)

### 3. Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Create a new bucket named `story-pdfs`
3. Make it **public** (or configure RLS policies)

### 4. Set Up Database

Run the SQL from `supabase-setup.sql` in the Supabase SQL Editor, or copy-paste this:

```sql
-- Stories table
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  pdf_url text,
  cover_url text,
  author_name text,
  author_username text,
  mood_color text,
  likes int default 0,
  coffees int default 0,
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- Submissions table
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text not null,
  message text,
  story_text text,
  pdf_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- Profiles table (for owner)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null
);

-- Insert owner profile (replace with your email)
insert into profiles (email) 
values ('your-email@example.com') 
on conflict (email) do nothing;

-- Enable Row Level Security
alter table stories enable row level security;
alter table submissions enable row level security;

-- Policies: Stories are readable by everyone, writable by authenticated users
create policy "Stories are viewable by everyone" on stories
  for select using (is_approved = true);

create policy "Authenticated users can insert stories" on stories
  for insert with check (true);

create policy "Authenticated users can update stories" on stories
  for update using (true);

-- Policies: Submissions are readable/writable by authenticated users
create policy "Authenticated users can view submissions" on submissions
  for select using (true);

create policy "Anyone can submit" on submissions
  for insert with check (true);

create policy "Authenticated users can update submissions" on submissions
  for update using (true);
```

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OWNER_EMAIL=your-email@example.com
NEXT_PUBLIC_LIVE_COUNTER_CHANNEL=lounge-live-counter
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables from `.env.local`
4. Deploy!

The app will automatically build and deploy.

## Usage

### As Owner

1. Sign in with your email (magic link or Google OAuth)
2. Go to `/admin` to:
   - Instantly publish stories
   - Approve/reject writer submissions

### As Visitor

1. Click "Become a Writer" to submit a story
2. Fill out the form with your name, username, and story (text or PDF)
3. Wait for approval
4. Once approved, your story appears in the main feed

## Project Structure

```
├── app/
│   ├── admin/          # Admin dashboard (protected)
│   ├── submit/         # Writer submission form
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── admin-submission-card.tsx
│   ├── infinite-feed.tsx
│   ├── instant-publish-form.tsx
│   ├── jazz-player.tsx
│   ├── live-counter.tsx
│   ├── lounge-shell.tsx
│   ├── rain-bg.tsx
│   ├── reaction-bar.tsx
│   ├── story-card.tsx
│   └── writer-form.tsx
├── lib/
│   └── supabase.ts     # Supabase client setup
└── middleware.ts       # Route protection
```

## Customization

- **Colors**: Edit `tailwind.config.ts` to change the lounge color scheme
- **Jazz Music**: Replace the URL in `components/jazz-player.tsx` with your own audio file
- **Rain Animation**: Adjust the number of drops in `components/rain-bg.tsx`

## License

MIT

