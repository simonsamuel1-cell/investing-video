/**
 * palette.tsx — warna yang BISA BERUBAH DI TENGAH EPISODE.
 *
 * `theme.colors` tetap ada dan isinya palet "terang". Itu dasarnya. Yang di
 * sini adalah lapisan di atasnya: sebuah context yang menghitung palet aktif
 * untuk setiap frame, supaya bagian CONTOH bisa berwarna lain dari bagian yang
 * MENJELASKAN.
 *
 * Komponen membacanya lewat `usePalette()`, bukan `theme.colors`:
 *
 *     const c = usePalette();
 *     <div style={{ color: c.indigo }} />
 *
 * ── PEMBAGIAN ───────────────────────────────────────────────────────────────
 * Ubah SEGMENTS di bawah. Setiap entri: dari frame GLOBAL berapa, palet apa,
 * dan berapa frame masa peralihannya (0 = ganti seketika).
 *
 * Episode ini memakai SATU palet dari awal sampai akhir.
 */
import React, { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";
import { PALETTES, type Palette, type PaletteName } from "./theme";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
type Segment = { from: number; palette: PaletteName; fade: number };

export const SEGMENTS: Segment[] = [
  // Satu palet untuk seluruh episode. Mesin pergantiannya tetap ada: tambahkan
  // entri baru kalau suatu bagian mau diberi warna sendiri, misalnya
  //   { from: 8555, palette: "ungu",   fade: 0  },  // SC18 — studi kasus ASII
  //   { from: 9610, palette: "terang", fade: 30 },
  { from: 0, palette: "terang", fade: 0 },
];
// ═══════════════════════════════════════════════════════════════════════════

const hex = (v: string) => {
  const n = parseInt(v.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

/** Blends two palette values. Non-hex entries (rgba tints) switch at halfway. */
const mix = (a: string, b: string, t: number) => {
  if (t <= 0) return a;
  if (t >= 1) return b;
  if (a[0] !== "#" || b[0] !== "#") return t < 0.5 ? a : b;
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

/** The palette at a GLOBAL frame, blended across any fade in progress. */
export const paletteAt = (f: number): Palette => {
  let i = 0;
  for (let k = 0; k < SEGMENTS.length; k++) if (f >= SEGMENTS[k].from) i = k;
  const seg = SEGMENTS[i];
  const prev = i > 0 ? SEGMENTS[i - 1] : seg;
  if (seg.fade > 0 && f < seg.from + seg.fade) {
    const t = (f - seg.from) / seg.fade;
    return mixPalette(PALETTES[prev.palette], PALETTES[seg.palette], t);
  }
  return PALETTES[seg.palette];
};

const Ctx = createContext<Palette>(PALETTES.terang);

/** Read the palette for the current frame. */
export const usePalette = () => useContext(Ctx);

/**
 * Mounted once at the composition root, OUTSIDE every Sequence, so the frame it
 * reads is the global one. Scenes inside Sequences see rebased frames — they
 * must not compute the palette themselves.
 */
export const PaletteProvider = ({ children }: { children: React.ReactNode }) => {
  const f = useCurrentFrame();
  return <Ctx.Provider value={paletteAt(f)}>{children}</Ctx.Provider>;
};
