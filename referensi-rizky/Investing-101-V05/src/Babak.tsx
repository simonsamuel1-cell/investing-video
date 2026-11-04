import React from 'react';
import { AbsoluteFill, Audio, Sequence, getInputProps, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import { VO_OFFSET } from './offset';
import { VO_UTUH } from './vo';
import { Subtitles } from './Subtitles';
import { Backdrop } from './parts/Backdrop';
import { Watermark } from './parts/Watermark';
import { AUDIT, AuditLayer, AuditProbe } from './audit/AuditProbe';
import { KonteksSkala, SKALA, KonteksKamera } from './skala';
import { Scene01 } from './s01/Scene01';
import { Scene02 } from './s02/Scene02';
import { Scene03 } from './s03/Scene03';
import { Scene04 } from './s04/Scene04';
import { Scene05 } from './s05/Scene05';
import { Scene06 } from './s06/Scene06';
import { Scene07 } from './s07/Scene07';
import { R } from './theme';
import { OUTRO_AT } from './outro/plan.gen';
import { OUTRO_PRA, OutroPanggung } from './outro/Outro';
import { KAMERA } from './kamera.gen';
import { MotionBlurDefs } from './parts/kit';

loadFont('normal', { weights: ['600', '700', '800'], subsets: ['latin'] });

/**
 * SEMUA SCENE pada WAKTU GLOBAL (frame 0 = awal video) — pola Video 02/03. Komposisi ide per scene (Ide-S01 …) memotongnya lewat
 * <Sequence from={-awal}>, jadi sambungan antar-scene ikut terlihat dan tetap sinkron dengan VO & subtitle.
 * TAHAP 1 (19 Okt): latar + VO + watermark + subtitle saja; scene ditambahkan di sini satu per satu saat dibangun (bungkus <Adegan k={SKALA.Sxx}>).
 */
/** MODE UKUR: `ukur` = latar hijau tanpa watermark/subtitle/judul; `hanya` = satu scene saja ('S01'…) */
const IP = getInputProps() as { ukur?: boolean; hanya?: string; tanpaKamera?: boolean };
/** KAMERA PEMUSAT (src/kamera.gen.ts, scripts/gen-kamera.py): tiap papan dipusatkan pada TINTA-nya di (960, 497) = tengah area di atas subtitle.
 *  Geser konstan sepanjang papan; berpindah hanya di transisi papan (60f inOut cubic dipusatkan di kata transisinya). Satu geser global → serah-terima
 *  antarscene tetap tersambung. Latar, watermark, subtitle & outro TIDAK ikut. */
const kamera = (f: number) => {
  let x = KAMERA[0][1], y = KAMERA[0][2];
  for (let i = 1; i < KAMERA.length; i++) {
    const t = R(f, KAMERA[i][0] - 30, KAMERA[i][0] + 30, 0, 1);
    x += t * (KAMERA[i][1] - KAMERA[i - 1][1]); y += t * (KAMERA[i][2] - KAMERA[i - 1][2]);
  }
  return { x, y };
};
const tampil = (sc: string) => !IP.hanya || IP.hanya === sc;

/** pembungkus adegan: skala seragam terhadap pusat frame + konteks skala (Judul membalik skala, masker mengonversi titik tujuan) */
const AdeganDasar: React.FC<{ k: number; children: React.ReactNode }> = ({ k, children }) => k === 1 ? <>{children}</> : (
  <KonteksSkala.Provider value={k}>
    <AbsoluteFill style={{ transformOrigin: '960px 540px', transform: `scale(${k})` }}>{children}</AbsoluteFill>
  </KonteksSkala.Provider>);
/** AUDIT (inputProps.audit, scripts/audit-tabrakan.mjs): tiap scene dibungkus lapisan bernama untuk probe; render biasa TIDAK berubah */
const Adegan: React.FC<{ k: number; nama: string; children: React.ReactNode }> = ({ k, nama, children }) =>
  <AuditLayer name={nama}><AdeganDasar k={k}>{children}</AdeganDasar></AuditLayer>;

export const Babak: React.FC<{ vo?: boolean }> = ({ vo = true }) => {
  const f = useCurrentFrame();
  const sapu = R(f, OUTRO_AT, OUTRO_AT + 60, 0, 1);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }} {...(AUDIT ? { 'data-audit-root': '' } : {})}>
      {AUDIT ? <AuditProbe /> : null}
      <MotionBlurDefs />
      <AuditLayer name="Backdrop">{IP.ukur ? <AbsoluteFill style={{ background: '#00FF00' }} /> : <Backdrop f={f} />}</AuditLayer>
      {/* OUTRO (naskah revisi 21 Okt, pola Video 03): isi video NAIK KELUAR 60f inOut cubic bersama halaman outro yang naik dari bawah (latar tetap diam) */}
      {sapu < 1 ? (() => { const kam = IP.tanpaKamera ? { x: 0, y: 0 } : kamera(f); return (
      <AbsoluteFill style={{ transform: `translate3d(${kam.x}px, ${kam.y - 1080 * sapu}px, 0) rotate(0.001deg)` }}><KonteksKamera.Provider value={kam}>
      {tampil('S01') ? <Adegan k={SKALA.S01} nama="S01"><Scene01 f={f} /></Adegan> : null}
      {tampil('S02') ? <Adegan k={SKALA.S02} nama="S02"><Scene02 f={f} /></Adegan> : null}
      {tampil('S03') ? <Adegan k={SKALA.S03} nama="S03"><Scene03 f={f} /></Adegan> : null}
      {tampil('S04') ? <Adegan k={SKALA.S04} nama="S04"><Scene04 f={f} /></Adegan> : null}
      {tampil('S05') ? <Adegan k={SKALA.S05} nama="S05"><Scene05 f={f} /></Adegan> : null}
      {tampil('S06') ? <Adegan k={SKALA.S06} nama="S06"><Scene06 f={f} /></Adegan> : null}
      {tampil('S07') ? <Adegan k={SKALA.S07} nama="S07"><Scene07 f={f} /></Adegan> : null}
      {/* S08 = RESERVED ±30 dtk "Mutual Fund Feature" (NOTE Simon 22 Okt sore) — belum dibuat; peta sungai penutup kini bagian akhir S07 */}
      </KonteksKamera.Provider></AbsoluteFill>); })() : null}
      {tampil('OUTRO') && f >= OUTRO_AT - OUTRO_PRA ? <AuditLayer name="Outro"><OutroPanggung g={f - OUTRO_AT} /></AuditLayer> : null}
      {vo && VO_UTUH ? <Sequence from={VO_OFFSET} layout="none"><Audio src={staticFile(VO_UTUH)} /></Sequence> : null}
      {IP.ukur ? null : <AbsoluteFill style={{ zIndex: 2 }}><AuditLayer name="Watermark"><Watermark /></AuditLayer><AuditLayer name="Subtitle"><Subtitles /></AuditLayer></AbsoluteFill>}
    </AbsoluteFill>);
};
