import { useCurrentFrame } from "remotion";
/**
 * SC03 — The Chart Records Decisions (ChartContinuity Phase B, local 608–1190).
 * The saham chart from SC02's right window has grown and zoomed out (see
 * continuity/SahamChart); two trendlines trace its structure, the card lifts,
 * and three chips mark decisions already recorded in the series.
 * Compliance: these describe PAST recorded behaviour — no arrows, no entry
 * markers, wording exactly as specced.
 *
 * ⚠ EVERY MARK IS READ OFF THE SAHAM CHART NOW, not the BMRI series. The chart
 * under this scene changed at 1370 (Simon: "ubah jadi window kanan yang
 * membesar"), and marks pinned to the old series would point at candles that
 * are no longer there.
 */
import { Ping } from "../components/Ping";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, progressInOut, fadeOut } from "../helpers";
import { SAHAM_CANDLES, SAHAM_ALL } from "../data/sahamReference";
import type { ContGeom } from "../continuity/ChartContinuity";
import { usePalette } from "../palette";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  /**
   * ⚠ GLOBAL 1487 — Simon: "Muncul 1 garis trend yang menghubungkan lows dan
   * 1 garis trend yang menghubungkan highs." "Tapi kenapa geraknya membentuk
   * pola tertentu?" The two lines replace the old swing underlines and smile
   * curves, which were drawn to the BMRI series.
   */
  underline: 88,
  /**
   * ⚠ GLOBAL 1518 — NO "?" ANY MORE. Simon: "Cancel kemunculan '?' Instead
   * ganti dengan trend line zig zag sepanjang chart." A ZigZag through the
   * chart's own swings, drawn in, and trimmed back out at 1669.
   */
  zigzag: 119,
  zigzagIn: 40,
  question: 182, // "membaca pesan di baliknya"
  questionOut: 262, // global 1661 — "Text 'Apa pesannya' fade out"
  questionOutDur: 16,
  zigzagOut: 270, // global 1669 — "Trend line zigzag nya trim path out"
  zigzagOutDur: 32,
  lift: 268, // "bukan sekadar catatan masa lalu"
  /**
   * ⚠ GLOBAL 1763 — BUY AND SELL LABELS ALONG THE CHART, replacing the dots
   * that used to mark every close on this beat ("Ia merekam setiap keputusan
   * pembeli dan penjual"). Simon: "Buy: Text putih, pill design hijau. Sell:
   * Text putih, pill design merah."
   *
   * ⚠ COMPLIANCE: these are buy/sell markers, which the build rules forbid
   * anywhere. Simon asked for them explicitly; on screen they label decisions
   * already recorded in a traced illustration, not a call to act. Flagged for
   * Tuntun compliance before release.
   */
  labels: 364,
  labelStep: 2, // frames between one label and the next, left to right
  /**
   * ⚠ THE PILLS STEP BACK TO 30% BEFORE "Berani masuk" ARRIVES — Simon:
   * "Sebelum muncul text 'Berani masuk', semua Buy dan Sell jadi transparan
   * 30%." Finished on the frame the chip starts (brave + 6).
   */
  labelsDim: 437,
  labelsDimDur: 10,
  brave: 441,
  doubt: 487,
  exit: 517,
};
/** Same draw as SC01's lines: 32 frames, symmetric ease — see Scene01 TRIM. */
const TRIM = 32;
/** Same weight as SC01's lines at full strength. */
const LINE_W = 5;
const CARD_LIFT_PX = 6;
/** Buy / Sell pill: type size, its outer size, and its gap from the candles. */
const PILL_SIZE = 22;
const PILL = { w: 70, h: 36, gap: 8 };
/** "Berani masuk" / "Ragu" / "Keluar": the film's chip, filled, bold, +10px. */
const DECISION_CHIP = {
  variant: "indigo",
  solid: true,
  weight: 700,
  size: theme.type.chip.size + 10,
} as const;
// ═══════════════════════════════════════════════════════════════════════════

const D = SAHAM_CANDLES;
const [A, B] = SAHAM_ALL;
const MID = Math.floor((A + B) / 2);

/** Index of the lowest low / highest high in [a, b]. */
const argLow = (a: number, b: number) => {
  let k = a;
  for (let i = a; i <= b; i++) if (D[i].l < D[k].l) k = i;
  return k;
};
const argHigh = (a: number, b: number) => {
  let k = a;
  for (let i = a; i <= b; i++) if (D[i].h > D[k].h) k = i;
  return k;
};
/**
 * Genuine pivots, one per half, the same way SC01 anchors its trendlines. On
 * this series the lows line runs through candles 25 and 57 and the highs line
 * through 7 and 93 — every low between its anchors sits above the one, every
 * high below the other.
 */
const LOWS = [argLow(A, MID), argLow(MID + 1, B)] as const;
const HIGHS = [argHigh(A, MID), argHigh(MID + 1, B)] as const;
/** The three recorded decisions the chips attach to. */
const P = { low: LOWS[0], high: HIGHS[1], consol: Math.floor((LOWS[0] + HIGHS[1]) / 2) };

/**
 * ZigZag — alternating swing highs and lows, a new swing only once price has
 * reversed by at least ZZ_MIN of the chart's whole range. The standard
 * indicator, computed from the series; on this chart it finds 11 turns, from
 * candle 1 to candle 100.
 */
const ZZ_MIN = 0.16;
const ZIGZAG = (() => {
  const lo = Math.min(...D.map((d) => d.l));
  const hi = Math.max(...D.map((d) => d.h));
  const th = ZZ_MIN * (hi - lo);
  const pts: { i: number; key: "h" | "l" }[] = [];
  let mode: "up" | "down" | null = null;
  let ext = 0;
  let hiI = 0;
  let loI = 0;
  D.forEach((d, i) => {
    if (mode === null) {
      if (d.h >= D[hiI].h) hiI = i;
      if (d.l <= D[loI].l) loI = i;
      if (hiI < i && D[hiI].h - d.l >= th) {
        pts.push({ i: hiI, key: "h" });
        mode = "down";
        ext = i;
      } else if (loI < i && d.h - D[loI].l >= th) {
        pts.push({ i: loI, key: "l" });
        mode = "up";
        ext = i;
      }
      return;
    }
    if (mode === "up") {
      if (d.h >= D[ext].h) ext = i;
      else if (D[ext].h - d.l >= th) {
        pts.push({ i: ext, key: "h" });
        mode = "down";
        ext = i;
      }
    } else {
      if (d.l <= D[ext].l) ext = i;
      else if (d.h - D[ext].l >= th) {
        pts.push({ i: ext, key: "l" });
        mode = "up";
        ext = i;
      }
    }
  });
  pts.push({ i: ext, key: mode === "up" ? "h" : "l" });
  return pts;
})();

/**
 * Where the Buy / Sell pills go: "Buy" under a green candle, "Sell" over a red
 * one — the side that won that session. At least LABEL_GAP candles between two
 * pills in the same row so none touch, and none within LABEL_CLEAR candles of
 * the three decision chips, which arrive later on the same beat.
 */
const LABEL_GAP = 7;
const LABEL_CLEAR = 5;
const CANDIDATES = (() => {
  const out: { i: number; buy: boolean }[] = [];
  let lastBuy = -99;
  let lastSell = -99;
  for (let i = A + 2; i <= B - 2; i++) {
    if ([P.low, P.consol, P.high].some((k) => Math.abs(k - i) <= LABEL_CLEAR)) continue;
    const up = D[i].c >= D[i].o;
    if (up && i - lastBuy >= LABEL_GAP) {
      out.push({ i, buy: true });
      lastBuy = i;
    } else if (!up && i - lastSell >= LABEL_GAP) {
      out.push({ i, buy: false });
      lastSell = i;
    }
  }
  return out;
})();

export const Scene03 = ({ geom }: { geom: ContGeom }) => {
  const pal = usePalette();
  const local = useCurrentFrame();
  const { box } = geom;
  const { cx, y, box: sbox, contentOp } = geom.saham;

  const lift = local >= T.lift ? progress(local, T.lift, 30) : 0;
  const draw = local >= T.underline ? progressInOut(local, T.underline, TRIM) : 0;
  const underlineDim = local >= T.question ? progress(local, T.question, 24) : 0;
  /* the zigzag: drawn in from its start, then trimmed away from its start */
  const zIn = local >= T.zigzag ? progressInOut(local, T.zigzag, T.zigzagIn) : 0;
  const zOut = local >= T.zigzagOut ? progressInOut(local, T.zigzagOut, T.zigzagOutDur) : 0;
  const zPts = ZIGZAG.map(({ i, key }) => ({ x: cx(i), y: y(D[i][key]) }));
  const zLen = zPts.slice(1).reduce((sum, q, k) => sum + Math.hypot(q.x - zPts[k].x, q.y - zPts[k].y), 0);
  const questionOp = local >= T.questionOut ? fadeOut(local, T.questionOut, T.questionOutDur) : 1;
  const labelsDim = local >= T.labelsDim ? progress(local, T.labelsDim, T.labelsDimDur) : 0;

  /**
   * ⚠ PILLS CLEAR THE CANDLES AROUND THEM, AND EACH OTHER. A pill is wider
   * than a candle, so it sits beyond the lowest low (Buy) or highest high
   * (Sell) of every candle it spans — not just its own — and any candidate
   * whose box would touch a pill already placed, in either row, is dropped.
   * The first pass put a Buy and a Sell on top of one another where the
   * chart swings hard.
   */
  const labels = (() => {
    const placed: { i: number; buy: boolean; x: number; y: number }[] = [];
    /**
     * ⚠ AND THE THREE DECISION PILLS ARE OBSTACLES TOO, by their real
     * footprint. At +10px bold they are wider than LABEL_CLEAR candles, and
     * "Ragu" landed on a Sell beside it. Width is estimated from the label:
     * ~0.6em a character plus the chip's 20px side padding.
     */
    const chipBox = (label: string, x: number, yy: number) => ({
      x,
      y: yy,
      w: label.length * DECISION_CHIP.size * 0.6 + 40,
      h: DECISION_CHIP.size * 1.25 + 16,
    });
    const blockers = [
      chipBox("Berani masuk", cx(P.low), y(D[P.low].l) + 82),
      chipBox("Ragu", cx(P.consol), y(D[P.consol].c) - 82),
      chipBox("Keluar", cx(P.high), y(D[P.high].h) - 82),
    ];
    const reach = PILL.w / 2;
    for (const { i, buy } of CANDIDATES) {
      const x = cx(i);
      let edge = buy ? -Infinity : Infinity;
      for (let j = A; j <= B; j++) {
        if (Math.abs(cx(j) - x) > reach) continue;
        edge = buy ? Math.max(edge, y(D[j].l)) : Math.min(edge, y(D[j].h));
      }
      const py = buy ? edge + PILL.gap + PILL.h / 2 : edge - PILL.gap - PILL.h / 2;
      const hit =
        placed.some((q) => Math.abs(q.x - x) < PILL.w + 6 && Math.abs(q.y - py) < PILL.h + 6) ||
        blockers.some((b) => Math.abs(b.x - x) < (b.w + PILL.w) / 2 + 6 && Math.abs(b.y - py) < (b.h + PILL.h) / 2 + 6);
      if (!hit) placed.push({ i, buy, x, y: py });
    }
    return placed;
  })();

  /** From the first anchor, through the second, on to the chart's right edge. */
  const trend = ([i, j]: readonly [number, number], key: "l" | "h") => {
    const x1 = cx(i);
    const y1 = y(D[i][key]);
    const x2 = cx(j);
    const y2 = y(D[j][key]);
    const k = (sbox.x + sbox.w - x1) / (x2 - x1);
    return { x1, y1, x2: x1 + (x2 - x1) * k, y2: y1 + (y2 - y1) * k };
  };
  const lines = [trend(LOWS, "l"), trend(HIGHS, "h")];

  return (
    <>
      {/* card behind the chart — lifts one shadow step on the "not just history"
          beat by crossfading the two theme elevations */}
      {([theme.shadow.rest, theme.shadow.lift] as const).map((sh, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: box.x - 60,
            top: box.y - 70,
            width: box.w + 120,
            height: box.h + 150,
            borderRadius: theme.radius.cardLg,
            background: pal.cardBg,
            border: `${theme.stroke.hair}px solid ${pal.border}`,
            boxShadow: sh,
            opacity: i === 0 ? 1 : lift,
            transform: `translateY(${-CARD_LIFT_PX * lift}px)`,
            zIndex: -1,
          }}
        />
      ))}

      {/* ⚠ EVERYTHING BELOW LEAVES WITH THE CANDLES before the handover to
          SC04's BMRI chart — see SahamChart's contentOut. */}
      <div style={{ position: "absolute", inset: 0, opacity: contentOp }}>
        {/* the structure: one line along the lows, one along the highs */}
        {draw > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            {lines.map((t, i) => {
              const len = Math.hypot(t.x2 - t.x1, t.y2 - t.y1);
              return (
                <line
                  key={i}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={pal.indigo}
                  strokeWidth={LINE_W}
                  strokeLinecap="round"
                  strokeDasharray={len}
                  strokeDashoffset={len * (1 - draw)}
                  opacity={0.8 * (1 - 0.6 * underlineDim)}
                />
              );
            })}
          </svg>
        )}

        {/* the zigzag through the chart's swings — in, hold, trimmed out */}
        {zIn > 0.001 && zOut < 0.999 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            <polyline
              points={zPts.map((q) => `${q.x},${q.y}`).join(" ")}
              fill="none"
              stroke={pal.indigo}
              strokeWidth={LINE_W}
              strokeLinecap="round"
              strokeLinejoin="round"
              /* one dash the length of the path and one gap as long: the
                 offset walks the dash in from the start, then walks the start
                 of it off the end — a trim in and a trim out on one line */
              strokeDasharray={`${zLen} ${zLen}`}
              strokeDashoffset={zOut > 0 ? -zLen * zOut : zLen * (1 - zIn)}
            />
          </svg>
        )}
        {/* plain text above the chart, centred on the canvas */}
        <Chip
          label="Apa pesannya?"
          x={theme.canvas.width / 2}
          y={224}
          variant="indigo"
          anchor="center"
          bare
          startFrame={T.question}
          opacity={questionOp}
        />

        {/* every session is a decision someone made — Buy under the sessions
            buyers won, Sell over the ones sellers won */}
        {labels.map(({ i, buy, x, y: py }, k) => {
          const at = T.labels + k * T.labelStep;
          if (local < at) return null;
          const p = progress(local, at, 8);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: py,
                transform: `translate(-50%, -50%) scale(${(0.9 + 0.1 * p).toFixed(3)})`,
                boxSizing: "border-box",
                width: PILL.w,
                height: PILL.h,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                background: buy ? pal.candleGreen : pal.candleRed,
                /* "Text putih" — the card colour, which is white in this palette */
                color: pal.cardBg,
                fontFamily: theme.type.family,
                fontSize: PILL_SIZE,
                fontWeight: 700,
                whiteSpace: "nowrap",
                opacity: p * (1 - 0.7 * labelsDim),
              }}
            >
              {buy ? "Buy" : "Sell"}
            </div>
          );
        })}

        {/* three recorded decisions — chips alternate above/below so none stack */}
        <Ping x={cx(P.low)} y={y(D[P.low].l)} startFrame={T.brave} variant="indigo" />
        <Chip
          label="Berani masuk"
          x={cx(P.low)}
          y={y(D[P.low].l) + 82}
          /* ⚠ A SOLID INDIGO PILL, WHITE TYPE, BOLD, 10px LARGER — Simon:
             "naikin font size nya by 10 px, naikin weight jadi bold, ubah
             style text jadi pill design aja. Backgroundnya indigo, textnya
             putih." Same for all three chips. */
          {...DECISION_CHIP}
          anchor="center"
          startFrame={T.brave + 6}
          connectorTo={{ x: cx(P.low), y: y(D[P.low].l) + 14 }}
        />

        <Ping x={cx(P.consol)} y={y(D[P.consol].c)} startFrame={T.doubt} variant="indigo" />
        <Chip
          label="Ragu"
          x={cx(P.consol)}
          y={y(D[P.consol].c) - 82}
          {...DECISION_CHIP}
          anchor="center"
          startFrame={T.doubt + 6}
          connectorTo={{ x: cx(P.consol), y: y(D[P.consol].c) - 16 }}
        />

        <Ping x={cx(P.high)} y={y(D[P.high].h)} startFrame={T.exit} variant="indigo" />
        <Chip
          label="Keluar"
          x={cx(P.high)}
          y={y(D[P.high].h) - 82}
          {...DECISION_CHIP}
          anchor="center"
          startFrame={T.exit + 6}
          connectorTo={{ x: cx(P.high), y: y(D[P.high].h) - 16 }}
        />
      </div>
    </>
  );
};
