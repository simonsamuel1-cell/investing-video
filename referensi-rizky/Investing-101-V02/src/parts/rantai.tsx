import React from 'react';
import type { KunciIkon } from '../ikon';
import { ARAH, B, F, GAP, LINE, R, io, mixHex } from '../theme';
import { Icon, lerp } from './kit';
import { KarakterLingkar, type PoseKarakter } from './karakter';
import { FotoLingkar, type KunciGedung } from './gedung';

/**
 * PERANGKAT RANTAI & DIAGRAM — dipakai Scene 04 (rantai sebab-akibat), 05 (properti), 06 (obligasi).
 * Dipindah dari s04/Scene04.tsx (7 Okt) tanpa mengubah keluaran (terukur: still Scene 04 identik).
 */
/** ujung penghubung di TEPI lingkaran tujuan, searah datangnya — kepala panah yang bertemu tidak saling menumpuk */
export const keTepi = (x1: number, y1: number, c: { x: number; y: number; d: number }) => {
  // sudut datang dibatasi ±38° dari horizontal: panah curam (Dolar AS → Investor di B3) masuk dari SISI KIRI, tidak menyerempet label
  const MAKS = (38 * Math.PI) / 180, r = c.d / 2 + GAP;
  const t = Math.max(-MAKS, Math.min(MAKS, Math.atan2(c.y - y1, c.x - x1)));
  return { x1, y1, x2: c.x - Math.cos(t) * r, y2: c.y - Math.sin(t) * r };
};

/** denyut 40f di kata pemicu */
/** DENYUT DIMATIKAN di seluruh video (Simon 8 Okt, feedback keseluruhan: "masih ada animasi yang kaku dan tidak diperlukan") — tanda tangan
 *  dipertahankan supaya pemanggil tetap utuh; sorot yang bermakna memakai opasitas/pop di kata, bukan denyut. */
export const denyut = (_f: number, _at: number) => 0;

/** titik penanda di garis (cincin putih) */
export const Titik: React.FC<{ x: number; y: number; p: number; col: string }> = ({ x, y, p, col }) => p <= 0.001 ? null : (
  <circle cx={x} cy={y} r={10 * p} fill={col} stroke={B.white} strokeWidth={3.5 * Math.min(1, p)} />);

/** lingkaran ikon + label (kanan atau bawah) + lencana kecil */
export const Tile: React.FC<{ x: number; y: number; dsz: number; ikon: KunciIkon; col: string; p: number; op?: number; denyut?: number;
  label: React.ReactNode; labelKanan?: boolean; labelLebar?: number; badge?: React.ReactNode;
  /** gambar orang di lingkaran (gaya Scene 1) menggantikan cakram + ikon — Simon 12 Okt "ganti icon investor, dengan gambar orang berkemeja biru" */
  karakter?: { pose: PoseKarakter; warna: string };
  /** foto benda di lingkaran (gaya rumah S05) menggantikan cakram + ikon — Simon 12 Okt "ganti icon bank dengan gambar ini" */
  foto?: { k: KunciGedung; warna: string } }> =
  ({ x, y, dsz, ikon, col, p, op = 1, denyut: dn = 0, label, labelKanan, labelLebar = 300, badge, karakter, foto }) => {
    if (p <= 0.001) return null;
    return (
      <div style={{ position: 'absolute', inset: 0, opacity: op }}>
        {karakter ? <KarakterLingkar pose={karakter.pose} x={x} y={y} D={dsz} s={p + dn} warna={karakter.warna} /> : foto ? <FotoLingkar k={foto.k} x={x} cy={y} D={dsz} s={p + dn} warna={foto.warna} /> : (
        <div style={{ position: 'absolute', left: x - dsz / 2, top: y - dsz / 2, width: dsz, height: dsz, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', transform: `scale(${p + dn})`, boxShadow: `0 14px 30px -12px ${col}aa` }}>
          <Icon name={ikon} size={dsz * 0.58} color={B.white} />
        </div>)}
        {labelKanan
          ? <div style={{ position: 'absolute', left: x + dsz / 2 + 16, top: y, transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}>{label}</div>
          : <div style={{ position: 'absolute', left: x - labelLebar / 2, width: labelLebar, top: y + dsz / 2 + 16, textAlign: 'center' }}>{label}</div>}
        {badge}
      </div>);
  };

/** lencana panah ▲/▼: ▲ HIJAU, ▼ MERAH (Simon 7 Okt); `flip` membalik arah — warnanya ikut berganti di tengah putaran */
export const PanahBadge: React.FC<{ x: number; y: number; d: number; naik?: boolean; p: number; flip: number; op?: number }> = ({ x, y, d, naik = false, p, flip, op = 1 }) => {
  if (p <= 0.001) return null;
  const awal = naik ? ARAH.naik : ARAH.turun, akhir = naik ? ARAH.turun : ARAH.naik;
  const col = mixHex(awal, akhir, R(flip, 0.35, 0.65, 0, 1));
  const sudut = (naik ? 0 : 180) + 180 * flip;
  return (
    <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: B.white, border: `3px solid ${col}`, display: 'grid', placeItems: 'center', transform: `scale(${p})`, opacity: op, boxShadow: `0 6px 14px -6px ${col}aa` }}>
      <svg width={d * 0.5} height={d * 0.5} viewBox="0 0 20 20" style={{ transform: `rotate(${sudut}deg)` }}><path d="M10 2 L18 16 L2 16 Z" fill={col} /></svg>
    </div>);
};

/** perisai kecil di lingkaran investor ("lebih berhati-hati") */
export const Perisai: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - 24, top: y - 24, width: 48, height: 48, borderRadius: '50%', background: B.white, border: `3px solid ${B.turq}`, display: 'grid', placeItems: 'center', transform: `scale(${p})`, boxShadow: `0 6px 14px -6px ${B.turq}aa` }}>
    <Icon name="lindungiAset" size={28} color={B.turq} />
  </div>);

/** penghubung rantai: garis + kepala panah, tumbuh `g`; warna brand tetap (alur sebab-akibat, bukan arah harga) */
export const Konektor: React.FC<{ x1: number; y1: number; x2: number; y2: number; g: number; flip?: number; op?: number; col?: string; putus?: boolean }> = ({ x1, y1, x2, y2, g, op = 1, col = B.turq, putus = false }) => {
  if (g <= 0.001) return null;
  const ex = lerp(x1, x2, g), ey = lerp(y1, y2, g);
  // kepala panah TUMBUH bersama garis (pindai DOM 16 Okt: dulu muncul utuh 14 px di frame pertama) — penuh di 15 % pertama pertumbuhan
  const a = Math.atan2(y2 - y1, x2 - x1), h = 14 * io(Math.min(1, g / 0.15));
  return (
    <g opacity={op}>
      <line x1={x1} y1={y1} x2={ex - Math.cos(a) * h * 0.6} y2={ey - Math.sin(a) * h * 0.6} stroke={col} strokeWidth={LINE.w + 0.5} strokeLinecap="round" strokeDasharray={putus ? LINE.dash : undefined} />
      <path d={`M${ex} ${ey} L${ex - h * Math.cos(a) + h * 0.6 * Math.sin(a)} ${ey - h * Math.sin(a) - h * 0.6 * Math.cos(a)} L${ex - h * Math.cos(a) - h * 0.6 * Math.sin(a)} ${ey - h * Math.sin(a) + h * 0.6 * Math.cos(a)} Z`} fill={col} />
    </g>);
};

/** pil anotasi naik (hijau ▲) / turun (merah ▼) */
export const Pil: React.FC<{ x: number; y: number; p: number; teks: string; col: string; naik: boolean }> = ({ x, y, p, teks, col, naik }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 10, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '11px 24px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}aa` }}>
    <svg width={22} height={18} viewBox="0 0 22 18"><path d={naik ? 'M11 1 L21 17 L1 17 Z' : 'M11 17 L21 1 L1 1 Z'} fill={col} /></svg>
    {teks}
  </div>);
export const PilNaik: React.FC<{ x: number; y: number; p: number; teks: string }> = (q) => <Pil {...q} col={ARAH.naik} naik />;
export const PilTurun: React.FC<{ x: number; y: number; p: number; teks: string }> = (q) => <Pil {...q} col={ARAH.turun} naik={false} />;


/**
 * SIMPUL BAB — struktur sama dengan simpul peta bab Scene 01 (kotak 170 + transform scale), cakram warna bab + ikon putih.
 * `isi` = pop cakram, `op` = opasitas (serah-terima antar-bab disilang-pudar di tempat).
 */
export const SimpulBab: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; isi: number; op?: number; ikonOp?: number }> = ({ x, y, d, col, ikon, isi, op = 1, ikonOp = 1 }) =>
  isi <= 0.001 || op <= 0.001 ? null : (
    // posisi lewat translate3d + rotasi mikro (cek 12 Okt: `left/top` pecahan → simpul yang meluncur pelan meloncat 1 px, S08 f342)
    <div style={{ position: 'absolute', left: 0, top: 0, width: 170, height: 170, transform: `translate3d(${x - 85}px, ${y - 85}px, 0) scale(${d / 170}) rotate(0.001deg)`, opacity: op }}>
      {/* isi penuh = 0,99996 (sama dengan akhir pop `parts/pop`): simpul peta yang meluncur dan simpul tetap yang menggantikannya
          memakai jalur raster yang sama → tanpa lonjakan satu-frame saat bertukar (terukur 9 Okt) */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', transform: `scale(${isi >= 0.9999 ? 0.99996 : isi})`, boxShadow: `0 18px 40px -12px ${col}aa` }}>
        {ikonOp > 0.001 ? <div style={{ opacity: ikonOp < 1 ? ikonOp : undefined, display: 'grid' }}><Icon name={ikon} size={96} color={B.white} /></div> : null}
      </div>
    </div>);

/** pil kepala kolom (ikon dalam lingkaran + teks) */
export const PilKepala: React.FC<{ x: number; y: number; p: number; teks: string; ikon: KunciIkon; col: string; op?: number }> = ({ x, y, p, teks, ikon, col, op = 1 }) =>
  p <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${p})`, opacity: op, display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '8px 24px 8px 8px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}aa` }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name={ikon} size={30} color={B.white} /></div>
      {teks}
    </div>);
