import React from 'react';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { gayaIsi, kamera, keLayar } from '../kamera';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { ARAH, B, CORET, F, R, io, mixHex, rgba } from '../theme';
import { Icon, MODE_UKUR, Sorot, geserSorot, WordText, cin, lerp } from '../parts/kit';
import { popIn } from '../parts/pop';
import { SimpulBab } from '../parts/rantai';
import { PETA } from '../parts/peta';
import { BAB } from '../s01/data';
import { INSTRUMEN13 } from '../s13/Scene13';

/**
 * RANGKUMAN — naskah REVISI 16 Okt, Scene 09 (kunci batas s12). Kolom VISUAL kosong; NOTE Simon: "tabel rangkuman utama … setiap aset
 * dibandingkan berdasarkan historical return, sumber return, tingkat kesulitan, volatilitas, dan potensi risiko". TEXT "Beda aset / beda
 * sumber return / beda karakter". Data & tata letak = tabel Simon 16 Okt "Perbandingan Instrumen Investasi" (10 instrumen, 3 segmen
 * Rendah→Tinggi, setengah segmen = nilai antara; catatan "Potensi" Saham, "2016–2025" Emas, * & ** Properti). Warna = brand (acuan Simon
 * hijau/abu → oranye = baris saham yang Simon sorot, biru = lainnya). Kolom SUMBER RETURN (ikon) ditambahkan: narasi menyebut cash flow /
 * perubahan harga / keduanya, dan feedback minta sumber return di tabel.
 * Alur: isi Saham menyusut ke simpul bab 06 di PETA BAB (enam bab berdampingan) → simpul meluncur jadi ikon baris → kolom terisi satu per
 * satu tepat di kalimatnya → "Unggul di semua hal" dicoret. Keluar = masker ke simpul instrumen pembuka Penutup.
 */
export const S12 = BATAS.s12;
export const IDE_S12_AWAL = S12;

const [semua, taruh, perbedaannya, cash, perubahan, keduanya, ret, seberapa1, seberapa2, seberapa3, tidak, unggul, semuanya] =
  urut(['semua', 'taruh', 'perbedaannya', 'cash', 'perubahan', 'keduanya', 'return', 'seberapa', 'seberapa', 'seberapa', 'tidak',
    'unggul', 'semuanya'], S12);

const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

/* ── data tabel Simon (0–3 segmen; .5 = setengah segmen) ── */
type Sumber = 'cash' | 'harga' | 'dua';
type Baris = { nama: string; ikon: KunciIkon; bab: number; v: [number, number, number, number]; sumber: Sumber; sorot?: 'kuat' | 'muda'; cat?: [string?, string?, string?, string?] };
const BARIS: Baris[] = [
  { nama: 'Saham', ikon: 'saham', bab: 5, v: [3, 3, 3, 3], sumber: 'dua', sorot: 'kuat', cat: ['Potensi'] },
  { nama: 'Reksa Dana Saham', ikon: 'rdSaham', bab: 4, v: [3, 1.5, 2.5, 2.5], sumber: 'dua', sorot: 'kuat' },
  { nama: 'Emas', ikon: 'emas', bab: 1, v: [3, 1, 2.5, 2], sumber: 'harga', cat: ['2016–2025'] },
  { nama: 'Reksa Dana Indeks', ikon: 'rdIndeks', bab: 4, v: [2.5, 1, 2.5, 2.5], sumber: 'dua', sorot: 'muda' },
  { nama: 'Obligasi Pemerintah', ikon: 'obligasi', bab: 3, v: [2, 1.5, 1.5, 1], sumber: 'cash' },
  { nama: 'Reksa Dana Pendapatan Tetap', ikon: 'rdPendapatanTetap', bab: 4, v: [2, 1, 1.5, 1.5], sumber: 'cash' },
  { nama: 'Reksa Dana Pasar Uang', ikon: 'rdPasarUang', bab: 4, v: [1.5, 1, 0.5, 1], sumber: 'cash' },
  { nama: 'Deposito', ikon: 'deposito', bab: 0, v: [1.5, 1, 0.5, 1], sumber: 'cash' },
  { nama: 'Properti', ikon: 'properti', bab: 2, v: [1, 3, 1, 2], sumber: 'dua', cat: ['*', undefined, '**'] },
  { nama: 'Tabungan', ikon: 'tabungan', bab: 0, v: [1, 1, 0.5, 1], sumber: 'cash' },
];
/** baris pertama tiap bab = tujuan simpul peta yang meluncur (bab lain di baris itu pop) */
const BARIS_BAB = BAB.map((_, k) => BARIS.findIndex((b) => b.bab === k));

/* ── geometri tabel (dunia) ── */
const T = { x0: 150, x1: 1780, kepala: 204, garis: 230, y0: 264, h: 58 };
const rowY = (i: number) => T.y0 + i * T.h;
const ID = 42; // ikon baris
const X = { ikon: T.x0 + 36, nama: T.x0 + 70, sumber: 740, kol: [866, 1146, 1376, 1606] }; // celah catatan (Potensi · 2016–2025 · **) sesudah batang
const SEG = { w: 54, h: 16, gap: 6 };
const KOLOM = ['Return', 'Kesulitan', 'Volatilitas', 'Risiko'];
/** Simon 16 Okt: Kesulitan · Volatilitas · Risiko diwarnai MENURUT TINGKAT nilainya — rendah hijau, sedang kuning, tinggi merah (permintaan
 *  eksplisit Simon, di luar palet brand; hijau/merah = warna arah harga yang sudah dipakai). Return tetap warna brand. */
const KUNING = '#F2B705';
const warnaTingkat = (v: number) => (v <= 1 ? ARAH.naik : v <= 2 ? KUNING : ARAH.turun);

export const Scene12: React.FC<{ f: number }> = ({ f }) => {
  if (f < S12) return null;
  // KELUAR = masker ke simpul INSTRUMEN Penutup ("Setelah memahami perbedaannya"), biru + ikon. 50f mulai BATAS.s13 (pola lama).
  if (f >= BATAS.s13 + 52) return null;
  const ex = R(f, BATAS.s13, BATAS.s13 + 50, 0, 1, io);
  const kam13 = kamera('S13', BATAS.s13 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam13, INSTRUMEN13), r: INSTRUMEN13.r * kam13.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);
  const kam = kamera('S12', f);

  /* waktu kolom: tiap kolom (kepala + isi) muncul di kalimatnya, isi menyapu baris berjenjang 5f */
  const T_KOL = [ret - 10, seberapa1 + 20, seberapa2 + 20, seberapa3 + 20];
  const T_SUMBER: Record<Sumber, number> = { cash: cash - 10, harga: perubahan - 10, dua: keduanya - 10 };
  const bangun = (i: number) => semua + 24 + 7 * i; // baris berdampingan, berjenjang — sesudah simpul peta tiba di barisnya
  const kerangka = cin(f, semua + 20); // garis kepala tabel selebar tabel sejak baris dibangun → susunan berpusat, kamera tak perlu menggeser
  // simpul peta → ikon baris pertama babnya
  const keBaris = R(f, semua - 40, semua + 30, 0, 1, io);
  const pudarPeta = R(f, semua - 10, semua + 20, 0, 1, io);
  // sorot kategori sumber (pita baris) — satu kategori pada satu waktu
  const pita = (s: Sumber) => {
    const a = T_SUMBER[s], b = s === 'cash' ? T_SUMBER.harga : s === 'harga' ? T_SUMBER.dua : ret - 20;
    return R(f, a - 10, a + 20, 0, 1, io) * (1 - R(f, b - 20, b + 10, 0, 1, io));
  };
  const WARNA_SUMBER: Record<Sumber, string> = { cash: B.turq, harga: B.orange, dua: B.blue };

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s13, BATAS.s13 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      <JudulBertahap f={f} />
      <AbsoluteFill style={gayaIsi(kam, f >= BATAS.s13 - 30)}>
        {/* ═════ peta bab (tempat isi Saham menyusut) → simpul meluncur jadi ikon baris ═════ */}
        {keBaris < 1 ? (
          <>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: 1 - pudarPeta }}>
              <line x1={PETA.x(0)} x2={PETA.x(5)} y1={PETA.y} y2={PETA.y} stroke={B.grayLite} strokeWidth={2.5} strokeDasharray="7 11" strokeLinecap="round" />
            </svg>
            {BAB.map((b, k) => {
              const tuju = { x: X.ikon, y: rowY(BARIS_BAB[k]), d: ID };
              const x = lerp(PETA.x(k), tuju.x, keBaris), y = lerp(PETA.y, tuju.y, keBaris), d = lerp(PETA.d, tuju.d, keBaris);
              return (
                <React.Fragment key={b.no}>
                  <SimpulBab x={x} y={y} d={d} col={b.warna} ikon={b.ikon} isi={1} op={k === 5 ? R(f, S12 + 40, S12 + 52, 0, 1, io) : 1} />
                  <div style={{ position: 'absolute', left: PETA.x(k) - 135, width: 270, top: PETA.y + PETA.d / 2 + 34, textAlign: 'center', lineHeight: 1.18, opacity: 1 - pudarPeta, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{b.nama}</div>
                </React.Fragment>);
            })}
          </>) : null}

        {/* ═════ TABEL ═════ */}
        {/* kerangka: kepala "Instrumen" + garis di bawah kepala ("perbedaannya jadi lebih jelas") */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {kerangka > 0.001 ? <line x1={T.x0} x2={lerp(T.x0, T.x1, kerangka)} y1={T.garis} y2={T.garis} stroke={B.night} strokeWidth={2.5} strokeLinecap="round" /> : null}
        </svg>
        <Kepala x={X.nama - 34} f={f} at={perbedaannya} teks="Instrumen" />
        <Kepala x={X.sumber - 70} f={f} at={cash - 20} teks="Sumber" />
        {KOLOM.map((k, j) => <Kepala key={k} x={X.kol[j]} f={f} at={T_KOL[j]} teks={k} />)}

        {BARIS.map((b, i) => {
          const pb = cin(f, bangun(i));
          if (pb <= 0.001) return null;
          const y = rowY(i);
          const warna = b.sorot === 'kuat' ? B.orange : b.sorot === 'muda' ? B.orangeLite : B.blue;
          const ps = pita(b.sumber);
          const bandSorot = b.sorot ? R(f, perbedaannya - 20, perbedaannya + 40, 0, 1, io) : 0; // baris saham disorot (acuan Simon)
          return (
            <React.Fragment key={b.nama}>
              {/* pita baris: sorot saham (tetap) · kategori sumber yang sedang disebut (sementara) */}
              {bandSorot > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, width: T.x1 - T.x0, height: T.h - 8, borderRadius: 14, background: rgba(B.orange, (b.sorot === 'kuat' ? 0.12 : 0.06) * bandSorot), transform: geser(T.x0, y - (T.h - 8) / 2) }} /> : null}
              {ps > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, width: T.x1 - T.x0, height: T.h - 8, borderRadius: 14, border: `2.5px solid ${rgba(WARNA_SUMBER[b.sumber], 0.7 * ps)}`, background: rgba(WARNA_SUMBER[b.sumber], 0.08 * ps), transform: geser(T.x0, y - (T.h - 8) / 2) }} /> : null}
              {/* ikon + nama (bab yang simpulnya meluncur ke sini: ikon baru tampil saat simpul tiba) */}
              <BulatKecil x={X.ikon} y={y} d={ID} col={BAB[b.bab].warna} ikon={b.ikon} s={BARIS_BAB[b.bab] === i ? (keBaris >= 1 ? 1 : 0) : popIn(f, bangun(i))} />
              <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(X.nama + (1 - pb) * -16, y - 17)}`, opacity: pb, whiteSpace: 'nowrap', lineHeight: 1, fontFamily: F, fontSize: 28, fontWeight: 800, color: b.sorot === 'kuat' ? mixHex(B.night, B.orange, bandSorot) : B.night }}>{b.nama}</div>
              {/* sumber return: cash flow (uang masuk) · perubahan harga (▲▼) · keduanya */}
              {b.sumber !== 'harga' ? <BulatKecil x={X.sumber - (b.sumber === 'dua' ? 26 : 0)} y={y} d={38} col={B.turq} ikon="pendapatan" s={popIn(f, (b.sumber === 'dua' ? T_SUMBER.dua : T_SUMBER.cash) + 4 * i)} /> : null}
              {b.sumber !== 'cash' ? <BulatKecil x={X.sumber + (b.sumber === 'dua' ? 26 : 0)} y={y} d={38} col={B.orange} ikon="naikTurunHarga" s={popIn(f, (b.sumber === 'dua' ? T_SUMBER.dua + 8 : T_SUMBER.harga) + 4 * i)} /> : null}
              {/* empat kolom: 3 segmen Rendah → Tinggi */}
              {b.v.map((v, j) => {
                const g = R(f, T_KOL[j] - 30 + 5 * i, T_KOL[j] + 30 + 5 * i, 0, 1, io);
                if (g <= 0.001) return null;
                return (
                  <React.Fragment key={j}>
                    <Segmen x={X.kol[j]} y={y} nilai={v * g} col={j === 0 ? warna : warnaTingkat(v)} op={Math.min(1, g * 3)} />
                    {b.cat?.[j] ? <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(X.kol[j] + 3 * SEG.w + 2 * SEG.gap + 12, y - (b.cat[j]!.length > 3 ? 22 : 12)), opacity: g, fontFamily: F, fontSize: b.cat[j]!.length > 3 ? 18 : 22, fontWeight: 700, color: B.gray, lineHeight: 1.1, whiteSpace: 'pre' }}>{b.cat[j] === '2016–2025' ? '2016–\n2025' : b.cat[j]}</div> : null}
                  </React.Fragment>);
              })}
            </React.Fragment>);
        })}

        {/* legenda + catatan kaki (* ** Properti — usulan teks, catatan Simon masih kosong) */}
        <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(T.x0, rowY(9) + 44), opacity: cin(f, seberapa3 + 40), fontFamily: F, fontSize: 18, fontWeight: 600, color: B.gray, whiteSpace: 'nowrap', lineHeight: 1.3 }}>
          * Properti: hanya kenaikan nilai, belum termasuk pendapatan sewa · ** harga properti jarang diperbarui, jadi naik-turunnya tak terlihat setiap hari
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(T.x1 - 380, rowY(9) + 40), width: 380, opacity: cin(f, seberapa1 + 40), display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16, fontFamily: F, fontSize: 20, fontWeight: 700, color: B.gray }}>
          {/* legenda tingkat (Kesulitan · Volatilitas · Risiko) */}
          {[['Rendah', ARAH.naik], ['Sedang', KUNING], ['Tinggi', ARAH.turun]].map(([t, c]) => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><svg width={SEG.w * 0.6} height={SEG.h}><rect width={SEG.w * 0.6} height={SEG.h} rx={SEG.h / 2} fill={c} /></svg>{t}</span>))}
        </div>

        {/* "Tidak ada satu instrumen yang unggul di semuanya" — tag piala dicoret merah */}
        <TagCoret f={f} x={960} y={rowY(9) + 98} at={tidak + 10} coretAt={semuanya} />
      </AbsoluteFill>
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.blue, opacity: R(f, BATAS.s13 + 22, BATAS.s13 + 48, 0, 1, io) }} /> : null}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s13 + 34, BATAS.s13 + 48, 0, 1, io) }}><Icon name="instrumenInvestasi" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);

  /** judul TEXT tiga bagian: "Beda aset," → "beda sumber return," → "beda karakter" (disorot) */
  function JudulBertahap({ f: ff }: { f: number }) {
    if (MODE_UKUR) return null;
    const st: React.CSSProperties = { fontFamily: F, fontSize: 44, fontWeight: 800, letterSpacing: '-.02em', color: B.night };
    const h = R(ff, unggul - 30, unggul + 30, 0, 1, io);
    const bagian = [{ t: 'Beda aset,', at: perbedaannya }, { t: 'beda sumber return,', at: cash + 10 }];
    const p3 = R(ff, ret - 30, ret + 30, 0, 1, io);
    const gs = geserSorot('beda karakter', 44);
    if (ff < perbedaannya - 40) return null;
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center' }}>
        {bagian.map((b) => (
          <span key={b.t} style={{ ...st, display: 'inline-block', whiteSpace: 'pre', transform: `translateX(${gs * (1 - h)}px)` }}>
            <WordText halus f={ff} at={b.at} style={st}>{b.t}</WordText>{' '}
          </span>))}
        <span style={{ ...st, display: 'inline-block', opacity: p3, transform: `translateY(${(1 - p3) * 20}px)` }}>
          <Sorot w="beda karakter" h={h} size={44} />
        </span>
      </div>);
  }
};

/** kepala kolom (muncul di kalimat kolomnya) */
const Kepala: React.FC<{ x: number; f: number; at: number; teks: string }> = ({ x, f, at, teks }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(x, T.kepala - 16), whiteSpace: 'nowrap', lineHeight: 1 }}>
    <WordText halus f={f} at={at} style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night }}>{teks}</WordText>
  </div>);

/** tiga segmen Rendah → Tinggi; `nilai` 0..3 (pecahan = sebagian segmen terisi) */
const Segmen: React.FC<{ x: number; y: number; nilai: number; col: string; op: number }> = ({ x, y, nilai, col, op }) => (
  <svg width={3 * SEG.w + 2 * SEG.gap} height={SEG.h} style={{ position: 'absolute', left: 0, top: 0, transform: geser(x, y - SEG.h / 2), opacity: op, overflow: 'visible' }}>
    <defs>{[0, 1, 2].map((k) => <clipPath key={k} id={`seg-${x}-${y}-${k}`}><rect x={k * (SEG.w + SEG.gap)} y={0} width={SEG.w} height={SEG.h} rx={SEG.h / 2} /></clipPath>)}</defs>
    {[0, 1, 2].map((k) => {
      const isi = Math.max(0, Math.min(1, nilai - k));
      return (
        <g key={k}>
          <rect x={k * (SEG.w + SEG.gap)} y={0} width={SEG.w} height={SEG.h} rx={SEG.h / 2} fill={B.blueWash} />
          {isi > 0.001 ? <rect x={k * (SEG.w + SEG.gap)} y={0} width={SEG.w * isi} height={SEG.h} fill={col} clipPath={`url(#seg-${x}-${y}-${k})`} /> : null}
        </g>);
    })}
  </svg>);

/** lingkaran ikon kecil */
const BulatKecil: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; s: number }> = ({ x, y, d, col, ikon, s }) => s <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${s})` }}>
    <Icon name={ikon} size={d * 0.6} color={B.white} />
  </div>);

/** tag "Unggul di semua hal" (piala) — pop lalu dicoret merah */
const TagCoret: React.FC<{ f: number; x: number; y: number; at: number; coretAt: number }> = ({ f, x, y, at, coretAt }) => {
  const p = popIn(f, at);
  if (p <= 0.001) return null;
  const coret = R(f, coretAt - 30, coretAt + 30, 0, 1, io);
  const col = mixHex(B.orange, CORET, coret);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '8px 26px 8px 8px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}88` }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name="trofi" size={28} color={B.white} /></div>
      Unggul di semua hal
      <div style={{ position: 'absolute', left: 18, top: '50%', height: 4, marginTop: -2, width: `calc(${coret} * (100% - 36px))`, background: CORET, borderRadius: 2 }} />
    </div>);
};

export const S12_BEAT = { semua, taruh, perbedaannya, cash, perubahan, keduanya, ret, seberapa1, seberapa2, seberapa3, tidak, unggul, semuanya };
