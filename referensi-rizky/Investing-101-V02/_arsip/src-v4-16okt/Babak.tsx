import React from 'react';
import { AbsoluteFill, Audio, Sequence, getInputProps, staticFile, useCurrentFrame } from 'remotion';
import { VO_OFFSET } from './offset';
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import { Subtitles } from './Subtitles';
import { VO_UTUH } from './vo';
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

loadFont('normal', { weights: ['600', '700', '800'], subsets: ['latin'] });

/**
 * SEMUA SCENE pada WAKTU GLOBAL (frame 0 = awal VO). Komposisi ide per scene memotongnya lewat
 * <Sequence from={-awal}> sehingga sambungan antar-scene ikut terlihat dan tetap sinkron dengan VO & subtitle.
 */
/** MODE UKUR (scripts/ukur-pusat.mjs): `ukur` = latar putih tanpa watermark/subtitle; `hanya` = satu scene saja ('S01'…) */
const IP = getInputProps() as { ukur?: boolean; hanya?: string };
const tampil = (sc: string) => !IP.hanya || IP.hanya === sc;

/** `f` = frame lama yang dipaksakan (rakitan Revisi-16Okt memetakan waktu baru → lama); `atas` = watermark + subtitle v4 */
export const Babak: React.FC<{ vo?: boolean; f?: number; atas?: boolean }> = ({ vo = true, f: paksa, atas = true }) => {
  const kini = useCurrentFrame();
  const f = paksa ?? kini;
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
      {/* VO mulai 00:00.31 (Simon 7 Okt) — animasi tetap dari 0 */}
      {vo ? <Sequence from={VO_OFFSET} layout="none"><Audio src={staticFile(VO_UTUH)} /></Sequence> : null}
      {/* lapisan teratas: scene yang sedang keluar lewat masker naik ke zIndex 1 (di atas peta bab scene berikutnya) */}
      {IP.ukur || !atas ? null : <AbsoluteFill style={{ zIndex: 2 }}><Watermark /><Subtitles /></AbsoluteFill>}
    </AbsoluteFill>);
};
