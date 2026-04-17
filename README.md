# Macro Intel

Personal macro intelligence briefing tool. Hit a button, get a live global briefing. Drill into any theme, region, or signal.

---

## Deploy to Vercel (easiest — no terminal needed)

### Step 1 — Put this folder on GitHub
1. Go to [github.com/new](https://github.com/new) and create a new repo named `macro-intel` (private is fine).
2. On the repo page, click **"uploading an existing file"** and drag every file/folder from this `macro-intel` folder in. Commit.

### Step 2 — Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Click **Import** next to your `macro-intel` repo.
3. Vercel auto-detects Next.js. Don't change any build settings.
4. Expand **Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (starts with `sk-ant-...`)
5. Click **Deploy**. ~2 minutes later you get a live URL.

---

## Deploy with Vercel CLI (if you prefer terminal)

```bash
cd macro-intel
npm install
npm install -g vercel
vercel            # log in when prompted, accept defaults
# When prompted for env vars, add ANTHROPIC_API_KEY
vercel --prod     # promote to production
```

---

## How it works

- **Run briefing** — searches the web live and returns 5 structured macro cards across geopolitics, macro/rates, trade, energy, emerging markets, and tech. Filter by theme using the pills.
- **Drill down** — type any specific question (region, event, sector, currency) and get a focused what's happening / why it matters / what to watch breakdown.
- **Quick queries** — preset drill-downs for common macro themes.

---

## Cost

Each briefing run costs roughly $0.01–0.03 in API credits (web search + generation). Drill-downs are similar. Very cheap for daily personal use.

---

## Local development (optional)

```bash
npm install
# Create a file named .env.local with a single line:
# ANTHROPIC_API_KEY=your_key_here
npm run dev
# Open http://localhost:3000
```

---

## File layout

```
macro-intel/
├── package.json
├── next.config.js
├── README.md
└── app/
    ├── globals.css
    ├── layout.js
    ├── page.js
    ├── page.module.css
    └── api/
        ├── briefing/
        │   └── route.js
        └── drill/
            └── route.js
```
