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
import { Img, staticFile, useCurrentFrame } from "remotion";
import {
  Stage, Card, Chart, VolumeBars, Level, RevealMask, Crosshair, Countdown,
  Chip, Title, Line, KeyPoint, SourceTag, StatStrip, QuizTitle,
  gridOf, useMotion, progress, price as fmtPrice, theme,
} from "../../../core";
import { BLOCK, BEAT, HEAD, QUIZ, SC15_BLANK, SC15_ART, local, COUNTDOWN } from "../data/timing";
import { PRICE, VOL, TAG_Y } from "../data/layout";
import {
  BRPT, BRPT_DOMAIN, BRPT_VOL, BRPT_BREAK, BRPT_REBOUND, BRPT_ASK,
  BRPT_SUPPORT, BRPT_PEAK,
} from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC15A;
const T = {
  /**
   * ⚠ THE CHART WAITS FOR THE QUIZ TITLE TO LEAVE THE MIDDLE. At frame 0 it
   * would build under "Quiz Time" while the words are still 2.5× size and
   * centred — 019 opens on an empty stage for exactly this reason. It starts
   * as the walk starts, so the heading vacates the middle and the tape fills
   * it: one move handing over to the next rather than two at once.
   *
   * There is room. 2.6s of drawing from f11363 finishes at f11519, and the
   * first VO-locked beat in this group is the ticker at f11560.
   */
  chart: QUIZ.hold,
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
        const w = SC15_ART.h * SC15_ART.ratio;
        const inn = progress(f, T.chart, m.sec(0.6));
        if (inn <= 0.001) return null;
        return (
          <Img
            src={staticFile(SC15_ART.src)}
            style={{
              position: "absolute",
              left: (theme.canvas.width - w) / 2,
              top: (SC15_ART.top + SC15_ART.bottom - SC15_ART.h) / 2,
              width: w,
              height: SC15_ART.h,
              opacity: inn,
            }}
          />
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

      {/* ⚠ LAST, SO IT IS ON TOP. It is the first thing on screen in this
          group and it has to stay legible over the card the chart is drawn on
          — mounted before the card it was simply painted over.

          ⚠ IT IS NOT PART OF THE PICTURE THE CUT CARRIES IN; see CUTS.toQuiz,
          which is deliberately one-sided. It settles on HEAD's own anchor, the
          same rail SC11's heading stood on, so the section name does not jump
          between the two sections. */}
      <QuizTitle
        text={QUIZ.text}
        at={local(QUIZ.at, FROM)}
        hold={QUIZ.hold}
        walk={QUIZ.walk}
        x={HEAD.x}
        y={HEAD.y}
        size={HEAD.size}
      />
    </Stage>
  );
};
