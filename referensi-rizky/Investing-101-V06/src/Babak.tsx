import React from 'react';
import { AbsoluteFill, Audio, Sequence, getInputProps, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import { VO_OFFSET } from './offset';
import { VO_UTUH } from './vo';
import { Subtitles } from './Subtitles';
import { Backdrop } from './parts/Backdrop';
import { Watermark } from './parts/Watermark';
import { AUDIT, AuditLayer, AuditProbe } from './audit/AuditProbe';
import { KonteksKamera } from './skala';
import { R } from './theme';
import { KAMERA } from './kamera.gen';
import { MotionBlurDefs } from './parts/kit';
import { Scene01Flat } from './s01flat/Scene01Flat';
import { Scene02Flat } from './s02flat/Scene02Flat';
import { Scene03Flat } from './s03flat/Scene03Flat';
import { Scene04Flat } from './s04flat/Scene04Flat';
import { Scene05 } from './s05/Scene05';
import { Scene06Flat } from './s06flat/Scene06Flat';
import { Scene07 } from './s07/Scene07';
import { Scene08 } from './s08/Scene08';
import { Scene09 } from './s09/Scene09';
import { Scene10 } from './s10/Scene10';
import { Scene11 } from './s11/Scene11';
import { Scene12 } from './s12/Scene12';
import { OUTRO_PRA, OutroPanggung } from './outro/Outro';
import { OUTRO_AT } from './outro/plan.gen';
import { Guide } from './parts/Guide';

loadFont('normal', { weights: ['600', '700', '800'], subsets: ['latin'] });

/**
 * SEMUA SCENE pada WAKTU GLOBAL (frame 0 = awal video) — pola Video 02/03/05.
 * TAHAP 1 (23 Okt): latar + VO + watermark + subtitle saja; scene ditambahkan di sini satu per satu saat dibangun
 * (bungkus <Adegan k={SKALA.Sxx}> seperti Video 05). Outro "Di video selanjutnya" baru subtitle + VO — halamannya menunggu ide visual.
 */
/** MODE UKUR: `ukur` = latar hijau tanpa watermark/subtitle/judul; `hanya` = satu scene saja ('S01'…) */
const IP = getInputProps() as { ukur?: boolean; hanya?: string; tanpaKamera?: boolean; guide?: boolean };
/** KAMERA PEMUSAT (src/kamera.gen.ts, scripts/gen-kamera.py) — tahap 1 belum ada papan, jadi diam di (0, 0) */
const tampil = (sc: string) => !IP.hanya || IP.hanya === sc;
const kamera = (f: number) => {
  let x = KAMERA[0][1], y = KAMERA[0][2];
  for (let i = 1; i < KAMERA.length; i++) {
    const t = R(f, KAMERA[i][0] - 30, KAMERA[i][0] + 30, 0, 1);
    x += t * (KAMERA[i][1] - KAMERA[i - 1][1]); y += t * (KAMERA[i][2] - KAMERA[i - 1][2]);
  }
  return { x, y };
};

/** Scene 01 = versi 2D flat (s01flat/, disetujui Simon 27 Okt); Scene 01 lama dihapus 27 Okt ("oh iya hapus scene 1 yang lama").
 * Scene 02 = versi 2D flat (s02flat/, dibangun per adegan); Scene 02 lama dihapus 27 Okt ("ketika membangun scene baru, hapus scene lama"). */
export const Babak: React.FC<{ vo?: boolean; guide?: boolean }> = ({ vo = true, guide = false }) => {
  const f = useCurrentFrame();
  const kam = IP.tanpaKamera ? { x: 0, y: 0 } : kamera(f);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }} {...(AUDIT ? { 'data-audit-root': '' } : {})}>
      {AUDIT ? <AuditProbe /> : null}
      <MotionBlurDefs />
      <AuditLayer name="Backdrop">{IP.ukur ? <AbsoluteFill style={{ background: '#00FF00' }} /> : <Backdrop f={f} />}</AuditLayer>
      <AbsoluteFill style={{ transform: `translate3d(${kam.x}px, ${kam.y}px, 0) rotate(0.001deg)` }}><KonteksKamera.Provider value={kam}>
        {tampil('S01') ? <AuditLayer name="S01"><Scene01Flat f={f} /></AuditLayer> : null}
        {tampil('S02') ? <AuditLayer name="S02"><Scene02Flat f={f} /></AuditLayer> : null}
        {tampil('S03') ? <AuditLayer name="S03"><Scene03Flat f={f} /></AuditLayer> : null}
        {tampil('S04') ? <AuditLayer name="S04"><Scene04Flat f={f} /></AuditLayer> : null}
        {tampil('S05') ? <AuditLayer name="S05"><Scene05 f={f} /></AuditLayer> : null}
        {tampil('S06') ? <AuditLayer name="S06"><Scene06Flat f={f} /></AuditLayer> : null}
        {tampil('S07') ? <AuditLayer name="S07"><Scene07 f={f} /></AuditLayer> : null}
        {tampil('S08') ? <AuditLayer name="S08"><Scene08 f={f} /></AuditLayer> : null}
        {tampil('S09') ? <AuditLayer name="S09"><Scene09 f={f} /></AuditLayer> : null}
        {tampil('S10') ? <AuditLayer name="S10"><Scene10 f={f} /></AuditLayer> : null}
        {tampil('S11') ? <AuditLayer name="S11"><Scene11 f={f} /></AuditLayer> : null}
        {tampil('S12') ? <AuditLayer name="S12"><Scene12 f={f} /></AuditLayer> : null}
        {tampil('OUTRO') && f >= OUTRO_AT - OUTRO_PRA ? <AuditLayer name="Outro"><OutroPanggung g={f - OUTRO_AT} /></AuditLayer> : null}
      </KonteksKamera.Provider></AbsoluteFill>
      {vo && VO_UTUH ? <Sequence from={VO_OFFSET} layout="none"><Audio src={staticFile(VO_UTUH)} /></Sequence> : null}
      {IP.ukur ? null : <AbsoluteFill style={{ zIndex: 2 }}><AuditLayer name="Watermark"><Watermark /></AuditLayer><AuditLayer name="Subtitle"><Subtitles /></AuditLayer></AbsoluteFill>}
      {guide || IP.guide ? <Guide /> : null}
    </AbsoluteFill>);
};
