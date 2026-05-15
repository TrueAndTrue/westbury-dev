// Pixel art sprites + canvas helpers.
// Sprite shape: { palette: { ch: hex|null }, pixels: ['rows','of','equal-length strings'] }
// '.' is the convention for transparent.

export function drawSprite(ctx, sprite, x, y, opts = {}) {
  const { palette, pixels } = sprite;
  const flipX = !!opts.flipX;
  const alpha = opts.alpha ?? 1;
  const tint = opts.tint;
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let r = 0; r < pixels.length; r++) {
    const row = pixels[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      let color = palette[ch];
      if (!color) continue;
      if (tint) color = tint(color, ch);
      const px = flipX ? row.length - 1 - c : c;
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x + px), Math.round(y + r), 1, 1);
    }
  }
  ctx.restore();
}

export function hash01(i, j, seed = 0) {
  const x = Math.sin(i * 374.761 + j * 91.973 + seed * 17.13) * 43758.5453;
  return x - Math.floor(x);
}

// Side-view character sitting in the boat, holding the rod.
export const charNight = {
  palette: {
    '.': null,
    o: '#0a1020',
    s: '#d5a585',
    h: '#3a1f10',
    c: '#2a3a6a',
    g: '#3a4a78',
    G: '#28365a',
    j: '#1f2540',
    J: '#10142a',
    b: '#3a1f10',
  },
  pixels: [
    '....oooooo....',
    '...occccccco..',
    '..occccccccco.',
    '..ohhhhhhhhho.',
    '..osssssssso..',
    '..oso..o.sso..',
    '..ossossosso..',
    '..ossssssso...',
    '..oggggggo....',
    '.oggGgggggo...',
    '.ogGgggggGo...',
    '.oggggggggo...',
    '.oggjjjjggo...',
    '..ojjJJjjo....',
    '..ojJJJJjo....',
    '..ojJJJJjo....',
    '..obbbbbbo....',
    '..oo....oo....',
  ],
};

export const fishBlue = {
  palette: { '.': null, o: '#0a1430', a: '#3a5fa0', b: '#5a8fd0', c: '#a0c4f0', e: '#fff' },
  pixels: [
    '..........oo....',
    '.........oaao...',
    'oo......oaaao...',
    'oao....oaaaao...',
    'oaaooooaaaaaao..',
    'oaabbbbbbbbbbao.',
    'oaabbcbbbcbeaao.',
    'oaabbbbbbbbbao..',
    'oaaobbbbbbbao...',
    'oo.oaaaaaaao....',
    '....ooooooo.....',
    '................',
  ],
};

// Lantern sprite, used as the "caught" glyph on the water.
export const itemLantern = {
  palette: { '.': null, o: '#1a0a00', a: '#5a3a1a', b: '#8b6a3a', y: '#ffe890', Y: '#fff8d0', d: '#3a2a14' },
  pixels: [
    '....oo....',
    '...obbo...',
    '...oao....',
    '..oaaaao..',
    '.oybyybyo.',
    '.oyYYYYyo.',
    '.oybyybyo.',
    '.oyYYYYyo.',
    '.oybyybyo.',
    '..oaaaao..',
    '...odo....',
    '...odo....',
  ],
};
