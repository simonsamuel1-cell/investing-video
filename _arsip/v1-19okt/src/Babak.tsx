import React from 'react';
import { AbsoluteFill, Audio, Sequence, getInputProps, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import { VO_OFFSET } from './offset';
import { VO_UTUH } from './vo';
import { Subtitles } from './Subtitles';
import { Backdrop } from './parts/Backdrop';
import { Watermark } from './parts/Watermark';
import { AUDIT, AuditLayer, AuditProbe } from './audit/AuditProbe';
import { KonteksSkala, SKALA } from './skala';
import { Scene01 } from './s01/Scene01';
import { Scene02 } from './s02/Scene02';
import { Scene03 } from './s03/Scene03';
import { Scene04 } from './s04/Scene04';
import { Scene05 } from './s05/Scene05';
import { Scene06 } from './s06/Scene06';
import { Scene07 } from './s07/Scene07';
import { Scene08 } from './s08/Scene08';

loadFont('normal', { weights: ['600', '700', '800'], subsets: ['latin'] });

/**
 * SEMUA SCENE pada WAKTU GLOBAL (frame 0 = awal video) — pola Video 02/03. Komposisi ide per scene (Ide-S01 …) memotongnya lewat
 * <Sequence from={-awal}>, jadi sambungan antar-scene ikut terlihat dan tetap sinkron dengan VO & subtitle.
 * TAHAP 1 (19 Okt): latar + VO + watermark + subtitle saja; scene ditambahkan di sini satu per satu saat dibangun (bungkus <Adegan k={SKALA.Sxx}>).
 */
/** MODE UKUR: `ukur` = latar hijau tanpa watermark/subtitle/judul; `hanya` = satu scene saja ('S01'…) */
const IP = getInputProps() as { ukur?: boolean; hanya?: string };
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
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }} {...(AUDIT ? { 'data-audit-root': '' } : {})}>
      {AUDIT ? <AuditProbe /> : null}
      <AuditLayer name="Backdrop">{IP.ukur ? <AbsoluteFill style={{ background: '#00FF00' }} /> : <Backdrop f={f} />}</AuditLayer>
      {tampil('S01') ? <Adegan k={SKALA.S01} nama="S01"><Scene01 f={f} /></Adegan> : null}
      {tampil('S02') ? <Adegan k={SKALA.S02} nama="S02"><Scene02 f={f} /></Adegan> : null}
      {tampil('S03') ? <Adegan k={SKALA.S03} nama="S03"><Scene03 f={f} /></Adegan> : null}
      {tampil('S04') ? <Adegan k={SKALA.S04} nama="S04"><Scene04 f={f} /></Adegan> : null}
      {tampil('S05') ? <Adegan k={SKALA.S05} nama="S05"><Scene05 f={f} /></Adegan> : null}
      {tampil('S06') ? <Adegan k={SKALA.S06} nama="S06"><Scene06 f={f} /></Adegan> : null}
      {tampil('S07') ? <Adegan k={SKALA.S07} nama="S07"><Scene07 f={f} /></Adegan> : null}
      {tampil('S08') ? <Adegan k={SKALA.S08} nama="S08"><Scene08 f={f} /></Adegan> : null}
      {vo && VO_UTUH ? <Sequence from={VO_OFFSET} layout="none"><Audio src={staticFile(VO_UTUH)} /></Sequence> : null}
      {IP.ukur ? null : <AbsoluteFill style={{ zIndex: 2 }}><AuditLayer name="Watermark"><Watermark /></AuditLayer><AuditLayer name="Subtitle"><Subtitles /></AuditLayer></AbsoluteFill>}
    </AbsoluteFill>);
};
