import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, CORET, F, R, io, lerp } from '../theme';
import { cin, popOut } from '../parts/kit';
import { popIn } from '../parts/pop';
import { PilNominal, rpPenuh } from '../parts/nominal';
import { Judul } from '../parts/judul';
import { Bulat, Label, denyut } from '../parts/umum';
import { Kaca, bayanganKaca, geser } from '../parts/kaca';
import type { KunciIkon } from '../ikon';

/**
 * SCENE 02 — IDE VISUAL BARU (Simon 13 Okt, menggantikan versi "dua nominal + garis waktu"):
 *   Adegan 1 — Dua kebutuhan berbeda: satu tumpukan uang di tengah, lalu terbagi dua — kiri untuk kebutuhan BULAN DEPAN (tagihan), kanan untuk
 *              tujuan LIMA TAHUN LAGI (rumah).
 *   Adegan 2 — Risiko yang berbeda: uang bulan depan masuk ke DOMPET dan tetap STABIL; uang lima tahun lagi bersama GRAFIK INVESTASI yang naik-turun
 *              (bisa berfluktuasi — tidak digambarkan pasti untung: berakhir hanya sedikit di atas awal sesudah dua penurunan dalam).
 *   Adegan 3 — Pisahkan berdasarkan kebutuhan: kedua kelompok uang bergerak ke WADAH terpisah dan berhenti berdampingan; KALENDER 1 bulan vs 5 tahun.
 *   Catatan Simon: transisi mengalir (benda yang sama berpindah, bukan ganti slide) · terbaca tanpa VO · 2D flat, bersih, sederhana.
 *   TEXT naskah tetap: "Waktu berbeda · Tujuan berbeda" · "[Penempatan] juga berbeda".
 * Waktu (kata VO, Scene 02 = 21 dtk):
 *   A  "Karena uang yang akan dipakai bulan depan, tentu nggak seharusnya diperlakukan sama dengan uang yang baru akan dipakai lima tahun lagi."
 *        tumpukan di "uang" · terbagi dua di "dipakai" · tagihan + "Dipakai bulan depan" di "bulan depan" · slot "?" kanan di "tentu" · "=" dicoret
 *        jadi "≠" di "diperlakukan sama" · tumpukan kanan berdenyut di "uang" · rumah + "Dipakai 5 tahun lagi" di "lima tahun"
 *   B  "Waktu penggunaannya berbeda, kemampuan untuk menghadapi naik-turunnya investasi juga berbeda."
 *        judul TEXT 1 · kartu grafik tumbuh di belakang tiap tumpukan: kiri tumpukan MASUK DOMPET, garis datar (stabil), nominal tetap · kanan
 *        tumpukan jadi lencana, garis naik-turun di "naik-turunnya investasi", nominal berjalan ▲▼ · kedua kartu berdenyut di "juga berbeda"
 *   C  "Jadi sebelum memilih produk, pisahkan dulu uangnya berdasarkan kebutuhan."
 *        kartu grafik keluar, dompet & tumpukan kembali besar · di "pisahkan" dua WADAH muncul berdampingan dan tiap kelompok (uang + kebutuhan +
 *        label) bergerak masuk · kalender "1 bulan" / "5 tahun" di "berdasarkan kebutuhan" · judul TEXT 2 (sorot "Penempatan")
 * Foto uang = "Tumpukan Uang Rupiah Indonesia" Simon (Video 02 Scene 13). KELUAR: kedua kelompok menyatu jadi satu tumpukan di tengah
 * (serah-terima ke Scene 03, S02_GABUNG / TUMPUK_S3 tidak berubah).
 */

const [uang1, dipakai1, bulan, tentu, nggak, seharusnya, diperlakukan, sama, dengan, uang2, baru, akan2, lima, tahun, waktu, penggunaannya, berbeda1, kemampuan, menghadapi, investasi, juga, berbeda2,
  jadi, produk, pisahkan, uangnya, berdasarkan, kebutuhan] = urut([
  'uang', 'dipakai', 'bulan', 'tentu', 'nggak', 'seharusnya', 'diperlakukan', 'sama', 'dengan', 'uang', 'baru', 'akan', 'lima', 'tahun', 'waktu', 'penggunaannya', 'berbeda', 'kemampuan', 'menghadapi',
  'investasi', 'juga', 'berbeda', 'jadi', 'produk', 'pisahkan', 'uangnya', 'berdasarkan', 'kebutuhan'], BATAS.s2);

const T = {
  // +20: tumpukan tumbuh sesudah isi Scene 01 turun melewati tengah (S01_KELUAR, s2+4…s2+64) — tanpa tumpang tindih
  tumpuk: uang1 + 20, bagi: dipakai1 + 10, ikonL: bulan, labelL: bulan + 20, slotR: tentu, samaDengan: diperlakukan, coret: sama + 10, denyutR: uang2,
  ikonR: lima, labelR: tahun + 10, tsOut: waktu,
  // isi jendela diam A (pindai 13 Okt): dua bagian berdenyut bergantian di "NGGAK SEHARUSNYA" · "≠" berdenyut sesudah dicoret & di "dengan" ·
  // slot "?" kanan berdenyut di "yang BARU AKAN dipakai"
  denyutBanding: [nggak, seharusnya], denyutTS: [sama, dengan], denyutSlot: [baru, akan2],
  judul1: waktu + 24, kartu: penggunaannya, keLencana: penggunaannya + 10, pil: berbeda1, garisL: [kemampuan - 20, kemampuan + 60], garisR: [menghadapi, investasi + 50],
  denyutKartu: [juga, berbeda2],
  // wadah tumbuh BERSAMAAN dengan kelompok yang bergerak masuk (dulu wadah dulu → uang kanan sempat separuh di luar wadah)
  kartuOut: jadi, denyutKelompok: produk, wadah: pisahkan + 14, masuk: pisahkan + 20, kalender: [berdasarkan, berdasarkan + 16], denyutWadah: kebutuhan + 10,
  judul2: pisahkan + 30, sorot2: uangnya + 30,
};

/* ── tata letak ── */
const TUMPUK = { x: 960, y: 530, w: 320 }; // satu tumpukan (A awal) — sendirian di tengah layar, naik ke baris uang saat terbagi
const KOL = { L: 600, R: 1320 }; // dua kelompok (A–B)
const Y_UANG = 430, Y_IKON = 640, Y_LABEL = 728;
const W_BAGI = 270; // lebar tiap bagian sesudah terbagi
const RASIO = 520 / 441;
const KARTU = { w: 460, h: 250, y: 430 }; // kartu grafik (B)
const LENCANA_DX = -KARTU.w / 2 + 58; // lencana dompet / tumpukan kecil di kiri kartu
const GARIS = { x0: -KARTU.w / 2 + 112, x1: KARTU.w / 2 - 30, amp: 82 };
const Y_PIL = 270;
/** wadah berdampingan (C): pusat x, isi bertingkat kalender · uang · kebutuhan · label */
const WADAH = { x: { L: 740, R: 1180 }, y: 590, w: 400, h: 560 };
const DI_WADAH = { kalender: 398, uang: 572, ikon: 738, label: 818 };
const NILAI = 6_500_000;

/** harga ilustratif 5 tahun (tanpa nama produk): naik-turun tajam, dua penurunan dalam, berakhir hanya sedikit di atas awal — BUKAN "pasti untung" */
const KUNCI: [number, number][] = [[0, 1.0], [8, 1.12], [16, 0.93], [24, 1.07], [32, 0.84], [40, 0.99], [48, 1.15], [54, 0.96], [60, 1.05]];
const HARGA = Array.from({ length: 61 }, (_, i) => {
  const j = KUNCI.findIndex(([m]) => m >= i);
  const [m1, v1] = KUNCI[Math.max(0, j)], [m0, v0] = KUNCI[Math.max(0, j - 1)];
  const t = m1 === m0 ? 0 : (i - m0) / (m1 - m0);
  const riak = i === 0 || i === 60 ? 0 : 0.018 * Math.sin(i * 1.7) + 0.01 * Math.sin(i * 3.1 + 0.6);
  return v0 + (v1 - v0) * (0.5 - 0.5 * Math.cos(Math.PI * t)) + riak;
});
const HARGA_LO = Math.min(...HARGA), HARGA_HI = Math.max(...HARGA);
const yHarga = (v: number) => Y_UANG + GARIS.amp - ((v - HARGA_LO) / (HARGA_HI - HARGA_LO)) * 2 * GARIS.amp; // relatif kartu: tengah = Y_UANG

type Sisi = 'L' | 'R';
const SISI: Record<Sisi, { warna: string; ikon: KunciIkon; label: string; n: string; unit: string }> = {
  L: { warna: B.blue, ikon: 'tagihan', label: 'Dipakai bulan depan', n: '1', unit: 'bulan' },
  R: { warna: B.orange, ikon: 'dpRumah', label: 'Dipakai 5 tahun lagi', n: '5', unit: 'tahun' },
};

/** KELUAR Scene 02 = milik Scene 03 (aturan V02): wadah, kalender, kebutuhan & label keluar 60f mulai di batas ("Cara paling sederhana"); kedua kelompok
 *  uang MENYATU di tengah (posisi & ukuran tumpukan Scene 03) — Scene 03 mengambil alih tumpukan itu lalu membaginya jadi tiga. */
export const S02_KELUAR = BATAS.s3 + 30;
export const S02_GABUNG = BATAS.s3 + 50;
/** tumpukan Scene 03 (titik serah-terima): pusat & lebar */
export const TUMPUK_S3 = { x: 960, y: 540, w: 300 };

export const Scene02: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s2 || f >= BATAS.s3 + 82) return null;
  const kel = cin(f, S02_KELUAR), gab = cin(f, S02_GABUNG);
  const bagi = cin(f, T.bagi);
  const kartuOut = cin(f, T.kartuOut);
  const kartu = (s: Sisi) => popIn(f, T.kartu + (s === 'R' ? 16 : 0)) * (1 - kartuOut);
  const keLencana = cin(f, T.keLencana) * (1 - kartuOut); // A→B: uang mengecil ke lencana kartu; C: kembali besar
  const masuk = cin(f, T.masuk); // C: kelompok bergerak ke wadah
  const kolX = (s: Sisi) => lerp(KOL[s], WADAH.x[s], masuk);
  return (
    <AbsoluteFill>
      {/* ═════════ C: dua wadah berdampingan (di belakang isi) ═════════ */}
      {(['L', 'R'] as Sisi[]).map((s) => (
        <Kaca key={`w${s}`} x={WADAH.x[s]} y={WADAH.y} w={WADAH.w} h={WADAH.h} warna={SISI[s].warna} tab="atas" tabTebal={14} rona={0.6} radius={34}
          p={popIn(f, T.wadah + (s === 'R' ? 16 : 0)) * (1 + denyut(f, T.denyutWadah + (s === 'R' ? 14 : 0), 0.03)) * (1 - kel)} />))}

      {/* ═════════ B: kartu grafik di belakang tiap kelompok ═════════ */}
      {(['L', 'R'] as Sisi[]).map((s) => {
        const p = kartu(s) * (1 + denyut(f, T.denyutKartu[s === 'L' ? 0 : 1], 0.04));
        if (p <= 0.001) return null;
        const x = KOL[s];
        const kiri = s === 'L';
        const g = kiri ? R(f, T.garisL[0], T.garisL[1], 0, 1, io) : R(f, T.garisR[0], T.garisR[1], 0, 1); // kanan linear: grafik berjalan sepanjang kalimat
        const n = HARGA.length - 1, kepala = g * n, i0 = Math.floor(kepala), fr = kepala - i0;
        const v = kiri ? 1 : i0 >= n ? HARGA[n] : lerp(HARGA[i0], HARGA[i0 + 1], fr);
        const xs = (t: number) => x + GARIS.x0 + t * (GARIS.x1 - GARIS.x0);
        const titik: string[] = [];
        if (kiri) { if (g > 0.001) titik.push(`${xs(0)},${Y_UANG}`, `${xs(g)},${Y_UANG}`); } else {
          for (let i = 0; i <= Math.min(i0, n); i++) titik.push(`${xs(i / n).toFixed(2)},${yHarga(HARGA[i]).toFixed(2)}`);
          if (i0 < n && g > 0) titik.push(`${xs(kepala / n).toFixed(2)},${yHarga(v).toFixed(2)}`);
        }
        const arah = kiri ? 0 : Math.max(-1, Math.min(1, (v - 1) * 12));
        const warnaKepala = arah < -0.05 ? ARAH.turun : arah > 0.05 ? ARAH.naik : SISI[s].warna;
        const yKepala = kiri ? Y_UANG : yHarga(v);
        return (
          <React.Fragment key={`k${s}`}>
            <Kaca x={x} y={KARTU.y} w={KARTU.w} h={KARTU.h} p={p} warna={SISI[s].warna} rona={0.5} radius={30} />
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: Math.min(1, p) }}>
              {/* garis acuan nilai awal */}
              <line x1={xs(0)} x2={xs(1)} y1={kiri ? Y_UANG : yHarga(1)} y2={kiri ? Y_UANG : yHarga(1)} stroke={B.grayLite} strokeWidth={2} strokeDasharray="7 11" strokeLinecap="round" />
              {titik.length > 1 ? <polyline points={titik.join(' ')} fill="none" stroke={SISI[s].warna} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" /> : null}
              {g > 0.001 ? <circle cx={xs(kiri ? g : kepala / n)} cy={yKepala} r={9} fill={warnaKepala} stroke={B.white} strokeWidth={3} /> : null}
            </svg>
            {/* nominal di atas kartu: kiri TETAP (stabil), kanan BERJALAN mengikuti grafik (▲ hijau / ▼ merah) */}
            <PilNominal x={x} y={Y_PIL} teks={rpPenuh(Math.round((NILAI * v) / 10000) * 10000)} arah={arah} p={popIn(f, T.pil + (kiri ? 0 : 12)) * (1 - kartuOut)} size={30} lebarMin={260} />
          </React.Fragment>);
      })}

      {/* ═════════ "≠" di antara dua bagian (A) ═════════ */}
      <TidakSama f={f} />

      {/* ═════════ dua kelompok: uang · kebutuhan · label (A → B → C) ═════════ */}
      {(['L', 'R'] as Sisi[]).map((s) => <Kelompok key={s} f={f} s={s} x={kolX(s)} bagi={bagi} keLencana={keLencana} masuk={masuk} kel={kel} gab={gab} />)}

      {/* ═════════ C: kalender di puncak wadah — 1 bulan vs 5 tahun ═════════ */}
      {(['L', 'R'] as Sisi[]).map((s) => <Kalender key={`c${s}`} x={WADAH.x[s]} y={DI_WADAH.kalender} s={s} p={popIn(f, T.kalender[s === 'L' ? 0 : 1]) * (1 - kel)} />)}

      <Judul f={f} kata={['Waktu', 'berbeda', '·', 'Tujuan', 'berbeda']} at={T.judul1} keluar={T.kartuOut} />
      <Judul f={f} kata={['Penempatan', 'juga', 'berbeda']} sorotIdx={0} at={T.judul2} sorotAt={T.sorot2} keluar={S02_KELUAR} />
    </AbsoluteFill>);
};

/** satu kelompok uang + kebutuhannya. A: bagian tumpukan (dari tengah) · B: kiri MASUK DOMPET (lencana kartu), kanan jadi tumpukan kecil di kartu ·
 *  C: kembali besar lalu bergerak ke wadahnya (uang, ikon kebutuhan, label) · keluar: uang menyatu ke tumpukan Scene 03 */
const Kelompok: React.FC<{ f: number; s: Sisi; x: number; bagi: number; keLencana: number; masuk: number; kel: number; gab: number }> = ({ f, s, x, bagi, keLencana, masuk, kel, gab }) => {
  const d = SISI[s];
  const kiri = s === 'L';
  // A: kedua bagian lahir dari SATU tumpukan di tengah (dua salinan menumpuk tepat → terlihat satu), lalu terbagi
  const p0 = popIn(f, T.tumpuk);
  if (p0 <= 0.001) return null;
  const dn = 1 + denyut(f, T.denyutKelompok + (kiri ? 0 : 12), 0.05) + (kiri ? 0 : denyut(f, T.denyutR, 0.06)) + denyut(f, T.denyutBanding[kiri ? 0 : 1], 0.06);
  // posisi uang: tengah → kolom (bagi) → lencana kartu (keLencana) → wadah (masuk, lewat x) → tumpukan Scene 03 (gab)
  const xU = lerp(lerp(lerp(TUMPUK.x, x, bagi), x + LENCANA_DX, keLencana), TUMPUK_S3.x, gab);
  const yU = lerp(lerp(lerp(lerp(TUMPUK.y, Y_UANG, bagi), Y_UANG, keLencana), DI_WADAH.uang, masuk), TUMPUK_S3.y, gab);
  const wU = lerp(lerp(lerp(TUMPUK.w, W_BAGI, bagi), 84, keLencana) * lerp(1, 0.86, masuk), TUMPUK_S3.w, gab);
  // kiri: dompet menelan uang (B), uang muncul kembali dari dompet saat menyatu ke Scene 03 (gab)
  const dompet = kiri ? Math.max(cin(f, T.keLencana + 14), 0) * (1 - gab) : 0;
  const uangAlfa = kiri ? Math.max(1 - R(f, T.keLencana - 6, T.keLencana + 24, 0, 1, io), gab) : 1;
  const yIkon = lerp(Y_IKON, DI_WADAH.ikon, masuk), yLabel = lerp(Y_LABEL, DI_WADAH.label, masuk);
  const ikonP = kiri ? popIn(f, T.ikonL) : popIn(f, T.ikonR);
  const slot = kiri ? 0 : popIn(f, T.slotR) * popOut(f, T.ikonR - 6) * (1 + T.denyutSlot.reduce((a, t) => a + denyut(f, t, 0.1), 0));
  const dDompet = lerp(lerp(76, 150, 1 - keLencana), 132, masuk);
  const xDompet = x + LENCANA_DX * keLencana;
  return (
    <>
      {/* kiri: dompet (uang bulan depan masuk ke dompet) */}
      {dompet > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, dompet) }}>
          <Bulat x={lerp(xDompet, xU, gab)} y={lerp(Y_UANG, DI_WADAH.uang, masuk)} d={dDompet * dn} warna={d.warna} ikon="dompet" p={0.99996} />
        </div>) : null}
      {/* foto uang */}
      {uangAlfa > 0.001 ? (
        <Img src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: wU, height: wU / RASIO, maxWidth: 'none', transformOrigin: 'center',
          opacity: Math.min(0.9999, uangAlfa), transform: `${geser(xU - wU / 2, yU - wU / RASIO / 2)} scale(${p0 * dn})` }} />) : null}
      {/* slot "?" kanan sampai "lima tahun" (gaya slot Video 02) */}
      {slot > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 112, height: 112, transform: `${geser(x - 56, Y_IKON - 56)} scale(${slot})`, borderRadius: '50%',
          border: `3px dashed ${B.grayLite}`, boxSizing: 'border-box', background: B.white, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 56, fontWeight: 800,
          color: B.grayLite, lineHeight: 1 }}>?</div>) : null}
      {/* kebutuhan: tagihan (bulan depan) · rumah (5 tahun lagi) + label di bawahnya */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - kel }}>
        <Bulat x={x} y={yIkon} d={lerp(112, 96, masuk)} warna={d.warna} ikon={d.ikon} p={ikonP * dn} />
        <Label x={x} y={yLabel} teks={d.label} f={f} at={kiri ? T.labelL : T.labelR} size={lerp(32, 28, masuk)} lebar={380} />
      </div>
    </>);
};

/** kalender lembar sobek (2D flat): kepala warna dengan dua cincin, angka besar + satuan */
const Kalender: React.FC<{ x: number; y: number; s: Sisi; p: number }> = ({ x, y, s, p }) => {
  if (p <= 0.001) return null;
  const d = SISI[s];
  const W = 150, H = 132, K = 36;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: 'center', transform: `${geser(x - W / 2, y - H / 2)} scale(${p})`, borderRadius: 20,
      background: B.white, boxShadow: bayanganKaca(d.warna, 0.9), overflow: 'hidden', fontFamily: F }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: K, background: d.warna }} />
      {[W * 0.3, W * 0.7].map((cx) => <div key={cx} style={{ position: 'absolute', left: cx - 6, top: K / 2 - 6, width: 12, height: 12, borderRadius: '50%', background: B.white }} />)}
      <div style={{ position: 'absolute', left: 0, right: 0, top: K + 4, textAlign: 'center', fontSize: 54, fontWeight: 800, color: B.night, lineHeight: 1 }}>{d.n}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: K + 62, textAlign: 'center', fontSize: 22, fontWeight: 700, color: d.warna, lineHeight: 1 }}>{d.unit}</div>
    </div>);
};

/** "nggak seharusnya diperlakukan sama": "=" muncul di "diperlakukan", garis coret MERAH (tag dicoret = #D51C39, V02 8 Okt) tergambar di "sama" → "≠" */
const TidakSama: React.FC<{ f: number }> = ({ f }) => {
  const p = popIn(f, T.samaDengan) * popOut(f, T.tsOut) * (1 + T.denyutTS.reduce((a, t) => a + denyut(f, t, 0.1), 0));
  if (p <= 0.001) return null;
  const c = R(f, T.coret - 30, T.coret + 30, 0, 1, io);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 100, height: 100, transformOrigin: 'center', transform: `${geser(960 - 50, Y_UANG - 50)} scale(${p})`, borderRadius: '50%',
      background: B.white, border: `3px solid ${B.blue}`, boxSizing: 'border-box', boxShadow: `0 10px 24px -10px ${B.blue}88` }}>
      <svg width={100} height={100} viewBox="0 0 100 100" style={{ position: 'absolute', left: -3, top: -3 }}>
        <path d="M 30 42 H 70 M 30 58 H 70" stroke={B.blue} strokeWidth={8} strokeLinecap="round" />
        {c > 0.001 ? <line x1={62} y1={26} x2={62 + (38 - 62) * c} y2={26 + (74 - 26) * c} stroke={CORET} strokeWidth={8} strokeLinecap="round" /> : null}
      </svg>
    </div>);
};

export const S02_T = T;
