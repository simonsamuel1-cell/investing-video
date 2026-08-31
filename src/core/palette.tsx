/**
 * core/palette.tsx — the palette that MAY change mid-episode.
 *
 * `theme.color` is the flat default and is enough for most components. This is
 * a layer on top: a context that resolves the active palette for every frame,
 * so an EXAMPLE section can be coloured differently from an EXPLAINING one.
 *
 * Components that must follow a change read it as a hook, never theme.color:
 *
 *     const c = usePalette();
 *     <div style={{ color: c.indigo }} />
 *
 * ── STATUS ─────────────────────────────────────────────────────────────────
 * WIRED BUT NOT IN USE. It was tried on episodeChartMemory (purple for the
 * example sections) and pulled back out — the two sections read as disjointed.
 * The default below is a single segment, which makes this a no-op with one
 * palette for the whole episode.
 *
 * It stays in core because the machinery is the expensive part and it is now
 * written; switching an episode to `gelap` or `kertas` later costs one line.
 *
 * ── HOW TO SPLIT AN EPISODE ────────────────────────────────────────────────
 * Pass `segments` to the provider. Each entry: the GLOBAL frame it starts at,
 * which palette, and how many frames it takes to cross (0 = hard change).
 *
 * Entering an example section reads best HARD (fade 0); leaving it reads best
 * SOFT, and best of all when the fade rides an existing move — a chart morph
 * or a camera cut — so the colour change travels on a transformation the
 * viewer is already following, instead of announcing itself.
 *
 * ⚠ Frames here are GLOBAL composition frames, and they are the one place in
 * core where a frame number is legitimate: they are episode timing, not
 * component timing. Derive them from the episode's own scene table.
 */
import React, { createContext, useContext, useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { PALETTES, SHADOWS, type Palette, type PaletteName } from "./theme";

export type Segment = {
  /** Global composition frame this segment starts at. */
  from: number;
  palette: PaletteName;
  /** Frames to cross into it. 0 = hard change. */
  fade: number;
};

/** One palette for the whole episode. Override per episode if ever needed. */
export const DEFAULT_SEGMENTS: Segment[] = [
  { from: 0, palette: "terang", fade: 0 },
];

const hex = (v: string) => {
  const s = v.replace("#", "");
  const n = parseInt(
    s.length === 3
      ? s
          .split("")
          .map((c) => c + c)
          .join("")
      : s,
    16,
  );
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
};

const toHex = (r: number, g: number, b: number) =>
  "#" +
  [r, g, b]
    .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
    .join("");

/** Straight RGB mix. Only ever called across a fade, never at rest. */
const mix = (a: string, b: string, t: number) => {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const [ar, ag, ab] = hex(a);
  const [br, bg, bb] = hex(b);
  return toHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
};

const mixPalette = (a: Palette, b: Palette, t: number): Palette => {
  const out = {} as Palette;
  (Object.keys(a) as (keyof Palette)[]).forEach((k) => {
    out[k] = mix(a[k], b[k], t);
  });
  return out;
};

const resolve = (frame: number, segments: Segment[]) => {
  const sorted = [...segments].sort((x, y) => x.from - y.from);
  let i = 0;
  for (let k = 0; k < sorted.length; k++) {
    if (frame >= sorted[k].from) i = k;
  }
  const cur = sorted[i];
  const prev = sorted[i - 1];
  const target = PALETTES[cur.palette];
  if (!prev || cur.fade <= 0) {
    return { palette: target, name: cur.palette };
  }
  const t = interpolate(frame, [cur.from, cur.from + cur.fade], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    palette: mixPalette(PALETTES[prev.palette], target, t),
    /** During a fade, elevation follows the palette being entered. */
    name: t > 0.5 ? cur.palette : prev.palette,
  };
};

type Ctx = { palette: Palette; name: PaletteName };

const PaletteContext = createContext<Ctx>({
  palette: PALETTES.terang,
  name: "terang",
});

export const PaletteProvider = ({
  children,
  segments = DEFAULT_SEGMENTS,
}: {
  children: React.ReactNode;
  segments?: Segment[];
}) => {
  const frame = useCurrentFrame();
  const value = useMemo(() => resolve(frame, segments), [frame, segments]);
  return (
    <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>
  );
};

/** The active palette for this frame. */
export const usePalette = () => useContext(PaletteContext).palette;

/** Elevation for the active palette. */
export const useShadow = () => SHADOWS[useContext(PaletteContext).name];
