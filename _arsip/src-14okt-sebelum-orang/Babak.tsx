import React from 'react';
import { AbsoluteFill, Audio, Sequence, getInputProps, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import { VO_OFFSET } from './offset';
import { VO_UTUH } from './vo';
import { Subtitles } from './Subtitles';
import { Backdrop } from './parts/Backdrop';
import { Watermark } from './parts/Watermark';
import { Scene01 } from './s01/Scene01';
import { KonteksSkala, SKALA } from './skala';
import { RS02 } from './revisi/RS02';
import { RS03 } from './revisi/RS03';
import { RS04 } from './revisi/RS04';
import { RS05 } from './revisi/RS05';
import { RS06 } from './revisi/RS06';
import { RS07 } from './revisi/RS07';
import { RS08 } from './revisi/RS08';
import { RS09 } from './revisi/RS09';
import { RS10 } from './revisi/RS10';
import { RS11 } from './revisi/RS11';
import { RS12 } from './revisi/RS12';
import { RS13 } from './revisi/RS13';
import { RS14 } from './revisi/RS14';
import { RS15 } from './revisi/RS15';
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
 * 14 Okt: Scene 02–15 = versi REVISI (evaluasi 5 pertanyaan, `src/revisi/RSxx.tsx`); versi lama diarsipkan di `_arsip/src-14okt-sebelum-revisi/`
 * (berkas s02…s15 tetap ada karena Scene04 dipakai RS04 dan beberapa konstanta serah-terima diimpor dari sana).
 */
/** MODE UKUR: `ukur` = latar hijau tanpa watermark/subtitle/judul; `hanya` = satu scene saja ('S01'…) */
const IP = getInputProps() as { ukur?: boolean; hanya?: string };
const tampil = (sc: string) => !IP.hanya || IP.hanya === sc;

/** pembungkus adegan: skala seragam terhadap pusat frame + konteks skala (Judul membalik skala, masker mengonversi titik tujuan) */
const Adegan: React.FC<{ k: number; children: React.ReactNode }> = ({ k, children }) => k === 1 ? <>{children}</> : (
  <KonteksSkala.Provider value={k}>
    <AbsoluteFill style={{ transformOrigin: '960px 540px', transform: `scale(${k})` }}>{children}</AbsoluteFill>
  </KonteksSkala.Provider>);

export const Babak: React.FC<{ vo?: boolean }> = ({ vo = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {IP.ukur ? <AbsoluteFill style={{ background: '#00FF00' }} /> : <Backdrop f={f} />}
      {tampil('S01') ? <Adegan k={SKALA.S01}><Scene01 f={f} /></Adegan> : null}
      {tampil('S02') ? <Adegan k={SKALA.S02}><RS02 f={f} /></Adegan> : null}
      {tampil('S03') ? <Adegan k={SKALA.S03}><RS03 f={f} /></Adegan> : null}
      {tampil('S04') ? <Adegan k={SKALA.S04}><RS04 f={f} /></Adegan> : null}
      {tampil('S05') ? <Adegan k={SKALA.S05}><RS05 f={f} /></Adegan> : null}
      {tampil('S06') ? <Adegan k={SKALA.S06}><RS06 f={f} /></Adegan> : null}
      {tampil('S07') ? <Adegan k={SKALA.S07}><RS07 f={f} /></Adegan> : null}
      {tampil('S08') ? <Adegan k={SKALA.S08}><RS08 f={f} /></Adegan> : null}
      {tampil('S09') ? <Adegan k={SKALA.S09}><RS09 f={f} /></Adegan> : null}
      {tampil('S10') ? <Adegan k={SKALA.S10}><RS10 f={f} /></Adegan> : null}
      {tampil('S11') ? <Adegan k={SKALA.S11}><RS11 f={f} /></Adegan> : null}
      {tampil('S12') ? <Adegan k={SKALA.S12}><RS12 f={f} /></Adegan> : null}
      {tampil('S13') ? <Adegan k={SKALA.S13}><RS13 f={f} /></Adegan> : null}
      {tampil('S14') ? <Adegan k={SKALA.S14}><RS14 f={f} /></Adegan> : null}
      {tampil('S15') ? <Adegan k={SKALA.S15}><RS15 f={f} /></Adegan> : null}
      {tampil('S16') ? <Adegan k={SKALA.S16}><Scene16 f={f} /></Adegan> : null}
      {tampil('S17') ? <Adegan k={SKALA.S17}><Scene17 f={f} /></Adegan> : null}
      {tampil('S18') ? <Adegan k={SKALA.S18}><Scene18 f={f} /></Adegan> : null}
      {tampil('S19') ? <Adegan k={SKALA.S19}><Scene19 f={f} /></Adegan> : null}
      {tampil('S20') ? <Adegan k={SKALA.S20}><Scene20 f={f} /></Adegan> : null}
      {vo ? <Sequence from={VO_OFFSET} layout="none"><Audio src={staticFile(VO_UTUH)} /></Sequence> : null}
      {IP.ukur ? null : <AbsoluteFill style={{ zIndex: 2 }}><Watermark /><Subtitles /></AbsoluteFill>}
    </AbsoluteFill>);
};
