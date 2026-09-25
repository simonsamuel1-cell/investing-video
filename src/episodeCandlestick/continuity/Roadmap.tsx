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
/**
 * THREE CHAPTER CARDS IN ONE ROW — Simon: "Kotak transisinya 3 aja". Smaller
 * than TA01's 536×302 so three fit the safe width, and still the frame's shape
 * (1.775), so a fold into one never squashes and a push never letterboxes.
 */
export const CARD = { w: 504, h: 284, gap: 56, labelGap: 14 };
/** The chapter cards' size before the row — the Introduction is 1.3x THAT. */
const CARD_WAS = { w: 536, h: 302 };

/**
 * Alone, and centred on both axes — TA01's first stop — but 30% LARGER than
 * the chapter cards. Simon, on the SC01 panel folded into it: "preview
 * akhirnya terlalu kecil, besarin 30%". Only this card: four of them at 1.3x
 * would not fit the frame as a 2x2. It keeps the frame's own shape, so the
 * fold into it still does not squash.
 */
const INTRO_SCALE = 1.3;
const INTRO = {
  w: CARD_WAS.w * INTRO_SCALE,
  h: CARD_WAS.h * INTRO_SCALE,
  x: (theme.canvas.width - CARD_WAS.w * INTRO_SCALE) / 2,
  y: (theme.canvas.height - CARD_WAS.h * INTRO_SCALE) / 2,
};

/**
 * The row, centred on both axes INCLUDING the labels under it (a label line is
 * ~36px). Clear of the logo's corner and of the 972 subtitle band.
 */
const ROW_H = CARD.h + CARD.labelGap + 36;
const GRID = {
  x: (theme.canvas.width - (CARD.w * 3 + CARD.gap * 2)) / 2,
  y: (theme.canvas.height - ROW_H) / 2,
};

/** Simon's names, verbatim. */
export const BOXES = [
  { x: GRID.x, y: GRID.y, w: CARD.w, h: CARD.h, text: "Cara baca candle" },
  {
    x: GRID.x + (CARD.w + CARD.gap),
    y: GRID.y,
    w: CARD.w,
    h: CARD.h,
    text: "Makna candle dalam chart",
  },
  {
    x: GRID.x + (CARD.w + CARD.gap) * 2,
    y: GRID.y,
    w: CARD.w,
    h: CARD.h,
    text: "Study Case",
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
   * itself over them ("dalam satu chart nyata" under a giant "Lorem Ipsum").
   * The one departure from TA01's first transition, and only in this move.
   */
  labelsOut: 30,
};
// ═══════════════════════════════════════════════════════════════════════════

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** TA01's easy ease — every move of the roadmap runs on it. */
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
          top: y + h + CARD.labelGap,
          width: w,
          textAlign: "center",
          fontFamily: theme.type.family,
          fontSize: theme.roadmap.labelSize,
          fontWeight: 700,
          // indigo, as TA09/TA11's roadmaps — Simon: "warna text di tiap scene transisi jadi indigo aja deh"
          color: theme.colors.indigo,
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
      {/* ⚠ CENTRED, NOT TOP-ALIGNED. The card is 1.775 and the frame 1.778, so
          the picture is 0.25px shorter than the card; centred, a push lands
          it on the frame to the pixel — which SC02 now depends on, since it
          takes over the Cara-baca-candle drawing where the push leaves it. */}
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
      <AbsoluteFill style={{ zIndex: 20 }}>
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
    /* ⚠ zIndex 20: the film's Ticker ("$ABCD") carries zIndex 10 to stay above
       its own panel chrome, and without a layer of its own the roadmap was
       drawn UNDER it — the ticker floated over the paper for the whole of
       stop 1. Still below the watermark's 100. */
    <AbsoluteFill style={{ opacity: 1 - gone, zIndex: 20 }}>
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
