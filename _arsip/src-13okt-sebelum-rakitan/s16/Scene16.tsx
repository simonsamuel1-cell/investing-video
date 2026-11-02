import React from 'react';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, CORET, F, R, WARNA, io } from '../theme';
import { cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';
import type { KunciIkon } from '../ikon';
import { Bulat, Chip, DompetUang, NAMA_UANG, WARNA_UANG, denyut, geser } from '../parts/umum';

/**
 * SCENE 16 — IDE VISUAL (13 Okt). Bab "Tidak Ada Rasio yang Sama untuk Semua Orang". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  Tiga orang berbeda: A → Uang Aktif lebih besar · B → Uang Stabil lebih besar · C → Uang Jangka Panjang lebih besar · Tanpa ranking.
 *   TEXT    "Nggak ada rasio yang sama" / "yang ada adalah rasio yang [sesuai] kebutuhan"
 * Tiga ketukan (21,7 dtk):
 *   A  "Lalu, berapa banyak uang yang harus masuk ke masing-masing kelompok? Jawabannya: nggak ada satu persentase yang cocok untuk semua orang."
 *        isi Scene 15 keluar · tiga dompet + pil "?%" · judul TEXT · satu pembagian rata 33 · 33 · 33 % → dicoret MERAH di "cocok untuk semua orang"
 *   B  "Ada yang masih perlu membangun dana darurat. Ada yang dua tahun lagi punya kebutuhan besar. Ada juga yang belum punya tujuan jangka pendek."
 *        tiga orang (warna & ukuran SAMA = tanpa peringkat) muncul di "ada yang" · kondisi masing-masing · batang pembagian terisi di katanya ·
 *        keterangan "… lebih besar" berwarna jenis uangnya
 *   C  "Jadi pembagiannya harus mengikuti kondisi hidup dan tujuan kita masing-masing."   batang berdenyut bergiliran · sub-judul TEXT (sorot "sesuai")
 */

const [uang, kelompok, jawabannya, persentase, cocok, orang, ada1, membangun, ada2, kebutuhan, ada3, pendek, jadi, kondisi, hidup, tujuan, masing] = urut([
  'uang', 'kelompok', 'jawabannya', 'persentase', 'cocok', 'orang', 'ada', 'membangun', 'ada', 'kebutuhan', 'ada', 'pendek', 'jadi', 'kondisi', 'hidup', 'tujuan',
  'masing-masing'], BATAS.s16);

const T = {
  dompet: [uang - 10, uang + 6, uang + 22], tanya: kelompok, judul: jawabannya, rata: persentase - 10, coret: cocok + 20, denyutCoret: orang,
  keluarA: ada1 - 30, orang: [ada1, ada2, ada3], kondisi: [ada1 + 30, ada2 + 30, ada3 + 30], batang: [membangun, kebutuhan, pendek],
  denyutC: [jadi + 20, kondisi, hidup + 10, tujuan], sub: kondisi, subSorot: masing,
};

/* ── tata letak ── */
const DOMPET = { y: 400, d: 150, x: [520, 960, 1400] };
const RATA = { x: 510, y: 720, w: 900, h: 56 };
const KOLOM = { x: [480, 960, 1440], orang: 380, d: 140, kondisi: 505, batang: 610, ket: 675, lebar: 380 };
const ORANG: { ikon: KunciIkon; kondisi: string; ikonK: KunciIkon; bagi: number[]; besar: number }[] = [
  { ikon: 'orangA', kondisi: 'Membangun dana darurat', ikonK: 'danaDarurat', bagi: [0.6, 0.25, 0.15], besar: 0 },
  { ikon: 'orangB', kondisi: 'Kebutuhan besar 2 tahun lagi', ikonK: 'kalender', bagi: [0.2, 0.6, 0.2], besar: 1 },
  { ikon: 'orangC', kondisi: 'Belum ada tujuan jangka pendek', ikonK: 'targetUtama', bagi: [0.15, 0.25, 0.6], besar: 2 },
];

/** KELUAR Scene 16 = milik Scene 17 ("Tapi ada satu hal …", bab baru): seluruh isi naik-pudar 40f mulai di batas, judul keluar */
export const S16_KELUAR = BATAS.s17 + 20;
export const Scene16: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s16 || f >= S16_KELUAR + 60) return null;
  const kelS = R(f, S16_KELUAR - 20, S16_KELUAR + 20, 0, 1, io);
  const kelA = cin(f, T.keluarA);
  const coret = R(f, T.coret - 30, T.coret + 30, 0, 1, io);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - kelS, transform: geser(0, -30 * kelS) }}>
      {/* A: tiga dompet "?%" + satu pembagian rata yang dicoret */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - kelA, transform: geser(0, -40 * kelA) }}>
        {[0, 1, 2].map((k) => (
          <React.Fragment key={k}>
            <DompetUang k={k} x={DOMPET.x[k]} y={DOMPET.y} d={DOMPET.d} p={popIn(f, T.dompet[k])} f={f} labelAt={T.dompet[k] + 10} labelPx={30} />
            <PilNominal x={DOMPET.x[k]} y={DOMPET.y + DOMPET.d / 2 + 100} teks="? %" arah={0} p={popIn(f, T.tanya + 12 * k)} size={26} />
          </React.Fragment>))}
        {(() => {
          const p = popIn(f, T.rata) * (1 + denyut(f, T.denyutCoret, 0.04));
          if (p <= 0.001) return null;
          return (
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(RATA.x + RATA.w / 2, RATA.y)} translate(-50%, -50%) scale(${p})`, width: RATA.w, height: RATA.h,
              display: 'flex', borderRadius: RATA.h / 2, overflow: 'hidden', opacity: 1 - 0.4 * coret }}>
              {[0, 1, 2].map((k) => (
                <div key={k} style={{ flex: 1, background: WARNA_UANG[k], display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.white }}>33%</div>))}
            </div>);
        })()}
        {coret > 0.001 ? <div style={{ position: 'absolute', left: RATA.x - 20, top: RATA.y - 3, width: (RATA.w + 40) * coret, height: 7, borderRadius: 4, background: CORET }} /> : null}
        <Chip x={RATA.x + RATA.w / 2} y={RATA.y + 80} teks="Untuk semua orang" warna={CORET} p={popIn(f, T.coret)} coret={R(f, T.coret + 10, T.coret + 50, 0, 1, io)} size={26} />
      </div>

      {/* B–C: tiga orang berbeda, tanpa peringkat */}
      {ORANG.map((o, i) => {
        const x = KOLOM.x[i];
        const p = popIn(f, T.orang[i]);
        if (p <= 0.001) return null;
        const g = R(f, T.batang[i] - 20, T.batang[i] + 40, 0, 1, io);
        const dn = 1 + T.denyutC.reduce((s, t) => s + denyut(f, t + 14 * i, 0.05), 0);
        let acc = 0;
        return (
          <React.Fragment key={i}>
            <Bulat x={x} y={KOLOM.orang} d={KOLOM.d} warna={WARNA.langit} ikon={o.ikon} p={p} />
            <Chip x={x} y={KOLOM.kondisi} teks={o.kondisi} ikon={o.ikonK} warna={WARNA.langit} p={popIn(f, T.kondisi[i])} size={24} lebar={420} />
            {/* batang pembagian (tiga jenis uang) */}
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, KOLOM.batang)} translate(-50%, -50%) scale(${dn})`, width: KOLOM.lebar, height: 40,
              borderRadius: 20, overflow: 'hidden', background: 'rgba(22,24,27,0.06)', opacity: Math.min(1, popIn(f, T.batang[i] - 20)) }}>
              {o.bagi.map((b, k) => {
                const left = acc; acc += b;
                return <div key={k} style={{ position: 'absolute', left: `${left * 100 * g}%`, width: `${b * 100 * g}%`, top: 0, bottom: 0, background: WARNA_UANG[k] }} />;
              })}
            </div>
            {g > 0.05 ? (
              <div style={{ position: 'absolute', left: x - 220, width: 440, top: KOLOM.ket - 18, textAlign: 'center', fontFamily: F, fontSize: 28, fontWeight: 800,
                color: WARNA_UANG[o.besar], opacity: R(g, 0.4, 1, 0, 1), whiteSpace: 'nowrap' }}>{NAMA_UANG[o.besar]} lebih besar</div>) : null}
          </React.Fragment>);
      })}
      {/* keterangan warna (sekali, di bawah) */}
      {(() => {
        const p = popIn(f, T.batang[0] + 30);
        if (p <= 0.001) return null;
        return (
          <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(960, 790)} translate(-50%, -50%) scale(${p})`, display: 'flex', gap: 34, fontFamily: F, fontSize: 24,
            fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
            {NAMA_UANG.map((n, k) => <span key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: WARNA_UANG[k], display: 'inline-block' }} />{n}</span>)}
          </div>);
      })()}

      </AbsoluteFill>
      <Judul f={f} kata={['Nggak', 'ada', 'rasio', 'yang', 'sama']} at={T.judul} keluar={S16_KELUAR} />
      <Judul f={f} kata={['yang', 'ada', 'adalah', 'rasio', 'yang', 'sesuai', 'kebutuhan']} sorotIdx={5} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={S16_KELUAR} />
    </AbsoluteFill>);
};

export const S16_T = T;
