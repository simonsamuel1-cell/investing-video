/**
 * ThemeStocksDiagram — one reusable diagram for S6–S9 (spec §7). A theme node at
 * top with lines fanning to a row of stock chips that pulse together.
 *
 * ⚠️ Explicitly ILLUSTRATIVE — must never be styled to look like a real app
 * screen, and uses generic role labels (no fabricated tickers, §2/§9).
 *
 * Modes:
 *  • highlightStagger — chips light in sequence on cue (S7).
 *  • showReverseX     — emphasise theme→stocks direction and X-out the reverse (S9).
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { ReactNode } from "react";
import { COLORS, RADII, USABLE } from "../theme";
import { fadeIn, ease, springUp, pulse } from "../util/anim";

const NODE = { w: 420, h: 104, top: 224 };
const CHIPS_TOP = 694;
const CHIP_H = 80;
const SPAN = { x0: 230, x1: 1690 };

export const ThemeStocksDiagram = ({
  nodeLabel,
  nodeIcon,
  chips,
  accent = COLORS.purple,
  highlightStagger = false,
  showReverseX = false,
}: {
  nodeLabel: ReactNode;
  nodeIcon?: ReactNode;
  chips: string[];
  accent?: string;
  highlightStagger?: boolean;
  showReverseX?: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cx = USABLE.cx;
  const nodeLeft = cx - NODE.w / 2;
  const nodeBottom = NODE.top + NODE.h;

  const n = chips.length;
  const centers = chips.map((_, i) => SPAN.x0 + ((SPAN.x1 - SPAN.x0) * (i + 0.5)) / n);
  const chipW = Math.min((SPAN.x1 - SPAN.x0) / n - 24, 230);

  const nodeS = springUp(frame, fps, 4);
  const lineFade = (i: number) => fadeIn(frame, 16 + i * 4, 10);
  const lineDraw = (i: number) => ease(frame, [16 + i * 4, 30 + i * 4], [0, 1]);

  return (
    <>
      {/* fan lines + direction emphasis */}
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        {centers.map((c, i) => {
          const len = Math.hypot(c - cx, CHIPS_TOP - nodeBottom);
          return (
            <line
              key={i}
              x1={cx}
              y1={nodeBottom}
              x2={c}
              y2={CHIPS_TOP}
              stroke={showReverseX ? COLORS.hairline : COLORS.cyan}
              strokeWidth={2}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - lineDraw(i))}
              opacity={lineFade(i) * (showReverseX ? 0.6 : 1)}
            />
          );
        })}

        {showReverseX && <ReverseFlow cx={cx} top={nodeBottom + 70} />}
      </svg>

      {/* theme node */}
      <div
        style={{
          position: "absolute",
          left: nodeLeft,
          top: NODE.top,
          width: NODE.w,
          height: NODE.h,
          borderRadius: RADII.card,
          background: accent,
          color: COLORS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: -0.4,
          boxShadow: "0 18px 40px rgba(70,54,184,0.28)",
          opacity: fadeIn(frame, 4, 10),
          transform: `scale(${0.94 + 0.06 * nodeS})`,
        }}
      >
        {nodeIcon}
        {nodeLabel}
      </div>

      {/* stock chips */}
      {chips.map((label, i) => {
        const appear = 22 + i * 5;
        const op = fadeIn(frame, appear, 10);
        const grow = springUp(frame, fps, appear);
        const beat = pulse(frame, 1, 1.05, 70); // synchronised — "move together"
        const lit = highlightStagger ? fadeIn(frame, 60 + i * 14, 8) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: centers[i] - chipW / 2,
              top: CHIPS_TOP,
              width: chipW,
              height: CHIP_H,
              borderRadius: RADII.chip,
              border: `2px solid ${COLORS.cyan}`,
              background: COLORS.white,
              color: COLORS.black,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 14px",
              fontSize: 26,
              fontWeight: 600,
              lineHeight: 1.15,
              opacity: op,
              transform: `scale(${(0.9 + 0.1 * grow) * beat})`,
              boxShadow: `0 8px 20px rgba(0,0,0,0.06), 0 0 0 ${6 * lit}px rgba(92,200,227,${0.25 * lit})`,
            }}
          >
            {label}
          </div>
        );
      })}
    </>
  );
};

/** S9: a down arrow (theme→stocks, valid) and an up arrow (reverse) X-ed out. */
const ReverseFlow = ({ cx, top }: { cx: number; top: number }) => {
  const frame = useCurrentFrame();
  const downOp = fadeIn(frame, 30, 12);
  const upOp = fadeIn(frame, 70, 10);
  const xT = ease(frame, [92, 112], [0, 1]);
  const dx = 70; // horizontal offset between the two arrows
  const h = 150;
  return (
    <g>
      {/* valid: down arrow */}
      <g opacity={downOp}>
        <line x1={cx - dx} y1={top} x2={cx - dx} y2={top + h} stroke={COLORS.purple} strokeWidth={6} />
        <polygon
          points={`${cx - dx - 14},${top + h - 18} ${cx - dx + 14},${top + h - 18} ${cx - dx},${top + h + 6}`}
          fill={COLORS.purple}
        />
      </g>
      {/* invalid: up arrow, X-ed */}
      <g opacity={upOp}>
        <line x1={cx + dx} y1={top + h} x2={cx + dx} y2={top} stroke={COLORS.ink} strokeWidth={6} opacity={0.55} />
        <polygon
          points={`${cx + dx - 14},${top + 18} ${cx + dx + 14},${top + 18} ${cx + dx},${top - 6}`}
          fill={COLORS.ink}
          opacity={0.55}
        />
        <line
          x1={cx + dx - 34}
          y1={top + h / 2 - 34}
          x2={cx + dx + 34}
          y2={top + h / 2 + 34}
          stroke={COLORS.ink}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={96}
          strokeDashoffset={96 * (1 - xT)}
        />
        <line
          x1={cx + dx + 34}
          y1={top + h / 2 - 34}
          x2={cx + dx - 34}
          y2={top + h / 2 + 34}
          stroke={COLORS.ink}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={96}
          strokeDashoffset={96 * (1 - xT)}
        />
      </g>
    </g>
  );
};
