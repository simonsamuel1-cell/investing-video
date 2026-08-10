/**
 * theme.ts — SINGLE SOURCE OF TRUTH for the "Market Structure" episode.
 * No raw hex, font size/weight, easing curve, or layout number in scene files —
 * everything imports from here.
 *
 * ── GANTI PALET ─────────────────────────────────────────────────────────────
 * Ubah SATU baris — `PALETTE` di bawah — untuk mengganti warna seluruh episode:
 *
 *   "terang"  latar abu terang, indigo + cyan   (palet asli)
 *   "gelap"   latar hitam, chart jadi cahaya    (arah 1)
 *   "kertas"  latar kertas hangat, aksen terakota (arah 2)
 *   "ungu"    latar ungu — penanda BAGIAN CONTOH, bukan babak
 *
 * Nama kuncinya adalah PERAN, bukan rona. Di palet "kertas", `cyan` memegang
 * warna terakota — dia tetap "aksen kedua" di setiap scene yang memakainya.
 *
 * candleGreen / candleRed hanya boleh muncul di badan candle dan sumbunya.
 */
import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

loadFont("normal", { weights: ["400", "500", "600", "700", "800"] });

// Palet DASAR. Bagian yang berpindah warna di tengah episode diatur di
// palette.tsx (SEGMENTS) — bukan di sini.
const PALETTE: PaletteName = "terang";

export type PaletteName = "terang" | "gelap" | "kertas" | "ungu";

export type Palette = {
  bg: string;
  ink: string;
  slate: string;
  indigo: string;
  cyan: string;
  candleGreen: string;
  candleRed: string;
  indigoTint8: string;
  indigoTint14: string;
  indigoTintMA1: string;
  indigoTintMA2: string;
  indigoSoft: string;
  cyanSoft: string;
  cardBg: string;
  border: string;
  muted: string;
};

export const PALETTES: Record<PaletteName, Palette> = {
  // Asli: hue terkunci indigo 247 / cyan 192.
  terang: {
    bg: "#F5F5F5",
    ink: "#000000",
    slate: "#626266",
    indigo: "#5F4DEE",
    cyan: "#5CC8E3",
    candleGreen: "#22B573",
    candleRed: "#E5475D",
    indigoTint8: "rgba(95, 77, 238, 0.08)",
    indigoTint14: "rgba(95, 77, 238, 0.14)",
    indigoTintMA1: "#8F82F4",
    indigoTintMA2: "#BDB4F9",
    indigoSoft: "#EFEDFE",
    cyanSoft: "#EDFDFE",
    cardBg: "#FFFFFF",
    border: "#DEDEE0",
    muted: "#B9B9BD",
  },
  // Arah 1 — tanahnya dibalik. Rona merek dipertahankan, hanya diangkat
  // terangnya supaya tetap terbaca di atas hitam. Candle jadi jauh lebih kuat.
  gelap: {
    bg: "#171717",
    ink: "#F2F2F2",
    slate: "#9A9AA2",
    indigo: "#8B7AF7",
    cyan: "#6FD4EC",
    candleGreen: "#2ED18A",
    candleRed: "#FF5E72",
    indigoTint8: "rgba(139, 122, 247, 0.14)",
    indigoTint14: "rgba(139, 122, 247, 0.24)",
    indigoTintMA1: "#9E92F7",
    indigoTintMA2: "#7268CF",
    indigoSoft: "#262041",
    cyanSoft: "#17303A",
    cardBg: "#1F1F21",
    border: "#34343A",
    muted: "#5A5A62",
  },
  // Arah 2 — tanah kertas hangat. Indigo merek dipertahankan; cyan diganti
  // terakota, satu-satunya tempat aturan rona sengaja dilanggar.
  kertas: {
    bg: "#F4EFE7",
    ink: "#1C1917",
    slate: "#6E6358",
    indigo: "#5F4DEE",
    cyan: "#C4622F",
    candleGreen: "#1E9A63",
    candleRed: "#CB4A3C",
    indigoTint8: "rgba(95, 77, 238, 0.08)",
    indigoTint14: "rgba(95, 77, 238, 0.14)",
    indigoTintMA1: "#8F82F4",
    indigoTintMA2: "#BDB4F9",
    indigoSoft: "#ECE9FC",
    cyanSoft: "#F8E7DA",
    cardBg: "#FBF7F0",
    border: "#E3D9CA",
    muted: "#B9AB98",
  },
  // Penanda bagian CONTOH. Tidak dipakai di episode ini — disimpan supaya
  // mesin pergantian paletnya tetap utuh kalau nanti dibutuhkan. Ungunya
  // sengaja dijauhkan dari indigo merek: rona 282° vs 247°, dan lebih condong
  // ke merah, supaya terbaca sebagai ruang lain — bukan indigo yang meleset.
  ungu: {
    // Latarnya sengaja SAMA dengan bagian penjelasan. Yang menandai bagian
    // contoh adalah aksen, teks dan kartunya — bukan warna tanahnya.
    bg: "#F5F5F5",
    ink: "#2E1A3D",
    slate: "#6B5580",
    indigo: "#7A2FB0",
    cyan: "#1F8FA8",
    candleGreen: "#1B8F5A",
    candleRed: "#C93A50",
    indigoTint8: "rgba(122, 47, 176, 0.10)",
    indigoTint14: "rgba(122, 47, 176, 0.18)",
    indigoTintMA1: "#9E6CC8",
    indigoTintMA2: "#C3A5DE",
    indigoSoft: "#F0E4FA",
    cyanSoft: "#DFF1F5",
    cardBg: "#FBF6FE",
    border: "#C9B3DC",
    muted: "#A38CB8",
  },
};

// Elevasi ikut palet: bayangan hitam tidak terbaca di atas latar hitam.
const SHADOWS: Record<PaletteName, { rest: string; lift: string }> = {
  terang: { rest: "0 10px 24px rgba(0, 0, 0, 0.05)", lift: "0 24px 42px rgba(0, 0, 0, 0.10)" },
  gelap: { rest: "0 10px 24px rgba(0, 0, 0, 0.45)", lift: "0 24px 42px rgba(0, 0, 0, 0.65)" },
  kertas: { rest: "0 10px 24px rgba(60, 45, 30, 0.06)", lift: "0 24px 42px rgba(60, 45, 30, 0.12)" },
  ungu: { rest: "0 10px 24px rgba(52, 24, 78, 0.10)", lift: "0 24px 42px rgba(52, 24, 78, 0.18)" },
};

export const theme = {
  canvas: { width: 1920, height: 1080, fps: 30 },
  layout: {
    safeLeft: 96,
    safeRight: 96,
    safeTop: 54,
    safeBottom: 108, // subtitle zone — must remain visually empty
    activeW: 1728,
    activeH: 918,
    logoZoneW: 360,
    logoZoneH: 150,
    logoMaxContentX: 1368, // content in the top 150px must end at x <= this
  },
  colors: PALETTES[PALETTE],
  type: {
    family: "Plus Jakarta Sans",
    display: { size: 96, weight: 800 },
    header: { size: 48, weight: 700 },
    label: { size: 36, weight: 600 },
    chip: { size: 36, weight: 600 },
    numeral: { size: 48, weight: 700 },
    axis: { size: 26, weight: 500 },
  },
  radius: { card: 16, cardLg: 24, chip: 16 },
  stroke: { hair: 1, rule: 2 },
  // Two card elevations; scenes crossfade between them rather than authoring
  // shadow values inline.
  shadow: SHADOWS[PALETTE],
  motion: {
    ease: Easing.bezier(0.22, 1, 0.36, 1), // no overshoot
    // Symmetric ease-in-out: slow, fast, slow. Its peak velocity sits exactly at
    // the midpoint, which is where a cut-on-action wants to land.
    easeInOut: Easing.bezier(0.65, 0, 0.35, 1),
    revealFrames: 12,
    fadeFrames: 10,
  },
} as const;
