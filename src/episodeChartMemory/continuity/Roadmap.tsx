/**
 * ═══ THE ROADMAP — this video's transition scene ═══
 *
 * Simon: "Ini adalah Scene Transisi untuk video ini." It is adopted from
 * VIDEO 19's roadmap (`019-moving-average/scenes/SceneRoadmap`) but REBUILT
 * here rather than imported: a video owns its folder and may not read outside
 * it, and 019 is a 60fps core episode with a different theme.
 *
 * ⚠ FIVE POINTS, NOT FOUR, AND THAT IS WHY THE LAYOUT DIFFERS. 019 shows one
 * card on top and three below. Here the Introduction is shown ALONE, dead
 * centre, and then LEAVES — it slides up and out while the four chapters rise
 * from below the frame to take its place as a 2×2. Same card size throughout,
 * so the swap reads as the same objects moving, not a new screen.
 *
 * ⚠ IT APPEARS FOUR TIMES AND REMEMBERS WHERE IT WAS. Each stop shrinks the
 * picture you were watching into the box for the chapter that just ended, then
 * pushes into the box for the one about to start:
 *
 *      620   the opening chart → Introduction → 2×2 → push into Memahami Basic
 *     2749   the candle detail → Memahami Basic → push into Alur Grafik
 *     4323   the three timeframes → Alur Grafik → push into Perilaku Pasar
 *     6086   the support chart → Perilaku Pasar → push into Ilusi Kepastian
 *
 * ⚠ THE PUSH LANDS EXACTLY WHEN THE NEXT CHAPTER'S FIRST FRAME ARRIVES, which
 * is why its duration is derived and not authored: `end - push`. Simon gave
 * the frame each push STARTS on; the frame it finishes on is not free, because
 * the scene underneath begins there whatever the roadmap is doing. A push with
 * a fixed length would either land early — leaving a blank white card filling
 * the frame — or still be moving when the film has already cut.
 *
 * ⚠ AND THE PICTURE THAT SHRINKS IS THE REAL SCENE, FROZEN. `<Freeze>` on the
 * scene's own component at its own local frame, not a drawing of it: the
 * handover has to be identical on the frame the shrink starts or it reads as
 * a cut. `<Freeze>` alone is enough — see the note on Preview about why a
 * Sequence around it is not just unnecessary but wrong.
 */
import React from "react";
import { AbsoluteFill, Freeze, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress, progressInOut } from "../helpers";
import { bmriDaily, WIN } from "../data/bmri";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const CARD = { w: 536, h: 302, gap: 60, labelGap: 14, labelSize: 30 };

/** Alone, and centred on both axes — Simon's words for the first stop. */
export const INTRO = {
  x: (theme.canvas.width - CARD.w) / 2,
  y: (theme.canvas.height - CARD.h) / 2,
};

/**
 * The 2×2. Centred horizontally; vertically the block is centred INCLUDING the
 * labels under the bottom row, which is why the cards sit a little above the
 * frame's middle. Its lowest ink lands at 897 — clear of the 972 subtitle band
 * — and its widest at 1526, clear of the logo zone's 1560.
 */
const GRID = {
  x: (theme.canvas.width - (CARD.w * 2 + CARD.gap)) / 2,
  y: 183,
};

export const BOXES = [
  { x: GRID.x, y: GRID.y, text: "Memahami Basic" },
  { x: GRID.x + CARD.w + CARD.gap, y: GRID.y, text: "Alur Grafik" },
  { x: GRID.x, y: GRID.y + CARD.h + CARD.gap, text: "Perilaku Pasar" },
  { x: GRID.x + CARD.w + CARD.gap, y: GRID.y + CARD.h + CARD.gap, text: "Ilusi Kepastian" },
] as const;

/** How long the roadmap takes to leave, once the push has landed. */
export const ROADMAP_DISSOLVE = 14;

const M = {
  shrink: 36, // the picture folding itself into a card
  hold: 12, // a beat on the card before anything else moves
  swap: 36, // Introduction out, the four in — one move, two directions
  dissolve: ROADMAP_DISSOLVE, // the roadmap leaving off the top of the scene underneath
};
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE CARD IS THE FRAME'S OWN SHAPE. 536 × 302 is 1.775 against the frame's
 * 1.778, so a picture folded into it is not squashed and the push out of it
 * does not letterbox. Change the width and the height has to follow.
 */
const SCALE = CARD.w / theme.canvas.width;
/** What the camera has to do to make one card fill the frame again. */
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

/**
 * ⚠ THE PAPER IS WHITE, NOT THE EPISODE'S #F5F5F5 GROUND. Simon asked for it
 * directly, and it is also what 019's reference does: the roadmap is a sheet
 * the film is laid out on, not another scene standing on the same floor. The
 * cards are white too, so what separates them from it is their border and
 * their shadow — which is the whole reason both are on them.
 */
const PAPER = {
  cell: 84,
  /** One whole cell every six seconds, which is what makes the loop seamless:
   *  at the end of the period the pattern is identical to its start, so there
   *  is no frame where it jumps back. */
  loop: 180,
};

/**
 * The graph-paper ground: faint grid, strongest mid-frame, drifting slowly.
 *
 * ⚠ IT DRIFTS BY `backgroundPosition`, NOT BY A TRANSFORM. The vignette is a
 * mask on this same element; translating the element would drag the vignette
 * along with it and the soft edge would wander off the frame.
 *
 * ⚠ AND IT READS THE GLOBAL FRAME, so the paper is one continuous sheet across
 * all four stops rather than four that each start over.
 */
const Ground = ({ f }: { f: number }) => {
  const pal = usePalette();
  const fade = "radial-gradient(ellipse 68% 68% at 50% 50%, black 35%, transparent 100%)";
  const drift = (((f % PAPER.loop) + PAPER.loop) % PAPER.loop) / PAPER.loop * PAPER.cell;
  return (
    <AbsoluteFill style={{ background: pal.cardBg }}>
      {/* ⚠ 2px RULES, NOT 1px. A one-pixel line averages with its neighbours
          the moment anything scales the frame down — at preview size, at 720p,
          on a phone — and becomes the same colour as the paper. 019 lost this
          exact bug once already. */}
      <AbsoluteFill
        style={{
          opacity: 0.55,
          /* ⚠ ONE CELL PER TILE, NOT ONE SCREEN PER TILE. A repeating gradient
             with no backgroundSize paints a tile the size of the ELEMENT, and
             1920 / 84 is 22.86 — so the tile ends mid-cell and every repeat
             seam is a column of the wrong width. It was invisible while the
             paper was still, because the seam sat exactly on the frame's edge;
             drifting it walked the seam into view and Simon caught it as a
             stripe of unintended white. Sized to the cell, the seam lands on a
             cell boundary and there is nothing to see. */
          backgroundImage:
            `linear-gradient(to bottom, ${pal.border} 0 2px, transparent 2px),` +
            `linear-gradient(to right, ${pal.border} 0 2px, transparent 2px)`,
          backgroundSize: `${PAPER.cell}px ${PAPER.cell}px`,
          backgroundPosition: `${drift.toFixed(2)}px ${drift.toFixed(2)}px`,
          maskImage: fade,
          WebkitMaskImage: fade,
        }}
      />
    </AbsoluteFill>
  );
};

/** One empty card and its label. The card that catches a picture gets it drawn over. */
const Box = ({ x, y, text, opacity }: { x: number; y: number; text: string; opacity: number }) => {
  const pal = usePalette();
  return (
    <div style={{ opacity }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: theme.radius.card,
          background: pal.cardBg,
          border: `${theme.stroke.hair}px solid ${pal.border}`,
          boxShadow: theme.shadow.rest,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y + CARD.h + CARD.labelGap,
          width: CARD.w,
          textAlign: "center",
          fontFamily: theme.type.family,
          fontSize: CARD.labelSize,
          fontWeight: 700,
          color: pal.ink,
          letterSpacing: 0.5,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/**
 * ⚠ EVERY BOX CARRIES ITS CHAPTER'S PICTURE, and it is not decoration. The
 * camera pushes INTO a box and holds there for as long as it takes the next
 * chapter to arrive — ninety-nine frames at the second stop. An empty card
 * magnified to fill the frame is three seconds of white screen, which is what
 * this was before.
 *
 * ⚠ AND A BOX'S PICTURE IS THE SAME FRAME THAT LANDS IN IT. Stop 3 folds
 * Scene06 at its local 710 into Alur Grafik, and Alur Grafik's own thumbnail
 * is Scene06 at 710 — so the arriving picture settles onto something
 * identical and there is no frame where the box changes its mind. It also
 * means nothing has to be special-cased: the fold is simply drawn over the
 * top of a picture it matches.
 */
/**
 * ⚠ NO <Sequence> HERE, AND THAT WAS A REAL BUG. A Sequence does not only
 * rebase a clock, it GATES: nothing inside it renders before its start frame.
 * Wrapping a thumbnail in one meant a chapter's card stayed empty until the
 * film had already reached that chapter — so at the first stop all four boxes
 * were blank, which is the opposite of a contents page.
 *
 * `<Freeze frame={n}>` sets the frame absolutely for everything under it, so
 * it is the whole mechanism on its own. It works because every scene in this
 * episode adds its own mount offset internally (SCENE_FROM, or `f + 733` in
 * ChartContinuity) and therefore wants its LOCAL frame, which is exactly what
 * `freeze` is.
 */
export type Preview =
  /** A real scene of this film, frozen at its own local frame. */
  | { freeze: number; Component: React.FC }
  /** A drawing made for the card, at card size. */
  | { Draw: React.FC };

/**
 * ⚠ THE FIRST STOP'S FIRST CARD IS A DRAWING, NOT A FROZEN SCENE. Simon gave a
 * reference for it: plain black high-low bars, "cukup ambil chart hitamnya aja,
 * garis dan label x axis & y axis nya ga perlu". At the first stop the viewer
 * has not met chapter one yet, so a still from inside it is both a spoiler and
 * unreadable at this size; a bare price series says where price comes from and
 * stops there.
 *
 * ⚠ AND THE BARS ARE THE EPISODE'S OWN SERIES, not shapes invented to look
 * right. data/bmri.ts is a seeded placeholder and says so in its own header, so
 * when the real CSV lands this picture changes with every other chart in the
 * film rather than drifting away from them. Nothing here is labelled, so no
 * number is being presented as real either way.
 */
export const HighLowBars: React.FC = () => {
  const pal = usePalette();
  const [a, b] = WIN.sc01;
  const N = 18;
  const step = Math.max(1, Math.floor((b - a) / N));
  const bars = Array.from({ length: N }, (_, i) => bmriDaily[a + i * step]).filter(Boolean);
  const lo = Math.min(...bars.map((d) => d.l));
  const hi = Math.max(...bars.map((d) => d.h));
  const pad = { x: 46, y: 36 };
  const plotW = CARD.w - pad.x * 2;
  const plotH = CARD.h - pad.y * 2;
  const BAR = 11;
  const y = (v: number) => pad.y + ((hi - v) / (hi - lo)) * plotH;
  return (
    <div style={{ position: "absolute", inset: 0, background: pal.cardBg }}>
      {bars.map((d, i) => {
        const top = y(d.h);
        return (
          <div
            key={d.date}
            style={{
              position: "absolute",
              left: pad.x + (plotW / (bars.length - 1)) * i - BAR / 2,
              top,
              width: BAR,
              /* a doji would otherwise be a zero-height nothing */
              height: Math.max(BAR, y(d.l) - top),
              borderRadius: BAR / 2,
              background: pal.ink,
            }}
          />
        );
      })}
    </div>
  );
};

/** A scene, frozen, drawn at card size inside its box. */
const Thumb = ({ box, pv }: { box: { x: number; y: number }; pv: Preview }) => (
  <div
    style={{
      position: "absolute",
      left: box.x,
      top: box.y,
      width: CARD.w,
      height: CARD.h,
      borderRadius: theme.radius.card,
      overflow: "hidden",
    }}
  >
    {"Draw" in pv ? (
      <pv.Draw />
    ) : (
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
        <Freeze frame={pv.freeze}>
          <pv.Component />
        </Freeze>
      </div>
    )}
  </div>
);

export type Stop = {
  /** Global frame the shrink begins. */
  at: number;
  /** Box that catches the picture; `null` is the Introduction card. */
  land: number | null;
  /** Global frame the push begins. */
  push: number;
  /** Box the push goes into. */
  into: number;
  /** Global frame the next chapter's FIRST frame — the push lands here. */
  end: number;
  /** The scene's OWN local frame to freeze at — see Preview, above. */
  freeze: number;
  Component: React.FC;
  /** Overrides the shared set for this stop only. */
  previews?: readonly Preview[];
};

/**
 * Folds the frozen picture into `box`. The clip and the scale run on one
 * curve, so the edges of the frame become the edges of the card.
 */
const folded = (p: number, box: { x: number; y: number }) => {
  const W = theme.canvas.width;
  const H = theme.canvas.height;
  return {
    clip: {
      position: "absolute" as const,
      inset: 0,
      clipPath:
        `inset(${(box.y * p).toFixed(1)}px ${((W - box.x - CARD.w) * p).toFixed(1)}px ` +
        `${((H - box.y - CARD.h) * p).toFixed(1)}px ${(box.x * p).toFixed(1)}px ` +
        `round ${(theme.radius.card * p).toFixed(1)}px)`,
    },
    inner: {
      position: "absolute" as const,
      inset: 0,
      transform:
        `translate(${(box.x * p).toFixed(1)}px, ${(box.y * p).toFixed(1)}px) ` +
        `scale(${(1 + (SCALE - 1) * p).toFixed(4)})`,
      transformOrigin: "0 0",
    },
  };
};

/**
 * ⚠ THIS IS MOUNTED BARE, NOT IN A <Sequence>, AND THAT IS LOAD-BEARING.
 *
 * `<Freeze frame={n}>` does not set a local frame — it sets the TIMELINE's
 * frame to `n + the enclosing sequence's from`, and lets the same offset be
 * subtracted again on the way back down. Inside a Sequence starting at 6086,
 * freezing ChartContinuity at its local 1957 asks the timeline for frame 8043
 * — past this composition's 7827 — so Remotion clamped it to the last frame
 * and the Memahami Basic card quietly showed a different scene at the last
 * stop than it did at the first three. Nothing errored; the picture was just
 * wrong, and only in one of the four places it appears.
 *
 * With no Sequence the offset is zero, `Freeze` means exactly what it says,
 * and every frozen frame is a real frame of this film. The window is enforced
 * by the early return below, which is all the Sequence was doing anyway.
 */
export const RoadmapStop = ({ stop, previews }: { stop: Stop; previews: readonly Preview[] }) => {
  /** Already global — there is no Sequence to rebase. */
  const f = useCurrentFrame();
  /** The window the Sequence used to enforce. It outlives `end` by the
   *  dissolve, because the roadmap leaves off the top of the next scene. */
  if (f < stop.at || f >= stop.end + M.dissolve) return null;

  const shrink = progressInOut(f, stop.at, M.shrink);
  const pushDur = Math.max(1, stop.end - stop.push);
  const push = progressInOut(f, stop.push, pushDur);
  /**
   * ⚠ THE DISSOLVE STARTS WHERE THE PUSH ENDS, NOT BEFORE IT — so the roadmap
   * is still solid on the chapter's first frame and leaves off the TOP of a
   * scene that has already begun drawing underneath.
   *
   * It used to fade out over the last frames of the push instead, and that
   * uncovered the OUTGOING scene rather than the incoming one: at the first
   * stop the camera pushed into Memahami Basic, dissolved onto Scene01's chart
   * still sitting underneath, and only then hard-cut to SC02. Two handovers
   * where there should be one.
   */
  const gone = progress(f, stop.end, M.dissolve);

  /** Only the first stop has an Introduction to get rid of. */
  const swapAt = stop.at + M.shrink + M.hold;
  const swap = stop.land === null ? progressInOut(f, swapAt, M.swap) : 1;

  const target = stop.land === null ? INTRO : BOXES[stop.land];
  const fold = folded(shrink, target);

  const picture = (
    <div style={fold.clip}>
      <div style={fold.inner}>
        <Freeze frame={stop.freeze}>
          <stop.Component />
        </Freeze>
      </div>
    </div>
  );

  /** Introduction rises out of frame; the four rise into it, on one curve. */
  const introY = -(INTRO.y + CARD.h + 240) * swap;
  const gridY = (theme.canvas.height - GRID.y + 160) * (1 - swap);

  return (
    <AbsoluteFill style={{ opacity: 1 - gone }}>
      <div style={{ position: "absolute", inset: 0, ...cardPush(push, BOXES[stop.into]) }}>
        <Ground f={f} />

        {/* ── the four chapters ─────────────────────────────────────────── */}
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${gridY.toFixed(1)}px)` }}>
          {BOXES.map((b, i) => (
            <div key={b.text} style={{ opacity: swap }}>
              <Box x={b.x} y={b.y} text={b.text} opacity={1} />
              <Thumb box={b} pv={(stop.previews ?? previews)[i]} />
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
