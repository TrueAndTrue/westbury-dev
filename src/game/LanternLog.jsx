import { useEffect } from 'react';
import { CATCHES } from './catches-data.js';

export default function LanternLog({ open, caught, onClose, onSelect, onReset }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={`log-scrim ${open ? 'is-open' : ''}`} onClick={onClose}>
      <aside className="log-panel" onClick={(e) => e.stopPropagation()} aria-hidden={!open}>
        <header className="log-head">
          <div>
            <div className="log-eyebrow">LANTERN LOG</div>
            <div className="log-title">{caught.length} / {CATCHES.length} lit</div>
          </div>
          <button className="log-close" onClick={onClose} aria-label="close">×</button>
        </header>

        <div className="log-progress">
          <div className="log-progress-bar" style={{ width: `${(caught.length / CATCHES.length) * 100}%` }} />
        </div>

        <ul className="log-list">
          {CATCHES.map((c) => {
            const isCaught = caught.includes(c.id);
            return (
              <li
                key={c.id}
                className={`log-item ${isCaught ? 'is-caught' : 'is-locked'} ${c.rarity}`}
                onClick={() => isCaught && onSelect(c.id)}>
                <div className="log-icon" style={{ '--glow': c.glow }}>
                  <span style={{ color: isCaught ? c.glow : '#1a2440' }}>
                    {isCaught ? c.icon : '?'}
                  </span>
                </div>
                <div className="log-text">
                  <div className="log-name">
                    {isCaught ? c.shortLabel : '· · · · · ·'}
                  </div>
                  <div className="log-sub">
                    {isCaught ? c.subLabel : (c.rarity === 'rare' ? 'a rare one — keep casting' : 'not yet caught')}
                  </div>
                </div>
                {isCaught && <div className="log-arrow">›</div>}
              </li>
            );
          })}
        </ul>

        <footer className="log-foot">
          <div className="log-tip">
            tip · catches persist in this browser. clear with the reset button below.
          </div>
          <button
            className="log-reset"
            onClick={() => {
              if (confirm('Release all caught lanterns and start fresh?')) onReset?.();
            }}>
            release all lanterns
          </button>
        </footer>
      </aside>
    </div>
  );
}
