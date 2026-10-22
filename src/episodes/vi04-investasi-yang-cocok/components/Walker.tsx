/**
 * Walker.tsx — the VI04 stickman, able to WALK (Simon, 19 Oct: "kamu tuh bisa buat dia animasi jalan ga?").
 * Same look as the standing one in Islands.tsx (his reference: white inside, an even dark outline), but built
 * from separate parts so each can swing.
 *
 * How the outline stays clean: the whole figure is drawn twice — first every part wide in ink, then every part
 * narrower in white — so all parts merge into ONE silhouette with the outline only round the outside (Simon,
 * 19 Oct: an outline across the body where a limb crosses it looked "ngga merge ke badannya").
 *
 *   side   a profile walk cycle: thighs swing ±26°, the knee bends as the leg comes through, arms swing
 *          opposite, the body bobs twice per cycle.
 *   front  facing the viewer: feet lift in turn, arms swing a little, the body bobs and sways.
 */
import { useCurrentFrame } from "remotion";
import { useMotion, usePalette } from "../../../core";

type Seg = [number, number, number, number];
const STROKE = { limb: 16, outline: 5 };
/** In profile, arms and legs are as wide as the body (Simon, 19 Oct). */
const SIDE_W = 22;

/** One group of capsules (and an optional body box), outlined as a single silhouette. */
const Silhouette = ({ segs, box, head, limbW = STROKE.limb }: { segs: Seg[]; box?: { x: number; y: number; w: number; h: number; r: number }; head?: { x: number; y: number; r: number }; limbW?: number }) => {
  const c = usePalette();
  const o = STROKE.outline;
  const line = (s: Seg, w: number, color: string, k: string) => <line key={k} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} stroke={color} strokeWidth={w} strokeLinecap="round" />;
  return (
    <>
      {box ? <rect x={box.x - o} y={box.y - o} width={box.w + 2 * o} height={box.h + 2 * o} rx={box.r + o} fill={c.ink} /> : null}
      {segs.map((s, i) => line(s, limbW + 2 * o, c.ink, `o${i}`))}
      {head ? <circle cx={head.x} cy={head.y} r={head.r + o} fill={c.ink} /> : null}
      {box ? <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={box.r} fill={c.cardBg} /> : null}
      {segs.map((s, i) => line(s, limbW, c.cardBg, `i${i}`))}
      {head ? <circle cx={head.x} cy={head.y} r={head.r} fill={c.cardBg} /> : null}
    </>
  );
};

const rad = (d: number) => (d * Math.PI) / 180;
/** A two-bone limb hanging from (x, y): upper angle `a`, lower bent by `b` (degrees, 0 = straight down). */
const limb = (x: number, y: number, a: number, b: number, l1: number, l2: number): Seg[] => {
  const kx = x + Math.sin(rad(a)) * l1;
  const ky = y + Math.cos(rad(a)) * l1;
  const fx = kx + Math.sin(rad(a + b)) * l2;
  const fy = ky + Math.cos(rad(a + b)) * l2;
  return [
    [x, y, kx, ky],
    [kx, ky, fx, fy],
  ];
};

/**
 * The walker at (x, y) = between its feet on the ground, `h` ≈ its height. `period` = frames per full cycle
 * (two steps); `walking` 0→1 eases the swing in and out so it can stop and start without a jolt.
 */
export const Walker = ({ x, y, h = 170, view = "side", period, walking = 1, facing = 1 }: { x: number; y: number; h?: number; view?: "side" | "front"; period?: number; walking?: number; facing?: 1 | -1 }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const T = period ?? m.sec(1.1);
  const ph = (f / T) * Math.PI * 2;
  const k = h / 170;
  const bob = (view === "side" ? -5 * Math.cos(2 * ph) : -4 * Math.abs(Math.sin(ph))) * walking;
  const hip = -70;
  const shoulder = -120;

  if (view === "side") {
    const leg = (p: number) => {
      const a = 26 * Math.sin(p) * walking;
      const b = -38 * Math.max(0, Math.cos(p)) * walking;
      return limb(0, hip, a, b, 36, 36);
    };
    const arm = (p: number) => limb(0, shoulder + 8, -24 * Math.sin(p) * walking, 18 * walking, 30, 28);
    const back = [...arm(ph), ...leg(ph + Math.PI)];
    const front = [...leg(ph), ...arm(ph + Math.PI)];
    return (
      <g transform={`translate(${x} ${y + bob * k}) scale(${(k * facing).toFixed(3)} ${k.toFixed(3)})`}>
        <ellipse cx={0} cy={4 - bob} rx={38} ry={10} fill="currentColor" opacity={0.08} />
        <Silhouette segs={[...back, [0, hip, 0, shoulder + 10], ...front]} box={{ x: -SIDE_W / 2, y: shoulder - 2, w: SIDE_W, h: hip - shoulder + 12, r: 13 }} head={{ x: 4, y: shoulder - 26, r: 18 }} limbW={SIDE_W} />
      </g>
    );
  }

  // front view: the feet take turns lifting, the arms swing a little
  const lift = (p: number) => 13 * Math.max(0, Math.sin(p)) * walking;
  const legL: Seg = [-11, hip, -12, -lift(ph)];
  const legR: Seg = [11, hip, 12, -lift(ph + Math.PI)];
  const armL: Seg = [-30, shoulder + 12, -32 - 3 * Math.sin(ph) * walking, shoulder + 64 - 5 * Math.sin(ph) * walking];
  const armR: Seg = [30, shoulder + 12, 32 - 3 * Math.sin(ph) * walking, shoulder + 64 + 5 * Math.sin(ph) * walking];
  const sway = 2.2 * Math.sin(ph) * walking;
  return (
    <g transform={`translate(${x} ${y + bob * k}) scale(${k.toFixed(3)}) rotate(${sway.toFixed(2)} 0 ${hip})`}>
      <ellipse cx={0} cy={4 - bob} rx={44} ry={12} fill="currentColor" opacity={0.08} />
      <Silhouette segs={[legL, legR, armL, armR]} box={{ x: -26, y: shoulder, w: 52, h: hip - shoulder + 10, r: 16 }} head={{ x: 0, y: shoulder - 26, r: 18 }} />
    </g>
  );
};
