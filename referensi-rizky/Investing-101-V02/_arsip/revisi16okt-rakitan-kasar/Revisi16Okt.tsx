import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Babak } from './Babak';
import { CUES, SCENES } from './cues-v5';
import { VO_OFFSET } from './offset';
import { Subtitles } from './Subtitles';
import { Watermark } from './parts/Watermark';
import { PETA_REVISI, TOTAL_REVISI } from './revisi16okt.gen';
import { VO_REVISI } from './vo';

/**
 * RAKITAN NASKAH REVISI 16 OKT — VO v5 (scripts/splice-vo3.py) + subtitle v5 (src/cues-v5.ts) di atas visual yang sudah ada.
 * Visual = Babak (13 scene lama) pada frame LAMA hasil peta waktu (scripts/peta-revisi.py → src/revisi16okt.gen.ts):
 *  · S01, S02, S04, S06, S10 — narasi identik dengan VO v4 → visual lamanya digeser utuh (laju 1), tetap sinkron per kata.
 *  · S03, S05, S07, S08, S09 — narasi BERUBAH → visual scene lama padanannya (S03+S04, S06, S08, S09, S12) diregangkan ke
 *    durasi barunya. SEMENTARA: belum sinkron dengan narasi baru, menunggu revisi visual sesuai kolom VISUAL naskah revisi.
 * Scene lama 10–11 (Volatilitas ≠ Risiko, saat harga turun) dihapus dari naskah revisi → tidak diputar.
 * Komposisi utama `InvestmentInstruments` (VO v4) TIDAK diubah.
 */
export const REVISI_LEN = TOTAL_REVISI;

export const petaLama = (n: number): number => {
  const p = PETA_REVISI.find(([, n0, n1]) => n >= n0 && n < n1) ?? PETA_REVISI[PETA_REVISI.length - 1];
  const [, n0, n1, o0, o1] = p;
  return o0 + ((n - n0) * (o1 - o0)) / (n1 - n0);
};

export const Revisi16Okt: React.FC = () => {
  const n = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {SCENES.map((s) => {
        const sinkron = PETA_REVISI.find(([k]) => k === s.n)?.[5];
        return (
          <Sequence key={s.n} from={s.a} durationInFrames={s.b - s.a} layout="none"
            name={`SCENE ${String(s.n).padStart(2, '0')} · ${s.bab}${sinkron ? '' : ' · VISUAL LAMA (belum direvisi)'}`}>
            {null}
          </Sequence>);
      })}
      <Babak f={petaLama(n)} vo={false} atas={false} />
      <Sequence from={VO_OFFSET} layout="none"><Audio src={staticFile(VO_REVISI)} /></Sequence>
      <AbsoluteFill style={{ zIndex: 2 }}><Watermark /><Subtitles cues={CUES} /></AbsoluteFill>
    </AbsoluteFill>);
};
