import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, CORET, F, R, WARNA, io, lerp, mixHex } from '../theme';
import { cin, Icon, popOut, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';
import type { KunciIkon } from '../ikon';
import { S04_DOMPET_AKHIR, S04_KELUAR, S04_TITIK } from '../s04/Scene04';
import { CINCIN_JARAK, DompetInfo } from '../parts/infografis';

/**
 * SCENE 05 — IDE VISUAL (13 Okt). Bab "01 — Uang Aktif". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  UANG AKTIF ↓ Rekening Bank (±0,1% per tahun) · Reksa Dana Pasar Uang (±4% per tahun) ↓ MUDAH DICAIRKAN
 *   TEXT    "Uang aktif" / "likuiditas lebih penting"
 * Empat ketukan:
 *   A  "Karena itu, uang aktif biasanya lebih cocok ditempatkan di tempat yang mudah dicairkan, seperti rekening bank."
 *        kebutuhan S04 keluar, dompet naik · garis ke slot "?" · chip "Mudah dicairkan" (baris kesimpulan bawah) · slot → Rekening bank (foto Simon V02)
 *   B  "Kalau ada sebagian yang belum akan dipakai, tapi tetap perlu likuiditas tinggi, reksa dana pasar uang juga bisa dipertimbangkan."
 *        cabang kedua → slot + lencana jam ("belum dipakai") · sub-judul TEXT · slot → Reksa Dana Pasar Uang
 *   C  "Fokus utamanya bukan mencari return tertinggi,"   pil return ±0,1 % / ±4 % per tahun · tag "Return tertinggi" dicoret MERAH (pola V02 S02)
 *   D  "tapi likuiditas dan stabilitas."                    chip "Mudah dicairkan" berdenyut · tag coret berganti chip "Stabil"
 */

const [uang, aktif, cocok, ditempatkan, dicairkan, rekening, bank, kalau, sebagian, dipakai, tapi, likuiditas, tinggi, reksa, pasar, juga, dipertimbangkan,
  fokus, mencari, ret, tertinggi, tapi2, likuiditas2, stabilitas] = urut([
  'uang', 'aktif', 'cocok', 'ditempatkan', 'dicairkan', 'rekening', 'bank', 'kalau', 'sebagian', 'dipakai', 'tapi', 'likuiditas', 'tinggi', 'reksa', 'pasar',
  'juga', 'dipertimbangkan', 'fokus', 'mencari', 'return', 'tertinggi', 'tapi', 'likuiditas', 'stabilitas'], BATAS.s5);

const T = {
  naik: uang, judul: aktif + 20, // dompet naik ke atas (kebutuhan S04 keluar — S04_KELUAR)
  // TANPA slot "?" / garis kosong (Simon 13 Okt): uang kecil keluar dari dompet ke tempatnya di "ditempatkan" lalu rekening bank tumbuh di sekelilingnya;
  // garis dompet → tempat tumbuh BERSAMA tempatnya; "sebagian … belum dipakai" = uang kecil kedua keluar di samping dompet + lencana jam,
  // menyusuri garis ke RDPU saat RDPU muncul
  uangL: ditempatkan, cair: dicairkan, bank: rekening + 10, cairBalik: rekening + 70, denyutBank: bank, denyutUangL: [cocok, dicairkan, dicairkan + 66],
  uangR: sebagian, jam: dipakai, denyutUangR: kalau,
  sub: tapi + 20, subSorot: tinggi + 10, denyutCair: likuiditas,
  rdpu: reksa + 22, labelRdpu: pasar, juga, timbang: dipertimbangkan,
  fokus, tag: mencari, ret: [ret, ret + 12], coret: tertinggi + 12, redupReturn: tapi2, // "TAPI likuiditas…": return meredup (bukan fokusnya)
  denyutCair2: likuiditas2, stabil: stabilitas,
};

/* ── tata letak (isi 195–907 berpusat di y ±551) ── */
const AWAL = S04_DOMPET_AKHIR; // dompet Uang Aktif dari Scene 04 (960, 680, Ø240)
const DOMPET = { x: 960, y: 285, d: 180 };
const NODE = { y: 575, d: 220, x: [630, 1290] };
const LABEL_Y = NODE.y + NODE.d / 2 + 16, RETURN_Y = 785, CHIP_Y = 877;
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const denyut = (f: number, at: number, a = 0.07) => a * Math.sin(Math.PI * R(f, at - 20, at + 20, 0, 1, io));

/** baris kesimpulan bawah: lebar pil terukur (Bold 30, padding Pill kit) — baris selalu berpusat di 960 */
const PIL_W = { cair: 340, tag: 330, stabil: 184 }, CELAH = 24;
/** uang kecil "sebagian" menunggu di kanan dompet sebelum RDPU muncul */
const TUNGGU_R = { dx: 190, dy: 10 };
const W_UANG = 110;

/** KELUAR Scene 05 = milik Scene 06 ("Dana darurat …"): tempat, pil, chip, garis & judul keluar 60f mulai di batas; dompet Uang aktif
 *  diambil alih Scene 06 (titik & rupa sama, S05_DOMPET_AKHIR) */
export const S05_KELUAR = BATAS.s6 + 30;
export const S05_DOMPET_AKHIR = { x: DOMPET.x, y: DOMPET.y, d: DOMPET.d, warna: B.blue };
export const Scene05: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s5 || f >= S05_KELUAR + 60) return null;
  const kel = cin(f, S05_KELUAR);
  const pk = (i: number) => popOut(f, S05_KELUAR - 12 + 8 * i); // pop keluar berjenjang (kiri → kanan, atas → bawah)
  const milikS5 = f < BATAS.s6;
  const naik = cin(f, T.naik);
  const dx = DOMPET.x, dy = lerp(AWAL.y, DOMPET.y, naik), dd = lerp(AWAL.d, DOMPET.d, naik);
  const cincin = AWAL.cincin * (1 - cin(f, BATAS.s5 + 30));
  // tag "Return tertinggi" masuk di "mencari", berganti chip "Stabil" di "stabilitas"
  const tagIn = cin(f, T.tag), swap = cin(f, T.stabil);
  // dompet gaya infografis Scene 04 (lingkaran putih, teks "Uang Aktif" di dalam) → kembali biru saat judul TEXT "Uang aktif" muncul (teks tak dobel)
  const putih = AWAL.putih * (1 - cin(f, T.judul)); // teks di dalam pudar lebih dulu (paruh pertama) → tak ada teks samar di atas ikon saat silang-pudar
  const xCair = lerp(lerp(960, 960 - (PIL_W.cair + CELAH + PIL_W.tag) / 2 + PIL_W.cair / 2, tagIn), 960 - (PIL_W.cair + CELAH + PIL_W.stabil) / 2 + PIL_W.cair / 2, swap);
  const xKanan = xCair + PIL_W.cair / 2 + CELAH; // tepi kiri pil kanan
  const coret = R(f, T.coret - 30, T.coret + 30, 0, 1, io);
  // GESER BERTAHAP: rekening bank sendirian di tengah (di bawah dompet), baris bergeser saat RDPU muncul — tengah di setiap momen
  const geserBaris = (NODE.x[1] - NODE.x[0]) / 2 * (1 - cin(f, T.rdpu - 10));
  const nx = (k: number) => NODE.x[k] + geserBaris;
  return (
    <AbsoluteFill>
      {/* garis dompet → dua tempat */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - kel }}>
        {[0, 1].map((k) => {
          const tk = k === 0 ? T.bank : T.rdpu;
          const g = R(f, tk - 40, tk + 10, 0, 1, io);
          if (g <= 0.001) return null;
          const ex = nx(k), ey = NODE.y;
          const ang = Math.atan2(ey - dy, ex - dx);
          const sx = dx + Math.cos(ang) * (dd / 2 + 14), sy = dy + Math.sin(ang) * (dd / 2 + 14);
          const tx = ex - Math.cos(ang) * (NODE.d / 2 + 16), ty = ey - Math.sin(ang) * (NODE.d / 2 + 16);
          const col = k === 0 ? B.turq : WARNA.langit;
          const hx = lerp(sx, tx, g), hy = lerp(sy, ty, g);
          return (
            <g key={k}>
              <line x1={sx} y1={sy} x2={hx} y2={hy} stroke={col} strokeWidth={3} strokeDasharray="7 11" strokeLinecap="round" />
              {g > 0.9 ? <path d={`M ${tx} ${ty} l ${-Math.cos(ang - 0.45) * 18} ${-Math.sin(ang - 0.45) * 18} l ${Math.cos(ang - 0.45) * 18 - Math.cos(ang + 0.45) * 18} ${Math.sin(ang - 0.45) * 18 - Math.sin(ang + 0.45) * 18} z`}
                fill={col} opacity={R(g, 0.9, 1, 0, 1)} /> : null}
            </g>);
        })}
      </svg>

      {/* dompet Uang Aktif (dari Scene 04) + label */}
      {milikS5 && cincin > 0.001 ? (() => {
        const rr = dd / 2 + 16 + (CINCIN_JARAK + 14) * AWAL.putih; // radius sama dengan cincin sorot Scene 04
        return <div style={{ position: 'absolute', left: dx - rr, top: dy - rr, width: 2 * rr, height: 2 * rr, borderRadius: '50%', border: `3px solid ${B.blue}`,
          opacity: cincin, boxShadow: `0 0 36px 4px ${B.blue}55` }} />;
      })() : null}
      {milikS5 ? <DompetInfo x={dx} y={dy} d={dd} warna={B.blue} putih={putih} teks={AWAL.putih * (1 - R(f, T.judul - 34, T.judul, 0, 1, io))} baris1="UANG AKTIF" baris2="100%"
        titik={S04_TITIK.map((t) => ({ ...t, p: 1 - cin(f, S04_KELUAR - 12) }))} /> : null}

      {/* "mudah dicairkan": uang kecil keluar dari tempat pertama dan kembali ke dompet (dicairkan) */}
      {(() => {
        const t = R(f, T.cairBalik - 30, T.cairBalik + 30, 0, 1, io);
        if (t <= 0.001 || t >= 0.999) return null;
        const W = 90, H = W / (520 / 441);
        const x = lerp(nx(0), dx, t), y = lerp(NODE.y, dy, t) - Math.sin(Math.PI * t) * 40;
        return <Img src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, maxWidth: 'none',
          opacity: R(t, 0, 0.15, 0, 1) * R(t, 0.85, 1, 1, 0), transform: geser(x - W / 2, y - H / 2) }} />;
      })()}
      {/* "juga bisa DIPERTIMBANGKAN": cincin sorot bergiliran di kedua tempat (menimbang), pudar di "tapi likuiditas" */}
      {[0, 1].map((k) => {
        const c = cin(f, T.timbang + 30 * k) * (1 - cin(f, T.redupReturn)) * (1 - kel);
        return c > 0.001 ? <div key={`c${k}`} style={{ position: 'absolute', left: nx(k) - NODE.d / 2 - 14, top: NODE.y - NODE.d / 2 - 14, width: NODE.d + 28, height: NODE.d + 28,
          borderRadius: '50%', border: `3px solid ${k === 0 ? B.turq : WARNA.langit}`, opacity: c, boxShadow: `0 0 30px 3px ${k === 0 ? B.turq : WARNA.langit}55` }} /> : null;
      })}
      {/* uang kecil: kiri ke tempatnya ("ditempatkan") → diserap rekening bank · kanan "sebagian" menunggu di samping dompet → menyusuri garis ke RDPU */}
      {[0, 1].map((k) => {
        const kiri = k === 0;
        const t0 = kiri ? T.uangL : T.uangR, serap = kiri ? T.bank : T.rdpu;
        const keluar = R(f, t0 - 30, t0 + 30, 0, 1, io);
        if (keluar <= 0.001 || f > serap + 12) return null;
        const jalan = kiri ? keluar : R(f, serap - 40, serap + 4, 0, 1, io);
        const asal = kiri ? { x: dx, y: dy } : { x: dx + TUNGGU_R.dx * keluar, y: dy + TUNGGU_R.dy * keluar };
        const x = lerp(asal.x, nx(k), jalan), y = lerp(asal.y, NODE.y, jalan) - Math.sin(Math.PI * jalan) * 30;
        const s = (kiri ? 1 : Math.min(1, keluar * 1.2)) * (1 - R(f, serap - 8, serap + 12, 0, 1, io)) * (1 + (kiri ? T.denyutUangL : [T.denyutUangR]).reduce((a, t) => a + denyut(f, t, 0.08), 0));
        const H = W_UANG / (520 / 441);
        return <Img key={`u${k}`} src={staticFile('media/uang-rupiah.webp')} style={{ position: 'absolute', left: 0, top: 0, width: W_UANG, height: H, maxWidth: 'none', transformOrigin: 'center',
          opacity: Math.min(0.9999, R(keluar, 0, 0.2, 0, 1)), transform: `${geser(x - W_UANG / 2, y - H / 2)} scale(${s})` }} />;
      })}
      {/* dua tempat: Rekening bank (foto Simon V02 "Celengan & Buku Tabungan") · Reksa Dana Pasar Uang — tanpa slot kosong */}
      {[0, 1].map((k) => {
        const x = nx(k);
        const isi = popIn(f, k === 0 ? T.bank : T.rdpu) * pk(k);
        const dn = (k === 0 ? denyut(f, T.denyutBank) : 0) + (k === 1 ? denyut(f, T.juga) : 0) + denyut(f, T.fokus + 14 * k, 0.05);
        const jam = k === 1 ? popIn(f, T.jam) * pk(k) : 0;
        return (
          <React.Fragment key={k}>
            {isi > 0.001 ? (k === 0 ? <FotoBank x={x} y={NODE.y} d={NODE.d} s={isi * (1 + dn)} /> : (
              <div style={{ position: 'absolute', left: 0, top: 0, width: NODE.d, height: NODE.d, borderRadius: '50%', background: WARNA.langit,
                display: 'grid', placeItems: 'center', transformOrigin: 'center', transform: `${geser(x - NODE.d / 2, NODE.y - NODE.d / 2)} scale(${isi * (1 + dn)})`, boxShadow: `0 16px 34px -12px ${WARNA.langit}aa` }}>
                <Icon name="rdPasarUang" size={NODE.d * 0.56} color={B.white} />
              </div>)) : null}
            {/* "belum akan dipakai": lencana jam menempel di uang "sebagian", lalu ikut ke RDPU (tetap ada sesudahnya) */}
            {jam > 0.001 ? (() => {
              const j = R(f, T.rdpu - 40, T.rdpu + 4, 0, 1, io);
              const jx = lerp(dx + TUNGGU_R.dx + W_UANG * 0.42, x + NODE.d * 0.36, j), jy = lerp(dy + TUNGGU_R.dy - W_UANG * 0.32, NODE.y - NODE.d * 0.36, j);
              return (
              <div style={{ position: 'absolute', left: 0, top: 0, width: 68, height: 68, borderRadius: '50%', background: B.orange, transform: `${geser(jx - 38, jy - 38)} scale(${jam})`,
                border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', boxShadow: `0 10px 24px -8px ${B.orange}cc` }}>
                <Icon name="waktu" size={38} color={B.white} />
              </div>);
            })() : null}
            {f >= (k === 0 ? T.bank : T.labelRdpu) - 30 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(x - 220, LABEL_Y), width: 440, textAlign: 'center', whiteSpace: 'nowrap', opacity: 1 - kel }}>
                <WordText halus f={f} at={k === 0 ? T.bank + 6 : T.labelRdpu} style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>
                  {k === 0 ? 'Rekening bank' : 'Reksa dana pasar uang'}</WordText>
              </div>) : null}
            <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.55 * cin(f, T.redupReturn) }}>
              <PilNominal x={x} y={RETURN_Y} teks={k === 0 ? '±0,1% per tahun' : '±4% per tahun'} arah={0} p={popIn(f, T.ret[k]) * pk(k + 1)} size={26} />
            </div>
          </React.Fragment>);
      })}

      {/* baris kesimpulan bawah (VISUAL "MUDAH DICAIRKAN"): chip Mudah dicairkan · tag "Return tertinggi" dicoret → chip "Stabil" */}
      <Chip x={xCair} y={CHIP_Y} teks="Mudah dicairkan" ikon="mudahDicairkan" warna={B.blue}
        p={popIn(f, T.cair) * (1 + denyut(f, T.denyutCair) + denyut(f, T.denyutCair2)) * pk(2)} />
      {/* pergantian berurutan (tanpa tumpang tindih): tag keluar dulu (pusat −34f), "Stabil" masuk sesudahnya (pusat +26f) */}
      <Chip x={xKanan + PIL_W.tag / 2} y={CHIP_Y} teks="Return tertinggi" ikon="trofi" warna={mixHex(B.orange, CORET, coret)} p={popIn(f, T.tag) * popOut(f, T.stabil - 34)} coret={coret} />
      <Chip x={xKanan + PIL_W.stabil / 2} y={CHIP_Y} teks="Stabil" ikon="stabil" warna={B.turq} p={popIn(f, T.stabil + 26) * pk(3)} />

      <Judul f={f} kata={['Uang', 'aktif']} at={T.judul} keluar={S05_KELUAR} />
      <Judul f={f} kata={['likuiditas', 'lebih', 'penting']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S05_KELUAR} />
    </AbsoluteFill>);
};

/** foto Rekening bank (foto Simon V02 S02 "Celengan Pink dan Buku Tabungan", 600 × 505) utuh di atas lingkaran turkis — pusat massa di pusat lingkaran (V02: alas 0,76 r) */
const FotoBank: React.FC<{ x: number; y: number; d: number; s: number }> = ({ x, y, d, s }) => {
  const r = d / 2, w = d * 1.1, h = w / (600 / 505);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `${geser(x, y)} scale(${s})` }}>
      <div style={{ position: 'absolute', left: -r, top: -r, width: d, height: d, borderRadius: '50%', background: B.turq, boxShadow: `0 16px 34px -12px ${B.turq}aa` }} />
      <Img src={staticFile('media/rekening-bank.webp')} style={{ position: 'absolute', left: -w / 2, top: 0.76 * r - h, width: w, height: h, maxWidth: 'none' }} />
    </div>);
};

/** chip (pil gaya rumah: putih, tepi warna 2,5 px, ikon + teks Bold 30) dipusatkan di (x, y); `coret` = garis coret MERAH tergambar kiri → kanan */
const Chip: React.FC<{ x: number; y: number; teks: string; ikon: KunciIkon; warna: string; p: number; coret?: number }> = ({ x, y, teks, ikon, warna, p, coret = 0 }) =>
  p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, transformOrigin: 'center',
      display: 'flex', alignItems: 'center', gap: 10, background: B.white, border: `2.5px solid ${warna}`, borderRadius: 999, padding: '11px 27px',
      fontFamily: F, fontSize: 30, fontWeight: 700, color: coret > 0.5 ? CORET : B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -14px ${warna}aa` }}>
      <Icon name={ikon} size={31.5} color={warna} />
      {teks}
      {coret > 0.001 ? <div style={{ position: 'absolute', left: 14, top: '50%', height: 4, width: `calc(${coret} * (100% - 28px))`, background: CORET, borderRadius: 2, transform: 'translateY(-50%)' }} /> : null}
    </div>);

export const S05_T = T;
