import React, { useContext } from 'react';
import { KonteksBayanganGelap } from '../skala';
import { B, bayanganDengan, SISI } from '../theme';
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
export const Kendaraan: React.FC<{ x: number; y: number; d: number; warna: string; ikon: KunciIkon; cermin: boolean; p: number; alfa?: number; cincin?: boolean;
  /** POP ikon sendiri (linear 0…1) — lingkaran sudah ada (cakram masker mendarat), ikonnya muncul (Simon 23 Okt: "ikonnya pop up") */ ikonP?: number }> =
  ({ x, y, d, warna, ikon, cermin, p, alfa = 1, ikonP = 1 }) => { const gelap = useContext(KonteksBayanganGelap); return (
  p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${warna}`, boxSizing: 'border-box',
      display: 'grid', placeItems: 'center', transformOrigin: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${skalaPop(p)})`, opacity: alfa < 1 ? alfa : undefined,
      boxShadow: bayanganDengan(warna, gelap) }}>
      {/* brief Video 04: kendaraan = gambar garis V04 (dijiplak) — kini berwarna jalur di atas putih; ikon lain tetap */}
      {ikonP > 0.001 ? <div style={{ display: 'grid', placeItems: 'center', transform: ikonP < 0.9999 ? `scale(${skalaPop(ikonP)})` : undefined }}>
        {GARIS[ikon] ? <GarisDalam ikon={ikon} d={d} warna={warna} /> : <Icon name={ikon} size={d * 0.68} color={warna} style={cermin ? { transform: 'scaleX(-1)' } : undefined} />}
      </div> : null}
    </div>)); };

/** PETA BAB (S01 akhir · S06 "urutannya"): tiga kendaraan bernomor berjajar. 23 Okt (Simon: "perbesar sekitar 30% lagi 3 icon itu, alignment di tengah
 *  frame, spacing konsisten"): Ø220 → Ø286, x SIMETRIS di 960 (dulu 592/972/1352 — tengah 972), jarak antarpusat sama 430; y dipusatkan (ikon atas
 *  321 … label 673 → 497). */
export const BAB_PETA = { y: 464, d: 286, x: [530, 960, 1390], labelDy: 189 };

/** KIPAS KERUMUNAN "kebanyakan / banyak orang" (Simon 23 Okt S01: "tambahkan lebih banyak icon orang 7 icon lagi, perkecil juga lingkaran dengan orang
 *  asli"): 9 avatar Ø64 di busur jari-jari 165 dari pusat lingkaran investor KECIL (Ø140), sudut −84°…+84° tiap 21° (tali busur 61 px — tak bertumpuk;
 *  avatar teratas 13 px di atas puncak kepala). `urut` = jarak dari tengah (pop dari tengah ke luar). */
export const INVESTOR_KECIL = 140;
export const kipasKerumunan = (x: number, yKecil: number) => Array.from({ length: 9 }, (_, i) => {
  const th = ((-84 + i * 21) * Math.PI) / 180;
  return { x: x + 165 * Math.sin(th), y: yKecil - 165 * Math.cos(th), d: 64, urut: Math.abs(i - 4) };
});

/** pusat Scene 02: lingkaran jalan kaki yang datang dari peta bab Scene 01 (serah-terima tanpa potongan) */
export const S02_PUSAT = { x: 360, y: 497, d: 200 }; // 24 Okt: y 520 → 497 — tiga kartu aset (287/497/707) + kelompok lingkaran = TENGAH frame tanpa geser kamera // relayout 22 Okt: posisi lingkaran jalan kaki di papan A Scene 02 (serah-terima dari peta bab S01 di "dana")
/** S02 butir 1 (Simon 23 Okt: "buat agar iconnya diposisi sekarang, tapi pastikan berada ditengah frame"): lingkaran jalan kaki dari peta bab mendarat
 *  di S02_AWAL — lingkaran + uang Rp10.000.000 sendirian = di TENGAH frame (terukur) — lalu bersama uangnya bergeser ke posisinya sekarang (S02_PUSAT)
 *  memberi ruang saat garis & kartu deposito masuk. */
export const S02_GESER_A = 410;
/** 24 Okt: lingkaran + label + uang + pil sendirian bertinta 397…659 di y 497 → dinaikkan 31 px supaya pusatnya 497; turun bersama geser kiri */
export const S02_AWAL = { x: S02_PUSAT.x + S02_GESER_A, y: S02_PUSAT.y - 31, d: S02_PUSAT.d };
