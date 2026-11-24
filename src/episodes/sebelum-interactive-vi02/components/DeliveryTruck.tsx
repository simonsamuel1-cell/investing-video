/**
 * VI02 SC07's truck: Simon's Freepik file in natural colours, split into layers on one frame by scripts/vi/vi02-truck-layers.py. Its
 * box is shut at `solid` 1 and see-through at 0, to the products always inside it. It stands still and the road runs under it:
 * its wheels turn on `f`, and `RoadScenery` slides past behind it.
 */
import type React from "react";
import { Img, staticFile } from "remotion";
import { theme } from "../../../core";
import { MONO } from "./kit";

const C = theme.color;
const ART = { w: 590, h: 355, x: 90, y: 80, midX: 292, midY: 188.5, goods: 10 };
const WHEEL = { at: [166.5, 302.5, 449.5], y: 390, rx: 11, ry: 18, spokes: 3, turn: 0.14, line: 2.6 };
const BOB = [{ size: 1.2, rate: 0.21 }, { size: 0.6, rate: 0.53 }];

const Layer = ({ name, opacity = 1 }: { name: string; opacity?: number }) => (
  <Img src={staticFile(`art/vi02/truck/${name}.svg`)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", opacity }} />
);

/** The truck, its middle on (`cx`, `cy`). */
export const DeliveryTruck = ({ cx, cy, w, f, solid }: { cx: number; cy: number; w: number; f: number; solid: number }) => {
  const k = w / ART.w;
  const bob = BOB.reduce((a, b) => a + b.size * Math.sin(f * b.rate), 0);
  return (
    <div style={{ position: "absolute", left: cx - ART.midX * k, top: cy - ART.midY * k + bob, width: w, height: ART.h * k, filter: MONO }}>
      <Layer name="under" />
      <Layer name="glass" />
      {Array.from({ length: ART.goods }, (_, i) => <Layer key={i} name={`good-${i}`} />)}
      <Layer name="sheen" />
      <Layer name="solid" opacity={solid} />
      <Layer name="over" />
      <svg viewBox={`${ART.x} ${ART.y} ${ART.w} ${ART.h}`} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
        {WHEEL.at.flatMap((x) =>
          Array.from({ length: WHEEL.spokes }, (_, i) => {
            const a = f * WHEEL.turn + (i * 2 * Math.PI) / WHEEL.spokes;
            return <line key={`${x}-${i}`} x1={x + 0.4 * WHEEL.rx * Math.cos(a)} y1={WHEEL.y + 0.4 * WHEEL.ry * Math.sin(a)} x2={x + WHEEL.rx * Math.cos(a)} y2={WHEEL.y + WHEEL.ry * Math.sin(a)} stroke={C.newsInk} strokeWidth={WHEEL.line} strokeLinecap="round" />;
          }),
        )}
      </svg>
    </div>
  );
};

// the layers, far to near: each runs at its own speed and repeats at its own width
const ROAD = { top: 530, lane: 596, dash: 130, gap: 120, line: 12, speed: 7, shadow: 572, shadowW: 760, shadowH: 22 };
const CLOUDS = { speed: 0.35, period: 1800, at: [{ x: 260, y: 226, s: 0.9 }, { x: 1240, y: 196, s: 0.7 }] };
const HILLS = { speed: 0.8, period: 1800, at: [{ x: 420, rx: 640, ry: 92 }, { x: 1400, rx: 520, ry: 64 }] };
const TREES = { speed: 3.4, period: 1320, at: [{ x: 120, s: 0.9 }, { x: 640, s: 1.1 }, { x: 1010, s: 0.8 }] };

const Running = ({ f, w, speed, period, children }: { f: number; w: number; speed: number; period: number; children: (x: number) => React.ReactNode }) => {
  const shift = (f * speed) % period;
  return <>{Array.from({ length: Math.ceil(w / period) + 2 }, (_, i) => <g key={i}>{children((i - 1) * period - shift)}</g>)}</>;
};

/** One low hillside and a road with nothing on it but its lane line, all grey, running past behind the truck, on the card's own white. */
export const RoadScenery = ({ f, w, h }: { f: number; w: number; h: number }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: theme.shape.cardRadius }}>
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      <Running f={f} w={w} speed={CLOUDS.speed} period={CLOUDS.period}>
        {(x) => CLOUDS.at.map((c) => (
          <g key={c.x} transform={`translate(${x + c.x} ${c.y}) scale(${c.s})`} fill={C.neutralDisc}>
            <rect x={-110} y={-22} width={220} height={44} rx={22} />
            <circle cx={-34} cy={-26} r={36} />
            <circle cx={30} cy={-34} r={46} />
          </g>
        ))}
      </Running>
      <Running f={f} w={w} speed={HILLS.speed} period={HILLS.period}>
        {(x) => HILLS.at.map((a) => <ellipse key={a.x} cx={x + a.x} cy={ROAD.top} rx={a.rx} ry={a.ry} fill={C.neutralDisc} />)}
      </Running>
      <Running f={f} w={w} speed={TREES.speed} period={TREES.period}>
        {(x) => TREES.at.map((t) => (
          <g key={t.x} transform={`translate(${x + t.x} ${ROAD.top}) scale(${t.s})`}>
            <rect x={-7} y={-70} width={14} height={72} rx={5} fill={C.mute} />
            <rect x={-46} y={-190} width={92} height={140} rx={46} fill={C.connectorMuteSolid} />
          </g>
        ))}
      </Running>
      <rect x={0} y={ROAD.top} width={w} height={h - ROAD.top} fill={C.connectorMuteSolid} />
      <Running f={f} w={w} speed={ROAD.speed} period={ROAD.dash + ROAD.gap}>
        {(x) => <rect x={x} y={ROAD.lane} width={ROAD.dash} height={ROAD.line} rx={ROAD.line / 2} fill={C.neutralDisc} />}
      </Running>
      <ellipse cx={w / 2} cy={ROAD.shadow} rx={ROAD.shadowW / 2} ry={ROAD.shadowH / 2} fill={C.mute} />
    </svg>
  </div>
);
