# Personalized Reader Experience Setup Guide

## 🎯 Overview

This adds a complete personalized experience with login, reading progress tracking, journaling, voice reading, and more!

## 📦 New Dependencies

Run:
```bash
npm install @supabase/ssr @supabase/supabase-js canvas-confetti sonner date-fns
npm install -D @types/canvas-confetti
```

## 🔐 Supabase Setup

1. **Create a Supabase project** at https://supabase.com

2. **Set environment variables** in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ELEVENLABS_API_KEY=your-elevenlabs-key (optional, for voice reading)
ELEVENLABS_VOICE_ID=your-voice-id (optional, default voice ID)
```

3. **Run the migration**:
   - Go to Supabase Dashboard → SQL Editor
   - Copy and paste contents of `supabase-migrations.sql`
   - Run the migration

4. **Enable Auth Providers**:
   - Go to Authentication → Providers
   - Enable Google, Apple, and Email (Magic Link)

5. **Create Storage Bucket**:
   - Go to Storage → Create Bucket
   - Name: `voice-audio`
   - Public: Yes

## ✨ Features Implemented

### 1. Beautiful Login/Sign-up ✅
- Google OAuth
- Apple OAuth  
- Email magic link
- Username + avatar picker (in profile settings)

### 2. Personalized Home Page ✅
- Greeting with time-based message
- "Continue Reading" carousel with progress
- "Your Bookshelf" section
- "Your Journal" preview (last 3 entries)

### 3. Daily Bedtime Story ✅
- Admin can set daily story at `/admin/bedtime-story`
- Banner appears at user's bedtime hour (default 22:00)
- Push notification ready (requires service worker)

### 4. One More Chapter Tonight ✅
- Shows short stories tagged "short-sweet"
- Perfect for bedtime reading

### 5. Reading Time Badge ✅
- Shows estimated reading time on every story card
- Labels: "quick read", "perfect for bedtime", etc.

### 6. Secret Midnight Drops ✅
- Stories marked `midnight_drop: true` appear 00:00-00:05
- Vanishes after 5 minutes
- One view per user per day

### 7. Warm Blanket Ring ✅
- Progress ring around logo
- Fills as user finishes stories (20% per story)
- Fireworks at 100%!

### 8. Voice Reading 🎧 ✅
- ElevenLabs integration
- Remembers position
- Background ambient sounds

### 9. Gift a Story 🕯️ ✅
- Creates secret link
- Beautiful animated card
- Expires in 7 days
- Works for non-users

### 10. Private Reader's Journal ✅
- Prompt after finishing story
- Mood emoji + private note
- View at `/my-journal`
- Beautiful notebook style

## 🎉 Bonus Features

- **5 Stories Celebration**: Paper heart confetti when finishing 5 stories in one session
- **Crying Emoji Effect**: Heavier rain if user picks crying emoji
- **Welcome Screen**: Flickering candle animation on first login

## 📝 Database Schema

All tables are created in the migration:
- `profiles` (extended with username, avatar, bedtime_hour, blanket_progress)
- `reading_progress` (tracks exact page and %)
- `journal_entries` (mood + notes)
- `gifted_links` (secret gift links)
- `midnight_views` (tracks who saw midnight drops)
- `bedtime_stories` (admin daily picks)
- `voice_reading_progress` (audio position)
- `voice_audio_cache` (cached audio URLs)
- `user_bookshelf` (replaces localStorage)

## 🚀 Usage

1. **Install dependencies**: `npm install`
2. **Set up Supabase**: Follow steps above
3. **Add environment variables**: `.env.local`
4. **Run migration**: Execute SQL in Supabase
5. **Start app**: `npm run dev`

## 🎨 Admin Features

- Set daily bedtime story at `/admin/bedtime-story`
- Mark stories as `midnight_drop: true` in stories.json
- Add `tags: ["short-sweet"]` to stories for "One More Chapter"

## 💡 Notes

- Voice reading requires ElevenLabs API key (optional)
- Push notifications need service worker setup (future enhancement)
- All user data is stored in Supabase with RLS policies
- Reading progress auto-saves on every page turn
- Journal prompts appear when closing a completed story

Enjoy your deeply personalized reading experience! 🕯️✨

