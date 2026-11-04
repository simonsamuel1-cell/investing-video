import React from 'react';
import { TOKO } from './toko.gen';

/**
 * TOKO — ilustrasi "bisnis" (Simon 8 Okt: "tambahkan illustrasi bisnis berkembang juga untuk di saham"): stok Flowbite Illustrations
 * (MIT) diwarnai ulang ungu brand, teks Inggris dibuang (scripts/toko.py). SVG langsung; posisi lewat translate3d + rotasi mikro.
 * `id` = awalan gradien UNIK per salinan (beberapa toko di layar yang sama tidak boleh berbagi id).
 */
export const TOKO_RASIO = 463 / 772;
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
/** pusat x, tepi BAWAH `dasar`, lebar w; `s` = skala berporos di tengah-bawah (toko "tumbuh" dari tanah) */
export const Toko: React.FC<{ x: number; dasar: number; w: number; s?: number; op?: number; id: string }> = ({ x, dasar, w, s = 1, op = 1, id }) => {
  const svg = React.useMemo(() => TOKO.svg.replace(/paint(\d+)_linear_749_12/g, `${id}g$1`), [id]);
  if (s <= 0.001 || op <= 0.001) return null;
  const h = w * TOKO_RASIO;
  return <svg viewBox={TOKO.vb} width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: op, transformOrigin: `${w / 2}px ${h}px`, transform: `${geser(x - w / 2, dasar - h)} scale(${s})` }} dangerouslySetInnerHTML={{ __html: svg }} />;
};
