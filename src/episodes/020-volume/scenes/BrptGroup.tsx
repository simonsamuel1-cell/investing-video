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
import { useCurrentFrame } from "remotion";
import {
  Stage, Card, Chart, VolumeBars, Level, RevealMask, Crosshair, Countdown,
  Chip, Title, Line, KeyPoint, SourceTag, StatStrip,
  gridOf, useMotion, progress, price as fmtPrice, theme,
} from "../../../core";
import { BLOCK, BEAT, local, COUNTDOWN } from "../data/timing";
import { PRICE, VOL, TAG_Y } from "../data/layout";
import {
  BRPT, BRPT_DOMAIN, BRPT_VOL, BRPT_BREAK, BRPT_REBOUND, BRPT_ASK,
  BRPT_SUPPORT, BRPT_PEAK,
} from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC15A;
const T = {
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
      <Card />
      <SourceTag kind={BRPT.kind} label="BRPT · 1D" y={TAG_Y} />
      <Title text={answering ? "False breakdown" : "Menurutmu, apa yang terjadi?"} at={answering ? T.upTo : T.ticker} />

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
    </Stage>
  );
};
