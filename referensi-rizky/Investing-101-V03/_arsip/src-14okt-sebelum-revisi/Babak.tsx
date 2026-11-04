import React from 'react';
import { AbsoluteFill, Audio, Sequence, getInputProps, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import { VO_OFFSET } from './offset';
import { VO_UTUH } from './vo';
import { Subtitles } from './Subtitles';
import { Backdrop } from './parts/Backdrop';
import { Watermark } from './parts/Watermark';
import { Scene01 } from './s01/Scene01';
import { Scene02 } from './s02/Scene02';
import { Scene03 } from './s03/Scene03';
import { Scene04 } from './s04/Scene04';
import { Scene05 } from './s05/Scene05';
import { Scene06 } from './s06/Scene06';
import { Scene07 } from './s07/Scene07';
import { Scene08 } from './s08/Scene08';
import { Scene09 } from './s09/Scene09';
import { Scene10 } from './s10/Scene10';
import { Scene11 } from './s11/Scene11';
import { Scene12 } from './s12/Scene12';
import { Scene13 } from './s13/Scene13';
import { Scene14 } from './s14/Scene14';
import { Scene15 } from './s15/Scene15';
import { Scene16 } from './s16/Scene16';
import { Scene17 } from './s17/Scene17';
import { Scene18 } from './s18/Scene18';
import { Scene19 } from './s19/Scene19';
import { Scene20 } from './s20/Scene20';

loadFont('normal', { weights: ['600', '700', '800'], subsets: ['latin'] });

/**
 * SEMUA SCENE pada WAKTU GLOBAL (frame 0 = awal video) — pola Video 02. Komposisi ide per scene (Ide-S01 …) memotongnya lewat
 * <Sequence from={-awal}>, jadi sambungan antar-scene ikut terlihat dan tetap sinkron dengan VO & subtitle.
 * Scene ditambahkan di sini satu per satu saat dibangun (Simon 13 Okt: "generate perscene dulu").
 */
/** MODE UKUR: `ukur` = latar hijau tanpa watermark/subtitle/judul; `hanya` = satu scene saja ('S01'…) */
const IP = getInputProps() as { ukur?: boolean; hanya?: string };
const tampil = (sc: string) => !IP.hanya || IP.hanya === sc;

export const Babak: React.FC<{ vo?: boolean }> = ({ vo = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {IP.ukur ? <AbsoluteFill style={{ background: '#00FF00' }} /> : <Backdrop f={f} />}
      {tampil('S01') ? <Scene01 f={f} /> : null}
      {tampil('S02') ? <Scene02 f={f} /> : null}
      {tampil('S03') ? <Scene03 f={f} /> : null}
      {tampil('S04') ? <Scene04 f={f} /> : null}
      {tampil('S05') ? <Scene05 f={f} /> : null}
      {tampil('S06') ? <Scene06 f={f} /> : null}
      {tampil('S07') ? <Scene07 f={f} /> : null}
      {tampil('S08') ? <Scene08 f={f} /> : null}
      {tampil('S09') ? <Scene09 f={f} /> : null}
      {tampil('S10') ? <Scene10 f={f} /> : null}
      {tampil('S11') ? <Scene11 f={f} /> : null}
      {tampil('S12') ? <Scene12 f={f} /> : null}
      {tampil('S13') ? <Scene13 f={f} /> : null}
      {tampil('S14') ? <Scene14 f={f} /> : null}
      {tampil('S15') ? <Scene15 f={f} /> : null}
      {tampil('S16') ? <Scene16 f={f} /> : null}
      {tampil('S17') ? <Scene17 f={f} /> : null}
      {tampil('S18') ? <Scene18 f={f} /> : null}
      {tampil('S19') ? <Scene19 f={f} /> : null}
      {tampil('S20') ? <Scene20 f={f} /> : null}
      {vo ? <Sequence from={VO_OFFSET} layout="none"><Audio src={staticFile(VO_UTUH)} /></Sequence> : null}
      {IP.ukur ? null : <AbsoluteFill style={{ zIndex: 2 }}><Watermark /><Subtitles /></AbsoluteFill>}
    </AbsoluteFill>);
};
