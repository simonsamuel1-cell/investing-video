import React, { useEffect } from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { SCENES } from './cues';
import { Babak } from './Babak';

/**
 * Investing 101 · Video 03 — Tiga Jenis Uang.
 * RAKITAN (13 Okt, pola Video 02 8 Okt): komposisi utama = Babak (20 scene pada waktu global + latar + VO + watermark + subtitle) —
 * sumber yang SAMA dengan komposisi Ide-S01…S20 yang tetap ada untuk review per scene. Dulu (tahap 1) hanya latar + VO + subtitle.
 * Tiap scene naskah tetap terpasang sebagai <Sequence> bernama (penanda timeline Studio, tanpa isi).
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
      <Babak />
    </AbsoluteFill>
  );
};
