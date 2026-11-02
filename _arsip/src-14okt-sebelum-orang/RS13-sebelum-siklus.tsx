import React from 'react';
import { RS14_MASUK } from './RS14';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, F, R, WARNA, io, lerp, rgba, mixHex } from '../theme';
import { Icon, cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { rpMiliar } from '../parts/nominal';
import { denyut } from '../parts/umum';
import { Chevron, Kaca, Nomor, geser, MaskerKeluar, durMasker, type Masuk, daratDari, CakramDarat } from '../parts/kaca';
import { Foto, KartuBaris, Uang } from '../parts/nyata';
import type { KunciIkon } from '../ikon';

/**
 * REVISI SCENE 13 (14 Okt, evaluasi 5 pertanyaan — versi lama: chip teks "Tujuan"/"Profil risiko", ikon produk monitor yang abstrak).
 * Pesan: pilihan jangka panjang disesuaikan tujuan & kemampuan menanggung naik-turun; aset ini terhubung ke perusahaan yang menghasilkan laba & berkembang.
 *   A  "disesuaikan dengan tujuan dan kemampuan kita menghadapi risiko"  KARTU PENGATURAN (ref-08): tujuan (Rumah · Pendidikan · Pensiun, satu dipilih)
 *      + penggeser "siap naik-turun" Rendah · Sedang · Tinggi yang disetel
 *   B  "reksa dana indeks, reksa dana saham, atau saham"  tiga kartu bernomor (ref-21): BANYAK gedung (seluruh pasar) · BEBERAPA gedung pilihan · SATU gedung
 *   C  "terhubung dengan perusahaan"  gedung perusahaan ke depan
 *   D  "menghasilkan pendapatan dan laba"  alur kartu (ref-14): Pendapatan Rp10 M → Laba Rp2 M
 *   E  "menginvestasikan kembali laba itu untuk berkembang"  laba kembali ke perusahaan → pendapatan naik Rp10 M → Rp13 M (Simon 9 Okt: berkembang = nominal)
 */

const [untuk, pilihannya, disesuaikan, tujuan, kemampuan, menghadapi, risiko, misalnya, reksa, reksa2, investasi, kenapa, karena, terhubung, perusahaan,
  menghasilkan, pendapatan, laba, lalu, menginvestasikan, kembali, berkembang] = urut([
  'untuk', 'pilihannya', 'disesuaikan', 'tujuan', 'kemampuan', 'menghadapi', 'risiko', 'misalnya', 'reksa', 'reksa', 'investasi', 'kenapa', 'karena', 'terhubung',
  'perusahaan', 'menghasilkan', 'pendapatan', 'laba', 'lalu', 'menginvestasikan', 'kembali', 'berkembang'], BATAS.s13);

/** MASUK (revisi 14 Okt): masker scene sebelumnya mendarat di sini; elemen pertama scene ini muncul dari titik ini */
export const RS13_MASUK: Masuk = { x: 960, y: 560, r: 150, warna: B.white, mulai: BATAS.s13 - 20 };
const DARAT = daratDari(RS13_MASUK);

const T = {
  // kartu pengaturan muncul langsung berisi (baris menyusul 20f) — tidak ada kartu kosong
  judul: untuk, setel: DARAT + 30, baris1: DARAT + 10, pilih: tujuan + 10, baris2: DARAT + 16, denyutPilihan: pilihannya, denyutSesuai: disesuaikan, denyutMampu: kemampuan, denyutMenghadapi: menghadapi, knob: [kemampuan, risiko + 10],
  keluarA: misalnya - 20, kartu: [reksa, reksa2, investasi], gedung: [reksa + 20, reksa2 + 20, investasi + 20],
  // C: gedung satu perusahaan maju ke tengah BERSAMA dua kartu lain pudar; D: bergeser kiri BERSAMA kartu Pendapatan muncul (ukur 14 Okt: dulu gedung sendirian ±1 dtk)
  pudar: karena - 40, c: karena - 40, kiri: pendapatan - 10, denyutKenapa: kenapa, denyutTerhubung: terhubung, perusahaan: perusahaan - 20, sub: karena, menghasilkan,
  pendapatan: pendapatan - 10, laba: laba - 10, chevron: laba - 30, kembali: [menginvestasikan - 10, kembali + 30], naik: [kembali, berkembang + 20], subSorot: berkembang,
  denyutLalu: lalu,
};

const SET = { w: 900, h: 470, y: 560 };
const TUJUAN: { teks: string; ikon: KunciIkon }[] = [{ teks: 'Rumah', ikon: 'dpRumah' }, { teks: 'Pendidikan', ikon: 'biayaSekolah' }, { teks: 'Pensiun', ikon: 'sofa' }];
const SLIDER = { x0: 860, x1: 1340, y: 655 };
const KARTU = { x: [470, 960, 1450], y: 540, w: 420, h: 470 }; // pusat frame (ukur 14 Okt: dulu y 610 → +70 px)
const PRODUK = [{ nama: 'Reksa dana indeks', n: 12, kol: 4, s: 50 }, { nama: 'Reksa dana saham', n: 5, kol: 3, s: 64 }, { nama: 'Saham', n: 1, kol: 1, s: 0 }];
const WARNA_P = [WARNA.langit, B.blue, B.orange];

export const RS13: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS14_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s13 || f >= RS14_MASUK.mulai + durMasker) return null;
  const kelA = cin(f, T.keluarA), c = cin(f, T.c), pudar = cin(f, T.pudar, 30);
  // B: kartu yang sudah ada selalu berpusat (geser bertahap saat kartu berikutnya muncul)
  const geserB = 245 * ((1 - cin(f, T.kartu[1])) + (1 - cin(f, T.kartu[2])));
  const knob = R(f, T.knob[0], T.knob[1], 0, 1, io);
  // penggeser: Rendah → Tinggi → Sedang (disetel sesuai kemampuan)
  const posKnob = knob < 0.6 ? lerp(0, 1, io(knob / 0.6)) : lerp(1, 0.5, io((knob - 0.6) / 0.4));
  const kembali = R(f, T.kembali[0], T.kembali[1], 0, 1, io);
  const naik = R(f, T.naik[0], T.naik[1], 0, 1, io);
  return (
    <MaskerKeluar f={f} mulai={RS14_MASUK.mulai} ke={RS14_MASUK} warna={RS14_MASUK.warna}>
    <AbsoluteFill>
      <CakramDarat f={f} ke={RS13_MASUK} />
      {/* ═════════ A: kartu pengaturan (ref-08) ═════════ */}
      {kelA < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, 1 - kelA), transform: geser(0, -50 * kelA) }}>
          <Kaca x={960} y={SET.y} w={SET.w} h={SET.h} p={popIn(f, T.setel) * (1 + [T.denyutPilihan, T.denyutPilihan + 36, T.denyutPilihan + 145, T.denyutSesuai, T.denyutSesuai + 40, T.denyutMampu].reduce((a, t) => a + denyut(f, t, 0.02), 0))} warna={B.orange} tab="atas" rona={0.4} />
          {popIn(f, T.setel) > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: SET.w, height: SET.h, transformOrigin: 'center', transform: `${geser(960 - SET.w / 2, SET.y - SET.h / 2)} scale(${popIn(f, T.setel)})`,
              fontFamily: F }}>
              <div style={{ position: 'absolute', left: 44, top: 44, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', background: B.orange, display: 'grid', placeItems: 'center' }}><Icon name="dompet" size={40} color={B.white} /></div>
                <span style={{ fontSize: 38, fontWeight: 800, color: B.night }}>Uang jangka panjang</span>
              </div>
              <div style={{ position: 'absolute', left: 44, right: 44, top: 140, height: 2, background: rgba(B.night, 0.08) }} />
              {/* baris 1: tujuan */}
              <div style={{ position: 'absolute', left: 44, top: 196, fontSize: 30, fontWeight: 800, color: B.gray, opacity: Math.min(0.9999, cin(f, T.baris1, 30)) }}>Tujuan</div>
              {TUJUAN.map((t, k) => {
                const p = popIn(f, T.baris1 + 10 + 8 * k);
                if (p <= 0.001) return null;
                const dipilih = k === 0 ? cin(f, T.pilih, 30) : 0;
                return (
                  <div key={t.teks} style={{ position: 'absolute', left: 290 + 196 * k, top: 176, width: 180, height: 76, borderRadius: 999, boxSizing: 'border-box', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 28, fontWeight: 800, transform: `scale(${p})`,
                    background: mixHex(B.white, B.orange, dipilih), color: mixHex(B.night, B.white, dipilih), border: `2.5px solid ${mixHex(B.grayLite, B.orange, dipilih)}`,
                    boxShadow: `0 10px 22px -14px ${rgba(B.night, 0.4)}` }}>
                    <Icon name={t.ikon} size={32} color={mixHex(B.orange, B.white, dipilih)} />{t.teks}
                  </div>);
              })}
              {/* baris 2: siap menghadapi naik-turun — penggeser 3 tingkat */}
              <div style={{ position: 'absolute', left: 44, top: 320, fontSize: 30, fontWeight: 800, color: B.gray, lineHeight: 1.1, opacity: Math.min(0.9999, cin(f, T.baris2, 30)) }}>
                Siap<br />naik-turun
              </div>
              {cin(f, T.baris2, 30) > 0.001 ? (
                <div style={{ position: 'absolute', left: 0, top: 0, opacity: Math.min(0.9999, cin(f, T.baris2 + 10, 30)) }}>
                  <div style={{ position: 'absolute', left: SLIDER.x0 - 960 + SET.w / 2, top: 340, width: SLIDER.x1 - SLIDER.x0, height: 12, borderRadius: 6,
                    background: `linear-gradient(90deg, ${B.turqLite}, ${B.orange})` }} />
                  {['Rendah', 'Sedang', 'Tinggi'].map((t, k) => (
                    <React.Fragment key={t}>
                      <div style={{ position: 'absolute', left: SLIDER.x0 - 960 + SET.w / 2 + k * (SLIDER.x1 - SLIDER.x0) / 2 - 8, top: 338, width: 16, height: 16, borderRadius: 8, background: B.white,
                        border: `3px solid ${B.grayLite}`, boxSizing: 'border-box' }} />
                      <div style={{ position: 'absolute', left: SLIDER.x0 - 960 + SET.w / 2 + k * (SLIDER.x1 - SLIDER.x0) / 2, top: 382, transform: 'translateX(-50%)', fontSize: 26,
                        fontWeight: 800, color: Math.abs(posKnob - k / 2) < 0.12 ? B.night : B.gray, whiteSpace: 'nowrap' }}>{t}</div>
                    </React.Fragment>))}
                  <div style={{ position: 'absolute', left: SLIDER.x0 - 960 + SET.w / 2 + posKnob * (SLIDER.x1 - SLIDER.x0) - 24, top: 322, width: 48, height: 48, borderRadius: 24, background: B.white,
                    border: `6px solid ${B.orange}`, boxSizing: 'border-box', boxShadow: `0 8px 16px -6px ${rgba(B.night, 0.4)}` }} />
                </div>) : null}
            </div>) : null}
        </div>) : null}

      {/* ═════════ B: tiga kartu bernomor — banyak · beberapa · satu perusahaan ═════════ */}
      {c < 0.999 ? PRODUK.map((pr, k) => {
        const p = popIn(f, T.kartu[k]);
        if (p <= 0.001) return null;
        const x = KARTU.x[k] + geserB, atas = KARTU.y - KARTU.h / 2;
        const g = popIn(f, T.gedung[k]);
        const saham = k === 2;
        return (
          <div key={pr.nama} style={{ position: 'absolute', inset: 0, opacity: saham ? 1 : Math.min(0.9999, 1 - pudar) }}>
            <Kaca x={x} y={KARTU.y} w={KARTU.w} h={KARTU.h} p={p * (1 + (k < 2 ? denyut(f, T.kartu[2] - 40 + 12 * k, 0.03) : 0))} alfa={saham ? 1 - c : 1} warna={WARNA_P[k]} tab="atas" rona={0.5} />
            <Nomor x={x - KARTU.w / 2 + 46} y={atas + 46} n={k + 1} warna={WARNA_P[k]} p={p * (saham ? 1 - c : 1)} />
            {/* Simon 14 Okt: ikon → gambar realistis (berkas Simon): RD indeks (banyak gedung mini) · RD saham (lembar saham beberapa perusahaan) · Saham
                (sertifikat + satu gedung). Gambar Saham memudar menjadi foto gedung perusahaan saat C dimulai. */}
            <Foto k={(['rdIndeks', 'rdSaham', 'saham'] as const)[k]} x={x} y={atas + 190} w={250} p={g} alfa={saham ? 1 - R(c, 0, 0.4, 0, 1) : 1} />
            {!saham && f >= T.kartu[k] ? (
              <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, atas + 365)} translate(-50%, -50%)`, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night,
                whiteSpace: 'nowrap', opacity: Math.min(0.9999, cin(f, T.kartu[k] + 10, 30)) }}>{pr.nama}</div>) : null}
            {saham && c < 0.999 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, atas + 365)} translate(-50%, -50%)`, fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night,
                whiteSpace: 'nowrap', opacity: Math.min(0.9999, cin(f, T.kartu[k] + 10, 30) * (1 - c)) }}>{pr.nama}</div>) : null}
          </div>);
      }) : null}
      {/* gedung SATU perusahaan: dari kartu Saham (B) → maju ke kiri tengah (C–E) */}
      {(() => {
        // muncul dari gambar Saham di kartu 03 (silang-pudar) begitu C mulai
        const p = c > 0.001 ? 1 : 0;
        if (p <= 0.001) return null;
        // C: ke tengah (sendirian) · D: geser kiri saat kartu pendapatan muncul
        // C–E berpusat (ukur 14 Okt: dulu gedung y 590 → +50 px; alur D–E +38 px ke kanan & +39 px ke bawah)
        const x = lerp(lerp(KARTU.x[2], 960, c), 602, cin(f, T.kiri)), y = lerp(KARTU.y - KARTU.h / 2 + 190, 540, c), w = lerp(150, 300, c);
        return <Foto k="perusahaan" x={x} y={y} w={w} p={p * (1 + denyut(f, T.denyutKenapa, 0.04) + [T.denyutTerhubung - 74, T.denyutTerhubung - 24, T.denyutTerhubung + 40, T.denyutTerhubung + 102].reduce((a, t) => a + denyut(f, t, 0.035), 0) + denyut(f, T.denyutTerhubung, 0.04) + denyut(f, T.kembali[1], 0.05) + denyut(f, T.denyutLalu, 0.03))} alfa={R(c, 0, 0.4, 0, 1)} />;
      })()}

      {/* ═════════ D–E: pendapatan → laba → diinvestasikan kembali ═════════ */}
      {c > 0.001 ? (
        <>
          <KartuBaris x={1222} y={411} p={popIn(f, T.pendapatan)} ikon="toko" warna={B.blue} judul="Pendapatan" w={460}
            ket={`${naik > 0.02 ? '▲ ' : ''}${rpMiliar(10 + 3 * naik, naik > 0.02 ? 1 : 0)} / tahun`} ketWarna={mixHex(B.gray, ARAH.naik, Math.min(1, naik * 8))} />
          <Chevron x={1222} y={531} warna={B.orange} p={popIn(f, T.chevron)} arah="bawah" d={50} />
          <KartuBaris x={1222} y={651} p={popIn(f, T.laba)} ikon="laba" warna={B.orange} judul="Laba" ket={`${rpMiliar(2, 0)} / tahun`} w={460} />
          {/* laba kembali ke perusahaan */}
          {kembali > 0.001 && kembali < 0.999 ? <Uang x={lerp(1062, 662, kembali)} y={lerp(651, 561, kembali) - Math.sin(Math.PI * kembali) * 120} w={120}
            alfa={R(kembali, 0, 0.15, 0, 1) * R(kembali, 0.85, 1, 1, 0)} /> : null}
        </>) : null}

      <Judul f={f} kata={['Uang', 'jangka', 'panjang']} at={T.judul} />
      <Judul f={f} kata={['beri', 'ruang', 'lebih', 'besar', 'untuk', 'pertumbuhan']} sorotIdx={5} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
