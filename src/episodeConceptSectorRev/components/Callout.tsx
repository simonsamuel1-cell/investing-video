/**
 * Callout — the standard Layout-B pattern (§4): a purple (2px) rounded highlight
 * box over a region of the phone, a thin 1px cyan leader line, and a cyan
 * labelled chip in the right zone. Box → leader → chip reveal in sequence.
 *
 * Coordinates are in full 1920×1080 space. The box rect over the phone depends
 * on the rendered clip, so each Layout-B scene defines its boxes as labelled
 * TODO constants to be tuned in `remotion studio`.
 */
import { useCurrentFrame } from "remotion";
import type { ReactNode } from "react";
import { COLORS, RADII } from "../theme";
import { fadeIn, ease } from "../util/anim";

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface ChipPos {
  x: number;
  y: number;
  w?: number;
}

const CHIP_H = 60;

export const Callout = ({
  box,
  chip,
  label,
  badge,
  delay = 0,
}: {
  box: Box;
  chip: ChipPos;
  label: ReactNode;
  badge?: ReactNode;
  delay?: number;
}) => {
  const frame = useCurrentFrame();

  // Box: fade + slight scale settle.
  const boxOp = fadeIn(frame, delay, 8);
  const boxScale = ease(frame, [delay, delay + 10], [1.06, 1]);

  // Leader: draw from box edge to chip edge.
  const x1 = box.x + box.w;
  const y1 = box.y + box.h / 2;
  const x2 = chip.x;
  const y2 = chip.y + CHIP_H / 2;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const drawT = ease(frame, [delay + 4, delay + 18], [0, 1]);
  const lineOp = fadeIn(frame, delay + 4, 6);

  // Chip.
  const chipOp = fadeIn(frame, delay + 10, 10);
  const chipTy = ease(frame, [delay + 10, delay + 24], [12, 0]);

  return (
    <>
      {/* purple highlight box on the phone */}
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          borderRadius: 12,
          border: `2px solid ${COLORS.purple}`,
          background: COLORS.purpleWash,
          opacity: boxOp,
          transform: `scale(${boxScale})`,
          boxShadow: "0 0 0 4px rgba(95,77,238,0.08)",
        }}
      />

      {/* leader line */}
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          overflow: "visible",
          pointerEvents: "none",
          opacity: lineOp,
        }}
      >
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={COLORS.cyan}
          strokeWidth={1.5}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - drawT)}
        />
        <circle cx={x1} cy={y1} r={4} fill={COLORS.purple} />
        <circle cx={x2} cy={y2} r={4} fill={COLORS.cyan} opacity={drawT} />
      </svg>

      {/* cyan labelled chip in the right zone */}
      <div
        style={{
          position: "absolute",
          left: chip.x,
          top: chip.y,
          width: chip.w,
          height: CHIP_H,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 22px",
          borderRadius: RADII.chip,
          border: `1.5px solid ${COLORS.cyan}`,
          background: COLORS.cyanWash,
          color: COLORS.black,
          fontSize: 30,
          fontWeight: 600,
          opacity: chipOp,
          transform: `translateY(${chipTy}px)`,
          boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
        }}
      >
        {badge !== undefined && (
          <span
            style={{
              flex: "0 0 auto",
              minWidth: 32,
              height: 32,
              borderRadius: 9,
              background: COLORS.cyan,
              color: COLORS.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 19,
              fontWeight: 800,
            }}
          >
            {badge}
          </span>
        )}
        <span>{label}</span>
      </div>
    </>
  );
};
