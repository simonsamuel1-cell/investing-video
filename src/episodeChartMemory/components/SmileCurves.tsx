/**
 * SmileCurves — dua kurva senyum (bentuk U) yang digambar di bawah line chart
 * SC03. Global frames 1183–1239; keduanya digambar berurutan, bukan bersamaan.
 *
 * ── POSISI ──────────────────────────────────────────────────────────────────
 * Koordinat kanvas biasa (1920×1080). Ubah CURVES saja:
 *   x1    = ujung kiri (x)
 *   x2    = ujung kanan (x)
 *   y     = tinggi kedua ujungnya (kiri & kanan sama tinggi)
 *   depth = seberapa dalam kurvanya melengkung ke BAWAH di tengah, dalam px.
 *           Titik terendah kurva = y + depth. Depth negatif = kurva terbalik.
 * Contoh: { x1: 390, x2: 790, y: 700, depth: 60 } → senyum selebar 400px yang
 * ujungnya di y=700 dan dasarnya di y=760.
 *
 * Area chart membentang y 250–790, jadi jaga y + depth tetap di bawah 790 biar
 * kurvanya tidak menabrak baris tanggal.
 */
import { theme } from "../theme";
import { usePalette } from "../palette";

export type SmileCurve = { x1: number; x2: number; y: number; depth: number };

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const CURVES: SmileCurve[] = [
  { x1: 920, x2: 1170, y: 700, depth: 60 }, // kurva pertama
  { x1: 1210, x2: 1460, y: 700, depth: 60 }, // kurva kedua
];
const STAGGER = 0.5; // kurva kedua mulai saat kurva pertama sudah sejauh ini
const OPACITY = 0.7;
// ═══════════════════════════════════════════════════════════════════════════

/** Quadratic bézier: control point sits 2×depth down so the apex lands at depth. */
const pathOf = (c: SmileCurve) => `M ${c.x1} ${c.y} Q ${(c.x1 + c.x2) / 2} ${c.y + c.depth * 2} ${c.x2} ${c.y}`;

export const SmileCurves = ({ progress, opacity = 1 }: { progress: number; opacity?: number }) => {
  const pal = usePalette();
  if (progress <= 0.001) return null;

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
      {CURVES.map((c, i) => {
        const q = Math.max(0, Math.min(1, (progress - i * STAGGER) / (1 - STAGGER)));
        if (q <= 0) return null;
        return (
          <path
            key={i}
            d={pathOf(c)}
            fill="none"
            stroke={pal.indigo}
            strokeWidth={theme.stroke.rule}
            strokeLinecap="round"
            // pathLength normalises the path to 1 so the draw-on works without
            // measuring the real arc length.
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - q}
            opacity={OPACITY * opacity}
          />
        );
      })}
    </svg>
  );
};
