import React from "react";
/**
 * CG-B — SC03 · SC04 · SC05 · SC06. `from 1460 · dur 3434`
 *
 * PART 01, and one panel carried through it: a price pane with a volume pane
 * under it, sharing an x axis, so "satu candle ↔ satu volume bar" stays true
 * for four scenes instead of being asserted once and rebuilt three times.
 *
 * The four claims, in order:
 *   SC03  a volume bar counts SHARES over ONE PERIOD — and the period is the
 *         timeframe, which is why the tabs are there and why the chart under
 *         them does not change when the label does
 *   SC04  volume is not a headcount
 *   SC05  a bar means nothing alone — and the two histograms MUST share a
 *         y-scale, or the scene argues the opposite of its narration
 *   SC06  so read them together
 */
import { AbsoluteFill, Freeze, Img, Loop, OffthreadVideo, Sequence, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import {
  Stage, Card, Chart, VolumeBars, Crosshair, Chip, Title, Line, Words, KeyPoint, HighlightBox, DashedBox, dashOpenAt,
  cutInStyle, cutOutStyle,
  SourceTag, StatStrip, TimeframeTabs, Panel, splitRects,
  gridOf, domainOf, useMotion, useShadow, usePalette, progress, progressInOut, textReveal, popIn, theme,
  TuntunMark, QuoteCard, quoteListY, GridGround,
  RoadmapCards, shrinkClip, cardPush, ROADMAP_SLOTS, ROADMAP_CARD,
} from "../../../core";
import { BLOCK, BEAT, CUTS, NOTE, NOTE_POP, MASCOT, PAIR_SHOTS, SPLIT, TRANS, RAIL, HEAD, FASE, FASE_IMG, FIELD, HALO, RUNNING, RUNNING_LINE, TFW, TF_PICK, local } from "../data/timing";
import { MAP_LABELS } from "../data/timing";
import { roadmapContents } from "./MainChartGroup";
import { PRICE, VOL, TAG_Y, GAP, halves, panes, BBCA_IMG, RUNNING_IMG, RUNNING_CROP, RUNNING_SEEN, BBCA_VOL, P_CONTENT } from "../data/layout";
import {
  PAIR, PAIR_VOL, PAIR_AT,
  STOCK_A, STOCK_B, VOL_A, VOL_B, VOL_PEAK, TODAY, AVG_A, AVG_B,
  TWO, TWO_DOMAIN, TWO_VOL_STRONG, TWO_VOL_PEAK,
} from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC03;
const T = {
  pair: local(BEAT.whatIsVolume, FROM),
  period: local(BEAT.onePeriod, FROM),
  daily: local(BEAT.daily, FROM),
  fiveMin: local(BEAT.fiveMin, FROM),
  sc04: local(BLOCK.SC04, FROM),
  notPeople: local(BEAT.notPeople, FROM),
  bigPlayers: local(BEAT.bigPlayers, FROM),
  notHowMany: local(BEAT.notHowMany, FROM),
  sc05: local(BLOCK.SC05, FROM),
  alone: local(BEAT.alone, FROM),
  tenMillion: local(BEAT.tenMillion, FROM),
  elsewhere: local(BEAT.normalElsewhere, FROM),
  average: local(BEAT.average, FROM),
  sc06: local(BLOCK.SC06, FROM),
  priceWhere: local(BEAT.priceWhere, FROM),
  volumeHow: local(BEAT.volumeHow, FROM),
  together: local(BEAT.together, FROM),
};
// ═══════════════════════════════════════════════════════════════════════════

const PAIR_DOMAIN = domainOf(PAIR.closes, PAIR.bars);
const G = gridOf(PAIR.closes, PAIR_DOMAIN, PRICE, 0.12, 96);
const PAIR_PEAK = Math.max(...PAIR_VOL);

/* SC05's two stocks, side by side. ⚠ ONE domain for the prices AND one peak
   for the histograms — see the header. */
const [L, R] = halves();
const SIDE = { left: panes(L, 0.2), right: panes(R, 0.2) };
const FIVE_DOMAIN = domainOf(
  [...STOCK_A.closes, ...STOCK_B.closes],
  [...STOCK_A.bars, ...STOCK_B.bars],
);
const GA = gridOf(STOCK_A.closes, FIVE_DOMAIN, SIDE.left.price, 0.12, 0);
const GB = gridOf(STOCK_B.closes, FIVE_DOMAIN, SIDE.right.price, 0.12, 0);
const volY = (box: { y: number; h: number }, v: number) => box.y + box.h - (v / VOL_PEAK) * box.h;

const juta = (n: number) => `${n} juta`;

/* ═══ SC03's TWO SCREENSHOTS ═══════════════════════════════════════════
 *
 * ⚠ PASTED WHOLE, AND STANDING ON NOTHING — Simon's call: no card behind them
 * and the white knocked out of the files themselves, so what is left is the
 * app's own marks sitting straight on the episode's paper.
 *
 * ⚠ THEY START BELOW THE LOGO ZONE. The shots are portrait, so height is what
 * limits them, and running them to the top margin would push the right-hand one
 * under the 360x150 the logo owns. y176 clears it; everything else follows from
 * that and the caption band.
 *
 * ⚠ ONE HEIGHT FOR BOTH, so the pair stays at one scale. These are two counts
 * of the same day and the whole point is comparing them.
 */
const SHOT = (() => {
  /**
   * ⚠ SIZED FOR THE ENLARGED STATE, NOT THE RESTING ONE. The selected shot is
   * drawn at TF_PICK.up and carries a halo outside its edge, so the height that
   * matters is `h * up + glow`. Sizing to the resting state put the lifted one
   * through the caption band, which is reserved and stays empty.
   *
   * The room runs from the bottom of the logo zone to the top of that band; 56
   * of it is given back so the halo has somewhere to bloom.
   */
  const room = theme.captionBand.top - theme.logoZone.height - 56;
  const h = room / TF_PICK.up;
  /** ⚠ 30 UP FROM CENTRED IN THAT ROOM — Simon's nudge. */
  const top = theme.logoZone.height + 28 + (room - h) / 2 - 30;
  const w = (h * BBCA_IMG.w) / BBCA_IMG.h;
  /** ⚠ 140, was 60 — Simon asked for another 80 between them. */
  const gap = 140;
  return {
    top, h, w,
    x: [theme.canvas.width / 2 - gap / 2 - w, theme.canvas.width / 2 + gap / 2],
  };
})();
/** ⚠ 1D ON THE LEFT, 5m ON THE RIGHT — Simon's order, and the narration
 *  follows it: the left one is spoken about first. */
const TF_WINDOWS = [
  { art: "art/bbca-1d.png", vol: BBCA_VOL.daily },
  { art: "art/bbca-5m.png", vol: BBCA_VOL.fiveMin },
];
/**
 * ⚠ THE MARK IS WIDER THAN THE SCREENSHOT ITSELF — Simon's call: it spans the
 * full width and hangs 20px past each edge. A box drawn inside the picture
 * reads as part of the app's own chrome; one that overhangs is plainly ours.
 * Canvas pixels, applied before the selection's scale.
 */
const HL_PAD = 20;


/**
 * The mascot block: the mark floating over the quote card, and the two lines
 * inside it. Laid out as one object and centred between the logo zone and the
 * caption band, so the pair reads as a single card rather than a mark that
 * happens to be above a box.
 */
const MASCOT_RECT = (() => {
  const { card } = MASCOT;
  const total = card.markH + card.gap + card.h;
  /** ⚠ THE MARK AND THE CARD MOVE AS ONE, 50px up — Simon's nudge. Shifting the
   *  group rather than each piece is what keeps the gap between them fixed. */
  const top =
    (theme.logoZone.height + theme.captionBand.top) / 2 - total / 2 - card.lift;
  const boxY = top + card.markH + card.gap;
  return {
    markY: top,
    box: { x: theme.canvas.width / 2 - card.w / 2, y: boxY, w: card.w, h: card.h },
    /* centred in the card BY ITS INK, not by its boxes — see quoteListY */
    listY: quoteListY(boxY, card.h, card.lead, MASCOT.lines.length),
  };
})();

/**
 * The rail p2, the volume window and p3 stand on. Rail coordinates are CENTRES,
 * one column apart; the camera moves, they do not — see RAIL.
 */
const RAIL_C = { p2: 0, win: RAIL.col.b - RAIL.col.a, p3: (RAIL.col.b - RAIL.col.a) * 2 };
/** Top-left of a box centred on a rail column. */
const railBox = (centre: number, w: number, h: number) => ({
  left: centre - w / 2,
  top: RAIL.midY - h / 2,
  width: w,
  height: h,
});
/**
 * The window, sized BY ITS BARS rather than the other way round.
 *
 * ⚠ `gridOf` KEEPS AN 18px GUTTER OF ITS OWN at each end and then spreads the
 * three bars evenly across what is left, so the spacing is (pane − 36) / 2.
 * Setting that to bar + gap is what actually produces Simon's 10px, and it is
 * why the pane — and with it the window — is computed here instead of typed.
 */
const RAIL_WIN = (() => {
  const spacing = RAIL.bars.w + RAIL.bars.gap;
  const pane = spacing * 2 + 36;
  return { w: pane + RAIL.win.pad * 2, h: RAIL.win.h, pane };
})();
const RAIL_PANE = (() => {
  const b = railBox(RAIL_C.win, RAIL_WIN.w, RAIL_WIN.h);
  return {
    x: b.left + RAIL.win.pad,
    y: b.top + RAIL.win.pad,
    w: RAIL_WIN.pane,
    h: b.height - RAIL.win.pad * 2,
  };
})();
/** ⚠ ALL THREE GREEN — they are volume bars, the one place outside a candle
 *  body where this palette is allowed a colour at all. */
/**
 * SC06's two windows and the panes inside them.
 *
 * ⚠ ONE GRID FOR BOTH. The bars have to stand under their own candles, and the
 * only way that survives a change to either box is for the histogram to read
 * its x from the PRICE grid — which is what VolumeBars takes a grid for.
 */
const SPLIT_RECT = (() => {
  const cx = theme.canvas.width / 2 - SPLIT.shift;
  const x = cx - SPLIT.w / 2;
  const box = (r: { y: number; h: number }) => ({ x, y: r.y, w: SPLIT.w, h: r.h });
  const pane = (r: { x: number; y: number; w: number; h: number }) => ({
    x: r.x + SPLIT.pad,
    y: r.y + SPLIT.pad,
    w: r.w - SPLIT.pad * 2,
    h: r.h - SPLIT.pad * 2,
  });
  const price = box(SPLIT.price);
  const vol = box(SPLIT.vol);
  return { price, vol, pricePane: pane(price), volPane: pane(vol) };
})();
const SPLIT_GRID = gridOf(TWO.closes, TWO_DOMAIN, SPLIT_RECT.pricePane, 0.02, 0);

const RAIL_BARS = [0, 1, 2].map(() => ({ o: 1, h: 2, l: 1, c: 2 }));

/**
 * Draw a clip so its DRAWING fills the box, not its canvas.
 *
 * ⚠ `objectFit: contain` FITS THE WRONG THING. It fits the exported canvas,
 * which for these files is mostly empty margin — so the drawing lands at 40-65%
 * of the tile it was given. This scales by the drawing's own measured box and
 * slides its centre onto the tile's, which is the whole of why they now read as
 * big enough. See P_CONTENT.
 *
 * ⚠ IT RETURNS A WRAPPER'S STYLE, NOT THE VIDEO'S. OffthreadVideo overrides
 * `width` and `height` off its own style, so sizing it directly did nothing —
 * the clip kept coming back at `contain` scale while the offsets moved, which
 * looked like the drawing being cropped. The wrapper carries the size and the
 * video fills it.
 */
const fillWithDrawing = (art: string, w: number, h: number) => {
  const c = P_CONTENT[art];
  const s = Math.min(w / c.w, h / c.h);
  return {
    position: "absolute" as const,
    left: w / 2 - (c.x + c.w / 2) * s,
    top: h / 2 - (c.y + c.h / 2) * s,
    width: FASE_IMG.w * s,
    height: FASE_IMG.h * s,
  };
};
const FILL = { width: "100%", height: "100%" } as const;
/**
 * The halo's own box: bigger than the tile, and centred on where the DRAWING
 * sits rather than on the tile — see P_CONTENT.halo.
 */
const haloBox = (art: string, w: number, h: number) => {
  const c = P_CONTENT[art];
  const s = Math.min(w / c.w, h / c.h);
  const d = Math.max(w, h) * HALO.scale;
  /* the same mapping fillWithDrawing uses, applied to the ink's centroid */
  const cx = w / 2 + (c.halo.x - (c.x + c.w / 2)) * s;
  const cy = h / 2 + (c.halo.y - (c.y + c.h / 2)) * s;
  return {
    position: "absolute" as const,
    left: cx - d / 2,
    top: cy - d / 2,
    width: d,
    height: d,
    borderRadius: "50%",
    background: theme.color.halo,
  };
};
const RAIL_GRID = gridOf([1, 1, 1], [0, 1], RAIL_PANE, 0, 0);

/**
 * The two columns, derived from the files' own ratios and the room between the
 * logo zone and the caption band — see PAIR_SHOTS.
 */
const PAIR_RECT = (() => {
  const { w, gap, between, ratio } = PAIR_SHOTS;
  const head = w / ratio.head;
  const chart = w / ratio.chart;
  const h = head + gap + chart;
  const top = (theme.logoZone.height + theme.captionBand.top) / 2 - h / 2;
  const x = [
    theme.canvas.width / 2 - between / 2 - w,
    theme.canvas.width / 2 + between / 2,
  ];
  const chartTop = top + head + gap;
  return { w, head, chart, gap, h, top, x, chartTop };
})();

/**
 * ⚠ THE CAPTURE'S FRAME, DERIVED FROM THE FILE. Portrait off a phone, so height
 * is what limits it: it runs from the top margin to the caption band and takes
 * whatever width that leaves. At that width it ends well left of the logo zone,
 * which is why this one — unlike the two screenshots beside it — can start at
 * the top margin rather than below the logo.
 */
const CLIP_BORDER = 2;
const CLIP = (() => {
  const top = theme.margin.top + 20;
  const h = theme.captionBand.top - top - 20;
  /**
   * ⚠ EVERYTHING IS MEASURED AGAINST THE CONTENT BOX, NOT THE OUTER ONE.
   * core/Stage sets `box-sizing: border-box` on every descendant, so the 2px
   * border eats INWARDS: a window declared 470 wide holds 466. Scaling the
   * video against the outer number drew it 4px too big and slid it out from
   * under its own crop — which is why a black edge survived being cropped.
   */
  const inner = { h: h - CLIP_BORDER * 2 };
  const innerW = (inner.h * RUNNING_SEEN.w) / RUNNING_SEEN.h;
  const w = innerW + CLIP_BORDER * 2;
  /** Canvas pixels per file pixel — the video is drawn full size and slid. */
  const s = innerW / RUNNING_SEEN.w;
  /**
   * ⚠ LEFT OF CENTRE, NOT AGAINST THE MARGIN — Simon's call. It sits a clear
   * 104px inside the left margin so it still reads as placed rather than
   * pushed, and what it makes room for is the sentence beside it.
   */
  const x = theme.margin.left + 104;
  return {
    top,
    h,
    w,
    x,
    /** The column to its right: the word, then the definition under it. */
    text: (() => {
      const gap = 88;
      const left = x + w + gap;
      const width = Math.min(theme.canvas.width - theme.margin.right - left, 700);
      /* the box's own numbers, so the block's height is derived rather than
         guessed and the pair can be centred against the capture */
      const pad = 32;
      const line = Math.round(theme.text.body.size * 1.35);
      const box = { h: pad * 2 + line * 2, w: width };
      const headH = Math.round(theme.text.display.size * 1.1);
      const between = 30;
      const total = headH + between + box.h;
      const topY = top + h / 2 - total / 2;
      return {
        left,
        width,
        pad,
        line,
        box,
        /** Centre-y of the big word. */
        headY: topY + headH / 2,
        boxTop: topY + headH + between,
      };
    })(),
    video: {
      left: -RUNNING_CROP.left * s,
      top: -RUNNING_CROP.top * s,
      width: RUNNING_IMG.w * s,
      height: RUNNING_IMG.h * s,
    },
  };
})();

/**
 * The headline that corrects itself — see HEAD.
 *
 * ⚠ ALL THREE PHRASES SHARE ONE GRID CELL. The grid sizes that cell to the
 * widest of them, so a roll cannot make the line jump width halfway through;
 * and one number — how far along the sequence we are — places every phrase,
 * so two rolls cannot get out of step with each other.
 */
const Headline = ({ g }: { g: number }) => {
  const m = useMotion();
  const c = usePalette();
  if (g < HEAD.at || g >= HEAD.gone) return null;
  const inn = textReveal(g, HEAD.at, m.reveal);
  /* ⚠ 30 FRAMES AFTER THE WORDS HAVE LANDED, not after they start — see HEAD */
  const strikeAt = HEAD.at + m.reveal + HEAD.hold;
  const struck = progress(g, strikeAt, m.sec(0.35));
  /** 0 → 1 → 2 as the sequence advances; every phrase is placed off this. */
  const pos = HEAD.roll.reduce((n, at) => n + progressInOut(g, at, m.sec(0.42)), 0);
  return (
    <div
      style={{
        position: "absolute",
        left: HEAD.x,
        top: HEAD.y,
        display: "grid",
        gridTemplateColumns: "auto auto",
        columnGap: "0.32em",
        fontFamily: theme.text.family,
        fontSize: HEAD.size,
        fontWeight: theme.text.title.weight,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        opacity: inn.opacity,
        transform: `translateY(${inn.dy}px)`,
      }}
    >
      <span style={{ gridColumn: 1, color: c.indigo }}>{HEAD.label}</span>
      <span style={{ gridColumn: 2, display: "grid", overflow: "hidden", height: HEAD.lead }}>
        {HEAD.phrases.map((text, i) => (
          <span
            key={text}
            style={{
              gridArea: "1 / 1",
              /* ⚠ SHRINK TO ITS OWN WORDS. A grid item fills its cell, and the
                 cell is as wide as the LONGEST phrase — so the strike, drawn as
                 a percentage of this span, ran on past the words it crosses. */
              justifySelf: "start",
              position: "relative",
              /* the wrong answer greys out; the two right ones stay indigo */
              color:
                i === 0
                  ? interpolateColors(struck, [0, 1], [theme.color.indigo, c.muted])
                  : c.indigo,
              transform: `translateY(${((i - pos) * HEAD.lead).toFixed(1)}px)`,
            }}
          >
            {text}
            {i === 0 ? (
              /* the strike, drawn rather than a text-decoration, so it arrives */
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "0.58em",
                  width: `${(struck * 100).toFixed(1)}%`,
                  height: theme.shape.rule,
                  background: c.muted,
                }}
              />
            ) : null}
          </span>
        ))}
      </span>
    </div>
  );
};

export const UnderstandGroup = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const shadow = useShadow();
  const c = usePalette();
  const isFive = f >= T.fiveMin;

  /**
   * ═══ ⚠ TEMPORARY — SC03 IS BLANK ═══
   *
   * Simon's call: the frame is cleared from f1515 to f2450 so SC03 can be
   * directed from nothing, the way SC01 was. Nothing below has been deleted —
   * this is one early return, and removing it brings the scene back exactly as
   * it was.
   *
   * ⚠ THE VOICE, THE SUBTITLES AND THE FRAME TABLE ARE UNTOUCHED. SC03 still
   * owns f1516–f2448, so the timeline stays in sync and the narration keeps
   * running over an empty stage rather than the block collapsing.
   *
   * ⚠ THIS ONLY EMPTIES CG-B. Scene 1's four-card roadmap is CG-A, which is
   * mounted ON TOP and holds to MAP_HOLD (f1691) — it still occupies the first
   * 176 frames of this range by design.
   */
  const g = f + FROM;

  /* ⚠ RUNS PAST SC04's START by 7 frames — Simon's range. See TFW. */
  if (g >= TFW.at && g < TFW.gone) {
    /* 0 while the left one is being talked about, 1 once the right one is. One
       number drives both sides, so they can never both be selected. */
    const pick = progress(f, local(TFW.right, FROM), TF_PICK.over);
    return (
      /* ⚠ OPAQUE, ON theme.color.bg. The screenshots have had their white
         knocked out, so they need a ground of their own; leaving the stage
         transparent left them standing on whatever was behind. */
      <Stage>
        {TF_WINDOWS.map((w, i) => {
          const at = local(TFW.at, FROM) + i * m.sec(0.12);
          const shown = progress(f, at, m.sec(0.6));
          /** 1 when this side is the one being read. */
          const sel = i === 0 ? 1 - pick : pick;
          /* ⚠ ONLY THE PICKED ONE GROWS, and from the original — see TF_PICK.
             The other holds its size and steps back by fading instead. */
          const scale = 1 + sel * (TF_PICK.up - 1);
          const dim = TF_PICK.dim + sel * (1 - TF_PICK.dim);
          const centre = {
            x: SHOT.x[i] + SHOT.w / 2,
            y: SHOT.top + SHOT.h / 2,
          };
          /** The frame this side's turn begins on — its arrows count from here. */
          const turn = i === 0 ? local(TFW.at, FROM) : local(TFW.right, FROM);
          return (
            <div
              key={w.art}
              style={{
                position: "absolute",
                inset: 0,
                opacity: shown * dim,
                transform: `scale(${scale.toFixed(4)})`,
                transformOrigin: `${centre.x}px ${centre.y}px`,
              }}
            >
              {/* ⚠ THE BLOOM SITS ON THE PICTURE'S OWN EDGE, at exactly its
                  rect. It used to be a separate haloed rectangle standing off
                  by 18px, which put a second edge outside the image's border —
                  two borders, not one lit one. `bloom` is the glow with its
                  ring removed for precisely this case. */}
              {sel > 0.001 ? (
                <div
                  style={{
                    position: "absolute",
                    left: SHOT.x[i],
                    top: SHOT.top,
                    width: SHOT.w,
                    height: SHOT.h,
                    borderRadius: theme.shape.panelRadius,
                    boxShadow: shadow.bloom,
                    opacity: sel,
                  }}
                />
              ) : null}
              {/* ⚠ THE ONLY EDGE THE PICTURE HAS, and it is the one that
                  lights: grey at rest, indigo when this side is picked.
                  The white was knocked out of these files on purpose, so at
                  rest there is almost nothing separating the shot from the
                  paper — and the unselected one is at 70% on top of that.
                  `gridLine` is the one grey in the theme proven to survive
                  being scaled down; the hairline greys wash straight into
                  #F5F5F5 at preview size. */}
              <Img
                src={staticFile(w.art)}
                style={{
                  position: "absolute",
                  left: SHOT.x[i],
                  top: SHOT.top,
                  width: SHOT.w,
                  height: SHOT.h,
                  border: `2px solid ${interpolateColors(sel, [0, 1], [theme.color.gridLine, theme.color.indigo])}`,
                  borderRadius: theme.shape.panelRadius,
                }}
              />
              {/* ⚠ THE MARK BELONGS TO THE TURN, not to the screenshot. It
                  opens once this side is picked and goes with it, so it reads
                  as someone pointing rather than as something that was always
                  drawn on the picture. Its rect is fractions measured off the
                  files themselves — see BBCA_VOL. */}
              {sel > 0.001 ? (
                <HighlightBox
                  rect={{
                    x1: SHOT.x[i] - HL_PAD,
                    x2: SHOT.x[i] + SHOT.w + HL_PAD,
                    y1: SHOT.top + w.vol.y1 * SHOT.h - HL_PAD,
                    y2: SHOT.top + w.vol.y2 * SHOT.h + HL_PAD,
                  }}
                  opacity={sel}
                  grow={progress(f, turn + TF_PICK.lead, m.sec(0.5))}
                />
              ) : null}
            </div>
          );
        })}
      </Stage>
    );
  }

  if (f < T.sc04) {
    if (g < RUNNING.at || g >= RUNNING.gone) return null;
    return (
      /* ⚠ OPAQUE, like the two screenshots after it. The capture is a white app
         screen, so it needs a ground of its own rather than whatever happens to
         be behind CG-B. */
      <Stage>
        {/* ⚠ FADES ACROSS THE BOUNDARY — Simon's frames. The roadmap has
            finished dissolving by f1690 and this opens on f1691; without a ramp
            the two meet as a hard cut in the middle of a sentence. The stage
            itself is not faded, only what stands on it: the ground either side
            of the cut is the same #F5F5F5, so there is nothing there to fade. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: progress(f, local(RUNNING.at, FROM), m.fade),
          }}
        >
        {/* ⚠ A SEQUENCE, NOT A BARE MOUNT. OffthreadVideo reads the frame of the
            sequence it is in, so without one it would be asked for frame 1691 of
            a 300-frame clip and draw nothing. This starts the file at its own
            frame 0 on the frame the window opens. */}
        <Sequence
          from={local(RUNNING.at, FROM)}
          durationInFrames={RUNNING.gone - RUNNING.at}
          layout="none"
        >
          <div
            style={{
              position: "absolute",
              left: CLIP.x,
              top: CLIP.top,
              width: CLIP.w,
              height: CLIP.h,
              /* the same 2px grey edge the screenshots carry, so the capture and
                 the stills either side of it read as one family */
              border: `${CLIP_BORDER}px solid ${theme.color.gridLine}`,
              borderRadius: theme.shape.panelRadius,
              overflow: "hidden",
            }}
          >
            {/* ⚠ FULL SIZE AND SLID, not stretched to fit. `objectFit` would
                rescale the picture to the window; this draws every file pixel at
                one scale and lets the window hide the edges Simon cut. */}
            <OffthreadVideo
              src={staticFile("art/running-trade-bbca.mp4")}
              /* the encode already dropped the audio track; this is the belt to
                 that pair of braces, so a re-export with sound cannot leak in */
              muted
              style={{ position: "absolute", ...CLIP.video }}
            />
          </div>
        </Sequence>
        {/* ⚠ OUTSIDE THE SEQUENCE, DELIBERATELY. That Sequence exists to give
            the video its own time base, and everything inside it reads frame 0
            at f1691 — a beat written in scene frames would land 1691 frames
            late. The block below belongs to the scene's clock, not the clip's.

            ⚠ THIS IS THE SUBTITLE, MOVED UP INTO THE FRAME, so the band below
            is muted for exactly the cues it absorbs — see RUNNING_LINE. */}
        <Words
          text={RUNNING_LINE.word}
          x={CLIP.text.left}
          y={CLIP.text.headY}
          at={local(RUNNING.at, FROM) + m.sec(0.35)}
          anchor="left"
          size={theme.text.display.size}
          weight={theme.text.display.weight}
          color={theme.color.indigo}
        />
        {/* ⚠ MOVING AVERAGE'S OWN BOX, ported into core rather than redrawn —
            a dashed rule with a solid block on each corner, rising into place
            and then snapping open sideways. Its content waits for the snap:
            a line that reflows while its container widens gives the trick away,
            which is what `dashOpenAt` is for. */}
        <DashedBox
          x={CLIP.text.left}
          y={CLIP.text.boxTop}
          w={CLIP.text.box.w}
          h={CLIP.text.box.h}
          at={local(RUNNING.at, FROM) + m.sec(0.5)}
        >
          {RUNNING_LINE.lines.map((line, n) => (
            <Words
              key={line}
              text={line}
              x={CLIP.text.pad}
              y={CLIP.text.pad + CLIP.text.line * (n + 0.5)}
              /* every word carries its own frame; `at` is only the floor the
                 box's snap-open imposes on the first of them */
              at={dashOpenAt(local(RUNNING.at, FROM) + m.sec(0.5))}
              atEach={RUNNING_LINE.at[n].map((q) => local(q, FROM))}
              anchor="left"
              size={theme.text.body.size}
              weight={600}
              marks={[
                { text: RUNNING_LINE.markCyan, color: theme.color.hlCyan },
                { text: RUNNING_LINE.markAmber, color: theme.color.hlOrange },
              ]}
            />
          ))}
        </DashedBox>
        </div>
      </Stage>
    );
  }

  /* ⚠ TEMPORARY — see NOTE. The frame is cleared while Simon draws this
     stretch himself; deleting this one return brings SC04 back as it was. */
  if (g >= NOTE.at && g < NOTE.gone) {
    const fase = FASE.find((q) => g >= q.at && g < q.gone);
    /**
     * ⚠ THE HALVES ARE DRAWN STRICTLY EITHER SIDE OF THE CUT FRAME, never both
     * at once. Mounting them together for the length of the move puts two
     * pictures on top of each other and the "cut" reads as a blurry cross-fade
     * — the mistake this pipeline has already made once, at f892.
     */
    const after = g >= CUTS.intoFase.at;
    return (
      <Stage transparent>
        {/* ⚠ THE GROUND IS PAINTED HERE, not by the Stage, because it CHANGES
            across the cut: the episode's paper before it, white after, so the
            clips — which are white to their own edges — have nothing drawing a
            box around them. `cardBg` rather than a typed #FFFFFF: it is the
            same white every card in the library uses. */}
        <AbsoluteFill
          style={{ backgroundColor: after ? c.cardBg : theme.color.bg }}
        />
        {after ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              ...cutInStyle(g, CUTS.intoFase),
              /* ⚠ AND CARRIED OUT AGAIN AT f4253. Before that window opens this
                 is the identity transform, so it costs nothing here. */
              ...cutOutStyle(g, CUTS.intoSplit),
            }}
          >
          {/* ⚠ A SECOND CUT INSIDE THIS ONE, at f3067. SC04's drawings are
              carried out and the closing card carried in; both halves are drawn
              strictly on their own side of the frame, never together, or the
              cut reads as a blurry cross-fade. */}
          {/* ⚠ THE GROUND IS OUTSIDE BOTH HALVES OF THE CUT, so it does not
              travel with them: it is the room this stretch happens in, and a
              floor that slides with the furniture reads as the picture being
              scaled rather than as a camera. From f2461 — Simon's frame — not
              from the closing card. */}
          {/* ⚠ IT ENDS ON THE CUT FRAME, not by fading. A ground that dissolves
              while the picture in front of it is still there reads as the floor
              failing; on the cut frame everything changes at once, which is
              what a cut is. */}
          {g < CUTS.intoPair.at ? (
            <GridGround f={f} opacity={progress(f, local(MASCOT.groundAt, FROM), m.fade)} />
          ) : null}
          <div
            style={{
              position: "absolute",
              inset: 0,
              ...(g < CUTS.intoQuote.at
                ? cutOutStyle(g, CUTS.intoQuote)
                : cutInStyle(g, CUTS.intoQuote)),
            }}
          >
            <Headline g={g} />
            {fase && fase.at === FIELD.at ? (
              /* ═══ p1's FIELD — one at rest, ten racing ═══════════════ */
              <>
                {/* ⚠ ONE RATE, SHARED. Derived from the middle one's window so
                    every copy is literally the same number — see FIELD. */}
                {(() => {
                  const rate = FIELD.srcFrames / (FIELD.main.done - FIELD.at);
                  const dur = FIELD.main.done - FIELD.at;
                  return [
                  {
                    key: "main",
                    box: FIELD.main,
                    at: FIELD.at,
                    /* ⚠ SPED UP TO LAND ON f2685, not trimmed there — see FIELD */
                    rate,
                    dur,
                  },
                  ...FIELD.spots.map((sp, n) => ({
                    key: `c${n}`,
                    box: { ...sp, w: FIELD.copy.w, h: FIELD.copy.h },
                    /* ⚠ step is 0 — they land on the same frame as the middle
                       one, and at the same rate. See FIELD. */
                    at: FIELD.at + (n + 1) * FIELD.copy.step,
                    rate,
                    dur,
                  })),
                  ].map((q) => {
                  if (g < q.at) return null;
                  /* the same entrance the whole stretch uses */
                  const pp = popIn(g, q.at, NOTE_POP.over, { from: NOTE_POP.from });
                  return (
                    <Sequence
                      key={q.key}
                      from={local(q.at, FROM)}
                      durationInFrames={fase.gone - q.at}
                      layout="none"
                    >
                      {/* ⚠ IT HOLDS ITS LAST DRAWING, it does not vanish —
                          Simon's instruction. `Freeze` renders the subtree as
                          though the clock had stopped, so once the clip has run
                          its length the picture stays instead of the stage
                          going empty under it. */}
                      <Freeze frame={Math.min(g - q.at, q.dur - 1)}>
                      <div
                        style={{
                          position: "absolute",
                          left: q.box.x,
                          top: q.box.y,
                          width: q.box.w,
                          height: q.box.h,
                          opacity: pp.opacity,
                          transform: `scale(${pp.scale.toFixed(4)})`,
                        }}
                      >
                        <div style={haloBox(fase.art, q.box.w, q.box.h)} />
                        {/* the clip is larger than its tile — see
                            fillWithDrawing — so THIS is what clips it, and the
                            halo above stays outside so its edge can fade */}
                        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                          <div style={fillWithDrawing(fase.art, q.box.w, q.box.h)}>
                            <OffthreadVideo
                              src={staticFile(fase.art)}
                              transparent
                              muted
                              playbackRate={q.rate}
                              style={FILL}
                            />
                          </div>
                        </div>
                      </div>
                      </Freeze>
                    </Sequence>
                  );
                });
                })()}
              </>
            ) : fase ? (
              /* ═══ p2 · the volume window · p3, on one rail ══════════════ */
              (() => {
                const pan = progressInOut(g, RAIL.cam.at, RAIL.cam.over);
                /* one column of travel, exactly — see RAIL */
                const camX = RAIL.col.a * (1 - pan);
                /* the third bar: in slowly across p2, taller again across p3 */
                const third =
                  RAIL.bars.mid * progress(g, RAIL.bars.grow1.at, RAIL.bars.grow1.over) +
                  (RAIL.bars.tall - RAIL.bars.mid) *
                    progress(g, RAIL.bars.grow2.at, RAIL.bars.grow2.over);
                const loopLen = Math.round((RAIL.loop.gone - RAIL.loop.at) / RAIL.loop.times);
                return (
                  <div style={{ position: "absolute", inset: 0, transform: `translateX(${camX.toFixed(1)}px)` }}>
                    {/* ── p2: plays, then holds, then is carried off ────── */}
                    <Sequence
                      from={local(RAIL.at, FROM)}
                      durationInFrames={RAIL.gone - RAIL.at}
                      layout="none"
                    >
                      <Freeze frame={Math.min(g - RAIL.at, FASE[1].src - 1)}>
                        {/* ⚠ IT FADES AS IT GOES. One column of travel leaves
                            its centre on x0 and 350px of it still showing; the
                            columns are Simon's and stay, so this is what makes
                            "p2 tidak terlihat" true as well. */}
                        <div
                          style={{
                            position: "absolute",
                            ...railBox(RAIL_C.p2, RAIL.clip.w, RAIL.clip.h),
                            opacity: 1 - pan,
                          }}
                        >
                          <div style={haloBox(FASE[1].art, RAIL.clip.w, RAIL.clip.h)} />
                          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                            <div style={fillWithDrawing(FASE[1].art, RAIL.clip.w, RAIL.clip.h)}>
                              <OffthreadVideo
                                src={staticFile(FASE[1].art)}
                                transparent
                                muted
                                style={FILL}
                              />
                            </div>
                          </div>
                        </div>
                      </Freeze>
                    </Sequence>

                    {/* ── the volume window ─────────────────────────────── */}
                    <div
                      style={{
                        position: "absolute",
                        ...railBox(RAIL_C.win, RAIL_WIN.w, RAIL_WIN.h),
                        /* ⚠ FILLED, not just outlined — Simon's call. It stands
                           on the drifting grid now, and an outline alone left
                           the lines running straight through the histogram. */
                        background: c.cardBg,
                        border: `2px solid ${theme.color.gridLine}`,
                        borderRadius: theme.shape.panelRadius,
                      }}
                    />
                    <VolumeBars
                      bars={RAIL_BARS}
                      volume={[RAIL.bars.short[0], RAIL.bars.short[1], third]}
                      grid={RAIL_GRID}
                      box={RAIL_PANE}
                      peak={1}
                      width={RAIL.bars.w}
                    />

                    {/* ── p3: in from off-frame right, twice through ────── */}
                    {g >= RAIL.loop.at ? (
                      <Sequence
                        from={local(RAIL.loop.at, FROM)}
                        durationInFrames={RAIL.loop.gone - RAIL.loop.at}
                        layout="none"
                      >
                        {/* ⚠ TWO PASSES, TIMED TO END ON f3066. Each pass gets
                            half the stretch, and the clip is sped up to fill
                            exactly that — 233 source frames into 93. */}
                        <Loop durationInFrames={loopLen}>
                          <div
                            style={{
                              position: "absolute",
                              ...railBox(RAIL_C.p3, RAIL.clip.w, RAIL.clip.h),
                            }}
                          >
                            <div style={haloBox(FASE[2].art, RAIL.clip.w, RAIL.clip.h)} />
                            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                              <div style={fillWithDrawing(FASE[2].art, RAIL.clip.w, RAIL.clip.h)}>
                                <OffthreadVideo
                                  src={staticFile(FASE[2].art)}
                                  transparent
                                  muted
                                  playbackRate={RAIL.loop.src / loopLen}
                                  style={FILL}
                                />
                              </div>
                            </div>
                          </div>
                        </Loop>
                      </Sequence>
                    ) : null}
                  </div>
                );
              })()
            ) : null}

            {/* ── the mascot and its line ─────────────────────────────── */}
            {g >= MASCOT.at && g < MASCOT.gone ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  ...cutOutStyle(g, CUTS.intoPair),
                }}
              >
                {/* ⚠ THE BOB IS THE SAME PAIR SC01's MASCOT BREATHES ON, so the
                    two readings of the same character move alike. */}
                <TuntunMark
                  x={theme.canvas.width / 2}
                  y={
                    MASCOT_RECT.markY +
                    Math.sin(((g - MASCOT.at) / MASCOT.float.period) * Math.PI * 2) *
                      MASCOT.float.amount
                  }
                  height={MASCOT.card.markH}
                />
                <QuoteCard
                  x={MASCOT_RECT.box.x}
                  y={MASCOT_RECT.box.y}
                  w={MASCOT_RECT.box.w}
                  h={MASCOT_RECT.box.h}
                  at={local(MASCOT.at, FROM) + m.sec(0.2)}
                  listY={MASCOT_RECT.listY}
                  lead={MASCOT.card.lead}
                  count={MASCOT.lines.length}
                >
                  {MASCOT.lines.map((line, n) => (
                    <Words
                      key={line}
                      text={line}
                      x={theme.canvas.width / 2}
                      y={MASCOT_RECT.listY + MASCOT.card.lead * n + MASCOT.card.size * 0.62}
                      at={
                        local(MASCOT.at, FROM) +
                        m.sec(0.45) +
                        n * MASCOT.lines[0].split(" ").length * 6
                      }
                      stagger={6}
                      anchor="center"
                      size={MASCOT.card.size}
                      weight={600}
                      marks={[{ text: MASCOT.mark, color: theme.color.hlCyan }]}
                    />
                  ))}
                </QuoteCard>
              </div>
            ) : null}

            {/* ── the daily screen, brought back at rest ──────────────── */}
            {g >= PAIR_SHOTS.at && g < PAIR_SHOTS.gone ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  ...cutInStyle(g, CUTS.intoPair),
                }}
              >
                {PAIR_SHOTS.cols.map((col, i) =>
                  /* ⚠ EACH IMAGE CARRIES ITS OWN INDIGO EDGE, not one border
                     round the pair: they are two separate readings of the same
                     screen, and a single frame round both would say they are
                     one object. */
                  [
                    { art: col.head, y: PAIR_RECT.top, h: PAIR_RECT.head },
                    {
                      art: col.chart,
                      y: PAIR_RECT.top + PAIR_RECT.head + PAIR_RECT.gap,
                      h: PAIR_RECT.chart,
                    },
                  ].map((q, n: number) => {
                    /* the columns land a beat apart, header before chart */
                    const at = local(PAIR_SHOTS.at, FROM) + (i * 2 + n) * m.sec(0.1);
                    const r = textReveal(f, at, m.reveal);
                    return (
                      <Img
                        key={q.art}
                        src={staticFile(q.art)}
                        style={{
                          position: "absolute",
                          left: PAIR_RECT.x[i],
                          top: q.y,
                          width: PAIR_RECT.w,
                          height: q.h,
                          /* ⚠ A SHADOW, NOT A BORDER — Simon's call. A drawn
                             edge round a screenshot reads as part of the app;
                             lifting it off the paper says it is ours. */
                          borderRadius: theme.shape.panelRadius,
                          boxShadow: shadow.lift,
                          opacity: r.opacity,
                          transform: `translateY(${r.dy}px)`,
                        }}
                      />
                    );
                  }),
                )}

                {/* ── the marked candle, and the readout beside it ─────── */}
                {PAIR_SHOTS.cols.map((_, i) => {
                  const at = local(PAIR_SHOTS.hl.at[i], FROM);
                  const p = progress(f, at, m.sec(0.45));
                  if (p <= 0.001) return null;
                  const cx = PAIR_RECT.x[i] + PAIR_SHOTS.hl.x[i] * PAIR_RECT.w;
                  const half = PAIR_SHOTS.hl.half * PAIR_RECT.w;
                  const co = PAIR_SHOTS.callout[i];
                  const cw = PAIR_SHOTS.calloutW;
                  const ch = cw / co.ratio;
                  return (
                    <React.Fragment key={co.art}>
                      <HighlightBox
                        rect={{
                          x1: cx - half,
                          x2: cx + half,
                          y1: PAIR_RECT.chartTop + PAIR_SHOTS.hl.y1 * PAIR_RECT.chart,
                          y2: PAIR_RECT.chartTop + PAIR_SHOTS.hl.y2 * PAIR_RECT.chart,
                        }}
                        opacity={p}
                        /* ⚠ IT OPENS DOWN THE CANDLE, not across it. `grow` runs
                           from the left edge, which on a band this narrow is a
                           twitch; `collapse` opens it from its own middle, along
                           the axis that actually has length. */
                        collapse={p}
                        radius={10}
                      />
                      <Img
                        src={staticFile(co.art)}
                        style={{
                          position: "absolute",
                          /* ⚠ IN THE MARGIN BESIDE ITS OWN COLUMN. Left of the
                             band means inside the chart, over the data it is
                             explaining; out here it reads as a label ON it. */
                          /* ⚠ HALF ON THE CHART, HALF OFF — see PAIR_SHOTS. */
                          left:
                            i === 0
                              ? PAIR_RECT.x[0] - cw / 2
                              : PAIR_RECT.x[1] + PAIR_RECT.w - cw / 2,
                          top: PAIR_RECT.chartTop + PAIR_RECT.chart / 2 - ch / 2,
                          width: cw,
                          height: ch,
                          borderRadius: theme.shape.chipRadius,
                          /* it has to lift off the chart it is lying on */
                          boxShadow: shadow.glow,
                          opacity: progress(f, at + m.sec(0.15), m.reveal),
                        }}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            ) : null}
          </div>
          </div>
        ) : (
          <div style={{ position: "absolute", inset: 0, ...cutOutStyle(g, CUTS.intoFase) }} />
        )}
      </Stage>
    );
  }

  /* ═══ SC06 — the reading, split in two, and then the chapter turns ═══ */
  if (g >= SPLIT.at && g < TRANS.gone) {
    const priceAt = local(SPLIT.label.at[0], FROM);
    const volAt = local(SPLIT.label.at[1], FROM);
    /**
     * ⚠ ONE CURVE DRIVES THE WHOLE HAND-OVER. `map` shrinks the scene into the
     * card; the same number reveals the board behind it, so the picture cannot
     * arrive before the card that catches it exists.
     */
    const map = progressInOut(g, TRANS.at, TRANS.over);
    const scale = 1 - map * (1 - ROADMAP_CARD.w / theme.canvas.width);
    /**
     * ⚠ A CORRECTION FOR THE FRAME'S EMPTY EDGES. What shrinks is the whole
     * 1920x1080 canvas, but the PICTURE runs from the top window to the dashed
     * box — the caption band below it is empty by design. Centring the canvas
     * would leave the scene riding high in the card with white under it.
     */
    /**
     * ⚠ CORRECTED ON BOTH AXES. What shrinks is the whole 1920x1080 canvas, but
     * the PICTURE runs from the windows to the dashed box and, because the pair
     * was moved 150 left and the labels sit out to the right, it is off-centre
     * horizontally too. Centring the canvas would leave the scene low-left in
     * the card with empty paper around it.
     */
    const seen = {
      top: SPLIT.price.y,
      bottom: SPLIT.quote.y + SPLIT.quote.h,
      left: SPLIT_RECT.price.x,
      right: SPLIT.label.x + 470,
    };
    const off = theme.canvas.height / 2 - (seen.top + seen.bottom) / 2;
    const offX = theme.canvas.width / 2 - (seen.left + seen.right) / 2;
    const slot = ROADMAP_SLOTS[TRANS.landing];
    const centre = {
      x: slot.x + ROADMAP_CARD.w / 2 - theme.canvas.width / 2 + offX * scale,
      y: slot.y + ROADMAP_CARD.h / 2 - theme.canvas.height / 2 + off * scale,
    };
    const push = progress(g, TRANS.push.at, TRANS.push.over);
    return (
      <Stage>
      {/* ⚠ WHITE, NOT THE EPISODE'S PAPER — Simon's call, carried on from the
          stretch before it so the chapter reads as one room. OUTSIDE the shrink
          AND outside the cut, so neither the page nor the ground travels. It
          does NOT fade with the board below: CG-C's page is white too, so the
          two are the same surface and there is nothing to cross-fade. */}
      <AbsoluteFill style={{ backgroundColor: c.cardBg }} />
      {/* ⚠ THE BOARD FADES OFF THE CARD, it is not cut away — see TRANS.fade. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - progress(g, TRANS.fade.at, TRANS.fade.over),
        }}
      >
      <div style={{ position: "absolute", inset: 0, ...cutInStyle(g, CUTS.intoSplit) }}>
      {/* the board these cards stand on, and the camera closing on the next
          chapter once they have all arrived */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          ...cardPush(push, TRANS.next, TRANS.push.amount),
        }}
      >
      <GridGround f={f} opacity={map} />
      <RoadmapCards
        labels={MAP_LABELS}
        reveal={map}
        landing={TRANS.landing}
        /* ⚠ SCENE-LOCAL. RoadmapCards reads the frame of the group it is
           mounted in, and this group starts at f1516 — global numbers here
           would put the other three cards 1516 frames late. */
        cardsAt={TRANS.cards.map((c) => local(c, FROM))}
        cardDur={TRANS.cardDur}
        glow={{ card: TRANS.next, at: local(TRANS.push.at, FROM) - 30, over: 26 }}
        /* ⚠ THE SAME PICTURES AS THE BOARD AT f1400, from one place — see
           roadmapContents. The landing card draws none of its own: the scene
           shrinking into it IS its picture. */
        contents={roadmapContents(
          f,
          m,
          [0, 1, 2, 3].map((i) =>
            i === TRANS.landing
              ? 0
              : local(TRANS.cards[i > TRANS.landing ? i - 1 : i], FROM),
          ),
          TRANS.landing,
        )}
      />
      {/* ⚠ CLIP OUTSIDE, SCALE INSIDE — a clip-path on the scaling wrapper
          scales with it and never matches the card it is clipping into. */}
      <div style={{ position: "absolute", inset: 0, clipPath: shrinkClip(map, TRANS.landing) }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform:
            `translate(${(centre.x * map).toFixed(1)}px, ${(centre.y * map).toFixed(1)}px) ` +
            `scale(${scale.toFixed(4)})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
        }}
      >
        {/* ⚠ EACH WINDOW ARRIVES WITH ITS OWN LABEL — see SPLIT.label. And NO
            RESISTANCE BAND: it belonged to SC01's argument about a level being
            broken, and here it is one more thing to explain in a scene that is
            about reading two panes together. */}
        <Card rect={SPLIT_RECT.price} opacity={progress(f, priceAt, m.fade)} />
        <Chart
          series={TWO}
          grid={SPLIT_GRID}
          at={priceAt + m.sec(0.2)}
          over={m.sec(1.1)}
          tickLabels={false}
          baseline={false}
        />
        <Card rect={SPLIT_RECT.vol} opacity={progress(f, volAt, m.fade)} />
        <VolumeBars
          bars={TWO.bars}
          volume={TWO_VOL_STRONG}
          grid={SPLIT_GRID}
          box={SPLIT_RECT.volPane}
          peak={TWO_VOL_PEAK}
          shown={progress(f, volAt + m.sec(0.2), m.sec(1.1))}
        />

        {/* ⚠ EACH LABEL IS CENTRED ON THE WINDOW IT NAMES, not spaced down the
            side: "arah pasar" belongs to the candles, "keramaian transaksi" to
            the bars, and the eye should be able to draw that line itself. */}
        {SPLIT.label.text.map((text, i) => {
          const box = i === 0 ? SPLIT_RECT.price : SPLIT_RECT.vol;
          return (
            <Words
              key={text}
              text={text}
              x={SPLIT.label.x}
              y={box.y + box.h / 2}
              at={local(SPLIT.label.at[i], FROM)}
              stagger={6}
              anchor="left"
              size={SPLIT.label.size}
              weight={theme.text.title.weight}
              color={theme.color.indigo}
            />
          );
        })}

        {/* the line the whole scene is for, in the same dashed box SC03 uses */}
        <DashedBox
          x={theme.canvas.width / 2 - SPLIT.quote.w / 2}
          y={SPLIT.quote.y}
          w={SPLIT.quote.w}
          h={SPLIT.quote.h}
          at={local(SPLIT.quote.at, FROM)}
        >
          <Words
            text={SPLIT.quote.text}
            x={SPLIT.quote.w / 2}
            y={SPLIT.quote.h / 2}
            at={dashOpenAt(local(SPLIT.quote.at, FROM))}
            stagger={6}
            anchor="center"
            size={theme.text.title.size}
            weight={600}
          />
        </DashedBox>
      </div>
      </div>
      </div>
      </div>
      </div>
      </Stage>
    );
  }

  /* ── SC05 · SC06 own the frame outright ─────────────────────────────── */
  if (f >= T.sc05 && f < T.sc06) {
    return (
      <Stage>
        <Card />
        <SourceTag kind={STOCK_A.kind} y={TAG_Y} />
        <Title text="Volume itu relatif" at={T.alone} />
        {[
          { g: GA, pane: SIDE.left, s: STOCK_A, v: VOL_A, avg: AVG_A, name: "Saham A", read: "Jauh di atas biasanya", tone: "indigo" as const },
          { g: GB, pane: SIDE.right, s: STOCK_B, v: VOL_B, avg: AVG_B, name: "Saham B", read: "Biasa saja", tone: "slate" as const },
        ].map((s, k) => (
          <div key={s.name}>
            <Chart series={s.s} grid={s.g} at={T.alone + m.sec(0.3 * k)} over={m.sec(0.6)} tickLabels={false} baseline={false} />
            {/* ⚠ peak={VOL_PEAK} ON BOTH. Without it each histogram normalises
                to its own maximum and the two draw an identical tallest bar,
                which is precisely the misreading this scene exists to correct. */}
            <VolumeBars bars={s.s.bars} volume={s.v} grid={s.g} box={s.pane.vol} peak={VOL_PEAK} />
            <div
              style={{
                position: "absolute",
                left: s.pane.vol.x,
                top: volY(s.pane.vol, s.avg),
                width: s.pane.vol.w,
                height: theme.shape.hairline,
                background: theme.color.slate,
                opacity: progress(f, T.average, m.reveal),
              }}
            />
            <Chip label={s.name} x={s.pane.price.x} y={s.pane.price.y - theme.text.chip.size} at={T.alone + m.sec(0.3 * k)} anchor="left" pill />
            <Chip
              label={`Hari ini ${juta(s.v[TODAY])} lembar`}
              x={s.pane.price.x + s.pane.price.w / 2}
              y={s.pane.vol.y + s.pane.vol.h + theme.text.chip.size}
              at={T.tenMillion + m.sec(0.3 * k)}
            />
            <Chip
              label={s.read}
              x={s.pane.price.x + s.pane.price.w / 2}
              y={s.pane.vol.y + s.pane.vol.h + theme.text.chip.size * 2.2}
              at={T.elsewhere + m.sec(0.3 * k)}
              tone={s.tone}
            />
          </div>
        ))}
        <KeyPoint
          text="Bandingkan, jangan baca angkanya sendirian"
          at={T.average}
          rect={{ x: theme.stage.card.x, y: theme.stage.caption.y - theme.text.title.size, w: theme.stage.card.w, h: theme.text.title.size * 2 }}
        />
      </Stage>
    );
  }

  /* ── SC06 — the two questions, side by side, then joined ────────────── */
  if (f >= T.sc06) {
    const [a, b] = splitRects(GAP);
    return (
      <Stage>
        <Title text="Baca keduanya bersama" at={T.priceWhere} />
        <Panel rect={{ ...a, y: a.y + a.h * 0.14, h: a.h * 0.52 }} at={T.priceWhere} />
        <Panel rect={{ ...b, y: b.y + b.h * 0.14, h: b.h * 0.52 }} at={T.volumeHow} />
        <Line text="HARGA" x={a.x + a.w / 2} y={a.y + a.h * 0.28} at={T.priceWhere} size={theme.text.title.size} weight={theme.text.title.weight} color={theme.color.indigo} />
        <Line text="Ke mana pasar bergerak" x={a.x + a.w / 2} y={a.y + a.h * 0.45} at={T.priceWhere + m.sec(0.3)} />
        <Line text="VOLUME" x={b.x + b.w / 2} y={b.y + b.h * 0.28} at={T.volumeHow} size={theme.text.title.size} weight={theme.text.title.weight} color={theme.color.cyan} />
        <Line text="Seberapa ramai transaksinya" x={b.x + b.w / 2} y={b.y + b.h * 0.45} at={T.volumeHow + m.sec(0.3)} />
        <Words
          text="Selalu baca volume bersama harga"
          x={theme.canvas.width / 2}
          y={theme.stage.card.y + theme.stage.card.h * 0.82}
          at={T.together}
          size={theme.text.display.size}
          weight={theme.text.display.weight}
        />
      </Stage>
    );
  }

  /* ── SC04 — the headcount misreading ────────────────────────────────── */
  if (f >= T.sc04) {
    const [a, b] = splitRects(GAP);
    const box = (r: typeof a) => ({ ...r, y: r.y + r.h * 0.16, h: r.h * 0.5 });
    return (
      <Stage>
        <Title text="Volume bukan jumlah orang" at={T.notPeople} />
        <Panel rect={box(a)} at={T.notPeople} />
        <Panel rect={box(b)} at={T.bigPlayers} />
        <StatStrip
          stats={[
            { label: "Pelaku", value: "100 investor" },
            { label: "Per orang", value: "1.000 lembar" },
            { label: "Volume", value: "100.000", tone: "indigo" },
          ]}
          rect={box(a)}
          at={T.notPeople}
        />
        <StatStrip
          stats={[
            { label: "Pelaku", value: "2 pemain besar" },
            { label: "Per orang", value: "500.000 lembar" },
            { label: "Volume", value: "1.000.000", tone: "indigo" },
          ]}
          rect={box(b)}
          at={T.bigPlayers}
        />
        <Chip
          label="Volume = jumlah orang"
          x={theme.canvas.width / 2}
          y={theme.stage.card.y + theme.stage.card.h * 0.76}
          at={T.notHowMany}
          tone="slate"
          strike={progress(f, T.notHowMany + m.sec(0.5), m.sec(0.5))}
        />
        <Chip
          label="Volume = lembar saham yang diperdagangkan"
          x={theme.canvas.width / 2}
          y={theme.stage.card.y + theme.stage.card.h * 0.9}
          at={T.notHowMany + m.sec(1.2)}
          check
          pill
        />
      </Stage>
    );
  }

  /* ── SC03 — one candle, one volume bar, one period ──────────────────── */
  return (
    <Stage>
      <Card />
      <SourceTag kind={PAIR.kind} y={TAG_Y} />
      <Title text="Apa itu volume?" at={T.pair} />
      <TimeframeTabs
        tabs={["5M", "15M", "1H", "1D", "1W"]}
        active={isFive ? 0 : 3}
        x={theme.stage.card.x + theme.stage.card.w}
        y={theme.stage.card.y - theme.text.chip.size}
        at={T.daily}
        anchor="right"
      />
      <Chart series={PAIR} grid={G} at={T.pair} over={m.sec(1.6)} />
      <VolumeBars bars={PAIR.bars} volume={PAIR_VOL} grid={G} box={VOL} peak={PAIR_PEAK} shown={progress(f, T.pair, m.sec(1.6))} />
      {/* ⚠ THE PAIRING IS DRAWN, NOT SAID. One rule through the candle and its
          own bar is the entire scene: one period, seen twice. */}
      <Crosshair
        grid={G}
        index={PAIR_AT}
        value={PAIR.closes[PAIR_AT]}
        at={T.pair + m.sec(1.8)}
        date={isFive ? "Satu bar = 5 menit" : "Satu bar = 1 hari"}
        rows={[{ label: "Volume", value: "lembar yang diperdagangkan" }]}
      />
      <Words
        text="Berapa banyak lembar saham yang diperdagangkan dalam satu periode"
        x={theme.canvas.width / 2}
        y={theme.stage.caption.y}
        at={T.period}
        size={theme.text.title.size}
        weight={theme.text.title.weight}
        maxWidth={theme.stage.card.w}
      />
    </Stage>
  );
};
