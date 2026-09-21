/**
 * RateChart — Rate-decision pair, Scenes 4–5 (comp 638–1075), mounted once as one
 * spanning sequence. TWO stacked STOCK A price lines on ONE shared time axis +
 * ONE Decision Day marker, answering: does price move when the rate is cut?
 *   Line A (top, cyan) — Expected = Actual: flat THROUGH the cut (already priced in).
 *   Line B (bottom, indigo) — Expected ≠ Actual: flat, then JUMPS at the cut.
 * Same event, same start price, same scale — the only variable is expectation.
 * Focus crosses over: Scene 4 top-bright / bottom-dim; Scene 5 top-dim / bottom-bright.
 * Illustrative data — fictional STOCK A, plausible −25 bps cut. NOT live BI-Rate.
 * Frame = group-local (0 at comp 638).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, Chip, Illustration } from "../components";
import { theme } from "../theme";
import { fadeIn, clamp01, textReveal, fmtRp } from "../helpers";

const c = theme.colors;
const w = theme.font.weights;
const F = theme.font.family;

// ── onsets (group-local frames; comp = 638 + local) ─────────────────────────
// Line A (cyan)
const A_DRAW = 0; //     638 — solid trims in D-4 → Decision Day
const A_DRAW_END = 72; // 710
const A_EXT = 107; //    745 — dashed extends to D+1
const A_EXT_END = 154; // 792
const MARK = 90; //      728 — Decision Day marker + CUT burst
const FLATA = 135; //    773 — "no move" resolution
// focus crossover + Line B (indigo)
const SHIFT = 250; //    888 — top dims to 20%, bottom brightens
const B_DRAW = 250; //   888 — indigo trims in D-4 → Decision Day
const B_DRAW_END = 318; //956
const B_JUMP = 325; //   963 — moves up + extends to D+1
const B_JUMP_END = 352; //990
const CONTRAST = 360; //1000 — contrast bracket
const CHIP5 = 376; //   1014 — "The Surprise Is The Trade"

// ── geometry: two stacked bands, shared axis + scale ────────────────────────
const AX_L = 150;
const AX_R = 1780;
const TOP = { top: 180, bottom: 430 };
const BOT = { top: 510, bottom: 760 };
const P_MIN = 3950;
const P_MAX = 4400;
const DAYS = ["D-4", "D-3", "D-2", "D-1", "Decision Day", "D+1"];
const DEC = 4;
const tx = (i: number) => AX_L + ((AX_R - AX_L) * i) / (DAYS.length - 1);
const py = (p: number, band: { top: number; bottom: number }) => band.bottom - ((band.bottom - band.top) * (p - P_MIN)) / (P_MAX - P_MIN);

const A = [4000, 4000, 4000, 4000, 4010, 4005]; // Expected = Actual → flat
const B_FLAT = [4000, 4000, 4000, 4000, 4000]; // dormant (solid part)

const solidPath = (pts: number[], band: { top: number; bottom: number }) => "M" + [0, 1, 2, 3, 4].map((i) => `${tx(i)},${py(pts[i], band)}`).join(" L");

export const RateChart = () => {
  const f = useCurrentFrame();

  // focus crossover
  const shift = clamp01((f - SHIFT) / 40);
  const topOp = 1 - 0.8 * shift; // 1 → 0.2
  const botOp = 0.2 + 0.8 * shift; // 0.2 → 1

  // Line A
  const aReveal = clamp01((f - A_DRAW) / (A_DRAW_END - A_DRAW));
  const aExt = clamp01((f - A_EXT) / (A_EXT_END - A_EXT));
  // Line B
  const brightB = fadeIn(f, B_DRAW, 20);
  const bReveal = clamp01((f - B_DRAW) / (B_DRAW_END - B_DRAW));
  const jumpB = clamp01((f - B_JUMP) / (B_JUMP_END - B_JUMP));
  const decB = 4000 + 320 * jumpB;
  const dp1B = 4000 + 350 * jumpB;
  const bSolid = [4000, 4000, 4000, 4000, decB];

  const noMove = fadeIn(f, FLATA, 14);
  const contrastOp = fadeIn(f, CONTRAST, 16);
  const surprise = textReveal(f, CHIP5, 16);
  const cutPulse = 1 + Math.sin(clamp01((f - MARK) / 12) * Math.PI) * 0.06;

  return (
    <SafeArea>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* vertical day gridlines across both charts */}
        {DAYS.map((d, i) => (
          <line key={`g${d}`} x1={tx(i)} x2={tx(i)} y1={TOP.top - 10} y2={BOT.bottom} stroke={i === DEC ? "transparent" : c.hairline} strokeWidth={1} />
        ))}
        {/* lower baseline (shared axis for day labels) */}
        <line x1={AX_L} x2={AX_R} y1={BOT.bottom} y2={BOT.bottom} stroke={c.line} strokeWidth={2} />
        {DAYS.map((d, i) => (
          <text key={`t${d}`} x={tx(i)} y={BOT.bottom + 40} textAnchor="middle" fontSize={i === DEC ? 26 : 22} fontWeight={i === DEC ? 800 : 600} fill={i === DEC ? c.indigo : c.grey} fontFamily={F}>
            {d}
          </text>
        ))}

        {/* shared Decision Day marker (crosses both charts) */}
        {f >= MARK && (
          <line x1={tx(DEC)} x2={tx(DEC)} y1={TOP.top - 12} y2={BOT.bottom} stroke={c.indigo} strokeWidth={2.5} strokeDasharray="5 6" opacity={0.6} />
        )}

        {/* Line A (top) — Expected = Actual, flat through the cut */}
        <g opacity={topOp}>
          <path d={solidPath(A, TOP)} fill="none" stroke={c.cyan} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - aReveal} />
          {f >= A_EXT && (
            <line x1={tx(DEC)} y1={py(A[DEC], TOP)} x2={tx(DEC) + (tx(5) - tx(DEC)) * aExt} y2={py(A[5], TOP)} stroke={c.cyan} strokeWidth={4} strokeDasharray="6 7" strokeLinecap="round" />
          )}
        </g>

        {/* Line B (bottom) — dormant grey → active indigo that draws then jumps */}
        <g opacity={botOp}>
          <path d={solidPath(B_FLAT, BOT)} fill="none" stroke={c.greyLight} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - aReveal} opacity={1 - brightB} />
          {brightB > 0.01 && (
            <>
              <path d={solidPath(bSolid, BOT)} fill="none" stroke={c.indigo} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - bReveal} opacity={brightB} />
              {f >= B_JUMP && (
                <line x1={tx(DEC)} y1={py(decB, BOT)} x2={tx(DEC) + (tx(5) - tx(DEC)) * jumpB} y2={py(dp1B, BOT)} stroke={c.indigo} strokeWidth={4} strokeDasharray="6 7" strokeLinecap="round" opacity={brightB} />
              )}
              {jumpB > 0.4 && <circle cx={tx(DEC)} cy={py(decB, BOT)} r={11} fill={c.indigo} opacity={brightB} />}
            </>
          )}
        </g>

        {/* contrast bracket (far right): A ends low, B ends high */}
        {contrastOp > 0.01 && (
          <g opacity={contrastOp} stroke={c.text} strokeWidth={5} fill="none">
            <path d={`M${tx(5) - 4},${py(A[5], TOP)} h18 v${py(dp1B, BOT) - py(A[5], TOP)} h-18`} />
          </g>
        )}
      </svg>

      {/* STOCK A caption — present from the group start (comp 638) */}
      <div style={{ position: "absolute", left: 150, top: 140, fontSize: 30, fontWeight: w.semibold, color: c.grey, fontFamily: F, opacity: 1 }}>
        STOCK A · {fmtRp(4000)} · same start
      </div>

      {/* top group caption */}
      <div style={{ position: "absolute", left: 150, top: 196, fontSize: 40, fontWeight: w.extrabold, color: c.text, fontFamily: F, opacity: fadeIn(f, A_DRAW, 14) * topOp }}>
        Expected <span style={{ color: c.cyan }}>=</span> Actual
      </div>
      <div style={{ position: "absolute", left: 1210, top: 250, width: 560, fontSize: 38, fontWeight: w.bold, color: c.text, lineHeight: 1.1, fontFamily: F, opacity: noMove * topOp }}>
        Already priced in → <span style={{ color: c.cyan }}>no move</span>
      </div>

      {/* bottom group caption + setup tag */}
      <div style={{ position: "absolute", left: 150, top: 522, fontSize: 40, fontWeight: w.extrabold, color: c.text, fontFamily: F, opacity: fadeIn(f, A_DRAW, 14) * botOp }}>
        Expected <span style={{ color: c.indigo }}>≠</span> Actual
      </div>

      {/* CUT label — 10px under "Decision Day", indigo text, no fill */}
      {f >= MARK && (
        <div style={{ position: "absolute", left: tx(DEC) - 280, top: 816, width: 560, textAlign: "center", opacity: fadeIn(f, MARK, 12), transform: `scale(${cutPulse})` }}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap", color: c.indigo, fontSize: 26, fontWeight: w.extrabold, fontFamily: F }}>
            BI cut rate 6.25% → 6%
          </span>
        </div>
      )}

      {/* payoff chip (Scene 5) — centred in the frame */}
      <div style={{ position: "absolute", left: 0, top: 448, width: 1920, display: "flex", justifyContent: "center", ...surprise }}>
        <Chip label="The Surprise Is The Trade" tone="indigo" active dot fontSize={30} />
      </div>

      <Illustration op={fadeIn(f, A_DRAW, 16)} x={96} y={930} />
    </SafeArea>
  );
};
