/**
 * Breath — one slow scale up and back down, held across a scene boundary.
 *
 * SC01 has its own short breath. This is the long one: it starts once SC02's
 * chart has finished arriving and releases exactly as SC03 ends, so the two
 * scenes read as one continuous look at the same chart rather than two shots of
 * it. Both scenes evaluate it from GLOBAL frames — a scene inside a Sequence
 * sees rebased frames, so each adds its own `from` back before calling in here.
 *
 * It rises and falls ONCE. A breath that loops reads as a pulse, and a pulse is
 * an alarm.
 *
 * Type never scales in this episode, so annotations sit OUTSIDE the scaled
 * group and have their positions run through `breathPoint` instead. That keeps
 * a dot welded to the line it marks without stretching the word next to it.
 */
import { theme } from "../theme";

export const BREATH = {
  /** GLOBAL frame the breath starts on — SC02, once the chart is fully in. */
  from: 667,
  /** GLOBAL frame it returns to rest on — the last frame of SC03. */
  to: 1449,
  /** Peak scale, at the exact midpoint. Small enough to feel, not to notice. */
  amount: 0.03,
};

export const breathScale = (global: number) => {
  if (global <= BREATH.from || global >= BREATH.to) return 1;
  return 1 + BREATH.amount * Math.sin(Math.PI * ((global - BREATH.from) / (BREATH.to - BREATH.from)));
};

/** The card's centre — everything breathes about the same point in both scenes. */
export const BREATH_CENTRE = {
  x: theme.stage.card.x + theme.stage.card.w / 2,
  y: theme.stage.card.y + theme.stage.card.h / 2,
};
export const BREATH_ORIGIN = `${BREATH_CENTRE.x}px ${BREATH_CENTRE.y}px`;

/** Moves a point the way the scaled group moves it, for un-scaled overlays. */
export const breathPoint = (p: { x: number; y: number }, s: number) => ({
  x: BREATH_CENTRE.x + (p.x - BREATH_CENTRE.x) * s,
  y: BREATH_CENTRE.y + (p.y - BREATH_CENTRE.y) * s,
});
