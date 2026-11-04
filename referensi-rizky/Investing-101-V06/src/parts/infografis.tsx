import React from 'react';
import { B, F, rgba } from '../theme';
import { Icon, skalaPop } from './kit';
import type { KunciIkon } from '../ikon';

/**
 * GAYA INFOGRAFIS — acuan Simon 13 Okt (Scene 04): "buat persis seperti referensi … posisinya sudah benar".
 * Diukur dari acuan (626 px):
 *   · PUSAT  = cakram putih bertingkat: bibir luar abu sangat muda (gradasi + bayang jatuh) + cakram putih di dalam (Ø 0,88),
 *              teks 2 baris di tengah (tebal gelap + tipis abu, KAPITAL), cincin abu tipis di luarnya (r × 1,17) dengan titik putih bertepi warna;
 *   · SIMPUL = lingkaran putih berbayang yang MENEMPEL di atas cincin warna tebal (tebal 0,36 r, ujung terpotong rata), ikon gelap kecil,
 *              label KAPITAL tebal di bawah (Simon 13 Okt: nomor 01–05 & teks persen DIHAPUS — porsi cukup diwakili busurnya).
 * Busur simpul = PEMBAGIAN UANG (Simon 13 Okt: 50 · 20 · 10 · 10 · 10 %): mulai jam 12 searah jarum jam sepanjang persen × 360°,
 * di atas jalur abu sangat muda (sisa 100 %) supaya porsinya terbaca. Hanya warna brand.
 */
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const BAYANG = `0 16px 34px -12px ${rgba(B.night, 0.26)}, 0 3px 8px ${rgba(B.night, 0.07)}`;
export const CINCIN_ABU = '#DCDCE2';
/** jalur busur (sisa 100 %) — abu sangat muda */
const JALUR = '#EEEEF2';

/** jarak cincin abu dari tepi cakram pusat (acuan: r cincin = 1,17 r cakram) */
export const CINCIN_JARAK = 24;

/**
 * PUSAT. `putih` 0 = dompet biru Scene 03/05 (lingkaran warna + ikon dompet putih) · 1 = cakram infografis (silang-pudar).
 * `teks` = kepekatan teks. `titik` = titik di cincin abu (sudut radian, warna, kepekatan pop).
 */
export const DompetInfo: React.FC<{ x: number; y: number; d: number; warna: string; putih: number; teks?: number; baris1?: string; baris2?: string;
  ikon?: KunciIkon; titik?: { sudut: number; warna: string; p: number }[] }> =
  ({ x, y, d, warna, putih, teks = 0, baris1 = '', baris2 = '', ikon = 'dompet', titik = [] }) => {
    const r = d / 2, rc = r + CINCIN_JARAK, ri = r * 0.88;
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: geser(x, y) }}>
        {/* cincin abu tipis + titik bertepi warna */}
        {putih > 0.001 ? (
          <svg width={2 * rc + 40} height={2 * rc + 40} style={{ position: 'absolute', left: -rc - 20, top: -rc - 20, overflow: 'visible', opacity: putih }}>
            <circle cx={rc + 20} cy={rc + 20} r={rc} fill="none" stroke={CINCIN_ABU} strokeWidth={2.5} />
            {titik.map((t, i) => t.p > 0.001 ? (
              <circle key={i} cx={rc + 20 + Math.cos(t.sudut) * rc} cy={rc + 20 + Math.sin(t.sudut) * rc} r={9 * t.p} fill={B.white} stroke={t.warna} strokeWidth={3.5} />) : null)}
          </svg>) : null}
        {/* dompet biru (gaya Scene 03 / 05) */}
        {putih < 0.999 ? (
          <div style={{ position: 'absolute', left: -r, top: -r, width: d, height: d, borderRadius: '50%', background: warna, display: 'grid', placeItems: 'center',
            boxShadow: `0 18px 40px -12px ${warna}aa`, opacity: 1 - putih }}>
            <Icon name={ikon} size={d * 0.52} color={B.white} />
          </div>) : null}
        {/* cakram infografis: bibir luar + cakram putih + teks */}
        {putih > 0.001 ? (
          <div style={{ position: 'absolute', left: -r, top: -r, width: d, height: d, opacity: putih }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(160deg, #FFFFFF 0%, #F1F1F4 55%, #E9E9EE 100%)',
              boxShadow: `0 14px 28px -12px ${rgba(B.night, 0.30)}, 0 4px 10px ${rgba(B.night, 0.06)}` }} /> {/* bayang berhenti ±r+30 (tidak sampai subtitle) */}
            <div style={{ position: 'absolute', left: r - ri, top: r - ri, width: 2 * ri, height: 2 * ri, borderRadius: '50%', background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFBFC 100%)',
              boxShadow: `0 8px 18px -6px ${rgba(B.night, 0.16)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {teks > 0.001 ? <>
                <div style={{ fontFamily: F, fontSize: d * 0.118, fontWeight: 800, color: B.night, opacity: teks, whiteSpace: 'nowrap', lineHeight: 1.1, letterSpacing: '.02em' }}>{baris1}</div>
                <div style={{ fontFamily: F, fontSize: d * 0.118, fontWeight: 500, color: B.grayLite, opacity: teks, whiteSpace: 'nowrap', lineHeight: 1.1, letterSpacing: '.02em' }}>{baris2}</div>
              </> : null}
            </div>
          </div>) : null}
      </div>);
  };

/** jari-jari luar simpul (cincin warna) untuk tata letak label */
export const simpulLuar = (d: number) => d / 2 + d * 0.18;

/**
 * SIMPUL: lingkaran putih Ø`d` berbayang menempel di atas cincin warna tebal (0,36 r). Busur = `persen` × 360° mulai jam 12 searah jarum jam,
 * tergambar sesuai `busur` (0…1), di atas jalur abu muda. `p` = skala pop berporos di pusat.
 */
export const SimpulInfo: React.FC<{ x: number; y: number; d: number; warna: string; ikon: KunciIkon; persen: number; p: number; busur: number;
  ikonSkala?: number }> = ({ x, y, d, warna, ikon, persen, p, busur, ikonSkala = 1 }) => {
  if (p <= 0.001) return null;
  const r = d / 2, tebal = d * 0.18, rb = r + tebal / 2 - 1; // cincin menempel (tanpa celah) di bawah lingkaran putih
  const a0 = -Math.PI / 2, a1 = a0 + 2 * Math.PI * persen * busur;
  const besar = a1 - a0 > Math.PI ? 1 : 0;
  const pt = (a: number) => `${(rb * Math.cos(a)).toFixed(2)} ${(rb * Math.sin(a)).toFixed(2)}`;
  const kotak = rb + tebal;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `${geser(x, y)} scale(${skalaPop(p)})` }}>
      <svg width={2 * kotak} height={2 * kotak} viewBox={`${-kotak} ${-kotak} ${2 * kotak} ${2 * kotak}`} style={{ position: 'absolute', left: -kotak, top: -kotak, overflow: 'visible' }}>
        <circle cx={0} cy={0} r={rb} fill="none" stroke={JALUR} strokeWidth={tebal} />
        {busur > 0.001 ? <path d={`M ${pt(a0)} A ${rb} ${rb} 0 ${besar} 1 ${pt(a1)}`} fill="none" stroke={warna} strokeWidth={tebal} strokeLinecap="butt" /> : null}
      </svg>
      <div style={{ position: 'absolute', left: -r, top: -r, width: d, height: d, borderRadius: '50%', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F7F9 100%)',
        boxShadow: BAYANG, display: 'grid', placeItems: 'center' }}>
        <Icon name={ikon} size={d * 0.4 * ikonSkala} color={B.night} />
      </div>
    </div>);
};
