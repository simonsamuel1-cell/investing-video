import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { ARAH, B, CEK, F, io, mixHex, R, rgba } from '../theme';
import { ArahKeluar, cin, Icon, popOut, skalaPop, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Kutipan, Label, Lencana } from '../parts/umum';
import { Chevron, Kaca, Masuk, Nomor } from '../parts/kaca';
import { JALUR_WARNA, Kendaraan } from '../parts/jalur';
import { KunciIkon } from '../ikon';
import { BIDANG_ISI, GuruMenunjuk, LayarPelajaran } from '../s01/LayarPelajaran';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 06 — Kapan Boleh Mulai Memilih Saham Sendiri? (BATAS.s6 – BATAS.s7). Ide: 04_Asset/Ide-Visual-Scene-06.md.
 * Masker Scene 05 mendarat jadi cakram PESAWAT → A "tidak boleh" dicoret · urutan jalan kaki → feri → pesawat · tiga kartu (kapan · berapa banyak · beli apa)
 * → B kartu 1 MENYATU jadi panel: tiga syarat dicentang → C panel "berapa banyak": batang dana Rp100 jt, sebagian kecil saham pilihan, sebagian besar
 * jalur utama; saham salah −50 % → portofolio Rp95 jt (tidak ikut terganggu) → D "beli apa": perusahaan bagus + harga bagus; ramai · rumor ·
 * "katanya sebentar lagi naik" dicoret → E satu saham = risiko menumpuk; belajar saham boleh: mulai kecil & tahu alasannya → F layar pelajaran
 * berikutnya + guru menunjuk (cermin pembuka Scene 01).
 */
const A0 = BATAS.s6;
const KATA = ['kapan', 'memilih', 'bukan', 'boleh', 'urutannya', 'tiga', 'pertama', 'setelah', 'pernah', 'panik', 'memahami', 'kualitas', 'perusahaan', 'valuasinya',
  'kedua', 'berapa', 'sebagian', 'kecil', 'sebagian', 'jalur', 'utama', 'pilih', 'salah', 'seluruh', 'terganggu', 'ketiga', 'perusahaan', 'bagus', 'harga', 'bagus',
  'bisnisnya', 'berkualitas', 'valuasinya', 'menarik', 'dua-duanya', 'bukan', 'ramai', 'rumor', 'katanya', 'naik', 'satu', 'risikonya', 'menumpuk',
  'belajar', 'boleh', 'mulai', 'tahu', 'membelinya', 'cara', 'kualitas', 'harganya', 'bahas', 'pelajaran'];
const K = ['kapan', 'memilih', 'bukan', 'boleh', 'urutan', 'tiga', 'pertama', 'setelah', 'pernah', 'panik', 'memahami', 'kualitas', 'perusahaan', 'valuasi',
  'kedua', 'berapa', 'sebagian', 'kecil', 'sebagianB', 'jalur', 'utama', 'pilih', 'salah', 'seluruh', 'terganggu', 'ketiga', 'perusahaanD', 'bagus', 'harga', 'bagus2',
  'bisnis', 'berkualitas', 'valuasiD', 'menarik', 'duaDua', 'bukanD', 'ramai', 'rumor', 'katanya', 'naik', 'satu', 'risikonya', 'menumpuk',
  'belajar', 'bolehE', 'mulaiE', 'tahu', 'membelinya', 'cara', 'kualitasF', 'harganya', 'bahas', 'pelajaran'] as const;
const W = urut(KATA, A0);
const T = Object.fromEntries(K.map((k, i) => [k, W[i]])) as Record<(typeof K)[number], number>;
export const S06_T = T;
export const S06_AKHIR = BATAS.s7;
const PESAWAT = JALUR_WARNA.pesawat;
/** masker Scene 05 mendarat di cakram PESAWAT (memilih saham sendiri) */
export const S06_MASUK: Masuk = { x: 960, y: 540, r: 100, warna: PESAWAT, mulai: A0 - 20 }; // QA pusat 19 Okt: 480 → 540
const DARAT = S06_MASUK.mulai + 60;

/* ── A: urutan & tiga kartu ── */
const URUT = { y: 540, d: 140, x: [640, 960, 1280] };
const KARTU = { y: 520, w: 440, h: 150, x: [470, 960, 1450] };
const HAL: { judul: string; ikon: KunciIkon; warna: string }[] = [
  { judul: 'Kapan mulai?', ikon: 'kalender', warna: B.blue },
  { judul: 'Berapa banyak?', ikon: 'portofolio', warna: B.blue },
  { judul: 'Beli apa?', ikon: 'alasan', warna: B.blue },
];
/* ── B–D: panel ── */
const PANEL = { x: 960, y: 520, w: 1180, h: 560 };
const PANEL_D = { y: 465, h: 520 }; // D: naik & memendek memberi ruang tiga alasan yang dicoret (QA pusat: 430 → 465)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** isi baris syarat (B) */
const Baris: React.FC<{ f: number; y: number; ikon: KunciIkon; warna: string; teks: string; at: number; cek: number; alfa: number; teksAt?: number }> = ({ f, y, ikon, warna, teks, at, cek, alfa, teksAt }) =>
  alfa <= 0.001 ? null : (
    <div style={{ position: 'absolute', inset: 0, opacity: alfa }}>
      <Bulat x={110} y={y} d={84} warna={warna} ikon={ikon} p={popIn(f, at)} />
      <div style={{ position: 'absolute', left: 176, top: y - 22, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>
        <WordText f={f} at={teksAt ?? at + 10} halus>{teks}</WordText>
      </div>
      <Bulat x={PANEL.w - 110} y={y} d={64} warna={CEK} ikon="tersedia" p={popIn(f, cek)} />
    </div>);

export const Scene06: React.FC<{ f: number }> = ({ f }) => {
  if (f < DARAT || f > S06_AKHIR + 90) return null;

  /* ═ A ═ */
  const keUrutan = cin(f, T.urutan - 24);
  const keluarUrut = popOut(f, T.tiga - 30);
  const pes = { x: 960 + (URUT.x[2] - 960) * keUrutan, d: 200 + (URUT.d - 200) * keUrutan };
  /* ═ B: kartu 1 menyatu jadi panel; kartu 2 & 3 meluncur masuk ke dalamnya ═ */
  const satu = cin(f, T.pertama + 70);
  const keluarPanel = popOut(f, T.satu - 20);
  const naikD = cin(f, T.ramai - 24); // QA pusat: dulu di "bukan" → panel naik ±1,5 dtk sebelum chip pertama (−110)
  const panel = { x: lerp(KARTU.x[0], PANEL.x, satu), y: lerp(KARTU.y, lerp(PANEL.y, PANEL_D.y, naikD), satu), w: lerp(KARTU.w, PANEL.w, satu), h: lerp(KARTU.h, lerp(PANEL.h, PANEL_D.h, naikD), satu) };
  const silang = (at: number) => cin(f, at - 10, 40); // ganti isi
  const keluarJ = (at: number) => 1 - cin(f, at - 10, 20), masukJ = (at: number) => cin(f, at + 10, 20); // judul: lama habis dulu, baru yang baru (tidak bertumpuk)
  const isiB = 1 - silang(T.kedua);
  const isiC = silang(T.kedua) * (1 - silang(T.ketiga));
  const isiD = silang(T.ketiga);
  /* ═ E ═ */
  const keluarE = popOut(f, T.cara - 20);
  const ruangE = cin(f, T.belajar - 24);
  /* ═ F ═ */
  const layarF = popIn(f, T.cara) * popOut(f, S06_AKHIR + 10);
  const guruF = popIn(f, T.cara + 20) * popOut(f, S06_AKHIR - 10);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* ══ A: memilih saham sendiri — bukan tidak boleh — urutannya ══ */}
      {keluarUrut > 0.001 ? (
        <>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} />
          {[0, 1].map((i) => <Chevron key={i} x={(URUT.x[i] + URUT.x[i + 1]) / 2} y={URUT.y} warna={B.blueLite} p={popIn(f, T.urutan + 40 + i * 20) * keluarUrut} d={50} />)}
          <Kendaraan x={URUT.x[0]} y={URUT.y} d={URUT.d} warna={JALUR_WARNA.jalan} ikon="jalanKaki" cermin={false} p={popIn(f, T.urutan) * keluarUrut} />
          <Kendaraan x={URUT.x[1]} y={URUT.y} d={URUT.d} warna={JALUR_WARNA.feri} ikon="feri" cermin p={popIn(f, T.urutan + 20) * keluarUrut} />
          <Kendaraan x={pes.x} y={URUT.y} d={pes.d} warna={PESAWAT} ikon="pesawat" cermin={false} p={keluarUrut} />
          {[0, 1, 2].map((i) => <Nomor key={i} x={URUT.x[i] - URUT.d * 0.36} y={URUT.y - URUT.d * 0.36} n={i + 1} warna={[JALUR_WARNA.jalan, JALUR_WARNA.feri, PESAWAT][i]}
            p={popIn(f, T.urutan + 20 + i * 20) * keluarUrut} d={50} />)}
          <Lencana x={pes.x} y={URUT.y} d={pes.d} p={popIn(f, T.kapan + 50) * popOut(f, T.urutan - 30)} warna={B.blue} ikon="kalender" besar={66} />
          <Label x={960} y={URUT.y + 100 + 40} teks="Memilih saham sendiri" f={f} at={T.memilih + 10} size={32} lebar={480} alfa={1 - keUrutan} />
          <Chip x={960} y={URUT.y - 100 - 64} teks="Tidak boleh" ikon="gembok" warna={B.gray} p={popIn(f, T.bukan) * popOut(f, T.urutan - 20)}
            coret={R(f, T.boleh + 10, T.boleh + 40, 0, 1, io)} size={28} />
        </>) : null}

      <ArahKeluar aktif={f > T.satu - 50}>
      {/* ══ tiga kartu → kartu 1 menyatu jadi panel (B–D) ══ */}
      {[1, 2].map((i) => {
        const p = popIn(f, T.tiga + 20 + i * 20) * (1 - satu); // "tiga hal" → "pertama" hanya 45f: kartu muncul cepat, menyatu baru di "mulai"
        if (p <= 0.001) return null;
        // meluncur ke kartu 1 yang sedang membesar sambil pudar
        const x = lerp(KARTU.x[i], PANEL.x, satu), y = KARTU.y;
        return (
          <Kaca key={i} x={x} y={y} w={KARTU.w} h={KARTU.h} p={p} warna={HAL[i].warna} tab="kiri" alfa={1 - satu}>
            <Nomor x={58} y={KARTU.h / 2} n={i + 1} warna={HAL[i].warna} p={1} d={56} />
            <Bulat x={136} y={KARTU.h / 2} d={76} warna={HAL[i].warna} ikon={HAL[i].ikon} p={1} />
            <div style={{ position: 'absolute', left: 190, top: KARTU.h / 2 - 22, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>{HAL[i].judul}</div>
          </Kaca>);
      })}
      {(() => {
        const p = popIn(f, T.tiga + 20) * keluarPanel;
        if (p <= 0.001) return null;
        return (
          <Kaca x={panel.x} y={panel.y} w={panel.w} h={panel.h} p={p} warna={B.blue} tab="kiri">
            {/* kepala: nomor · ikon · judul — silang-pudar 40f di "kedua" & "ketiga" (tidak berganti seketika) */}
            {[keluarJ(T.kedua), masukJ(T.kedua) * keluarJ(T.ketiga), masukJ(T.ketiga)].map((w, i) => w <= 0.001 ? null : (
              <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: KARTU.w, height: KARTU.h, opacity: w }}>
                <Nomor x={58} y={KARTU.h / 2} n={i + 1} warna={HAL[i].warna} p={1} d={56} />
                <Bulat x={136} y={KARTU.h / 2} d={76} warna={HAL[i].warna} ikon={HAL[i].ikon} p={1} />
                <div style={{ position: 'absolute', left: 190, top: KARTU.h / 2 - 22, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: '44px' }}>{HAL[i].judul}</div>
              </div>))}
            {/* B: syarat mulai */}
            {satu > 0.5 ? (
              <>
                <Baris f={f} y={200} ikon="pasarTurun" warna={ARAH.turun} teks="Pernah melewati market turun tanpa panik" at={T.setelah} teksAt={T.pernah + 20} cek={T.panik + 20} alfa={isiB} />
                <Baris f={f} y={320} ikon="kualitas" warna={B.blue} teks="Paham kualitas perusahaan" at={T.memahami} cek={T.perusahaan + 30} alfa={isiB} />
                <Baris f={f} y={440} ikon="valuasi" warna={B.blue} teks="Paham valuasinya" at={T.valuasi} cek={T.valuasi + 50} alfa={isiB} />
              </>) : null}
            {/* C: berapa banyak — batang dana Rp100 jt */}
            {isiC > 0.001 ? (() => {
              const x0 = 70, w = PANEL.w - 140, y = 300, h = 84; // isi di tengah badan panel (pratinjau 1: separuh bawah kosong)
              const kecil = cin(f, T.kecil), besar = cin(f, T.jalur);
              const salah = cin(f, T.salah + 10), turun = cin(f, T.salah + 40, 60);
              const wS = w * 0.1, wJ = w * 0.3, wF = w * 0.6;
              const nominal = 100 - 5 * cin(f, T.seluruh, 60);
              return (
                <div style={{ position: 'absolute', inset: 0, opacity: isiC }}>
                  <div style={{ position: 'absolute', left: x0, top: y - 62, fontFamily: F, fontSize: 28, fontWeight: 700, color: B.gray }}>
                    <WordText f={f} at={T.berapa + 10} halus>Dana investasi</WordText>
                  </div>
                  <div style={{ position: 'absolute', left: x0 + 236, top: y - 76, fontFamily: F, fontSize: 44, fontWeight: 800, color: nominal < 99.9 ? ARAH.turun : B.night,
                    fontVariantNumeric: 'tabular-nums', opacity: cin(f, T.berapa + 20) }}>{`Rp${Math.round(nominal)} jt`}</div>
                  {/* batang: abu (dana) → kanan 10 % oranye (sebagian kecil) → kiri 90 % turkis + biru (jalur utama) */}
                  <div style={{ position: 'absolute', left: x0, top: y, width: w, height: h, borderRadius: h / 2, overflow: 'hidden', background: rgba(B.grayLite, 0.7),
                    transform: `scaleX(${cin(f, T.berapa + 10)})`, transformOrigin: 'left center' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, width: wJ, height: h, background: JALUR_WARNA.jalan, opacity: besar }} />
                    <div style={{ position: 'absolute', left: wJ, top: 0, width: wF, height: h, background: JALUR_WARNA.feri, opacity: besar }} />
                    <div style={{ position: 'absolute', left: wJ + wF, top: h * 0.5 * turun, width: wS, height: h * (1 - 0.5 * turun), background: mixHex(PESAWAT, ARAH.turun, salah), opacity: kecil }} />
                  </div>
                  {/* label bawah */}
                  <div style={{ position: 'absolute', left: x0 + wJ + wF + wS / 2, top: y + h + 22, transform: `translate(-50%, 0) scale(${skalaPop(popIn(f, T.kecil))})`, transformOrigin: 'top center',
                    display: 'flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: 26, fontWeight: 700, color: B.night, whiteSpace: 'nowrap' }}>
                    <Icon name="pesawat" size={30} color={PESAWAT} />Sebagian kecil
                  </div>
                  <div style={{ position: 'absolute', left: x0 + (wJ + wF) / 2, top: y + h + 22, transform: `translate(-50%, 0) scale(${skalaPop(popIn(f, T.jalur))})`, transformOrigin: 'top center',
                    display: 'flex', alignItems: 'center', gap: 10, fontFamily: F, fontSize: 26, fontWeight: 700, color: B.night, whiteSpace: 'nowrap' }}>
                    <Icon name="jalanKaki" size={30} color={JALUR_WARNA.jalan} /><Icon name="feri" size={30} color={JALUR_WARNA.feri} style={{ transform: 'scaleX(-1)' }} />Jalur utama
                  </div>
                  {/* "saham yang kita PILIH": bingkai sorot di potongan sebagian kecil (fade) */}
                  <div style={{ position: 'absolute', left: x0 + wJ + wF - 8, top: y - 8, width: wS + 16, height: h + 16, borderRadius: 14, border: `4px solid ${PESAWAT}`,
                    boxSizing: 'border-box', opacity: cin(f, T.pilih) * (1 - cin(f, T.terganggu + 30)) }} />
                  <Chip x={x0 + wJ + wF + wS / 2} y={y - 40} teks="▼ 50%" warna={ARAH.turun} p={popIn(f, T.salah + 30)} size={24} />
                  <Bulat x={x0 + (wJ + wF) / 2} y={y + h / 2} d={64} warna={CEK} ikon="tersedia" p={popIn(f, T.terganggu)} />
                </div>);
            })() : null}
            {/* D: beli apa — perusahaan bagus + harga bagus */}
            {isiD > 0.001 ? (() => {
              const kol = [{ x: 330, ikon: 'kualitas' as const, warna: B.blue, judul: 'Perusahaan bagus', at: T.perusahaanD, sub: 'Bisnis berkualitas', subAt: T.bisnis },
                { x: PANEL.w - 330, ikon: 'valuasi' as const, warna: B.turq, judul: 'Harga bagus', at: T.harga, sub: 'Valuasi masuk akal', subAt: T.valuasiD }];
              return (
                <div style={{ position: 'absolute', inset: 0, opacity: isiD }}>
                  {kol.map((k, i) => (
                    <React.Fragment key={i}>
                      <Bulat x={k.x} y={250} d={130} warna={k.warna} ikon={k.ikon} p={popIn(f, k.at)} />
                      <Lencana x={k.x} y={250} d={130} p={popIn(f, T.duaDua + i * 20)} warna={CEK} ikon="tersedia" besar={52} />
                      <div style={{ position: 'absolute', left: k.x - 260, width: 520, top: 340, textAlign: 'center', fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night, lineHeight: '44px' }}>
                        <WordText f={f} at={k.at + 20} halus>{k.judul}</WordText>
                      </div>
                      <div style={{ position: 'absolute', left: k.x - 260, width: 520, top: 390, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: 700, color: B.gray, lineHeight: '36px' }}>
                        <WordText f={f} at={k.subAt} halus>{k.sub}</WordText>
                      </div>
                    </React.Fragment>))}
                  <div style={{ position: 'absolute', left: PANEL.w / 2 - 20, top: 220, fontFamily: F, fontSize: 60, fontWeight: 800, color: B.gray, lineHeight: '60px',
                    transform: `scale(${skalaPop(popIn(f, T.harga - 20))})` }}>+</div>
                </div>);
            })() : null}
          </Kaca>);
      })()}
      {/* D: bukan karena ramai · rumor · "katanya sebentar lagi naik" */}
      {isiD > 0.001 && keluarPanel > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Chip x={560} y={825} teks="Sedang ramai" ikon="ramai" warna={B.gray} p={popIn(f, T.ramai) * keluarPanel} coret={R(f, T.ramai + 30, T.ramai + 60, 0, 1, io)} size={28} />
          <Chip x={890} y={825} teks="Rumor" ikon="rumor" warna={B.gray} p={popIn(f, T.rumor) * keluarPanel} coret={R(f, T.rumor + 30, T.rumor + 60, 0, 1, io)} size={28} />
          <Kutipan x={1330} y={825} teks="Katanya sebentar lagi naik" p={popIn(f, T.katanya) * keluarPanel} warna={B.gray} size={28} coret={R(f, T.naik + 10, T.naik + 40, 0, 1, io)} />
        </div>) : null}

      </ArahKeluar>

      {/* ══ E: satu saham = risiko menumpuk → belajar saham boleh: mulai kecil & tahu alasannya ══ */}
      {keluarE > 0.001 && f > T.satu - 40 ? (() => {
        const gx = 960 + (610 - 960) * ruangE; // QA pusat 2: +38 → kelompok kiri 610, kanan 1250
        const cy = 540 + 104 * cin(f, T.risikonya - 24); // QA pusat: perusahaan di tengah, turun memberi ruang tumpukan risiko di atasnya
        return (
          <>
            {[0, 1, 2].map((k) => <Bulat key={k} x={gx} y={cy - 160 - k * 74} d={70} warna={B.orange} ikon="risiko"
              p={popIn(f, k === 0 ? T.risikonya : k === 1 ? T.risikonya + 30 : T.menumpuk) * keluarE} />)}
            <Bulat x={gx} y={cy} d={170} warna={PESAWAT} ikon="perusahaan" p={popIn(f, T.satu) * keluarE} />
            <Label x={gx} y={cy + 85 + 40} teks="Satu saham" f={f} at={T.satu + 10} size={30} alfa={keluarE} />
            <Kendaraan x={1250} y={514} d={200} warna={PESAWAT} ikon="pesawat" cermin={false} p={popIn(f, T.belajar) * keluarE} />
            <Lencana x={1250} y={514} d={200} p={popIn(f, T.bolehE) * keluarE} warna={CEK} ikon="tersedia" besar={64} />
            <Chip x={1250} y={684} teks="Mulai kecil" ikon="portofolio" warna={B.blue} p={popIn(f, T.mulaiE) * keluarE} size={28} />
            <Chip x={1250} y={759} teks="Tahu alasannya" ikon="alasan" warna={B.blue} p={popIn(f, T.tahu) * keluarE} size={28} />
          </>);
      })() : null}

      {/* ══ F: pelajaran berikutnya — layar pemutar + guru menunjuk (cermin pembuka Scene 01) ══ */}
      <ArahKeluar aktif={f > S06_AKHIR - 50}>
      <LayarPelajaran s={layarF} progres={0} sorot={0} putar isi={
        <>
          <Img src={staticFile('brand/academy-logo.png')} style={{ position: 'absolute', left: BIDANG_ISI.w / 2 - 210, top: 42, width: 420, height: 420 * 245 / 1398 }} />
          {[{ x: BIDANG_ISI.w / 2 - 190, ikon: 'kualitas' as const, warna: B.blue, teks: 'Kualitas perusahaan', at: T.kualitasF },
            { x: BIDANG_ISI.w / 2 + 190, ikon: 'valuasi' as const, warna: B.turq, teks: 'Harga menarik', at: T.harganya }].map((k, i) => (
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
