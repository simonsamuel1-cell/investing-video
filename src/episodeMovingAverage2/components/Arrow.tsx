/**
 * Arrow.tsx — slope or direction, and nothing else.
 *
 * It is the episode's ONLY slope indicator: no protractor, no meter, no angle
 * readout. A steep arrow and a flat one are the whole of "semakin curam,
 * semakin kuat".
 *
 * `mirror` draws the same shape with its vertical component flipped about
 * `from`. Scene 09 needs two arrows that cannot possibly differ in opacity,
 * length or stroke — so they come from ONE call site with a sign flip rather
 * than two objects free to drift apart. See the compliance note there.
 */
import { theme } from "../theme";
import { progress, progressInOut } from "../helpers";
import { Layer } from "./ChartFrame";

export const Arrow = ({
  from,
  to,
  f,
  at,
  over = 18,
  tone = theme.colors.indigo,
  width = theme.layout.stroke.ma,
  opacity = 1,
  mirror = false,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  f: number;
  at: number;
  over?: number;
  tone?: string;
  width?: number;
  opacity?: number;
  mirror?: boolean;
}) => {
  if (f < at || opacity <= 0.001) return null;
  const end = mirror ? { x: to.x, y: from.y - (to.y - from.y) } : to;
  const p = progressInOut(f, at, over);
  const len = Math.hypot(end.x - from.x, end.y - from.y) || 1;
  const ux = (end.x - from.x) / len;
  const uy = (end.y - from.y) / len;
  const head = 20;
  const tip = { x: from.x + ux * len * p, y: from.y + uy * len * p };
  /* a round cap runs half its own weight past the endpoint and would bury the
     apex, so the shaft retreats into the head as the head fades up */
  const headIn = progress(f, at + over * 0.7, 8);
  const shaft = {
    x: tip.x - ux * head * 0.85 * headIn,
    y: tip.y - uy * head * 0.85 * headIn,
  };
  const back = { x: -ux * head, y: -uy * head };
  const side = { x: -uy * 11, y: ux * 11 };
  return (
    <Layer opacity={opacity}>
      <line
        x1={from.x}
        y1={from.y}
        x2={shaft.x}
        y2={shaft.y}
        stroke={tone}
        strokeWidth={width}
        strokeLinecap="round"
      />
      {headIn > 0.001 && (
        <polygon
          points={`${tip.x},${tip.y} ${tip.x + back.x + side.x},${tip.y + back.y + side.y} ${tip.x + back.x - side.x},${tip.y + back.y - side.y}`}
          fill={tone}
          opacity={headIn}
        />
      )}
    </Layer>
  );
};
