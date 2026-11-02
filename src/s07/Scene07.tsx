import React from 'react';
import { ARAH, B, F, R, SISI, bayanganDengan, io, lerp, mixHex, rgba } from '../theme';
import { cin, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Chip, Kutipan, Lencana } from '../parts/umum';
import { KarakterLingkar, Penghubung, bayanganKaca, type PoseKarakter } from '../parts/kaca';
import { Notifikasi } from '../parts/nyata';
import { Avatar } from '../parts/v06';
import { Backdrop } from '../parts/Backdrop';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { gaya as gayaT, JALAN_FRAME, LARI_FRAME, panjangSiklus as panjangT } from '../flat/rigTegak';
import { HutanLayar, TANAH_LAYAR, TokohTegakLapis, ambil, simulasi } from '../flat/dunia';
import { SingaRig, poseSinga, simulasiSinga } from '../flat/rigSinga';
import { KEL_RUPA } from '../s01flat/Scene01Flat';
import { ANTM_S07 } from '../data/lilinRiil.gen';
import { BatangLilin, KisiLilin, domainGulir, hargaBulat, lilinGulir, posisiGulir } from '../parts/lilinRiil';

/**
 * SCENE 07 — Saat Harga Naik, Kelompok Menciptakan Buktinya Sendiri (BATAS.s7 – BATAS.s8). GAYA RUMAH (bukan analogi): latar rumah, kartu chart, avatar
 * investor, foto "kamu" (pria kemeja biru = pembeli Scene 05). Sisipan perbandingan padang rumput = panel ilustrasi flat (bagian analogi).
 * REVISI 28 Okt (Simon, S07): "Gunakan transisi shape yang menggunakan 2 persegi, sesuaikan warnanya dengan warna brand" · "Animasikan candlesticknya seperti
 * contoh yang aku kirimkan" · "Buat orangnya menghadap ke kanan" · "Hapus text 'kamu'" · "Sesuaikan posisi bubble text (seharusnya ada diatas kepala orang)"
 * · animasi kaku/patah/jeglek, transisi tak sesuai bentuk, layout, spacing konsisten, easing:
 *  ⓪ MASUK: dua bilah layar penuh (turkis, turkis muda) naik, lalu latar Scene 07 naik membawa kartu chart (resep kotak naik S04; 60 f inOut cubic).
 *  A f15445–16000 chart (TENGAH) bergulir resep video TA; investor bertambah (ikon mata); TIAP BELI = klik (tertekan + riak) → satu candle hijau tumbuh.
 *  B f16016–16525 kamu (dicerminkan, menghadap kanan, TANPA label) masuk di kiri — chart & investor memberi ruang ke kanan; gelembung di ATAS KEPALA (ekor
 *    tengah menunjuk kepala): "Apakah…?" dicoret → "Kalau nggak beli sekarang…?"; notifikasi profit; pilihan "Tunggu & periksa" / BELI → BELI diklik → candle naik.
 *  C f16547–16878 kartu chart BER-MORF jadi panel padang rumput (satu bentuk; dulu chart pop keluar lalu panel pop masuk): pelari ×1 → ×4, singa TETAP ("=").
 *  D f16878–17498 panel ber-morf kembali jadi kartu chart; tiga BELI bersama → naik; investor berikutnya: "Lihat, berarti mereka benar." → BELI.
 *  E f17515–17985 loop beli → harga naik → menarik pembeli; papan turun 62 px memberi ruang, lalu TEKS LAYAR dua baris (y 122). Keluar: kartu chart
 *    BER-MORF jadi kartu IHSG Scene 08 (digambar S08).
 * Tata letak (jarak antar benda bertumpuk 16 px): kamu Ø240 di (400, 520) + kartu chart 820 × 380 (820–1640, y 210–590) berpusat di x 960 · gelembung
 * berekor tengah, ujung ekor 16 px di atas kepala · notifikasi 16 px di bawah lingkaran · dua pilihan sebaris 16 px di bawah notifikasi · chip BELI
 * investor y 642 · avatar Ø100 y 740.
 * Chart = candle harian RIIL ANTM 15 Okt – 18 Des 2020 (tanpa nama saham): Rp1.145 → Rp1.950.
 */
const W = urut(['di', 'pasar', 'reaksi', 'kenaikan', 'harga', 'naik', 'makin', 'banyak', 'orang', 'melihat', 'makin', 'banyak', 'orang', 'membeli', 'harga',
  'naik', 'pertanyaannya', 'bergeser', 'apakah', 'layak', 'dibeli', 'menjadi', 'kalau', 'nggak', 'beli', 'sekarang', 'apa', 'terlambat', 'padang', 'rumput',
  'orang', 'berlari', 'bersama-sama', 'hewan', 'buas', 'lebih', 'besar', 'tapi', 'pasar', 'membeli', 'bersama-sama', 'benar-benar', 'mendorong', 'harga', 'naik',
  'kenaikan', 'bukti', 'berikutnya', 'lihat', 'berarti', 'benar', 'inilah', 'berbahaya', 'refleksivitas', 'aksi', 'kelompok', 'menciptakan', 'bukti',
  'meyakinkan', 'sendiri'], BATAS.s7 - 10);
let i = 0;
const n = () => W[i++];
const T = {
  di: n(), pasar: n(), reaksi: n(), kenaikan: n(), harga: n(), naik: n(), makin: n(), banyak: n(), orang: n(), melihat: n(), makin2: n(), banyak2: n(), orang2: n(),
  membeli: n(), harga2: n(), naik2: n(), pertanyaan: n(), bergeser: n(), apakah: n(), layak: n(), dibeli: n(), menjadi: n(), kalau: n(), nggak: n(), beli: n(),
  sekarang: n(), apa: n(), terlambat: n(), padang: n(), rumput: n(), orang3: n(), berlari: n(), bersama: n(), hewan: n(), buas: n(), lebih: n(), besar: n(),
  tapi: n(), pasar2: n(), membeli2: n(), bersama2: n(), benar: n(), mendorong: n(), harga3: n(), naik3: n(), kenaikan2: n(), bukti: n(), berikutnya: n(),
  lihat: n(), berarti: n(), benar2: n(), inilah: n(), berbahaya: n(), refleksivitas: n(), aksi: n(), kelompok: n(), menciptakan: n(), bukti2: n(), meyakinkan: n(),
  sendiri: n(),
};
export const S07_T = T;
const AWAL = BATAS.s7, AKHIR = BATAS.s8;
const EKOR = AKHIR + 30;

/* ════════════════════════════ TATA LETAK ════════════════════════════ */
/** kamu = pria kemeja biru (sama dengan pembeli Scene 05), DICERMINKAN menghadap kanan */
const KAMU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
const KM = { x: 400, y: 520, D: 240 };
/** kepala kamu (foto dicerminkan: x − 4) · puncak kepala = pusat − (cy − y0 tinta) × skala */
const KEPALA_KM = { x: KM.x - 4, atas: KM.y - (KAMU.cy - 22) * (KM.D / 2 / KAMU.r) };
const JARAK = 16;
const NOTIF = { y: KM.y + KM.D / 2 + JARAK + 44, w: 400 };
const PILIH_Y = NOTIF.y + 44 + JARAK + 22;
/** dua pilihan sebaris berpusat di bawah kamu: "Tunggu & periksa" (±230 px) · celah 24 · BELI (±104 px) */
const PILIH_X = [KM.x - 62, KM.x + 127];
const KAMU_BELI_Y = KM.y + KM.D / 2 + JARAK + 23; // celah 16 px dari lingkaran (chip size 22 tinggi ±45; dulu 13 px, bayangan menyentuh foto)
/** kartu chart: TENGAH di A, menepi ke kanan saat kamu masuk (B) supaya gelembung di atas kepala tidak menyentuh kartu */
export const CH = { y: 400, w: 820, h: 380 };
export const CX_B = 1230; // kamu (280–520) + kartu (820–1640) berpusat di x 960
const CX_A = 960;
const INV = { y: 740, d: 100, chip: 642 };

/* ════════════════════════════ WAKTU ════════════════════════════ */
/** tiap aksi BELI (siapa, kapan) — candle hijau tumbuh 7 f SESUDAH tombol diklik (sebab → akibat) */
type Beli = { siapa: number; t: number };
const BELI: Beli[] = [
  { siapa: 0, t: T.membeli }, { siapa: 1, t: T.harga2 + 4 }, { siapa: 2, t: T.naik2 + 6 },
  { siapa: -1, t: T.terlambat + 6 },
  { siapa: 0, t: T.bersama2 }, { siapa: 1, t: T.bersama2 + 20 }, { siapa: 2, t: T.bersama2 + 40 },
  { siapa: 3, t: T.benar2 + 16 },
  { siapa: 1, t: T.menciptakan + 6 }, { siapa: 0, t: T.meyakinkan + 6 },
];
const tA = { lihat: [T.kenaikan - 20, T.banyak, T.melihat, T.berikutnya] };
const tB = { geser: T.pertanyaan + 20, kamu: T.pertanyaan + 20, tanya1: T.apakah - 10, coret: T.menjadi, keluar1: T.menjadi + 30, tanya2: T.kalau + 35, notif: T.nggak,
  pilih: T.apa, tekan: T.terlambat + 6 };
/** C: benda B keluar (pop) SESUDAH klik BELI selesai, kartu mulai ber-morf di tengah pop keluar (benda sudah hilang sebelum kartu yang membesar
 *  mencapai tempatnya); D: kartu ber-morf kembali, benda pop masuk sesudahnya */
const tC = { keluar: T.padang - 4, morf: T.padang + 26, pelari: [T.padang + 50, T.berlari, T.bersama, T.bersama + 22], bingkai: T.hewan, sama: T.lebih,
  panelKeluar: T.tapi - 20, kembali: T.pasar2 + 20 };
const tD = { orang: T.berikutnya, kata: T.lihat - 10, kataKeluar: T.inilah };
const tE = { loop: [T.refleksivitas, T.aksi], teks: [T.aksi, T.meyakinkan] };
/** E: TEKS LAYAR dua baris masuk → papan TURUN memberi ruang LEBIH DULU (Simon 30 Okt "Ya, geser papan": dulu judul di pita logo y 56, isi berpusat y ±425).
 *  Satu geser 60 f inOut cubic, selesai tepat saat kata pertama mulai naik (frasa dipusatkan di `at`, rentang ≤ 90 f → mulai at − 45); judul y 122 →
 *  judul + kartu + investor berpusat di y 497. Kartu ikut turun → Scene 08 memulai morf dari CH.y + TURUN_E7. */
export const TURUN_E7 = 62;
const JUDUL_E7 = 122;
const tTurun = tE.teks[0] - 75;

/* ════════════════════════════ CHART BERGULIR (resep video TA) ════════════════════════════ */
/* candle HARIAN RIIL ANTM (14 riwayat + 18 candle tenang tampak saat chart muncul + reli Des: 10 candle HIJAU = 10 klik BELI, 3 merah terbentuk sendiri).
 * Chart BERGULIR: tiap candle baru tumbuh linear dari harga buka (20 f) sambil kartu bergeser satu slot; domain harga mengikuti candle di jendela (halus). */
const D = ANTM_S07;
const DASAR = D.findIndex((b) => b.t === '2020-11-05') + 18;
const I_HIJAU = D.map((b, k) => ({ k, naik: b.c > b.o })).filter((x) => x.k >= DASAR && x.naik).map((x) => x.k);
const WAKTU = (() => {
  const w: number[] = [];
  I_HIJAU.forEach((k, j) => { w[k - DASAR] = BELI[j].t + 7; });
  D.forEach((_, k) => { const j = k - DASAR; if (j >= 0 && w[j] === undefined) w[j] = (w[j - 1] + w[j + 1]) / 2 + (j === 3 ? -60 : 0); });
  return w;
})();
const posP = posisiGulir(DASAR, WAKTU.map((m, j) => ({ mulai: m, d: Math.max(8, Math.min(20, (WAKTU[j + 1] ?? m + 20) - m)) })));
const N_SLOT = 33; // 32 candle tampak + 1 slot ruang napas
const domP = domainGulir(D, posP, () => N_SLOT, AWAL - 20, AKHIR + 120);
const hargaPada = (f: number) => { const t = lilinGulir(D, posP(f), 0, 1, 1); return t[t.length - 1].c.c; };
const rp = (v: number) => `Rp${hargaBulat(v).toLocaleString('id-ID')}`;
const Chart: React.FC<{ f: number; w: number; h: number }> = ({ f, w, h }) => {
  const [lo, hi] = domP(f), Y = (v: number) => h - 8 - ((h - 16) * (v - lo)) / (hi - lo), slot = w / N_SLOT;
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'hidden' }}>
      <KisiLilin w={w} h={h} />
      {lilinGulir(D, posP(f), 0, w - slot, slot).map(({ c, x, alfa }) => <BatangLilin key={c.t} c={c} x={x} slot={slot} Y={Y} alfa={alfa} />)}
    </svg>);
};
/** isi kartu chart (dipakai juga Scene 08 saat kartu ini ber-morf jadi kartu IHSG) */
export const IsiChartS07: React.FC<{ f: number }> = ({ f }) => (
  <>
    <div style={{ position: 'absolute', left: 30, top: 22, fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night }}>{rp(hargaPada(f))}</div>
    {popIn(f, BELI[0].t + 30) > 0 ? <div style={{ position: 'absolute', right: 30, top: 24, padding: '6px 16px', borderRadius: 999, background: rgba(ARAH.naik, 0.14),
      color: mixHex(ARAH.naik, B.night, 0.3), fontFamily: F, fontSize: 26, fontWeight: 800, transformOrigin: 'center', transform: `scale(${skalaPop(popIn(f, BELI[0].t + 30))})` }}>▲ naik</div> : null}
    <div style={{ position: 'absolute', left: 30, top: 92, width: CH.w - 60, height: CH.h - 120 }}><Chart f={f} w={CH.w - 60} h={CH.h - 120} /></div>
  </>);

/* ════════════════════════════ PANEL PADANG (ANALOGI, FLAT) ════════════════════════════ */
export const PANEL = { x: 960, y: 497, w: 1120, h: 540, k: 0.6 }; // pusat y 497 = tengah area di atas subtitle (dulu 440)
/** TATA LETAK ISI PANEL (Simon 28 Okt malam, screenshot panel padang: "masih belum kamu perbaiki"): singa + bingkai putus-putus dulu menempel tepi kiri
 *  panel (20 px) sementara jaraknya ke tepi bawah 74 px, kepala singa keluar dari bingkai, dan "=" mengambang 147 px di kanan pusat bingkai. Kini (diukur dari
 *  render: siluet singa 247 × 215 px): bingkai = siluet + 16 px di keempat sisi, berjarak SAMA 63 px dari tepi kiri & bawah panel; "=" tepat di atas pusat
 *  bingkai (celah 16 px); "×N" sebaris dengan "=" dan berjarak 63 px dari tepi kanan (simetris). Koordinat lokal panel 1120 × 540. */
const INSET = 63;
const BINGKAI = { x0: INSET, x1: INSET + 279, y0: 230, y1: PANEL.h - INSET };
/** PANEL BERGERAK (Simon 30 Okt, screenshot panel singa: pelari terus berlari sampai keluar panel, muncul di dalam bingkai singa, "×4" tertinggal di
 *  atas tanah kosong): KAMERA ikut berlari → latar bergulir, singa berlari (gallop) di tempat dalam bingkainya (kiri), kelompok pelari berlari di tempatnya
 *  (kanan, tepi kanan berjarak 63 = sama dengan bingkai singa di kiri), "×N" tepat di atas pusat kelompok sebaris dengan "=". Pelari bergabung satu per
 *  satu: NAIK dari bawah panel ke tempatnya (orang = swipe naik, 60 f inOut cubic). Koordinat adegan = (panel + 16) / k. */
const KELOMPOK = { x0: 644, x1: PANEL.w - BINGKAI.x0 };
const SLOT_PELARI = (k: number) => (KELOMPOK.x1 + 16) / PANEL.k - 75 - 179 * k; // pelari pertama paling depan (kanan)
export const PANEL_LENCANA = { sama: { x: (BINGKAI.x0 + BINGKAI.x1) / 2, y: BINGKAI.y0 - 16 - 45 }, jumlah: { x: (KELOMPOK.x0 + KELOMPOK.x1) / 2 } };
const keAdegan = (x: number, y: number) => [(x + 16) / PANEL.k, (y + 68) / PANEL.k];
const [BX0, BY0] = keAdegan(BINGKAI.x0, BINGKAI.y0), [BX1, BY1] = keAdegan(BINGKAI.x1, BINGKAI.y1);
const JALUR_BINGKAI = `M ${BX0} ${BY0} L ${BX1} ${BY0} L ${BX1} ${BY1} L ${BX0} ${BY1} Z`;
const S_P = 0.82;
const lajuLari = (panjangT(1) * S_P) / LARI_FRAME;
const S_SINGA_P = 0.465;
/** simulasi panel padang (dipakai juga Scene 08): satu laju untuk kamera, singa & pelari (mulai berlari bersama pelari pertama) */
export const simPelari = (tPelari: number[], awal: number, n: number) => {
  const v = (g: number) => cin(awal + g, tPelari[0] + 10, 20) * lajuLari;
  const kam = new Float64Array(n);
  let x = 0;
  for (let g = 0; g < n; g++) { x += v(g); kam[g] = x; }
  return { kam, singa: simulasiSinga(n, v, S_SINGA_P, 0),
    pelari: tPelari.map((_, k) => simulasi(n, v, () => 1, S_P, 0, -(k * 9 + 1) / JALAN_FRAME, panjangT)) };
};
const PELARI = simPelari(tC.pelari, AWAL, AKHIR + 80 - AWAL);
/** PANEL PADANG (analogi flat): pelari bertambah, siluet singa UKURAN TETAP (bingkai putus-putus) — isi layar 1920 × 1080 diskalakan PANEL.k */
export const PanelPadang: React.FC<{ f: number; pelari: ReturnType<typeof simPelari>; tPelari: number[]; tBingkai: number; awal: number }> = ({ f, pelari, tPelari, tBingkai, awal }) => {
  const bingkai = cin(f, tBingkai);
  const jumlah = tPelari.filter((t) => f >= t).length;
  const g = Math.max(0, Math.min(pelari.kam.length - 1, Math.round(f - awal)));
  const kamX = 960 + pelari.kam[g];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${PANEL.k})` }}>
      <HutanLayar kamX={kamX} C={-3600} lapis="belakang" />
      {pelari.pelari.map((j, k) => {
        const naik = cin(f, tPelari[k]);
        if (naik <= 0) return null;
        const a = ambil(j, f - awal), r = KEL_RUPA[k % 3];
        return <TokohTegakLapis key={k} x={SLOT_PELARI(k)} tanah={TANAH_LAYAR + (1 - naik) * 760} s={S_P} pose={gayaT(a.psi, 1, a.a)} kostum="dulu"
          kepala={k === 0 ? 'simon' : r.kepala} warna={k === 0 ? undefined : r.warna} />;
      })}
      {/* singa: siluet di balik rumput — UKURAN TETAP (bingkai putus-putus tidak berubah) */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs><filter id="s07-siluet" x="-10%" y="-10%" width="120%" height="120%"><feFlood floodColor="#3A3442" /><feComposite in2="SourceAlpha" operator="in" /></filter></defs>
        <g filter="url(#s07-siluet)" opacity={0.92}><SingaRig pose={poseSinga(pelari.singa, f - awal)} x={158} tanah={TANAH_LAYAR + 24} s={S_SINGA_P} bayangan={false} /></g>
        {bingkai > 0 ? <Penghubung d={JALUR_BINGKAI} g={bingkai} warna={B.white} tebal={5} titik={false} /> : null}
      </svg>
      <HutanLayar kamX={kamX} C={-3600} lapis="depan" />
      {/* jumlah pelari bertambah */}
      <Lencana x={keAdegan(PANEL_LENCANA.jumlah.x, PANEL_LENCANA.sama.y)[0]} y={keAdegan(PANEL_LENCANA.jumlah.x, PANEL_LENCANA.sama.y)[1]} d={0} p={popIn(f, tPelari[0] + 20)}
        warna={B.orange} teks={`×${Math.max(1, jumlah)}`} besar={130} />
    </div>);
};

/* ════════════════════════════ KLIK (resep klik Scene 04/05) ════════════════════════════ */
/** tombol tertekan (8 f turun + 12 f naik, inOut cubic) */
export const tekanPada = (f: number, t: number) => R(f, t - 4, t + 4, 0, 1) * (1 - R(f, t + 4, t + 16, 0, 1));
/** chip yang DIKLIK: mengecil sesaat (poros = chip) + riak cincin warna chip 60 f inOut cubic */
export const Klik: React.FC<{ f: number; x: number; y: number; t: number[]; warna: string; children: React.ReactNode; /** lebar riak (≈ lebar chip) */ lebar?: number }> = ({ f, x, y, t, warna, children, lebar = 120 }) => {
  const tekan = Math.max(0, ...t.map((a) => tekanPada(f, a)));
  const riak = Math.max(0, ...t.map((a) => { const r = R(f, a, a + 60, 0, 1); return r > 0 && r < 1 ? r : 0; }));
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: `${x}px ${y}px`, transform: tekan > 0 ? `scale(${1 - 0.06 * tekan})` : undefined }}>{children}</div>
      {riak > 0 ? <div style={{ position: 'absolute', left: x - lebar / 2, top: y - 26, width: lebar, height: 52, borderRadius: 999, border: `3px solid ${warna}`, boxSizing: 'border-box',
        opacity: 1 - riak, transform: `scale(${1 + 0.6 * riak})` }} /> : null}
    </>);
};

/* ════════════════════════════ SCENE ════════════════════════════ */
export const Scene07: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL || f >= AKHIR + 70) return null;
  const keluar = popOut(f, EKOR);
  /* ⓪ kotak naik: bilah turkis · turkis muda (60 f, selang 16 f), lalu latar Scene 07 naik membawa kartu chart */
  const naikBilah = (mulai: number) => R(f, mulai, mulai + 60, 1080, 0);
  const naikLatar = f < AWAL + 90 ? naikBilah(AWAL + 30) : 0;
  /* kartu chart: tengah (A) → kanan (B…), morf ke panel padang (C) dan kembali (D); di AKHIR diambil alih Scene 08 (morf ke kartu IHSG) */
  const geser = cin(f, tB.geser);
  const cx = lerp(CX_A, CX_B, geser);
  const morf = cin(f, tC.morf) * (1 - cin(f, tC.kembali));
  const kartu = { x: lerp(cx, PANEL.x, morf), y: lerp(CH.y, PANEL.y, morf) + naikLatar, w: lerp(CH.w, PANEL.w, morf), h: lerp(CH.h, PANEL.h, morf) };
  const isiChart = 1 - cin(f, tC.morf - 15) + cin(f, tC.kembali + 15);
  const isiPadang = cin(f, tC.morf + 15) * (1 - cin(f, tC.kembali - 15));
  /* benda B: keluar (pop) bersamaan morf mulai, masuk lagi sesudah morf kembali */
  const ada = (t: number) => t < tC.keluar ? popIn(f, t) * popOut(f, tC.keluar) + popIn(f, tC.kembali + 30) * keluar : popIn(f, t) * keluar;
  /* investor: 3 dulu (−200/0/200 dari pusat kartu), investor ke-4 masuk di D → semua bergeser memberi ruang */
  const ruang4 = cin(f, tD.orang - 10);
  const xInv = (k: number) => cx + (k < 3 ? lerp(-200 + 200 * k, -300 + 200 * k, ruang4) : 300);
  const beliDari = (k: number) => BELI.filter((b) => b.siapa === k).map((b) => b.t);
  /* kamu */
  const kamuP = ada(tB.kamu);
  const tanya1 = popIn(f, tB.tanya1) * popOut(f, tB.keluar1), coret = cin(f, tB.coret - 15);
  const tanya2 = popIn(f, tB.tanya2) * popOut(f, tC.keluar);
  const notif = R(f, tB.notif - 30, tB.notif + 30, 0, 1, (x) => x) * (1 - R(f, tC.keluar - 30, tC.keluar + 30, 0, 1, (x) => x)); // linear: swipeOff meng-ease
  const pilihP = popIn(f, tB.pilih) * popOut(f, tC.keluar);
  const tunggu = 1 - 0.55 * cin(f, tB.tekan + 10); // pilihan menunggu meredup sesudah BELI diklik
  const kamuBeli = popIn(f, tC.kembali + 30) * keluar;
  const sama = popIn(f, tC.sama) * popOut(f, tC.panelKeluar);
  const kata = popIn(f, tD.kata) * popOut(f, tD.kataKeluar);
  const loop = tE.loop.map((t) => cin(f, t) * keluar);
  // titik berjalan 3 putaran sepanjang sisa scene; POP masuk & keluar (dulu muncul & hilang seketika di loop[1] / AKHIR)
  const putar = f >= tE.loop[1] ? R(f, tE.loop[1], AKHIR, 0, 1, (x) => x) : -1, titikP = popIn(f, tE.loop[1] + 30) * keluar;
  const turun = TURUN_E7 * cin(f, tTurun);

  return (
    <>
      {/* ⓪ bilah turkis · turkis muda · latar Scene 07 (resep BilahKeluar ST-02, 60 f inOut cubic) */}
      {f < AWAL + 90 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, background: B.turq, transform: `translate3d(0, ${naikBilah(AWAL)}px, 0)` }} />
          <div style={{ position: 'absolute', inset: 0, background: B.turqLite, transform: `translate3d(0, ${naikBilah(AWAL + 16)}px, 0)` }} />
          {f >= AWAL + 30 ? <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: `translate3d(0, ${naikLatar}px, 0)` }}><Backdrop f={f} /></div> : null}
        </>) : null}

      {/* ═════ PAPAN (semua kecuali bilah masuk & teks layar) — turun memberi ruang teks layar E ═════ */}
      <div style={{ position: 'absolute', inset: 0, transform: turun > 0 ? `translate3d(0, ${turun}px, 0)` : undefined }}>
      {/* ═════ kartu chart ↔ panel padang (SATU bentuk) — sejak AKHIR digambar Scene 08 ═════ */}
      {f >= AWAL + 30 && f < AKHIR ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: kartu.w, height: kartu.h, transform: `translate3d(${kartu.x - kartu.w / 2}px, ${kartu.y - kartu.h / 2}px, 0)` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 32, overflow: 'hidden', boxShadow: bayanganKaca(B.blue),
            background: `linear-gradient(165deg, ${rgba(B.white, 0.98)} 0%, ${rgba(B.white, 0.9)} 100%)` }}>
            {isiPadang > 0 ? (
              <div style={{ position: 'absolute', left: (kartu.w - 1920 * PANEL.k) / 2, top: kartu.h - 1080 * PANEL.k + 40 * (kartu.h / PANEL.h), opacity: isiPadang < 1 ? isiPadang : undefined,
                background: '#B9E3CB', width: 1920 * PANEL.k, height: 1080 * PANEL.k }}>
                <PanelPadang f={f} pelari={PELARI} tPelari={tC.pelari} tBingkai={tC.bingkai} awal={AWAL} />
              </div>) : null}
            {isiChart > 0 ? <div style={{ position: 'absolute', left: (kartu.w - CH.w) / 2, top: (kartu.h - CH.h) / 2, width: CH.w, height: CH.h,
              opacity: isiChart < 1 ? isiChart : undefined }}><IsiChartS07 f={f} /></div> : null}
          </div>
          {/* bingkai putih panel padang menebal bersama morf */}
          {morf > 0 ? <div style={{ position: 'absolute', inset: 0, borderRadius: 32, boxShadow: `inset 0 0 0 ${SISI * morf}px ${B.white}` }} /> : null}
        </div>) : null}
      {sama > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 90, height: 90, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${B.blue}`,
          boxSizing: 'border-box', display: 'grid', placeItems: 'center', fontFamily: F, fontWeight: 800, fontSize: 52, lineHeight: 1, color: B.blue, transformOrigin: 'center',
          transform: `translate3d(${PANEL.x - PANEL.w / 2 + PANEL_LENCANA.sama.x - 45}px, ${PANEL.y - PANEL.h / 2 + PANEL_LENCANA.sama.y - 45}px, 0) scale(${skalaPop(sama)})`, boxShadow: bayanganDengan(B.blue, 1) }}>=</div>) : null}

      {/* ═════ investor (avatar) · ikon mata · BELI diklik ═════ */}
      {[0, 1, 2, 3].map((k) => {
        const p = ada(tA.lihat[k]);
        const tBeli = beliDari(k);
        return (
          <React.Fragment key={k}>
            <Avatar x={xInv(k)} y={INV.y} d={INV.d} p={p} />
            <Lencana x={xInv(k)} y={INV.y} d={INV.d} p={ada(tA.lihat[k] + 12)} warna={B.blue} ikon="mata" besar={46} />
            <Klik f={f} x={xInv(k)} y={INV.chip} t={tBeli} warna={B.blue}>
              <Chip x={xInv(k)} y={INV.chip} teks="BELI" warna={B.blue} p={ada(tBeli[0] ?? 1e9)} size={22} />
            </Klik>
          </React.Fragment>);
      })}

      {/* ═════ kamu (menghadap kanan, tanpa label) ═════ */}
      <KarakterLingkar pose={KAMU} x={KM.x} y={KM.y} D={KM.D} s={kamuP} warna={B.turq} cermin />
      {/* gelembung di ATAS KEPALA, ekor menunjuk kepala; yang lama selesai keluar sebelum yang baru masuk */}
      <Kutipan x={KEPALA_KM.x} y={KEPALA_KM.atas - JARAK - 20 - 31} ekor="tengah" teks="Apakah saham ini masih layak dibeli?" p={tanya1} warna={B.blue} size={24} coret={coret} />
      <Kutipan x={KEPALA_KM.x} y={KEPALA_KM.atas - JARAK - 20 - 44} ekor="tengah" lebarMaks={440} teks="Kalau nggak beli sekarang, apa saya akan terlambat?" p={tanya2}
        warna={B.orange} size={24} />
      <Notifikasi x={KM.x} y={NOTIF.y} p={notif} ikon="rayakan" warna={ARAH.naik} judul="Notifikasi" isi="Banyak yang sudah profit" w={NOTIF.w} arah="kiri" />
      <Chip x={PILIH_X[0]} y={PILIH_Y} teks="Tunggu & periksa" warna={B.gray} p={pilihP * tunggu} size={22} kosong={tunggu < 0.99} />
      <Klik f={f} x={PILIH_X[1]} y={PILIH_Y} t={[tB.tekan]} warna={B.blue}>
        <Chip x={PILIH_X[1]} y={PILIH_Y} teks="BELI" warna={B.blue} p={pilihP} size={26} />
      </Klik>
      <Chip x={KM.x} y={KAMU_BELI_Y} teks="BELI" warna={B.blue} p={kamuBeli} size={22} />

      {/* ═════ D: orang berikutnya — gelembung di BAWAH investor ke-4, ekor ke atas ═════ */}
      {kata > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(${xInv(3)}px, ${INV.y + INV.d / 2 + JARAK + 18 + 31}px, 0) translate(-50%, -50%) scale(${skalaPop(kata)})`,
          transformOrigin: '50% 0' }}>
          <div style={{ position: 'relative', background: B.white, borderRadius: 26, padding: '14px 26px', border: `3px solid ${rgba(B.blue, 0.3)}`, fontFamily: F, fontSize: 24,
            fontWeight: 800, color: B.night, whiteSpace: 'nowrap', boxShadow: bayanganDengan(B.blue, 1) }}>
            “Lihat, berarti mereka benar.”
            <div style={{ position: 'absolute', left: '50%', top: -18, marginLeft: -16, width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent',
              borderBottom: `18px solid ${B.white}` }} />
          </div>
        </div>) : null}

      {/* ═════ E: loop beli → naik → menarik pembeli ═════ */}
      {loop[0] > 0 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <Penghubung d={`M ${cx + 470} ${INV.y + 20} C ${cx + 560} 680, ${cx + 560} 380, ${cx + CH.w / 2 + 20} 330`} g={loop[0]} warna={ARAH.naik} titik={false}
            panah={{ x: cx + CH.w / 2 + 20, y: 330, sudut: Math.PI }} />
          <Penghubung d={`M ${cx - CH.w / 2 - 20} 330 C ${cx - 560} 380, ${cx - 560} 680, ${cx - 470} ${INV.y + 20}`} g={loop[1]} warna={B.blue} titik={false}
            panah={{ x: cx - 470, y: INV.y + 20, sudut: 0 }} />
          {putar >= 0 && titikP > 0.001 ? (() => {
            const u = Math.min(0.9999, putar * 3) % 1, t = io(u < 0.5 ? u * 2 : (u - 0.5) * 2);
            const [x, y] = u < 0.5 ? [lerp(cx + 470, cx + CH.w / 2 + 20, t) + 100 * Math.sin(Math.PI * t), lerp(INV.y + 20, 330, t)]
              : [lerp(cx - CH.w / 2 - 20, cx - 470, t) - 100 * Math.sin(Math.PI * t), lerp(330, INV.y + 20, t)];
            return <circle cx={x} cy={y} r={11 * skalaPop(titikP)} fill={u < 0.5 ? ARAH.naik : B.blue} />;
          })() : null}
        </svg>) : null}
      </div>
      {/* TEKS LAYAR (gaya judul rumah) — y 122 (dulu 56, di pita logo) */}
      {f >= tE.teks[0] - 45 ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: JUDUL_E7, textAlign: 'center', lineHeight: 1.18 }}>
          <div><WordText f={f} at={tE.teks[0]} until={EKOR} style={{ fontFamily: F, fontSize: 46, fontWeight: 800, color: B.night }}>Pembelian mendorong harga naik;</WordText></div>
          <div><WordText f={f} at={tE.teks[1]} until={EKOR} style={{ fontFamily: F, fontSize: 46, fontWeight: 800, color: B.blue }}>kenaikan menarik pembeli berikutnya.</WordText></div>
        </div>) : null}
    </>);
};
