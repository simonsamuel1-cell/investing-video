import React, { useEffect } from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { SCENES } from './cues';
import { Babak } from './Babak';
import { OUTRO_AT, OUTRO_N } from './outro/plan.gen';

/**
 * Investing 101 · Video 06 — Kesalahan yang Paling Sering Dilakukan Investor.
 * TAHAP 1 (23 Okt, pola Video 05): komposisi utama = Babak (latar + VO + watermark + subtitle). Scene ditambahkan ke Babak saat dibangun.
 * Tiap scene naskah terpasang sebagai <Sequence> bernama (penanda timeline Studio, tanpa isi).
 */
export const Episode: React.FC = () => {
  const f = useCurrentFrame();
  // PROBE PEMUTARAN Studio (hanya bila scripts/studio_fps.mjs memasang window.__pb)
  useEffect(() => {
    const w = window as unknown as { __pb?: [number, number][] };
    if (w.__pb) w.__pb.push([f, performance.now()]);
  }, [f]);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {SCENES.map((s) => (
        <Sequence key={s.n} from={s.a} durationInFrames={s.b - s.a} name={`SCENE ${String(s.n).padStart(2, '0')} · ${s.bab}`} layout="none">
          {null}
        </Sequence>
      ))}
      <Sequence from={OUTRO_AT} durationInFrames={OUTRO_N} name="OUTRO · Di video selanjutnya" layout="none">{null}</Sequence>
      <Babak />
    </AbsoluteFill>
  );
};

/** garis bantu alignment (komposisi KesalahanInvestor-Guide) — tanpa VO, lapisan Guide di atas semuanya */
export const EpisodeGuide: React.FC = () => <Babak vo={false} guide />;
