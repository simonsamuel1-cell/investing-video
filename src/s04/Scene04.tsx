import React from 'react';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, F, R, WARNA, io, lerp } from '../theme';
import { cin, Icon, popOut, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import type { KunciIkon } from '../ikon';
import { S03_DOMPET_AKTIF } from '../s03/Scene03';
import { CINCIN_JARAK, DompetInfo, SimpulInfo, simpulLuar } from '../parts/infografis';
import { JamBerjalan } from '../parts/jam';

/**
 * SCENE 04 — IDE VISUAL (13 Okt). Bab "01 — Uang Aktif". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  Makan → Sewa → Transportasi → Cicilan → Pengeluaran Mendadak ↓ UANG AKTIF
 *   TEXT    "① Uang Aktif" / "Bisa dibutuhkan kapan saja"
 * Empat ketukan:
 *   A  "Yang pertama adalah uang aktif."                          dompet Uang Aktif (dari Scene 03) disorot, dompet lain turun; dompet ke tengah · judul TEXT
 *   B  "Ini adalah uang yang sewaktu-waktu bisa kita butuhkan."   lencana jam berputar di dompet · sub-judul TEXT (sorot "kapan saja")
 *   C  "Misalnya untuk makan, bayar kos atau cicilan, transportasi, atau pengeluaran mendadak lainnya."
 *        dompet turun (sampai 13 px di atas subtitle) jadi CAKRAM INFOGRAFIS (acuan Simon 13 Okt), lima simpul muncul di katanya (urutan VO):
 *        busur warna = pembagian uang 50 · 20 · 10 · 10 · 10 %, garis UTUH berwarna dari titik cincin (berjarak sama) ke bawah label;
 *        "lainnya": gelombang denyut melintasi simpul. Tanpa nomor 01–05 & tanpa teks persen (Simon: sudah diwakili busur)
 *   D  "Prinsipnya sederhana: saat dibutuhkan, uangnya harus tersedia."
 *        garis meredup + cakram berdenyut (cincin ungu DIHAPUS, Simon 13 Okt) · simpul berdenyut bergiliran · jam → centang "tersedia"
 */

const [pertama, aktif, ini, uang, sewaktu, butuhkan, misalnya, makan, kos, cicilan, transportasi, pengeluaran, lainnya, sederhana, saat, dibutuhkan, tersedia] = urut([
  'pertama', 'aktif', 'ini', 'uang', 'sewaktu-waktu', 'butuhkan', 'misalnya', 'makan', 'kos', 'cicilan', 'transportasi', 'pengeluaran', 'lainnya', 'sederhana', 'saat',
  'dibutuhkan', 'tersedia'], BATAS.s4);

const T = {
  sorot: pertama, // cincin + membesar (pola sorot bab V02)
  tengah: aktif - 10, // dompet ke tengah (dompet lain turun — milik Scene 03, S03_KELUAR)
  judul: aktif + 20,
  ini, // "INI adalah uang …": dompet berdenyut (yang dimaksud)
  jam: uang + 10, sub: sewaktu + 12, subSorot: butuhkan, // lencana jam muncul di "uang yang sewaktu-waktu", berputar sepanjang "sewaktu-waktu"
  naik: misalnya - 20, // dompet turun ke bawah, baris kebutuhan di atasnya
  kebutuhan: [makan, kos, cicilan, transportasi, pengeluaran + 10], // "PENGELUARAN mendadak" — label 2 kata
  lainnya, // "…mendadak LAINNYA": gelombang denyut melintasi kelima kebutuhan (mengisi jeda sebelum "Prinsipnya", tak ada jendela diam)
  prinsip: sederhana, denyut: saat, dompetDenyut: dibutuhkan + 20, tersedia, // "Prinsipnya SEDERHANA": garis meredup, cincin dompet kembali
};

/* ── tata letak ── */
/** titik awal dompet Uang Aktif. Simon 14 Okt: "mulai scene ini dari tengah frame saja" — dulu titik serah-terima kolom kiri Scene 03 lama
 *  (x 400, y 355); kini TENGAH frame (dompet + label berpusat di y ±540), rupa sama (Ø200, label 160 px di bawah). Masker Scene 03 mendarat di sini. */
// ukur 14 Okt: dompet + label berpusat di y 540 bila dompet di y 500 (dulu 460 → −40 px)
export const S04_AWAL = { ...S03_DOMPET_AKTIF, x: 960, y: 500, labelY: 500 + (S03_DOMPET_AKTIF.labelY - S03_DOMPET_AKTIF.y) };
const AWAL = S04_AWAL;
/** A–B: dompet Ø300 + label sendirian berpusat di y ±533 · C–D: dompet Ø240 di bawah, lima kebutuhan Ø150 di atas (isi 225–866 berpusat ±545) */
const D_AB = 300, D_CD = 240;
/** Simon 13 Okt: dompet (C–D) diturunkan sampai 10–15 px di atas subtitle — tinta subtitle mulai y 994, cincin abu bawah = yCD + 145 → 981 */
const DOMPET = { x: 960, yAB: 540, yCD: 836 }; // yAB: dompet Ø300 (label sudah pudar) tepat di pusat frame (ukur 14 Okt)
/** simpul gaya infografis (acuan Simon 13 Okt "persis seperti referensi"): lingkaran putih di atas cincin warna.
 *  Simon 13 Okt: dompet diturunkan (680 → 836) → ruang tambahan dipakai memperbesar simpul Ø124 → Ø172 (luar Ø234, celah antarsimpul 76) */
const KEB = { y: 334, d: 172, jarak: 310, jangkau: simpulLuar(172) };
/** x simpul kebutuhan ke-k — TETAP (Simon 14 Okt: "gaya animasi discene ini kembalikan ke sebelumnya": geser bertahap baris dicabut, tiap simpul
 *  pop langsung di posisi akhirnya). Parameter f dibiarkan supaya pemanggil (RS04) tidak berubah. */
export const kebX = (k: number, _f?: number) => 960 + (k - 2) * KEB.jarak;
/** warna busur bergradasi seperti acuan (kebutuhan rutin: turkis → langit → biru → ungu muda) · "pengeluaran mendadak" = oranye (kejadian) */
/** `persen` = pembagian uang aktif per kebutuhan (Simon 13 Okt: 50 · 20 · 10 · 10 · 10 %) → panjang busur warna */
const KEBUTUHAN: { nama: string; ikon: KunciIkon; warna: string; persen: number }[] = [
  { nama: 'Makan', ikon: 'makan', warna: WARNA.turkis, persen: 0.5 },
  { nama: 'Bayar kos', ikon: 'kos', warna: WARNA.langit, persen: 0.2 },
  { nama: 'Cicilan', ikon: 'cicilan', warna: WARNA.biru, persen: 0.1 },
  { nama: 'Transportasi', ikon: 'transportasi', warna: WARNA.ungu, persen: 0.1 },
  { nama: 'Pengeluaran mendadak', ikon: 'mendadak', warna: WARNA.oranye, persen: 0.1 },
];
/** ujung garis penghubung: 16 px di bawah label kebutuhannya (label 30 px KAPITAL mulai y 446, baris 34,5 px; "Pengeluaran mendadak" 2 baris) */
const ujungY = (i: number) => KEB.y + KEB.jangkau + 18 + (KEBUTUHAN[i].nama.length > 14 ? 2 : 1) * 34.5 + 16;
/** titik garis di cincin abu: BERJARAK SAMA seperti acuan (Simon 13 Okt "perbaiki spacing garis penghubung") — −155° … −25°, langkah 32,5° */
const SUDUT = KEBUTUHAN.map((_, i) => ((-155 + 32.5 * i) * Math.PI) / 180);
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
/** Simon 14 Okt: "hapus animasi yang tidak diperlukan (animasi yang seperti berdenyut)" → denyut DIMATIKAN di seluruh video (selalu 0). */
const denyut = (_f: number, _at: number, _a = 0.07) => 0;

/** KELUAR Scene 04 = milik Scene 05 ("Karena itu, …"): kebutuhan, garis, lencana & judul keluar 60f mulai di batas; dompet + label diambil alih
 *  Scene 05 (titik & rupa sama, S04_DOMPET_AKHIR) */
export const S04_KELUAR = BATAS.s5 + 30;
export const S04_DOMPET_AKHIR = { x: DOMPET.x, y: DOMPET.yCD, d: D_CD, cincin: 0, putih: 1 }; // cincin sorot "Prinsipnya" dihapus (Simon 13 Okt)
/** titik-titik di cincin abu — dilanjutkan Scene 05 sampai kebutuhan keluar */
export const S04_TITIK = KEBUTUHAN.map((k, i) => ({ sudut: SUDUT[i], warna: k.warna }));
export const Scene04: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s4 || f >= S04_KELUAR + 60) return null;
  const kel = cin(f, S04_KELUAR);
  const milikS4 = f < BATAS.s5; // dompet + label: Scene 05 mengambil alih mulai batas
  // dompet: titik Scene 03 → tengah (A) → turun (C)
  const tengah = cin(f, T.tengah), naik = cin(f, T.naik);
  const dx = lerp(AWAL.x, DOMPET.x, tengah);
  const dy = lerp(lerp(AWAL.y, DOMPET.yAB, tengah), DOMPET.yCD, naik);
  // sorot di "pertama": membesar 1 → 1,12 (pola sorot bab V02); ke tengah: → Ø300; saat kebutuhan muncul: → Ø240
  const skala = lerp(lerp(1 + 0.12 * cin(f, T.sorot), D_AB / AWAL.d, tengah), D_CD / AWAL.d, naik)
    * (1 + denyut(f, T.ini) + denyut(f, T.prinsip) + denyut(f, T.dompetDenyut) + denyut(f, T.tersedia + 10)); // "Prinsipnya SEDERHANA": dompet berdenyut (pengganti cincin ungu)
  const LABEL_DY = (AWAL.d * skala) / 2 + 44;
  // gaya infografis: dompet biru Scene 03 → lingkaran PUTIH berisi ikon + teks "Uang Aktif" (label bawah memudar), cincin abu + titik garis
  const putih = tengah;
  // cincin sorot biru hanya di "pertama" (dompet biru, sebelum berubah gaya) — cincin ungu di "Prinsipnya sederhana" DIHAPUS (Simon 13 Okt)
  // (15 Okt, "perbaiki itu") cincin sorot "pertama" jatuh DI TENGAH masker Scene 03 → dulu muncul dari balik cakram yang menyusut (terpotong 12 frame);
  // kini memudar masuk sesudah masker mendarat (batas − 20 + 60)
  const cincin = cin(f, T.sorot) * (1 - tengah) * R(f, BATAS.s4 + 40, BATAS.s4 + 64, 0, 1, io);
  const D_DOMPET = AWAL.d * lerp(D_AB / AWAL.d, D_CD / AWAL.d, naik); // garis berangkat dari titik di cincin abu (tepi dompet + CINCIN_JARAK)
  const garisRedup = (1 - 0.55 * cin(f, T.prinsip)) * (1 - kel);
  const d = AWAL.d * skala;
  const jam = popIn(f, T.jam) * popOut(f, T.tersedia - 6);
  // jam berjalan sepanjang "sewaktu-waktu": jarum panjang 2 putaran (120 menit), jarum pendek ikut 60° — tidak berputar bersamaan (Simon 13 Okt)
  const menit = 120 * R(f, T.jam, T.jam + 90, 0, 1, io);
  const centang = popIn(f, T.tersedia + 6);
  // lencana di tepi KANAN-BAWAH cakram (+40°): separuh atas cincin dipakai titik & garis penghubung → lencana tidak menutupi titik/garis
  const badge = (xx: number, yy: number) => ({ left: xx + d * 0.39 - 40, top: yy + d * 0.328 - 40 });
  return (
    <AbsoluteFill>
      {/* garis penghubung (Simon 13 Okt, acuan: garis UTUH berwarna dari titik di cincin abu ke simpulnya) → berakhir di bawah label kebutuhan
          (label ada di antara simpul & dompet — garis tidak menembus label); tergambar di kata kebutuhannya; di belakang dompet */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: garisRedup }}>
        {KEBUTUHAN.map((k, i) => {
          const g = R(f, T.kebutuhan[i] - 40, T.kebutuhan[i] + 10, 0, 1, io);
          if (g <= 0.001) return null;
          const ex = kebX(i, f), ey = ujungY(i);
          const ang = SUDUT[i];
          const sx = dx + Math.cos(ang) * (D_DOMPET / 2 + CINCIN_JARAK), sy = dy + Math.sin(ang) * (D_DOMPET / 2 + CINCIN_JARAK);
          return <line key={k.nama} x1={sx} y1={sy} x2={lerp(sx, ex, g)} y2={lerp(sy, ey, g)} stroke={k.warna} strokeWidth={4} strokeLinecap="round" />;
        })}
      </svg>

      {/* dompet Uang Aktif (diambil alih dari Scene 03, rupa sama) — diserahkan ke Scene 05 di batas */}
      {milikS4 ? <>
      {cincin > 0.001 ? (() => {
        const rr = d / 2 + 16 + (CINCIN_JARAK + 14) * putih; // di luar cincin abu saat gaya infografis
        return <div style={{ position: 'absolute', left: dx - rr, top: dy - rr, width: 2 * rr, height: 2 * rr, borderRadius: '50%', border: `3px solid ${AWAL.warna}`,
          opacity: Math.min(1, cincin), boxShadow: `0 0 36px 4px ${AWAL.warna}55` }} />;
      })() : null}
      <DompetInfo x={dx} y={dy} d={d} warna={AWAL.warna} putih={putih} teks={putih} baris1="UANG AKTIF" baris2="100%"
        titik={KEBUTUHAN.map((k, i) => ({ sudut: SUDUT[i], warna: k.warna, p: popIn(f, T.kebutuhan[i] - 30) }))} />
      {/* lencana jam ("sewaktu-waktu") → centang ("harus tersedia") di kanan-atas dompet */}
      {jam > 0.001 ? (
        <div style={{ position: 'absolute', ...badge(dx, dy), width: 80, height: 80, borderRadius: '50%', background: B.orange, border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center',
          transform: `scale(${jam})`, boxShadow: `0 10px 24px -8px ${B.orange}cc` }}>
          <JamBerjalan size={46} color={B.white} latar={B.orange} menit={menit} />
        </div>) : null}
      </> : null}
      {/* centang HIJAU (Simon 14 Okt). Sesudah batas s5 cakram diambil alih RS05 → centang ikut digambar RS05 di atas cakramnya
          (dulu tetap digambar Scene04 = di BELAKANG cakram RS05: centang tiba-tiba pindah ke belakang lingkaran) */}
      {milikS4 && centang > 0.001 ? (
        <div style={{ position: 'absolute', ...badge(dx, dy), width: 80, height: 80, borderRadius: '50%', background: ARAH.naik, border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center',
          transform: `scale(${centang * popOut(f, S04_KELUAR - 10)})`, boxShadow: `0 10px 24px -8px ${ARAH.naik}cc` }}>
          <Icon name="tersedia" size={46} color={B.white} />
        </div>) : null}
      {/* label dompet (sama dengan Scene 03) */}
      {/* (15 Okt, Simon "00:55.20 – 00:56.30 masih ada jeglek") label dulu tampil penuh sejak batas, DI BAWAH masker Scene 03 yang masih menyusut →
          cakram ungu melintas & memotong "Uang Aktif" ±8 frame (f3376–3384). Kini label memudar masuk SESUDAH masker mendarat (DARAT = batas − 20 + 60). */}
      {milikS4 && tengah < 0.999 && f >= BATAS.s4 + 40 ? <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(dx, dy + lerp(AWAL.labelY - AWAL.y, LABEL_DY, tengah)),
        translate: '-50% -50%', display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap',
        opacity: Math.max(0.0001, Math.min(0.9999, (1 - tengah) * R(f, BATAS.s4 + 40, BATAS.s4 + 70, 0, 1, io))) }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: AWAL.warna, transform: `scale(${popIn(f, BATAS.s4 + 70)})` }} />
        <span style={{ fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night }}>{AWAL.nama}</span>
      </div> : null}

      {/* lima kebutuhan (urutan ucapan VO), label di bawah ikon */}
      {KEBUTUHAN.map((k, i) => {
        const p = popIn(f, T.kebutuhan[i]) * popOut(f, S04_KELUAR - 12 + 6 * i);
        if (p <= 0.001) return null;
        const x = kebX(i, f);
        const s = p * (1 + denyut(f, T.denyut + 14 * i) + denyut(f, T.lainnya + 14 * i, 0.06));
        return (
          <React.Fragment key={k.nama}>
            <SimpulInfo x={x} y={KEB.y} d={KEB.d} warna={k.warna} ikon={k.ikon} persen={k.persen} p={s} ikonSkala={k.ikon === 'makan' ? 1.3 : 1}
              busur={R(f, T.kebutuhan[i] - 10, T.kebutuhan[i] + 50, 0, 1, io)} />
            <div style={{ position: 'absolute', left: x - 150, width: 300, top: KEB.y + KEB.jangkau + 18, textAlign: 'center', lineHeight: 1.15, opacity: 1 - kel }}>
              <WordText halus rataBaris f={f} at={T.kebutuhan[i] + 6} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night, letterSpacing: '.03em' }}>{k.nama.toUpperCase()}</WordText>
            </div>
          </React.Fragment>);
      })}

      <Judul f={f} kata={['Uang', 'Aktif']} nomor="1" at={T.judul} keluar={S04_KELUAR} />
      <Judul f={f} kata={['Bisa', 'dibutuhkan', 'kapan saja']} sorotIdx={2} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S04_KELUAR} />
    </AbsoluteFill>);
};

export const S04_T = T;
