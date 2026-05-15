const PROMPTS = {
  idle:           { text: 'click the water to cast.', sub: 'each lantern is a story. there are eight.' },
  casting:        { text: '…line is out…', sub: '' },
  waiting:        { text: 'wait for the bite.', sub: 'click anything to reel in early.' },
  biting:         { text: 'CLICK NOW — set the hook!', sub: 'bite window: short.' },
  'reeling-catch':{ text: 'nice. reeling it in…', sub: '' },
  'reeling-miss': { text: 'got away. reeling in empty.', sub: '' },
};

export default function Hud({ phase, caughtCount, totalCount, onOpenLog, onSkip, lanternHints }) {
  const allCaught = totalCount > 0 && caughtCount === totalCount;
  const p = (allCaught && phase === 'reeling-catch')
    ? { text: "…must've been the wind.", sub: '' }
    : (PROMPTS[phase] || PROMPTS.idle);
  const showBiteCTA = phase === 'biting';

  return (
    <div className="hud">
      <div className="hud-title">
        <div className="hud-eyebrow">AUSTIN WESTBURY · ONTARIO</div>
        <div className="hud-tagline">fishing for stories.</div>
        <div className="hud-sub">senior software engineer · 5 years · still casts.</div>
      </div>

      <button
        className="hud-skip"
        onClick={onSkip}
        title="Skip the game and read the about page">
        SKIP FISHING
      </button>

      <div className={`hud-prompt ${showBiteCTA ? 'is-bite' : ''}`}>
        <div className="hud-prompt-main">{p.text}</div>
        {p.sub && <div className="hud-prompt-sub">{p.sub}</div>}
      </div>

      <button className="hud-log" onClick={onOpenLog}>
        <span className="hud-log-pip">✦</span>
        <span className="hud-log-label">LANTERN LOG</span>
        <span className="hud-log-count">{caughtCount} / {totalCount}</span>
      </button>

      {lanternHints && caughtCount === 0 && phase === 'idle' && (
        <div className="hud-arrow">↓ click anywhere on the water</div>
      )}
    </div>
  );
}
