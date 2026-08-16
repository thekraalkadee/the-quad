# Getting a live URL for your submission

The Pathfinders submission needs a working link judges can open. Here's the fastest path —
Render's free tier, zero code changes needed (already set up in this repo).

## 1. Push this project to GitHub

From your project folder (the one with `package.json` in it):

```powershell
git remote -v          # see if a remote is already set — if this prints nothing, continue below
```

If there's no remote yet:

1. Go to github.com and create a new **empty** repository (don't initialize it with a README).
2. Copy the commands GitHub shows you under "…or push an existing repository from the command
   line" — they'll look like:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/campus-hub.git
git branch -M main
git push -u origin main
```

Run those from inside the project folder. This repo already has an initial commit, so you're
just pushing what's there.

## 2. Deploy on Render

1. Go to [render.com](https://render.com) and sign up (free, no card required for this).
2. **New +** → **Web Service** → connect your GitHub account → pick the `campus-hub` repo.
3. Fill in these settings:

| Setting | Value |
|---|---|
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm run render-start` |
| Instance Type | Free |

4. Under **Environment Variables**, add one:

| Key | Value |
|---|---|
| `SESSION_SECRET` | any long random string (e.g. generate one at [random.org/strings](https://www.random.org/strings/)) |

5. Click **Create Web Service**. First deploy takes a few minutes — Render will show build
   logs live.

6. Once it says "Live," open the `.onrender.com` URL it gives you. That's your submission link.

## Why this works without a real database

The app's `render-start` script (`scripts/ensure-seeded.mjs`) checks whether the database is
empty every time the app boots, and re-seeds the fictional demo data if so. Render's free tier
resets local files on restart/spin-down, so this keeps the demo populated automatically — you
don't have to do anything after the first deploy.

**Heads up:** the free tier spins down after 15 minutes of no traffic and takes ~30-60 seconds
to wake back up on the next visit. If you're worried about a judge hitting a cold start, open
the link yourself a minute or two before you expect them to look, or before recording your demo
video.

## If you want a "real" persistent database instead

Worth doing only if you have spare time — swap `src/lib/db.js` for a hosted Postgres
([Supabase](https://supabase.com) or [Neon](https://neon.tech), both free) and deploy to
[Vercel](https://vercel.com) instead. The SQL in `db.js` is plain, portable SQL, so the schema
carries over directly; you'd be swapping the `node:sqlite` calls for a Postgres client (e.g.
`pg` or `@vercel/postgres`). Ask your team's Claude Code session to do this migration once
everyone's tool access is live — it's a well-scoped, mechanical change.
