# Macro Intel

Personal macro intelligence briefing tool. Hit a button, get a live global briefing. Drill into any theme, region, or signal.

---

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub
1. Create a new repo on github.com (call it `macro-intel`)
2. Upload all these files to it (drag and drop the folder, or use Git)

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Import your `macro-intel` repo
4. Vercel will auto-detect Next.js — no config needed
5. Before hitting Deploy, click **Environment Variables** and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (starts with `sk-ant-...`)
6. Hit **Deploy**

That's it. Vercel gives you a live URL in ~2 minutes.

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
# Create .env.local with: ANTHROPIC_API_KEY=your_key_here
npm run dev
# Open http://localhost:3000
```
