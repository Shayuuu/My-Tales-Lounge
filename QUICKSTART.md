# Quick Start Guide

Get "My Tales Lounge" running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for it to finish provisioning (takes ~2 minutes)

## Step 3: Get Your API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string)
   - **service_role** key (long string, keep this secret!)

## Step 4: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Name it: `story-pdfs`
4. Make it **Public**
5. Click **Create bucket**

## Step 5: Set Up Database

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New query**
3. Open `supabase-setup.sql` from this project
4. **IMPORTANT**: Replace `'your-email@example.com'` with your actual email address (line 30)
5. Click **Run** (or press Ctrl+Enter)

## Step 6: Create Environment File

Create a file named `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
OWNER_EMAIL=your-email@example.com
NEXT_PUBLIC_LIVE_COUNTER_CHANNEL=lounge-live-counter
```

Replace all the placeholder values with your actual values from Step 3.

## Step 7: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Step 8: Sign In as Owner

1. Click "Write a Tale" button (or go to `/admin`)
2. You'll be redirected to home (because you're not signed in)
3. For now, you can test the submission flow by going to `/submit`
4. To enable admin access, you'll need to set up Supabase Auth:
   - Go to Supabase Dashboard → **Authentication** → **Providers**
   - Enable **Email** provider
   - You can also enable **Google** if you want OAuth

## Testing the App

1. **As Visitor**: Go to `/submit` and submit a test story
2. **As Owner**: Sign in, go to `/admin`, and approve/reject submissions
3. **Instant Publish**: Use the form at `/admin` to publish stories instantly

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file
- Make sure there are no extra spaces or quotes
- Restart the dev server after changing `.env.local`

### Can't access `/admin`
- Make sure `OWNER_EMAIL` in `.env.local` matches the email you signed in with
- Sign out and sign back in

### PDF upload fails
- Make sure the `story-pdfs` bucket exists and is public
- Check file size (max 10MB)

### Database errors
- Make sure you ran the SQL setup script
- Check that all tables exist in Supabase Dashboard → **Table Editor**

## Next Steps

- Customize colors in `tailwind.config.ts`
- Replace jazz music URL in `components/jazz-player.tsx`
- Deploy to Vercel for free!

Happy storytelling! 📚☕

