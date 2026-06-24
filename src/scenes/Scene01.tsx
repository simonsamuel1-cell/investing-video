/**
 * Scene 1 (v2) — Thematic Blindness. 875f. NATIVE.
 * Three siloed "trader" columns (JPFA / CPIN / MAIN), each drowning in the same
 * six indicator-name chips. The silos never connect — that fragmentation is the
 * point. Ghost columns tile in to imply "ten stocks to check." Zero figures,
 * zero price data. Sets up the Scene 2 turn.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components";
import { COLORS, TYPE, WEIGHT, RADII, BORDER, STROKES } from "../theme";
import { fadeIn, ease, popIn, mulberry32 } from "../helpers";
import { TICKERS, INDICATOR_NOISE } from "./scene01.data";

const COL_CX = [380, 960, 1540];
const COL_W = 470;
const COL_TOP = 150;
const COL_H = 690;

const Chip = ({ label, x, y, at, frame }: { label: string; x: number; y: number; at: number; frame: number }) => {
  const p = popIn(frame, at);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: COL_W - 80,
        opacity: p.opacity,
        transform: `scale(${p.scale})`,
        transformOrigin: "center center",
        padding: "12px 18px",
        borderRadius: RADII.chip,
        border: `${BORDER.thin}px solid ${STROKES.chip}`,
        background: COLORS.surface,
        color: COLORS.text,
        fontSize: TYPE.label,
        fontWeight: WEIGHT.semibold,
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(27,29,34,0.05)",
      }}
    >
      {label}
    </div>
  );
};

const TraderColumn = ({ cx, symbol, trader, enterAt, frame }: { cx: number; symbol: string; trader: string; enterAt: number; frame: number }) => {
  const op = fadeIn(frame, enterAt, 22);
  const ty = ease(frame, [enterAt, enterAt + 26], [28, 0]);
  const chipX = cx - (COL_W - 80) / 2;
  return (
    <div style={{ opacity: op, transform: `translateY(${ty}px)` }}>
      {/* silo zone */}
      <div
        style={{
          position: "absolute",
          left: cx - COL_W / 2,
          top: COL_TOP,
          width: COL_W,
          height: COL_H,
          borderRadius: RADII.panel,
          border: `${BORDER.thin}px solid ${COLORS.hairline}`,
          background: COLORS.scrim,
        }}
      />
      {/* ticker card */}
      <div
        style={{
          position: "absolute",
          left: cx - 150,
          top: COL_TOP + 26,
          width: 300,
          padding: "16px 0",
          borderRadius: RADII.lg,
          border: `${BORDER.regular}px solid ${STROKES.chip}`,
          background: COLORS.surface,
          textAlign: "center",
          boxShadow: "0 12px 28px rgba(27,29,34,0.07)",
        }}
      >
        <div style={{ fontSize: TYPE.title, fontWeight: WEIGHT.heavy, color: COLORS.text, letterSpacing: 1 }}>{symbol}</div>
        <div style={{ fontSize: TYPE.micro, fontWeight: WEIGHT.medium, color: COLORS.slate, marginTop: 4 }}>{trader}</div>
      </div>
      {/* indicator-name chips crowd in */}
      {INDICATOR_NOISE.map((name, i) => (
        <Chip key={name} label={name} x={chipX} y={COL_TOP + 196 + i * 74} at={210 + i * 28} frame={frame} />
      ))}
    </div>
  );
};

export const Scene01 = () => {
  const frame = useCurrentFrame();
  const rnd = mulberry32(91);
  // deterministic ghost columns implying "ten stocks"
  const ghosts = Array.from({ length: 8 }).map(() => ({
    x: 96 + rnd() * 1560,
    flip: rnd() > 0.5,
  }));
  const ghostOp = fadeIn(frame, 600, 60) * 0.12;
  const closeP = popIn(frame, 760);
  const clusterDim = frame > 700 ? ease(frame, [700, 760], [1, 0.6]) : 1;

  return (
    <SceneWrap>
      <div style={{ position: "absolute", left: 96, top: 64, fontSize: TYPE.title, fontWeight: WEIGHT.bold, color: COLORS.text }}>
        Three Traders. Three Stocks.
      </div>

      {/* ghost columns (behind) */}
      <AbsoluteFill style={{ opacity: ghostOp }}>
        {ghosts.map((g, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: g.x,
              top: COL_TOP + (g.flip ? 30 : 0),
              width: COL_W - 90,
              height: COL_H - 60,
              borderRadius: RADII.panel,
              border: `${BORDER.thin}px solid ${COLORS.primary}`,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* three real silos */}
      <AbsoluteFill style={{ opacity: clusterDim }}>
        {TICKERS.map((t, i) => (
          <TraderColumn key={t.symbol} cx={COL_CX[i]} symbol={t.symbol} trader={t.trader} enterAt={i * 70} frame={frame} />
        ))}
      </AbsoluteFill>

      {/* closing strip — plants the Scene 2 turn */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 882,
          textAlign: "center",
          opacity: closeP.opacity,
          transform: `scale(${closeP.scale})`,
          transformOrigin: "center center",
          fontSize: TYPE.headline,
          fontWeight: WEIGHT.bold,
          color: COLORS.text,
        }}
      >
        Three Ideas — Or One Theme They All Missed?
      </div>
    </SceneWrap>
  );
};
