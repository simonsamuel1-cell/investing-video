/**
 * LiveCandle — a daily candle driven live by an intraday path + progress.
 * OHLC derives from pathOHLC (open fixed at path[0]; high/low/close from the
 * path so far). Body color flips green/red live as price crosses the open.
 * Render INSIDE a parent <svg>.
 */
import type { SessionPoint } from "../helpers";
import { pathOHLC } from "../helpers";
import { Candle } from "./Candle";

export const LiveCandle = ({
  path,
  progress,
  x,
  width,
  scale,
  dim = false,
  wickStroke,
  opacity = 1,
}: {
  path: SessionPoint[];
  progress: number; // 0–1 session time
  x: number; // center x
  width: number;
  scale: (price: number) => number;
  dim?: boolean;
  wickStroke?: string;
  opacity?: number;
}) => {
  const { open, high, low, close } = pathOHLC(path, progress);
  return (
    <Candle x={x} width={width} open={open} high={high} low={low} close={close} scale={scale} dim={dim} wickStroke={wickStroke} opacity={opacity} />
  );
};
