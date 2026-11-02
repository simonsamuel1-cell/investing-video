import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';
import { Backdrop } from './parts/Backdrop';
import { Watermark } from './parts/Watermark';
import { B, F, HOUSE } from './theme';
import { bayanganKaca } from './parts/kaca';
import { SUB_Y } from './Subtitles';

loadFont('normal', { weights: ['600', '700', '800'], subsets: ['latin'] });

/** UJI LATAR — bukan isi video. Frame 0 = ungu · 1 = biru · 2 = krim. Teks contoh = baris naskah Scene 01 (kata per kata). */
export const UJI_LATAR = 3;
const RONA = [HOUSE.ungu, HOUSE.biru, HOUSE.krim];
export const UjiLatar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop f={0} hue={RONA[f % 3]} />
      <Watermark />
      <div style={{ position: 'absolute', top: 64, left: 0, right: 0, textAlign: 'center', fontFamily: F, fontWeight: 800, fontSize: 50, letterSpacing: '-.02em', color: B.night }}>
        Urutannya jangan dibalik.
      </div>
      <div style={{ position: 'absolute', left: 660, top: 330, width: 600, height: 360, borderRadius: 32, background: 'linear-gradient(165deg, rgba(255,255,255,.98), rgba(255,255,255,.9))', boxShadow: bayanganKaca(B.blue, 1), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 800, fontSize: 40, color: B.night }}>
        Kartu kaca
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: SUB_Y, display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: '8px 20px', fontFamily: F, fontSize: 35, fontWeight: 700, color: B.blue, letterSpacing: '-.01em', lineHeight: 1.25 }}>
          Masih ingat sungai yang kemarin?
        </div>
      </div>
    </AbsoluteFill>);
};
