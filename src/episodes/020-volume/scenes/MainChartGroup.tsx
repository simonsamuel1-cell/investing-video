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
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  Stage, Card, Chart, Candles, VolumeBars, Level, PriceTag, Zone, HighlightCircle,
  Chip, Title, Line, KeyPoint, SourceTag, StatStrip, Crosshair,
  SplitDivider, SplitLabels,
  gridOf, useMotion, progress, progressInOut, price as fmtPrice, theme, cutInStyle,
} from "../../../core";
import { BLOCK, BEAT, CUTS, OPEN, SHRINK, RES, ZOOM, BREAK1, ASK1, ANS1, local } from "../data/timing";
import { PRICE, VOL, TAG_Y, GAP, halves, panes } from "../data/layout";
import {
  MAIN, MAIN_DOMAIN, RESISTANCE, TESTS, BREAK_AT, VOL_HIGH, VOL_AVG, mean,
  CHART1, CHART1_ALL, CHART1_DOMAIN2, CHART1_RES, CHART1_BREAK,
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
  away: local(BLOCK.SC03, FROM),
  back: local(BLOCK.SC11, FROM),
  zone: local(BEAT.heldItDown, FROM),
  absorb: local(BEAT.absorb, FROM),
  higher: local(BEAT.muchHigher, FROM),
  ordinary: local(BEAT.ordinaryVolume, FROM),
  notFailed: local(BEAT.notFailed, FROM),
  weaker: local(BEAT.weaker, FROM),
  retest: local(BEAT.retest, FROM),
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
 * ⚠ THE GROUP STAYS MOUNTED throughout. It draws nothing rather than being
 * unmounted, because the tape it carries has to survive all the way to SC13.
 * Blanking is a drawing decision; unmounting would be a timing one and would
 * rebuild the chart.
 */
const BLANK_UNTIL = 900;
/** ⚠ EDIT HERE — font size of the "Apakah langsung beli?" question, in px. */
const ASK_SIZE = 70;
/** ⚠ EDIT HERE — font size of the "Belum tentu" answer, in px. */
const ANS_SIZE = 70;





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
  if (f < BLANK_UNTIL) {
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
      <Stage>
        <div style={{ position: "absolute", inset: 0, ...cutInStyle(f + FROM, CUTS.intoSC01) }}>
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
                    <Zone hi={RES_HI} lo={RES_LO} grid={G1} at={RES.at} over={RES.over} border borderWidth={theme.shape.rule} />
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
            }}
          />
        </div>
      </Stage>
    );
  }

  const opening = f < T.back;
  const toVolume = progress(f, T.notYet, m.sec(0.9));
  const toSplit = opening ? progress(f, T.split, m.sec(0.8)) : 0;
  const single = 1 - toSplit;
  /* SC13 swaps the histogram for the ordinary reading, on the same candles */
  const vol = f >= T.sc13 ? VOL_AVG : VOL_HIGH;

  return (
    <Stage>
      <Card />
      <SourceTag kind={MAIN.kind} label={MAIN.label} y={TAG_Y} />

      {/* ── the single chart ─────────────────────────────────────────────── */}
      {single > 0.001 && (
        <>
          <Chart series={MAIN} grid={G} at={T.chart} over={m.sec(3.4)} opacity={single} />
          <VolumeBars
            bars={MAIN.bars}
            volume={vol}
            grid={G}
            box={VOL}
            peak={VOL_TOP}
            shown={progress(f, T.chart, m.sec(3.4))}
            /* ⚠ DIM UNTIL SC02 ASKS FOR IT — the script's "volume masih redup"
               is the hook: it has been on screen the whole time and the viewer
               has not been looking at it. It comes back up for good at SC11. */
            opacity={single * (opening ? 0.16 + toVolume * 0.84 : 1)}
          />

          {/* the level, FOUND in the data — see data/series.ts */}
          <Level
            value={RESISTANCE}
            grid={G}
            at={opening ? T.resistance : T.back}
            over={m.sec(0.9)}
            label="Resistance"
            broken={f >= (opening ? T.broke : T.absorb)}
            opacity={single}
          />
          <PriceTag value={MAIN.closes[MAIN.closes.length - 1]} grid={G} at={T.chart + m.sec(3.4)} tone="solid" />

          {/* SC11 — what the level actually is: an area that kept selling */}
          {!opening && f >= T.zone && (
            <Zone
              hi={RESISTANCE * 1.012}
              lo={RESISTANCE * 0.988}
              grid={G}
              at={T.zone}
              over={m.sec(0.8)}
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
                at={T.back + m.sec(1.2 + 0.5 * k)}
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
      <Title text={opening ? "Breakout" : "Konfirmasi breakout"} at={opening ? T.chart : T.back} />

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

      {/* SC12 / SC13 — the same candle, read twice */}
      {!opening && f >= T.higher && f < T.sc13 && (
        <StatStrip
          stats={[
            { label: "Close", value: "Di atas resistance", tone: "indigo" },
            { label: "Volume", value: `${(VOL_HIGH[BREAK_AT] / AVG_VOL).toFixed(1)}× rata-rata`, tone: "indigo" },
            { label: "Konfirmasi", value: "Lebih meyakinkan", tone: "indigo" },
          ]}
          rect={{ x: theme.stage.card.x, y: theme.stage.caption.y - theme.text.title.size, w: theme.stage.card.w, h: theme.text.title.size * 2 }}
          at={T.higher}
        />
      )}
      {!opening && f >= T.sc13 && (
        <StatStrip
          stats={[
            { label: "Close", value: "Di atas resistance", tone: "indigo" },
            { label: "Volume", value: `${(VOL_AVG[BREAK_AT] / AVG_VOL).toFixed(1)}× rata-rata`, tone: "slate" },
            { label: "Konfirmasi", value: "Lebih lemah", tone: "slate" },
          ]}
          rect={{ x: theme.stage.card.x, y: theme.stage.caption.y - theme.text.title.size, w: theme.stage.card.w, h: theme.text.title.size * 2 }}
          at={T.ordinary}
        />
      )}
      {!opening && f >= T.retest && (
        <KeyPoint
          text="Volume rendah bukan berarti breakout gagal"
          sub="Tunggu candle berikutnya, retest, atau konfirmasi lain"
          at={T.retest}
          rect={{ x: theme.stage.card.x, y: theme.stage.card.y, w: theme.stage.card.w, h: theme.stage.card.h }}
        />
      )}
    </Stage>
  );
};
