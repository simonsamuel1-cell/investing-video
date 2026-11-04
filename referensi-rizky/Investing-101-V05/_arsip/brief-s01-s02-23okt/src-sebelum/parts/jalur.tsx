import React from 'react';
import { B, bayanganKecil, SISI } from '../theme';
import { Icon, skalaPop } from './kit';
import { geser } from './umum';
import { KunciIkon } from '../ikon';
import { GARIS, GarisDalam } from './v04';

/**
 * METAFORA SUNGAI (Video 05) — satu warna & satu ikon per jalur, dipakai SEMUA scene supaya penonton mengenali jalurnya:
 * jalan kaki = investasi relatif stabil (turkis) · feri = reksa dana indeks (Neon Blue) · speedboat + kapten = reksa dana saham (ungu muda) ·
 * pesawat sendiri = memilih saham sendiri (oranye).
 */
export const JALUR_WARNA = { jalan: B.turq, feri: B.blue, speedboat: B.blueLite, pesawat: B.orange } as const;
export const JALUR_IKON: Record<keyof typeof JALUR_WARNA, { ikon: KunciIkon; cermin: boolean }> = {
  jalan: { ikon: 'jalanKaki', cermin: false }, feri: { ikon: 'feri', cermin: true }, speedboat: { ikon: 'speedboat', cermin: true }, pesawat: { ikon: 'pesawat', cermin: false },
};

/** lingkaran kendaraan — IKON LINGKARAN DIBALIK (Simon 22 Okt sore): lingkaran PUTIH, outline warna jalur (SISI px), gambar garis/ikon warna jalur
 *  (kapal & speedboat dicerminkan supaya haluannya menghadap seberang). `cincin` (lama: cincin putih di atas air) kini tak diperlukan — badan sudah putih. */
export const Kendaraan: React.FC<{ x: number; y: number; d: number; warna: string; ikon: KunciIkon; cermin: boolean; p: number; alfa?: number; cincin?: boolean }> = ({ x, y, d, warna, ikon, cermin, p, alfa = 1 }) => (
  p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`, boxSizing: 'border-box',
      display: 'grid', placeItems: 'center', transformOrigin: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`, opacity: alfa < 1 ? alfa : undefined,
      boxShadow: bayanganKecil(warna) }}>
      {/* brief Video 04: kendaraan = gambar garis V04 (dijiplak) — kini berwarna jalur di atas putih; ikon lain tetap */}
      {GARIS[ikon] ? <GarisDalam ikon={ikon} d={d} warna={warna} /> : <Icon name={ikon} size={d * 0.68} color={warna} style={cermin ? { transform: 'scaleX(-1)' } : undefined} />}
    </div>));

/** pusat Scene 02: lingkaran jalan kaki yang datang dari peta bab Scene 01 (serah-terima tanpa potongan) */
export const S02_PUSAT = { x: 360, y: 520, d: 200 }; // relayout 22 Okt: posisi lingkaran jalan kaki di papan A Scene 02 (serah-terima dari peta bab S01 di "dana")
