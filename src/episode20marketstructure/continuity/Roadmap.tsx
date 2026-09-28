/**
 * ═══ THE ROADMAP — TA05's "Scene Transisi" ═══
 *
 * Simon: "Iya dibuatkan dulu saja Scene Transisinya, visualnya kosongkan, text
 * nya Lorem Ipsum". It plays over each of his four extended passages.
 *
 * ADOPTED FROM TA03's (episodeCandlestick/continuity/Roadmap.tsx), which is
 * TA01's first transition plus what Simon asked of it there: the Introduction
 * 1.3x the chapter cards, names in indigo, a harder ease, the labels leaving
 * early in the push, the entered card squaring its corners. Rebuilt here, not
 * imported — a video owns its folder.
 *
 * FOUR CHAPTERS, SO TA01's 2×2: SC02–SC10 (reading the structure), SC11–SC15
 * (levels and the change of structure), SC16–SC17 (timeframes, the app),
 * SC18–SC20 (ASII and the close) — one per passage after the first:
 *
 *   stop 1   SC01 → Introduction → 2×2 → push into (1) → SC02
 *   stop 2   SC10 → (1),  push into (2) → SC11
 *   stop 3   SC15 → (2),  push into (3) → SC16
 *   stop 4   SC17 → (3),  push into (4) → SC18
 *
 * ⚠ THE CARDS ARE EMPTY ON PURPOSE ("visualnya kosongkan"); a box shows a
 * picture only once one has folded into it.
 *
 * ⚠ MOUNTED BARE, NOT IN A <Sequence>: `<Freeze frame={n}>` then means exactly
 * the built film's frame n.
 */
import React from "react";
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** TA01's cards: the frame's own shape (1.775), so a fold never squashes. */
export const CARD = { w: 536, h: 302, gap: 80, labelGap: 14 };

/** Alone and centred; 1.3x the chapter cards, as Simon asked of TA03's. */
const INTRO_SCALE = 1.3;
const INTRO = {
  w: CARD.w * INTRO_SCALE,
  h: CARD.h * INTRO_SCALE,
  x: (theme.canvas.width - CARD.w * INTRO_SCALE) / 2,
  y: (theme.canvas.height - CARD.h * INTRO_SCALE) / 2,
};

/**
 * The 2×2, centred horizontally; vertically centred INCLUDING the labels under
 * the bottom row. Lowest ink at 907, clear of the 972 subtitle band; widest at
 * 1536, clear of the logo zone.
 */
const GRID = { x: (theme.canvas.width - (CARD.w * 2 + CARD.gap)) / 2, y: 173 };

/** Simon's names — "Semua nya huruf kapital di huruf pertama tiap kata". */
export const BOXES = [
  { x: GRID.x, y: GRID.y, w: CARD.w, h: CARD.h, text: "Market Structure" },
  {
    x: GRID.x + CARD.w + CARD.gap,
    y: GRID.y,
    w: CARD.w,
    h: CARD.h,
    text: "Struktur & Level Harga",
  },
  {
    x: GRID.x,
    y: GRID.y + CARD.h + CARD.gap,
    w: CARD.w,
    h: CARD.h,
    text: "Tanda Perubahan Struktur",
  },
  {
    x: GRID.x + CARD.w + CARD.gap,
    y: GRID.y + CARD.h + CARD.gap,
    w: CARD.w,
    h: CARD.h,
    text: "Praktik Di Chart",
  },
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
  /**
   * ⚠ THE LABELS LEAVE IN THE FIRST THIRD OF THE PUSH. The push magnifies the
   * whole sheet, and the label under the card it enters swells to ~110px and
   * sweeps down through the subtitle band — with the subtitles on, it wrote
   * itself over them ("dalam satu chart nyata" under a giant chapter name).
   * The one departure from TA01's first transition, and only in this move.
   */
  labelsOut: 30,
};
// ═══════════════════════════════════════════════════════════════════════════

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** The roadmap's own curve (theme.roadmap.ease) — every move runs on it. */
const ease = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], {
    ...CLAMP,
    easing: theme.roadmap.ease,
  });

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
  const fade =
    "radial-gradient(ellipse 68% 68% at 50% 50%, black 35%, transparent 100%)";
  const drift =
    ((((f % PAPER.loop) + PAPER.loop) % PAPER.loop) / PAPER.loop) * PAPER.cell;
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
  x,
  y,
  w = CARD.w,
  h = CARD.h,
  text,
  opacity,
  flat = false,
  glow = 0,
  labelOpacity = 1,
  radius = theme.roadmap.cardRadius,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  text: string;
  opacity: number;
  flat?: boolean;
  glow?: number;
  labelOpacity?: number;
  radius?: number;
}) => {
  const rect = {
    position: "absolute" as const,
    left: x,
    top: y,
    width: w,
    height: h,
    borderRadius: radius,
  };
  return (
    <div style={{ opacity }}>
      <div
        style={{
          ...rect,
          background: theme.roadmap.paper,
          border: `${theme.shape.hairline}px solid ${theme.roadmap.rule}`,
          boxShadow: flat ? "none" : theme.roadmap.cardShadow,
        }}
      />
      {glow > 0.001 && (
        <div
          style={{
            ...rect,
            opacity: glow,
            boxShadow: `0 0 0 2px ${theme.color.indigo}, 0 0 48px 14px ${theme.roadmap.glowTint}`,
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y + h + CARD.labelGap,
          width: w,
          textAlign: "center",
          fontFamily: theme.text.family,
          fontSize: theme.roadmap.labelSize,
          fontWeight: 700,
          // indigo, as Simon asked of TA03's roadmap
          color: theme.color.indigo,
          letterSpacing: 0.5,
          opacity: labelOpacity,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** The film's picture, frozen at ORIGINAL frame `freeze`. */
export type FilmAt = React.FC;

/**
 * What a box shows: the film frozen at the frame that folded into it (a
 * number), a drawing composed at full frame size (RoadmapCards), or nothing.
 */
export type Preview = number | React.FC | null;

const Thumb = ({
  box,
  preview,
  Film,
  radius = theme.roadmap.cardRadius,
}: {
  box: { x: number; y: number };
  preview: Preview;
  Film: FilmAt;
  radius?: number;
}) =>
  preview === null ? null : (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: CARD.w,
        height: CARD.h,
        borderRadius: radius,
        overflow: "hidden",
      }}
    >
      {/* ⚠ CENTRED, NOT TOP-ALIGNED: the card is 1.775 and the frame 1.778, so
          the picture is 0.25px shorter than the card; centred, a push lands it
          on the frame to the pixel. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: (CARD.h - theme.canvas.height * SCALE) / 2,
          width: theme.canvas.width,
          height: theme.canvas.height,
          transform: `scale(${SCALE.toFixed(6)})`,
          transformOrigin: "0 0",
        }}
      >
        {typeof preview === "number" ? (
          <Freeze frame={preview}>
            <Film />
          </Freeze>
        ) : (
          React.createElement(preview)
        )}
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
  /** Per box: a frame folded there earlier, a drawing, or nothing. */
  previews: readonly Preview[];
  /** This stop's push, in frames, if not M.push. */
  push?: number;
  /**
   * The roadmap's dissolve off the next scene, in frames, if not M.dissolve.
   * 0 is a cut on `end` — for a box whose picture IS the next scene's frame
   * at `end`, where the push lands on the scene itself.
   */
  dissolve?: number;
};

/** Folds the frozen picture into `box`; clip and scale on one curve. */
const folded = (
  p: number,
  box: { x: number; y: number; w: number; h: number },
) => {
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
        `inset(${(box.y * p).toFixed(1)}px ${((W - box.x - box.w) * p).toFixed(1)}px ` +
        `${((H - box.y - box.h) * p).toFixed(1)}px ${(box.x * p).toFixed(1)}px ` +
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
        `scale(${(1 + (box.w / W - 1) * p).toFixed(4)})`,
      transformOrigin: "0 0",
    },
  };
};

export const RoadmapStop = ({ stop, Film }: { stop: Stop; Film: FilmAt }) => {
  /** Already global — there is no Sequence to rebase. */
  const f = useCurrentFrame();
  const dissolve = stop.dissolve ?? M.dissolve;
  if (f < stop.at || f >= stop.end + dissolve) return null;

  const shrink = ease(f, stop.at, M.shrink);
  const pushDur = stop.push ?? M.push;
  const pushAt = stop.end - pushDur;
  /* ⚠ ON A CUT THE PUSH ARRIVES ONE FRAME EARLY: its last frame must be the
     picture at exactly 1:1, identical to the scene that replaces it on
     `end`. Eased to `end` itself it is still 0.05% short on `end - 1`, and
     the cut shows as every edge stepping half a pixel. */
  const push = ease(f, pushAt, dissolve > 0 ? pushDur : pushDur - 1);
  /** Starts where the push lands, so the roadmap leaves off the TOP of the new chapter. */
  const gone = dissolve > 0 ? ease(f, stop.end, dissolve) : 0;
  /**
   * ⚠ THE CARD BEING ENTERED SQUARES ITS CORNERS AS IT ARRIVES. Magnified to
   * the frame, a 16px corner is a 61px curve cut out of each corner of the
   * screen — invisible under a dissolve, but a cut onto the scene (dissolve 0)
   * would pop it square. It reaches 0 exactly as the push lands.
   */
  const intoRadius = theme.roadmap.cardRadius * (1 - push);

  /**
   * ⚠ AND ON A CUT, THE LANDED FRAME IS THE SCENE ITSELF, UNSCALED. A picture
   * scaled into the card and magnified back lands a pixel high — the browser
   * snaps the card's sub-pixel offset at the small scale — so the cut would
   * still step. Once the push is complete the frozen frame is drawn at 1:1,
   * which is exactly what the scene shows on `end`.
   */
  const landed = stop.previews[stop.into];
  if (dissolve === 0 && push >= 1 && typeof landed === "number") {
    return (
      <AbsoluteFill>
        <Freeze frame={landed}>
          <Film />
        </Freeze>
      </AbsoluteFill>
    );
  }
  const glowIn = ease(f, pushAt - M.glowLead, M.glowLead) * (1 - push);
  const labels = 1 - ease(f, pushAt, M.labelsOut);

  /** Only the first stop has an Introduction to get rid of. */
  const swap =
    stop.land === null ? ease(f, stop.at + M.shrink + M.hold, M.swap) : 1;
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
  const introY = -(INTRO.y + INTRO.h + 240) * swap;
  const gridY = (theme.canvas.height - GRID.y + 160) * (1 - swap);

  return (
    /* No zIndex: nothing in this film carries one, and the captions, mounted
       after the roadmap, must stay on top of it. */
    <AbsoluteFill style={{ opacity: 1 - gone }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          ...cardPush(push, BOXES[stop.into]),
        }}
      >
        <Ground f={f} />

        {/* ── the four chapters ─────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateY(${gridY.toFixed(1)}px)`,
          }}
        >
          {BOXES.map((b, i) => (
            <div key={i} style={{ opacity: swap }}>
              <Box
                x={b.x}
                y={b.y}
                text={b.text}
                opacity={1}
                flat={stop.into === i}
                glow={stop.into === i ? glowIn : 0}
                labelOpacity={labels}
                radius={stop.into === i ? intoRadius : undefined}
              />
              <Thumb
                box={b}
                preview={stop.previews[i]}
                Film={Film}
                radius={stop.into === i ? intoRadius : undefined}
              />
            </div>
          ))}
          {stop.land !== null && picture}
        </div>

        {/* ── the Introduction, only on the first stop ──────────────────── */}
        {stop.land === null && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateY(${introY.toFixed(1)}px)`,
            }}
          >
            <Box
              x={INTRO.x}
              y={INTRO.y}
              w={INTRO.w}
              h={INTRO.h}
              text="Introduction"
              opacity={shrink}
            />
            {picture}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
