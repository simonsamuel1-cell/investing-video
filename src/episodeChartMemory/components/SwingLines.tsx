/**
 * SwingLines — the two straight underlines SC03 draws beneath the price line to
 * mark a repeating swing structure. Global frames 1183–1227.
 *
 * ── POSISI ──────────────────────────────────────────────────────────────────
 * Koordinat di bawah ini adalah koordinat kanvas biasa (1920×1080), bukan
 * koordinat chart. Ubah LINES saja untuk memindahkan garisnya:
 *   x1, y1 = ujung kiri   ·   x2, y2 = ujung kanan
 * Angka default = posisi garis versi lama yang dihitung dari data. Kalau CSV
 * BMRI asli nanti menggantikan data placeholder, cek ulang angka ini terhadap
 * bentuk harga yang baru.
 */
import { theme } from "../theme";

export type SwingLine = { x1: number; y1: number; x2: number; y2: number };

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const LINES: SwingLine[] = [
  { x1: 390, y1: 671, x2: 790, y2: 655 }, // garis pertama
  { x1: 950, y1: 680, x2: 1350, y2: 776 }, // garis kedua
];
const STAGGER = 0.5; // garis kedua mulai saat garis pertama sudah sejauh ini
const OPACITY = 0.55;
// ═══════════════════════════════════════════════════════════════════════════

export const SwingLines = ({ progress, opacity = 1 }: { progress: number; opacity?: number }) => {
  if (progress <= 0.001) return null;

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
      {LINES.map((l, i) => {
        const q = Math.max(0, Math.min(1, (progress - i * STAGGER) / (1 - STAGGER)));
        if (q <= 0) return null;
        const len = Math.hypot(l.x2 - l.x1, l.y2 - l.y1);
        return (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={theme.colors.indigo}
            strokeWidth={theme.stroke.rule}
            strokeDasharray={len}
            strokeDashoffset={len * (1 - q)}
            opacity={OPACITY * opacity}
          />
        );
      })}
    </svg>
  );
};
