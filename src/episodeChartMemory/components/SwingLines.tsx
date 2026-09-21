/**
 * SwingLines — garis lurus yang digambar SC03 di bawah line chart untuk menandai
 * struktur swing. Global frames 1183–1227.
 *
 * ── POSISI ──────────────────────────────────────────────────────────────────
 * Koordinat di bawah ini adalah koordinat kanvas biasa (1920×1080), bukan
 * koordinat chart. Ubah LINES saja untuk memindahkan garisnya:
 *   x1, y1 = ujung kiri   ·   x2, y2 = ujung kanan
 * Kalau CSV BMRI asli nanti menggantikan data placeholder, cek ulang angka ini
 * terhadap bentuk harga yang baru.
 *
 * Sekarang tinggal SATU garis (yang kiri) — garis kanan sudah dihapus. Kalau
 * mau menambah garis lagi, cukup tambahkan entri baru ke LINES; garis kedua dan
 * seterusnya akan digambar bergiliran mengikuti STAGGER.
 */
import { theme } from "../theme";
import { usePalette } from "../palette";

export type SwingLine = { x1: number; y1: number; x2: number; y2: number };

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const LINES: SwingLine[] = [
  { x1: 240, y1: 550, x2: 890, y2: 525 }, // garis kiri
];
const OPACITY = 0.55;
// ═══════════════════════════════════════════════════════════════════════════

export const SwingLines = ({ progress, opacity = 1 }: { progress: number; opacity?: number }) => {
  const pal = usePalette();
  if (progress <= 0.001) return null;

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
      {LINES.map((l, i) => {
        // Each line owns an equal slice of the draw, so they trace one after the
        // other however many there are (one line = the whole window).
        const slice = 1 / LINES.length;
        const q = Math.max(0, Math.min(1, (progress - i * slice) / slice));
        if (q <= 0) return null;
        const len = Math.hypot(l.x2 - l.x1, l.y2 - l.y1);
        return (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={pal.indigo}
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
