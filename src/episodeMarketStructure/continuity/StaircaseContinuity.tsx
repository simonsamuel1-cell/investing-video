/**
 * SC05 + SC06 — ONE staircase, two scenes (global 1965 → 3042).
 *
 * These are mounted as a single spanning Sequence rather than two scenes,
 * because the script's own sentence runs across the boundary ("…naik lagi. |
 * Coba pakai angka.") and the picture must not remount underneath it. Nothing
 * about the line changes at local frame 513: SC06 only adds an axis, the
 * numbers, and the guide under the lows.
 *
 * The prices ARE the narrated ones — UPTREND's pivots 1–4 are 5.000 / 4.600 /
 * 5.400 / 4.900 — so SC06's tags are read off the shape instead of typed beside
 * it. Move a pivot and the tag moves with it.
 *
 * Frames below are LOCAL to this Sequence. SC05's doc beats are unchanged;
 * SC06's are its doc beat + 513.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { PriceLine } from "../components/PriceLine";
import { PivotMarker } from "../components/PivotMarker";
import { Chip } from "../components/Chip";
import { Header } from "../components/Header";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { fadeIn, fadeOut, progress, linear, fmtPrice } from "../helpers";
import { UPTREND, UP_PEAKS, UP_TROUGHS, geom } from "../data/structures";
import { CARD, PLOT } from "../layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Local frame where SC06 begins (global 2478). */
const PHASE = 513;

const T = {
  // ── SC05 ──
  title: 0, // "uptrend"
  hh: 61, // "puncak terbentuk lebih tinggi"
  hl: 151, // "lembah juga berhenti lebih tinggi"
  shorten: 227, // "higher high dan higher low"
  breath: 300, // "penurunan kecil"
  breathChip: 421, // "mengambil napas"
  // ── SC06 ──
  axis: PHASE + 20,
  n1: PHASE + 54, // "5.000"
  n2: PHASE + 100, // "4.600"
  n3: PHASE + 162, // "5.400"
  n4: PHASE + 251, // "4.900"
  compare: PHASE + 386, // "sama-sama makin tinggi"
  guide: PHASE + 443, // "pola ini terjaga"
};
/** The line traces itself over these frames — linear, so arcAt maps cleanly. */
const DRAW = { from: 0, dur: 200 };
const BOX = { x: PLOT.x, y: PLOT.y + 40, w: PLOT.w, h: PLOT.h - 110 };
/** The pullback re-framed as a pause: peak 3 → trough 4. */
const BREATH: [number, number] = [0.45, 0.59];
const AXIS_TICKS = [4400, 4800, 5200, 5600];
/** How far right of a pivot the delta riser is drawn — clear of its price chip. */
const DELTA_DX = 116;
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(UPTREND, BOX, { pad: 0.12 });
/** The frame the trim path actually reaches `t` — labels never precede the line. */
const reach = (t: number) => DRAW.from + G.arcAt(t) * DRAW.dur + 6;
const at = (i: number) => G.pivot(i);

export const StaircaseContinuity = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  const draw = linear(f, DRAW.from, DRAW.dur);
  const shorten = f >= T.shorten ? progress(f, T.shorten, 14) : 0;
  const breath = f >= T.breath ? progress(f, T.breath, 26) : 0;
  // SC06 takes the pivots over: the names step aside for the numbers.
  const named = f >= PHASE ? fadeOut(f, PHASE, 30) : 1;
  const axis = f >= T.axis ? fadeIn(f, T.axis, 26) : 0;
  const compare = f >= T.compare ? progress(f, T.compare, 30) : 0;
  const guide = f >= T.guide ? progress(f, T.guide, 44) : 0;

  const p1 = at(1);
  const p2 = at(2);
  const p3 = at(3);
  const p4 = at(4);
  const guideA = at(2);
  const guideB = at(6);

  return (
    <SafeArea>
      <Header title="Uptrend" startFrame={T.title} />

      <ChartCard box={CARD}>
        {/* SC06's light y-axis. It arrives with the numbers, not before them. */}
        {axis > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height} opacity={axis}>
            {AXIS_TICKS.map((p) => (
              <g key={p}>
                <line x1={BOX.x} y1={G.y(p)} x2={BOX.x + BOX.w} y2={G.y(p)} stroke={pal.border} strokeWidth={theme.stroke.hair} />
                <text x={BOX.x + BOX.w + 14} y={G.y(p) + 8} fontFamily={theme.type.family} fontSize={theme.type.axis.size} fontWeight={theme.type.axis.weight} fill={pal.slate}>
                  {fmtPrice(p)}
                </text>
              </g>
            ))}
          </svg>
        )}

        {/* the pullback, re-framed: a pause inside the climb, not a warning */}
        {breath > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            <rect
              x={G.x(BREATH[0])}
              y={at(3).y - 24}
              width={(G.x(BREATH[1]) - G.x(BREATH[0])) * breath}
              height={at(4).y - at(3).y + 48}
              rx={theme.radius.chip}
              fill={pal.indigoTint14}
            />
          </svg>
        )}

        <PriceLine g={G} draw={draw} color={pal.ink} width={3} head />

        {/* Every peak is a higher high, every trough a higher low. The first of
            each is named in full; the rest carry the short form. On "higher high
            dan higher low" the full labels hand over to the short ones too. */}
        {UP_PEAKS.map((pi, k) => {
          const p = at(pi);
          const start = Math.max(T.hh + k * 40, reach(UPTREND.pivots[pi].t));
          return (
            <React.Fragment key={`hh${pi}`}>
              {k === 0 && <PivotMarker x={p.x} y={p.y} label="Higher High" variant="indigo" startFrame={start} opacity={(1 - shorten) * named} />}
              <PivotMarker
                x={p.x}
                y={p.y}
                label="HH"
                variant="indigo"
                startFrame={k === 0 ? T.shorten : start}
                opacity={(k === 0 ? shorten : 1) * named}
              />
            </React.Fragment>
          );
        })}
        {UP_TROUGHS.map((pi, k) => {
          const p = at(pi);
          const start = Math.max(T.hl + k * 40, reach(UPTREND.pivots[pi].t));
          return (
            <React.Fragment key={`hl${pi}`}>
              {k === 0 && <PivotMarker x={p.x} y={p.y} label="Higher Low" variant="cyan" side="below" startFrame={start} opacity={(1 - shorten) * named} />}
              <PivotMarker
                x={p.x}
                y={p.y}
                label="HL"
                variant="cyan"
                side="below"
                startFrame={k === 0 ? T.shorten : start}
                opacity={(k === 0 ? shorten : 1) * named}
              />
            </React.Fragment>
          );
        })}

        {/* clears the peak's own chip, which sits 34px above the pivot */}
        {breath > 0.5 && <Chip label="Ambil Napas" x={(G.x(BREATH[0]) + G.x(BREATH[1])) / 2} y={at(3).y - 116} variant="indigo" startFrame={T.breathChip} />}

        {/* ── SC06: the same four turns, now as numbers ── */}
        {f >= PHASE && (
          <>
            <Chip label={fmtPrice(5000)} x={p1.x} y={p1.y - 40} variant="indigo" startFrame={T.n1} />
            <Chip label={fmtPrice(4600)} x={p2.x} y={p2.y + 40} variant="cyan" startFrame={T.n2} />
            <Chip label={fmtPrice(5400)} x={p3.x} y={p3.y - 40} variant="indigo" startFrame={T.n3} />
            <Chip label={fmtPrice(4900)} x={p4.x} y={p4.y + 40} variant="cyan" startFrame={T.n4} />
          </>
        )}

        {/* 4.900 sits above 4.600, and 5.400 above 5.000 — shown, not claimed.
            The riser is offset past the price chip so the two never overlap. */}
        {compare > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height} opacity={compare}>
            {[
              [p1, p3],
              [p2, p4],
            ].map(([a, b], i) => {
              const rx = b.x + DELTA_DX;
              return (
                <g key={i}>
                  <line x1={a.x} y1={a.y} x2={rx} y2={a.y} stroke={pal.slate} strokeWidth={theme.stroke.hair} strokeDasharray="10 8" />
                  <line x1={rx} y1={a.y} x2={rx} y2={b.y} stroke={pal.indigo} strokeWidth={theme.stroke.rule} />
                  <polygon points={`${rx},${b.y} ${rx - 8},${b.y + 14} ${rx + 8},${b.y + 14}`} fill={pal.indigo} />
                </g>
              );
            })}
          </svg>
        )}

        {/* the guide under the lows — the pattern, as one straight idea */}
        {guide > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            <line
              x1={guideA.x}
              y1={guideA.y + 18}
              x2={guideA.x + (guideB.x - guideA.x) * guide}
              y2={guideA.y + 18 + (guideB.y - guideA.y) * guide}
              stroke={pal.indigo}
              strokeWidth={theme.stroke.rule}
              strokeLinecap="round"
              opacity={0.85}
            />
          </svg>
        )}
        {guide > 0.2 && <Chip label="Tren: Naik" x={CARD.x + 56} y={CARD.y + 56} variant="indigo" anchor="left" startFrame={T.guide + 10} />}
      </ChartCard>
    </SafeArea>
  );
};
