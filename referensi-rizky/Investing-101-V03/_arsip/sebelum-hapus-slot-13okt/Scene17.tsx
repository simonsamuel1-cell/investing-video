import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, CORET, F, R, WARNA, io, lerp, rgba } from '../theme';
import { popOut } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import type { KunciIkon } from '../ikon';
import { Bulat, Chip, Label, Lencana, WARNA_UANG, denyut } from '../parts/umum';
import { Chevron, Kaca, MaskerKeluar, Nomor, durMasker, geser } from '../parts/kaca';
import { S18_MASUK } from '../s18/Scene18';

/**
 * SCENE 17 — Bab "Urutan Lebih Penting daripada Persentase". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  INCOME ↓ UANG AKTIF + DANA DARURAT ↓ UANG STABIL ↓ UANG JANGKA PANJANG
 *   TEXT    "Pisahkan dulu" / "[baru] investasi"
 * Rakitan 13 Okt — acuan Simon ref-09 (kartu ber-tab warna bernomor 01·02·03) + ref-04 (nomor & slot) + ref-14 (penghubung dengan
 * lencana chevron), gaya kartu kaca rumah:
 *   A  "Tapi ada satu hal yang lebih penting daripada persentasenya: urutannya."
 *        MASUK = masker Scene 16 mendarat jadi lingkaran "%" · label "Persentase" · dicoret MERAH · di "urutannya" "%" mengecil, tiga SLOT kartu
 *        bernomor 01 · 02 · 03 muncul berurutan (urutan dulu, isi belakangan)
 *   B  "Pastikan kebutuhan sehari-hari dan dana darurat aman dulu."   kartu Pemasukan → kartu 01 Uang aktif + dana darurat · uang mengalir · ✓ di "aman"
 *   C  "Setelah itu, cek apakah dalam satu sampai tiga tahun ke depan ada kebutuhan dana yang sudah jelas."   kartu 02 Uang stabil · "1–3 tahun" · ✓ di "jelas"
 *   D  "Baru setelah itu, uang yang benar-benar nggak akan dipakai dalam waktu dekat bisa masuk ke investasi jangka panjang."
 *        sub-judul TEXT (sorot "baru") · kartu 03 Uang jangka panjang · gembok di "nggak" · uang masuk di "masuk" · ✓ di "jangka panjang"
 * KELUAR = masker ke ubin Gaji Scene 18.
 */

const [lebih, daripada, persentasenya, urutannya, pastikan, sehari, dana, aman, setelah, cek, dalam, satu, tiga, depan, kebutuhan, sudah, jelas, baru, uang, benar,
  nggak, waktu, dekat, masuk, jangka] = urut([
  'lebih', 'daripada', 'persentasenya', 'urutannya', 'pastikan', 'sehari-hari', 'dana', 'aman', 'setelah', 'cek', 'dalam', 'satu', 'tiga', 'depan', 'kebutuhan',
  'sudah', 'jelas', 'baru', 'uang', 'benar-benar', 'nggak', 'waktu', 'dekat', 'masuk', 'jangka'], BATAS.s17);

/* ── tata letak: empat kartu (x 300 · 740 · 1180 · 1620), berpusat 960 ── */
const KARTU = { x: [300, 740, 1180, 1620], y: 600, w: 340, h: 410 };
const ATAS = KARTU.y - KARTU.h / 2;
const IKON_Y = ATAS + 150;
const LABEL_Y = ATAS + 280;
const PERSEN = { x: 960, y: 420, d: 140 };
const ISI: { label: string; warna: string; ikon: KunciIkon }[] = [
  { label: 'Pemasukan', warna: WARNA.langit, ikon: 'gaji' },
  { label: 'Uang aktif + dana darurat', warna: WARNA_UANG[0], ikon: 'dompet' },
  { label: 'Uang stabil', warna: WARNA_UANG[1], ikon: 'dompet' },
  { label: 'Uang jangka panjang', warna: WARNA_UANG[2], ikon: 'dompet' },
];

/** MASUK Scene 17 = masker Scene 16 menyusut ke lingkaran "%" (mendarat 40f sesudah batas, sebelum "lebih penting") */
export const S17_MASUK = { x: PERSEN.x, y: PERSEN.y, r: PERSEN.d / 2, warna: WARNA.langit, mulai: BATAS.s17 - 20 };
const DARAT = S17_MASUK.mulai + durMasker;

const T = {
  labelPersen: lebih + 16, denyutPersen: daripada, coretPersen: persentasenya + 10, persenKeluar: urutannya - 3, slot: [urutannya + 20, urutannya + 36, urutannya + 52],
  kartu: [pastikan - 20, sehari, setelah + 10, uang], ikonDD: dana, centang: [aman + 10, jelas + 10, jangka + 10],
  // uang mengalir ke kartu 02 di "KEBUTUHAN dana", gembok kartu 03 di "NGGAK akan dipakai", denyut di "tiga" & "waktu dekat"
  alir: [sehari + 30, kebutuhan, masuk], denyutTahun: [tiga, depan], kunci3: nggak, denyutK3: [waktu, dekat + 20], denyutK2: [cek + 10, dalam, sudah],
  panah: [pastikan, setelah, baru], tahun: satu, judul: pastikan + 20, sub: baru, subSorot: benar,
};

/** KELUAR Scene 17 = milik Scene 18: masker lingkaran menyusut ke ubin Gaji Scene 18 (S18_MASUK) */
export const S17_KELUAR = S18_MASUK.mulai;
export const Scene17: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s17 - 30 || f >= S17_KELUAR + durMasker) return null;
  const coretP = R(f, T.coretPersen - 30, T.coretPersen + 30, 0, 1, io);
  const pPersen = (f >= DARAT ? 1 : 0) * popOut(f, T.persenKeluar);
  return (
    <MaskerKeluar f={f} mulai={S17_KELUAR} ke={S18_MASUK} warna={S18_MASUK.warna}>
      {/* A: "%" (persentase) kalah penting dari URUTAN */}
      {pPersen > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0, width: PERSEN.d, height: PERSEN.d, transformOrigin: 'center',
            transform: `${geser(PERSEN.x - PERSEN.d / 2, PERSEN.y - PERSEN.d / 2)} scale(${Math.min(0.99996, pPersen) * (1 + denyut(f, T.denyutPersen, 0.06))})`,
            borderRadius: '50%', background: WARNA.langit, display: 'grid', placeItems: 'center', opacity: 1 - 0.45 * coretP,
            boxShadow: `0 16px 34px -12px ${WARNA.langit}aa` }}>
            <span style={{ fontFamily: F, fontSize: 76, fontWeight: 800, color: B.white, lineHeight: 1, opacity: R(f, DARAT, DARAT + 20, 0, 1, io) }}>%</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: `${PERSEN.x}px ${PERSEN.y}px`, transform: `scale(${pPersen})`, width: 1920, height: 1080 }}>
            <Label x={PERSEN.x} y={PERSEN.y + PERSEN.d / 2 + 38} teks="Persentase" f={f} at={T.labelPersen} size={34} warna={coretP > 0.5 ? CORET : B.night} />
            {coretP > 0.001 ? <div style={{ position: 'absolute', left: PERSEN.x - 118, top: PERSEN.y + PERSEN.d / 2 + 36, width: 236 * coretP, height: 6, borderRadius: 3, background: CORET }} /> : null}
          </div>
        </>) : null}

      {/* slot kartu bernomor (urutan lebih dulu dari isinya) — tepi putus-putus sampai kartunya mengisi */}
      {[1, 2, 3].map((i) => {
        const p = popIn(f, T.slot[i - 1]) * (1 - R(f, T.kartu[i] - 10, T.kartu[i] + 20, 0, 1, io));
        if (p <= 0.001) return null;
        return <div key={`s${i}`} style={{ position: 'absolute', left: 0, top: 0, width: KARTU.w, height: KARTU.h, transformOrigin: 'center',
          transform: `${geser(KARTU.x[i] - KARTU.w / 2, KARTU.y - KARTU.h / 2)} scale(${p})`, borderRadius: 34, border: `3px dashed ${rgba(ISI[i].warna, 0.7)}`,
          background: rgba(B.white, 0.35), boxSizing: 'border-box' }} />;
      })}

      {/* penghubung antarkartu + lencana chevron (ref-14) */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {[0, 1, 2].map((i) => {
          const g = R(f, T.panah[i] - 20, T.panah[i] + 30, 0, 1, io);
          if (g <= 0.001) return null;
          const x0 = KARTU.x[i] + KARTU.w / 2 + 8, x1 = KARTU.x[i + 1] - KARTU.w / 2 - 8;
          return <line key={i} x1={x0} y1={KARTU.y} x2={lerp(x0, x1, g)} y2={KARTU.y} stroke={ISI[i + 1].warna} strokeWidth={6} strokeLinecap="round" />;
        })}
      </svg>
      {[0, 1, 2].map((i) => <Chevron key={`c${i}`} x={(KARTU.x[i] + KARTU.x[i + 1]) / 2} y={KARTU.y} warna={ISI[i + 1].warna} p={popIn(f, T.panah[i] + 20)} d={52} />)}

      {/* uang mengalir dari kartu ke kartu (sesuai urutan) */}
      {[0, 1, 2].map((i) => {
        const g = R(f, T.alir[i] - 35, T.alir[i] + 35, 0, 1, io);
        if (g <= 0.001 || g >= 0.999) return null;
        const W = 84, H = W / (520 / 441);
        const x = lerp(KARTU.x[i], KARTU.x[i + 1], g), y = IKON_Y - 20 - Math.sin(Math.PI * g) * 190;
        return <Img key={i} src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none',
          opacity: R(g, 0, 0.12, 0, 1) * R(g, 0.85, 1, 1, 0), transform: geser(x - W / 2, y - H / 2), zIndex: 3 }} />;
      })}

      {/* kartu kaca ber-tab warna (ref-09) */}
      {ISI.map((k, i) => {
        const pk = popIn(f, T.kartu[i]);
        if (pk <= 0.001) return null;
        const dn = 1 + (i > 0 ? denyut(f, T.alir[i - 1] + 40, 0.04) : 0) + (i === 3 ? T.denyutK3.reduce((s, t) => s + denyut(f, t, 0.04), 0) : 0)
          + (i === 2 ? T.denyutK2.reduce((s, t) => s + denyut(f, t, 0.04), 0) : 0);
        const c = i > 0 ? popIn(f, T.centang[i - 1]) : 0;
        const x = KARTU.x[i];
        return (
          <React.Fragment key={k.label}>
            <Kaca x={x} y={KARTU.y} w={KARTU.w} h={KARTU.h} p={pk * dn} warna={k.warna} tab="atas" tabTebal={16} rona={0.7} tepi={c} radius={34} />
            {i === 1 ? <>
              <Bulat x={x - 60} y={IKON_Y} d={116} warna={k.warna} ikon="dompet" p={pk} />
              <Bulat x={x + 60} y={IKON_Y} d={116} warna={B.orange} ikon="danaDarurat" p={popIn(f, T.ikonDD)} />
            </> : <Bulat x={x} y={IKON_Y} d={136} warna={k.warna} ikon={k.ikon} p={pk} />}
            <Label x={x} y={LABEL_Y} teks={k.label} f={f} at={T.kartu[i] + 10} size={30} lebar={290} />
            {i === 2 ? <Chip x={x} y={ATAS + 360} teks="1–3 tahun" ikon="kalender" warna={WARNA_UANG[1]}
              p={popIn(f, T.tahun) * (1 + denyut(f, T.denyutTahun[0], 0.1) + denyut(f, T.denyutTahun[1], 0.1))} size={24} /> : null}
            {i === 3 ? <Lencana x={x} y={IKON_Y} d={136} p={popIn(f, T.kunci3)} warna={B.night} ikon="kunci" besar={54} /> : null}
            {/* centang di sudut kanan-atas kartu (Lencana berpusat di x + 0,36 d, y − 0,36 d) */}
            {i > 0 ? <Lencana x={x + 40} y={ATAS + 126} d={KARTU.w} p={c} warna={B.turq} ikon="tersedia" besar={58} /> : null}
          </React.Fragment>);
      })}
      {/* nomor 01 · 02 · 03 di tengah tab (ref-04 · ref-09) — lahir bersama slotnya, tetap saat kartu mengisi */}
      {[1, 2, 3].map((i) => <Nomor key={`n${i}`} x={KARTU.x[i]} y={ATAS} n={i} warna={ISI[i].warna} p={popIn(f, T.slot[i - 1] + 6)} d={70} />)}

      <AbsoluteFill>
        <Judul f={f} kata={['Pisahkan', 'dulu']} at={T.judul} />
        <Judul f={f} kata={['baru', 'investasi']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
      </AbsoluteFill>
    </MaskerKeluar>);
};

export const S17_T = T;
