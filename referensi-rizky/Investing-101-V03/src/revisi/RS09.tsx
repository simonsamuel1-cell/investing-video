import React from 'react';
import { RS10_MASUK } from './RS10';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, F, R, WARNA, io, lerp, mixHex, rgba } from '../theme';
import { Icon, cin, popScale } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { rpPenuh } from '../parts/nominal';
import { Bulat, Label, Lencana, denyut } from '../parts/umum';
import { Kaca, geser, HALUS3D, MaskerKeluar, durMasker, type Masuk, daratDari } from '../parts/kaca';
import { Foto, KartuBaris } from '../parts/nyata';

/**
 * REVISI SCENE 09 v2 (14 Okt, evaluasi 5 pertanyaan): A dompet diapit kebutuhannya (tak lagi sendirian di kanvas kosong); kartu produk berfoto
 * (brankas · gedung pemerintah) + chip TENOR yang akurat (deposito 1–12 bulan · obligasi negara ritel 2–6 tahun) menggantikan kotak "1th 2th 3th".
 * REVISI SCENE 09 (13 Okt malam). Pesan utama: waktu investasinya harus SAMA dengan kapan uang itu dipakai.
 *   A  tiga pilihan uang stabil = tiga KARTU produk sejajar (ref-10): Deposito (brankas) · RD pendapatan tetap · Obligasi pemerintah; pita durasi
 *      (kotak tahun terisi) = tenor, terisi di "tenor yang sesuai kebutuhan".
 *   B  "RDPT nilainya bisa naik dan turun" → kartu RDPT maju ke tengah, nominal besar naik (hijau) lalu turun (merah); kartu lain redup.
 *   C  "waktu investasinya sesuai kapan uang dipakai" → penggaris waktu Sekarang · 1 · 2 · 3 tahun, kebutuhan di atas (sekolah @1 · DP rumah @3),
 *      batang Deposito 1 th & Obligasi 3 th tumbuh dan BERHENTI TEPAT di bawah kebutuhannya → ✓.
 */

const [uang, stabil, kita, mempertimbangkan, deposito, reksa, pendapatan, tetap, obligasi, pemerintah, tenor, sesuai, kebutuhan, kalau, memilih, reksa2,
  ingat, nilainya, naik, turun, intinya, , , harus, sesuai2, kapan, uang2, dipakai] = urut([
  'uang', 'stabil', 'kita', 'mempertimbangkan', 'deposito', 'reksa', 'pendapatan', 'tetap', 'obligasi', 'pemerintah', 'tenor', 'sesuai', 'kebutuhan', 'kalau',
  'memilih', 'reksa', 'ingat', 'nilainya', 'naik', 'turun', 'intinya', 'waktu', 'investasinya', 'harus', 'sesuai', 'kapan', 'uang', 'dipakai'], BATAS.s9);

/** MASUK (revisi 14 Okt): masker scene sebelumnya mendarat di sini; elemen pertama scene ini muncul dari titik ini */
export const RS09_MASUK: Masuk = { x: 960, y: 540, r: 105, warna: B.turq, mulai: BATAS.s9 - 20 };
const DARAT = daratDari(RS09_MASUK);

const T = {
  dompet: uang, denyutDompet: [kita, mempertimbangkan], kartu: [deposito - 10, reksa, obligasi], denyutKartu: [pendapatan, pemerintah], denyutTetap: tetap,
  pita: [tenor - 10, sesuai + 10], denyutPita: kebutuhan, fokus: [kalau, memilih + 20], nilai: [nilainya, Math.round((nilainya + naik) / 2), turun + 30], denyutRdpt: [reksa2, ingat],
  // C dimulai SAMBIL kartu B memudar (survei 14 Okt: "Intinya:" ±1 dtk hampir kosong — dulu kebutuhan baru muncul di "waktu")
  keluarAB: intinya - 10, garis: [intinya - 10, intinya + 50], butuh: [intinya + 10, intinya + 20], batang: [harus - 20, kapan + 10], denyutSesuai: sesuai2, cocok: [uang2, dipakai + 10],
  judul: stabil + 10, sub: tenor, subSorot: kebutuhan,
};

/* ── tata letak ── */
const DOMPET = { x: 960, y: 262, d: 120 };
const KARTU = { x: [470, 960, 1450], y: 640, w: 440, h: 480 };
/** tenor = jangka waktu produk (umum di Indonesia): deposito 1–12 bulan · obligasi negara ritel (ORI/SBR/ST/SR) 2–6 tahun; RDPT tanpa tenor tetap */
const PRODUK: { nama: string; gambar: 'brankas' | 'pemerintah' | 'ikon'; warna: string; tenor?: string }[] = [
  { nama: 'Deposito', gambar: 'brankas', warna: B.blue, tenor: '1–12 bulan' },
  { nama: 'RD pendapatan tetap', gambar: 'ikon', warna: WARNA.langit },
  { nama: 'Obligasi pemerintah', gambar: 'pemerintah', warna: B.orange, tenor: '2–6 tahun' },
];
/** A: kebutuhan uang stabil yang sudah dijadwalkan (sama dengan Scene 08 & penggaris C) — mengapit dompet supaya tidak sendirian */
const KEBUTUHAN_A = [
  // Simon 14 Okt: ikon sekolah/rumah → gambar realistis (ikon tetap sebagai cadangan KartuBaris)
  { x: 470, nama: 'Uang sekolah', ket: 'Jul 2027', ikon: 'biayaSekolah' as const, foto: 'sekolah' as const, warna: B.blue },
  { x: 1450, nama: 'DP rumah', ket: 'Mar 2029', ikon: 'dpRumah' as const, foto: 'rumahModern' as const, warna: B.orange },
];
/** penggaris: y awal 640 (hanya garis + foto kebutuhan di atas) → naik ke 560 saat batang produk muncul di bawahnya (ukur 14 Okt: susunan lengkap dulu +80 px) */
// x0/x1 −38 (pindai pusat 14 Okt: foto DP rumah di ujung kanan membuat susunan +38 px ke kanan)
// (15 Okt) +26: label ujung "Sekarang" & "3 tahun" kini tampil penuh (dulu tertahan 50 %) → susunan terukur −26 px (ukur-pindai f11370–11640)
const RUL = { x0: 348, x1: 1548, y: 640 };
const xTahun = (t: number) => lerp(RUL.x0, RUL.x1, t / 3);

export const RS09: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS10_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s9 || f >= RS10_MASUK.mulai + durMasker) return null;
  const kelAB = cin(f, T.keluarAB);
  const fokus = cin(f, T.fokus[0] + 20);
  // geser bertahap: kartu yang sudah ada selalu berpusat
  const geserBaris = (KARTU.x[1] - KARTU.x[0]) / 2 * ((1 - cin(f, T.kartu[1] - 24)) + (1 - cin(f, T.kartu[2] - 24)));
    const naik = R(f, T.nilai[1] - 30, T.nilai[1] + 30, 0, 1, io), turun = R(f, T.nilai[2] - 30, T.nilai[2] + 30, 0, 1, io);
  const nilai = 10_000_000 * (1 + 0.03 * naik - 0.05 * turun);
  const arah = Math.max(-1, Math.min(1, (nilai / 10_000_000 - 1) * 15));
  const colNilai = arah >= 0 ? mixHex(B.night, ARAH.naik, arah) : mixHex(B.night, ARAH.turun, -arah);
  return (
    <MaskerKeluar f={f} mulai={RS10_MASUK.mulai} ke={RS10_MASUK} warna={RS10_MASUK.warna}>
    <AbsoluteFill>
      {/* ═════════ A–B: dompet + kebutuhannya → tiga kartu produk (ref-10) ═════════ */}
      {kelAB < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - kelAB, transform: geser(0, -40 * kelAB) }}>
          {/* verifikasi pusat 14 Okt: dompet SENDIRIAN di y 540 (pendaratan masker), naik ke 500 bersama labelnya (dompet + label + kartu berpusat di 540 —
              percobaan semua di 540 terukur +40 px selama 3,5 dtk, dikoreksi); kedua kartu kebutuhan muncul BERSAMAAN (dulu jeda 16f: −238 px) */}
          {(() => { const n = cin(f, T.kartu[0]); return (<>
            {/* dompet = cakram pendaratan masker Scene 08 (tanpa pop), ikonnya memudar masuk 20f */}
            <Bulat x={DOMPET.x} y={lerp(lerp(540, 500, cin(f, T.dompet - 8)), DOMPET.y, n)} d={lerp(210, DOMPET.d, n)} warna={B.turq} ikon="dompet" p={(f >= DARAT ? 1 : 0) * (1 + [...T.denyutDompet, DARAT + 30].reduce((a, t) => a + denyut(f, t, 0.07), 0))}
              ikonAlfa={R(f, DARAT, DARAT + 20, 0, 1, io)} />
            <Label x={DOMPET.x} y={662} teks="Uang Stabil" f={f} at={T.dompet + 10} size={38} alfa={1 - n} />
            {KEBUTUHAN_A.map((k, i) => (
              <KartuBaris key={k.nama} x={k.x} y={500 - 60 * n} p={popIn(f, T.denyutDompet[0] + 10)} alfa={1 - n} ikon={k.ikon} foto={k.foto} warna={k.warna} judul={k.nama} ket={k.ket} w={390} />))}
          </>); })()}
          {PRODUK.map((pr, k) => {
            const pk = popIn(f, T.kartu[k]);
            if (pk <= 0.001) return null;
            const rdpt = k === 1;
            // B: RDPT maju ke tengah & membesar, dua lainnya redup & menyusut
            const x = lerp(KARTU.x[k] + geserBaris, rdpt ? 960 : KARTU.x[k] + (k === 0 ? -60 : 60), fokus);
            const s = (rdpt ? lerp(1, 1.16, fokus) : lerp(1, 0.86, fokus)) * (1 + denyut(f, T.denyutKartu[k === 0 ? 0 : 1] + 10 * k, 0.03) + (rdpt ? [...T.denyutRdpt, T.denyutTetap].reduce((a, t) => a + denyut(f, t, 0.03), 0) : 0));
            const alfa = rdpt ? 1 : 1 - 0.55 * fokus;
            const atas = KARTU.y - KARTU.h / 2;
            const tenorP = R(f, T.pita[0] - 20, T.pita[0] + 20, 0, 1, io);
            return (
              <div key={pr.nama} style={{ position: 'absolute', inset: 0, opacity: alfa < 1 ? alfa : undefined, zIndex: rdpt ? 2 : 1 }}>
                <div style={{ position: 'absolute', inset: 0, transformOrigin: `${x}px ${KARTU.y}px`, transform: `scale(${s})` }}>
                  <Kaca x={x} y={KARTU.y} w={KARTU.w} h={KARTU.h} p={pk} warna={pr.warna} tab="atas" tabTebal={14} rona={0.6} radius={32} />
                  {pr.gambar === 'brankas' ? <Foto k="brankas" x={x} y={atas + 135} w={190} p={pk} />
                    : pr.gambar === 'pemerintah' ? <Foto k="obligasi" x={x} y={atas + 135} w={240} p={pk} />
                    : <Foto k="rdPendapatanTetap" x={x} y={atas + 135} w={230} p={pk} />}
                  <Label x={x} y={atas + 275} teks={pr.nama} f={f} at={T.kartu[k] + 10} size={34} lebar={400} />
                  {/* tenor (jangka waktu) — RDPT tanpa tenor tetap: nominal yang bisa naik-turun */}
                  {rdpt ? (
                    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, atas + 390)}${HALUS3D}`, translate: '-50% -50%', fontFamily: F, fontSize: 46, fontWeight: 800,
                      color: colNilai, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', opacity: Math.min(0.9999, tenorP) }}>
                      {rpPenuh(Math.round(nilai / 10000) * 10000)}
                    </div>) : tenorP > 0.001 ? (
                    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, atas + 390)} translate(-50%, -50%) scale(${popScale(tenorP) * (1 + denyut(f, T.denyutPita + 10 * k, 0.06))})`,
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 999, background: rgba(pr.warna, 0.14), fontFamily: F, fontSize: 32,
                      fontWeight: 800, color: pr.warna, whiteSpace: 'nowrap' }}>
                      <Icon name="kalender" size={34} color={pr.warna} />{pr.tenor}
                    </div>) : null}
                </div>
              </div>);
          })}
        </div>) : null}

      {/* ═════════ C: cocokkan waktu ═════════ */}
      {f >= T.garis[0] - 30 ? (() => {
        const g = R(f, T.garis[0] - 20, T.garis[1], 0, 1, io);
        // penggaris tumbuh dari TENGAH ke dua sisi (ukur 14 Okt: dulu dari kiri → isi −448 px); titik & label tiap tahun muncul halus saat garis melewatinya
        // pusat tumbuh = pusat penggaris (dulu 960 tetap: sesudah penggaris digeser −38, garis meleset 38 px dari titik Sekarang/3 tahun)
        const pusatR = (RUL.x0 + RUL.x1) / 2, separuh = ((RUL.x1 - RUL.x0) / 2) * g;
        // (15 Okt, pindai hilang-dom f11303) titik & label tahun POP 40f mulai saat garis mencapainya — dulu ikut lebar garis: di puncak laju io garis
        // melewati 60 px dalam 2 frame → label "1 tahun"/"2 tahun" melompat dari 5 % ke 55 % dalam 1 frame
        const capai = (x: number) => {
          for (let q = T.garis[0] - 20; q <= T.garis[1]; q++) if (((RUL.x1 - RUL.x0) / 2) * R(q, T.garis[0] - 20, T.garis[1], 0, 1, io) >= Math.abs(x - pusatR) - 4) return q;
          return T.garis[1];
        };
        const muncul = (x: number) => R(f, capai(x), capai(x) + 40, 0, 1, io);
        return (
          <div style={{ position: 'absolute', inset: 0, transform: geser(0, -80 * cin(f, T.batang[0] - 10)) }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <line x1={pusatR - separuh} y1={RUL.y} x2={pusatR + separuh} y2={RUL.y} stroke={B.grayLite} strokeWidth={6} strokeLinecap="round" />
              {[0, 1, 2, 3].map((t) => (muncul(xTahun(t)) > 0.001 ? <circle key={t} cx={xTahun(t)} cy={RUL.y} r={10 * muncul(xTahun(t))} fill={B.white} stroke={B.gray} strokeWidth={4} /> : null))}
            </svg>
            {['Sekarang', '1 tahun', '2 tahun', '3 tahun'].map((t, k) => (
              <Label key={t} x={xTahun(k)} y={RUL.y + 44} teks={t} f={f} at={T.garis[0] - 30} alfa={muncul(xTahun(k))} size={26} warna={B.gray} lebar={220} />))}
            {/* kebutuhan di atas penggaris: sekolah @1 tahun · DP rumah @3 tahun */}
            {[{ t: 1, foto: 'sekolah' as const, lebar: 210, nama: 'Uang sekolah', w: B.blue }, { t: 3, foto: 'rumahModern' as const, lebar: 170, nama: 'DP rumah', w: B.orange }].map((b, k) => {
              const p = popIn(f, T.butuh[k]);
              if (p <= 0.001) return null;
              return (
                <React.Fragment key={b.nama}>
                  {/* foto realistis Simon (sekolah · rumah) menggantikan lingkaran ikon */}
                  <Foto k={b.foto} x={xTahun(b.t)} y={RUL.y - 222} w={b.lebar} p={p * (1 + denyut(f, T.cocok[1] + 12 * k, 0.06) + denyut(f, T.denyutSesuai + 12 * k, 0.05))} />
                  <Label x={xTahun(b.t)} y={RUL.y - 140} teks={b.nama} f={f} at={T.butuh[k] + 10} size={28} lebar={260} />
                  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                    <line x1={xTahun(b.t)} y1={RUL.y - 110} x2={xTahun(b.t)} y2={lerp(RUL.y - 110, RUL.y - 16, Math.min(1, p))} stroke={b.w} strokeWidth={4} strokeLinecap="round" />
                  </svg>
                </React.Fragment>);
            })}
            {/* batang produk di bawah penggaris: tumbuh dari "Sekarang" dan berhenti tepat di bawah kebutuhannya */}
            {[{ t: 1, nama: 'Deposito 1 tahun', w: B.blue, y: RUL.y + 120 }, { t: 3, nama: 'Obligasi 3 tahun', w: B.orange, y: RUL.y + 210 }].map((b, k) => {
              const gb = R(f, T.batang[0] - 30 + 24 * k, T.batang[1] - 10 + 24 * k, 0, 1, io);
              // dipasang sejak awal rentangnya (gb io baru > 0,001 ±10 frame kemudian → dulu pudar-masuk 12f sudah 85 % saat terpasang)
              if (f < T.batang[0] - 30 + 24 * k) return null;
              const x1 = lerp(RUL.x0, xTahun(b.t), gb);
              const ok = popIn(f, T.cocok[0] + 16 * k);
              return (
                <React.Fragment key={b.nama}>
                  {/* (15 Okt, pindai hilang-dom f11390) batang memudar masuk: lebar minimumnya = padding 24 px → dulu langsung tampil sebagai pil 24 × 56 */}
                  <div style={{ position: 'absolute', left: 0, top: 0, width: x1 - RUL.x0, height: 56, borderRadius: 28, background: b.w, transform: geser(RUL.x0, b.y - 28),
                    opacity: Math.min(0.9999, R(f, T.batang[0] - 30 + 24 * k, T.batang[0] - 18 + 24 * k, 0, 1)),
                    boxShadow: `0 12px 24px -12px ${b.w}`, display: 'flex', alignItems: 'center', paddingLeft: 24, boxSizing: 'border-box', overflow: 'hidden' }}>
                    <span style={{ fontFamily: F, fontSize: 26, fontWeight: 800, color: B.white, whiteSpace: 'nowrap', opacity: R(gb, 0.4, 0.8, 0, 1) }}>{b.nama}</span>
                  </div>

                  <Lencana x={xTahun(b.t) + 4} y={b.y + 18} d={60} p={ok} warna={ARAH.naik} ikon="tersedia" besar={52} />
                </React.Fragment>);
            })}
          </div>);
      })() : null}

      <Judul f={f} kata={['Uang', 'stabil']} at={T.judul} />
      <Judul f={f} kata={['sesuaikan', 'dengan', 'waktu', 'penggunaannya']} sorotIdx={2} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
