# Prëmo Inc. — Media Portfolio Dashboard

A personal social media KPI dashboard for tracking follower counts across all Prëmo Inc. brands and channels. 100% client-side — no backend, no API keys, no database. Data is saved to `localStorage`.

## Stack
- Next.js 14 (App Router)
- Montserrat font via next/font/google
- All styles in plain JS objects (zero dependencies beyond Next.js)
- `localStorage` for data persistence

## Setup

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Connect to Vercel → Import project
3. Framework: Next.js (auto-detected)
4. No environment variables needed
5. Deploy

That's it. No backend, no env vars, nothing to configure.

## Structure

```
app/
  layout.js     — Montserrat font + metadata
  page.js       — Full dashboard (global / brand / channel views)
  globals.css   — CSS reset + scrollbar styling
```

## Usage

### Adding a Brand
Click **+ Add Brand** from the portfolio view. Give it a name and emoji.

### Adding a Channel
Navigate into a brand → click **+ Add Channel**. Set platform, handle, and current follower count.

### Updating Followers
In the channel list, click **Edit** next to any channel and update the count. The date stamps automatically.

### Data
Everything is stored in `localStorage` under the key `premo-dashboard`. Clearing browser data resets the dashboard. Export the JSON from DevTools > Application > Local Storage if you ever want to back it up.
