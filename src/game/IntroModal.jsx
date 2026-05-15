import { useEffect } from 'react';

export default function IntroModal({ open, onChoose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Enter') onChoose(true);
      if (e.key === 'Escape') onChoose(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onChoose]);

  if (!open) return null;

  return (
    <div className="intro-scrim">
      <div className="intro-deco" aria-hidden="true">
        <div className="intro-moon" />
        <div className="intro-lantern intro-lantern--a" />
        <div className="intro-lantern intro-lantern--b" />
        <div className="intro-lantern intro-lantern--c" />
      </div>

      <div className="intro-modal" role="dialog" aria-modal="true" aria-labelledby="intro-title">
        <div className="intro-eyebrow">welcome, traveler</div>
        <h1 id="intro-title" className="intro-title">
          Want to take two minutes<br />
          to do some relaxing fishing?
        </h1>
        <p className="intro-sub">You'll learn about me along the way.</p>

        <div className="intro-actions">
          <button
            type="button"
            className="intro-btn intro-btn--primary"
            onClick={() => onChoose(true)}
            autoFocus>
            <span className="intro-btn-icon">✦</span>
            Hell yeah, I'll fish
          </button>
          <button
            type="button"
            className="intro-btn intro-btn--secondary"
            onClick={() => onChoose(false)}>
            Nah, just show me the deets
          </button>
        </div>

        <div className="intro-foot">enter to fish · esc for the boring version</div>
      </div>
    </div>
  );
}
