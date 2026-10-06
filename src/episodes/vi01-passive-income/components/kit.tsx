/**
 * kit.tsx — the handful of pieces VI01 is drawn from.
 *
 * Everything here reads the palette and the motion constants from core; no
 * component knows a frame of its own — each takes `at` (scene-local) and is
 * told when to leave.
 *
 *   Worker      the yellow office worker (public/art/guy, TA11's) in one of
 *               six poses, cross-fading when the pose changes
 *   Node        a rounded box with an icon and a label — the unit of every
 *               flow in the episode (Kerja → Penghasilan → Aset)
 *   Link        an arrow between two nodes, drawn on
 *   Icon        a small set of line icons; core has none
 *   Strike      a line drawn through a phrase that names a misconception
 *   TypeBox     TA07's dashed box, its line typed on, a phrase tinted
 *
 * ⚠ TWO COLOURS, TWO KINDS OF ASSET. Indigo is work and human asset; cyan is
 * money that works and financial asset. The episode never swaps them.
 *
 * ⚠ EVERY MOVE IS AN EASY EASE — Simon, for this video: "animasi harus easy
 * ease". In and out on core's `inOut` curve (progressInOut), never core's
 * front-loaded `settle`, never a pop with an overshoot. That is why this kit
 * has its own Pill, Sheet, DashBox, WordLine and QuoteFrame instead of core's
 * Chip, Panel, DashedBox, Words and QuoteCard: those enter on `settle`, and
 * changing them in core would change every other episode.
 *
 * ⚠ EVERY RECTANGLE HAS ROUND CORNERS — bars included. A square corner is a
 * mistake here, not a style.
 */
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import {
  progressInOut,
  quoteMarks,
  theme,
  usePalette,
  useMotion,
  useShadow,
} from "../../../core";

/** The episode's one curve: eased in AND out. */
export const ease = progressInOut;

/** Fade and rise, on the same easy ease. */
export const rise = (f: number, at: number, over: number, by = 18) => {
  const p = ease(f, at, over);
  return { opacity: p, dy: (1 - p) * by };
};

export type Tone = "indigo" | "cyan" | "slate";

/** One appearance and, optionally, one leaving — scene-local frames. */
export const useLife = (at: number, out?: number, over?: number, inOver?: number) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const o = over ?? m.fade;
  const inn = ease(f, at, inOver ?? m.reveal);
  const gone = out === undefined ? 0 : ease(f, out, o);
  return inn * (1 - gone);
};

// ═══ Worker ═══════════════════════════════════════════════════════════════
/**
 * The worker, standing with his feet on `y` (his bottom edge), centred on `x`.
 * `poses` is a list of [frame, pose] — pose 1 neutral, 2 phone, 3 annoyed,
 * 4 slumped, 5 looking up, 6 looking aside. Each change cross-fades over the
 * episode's fade.
 */
export const Worker = ({
  x,
  y,
  h = 560,
  at,
  out,
  poses,
}: {
  x: number;
  y: number;
  h?: number;
  at: number;
  out?: number;
  poses: readonly (readonly [number, number])[];
}) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const life = useLife(at, out);
  if (life <= 0.001) return null;
  const w = (h * 1000) / 1200;
  const lift = (1 - ease(f, at, m.reveal)) * 30;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h + lift,
        width: w,
        height: h,
        opacity: life,
      }}
    >
      {poses.map(([from, pose], i) => {
        const next = poses[i + 1];
        const on =
          (i === 0 ? 1 : ease(f, from, m.fade)) *
          (next ? 1 - ease(f, next[0], m.fade) : 1);
        if (on <= 0.001) return null;
        return (
          <Img showInTimeline={false}
            key={i}
            src={staticFile(`art/guy/0${pose}.png`)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: on,
            }}
          />
        );
      })}
    </div>
  );
};

// ═══ Cutout ═══════════════════════════════════════════════════════════════
/**
 * A transparent-background picture standing on `y` (its bottom edge), centred
 * on `x` — eased in, eased out. For Simon's own art in public/art/vi01.
 */
export const Cutout = ({
  src,
  aspect,
  x,
  y,
  h,
  at,
  out,
  mirror = false,
  shadow = false,
  floor = 1,
  rise = 30,
  riseFrames,
}: {
  src: string;
  /** width ÷ height of the file */
  aspect: number;
  x: number;
  y: number;
  h: number;
  at: number;
  out?: number;
  /** Flipped left-to-right. */
  mirror?: boolean;
  /** A plain drop shadow (theme.shape.photoShadow) and a contact shadow under it. */
  shadow?: boolean;
  /** Where the feet are, as a fraction of the height — the contact shadow centres there. */
  floor?: number;
  /** How far below its place it starts — a few px to settle in, or off the frame to come up from below. */
  rise?: number;
  /** How long the entrance takes (defaults to the episode's reveal). */
  riseFrames?: number;
}) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const life = useLife(at, out, undefined, riseFrames);
  if (life <= 0.001) return null;
  const w = h * aspect;
  const lift = (1 - ease(f, at, riseFrames ?? m.reveal)) * rise;
  return (
    /* ⚠ THE SHADOW ON THE WRAPPER, THE MIRROR ON THE PICTURE. On one element
       the filter is drawn first and the flip applied after, so a shadow cast
       to the left lands on the right. */
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h + lift,
        width: w,
        height: h,
        opacity: life,
      }}
    >
      {shadow ? (
        <div
          style={{
            position: "absolute",
            left: w * 0.06,
            top: h * floor - h * 0.05,
            width: w * 0.88,
            height: h * 0.1,
            background: theme.shape.floorShadow,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: shadow ? theme.shape.photoShadow : undefined,
        }}
      >
        <Img showInTimeline={false}
          src={staticFile(src)}
          style={{
            position: "absolute",
            inset: 0,
            width: w,
            height: h,
            transform: mirror ? "scaleX(-1)" : undefined,
          }}
        />
      </div>
    </div>
  );
};

// ═══ Icons ════════════════════════════════════════════════════════════════
export type IconName =
  | "briefcase"
  | "wallet"
  | "home"
  | "pause"
  | "clock"
  | "bolt"
  | "calendar"
  | "building"
  | "coin"
  | "jar"
  | "hourglass"
  | "book"
  | "chart"
  | "heart"
  | "check"
  | "person"
  | "loop"
  | "box"
  | "spark"
  | "users"
  | "bowl"
  | "milk"
  | "shirt"
  | "pants"
  | "car"
  | "basket"
  | "burger"
  | "glass"
  | "tools"
  | "store"
  | "pen"
  | "monitor";

/** Line icons on a 48-unit grid, drawn in `color` at `size` px. */
export const Icon = ({
  name,
  size = 48,
  color,
  stroke = 3.2,
  fill = "none",
}: {
  name: IconName;
  size?: number;
  color: string;
  stroke?: number;
  /** A solid colour inside the closed shapes (the spending icons in VI01 SC01). */
  fill?: string;
}) => {
  const p = {
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const d: Record<IconName, React.ReactNode> = {
    shirt: <path d="M17 8L7 14l4 9 5-2v19h16V21l5 2 4-9-10-6c-1 3-4 5-7 5s-6-2-7-5z" {...p} fill={fill} />,
    pants: (
      <>
        <path d="M14 7h20l3 34h-9l-4-22-4 22h-9z" {...p} fill={fill} />
        <path d="M14 13h20" {...p} />
      </>
    ),
    car: (
      <>
        <path d="M7 32v-7l5-10h24l5 10v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" {...p} fill={fill} />
        <path d="M7 25h34" {...p} />
        <circle cx="15" cy="34" r="4" {...p} fill={color} />
        <circle cx="33" cy="34" r="4" {...p} fill={color} />
      </>
    ),
    basket: (
      <>
        <path d="M9 19l4 19a3 3 0 0 0 3 2h16a3 3 0 0 0 3-2l4-19z" {...p} fill={fill} />
        <path d="M14 19l6-11M34 19l-6-11M6 19h36M19 26v8M24 26v8M29 26v8" {...p} />
      </>
    ),
    burger: (
      <>
        <path d="M8 21c0-8 7-13 16-13s16 5 16 13z" {...p} fill={fill} />
        <path d="M7 27c3 2 6 2 9 0s6-2 9 0 6 2 9 0 5-2 7 0" {...p} />
        <rect x="7" y="31" width="34" height="5" rx="2.5" {...p} fill={color} />
        <path d="M9 40h30a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3z" {...p} fill={fill} />
      </>
    ),
    tools: (
      <>
        <g transform="rotate(45 24 24)">
          <rect x="19.5" y="4" width="9" height="15" rx="4" {...p} fill={fill} />
          <path d="M24 19v19l-1.5 3h3L24 38" {...p} />
        </g>
        <g transform="rotate(-45 24 24)">
          <rect x="14" y="6" width="20" height="9" rx="2.5" {...p} fill={fill} />
          <rect x="21.5" y="15" width="5" height="27" rx="2.5" {...p} />
        </g>
      </>
    ),
    store: (
      <>
        <path d="M10 22v18h28V22M20 40V29h8v11" {...p} />
        <path d="M11 8h26l5 10a4.5 4.5 0 0 1-9 0a4.5 4.5 0 0 1-9 0a4.5 4.5 0 0 1-9 0a4.5 4.5 0 0 1-9 0z" {...p} fill={fill} />
      </>
    ),
    pen: (
      <g transform="rotate(45 24 24)">
        <rect x="19" y="4" width="10" height="28" rx="2.5" {...p} fill={fill} />
        <path d="M19 32h10l-5 10zM24 37v5" {...p} />
      </g>
    ),
    monitor: (
      <>
        <rect x="5" y="8" width="38" height="25" rx="3.5" {...p} fill={fill} />
        <path d="M24 33v7M15 41h18" {...p} />
      </>
    ),
    glass: (
      <>
        <path d="M14.1 19h19.8L32 40a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3z" fill={fill} />
        <path d="M13 7h22l-3 33a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3zM14.1 19h19.8" {...p} />
      </>
    ),
    briefcase: (
      <>
        <rect x="6" y="15" width="36" height="25" rx="5" {...p} fill={fill} />
        <path d="M17 15v-4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4M6 26h36" {...p} />
      </>
    ),
    wallet: (
      <>
        <rect x="6" y="12" width="36" height="28" rx="5" {...p} />
        <path d="M30 22h12v10H30a5 5 0 0 1 0-10z" {...p} />
        <path d="M10 12l18-6 4 6" {...p} />
      </>
    ),
    home: <path d="M8 22L24 9l16 13M12 19v20h24V19M20 39V28h8v11" {...p} />,
    pause: (
      <>
        <circle cx="24" cy="24" r="17" {...p} />
        <path d="M20 17v14M28 17v14" {...p} />
      </>
    ),
    clock: (
      <>
        <circle cx="24" cy="24" r="17" {...p} />
        <path d="M24 14v10l7 5" {...p} />
      </>
    ),
    bolt: <path d="M27 6L12 27h11l-3 15 16-22H25z" {...p} />,
    calendar: (
      <>
        <rect x="7" y="10" width="34" height="31" rx="5" {...p} />
        <path d="M7 19h34M16 6v8M32 6v8" {...p} />
      </>
    ),
    building: (
      <>
        <path d="M10 41V11l14-5 14 5v30" {...p} />
        <path
          d="M6 41h36M17 17h4M27 17h4M17 25h4M27 25h4M21 41v-8h6v8"
          {...p}
        />
      </>
    ),
    coin: (
      <>
        <circle cx="24" cy="24" r="16" {...p} />
        <path
          d="M29 18.5c-1.2-1.6-3-2.5-5-2.5-3 0-5 1.6-5 4s2.4 3.3 5 4 5 1.6 5 4-2 4-5 4c-2 0-3.8-.9-5-2.5M24 12v4M24 32v4"
          {...p}
        />
      </>
    ),
    jar: (
      <>
        <path
          d="M14 12h20M15 12v4c-3 2-5 5-5 9v10a5 5 0 0 0 5 5h18a5 5 0 0 0 5-5V25c0-4-2-7-5-9v-4"
          {...p}
        />
        <path d="M10 28h28" {...p} />
      </>
    ),
    hourglass: (
      <path
        d="M13 7h22M13 41h22M15 7c0 9 9 11 9 17s-9 8-9 17M33 7c0 9-9 11-9 17s9 8 9 17"
        {...p}
      />
    ),
    book: (
      <path
        d="M24 13c-4-3-10-4-16-3v27c6-1 12 0 16 3 4-3 10-4 16-3V10c-6-1-12 0-16 3zM24 13v27"
        {...p}
      />
    ),
    chart: <path d="M7 40h34M10 33l9-9 7 6 12-14M30 16h8v8" {...p} />,
    heart: (
      <path
        d="M24 39S8 29 8 18a8 8 0 0 1 16-2 8 8 0 0 1 16 2c0 11-16 21-16 21z"
        {...p}
      />
    ),
    check: <path d="M11 25l9 9 17-19" {...p} />,
    person: (
      <>
        <circle cx="24" cy="15" r="7" {...p} />
        <path d="M10 41c0-8 6-13 14-13s14 5 14 13" {...p} />
      </>
    ),
    loop: <path d="M36 18a14 14 0 1 0 2 10M38 10v8h-8" {...p} />,
    box: (
      <>
        <path d="M8 16l16-8 16 8v17l-16 8-16-8z" {...p} />
        <path d="M8 16l16 8 16-8M24 24v17" {...p} />
      </>
    ),
    spark: (
      <path
        d="M24 6v8M24 34v8M6 24h8M34 24h8M11 11l6 6M31 31l6 6M37 11l-6 6M17 31l-6 6"
        {...p}
      />
    ),
    bowl: (
      <>
        <path d="M6 24h36a18 16 0 0 1-36 0z" {...p} />
        <path
          d="M16 17c0-3 3-4 3-8M24 17c0-3 3-4 3-8M32 17c0-3 3-4 3-8"
          {...p}
        />
      </>
    ),
    milk: (
      <>
        <path d="M15 15l4-9h10l4 9v27H15z" {...p} />
        <path d="M15 15h18" {...p} />
        <rect x="19" y="23" width="10" height="11" rx="2" {...p} />
      </>
    ),
    users: (
      <>
        <circle cx="18" cy="16" r="6" {...p} />
        <circle cx="33" cy="18" r="5" {...p} />
        <path d="M6 40c0-7 5-12 12-12s12 5 12 12M30 28c6 0 12 4 12 11" {...p} />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ display: "block", flexShrink: 0 }}
    >
      {d[name]}
    </svg>
  );
};

// ═══ Node ═════════════════════════════════════════════════════════════════
/** A node's footprint, so links can be drawn between them. */
export type NodeBox = { x: number; y: number; w: number; h: number };
export const nodeEdge = (b: NodeBox, side: "l" | "r" | "t" | "b") =>
  side === "l"
    ? { x: b.x, y: b.y + b.h / 2 }
    : side === "r"
      ? { x: b.x + b.w, y: b.y + b.h / 2 }
      : side === "t"
        ? { x: b.x + b.w / 2, y: b.y }
        : { x: b.x + b.w / 2, y: b.y + b.h };

const toneOf = (c: ReturnType<typeof usePalette>, tone: Tone) =>
  tone === "indigo"
    ? { ink: c.indigo, wash: theme.color.indigoWash }
    : tone === "cyan"
      ? { ink: theme.color.cyanInk, wash: theme.color.cyanWash }
      : { ink: c.slate, wash: "transparent" };

/**
 * A card with an icon over (or beside) a label. UI, so it POPS in; `dim`
 * greys it back without removing it; `filled` floods it in its tone.
 */
export const Node = ({
  box,
  label,
  icon,
  tone = "indigo",
  at,
  out,
  dim = 0,
  filled = 0,
  size = 34,
  layout = "row",
  sub,
}: {
  box: NodeBox;
  label: string;
  icon?: IconName;
  tone?: Tone;
  at: number;
  out?: number;
  /** 0→1 — greyed back. */
  dim?: number;
  /** 0→1 — flooded in its tone, the label turning white. */
  filled?: number;
  size?: number;
  layout?: "row" | "column";
  sub?: string;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  /* eased in and out — it grows into place and stops; no overshoot */
  const inn = ease(f, at, m.reveal);
  const pop = { opacity: inn, scale: 0.94 + 0.06 * inn };
  const gone = out === undefined ? 0 : ease(f, out, m.fade);
  const o = pop.opacity * (1 - gone);
  if (f < at || o <= 0.001) return null;
  const t = toneOf(c, tone);
  const ink = filled > 0.5 ? c.cardBg : t.ink;
  const grey = (v: string) => (dim > 0.001 ? v : v);
  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        opacity: o * (1 - 0.6 * dim),
        transform: `scale(${pop.scale.toFixed(4)})`,
        transformOrigin: "50% 50%",
        borderRadius: theme.shape.panelRadius,
        background: c.cardBg,
        border: `${theme.shape.rule}px solid ${dim > 0.5 ? c.border : t.ink}`,
        boxShadow: shadow.rest,
        overflow: "hidden",
        filter: dim > 0.001 ? `grayscale(${dim})` : undefined,
      }}
    >
      {filled > 0.001 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: t.ink,
            opacity: filled,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: layout === "row" ? "row" : "column",
          alignItems: "center",
          justifyContent: "center",
          gap: layout === "row" ? 16 : 10,
          padding: "0 18px",
          fontFamily: theme.text.family,
          fontSize: size,
          fontWeight: 700,
          color: grey(ink),
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        {icon ? <Icon name={icon} size={size * 1.45} color={ink} /> : null}
        <div>
          {label}
          {sub ? (
            <div
              style={{
                fontSize: size * 0.62,
                fontWeight: 500,
                color: filled > 0.5 ? c.cardBg : c.slate,
                marginTop: 4,
              }}
            >
              {sub}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ═══ Link ═════════════════════════════════════════════════════════════════
/** An arrow from `a` to `b`, drawn on over the episode's move. `cut` breaks it. */
export const Link = ({
  a,
  b,
  at,
  tone = "indigo",
  out,
  cut = 0,
  dashed = false,
  head = true,
  width = theme.shape.line + 1,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  at: number;
  tone?: Tone;
  out?: number;
  /** 0→1 — the middle of the arrow falls away (a flow interrupted). */
  cut?: number;
  dashed?: boolean;
  head?: boolean;
  width?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const draw = ease(f, at, m.move);
  const gone = out === undefined ? 0 : ease(f, out, m.fade);
  if (draw <= 0.001 || gone >= 0.999) return null;
  const ink =
    tone === "indigo"
      ? c.indigo
      : tone === "cyan"
        ? theme.color.cyanInk
        : c.slate;
  const ex = a.x + (b.x - a.x) * draw;
  const ey = a.y + (b.y - a.y) * draw;
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = (b.x - a.x) / len;
  const uy = (b.y - a.y) / len;
  const H = 16;
  const gap = cut * len * 0.32;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  return (
    <svg
      width={theme.canvas.width}
      height={theme.canvas.height}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        overflow: "visible",
        opacity: 1 - gone,
      }}
    >
      {cut > 0.001 && draw >= 0.999 ? (
        <>
          <line
            x1={a.x}
            y1={a.y}
            x2={mx - ux * gap}
            y2={my - uy * gap}
            stroke={ink}
            strokeWidth={width}
            strokeLinecap="round"
            strokeDasharray={dashed ? "10 10" : undefined}
          />
          <line
            x1={mx + ux * gap}
            y1={my + uy * gap}
            x2={b.x - ux * H * 0.6}
            y2={b.y - uy * H * 0.6}
            stroke={ink}
            strokeWidth={width}
            strokeLinecap="round"
            opacity={1 - cut * 0.6}
          />
        </>
      ) : (
        <line
          x1={a.x}
          y1={a.y}
          x2={ex - (head ? ux * H * 0.6 : 0)}
          y2={ey - (head ? uy * H * 0.6 : 0)}
          stroke={ink}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={dashed ? "10 10" : undefined}
        />
      )}
      {head ? (
        <polygon
          points={`${ex},${ey} ${ex - ux * H - uy * H * 0.6},${ey - uy * H + ux * H * 0.6} ${ex - ux * H + uy * H * 0.6},${ey - uy * H - ux * H * 0.6}`}
          fill={ink}
          opacity={1 - cut * 0.6}
        />
      ) : null}
    </svg>
  );
};

// ═══ Ground ═══════════════════════════════════════════════════════════════
/**
 * The drifting grid, kept out of BOTH reserves: cut off at the caption band and
 * notched around the logo's 360×150 corner. Core's vignette alone leaves a few
 * faint lines at the corner's lower-left edge.
 */
export const OUTSIDE_RESERVES = (() => {
  const W = theme.canvas.width;
  const lx = W - theme.logoZone.width;
  const ly = theme.logoZone.height;
  const by = theme.captionBand.top;
  return `polygon(0 0, ${lx}px 0, ${lx}px ${ly}px, ${W}px ${ly}px, ${W}px ${by}px, 0 ${by}px)`;
})();

// ═══ Strike ═══════════════════════════════════════════════════════════════
/** A line drawn through a phrase — `warn` red, the one place red is allowed. */
export const Strike = ({
  x,
  y,
  w,
  at,
  color = theme.color.warn,
  width = 6,
}: {
  x: number;
  y: number;
  w: number;
  at: number;
  color?: string;
  width?: number;
}) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const p = ease(f, at, m.reveal);
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - width / 2,
        width: w * p,
        height: width,
        borderRadius: width,
        background: color,
      }}
    />
  );
};

// ═══ Text ═════════════════════════════════════════════════════════════════
/** A line of type that fades and rises in, and optionally leaves. */
export const Say = ({
  text,
  x,
  y,
  at,
  out,
  size = theme.text.title.size,
  weight = 700,
  color,
  anchor = "center",
  dim = 0,
  strikeAt,
  children,
}: {
  text?: string;
  x: number;
  y: number;
  at: number;
  out?: number;
  size?: number;
  weight?: number;
  color?: string;
  anchor?: "center" | "left" | "right";
  dim?: number;
  /** A misconception: a `warn` line is drawn through the words from here. */
  strikeAt?: number;
  children?: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const r = rise(f, at, m.reveal);
  const struck = strikeAt === undefined ? 0 : ease(f, strikeAt, m.reveal);
  const gone = out === undefined ? 0 : ease(f, out, m.fade);
  const o = r.opacity * (1 - gone) * (1 - 0.65 * dim);
  if (f < at || o <= 0.001) return null;
  const tx = anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${tx}, calc(-50% + ${r.dy}px))`,
        opacity: o,
        fontFamily: theme.text.family,
        fontSize: size,
        fontWeight: weight,
        color: color ?? c.ink,
        whiteSpace: "nowrap",
        lineHeight: 1.2,
      }}
    >
      <span style={{ position: "relative", display: "inline-block" }}>
        {children ?? text}
        {struck > 0.001 ? (
          <span
            style={{
              position: "absolute",
              left: -8,
              top: "52%",
              width: `calc(${(struck * 100).toFixed(2)}% + ${16 * struck}px)`,
              height: Math.max(4, size * 0.1),
              marginTop: -Math.max(2, size * 0.05),
              borderRadius: 99,
              background: theme.color.warn,
            }}
          />
        ) : null}
      </span>
    </div>
  );
};

// ═══ TypeBox ══════════════════════════════════════════════════════════════
/**
 * TA07's line in a dashed box: the box fades up as a sliver at its centre and
 * opens out to both sides (DashBox), then the words are typed on; `mark` is
 * tinted in its tone once typed, at `markAt` if given. Centred on `cx`.
 */
export const TypeBox = ({
  cx,
  y,
  w,
  h = 120,
  at,
  typeAt,
  out,
  dim = 0,
  text,
  mark,
  markAt,
  tone = "indigo",
  size = 40,
  cps = 1,
}: {
  cx: number;
  y: number;
  w: number;
  h?: number;
  at: number;
  /** When the typing starts — defaults to once the box is open. */
  typeAt?: number;
  out?: number;
  dim?: number;
  text: string;
  mark?: string;
  markAt?: number;
  tone?: "indigo" | "cyan";
  size?: number;
  /** Characters per frame — 1.0 at 60fps is 60 a second, about speech pace. */
  cps?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const gone = out === undefined ? 0 : ease(f, out, m.fade);
  if (f < at || gone >= 0.999) return null;
  /* never before the box has finished opening */
  const start = Math.max(typeAt ?? 0, dashOpenAt(at, m));
  const shown = Math.max(0, Math.floor((f - start) * cps));
  const typed = text.slice(0, shown);
  const mStart = mark ? text.indexOf(mark) : -1;
  const mEnd = mStart >= 0 ? mStart + (mark as string).length : -1;
  const markOn =
    mStart >= 0 && shown >= mEnd
      ? ease(f, Math.max(markAt ?? 0, start + Math.ceil(mEnd / cps)), m.reveal)
      : 0;
  const wash =
    tone === "indigo" ? theme.color.indigoWashStrong : theme.color.hlCyan;
  const ink = tone === "indigo" ? c.indigo : theme.color.cyanInk;
  const seg = (s: string, k: string) => <span key={k}>{s}</span>;
  return (
    <div style={{ opacity: (1 - gone) * (1 - 0.6 * dim) }}>
      <DashBox cx={cx} y={y} w={w} h={h} at={at}>
        {/* the box's own coordinates — DashBox positions its children */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: w,
            height: h,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.text.family,
            fontSize: size,
            fontWeight: 600,
            fontStyle: "italic",
            color: c.ink,
            whiteSpace: "pre",
          }}
        >
          {mStart < 0 || shown <= mStart
            ? seg(typed, "a")
            : [
                seg(typed.slice(0, mStart), "a"),
                <span
                  key="m"
                  style={{
                    background: markOn > 0 ? wash : "transparent",
                    color: markOn > 0.5 ? ink : undefined,
                    fontWeight: markOn > 0.5 ? 800 : 600,
                    borderRadius: 6,
                    padding: "0 6px",
                    margin: "0 -6px",
                    opacity: 1,
                  }}
                >
                  {typed.slice(mStart, Math.min(shown, mEnd))}
                </span>,
                seg(typed.slice(mEnd), "b"),
              ]}
        </div>
      </DashBox>
    </div>
  );
};

// ═══ DashBox ══════════════════════════════════════════════════════════════
/**
 * TA07's dashed box, opening FROM ITS CENTRE — Simon: "munculnya harus dari
 * tengah dari panjang width text boxnya memanjang ke kiri kanan, jangan cepet
 * cepet". A sliver fades up at the centre, then both edges travel out together
 * over most of a second. Content appears once it is fully open.
 */
/** Seconds: fade up as a sliver, then open — most of a second, not a snap. */
export const DASH = {
  fadeSec: 0.3,
  openSec: 0.8,
  sliver: 12,
  block: 15,
  dash: "16 11",
};
export const dashOpenAt = (at: number, m: { sec: (s: number) => number }) =>
  at + m.sec(DASH.fadeSec) + m.sec(DASH.openSec);

export const DashBox = ({
  cx,
  y,
  w,
  h,
  at,
  children,
}: {
  cx: number;
  y: number;
  w: number;
  h: number;
  at: number;
  children?: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (f < at) return null;
  const fade = ease(f, at, m.sec(DASH.fadeSec));
  const open = ease(f, at + m.sec(DASH.fadeSec), m.sec(DASH.openSec));
  const wNow = DASH.sliver + (w - DASH.sliver) * open;
  const r = theme.shape.panelRadius;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - wNow / 2,
        top: y,
        width: wNow,
        height: h,
        opacity: fade,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          background: c.cardBg,
        }}
      />
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={wNow}
        height={h}
      >
        <rect
          x={1}
          y={1}
          width={Math.max(1, wNow - 2)}
          height={h - 2}
          rx={r}
          fill="none"
          stroke={c.ink}
          strokeWidth={theme.shape.rule}
          strokeDasharray={DASH.dash}
        />
        {[
          [1, 1],
          [wNow - 1, 1],
          [1, h - 1],
          [wNow - 1, h - 1],
        ].map(([x, yy], i) => (
          <rect
            key={i}
            x={x - DASH.block / 2}
            y={yy - DASH.block / 2}
            width={DASH.block}
            height={DASH.block}
            rx={4}
            fill={c.ink}
          />
        ))}
      </svg>
      {open >= 0.999 ? (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {children}
        </div>
      ) : null}
    </div>
  );
};

// ═══ Pill ═════════════════════════════════════════════════════════════════
/** A rounded label — core's Chip, eased in and out. `check` puts a ✓ before it. */
export const Pill = ({
  label,
  x,
  y,
  at,
  out,
  tone = "indigo",
  anchor = "center",
  check = false,
  size = 40,
  dim = 0,
}: {
  label: string;
  x: number;
  y: number;
  at: number;
  out?: number;
  tone?: Tone;
  anchor?: "center" | "left";
  check?: boolean;
  size?: number;
  dim?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const inn = ease(f, at, m.reveal);
  const gone = out === undefined ? 0 : ease(f, out, m.fade);
  const o = inn * (1 - gone) * (1 - 0.65 * dim);
  if (f < at || o <= 0.001) return null;
  const t = toneOf(c, tone);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${anchor === "center" ? "-50%" : "0"}, -50%) scale(${(0.94 + 0.06 * inn).toFixed(4)})`,
        opacity: o,
        display: "flex",
        alignItems: "center",
        gap: size * 0.3,
        padding: `${size * 0.28}px ${size * 0.62}px`,
        borderRadius: 999,
        background: tone === "slate" ? theme.color.slateWash : t.wash,
        border: `${theme.shape.rule}px solid ${t.ink}`,
        fontFamily: theme.text.family,
        fontSize: size,
        fontWeight: 600,
        color: t.ink,
        whiteSpace: "nowrap",
      }}
    >
      {check ? (
        <Icon name="check" size={size * 0.95} color={t.ink} stroke={4} />
      ) : null}
      {label}
    </div>
  );
};

// ═══ Sheet ═════════════════════════════════════════════════════════════════
/** A white panel with round corners — core's Panel, eased in and out. */
export const Sheet = ({
  x,
  y,
  w,
  h,
  at,
  out,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  out?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const inn = ease(f, at, m.reveal);
  const gone = out === undefined ? 0 : ease(f, out, m.fade);
  const o = inn * (1 - gone);
  if (f < at || o <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: theme.shape.cardRadius,
        background: c.cardBg,
        border: `${theme.shape.hairline}px solid ${c.border}`,
        boxShadow: shadow.rest,
        opacity: o,
        transform: `scale(${(0.97 + 0.03 * inn).toFixed(4)})`,
      }}
    />
  );
};

// ═══ WordLine ═════════════════════════════════════════════════════════════
/**
 * A line arriving a word at a time, each word eased in; `mark` is washed in its
 * colour from `markAt`, the wash wiping left to right on the same ease.
 */
export const WordLine = ({
  text,
  x,
  y,
  at,
  stagger = 6,
  size = 54,
  weight = 700,
  mark,
  markColor,
  markAt,
}: {
  text: string;
  x: number;
  y: number;
  at: number;
  stagger?: number;
  size?: number;
  weight?: number;
  mark?: string;
  markColor?: string;
  markAt?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (f < at) return null;
  const words = text.split(" ");
  const markWords = mark ? mark.split(" ") : [];
  let mFrom = -1;
  for (let i = 0; mark && i + markWords.length <= words.length; i++) {
    if (markWords.every((w, k) => words[i + k] === w)) {
      mFrom = i;
      break;
    }
  }
  const wipe = mFrom >= 0 && markAt !== undefined ? ease(f, markAt, m.move) : 0;
  const w = (i: number, word: string) => {
    const r = rise(f, at + i * stagger, m.reveal, 14);
    return (
      <span
        key={i}
        style={{
          display: "inline-block",
          opacity: r.opacity,
          transform: `translateY(${r.dy}px)`,
          whiteSpace: "pre",
        }}
      >
        {word}
        {i < words.length - 1 ? " " : ""}
      </span>
    );
  };
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        fontFamily: theme.text.family,
        fontSize: size,
        fontWeight: weight,
        color: c.ink,
        whiteSpace: "nowrap",
        lineHeight: 1.25,
      }}
    >
      {mFrom < 0
        ? words.map((word, i) => w(i, word))
        : [
            ...words.slice(0, mFrom).map((word, i) => w(i, word)),
            <span
              key="mark"
              style={{ position: "relative", display: "inline-block" }}
            >
              <span
                style={{
                  position: "absolute",
                  left: -8,
                  top: "8%",
                  height: "88%",
                  width: `calc(${(wipe * 100).toFixed(2)}% + ${16 * wipe}px)`,
                  borderRadius: 10,
                  background: markColor ?? theme.color.hlCyan,
                }}
              />
              <span style={{ position: "relative" }}>
                {markWords.map((word, k) => w(mFrom + k, word))}
              </span>
            </span>,
            ...words
              .slice(mFrom + markWords.length)
              .map((word, k) => w(mFrom + markWords.length + k, word)),
          ]}
    </div>
  );
};

// ═══ QuoteFrame ═══════════════════════════════════════════════════════════
/**
 * TA09's closing quote card — white, a 4px ink border, a solid indigo block
 * dropped behind it, the big quote marks in opposite corners — eased in and
 * out. Geometry from core's QUOTE/quoteMarks, so it is the same card.
 */
export const QuoteFrame = ({
  x,
  y,
  w,
  h,
  at,
  listY,
  lead,
  count,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  listY: number;
  lead: number;
  count: number;
  children?: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const r = rise(f, at, m.reveal * 1.4);
  if (r.opacity <= 0.001) return null;
  const shell = {
    position: "absolute" as const,
    left: x,
    top: y,
    width: w,
    height: h,
    borderRadius: theme.shape.panelRadius,
  };
  return (
    <div style={{ opacity: r.opacity, transform: `translateY(${r.dy}px)` }}>
      <div
        style={{ ...shell, left: x + 14, top: y + 14, background: c.indigo }}
      />
      <div
        style={{ ...shell, background: c.cardBg, border: `4px solid ${c.ink}` }}
      />
      {quoteMarks({ x, w }, listY, lead, count).map((q) => (
        <div
          key={q.ch}
          style={{
            position: "absolute",
            left: q.x,
            top: q.y,
            width: 76,
            textAlign: "center",
            fontFamily: theme.text.family,
            fontSize: 76,
            fontWeight: 800,
            color: c.ink,
            lineHeight: 1,
          }}
        >
          {q.ch}
        </div>
      ))}
      {children}
    </div>
  );
};
