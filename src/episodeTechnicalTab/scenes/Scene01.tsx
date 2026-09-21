/**
 * Scene 1 (v5) — Problem Setup · 875f · NATIVE.
 * Beat list (Simon, 25 Jun):
 *   0–64    "You found a stock that looks interesting" — centred hero line.
 *   65–230  three "where you heard about it" phone screenshots L→R (hot sector /
 *           word of mouth / watchlist).
 *   237–428 a candlestick chart for the fictional ticker "$ABCD" draws in.
 *   429–723 the six indicators appear ONE BY ONE on the chart: MA5, MA20, then
 *           the RSI / MACD / Stoch-RSI sub-panels, then Parabolic-SAR dots.
 *   724–787 everything clears; ten IDX tickers appear as a 5×2 grid of tags.
 *   788–875 closing cost line "More Time Reading Charts Than Making Decisions."
 *
 * Animation split (build prompt §0): phones, chart and tags = POP / fade; every
 * WORD — the hero, the labels and the closing line = SUBTLE REVEAL.
 */
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { SceneWrap, SHOT_ASPECT, TradingChart } from "../components";
import { COLORS, TYPE, WEIGHT, RADII, BORDER, STROKES } from "../theme";
import { ease, fadeIn, fadeOut, popIn, popLife, textReveal, textLife } from "../helpers";
import { S1_TEN } from "./scene01.data";
import { ASSETS } from "../timeline";

// ─── Opening: three "where you heard about it" phones ────────────────────────
const PHONES = [
  // Image order reshuffled (Simon 26 Jun); labels keep their positions.
  { src: ASSETS.s1WordOfMouth, label: "hot sector", popAt: 65 },
  { src: ASSETS.s1Community, label: "word of mouth", popAt: 118 },
  { src: ASSETS.s1HotSector, label: "watchlist", popAt: 166 },
] as const;
const PHONE = { h: 660, gap: 96, top: 200 } as const;
const PHONE_W = Math.round(PHONE.h * SHOT_ASPECT); // ≈305
const PHONE_BORDER_W = 5; // dark-grey phone-template border
const ROW_W = PHONE_W * 3 + PHONE.gap * 2;
const ROW_X0 = 960 - ROW_W / 2;
const PHONES_OUT = 231;

const PhoneShot = ({
  src,
  label,
  x,
  popAt,
  frame,
}: {
  src: string;
  label: string;
  x: number;
  popAt: number;
  frame: number;
}) => {
  const p = popLife(frame, popAt, PHONES_OUT);
  const t = textLife(frame, popAt + 8, PHONES_OUT, 14, 10);
  return (
    <div style={{ opacity: p.opacity, transform: `scale(${p.scale})`, transformOrigin: "center center" }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: PHONE.top - 48,
          width: PHONE_W,
          textAlign: "center",
          opacity: t.opacity,
          transform: `translateY(${t.ty}px)`,
          fontSize: TYPE.chip,
          fontWeight: WEIGHT.semibold,
          color: COLORS.slate,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          left: x,
          top: PHONE.top,
          width: PHONE_W,
          height: PHONE.h,
          borderRadius: RADII.card,
          border: `${PHONE_BORDER_W}px solid ${COLORS.slate}`, // 5px dark-grey phone border
          backgroundColor: COLORS.surface,
          overflow: "hidden",
          boxShadow: "0 18px 44px rgba(27,29,34,0.10)",
        }}
      >
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );
};

// ─── "Ten stocks to check" — 5×2 grid of IDX ticker tags ─────────────────────
const GRID = { cols: 5, rows: 2, tw: 188, th: 84, gx: 36, gy: 40, inAt: 724 } as const;
const GRID_W = GRID.cols * GRID.tw + (GRID.cols - 1) * GRID.gx;
const GRID_H = GRID.rows * GRID.th + (GRID.rows - 1) * GRID.gy;
const GRID_X0 = 960 - GRID_W / 2;
const GRID_Y0 = 560 - GRID_H / 2; // grid sits lower; closing line goes above it

export const Scene01 = () => {
  const frame = useCurrentFrame();

  // 0–64: opening hero line, then it clears for the phones.
  const hero = textLife(frame, 2, 56, 18, 18);

  // 237–723: the chart establishes, then indicators reveal one-by-one; the
  // whole chart clears at 724 for the ten-stocks grid.
  const chartOpacity = fadeIn(frame, 237, 14) * fadeOut(frame, 724, 16);
  const candleProgress = ease(frame, [245, 360], [0, 1]);
  const reveal = {
    ma5: ease(frame, [432, 468], [0, 1]),
    ma20: ease(frame, [469, 501], [0, 1]),
    rsi: ease(frame, [502, 535], [0, 1]),
    macd: ease(frame, [536, 571], [0, 1]),
    stoch: ease(frame, [572, 602], [0, 1]),
    psar: ease(frame, [603, 652], [0, 1]),
  };

  // 788–875: closing cost line.
  const close = textReveal(frame, 792, 18, 14);
  const gridDim = ease(frame, [792, 820], [1, 0.55]);

  return (
    <SceneWrap>
      {/* 0–64 — opening hero line */}
      <div
        style={{
          position: "absolute",
          left: 960 - 700,
          top: 456,
          width: 1400,
          textAlign: "center",
          opacity: hero.opacity,
          transform: `translateY(${hero.ty}px)`,
          fontSize: TYPE.lead,
          fontWeight: WEIGHT.bold,
          color: COLORS.text,
        }}
      >
        You found a stock that looks interesting
      </div>

      {/* 65–230 — three "where you heard about it" phones, left → right */}
      {PHONES.map((ph, i) => (
        <PhoneShot
          key={ph.label}
          src={ph.src}
          label={ph.label}
          x={ROW_X0 + i * (PHONE_W + PHONE.gap)}
          popAt={ph.popAt}
          frame={frame}
        />
      ))}

      {/* 237–723 — the $ABCD chart + indicators */}
      <AbsoluteFill style={{ opacity: chartOpacity }}>
        <TradingChart candleProgress={candleProgress} reveal={reveal} />
      </AbsoluteFill>

      {/* 724–787 — ten IDX tickers (the workload) */}
      <AbsoluteFill style={{ opacity: gridDim }}>
        {S1_TEN.map((sym, i) => {
          const col = i % GRID.cols;
          const row = Math.floor(i / GRID.cols);
          const p = popIn(frame, GRID.inAt + i * 5);
          return (
            <div
              key={sym}
              style={{
                position: "absolute",
                left: GRID_X0 + col * (GRID.tw + GRID.gx),
                top: GRID_Y0 + row * (GRID.th + GRID.gy),
                width: GRID.tw,
                height: GRID.th,
                opacity: p.opacity,
                transform: `scale(${p.scale})`,
                transformOrigin: "center center",
                borderRadius: RADII.lg,
                border: `${BORDER.regular}px solid ${STROKES.chip}`,
                background: COLORS.surface,
                boxShadow: "0 10px 24px rgba(27,29,34,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: TYPE.title,
                fontWeight: WEIGHT.heavy,
                color: COLORS.text,
                letterSpacing: 1,
              }}
            >
              {sym}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* 788–875 — closing cost line (subtle reveal, ABOVE the ten-stocks grid) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 372,
          textAlign: "center",
          opacity: close.opacity,
          transform: `translateY(${close.ty}px)`,
          fontSize: TYPE.headline,
          fontWeight: WEIGHT.bold,
          color: COLORS.text,
        }}
      >
        More time reading charts than{" "}
        <span style={{ color: COLORS.primary }}>making decisions.</span>
      </div>
    </SceneWrap>
  );
};
