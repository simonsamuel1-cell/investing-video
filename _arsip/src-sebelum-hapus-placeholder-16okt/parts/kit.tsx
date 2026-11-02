import React from 'react';
import { Easing, Img, getInputProps, staticFile } from 'remotion';
import { ICON } from '../icons.gen';
import { IKON, type KunciIkon } from '../ikon';
import { SOROT_UKUR } from '../sorot.gen';
import { B, F, R, io } from '../theme';

/**
 * PERKAKAS RUMAH — disalin dari Video 10 (`mtf-episode/src/v10/kit.tsx`) supaya gerak & bentuknya
 * sama dengan episode yang sudah Simon setujui: tanjakan 60f dipusatkan di kata, pop ease-out-back
 * dengan waktu LINEAR, teks per kata = satu sapuan frasa (WordText), panel kaca, pil.
 */
export const D = 60;
export const LW = { hair: 1, fine: 1.8, main: 2.5 } as const;
/** MODE UKUR pusat isi (scripts/ukur-pusat.mjs): judul TEXT tidak dirender supaya yang terukur hanya ISI */
export const MODE_UKUR = (getInputProps() as { ukur?: boolean }).ukur === true;

/** tanjakan 60f DIPUSATKAN di kata pemicu (≈50% saat kata diucapkan) */
export const cin = (f: number, at: number, d = D, e = io) => R(f, at - d / 2, at + d / 2, 0, 1, e);
/** pertumbuhan garis/penghubung — ease IN-OUT cubic (Simon 7 Okt: semua animasi selain pop = inOut cubic; dulu out-cubic) */
export const grow = (f: number, at: number, d = D) => cin(f, at, d, io);

/** pop: skala 0→1 ease-out-back; waktunya WAJIB linear (jangan tumpuk easing) */
export const popScale = (p: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  const t = Math.max(0, Math.min(1, p));
  if (t <= 0) return 0;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
export const popIn = (f: number, at: number, d = D) => popScale(R(f, at - d / 2, at + d / 2, 0, 1, Easing.linear));
/** pop keluar: ease-IN-back 1→0 */
export const popOut = (f: number, at: number, d = D) => {
  const t = R(f, at - d / 2, at + d / 2, 0, 1, Easing.linear);
  const c1 = 1.70158, c3 = c1 + 1;
  return t >= 1 ? 0 : 1 - (c3 * t * t * t - c1 * t * t);
};

const WORD_SOFT = 0.45;
/** progres kata ke-i: sapuan frasa berjalan LINEAR, tiap kata punya tanjakan sendiri yang di-ease inOut cubic
 *  (Simon 7 Okt: semua fade = inOut cubic — dulu sapuannya yang di-ease lalu tiap kata = potongan linear kurva itu) */
const wordP = (sweepLinear: number, i: number, n: number) => {
  if (n <= 1) return io(Math.max(0, Math.min(1, sweepLinear)));
  const start = (i * (1 - WORD_SOFT)) / (n - 1);
  return io(Math.max(0, Math.min(1, (sweepLinear - start) / WORD_SOFT)));
};

/** teks per kata — SATU sapuan 60f per frasa, dipusatkan di `at` (Video 10 / CTA) */
export const WordText: React.FC<{
  children: string; at: number; f: number; until?: number; d?: number; style?: React.CSSProperties; rise?: number;
  /** spasi antar-kata di LUAR span → runtuh di ujung baris terbungkus, baris benar-benar rata tengah (label peta bab; Simon 8 Okt) */
  rataBaris?: boolean;
  /** geser per kata via translate3d + rotasi mikro, tak pernah tepat 0 → Chrome tidak membulatkan ke piksel bulat di ekor ease
   *  (judder 1 px, reference_chrome_pixel_snap). Opsional supaya scene lain tidak berubah. */
  halus?: boolean;
}> = ({ children, at, f, until, d = D, style, rise, rataBaris, halus }) => {
  const sweep = R(f, at - d / 2, at + d / 2, 0, 1); // linear — easing ada di tiap kata (wordP)
  const out = until === undefined ? 1 : R(f, until - d / 2, until + d / 2, 1, 0, io);
  const words = children.split(' ');
  const size = Number(style?.fontSize ?? 28);
  const up = rise ?? size * 0.42;
  return (
    <span style={{ ...style, display: 'inline-block', opacity: out }}>
      {words.map((w, i) => {
        const p = wordP(sweep, i, words.length);
        const akhir = i === words.length - 1;
        const tf = halus ? `translate3d(0, ${(1 - p) * up + 0.03}px, 0) rotate(0.001deg)` : `translateY(${(1 - p) * up}px)`;
        return rataBaris ? (
          <React.Fragment key={`${w}-${i}`}>
            <span style={{ display: 'inline-block', opacity: p, transform: tf, whiteSpace: 'pre' }}>{w}</span>
            {akhir ? null : ' '}
          </React.Fragment>) : (
          <span key={`${w}-${i}`} style={{ display: 'inline-block', opacity: p, transform: tf, whiteSpace: 'pre' }}>
            {w}{akhir ? '' : ' '}
          </span>);
      })}
    </span>);
};

/**
 * ikon stok — `name` = kunci di src/ikon.ts (satu sumber, tak ada ikon kembar). Path asli dari src/icons.gen.ts;
 * digeser sebesar selisih pusat TINTA (dx/dy, diukur gen-icons.py) supaya tidak menceng di dalam lingkaran/kotak.
 */
export const Icon: React.FC<{ name: KunciIkon; size: number; color: string; style?: React.CSSProperties }> = ({ name, size, color, style }) => {
  const ic = ICON[IKON[name]];
  if (!ic) throw new Error(`ikon ${name} (${IKON[name]}) belum dibangkitkan — jalankan scripts/gen-icons.py`);
  // ukuran visual disamakan: sisi terpanjang tinta = 90% kotak (ikon Flaticon memenuhi kotaknya lebih penuh dari MingCute)
  const k = Math.max(0.7, Math.min(1.3, 0.9 / ic.isi));
  return (
    <svg viewBox={ic.vb} width={size} height={size}
      style={{ display: 'block', color, ...style, transform: `translate(${-ic.dx * size * k}px, ${-ic.dy * size * k}px) scale(${k})${style?.transform ? ` ${style.transform}` : ''}` }}
      dangerouslySetInnerHTML={{ __html: ic.body }} />);
};

export type Rect = { x: number; y: number; w: number; h: number };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const rectLerp = (a: Rect, b: Rect, t: number): Rect => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });

/** panel kaca rumah (Video 10 `Panel`): putih 82%, sudut 28, pendar turkis tipis + bayangan biru */
export const glass = (accent: string = B.turq): React.CSSProperties => ({
  background: 'rgba(255,255,255,.82)', borderRadius: 28,
  boxShadow: `0 0 0 1.5px ${accent}33, 0 0 44px 6px ${accent}26, 0 24px 60px -22px ${B.blue}33`,
});

/** kartu rumah (Video 10 `Card` / CTA): putih penuh, sudut 32, pendar berwarna */
export const card = (accent: string): React.CSSProperties => ({
  background: B.white, borderRadius: 32,
  boxShadow: `0 0 0 1px rgba(255,255,255,.9), 0 28px 64px -14px ${accent}59, 0 8px 20px -8px ${B.blue}1f`,
});

/**
 * KACA PEMBESAR realistis — stok Freepik 6424 (04_Asset/magnifying-glass-checkered-background.zip), Simon 8 Okt: "ganti kaca pembesarnya
 * dengan ini, dan jangan dikasih background lingkaran berwarna ungu". Latar kotak-kotak dibuang; lensa (lapisan Screen/Color Dodge) dibuat
 * BENING: diekspor di atas hitam & putih lalu alfa = 1 − (putih − hitam) → Screen = putih beralfa. (x, y) = PUSAT LENSA (posisi lencana
 * lama), d = diameter luar bingkai lensa (= diameter lencana lama); gagang ke kanan-bawah; pop berporos di pusat lensa.
 */
const KACA_LENSA = { cx: 0.298, cy: 0.298, d: 0.586 }; // terukur dari bingkai lensa di public/stok/kaca-pembesar.png (1201 px)
export const KacaPembesar: React.FC<{ x: number; y: number; d: number; s?: number; geserCss?: (x: number, y: number) => string }> = ({ x, y, d, s = 1, geserCss }) => {
  if (s <= 0.001) return null;
  const W = d / KACA_LENSA.d, ox = KACA_LENSA.cx * W, oy = KACA_LENSA.cy * W;
  return (
    <Img src={staticFile('stok/kaca-pembesar.png')} style={{ position: 'absolute', left: geserCss ? 0 : x - ox, top: geserCss ? 0 : y - oy, width: W, height: W,
      transform: `${geserCss ? geserCss(x - ox, y - oy) + ' ' : ''}scale(${s})`, transformOrigin: `${ox}px ${oy}px` }} />);
};

/** pil label khas Tuntun: isi putih, tepi berwarna 2,5 px, teks gelap — pop dari `p` */
export const Pill: React.FC<{ x: number; y: number; text: string; p: number; col: string; size?: number; icon?: KunciIkon; anchor?: 'left' | 'center' }> =
  ({ x, y, text, p, col, size = 28, icon, anchor = 'left' }) => p <= 0.001 ? null : (
    <div style={{
      position: 'absolute', left: x, top: y, transform: `translate(${anchor === 'center' ? '-50%' : '0'}, -50%) scale(${p})`,
      transformOrigin: 'center', // pop berporos di TENGAH pil (Simon 7 Okt: anchor point di tengah visual) — dulu tepi kiri
      display: 'flex', alignItems: 'center', gap: 10,
      background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: `${size * 0.38}px ${size * 0.9}px`,
      fontFamily: F, fontSize: size, fontWeight: 700, color: B.night, whiteSpace: 'nowrap', lineHeight: 1,
    }}>
      {icon ? <Icon name={icon} size={size * 1.05} color={col} /> : null}
      {text}
    </div>);

/**
 * KOTAK SOROT kata judul — dipakai judul Scene 01/02/03. Simon 7 Okt: "box highlight textnya kurang besar sedikit … terlalu
 * mepet … pastikan tetap center", lalu "return" "kurang kecenter". Kotak dihitung dari TINTA kata itu sendiri
 * (src/sorot.gen.ts, diukur scripts/gen-sorot.py dari render Remotion): jarak tinta ke tepi atas = bawah = 12 px,
 * kiri = kanan = 20 px; kotak berjarak `celah` 4 px lebih jauh dari kata sebelumnya daripada spasi biasa (dulu 8 px, terlalu mepet).
 * Kata tanpa ukuran → galat (tambahkan di src/sorotKata.ts lalu jalankan gen-sorot.py).
 */
const SOROT = { padX: 20, padY: 12, radius: 12, celah: 4 };
/** metrik kotak sorot kata `w` di ukuran `size` (px) — satu sumber untuk <Sorot> dan geserSorot() */
const ukurSorot = (w: string, size: number) => {
  const u0 = SOROT_UKUR[w];
  if (!u0) throw new Error(`kotak sorot "${w}" belum diukur — tambahkan di src/sorotKata.ts lalu jalankan scripts/gen-sorot.py`);
  const k = size / 52; // metrik tinta diukur di 52 px; ukuran lain = skala linear
  const u = { lebar: u0.lebar * k, kiri: u0.kiri * k, kanan: u0.kanan * k, atas: u0.atas * k, bawah: u0.bawah * k };
  const S = { padX: SOROT.padX * k, padY: SOROT.padY * k, radius: SOROT.radius * k, celah: SOROT.celah * k };
  const padL = S.padX - u.kiri, padR = S.padX - (u.lebar - u.kanan);
  return { u, S, padL, padR };
};
/**
 * SPASI JUDUL (Simon 7 Okt: "spacing textnya tidak konsisten, ada yang terlalu lebar, ada yang sangat sempit").
 * Ruang kotak (celah + padding kiri + kanan) dipesan di tata letak sejak awal, jadi SEBELUM kotak tampil kata yang akan
 * disorot dulu berjarak +-30 px dari kata sebelumnya. Kini kata-kata SEBELUM kotak digeser ke kanan sejauh nilai ini x (1 - h)
 * (dan kata sorot sendiri sedikit ke kiri, di dalam <Sorot>): sebelum disorot jaraknya = spasi biasa dan baris tetap di tengah;
 * saat kotak menyapu (60f yang sama) kata-kata itu meluncur ke posisi akhirnya. Transform, bukan tata letak.
 */
export const geserSorot = (w: string, size = 52) => {
  const { S, padL, padR } = ukurSorot(w, size);
  return (S.celah + padL + padR) / 2;
};
export const Sorot: React.FC<{ w: string; h: number; col?: string; size?: number }> = ({ w, h, col = '#5F4DEE', size = 52 }) => {
  const { u, S, padL, padR } = ukurSorot(w, size);
  // pasangan geserSorot: kata sorot ke kiri selama kotak belum tampil, supaya baris tetap berpusat di 960
  const geserKiri = ((S.celah + padL - padR) / 2) * (1 - h);
  // tepi KIRI kotak ikut kata sebelumnya yang sedang meluncur (jarak tetap = celah + spasi → tak pernah menimpa kata itu);
  // tepi KANAN menyapu ke kanan. Huruf putih = salinan kata yang dipotong oleh kotak itu sendiri (overflow hidden).
  const L = (S.celah + padL) * (1 - h);
  const atas = u.atas - S.padY;
  return (
    <span style={{ position: 'relative', display: 'inline-block', marginLeft: S.celah, paddingLeft: padL, paddingRight: padR, transform: geserKiri ? `translateX(${-geserKiri}px)` : undefined }}>
      <span style={{ position: 'relative' }}>{w}</span>
      {h > 0 ? (
        <span style={{ position: 'absolute', left: L, top: atas, height: u.bawah - u.atas + 2 * S.padY, width: `calc(${h} * (100% - ${L}px))`, background: col, borderRadius: S.radius, overflow: 'hidden', opacity: Math.min(1, h * 6) }}>
          <span style={{ position: 'absolute', left: padL - L, top: -atas, color: '#FFFFFF', whiteSpace: 'pre' }}>{w}</span>
        </span>) : null}
    </span>);
};
