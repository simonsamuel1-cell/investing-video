import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, CORET, F, R, io, lerp } from '../theme';
import { cin, Icon, popOut, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { Judul } from '../parts/judul';
import { INSTRUMEN } from '../s01/Scene01';
import type { KunciIkon } from '../ikon';

/**
 * SCENE 02 — IDE VISUAL (13 Okt). Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  Dua nominal yang sama: Dipakai bulan depan vs. Dipakai 5 tahun lagi ↓ Masuk ke dua jalur berbeda.
 *   TEXT    Waktu berbeda · Tujuan berbeda · Penempatan juga berbeda  (1.431 px pada 50 px → dipecah di "·" jadi dua judul berurutan)
 * Enam ketukan (bagian > 5 dtk dipecah):
 *   A  "Karena uang yang akan dipakai bulan depan,"                  Scene 01 turun keluar; tumpukan Rupiah kiri + Rp6.500.000 + "Dipakai bulan depan"
 *   B  "tentu nggak seharusnya diperlakukan sama"                    slot "?" kanan, ≠ di tengah
 *   C  "dengan uang yang baru akan dipakai lima tahun lagi."         tumpukan kanan (nominal SAMA) + "Dipakai 5 tahun lagi"
 *   D  "Waktu penggunaannya berbeda,"                                garis waktu tiap uang: Hari ini → 1 bulan · Hari ini → 5 tahun · judul TEXT 1
 *   E  "kemampuan … naik-turunnya investasi juga berbeda."          harga naik-turun di tiap garis waktu; nominal BERJALAN: 1 bulan berakhir ▼, 5 tahun pulih ▲
 *   F  "Jadi sebelum memilih produk, pisahkan dulu … kebutuhan."     produk ditahan (tangan stop) → pemisah tumbuh, uang berpisah → dua jalur ke dua slot "?" · judul TEXT 2
 * Foto uang = "Tumpukan Uang Rupiah Indonesia" dari Simon (Video 02 Scene 13, "uang kita").
 */

const [uang1, dipakai1, bulan, tentu, diperlakukan, sama, uang2, dipakai2, lima, tahun, waktu, penggunaannya, berbeda1, kemampuan, investasi, berbeda2,
  jadi, sebelum, memilih, pisahkan, uangnya, berdasarkan, kebutuhan] = urut([
  'uang', 'dipakai', 'bulan', 'tentu', 'diperlakukan', 'sama', 'uang', 'dipakai', 'lima', 'tahun', 'waktu', 'penggunaannya', 'berbeda', 'kemampuan', 'investasi', 'berbeda',
  'jadi', 'sebelum', 'memilih', 'pisahkan', 'uangnya', 'berdasarkan', 'kebutuhan'], BATAS.s2);

const T = {
  uangL: uang1 + 15, pilL: uang1 + 32, // +15: foto mulai tumbuh (f1155) tepat saat HP Scene 01 sudah turun melewati tempatnya — tanpa tumpang tindih, tanpa jeda kosong
  labelL: dipakai1 + 20, ikonL: bulan,
  slotR: tentu, samaDengan: diperlakukan, coret: sama, // "=" muncul di "diperlakukan", dicoret merah jadi "≠" di "sama"
  uangR: uang2, pilR: uang2 + 20, labelR: dipakai2 + 20, ikonR: lima, balik: tahun + 10, // jam pasir berputar 180° (waktu berjalan)
  judul1: waktu + 24, sumbu: waktu + 20, hariIni: penggunaannya, ujung: berbeda1,
  garisA: kemampuan - 30, garisB: investasi + 30, sama2: berbeda2,
  bersih: jadi, // garis harga & sumbu pudar, nominal kembali ke Rp6.500.000 (habis sebelum produk tumbuh)
  produk: memilih, stop: sebelum + 53, // stop = "produk," + 12
  pisah: pisahkan + 10, judul2: pisahkan + 30, sorot2: uangnya + 30,
  jalur: berdasarkan, slot: kebutuhan,
};

/* ── tata letak (ruang 1920 × 1080) — dua kolom simetris di 960 ± 400. Susunan vertikal relatif ke YP (pusat pil nominal):
 *  A–C (pil · uang · label) berpusat di y 540 → YP 355; D–F (+ garis waktu / jalur) → YP 233; kelompok NAIK bertahap 60f saat garis waktu
 *  masuk (Simon V02: geser kelompok bertahap, bukan susunan setengah jadi yang berat sebelah) ── */
const KOL = { L: 560, R: 1360 };
const YP_A = 355, YP_D = 233, YP_F = 248; // F: grafik hilang, jalur + slot di bawah → turun 15 px supaya tetap di tengah
const UANG = { w: 340, h: 288 }; // foto 520 × 441 (rasio 1,179)
const tataY = (yp: number) => ({ pil: yp, uang: yp + 190, label: yp + 374, atas: yp + 424, bawah: yp + 574, sumbu: yp + 596, teks: yp + 630, slot: yp + 554 });
const STRIP_W = 560;
const NILAI = 6_500_000;
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

/* ── deret harga ilustratif (tanpa nama produk): skala SAMA untuk kedua garis (0,84 … 1,44 → bawah … atas pita) ── */
const HARGA_1BLN = [1.0, 1.012, 0.996, 1.02, 1.03, 1.014, 1.0, 0.99, 1.006, 0.986, 0.972, 0.982, 0.966, 0.952, 0.962, 0.944, 0.932, 0.946, 0.926, 0.916, 0.921, 0.908];
const KUNCI_5THN: [number, number][] = [[0, 1.0], [6, 1.08], [12, 1.16], [18, 1.05], [24, 0.86], [30, 0.97], [36, 1.1], [42, 1.0], [48, 1.18], [54, 1.27], [60, 1.4]];
const HARGA_5THN = Array.from({ length: 61 }, (_, i) => {
  const j = KUNCI_5THN.findIndex(([m]) => m >= i);
  const [m1, v1] = KUNCI_5THN[Math.max(0, j)], [m0, v0] = KUNCI_5THN[Math.max(0, j - 1)];
  const t = m1 === m0 ? 0 : (i - m0) / (m1 - m0);
  const halus = v0 + (v1 - v0) * (0.5 - 0.5 * Math.cos(Math.PI * t));
  const riak = i === 0 || i === 60 ? 0 : 0.022 * Math.sin(i * 1.7) + 0.013 * Math.sin(i * 3.1 + 0.6);
  return halus + riak;
});
/** skala per grafik (tiap garis waktu = grafiknya sendiri; angka sebenarnya ada di pil nominal) */
const skala = (h: number[]) => { const lo = Math.min(...h), hi = Math.max(...h), pad = (hi - lo) * 0.08; return { lo: lo - pad, hi: hi + pad }; };

type Sisi = 'L' | 'R';
const SISI: Record<Sisi, { harga: number[]; warna: string; ikon: KunciIkon; label: string; ujung: string; centang: number[] }> = {
  L: { harga: HARGA_1BLN, warna: B.blue, ikon: 'kalender', label: 'Dipakai bulan depan', ujung: '1 bulan', centang: [7 / 30, 14 / 30, 21 / 30, 28 / 30] },
  R: { harga: HARGA_5THN, warna: B.orange, ikon: 'jangkaWaktu', label: 'Dipakai 5 tahun lagi', ujung: '5 tahun', centang: [0.2, 0.4, 0.6, 0.8] },
};

/** KELUAR Scene 02 = milik Scene 03 (aturan V02): label, pil, jalur, slot & pemisah keluar 60f mulai di batas ("Cara paling sederhana"); kedua tumpukan
 *  uang MENYATU di tengah (posisi & ukuran tumpukan Scene 03) — Scene 03 mengambil alih tumpukan itu lalu membaginya jadi tiga. */
export const S02_KELUAR = BATAS.s3 + 30;
export const S02_GABUNG = BATAS.s3 + 50;
/** tumpukan Scene 03 (titik serah-terima): pusat & lebar */
export const TUMPUK_S3 = { x: 960, y: 540, w: 300 };
export const Scene02: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s2 || f >= BATAS.s3 + 82) return null;
  const kel = cin(f, S02_KELUAR), gab = cin(f, S02_GABUNG);
  const Y = tataY(lerp(lerp(YP_A, YP_D, cin(f, T.sumbu)), YP_F, cin(f, T.bersih)));
  const pisah = cin(f, T.pisah);
  const kolX = (s: Sisi) => KOL[s] + (s === 'L' ? -1 : 1) * 40 * pisah; // "pisahkan dulu uangnya": dua kolom menjauh
  const bersih = cin(f, T.bersih);
  const garisP = R(f, T.garisA, T.garisB, 0, 1, io);
  return (
    <AbsoluteFill>
      {/* ≠ di tengah ("nggak … diperlakukan sama"), keluar saat pemisah tumbuh */}
      <TidakSama f={f} y={Y.uang} />
      {/* pemisah ("pisahkan") — garis putus tegak tumbuh dari tengah ke atas & bawah */}
      {pisah > 0.001 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: 1 - kel }}>
          <line x1={960} x2={960} y1={540 - 290 * pisah * (1 - kel)} y2={540 + 290 * pisah * (1 - kel)} stroke={B.grayLite} strokeWidth={3} strokeDasharray="7 11" strokeLinecap="round" />
        </svg>) : null}
      {(['L', 'R'] as Sisi[]).map((s) => <Kolom key={s} f={f} s={s} x={kolX(s)} Y={Y} bersih={bersih} garisP={garisP} kel={kel} gab={gab} />)}
      <BarisProduk f={f} y={(Y.atas + Y.bawah) / 2} />
      <Judul f={f} kata={['Waktu', 'berbeda', '·', 'Tujuan', 'berbeda']} at={T.judul1} keluar={T.bersih} />
      <Judul f={f} kata={['Penempatan', 'juga', 'berbeda']} sorotIdx={0} at={T.judul2} sorotAt={T.sorot2} keluar={S02_KELUAR} />
    </AbsoluteFill>);
};

/** satu kolom: nominal · foto uang · label · garis waktu + harga · jalur ke slot */
const Kolom: React.FC<{ f: number; s: Sisi; x: number; Y: ReturnType<typeof tataY>; bersih: number; garisP: number; kel: number; gab: number }> = ({ f, s, x, Y, bersih, garisP, kel, gab }) => {
  const d = SISI[s];
  const kiri = s === 'L';
  const uangP = popIn(f, kiri ? T.uangL : T.uangR);
  const slot = kiri ? 0 : popIn(f, T.slotR) * popOut(f, T.uangR - 6);
  const ikonP = popIn(f, kiri ? T.ikonL : T.ikonR);
  // nominal BERJALAN mengikuti kepala garis harga (Simon 9 Okt: Rp naik/turun berjalan); kembali ke nilai awal saat garis dibersihkan
  const n = d.harga.length - 1, kepala = garisP * n, i0 = Math.floor(kepala), fr = kepala - i0;
  const vKepala = i0 >= n ? d.harga[n] : lerp(d.harga[i0], d.harga[i0 + 1], fr);
  const v = lerp(vKepala, 1, bersih);
  const nominal = Math.round((NILAI * v) / 1000) * 1000;
  const arah = Math.max(-1, Math.min(1, (v - 1) * 12));
  const dn = 0.07 * Math.sin(Math.PI * R(f, T.sama2 - 20, T.sama2 + 20, 0, 1, io)); // "juga berbeda": kedua nominal berdenyut
  const pilP = popIn(f, kiri ? T.pilL : T.pilR);
  const x0 = x - STRIP_W / 2, xs = (t: number) => x0 + t * STRIP_W;
  const sk = skala(d.harga);
  const yHarga = (v: number) => Y.bawah - ((v - sk.lo) / (sk.hi - sk.lo)) * (Y.bawah - Y.atas);
  const sumbu = R(f, T.sumbu - 30, T.sumbu + 30, 0, 1, io) * (1 - bersih);
  const jalur = R(f, T.jalur - 30, T.jalur + 30, 0, 1, io);
  const slotAkhir = popIn(f, T.slot) * popOut(f, S02_KELUAR + 6);
  // titik garis harga yang sudah tergambar (kepala pecahan, bukan dibulatkan per titik — tanpa patah-patah)
  const titik: string[] = [];
  for (let i = 0; i <= Math.min(i0, n); i += 1) titik.push(`${xs(i / n).toFixed(2)},${yHarga(d.harga[i]).toFixed(2)}`);
  if (i0 < n && garisP > 0) titik.push(`${xs(kepala / n).toFixed(2)},${yHarga(vKepala).toFixed(2)}`);
  const warnaKepala = arah < -0.05 ? '#E5475D' : arah > 0.05 ? '#22B573' : d.warna;
  return (
    <>
      {/* slot "?" kanan (sebelum uang kedua disebut) — gaya slot Video 02 */}
      {slot > 0.001 ? (
        <div style={{ position: 'absolute', left: x - 130, top: Y.uang - 130, width: 260, height: 260, borderRadius: '50%', border: `3px dashed ${B.grayLite}`, background: B.white,
          transform: `scale(${slot})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 120, fontWeight: 800, color: B.grayLite, lineHeight: 1 }}>?</div>) : null}
      {uangP > 0.001 && gab < 0.999 ? (
        <Img src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: UANG.w, height: UANG.h, maxWidth: 'none', transformOrigin: 'center',
          transform: `${geser(lerp(x, TUMPUK_S3.x, gab) - UANG.w / 2, lerp(Y.uang, TUMPUK_S3.y, gab) - UANG.h / 2)} scale(${uangP * lerp(1, TUMPUK_S3.w / UANG.w, gab)})` }} />) : null}
      <PilNominal x={x} y={Y.pil} teks={rpPenuh(nominal)} arah={arah} p={pilP * (1 + dn) * popOut(f, S02_KELUAR)} size={34} lebarMin={290} />
      {/* label: ikon (kalender / jam pasir) + teks VISUAL naskah */}
      <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(x, Y.label), display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap', translate: '-50% -50%', opacity: 1 - kel }}>
        <div style={{ width: 58, height: 58, borderRadius: '50%', background: d.warna, display: 'grid', placeItems: 'center',
          transform: `scale(${ikonP}) rotate(${kiri ? 0 : 180 * R(f, T.balik - 30, T.balik + 30, 0, 1, io)}deg)` }}>
          <Icon name={d.ikon} size={34} color={B.white} />
        </div>
        <WordText halus f={f} at={kiri ? T.labelL : T.labelR} style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>{d.label}</WordText>
      </div>
      {/* garis waktu + harga naik-turun */}
      {sumbu > 0.001 ? (
        <>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - bersih }}>
            <line x1={x0} x2={x0 + STRIP_W * R(f, T.sumbu - 30, T.sumbu + 30, 0, 1, io)} y1={Y.sumbu} y2={Y.sumbu} stroke={B.gray} strokeWidth={3} strokeLinecap="round" />
            {[0, ...d.centang, 1].map((t, k) => (
              <line key={k} x1={xs(t)} x2={xs(t)} y1={Y.sumbu - (k === 0 || t === 1 ? 10 : 6)} y2={Y.sumbu + (k === 0 || t === 1 ? 10 : 6)} stroke={B.gray} strokeWidth={3}
                strokeLinecap="round" opacity={R(f, T.sumbu - 30 + 60 * t - 4, T.sumbu - 30 + 60 * t + 8, 0, 1, io)} />))}
            {/* garis acuan putus di nilai awal */}
            <line x1={x0} x2={x0 + STRIP_W} y1={yHarga(1)} y2={yHarga(1)} stroke={B.grayLite} strokeWidth={2} strokeDasharray="7 11" strokeLinecap="round" opacity={cin(f, T.garisA)} />
            {titik.length > 1 ? <polyline points={titik.join(' ')} fill="none" stroke={d.warna} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" /> : null}
            {garisP > 0.001 ? <circle cx={xs(kepala / n)} cy={yHarga(vKepala)} r={8} fill={warnaKepala} stroke={B.white} strokeWidth={3} /> : null}
          </svg>
          <div style={{ position: 'absolute', left: x0, top: Y.teks, transform: 'translateY(-50%)', opacity: 1 - bersih, whiteSpace: 'nowrap' }}>
            <WordText halus f={f} at={T.hariIni} style={{ fontFamily: F, fontSize: 27, fontWeight: 700, color: B.gray }}>Hari ini</WordText>
          </div>
          <div style={{ position: 'absolute', right: 1920 - (x0 + STRIP_W), top: Y.teks, transform: 'translateY(-50%)', opacity: 1 - bersih, whiteSpace: 'nowrap' }}>
            <WordText halus f={f} at={T.ujung} style={{ fontFamily: F, fontSize: 29, fontWeight: 800, color: d.warna }}>{d.ujung}</WordText>
          </div>
        </>) : null}
      {/* jalur ke slot penempatan ("pisahkan dulu uangnya berdasarkan kebutuhan") */}
      {jalur > 0.001 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - kel }}>
          <line x1={x} x2={x} y1={Y.label + 40} y2={Y.label + 40 + (Y.slot - 70 - 12 - Y.label - 40 - 14) * jalur} stroke={d.warna} strokeWidth={3} strokeDasharray="7 11" strokeLinecap="round" />
          <path d={`M ${x} ${Y.slot - 70 - 12} l -11 -17 l 22 0 z`} fill={d.warna} opacity={R(jalur, 0.85, 1, 0, 1)} />
        </svg>) : null}
      {slotAkhir > 0.001 ? (
        <div style={{ position: 'absolute', left: x - 70, top: Y.slot - 70, width: 140, height: 140, borderRadius: '50%', border: `3px dashed ${d.warna}`, background: B.white,
          transform: `scale(${slotAkhir})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 70, fontWeight: 800, color: d.warna, lineHeight: 1 }}>?</div>) : null}
    </>);
};

/** "nggak seharusnya diperlakukan sama": "=" muncul di "diperlakukan", lalu garis coret MERAH (tag dicoret = #D51C39, V02 8 Okt) tergambar di "sama" → "≠" */
const TidakSama: React.FC<{ f: number; y: number }> = ({ f, y }) => {
  const p = popIn(f, T.samaDengan) * popOut(f, T.pisah - 20);
  if (p <= 0.001) return null;
  const c = R(f, T.coret - 30, T.coret + 30, 0, 1, io);
  return (
    <div style={{ position: 'absolute', left: 960 - 50, top: y - 50, width: 100, height: 100, borderRadius: '50%', background: B.white, border: `3px solid ${B.blue}`,
      transform: `scale(${p})`, boxShadow: `0 10px 24px -10px ${B.blue}88` }}>
      <svg width={100} height={100} viewBox="0 0 100 100" style={{ position: 'absolute', left: -3, top: -3 }}>
        <path d="M 30 42 H 70 M 30 58 H 70" stroke={B.blue} strokeWidth={8} strokeLinecap="round" />
        {c > 0.001 ? <line x1={62} y1={26} x2={62 + (38 - 62) * c} y2={26 + (74 - 26) * c} stroke={CORET} strokeWidth={8} strokeLinecap="round" /> : null}
      </svg>
    </div>);
};

/** "Jadi sebelum memilih produk": empat instrumen (gema Scene 01) muncul di tengah lalu DITAHAN (tangan stop), keluar saat "pisahkan" */
const BarisProduk: React.FC<{ f: number; y: number }> = ({ f, y: Y }) => {
  const D = 92, JARAK = 118;
  const stop = popIn(f, T.stop) * popOut(f, T.pisah - 10);
  return (
    <>
      {INSTRUMEN.map((m, k) => {
        const p = popIn(f, T.produk + 12 * k) * popOut(f, T.pisah - 28 + 6 * k);
        if (p <= 0.001) return null;
        const x = 960 + (k - 1.5) * JARAK;
        return (
          <div key={m.ikon} style={{ position: 'absolute', left: x - D / 2, top: Y - D / 2, width: D, height: D, borderRadius: '50%', background: m.warna, display: 'grid', placeItems: 'center',
            transform: `scale(${p})`, boxShadow: `0 10px 22px -10px ${m.warna}cc` }}>
            <Icon name={m.ikon} size={D * 0.6} color={B.white} />
          </div>);
      })}
      {stop > 0.001 ? (
        <div style={{ position: 'absolute', left: 960 + 1.5 * JARAK + D / 2 - 6, top: Y - D / 2 - 40, width: 66, height: 66, borderRadius: '50%', background: B.orange, border: `3px solid ${B.white}`,
          display: 'grid', placeItems: 'center', transform: `scale(${stop})`, boxShadow: `0 10px 24px -8px ${B.orange}cc` }}>
          <Icon name="berhenti" size={38} color={B.white} />
        </div>) : null}
    </>);
};

export const S02_T = T;
