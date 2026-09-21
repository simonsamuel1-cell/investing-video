/**
 * Callout — the standard annotation pattern: an optional indigo (2px) highlight
 * box over a phone region, a 1px cyan leader line, and a labelled chip. The chip
 * pops in (scale 0→1.05→1); the leader draws after the chip is ~80% opaque.
 *
 * Coordinates are full 1920×1080 space. `accent` tints the chip border
 * (primary=indigo for support/entry reads, secondary=cyan for resistance/exit).
 */
import { useCurrentFrame } from "remotion";
import type { ReactNode } from "react";
import { COLORS, RADII, TYPE, WEIGHT, BORDER } from "../theme";
import { fadeIn, lin, popIn } from "../helpers";

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

const CHIP_H = 62;

export const Callout = ({
  chip,
  label,
  box,
  badge,
  accent = "secondary",
  delay = 0,
}: {
  chip: ChipPos;
  label: ReactNode;
  box?: Box;
  badge?: ReactNode;
  accent?: "primary" | "secondary";
  delay?: number;
}) => {
  const frame = useCurrentFrame();
  const accentColor = accent === "primary" ? COLORS.primary : COLORS.secondary;
  const accentFill = accent === "primary" ? COLORS.primaryWash : COLORS.secondaryWash;

  const boxOp = box ? fadeIn(frame, delay, 8) : 0;
  const boxScale = box ? lin(frame, [delay, delay + 10], [1.06, 1]) : 1;

  // chip pop
  const chip3 = popIn(frame, delay + 8);

  // leader (only when a box anchors it)
  const x1 = box ? box.x + box.w : 0;
  const y1 = box ? box.y + box.h / 2 : 0;
  const x2 = chip.x;
  const y2 = chip.y + CHIP_H / 2;
  const len = box ? Math.hypot(x2 - x1, y2 - y1) : 0;
  const drawT = lin(frame, [delay + 14, delay + 28], [0, 1]);
  const lineOp = box ? fadeIn(frame, delay + 14, 6) : 0;

  return (
    <>
      {box && (
        <div
          style={{
            position: "absolute",
            left: box.x,
            top: box.y,
            width: box.w,
            height: box.h,
            borderRadius: RADII.md,
            border: `${BORDER.regular}px solid ${COLORS.primary}`,
            background: COLORS.primaryWash,
            opacity: boxOp,
            transform: `scale(${boxScale})`,
            boxShadow: "0 0 0 4px rgba(95,77,238,0.08)",
          }}
        />
      )}

      {box && (
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
            stroke={COLORS.secondary}
            strokeWidth={1.5}
            strokeDasharray={len}
            strokeDashoffset={len * (1 - drawT)}
          />
          <circle cx={x1} cy={y1} r={4} fill={COLORS.primary} />
          <circle cx={x2} cy={y2} r={4} fill={COLORS.secondary} opacity={drawT} />
        </svg>
      )}

      <div
        style={{
          position: "absolute",
          left: chip.x,
          top: chip.y,
          width: chip.w,
          minHeight: CHIP_H,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 26px",
          borderRadius: RADII.chip,
          border: `${BORDER.regular}px solid ${accentColor}`,
          background: accentFill,
          color: COLORS.text,
          fontSize: TYPE.chip,
          fontWeight: WEIGHT.semibold,
          lineHeight: 1.25,
          opacity: chip3.opacity,
          transform: `scale(${chip3.scale})`,
          transformOrigin: "left center",
          boxShadow: "0 8px 22px rgba(27,29,34,0.06)",
        }}
      >
        {badge !== undefined && (
          <span
            style={{
              flex: "0 0 auto",
              minWidth: 34,
              height: 34,
              borderRadius: 9,
              background: accentColor,
              color: COLORS.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: TYPE.label,
              fontWeight: WEIGHT.heavy,
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
