import React from 'react';
import { ARAH, B, F, R, SISI, bayanganDengan, lerp, rgba } from '../theme';
import { cin, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Chip, Kutipan, Label, Lencana } from '../parts/umum';
import { Kaca, KarakterLingkar, Penghubung, type PoseKarakter } from '../parts/kaca';
import { Notifikasi } from '../parts/nyata';
import { Avatar } from '../parts/v06';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { gaya as gayaT, JALAN_FRAME, LARI_FRAME, panjangSiklus as panjangT } from '../flat/rigTegak';
import { HutanLayar, TANAH_LAYAR, TokohTegakLapis, ambil, simulasi } from '../flat/dunia';
import { SingaRig, POSE_DIAM_SINGA } from '../flat/rigSinga';
import { KEL_RUPA } from '../s01flat/Scene01Flat';
import { ANTM_S07 } from '../data/lilinRiil.gen';
import { BatangLilin, KisiLilin, bentuk, domainHalus, hargaBulat, kemajuanLilin } from '../parts/lilinRiil';

/**
 * SCENE 07 — Saat Harga Naik, Kelompok Menciptakan Buktinya Sendiri (BATAS.s7 – BATAS.s8). GAYA RUMAH (bukan analogi — Simon 27 Okt: "selain style
 * analogi, gunakan style yang sama seperti video yang sudah kita buat. menggunakan gambar orang asli, dan icon illustrasi"): latar rumah, kartu kaca,
 * avatar investor, foto "kamu" (pria kemeja biru = pembeli Scene 05). Sisipan perbandingan padang rumput = panel ilustrasi flat (bagian analogi).
 *  A f15448–16000 SATU chart berkelanjutan muncul di tengah, satu investor memperhatikan; "makin banyak orang melihat" → investor bertambah (ikon mata);
 *    "makin banyak orang membeli" → BELI satu per satu, TIAP BELI memicu satu candle naik (langkah 1–2).
 *  B f16016–16525 "kamu" masuk (chart memberi ruang): gelembung "Apakah saham ini masih layak dibeli?" dicoret → "Kalau nggak beli sekarang, apa saya akan
 *    terlambat?"; notifikasi profit SEKALI; dua pilihan "Tunggu & periksa" / BELI → BELI ditekan (takut terlambat) → candle naik (langkah 3–4).
 *  C f16547–16856 panel padang rumput: pelari bertambah ×1 → ×4, siluet singa TETAP (bingkai putus-putus sama, "=") (langkah 6).
 *  D f16878–17498 kembali ke chart: tiga BELI bersama-sama → harga benar-benar naik; investor berikutnya: "Lihat, berarti mereka benar." → BELI.
 *  E f17515–17985 loop putus-putus beli → harga naik → menarik pembeli (titik berputar), dua BELI lagi; TEKS LAYAR "Pembelian mendorong harga naik;
 *    kenaikan menarik pembeli berikutnya." (langkah 5 & 7). Ekor: semua keluar 60 f berpusat di frame pertama Scene 08 + 30.
 * Chart = candle harian RIIL ANTM 5 Nov – 18 Des 2020 (tanpa nama saham; src/data/lilinRiil.gen.ts): Rp1.145 → Rp1.950.
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

/* ════════════════════════════ WAKTU ════════════════════════════ */
/** kamu = pria kemeja biru (sama dengan pembeli Scene 05) */
const KAMU: PoseKarakter = { src: 'karakter/murid_pikir_biru.webp', w: 1145, h: 1374, cx: 590, cy: 504, r: 280 };
/** tiap aksi BELI (siapa, kapan, naik berapa) — candle baru tumbuh 10 f SESUDAH tombol ditekan (sebab → akibat) */
type Beli = { siapa: number; t: number; naik: number };
const BELI: Beli[] = [
  { siapa: 0, t: T.membeli, naik: 38 }, { siapa: 1, t: T.harga2 + 4, naik: 40 }, { siapa: 2, t: T.naik2 + 6, naik: 42 },
  { siapa: -1, t: T.terlambat + 22, naik: 46 },
  { siapa: 0, t: T.bersama2, naik: 58 }, { siapa: 1, t: T.bersama2 + 14, naik: 60 }, { siapa: 2, t: T.bersama2 + 28, naik: 64 },
  { siapa: 3, t: T.benar2 + 16, naik: 52 },
  { siapa: 1, t: T.menciptakan + 6, naik: 50 }, { siapa: 0, t: T.meyakinkan + 6, naik: 54 },
];
const tA = { chart: T.reaksi, lihat: [T.reaksi + 30, T.banyak, T.melihat, T.berikutnya] };
const tB = { geser: T.pertanyaan + 20, kamu: T.pertanyaan + 20, tanya1: T.apakah - 10, coret: T.menjadi, keluar1: T.menjadi + 30, tanya2: T.kalau + 20, notif: T.nggak,
  pilih: T.apa, tekan: T.terlambat + 6 };
// panel = keluar + 60 → pop masuk mulai TEPAT saat chart selesai keluar (dulu bersamaan: panel menimpa chart yang sedang mengecil; tanpa frame kosong)
const tC = { keluar: T.padang - 16, panel: T.padang + 44, pelari: [T.padang + 50, T.berlari, T.bersama, T.bersama + 22], bingkai: T.hewan, sama: T.lebih, panelKeluar: T.tapi - 20,
  kembali: T.pasar2 + 20 };
const tD = { orang: T.berikutnya, kata: T.lihat - 10, kataKeluar: T.inilah };
const tE = { loop: [T.refleksivitas, T.aksi], teks: [T.aksi, T.meyakinkan] };

/* ════════════════════════════ CHART BERKELANJUTAN ════════════════════════════ */
const CH = { y: 420, w: 820, h: 420 };
/* candle HARIAN RIIL (Simon 27 Okt: candlestick realistis seperti asli): ANTM 5 Nov – 18 Des 2020 tanpa nama — 18 candle dasar (Nov) lalu reli Des:
 * 10 candle HIJAU = 10 aksi BELI (sebab → akibat, terbentuk 7 f sesudah tombol), 3 candle merah (4 · 11 · 17 Des) terbentuk sendiri di antaranya. */
const D = ANTM_S07;
const DASAR = 18;
const I_HIJAU = D.map((b, k) => ({ k, naik: b.c > b.o })).filter((x) => x.k >= DASAR && x.naik).map((x) => x.k); // 10 candle = 10 BELI
const WAKTU = (() => {
  const w: number[] = [];
  I_HIJAU.forEach((k, j) => { w[k - DASAR] = BELI[j].t + 7; });
  D.forEach((_, k) => { if (k >= DASAR && w[k - DASAR] === undefined) w[k - DASAR] = (w[k - DASAR - 1] + w[k - DASAR + 1]) / 2 + (k === 21 ? -60 : 0); });
  return w;
})();
const tampak = (f: number) => D.map((b, k) => ({ b, u: kemajuanLilin(f, k, DASAR, WAKTU), k })).filter((x) => x.u > 0);
const hargaPada = (f: number) => { const t = tampak(f), x = t[t.length - 1]; return bentuk(x.b, x.u).c; };
const rp = (v: number) => `Rp${hargaBulat(v).toLocaleString('id-ID')}`;
const LO = Math.min(...D.slice(0, DASAR).map((b) => b.l)) - 20;
/** batas atas domain melebar halus mengikuti harga (chart yang sama — tidak dibangun ulang) */
const hiPada = domainHalus(AWAL, AKHIR + 80, (f) => Math.max(...tampak(f).map((x) => bentuk(x.b, x.u).h)) + 50);
const Chart: React.FC<{ f: number; w: number; h: number }> = ({ f, w, h }) => {
  const hi = hiPada(f), Y = (v: number) => h - 8 - ((h - 16) * (v - LO)) / (hi - LO), slot = w / (D.length + 1);
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
      <KisiLilin w={w} h={h} />
      {tampak(f).map(({ b, u, k }) => <BatangLilin key={k} c={bentuk(b, u)} x={slot * (k + 0.5)} slot={slot} Y={Y} />)}
    </svg>);
};

/* ════════════════════════════ PANEL PADANG (ANALOGI, FLAT) ════════════════════════════ */
export const PANEL = { x: 960, y: 440, w: 1120, h: 540, k: 0.6 };
const S_P = 0.82;
const lajuLari = (panjangT(1) * S_P) / LARI_FRAME;
/** pelari panel padang (dipakai juga Scene 08): simulasi mulai `awal`, pelari ke-k mulai berlari di tPelari[k] */
export const simPelari = (tPelari: number[], awal: number, n: number) =>
  tPelari.map((t, k) => simulasi(n, (g) => cin(awal + g, t, 20) * lajuLari, () => 1, S_P, 520 - k * 30, -(k * 9 + 1) / JALAN_FRAME, panjangT));
const PELARI = simPelari(tC.pelari, AWAL, AKHIR + 80 - AWAL);
/** PANEL PADANG (analogi flat): pelari bertambah, siluet singa UKURAN TETAP (bingkai putus-putus) — isi layar 1920 × 1080 diskalakan PANEL.k */
export const PanelPadang: React.FC<{ f: number; pelari: ReturnType<typeof simPelari>; tPelari: number[]; tBingkai: number; awal: number }> = ({ f, pelari, tPelari, tBingkai, awal }) => {
  const bingkai = cin(f, tBingkai);
  const jumlah = tPelari.filter((t) => f >= t - 10).length;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${PANEL.k})` }}>
      <HutanLayar kamX={960} C={-3600} lapis="belakang" />
      {pelari.map((j, k) => {
        const a = ambil(j, f - awal);
        if (f < tPelari[k] - 10) return null;
        const r = KEL_RUPA[k % 3];
        return <TokohTegakLapis key={k} x={a.x} tanah={TANAH_LAYAR} s={S_P} pose={gayaT(a.psi, 1, a.a)} kostum="dulu" kepala={k === 0 ? 'simon' : r.kepala} warna={k === 0 ? undefined : r.warna} />;
      })}
      {/* singa: siluet di balik rumput — UKURAN TETAP (bingkai putus-putus tidak berubah) */}
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs><filter id="s07-siluet" x="-10%" y="-10%" width="120%" height="120%"><feFlood floodColor="#3A3442" /><feComposite in2="SourceAlpha" operator="in" /></filter></defs>
        <g filter="url(#s07-siluet)" opacity={0.92}><SingaRig pose={POSE_DIAM_SINGA()} x={80} tanah={TANAH_LAYAR + 24} s={0.465} bayangan={false} /></g>
        {bingkai > 0 ? <Penghubung d="M 60 520 L 470 520 L 470 890 L 60 890 Z" g={bingkai} warna={B.white} tebal={5} titik={false} /> : null}
      </svg>
      <HutanLayar kamX={960} C={-3600} lapis="depan" />
      {/* jumlah pelari bertambah */}
      <Lencana x={1500} y={240} d={0} p={popIn(f, tPelari[0] + 20)} warna={B.orange} teks={`×${Math.max(1, jumlah)}`} besar={130} />
    </div>);
};

/* ════════════════════════════ SCENE ════════════════════════════ */
export const Scene07: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL || f >= AKHIR + 70) return null;
  const keluar = popOut(f, EKOR);
  /* chart & kelompok: masuk di A, keluar untuk panel padang (C), kembali di D */
  const grupP = popIn(f, tA.chart) * popOut(f, tC.keluar) + popIn(f, tC.kembali) * keluar;
  const geser = cin(f, tB.geser); // kamu masuk → chart & investor memberi ruang
  const cx = 960 + 170 * geser;
  /* investor: 3 dulu (slot −200/0/200), investor ke-4 masuk di D → semua bergeser memberi ruang */
  const ruang4 = cin(f, tD.orang - 10);
  const xInv = (k: number) => cx + (k < 3 ? lerp(-200 + 200 * k, -300 + 200 * k, ruang4) : 300);
  const invP = tA.lihat.map((t) => popIn(f, t));
  const tekanSiapa = (k: number) => Math.max(0, ...BELI.filter((b) => b.siapa === k).map((b) => Math.sin(Math.PI * R(f, b.t, b.t + 24, 0, 1, (x) => x))));
  const beliPertama = (k: number) => BELI.find((b) => b.siapa === k)?.t ?? 1e9;
  const harga = hargaPada(f);
  const naikP = Math.max(...BELI.map((b) => Math.sin(Math.PI * R(f, b.t + 22, b.t + 70, 0, 1, (x) => x))));

  /* kamu */
  const kamuP = popIn(f, tB.kamu) * popOut(f, tC.keluar) + popIn(f, tC.kembali) * keluar;
  const tanya1 = popIn(f, tB.tanya1) * popOut(f, tB.keluar1), coret = cin(f, tB.coret - 15); // garis coret 60 f, selesai tepat saat gelembung mulai keluar
  const tanya2 = popIn(f, tB.tanya2) * popOut(f, tC.keluar);
  const notif = R(f, tB.notif - 50, tB.notif + 10, 0, 1, (x) => x) * (1 - R(f, tC.keluar - 30, tC.keluar + 30, 0, 1, (x) => x)); // linear 60 f: swipeOff sudah meng-ease // notifikasi profit SEKALI, bertahan sampai panel padang (dulu sekejap)
  const pilihP = popIn(f, tB.pilih) * popOut(f, tC.keluar);
  const tekanKamu = Math.sin(Math.PI * R(f, tB.tekan, tB.tekan + 24, 0, 1, (x) => x));
  const tunggu = 1 - 0.55 * cin(f, tB.tekan + 10); // pilihan menunggu meredup sesudah BELI ditekan
  const kamuBeli = popIn(f, tC.kembali) * keluar; // sesudah kembali: kamu juga pembeli (BELI kecil)

  /* panel padang */
  const panelP = popIn(f, tC.panel) * popOut(f, tC.panelKeluar);
  const sama = popIn(f, tC.sama) * popOut(f, tC.panelKeluar);

  /* D / E */
  const kata = popIn(f, tD.kata) * popOut(f, tD.kataKeluar);
  const loop = tE.loop.map((t) => cin(f, t) * keluar);
  const putar = R(f, tE.loop[1], AKHIR, 0, 1, (x) => x);

  return (
    <>
      {/* ═════ chart berkelanjutan ═════ */}
      <Kaca x={cx} y={CH.y} w={CH.w} h={CH.h} p={grupP} warna={B.blue}>
        <div style={{ position: 'absolute', left: 30, top: 22, fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night }}>{rp(harga)}</div>
        {naikP > 0.01 ? <div style={{ position: 'absolute', right: 30, top: 24, padding: '6px 16px', borderRadius: 999, background: rgba(ARAH.naik, 0.14), color: ARAH.naik,
          fontFamily: F, fontSize: 26, fontWeight: 800, transform: `scale(${skalaPop(Math.min(1, naikP * 1.6))})` }}>▲ naik</div> : null}
        <div style={{ position: 'absolute', left: 30, top: 92, width: CH.w - 60, height: CH.h - 120 }}><Chart f={f} w={CH.w - 60} h={CH.h - 120} /></div>
      </Kaca>
      {/* ═════ investor (avatar) · ikon mata · BELI ═════ */}
      {[0, 1, 2, 3].map((k) => {
        const p = invP[k] * grupP;
        const dip = 1 - 0.12 * tekanSiapa(k);
        return (
          <React.Fragment key={k}>
            <Avatar x={xInv(k)} y={780} d={100} p={p} />
            <Lencana x={xInv(k)} y={780} d={100} p={popIn(f, tA.lihat[k] + 12) * grupP} warna={B.blue} ikon="mata" besar={46} />
            <div style={{ position: 'absolute', inset: 0, transformOrigin: `${xInv(k)}px 690px`, transform: dip < 0.9999 ? `scale(${dip})` : undefined }}>
              <Chip x={xInv(k)} y={690} teks="BELI" warna={B.blue} p={popIn(f, beliPertama(k)) * grupP} size={22} />
            </div>
          </React.Fragment>);
      })}

      {/* ═════ kamu ═════ */}
      <KarakterLingkar pose={KAMU} x={300} y={470} D={260} s={kamuP} warna={B.turq} />
      {/* label ikut pop bersama fotonya (dulu tetap tampil saat foto keluar untuk panel padang) */}
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '300px 470px', transform: `scale(${skalaPop(Math.min(1, kamuP))})`, opacity: kamuP > 0.001 ? undefined : 0 }}>
        <Label x={300} y={636} teks="Kamu" f={f} at={tB.kamu + 20} keluar={EKOR - 20} size={32} />
      </div>
      <Kutipan x={700} y={150} teks="Apakah saham ini masih layak dibeli?" p={tanya1} warna={B.blue} size={28} coret={coret} />
      <Kutipan x={760} y={150} teks="Kalau nggak beli sekarang, apa saya akan terlambat?" p={tanya2} warna={B.orange} size={28} />
      <Notifikasi x={300} y={735} p={notif} ikon="rayakan" warna={ARAH.naik} judul="Notifikasi" isi="Banyak yang sudah profit" w={400} />
      <Chip x={190} y={850} teks="Tunggu & periksa" warna={B.gray} p={pilihP * tunggu} size={22} kosong={tunggu < 0.99} />
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '420px 850px', transform: tekanKamu > 0 ? `scale(${1 - 0.12 * tekanKamu})` : undefined }}>
        <Chip x={420} y={850} teks="BELI" warna={B.blue} p={pilihP} size={26} />
      </div>
      <Chip x={300} y={700} teks="BELI" warna={B.blue} p={kamuBeli} size={22} />

      {/* ═════ C: panel padang rumput (analogi) ═════ */}
      {panelP > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL.w, height: PANEL.h, transformOrigin: 'center',
          transform: `translate3d(${PANEL.x - PANEL.w / 2}px, ${PANEL.y - PANEL.h / 2}px, 0) scale(${skalaPop(panelP)})` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 32, overflow: 'hidden', border: `${SISI}px solid ${B.white}`, boxSizing: 'border-box',
            boxShadow: bayanganDengan(B.blue, 1), background: '#B9E3CB' }}>
            <div style={{ position: 'absolute', left: (PANEL.w - 1920 * PANEL.k) / 2, top: PANEL.h - 1080 * PANEL.k + 40 }}><PanelPadang f={f} pelari={PELARI} tPelari={tC.pelari} tBingkai={tC.bingkai} awal={AWAL} /></div>
          </div>
        </div>) : null}
      {sama > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 90, height: 90, borderRadius: '50%', background: B.white, border: `${SISI}px solid ${B.blue}`,
          boxSizing: 'border-box', display: 'grid', placeItems: 'center', fontFamily: F, fontWeight: 800, fontSize: 52, lineHeight: 1, color: B.blue,
          transform: `translate3d(${PANEL.x - PANEL.w / 2 + 290 - 45}px, ${190 - 45}px, 0) scale(${skalaPop(sama)})`, boxShadow: bayanganDengan(B.blue, 1) }}>=</div>) : null}

      {/* ═════ D: orang berikutnya ═════ */}
      {/* gelembung di BAWAH investor ke-4, ekor ke atas (dulu menimpa tepi chart) */}
      {kata > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(${xInv(3)}px, 900px, 0) translate(-50%, -50%) scale(${skalaPop(kata)})`, transformOrigin: '50% 0' }}>
          <div style={{ position: 'relative', background: B.white, borderRadius: 26, padding: '14px 26px', border: `3px solid ${rgba(B.blue, 0.3)}`, fontFamily: F, fontSize: 26,
            fontWeight: 800, color: B.night, whiteSpace: 'nowrap', boxShadow: bayanganDengan(B.blue, 1) }}>
            “Lihat, berarti mereka benar.”
            <div style={{ position: 'absolute', left: '50%', top: -18, marginLeft: -16, width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent',
              borderBottom: `18px solid ${B.white}` }} />
          </div>
        </div>) : null}

      {/* ═════ E: loop beli → naik → menarik pembeli ═════ */}
      {loop[0] > 0 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <Penghubung d={`M ${cx + 470} 760 C ${cx + 600} 700, ${cx + 600} 380, ${cx + CH.w / 2 + 20} 330`} g={loop[0]} warna={ARAH.naik} titik={false}
            panah={{ x: cx + CH.w / 2 + 20, y: 330, sudut: Math.PI }} />
          <Penghubung d={`M ${cx - CH.w / 2 - 20} 330 C ${cx - 600} 380, ${cx - 600} 700, ${cx - 470} 760`} g={loop[1]} warna={B.blue} titik={false}
            panah={{ x: cx - 470, y: 760, sudut: 0 }} />
          {putar > 0 && putar < 1 ? (() => {
            const u = (putar * 3) % 1, t = u < 0.5 ? u * 2 : (u - 0.5) * 2;
            const [x, y] = u < 0.5 ? [lerp(cx + 470, cx + CH.w / 2 + 20, t) + 130 * Math.sin(Math.PI * t), lerp(760, 330, t)]
              : [lerp(cx - CH.w / 2 - 20, cx - 470, t) - 130 * Math.sin(Math.PI * t), lerp(330, 760, t)];
            return <circle cx={x} cy={y} r={11} fill={u < 0.5 ? ARAH.naik : B.blue} />;
          })() : null}
        </svg>) : null}
      {/* TEKS LAYAR (gaya judul rumah) */}
      {f >= tE.teks[0] - 40 ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 56, textAlign: 'center', lineHeight: 1.18 }}>
          <div><WordText f={f} at={tE.teks[0]} until={EKOR} style={{ fontFamily: F, fontSize: 46, fontWeight: 800, color: B.night }}>Pembelian mendorong harga naik;</WordText></div>
          <div><WordText f={f} at={tE.teks[1]} until={EKOR} style={{ fontFamily: F, fontSize: 46, fontWeight: 800, color: B.blue }}>kenaikan menarik pembeli berikutnya.</WordText></div>
        </div>) : null}
    </>);
};
