/**
 * MALine.tsx — one moving average, traced.
 *
 * THE COLOUR BINDING IS FIXED FOR THE WHOLE EPISODE and must never swap: the
 * SLOW average is indigo, the FAST one is cyan. Scene 12A's voice-over calls
 * the slow line "garis ungu" — the purple line — so at that point the binding
 * is not a style choice, it is a caption the viewer is asked to follow.
 */
import React from "react";
import { theme } from "../theme";
import { drawPath } from "../helpers";
import { Layer, pathOf, lengthOf, type Grid } from "./ChartFrame";

export const MALine = ({
  values,
  grid,
  f,
  drawFrom,
  drawDur,
  variant,
  opacity = 1,
  width = theme.shape.ma,
  tone,
  glow = 0,
}: {
  values: (number | null)[];
  grid: Grid;
  f: number;
  drawFrom: number;
  drawDur: number;
  variant: "fast" | "slow";
  opacity?: number;
  width?: number;
  /** Overrides the fast/slow binding. Use only where a scene says why. */
  tone?: string;
  /** 0 → 1. A soft wide pass under the line, so it reads as lit. */
  glow?: number;
}) => {
  /* the guard every animated path needs — see §2.8 */
  if (f < drawFrom || opacity <= 0.001) return null;
  const stroke = tone ?? (variant === "fast" ? theme.color.cyan : theme.color.indigo);
  /** Unique per instance, so two lit lines cannot share one filter. */
  const id = React.useId().replace(/:/g, "");
  return (
    <Layer opacity={opacity}>
      {/*
        A GENUINE BLUR, not a wide stroke.
        A second copy of the path at four times the weight has a hard edge of
        its own, so it reads as an outline drawn around the line rather than as
        light coming off it. Running that copy through feGaussianBlur is what
        makes it a glow: no edge survives, and the falloff is what the eye
        reads as brightness. The filter region is oversized because a blur
        spreads past the geometry and would otherwise be clipped square.
      */}
      {glow > 0.001 && (
        <>
          <defs>
            <filter id={`glow${id}`} x="-25%" y="-40%" width="150%" height="180%">
              <feGaussianBlur stdDeviation={width * 1.9} />
            </filter>
          </defs>
          <path
            d={pathOf(values, grid)}
            fill="none"
            stroke={stroke}
            strokeWidth={width * 2.1}
            strokeOpacity={0.85 * glow}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#glow${id})`}
            {...drawPath(f, drawFrom, drawDur, lengthOf(values, grid))}
          />
        </>
      )}
      <path
        d={pathOf(values, grid)}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...drawPath(f, drawFrom, drawDur, lengthOf(values, grid))}
      />
    </Layer>
  );
};
