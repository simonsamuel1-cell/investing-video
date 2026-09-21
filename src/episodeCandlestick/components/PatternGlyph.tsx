/**
 * PatternGlyph — miniature candle glyph for 12 named patterns.
 * The four STUDIED patterns (hammer, shootingStar, bullishEngulfing,
 * bearishEngulfing) are built from their REAL §6 session data, so their
 * optional intraday path lines are accurate in miniature. Other patterns are
 * abstract shapes (no path line).
 */
import { theme } from "../theme";
import { Candle } from "./Candle";

export type PatternName =
  | "hammer"
  | "shootingStar"
  | "bullishEngulfing"
  | "bearishEngulfing"
  | "doji"
  | "morningStar"
  | "eveningStar"
  | "harami"
  | "marubozu"
  | "hangingMan"
  | "piercingLine"
  | "tweezerTop"
  | "invertedHammer"
  | "threeWhiteSoldiers"
  | "darkCloudCover"
  | "threeBlackCrows"
  | "spinningTop"
  | "gravestoneDoji";

type G = { o: number; h: number; l: number; c: number };
type Def = { candles: G[]; paths?: [number, number][][] }; // paths: per-candle [t, price]

const DEFS: Record<PatternName, Def> = {
  hammer: {
    candles: [{ o: 1412, h: 1428, l: 1246, c: 1418 }],
    paths: [[[0, 1412], [0.05, 1428], [0.16, 1372], [0.3, 1310], [0.45, 1246], [0.56, 1288], [0.72, 1348], [0.88, 1398], [1, 1418]]],
  },
  shootingStar: {
    candles: [{ o: 1252, h: 1436, l: 1244, c: 1258 }],
    paths: [[[0, 1252], [0.05, 1244], [0.16, 1298], [0.3, 1362], [0.45, 1436], [0.56, 1392], [0.72, 1330], [0.88, 1281], [1, 1258]]],
  },
  bullishEngulfing: {
    candles: [
      { o: 1386, h: 1394, l: 1298, c: 1306 },
      { o: 1288, h: 1412, l: 1281, c: 1402 },
    ],
    paths: [
      [[0, 1386], [0.1, 1394], [0.3, 1362], [0.55, 1334], [0.8, 1312], [0.9, 1298], [1, 1306]],
      [[0, 1288], [0.08, 1281], [0.2, 1304], [0.4, 1338], [0.6, 1366], [0.8, 1390], [0.94, 1412], [1, 1402]],
    ],
  },
  bearishEngulfing: {
    candles: [
      { o: 1296, h: 1392, l: 1288, c: 1384 },
      { o: 1402, h: 1410, l: 1272, c: 1281 },
    ],
    paths: [
      [[0, 1296], [0.1, 1288], [0.3, 1322], [0.55, 1352], [0.8, 1376], [0.92, 1392], [1, 1384]],
      [[0, 1402], [0.06, 1410], [0.2, 1378], [0.4, 1344], [0.6, 1312], [0.8, 1288], [0.9, 1272], [1, 1281]],
    ],
  },
  doji: { candles: [{ o: 0.5, h: 0.85, l: 0.15, c: 0.52 }] },
  morningStar: {
    candles: [
      { o: 0.85, h: 0.9, l: 0.48, c: 0.52 },
      { o: 0.4, h: 0.5, l: 0.28, c: 0.36 },
      { o: 0.46, h: 0.88, l: 0.42, c: 0.82 },
    ],
  },
  eveningStar: {
    candles: [
      { o: 0.15, h: 0.52, l: 0.1, c: 0.48 },
      { o: 0.6, h: 0.72, l: 0.5, c: 0.66 },
      { o: 0.54, h: 0.58, l: 0.12, c: 0.18 },
    ],
  },
  harami: {
    candles: [
      { o: 0.85, h: 0.92, l: 0.18, c: 0.24 },
      { o: 0.42, h: 0.62, l: 0.36, c: 0.56 },
    ],
  },
  marubozu: { candles: [{ o: 0.1, h: 0.9, l: 0.1, c: 0.9 }] },
  hangingMan: { candles: [{ o: 0.82, h: 0.88, l: 0.08, c: 0.76 }] },
  piercingLine: {
    candles: [
      { o: 0.85, h: 0.9, l: 0.38, c: 0.44 },
      { o: 0.28, h: 0.72, l: 0.24, c: 0.66 },
    ],
  },
  tweezerTop: {
    candles: [
      { o: 0.4, h: 0.9, l: 0.34, c: 0.82 },
      { o: 0.8, h: 0.9, l: 0.3, c: 0.38 },
    ],
  },
  invertedHammer: { candles: [{ o: 0.28, h: 0.9, l: 0.22, c: 0.4 }] },
  threeWhiteSoldiers: {
    candles: [
      { o: 0.12, h: 0.42, l: 0.08, c: 0.38 },
      { o: 0.32, h: 0.62, l: 0.28, c: 0.58 },
      { o: 0.52, h: 0.82, l: 0.48, c: 0.78 },
    ],
  },
  darkCloudCover: {
    candles: [
      { o: 0.28, h: 0.72, l: 0.24, c: 0.68 },
      { o: 0.82, h: 0.86, l: 0.4, c: 0.46 },
    ],
  },
  threeBlackCrows: {
    candles: [
      { o: 0.88, h: 0.92, l: 0.58, c: 0.62 },
      { o: 0.66, h: 0.7, l: 0.36, c: 0.4 },
      { o: 0.44, h: 0.48, l: 0.14, c: 0.18 },
    ],
  },
  spinningTop: { candles: [{ o: 0.44, h: 0.86, l: 0.14, c: 0.56 }] },
  gravestoneDoji: { candles: [{ o: 0.22, h: 0.9, l: 0.18, c: 0.24 }] },
};

export const PatternGlyph = ({
  pattern,
  cx,
  top,
  size,
  showPathLine = false,
  pathLineOpacity = 0.35,
  outlineOpacity = 1,
}: {
  pattern: PatternName;
  cx: number; // canvas center x
  top: number; // canvas top y
  size: number;
  showPathLine?: boolean;
  pathLineOpacity?: number;
  outlineOpacity?: number;
}) => {
  const def = DEFS[pattern];
  const all = [
    ...def.candles.flatMap((g) => [g.h, g.l]),
    ...(def.paths ?? []).flat().map(([, p]) => p),
  ];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = Math.max(1e-6, max - min);
  const yOf = (p: number) => size * (0.06 + 0.88 * (1 - (p - min) / span));

  const n = def.candles.length;
  const centers = n === 1 ? [0.5] : n === 2 ? [0.32, 0.68] : [0.2, 0.5, 0.8];
  const bw = size * (n === 1 ? 0.26 : n === 2 ? 0.2 : 0.15);

  return (
    <svg
      style={{ position: "absolute", left: cx - size / 2, top, overflow: "visible" }}
      width={size}
      height={size}
    >
      <g opacity={outlineOpacity}>
        {def.candles.map((g, i) => (
          <Candle key={i} x={size * centers[i]} width={bw} open={g.o} high={g.h} low={g.l} close={g.c} scale={yOf} />
        ))}
      </g>
      {/* Path line — one CONNECTED polyline across every candle band (two-candle
          patterns previously drew two disconnected segments). */}
      {showPathLine && def.paths && (
        <polyline
          points={def.paths
            .flatMap((path, i) => {
              const bandX = size * centers[i] - bw * 0.95;
              const bandW = bw * 1.9;
              return path.map(([t, p]) => `${bandX + bandW * t},${yOf(p)}`);
            })
            .join(" ")}
          fill="none"
          stroke={theme.colors.indigo}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={pathLineOpacity}
        />
      )}
    </svg>
  );
};
