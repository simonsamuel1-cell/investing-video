import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, WARNA, io, lerp, rgba } from '../theme';
import { cin, Icon, popOut, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';
import type { KunciIkon } from '../ikon';
import { S12_DOMPET_AKHIR } from '../s12/Scene12';
import { Chevron, Kaca, MaskerKeluar, Penghubung, durMasker } from '../parts/kaca';
import { S14_MASUK } from '../s14/Scene14';

/**
 * SCENE 13 — IDE VISUAL (13 Okt). Bab "03 — Uang Jangka Panjang". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  UANG JANGKA PANJANG ↓ Index Fund · Reksa Dana Saham · Saham ↓ PERUSAHAAN ↓ Revenue → Profit → Reinvestment → Growth
 *   TEXT    "Uang jangka panjang" / "beri ruang lebih besar untuk [pertumbuhan]"
 * Empat ketukan (28,9 dtk) — pola cabang Scene 05/09:
 *   A  "Untuk uang jangka panjang, pilihannya bisa disesuaikan dengan tujuan dan kemampuan kita menghadapi risiko."
 *        isi Scene 12 keluar · dompet naik ke atas · judul TEXT · tiga panah + slot "?" di "pilihannya" · chip "Tujuan" & "Profil risiko" di kiri-kanan
 *        dompet (penyaring pilihan) · sub-judul TEXT
 *   B  "Misalnya reksa dana indeks, reksa dana saham, atau investasi langsung di saham."   slot → tiga pilihan (ikon instrumen Video 02)
 *   C  "Kenapa? Karena aset-aset ini biasanya terhubung dengan perusahaan"
 *        dompet & chip keluar, pilihan naik ke atas · gedung PERUSAHAAN (foto Video 02) di bawah, penghubung dari tiap pilihan
 *   D  "yang bisa menghasilkan pendapatan dan laba, lalu menginvestasikan kembali laba itu untuk berkembang."
 *        pilihan keluar, perusahaan naik · rantai Pendapatan → Laba → Investasi kembali → Bertumbuh di katanya (nominal miliar) ·
 *        panah balik (siklus) · "berkembang" = pendapatan berikutnya Rp10 M → Rp12 M ▲ (nominal, bukan ikon membesar) · sorot "pertumbuhan"
 * Rakitan 13 Okt — rantai D = KARTU KACA berpenghubung lencana chevron (acuan Simon ref-14) + garis balik putus-putus di bawah kartu
 * (siklus, ref-15); KELUAR = masker menyusut ke titik awal grafik Scene 14 (brief Video 02 B: bukan pudar biasa).
 */

const [uang, panjang, pilihannya, bisa, disesuaikan, tujuan, kemampuan, menghadapi, risiko, misalnya, reksa, indeks, reksa2, , atau, investasi, langsung,
  saham2, kenapa, karena, aset, terhubung,
  perusahaan, yang, pendapatan, laba, menginvestasikan, kembali, berkembang] = urut([
  'uang', 'panjang', 'pilihannya', 'bisa', 'disesuaikan', 'tujuan', 'kemampuan', 'menghadapi', 'risiko', 'misalnya', 'reksa', 'indeks', 'reksa', 'saham',
  'atau', 'investasi', 'langsung', 'saham', 'kenapa', 'karena',
  'aset-aset', 'terhubung', 'perusahaan', 'yang', 'pendapatan', 'laba', 'menginvestasikan', 'kembali', 'berkembang'], BATAS.s13);

const T = {
  dompet: uang + 16, kunciKeluar: BATAS.s13 + 20, judul: panjang, sub: bisa + 30,
  panah: [pilihannya - 10, pilihannya + 10, pilihannya + 30], slot: [pilihannya + 10, pilihannya + 30, pilihannya + 50], denyutSlot: [disesuaikan - 10, misalnya], denyutSlot3: atau,
  chip: [tujuan, kemampuan], denyutChip: [menghadapi, risiko],
  isi: [reksa + 10, reksa2 + 10, investasi], labelIsi: [indeks, reksa2 + 30, langsung], denyutSaham: saham2,
  keluarA: kenapa, naik: karena, denyutIsi: aset, penghubung: terhubung, gedung: perusahaan,
  keluarC: yang, rantai: [pendapatan, laba, menginvestasikan, berkembang - 10], balik: kembali + 20, tumbuh: berkembang, subSorot: berkembang,
};

/* ── tata letak ── */
const AWAL = S12_DOMPET_AKHIR; // dompet Uang Jangka Panjang Scene 12 (300, 420, Ø170)
const DOMPET = { x: 960, y: 290, d: 160 };
const CHIP_Y = 290, CHIP_X = [620, 1300];
const NODE = { y: 600, d: 160, x: [540, 960, 1380] };
const NODE_C = { y: 360, d: 130 };
const GEDUNG = { x: 960, yC: 720, yD: 345, h: 230 };
const RANTAI = { y: 690, d: 110, x: [420, 780, 1140, 1500], w: 300, h: 280 };
const IKON_RANTAI_Y = RANTAI.y - 50;
const PILIHAN: { nama: string; ikon: KunciIkon; warna: string }[] = [
  { nama: 'Reksa dana indeks', ikon: 'rdIndeks', warna: WARNA.ungu },
  { nama: 'Reksa dana saham', ikon: 'rdSaham', warna: WARNA.langit },
  { nama: 'Saham', ikon: 'saham', warna: B.blue },
];
const SIKLUS: { nama: string; ikon: KunciIkon; warna: string; nominal: string }[] = [
  { nama: 'Pendapatan', ikon: 'pendapatan', warna: B.turq, nominal: 'Rp10 M' },
  { nama: 'Laba', ikon: 'laba', warna: WARNA.langit, nominal: 'Rp2 M' },
  { nama: 'Investasi kembali', ikon: 'investasiKembali', warna: WARNA.ungu, nominal: 'Rp1 M' },
  { nama: 'Bertumbuh', ikon: 'bertumbuh', warna: B.orange, nominal: '' },
];
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const denyut = (f: number, at: number, a = 0.07) => a * Math.sin(Math.PI * R(f, at - 20, at + 20, 0, 1, io));
const panah = (x0: number, y0: number, x1: number, y1: number, g: number, col: string, key: string, dash = '7 11') => {
  if (g <= 0.001) return null;
  const ang = Math.atan2(y1 - y0, x1 - x0), hx = lerp(x0, x1, g), hy = lerp(y0, y1, g);
  return (
    <g key={key}>
      <line x1={x0} y1={y0} x2={hx} y2={hy} stroke={col} strokeWidth={3} strokeDasharray={dash} strokeLinecap="round" />
      {g > 0.9 ? <path d={`M ${x1} ${y1} l ${-Math.cos(ang - 0.45) * 18} ${-Math.sin(ang - 0.45) * 18} l ${Math.cos(ang - 0.45) * 18 - Math.cos(ang + 0.45) * 18} ${Math.sin(ang - 0.45) * 18 - Math.sin(ang + 0.45) * 18} z`}
        fill={col} opacity={R(g, 0.9, 1, 0, 1)} /> : null}
    </g>);
};

/** KELUAR Scene 13 = milik Scene 14: masker lingkaran menyusut ke titik awal grafik Scene 14 (S14_MASUK) */
export const S13_KELUAR = S14_MASUK.mulai;
export const Scene13: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s13 || f >= S13_KELUAR + durMasker) return null;
  const m = cin(f, T.dompet);
  const keluarA = cin(f, T.keluarA);
  const naik = cin(f, T.naik), keluarC = cin(f, T.keluarC);
  const dx = lerp(AWAL.x, DOMPET.x, m), dy = lerp(AWAL.y, DOMPET.y, m), dd = lerp(AWAL.d, DOMPET.d, m);
  const nodeY = lerp(NODE.y, NODE_C.y, naik), nodeD = lerp(NODE.d, NODE_C.d, naik);
  const gy = lerp(GEDUNG.yC, GEDUNG.yD, cin(f, T.keluarC + 20));
  return (
    <MaskerKeluar f={f} mulai={S13_KELUAR} ke={S14_MASUK} warna={S14_MASUK.warna}>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {/* A–B: panah dompet → tiga pilihan */}
        <g opacity={1 - keluarA}>
          {PILIHAN.map((p, k) => {
            const ex = NODE.x[k], ey = NODE.y, ang = Math.atan2(ey - DOMPET.y, ex - DOMPET.x);
            return panah(DOMPET.x + Math.cos(ang) * (DOMPET.d / 2 + 14), DOMPET.y + Math.sin(ang) * (DOMPET.d / 2 + 14), ex - Math.cos(ang) * (NODE.d / 2 + 16),
              ey - Math.sin(ang) * (NODE.d / 2 + 16), R(f, T.panah[k] - 30, T.panah[k] + 30, 0, 1, io), p.warna, `p${k}`);
          })}
          {/* chip penyaring → dompet */}
          {[0, 1].map((i) => {
            const g = R(f, T.chip[i] + 10, T.chip[i] + 50, 0, 1, io);
            const xs = i === 0 ? CHIP_X[0] + 130 : CHIP_X[1] - 150, xe = i === 0 ? DOMPET.x - DOMPET.d / 2 - 14 : DOMPET.x + DOMPET.d / 2 + 14;
            return panah(xs, CHIP_Y, xe, CHIP_Y, g, B.orange, `c${i}`);
          })}
        </g>
        {/* C: penghubung pilihan → perusahaan */}
        <g opacity={1 - keluarC}>
          {PILIHAN.map((p, k) => panah(NODE.x[k], NODE_C.y + NODE_C.d / 2 + 60, GEDUNG.x + (k - 1) * 70, GEDUNG.yC - GEDUNG.h / 2 + 10,
            R(f, T.penghubung - 30 + 12 * k, T.penghubung + 30 + 12 * k, 0, 1, io), p.warna, `g${k}`))}
        </g>
        {/* D: perusahaan → kartu Pendapatan (siku membulat), garis balik putus-putus di bawah kartu (siklus, ref-15) */}
        <Penghubung d={`M ${GEDUNG.x} ${GEDUNG.yD + GEDUNG.h / 2 + 10} L ${GEDUNG.x} ${RANTAI.y - RANTAI.h / 2 - 66} Q ${GEDUNG.x} ${RANTAI.y - RANTAI.h / 2 - 46} ${GEDUNG.x - 20} ${RANTAI.y - RANTAI.h / 2 - 46} L ${RANTAI.x[0] + 20} ${RANTAI.y - RANTAI.h / 2 - 46} Q ${RANTAI.x[0]} ${RANTAI.y - RANTAI.h / 2 - 46} ${RANTAI.x[0]} ${RANTAI.y - RANTAI.h / 2 - 26} L ${RANTAI.x[0]} ${RANTAI.y - RANTAI.h / 2 - 8}`}
          g={R(f, T.rantai[0] - 50, T.rantai[0] - 10, 0, 1, io)} warna={B.night} tebal={4} panah={{ x: RANTAI.x[0], y: RANTAI.y - RANTAI.h / 2 - 8, sudut: Math.PI / 2 }} />
        {(() => {
          const yb = RANTAI.y + RANTAI.h / 2 + 72, y0 = RANTAI.y + RANTAI.h / 2 + 10;
          const d = `M ${RANTAI.x[3]} ${y0} L ${RANTAI.x[3]} ${yb - 24} Q ${RANTAI.x[3]} ${yb} ${RANTAI.x[3] - 24} ${yb} L ${RANTAI.x[0] + 24} ${yb} Q ${RANTAI.x[0]} ${yb} ${RANTAI.x[0]} ${yb - 24} L ${RANTAI.x[0]} ${y0}`;
          return <Penghubung d={d} g={R(f, T.balik - 30, T.balik + 40, 0, 1, io)} warna={WARNA.ungu} tebal={4} panah={{ x: RANTAI.x[0], y: y0, sudut: -Math.PI / 2 }} />;
        })()}
      </svg>

      {/* chip penyaring: Tujuan · Profil risiko */}
      {(['Tujuan', 'Profil risiko'] as const).map((t, i) => {
        const p = popIn(f, T.chip[i]) * popOut(f, T.keluarA - 6 + 8 * i) * (1 + denyut(f, T.denyutChip[0] + 14 * i, 0.06) + denyut(f, T.denyutChip[1] + 14 * i, 0.06));
        if (p <= 0.001) return null;
        return (
          <div key={t} style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(CHIP_X[i], CHIP_Y)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center',
            gap: 10, width: 260, boxSizing: 'border-box', background: B.white, border: `2.5px solid ${B.orange}`, borderRadius: 999, padding: '11px 24px', fontFamily: F, fontSize: 28,
            fontWeight: 700, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -14px ${B.orange}aa` }}>
            <Icon name={i === 0 ? 'targetUtama' : 'profilRisiko'} size={30} color={B.orange} />
            {t}
          </div>);
      })}

      {/* tiga pilihan: slot → isi; naik di C; keluar di D */}
      {PILIHAN.map((p, k) => {
        const x = NODE.x[k];
        const slot = popIn(f, T.slot[k]) * popOut(f, T.isi[k] - 6) * (1 + denyut(f, T.denyutSlot[0] + 10 * k, 0.06) + denyut(f, T.denyutSlot[1] + 10 * k, 0.06)
          + (k === 2 ? denyut(f, T.denyutSlot3, 0.08) : 0));
        const isi = popIn(f, T.isi[k]) * popOut(f, T.keluarC + 8 * k) * (1 + denyut(f, T.denyutIsi + 14 * k, 0.07) + (k === 2 ? denyut(f, T.denyutSaham, 0.07) : 0));
        return (
          <React.Fragment key={p.nama}>
            {slot > 0.001 ? (
              <div style={{ position: 'absolute', left: x - NODE.d / 2, top: NODE.y - NODE.d / 2, width: NODE.d, height: NODE.d, borderRadius: '50%', border: `3px dashed ${B.grayLite}`,
                background: B.white, transform: `scale(${slot})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 68, fontWeight: 800, color: B.grayLite, lineHeight: 1 }}>?</div>) : null}
            {isi > 0.001 ? (
              <div style={{ position: 'absolute', left: x - nodeD / 2, top: nodeY - nodeD / 2, width: nodeD, height: nodeD, borderRadius: '50%', background: p.warna, display: 'grid',
                placeItems: 'center', transform: `scale(${isi})`, boxShadow: `0 16px 34px -12px ${p.warna}aa` }}>
                <Icon name={p.ikon} size={nodeD * 0.54} color={B.white} />
              </div>) : null}
            {f >= T.labelIsi[k] - 30 ? (
              <div style={{ position: 'absolute', left: x - 190, width: 380, top: nodeY + nodeD / 2 + 16, textAlign: 'center', whiteSpace: 'nowrap', opacity: 1 - keluarC }}>
                <WordText halus f={f} at={T.labelIsi[k]} style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{p.nama}</WordText>
              </div>) : null}
          </React.Fragment>);
      })}

      {/* PERUSAHAAN (foto Video 02) */}
      {(() => {
        const p = popIn(f, T.gedung) * (1 + denyut(f, T.tumbuh, 0.05));
        if (p <= 0.001) return null;
        const w = GEDUNG.h * (389 / 480);
        return (
          <>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `${geser(GEDUNG.x, gy)} scale(${p})` }}>
              <Img src={staticFile('media/perusahaan.webp')} style={{ position: 'absolute', left: -w / 2, top: -GEDUNG.h / 2, width: w, height: GEDUNG.h, maxWidth: 'none' }} />
            </div>
            <div style={{ position: 'absolute', left: GEDUNG.x + w / 2 + 24, top: gy - 22, whiteSpace: 'nowrap' }}>
              <WordText halus f={f} at={T.gedung + 8} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Perusahaan</WordText>
            </div>
          </>);
      })()}

      {/* D: rantai Pendapatan → Laba → Investasi kembali → Bertumbuh (nominal miliar) — kartu kaca ber-tab warna + chevron (ref-14) */}
      {/* slot kartu (putus-putus) untuk keempat langkah sejak awal rantai — susunan tetap di tengah saat kartu mengisi satu per satu */}
      {SIKLUS.map((s2, k) => {
        const p = popIn(f, T.rantai[0] - 30 + 10 * k) * (1 - R(f, T.rantai[k] - 10, T.rantai[k] + 20, 0, 1, io));
        if (p <= 0.001) return null;
        return <div key={`s${k}`} style={{ position: 'absolute', left: 0, top: 0, width: RANTAI.w, height: RANTAI.h, transformOrigin: 'center',
          transform: `${geser(RANTAI.x[k] - RANTAI.w / 2, RANTAI.y - RANTAI.h / 2)} scale(${p})`, borderRadius: 30, border: `3px dashed ${rgba(s2.warna, 0.7)}`,
          background: rgba(B.white, 0.35), boxSizing: 'border-box' }} />;
      })}
      {SIKLUS.slice(1).map((s2, k) => <Chevron key={`c${k}`} x={(RANTAI.x[k] + RANTAI.x[k + 1]) / 2} y={RANTAI.y} warna={s2.warna} p={popIn(f, T.rantai[k + 1] - 16)} d={50} />)}
      {SIKLUS.map((s2, k) => {
        const p = popIn(f, T.rantai[k]) * (1 + denyut(f, T.rantai[k] + 50, 0.05) + (k === 0 ? denyut(f, T.tumbuh + 20, 0.06) : 0));
        if (p <= 0.001) return null;
        const x = RANTAI.x[k];
        return (
          <React.Fragment key={s2.nama}>
            <Kaca x={x} y={RANTAI.y} w={RANTAI.w} h={RANTAI.h} p={p} warna={s2.warna} tab="atas" tabTebal={14} rona={0.6} radius={30} />
            <div style={{ position: 'absolute', left: x - RANTAI.d / 2, top: IKON_RANTAI_Y - RANTAI.d / 2, width: RANTAI.d, height: RANTAI.d, borderRadius: '50%', background: s2.warna,
              display: 'grid', placeItems: 'center', transform: `scale(${p})`, boxShadow: `0 14px 30px -10px ${s2.warna}aa` }}>
              <Icon name={s2.ikon} size={RANTAI.d * 0.54} color={B.white} />
            </div>
            <div style={{ position: 'absolute', left: x - 145, width: 290, top: IKON_RANTAI_Y + RANTAI.d / 2 + 14, textAlign: 'center', whiteSpace: 'nowrap' }}>
              <WordText halus f={f} at={T.rantai[k] + 8} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>{s2.nama}</WordText>
            </div>
          </React.Fragment>);
      })}
      {/* nominal: pendapatan Rp10 M → (berkembang) Rp12 M ▲ · laba Rp2 M · diinvestasikan kembali Rp1 M */}
      {SIKLUS.slice(0, 3).map((s, k) => {
        const tumbuh = k === 0 ? R(f, T.tumbuh - 20, T.tumbuh + 40, 0, 1, io) : 0;
        const teks = k === 0 ? `Rp${(10 + 2 * tumbuh).toFixed(tumbuh > 0 && tumbuh < 1 ? 1 : 0).replace('.', ',')} M` : s.nominal;
        return <PilNominal key={s.nama} x={RANTAI.x[k]} y={RANTAI.y + 92} teks={teks} arah={k === 0 ? tumbuh : 0} size={24} lebarMin={130}
          p={popIn(f, T.rantai[k] + 20)} />;
      })}

      {/* dompet Uang Jangka Panjang (dari Scene 12) + label (pudar saat judul) · gembok keluar · keluar di "Kenapa" */}
      {(() => {
        const p = popOut(f, T.keluarA + 10);
        if (p <= 0.001) return null;
        const kunci = popOut(f, T.kunciKeluar);
        return (
          <>
            <div style={{ position: 'absolute', left: dx - dd / 2, top: dy - dd / 2, width: dd, height: dd, borderRadius: '50%', background: B.orange, display: 'grid', placeItems: 'center',
              transform: `scale(${p})`, boxShadow: `0 18px 40px -12px ${B.orange}aa` }}>
              <Icon name="dompet" size={dd * 0.52} color={B.white} />
            </div>
            {kunci > 0.001 ? (
              <div style={{ position: 'absolute', left: dx + dd * 0.36 - 34, top: dy - dd * 0.36 - 34, width: 68, height: 68, borderRadius: '50%', background: B.night,
                border: `4px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${kunci})`, boxShadow: `0 10px 24px -8px ${rgba(B.night, 0.5)}` }}>
                <Icon name="kunci" size={34} color={B.white} />
              </div>) : null}
            {(() => {
              const a = 1 - cin(f, T.judul);
              if (a <= 0.001) return null;
              return (
                <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(dx, lerp(AWAL.labelY, DOMPET.y + DOMPET.d / 2 + 40, m)), translate: '-50% -50%', display: 'flex',
                  alignItems: 'center', gap: 14, whiteSpace: 'nowrap', opacity: a }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: B.orange }} />
                  <span style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Uang Jangka Panjang</span>
                </div>);
            })()}
          </>);
      })()}

      <AbsoluteFill>
        <Judul f={f} kata={['Uang', 'jangka', 'panjang']} at={T.judul} />
        <Judul f={f} kata={['beri', 'ruang', 'lebih', 'besar', 'untuk', 'pertumbuhan']} sorotIdx={5} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
      </AbsoluteFill>
    </MaskerKeluar>);
};

export const S13_T = T;
