/**
 * Watermark.tsx — tanda merek, di atas segalanya, sepanjang episode.
 *
 * PNG transparan seukuran penuh kanvas (1920 x 1080), jadi marknya sudah
 * berada di tempatnya di dalam gambar dan tidak perlu diatur letaknya di
 * sini. Theme sudah mencadangkan ruangnya lewat `LOGO_ZONE`, supaya isi
 * scene tidak pernah merangkak ke bawah logo.
 *
 * Muncul di awal dan pergi di ujung paling akhir - pola yang sama dengan
 * VIDEO 17. Logo yang menyala mendadak di frame pertama terbaca sebagai
 * kedipan; yang ikut naik bersama gambar pertama terbaca sebagai bagian
 * dari filmnya.
 *
 * Komponen sendiri, bukan langsung di Composition, semata-mata karena
 * fade-nya butuh useCurrentFrame - dan Composition sengaja dibiarkan
 * berupa satu ekspresi tanpa hook.
 */
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TOTAL_FRAMES } from "../Composition";

/** Sama dengan fade antar-scene, supaya kedatangannya tidak terasa lain. */
const FADE = 12;

export const Watermark = () => {
  const f = useCurrentFrame();
  const fade = interpolate(
    f,
    [0, FADE, TOTAL_FRAMES - FADE, TOTAL_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: fade, zIndex: 100 }}>
      {/* Ukurannya pas dengan kanvas, jadi diregangkan penuh - tidak ada
          sisa yang perlu dipusatkan. */}
      <Img
        src={staticFile("watermark.png")}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};
