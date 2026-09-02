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
  gridOf, domainOf, useMotion, useShadow, usePalette, progress, progressInOut, popIn, theme,
  TuntunMark,
} from "../../../core";
import { BLOCK, BEAT, CUTS, NOTE, NOTE_POP, MASCOT, RECAP, RAIL, FASE, FIELD, RUNNING, RUNNING_LINE, TFW, TF_PICK, local } from "../data/timing";
import { PRICE, VOL, TAG_Y, GAP, halves, panes, BBCA_IMG, RUNNING_IMG, RUNNING_CROP, RUNNING_SEEN, BBCA_VOL } from "../data/layout";
import {
  PAIR, PAIR_VOL, PAIR_AT,
  STOCK_A, STOCK_B, VOL_A, VOL_B, VOL_PEAK, TODAY, AVG_A, AVG_B,
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


/** The mascot block: the mark above, the two lines under it. */
const MASCOT_RECT = (() => {
  const markH = 190;
  const gap = 54;
  const line = Math.round(theme.text.title.size * 1.35);
  const total = markH + gap + line * MASCOT.lines.length;
  const top = (theme.logoZone.height + theme.captionBand.top) / 2 - total / 2;
  return { markH, top, textTop: top + markH + gap, line };
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
/** The histogram's pane inside the window, and one bar per third of it. */
const RAIL_PANE = (() => {
  const pad = 46;
  const b = railBox(RAIL_C.win, RAIL.win.w, RAIL.win.h);
  return { x: b.left + pad, y: b.top + pad, w: b.width - pad * 2, h: b.height - pad * 2 };
})();
/** ⚠ ALL THREE GREEN — they are volume bars, the one place outside a candle
 *  body where this palette is allowed a colour at all. */
const RAIL_BARS = [0, 1, 2].map(() => ({ o: 1, h: 2, l: 1, c: 2 }));
const RAIL_GRID = gridOf([1, 1, 1], [0, 1], RAIL_PANE, 0, 0);

/**
 * The daily screen on its own, at rest. Same height as the pair in SC03 so it
 * reads as the same object returning, centred because there is nothing beside
 * it now.
 */
const RECAP_RECT = (() => {
  const h = SHOT.h;
  const w = (h * BBCA_IMG.w) / BBCA_IMG.h;
  return { h, w, x: theme.canvas.width / 2 - w / 2, top: SHOT.top };
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
          <div style={{ position: "absolute", inset: 0, ...cutInStyle(g, CUTS.intoFase) }}>
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
                        <OffthreadVideo
                          src={staticFile(fase.art)}
                          transparent
                          muted
                          playbackRate={q.rate}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
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
                          <OffthreadVideo
                            src={staticFile(FASE[1].art)}
                            transparent
                            muted
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        </div>
                      </Freeze>
                    </Sequence>

                    {/* ── the volume window ─────────────────────────────── */}
                    <div
                      style={{
                        position: "absolute",
                        ...railBox(RAIL_C.win, RAIL.win.w, RAIL.win.h),
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
                      width={56}
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
                            <OffthreadVideo
                              src={staticFile(FASE[2].art)}
                              transparent
                              muted
                              playbackRate={RAIL.loop.src / loopLen}
                              style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
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
              <>
                {/* ⚠ THE BOB IS THE SAME PAIR SC01's MASCOT BREATHES ON, so the
                    two readings of the same character move alike. */}
                <TuntunMark
                  x={theme.canvas.width / 2}
                  y={
                    MASCOT_RECT.top +
                    Math.sin(((g - MASCOT.at) / MASCOT.float.period) * Math.PI * 2) *
                      MASCOT.float.amount
                  }
                  height={MASCOT_RECT.markH}
                />
                {MASCOT.lines.map((line, n) => (
                  <Words
                    key={line}
                    text={line}
                    x={theme.canvas.width / 2}
                    y={MASCOT_RECT.textTop + MASCOT_RECT.line * (n + 0.5)}
                    at={
                      local(MASCOT.at, FROM) +
                      m.sec(0.35) +
                      n * MASCOT.lines[0].split(" ").length * 6
                    }
                    stagger={6}
                    anchor="center"
                    size={theme.text.title.size}
                    weight={600}
                    marks={[{ text: MASCOT.mark, color: theme.color.hlCyan }]}
                  />
                ))}
              </>
            ) : null}

            {/* ── the daily screen, brought back at rest ──────────────── */}
            {g >= RECAP.at && g < RECAP.gone ? (
              <Img
                src={staticFile(RECAP.art)}
                style={{
                  position: "absolute",
                  left: RECAP_RECT.x,
                  top: RECAP_RECT.top,
                  width: RECAP_RECT.w,
                  height: RECAP_RECT.h,
                  border: `2px solid ${theme.color.gridLine}`,
                  borderRadius: theme.shape.panelRadius,
                  opacity: progress(f, local(RECAP.at, FROM), m.fade),
                }}
              />
            ) : null}
          </div>
        ) : (
          <div style={{ position: "absolute", inset: 0, ...cutOutStyle(g, CUTS.intoFase) }} />
        )}
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
