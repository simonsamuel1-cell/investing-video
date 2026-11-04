import React, { useContext } from 'react';
import { KonteksSkala } from '../skala';
import { B, F, R, io } from '../theme';
import { geserSorot, JARAK_JUDUL, KataTopeng, kataP, MODE_UKUR, skalaPop, Sorot, tintaKata } from './kit';

/* ═════════ judul (kolom TEXT naskah) — pola Judul Video 02 (Scene03), kotak sorot di kata ke-`sorotIdx`; 50 px (judul 2 pada 52 px menyentuh zona logo) ═════════ */
const JUDUL_PX = 50;
export const Judul: React.FC<{ f: number; kata: string[]; sorotIdx?: number; at: number; sorotAt?: number; keluar?: number; top?: number; size?: number; nomor?: string; warnaNomor?: string }> = ({ f, kata, sorotIdx = -1, at, sorotAt = 0, keluar, top = 64, size = JUDUL_PX, nomor, warnaNomor = B.blue }) => {
  const kSkala = useContext(KonteksSkala);
  if (MODE_UKUR) return null;
  const sweep = R(f, at - 30, at + 30, 0, 1, (t) => t); // linear — nomor: pop easeOutBack
  const n = kata.length;
  // KELUAR (22 Okt): tiap kata naik keluar topengnya (60f, berurutan) — dulu pudar + naik 24 px
  const outKata = (i: number) => (keluar === undefined ? 0 : kataP(f, keluar, i, n));
  if (f < at - 60 || (keluar !== undefined && outKata(n - 1) >= 1)) return null; // kata pertama frasa panjang mulai sebelum at − 30 (kataP)
  const h = sorotIdx >= 0 ? R(f, sorotAt - 30, sorotAt + 30, 0, 1, io) : 1; // tanpa kotak sorot: kata tidak digeser
  const st: React.CSSProperties = { fontFamily: F, fontSize: size, fontWeight: 800, letterSpacing: '-.02em', color: B.night };
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
    <div style={{ position: 'absolute', left: 0, right: 0, top, textAlign: 'center' }}>
      <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
        {/* nomor bulat (TEXT naskah "① …"): lingkaran = POP 0→100 easeOutBack (aturan 22 Okt), keluar = kebalikannya */}
        {nomor ? (() => {
          const p = Math.max(0, Math.min(1, sweep / 0.45)) * (1 - (keluar === undefined ? 0 : R(f, keluar - 30, keluar + 30, 0, 1, (t) => t)));
          const d = size * 0.92;
          return (
            <span style={{ display: 'inline-block', width: d, height: d, borderRadius: '50%', background: warnaNomor, color: B.white, fontFamily: F, fontSize: size * 0.6, fontWeight: 800,
              lineHeight: `${d}px`, textAlign: 'center', verticalAlign: 'top', marginRight: size * 0.28, marginTop: size * 0.16, transform: `scale(${skalaPop(p)})` }}>{nomor}</span>);
        })() : null}
        {kata.map((w, i) => {
          const p = kataP(f, at, i, n); // 60f easeInOut per kata (seragam dengan WordText)
          const dx = i < sorotIdx ? g * (1 - h) : sorotIdx >= 0 && i > sorotIdx ? -g * (1 - h) : 0;
          return (
            <KataTopeng key={`${w}-${i}`} masuk={p} keluar={outKata(i)} size={size} dx={dx} style={{ ...st, position: 'relative', marginLeft: jarak(i) - size * 0.12 }}>
              {i === sorotIdx ? <Sorot w={w} h={h} size={size} /> : w}
            </KataTopeng>);
        })}
      </span>
    </div>);
  return kSkala === 1 ? isi : <div style={{ position: 'absolute', inset: 0, transformOrigin: '960px 540px', transform: `scale(${1 / kSkala})` }}>{isi}</div>;
};

