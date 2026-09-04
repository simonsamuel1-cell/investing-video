/**
 * CG-A — SC01 · SC02 · SC11 · SC12 · SC13. `from 0 · dur 10411`
 *
 * ═══ ONE CHART, MOUNTED ONCE, CARRIED ACROSS THREE CHAPTERS ═══
 *
 * SC11's narration is "kita kembali ke breakout tadi". If SC11 mounted a chart
 * of its own, that sentence would be a lie the viewer could not catch: the tape
 * would be redrawn at the exact moment they are being told it is the same one.
 *
 * So this group spans f0 to f10411 and DRAWS NOTHING between f1460 and f8154,
 * while SC03–SC10 have the frame. The tape, its domain and its grid are module
 * -scope constants; nothing about them is rebuilt when the picture comes back.
 *
 * ═══ THE ARGUMENT ═══
 *
 * SC01 asks the question on the price pane. SC02 answers it by going DOWN to
 * the volume pane and splitting the frame — the SAME tape twice, and only the
 * histogram differs. SC11 returns to it and names what held price down. SC12
 * and SC13 are then that one breakout candle read twice: once on heavy volume,
 * once on ordinary. Nothing about the price action changes between them, and
 * the viewer can see that, because it never was two charts.
 *
 * ⚠ NO BUY BUTTON. The script asks for a "BUY?" the viewer is told not to
 * press. A rendered buy control IS a buy marker. The beat is kept as what it
 * actually is in the narration — a question, in words, with a question mark,
 * on no fill and no border.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  Stage, Card, Chart, Candles, VolumeBars, Level, PriceTag, Zone, HighlightCircle,
  Chip, Title, Line, SourceTag, Crosshair,
  SplitDivider, SplitLabels,
  gridOf, domainOf, useMotion, progress, progressInOut, textReveal, price as fmtPrice, theme,
  cutInStyle, cutOutStyle, TuntunMark, GridGround, fadeOut,
  RoadmapCards, shrinkClip, cardPush, ROADMAP_SLOTS, ROADMAP_CARD,
} from "../../../core";
import { BLOCK, BEAT, CUTS, OPEN, SHRINK, RES, ZOOM, BREAK1, ASK1, ANS1, BULB, LINE1, TIDY, GROUND, WINDOWS, MAP, MAP_HOLD, MAP_LABELS, CARD2, PUSH, FADE, SC11, HEAD, local } from "../data/timing";
import { PRICE, VOL, TAG_Y, GAP, halves, panes } from "../data/layout";
import {
  MAIN, MAIN_DOMAIN, RESISTANCE, TESTS, BREAK_AT, VOL_HIGH, VOL_AVG, mean,
  CHART1, CHART1_ALL, CHART1_DOMAIN2, CHART1_RES, CHART1_BREAK, CHART1_VOL, CHART1_VOL_WEAK,
  BREAKDOWN, BREAKDOWN_DOMAIN, BREAKDOWN_SUPPORT, BREAKDOWN_HL,
  BREAKDOWN_VOL, BREAKDOWN_VOL_WEAK,
  TWO, TWO_DOMAIN, TWO_VOL_STRONG, TWO_VOL_WEAK, TWO_VOL_PEAK, TWO_RES,
} from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC01;
const T = {
  chart: 0,
  resistance: local(BEAT.resistance, FROM),
  broke: local(BEAT.breakout, FROM),
  valid: local(BEAT.valid, FROM),
  ask: local(BEAT.buy, FROM),
  notYet: local(BEAT.notYet, FROM),
  volumeWord: local(BEAT.volumeWord, FROM),
  split: local(BEAT.twoBreakouts, FROM),
  different: local(BEAT.different, FROM),
  /* the eight scenes that own the frame in between */
  /** ⚠ THE INTRO'S OWN END, not SC03's start — the roadmap holds past it. */
  away: local(MAP_HOLD, FROM),
  back: local(BLOCK.SC11, FROM),
  build: local(SC11.build.at, FROM),
  zone2: local(SC11.zone, FROM),
  zone: local(BEAT.heldItDown, FROM),
  absorb: local(BEAT.absorb, FROM),
  higher: local(BEAT.muchHigher, FROM),
  ordinary: local(BEAT.ordinaryVolume, FROM),
  notFailed: local(BEAT.notFailed, FROM),
  weaker: local(BEAT.weaker, FROM),
  retest: local(BEAT.retest, FROM),
  /** ⚠ THE PICTURE RUNS TO THE END OF CG-A'S SPAN, f11261 — SC14 no longer
   *  exists as a scene of its own. */
  sc14: local(BLOCK.SC15A, FROM),
  shrink: local(SC11.shrink.at, FROM),
  twin: local(SC11.split.at, FROM),
  hl: local(SC11.hl.at, FROM),
  hlBack: local(SC11.hl.back, FROM),
  weak: local(SC11.weak.at, FROM),
  zoom: local(SC11.zoom.at, FROM),
  broke2: local(SC11.broke.at, FROM),
  sc13: local(BLOCK.SC13, FROM),
};
/**
 * ═══ ⚠ BLANK OPENING — Simon's call ═══
 *
 * Nothing this group draws exists before this frame: no chart, no level, no
 * chips, no title. The logo and the burned-in subtitles are NOT here — they are
 * mounted at the Composition root, above every scene — so they carry on
 * untouched, which is what "kecuali logo dan subtitle" asks for.
 *
 * ⚠ THE GROUP STAYS MOUNTED. It returns null rather than being unmounted from
 * the frame table, because the tape it carries has to survive all the way to
 * SC13 — see the header. Blanking is a drawing decision; unmounting would be a
 * timing one and would rebuild the chart.
 *
 * ⚠ f900 IS INSIDE SC02, not on a scene boundary. So SC01 is blank in full and
 * SC02 opens 91 frames late, on its own tape, mid-sentence. That is what was
 * asked for; if the intent was "blank until SC02 begins", the number is 809.
 */
/**
 * ═══ ⚠ SC01 OPENS ON THE FIGURE ALONE ═══
 *
 * Nothing this group draws exists before f109 except the man. The logo and the
 * burned-in subtitles are NOT here — they are mounted at the Composition root,
 * above every scene — so they carry on untouched.
 *
 * ⚠ SC01 ENDS ON A CAMERA CUT AT f892, not on a frame count. What used to be
 * SC02's split screen is gone at Simon's direction: the cut hands straight to
 * the mascot card, which then holds to f1460. `CUTS.toMascot` is the only place
 * that boundary is written down.
 *
 * ⚠ THE GROUP STAYS MOUNTED throughout. It draws nothing rather than being
 * unmounted, because the tape it carries has to survive all the way to SC13.
 */
/** ⚠ EDIT HERE — font size of the "Apakah langsung beli?" question, in px. */
const ASK_SIZE = 70;
/** ⚠ EDIT HERE — font size of the "Belum tentu" answer, in px. */
const ANS_SIZE = 70;
/**
 * ⚠ THE MASCOT BREATHES. A sine measured FROM ITS OWN ARRIVAL, so it starts at
 * rest on the cut frame and returns to rest — a float that begins mid-drift
 * reads as the card having settled wrong. Slow on purpose: one cycle every four
 * seconds, which at 60fps is 240 frames.
 */
const FLOAT = { amount: 12, period: 240 };

/**
 * ═══ THE TWO WINDOWS ═══
 *
 * Side by side, 20px apart, filling the white space the tidied card leaves in
 * the middle of the frame. Each holds a price pane over a volume pane on the
 * SAME x axis, so a volume bar always stands under its own candle.
 */
const WIN_GAP = 20;
/**
 * ⚠ NARROWER THAN THE CARD, AND CENTRED AS A PAIR. At full card width each
 * window was 854px for 22 candles — a slot of nearly 40px, so the tape spread
 * out and read as scattered marks rather than as a chart. 62% of the card puts
 * the slot back under 25px, which is where candles start reading as a series.
 */
const WIN_SPAN = theme.stage.card.w * 0.62;
const WIN_W = (WIN_SPAN - WIN_GAP) / 2;
const WIN_X = theme.canvas.width / 2 - WIN_SPAN / 2;
/* the group sits at the top margin, so the windows take the rest of the card */
const WIN = { y: theme.stage.card.y + theme.stage.card.h * 0.10, h: theme.stage.card.h * 0.82 };
const winRect = (i: number) => ({
  x: WIN_X + i * (WIN_W + WIN_GAP),
  y: WIN.y,
  w: WIN_W,
  h: WIN.h,
});
/** The panes inside a window: 66 / 6 / 28, inset from its own edges. */
const winPanes = (i: number) => {
  const r = winRect(i);
  const pad = 26;
  const box = { x: r.x + pad, w: r.w - pad * 2 };
  const inner = r.h - pad * 2;
  return {
    /**
     * ⚠ THE PRICE PANE REACHES DOWN TO THE HISTOGRAM, with only the gap
     * between them. It used to stop at 0.66 and leave a band of empty white
     * above the volume bars — the window's own size is unchanged, the candles
     * simply use the height that was already there. The volume pane is
     * untouched, so the two still share one x axis and one baseline.
     */
    /* ⚠ THE VOLUME PANE IS UNTOUCHED — same y, same height, so the bars keep
       their size. Only the price pane grows down into the gap. */
    price: { ...box, y: r.y + pad, h: inner * 0.74 },
    vol: { ...box, y: r.y + pad + inner * 0.76, h: inner * 0.24 },
  };
};
const WIN_PANES = [winPanes(0), winPanes(1)];
/**
 * ⚠ pad 0.05, NOT the usual 0.12. `gridOf`'s padding is breathing room above
 * the highest bar and below the lowest, and at 0.12 it was keeping a quarter of
 * the pane permanently empty — which is most of the white space the tape was
 * leaving. The window itself is unchanged; the candles just use the height that
 * was already inside it.
 */
const WIN_GRIDS = WIN_PANES.map((p) => gridOf(TWO.closes, TWO_DOMAIN, p.price, 0.02, 0));
/**
 * ═══ THE "MENGENAL VOLUME" CARD ═══
 *
 * A volume histogram standing alone inside the second roadmap card — the
 * indicator with no price chart above it, which is exactly what that chapter is
 * about. Canvas coordinates, because the bars draw into a full-frame Layer.
 *
 * ⚠ NO CANDLES ABOVE IT, AND THAT IS THE POINT. Every other chart in this
 * episode shows volume UNDER a price pane; here the histogram is the subject,
 * so it gets the whole card.
 */
const CARD2_SLOT = ROADMAP_SLOTS[1];
const CARD2_BOX = {
  x: CARD2_SLOT.x + 44,
  y: CARD2_SLOT.y + 66,
  w: ROADMAP_CARD.w - 88,
  h: ROADMAP_CARD.h - 122,
};
/** Only the x mapping is read by VolumeBars, so the domain here is nominal. */
const CARD2_GRID = gridOf(TWO.closes, TWO_DOMAIN, CARD2_BOX, 0.02, 0);

/**
 * ═══ THE OTHER TWO CARDS ═══
 *
 * Price above, volume beneath, sharing one x axis — the ordinary reading layout
 * this episode spends its middle teaching. The two differ by ONE thing: the
 * last card carries the resistance band, because using volume means using it
 * against a level. Same tape in both, so the difference is the only thing that
 * can be read as a difference.
 */
const cardPanes = (slot: { x: number; y: number }) => {
  const pad = 26;
  const box = {
    x: slot.x + pad,
    y: slot.y + pad,
    w: ROADMAP_CARD.w - pad * 2,
    h: ROADMAP_CARD.h - pad * 2,
  };
  return {
    price: { ...box, h: box.h * 0.64 },
    vol: { ...box, y: box.y + box.h * 0.72, h: box.h * 0.28 },
  };
};
const CARD_PANES = [cardPanes(ROADMAP_SLOTS[2]), cardPanes(ROADMAP_SLOTS[3])];
/**
 * Card 0 holds WHAT SC01 ACTUALLY ENDS ON — the mark, the word under it, and
 * the two windows below — not a generic thumbnail. At f1543 that card IS the
 * live scene, so the version drawn at every later Scene Transisi has to be the
 * same picture or the board changes meaning between showings.
 */
const CARD0_HEAD = { mark: 30, word: 15, top: 12 };
const CARD0_PANES = [0, 1].map((i) => {
  const slot = ROADMAP_SLOTS[0];
  const pad = 18;
  const top = CARD0_HEAD.top + CARD0_HEAD.mark + CARD0_HEAD.word + 14;
  const half = (ROADMAP_CARD.w - pad * 3) / 2;
  const box = {
    x: slot.x + pad + i * (half + pad),
    y: slot.y + top,
    w: half,
    h: ROADMAP_CARD.h - top - pad,
  };
  const inset = 8;
  const pane = {
    x: box.x + inset,
    y: box.y + inset,
    w: box.w - inset * 2,
    h: box.h - inset * 2,
  };
  return {
    box,
    price: { ...pane, h: pane.h * 0.62 },
    vol: { ...pane, y: pane.y + pane.h * 0.70, h: pane.h * 0.28 },
  };
});
const CARD0_GRIDS = CARD0_PANES.map((q) => gridOf(TWO.closes, TWO_DOMAIN, q.price, 0.04, 0));
/** ⚠ ONE SHARED DOMAIN AND ONE SHARED PEAK across both thumbnails, for the
 *  reason the two SC01 windows share theirs: side by side, self-normalising
 *  charts invent differences that are not in the data. */
const CARD_GRIDS = CARD_PANES.map((q) => gridOf(TWO.closes, TWO_DOMAIN, q.price, 0.04, 0));

/** ⚠ EDIT HERE — font size of the "Volume" line under the mascot, in px. */
const VOL_SIZE = theme.text.title.size + 10;





/**
 * ═══ THE FIGURE — Simon's PhoneMan.png ═══
 *
 * Centred horizontally, and STANDING ON THE SUBTITLE BAND: its foot sits on
 * `captionBand.top`, so the type runs across the bottom of the frame in front
 * of it. Overlap is fine here by instruction, and the figure is the only thing
 * on screen for the whole of SC01 — the chart does not arrive until f900.
 *
 * ⚠ THE HEIGHT IS DERIVED, NOT CHOSEN. It fills from just under the logo zone
 * down to the subtitle band, so it is as large as the frame allows without
 * entering either reserved area. Move a margin and the figure follows.
 *
 * ⚠ ITS WIDTH IS THE FILE'S OWN ASPECT. 1179 x 1334 — read off the asset, not
 * guessed, so the artwork is never squashed.
 *
 * ⚠ THE FIGURE IS CENTRED, NOT THE FILE. PhoneMan.png carries uneven
 * transparent margins — 115px of nothing on the left and 20px on the right —
 * so centring the image box leaves the man himself 29px right of centre, which
 * is visible on a still. `NUDGE` re-centres the DRAWN content by the same
 * measurement. Replace the asset and these three numbers have to be re-read
 * from it.
 */
const ART = { w: 1179, h: 1334, padLeft: 115, padRight: 20 };
const MAN_H = theme.captionBand.top - (theme.logoZone.height + 2);
const MAN_W = (ART.w / ART.h) * MAN_H;
/**
 * ⚠ MIRRORED, at Simon's direction — and the re-centring has to flip WITH it.
 * Mirroring swaps the file's uneven margins: the 115px of nothing that was on
 * the left ends up on the right, so the correction that pulled the figure left
 * now has to push it right. One sign, derived, rather than a second number to
 * keep in step by hand.
 */
const FLIP = true;
/** How far the opaque content's centre sits from the file's, in canvas px. */
const NUDGE = ((ART.padLeft - ART.padRight) / 2) * (MAN_W / ART.w) * (FLIP ? -1 : 1);
const MAN = {
  left: theme.canvas.width / 2 - MAN_W / 2 - NUDGE,
  top: theme.captionBand.top - MAN_H,
};
// ═══════════════════════════════════════════════════════════════════════════

/* ONE grid for every drawing of this tape, so the single chart and the two
   halves of the split cannot disagree about where a price is. */
const G = gridOf(MAIN.closes, MAIN_DOMAIN, PRICE, 0.12, 96);
const [L, R] = halves();
const HALF = {
  left: panes(L),
  right: panes(R),
};
const GL = gridOf(MAIN.closes, MAIN_DOMAIN, HALF.left.price, 0.12, 0);
const GR = gridOf(MAIN.closes, MAIN_DOMAIN, HALF.right.price, 0.12, 0);
/** The average of the tape's own volume — what "biasanya" means here. */
const CARD = theme.stage.card;
const AVG_VOL = mean(VOL_HIGH);
/** Where Chart1.png sits inside the opened screen — the inner card, inset so
 *  the image is not flush with the card's own border. */
const CHART1_BOX = { x: CARD.x + 40, y: CARD.y + 40, w: CARD.w - 80, h: CARD.h - 80 };
const G1 = gridOf(CHART1_ALL.map((b) => b.c), CHART1_DOMAIN2, CHART1_BOX, 0.1, 0);
/** Where the zoom pins the last EXISTING candle, and how big it scales. */
const LAST = CHART1.closes.length - 1;
const ZOOM_ORIGIN = { x: G1.x(LAST), y: G1.y(CHART1.closes[LAST]) };
/**
 * ⚠ THE RESISTANCE BOX IN PIXELS, converted through the grid rather than guessed
 * as a price. `hi`/`lo` are prices; these move them by canvas pixels at the
 * unzoomed scale the box is drawn at before the zoom.
 *   · floor dropped 20px  → the band is 20px taller than the traced level
 *   · whole band shifted DOWN 30px → both edges move together
 */
const PX_PER_PRICE = (G1.y(CHART1_RES.hi) - G1.y(CHART1_RES.lo)) / (CHART1_RES.hi - CHART1_RES.lo);
const px = (n: number) => n / PX_PER_PRICE;
const RES_HI = CHART1_RES.hi + px(30);
const RES_LO = CHART1_RES.lo + px(20) + px(30);
/** The card, as a clip region in canvas coords — top/right/bottom/left insets
 *  from the canvas edge, plus the card's own corner radius. */
const CARD_CLIP =
  `inset(${CARD.y}px ${theme.canvas.width - (CARD.x + CARD.w)}px ` +
  `${theme.canvas.height - (CARD.y + CARD.h)}px ${CARD.x}px round ${theme.shape.cardRadius}px)`;
const VOL_TOP = Math.max(...VOL_HIGH);
/** y for a volume value, agreeing with VolumeBars' own scaling. */
const volY = (box: { y: number; h: number }, v: number, peak: number) =>
  box.y + box.h - (v / peak) * box.h;

/**
 * ═══ WHAT STANDS INSIDE THE FOUR ROADMAP CARDS ═══
 *
 * Exported because the board is shown TWICE — once when the contents page opens
 * at f1400, and again at every Scene Transisi. The cards have to hold the same
 * pictures both times, and the only way that survives an edit to either scene
 * is for there to be one copy of them.
 *
 * ⚠ `at` IS ONE FRAME PER CARD, IN THE CALLER'S OWN CLOCK. MainChartGroup is
 * mounted at f0 so its globals work directly; CG-B is mounted at f1516 and has
 * to convert first. Passing the frames in is what stops that being guessable.
 *
 * ⚠ THE LANDING CARD DRAWS NOTHING. Whatever scene is shrinking into it IS its
 * picture; a thumbnail underneath would sit behind the arriving frame.
 */
export const roadmapContents = (
  f: number,
  m: ReturnType<typeof useMotion>,
  at: number[],
  landing: number,
): React.ReactNode[] =>
  [
    /* what SC01 ends on: the mark, the word, and the pair — see CARD0_PANES */
    <React.Fragment key="c0">
      <TuntunMark
        x={ROADMAP_SLOTS[0].x + ROADMAP_CARD.w / 2}
        y={ROADMAP_SLOTS[0].y + CARD0_HEAD.top}
        height={CARD0_HEAD.mark}
        opacity={progress(f, at[0], m.reveal)}
      />
      <div
        style={{
          position: "absolute",
          left: ROADMAP_SLOTS[0].x,
          top: ROADMAP_SLOTS[0].y + CARD0_HEAD.top + CARD0_HEAD.mark + 2,
          width: ROADMAP_CARD.w,
          textAlign: "center",
          fontFamily: theme.text.family,
          fontSize: CARD0_HEAD.word,
          fontWeight: theme.text.title.weight,
          color: theme.color.indigo,
          opacity: progress(f, at[0], m.reveal),
        }}
      >
        Volume
      </div>
      {CARD0_PANES.map((q, i) => (
        <React.Fragment key={i}>
          {/* ⚠ EACH MINI WINDOW KEEPS ITS OWN PANEL. In SC01 the two readings
              sit on separate cards, and that is what makes them read as two
              windows rather than one chart split down the middle. */}
          <Card rect={q.box} opacity={progress(f, at[0], m.fade)} />
          <Chart
            series={TWO}
            grid={CARD0_GRIDS[i]}
            at={at[0]}
            over={m.sec(0.9)}
            tickLabels={false}
            baseline={false}
          />
          <VolumeBars
            bars={TWO.bars}
            volume={i === 0 ? TWO_VOL_STRONG : TWO_VOL_WEAK}
            grid={CARD0_GRIDS[i]}
            box={q.vol}
            peak={TWO_VOL_PEAK}
            shown={progress(f, at[0], m.sec(0.9))}
          />
          {/* the same band both windows carry in SC01 */}
          <Zone
            hi={TWO_RES.hi}
            lo={TWO_RES.lo}
            grid={CARD0_GRIDS[i]}
            at={at[0] + m.sec(0.3)}
            over={m.sec(0.7)}
            border
            borderWidth={theme.shape.hairline}
          />
        </React.Fragment>
      ))}
    </React.Fragment>,
    /* ⚠ A HISTOGRAM WITH NO PRICE PANE ABOVE IT, and that IS the chapter:
       volume on its own, before it is read against anything. */
    <VolumeBars
      key="c1"
      bars={TWO.bars}
      volume={TWO_VOL_STRONG}
      grid={CARD2_GRID}
      box={CARD2_BOX}
      /* ⚠ NO SHARED `peak` HERE, DELIBERATELY. This one stands alone in its
         card with nothing beside it to be misread against, so it normalises to
         its own maximum and fills the height it has. */
      shown={progress(f, at[1], m.sec(0.9))}
    />,
    ...CARD_PANES.map((q, i) => (
      <React.Fragment key={`c${i + 2}`}>
        <Chart
          series={TWO}
          grid={CARD_GRIDS[i]}
          at={at[i + 2]}
          over={m.sec(0.9)}
          tickLabels={false}
          baseline={false}
        />
        <VolumeBars
          bars={TWO.bars}
          volume={TWO_VOL_STRONG}
          grid={CARD_GRIDS[i]}
          box={q.vol}
          peak={TWO_VOL_PEAK}
          shown={progress(f, at[i + 2], m.sec(0.9))}
        />
        {/* only on "cara pakai volume" — see cardPanes */}
        {i === 1 ? (
          <Zone
            hi={TWO_RES.hi}
            lo={TWO_RES.lo}
            grid={CARD_GRIDS[i]}
            at={at[i + 2] + m.sec(0.3)}
            over={m.sec(0.7)}
            border
            borderWidth={theme.shape.rule}
          />
        ) : null}
      </React.Fragment>
    )),
  ].map((node, i) => (i === landing ? null : node));

export const MainChartGroup = () => {
  const f = useCurrentFrame();
  const m = useMotion();

  /* ⚠ THE FRAME BELONGS TO SOMEONE ELSE FOR EIGHT SCENES. The group stays
     mounted so the tape is never rebuilt; it simply draws nothing. */
  if (f >= T.away && f < T.back) return null;
  /* ── SC01 — the figure, then the screen opening out of a point ────────
     ⚠ f + FROM is a no-op here (FROM is 0) and is written anyway, because the
     cut reads GLOBAL frames and the day this group moves, a bare `f` would be
     silently wrong. */
  /* ⚠ SC01 + the mascot card share this block, [0, 1460). SC01 is drawn only
     up to the cut and cut OUT of; the mascot is cut IN at f892 and HOLDS through
     what used to be SC02 — Simon removed the split screen there. The old
     [900,1460) single/split code below is now unreachable and stays only as the
     SC11–13 path for f >= 8154. */
  if (f < MAP_HOLD - FROM) {
    const g = f + FROM;
    const shrink = interpolate(
      progressInOut(f, SHRINK.at, SHRINK.over),
      [0, 1],
      [1, SHRINK.to],
    );
    const wide = progressInOut(f, OPEN.wide, OPEN.wideOver);
    const tall = progressInOut(f, OPEN.tall, OPEN.tallOver);
    const born = progress(f, OPEN.dot, OPEN.dotOver);
    const w = interpolate(wide, [0, 1], [OPEN.size, CARD.w]);
    const h = interpolate(tall, [0, 1], [OPEN.size, CARD.h]);
    /* centred on the card's own centre — see the header */
    const rect = {
      x: CARD.x + CARD.w / 2 - w / 2,
      y: CARD.y + CARD.h / 2 - h / 2,
      w,
      h,
    };

    return (
      /* ⚠ TRANSPARENT, AND THE GROUND IS DRAWN HERE INSTEAD — because it has to
         FADE. CG-A is mounted last, so it sits ON TOP of SC03 from f1516; an
         opaque stage would mean the board dissolves into its own background and
         SC03 snaps in whole at MAP_HOLD. Fading the ground with the board is
         what turns that into a cross-fade: the scene underneath is already
         standing, and the board simply stops covering it.

         Only this branch needs it. The SC11–13 return below keeps the ordinary
         opaque stage, and the composition paints the same colour behind
         everything anyway, so nothing else changes tone. */
      <Stage transparent>
        <AbsoluteFill
          style={{
            backgroundColor: theme.color.bg,
            opacity: 1 - progress(f, local(FADE.at, FROM), FADE.over),
          }}
        />
        {/* ── SC01, carried OUT on the cut at 892 ───────────────────────────
             ⚠ THE SWAP IS ON THE CUT FRAME, NOT A WINDOW AROUND IT. This used
             to render both halves for the whole 30-frame move, so the two
             pictures sat on top of each other and the "cut" read as a blurry
             cross-fade. A camera cut is ONE move with the content exchanged at
             its midpoint: the outgoing half is drawn strictly BEFORE `at`, the
             incoming half strictly FROM `at`. Never both. */}
        {f < CUTS.toMascot.at && (
        <div style={{ position: "absolute", inset: 0, ...cutOutStyle(g, CUTS.toMascot) }}>
        <div style={{ position: "absolute", inset: 0, ...cutInStyle(g, CUTS.intoSC01) }}>
          {born > 0.001 && (
            <Card
              rect={rect}
              /* a 24px radius on an 18px point would be clipped to a lozenge
                 anyway — clamping keeps the dot an honest circle and lets the
                 corner grow into the card's own radius as the screen opens */
              radius={Math.min(theme.shape.cardRadius, w / 2, h / 2)}
              opacity={born}
            />
          )}
          {f >= OPEN.chart && (() => {
            /* ⚠ THE ZOOM AND PAN, AS ONE TRANSFORM. Origin pinned to the last
               existing candle, so the super-zoom keeps it fixed while it grows;
               the translate then carries it to frame-centre + panX. At z=0 this
               is the identity, so nothing moves until the beat. */
            const z = progressInOut(f, ZOOM.at, ZOOM.over);
            const scale = 1 + (ZOOM.scale - 1) * z;
            const tx = (CARD.x + CARD.w / 2 + ZOOM.panX - ZOOM_ORIGIN.x) * z;
            const ty = (CARD.y + CARD.h * 0.58 - ZOOM_ORIGIN.y) * z;
            return (
              <>
                {/* ⚠ CLIPPED TO THE CARD. The super-zoom scales the candles past
                    the white card's edges; this parent — untransformed, in
                    canvas coords — clips everything inside it back to the card's
                    own rectangle (radius included), so nothing ever spills onto
                    the grey ground or the man. The clip is on the PARENT so it
                    is applied before the child's transform, in card space. */}
                <div style={{ position: "absolute", inset: 0, clipPath: CARD_CLIP }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${scale.toFixed(4)})`,
                      transformOrigin: `${ZOOM_ORIGIN.x.toFixed(1)}px ${ZOOM_ORIGIN.y.toFixed(1)}px`,
                    }}
                  >
                    <Chart series={CHART1} grid={G1} at={OPEN.chart} over={m.sec(2.6)} tickLabels={false} baseline={false} />
                    {/* ⚠ RESISTANCE BOX — indigo, edge to edge, CREEPING
                        left→right from f182 to f280, while the candles are still
                        drawing and before the zoom. See RES in the frame table. */}
                    <Zone
                      hi={RES_HI}
                      lo={RES_LO}
                      grid={G1}
                      at={RES.at}
                      over={RES.over}
                      border
                      borderWidth={theme.shape.rule}
                      label="Resistance"
                    />
                    {/* ⚠ THE BREAKOUT CANDLE CREEPS UP — "menjalar", not a fade.
                        A clip reveals it from its own foot upward, so the green
                        body grows through the resistance to its high rather than
                        appearing whole. The clip is in canvas coords and scales
                        with the zoom, like the candle it hides. */}
                    {f >= BREAK1.at &&
                      (() => {
                        const foot = G1.y(CHART1_BREAK.l);
                        const head = G1.y(CHART1_BREAK.h);
                        const line = foot - progress(f, BREAK1.at, BREAK1.over) * (foot - head);
                        return (
                          <div style={{ position: "absolute", inset: 0, clipPath: `inset(${line.toFixed(1)}px 0 0 0)` }}>
                            <Candles bars={CHART1_ALL} grid={G1} from={LAST + 1} />
                          </div>
                        );
                      })()}
                  </div>
                </div>
                {/* ⚠ "Beli?" — a QUESTION, not a call to action: no fill, no
                    button, a question mark. Indigo, in the WHITE SPACE to the
                    right of the breakout candle after the zoom. It asks what the
                    green candle tempts the viewer to do, right before SC02
                    answers "belum tentu". */}
                {f >= ASK1 && (
                  <div
                    style={{
                      position: "absolute",
                      /* the white space to the right of the breakout candle */
                      left: CARD.x + CARD.w * 0.63,
                      width: CARD.w * 0.34,
                      top: CARD.y + CARD.h * 0.28,
                      transform: `translateY(${(1 - progress(f, ASK1, m.reveal)) * theme.text.body.size * 0.4}px)`,
                      textAlign: "center",
                      fontFamily: theme.text.family,
                      fontSize: ASK_SIZE,
                      fontWeight: 600,
                      lineHeight: 1.05,
                      color: theme.color.ink,
                      opacity: progress(f, ASK1, m.reveal),
                    }}
                  >
                    Apakah
                    <br />
                    langsung beli?
                  </div>
                )}
                {/* ⚠ "Belum tentu" — the answer, indigo, stamping in under the
                    question at f825, just before SC02 says the same. */}
                {f >= ANS1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: CARD.x + CARD.w * 0.63,
                      width: CARD.w * 0.34,
                      top: CARD.y + CARD.h * 0.62,
                      transform: `translateY(${(1 - progress(f, ANS1, m.reveal)) * theme.text.body.size * 0.4}px)`,
                      textAlign: "center",
                      fontFamily: theme.text.family,
                      fontSize: ANS_SIZE,
                      fontWeight: 700,
                      color: theme.color.indigo,
                      opacity: progress(f, ANS1, m.reveal),
                      whiteSpace: "nowrap",
                    }}
                  >
                    Belum tentu
                  </div>
                )}
              </>
            );
          })()}

          {/* ⚠ THE MAN IS DRAWN LAST, so the screen opens BEHIND him — Simon's
              call, and it is what makes the point-to-screen move read as
              something happening in the space he is standing in rather than a
              card sliding over the top of him. */}
          <Img
            src={staticFile("art/phone-man.png")}
            style={{
              position: "absolute",
              left: MAN.left,
              top: MAN.top,
              width: MAN_W,
              height: MAN_H,
              /* ⚠ the mirror is INSIDE the scale, so the origin still refers
                 to the drawn figure */
              transform: `scale(${shrink.toFixed(4)}) ${FLIP ? "scaleX(-1)" : ""}`,
              transformOrigin: "center bottom",
              /* ⚠ drop-shadow, NOT box-shadow: it follows the PNG's alpha, so
                 the shadow is the figure's own silhouette rather than a
                 rectangle around the image's bounds. */
              filter: theme.shape.artShadow,
            }}
          />
        </div>
        </div>
        )}

        {/* ── "Satu hal yang perlu dicek" — the mascot card, cut IN at 892 and
             holding through what used to be SC02. Nothing else renders here:
             the split screen is gone at Simon's direction. ─────────────────── */}
        {f >= CUTS.toMascot.at && (() => {
          const float =
            Math.sin(((f - CUTS.toMascot.at) / FLOAT.period) * Math.PI * 2) * FLOAT.amount;
          /* ⚠ THE CARD MAKES ROOM FOR THE WINDOWS. One eased 0→1 drives all
             three: the mascot halves, the pair rises, and the gap between the
             mark and the word closes. Deriving them from one number is what
             keeps them moving together — three separate curves would drift. */
          const tidy = progressInOut(f, TIDY.at, TIDY.over);
          const markH = CARD.h * 0.289 * (1 - tidy * (1 - TIDY.to));
          /**
           * ⚠ THE MARK AND THE WORD TRAVEL AS ONE GROUP, TO THE TOP MARGIN.
           * Both are placed from a single `groupTop`, so the space between them
           * is a constant instead of two curves that have to be kept in step —
           * closing that gap was half of what was asked for, and deriving the
           * word's position from the mark's is what guarantees it. Landing on
           * `theme.margin.top` also means the group follows if a margin moves.
           */
          const groupTop = interpolate(
            tidy,
            [0, 1],
            [CARD.y + CARD.h * 0.24, theme.margin.top],
          );
          const markY = groupTop + float;
          /**
           * ⚠ 30px LOWER UNTIL THE TIDY, and exactly its final place after.
           * Simon set the resting position from the tidied card (f1199 on), so
           * the drop has to fade out on the same curve rather than being a
           * second constant — otherwise the two would have to be kept in step
           * by hand every time the layout moves.
           */
          const lineY = groupTop + markH + theme.text.title.size * 0.2 + (1 - tidy) * 30;
          /**
           * ⚠ 12px BIGGER BEFORE THE TIDY, and its settled size after. Like the
           * 30px drop above, the extra rides `tidy` rather than being a second
           * constant keyed to its own frames — the word shrinks into place as
           * the card packs itself away, and the two can never fall out of step.
           */
          const lineSize = (n: number) => n + (1 - tidy) * 12;
          /* ⚠ THE INTRO SHRINKS INTO THE TOP CARD. `shrinkClip` is on the
             OUTER element, which is never transformed — a clip-path on the
             scaling wrapper would scale with it and never match the card. */
          const map = progressInOut(f, MAP.at, MAP.over);
          /** The card is 536x302 in a 1920x1080 frame — one ratio, both axes. */
          const mapScale = 1 - map * (1 - ROADMAP_CARD.w / theme.canvas.width);
          /**
           * How far the frame's centre has to travel to reach the card's.
           *
           * ⚠ PLUS A CORRECTION FOR THE FRAME'S OWN EMPTY EDGES. What shrinks
           * is the whole 1920x1080 canvas, but the PICTURE inside it runs only
           * from the top margin to the bottom of the windows — the subtitle
           * band below it is empty by design. Centring the canvas therefore
           * leaves the picture riding high in the card with white under it.
           * This drops it by the difference between the two centres, scaled.
           */
          const seen = { top: theme.margin.top, bottom: WIN.y + WIN.h };
          const seenOffset = theme.canvas.height / 2 - (seen.top + seen.bottom) / 2;
          const mapCentre = {
            x: ROADMAP_SLOTS[0].x + ROADMAP_CARD.w / 2 - theme.canvas.width / 2,
            y:
              ROADMAP_SLOTS[0].y +
              ROADMAP_CARD.h / 2 -
              theme.canvas.height / 2 +
              seenOffset * mapScale,
          };
          /* ⚠ ONE WRAPPER FOR THE WHOLE BOARD — grid, cards and the shrunken
             scene together. Pushing the cards without the ground they stand on
             would slide them across a stationary texture, which reads as the
             cards moving rather than as the camera closing in. */
          const push = progress(f, PUSH.at, PUSH.over);
          return (
          <>
          {/* ⚠ THE GROUND STAYS PUT — Simon's call. It is OUTSIDE the push
              wrapper below, so when the camera closes on "mengenal volume" the
              cards travel and the grid they stand on does not. A background
              that zooms with the subject reads as the whole picture being
              scaled up; a background that holds still is what makes the move
              read as a camera. */}
          <GridGround f={f} opacity={map} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 1 - progress(f, FADE.at, FADE.over),
              ...cardPush(push, PUSH.card, PUSH.amount),
            }}
          >
          {/* ⚠ THE CARDS ARE DRAWN FIRST, so the shrinking picture lands ON the
              top card rather than under its white fill. The other three open
              beside it, empty. */}
          <RoadmapCards
            labels={MAP_LABELS}
            reveal={map}
            landing={0}
            cardsAt={[...MAP.cards]}
            cardDur={MAP.cardDur}
            glow={{ card: 1, at: CARD2.at, over: CARD2.over }}
            /* ⚠ FOUR FRAMES, ONE PER CARD. MAP.cards holds only the three that are
               NOT the landing, so card 0's slot is filled with a number that is
               never read — passing the short array left at[3] undefined and
               interpolate threw on it. */
            contents={roadmapContents(f, m, [0, ...MAP.cards], 0)}
          />
          {/* ⚠ CLIP OUTSIDE, SCALE INSIDE. The clip must sit on an element that
              is never transformed — on the scaling wrapper it would scale with
              it and never match the card it is clipping into. */}
          <div style={{ position: "absolute", inset: 0, clipPath: shrinkClip(map, 0) }}>
          {/* ⚠ SCALE ABOUT THE CANVAS CENTRE, THEN CARRY IT TO THE CARD.
              Scaling about the CARD's centre keeps that point fixed and leaves
              the picture's own middle wherever it lands — which is why the
              scene sat low in the card. Shrinking about the frame's centre and
              then translating that centre onto the card's is what actually
              centres the content inside it. CSS applies these right to left, so
              the scale happens first. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform:
                `translate(${(mapCentre.x * map).toFixed(1)}px, ${(mapCentre.y * map).toFixed(1)}px) ` +
                `scale(${mapScale.toFixed(4)})`,
              transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
            }}
          >
          <div style={{ position: "absolute", inset: 0, ...cutInStyle(g, CUTS.toMascot) }}>
            {/* ⚠ THE TRANSITION GRID, drifting — the same ground the Moving
                Average transitions use, ported into core so the two episodes
                cannot drift apart. It arrives with the cut and leaves before
                the windows do: a texture under two charts is noise. */}
            <GridGround
              f={f}
              opacity={Math.min(
                progress(f, GROUND.at, GROUND.over),
                fadeOut(f, GROUND.gone - GROUND.over, GROUND.over),
              )}
            />
            <TuntunMark x={theme.canvas.width / 2} y={markY} height={markH} />
            {/* ⚠ SIMON'S LightBulb.svg, USED VERBATIM — a supplied asset is
                never redrawn. Its artboard is 2200x1466 with the bulb in the
                middle of a mostly-empty field, so the copy in public/art carries
                a tightened viewBox (measured off a raster) and nothing else
                changed: no recolour, no repath.

                ⚠ IT DOES NOT FOLLOW THE MASCOT. Simon's call: it holds still
                while the mascot breathes under it, so the two read as a lamp
                over a character rather than one floating object.

                The glow is a warm halo BEHIND it, from a theme slot — the only
                place in the library that reaches for a warm colour. */}
            {f < BULB.gone && (() => {
              const lit = Math.min(
                progress(f, BULB.at, BULB.over),
                fadeOut(f, BULB.gone - BULB.over, BULB.over),
              );
              const size = CARD.h * 0.22;
              const top = CARD.y + CARD.h * 0.24 - CARD.h * 0.30;
              return (
                <>
                  {/* ⚠ THE HALO IS SIZED FROM THE BULB, not from the card, so
                      the two stay in proportion if the glyph is ever resized.
                      1.43x the bulb's height and lifted 20px. At 2x it read as
                      a light source of its own rather than as the bulb being
                      lit. */}
                  <div
                    style={{
                      position: "absolute",
                      left: theme.canvas.width / 2 - size * 0.715,
                      top: top - size * 0.05 - 20,
                      width: size * 1.43,
                      height: size * 1.43,
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${theme.color.bulbGlow} 0%, transparent 62%)`,
                      opacity: lit,
                    }}
                  />
                  <Img
                    src={staticFile("art/light-bulb.svg")}
                    style={{
                      position: "absolute",
                      left: theme.canvas.width / 2 - (size * 890) / 997 / 2,
                      top,
                      width: (size * 890) / 997,
                      height: size,
                      opacity: lit,
                    }}
                  />
                </>
              );
            })()}

            {/* ⚠ THE LINE ARRIVES LATE (968) AND THEN IS CUT, ALONE, AT 1106.
                Two halves of one move: "Satu hal yang perlu dicek" is carried
                out, "Volume" carried in, swapped on the cut frame. Everything
                else on this card holds still through it — see CUTS.textToVolume
                for why it carries no blur. */}
            {f >= LINE1 && f < CUTS.textToVolume.at && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: lineY,
                  textAlign: "center",
                  fontFamily: theme.text.family,
                  fontSize: lineSize(theme.text.title.size),
                  fontWeight: theme.text.title.weight,
                  color: theme.color.ink,
                  opacity: progress(f, LINE1, m.reveal),
                  ...cutOutStyle(g, CUTS.textToVolume),
                }}
              >
                Satu hal yang perlu dicek
              </div>
            )}
            {f >= CUTS.textToVolume.at && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: lineY,
                  textAlign: "center",
                  fontFamily: theme.text.family,
                  fontSize: lineSize(VOL_SIZE),
                  fontWeight: theme.text.title.weight,
                  color: theme.color.indigo,
                  ...cutInStyle(g, CUTS.textToVolume),
                }}
              >
                Volume
              </div>
            )}

            {/* ⚠ TWO WINDOWS, ONE TAPE. Both draw the SAME 22 traced candles —
                "dua breakout yang kelihatannya sama" — and differ only in the
                histogram: the right one is the whole tape at 55% with its last
                five bars cut further still. They share a price domain AND a
                volume peak, because two charts left to normalise themselves is
                how a comparison quietly rigs itself. */}
            {f >= WINDOWS.at &&
              ([TWO_VOL_STRONG, TWO_VOL_WEAK] as const).map((vol, i) => {
                const r = winRect(i);
                const pane = WIN_PANES[i];
                const grid = WIN_GRIDS[i];
                const inAt = WINDOWS.at + i * m.sec(0.12);
                return (
                  <div key={i} style={{ opacity: progress(f, inAt, m.sec(0.5)) }}>
                    <Card rect={r} />
                    <Chart
                      series={TWO}
                      grid={grid}
                      at={inAt + m.sec(0.25)}
                      over={m.sec(1.1)}
                      tickLabels={false}
                      baseline={false}
                    />
                    <VolumeBars
                      bars={TWO.bars}
                      volume={vol as unknown as number[]}
                      grid={grid}
                      box={pane.vol}
                      peak={TWO_VOL_PEAK}
                      shown={progress(f, inAt + m.sec(0.25), m.sec(1.1))}
                    />
                    {/* ⚠ THE SAME BAND, AND THE SAME LABEL, IN BOTH WINDOWS.
                        The scene's claim is that the PRICE ACTION is identical,
                        so a level drawn on one and not the other — or named on
                        one and not the other — would undo it. Only the
                        histogram is allowed to differ. */}
                    <Zone
                      hi={TWO_RES.hi}
                      lo={TWO_RES.lo}
                      grid={grid}
                      at={inAt + m.sec(1.2)}
                      over={m.sec(0.9)}
                      border
                      borderWidth={theme.shape.rule}
                      label="Resistance"
                    />
                  </div>
                );
              })}
          </div>
          </div>
          </div>
          </div>
          </>
          );
        })()}
      </Stage>
    );
  }

  const opening = f < T.back;
  const toVolume = progress(f, T.notYet, m.sec(0.9));
  const toSplit = opening ? progress(f, T.split, m.sec(0.8)) : 0;
  const single = 1 - toSplit;
  /**
   * ═══ ⚠ SC11 IS SC01'S PICTURE, NOT THE LONG TAPE ═══  (Simon: "samain persis")
   *
   * SC01 does not show the 120-bar tape at all by the time it ends — it is
   * zoomed 3x onto CHART1, the short breakout, inside the card. "Kita kembali
   * ke breakout tadi" means coming back to THAT, and returning to the full tape
   * was coming back to a picture the scene never showed.
   *
   * ⚠ IT RUNS TO THE END OF THE STRETCH — f10471, where CG-A hands over to
   * SC14 — and not to the end of SC11. Simon: "pake chart ini sampe akhir
   * scene". SC12 and SC13 read the SAME breakout candle twice, so cutting back
   * to the long tape at f8911 would have swapped the picture underneath an
   * argument that is still about the picture.
   */
  const sc11 = !opening && f >= T.build && f < T.sc14;
  /** How much of its own height the card has given up, in pixels. */
  const shrink =
    (sc11 ? progress(f, T.shrink, SC11.shrink.over) * SC11.shrink.by : 0) +
    (sc11 ? progressInOut(f, T.twin, SC11.split.over) * SC11.split.raise : 0);
  /**
   * ⚠ THE CARD NARROWS ON THE SAME CURVE AS IT SHORTENS. One number drives
   * both, so the panel, its mask, the histogram's window and the room that
   * opens on the right cannot disagree about how far along the move is.
   */
  const narrowT = sc11 ? progress(f, T.shrink, SC11.shrink.over) : 0;
  /**
   * ⚠ AND THEN IT HALVES. The column narrows to 65% at f9240 and to half at
   * f10471, where the second copy arrives beside it. One width drives the card,
   * its mask, the histogram's window and the tape's shift, so nothing in the
   * column can be left behind by either move.
   */
  const splitT = sc11 ? progressInOut(f, T.twin, SC11.split.over) : 0;
  const COL_W = (CARD.w - SC11.split.gap) / 2;
  const CARD_NOW = {
    ...CARD,
    h: CARD.h - shrink,
    w: interpolate(splitT, [0, 1], [CARD.w * (1 - (1 - SC11.narrow) * narrowT), COL_W]),
  };
  /** ⚠ THE SECOND COLUMN WAITS FOR THE ROOM, then slides in from the right. */
  const twinIn = sc11 ? progress(f, T.twin + SC11.split.lag, SC11.split.over) : 0;
  /** The width the card reaches at the 65% step, before the split halves it. */
  const NARROW_W = CARD.w * (1 - (1 - SC11.narrow) * narrowT);
  /**
   * ⚠ THE TWO MOVES ARE NOT THE SAME MOVE. The 65% step is a SHIFT — Simon was
   * explicit: the drawing keeps its size and slides left by what the card gave
   * up. The split is a SHRINK: the tape re-fits the narrower column, so the
   * last third lands exactly inside it and the shift goes back to zero.
   *
   * ⚠ WITHOUT THAT, the shift kept growing with the width and dragged an eighth
   * candle in from the left, sliced by the card's edge.
   */
  const shiftX = interpolate(splitT, [0, 1], [-(CARD.w - NARROW_W), 0]);
  /* SC13 swaps the histogram for the ordinary reading, on the same candles */
  const vol = f >= T.sc13 ? VOL_AVG : VOL_HIGH;

  return (
    <Stage>
      {/* ⚠ NOT DRAWN HERE ONCE SC11 OWNS THE FRAME. The white panel belongs to
          a COLUMN, and from f10471 there are two of them; leaving it at the
          stage level gave the second column candles standing on the page with
          no card behind them. */}
      {!sc11 && <Card rect={CARD_NOW} />}
      <SourceTag kind={MAIN.kind} label={MAIN.label} y={TAG_Y} />

      {/* ── SC11: SC01's own picture, drawn again from nothing ──────────── */}
      {sc11 && (() => {
        /* ⚠ SC01'S OWN PUSH-IN, RE-APPLIED AT f8905 — the same maths, origin
           pinned to the last existing candle so the zoom keeps it fixed while
           it grows. Until that frame z is 0 and this is the identity, which is
           what leaves the whole tape readable across the card first. */
        /* ⚠ THE GRID IS REBUILT PER FRAME while the card is shortening, and
           the zoom's origin with it. Keeping the static G1 would have left the
           push-in pinned to where the last candle USED to be, and the picture
           would have crept off its own card as the box came up. */
        /** ⚠ 20px LOWER ONCE THE LABEL IS THERE. The reading's name sits in the
         *  window's top-left corner from the split onwards, and the tape was
         *  running straight into it; the plot gives up the same 20 off its own
         *  height so its bottom edge does not move. */
        const drop = 20 * splitT;
        const box1 = {
          ...CHART1_BOX,
          y: CHART1_BOX.y + drop,
          w: interpolate(splitT, [0, 1], [CHART1_BOX.w, CARD_NOW.w - 80]),
          h: CHART1_BOX.h - shrink - drop,
        };
        /** 0 while the push-in holds, 1 once the view has pulled back. */
        const out = shrink / Math.max(1, SC11.shrink.by);
        const z = progressInOut(f, T.zoom, SC11.zoom.over);
        const N = CHART1_ALL.length;
        const PADX = 18;
        const inner0 = box1.w - PADX * 2;

        /**
         * ═══ ⚠ THE PULL-BACK IS A CHANGE OF GRID, NOT A SMALLER TRANSFORM ═══
         *
         * The push-in is a CSS scale, and a CSS scale magnifies the DRAWING:
         * bodies get fatter, wicks get thicker, and the picture stays "zoomed
         * in" however much of the tape is on screen. Zooming out means drawing
         * MORE BARS AT THEIR OWN SIZE, which is a different grid — a wider
         * index range and the price range that range actually covers.
         *
         * ⚠ BOTH STATES ARE EXPRESSED AS (BOX, DOMAIN) AND INTERPOLATED. A
         * cross-fade between two charts would ghost every candle; a grid whose
         * box and domain travel is one tape moving continuously, and it ends
         * with NO transform on it at all.
         */
        /* state A — the push-in, rewritten as a grid. */
        const gA = gridOf(CHART1_ALL.map((b) => b.c), CHART1_DOMAIN2, box1, 0.1, 0);
        const oA = { x: gA.x(LAST), y: gA.y(CHART1.closes[LAST]) };
        const txA = CARD.x + CARD.w / 2 + ZOOM.panX - oA.x;
        const tyA = CARD.y + CARD_NOW.h * 0.58 - oA.y;
        const XA = (i: number) => (gA.x(i) - oA.x) * ZOOM.scale + oA.x + txA;
        const YA = (v: number) => (gA.y(v) - oA.y) * ZOOM.scale + oA.y + tyA;
        /* the domain that reproduces YA inside box1 — solved, not guessed */
        const yBot = box1.y + box1.h * 0.9;
        const yTop = yBot - box1.h * 0.8;
        const invYA = (yy: number) =>
          (yy - YA(0)) * (100 - 0) / (YA(100) - YA(0));
        const boxA = { ...box1, x: XA(0) - PADX, w: XA(N - 1) - XA(0) + PADX * 2 };
        const domA: [number, number] = [invYA(yBot), invYA(yTop)];

        /* state B — the last third, at its own size and its own price range. */
        const START = Math.floor(N * (2 / 3));
        const tail = CHART1_ALL.slice(START);
        const innerB = (inner0 * (N - 1)) / Math.max(1, N - 1 - START);
        const boxB = {
          ...box1,
          x: box1.x - (innerB * START) / (N - 1),
          w: innerB + PADX * 2,
        };
        const domB = domainOf(tail.map((b) => b.c), tail);

        /**
         * state C — the breakdown tape, whole, on the column's own plot rect.
         *
         * ⚠ THE VIEW OPENS BACK OUT AT THE SPLIT. Up to here the column shows
         * the last THIRD of the breakout; the shape Simon drew is the whole
         * tape, so the x-range travels back to all of it and the domain to the
         * breakdown's own high and low. Without that the new bars were drawn
         * against the old third's scale and came out flat and tiny.
         */
        const boxC = { x: CARD.x + 40, y: box1.y, w: CARD_NOW.w - 80, h: box1.h };
        const domC = domainOf(BREAKDOWN.closes, BREAKDOWN.bars);

        const mix = (a: number, b: number) => a + (b - a) * out;
        const mix2 = (a: number, b: number) => a + (b - a) * splitT;
        const g1 =
          out > 0.001
            ? gridOf(
                CHART1_ALL.map((b) => b.c),
                [
                  mix2(mix(domA[0], domB[0]), domC[0]),
                  mix2(mix(domA[1], domB[1]), domC[1]),
                ],
                {
                  x: mix2(mix(boxA.x, boxB.x), boxC.x),
                  y: box1.y,
                  w: mix2(mix(boxA.w, boxB.w), boxC.w),
                  h: box1.h,
                },
                0.1,
                0,
              )
            : gA;
        /**
         * ⚠ THE TRANSFORM IS DROPPED THE MOMENT THE GRID TAKES OVER, not faded
         * out alongside it. `boxA`/`domA` ARE the push-in, rewritten; leaving
         * the CSS scale on for even part of the pull-back applies the zoom
         * twice — nine times size on the first frame after f9240, which put the
         * whole tape off the card and left an empty white panel.
         *
         * The switch is seamless because the two describe the same picture: at
         * out = 0 the grid reproduces the transform exactly.
         */
        const byGrid = out > 0.001;
        const origin = oA;
        const scale = byGrid ? 1 : 1 + (ZOOM.scale - 1) * z;
        const tx = byGrid ? 0 : txA * z;
        const ty = byGrid ? 0 : tyA * z;
        const xz = (i: number) => (g1.x(i) - origin.x) * scale + origin.x + tx;
        const yz = (v: number) => (g1.y(v) - origin.y) * scale + origin.y + ty;
        /**
         * ⚠ A BAR IS ONLY DRAWN IF ITS CANDLE IS ON SCREEN. While the push-in
         * still holds, the early candles sit far below the card and are clipped
         * away; leaving their bars standing would put a histogram under nothing,
         * which is exactly the misreading this episode exists to correct.
         */
        const candleSeen = (i: number) =>
          yz(CHART1_ALL[i].l) > CARD.y && yz(CHART1_ALL[i].h) < CARD.y + CARD_NOW.h;
        /** The room the shrink opened, and the histogram that stands in it. */
        const volBox = {
          x: CARD.x,
          y: CARD.y + CARD_NOW.h + SC11.shrink.gap,
          w: CARD_NOW.w,
          /**
           * ⚠ IT RUNS PAST THE CARD'S ORIGINAL BOTTOM — Simon's call. The room
           * the first shrink opens is only 150 tall; `drop` takes the window
           * down into the paper below it, which is empty anyway.
           *
           * ⚠ AND IT IS TIED TO THE FIRST SHRINK ONLY. The split raises the
           * pair by another 150, and reading `shrink` raw made the histogram's
           * window GROW by that much instead — the group got taller when it was
           * supposed to get shorter, and the bottom ran off the frame.
           */
          h:
            (SC11.shrink.by - SC11.shrink.gap + SC11.shrink.drop) *
            Math.min(1, shrink / Math.max(1, SC11.shrink.by)),
        };
        /**
         * ⚠ THE SECOND READING IS THE SAME BARS WITH THE BURST TAKEN OUT, and
         * it TWEENS — the point is that only the volume changed, so anything
         * that jumped would be claiming more than that.
         *
         * ⚠ THE PEAK IS THE STRONG READING'S, HELD. Letting the histogram
         * renormalise would make the quieter tape draw itself just as tall and
         * say the opposite of what the scene says about it.
         */
        const weak = progress(f, T.weak, SC11.weak.over);
        const volAt = (i: number) => CHART1_VOL[i] + (CHART1_VOL_WEAK[i] - CHART1_VOL[i]) * weak;
        const volPeak = Math.max(...CHART1_VOL);
        /** ⚠ THE SAME FRACTION `candleWidth` USES, so a bar is exactly as wide
         *  as the candle standing over it. */
        const barW = Math.max(3, Math.abs(xz(1) - xz(0)) * 0.68);
        return (
        <>
        {/* ⚠ THE COLUMN IS DRAWN TWICE, THE SECOND ONE TRANSLATED. Everything
            inside is laid out at the left column's coordinates and its clip
            travels with it, so the copy cannot drift out of register with the
            original — which is the whole reason the two are comparable. */}
        {[0, CARD_NOW.w + SC11.split.gap].map((dx, twin) => {
          /**
           * ⚠ THE BREAKDOWN IS A DIFFERENT TAPE, NOT THIS ONE REFLECTED. Simon
           * supplied the picture and it was traced candle for candle — 70 bars
           * against the breakout's 126 — so the two cannot morph bar by bar.
           * They cross over inside the split's own move instead: the columns
           * are travelling anyway, and that motion is what carries the change.
           */
          const lerpS = (a: number, b: number) => a + (b - a) * splitT;
          const grid2 = gridOf(
            BREAKDOWN.closes,
            BREAKDOWN_DOMAIN,
            { x: CARD.x + 40, y: box1.y, w: CARD_NOW.w - 80, h: box1.h },
            0.1,
            0,
          );
          /** ⚠ LEFT LOUD, RIGHT QUIET — the whole reason there are two columns.
           *  Both start from whatever the single column was showing, so the
           *  difference opens up with the split rather than arriving with it. */
          const target = twin === 0 ? CHART1_VOL : CHART1_VOL_WEAK;
          /**
           * ⚠ ONLY ONE COLUMN IS LIT AT A TIME. The left is selected when its
           * band arrives and gives the selection up when the right takes it,
           * so the pair is never both pointed at.
           */
          /** 1 once either column has been chosen — see the filter below. */
          const anyPick = progress(f, local(SC11.picks[0].band, FROM), m.fade);
          const picked =
            twin === 0
              ? progress(f, local(SC11.picks[0].band, FROM), m.fade) *
                (1 - progress(f, local(SC11.picks[1].band, FROM), m.fade))
              : progress(f, local(SC11.picks[1].band, FROM), m.fade);
          const grey = anyPick * (1 - picked);
          /** What the drawing fades TO once its column is not the one being
           *  read — light grey, the weight this episode gives "not this one". */
          const dim = 1 - 0.58 * grey;
          /** The 70 bars that travel, and the grid they travel on. */
          const SRC = CHART1.bars.length - BREAKDOWN.bars.length;
          const morphBars = BREAKDOWN.bars.map((d, i) => {
            const a = CHART1.bars[SRC + i] ?? d;
            const P = (sv: number, dv: number) => -lerpS(g1.y(sv), grid2.y(dv));
            return { o: P(a.o, d.o), c: P(a.c, d.c), h: P(a.h, d.h), l: P(a.l, d.l) };
          });
          const morphGrid = {
            lo: 0,
            hi: 1,
            slot: lerpS(Math.abs(g1.x(1) - g1.x(0)), Math.abs(grid2.x(1) - grid2.x(0))),
            box: grid2.box,
            /**
             * ⚠ NO `shiftX` HERE. These candles are drawn INSIDE the wrapper
             * that already carries it, so adding it again moved the whole tape
             * a second time — 605px on the frame the morph began, which is the
             * break at f10472. The far end has to be un-shifted for the same
             * reason: `grid2` is in canvas coordinates and the wrapper will
             * shift it too.
             */
            x: (i: number) => lerpS(g1.x(SRC + i), grid2.x(i) - shiftX),
            y: (v: number) => -v,
          };
          /** After the split the histogram belongs to the breakdown tape, and
           *  stands under ITS bars — 70 of them, on `grid2`. */
          const downVol = twin === 0 ? BREAKDOWN_VOL : BREAKDOWN_VOL_WEAK;
          const downPeak = Math.max(...BREAKDOWN_VOL);
          return (
          <div
            key={twin}
            style={{
              position: "absolute",
              inset: 0,
              opacity: twin === 0 ? 1 : twinIn,
              transform: `translateX(${(dx + (twin === 0 ? 0 : (1 - twinIn) * 90)).toFixed(1)}px)`,
            }}
          >
        {/* ⚠ THE LIFT IS ON AN INNER WRAPPER, about the LEFT column's centre.
            Everything in a copy is laid out at the left column's coordinates
            and the outer wrapper translates it; scaling out there would grow
            the right copy about the wrong point. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${(1 + SC11.pick.grow * picked).toFixed(4)})`,
            transformOrigin: `${(CARD.x + CARD_NOW.w / 2).toFixed(1)}px ${(
              CARD.y +
              (volBox.y + volBox.h - CARD.y) / 2
            ).toFixed(1)}px`,
            /**
             * ⚠ THE UNSELECTED COLUMN GOES GREY, and only once a selection
             * EXISTS. Before the first pick neither is chosen, and draining the
             * colour out of both would say the pair is finished with rather
             * than that one of them is being read.
             *
             * ⚠ AND IT IS FADED, NOT JUST DESATURATED — Simon's call. Pure
             * grayscale keeps every candle at full contrast, so the column is
             * still as loud as the one being read and only differs in hue.
             *
             * ⚠ BUT THE FADE IS ON THE INK, NOT ON THIS WRAPPER. A `contrast()`
             * or `opacity()` here takes the white PANEL with it and turns the
             * whole card grey; only the drawing is supposed to recede, and the
             * panel it stands on has to stay white.
             */
            filter: [
              grey > 0.01 ? `grayscale(${grey.toFixed(2)})` : "",
              picked > 0.01
                ? `drop-shadow(0 0 ${(26 * picked).toFixed(1)}px rgba(95, 77, 238, ${(
                    0.34 * picked
                  ).toFixed(2)}))`
                : "",
            ]
              .filter(Boolean)
              .join(" ") || undefined,
          }}
        >
        {/* the column's own white panel — one per copy */}
        <Card rect={{ x: CARD.x, y: CARD.y, w: CARD_NOW.w, h: CARD_NOW.h }} />
        {/* ⚠ THE READING'S NAME, INSIDE ITS OWN WINDOW. It belongs to the
            column, so it is drawn in the copy rather than beside it. */}
        {splitT > 0.01 && (
          <div
            style={{
              position: "absolute",
              left: CARD.x + 32,
              top: CARD.y + 26,
              fontFamily: theme.text.family,
              fontSize: SC11.split.labelSize,
              fontWeight: 700,
              color: theme.color.ink,
              opacity: splitT * dim,
            }}
          >
            {SC11.split.labels[twin]}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath:
              `inset(${CARD.y}px ${(theme.canvas.width - (CARD.x + CARD_NOW.w)).toFixed(1)}px ` +
              `${(theme.canvas.height - (CARD.y + CARD_NOW.h)).toFixed(1)}px ${CARD.x}px ` +
              `round ${theme.shape.cardRadius}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translate(${(tx + shiftX).toFixed(1)}px, ${ty.toFixed(1)}px) scale(${scale.toFixed(4)})`,
              transformOrigin: `${origin.x.toFixed(1)}px ${origin.y.toFixed(1)}px`,
            }}
          >
            {/* ⚠ `CHART1.bars`, NOT `CHART1_ALL` — the breakout candle is
                held back. `CHART1_ALL` is that tape PLUS the breakout, and the
                grid is still built from the full set, so the missing bar keeps
                its slot: nothing shifts when it is put back.

                ⚠ AND `Candles` RATHER THAN `Chart`, so the bar can be dropped
                at all — `Chart` draws a series whole. */}
            {/**
              * ═══ ⚠ THE FLIP IS IN THE DATA, NOT IN A TRANSFORM ═══
              *
              * A breakdown is this breakout upside down, so every value is
              * reflected about the domain's own midline. Doing it with
              * `scaleY(-1)` would turn the picture over but leave a rising
              * green candle pointing down and still green; reflecting o and c
              * swaps the colours BY ITSELF, because a bar that closed above its
              * open now closes below it.
              *
              * ⚠ AND IT IS INTERPOLATED, so the flip is a move rather than a
              * cut: at the halfway point every bar has collapsed onto the
              * midline, which is exactly what a chart edge-on looks like — and
              * it is also where the colours change, so nothing is seen to swap.
              */}
            {/**
              * ═══ ⚠ THE TAPE TURNS AROUND, IT DOES NOT CROSS-FADE ═══
              *
              * The breakout has 126 bars and the traced breakdown 70, so they
              * cannot be paired one-to-one — but they do not need to be. The
              * LAST 70 of the breakout are paired with the 70 of the breakdown,
              * and each one travels: its x from where it stands now to where it
              * belongs on the new tape, its o/c/h/l from one shape to the other.
              * The 28 that start off the left edge simply walk in.
              *
              * ⚠ THE TRAVEL IS IN PIXELS, NOT IN PRICE. The two tapes have
              * different domains; interpolating their VALUES would mean mixing
              * two scales, so each end is converted through its own grid first
              * and the y positions are what move.
              *
              * ⚠ AND THE PIXELS ARE NEGATED. A candle is drawn red when its
              * close is below its open, and screen y runs the other way — left
              * as raw pixels every colour in the tape would invert.
              */}
            {splitT < 0.001 ? (
              <Candles
                bars={CHART1.bars}
                grid={g1}
                shown={progress(f, T.build, SC11.build.over)}
                opacity={dim}
              />
            ) : (
              <Candles bars={morphBars} grid={morphGrid} opacity={dim} />
            )}
            {/* the level the tape is now breaking DOWN through */}
            {splitT > 0.01 && (
              <div
                style={{
                  position: "absolute",
                  left: grid2.box.x,
                  top: grid2.y(BREAKDOWN_SUPPORT),
                  width: grid2.box.w,
                  height: theme.shape.rule,
                  background: theme.color.indigo,
                  opacity: splitT * dim,
                }}
              />
            )}
            {/* ⚠ `border` IS WHAT WIPES IT LEFT TO RIGHT — in that mode the
                fill grows by WIDTH instead of by height. The same call SC01
                makes, on Simon's frame. */}
            {/* ⚠ IT LEAVES WHEN THE READING BAND ARRIVES. The area says where
                the level was; the band says which bars are being read, and two
                areas on screen together say neither. */}
            <div style={{ position: "absolute", inset: 0, opacity: 1 - progress(f, T.hl, SC11.hl.over) }}>
              <Zone
                hi={RES_HI}
                lo={RES_LO}
                grid={g1}
                at={T.zone2}
                over={m.sec(0.8)}
                border
                borderWidth={theme.shape.rule}
                label="Resistance"
              />
            </div>
            {/* ⚠ THE BREAKOUT CANDLE CREEPS UP — "menjalar", not a fade. A clip
                reveals it from its own foot upward, so the green body grows
                through the resistance to its high rather than appearing whole.
                The same reveal SC01 uses, on Simon's re-applied frame. */}
            {f >= T.broke2 &&
              (() => {
                const foot = g1.y(CHART1_BREAK.l);
                const head = g1.y(CHART1_BREAK.h);
                const line = foot - progress(f, T.broke2, SC11.broke.over) * (foot - head);
                return (
                  <div style={{ position: "absolute", inset: 0, clipPath: `inset(${line.toFixed(1)}px 0 0 0)` }}>
                    {/* ⚠ IT LEAVES WITH ITS OWN TAPE. This is the BREAKOUT
                        candle, drawn separately so it can creep up on its own
                        beat; it was the one thing still keyed to the old chart
                        after the split, and it stood alone above the breakdown
                        with nothing under it. */}
                    <Candles bars={CHART1_ALL} grid={g1} from={LAST + 1} opacity={1 - splitT} />
                  </div>
                );
              })()}
          </div>
        </div>

        {/* ── the histogram, in the room the shrink opened ───────────────── */}
        {/* ⚠ NOT DRAWN AS A SLIVER. The window's height is the room the shrink
            has opened so far, which starts at nothing; a 3px white strip under
            the card reads as a rendering fault rather than as a pane arriving. */}
        {volBox.h > 24 && (
          <>
            <Card rect={volBox} />
            {/* ⚠ DRAWN IN SCREEN COORDS, POSITIONED THROUGH THE ZOOM. The bars
                have to stand under the candles the viewer can actually see, and
                those are 3x magnified; putting the histogram inside the zoomed
                wrapper instead would magnify the pane itself by three. */}
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(${volBox.y.toFixed(1)}px ${theme.canvas.width - (volBox.x + volBox.w)}px ${(theme.canvas.height - (volBox.y + volBox.h)).toFixed(1)}px ${volBox.x}px round ${theme.shape.cardRadius}px)` }}>
              {CHART1_VOL.map((_v, i) => {
                if (i > LAST && f < T.broke2) return null;
                if (!candleSeen(i)) return null;
                const x = xz(i) + shiftX;
                if (x < volBox.x - barW || x > volBox.x + volBox.w + barW) return null;
                const v = volAt(i) + (target[i] - volAt(i)) * splitT;
                const h = (v / volPeak) * (volBox.h - 24) * narrowT;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: x - barW / 2,
                      top: volBox.y + volBox.h - 12 - h,
                      width: barW,
                      height: Math.max(1, h),
                      borderRadius: Math.min(barW * 0.28, 8),
                      background:
                        CHART1_ALL[i].c >= CHART1_ALL[i].o
                          ? theme.color.candleGreen
                          : theme.color.candleRed,
                      opacity: 0.72 * (1 - splitT) * dim,
                    }}
                  />
                );
              })}
              {/* and the breakdown's histogram, arriving under its own bars */}
              {splitT > 0.001 &&
                downVol.map((v, i) => {
                  const bw = Math.max(3, (grid2.x(1) - grid2.x(0)) * 0.68);
                  const h = (v / downPeak) * (volBox.h - 24);
                  return (
                    <div
                      key={`d${i}`}
                      style={{
                        position: "absolute",
                        left: grid2.x(i) - bw / 2,
                        top: volBox.y + volBox.h - 12 - h,
                        width: bw,
                        height: Math.max(1, h),
                        borderRadius: Math.min(bw * 0.28, 8),
                        opacity: 0.72 * splitT * dim,
                        background:
                          BREAKDOWN.bars[i].c >= BREAKDOWN.bars[i].o
                            ? theme.color.candleGreen
                            : theme.color.candleRed,
                      }}
                    />
                  );
                })}
            </div>
          </>
        )}
        {/* ── the band over the last seven, and the reading beside it ───── */}
        {(() => {
          /**
           * ⚠ THREE WIPES, ONE BAND. It arrives top-to-bottom at f9390, leaves
           * BOTTOM-TO-TOP as the tape turns at f10471, and returns top-to-bottom
           * at f10672 on the bars it is now about.
           */
          const on1 = progress(f, T.hl, SC11.hl.over);
          const off = progress(f, T.twin, SC11.hl.over);
          /* ⚠ EACH COLUMN HAS ITS OWN RETURN FRAME — the left is read first. */
          const on2 = progress(f, local(SC11.picks[twin].band, FROM), SC11.hl.over);
          const on = Math.max(on1 * (1 - off), on2);
          if (on <= 0.001 || volBox.h <= 24) return null;
          /** ⚠ THE BAND FOLLOWS WHICHEVER TAPE IS ON SCREEN. After the split
           *  the seven columns are the breakdown's, on its own grid. */
          const first = CHART1_ALL.length - SC11.hl.bars;
          const half = Math.abs(xz(1) - xz(0)) * 0.62;
          const half2 = Math.abs(grid2.x(1) - grid2.x(0)) * 0.62;
          const dFirst = BREAKDOWN_HL.from;
          const dLast = BREAKDOWN_HL.from + BREAKDOWN_HL.count - 1;
          const lerp = (a: number, b: number) => a + (b - a) * splitT;
          const bandL = lerp(xz(first) + shiftX - half, grid2.x(dFirst) - half2);
          const bandR = lerp(
            xz(CHART1_ALL.length - 1) + shiftX + half,
            grid2.x(dLast) + half2,
          );
          return (
            /* ⚠ ONE BAND ACROSS BOTH PANES, drawn OVER them. It is making a
               claim about seven COLUMNS — candle and bar together — and two
               separate rectangles would be two claims. */
            <div
              style={{
                position: "absolute",
                left: Math.max(CARD.x, bandL),
                /* ⚠ GOING OUT, THE BOTTOM RISES AND THE TOP STAYS; coming back,
                   the top stays and the bottom falls. Both are the same
                   `height`, which is why only one number is animated. */
                top: CARD.y + 16,
                width: Math.min(CARD.x + CARD_NOW.w, bandR) - Math.max(CARD.x, bandL),
                /* ⚠ THE WIPE IS THE HEIGHT, top to bottom. */
                height: (volBox.y + volBox.h + SC11.hl.past - (CARD.y + 16)) * on,
                borderRadius: theme.shape.chipRadius,
                /* ⚠ CYAN, NOT INDIGO — Simon's call. Indigo is the level and the
                   words; this band is the READING, and giving it the same
                   colour made the two say the same thing. */
                background: theme.color.bandCyan,
                border: `${SC11.hl.rule}px solid ${theme.color.cyan}`,
              }}
            />
          );
        })()}

        </div>
        {/* ⚠ THE COLUMN'S OWN READING, UNDER IT — indigo, because it is the
            conclusion drawn from the picture rather than a name for it. It is
            OUTSIDE the lift, so the words do not grow with the panel. */}
        {(() => {
          const n = SC11.picks[twin].note;
          const inn = textReveal(f, local(n.at, FROM), m.reveal);
          if (inn.opacity <= 0.001) return null;
          return (
            <div
              style={{
                position: "absolute",
                left: CARD.x,
                top: volBox.y + volBox.h + SC11.pick.noteGap,
                width: CARD_NOW.w,
                textAlign: "center",
                fontFamily: theme.text.family,
                fontSize: SC11.pick.noteSize,
                fontWeight: 700,
                color: theme.color.indigo,
                opacity: inn.opacity,
                transform: `translateY(${inn.dy}px)`,
              }}
            >
              {n.text}
            </div>
          );
        })()}
          </div>
          );
        })}

        {/* ── the reading beside the chart ──────────────────────────────── */}
        {SC11.note.groups.map((grp, q) => {
          const kick = "kick" in grp ? grp.kick : undefined;
          const first = local(kick ? kick.at : grp.body.at, FROM);
          const away = 1 - progress(f, local(grp.gone, FROM), SC11.note.out);
          if (f < first || away <= 0.001) return null;
          const bodyIn = textReveal(f, local(grp.body.at, FROM), m.reveal);
          const kickIn = kick ? textReveal(f, local(kick.at, FROM), m.reveal) : null;
          /**
           * ⚠ LAID OUT BY FLOW, NOT BY ARITHMETIC. Both texts wrap at the
           * column's width, so how tall the group is depends on where the words
           * break; a stack centred with `justifyContent` stays centred whatever
           * they do, and there is no height to keep in step by hand.
           *
           * ⚠ THE WHOLE GROUP IS RESERVED FROM ITS FIRST FRAME — the body is
           * rendered from the start and only its OPACITY waits, so the kicker
           * does not jump upward when the body lands. They are one statement.
           */
          return (
            <div
              key={q}
              style={{
                position: "absolute",
                left: CARD.x + CARD_NOW.w,
                top: 0,
                width: theme.canvas.width - theme.margin.right - (CARD.x + CARD_NOW.w),
                height: theme.canvas.height,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: SC11.note.gap,
                fontFamily: theme.text.family,
                textAlign: "center",
                opacity: away * narrowT,
              }}
            >
              {kick && kickIn && (
                <div
                  style={{
                    maxWidth: SC11.note.width,
                    fontSize: SC11.note.kickSize,
                    /* ⚠ THE SAME WEIGHT AS THE BODY — "samain stylenya" meant
                       the whole style, not only the size. At 500 against 700 it
                       read as a caption for the line under it; the two are one
                       statement, and only the COLOUR separates them. */
                    fontWeight: 700,
                    lineHeight: 1.25,
                    color: theme.color.ink,
                    opacity: kickIn.opacity,
                    transform: `translateY(${kickIn.dy}px)`,
                  }}
                >
                  {kick.text}
                </div>
              )}
              <div
                style={{
                  maxWidth: SC11.note.width,
                  fontSize: SC11.note.size,
                  fontWeight: 700,
                  lineHeight: SC11.note.lead / SC11.note.size,
                  color: theme.color.indigo,
                  opacity: bodyIn.opacity,
                  transform: `translateY(${bodyIn.dy}px)`,
                }}
              >
                {grp.body.lines.join(" ")}
              </div>
            </div>
          );
        })}
        </>
        );
      })()}

      {/* ── the single chart ─────────────────────────────────────────────── */}
      {single > 0.001 && !sc11 && (
        <>
          {/* ⚠ SC11 REBUILDS IT FROM NOTHING — see SC11 in data/timing. The
              same tape, drawn again slowly, rather than reappearing complete. */}
          <Chart
            series={MAIN}
            grid={G}
            at={opening ? T.chart : T.build}
            over={opening ? m.sec(3.4) : SC11.build.over}
            opacity={single}
          />
          <VolumeBars
            bars={MAIN.bars}
            volume={vol}
            grid={G}
            box={VOL}
            peak={VOL_TOP}
            shown={progress(f, opening ? T.chart : T.build, opening ? m.sec(3.4) : SC11.build.over)}
            /* ⚠ DIM UNTIL SC02 ASKS FOR IT — the script's "volume masih redup"
               is the hook: it has been on screen the whole time and the viewer
               has not been looking at it. It comes back up for good at SC11. */
            opacity={single * (opening ? 0.16 + toVolume * 0.84 : 1)}
          />

          {/* the level, FOUND in the data — see data/series.ts */}
          <Level
            value={RESISTANCE}
            grid={G}
            /* ⚠ IT WAITS FOR THE AREA. The line used to land on f8214, which
               is now an empty chart being drawn; it arrives with the zone. */
            at={opening ? T.resistance : T.zone2}
            over={m.sec(0.9)}
            label="Resistance"
            broken={f >= (opening ? T.broke : T.absorb)}
            opacity={single}
          />
          <PriceTag
            value={MAIN.closes[MAIN.closes.length - 1]}
            grid={G}
            at={opening ? T.chart + m.sec(3.4) : T.build + SC11.build.over}
            tone="solid"
          />

          {/* SC11 — what the level actually is: an area that kept selling */}
          {/* ⚠ `border` IS WHAT WIPES IT. In that mode the fill grows by WIDTH
              instead of by height, so the area is traced left to right across
              the chart rather than fading up out of it — Simon's gesture. */}
          {!opening && f >= T.zone2 && (
            <Zone
              hi={RESISTANCE * 1.012}
              lo={RESISTANCE * 0.988}
              grid={G}
              at={T.zone2}
              over={m.sec(0.8)}
              border
              label="Berkali-kali menahan kenaikan"
            />
          )}
          {!opening &&
            TESTS.map((i, k) => (
              <Chip
                key={i}
                label={`Test ${k + 1}`}
                x={G.x(i)}
                y={G.y(MAIN.closes[i]) - theme.text.chip.size}
                /* ⚠ AFTER THE AREA, not after the scene starts — at T.back these
                   landed on a chart that had not been drawn yet. */
                at={T.zone2 + m.sec(0.6 + 0.5 * k)}
                tone="slate"
              />
            ))}

          {/* the breakout candle */}
          <HighlightCircle
            cx={G.x(BREAK_AT)}
            cy={G.y(MAIN.closes[BREAK_AT])}
            r={54}
            land={progress(f, opening ? T.broke : T.higher, m.sec(0.5))}
            opacity={single}
          />

          {/* ⚠ THE AVERAGE IS A LINE ON THE HISTOGRAM, not a caption. "Volume
              jauh lebih tinggi dari biasanya" is a comparison, so both sides of
              it have to be visible at once. */}
          {!opening && f >= T.higher && (
            <>
              <Crosshair
                grid={G}
                index={BREAK_AT}
                value={MAIN.closes[BREAK_AT]}
                at={T.higher}
                date="Hari breakout"
                rows={[
                  { label: "Close", value: fmtPrice(MAIN.closes[BREAK_AT]) },
                  {
                    label: "Volume",
                    value: `${(vol[BREAK_AT] / AVG_VOL).toFixed(1)}× rata-rata`,
                  },
                ]}
              />
              <div
                style={{
                  position: "absolute",
                  left: VOL.x,
                  top: volY(VOL, AVG_VOL, VOL_TOP),
                  width: VOL.w,
                  height: theme.shape.hairline,
                  background: theme.color.slate,
                }}
              />
              <Chip
                label="Rata-rata volume"
                x={VOL.x}
                y={volY(VOL, AVG_VOL, VOL_TOP) - theme.text.axis.size}
                at={T.higher}
                anchor="left"
                tone="slate"
              />
            </>
          )}
        </>
      )}

      {/* ── SC02: the same tape twice, and only the histogram differs ────── */}
      {toSplit > 0.001 && (
        <>
          <SplitDivider at={T.split} over={m.sec(0.7)} opacity={toSplit} />
          <SplitLabels left="Breakout A" right="Breakout B" at={T.split} gap={GAP} />
          {[
            { g: GL, pane: HALF.left, v: VOL_HIGH, read: "Volume jauh di atas biasanya", tone: "indigo" as const },
            { g: GR, pane: HALF.right, v: VOL_AVG, read: "Volume biasa saja", tone: "slate" as const },
          ].map((s, k) => (
            <div key={k}>
              <Chart series={MAIN} grid={s.g} at={T.split} over={m.sec(0.5)} opacity={toSplit} tickLabels={false} />
              <VolumeBars bars={MAIN.bars} volume={s.v} grid={s.g} box={s.pane.vol} peak={VOL_TOP} opacity={toSplit} />
              <Level value={RESISTANCE} grid={s.g} at={T.split} over={m.sec(0.5)} broken opacity={toSplit} />
              <Chip
                label={s.read}
                x={s.pane.price.x + s.pane.price.w / 2}
                y={s.pane.vol.y + s.pane.vol.h + theme.text.chip.size}
                at={T.different + m.sec(0.2 * k)}
                tone={s.tone}
              />
            </div>
          ))}
        </>
      )}

      {/* ── the words ───────────────────────────────────────────────────── */}
      {/* ⚠ SC11'S HEADING IS THE ONE FROM f3013 — Simon's reference: indigo, at
          the left margin, at HEAD's own size and position, not the stage's
          centred black title. It is a section heading here, so it belongs to
          the margin rather than to the frame. */}
      <Title
        text={opening ? "Breakout" : "Konfirmasi breakout"}
        at={opening ? T.chart : T.back}
        {...(sc11
          ? { x: HEAD.x, y: HEAD.y, align: "left" as const, size: HEAD.size, color: theme.color.indigo }
          : null)}
      />

      {opening && f < T.split && (
        <>
          <Chip label="Volume" x={VOL.x} y={VOL.y - theme.text.tag.size} at={T.volumeWord} anchor="left" tone="slate" />
          <Chip label="Close di atas resistance" x={theme.canvas.width / 2} y={theme.stage.caption.y} at={T.broke} />
          <Chip label="Kelihatannya valid" x={theme.canvas.width / 2} y={theme.stage.caption.y} at={T.valid} tone="slate" />
          {/* ⚠ A QUESTION, NOT A BUTTON — see the header. */}
          {f >= T.ask && (
            <Line
              text="Langsung beli?"
              x={theme.canvas.width / 2}
              y={theme.stage.caption.y}
              at={T.ask}
              size={theme.text.title.size}
              weight={theme.text.title.weight}
            />
          )}
          {f >= T.notYet && (
            <Chip
              label="Belum tentu"
              x={theme.canvas.width / 2}
              y={theme.stage.card.y - theme.text.chip.size}
              at={T.notYet}
              tone="slate"
            />
          )}
        </>
      )}

      {opening && f >= T.split && (
        <Line
          text="Breakout yang sama. Kekuatan yang berbeda."
          x={theme.canvas.width / 2}
          y={theme.stage.caption.y}
          at={T.different}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
        />
      )}

      {/* ⚠ SC12 AND SC13'S STAT STRIPS ARE GONE, AND SO IS SC13'S KEY POINT —
          Simon's call. The two strips read the same breakout candle twice, but
          the picture underneath them is now SC01's chart, which carries no
          histogram: the "2.3x rata-rata" and "0.8x rata-rata" they printed had
          nothing on screen to be read off, so they were assertions rather than
          readings. The KeyPoint went with them because it sat over the chart
          and covered the very candles it was talking about.

          ⚠ THE NUMBERS THEY USED — VOL_HIGH and VOL_AVG at BREAK_AT — are still
          asserted in data/series.ts, so bringing the strips back needs no data
          work; only a place to put them where the histogram is visible. */}
    </Stage>
  );
};
