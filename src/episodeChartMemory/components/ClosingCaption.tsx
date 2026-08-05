/**
 * ClosingCaption — baris penutup SC10, "Ingatan pasar". Muncul di frame global
 * 6494 lalu bertahan sampai akhir episode.
 *
 * ── POSISI & TAMPILAN ───────────────────────────────────────────────────────
 * Cukup ubah blok CAPTION di bawah. Semua koordinat adalah koordinat kanvas
 * biasa (1920×1080):
 *
 *   text     isi teksnya
 *   x        titik TENGAH teks secara mendatar (960 = tengah kanvas)
 *   y        tepi ATAS teks
 *   size     ukuran font, px
 *   weight   ketebalan font (400–800)
 *   color    ambil dari theme.colors — jangan tulis hex mentah di sini
 *   rise     jarak teks naik saat muncul, px (bagian dari textReveal)
 *   revealDur  lama kemunculan, frame
 *
 * ── BATAS AMAN ──────────────────────────────────────────────────────────────
 *   y minimal 54   (safe top)
 *   tepi bawah teks maksimal 972  (di bawah itu zona subtitle)
 *   kalau y < 150, teks tidak boleh melewati x = 1368 — itu zona logo
 *   kanan-atas. Pada 48px, "Ingatan pasar" lebarnya ±330px, jadi dengan
 *   x = 960 teks berhenti di ±1125. Aman.
 *
 * Nilai sekarang: y = 124, yaitu 50px di bawah posisi pertamanya (74).
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { textReveal } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const CAPTION = {
  text: "Ingatan pasar",
  x: theme.canvas.width / 2, // 960
  y: 124,
  size: theme.type.header.size, // 48
  weight: theme.type.header.weight, // 700
  color: theme.colors.indigo,
  rise: 18,
  revealDur: 20,
};
// ═══════════════════════════════════════════════════════════════════════════

export const ClosingCaption = ({ startFrame }: { startFrame: number }) => {
  const f = useCurrentFrame();
  if (f < startFrame) return null;
  const r = textReveal(f, startFrame, CAPTION.revealDur, CAPTION.rise);

  return (
    <div
      style={{
        position: "absolute",
        left: CAPTION.x,
        top: CAPTION.y,
        transform: `translate(-50%, ${r.y}px)`,
        fontFamily: theme.type.family,
        fontSize: CAPTION.size,
        fontWeight: CAPTION.weight,
        color: CAPTION.color,
        opacity: r.opacity,
        whiteSpace: "nowrap",
      }}
    >
      {CAPTION.text}
    </div>
  );
};
