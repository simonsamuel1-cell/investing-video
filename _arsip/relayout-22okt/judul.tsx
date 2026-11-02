import React, { useContext } from 'react';
import { KonteksSkala } from '../skala';
import { B, F, R, io } from '../theme';
import { geserSorot, JARAK_JUDUL, MODE_UKUR, Sorot, tintaKata } from './kit';

const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

/* ═════════ judul (kolom TEXT naskah) — pola Judul Video 02 (Scene03), kotak sorot di kata ke-`sorotIdx`; 50 px (judul 2 pada 52 px menyentuh zona logo) ═════════ */
const JUDUL_PX = 50;
export const Judul: React.FC<{ f: number; kata: string[]; sorotIdx?: number; at: number; sorotAt?: number; keluar?: number; top?: number; size?: number; nomor?: string; warnaNomor?: string }> = ({ f, kata, sorotIdx = -1, at, sorotAt = 0, keluar, top = 64, size = JUDUL_PX, nomor, warnaNomor = B.blue }) => {
  const kSkala = useContext(KonteksSkala);
  if (MODE_UKUR) return null;
  const sweep = R(f, at - 30, at + 30, 0, 1); // linear — easing di tiap kata
  const out = keluar === undefined ? 0 : R(f, keluar - 30, keluar + 30, 0, 1, io);
  if (sweep <= 0 || out >= 1) return null;
  const h = sorotIdx >= 0 ? R(f, sorotAt - 30, sorotAt + 30, 0, 1, io) : 1; // tanpa kotak sorot: kata tidak digeser
  const st: React.CSSProperties = { fontFamily: F, fontSize: size, fontWeight: 800, letterSpacing: '-.02em', color: B.night };
  const n = kata.length;
  // kata SEBELUM kotak digeser kanan × (1 − h), kata SESUDAH kotak digeser kiri × (1 − h) → baris tetap di tengah sebelum kotak tampil
  const g = sorotIdx >= 0 ? geserSorot(kata[sorotIdx], size) : 0;
  // SPASI SATU NILAI (Simon 13 Okt): kata ditata tanpa karakter spasi; marginLeft tiap kata = JARAK_JUDUL dikurangi sisa span kata sebelumnya
  // (tepi kanan span → tinta) dan tepi kiri span kata ini (→ tinta). Kotak sorot: tepinya yang dihitung (padding 20 px sudah di dalam span-nya).
  const G = (JARAK_JUDUL * size) / 52;
  const jarak = (i: number) => {
    if (i === 0) return 0;
    const sisaSebelum = i - 1 === sorotIdx ? 0 : tintaKata(kata[i - 1], size).sisa;
    const kiriIni = i === sorotIdx ? 0 : tintaKata(kata[i], size).kiri;
    return G - sisaSebelum - kiriIni;
  };
  // adegan diperbesar (skala.ts) → judul dibalik skalanya supaya tetap di posisi & ukuran asli
  const isi = (
    <div style={{ position: 'absolute', left: 0, right: 0, top, textAlign: 'center', opacity: 1 - out, transform: geser(0, -24 * out) }}>
      <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
        {/* nomor bulat (TEXT naskah "① …"): lingkaran warna + angka putih, ikut sapuan sebagai kata pertama */}
        {nomor ? (() => {
          const p = io(Math.max(0, Math.min(1, sweep / 0.45)));
          const d = size * 0.92;
          return (
            <span style={{ display: 'inline-block', width: d, height: d, borderRadius: '50%', background: warnaNomor, color: B.white, fontFamily: F, fontSize: size * 0.6, fontWeight: 800,
              lineHeight: `${d}px`, textAlign: 'center', verticalAlign: 'top', marginRight: size * 0.28, marginTop: size * 0.16, opacity: p, transform: geser(0, (1 - p) * 22) }}>{nomor}</span>);
        })() : null}
        {kata.map((w, i) => {
          const p = io(Math.max(0, Math.min(1, (sweep - (i * 0.55) / Math.max(1, n - 1)) / 0.45)));
          const dx = i < sorotIdx ? g * (1 - h) : sorotIdx >= 0 && i > sorotIdx ? -g * (1 - h) : 0;
          return (
            <span key={`${w}-${i}`} style={{ ...st, display: 'inline-block', opacity: p, transform: geser(dx, (1 - p) * 22), whiteSpace: 'pre', position: 'relative',
              marginLeft: jarak(i) }}>
              {i === sorotIdx ? <Sorot w={w} h={h} size={size} /> : w}
            </span>);
        })}
      </span>
    </div>);
  return kSkala === 1 ? isi : <div style={{ position: 'absolute', inset: 0, transformOrigin: '960px 540px', transform: `scale(${1 / kSkala})` }}>{isi}</div>;
};

