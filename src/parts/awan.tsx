import React from 'react';
import { B } from '../theme';
import { skalaPop } from './kit';
import { popIn, } from './pop';
import { geser } from './kaca';

/**
 * AWAN PIKIRAN — salinan berparameter dari awan Scene 05 (= Video 05 Scene 01; Scene 05 tetap memakai salinannya sendiri supaya tidak tersentuh).
 * Simon 29 Okt (S12): "Untuk adegan pertanyaan gunakan thinking bubble alih alih menempatkan text diatas orang". Badan awan pop berporos tengah; dua titik
 * pikiran (kecil dekat kepala → besar dekat awan) pop berurutan 10 f sebelum awan.
 */
const BENTUK: [number, number, number, number][] = [ // cx, cy, rx, ry (kotak acuan 400 × 284)
  [60, 140, 58, 58], [135, 82, 72, 72], [250, 72, 78, 78], [338, 145, 62, 62], [262, 210, 70, 70], [140, 205, 75, 75], [200, 145, 140, 95]];
export const AwanPikir: React.FC<{ x: number; y: number; w: number; h: number; p: number; children?: React.ReactNode }> = ({ x, y, w, h, p, children }) => {
  if (p <= 0.001) return null;
  const bentuk = (props: React.SVGProps<SVGEllipseElement>) => BENTUK.map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} vectorEffect="non-scaling-stroke" {...props} />);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: 'center', transform: `${geser(x - w / 2, y - h / 2)} scale(${skalaPop(p)})` }}>
      <svg width={w} height={h} viewBox="0 0 400 284" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <g transform="translate(0 14)">{bentuk({ fill: B.blue, opacity: 0.07 })}</g>
        <g>{bentuk({ fill: B.white, stroke: B.grayLite, strokeWidth: 6 })}</g>
        <g>{bentuk({ fill: B.white })}</g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>{children}</div>
    </div>);
};
/** dua titik pikiran: `titik` = [kecil, besar] (x, y, r) — pop di t0 (kecil) dan t0 + 10 (besar), keluar terbalik */
export const TitikPikir: React.FC<{ f: number; titik: [number, number, number][]; masuk: number; keluar: number }> = ({ f, titik, masuk, keluar }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
    {titik.map(([x, y, r], k) => {
      const p = popIn(f, masuk + 10 * k) * (1 - Math.min(1, Math.max(0, (f - (keluar + 10 * (1 - k) - 30)) / 60)));
      return p <= 0.001 ? null : <circle key={k} cx={x} cy={y} r={r * skalaPop(p)} fill={B.white} stroke={B.grayLite} strokeWidth={3} />;
    })}
  </svg>);
