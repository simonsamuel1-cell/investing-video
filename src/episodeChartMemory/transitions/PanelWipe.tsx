/**
 * PanelWipe — the transition that carries GLOBAL FRAME 488, the SC01 → SC02
 * boundary. Companion device to the CameraCut at 2385.
 *
 * ── CARA KERJANYA ───────────────────────────────────────────────────────────
 * Satu panel selebar layar penuh melintas dari kiri ke kanan dengan kurva
 * ease-in-out. Panel itu menempuh DUA lebar layar (−1920 → +1920), jadi:
 *
 *   tepi depan  (right) menghapus SC01   — 458 → 488
 *   layar tertutup penuh                 — tepat di 488
 *   tepi belakang (left) membuka SC02    — 488 → 518
 *
 * Kenapa selebar layar penuh: pada titik tengahnya panel menutupi layar PERSIS
 * satu saat, dan saat itulah batas scene berada. Jadi SC01 sudah habis terhapus
 * di frame terakhirnya (488) dan SC02 baru mulai tersingkap di frame pertamanya
 * (489) — tidak ada frame di mana keduanya bertabrakan, tanpa perlu memanjangkan
 * scene mana pun.
 *
 * Kurvanya ease-in-out, jadi kecepatan puncak panel juga jatuh di 488 — properti
 * yang sama yang dipakai CameraCut.
 *
 * Panel ini berhenti di atas zona subtitle; 108px terbawah tetap kosong.
 */
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { progressInOut } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const WIPE = {
  start: 458, // global frame panel masuk
  dur: 60, // panel keluar di start + dur (518); titik tengahnya HARUS = batas scene
};
const TINT = theme.colors.indigoSoft; // warna panel — sangat muda, sekadar agar gerakannya terbaca
// ═══════════════════════════════════════════════════════════════════════════

/** Frame layar tertutup penuh — batas scene harus ada di sini. */
export const WIPE_MID = WIPE.start + WIPE.dur / 2;

const W = theme.canvas.width;
const H = theme.canvas.height - theme.layout.safeBottom; // jangan sentuh zona subtitle

/** Posisi kedua tepi panel pada sebuah frame GLOBAL. */
export const wipePanel = (f: number) => {
  const left = interpolate(progressInOut(f, WIPE.start, WIPE.dur), [0, 1], [-W, W]);
  return { left, right: left + W };
};

/** clip-path scene yang KELUAR — menyisakan bagian yang belum dilewati panel. */
export const clipOutgoing = (f: number) => `inset(0px 0px 0px ${Math.max(0, wipePanel(f).right)}px)`;

/** clip-path scene yang MASUK — menyisakan bagian yang sudah ditinggalkan panel. */
export const clipIncoming = (f: number) => `inset(0px ${Math.max(0, W - wipePanel(f).left)}px 0px 0px)`;

/**
 * The panel itself. Mounts at the Composition level (NOT inside a Sequence) so
 * it reads global frames — it belongs to neither scene it sits between.
 */
export const PanelWipe = () => {
  const f = useCurrentFrame();
  if (f < WIPE.start || f > WIPE.start + WIPE.dur) return null;
  const { left, right } = wipePanel(f);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* The panel covers exactly the gap where neither scene is drawn. */}
      <div style={{ position: "absolute", left, top: 0, width: W, height: H, background: TINT }} />
      {/* Its edges, drawn only while they are actually on screen. */}
      {[right, left].map((x, i) =>
        x > 0 && x < W ? (
          <div key={i} style={{ position: "absolute", left: x, top: 0, width: theme.stroke.rule, height: H, background: theme.colors.indigo }} />
        ) : null,
      )}
    </AbsoluteFill>
  );
};
