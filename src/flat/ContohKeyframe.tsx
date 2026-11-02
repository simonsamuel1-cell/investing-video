import React from 'react';
import { AbsoluteFill } from 'remotion';
import { B, F } from '../theme';
import { JALAN, JALAN_FRAME, LARI, TEGAK_LURUS, TokohTegak, alasTerendah, gaya, geserY, panjangSiklus, titikKaki, type Pose } from './rigTegak';

/**
 * CONTOH KEYFRAME JALAN & LARI (26 Okt, Simon: "aku ingin kamu memberikan contoh keyframe untuk membuat gerakan jalan dan lari dari salah satu
 * char") — tokoh gua utama. 26 Okt malam: pindah ke rig TEGAK (pose dasar berdiri tegak di guide, tips Simon) → angka di lembar = nilai
 * Rotation tiap lapis langsung (0° = pose dasar). Tiap baris = 8 kunci satu siklus (2 langkah) = JALAN/LARI di rigTegak.tsx persis.
 * Kunci ditulis untuk kaki DEKAT (kiri layar, ditandai titik oranye); kaki jauh = kurva yang sama digeser ½ siklus.
 * Frame = laju adegan S01 (jalan 4,6 px/f, lari 8,4 px/f pada skala 0,82).
 */
export const CONTOH_KF = { w: 1920, h: 1420 };
const S_ADEGAN = 0.82;
const SKALA = 0.44;
const KOLOM = 150, LEBAR = (1880 - KOLOM) / 8;
const NAMA_JALAN = ['Kontak', 'Turun (recoil)', 'Lewat (passing)', 'Naik (high point)', 'Lepas ujung', 'Angkat', 'Lewat (ayun)', 'Menjangkau'];
const NAMA_LARI = ['Kontak', 'Redam', 'Lepas (dorong)', 'Melayang (puncak)', 'Tumit menendang', 'Lewat (ayun)', 'Lutut ke depan', 'Menjangkau'];
const deg = (v: number) => `${v > 0.05 ? '' : v < -0.05 ? '−' : ''}${Math.abs(v).toFixed(0)}°`;
const px = (v: number) => `${v > 0.5 ? '+' : v < -0.5 ? '−' : ''}${Math.abs(v).toFixed(0)}`;

const Baris: React.FC<{ y0: number; judul: string; r: 0 | 1; N: number; kunci: number[]; nama: string[]; warna: string }> = ({ y0, judul, r, N, kunci, nama, warna }) => {
  const tanah = y0 + 330;
  const pose: Pose[] = kunci.map((u) => gaya(u, r, 1));
  const cx = (k: number) => KOLOM + LEBAR * (k + 0.5);
  const pinggul = pose.map((p, k) => [cx(k), tanah - (alasTerendah(p) + (p.angkat ?? 0)) * SKALA] as const);
  const yBerdiri = tanah - alasTerendah(TEGAK_LURUS) * SKALA;
  const baris: [string, (p: Pose, i: 0 | 1) => string][] = [
    ['Paha', (p, i) => deg(p.badan + p.paha[i])],
    ['Betis', (p, i) => deg(p.lutut[i])],
    ['Telapak', (p, i) => deg(p.telapak[i])],
    ['Lgn. atas', (p, i) => deg(p.bahu[i])],
    ['Lgn. bawah', (p, i) => deg(p.siku[i])],
    ['Tangan', (p, i) => deg(p.tangan[i])],
  ];
  return (
    <>
      <div style={{ position: 'absolute', left: 40, top: y0, display: 'flex', alignItems: 'baseline', gap: 18 }}>
        <span style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.white, background: warna, borderRadius: 22, padding: '6px 22px' }}>{judul}</span>
        <span style={{ fontFamily: F, fontSize: 20, fontWeight: 600, color: B.gray }}>
          1 siklus (2 langkah) = {N.toFixed(0)} frame @60 fps · maju {(panjangSiklus(r) * S_ADEGAN).toFixed(0)} px per siklus ({((panjangSiklus(r) * S_ADEGAN) / N).toFixed(1)} px/frame) pada skala adegan {S_ADEGAN}
        </span>
      </div>
      <svg width={CONTOH_KF.w} height={CONTOH_KF.h} style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={KOLOM - 10} x2={1890} y1={tanah} y2={tanah} stroke={B.grayLite} strokeWidth={3} />
        <line x1={KOLOM - 10} x2={1890} y1={yBerdiri} y2={yBerdiri} stroke={B.grayLite} strokeWidth={2} strokeDasharray="6 8" />
        {pose.map((p, k) => <TokohTegak key={k} x={cx(k)} tanah={tanah} s={SKALA} pose={p} />)}
        {/* naik-turun pinggul (body bob) */}
        <polyline points={pinggul.map((q) => q.join(',')).join(' ')} fill="none" stroke={warna} strokeWidth={3} strokeDasharray="10 7" strokeLinecap="round" />
        {pinggul.map(([x, y], k) => <circle key={k} cx={x} cy={y} r={6} fill={warna} stroke={B.white} strokeWidth={2.5} />)}
        {/* kaki dekat = kaki yang kuncinya ditulis */}
        {pose.map((p, k) => {
          const [ax, ay] = titikKaki(p, 0), [hx, hy] = pinggul[k];
          return <circle key={k} cx={hx + ax * SKALA} cy={hy + ay * SKALA} r={7} fill={B.orange} stroke={B.white} strokeWidth={2.5} />;
        })}
        <text x={KOLOM - 18} y={yBerdiri + 6} textAnchor="end" fontFamily={F} fontSize={15} fontWeight={600} fill={B.gray}>pinggul berdiri</text>
      </svg>
      {pose.map((p, k) => (
        <div key={k} style={{ position: 'absolute', left: cx(k) - LEBAR / 2, width: LEBAR, top: tanah + 16, textAlign: 'center', fontFamily: F }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: B.night }}>{k + 1} · {nama[k]}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: B.gray, marginTop: 2 }}>frame {Math.round(kunci[k] * N)} · fase {kunci[k]}</div>
          <div style={{ marginTop: 10, fontSize: 16, lineHeight: '23px', fontVariantNumeric: 'tabular-nums', color: B.night }}>
            {baris.map(([, fn], b) => <div key={b}>{fn(p, 0)} <span style={{ color: B.grayLite }}>/</span> <span style={{ color: B.gray }}>{fn(p, 1)}</span></div>)}
            <div>{deg(p.badan)}</div>
            <div style={{ color: warna, fontWeight: 700 }}>{px(geserY(p))}</div>
          </div>
        </div>))}
      <div style={{ position: 'absolute', left: 40, width: KOLOM - 40, top: tanah + 16 + 56, fontFamily: F, fontSize: 16, lineHeight: '23px', fontWeight: 700, color: B.gray }}>
        {baris.map(([n]) => <div key={n}>{n}</div>)}
        <div>Badan</div>
        <div style={{ color: warna }}>Pinggul ↕ px</div>
      </div>
    </>);
};

export const ContohKeyframe: React.FC = () => (
  <AbsoluteFill style={{ background: B.white }}>
    <div style={{ position: 'absolute', left: 40, top: 30, fontFamily: F }}>
      <div style={{ fontSize: 36, fontWeight: 800, color: B.night }}>Contoh keyframe jalan & lari — tokoh gua (pose dasar berdiri tegak)</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: B.gray, marginTop: 6, lineHeight: '26px' }}>
        <div>Angka = <span style={{ color: B.night }}>nilai Rotation tiap lapis</span> (0° = pose dasar berdiri tegak, + = searah jarum jam) · <span style={{ color: B.night }}>kaki/lengan <span style={{ color: B.orange }}>● dekat</span></span> / jauh</div>
        <div>Paha = total (induk: null Pinggul, ikut Position badan saja) · Betis, Telapak, Lengan atas/bawah = relatif induknya · Pinggul ↕ = Position Y badan, + = turun (px skala 100%)</div>
      </div>
    </div>
    <Baris y0={150} judul="JALAN" r={0} N={JALAN_FRAME} kunci={JALAN.map((k) => k[0])} nama={NAMA_JALAN} warna={B.turq} />
    <Baris y0={785} judul="LARI" r={1} N={(panjangSiklus(1) * S_ADEGAN) / 8.4} kunci={LARI.map((k) => k[0])} nama={NAMA_LARI} warna={B.blue} />
  </AbsoluteFill>
);
