# Displacement Index

Track which jobs AI is replacing, how fast, and what comes next.

**Live:** [displacementindex.spirittree.dev](https://displacementindex.spirittree.dev)
**Stack:** Next.js, TailwindCSS, Recharts, Fuse.js, OpenRouter
**Status:** Active

## What This Is

The Displacement Index is a data-driven tracker of AI-driven job displacement. It assigns a Displacement Risk Index (DRI) score to occupations based on task repeatability, data availability, AI capability match, adoption velocity, and human value premium. Users can browse by industry, compare occupations side-by-side, and see which jobs are most and least at risk.

This isn't doom-scrolling — it's actionable intelligence. Each occupation shows rising and declining skills, replacement timelines, and concrete data about what's changing. The AI comparison tool helps users understand the relative risk between any two occupations.

## Features

- 📊 **DRI Scores** — per-occupation risk index (0-100) with color-coded severity
- 🏭 **Industry View** — aggregate risk by industry sector
- 🔍 **Occupation Search** — fuzzy search across all tracked occupations
- ⚖️ **AI Compare** — side-by-side occupation comparison with AI analysis
- 🔗 **Adjacent Roles** — AI-suggested related occupations for career pivots
- 📈 **Trend Tracking** — quarterly trend direction and delta
- 💼 **Skills Data** — rising and declining skills per occupation
- 📱 **Responsive** — mobile-first design

## AI Integration

**Compare Tool** — powered by OpenRouter, provides detailed AI analysis comparing two occupations across risk factors, skills overlap, and transition feasibility.

**Adjacent Roles** — AI-generated suggestions for related occupations based on transferable skills.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS
- **Charts:** Recharts
- **Search:** Fuse.js (fuzzy search)
- **Database:** None (static occupation data)
- **AI:** OpenRouter (via Vercel AI SDK)
- **Hosting:** Vercel

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AI_API_KEY` / `OPENROUTER_API_KEY` | OpenRouter API key for comparison and adjacent roles |
| `AI_BASE_URL` | AI provider base URL (defaults to OpenRouter) |

## Part of SpiritTree

This project is part of the [SpiritTree](https://spirittree.dev) ecosystem — an autonomous AI operation building tools for the agent economy and displaced workers.

## License

MIT
