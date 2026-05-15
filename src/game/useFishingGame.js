import { useCallback, useEffect, useRef, useState } from 'react';

// Game state machine — drives the cast → wait → bite → reel → catch/miss
// flow on top of the static canvas. No rAF, no setInterval. Just a chain
// of setTimeouts that schedule the next phase. Every timer is tracked and
// cleared on unmount or on a new state transition.
//
// Phases:
//   idle           — bobber dangles from rod tip. Click water to cast.
//   casting        — bobber arcs from rod tip to target (CSS transition).
//   waiting        — bobber sits on water; wobble animation. Click reels in (miss).
//   biting         — bobber jitters; short window to click and set the hook.
//   reeling-catch  — bobber returns to rod tip; on land, award a catch.
//   reeling-miss   — bobber returns to rod tip; no catch awarded.
//
// Cast target coords are in canvas (240 × 155) space.

// Must match the rod end painted in World.jsx (paintRod / BOAT):
//   BOAT.cx = 145, baseY = HORIZON_Y(54) + 22 = 76
//   rodEnd  = (BOAT.cx + 24, baseY - 17) = (169, 59)
const ROD_TIP = { x: 169, y: 59 };

const CAST_DURATION = 950;
const REEL_DURATION = 600;
const BITE_WINDOW = 1200;
const AWARD_DELAY = 220;

const BITE_DELAY_MS = {
  instant: [120, 320],
  fast:    [600, 1600],
  normal:  [500, 2000],
  patient: [3500, 8500],
};

function pickInRange([min, max]) {
  return Math.floor(min + Math.random() * (max - min));
}

export function useFishingGame({ biteSpeed = 'normal', onCatch, onCastEvent } = {}) {
  const [phase, setPhase] = useState('idle');
  const [bobber, setBobber] = useState({ x: ROD_TIP.x, y: ROD_TIP.y });

  const timersRef = useRef([]);
  const onCatchRef = useRef(onCatch);
  const onCastEventRef = useRef(onCastEvent);
  onCatchRef.current = onCatch;
  onCastEventRef.current = onCastEvent;

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) clearTimeout(t);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      timersRef.current = timersRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const returnToIdle = useCallback(() => {
    setBobber({ x: ROD_TIP.x, y: ROD_TIP.y });
    schedule(() => setPhase('idle'), REEL_DURATION);
  }, [schedule]);

  // Player clicked during 'biting' → hook set, reel in with a catch.
  const setHook = useCallback(() => {
    clearTimers();
    setPhase('reeling-catch');
    onCastEventRef.current?.('catch');
    setBobber({ x: ROD_TIP.x, y: ROD_TIP.y });
    schedule(() => {
      onCatchRef.current?.();
      setPhase('idle');
    }, REEL_DURATION + AWARD_DELAY);
  }, [clearTimers, schedule]);

  // Player clicked during 'waiting' OR bite window expired → miss.
  const missAndReel = useCallback((reason) => {
    clearTimers();
    setPhase('reeling-miss');
    onCastEventRef.current?.(reason);
    setBobber({ x: ROD_TIP.x, y: ROD_TIP.y });
    schedule(() => setPhase('idle'), REEL_DURATION);
  }, [clearTimers, schedule]);

  // Top-level click handler. Behavior depends on the current phase.
  const handleStageClick = useCallback((x, y) => {
    // x,y in canvas space (0..240, 0..155). Caller is responsible for the
    // hit-test on settled lanterns — those route to onLanternClick, not here.
    if (phase === 'idle') {
      // Cast.
      clearTimers();
      onCastEventRef.current?.('cast');
      setBobber({ x, y });
      setPhase('casting');

      // After cast arc: enter waiting.
      schedule(() => {
        setPhase('waiting');

        // Schedule the bite.
        const delay = pickInRange(BITE_DELAY_MS[biteSpeed] || BITE_DELAY_MS.normal);
        schedule(() => {
          setPhase('biting');
          onCastEventRef.current?.('bite');
          // If the player doesn't click within the bite window, it gets away.
          schedule(() => missAndReel('miss'), BITE_WINDOW);
        }, delay);
      }, CAST_DURATION);
      return;
    }

    if (phase === 'waiting') {
      missAndReel('reeled-early');
      return;
    }

    if (phase === 'biting') {
      setHook();
      return;
    }
    // casting / reeling-* — ignore clicks
  }, [phase, biteSpeed, clearTimers, missAndReel, schedule, setHook]);

  return { phase, bobber, handleStageClick, rodTip: ROD_TIP };
}
