import { useCallback, useEffect, useRef } from 'react';
import { CATCHES } from './catches-data.js';
import { drawSprite, hash01, charNight, itemLantern } from './sprites.js';

// Static night-lake scene rendered to a single 240×155 canvas + a DOM/SVG
// overlay for the animated bobber, line, and bite indicator. The canvas is
// painted ONCE per (palette, caught) change — no loop. The overlay uses CSS
// transitions on a positioned <div> for the bobber and an SVG <line> for
// the fishing line. Compositor-friendly; no rAF, no setInterval.
//
// Coordinate system: the canvas is 240×155 pixels. Overlay elements are
// positioned in % of stage-inner (which matches the canvas aspect ratio),
// computed from the canvas-space coords passed in.

const W = 240;
const H = 155;
const HORIZON_Y = 54;
const BOAT = { cx: 145, baseY: HORIZON_Y + 22 };
const MOON = { cx: 180, cy: 24, r: 12 };

// ── Canvas paint helpers ────────────────────────────────────────────────

function paintSky(ctx, palette) {
  let y = 0;
  for (const [color, h] of palette.sky) {
    ctx.fillStyle = color;
    ctx.fillRect(0, y, W, h);
    y += h;
  }
}

function paintStars(ctx, stars, dim) {
  for (const s of stars) {
    ctx.fillStyle = s.bright ? '#ffffff' : (dim ? '#6a7a98' : '#8090b0');
    ctx.fillRect(s.x, s.y, 1, 1);
  }
}

function paintMoon(ctx, palette) {
  const { cx, cy, r } = MOON;
  for (let rr = r + 6; rr >= r; rr--) {
    const alpha = ((r + 6 - rr) / 6) * 0.10;
    ctx.fillStyle = `rgba(248, 232, 168, ${alpha.toFixed(3)})`;
    for (let dy = -rr; dy <= rr; dy++) {
      for (let dx = -rr; dx <= rr; dx++) {
        const d2 = dx * dx + dy * dy;
        if (d2 <= rr * rr && d2 > (rr - 1) * (rr - 1)) {
          ctx.fillRect(cx + dx, cy + dy, 1, 1);
        }
      }
    }
  }
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const d2 = dx * dx + dy * dy;
      if (d2 <= r * r) {
        const shaded = dx * dx + (dy + 2) * (dy + 2) > (r - 2) * (r - 2);
        ctx.fillStyle = shaded ? palette.moonShadow : palette.moonLight;
        ctx.fillRect(cx + dx, cy + dy, 1, 1);
      }
    }
  }
  ctx.fillStyle = palette.moonCrater;
  ctx.fillRect(cx - 4, cy - 2, 2, 2);
  ctx.fillRect(cx + 3, cy + 4, 3, 2);
  ctx.fillRect(cx + 1, cy - 5, 1, 1);
}

function paintPines(ctx, palette) {
  ctx.fillStyle = palette.shore;
  ctx.fillRect(0, HORIZON_Y - 2, W, 2);
  const seeds = [3, 9, 17, 24, 32, 40, 49, 58, 66, 75, 83, 92, 100, 110, 119, 128, 136, 146, 155, 164, 173, 192, 211, 221, 229, 236];
  for (let i = 0; i < seeds.length; i++) {
    const x = seeds[i];
    const h = 4 + Math.floor(hash01(i, 6, 4) * 6);
    for (let r = 0; r < h; r++) {
      const w = Math.max(1, h - r - 1);
      ctx.fillRect(x - Math.floor(w / 2), HORIZON_Y - 2 - r, w, 1);
    }
  }
}

function paintWater(ctx, palette) {
  let y = HORIZON_Y;
  for (const [color, h] of palette.water) {
    ctx.fillStyle = color;
    ctx.fillRect(0, y, W, h);
    y += h;
  }
}

function paintMoonReflection(ctx, palette) {
  for (let i = 0; i < 14; i++) {
    const yy = HORIZON_Y + 1 + Math.floor(i * 0.9);
    if (yy > HORIZON_Y + 12) break;
    if (i % 3 === 2) continue;
    const taper = Math.max(0, 1 - i / 12);
    const baseW = Math.max(1, Math.round(5 * taper));
    const c = i < 2 ? palette.refl1 : (i < 7 ? palette.refl2 : palette.refl3);
    ctx.fillStyle = c;
    ctx.fillRect(MOON.cx - Math.floor(baseW / 2), yy, baseW, 1);
  }
}

function paintRipples(ctx, palette) {
  for (let i = 0; i < 14; i++) {
    const rx = (i * 27 + i * 3) % W;
    const ry = HORIZON_Y + 4 + (i % 5) * 9;
    if (ry > H - 6) continue;
    ctx.fillStyle = ry < HORIZON_Y + 10 ? palette.ripple1 : palette.ripple2;
    ctx.fillRect(rx, ry, 2, 1);
    if (i % 2 === 0) ctx.fillRect(rx + 5, ry, 1, 1);
  }
}

function paintBoat(ctx) {
  const by = BOAT.baseY;
  ctx.fillStyle = '#3a2818';
  ctx.fillRect(BOAT.cx - 16, by + 3, 32, 2);
  ctx.fillRect(BOAT.cx - 14, by + 5, 28, 1);
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(BOAT.cx - 18, by, 36, 3);
  ctx.fillStyle = '#1a1008';
  ctx.fillRect(BOAT.cx - 18, by + 2, 36, 1);
  ctx.fillStyle = '#2a1a10';
  ctx.fillRect(BOAT.cx - 16, by + 1, 32, 1);
  ctx.fillStyle = '#3a2a18';
  ctx.fillRect(BOAT.cx - 22, by + 1, 4, 1);
  drawSprite(ctx, charNight, BOAT.cx - 8, by - 17);
  return by;
}

function paintRod(ctx, by) {
  // Just the rod itself — the bobber is part of the DOM overlay so it can
  // animate. The rod is static and painted on the canvas.
  const rodStart = { x: BOAT.cx + 4, y: by - 9 };
  const rodEnd = { x: BOAT.cx + 24, y: by - 17 };
  drawLine(ctx, rodStart.x, rodStart.y, rodEnd.x, rodEnd.y, '#5a4028');
  drawLine(ctx, rodStart.x, rodStart.y + 1, rodEnd.x, rodEnd.y + 1, '#3a2a18');
}

function drawLine(ctx, x0, y0, x1, y1, color) {
  ctx.fillStyle = color;
  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx - dy, x = x0, y = y0;
  while (true) {
    ctx.fillRect(x, y, 1, 1);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += sx; }
    if (e2 < dx) { err += dx; y += sy; }
  }
}

// Tinted lantern sprite cache.
const lanternCache = {};
function getTintedLantern(glow) {
  if (lanternCache[glow]) return lanternCache[glow];
  const sprite = {
    palette: { ...itemLantern.palette, y: glow, Y: lightenHex(glow, 0.4) },
    pixels: itemLantern.pixels,
  };
  lanternCache[glow] = sprite;
  return sprite;
}
function lightenHex(hex, mix) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * mix);
  const lg = Math.round(g + (255 - g) * mix);
  const lb = Math.round(b + (255 - b) * mix);
  return '#' + [lr, lg, lb].map((v) => v.toString(16).padStart(2, '0')).join('');
}

function paintLantern(ctx, lantern) {
  const { slotX, slotY, glow } = lantern;
  const px = slotX, py = slotY;
  const haloCX = px + 4, haloCY = py + 6;
  ctx.globalAlpha = 0.10;
  ctx.fillStyle = glow;
  ctx.fillRect(haloCX - 6, haloCY - 6, 12, 12);
  ctx.globalAlpha = 0.18;
  ctx.fillRect(haloCX - 4, haloCY - 4, 8, 8);
  ctx.globalAlpha = 0.28;
  ctx.fillRect(haloCX - 2, haloCY - 2, 4, 4);
  ctx.globalAlpha = 1;
  drawSprite(ctx, getTintedLantern(glow), px, py);
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = glow;
  ctx.fillRect(px + 3, py + 12, 4, 1);
  ctx.fillRect(px + 2, py + 13, 6, 1);
  ctx.fillRect(px + 4, py + 14, 3, 1);
  ctx.globalAlpha = 1;
}

// ── Palettes ────────────────────────────────────────────────────────────

const PALETTES = {
  night: {
    bg: '#040814',
    sky: [
      ['#070a18', 14], ['#0c1428', 14], ['#142038', 14], ['#1c2a48', 12],
    ],
    water: [
      ['#1a2848', 8], ['#142038', 12], ['#0c1428', 14], ['#070a18', 30],
    ],
    shore: '#080814',
    moonLight: '#fff4c0', moonShadow: '#e8d8a0', moonCrater: '#d0bc88',
    refl1: '#fff4c0', refl2: '#e8d8a0', refl3: '#a89868',
    ripple1: '#3a5078', ripple2: '#243858',
  },
  dusk: {
    bg: '#1a0e2a',
    sky: [
      ['#1e0a2c', 12], ['#3a1a44', 12], ['#5a2a4a', 12], ['#7a3a4a', 12], ['#9a4a4a', 6],
    ],
    water: [
      ['#3a2a4a', 8], ['#241830', 12], ['#140a1c', 14], ['#080410', 30],
    ],
    shore: '#0a0410',
    moonLight: '#ffe8b8', moonShadow: '#d8b888', moonCrater: '#a08868',
    refl1: '#ffe8b8', refl2: '#d8a868', refl3: '#a06848',
    ripple1: '#4a3a5a', ripple2: '#2a1a30',
  },
};

// ── Component ───────────────────────────────────────────────────────────

export default function World({
  caught = [],
  palette = 'night',
  onStageClick,
  onLanternClick,
  bobber,
  phase,
  rodTip,
}) {
  const canvasRef = useRef(null);

  // Stable star field, generated once per component lifetime.
  const stars = useRef(null);
  if (!stars.current) {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        x: Math.floor(hash01(i, 1, 9) * W),
        y: Math.floor(hash01(i, 2, 9) * 50),
        bright: hash01(i, 3, 9) > 0.55,
      });
    }
    stars.current = arr;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const pal = PALETTES[palette] || PALETTES.night;
    paintSky(ctx, pal);
    paintStars(ctx, stars.current, palette === 'dusk');
    paintMoon(ctx, pal);
    paintPines(ctx, pal);
    paintWater(ctx, pal);
    paintMoonReflection(ctx, pal);
    paintRipples(ctx, pal);
    const by = paintBoat(ctx);
    paintRod(ctx, by);
    for (const id of caught) {
      const c = CATCHES.find((x) => x.id === id);
      if (!c) continue;
      paintLantern(ctx, { slotX: c.slot.x, slotY: c.slot.y, glow: c.glow });
    }
  }, [palette, caught]);

  const handleClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    const my = ((e.clientY - rect.top) / rect.height) * H;
    // Lantern hit-test wins over a stage click. ~7×9 hit box around the
    // sprite's center.
    for (const id of caught) {
      const c = CATCHES.find((x) => x.id === id);
      if (!c) continue;
      const lcx = c.slot.x + 4, lcy = c.slot.y + 6;
      if (Math.abs(mx - lcx) < 7 && Math.abs(my - lcy) < 9) {
        onLanternClick?.(id);
        return;
      }
    }
    // Ignore clicks above the horizon — sky/moon/trees aren't water.
    if (my < HORIZON_Y + 4) return;
    onStageClick?.(mx, my);
  }, [caught, onStageClick, onLanternClick]);

  const showLine = phase === 'waiting' || phase === 'biting';
  const showBobber = phase !== 'idle' || true; // always rendered; idle position == rod tip
  const lineEnd = phase === 'idle' ? { x: rodTip.x, y: rodTip.y + 8 } : bobber;
  const idleX = rodTip.x - 1, idleY = rodTip.y + 8;
  const bx = phase === 'idle' ? idleX : bobber.x;
  const by = phase === 'idle' ? idleY : bobber.y;

  return (
    <div className="world" data-phase={phase}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="pixel-canvas"
        onClick={handleClick}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          cursor: 'pointer',
          background: (PALETTES[palette] || PALETTES.night).bg,
        }}
      />
      <svg
        className="game-line"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          opacity: showLine ? 1 : 0,
          transition: 'opacity 180ms',
        }}>
        <line
          x1={rodTip.x}
          y1={rodTip.y}
          x2={lineEnd.x}
          y2={lineEnd.y}
          stroke="#a09478"
          strokeWidth="0.7"
          shapeRendering="crispEdges"
        />
      </svg>
      <div
        className="bobber"
        data-phase={phase}
        style={{
          left: `${(bx / W) * 100}%`,
          top: `${(by / H) * 100}%`,
        }}>
        <div className="bobber-dot" />
      </div>
      {phase === 'biting' && (
        <div
          className="bite-indicator"
          style={{
            left: `${(bx / W) * 100}%`,
            top: `${(by / H) * 100}%`,
          }}>
          <span>!</span>
        </div>
      )}
    </div>
  );
}
