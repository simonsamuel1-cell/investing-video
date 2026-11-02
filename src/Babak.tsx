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
import { Guide } from './parts/Guide';
import { Scene01 } from './s01/Scene01';
import { Scene02 } from './s02/Scene02';
import { Scene03 } from './s03/Scene03';
import { Scene04 } from './s04/Scene04';
import { Scene05 } from './s05/Scene05';
import { Scene06 } from './s06/Scene06';
import { Scene07 } from './s07/Scene07';
import { Scene08 } from './s08/Scene08';

loadFont('normal', { weights: ['500', '600', '700', '800'], subsets: ['latin'] }); // 500: baris biasa teks pertanyaan S04 (2 Nov)

/**
 * SEMUA SCENE pada WAKTU GLOBAL (frame 0 = awal video) — pola Investing 101 V02–V06.
 * TAHAP 1 (29 Okt): latar + VO + watermark + subtitle saja; scene ditambahkan di sini satu per satu saat dibangun
 * (`{tampil('S01') ? <AuditLayer name="S01"><Scene01 f={f} /></AuditLayer> : null}` di dalam lapisan kamera).
 */
/** MODE UKUR: `ukur` = latar hijau tanpa watermark/subtitle/judul; `hanya` = satu scene saja ('S01'…) */
const IP = getInputProps() as { ukur?: boolean; hanya?: string; tanpaKamera?: boolean; guide?: boolean };
const tampil = (sc: string) => !IP.hanya || IP.hanya === sc;
/** KAMERA PEMUSAT (src/kamera.gen.ts, scripts/gen-kamera.py) — tahap 1 belum ada papan, jadi diam di (0, 0) */
const kamera = (f: number) => {
  let x = KAMERA[0][1], y = KAMERA[0][2];
  for (let i = 1; i < KAMERA.length; i++) {
    const t = R(f, KAMERA[i][0] - 30, KAMERA[i][0] + 30, 0, 1);
    x += t * (KAMERA[i][1] - KAMERA[i - 1][1]); y += t * (KAMERA[i][2] - KAMERA[i - 1][2]);
  }
  return { x, y };
};

export const Babak: React.FC<{ vo?: boolean; guide?: boolean }> = ({ vo = true, guide = false }) => {
  const f = useCurrentFrame();
  const kam = IP.tanpaKamera ? { x: 0, y: 0 } : kamera(f);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }} {...(AUDIT ? { 'data-audit-root': '' } : {})}>
      {AUDIT ? <AuditProbe /> : null}
      <MotionBlurDefs />
      <AuditLayer name="Backdrop">{IP.ukur ? <AbsoluteFill style={{ background: '#00FF00' }} /> : <Backdrop f={f} />}</AuditLayer>
      <AbsoluteFill style={{ transform: `translate3d(${kam.x}px, ${kam.y}px, 0) rotate(0.001deg)` }}><KonteksKamera.Provider value={kam}>
        {tampil('S01') ? <AuditLayer name="S01"><Scene01 f={f} /></AuditLayer> : null}
        {tampil('S02') ? <AuditLayer name="S02"><Scene02 f={f} /></AuditLayer> : null}
        {tampil('S03') ? <AuditLayer name="S03"><Scene03 f={f} /></AuditLayer> : null}
        {tampil('S04') ? <AuditLayer name="S04"><Scene04 f={f} /></AuditLayer> : null}
        {tampil('S05') ? <AuditLayer name="S05"><Scene05 f={f} /></AuditLayer> : null}
        {tampil('S06') ? <AuditLayer name="S06"><Scene06 f={f} /></AuditLayer> : null}
        {tampil('S07') ? <AuditLayer name="S07"><Scene07 f={f} /></AuditLayer> : null}
        {tampil('S08') ? <AuditLayer name="S08"><Scene08 f={f} /></AuditLayer> : null}
      </KonteksKamera.Provider></AbsoluteFill>
      {vo && VO_UTUH ? <Sequence from={VO_OFFSET} layout="none"><Audio src={staticFile(VO_UTUH)} /></Sequence> : null}
      {IP.ukur ? null : <AbsoluteFill style={{ zIndex: 2 }}><AuditLayer name="Watermark"><Watermark /></AuditLayer><AuditLayer name="Subtitle"><Subtitles /></AuditLayer></AbsoluteFill>}
      {guide || IP.guide ? <Guide /> : null}
    </AbsoluteFill>);
};
