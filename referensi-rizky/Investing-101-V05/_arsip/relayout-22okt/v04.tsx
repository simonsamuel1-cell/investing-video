import React from 'react';
import { Img, staticFile } from 'remotion';
import { alfaP, opa, useGeser } from './kit';
import { geser } from './umum';
import type { KunciIkon } from '../ikon';

/**
 * ILUSTRASI VIDEO 04 (brief Simon 21–22 Okt: "visual video 05 harus ngikutin video 04 … latar tetap, ilustrasi & icon video 4 yang mirip
 * dipakai kembali"; "sementara jiplak saja hal-hal yang mirip di video 4"). File asli V04 ada di laptop teman Simon → DIJIPLAK dari render
 * `024. Investing 101/Investing 101_Video 04 - Investasi yang Cocok_Dub Indo.mp4` (1080p):
 *  · gambar garis (jembatan 1:22 · feri & speedboat 1:44 · pesawat 2:01 · ombak 4:08): tinta ungu di kartu putih → topeng alfa resolusi asli
 *    (public/media/v04/garis-*.png = putih + alfa; garis-ombak-biru.png = Neon Blue + alfa)
 *  · pijakan isometrik "Kamu"/"Rumahmu" (1:10): titik sudut & warna diukur dari frame → digambar ulang (SVG di bawah); rumah = piksel asli di
 *    atas pijakan yang digambar ulang (public/media/v04/iso-rumah.png, pojok kiri pijakan di (3, 311) dari 638×519).
 */

/** gambar garis V04 pengganti ikon kendaraan (menghadap kanan — tanpa cermin); jalan kaki = jalur 1 V04 "jalan memutar lalu lewat jembatan" */
export const GARIS: Partial<Record<KunciIkon, { src: string; r: number }>> = {
  feri: { src: 'media/v04/garis-feri.png', r: 284 / 169 },
  speedboat: { src: 'media/v04/garis-speedboat.png', r: 232 / 100 },
  pesawat: { src: 'media/v04/garis-pesawat.png', r: 385 / 229 },
  jalanKaki: { src: 'media/v04/garis-jembatan.png', r: 400 / 257 },
};

/** gambar garis di dalam lingkaran berdiameter d (lebar ≤ 0,76 d, tinggi ≤ 0,56 d) */
export const GarisDalam: React.FC<{ ikon: KunciIkon; d: number }> = ({ ikon, d }) => {
  const g = GARIS[ikon];
  if (!g) return null;
  let w = d * 0.76, h = w / g.r;
  if (h > d * 0.56) { h = d * 0.56; w = h * g.r; }
  return <Img src={staticFile(g.src)} style={{ width: w, height: h, maxWidth: 'none', display: 'block' }} />;
};

/* ── PIJAKAN ISOMETRIK V04 (diukur dari 1:10: belah ketupat atas, b/a = 0,565, tebal = 0,171 a) ── */
const ATAS = '#F1EFFE', KIRI = '#D3CEFA', KANAN = '#BAB1F8';
/** pijakan berpusat di tengah permukaan atas (x, y); a = setengah lebar belah ketupat. Masuk = naik (swipe up, inOut cubic). */
export const Pijakan: React.FC<{ x: number; y: number; a: number; p: number; alfa?: number }> = ({ x, y, a, p, alfa = 1 }) => {
  const ny = useGeser();
  if (p <= 0.001 || alfa <= 0.001) return null;
  const b = a * 0.565, t = a * 0.171, w = 2 * a, h = 2 * b + t;
  return (
    <svg width={w} height={h} viewBox={`${-a} ${-b} ${w} ${h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible',
      transform: geser(x - a, y - b + ny(p)), opacity: opa(alfaP(p, alfa)) }}>
      <polygon points={`${-a},0 0,${b} 0,${b + t} ${-a},${t}`} fill={KIRI} />
      <polygon points={`0,${b} ${a},0 ${a},${t} 0,${b + t}`} fill={KANAN} />
      <polygon points={`${-a},0 0,${-b} ${a},0 0,${b}`} fill={ATAS} />
    </svg>);
};

/** RUMAH ISOMETRIK V04 ("Rumahmu"): (x, y) = POJOK KIRI pijakannya (ujung jalur), w = lebar gambar. Masuk = naik. */
export const RumahIso: React.FC<{ x: number; y: number; w: number; p: number; alfa?: number }> = ({ x, y, w, p, alfa = 1 }) => {
  const ny = useGeser();
  if (p <= 0.001 || alfa <= 0.001) return null;
  const s = w / 638;
  return <Img src={staticFile('media/v04/iso-rumah.png')} style={{ position: 'absolute', left: 0, top: 0, width: w, height: 519 * s, maxWidth: 'none',
    transform: geser(x - 3 * s, y - 311 * s + ny(p)), opacity: opa(alfaP(p, alfa)) }} />;
};
/** pusat visual rumah (untuk lencana/label) relatif pojok kiri pijakan */
export const pusatRumah = (x: number, y: number, w: number) => ({ x: x - 3 * (w / 638) + w / 2, y: y - 311 * (w / 638) + (519 * (w / 638)) / 2 });

/** OMBAK V04 (Neon Blue di latar terang), berpusat (x, y), lebar w. Masuk = naik. */
export const Ombak: React.FC<{ x: number; y: number; w: number; p: number }> = ({ x, y, w, p }) => {
  const ny = useGeser();
  if (p <= 0.001) return null;
  const h = (w * 187) / 656;
  return <Img src={staticFile('media/v04/garis-ombak-biru.png')} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, maxWidth: 'none',
    transform: geser(x - w / 2, y - h / 2 + ny(p)), opacity: opa(alfaP(p)) }} />;
};
export const tinggiOmbak = (w: number) => (w * 187) / 656;

/** gambar garis V04 BERWARNA (Neon Blue) untuk ilustrasi besar di latar terang; (x, y) = pusat, w = lebar. Masuk = naik. */
export const GARIS_BIRU = {
  jembatan: { src: 'media/v04/garis-jembatan-biru.png', r: 400 / 257 }, feri: { src: 'media/v04/garis-feri-biru.png', r: 284 / 169 },
  pesawat: { src: 'media/v04/garis-pesawat-biru.png', r: 385 / 229 }, speedboat: { src: 'media/v04/garis-speedboat-biru.png', r: 232 / 100 },
} as const;
export const GambarV04: React.FC<{ k: keyof typeof GARIS_BIRU; x: number; y: number; w: number; p: number; alfa?: number }> = ({ k, x, y, w, p, alfa = 1 }) => {
  const ny = useGeser();
  if (p <= 0.001 || alfa <= 0.001) return null;
  const h = w / GARIS_BIRU[k].r;
  return <Img src={staticFile(GARIS_BIRU[k].src)} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, maxWidth: 'none',
    transform: geser(x - w / 2, y - h / 2 + ny(p)), opacity: opa(alfaP(p, alfa)) }} />;
};
