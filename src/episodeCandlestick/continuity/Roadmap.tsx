/**
 * ═══ THE ROADMAP — this video's "Scene Transisi" ═══
 *
 * Simon: "Pada 4 parts ini, coba kamu inisiatif berikan Scene Transisi dengan
 * layout yang sudah di sesuaikan untuk video ini. Visualnya dibiarkan kosong
 * dulu gapapa, namanya pun juga 'Lorem Ipsum' dulu aja. Stylenya sama persis
 * seperti TA01, scene transisi pertama."
 *
 * ADOPTED FROM TA01 (`episodeChartMemory/continuity/Roadmap.tsx`), NOT
 * IMPORTED FROM IT — a video owns its folder and may not read outside it. The
 * geometry, the paper, the cards, the glow and the moves are TA01's, value for
 * value (see `theme.roadmap`).
 *
 * The layout fits this video because this video has the same shape: an
 * Introduction (SC01) and four chapters, one per new passage of voice-over —
 * so the Introduction stands alone dead centre, leaves, and the four rise as a
 * 2×2. It appears four times, once inside each passage, and remembers where it
 * was: each stop folds the picture you were watching into the box for the
 * chapter that just ended, then pushes into the box for the one about to start.
 *
 *   stop 1   SC01's chart → Introduction → 2×2 → push into chapter 1 (SC02)
 *   stop 2   SC05         → chapter 1          → push into chapter 2 (SC06)
 *   stop 3   SC12         → chapter 2          → push into chapter 3 (SC13A)
 *   stop 4   SC13D        → chapter 3          → push into chapter 4 (BBRI)
 *
 * ⚠ THE CARDS ARE EMPTY ON PURPOSE ("visualnya dibiarkan kosong dulu"). A box
 * shows a picture only once one has folded into it.
 *
 * ⚠ MOUNTED BARE, NOT IN A <Sequence>. `<Freeze frame={n}>` sets the TIMELINE
 * frame to `n + the enclosing sequence's from`; with no Sequence the offset is
 * zero and `n` is exactly the original frame of the film being frozen. TA01
 * lost a card's picture to that offset once — see its note.
 */
import React from "react";
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const CARD = { w: 536, h: 302, gap: 80, labelGap: 14 };

/** Alone, and centred on both axes — TA01's first stop. */
const INTRO = {
  x: (theme.canvas.width - CARD.w) / 2,
  y: (theme.canvas.height - CARD.h) / 2,
};

/**
 * The 2×2, centred horizontally; vertically centred INCLUDING the labels under
 * the bottom row. Lowest ink at 907, clear of the 972 subtitle band; widest at
 * 1536, clear of the logo zone.
 */
const GRID = { x: (theme.canvas.width - (CARD.w * 2 + CARD.gap)) / 2, y: 173 };

/** "namanya pun juga 'Lorem Ipsum' dulu aja" — until the chapters are named. */
export const BOXES = [
  { x: GRID.x, y: GRID.y, text: "Lorem Ipsum" },
  { x: GRID.x + CARD.w + CARD.gap, y: GRID.y, text: "Lorem Ipsum" },
  { x: GRID.x, y: GRID.y + CARD.h + CARD.gap, text: "Lorem Ipsum" },
  { x: GRID.x + CARD.w + CARD.gap, y: GRID.y + CARD.h + CARD.gap, text: "Lorem Ipsum" },
] as const;

export const ROADMAP_DISSOLVE = 14;

export const M = {
  shrink: 36, // the picture folding itself into a card
  hold: 12, // a beat on the card before anything else moves
  swap: 36, // Introduction out, the four in — one move, two directions
  dissolve: ROADMAP_DISSOLVE, // the roadmap leaving off the top of the scene underneath
  glowLead: 16, // the glow lands exactly as the push sets off
  /** The push into the next chapter's box, landing on that chapter's first frame. */
  push: 90,
};
// ═══════════════════════════════════════════════════════════════════════════

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** TA01's easy ease — every move of the roadmap runs on it. */
const ease = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], { ...CLAMP, easing: theme.roadmap.ease });

/** The card is the frame's own shape (1.775 vs 1.778), so a fold never squashes. */
const SCALE = CARD.w / theme.canvas.width;
const PUSH_AMOUNT = theme.canvas.width / CARD.w - 1;

/** Scales the whole roadmap about a card's centre until that card IS the frame. */
const cardPush = (p: number, box: { x: number; y: number }) => {
  const cx = box.x + CARD.w / 2;
  const cy = box.y + CARD.h / 2;
  return {
    transform:
      `translate(${((theme.canvas.width / 2 - cx) * p).toFixed(1)}px,` +
      ` ${((theme.canvas.height / 2 - cy) * p).toFixed(1)}px) ` +
      `scale(${(1 + PUSH_AMOUNT * p).toFixed(4)})`,
    transformOrigin: `${cx}px ${cy}px`,
  };
};

const PAPER = { cell: 84, loop: 180 };

/**
 * The graph-paper ground: faint 2px grid, strongest mid-frame, drifting one
 * cell every six seconds. It drifts by `backgroundPosition` (a transform would
 * drag the vignette along) and reads the GLOBAL frame, so the sheet is one
 * continuous surface across all four stops.
 */
const Ground = ({ f }: { f: number }) => {
  const fade = "radial-gradient(ellipse 68% 68% at 50% 50%, black 35%, transparent 100%)";
  const drift = ((((f % PAPER.loop) + PAPER.loop) % PAPER.loop) / PAPER.loop) * PAPER.cell;
  return (
    <AbsoluteFill style={{ background: theme.roadmap.paper }}>
      <AbsoluteFill
        style={{
          opacity: 0.55,
          backgroundImage:
            `linear-gradient(to bottom, ${theme.roadmap.rule} 0 2px, transparent 2px),` +
            `linear-gradient(to right, ${theme.roadmap.rule} 0 2px, transparent 2px)`,
          backgroundSize: `${PAPER.cell}px ${PAPER.cell}px`,
          backgroundPosition: `${drift.toFixed(2)}px ${drift.toFixed(2)}px`,
          maskImage: fade,
          WebkitMaskImage: fade,
        }}
      />
    </AbsoluteFill>
  );
};

/** One card and its label. `flat` drops the shadow (the card about to fill the frame). */
const Box = ({
  x, y, text, opacity, flat = false, glow = 0,
}: {
  x: number; y: number; text: string; opacity: number; flat?: boolean; glow?: number;
}) => {
  const rect = {
    position: "absolute" as const,
    left: x,
    top: y,
    width: CARD.w,
    height: CARD.h,
    borderRadius: theme.roadmap.cardRadius,
  };
  return (
    <div style={{ opacity }}>
      <div
        style={{
          ...rect,
          background: theme.roadmap.paper,
          border: `${theme.stroke.hairline}px solid ${theme.roadmap.rule}`,
          boxShadow: flat ? "none" : theme.roadmap.cardShadow,
        }}
      />
      {glow > 0.001 && (
        <div
          style={{
            ...rect,
            opacity: glow,
            boxShadow: `0 0 0 2px ${theme.colors.indigo}, 0 0 48px 14px ${theme.roadmap.glowTint}`,
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y + CARD.h + CARD.labelGap,
          width: CARD.w,
          textAlign: "center",
          fontFamily: theme.type.family,
          fontSize: theme.roadmap.labelSize,
          fontWeight: 700,
          color: theme.colors.ink,
          letterSpacing: 0.5,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** The film's picture, frozen at ORIGINAL frame `freeze`. */
export type FilmAt = React.FC;

/** A box's picture: the film frozen at the frame that folded into it, or empty. */
const Thumb = ({ box, freeze, Film }: { box: { x: number; y: number }; freeze: number | null; Film: FilmAt }) =>
  freeze === null ? null : (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: CARD.w,
        height: CARD.h,
        borderRadius: theme.roadmap.cardRadius,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: theme.canvas.width,
          height: theme.canvas.height,
          transform: `scale(${SCALE.toFixed(6)})`,
          transformOrigin: "0 0",
        }}
      >
        <Freeze frame={freeze}>
          <Film />
        </Freeze>
      </div>
    </div>
  );

export type Stop = {
  /** Global (output) frame the shrink begins — the first frame of the new passage. */
  at: number;
  /** Box that catches the picture; `null` is the Introduction card. */
  land: number | null;
  /** Box the push goes into. */
  into: number;
  /** Global frame the next chapter's FIRST frame arrives — the push lands here. */
  end: number;
  /** ORIGINAL frame of the film to fold — the last full frame before the cut. */
  freeze: number;
  /** Per box, the original frame showing in it (a picture folded there earlier), or null. */
  previews: readonly (number | null)[];
};

/** Folds the frozen picture into `box`; clip and scale on one curve. */
const folded = (p: number, box: { x: number; y: number }) => {
  const W = theme.canvas.width;
  const H = theme.canvas.height;
  const r = theme.roadmap.cardRadius;
  return {
    clip: {
      position: "absolute" as const,
      left: 0,
      top: 0,
      width: W,
      height: H,
      clipPath:
        `inset(${(box.y * p).toFixed(1)}px ${((W - box.x - CARD.w) * p).toFixed(1)}px ` +
        `${((H - box.y - CARD.h) * p).toFixed(1)}px ${(box.x * p).toFixed(1)}px ` +
        `round ${(r * p).toFixed(1)}px)`,
    },
    inner: {
      position: "absolute" as const,
      left: 0,
      top: 0,
      width: W,
      height: H,
      transform:
        `translate(${(box.x * p).toFixed(1)}px, ${(box.y * p).toFixed(1)}px) ` +
        `scale(${(1 + (SCALE - 1) * p).toFixed(4)})`,
      transformOrigin: "0 0",
    },
  };
};

export const RoadmapStop = ({ stop, Film }: { stop: Stop; Film: FilmAt }) => {
  /** Already global — there is no Sequence to rebase. */
  const f = useCurrentFrame();
  if (f < stop.at || f >= stop.end + M.dissolve) return null;

  const shrink = ease(f, stop.at, M.shrink);
  const pushAt = stop.end - M.push;
  const push = ease(f, pushAt, M.push);
  /** Starts where the push lands, so the roadmap leaves off the TOP of the new chapter. */
  const gone = ease(f, stop.end, M.dissolve);
  const glowIn = ease(f, pushAt - M.glowLead, M.glowLead) * (1 - push);

  /** Only the first stop has an Introduction to get rid of. */
  const swap = stop.land === null ? ease(f, stop.at + M.shrink + M.hold, M.swap) : 1;
  const target = stop.land === null ? INTRO : BOXES[stop.land];
  const fold = folded(shrink, target);

  const picture = (
    <div style={fold.clip}>
      <div style={fold.inner}>
        <Freeze frame={stop.freeze}>
          <Film />
        </Freeze>
      </div>
    </div>
  );

  /** Introduction rises out of frame; the four rise into it, on one curve. */
  const introY = -(INTRO.y + CARD.h + 240) * swap;
  const gridY = (theme.canvas.height - GRID.y + 160) * (1 - swap);

  return (
    /* ⚠ zIndex 20: the film's Ticker ("$ABCD") carries zIndex 10 to stay above
       its own panel chrome, and without a layer of its own the roadmap was
       drawn UNDER it — the ticker floated over the paper for the whole of
       stop 1. Still below the watermark's 100. */
    <AbsoluteFill style={{ opacity: 1 - gone, zIndex: 20 }}>
      <div style={{ position: "absolute", inset: 0, ...cardPush(push, BOXES[stop.into]) }}>
        <Ground f={f} />

        {/* ── the four chapters ─────────────────────────────────────────── */}
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${gridY.toFixed(1)}px)` }}>
          {BOXES.map((b, i) => (
            <div key={i} style={{ opacity: swap }}>
              <Box x={b.x} y={b.y} text={b.text} opacity={1} flat={stop.into === i} glow={stop.into === i ? glowIn : 0} />
              <Thumb box={b} freeze={stop.previews[i]} Film={Film} />
            </div>
          ))}
          {stop.land !== null && picture}
        </div>

        {/* ── the Introduction, only on the first stop ──────────────────── */}
        {stop.land === null && (
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${introY.toFixed(1)}px)` }}>
            <Box x={INTRO.x} y={INTRO.y} text="Introduction" opacity={shrink} />
            {picture}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
