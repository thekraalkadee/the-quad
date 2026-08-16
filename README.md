# Commons — a campus hub for Pathfinders

Built for the Stellic Pathfinders Challenge (Campus Connection category). Three modules, one
campus-verified identity:

1. **Plan Explorer** — students post and browse real 4-year plans (majors, minors, entry
   credit, term-by-term courses, and notes), filterable by major/path type/class year.
2. **Opportunity Board** — professors and student orgs post competitions, conferences, talks,
   and research openings, filterable by type/level/major.
3. **The Exchange** — a campus-scoped marketplace for items, giveaways, and sublets.

Everything is scoped by the domain of the email you sign up with — no directory integrations,
no third-party student data (see [Section 8 of the Official Rules](https://stellic.notion.site/pathfinders-official-terms)).

## Stack

- **Next.js 16 (App Router)** + React 19, Tailwind CSS v4
- **`node:sqlite`** (Node's built-in SQLite driver) for storage — zero external services needed
  to run locally, no native build step, no API keys
- **Server Actions** for all writes (register, login, post a plan/opportunity/listing, ask a
  question, send a message) — no hand-written REST API layer
- Session auth via a signed, httpOnly cookie (JWT) + bcrypt password hashing

## Running it locally

```bash
npm install
npm run seed   # creates data/campus-hub.db and fills it with fictional demo data
npm run dev    # http://localhost:3000
```

Demo accounts (all seeded at `u.northwestern.edu`, password `password123` for all of them):

| Email | Role |
|---|---|
| maya.chen@u.northwestern.edu | Student — CS + Stats minor |
| diego.ramirez@u.northwestern.edu | Student — Econ, transfer |
| amara.okafor@u.northwestern.edu | Student — Pre-med Bio (posted anonymously) |
| priya.patel@u.northwestern.edu | Student — CS + Econ double major |
| s-lindholm@u.northwestern.edu | Professor — Computer Science |
| board@u.northwestern.edu | Student Org — Data Science Club |
| jamie.fox@sample.edu | Student at a different school — used to verify campus scoping |

Sign up with any email whose domain isn't a personal provider (gmail/yahoo/outlook/etc.) to
create your own account — the domain after the `@` becomes your campus.

## Project structure

```
src/
  app/            Pages (App Router) — one folder per route
    plans/        Plan Explorer
    opportunities/ Opportunity Board
    exchange/      The Exchange
  components/     Client components (forms with dynamic fields)
  lib/
    db.js         SQLite connection + schema (auto-creates tables on first run)
    auth.js       Session cookie, password hashing, email-domain validation
    actions.js    All Server Actions (every write in the app goes through here)
scripts/
  seed.mjs        Fictional demo data — edit this to change what the demo shows
```

## Deploying for the submission

See **[DEPLOY.md](./DEPLOY.md)** for step-by-step instructions (Render, free, no code changes —
already wired up via `npm run render-start`). Set a real `SESSION_SECRET` environment variable
in production (see `.env` — a placeholder is generated for local dev, don't reuse it).

## Before you submit

- [ ] Tools disclosure: this app was built with **Claude (via Claude Code / the Claude API)**,
      Next.js, React, Tailwind CSS — list everything you actually used once you've extended it.
- [ ] Swap the seed data / demo accounts for your own team's fictional examples if you want the
      demo to feel more personal — just don't use anyone's real academic records.
- [ ] Update `SESSION_SECRET` before deploying anywhere public.
