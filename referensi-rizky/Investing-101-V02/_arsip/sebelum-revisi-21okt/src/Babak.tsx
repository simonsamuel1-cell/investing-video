import React from 'react';
import { AbsoluteFill, Audio, Sequence, getInputProps, staticFile, useCurrentFrame } from 'remotion';
import { VO_OFFSET } from './offset';
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import { Subtitles } from './Subtitles';
import { VO_UTUH } from './vo';
import { Backdrop } from './parts/Backdrop';
import { Watermark } from './parts/Watermark';
import { AUDIT, AuditLayer, AuditProbe } from './audit/AuditProbe';
import { Scene01 } from './s01/Scene01';
import { Scene02 } from './s02/Scene02';
import { Scene03 } from './s03/Scene03';
import { Scene05 } from './s05/Scene05';
import { Scene06 } from './s06/Scene06';
import { Scene07 } from './s07/Scene07';
import { Scene08 } from './s08/Scene08';
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
    <AbsoluteFill style={{ overflow: 'hidden' }} {...(AUDIT ? { 'data-audit-root': '' } : {})}>
      {/* AUDIT (inputProps.audit, scripts/audit-tabrakan.mjs — port Video 03 16 Okt): probe + lapisan bernama per scene; render biasa TIDAK berubah */}
      {AUDIT ? <AuditProbe /> : null}
      <AuditLayer name="Backdrop">{IP.ukur ? <AbsoluteFill style={{ background: '#00FF00' }} /> : <Backdrop f={f} />}</AuditLayer>
      {tampil('S01') ? <AuditLayer name="S01"><Scene01 f={f} /></AuditLayer> : null}
      {tampil('S02') ? <AuditLayer name="S02"><Scene02 f={f} /></AuditLayer> : null}
      {tampil('S03') ? <AuditLayer name="S03"><Scene03 f={f} /></AuditLayer> : null}
      {tampil('S05') ? <AuditLayer name="S04"><Scene05 f={f} /></AuditLayer> : null}
      {tampil('S06') ? <AuditLayer name="S05"><Scene06 f={f} /></AuditLayer> : null}
      {tampil('S07') ? <AuditLayer name="S06"><Scene07 f={f} /></AuditLayer> : null}
      {/* Saham: naskah revisi S07 + S08 = satu komponen */}
      {tampil('S08') || tampil('S09') ? <AuditLayer name="S07-08"><Scene08 f={f} /></AuditLayer> : null}
      {tampil('S12') ? <AuditLayer name="S09"><Scene12 f={f} /></AuditLayer> : null}
      {tampil('S13') ? <AuditLayer name="S10"><Scene13 f={f} /></AuditLayer> : null}
      {/* VO mulai 00:00.31 (Simon 7 Okt) — animasi tetap dari 0 */}
      {vo ? <Sequence from={VO_OFFSET} layout="none"><Audio src={staticFile(VO_UTUH)} /></Sequence> : null}
      {/* lapisan teratas: scene yang sedang keluar lewat masker naik ke zIndex 1 (di atas peta bab scene berikutnya) */}
      {IP.ukur || !atas ? null : <AbsoluteFill style={{ zIndex: 2 }}><AuditLayer name="Watermark"><Watermark /></AuditLayer><AuditLayer name="Subtitle"><Subtitles /></AuditLayer></AbsoluteFill>}
    </AbsoluteFill>);
};
