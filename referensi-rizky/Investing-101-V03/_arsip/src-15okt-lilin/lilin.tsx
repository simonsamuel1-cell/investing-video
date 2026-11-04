import React from 'react';
import { ARAH, B, F, io, lerp, mixHex, rgba } from '../theme';
import { Icon } from './kit';
import type { KunciIkon } from '../ikon';
import { bayanganKaca, geser } from './kaca';
import type { Baris } from '../data/pasar';

/**
 * CANDLESTICK NYATA (Simon 14 Okt: "untuk menggambarkan volatilitas … gunakan candlestick saja, tapi buat candlesticknya sangat realistis sesuai
 * dengan pergerakan pasar dan menyesuaikan dengan kebutuhan scriptnya"). Data = OHLC asli IHSG / LQ45 (`data/pasar.ts`), dinormalkan ke open
 * candle pertama (1 = modal). Aturan kehalusan (reference_smooth_chart_scroll): domain harga TETAP sepanjang adegan (tidak pernah dihitung ulang
 * dari candle yang sudah tampak), sumbu waktu TETAP (tidak bergulir) — candle muncul satu per satu dan tumbuh dari open ke close (inOut cubic),
 * angka & titik harga mengikuti jalur close yang sama (kontinu, tanpa loncatan).
 */

export type Lilin = { o: number; h: number; l: number; c: number };
/** baris OHLC asli → relatif terhadap open candle pertama */
export const relatif = (rows: Baris[]): Lilin[] => {
  // Simon 14 Okt "candlestick lebih realistis": baris Yahoo tanpa transaksi (o = h = l = c, mis. 28 & 30 Jan 2020) tergambar sebagai garis datar —
  // bukan candle sungguhan → dibuang
  const asli = rows.filter(([, o, h, l, c]) => !(o === h && h === l && l === c));
  const b = asli[0][1];
  return asli.map(([, o, h, l, c]) => ({ o: o / b, h: h / b, l: l / b, c: c / b }));
};
/** rentang harga tetap untuk seluruh data (+ nilai yang wajib masuk, mis. garis modal 1) dengan bantalan */
export const rentang = (d: Lilin[], pad = 0.06, ikut: number[] = [1]): [number, number] => {
  let lo = Math.min(...d.map((x) => x.l), ...ikut), hi = Math.max(...d.map((x) => x.h), ...ikut);
  const p = (hi - lo) * pad;
  lo -= p; hi += p;
  return [lo, hi];
};

/**
 * LAJU GAMBAR candle: masuk & keluar halus (percepatan rata di 25 % awal, perlambatan rata di 25 % akhir), laju tetap di tengah.
 * inOut cubic murni untuk puluhan candle membuat candle di tengah muncul 3× lebih cepat (terlihat meloncat) — di sini puncak lajunya 1,33×.
 */
export const laju = (f: number, a: number, b: number, k = 0.25) => {
  const t = Math.max(0, Math.min(1, (f - a) / (b - a)));
  const v = 1 / (1 - k);
  if (t < k) return (v * t * t) / (2 * k);
  if (t > 1 - k) return 1 - (v * (1 - t) * (1 - t)) / (2 * k);
  return v * (k / 2 + (t - k));
};

/** lama tumbuh satu candle, dalam satuan "slot candle" (candle berikutnya mulai sebelum yang ini selesai → aliran rata) */
const TUMBUH = 2.5;
/** kemajuan pecahan: g 0…1 → p 0…(N − 1 + TUMBUH) (di g = 1 candle terakhir sudah utuh) */
const kemajuan = (n: number, g: number) => Math.max(0, Math.min(1, g)) * (n - 1 + TUMBUH);
/** posisi harga berjalan q (0…N): titik ke-k = close candle k−1 (k = 0 → open candle pertama) */
export const posisiQ = (n: number, g: number) => Math.max(0, Math.min(n, kemajuan(n, g) - TUMBUH + 1));
const hargaQ = (d: Lilin[], q: number) => {
  const k = Math.floor(q), s = q - k;
  const P = (i: number) => (i <= 0 ? d[0].o : d[Math.min(d.length, i) - 1].c);
  return lerp(P(k), P(k + 1), s);
};
/** nilai relatif berjalan (1 = modal) pada kemajuan g — dipakai angka Rp & titik harga */
export const nilaiLilin = (d: Lilin[], g: number) => hargaQ(d, posisiQ(d.length, g));
/** g saat candle ke-i (indeks data) selesai tumbuh — untuk menyelaraskan kejadian (JUAL, kalender) ke candle tertentu */
export const gCandle = (n: number, i: number) => (i + TUMBUH) / (n - 1 + TUMBUH);

/**
 * grafik candlestick di kotak w × h (koordinat lokal, kiri-atas = 0,0). `g` = kemajuan 0…1. `modal` = garis putus-putus nilai awal.
 * `titik` = titik harga berjalan (bercahaya, ref-16). `sumbu` = label waktu di bawah (muncul bersama candle-nya).
 */
export const GrafikLilin: React.FC<{ d: Lilin[]; w: number; h: number; g: number; dom?: [number, number]; modal?: boolean; titik?: boolean; grid?: boolean;
  sumbu?: { i: number; teks: string }[]; sumbuPx?: number; tanda?: { i: number; teks: string }[] }> =
  ({ d, w, h, g, dom, modal = true, titik = true, grid = true, sumbu, sumbuPx = 22, tanda }) => {
    const n = d.length;
    const [lo, hi] = dom ?? rentang(d);
    const y = (v: number) => h * (1 - (v - lo) / (hi - lo));
    const slot = w / n;
    // proporsi chart trading (Simon 14 Okt "lebih realistis secara bentuk"): badan 72 % slot, sumbu tipis, sudut nyaris tajam
    const bw = Math.max(1.4, slot * 0.72);
    const sw = Math.max(1, Math.min(2.2, slot * 0.14));
    const p = kemajuan(n, g);
    const q = posisiQ(n, g);
    const harga = hargaQ(d, q);
    const arahH = Math.max(-1, Math.min(1, (harga - 1) * 12));
    const colH = arahH >= 0 ? mixHex(B.gray, ARAH.naik, arahH) : mixHex(B.gray, ARAH.turun, -arahH);
    return (
      <svg width={w} height={h + (sumbu ? sumbuPx + 20 : 0)} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {grid ? [0.25, 0.5, 0.75].map((t) => <line key={t} x1={0} x2={w} y1={h * t} y2={h * t} stroke={rgba(B.night, 0.06)} strokeWidth={1.5} />) : null}
        {modal ? <line x1={0} x2={w} y1={y(1)} y2={y(1)} stroke={rgba(B.night, 0.28)} strokeWidth={2} strokeDasharray="6 9" strokeLinecap="round" /> : null}
        {d.map((c, i) => {
          const u = p - i;
          if (u <= 0) return null;
          const e = io(Math.min(1, u / TUMBUH));
          const naik = c.c >= c.o;
          const col = naik ? ARAH.naik : ARAH.turun;
          const cT = c.o + (c.c - c.o) * e, hT = c.o + (c.h - c.o) * e, lT = c.o + (c.l - c.o) * e;
          const x = (i + 0.5) * slot;
          const yb = Math.min(y(c.o), y(cT)), hb = Math.max(1.6, Math.abs(y(c.o) - y(cT)));
          return (
            <g key={i} opacity={Math.min(0.9999, u / 0.8)}>
              <line x1={x} x2={x} y1={y(hT)} y2={y(lT)} stroke={col} strokeWidth={sw} strokeLinecap="butt" />
              <rect x={x - bw / 2} y={yb} width={bw} height={hb} rx={Math.min(1, bw / 5)} fill={col} />
            </g>);
        })}
        {titik && p > 0.001 ? (
          <g>
            <circle cx={q * slot} cy={y(harga)} r={14} fill={rgba(colH, 0.18)} />
            <circle cx={q * slot} cy={y(harga)} r={6.5} fill={B.white} stroke={colH} strokeWidth={3.5} />
          </g>) : null}
        {/* tanda penurunan (puncak → lembah) di bawah candle lembahnya, muncul sesudah candle itu utuh */}
        {tanda ? tanda.map((t) => {
          const u = (p - t.i - TUMBUH + 0.5) / 3;
          if (u <= 0) return null;
          const k = io(Math.min(1, u));
          const tx = (t.i + 0.5) * slot, ty = Math.min(h - 18, y(d[t.i].l) + 30);
          return (
            <g key={t.i} opacity={Math.min(0.9999, k)} transform={`translate(${tx} ${ty + 8 * (1 - k)})`}>
              {/* pil 92 px (dulu 76: teks "−38%" hanya 8–10 px dari tepi pil — audit 14 Okt) */}
              <rect x={-46} y={-17} width={92} height={34} rx={17} fill={B.white} stroke={ARAH.turun} strokeWidth={2.5} />
              <text x={0} y={7} textAnchor="middle" fontFamily={F} fontSize={20} fontWeight={800} fill={ARAH.turun}>{t.teks}</text>
            </g>);
        }) : null}
        {sumbu ? sumbu.map((s) => {
          const u = p - s.i;
          if (u <= 0) return null;
          // label sumbu pertama rata kiri di tepi grafik (audit 14 Okt: "2015" berpusat di candle pertama hanya 10 px dari tepi kartu)
          const awal = s.i === 0;
          return <text key={s.i} x={awal ? 0 : (s.i + 0.5) * slot} y={h + sumbuPx + 12} textAnchor={awal ? 'start' : 'middle'} fontFamily={F} fontSize={sumbuPx} fontWeight={700} fill={B.gray}
            opacity={Math.min(0.9999, u / 2)}>{s.teks}</text>;
        }) : null}
      </svg>);
  };

/** nilai relatif berjalan untuk deret garis (produk tanpa candle, mis. deposito): titik ke-k diinterpolasi lurus */
export const nilaiGaris = (v: number[], g: number) => {
  const q = Math.max(0, Math.min(1, g)) * (v.length - 1), k = Math.min(v.length - 2, Math.floor(q));
  return lerp(v[k], v[k + 1], q - k);
};
/** garis tenang (deposito / nilai tetap) di kotak w × h — tergambar mengikuti g dengan domain tetap yang SAMA dengan grafik pembandingnya */
export const GrafikGaris: React.FC<{ v: number[]; w: number; h: number; g: number; dom: [number, number]; warna: string; modal?: boolean; grid?: boolean }> =
  ({ v, w, h, g, dom, warna, modal = true, grid = true }) => {
    const [lo, hi] = dom;
    const y = (u: number) => h * (1 - (u - lo) / (hi - lo));
    const q = Math.max(0, Math.min(1, g)) * (v.length - 1);
    const pts: string[] = [];
    for (let k = 0; k <= Math.floor(q); k++) pts.push(`${((k / (v.length - 1)) * w).toFixed(1)},${y(v[k]).toFixed(1)}`);
    const xe = (q / (v.length - 1)) * w, ye = y(nilaiGaris(v, g));
    pts.push(`${xe.toFixed(1)},${ye.toFixed(1)}`);
    return (
      <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {grid ? [0.25, 0.5, 0.75].map((t) => <line key={t} x1={0} x2={w} y1={h * t} y2={h * t} stroke={rgba(B.night, 0.06)} strokeWidth={1.5} />) : null}
        {modal ? <line x1={0} x2={w} y1={y(1)} y2={y(1)} stroke={rgba(B.night, 0.28)} strokeWidth={2} strokeDasharray="6 9" strokeLinecap="round" /> : null}
        {g > 0.001 ? (
          <>
            <polyline points={pts.join(' ')} fill="none" stroke={warna} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={xe} cy={ye} r={14} fill={rgba(warna, 0.18)} />
            <circle cx={xe} cy={ye} r={6.5} fill={B.white} stroke={warna} strokeWidth={3.5} />
          </>) : null}
      </svg>);
  };

/** Rp dalam juta, SELALU satu desimal (Rp66,7 jt · Rp100,0 jt). Pindai 14 Okt: membuang ",0" saat nilai berjalan melewati angka bulat = lebar teks
 *  berubah 1 frame → pil persen di sampingnya meloncat ±60 px (jeglek). */
export const jtKoma = (v: number) => `Rp${(Math.round(v / 1e5) / 10).toFixed(1).replace('.', ',')} jt`;

/**
 * KARTU NILAI + CANDLESTICK (gaya ref-16 "Total Value": label abu, angka besar, pil persen, grafik di bawah). Berpusat (x, y), w × h.
 * Angka Rp = modal × nilai berjalan grafik (dihitung dari keadaan yang sama — tidak pernah lepas dari candle-nya).
 */
export const KartuLilin: React.FC<{ x: number; y: number; p: number; s?: number; w?: number; h?: number; d: Lilin[]; g: number; dom?: [number, number];
  modal: number; ikon: KunciIkon; nama: string; warna: string; label?: string; labelB?: string; labelMix?: number; periode?: string;
  sumbu?: { i: number; teks: string }[]; tanda?: { i: number; teks: string }[]; jual?: number; tekan?: number; nilaiTetap?: number; children?: React.ReactNode; format?: (v: number) => string;
  /** produk tanpa candle (deposito): deret nilai relatif → garis tenang, domain `dom` wajib sama dengan kartu pembandingnya */
  garis?: number[]; alfa?: number;
  /** kartu sempit/pendek: ukuran angka, perataan isi, tepi atas grafik, pil persen di baris label (kanan) */
  besar?: number; rata?: 'kiri' | 'tengah'; grafikAtas?: number; pilKanan?: boolean }> =
  ({ x, y, p, s = 1, w = 560, h = 470, d, g, dom, modal, ikon, nama, warna, label = 'Nilai investasi', labelB, labelMix = 0, periode, sumbu, tanda, jual = 0, tekan = 0,
    nilaiTetap, children, format = jtKoma, garis, alfa = 1, besar = 62, rata = 'kiri', grafikAtas = 236, pilKanan = false }) => {
    if (p <= 0.001 || alfa <= 0.001) return null;
    const rel = nilaiTetap ?? (garis ? nilaiGaris(garis, g) : nilaiLilin(d, g));
    const nilai = modal * rel;
    const dd = rel - 1;
    const arah = Math.max(-1, Math.min(1, dd * 12));
    const col = arah >= 0 ? mixHex(B.night, ARAH.naik, arah) : mixHex(B.night, ARAH.turun, -arah);
    const pilA = Math.max(0.0001, Math.min(0.9999, (Math.abs(arah) - 0.02) / 0.12));
    const gx = 30, gy = grafikAtas, gw = w - 60, gh = h - gy - (sumbu ? 64 : 30);
    // kotak angka selebar angka TERPANJANG yang mungkin muncul (digit tabular) → pil persen di sampingnya tidak bergeser saat jumlah digit berubah (99 → 100)
    const relMaks = nilaiTetap ?? (garis ? Math.max(...garis) : Math.max(...d.map((c) => c.h)));
    const lebarAngka = besar * (2.9 + 0.64 * (String(Math.floor((modal * relMaks) / 1e6)).length + 1));
    const tengah = rata === 'tengah';
    const pil = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, background: rgba(col, 0.12), fontSize: 26, fontWeight: 800,
        color: col, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', opacity: pilA }}>
        <svg width={20} height={16} viewBox="0 0 22 18"><path d={dd >= 0 ? 'M11 1 L21 17 L1 17 Z' : 'M11 17 L21 1 L1 1 Z'} fill={col} /></svg>
        {`${Math.round(Math.abs(dd) * 100) === 0 ? '' : dd >= 0 ? '+' : '−'}${Math.abs(Math.round(dd * 100))}%`}
      </div>);
    const labelGaya: React.CSSProperties = { position: 'absolute', left: 30, right: tengah ? 30 : undefined, top: 118, textAlign: tengah ? 'center' : 'left', fontSize: 22,
      fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' };
    const hTot = h + (jual > 0.001 ? 100 * Math.min(1, jual) : 0);
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: hTot, transformOrigin: `${w / 2}px ${h / 2}px`, transform: `${geser(x - w / 2, y - h / 2)} scale(${p * s})`,
        borderRadius: 32, background: `linear-gradient(165deg, ${rgba(B.white, 0.98)}, ${rgba(B.white, 0.9)})`, boxShadow: bayanganKaca(warna), fontFamily: F,
        opacity: alfa < 1 ? alfa : undefined }}>
        {/* kepala: ikon + nama · periode (kanan) */}
        <div style={{ position: 'absolute', left: 28, right: 28, top: 24, height: 58, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 58, height: 58, borderRadius: 17, background: warna, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={ikon} size={36} color={B.white} /></div>
          <div style={{ fontSize: 28, fontWeight: 800, color: B.night, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{nama}</div>
          {periode ? <div style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>{periode}</div> : null}
        </div>
        <div style={{ position: 'absolute', left: 28, right: 28, top: 100, height: 2, background: rgba(B.night, 0.07) }} />
        {/* label (silang-pudar ke labelB) */}
        <div style={{ ...labelGaya, opacity: labelB ? Math.max(0.0001, 1 - 2 * labelMix) : undefined }}>{label}</div>
        {labelB && labelMix > 0.5 ? <div style={{ ...labelGaya, opacity: Math.min(0.9999, 2 * labelMix - 1) }}>{labelB}</div> : null}
        {pilKanan ? <div style={{ position: 'absolute', right: 28, top: 106 }}>{pil}</div> : null}
        {/* angka besar (+ pil persen di sampingnya) */}
        <div style={{ position: 'absolute', left: 28, right: tengah ? 28 : undefined, top: 150, display: 'flex', alignItems: 'center', justifyContent: tengah ? 'center' : 'flex-start', gap: 16 }}>
          <div style={{ fontSize: besar, fontWeight: 800, color: col, fontVariantNumeric: 'tabular-nums', lineHeight: 1, whiteSpace: 'nowrap',
            minWidth: pilKanan ? undefined : lebarAngka, textAlign: tengah ? 'center' : 'left' }}>{format(nilai)}</div>
          {pilKanan ? null : pil}
        </div>
        {/* grafik */}
        <div style={{ position: 'absolute', left: gx, top: gy, width: gw, height: gh }}>
          {garis ? <GrafikGaris v={garis} w={gw} h={gh} g={g} dom={dom ?? [0.8, 1.2]} warna={warna} />
            : <GrafikLilin d={d} w={gw} h={gh} g={g} dom={dom} sumbu={sumbu} tanda={tanda} />}
        </div>
        {jual > 0.001 ? (
          <div style={{ position: 'absolute', left: 30, right: 30, top: h - 6, height: 78, borderRadius: 22, background: mixHex(ARAH.turun, B.night, 0.25 * tekan),
            display: 'grid', placeItems: 'center', fontSize: 32, fontWeight: 800, color: B.white, letterSpacing: '.08em', opacity: Math.min(0.9999, jual),
            transform: `scale(${(0.9 + 0.1 * Math.min(1, jual)) * (1 - 0.06 * Math.sin(Math.PI * Math.min(1, tekan)))})`, boxShadow: `0 14px 26px -12px ${ARAH.turun}` }}>JUAL</div>) : null}
        {children}
      </div>);
  };
