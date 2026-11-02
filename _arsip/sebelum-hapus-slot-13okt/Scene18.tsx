import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, CORET, F, R, WARNA, io, lerp, rgba } from '../theme';
import { Icon, cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import type { KunciIkon } from '../ikon';
import { Bulat, DompetUang, Label, Lencana, denyut } from '../parts/umum';
import { Kaca, MaskerKeluar, Penghubung, bayanganKaca, durMasker, geser } from '../parts/kaca';
import { S19_MASUK } from '../s19/Scene19';

/**
 * SCENE 18 — Bab "Produk adalah Langkah Terakhir". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  GAJI / BONUS / THR ↓ Untuk apa? ↓ Kapan dipakai? ↓ Pilih tempat uangnya
 *   TEXT    "Tentukan tugasnya dulu" / "[baru] pilih produknya"
 * Rakitan 13 Okt — acuan Simon ref-08 (masukan di kiri → garis menyatu → kartu daftar di tengah → bercabang ke kanan) + ref-07 (kolom
 * ketik bertanya), gaya kartu kaca rumah:
 *   A  "Jadi nanti kalau gaji, bonus, atau THR masuk, jangan langsung bertanya: 'Saya harus beli apa?'"
 *        MASUK = masker Scene 17 mendarat jadi ubin Gaji · Bonus · THR di katanya · kolom ketik di tengah, "Saya harus beli apa?" terketik
 *        di katanya → dicoret MERAH
 *   B  "Coba mulai dari dua pertanyaan: 'Uang ini untuk apa?' dan 'Kapan uang ini akan dipakai?'"
 *        kolom ketik keluar · judul TEXT · garis dari tiga ubin menyatu ke KARTU dua pertanyaan · baris "Untuk apa?" · baris "Kapan dipakai?"
 *   C  "Dua jawaban itu akan membantu kita menentukan tempat yang lebih sesuai untuk uang tersebut."
 *        dua baris tercentang di "dua jawaban" · garis bercabang ke tiga dompet (tempat uangnya) · uang mengalir · ✓ di "sesuai" ·
 *        sub-judul TEXT (sorot "baru")
 * KELUAR = masker ke dompet Uang Aktif baris pertama tabel Scene 19.
 */

const [gaji, bonus, thr, masuk, jangan, bertanya, saya, apa, coba, pertanyaan, uang1, untuk, apa2, dan, kapan, uang3, akan, dipakai, dua, jawaban, itu, membantu, menentukan, tempat, sesuai,
  untuk2, uang2, tersebut] = urut([
  'gaji', 'bonus', 'thr', 'masuk', 'jangan', 'bertanya', 'saya', 'apa', 'coba', 'pertanyaan', 'uang', 'untuk', 'apa', 'dan', 'kapan', 'uang', 'akan', 'dipakai', 'dua', 'jawaban', 'itu',
  'membantu', 'menentukan', 'tempat', 'sesuai', 'untuk', 'uang', 'tersebut'], BATAS.s18);

/* ── tata letak (ref-08): ubin kiri x 330 · kartu tengah 960 · dompet kanan x 1590 ── */
const KIRI = { x: 330, y: [370, 580, 790], d: 112 };
const KANAN = { x: 1590, y: [370, 580, 790], d: 100 };
const KARTU = { x: 960, y: 580, w: 600, h: 330 };
const BARIS = [KARTU.y - 72, KARTU.y + 72];
const KETIK = { x: 960, y: 580, w: 780, h: 112 };
const PEMASUKAN: { teks: string; ikon: KunciIkon; warna: string }[] = [
  { teks: 'Gaji', ikon: 'gaji', warna: WARNA.langit }, { teks: 'Bonus', ikon: 'bonus', warna: WARNA.ungu }, { teks: 'THR', ikon: 'thr', warna: WARNA.turkisMuda },
];
const TANYA: { teks: string; ikon: KunciIkon; warna: string }[] = [{ teks: 'Untuk apa?', ikon: 'pertanyaan', warna: B.blue }, { teks: 'Kapan dipakai?', ikon: 'kalender', warna: B.turq }];
const KALIMAT = 'Saya harus beli apa?';

/** GESER BERTAHAP (tengah di setiap momen, aturan Simon), tiga tahap 60f: (1) hanya kolom ubin Gaji · Bonus · THR → kolom di tengah
 *  (GESER_UBIN) · (2) kolom ketik / kartu pertanyaan ikut → GESER_TENGAH · (3) cabang kanan (tiga dompet) → GESER_AKHIR (label dompet kanan
 *  lebih lebar dari label kiri). Masker Scene 17 mendarat di ubin Gaji pada posisi tahap (1) = tengah layar. */
const GESER_UBIN = 960 - KIRI.x, GESER_TENGAH = 170, GESER_AKHIR = -40;
/** MASUK Scene 18 = masker Scene 17 menyusut ke ubin Gaji (mendarat 40f sesudah batas, sebelum "gaji") */
export const S18_MASUK = { x: KIRI.x + GESER_UBIN, y: KIRI.y[1], r: KIRI.d / 2, warna: PEMASUKAN[0].warna, mulai: BATAS.s18 - 20 };
const DARAT = S18_MASUK.mulai + durMasker;

const T = {
  ubin: [DARAT, bonus, thr], label: [gaji, bonus + 10, thr + 10], denyutMasuk: masuk, ketik: jangan + 20, denyutKetik: bertanya, huruf: [saya - 6, apa + 14], coret: apa + 34,
  ketikKeluar: coba + 6, judul: coba + 10, kartu: pertanyaan - 10, garisKiri: pertanyaan + 10, baris: [untuk - 10, kapan - 10], centang: [dua + 10, jawaban + 10],
  garisKanan: membantu, dompet: [menentukan - 6, menentukan + 10, menentukan + 26], denyutTempat: tempat, alir: [itu + 10, sesuai - 30], centangAkhir: sesuai + 10,
  denyutDompet: [untuk2, uang2], denyutAkhir: tersebut, sub: menentukan, subSorot: tempat,
  // "UANG INI untuk apa" / "kapan UANG INI akan DIPAKAI": ubin pemasukan berdenyut bergiliran · ikon baris berdenyut di kata tanyanya (isi jendela diam)
  denyutUang: [uang1, uang3], denyutBaris: [[apa2 + 20, dan], [akan, dipakai + 10]],
};

/** jalur siku membulat dari (x0, y0) ke (x1, y1) lewat kolom tekuk xm (ref-08) */
const siku = (x0: number, y0: number, xm: number, x1: number, y1: number) => {
  if (Math.abs(y1 - y0) < 1) return `M ${x0} ${y0} L ${x1} ${y1}`;
  const s = Math.sign(y1 - y0), r = Math.min(40, Math.abs(y1 - y0) / 2);
  return `M ${x0} ${y0} L ${xm - r} ${y0} Q ${xm} ${y0} ${xm} ${y0 + s * r} L ${xm} ${y1 - s * r} Q ${xm} ${y1} ${xm + r} ${y1} L ${x1} ${y1}`;
};

/** KELUAR Scene 18 = milik Scene 19: masker lingkaran menyusut ke dompet Uang Aktif tabel Scene 19 (S19_MASUK) */
export const S18_KELUAR = S19_MASUK.mulai;
export const Scene18: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s18 - 30 || f >= S18_KELUAR + durMasker) return null;
  const coret = R(f, T.coret - 30, T.coret + 30, 0, 1, io);
  const kelK = cin(f, T.ketikKeluar);
  const nHuruf = Math.round(R(f, T.huruf[0], T.huruf[1], 0, KALIMAT.length, (t) => t));
  return (
    <MaskerKeluar f={f} mulai={S18_KELUAR} ke={S19_MASUK} warna={S19_MASUK.warna}>
      <div style={{ position: 'absolute', inset: 0, transform: geser(lerp(lerp(GESER_UBIN, GESER_TENGAH, R(f, T.ketik - 30, T.ketik + 30, 0, 1, io)), GESER_AKHIR,
        R(f, T.garisKanan - 40, T.garisKanan + 20, 0, 1, io)),
        // tegak: kolom ubin tumbuh ke bawah (Gaji → Bonus → THR) — yang sudah ada tetap berpusat
        (KIRI.y[1] - KIRI.y[0]) / 2 * ((1 - cin(f, T.ubin[1])) + (1 - cin(f, T.ubin[2])))) }}>
      {/* garis menyatu (kiri) & bercabang (kanan) — ref-08 */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {KIRI.y.map((y, i) => (
          <Penghubung key={`k${i}`} d={siku(KIRI.x + KIRI.d / 2 + 12, y, 560, KARTU.x - KARTU.w / 2 - 6, KARTU.y)} g={R(f, T.garisKiri - 30 + 8 * i, T.garisKiri + 30 + 8 * i, 0, 1, io)}
            warna={PEMASUKAN[i].warna} tebal={5} dash={false} />))}
        {KANAN.y.map((y, i) => (
          <Penghubung key={`n${i}`} d={siku(KARTU.x + KARTU.w / 2 + 6, KARTU.y, 1380, KANAN.x - KANAN.d / 2 - 12, y)} g={R(f, T.garisKanan - 30 + 8 * i, T.garisKanan + 30 + 8 * i, 0, 1, io)}
            warna={[B.blue, B.turq, B.orange][i]} tebal={5} dash={false} />))}
      </svg>

      {/* kiri: Gaji · Bonus · THR */}
      {PEMASUKAN.map((c, i) => (
        <React.Fragment key={c.teks}>
          <Bulat x={KIRI.x} y={KIRI.y[i]} d={KIRI.d} warna={c.warna} ikon={c.ikon} ikonAlfa={i === 0 ? R(f, DARAT, DARAT + 20, 0, 1, io) : 1}
            p={(i === 0 ? (f >= DARAT ? 0.99996 : 0) : popIn(f, T.ubin[i])) * (1 + denyut(f, T.denyutMasuk + 10 * i, 0.06) + denyut(f, T.alir[0] - 20 + 6 * i, 0.05)
              + T.denyutUang.reduce((s, t) => s + denyut(f, t + 12 * i, 0.07), 0))} />
          <Label x={KIRI.x} y={KIRI.y[i] + KIRI.d / 2 + 34} teks={c.teks} f={f} at={T.label[i]} size={30} />
        </React.Fragment>))}

      {/* A: kolom ketik (ref-07) — "Saya harus beli apa?" terketik di katanya, lalu dicoret */}
      {kelK < 1 ? (() => {
        const p = popIn(f, T.ketik) * (1 + denyut(f, T.denyutKetik, 0.04));
        if (p <= 0.001) return null;
        const teks = KALIMAT.slice(0, nHuruf);
        return (
          <div style={{ position: 'absolute', left: 0, top: 0, width: KETIK.w, height: KETIK.h, transformOrigin: 'center', opacity: 1 - kelK,
            transform: `${geser(KETIK.x - KETIK.w / 2, KETIK.y - KETIK.h / 2 - 40 * kelK)} scale(${p * (1 - 0.1 * kelK)})`, borderRadius: KETIK.h / 2,
            background: `linear-gradient(165deg, ${rgba(B.white, 0.98)}, ${rgba(B.white, 0.9)})`, boxShadow: bayanganKaca(B.blue) }}>
            <div style={{ position: 'absolute', left: 48, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 42, fontWeight: 700,
              color: coret > 0.5 ? B.gray : B.night, whiteSpace: 'pre' }}>
              {teks}
              {nHuruf < KALIMAT.length || f < T.coret - 30 ? <span style={{ display: 'inline-block', width: 4, height: 50, marginLeft: 4, background: B.blue, borderRadius: 2 }} /> : null}
              {coret > 0.001 ? <div style={{ position: 'absolute', left: -6, top: '52%', height: 6, width: `calc(${coret} * (100% + 12px))`, background: CORET, borderRadius: 3 }} /> : null}
            </div>
            <div style={{ position: 'absolute', right: 20, top: (KETIK.h - 72) / 2, width: 72, height: 72, borderRadius: '50%', display: 'grid', placeItems: 'center',
              background: `linear-gradient(135deg, ${B.blue}, ${B.turq})` }}>
              <Icon name="pertanyaan" size={40} color={B.white} />
            </div>
          </div>);
      })() : null}

      {/* B: kartu dua pertanyaan (ref-08: kartu daftar) */}
      <Kaca x={KARTU.x} y={KARTU.y} w={KARTU.w} h={KARTU.h} p={popIn(f, T.kartu) * (1 + denyut(f, T.alir[0] + 20, 0.03) + denyut(f, T.denyutAkhir, 0.02))} warna={B.blue} rona={0.5} radius={34} />
      {popIn(f, T.kartu) > 0.5 ? <div style={{ position: 'absolute', left: KARTU.x - KARTU.w / 2 + 40, width: KARTU.w - 80, top: KARTU.y - 1, height: 2,
        background: rgba(B.night, 0.08), opacity: R(f, T.baris[1] - 20, T.baris[1] + 10, 0, 1, io) }} /> : null}
      {TANYA.map((q, i) => {
        const p = popIn(f, T.baris[i]);
        if (p <= 0.001) return null;
        const c = popIn(f, T.centang[i]);
        const y = BARIS[i];
        return (
          <React.Fragment key={q.teks}>
            <Bulat x={KARTU.x - KARTU.w / 2 + 84} y={y} d={88} warna={q.warna} ikon={q.ikon} p={p * (1 + denyut(f, T.centang[i], 0.08) + T.denyutBaris[i].reduce((s, t) => s + denyut(f, t, 0.1), 0))} />
            <div style={{ position: 'absolute', left: KARTU.x - KARTU.w / 2 + 152, top: y - 24, fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night, whiteSpace: 'nowrap',
              lineHeight: '48px', opacity: R(f, T.baris[i] - 20, T.baris[i] + 20, 0, 1, io), transform: geser(0, 14 * (1 - R(f, T.baris[i] - 20, T.baris[i] + 20, 0, 1, io))) }}>{q.teks}</div>
            {/* sakelar → centang (ref-08 sakelar): lingkaran kosong, terisi turkis ✓ saat dijawab */}
            <div style={{ position: 'absolute', left: KARTU.x + KARTU.w / 2 - 92, top: y - 26, width: 52, height: 52, borderRadius: '50%', boxSizing: 'border-box',
              border: `3px solid ${c > 0.5 ? B.turq : B.grayLite}`, transform: `scale(${Math.min(1, p)})`, opacity: R(f, T.baris[i] - 20, T.baris[i] + 20, 0, 1, io) }} />
            <Lencana x={KARTU.x + KARTU.w / 2 - 66 - 0.36 * 60} y={y + 0.36 * 60} d={60} p={c} warna={B.turq} ikon="tersedia" besar={52} />
          </React.Fragment>);
      })}

      {/* kanan: tempat uangnya (tiga dompet) */}
      {[0, 1, 2].map((k) => (
        <DompetUang key={k} k={k} x={KANAN.x} y={KANAN.y[k]} d={KANAN.d} f={f} labelAt={T.dompet[k] + 10} labelPx={28}
          p={popIn(f, T.dompet[k]) * (1 + denyut(f, T.denyutTempat + 8 * k, 0.08) + denyut(f, T.denyutDompet[0] + 8 * k, 0.08) + denyut(f, T.denyutDompet[1] + 8 * k, 0.06))} />))}
      <Lencana x={KANAN.x + 40} y={KANAN.y[0] - 10} d={KANAN.d} p={popIn(f, T.centangAkhir)} warna={B.turq} ikon="tersedia" besar={56} />

      {/* uang mengalir: ubin → kartu, kartu → tiga dompet (menyusuri garis) */}
      {[0, 1, 2, 3].map((j) => {
        const at = j === 0 ? T.alir[0] : T.alir[1] + 10 * (j - 1);
        const g = R(f, at - 35, at + 35, 0, 1, io);
        if (g <= 0.001 || g >= 0.999) return null;
        const W = 76, H = W / (520 / 441);
        const [x0, y0, x1, y1] = j === 0 ? [KIRI.x, KIRI.y[0], KARTU.x, KARTU.y - KARTU.h / 2 - 40] : [KARTU.x, KARTU.y - KARTU.h / 2 - 40, KANAN.x, KANAN.y[j - 1]];
        const x = lerp(x0, x1, g), y = lerp(y0, y1, g) - Math.sin(Math.PI * g) * 90;
        return <Img key={`u${j}`} src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none',
          opacity: R(g, 0, 0.12, 0, 1) * R(g, 0.85, 1, 1, 0), transform: geser(x - W / 2, y - H / 2), zIndex: 3 }} />;
      })}
      </div>

      <AbsoluteFill>
        <Judul f={f} kata={['Tentukan', 'tugasnya', 'dulu']} at={T.judul} />
        <Judul f={f} kata={['baru', 'pilih', 'produknya']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
      </AbsoluteFill>
    </MaskerKeluar>);
};

export const S18_T = T;
