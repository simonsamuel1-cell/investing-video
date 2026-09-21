/**
 * CaseStudyScene — the shared SC09–SC12 choreography (the "Hammer" design).
 * A session plays in the two-panel SessionView (single-day or two-day); an
 * optional wick measure highlights the signature wick; then at `collapse` the
 * candle panel shrinks 30% and slides left while the intraday half + price axis
 * fade, and a tall crowded ContextStrip opens beside it — the finished pattern
 * docks inline at its support/resistance level with a label above it.
 * Each scene supplies only its data + timings; the layout/animation is fixed.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { SafeArea } from "./SafeArea";
import { SessionView, sessionGeom } from "./SessionView";
import { ContextStrip } from "./ContextStrip";
import { IllustrationTag } from "./IllustrationTag";
import { theme } from "../theme";
import { sec, fadeIn, clampProgress, progress as easedProgress, progress, textReveal, priceScale } from "../helpers";
import type { OHLC, SessionPoint } from "../helpers";

// ── Fixed layout (identical to SC09) ────────────────────────────────────────
const SV_X = 96;
const SV_Y = 240;
const SV_W = 1536;
const SV_H = 440;
const CTX_GEOM = sessionGeom({ x: SV_X, width: SV_W, panelGap: 20, centered: true, centerNudge: 30 });
const COLLAPSE_SCALE = 0.7;
const COLLAPSE_DX = SV_X - CTX_GEOM.rightX;
const MOVED_LEFT = SV_X - 20 + CTX_GEOM.centerOffset;
const MOVED_W = (CTX_GEOM.rightW + 40) * COLLAPSE_SCALE;
const MOVED_RIGHT = MOVED_LEFT + MOVED_W;
const MOVED_TOP = SV_Y - 20;
const CTX_X = MOVED_RIGHT + 20;
const CTX_Y = MOVED_TOP;
const CTX_H = 900 - CTX_Y;
const CTX_W = 1650 - CTX_X;
const CTX_GAP = 20;
const TICK_HALF = 8;

// Right (context) panel rect — exported so a static end-card can overlay/empty it.
export const CTX_RECT = { x: CTX_X, y: CTX_Y, w: CTX_W, h: CTX_H };

export type CaseStudyTimings = {
  header: number;
  svIn: number;
  // single-day play
  playFrom?: number;
  playDur?: number;
  // two-day play
  day1From?: number;
  day1Dur?: number;
  reset?: number;
  day2From?: number;
  day2Dur?: number;
  close: number;
  // optional wick highlight
  wickHi?: number;
  wickHiDraw?: number;
  // collapse + context
  collapse: number;
  collapseDur: number;
  ctxLine: number;
  dock: number;
  dockDur: number;
  label: number;
};

export type CaseStudyConfig = {
  path: SessionPoint[];
  day2Path?: SessionPoint[];
  pingT?: number; // single-day ping fraction (fires at this session-time)
  wickStroke?: string; // finished-candle wick highlight color (e.g. cyan)
  lateWickStroke?: string; // recolor from wickHi (e.g. green/red)
  // wick measure annotation (topPrice = higher price, lowPrice = lower price)
  highlight?: { topPrice: number; lowPrice: number; label: string; candleFrac?: number };
  contextData: OHLC[];
  refLine: { price: number; label: string; position: "below" | "above" };
  dockCandles: OHLC[];
  dockLabel: string[];
  dockDY?: number; // vertical nudge for the docked candle(s)
  T: CaseStudyTimings;
};

export const CaseStudyScene = ({ config: c }: { config: CaseStudyConfig }) => {
  const f = useCurrentFrame();
  const twoDay = !!c.day2Path;

  const day1Progress = twoDay ? clampProgress(f, sec(c.T.day1From!), sec(c.T.day1Dur!)) : 0;
  const day2Progress = twoDay ? clampProgress(f, sec(c.T.day2From!), sec(c.T.day2Dur!)) : 0;
  const sessionProgress = twoDay ? day1Progress : clampProgress(f, sec(c.T.playFrom!), sec(c.T.playDur!));
  const dockProgress = easedProgress(f, sec(c.T.dock), sec(c.T.dockDur));

  // Collapse choreography (identity before `collapse`).
  const collapseP = f >= sec(c.T.collapse) ? easedProgress(f, sec(c.T.collapse), sec(c.T.collapseDur)) : 0;
  const intradayOpacity = 1 - collapseP;
  const axisOpacity = 1 - collapseP;
  const rightScale = 1 - collapseP * (1 - COLLAPSE_SCALE);
  const rightDX = collapseP * COLLAPSE_DX;

  const hasHighlight = !!c.highlight && c.T.wickHi !== undefined;
  const pingOpacity = hasHighlight ? 1 - progress(f, sec(c.T.wickHi!), sec(0.4)) : 1;

  // Wick measure annotation.
  let wickHiNode: React.ReactNode = null;
  if (hasHighlight) {
    const showWickHi = f >= sec(c.T.wickHi!) && f < sec(c.T.collapse);
    const allP = (twoDay ? [c.path, c.day2Path!] : [c.path]).flat().map((p) => p.price);
    const SCALE = priceScale(Math.min(...allP), Math.max(...allP), SV_Y, SV_Y + SV_H - 72, 0.1);
    const cx = CTX_GEOM.rightX + CTX_GEOM.rightW * (c.highlight!.candleFrac ?? 0.5) + CTX_GEOM.centerOffset;
    const topY = SCALE(c.highlight!.topPrice);
    const lowY = SCALE(c.highlight!.lowPrice);
    const measureP = progress(f, sec(c.T.wickHi!), sec(c.T.wickHiDraw ?? 0.6));
    const measureEnd = topY + (lowY - topY) * measureP;
    const wickLabel = textReveal(f, sec(c.T.wickHi!) + 6);
    const MX = cx + 55;
    if (showWickHi) {
      wickHiNode = (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            <g stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard}>
              <line x1={MX} y1={topY} x2={MX} y2={measureEnd} />
              <line x1={MX - TICK_HALF} y1={topY} x2={MX + TICK_HALF} y2={topY} />
              <line x1={MX - TICK_HALF} y1={measureEnd} x2={MX + TICK_HALF} y2={measureEnd} />
            </g>
          </svg>
          <div
            style={{
              position: "absolute",
              left: MX + 20,
              top: (topY + lowY) / 2,
              fontSize: theme.type.body.size,
              fontWeight: theme.type.body.weight,
              color: theme.colors.ink,
              whiteSpace: "nowrap",
              opacity: wickLabel.opacity,
              transform: `translateY(calc(-50% + ${wickLabel.y}px))`,
            }}
          >
            {c.highlight!.label}
          </div>
        </>
      );
    }
  }

  return (
    <SafeArea>
      <SessionView
        path={c.path}
        progress={sessionProgress}
        day2Path={c.day2Path}
        day2Progress={twoDay ? day2Progress : undefined}
        resetFrame={twoDay ? sec(c.T.reset!) : undefined}
        day1DimStrength={0}
        x={SV_X}
        y={SV_Y}
        width={SV_W}
        height={SV_H}
        pingT={c.pingT}
        pingStartFrame={c.pingT !== undefined ? sec((c.T.playFrom ?? 0) + c.pingT * (c.T.playDur ?? 0)) : undefined}
        closeFrame={sec(c.T.close)}
        wickStroke={c.wickStroke}
        wickStrokeFrame={c.wickStroke ? sec(c.T.close) : undefined}
        lateWickStroke={c.lateWickStroke}
        lateWickStrokeFrame={c.T.wickHi !== undefined ? sec(c.T.wickHi) : undefined}
        pingOpacity={pingOpacity}
        opacity={fadeIn(f, sec(c.T.svIn))}
        centered
        centerNudge={30}
        panelGap={20}
        timeFontSize={30}
        intradayOpacity={intradayOpacity}
        axisOpacity={axisOpacity}
        rightScale={rightScale}
        rightDX={rightDX}
      />

      {wickHiNode}

      <ContextStrip
        data={c.contextData}
        refLine={c.refLine}
        dockCandles={c.dockCandles}
        dockProgress={dockProgress}
        dockInline
        dockDY={c.dockDY}
        dockLabel={{ lines: c.dockLabel, startFrame: sec(c.T.label), below: c.refLine.position === "above" }}
        revealFrame={sec(c.T.collapse)}
        lineFrame={sec(c.T.ctxLine)}
        x={CTX_X}
        y={CTX_Y}
        width={CTX_W}
        height={CTX_H}
        candleGap={CTX_GAP}
      />

      <IllustrationTag />
    </SafeArea>
  );
};
