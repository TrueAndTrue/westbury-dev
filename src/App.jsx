import { useCallback, useEffect, useState } from 'react';
import World from './game/World.jsx';
import Hud from './game/Hud.jsx';
import CatchModal from './game/CatchModal.jsx';
import LanternLog from './game/LanternLog.jsx';
import IntroModal from './game/IntroModal.jsx';
import About from './game/About.jsx';
import { CATCHES, CATCH_AWARD_ORDER } from './game/catches-data.js';
import { useFishingGame } from './game/useFishingGame.js';

// The lake canvas is 240×155 — playable but tight under ~768px wide, and
// landscape phones (low height) make the bobber hard to tap. Below the
// threshold we skip the game entirely and route to the About zine.
const MIN_GAME_WIDTH = 768;
const MIN_GAME_HEIGHT = 500;

function useIsGamePlayable() {
  const compute = () =>
    typeof window === 'undefined'
      ? true
      : window.innerWidth >= MIN_GAME_WIDTH && window.innerHeight >= MIN_GAME_HEIGHT;
  const [playable, setPlayable] = useState(compute);
  useEffect(() => {
    const onResize = () => setPlayable(compute());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);
  return playable;
}

const STORAGE_KEY = 'austin.fish.caught.v1';
const INTRO_SEEN_KEY = 'austin.fish.introSeen.v1';

function loadCaught() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id) => CATCHES.some((c) => c.id === id))
      : null;
  } catch {
    return null;
  }
}

function loadIntroSeen() {
  try { return localStorage.getItem(INTRO_SEEN_KEY) === '1'; } catch { return false; }
}

const PALETTE = 'night';
const BITE_SPEED = 'normal';

export default function App() {
  const gamePlayable = useIsGamePlayable();

  const [caught, setCaught] = useState(() => loadCaught() || []);
  const [openCatch, setOpenCatch] = useState(null);
  const [logOpen, setLogOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(() => !loadIntroSeen());

  // Persist caught list.
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(caught)); } catch {}
  }, [caught]);

  // Award the next catch. Uses CATCH_AWARD_ORDER — rare is last guaranteed.
  // The state machine calls this on a successful set-hook.
  const awardNextCatch = useCallback(() => {
    setCaught((prev) => {
      const remaining = CATCH_AWARD_ORDER.filter((id) => !prev.includes(id));
      if (remaining.length === 0) return prev;
      const pick = remaining[0];
      setOpenCatch(pick);
      return [...prev, pick];
    });
  }, []);

  const handleCastEvent = useCallback(() => {}, []);

  const { phase, bobber, handleStageClick, rodTip } = useFishingGame({
    biteSpeed: BITE_SPEED,
    onCatch: awardNextCatch,
    onCastEvent: handleCastEvent,
  });

  const dismissIntro = useCallback((wantsToFish) => {
    try { localStorage.setItem(INTRO_SEEN_KEY, '1'); } catch {}
    setIntroOpen(false);
    if (!wantsToFish) setAboutOpen(true);
  }, []);

  const currentCatch = openCatch ? CATCHES.find((c) => c.id === openCatch) : null;
  const hasMoreCatches = caught.length < CATCHES.length;

  const closeModal = useCallback(() => setOpenCatch(null), []);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(INTRO_SEEN_KEY);
    } catch {}
    setCaught([]);
    setOpenCatch(null);
    setIntroOpen(true);
    setAboutOpen(false);
  }, []);

  // Mobile / undersized viewports skip the game entirely — render the
  // About zine as the standalone page. No intro modal, no lake, no HUD.
  if (!gamePlayable) {
    return <About open standalone />;
  }

  return (
    <div className="stage">
      <div className="stage-inner">
        <World
          caught={caught}
          palette={PALETTE}
          onStageClick={handleStageClick}
          onLanternClick={(id) => setOpenCatch(id)}
          bobber={bobber}
          phase={phase}
          rodTip={rodTip}
        />

        <Hud
          phase={phase}
          caughtCount={caught.length}
          totalCount={CATCHES.length}
          lanternHints
          onOpenLog={() => setLogOpen(true)}
          onSkip={() => setAboutOpen(true)}
        />
      </div>

      <CatchModal
        catchObj={currentCatch}
        onClose={closeModal}
        onNext={closeModal}
        hasNext={hasMoreCatches}
      />

      <LanternLog
        open={logOpen}
        caught={caught}
        onClose={() => setLogOpen(false)}
        onSelect={(id) => { setOpenCatch(id); setLogOpen(false); }}
        onReset={resetAll}
      />

      <About open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <IntroModal open={introOpen} onChoose={dismissIntro} />
    </div>
  );
}
