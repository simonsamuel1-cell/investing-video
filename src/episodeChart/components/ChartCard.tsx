/**
 * ChartCard — the ONE CHART SURFACE governing device. A single chart card that
 * persists across the whole episode and transforms rather than cuts. Draws the
 * shared chrome (card panel, header row with title left + "Illustration" chip
 * right, clear of the top-right logo zone) and exposes the chart content area as
 * children. Every scene reuses this grammar — one card, ten states.
 *
 * Geometry: active area 1728×918 at (96,54); card inset 16px → (112,70) 1696×886,
 * 24px radius, 1px neutral border. Header row 96px. Bottom 108px stays empty for
 * subtitles.
 */
import React from "react";
import { theme } from "../theme";

export const CARD = { x: 112, y: 70, w: 1696, h: 886 };
export const HEADER_H = 96;
// Chart content area (below the header row), with a small inner inset.
export const CHART = { x: CARD.x + 32, y: CARD.y + HEADER_H, w: CARD.w - 64, h: CARD.h - HEADER_H - 24 };

export const ChartCard = ({ title, chip = "Illustration", children }: { title: string; chip?: string | null; children?: React.ReactNode }) => (
  <>
    {/* card panel */}
    <div
      style={{
        position: "absolute",
        left: CARD.x,
        top: CARD.y,
        width: CARD.w,
        height: CARD.h,
        background: theme.colors.neutralFill,
        border: `${theme.stroke.hairline}px solid ${theme.colors.neutralLine}`,
        borderRadius: theme.radius.panel,
        boxSizing: "border-box",
      }}
    />
    {/* header title (left) */}
    <div
      style={{
        position: "absolute",
        left: CARD.x + 32,
        top: CARD.y + 26,
        fontFamily: theme.type.family,
        fontSize: theme.type.header.size,
        fontWeight: theme.type.header.weight,
        color: theme.colors.ink,
      }}
    >
      {title}
    </div>
    {/* "Illustration" chip (right, kept clear of the 360×150 logo zone at x≥1560) */}
    {chip && (
      <div
        style={{
          position: "absolute",
          left: 1540 - 190,
          width: 190,
          top: CARD.y + 34,
          textAlign: "right",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: theme.radius.chip,
            background: theme.colors.indigoTint,
            color: theme.colors.indigo,
            fontFamily: theme.type.family,
            fontSize: 26,
            fontWeight: 600,
          }}
        >
          {chip}
        </span>
      </div>
    )}
    {children}
  </>
);
