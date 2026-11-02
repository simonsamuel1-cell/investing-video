import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { ARAH, B, CEK, F, io, mixHex, R, rgba } from '../theme';
import { ArahKeluar, cin, gayaPapan, Icon, lerp, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Kutipan, Label, Lencana } from '../parts/umum';
import { Kaca, Masuk, Nomor, Penghubung } from '../parts/kaca';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { Foto } from '../parts/nyata';
import { rpPenuh } from '../parts/nominal';
import { KunciIkon } from '../ikon';
import { BIDANG_ISI, GuruMenunjuk, LayarPelajaran } from '../s01/LayarPelajaran';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 06 — Kapan Boleh Mulai Memilih Saham Sendiri? (BATAS.s6 – BATAS.s7). RELAYOUT 22 Okt (Simon: "secara layout aku masih kurang puas",
 * judul TIDAK ditambahkan) — 04_Asset/Rencana-Relayout-V05.md. Masker Scene 05 mendarat jadi cakram PESAWAT, lalu:
 *  A "Tidak boleh" dicoret → "urutannya" = PETA BAB Scene 01 (01 jalan kaki · 02 feri · 03 pesawat, label sama) — memory anchor
 *  B–D tiga pil bernomor di KIRI (Kapan mulai? · Berapa banyak? · Beli apa?) jadi penunjuk: yang dibahas disorot, lainnya surut (ref 05);
 *    panel besar di KANAN berganti isi: B tiga syarat dicentang · C batang dana Rp100.000.000 (sebagian kecil Rp10 jt → Rp5 jt, jalur utama tetap,
 *    nilai berjalan) · D perusahaan bagus (gambar gedung) + harga bagus, lalu ramai · rumor · "katanya" dicoret di dalam panel
 *  E pil + panel MENYATU jadi satu kartu: pesawat ✓ boleh · mulai kecil · tahu alasannya
 *  F layar pelajaran berikutnya + guru menunjuk (TETAP, cermin pembuka Scene 01).
 * Ikon/chip/lencana = pop easeOutBack; kartu/teks = swipe up; garis = trim path; 60f dipusatkan di kata, stagger 20f.
 */
const A0 = BATAS.s6;
const KATA = ['kapan', 'memilih', 'bukan', 'boleh', 'urutannya', 'tiga', 'pertama', 'setelah', 'pernah', 'panik', 'memahami', 'kualitas', 'perusahaan', 'valuasinya',
  'kedua', 'berapa', 'sebagian', 'kecil', 'sebagian', 'jalur', 'utama', 'pilih', 'salah', 'seluruh', 'terganggu', 'ketiga', 'perusahaan', 'bagus', 'harga', 'bagus',
  'bisnisnya', 'berkualitas', 'valuasinya', 'menarik', 'dua-duanya', 'bukan', 'ramai', 'rumor', 'katanya', 'naik', 'jadi',
  'belajar', 'boleh', 'mulai', 'tahu', 'membelinya', 'cara', 'kualitas', 'valuasinya', 'bahas', 'pelajaran'];
const K = ['kapan', 'memilih', 'bukan', 'boleh', 'urutan', 'tiga', 'pertama', 'setelah', 'pernah', 'panik', 'memahami', 'kualitas', 'perusahaan', 'valuasi',
  'kedua', 'berapa', 'sebagian', 'kecil', 'sebagianB', 'jalur', 'utama', 'pilih', 'salah', 'seluruh', 'terganggu', 'ketiga', 'perusahaanD', 'bagus', 'harga', 'bagus2',
  'bisnis', 'berkualitas', 'valuasiD', 'menarik', 'duaDua', 'bukanD', 'ramai', 'rumor', 'katanya', 'naik', 'jadiE',
  'belajar', 'bolehE', 'mulaiE', 'tahu', 'membelinya', 'cara', 'kualitasF', 'valuasiF', 'bahas', 'pelajaran'] as const;
const W = urut(KATA, A0);
const T = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
export const S06_T = T;
export const S06_AKHIR = BATAS.s7;
const PESAWAT = JALUR_WARNA.pesawat;
/** masker Scene 05 mendarat di cakram PESAWAT (memilih saham sendiri) */
export const S06_MASUK: Masuk = { x: 960, y: 540, r: 100, warna: PESAWAT, mulai: A0 - 20 };
const DARAT = S06_MASUK.mulai + 60;
const MODAL = 100_000_000;
const rp = (v: number) => rpPenuh(Math.round(v / 100_000) * 100_000);

/* ── A: peta bab (geometri Scene 01 BAB) ── */
const BAB = { y: 520, d: 200, x: [592, 972, 1352] };
const BAB_ISI: { warna: string; ikon: KunciIkon; cermin: boolean; label: string }[] = [
  { warna: JALUR_WARNA.jalan, ikon: 'jalanKaki', cermin: false, label: 'Investasi relatif stabil' },
  { warna: JALUR_WARNA.feri, ikon: 'feri', cermin: true, label: 'Reksa dana indeks' },
  { warna: PESAWAT, ikon: 'pesawat', cermin: false, label: 'Memilih saham sendiri' },
];
/* ── B–D: pil kiri + panel kanan ── */
const HAL: { judul: string; ikon: KunciIkon }[] = [
  { judul: 'Kapan mulai?', ikon: 'kalender' },
  { judul: 'Berapa banyak?', ikon: 'portofolio' },
  { judul: 'Beli apa?', ikon: 'alasan' },
];
const PIL = { x: 380, w: 480, h: 130, y: [330, 520, 710] };
const PANEL = { x: 1220, y: 520, w: 1060, h: 600 };
const KARTU_E = { x: 960, y: 520, w: 1080, h: 440 };

/** baris syarat (B): ikon · teks · centang di kanan (lokal panel) */
const Syarat: React.FC<{ f: number; y: number; ikon: KunciIkon; warna: string; teks: string; at: number; teksAt?: number; cek: number }> = ({ f, y, ikon, warna, teks, at, teksAt, cek }) => (
  <>
    <Bulat x={110} y={y} d={100} warna={warna} ikon={ikon} p={popIn(f, at)} />
    <div style={{ position: 'absolute', left: 190, top: y - 24, fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '48px' }}>
      <WordText f={f} at={teksAt ?? at + 10} halus>{teks}</WordText>
    </div>
    <Bulat x={PANEL.w - 100} y={y} d={72} warna={CEK} ikon="tersedia" p={popIn(f, cek)} />
  </>);

export const Scene06: React.FC<{ f: number }> = ({ f }) => {
  if (f < DARAT || f > S06_AKHIR + 90) return null;

  /* ═ A ═ */
  const keBab = cin(f, T.urutan - 60);
  const papanA = 1 - cin(f, T.tiga); // transisi seragam 22 Okt: 60f di kata, papan lama keluar = papan baru masuk
  const pes = { x: lerp(960, BAB.x[2], keBab), y: lerp(540, BAB.y, keBab) };
  /* ═ B–D ═ */
  const aktif = [cin(f, T.pertama) * (1 - cin(f, T.kedua)), cin(f, T.kedua) * (1 - cin(f, T.ketiga)), cin(f, T.ketiga)];
  const sorotMulai = cin(f, T.pertama);
  const xPil = lerp(960, PIL.x, cin(f, T.setelah - 44)); // pil di tengah dulu, ke kiri memberi ruang panel isi
  const menyatu = cin(f, T.jadiE); // E: pil + panel menyatu jadi satu kartu
  const keluarE = popOut(f, T.cara);
  const panel = { x: lerp(PANEL.x, KARTU_E.x, menyatu), y: lerp(PANEL.y, KARTU_E.y, menyatu), w: lerp(PANEL.w, KARTU_E.w, menyatu), h: lerp(PANEL.h, KARTU_E.h, menyatu) };
  const silang = (at: number) => cin(f, at); // ganti isi panel: 60f di kata
  const isiB = 1 - silang(T.kedua);
  const isiC = silang(T.kedua) * (1 - silang(T.ketiga));
  const isiD = silang(T.ketiga) * (1 - cin(f, T.jadiE)); // pudar bersama penyatuan (60f yang sama)
  const isiE = cin(f, T.jadiE);
  /* ═ F ═ */
  const layarF = popIn(f, T.cara) * popOut(f, S06_AKHIR + 30); // keluar bersamaan papan S07 masuk ("digabung" = A0 S07 + 30)
  const guruF = popIn(f, T.cara + 20) * popOut(f, S06_AKHIR + 30);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A: memilih saham sendiri — bukan tidak boleh — urutannya = peta bab ══ */}
      {papanA > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(papanA, true) }}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {[0, 1].map((i) => <Penghubung key={i} d={`M ${BAB.x[i] + BAB.d / 2 + 18} ${BAB.y} L ${BAB.x[i + 1] - BAB.d / 2 - 18} ${BAB.y}`} g={cin(f, T.urutan - 20 + i * 20)}
              warna={B.blueLite} tebal={6} titik={false} />)}
          </svg>
          {[0, 1].map((i) => (
            <React.Fragment key={i}>
              <Kendaraan x={BAB.x[i]} y={BAB.y} d={BAB.d} warna={BAB_ISI[i].warna} ikon={BAB_ISI[i].ikon} cermin={BAB_ISI[i].cermin} p={popIn(f, T.urutan - 50 + i * 20)} />
              <Label x={BAB.x[i]} y={BAB.y + BAB.d / 2 + 40} teks={BAB_ISI[i].label} f={f} at={T.urutan - 40 + i * 20} size={32} lebar={370} />
            </React.Fragment>))}
          <Kendaraan x={pes.x} y={pes.y} d={BAB.d} warna={PESAWAT} ikon="pesawat" cermin={false} p={1} />
          <Label x={pes.x} y={pes.y + BAB.d / 2 + 40} teks="Memilih saham sendiri" f={f} at={T.memilih + 10} size={32} lebar={370} />
          {[0, 1, 2].map((i) => <Nomor key={i} x={(i === 2 ? pes.x : BAB.x[i]) - BAB.d * 0.36} y={(i === 2 ? pes.y : BAB.y) - BAB.d * 0.36} n={i + 1} warna={BAB_ISI[i].warna}
            p={popIn(f, T.urutan - 30 + i * 20)} d={56} />)}
          <Chip x={960} y={540 - 100 - 64} teks="Tidak boleh" ikon="gembok" warna={B.gray} p={popIn(f, T.bukan) * popOut(f, T.urutan - 60)}
            coret={R(f, T.boleh + 10, T.boleh + 40, 0, 1, io)} size={30} />
        </div>) : null}

      <ArahKeluar aktif={f > T.cara - 50}>
      {/* ══ B–D: tiga pil penunjuk (kiri) — yang dibahas disorot ══ */}
      {f > T.tiga - 30 && menyatu < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, ...gayaPapan(1 - menyatu, true) }}>
          {HAL.map((h, i) => {
            const surut = sorotMulai * (1 - aktif[i]);
            return (
              <Kaca key={i} x={xPil + 10 * aktif[i]} y={PIL.y[i]} w={PIL.w} h={PIL.h} p={popIn(f, T.tiga + i * 20)} warna={PESAWAT} tab="kiri" tepi={aktif[i]} alfa={1 - 0.45 * surut}>
                <Nomor x={70} y={PIL.h / 2} n={i + 1} warna={PESAWAT} p={popIn(f, T.tiga + i * 20 + 10)} d={60} />
                <Bulat x={156} y={PIL.h / 2} d={80} warna={mixHex(B.grayLite, PESAWAT, 0.4 + 0.6 * Math.max(aktif[i], 1 - sorotMulai))} ikon={h.ikon} p={popIn(f, T.tiga + i * 20 + 10)} />
                <div style={{ position: 'absolute', left: 206, top: PIL.h / 2 - 22, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
                  <WordText f={f} at={T.tiga + i * 20 + 10} halus>{h.judul}</WordText>
                </div>
              </Kaca>);
          })}
        </div>) : null}

      {/* ══ panel kanan (B–D) → menyatu jadi kartu E ══ */}
      {f > T.setelah - 50 && keluarE > 0.001 ? (
        <Kaca x={panel.x} y={panel.y} w={panel.w} h={panel.h} p={popIn(f, T.setelah - 20) * keluarE} warna={PESAWAT} tab="atas">
          {/* B: kapan mulai — tiga syarat */}
          {isiB > 0.001 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: isiB < 0.9999 ? isiB : undefined }}>
              <Syarat f={f} y={150} ikon="pasarTurun" warna={ARAH.turun} teks="Pernah lewati market turun tanpa panik" at={T.setelah} teksAt={T.pernah + 10} cek={T.panik + 20} />
              <Syarat f={f} y={300} ikon="kualitas" warna={B.blue} teks="Paham kualitas perusahaan" at={T.memahami} cek={T.perusahaan + 30} />
              <Syarat f={f} y={450} ikon="valuasi" warna={B.turq} teks="Paham valuasinya" at={T.valuasi} cek={T.valuasi + 50} />
            </div>) : null}
          {/* C: berapa banyak — batang dana Rp100.000.000 */}
          {isiC > 0.001 ? (() => {
            const x0 = 80, w = PANEL.w - 160, y = 250, h = 110;
            const kecil = cin(f, T.kecil), besar = cin(f, T.jalur);
            const salah = cin(f, T.salah + 10), turun = cin(f, T.salah + 40, 60);
            const wS = w * 0.1, wJ = w * 0.3, wF = w * 0.6;
            const total = MODAL - 0.05 * MODAL * cin(f, T.seluruh, 60);
            const pilihan = 0.1 * MODAL - 0.05 * MODAL * cin(f, T.seluruh, 60);
            return (
              <div style={{ position: 'absolute', inset: 0, opacity: isiC < 0.9999 ? isiC : undefined }}>
                <div style={{ position: 'absolute', left: x0, top: 92, fontFamily: F, fontSize: 30, fontWeight: 700, color: B.gray }}>
                  <WordText f={f} at={T.berapa + 10} halus>Dana investasi</WordText>
                </div>
                <div style={{ position: 'absolute', left: x0 + 250, top: 74, fontFamily: F, fontSize: 56, fontWeight: 800, lineHeight: 1.1,
                  color: total < MODAL - 1 ? mixHex(B.night, ARAH.turun, Math.min(1, (MODAL - total) / (0.05 * MODAL))) : B.night,
                  fontVariantNumeric: 'tabular-nums', opacity: cin(f, T.berapa + 20) }}>{rp(total)}</div>
                <div style={{ position: 'absolute', left: x0, top: y, width: w, height: h, borderRadius: h / 2, overflow: 'hidden', background: rgba(B.grayLite, 0.7),
                  transform: `scaleX(${cin(f, T.berapa + 10)})`, transformOrigin: 'left center' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, width: wJ, height: h, background: JALUR_WARNA.jalan, opacity: besar }} />
                  <div style={{ position: 'absolute', left: wJ, top: 0, width: wF, height: h, background: JALUR_WARNA.feri, opacity: besar }} />
                  <div style={{ position: 'absolute', left: wJ + wF, top: h * 0.5 * turun, width: wS, height: h * (1 - 0.5 * turun), background: mixHex(PESAWAT, ARAH.turun, salah), opacity: kecil }} />
                </div>
                <div style={{ position: 'absolute', left: x0 + wJ + wF - 8, top: y - 8, width: wS + 16, height: h + 16, borderRadius: 16, border: `4px solid ${PESAWAT}`,
                  boxSizing: 'border-box', opacity: cin(f, T.pilih) * (1 - cin(f, T.terganggu + 30)) }} />
                <Chip x={x0 + wJ + wF + wS / 2} y={y - 40} teks="▼ 50%" warna={ARAH.turun} p={popIn(f, T.salah + 30)} size={26} />
                {/* keterangan dua baris: jalur utama (kiri) · sebagian kecil (kanan), masing-masing dengan Rupiah */}
                <div style={{ position: 'absolute', left: x0, top: y + h + 26, fontFamily: F, lineHeight: 1.2, whiteSpace: 'nowrap',
                  transform: `scale(${skalaPop(popIn(f, T.jalur))})`, transformOrigin: 'left top' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 30, fontWeight: 800, color: B.night }}>
                    <Icon name="jalanKaki" size={34} color={JALUR_WARNA.jalan} /><Icon name="feri" size={34} color={JALUR_WARNA.feri} style={{ transform: 'scaleX(-1)' }} />Jalur utama
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: B.gray, fontVariantNumeric: 'tabular-nums' }}>Rp90.000.000</div>
                </div>
                <div style={{ position: 'absolute', right: x0, top: y + h + 26, fontFamily: F, lineHeight: 1.2, whiteSpace: 'nowrap', textAlign: 'right',
                  transform: `scale(${skalaPop(popIn(f, T.kecil))})`, transformOrigin: 'right top' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, fontSize: 30, fontWeight: 800, color: B.night }}>
                    <Icon name="pesawat" size={34} color={PESAWAT} />Sebagian kecil
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: pilihan < 0.1 * MODAL - 1 ? ARAH.turun : B.gray, fontVariantNumeric: 'tabular-nums' }}>{rp(pilihan)}</div>
                </div>
                <Chip x={PANEL.w / 2} y={540} teks="Portofolio tidak ikut terganggu" ikon="tersedia" warna={CEK} p={popIn(f, T.terganggu)} size={30} />
              </div>);
          })() : null}
          {/* D: beli apa — perusahaan bagus + harga bagus; bukan karena ramai · rumor · katanya */}
          {isiD > 0.001 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: isiD < 0.9999 ? isiD : undefined }}>
              {[{ x: 290, warna: B.blue, judul: 'Perusahaan bagus', at: T.perusahaanD, sub: 'Bisnis berkualitas', subAt: T.bisnis, foto: true },
                { x: PANEL.w - 290, warna: B.turq, judul: 'Harga bagus', at: T.harga, sub: 'Valuasi masuk akal', subAt: T.valuasiD, foto: false }].map((k, i) => (
                <React.Fragment key={i}>
                  {k.foto ? <Foto k="perusahaan" x={k.x} y={170} w={122} p={popIn(f, T.ketiga + 30)} /> : <Bulat x={k.x} y={170} d={150} warna={k.warna} ikon="valuasi" p={popIn(f, T.ketiga + 50)} />}
                  <Lencana x={k.x + 10} y={170} d={150} p={popIn(f, T.duaDua + i * 20)} warna={CEK} ikon="tersedia" besar={54} />
                  <div style={{ position: 'absolute', left: k.x - 260, width: 520, top: 272, textAlign: 'center', fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night, lineHeight: '46px' }}>
                    <WordText f={f} at={k.at + 20} halus>{k.judul}</WordText>
                  </div>
                  <div style={{ position: 'absolute', left: k.x - 260, width: 520, top: 322, textAlign: 'center', fontFamily: F, fontSize: 28, fontWeight: 700, color: B.gray, lineHeight: '38px' }}>
                    <WordText f={f} at={k.subAt} halus>{k.sub}</WordText>
                  </div>
                </React.Fragment>))}
              <div style={{ position: 'absolute', left: PANEL.w / 2 - 22, top: 140, fontFamily: F, fontSize: 64, fontWeight: 800, color: B.gray, lineHeight: '64px',
                transform: `scale(${skalaPop(popIn(f, T.ketiga + 40))})` }}>+</div>
              <div style={{ position: 'absolute', left: 60, right: 60, top: 404, height: 2, background: rgba(B.night, 0.07), opacity: cin(f, T.bukanD) }} />
              <Chip x={210} y={490} teks="Sedang ramai" ikon="ramai" warna={B.gray} p={popIn(f, T.ramai)} coret={R(f, T.ramai + 30, T.ramai + 60, 0, 1, io)} size={28} />
              <Chip x={470} y={490} teks="Rumor" ikon="rumor" warna={B.gray} p={popIn(f, T.rumor)} coret={R(f, T.rumor + 30, T.rumor + 60, 0, 1, io)} size={28} />
              <Kutipan x={810} y={482} teks="Katanya sebentar lagi naik" p={popIn(f, T.katanya)} warna={B.gray} size={28} coret={R(f, T.naik + 10, T.naik + 40, 0, 1, io)} />
            </div>) : null}
          {/* E: belajar saham boleh — mulai kecil & tahu alasannya */}
          {isiE > 0.001 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: isiE < 0.9999 ? isiE : undefined }}>
              <Kendaraan x={230} y={KARTU_E.h / 2} d={220} warna={PESAWAT} ikon="pesawat" cermin={false} p={popIn(f, T.belajar)} />
              <Lencana x={230} y={KARTU_E.h / 2} d={220} p={popIn(f, T.bolehE)} warna={CEK} ikon="tersedia" besar={70} />
              {[{ y: 150, ikon: 'portofolio' as const, teks: 'Mulai kecil', at: T.mulaiE }, { y: 290, ikon: 'alasan' as const, teks: 'Tahu alasan membelinya', at: T.tahu }].map((r) => (
                <React.Fragment key={r.teks}>
                  <Bulat x={470} y={r.y} d={100} warna={B.blue} ikon={r.ikon} p={popIn(f, r.at)} />
                  <div style={{ position: 'absolute', left: 550, top: r.y - 26, fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '52px' }}>
                    <WordText f={f} at={r.at + 10} halus>{r.teks}</WordText>
                  </div>
                </React.Fragment>))}
            </div>) : null}
        </Kaca>) : null}
      </ArahKeluar>

      {/* ══ F: pelajaran berikutnya — layar pemutar + guru menunjuk (cermin pembuka Scene 01) ══ */}
      <ArahKeluar aktif={f > S06_AKHIR - 50}>
      <LayarPelajaran s={layarF} progres={0} sorot={0} putar isi={
        <>
          <Img src={staticFile('brand/academy-logo.png')} style={{ position: 'absolute', left: BIDANG_ISI.w / 2 - 210, top: 42, width: 420, height: 420 * 245 / 1398 }} />
          {[{ x: BIDANG_ISI.w / 2 - 190, ikon: 'kualitas' as const, warna: B.blue, teks: 'Kualitas perusahaan', at: T.kualitasF },
            { x: BIDANG_ISI.w / 2 + 190, ikon: 'valuasi' as const, warna: B.turq, teks: 'Valuasi', at: T.valuasiF }].map((k, i) => (
            <React.Fragment key={i}>
              <Bulat x={k.x} y={250} d={130} warna={k.warna} ikon={k.ikon} p={popIn(f, k.at)} />
              <div style={{ position: 'absolute', left: k.x - 180, width: 360, top: 330, textAlign: 'center', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, lineHeight: '38px' }}>
                <WordText f={f} at={k.at + 10} halus>{k.teks}</WordText>
              </div>
            </React.Fragment>))}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 404, textAlign: 'center', fontFamily: F, fontSize: 30, fontWeight: 800, color: B.blue, lineHeight: '40px' }}>
            <WordText f={f} at={T.bahas} halus>Pelajaran berikutnya</WordText>
          </div>
        </>} />
      <GuruMenunjuk s={guruF} />
      </ArahKeluar>
    </AbsoluteFill>);
};
