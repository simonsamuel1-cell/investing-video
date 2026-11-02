import React from 'react';

/**
 * JAM BERJALAN (Simon 13 Okt: "jarum panjang dan pendek bergerak bersamaan (kurang realistis)") — dulu seluruh ikon `waktu` diputar.
 * Kini rupa SAMA dengan ikon stok mingcute:time-fill (lingkaran r10 di kotak 24, jarum tebal 2 berujung bulat berupa "lubang" warna latar,
 * jarum panjang 5, jarum pendek 4,24) tetapi kedua jarum bergerak terpisah seperti jam sungguhan:
 * `menit` = menit yang berlalu → jarum panjang 6°/menit, jarum pendek 0,5°/menit (12× lebih lambat).
 * Ukuran tampil sama dengan <Icon name="waktu"> (skala 0,9 / isi 0,835).
 */
export const JamBerjalan: React.FC<{ size: number; color: string; latar: string; menit: number }> = ({ size, color, latar, menit }) => {
  const k = 0.9 / 0.835;
  // mulai pukul 3.00 (jarum panjang di 12, jarum pendek di 3) → posisi kedua jarum selalu menunjuk jam yang mungkin (3.00 → 5.00 untuk 120 menit)
  const aM = ((-90 + 6 * menit) * Math.PI) / 180, aJ = ((0 + 0.5 * menit) * Math.PI) / 180;
  const ujung = (a: number, r: number) => `${(12 + r * Math.cos(a)).toFixed(3)} ${(12 + r * Math.sin(a)).toFixed(3)}`;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', transform: `scale(${k})` }}>
      <circle cx={12} cy={12} r={10} fill={color} />
      <path d={`M12 12 L${ujung(aJ, 4.243)}`} stroke={latar} strokeWidth={2} strokeLinecap="round" fill="none" />
      <path d={`M12 12 L${ujung(aM, 5)}`} stroke={latar} strokeWidth={2} strokeLinecap="round" fill="none" />
    </svg>);
};
