import { random } from "remotion";
import { usePalette } from "../../../core";

/**
 * VI03 SC07 "Harga turun": a made-up candlestick run in the shape of Simon's reference (18 Nov: "ganti jadi chart di gambar 2
 * aja, tapi pastikan turunnya 50% dari harga tertinggi. Buat chartnya yang estetik dan detail") — a long quiet base, a slow
 * climb, a parabolic run to the top, a choppy top, then the fall. The highest price is exactly 100 and the last close exactly
 * 50: down 50 % from the top. No ticker, no figures on screen; deterministic (Remotion's seeded random).
 */
export type Candle = { o: number; h: number; l: number; c: number };

/** 64 candles: wide enough bodies to read as a real chart at card size */
const N = 64;
/** the close path, in price units (the top is 100): a quiet base that still breathes, a slow climb, the run, the top, the fall */
const path = (i: number) => {
  if (i < 26) return 20 + 1.5 * Math.sin(i / 3.2) + 0.08 * i;
  if (i < 40) return 22 + 8 * ((i - 26) / 14) ** 1.3;
  if (i < 52) return 30 + 64 * ((i - 40) / 12) ** 2.1;
  if (i < 57) return [94, 90, 97, 92, 95][i - 52];
  if (i < 62) return [80, 70, 61, 55, 51.5][i - 57];
  return [52.5, 50][i - 62];
};

const build = (): Candle[] => {
  const out: Candle[] = [];
  let prev = path(0);
  for (let i = 0; i < N; i++) {
    const noise = (s: string, a: number) => (random(`run-${s}-${i}`) - 0.5) * 2 * a;
    const level = path(i);
    const vol = i < 26 ? 2.6 : i < 40 ? 2.8 : i < 52 ? 2.6 + level * 0.04 : 4.5;
    const o = prev + noise("gap", vol * 0.25);
    const c = i === N - 1 ? 50 : level + noise("c", vol * 0.6);
    const h = Math.max(o, c) + Math.abs(noise("h", vol * 0.9)) + vol * 0.15;
    const l = Math.min(o, c) - Math.abs(noise("l", vol * 0.9)) - vol * 0.15;
    out.push({ o, h, l, c });
    prev = c;
  }
  // the top is exactly 100: the highest high, on the strongest top candle; nothing else reaches it
  const top = out.reduce((b, k, i) => (k.h > out[b].h ? i : b), 0);
  const k = 100 / out[top].h;
  for (const q of out) {
    q.o *= k;
    q.h *= k;
    q.l *= k;
    q.c *= k;
  }
  // and the last close exactly 50 (its candle's range kept around it)
  const last = out[N - 1];
  last.c = 50;
  last.l = Math.min(last.l, 49.2);
  last.h = Math.max(last.h, last.o, 50);
  return out;
};

/** the first 20 candles (most of the quiet base) left out (Simon 18 Nov: "hapus 20 candles dari paling kiri"): 44 shown */
export const RUN: Candle[] = build().slice(20);
export const RUN_TOP = { i: RUN.reduce((b, k, i) => (k.h > RUN[b].h ? i : b), 0), price: 100 };
export const RUN_LAST = { i: RUN.length - 1, price: 50 };
export const RUN_LOW = Math.min(...RUN.map((k) => k.l));

/**
 * The chart in a box (its own px): candle i at x + (i + 0.5) · pitch, prices from `lo` (bottom) to 100 (top). `upto` is how many
 * candles show (fractional: the next one grows in).
 */
export const runX = (box: { x: number; w: number }, i: number) => box.x + (i + 0.5) * (box.w / RUN.length);
export const runY = (box: { y: number; h: number }, price: number, lo = RUN_LOW * 0.92) => box.y + box.h - ((price - lo) / (100 - lo)) * box.h;

export const CandleRun = ({ box, upto }: { box: { x: number; y: number; w: number; h: number }; upto: number }) => {
  const c = usePalette();
  const pitch = box.w / RUN.length;
  const body = pitch * 0.62;
  return (
    <g>
      {RUN.map((k, i) => {
        const grow = Math.max(0, Math.min(1, upto - i));
        if (grow <= 0) return null;
        const up = k.c >= k.o;
        const tone = up ? c.candleGreen : c.candleRed;
        const x = runX(box, i);
        const yo = runY(box, k.o);
        const yc = runY(box, k.c);
        const mid = (yo + yc) / 2;
        const top = Math.min(yo, yc);
        const bh = Math.max(1.6, Math.abs(yc - yo));
        // a candle grows from its middle as it comes in
        return (
          <g key={i} opacity={grow} transform={`translate(0 ${mid * (1 - grow)}) scale(1 ${grow})`}>
            <line x1={x} y1={runY(box, k.h)} x2={x} y2={runY(box, k.l)} stroke={tone} strokeWidth={Math.max(1.5, pitch * 0.14)} strokeLinecap="round" />
            <rect x={x - body / 2} y={top} width={body} height={bh} rx={Math.min(1.5, body / 4)} fill={tone} />
          </g>
        );
      })}
    </g>
  );
};
