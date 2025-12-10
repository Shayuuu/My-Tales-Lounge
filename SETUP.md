# My Tales Lounge - File-Based Setup

This app now uses a **file-based system** - no external services required!

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the app:**
   ```bash
   npm run dev
   ```

3. **That's it!** Open [http://localhost:3000](http://localhost:3000)

## How It Works

- **Stories** are stored in `data/stories.json`
- **PDFs** are saved in `public/uploads/`
- **No database** or external services needed
- Everything works locally!

## File Structure

```
data/
  └── stories.json          # All your stories
public/
  └── uploads/              # Uploaded PDF files
app/
  └── api/
      └── stories/           # API routes for stories
```

## Publishing Stories

1. Go to `/admin` (or click "Write a Tale")
2. Fill in the form
3. Click "Publish Instantly"
4. Your story appears on the home page!

## Data Storage

- Stories are saved as JSON in `data/stories.json`
- PDFs are stored in `public/uploads/`
- Both directories are created automatically

## Notes

- The `data/` and `public/uploads/` folders are in `.gitignore` by default
- If you want to backup your stories, copy `data/stories.json`
- For production, consider using a proper database or cloud storage

## Deployment

For Vercel/Netlify deployment:
- The file system is read-only on serverless platforms
- You'll need to use a database (like Vercel Postgres) or cloud storage
- Or use a platform that supports file writes (like Railway, Render)

Enjoy your cozy lounge! ☕📚

