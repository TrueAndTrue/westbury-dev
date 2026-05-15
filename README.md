# westbury-dev

Austin Westbury's personal site — a fishing-themed portfolio. Cast into a
pixel-art lake, set the hook when you see the `!`, and light up a lantern
for each catch. Each lantern opens a different part of the resume.

The design system, HUD, modals, and pixel art were built ahead of time
(see `Portfolio 2/DESIGN-SYSTEM.md` for the spec). This repo wires the
game logic, ships a real build pipeline, and deploys.

## Stack

- React 18 + Vite — single-page app, no router (everything is overlays).
- One static canvas (240×155) painted once per state change for the
  lake itself. The bobber, line, and bite indicator are a DOM/SVG
  overlay animated with CSS transitions and keyframes — no `rAF`, no
  `setInterval`. (A previous canvas-redraw implementation locked the
  main thread; the CSS approach can't.)
- All resume content lives in `src/game/catches-data.js`. The lake game
  and the about-zine read from the same source.

## Develop

```bash
npm install
npm run dev          # http://localhost:5273
npm run dev -- --host
```

## Build

```bash
npm run build        # outputs dist/
npm run preview      # serves dist/ locally
```

## Deploy

Configured for Vercel out of the box (`vercel.json`). Same `dist/`
directory deploys to Netlify, Cloudflare Pages, or any static host with
no changes — the only Vercel-specific bit is the cache-headers block.

```bash
# Vercel
vercel             # preview
vercel --prod      # production

# Netlify
netlify deploy --dir=dist --prod

# Cloudflare Pages
wrangler pages deploy dist
```

## Layout

```
index.html              entry — loads /src/main.jsx
src/
  main.jsx              React mount
  App.jsx               root component, state, persistence
  styles/portfolio.css  all styling (HUD, modals, lake, zine, overlay)
  game/
    catches-data.js     8 catches — content, glow colors, slot positions
    World.jsx           canvas + game overlay
    useFishingGame.js   cast → wait → bite → reel state machine
    Hud.jsx             title, prompt, lantern log button, skip link
    CatchModal.jsx      per-catch detail modal
    LanternLog.jsx      slide-out catalog
    IntroModal.jsx      first-visit prompt
    About.jsx           "skip the game" zine overlay
    sprites.js          pixel art sprites + drawSprite helper
public/uploads/         resume.pdf
Portfolio 2/            original design hand-off (kept for reference)
```

The `Portfolio 2/` folder retains `DESIGN-SYSTEM.md` and `HANDOFF.md` as
reference docs; the working code lives in `src/`.
