/**
 * CG-D — SC15A + SC15B. `from 11201 · dur 3248`
 *
 * The prediction beat. ⚠ THE ANSWER IS ON THE CHART THE WHOLE TIME and has
 * simply not been shown: `RevealMask` hides everything right of the rebound and
 * lifts across the join at f12966. A second chart drawn for the answer would
 * make the reveal a claim rather than a disclosure, and the viewer could not
 * check that the tape never changed.
 *
 * ⚠ [NEEDS DATA] THIS IS NOT BRPT. It carries the ticker with the Ilustrasi tag
 * beside it, because the shape is real and the bars are not. The script's 142M
 * and 189M volume figures are placeholders and are NOT PRINTED anywhere — the
 * StatStrip states the two RELATIVE comparisons the narration actually makes,
 * which is all this data can honestly support. The "~1.750" is read out of the
 * series, never typed.
 *
 * ⚠ THE COUNTDOWN IS UNEVEN. 102 frames from "tiga" to "dua", 40 from "dua" to
 * "satu". That is the recording. Never space these on a grid.
 */
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  Stage, Card, Chart, VolumeBars, Level, RevealMask, Crosshair, Countdown, progressInOut,
  Chip, Title, Line, KeyPoint, SourceTag, StatStrip, cutInStyle, HighlightCircle, HighlightBox,
  gridOf, useMotion, progress, textReveal, price as fmtPrice, theme,
} from "../../../core";
import { BLOCK, BEAT, CUTS, HEAD, QUIZ, SC15_BLANK, SC15_ART, local, COUNTDOWN } from "../data/timing";
import { PRICE, VOL, TAG_Y } from "../data/layout";
import {
  BRPT, BRPT_DOMAIN, BRPT_VOL, BRPT_BREAK, BRPT_REBOUND, BRPT_ASK,
  BRPT_SUPPORT, BRPT_PEAK,
} from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC15A;
const T = {
  /**
   * ⚠ 0 AGAIN — THE CUT LANDS ON THE FINISHED LAYOUT. This used to wait for
   * "Quiz Time" to walk out of the middle of the frame; nothing travels through
   * the middle any more, so there is nothing to wait for.
   */
  chart: 0,
  ticker: local(BEAT.brpt, FROM),
  low: local(BEAT.monthLow, FROM),
  twoDays: local(BEAT.lastTwoDays, FROM),
  atBreak: local(BEAT.atBreakdown, FROM),
  lessThan: local(BEAT.lessThanSpikes, FROM),
  rebound: local(BEAT.rebound, FROM),
  question: local(BEAT.question, FROM),
  answer: local(BLOCK.SC15B, FROM),
  upTo: local(BEAT.upTo, FROM),
  clue: local(BEAT.twoCandles, FROM),
  bigger: local(BEAT.reboundBigger, FROM),
  losing: local(BEAT.losingConfirmation, FROM),
  noGuarantee: local(BEAT.noGuarantee, FROM),
};
/** ⚠ GLOBAL frames — the countdown is cued to the recording, not to this
 *  scene's start. Countdown reads scene-local frames, so they convert here. */
const BEATS = COUNTDOWN.map((b) => b - FROM);
// ═══════════════════════════════════════════════════════════════════════════

const G = gridOf(BRPT.closes, BRPT_DOMAIN, PRICE, 0.12, 96);
const PEAK = Math.max(...BRPT_VOL);
const BREAK_V = BRPT_VOL[BRPT_BREAK];
const REBOUND_V = BRPT_VOL[BRPT_REBOUND];
const PRIOR_MAX = Math.max(...BRPT_VOL.slice(0, BRPT_BREAK));

export const BrptGroup = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const answering = f >= T.answer;
  /* the mask lifts across the join — one move, two scenes */
  const open = progress(f, T.answer, m.sec(1.4));

  return (
    <Stage>
      {/* ⚠ THE WHOLE QUIZ LAYOUT TRAVELS IN AS ONE THING. Both halves of the
          cut evaluate CUTS.toQuiz from GLOBAL frames — CG-A through
          `cutOutStyle`, this through `cutInStyle`. Wrapping the layout rather
          than its pieces is what makes the cover and the picture inseparable:
          they move together, both fully opaque, so the answer can never show
          through a half-transparent shape the way it did when this was a
          fade. */}
      <div style={{ position: "absolute", inset: 0, ...cutInStyle(f + FROM, CUTS.toQuiz) }}>
      {/* ⚠ THE WHOLE PICTURE WAITS FOR THE TITLE TO LEAVE THE MIDDLE. Mounted
          from frame 0 the empty card, its gridlines and the reveal mask all
          stood behind "Quiz Time" while it was still 2.5× size and centred —
          which is a section announcing itself over the section it is
          announcing. 019 opens on bare paper for the same reason. It arrives
          on the same frame the chart starts drawing, so the heading vacating
          the middle and the picture filling it are one hand-over. */}
      {/* ⚠ THE PICTURE IS OFF — see SC15_BLANK in data/timing. Everything below
          is still built and still VO-locked; only the lever decides whether it
          draws. */}
      {!SC15_BLANK && (
      <div style={{ position: "absolute", inset: 0, opacity: progress(f, T.chart, m.fade) }}>
      <Card />
      <SourceTag kind={BRPT.kind} label="BRPT · 1D" y={TAG_Y} />

      <Chart series={BRPT} grid={G} at={T.chart} over={m.sec(2.6)} />
      <VolumeBars bars={BRPT.bars} volume={BRPT_VOL} grid={G} box={VOL} peak={PEAK} shown={progress(f, T.chart, m.sec(2.6))} />
      <Level value={BRPT_SUPPORT} grid={G} at={T.low} over={m.sec(0.8)} label="Level terendah sebulan" broken />

      {/* ⚠ THE ANSWER WAS ALWAYS THERE — this only stops covering it. */}
      <RevealMask fromIndex={BRPT_ASK} grid={G} open={open} />

      {f >= T.atBreak && (
        <Crosshair
          grid={G}
          index={BRPT_BREAK}
          value={BRPT.closes[BRPT_BREAK]}
          at={T.atBreak}
          date="Hari breakdown"
          rows={[{ label: "Volume", value: `${(BREAK_V / PRIOR_MAX).toFixed(2)}× hari teramai` }]}
        />
      )}
      {f >= T.rebound && (
        <Crosshair
          grid={G}
          index={BRPT_REBOUND}
          value={BRPT.closes[BRPT_REBOUND]}
          at={T.rebound}
          date="Besoknya"
          rows={[{ label: "Volume", value: `${(REBOUND_V / BREAK_V).toFixed(2)}× hari breakdown` }]}
        />
      )}

      {/* the two clues, stated as the comparisons they are */}
      {f >= T.lessThan && !answering && (
        <StatStrip
          stats={[
            { label: "Support", value: "Ditembus", tone: "slate" },
            { label: "Volume breakdown", value: "Di bawah hari teramai", tone: "slate" },
            { label: "Volume rebound", value: "Di atas hari breakdown", tone: "indigo" },
          ]}
          rect={{ x: theme.stage.card.x, y: theme.stage.caption.y - theme.text.title.size, w: theme.stage.card.w, h: theme.text.title.size * 2 }}
          at={T.lessThan}
        />
      )}

      {/* ⚠ INTERROGATIVE, AND NOTHING DIRECTIONAL RENDERS BEFORE THE ANSWER. */}
      {f >= T.question && !answering && (
        <>
          <Line text="Lanjut turun, atau cuma jebakan?" x={theme.canvas.width / 2} y={theme.stage.card.y + theme.text.title.size} at={T.question} size={theme.text.title.size} weight={theme.text.title.weight} />
          <Countdown beats={BEATS} />
        </>
      )}

      {answering && (
        <>
          <Chip
            label={`Harga lanjut naik sampai sekitar ${fmtPrice(BRPT_PEAK)}`}
            x={theme.canvas.width / 2}
            y={theme.stage.card.y + theme.text.chip.size}
            at={T.upTo}
            pill
          />
          {f >= T.losing && (
            <StatStrip
              stats={[
                { label: "Breakdown", value: "Kehilangan konfirmasi", tone: "slate" },
                { label: "Buyer", value: "Mulai merespons", tone: "indigo" },
              ]}
              rect={{ x: theme.stage.card.x, y: theme.stage.caption.y - theme.text.title.size, w: theme.stage.card.w, h: theme.text.title.size * 2 }}
              at={T.losing}
            />
          )}
          {f >= T.noGuarantee && (
            <KeyPoint
              text="Bukan jaminan — volume cuma memberi alasan untuk curiga"
              at={T.noGuarantee}
              rect={{ x: theme.stage.card.x, y: theme.stage.card.y + theme.stage.card.h * 0.34, w: theme.stage.card.w, h: theme.text.title.size * 2 }}
            />
          )}
        </>
      )}
      </div>
      )}

      {/* ── Simon's BRPT screenshot, alone in the blanked section ────────
          ⚠ CENTRED ON BOTH AXES, and the vertical centring is on the ROOM
          between the heading rail and the subtitle band rather than on the
          canvas — a picture centred on 540 would sit 20px into the band it is
          not allowed to enter.

          ⚠ IT WAITS FOR "QUIZ TIME" TO LEAVE THE MIDDLE, on the frame the
          chart used to start. A section cannot announce itself over its own
          picture. */}
      {(() => {
        const A = SC15_ART;
        /** ⚠ ONE HEIGHT DRIVES EVERYTHING. The cover and the level are derived
         *  from the picture's rect, so growing it grows them — there is nothing
         *  to keep in step by hand. */
        const h = interpolate(
          progressInOut(f, local(A.zoom.at, FROM), A.zoom.over),
          [0, 1],
          [A.h, A.zoom.to],
        );
        const w = h * A.ratio;
        /** ⚠ ONE CONVERSION, USED BY EVERYTHING. The cover and the level are
         *  written in the FILE's pixels and come through here, so moving or
         *  resizing the picture moves them with it — there is no second copy
         *  of these numbers to fall out of step. */
        const L = (theme.canvas.width - w) / 2;
        /** ⚠ THE BOTTOM EDGE IS THE ANCHOR, so the picture grows upward and
         *  out of the top of the frame rather than off its own baseline. */
        const T0 = A.bottom - h;
        const k = h / A.img.h;
        const X = (ix: number) => L + ix * k;
        const Y = (iy: number) => T0 + iy * k;
        /** The left edge of the covered block: half a pitch before the first
         *  hidden column's centre, so the cover starts in the gap rather than
         *  through a candle. */
        /** ⚠ FRACTIONAL ON PURPOSE. `hide` walks 10 → 8 across the reveal, and
         *  a fractional column count is what makes the edge travel instead of
         *  jumping two pitches on one frame. */
        const hide =
          A.hide - A.reveal.by * progressInOut(f, local(A.reveal.at, FROM), A.reveal.over);
        const cx = X(A.bars.first + A.bars.pitch * (A.bars.n - hide) - A.bars.pitch / 2);
        const cw = X(A.plot.x1 + A.padRight) - cx;
        const line = progress(f, local(A.supportAt, FROM), A.supportOver);
        /** ⚠ THE MARKS LEAVE ON THE ZOOM'S OWN CURVE — see `marksOut`. They are
         *  about the low; once the view opens into the volume the reading has
         *  moved on, and a mark left standing is a mark still making its claim. */
        const marks =
          1 - progressInOut(f, local(A.marksOut.at, FROM), A.marksOut.over);
        /**
         * ⚠ EVERY MARK RIDES THIS, WHICH IS WHY IT IS ONE WRAPPER. The covers,
         * the highlights, the ring, the level and the question marks are all
         * laid out against the picture's rect; sliding the picture alone would
         * leave them behind, and sliding each of them by the same number would
         * be six places to get it wrong.
         *
         * ⚠ AND THE DISTANCE IS DERIVED. `theme.margin.left` minus wherever the
         * left edge actually is, so it lands flush whatever size the picture
         * ended up at.
         */
        const dx =
          (theme.margin.left - L) * progressInOut(f, local(A.shift.at, FROM), A.shift.over);
        return (
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${dx.toFixed(1)}px)` }}>
            <Img
              src={staticFile(A.src)}
              style={{
                position: "absolute",
                left: L,
                top: T0,
                width: w,
                height: h,
                /* ⚠ ROUNDED — Simon's call. Every other surface in this episode
                   is; a screenshot with square corners reads as a foreign
                   object dropped on the page. */
                borderRadius: theme.shape.cardRadius,
              }}
            />
            {/* ── the answer, withheld ─────────────────────────────────── */}
            {[A.price, A.vol].map((pane, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: cx,
                  top: Y(pane.y0),
                  width: cw,
                  height: Y(pane.y1) - Y(pane.y0),
                  borderRadius: theme.shape.panelRadius,
                  background: theme.color.border,
                  /* ⚠ THE QUESTION MARK IS A CHILD OF THE SHAPE, not a third
                     element placed at its centre. Centred by layout, it stays
                     in the middle of the panel however the picture is resized
                     — there is no coordinate to keep in step. */
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: theme.text.family,
                  fontSize: A.qmSize * k,
                  fontWeight: 800,
                  /* ⚠ DARK GREY, NOT BLACK — Simon's call. Black on the
                     grey panel is the weight of a heading; this is a placeholder
                     for something not yet said. */
                  color: theme.color.slate,
                  lineHeight: 1,
                }}
              >
                ?
              </div>
            ))}

            {/* ── the two readings of the histogram ────────────────────── */}
            {[
              ...A.hl.map((q, i) => ({ ...q, half: "half" in q ? q.half : false, i, cyan: false })),
              { ...A.hl2, half: false, i: 2, cyan: true },
            ].map((q) => {
              /** ⚠ ONE CURVE OPENS IT AND ANOTHER SHUTS IT, and the shut is the
               *  same `grow` running backwards — the box closes the way it came
               *  rather than fading, so the edge that made the claim is the last
               *  thing to leave. The cyan pair has no exit: it arrives after the
               *  other two have gone and stays. */
              const out = q.cyan
                ? 0
                : progressInOut(f, local(A.hlOut.at, FROM), A.hlOut.over);
              const g = progress(f, local(q.at, FROM), m.sec(0.5)) * (1 - out);
              if (g <= 0.001) return null;
              const half = A.bars.pitch / 2;
              const x1 = A.bars.first + A.bars.pitch * q.from - half;
              const x2 =
                A.bars.first + A.bars.pitch * q.to + half - (q.i === 1 ? A.hlGap : 0);
              /** Half height, sitting on the baseline — see `hl[0].half`. */
              const y1 = q.half ? A.vol.y0 + (A.vol.y1 - A.vol.y0) * 0.5 : A.vol.y0;
              return (
                <HighlightBox
                  key={q.i}
                  rect={{ x1: X(x1), y1: Y(y1), x2: X(x2), y2: Y(A.vol.y1) }}
                  grow={g}
                  {...(q.cyan
                    ? { stroke: theme.color.cyan, fill: theme.color.bandCyan }
                    : null)}
                />
              );
            })}
            {/* ── the ring on that same candle ─────────────────────────── */}
            {/* ⚠ ITS RADIUS TRAVELS WITH THE PICTURE but its STROKE does not:
                `HighlightCircle` draws a 2px rule whatever the ring's size, and
                an annotation whose line thickens when the thing it points at is
                enlarged reads as part of the picture rather than as a mark on
                it. */}
            <HighlightCircle
              cx={X(A.ring.x)}
              cy={Y(A.ring.y)}
              r={A.ring.r * k}
              land={progress(f, local(A.ring.at, FROM), m.pop)}
              width={theme.shape.line}
              glow={A.markGlow}
              opacity={marks}
            />

            {/* ── the support level, on the low of the visible tape ─────── */}
            {line > 0.001 && (
              <div
                style={{
                  position: "absolute",
                  left: X(A.plot.x0),
                  top: Y(A.low),
                  /* ⚠ IT DRAWS LEFT TO RIGHT and runs UNDER the cover, not up
                     to it: a level that stops where the answer begins would be
                     telling the viewer where to look. */
                  width: (X(A.plot.x1) - X(A.plot.x0)) * line,
                  height: theme.shape.line,
                  background: theme.color.indigo,
                  /* ⚠ TIGHT, NOT `SHADOWS.bloom`. That one is 46px of spread
                     meant to lift a whole card; on a 3px rule it washes out
                     into a haze with no line left in the middle of it. */
                  boxShadow: `0 0 ${A.markGlow}px ${theme.color.indigoGlow}`,
                  opacity: marks,
                }}
              />
            )}
          </div>
        );
      })()}

      {/* ── the two answers, in the room the picture gave up ────────────
          ⚠ OUTSIDE THE PICTURE'S WRAPPER. It does not ride the slide: the
          picture moves left TO MAKE ROOM for this, and something that travelled
          with it would arrive in the space it was clearing. */}
      {(() => {
        const Q = SC15_ART.ask;
        const head = textReveal(f, local(Q.at, FROM), m.reveal);
        if (head.opacity <= 0.001) return null;
        const period = m.sec(Q.pulse);
        return (
          <div
            style={{
              position: "absolute",
              left: Q.x,
              top: Q.midY,
              transform: "translateY(-50%)",
              width: theme.canvas.width - theme.margin.right - Q.x,
              fontFamily: theme.text.family,
            }}
          >
            <div
              style={{
                fontSize: Q.headSize,
                fontWeight: 700,
                color: theme.color.ink,
                opacity: head.opacity,
                transform: `translateY(${head.dy}px)`,
                marginBottom: Q.lead,
              }}
            >
              {Q.head}
            </div>
            {Q.options.map((label, i) => {
              const inn = textReveal(f, local(Q.at, FROM) + m.fade * (i + 1), m.reveal);
              /**
               * ⚠ THE PULSE REPEATS, which nothing else in this episode does. A
               * ring that fires once is a mark landing; a ring that keeps going
               * is an invitation still open — and it is open for as long as the
               * question is. Driven off the frame with a modulo so it is
               * frame-deterministic: no clock, no randomness.
               */
              const t = Math.max(0, f - local(Q.at, FROM));
              const q = ((t + (i * period) / 2) % period) / period;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: Q.dotGap,
                    marginTop: i ? Q.gap : 0,
                    opacity: inn.opacity,
                    transform: `translateY(${inn.dy}px)`,
                  }}
                >
                  {/* ⚠ THE RING IS A SIBLING IN A FIXED WELL, not a scaled
                      wrapper round the dot. Scaling the dot would move the text
                      beside it every frame; a well the size of the ring's widest
                      state means the row's geometry never changes. */}
                  <div
                    style={{
                      flex: `0 0 ${Q.dot * 4}px`,
                      height: Q.dot * 4,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: Q.dot * 2 * (1 + q * 1.1),
                        height: Q.dot * 2 * (1 + q * 1.1),
                        marginLeft: -Q.dot * (1 + q * 1.1),
                        marginTop: -Q.dot * (1 + q * 1.1),
                        borderRadius: "50%",
                        border: `${theme.shape.rule}px solid ${theme.color.indigo}`,
                        opacity: (1 - q) * 0.6,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: Q.dot * 2,
                        height: Q.dot * 2,
                        marginLeft: -Q.dot,
                        marginTop: -Q.dot,
                        borderRadius: "50%",
                        background: theme.color.indigo,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: Q.size, fontWeight: 700, color: theme.color.ink }}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* ⚠ THE CENTRED HEADING GOES WITH THE PICTURE — "textnya juga". The one
          thing left standing is "Quiz Time" below: it is the SECTION's name and
          Simon asked for it two changes ago, so blanking it would undo the work
          the blanking was clearing space for. Both of these are the SCENE's own
          headings and they are content, not the rail. */}
      {!SC15_BLANK && (
        <Title text={answering ? "False breakdown" : "Menurutmu, apa yang terjadi?"} at={answering ? T.upTo : T.ticker} />
      )}

      {/* ⚠ LAST, SO IT IS ON TOP, and PART of what the cut carries in — it no
          longer arrives on its own. Simon: "camera cutnya langsung ke layout
          Quiz Time di pojok kiri atas". It sits on HEAD's own anchor, the same
          rail SC11's heading stood on, so the name does not jump between the
          two sections. */}
      <Title
        text={QUIZ.text}
        /* ⚠ ALREADY REVEALED ON THE CUT FRAME. `Title` always fades and rises,
           and at frame 0 that put the heading at zero opacity while the picture
           beside it arrived solid — the cut is supposed to land on a FINISHED
           layout. Starting its reveal before the group exists means it is done
           by the time anyone sees it. */
        at={-m.reveal}
        x={HEAD.x}
        y={HEAD.y}
        size={HEAD.size}
        align="left"
        color={theme.color.indigo}
      />
      </div>
    </Stage>
  );
};
