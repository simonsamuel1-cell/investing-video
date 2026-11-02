import React from 'react';
import { AbsoluteFill } from 'remotion';
import { B, F } from '../theme';
import { BERDIRI, TEGAK_LURUS, TokohTegak, gaya } from './rigTegak';

/** UJI PANGGUL/BOKONG (26 Okt malam, Simon: "tambahkan bokong … aku tadi menambahkan tapi sepertinya terlalu kecil") — area pinggul diperbesar:
 * atas = gua (tunik), bawah = kota (celana), pose: tegak · berdiri · 4 fase jalan · 3 fase lari. */
export const UjiPanggul: React.FC = () => {
  const pose = [TEGAK_LURUS, BERDIRI, gaya(0, 0, 1), gaya(0.25, 0, 1), gaya(0.5, 0, 1), gaya(0.75, 0, 1), gaya(0.1, 1, 1), gaya(0.38, 1, 1), gaya(0.62, 1, 1)];
  const nama = ['tegak', 'berdiri', 'jalan 0', 'jalan 0.25', 'jalan 0.5', 'jalan 0.75', 'lari 0.1', 'lari 0.38', 'lari 0.62'];
  const S = 1.15;
  return (
    <AbsoluteFill style={{ background: B.white }}>
      <svg width={1920} height={1080}>
        {pose.map((p, k) => (
          <g key={k}>
            <g transform={`translate(0 ${-140})`}><TokohTegak x={110 + k * 212} tanah={640} s={S} pose={p} /></g>
            <g transform={`translate(0 ${-140})`}><TokohTegak x={110 + k * 212} tanah={1200} s={S} pose={p} kostum="kini" kepala="lihat" /></g>
            <text x={110 + k * 212} y={1065} textAnchor="middle" fontFamily={F} fontSize={18} fontWeight={700} fill={B.gray}>{nama[k]}</text>
          </g>))}
      </svg>
    </AbsoluteFill>);
};
