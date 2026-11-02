import React from 'react';
import { Img, staticFile } from 'remotion';
import { B, F, R, SISI, io, lerp } from '../theme';
import { Kaca, geser, type GeoKartu, type PoseKarakter } from './kaca';
import { MODE_TANPA_FOTO, skalaPop, type Arah } from './kit';

/**
 * LINGKARAN untuk rombak VI V01 (30 Okt) — satu bentuk dasar yang DIBAWA antaradegan (Simon: "bentuk sama dibawa/digabung"; "lingkaran MORF jadi panel"):
 *  · KacaBulat = kartu kaca berbentuk lingkaran (badan & bayangan SAMA dengan Kaca/KacaMorf) + cincin warna → bisa memekar jadi panel / panel mengerut
 *    jadi lingkaran tanpa loncatan gaya (KacaMorf dengan a/b = geoBulat).
 *  · FotoLingkar = foto benda/orang di lingkaran putih bercincin: foto SWIPE NAIK di dalam masker lingkaran (Simon 29 Okt), bagian di atas garis tengah utuh.
 */
export const geoBulat = (x: number, y: number, d: number, warna: string): GeoKartu => ({ x, y, w: d, h: d, warna, radius: d / 2 });

/** `p` = pop masuk (linear 0…1, easeOutBack di Kaca) · `keluar` = swipe keluar (linear 1→0) · `tepi` = cincin warna (bawaan penuh) */
export const KacaBulat: React.FC<{ x: number; y: number; d: number; warna: string; p: number; keluar?: number; arah?: Arah; tepi?: number; padat?: boolean; alfa?: number; children?: React.ReactNode }> =
  ({ x, y, d, warna, p, keluar = 1, arah, tepi = 1, padat = false, alfa = 1, children }) => (
    <Kaca x={x} y={y} w={d} h={d} radius={d / 2} p={p} keluar={keluar} arah={arah} warna={warna} tepi={tepi} padat={padat} alfa={alfa}>
      {/* 30 Okt malam (Simon S04: "Diadegan tercepat ada jeglek di ikonnya"): semua anak DITUMPUK di SATU sel grid (gridArea 1/1) — dulu angka yang
          memudar dan ikon yang muncul menjadi dua BARIS grid: ikon terdorong ke bawah selama angka masih ada, lalu meloncat ke tengah saat angka dilepas */}
      {children ? <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        {React.Children.map(children, (c) => (c == null || c === false ? null : <div style={{ gridArea: '1 / 1', display: 'grid', placeItems: 'center' }}>{c}</div>))}</div> : null}
    </Kaca>);

/** angka "01" di dalam KacaBulat — cincin berwarna, ANGKA MIDNIGHT (sama dengan Nomor `cincin` V06; audit 30 Okt: angka turkis/oranye di atas putih
 *  hanya 1,9–2,3 : 1). `warna` dipakai untuk cincinnya oleh pemanggil. */
export const AngkaBulat: React.FC<{ n: number; d: number; warna: string; alfa?: number }> = ({ n, d, warna, alfa = 1 }) => (
  <div data-warna={warna} style={{ fontFamily: F, fontSize: d * 0.38, fontWeight: 800, color: B.night, letterSpacing: '.02em', lineHeight: 1, opacity: alfa < 0.999 ? alfa : undefined }}>
    {String(n).padStart(2, '0')}
  </div>);

/** foto di lingkaran putih bercincin; `naik` 0…1 (sudah ter-ease) = foto naik dari bawah garis lingkaran ke tempatnya, masker tetap = lingkaran */
export const FotoLingkar: React.FC<{ pose: PoseKarakter; x: number; y: number; D: number; s: number; warna: string; naik: number; latar?: string; cermin?: boolean;
  /** hanya foto (lingkaran digambar komponen lain, mis. KacaBulat) */ tanpaLatar?: boolean;
  /** masker LINGKARAN PENUH (ilustrasi/adegan lebar — tidak ada yang menyembul di atas lingkaran) */ bulat?: boolean }> =
  ({ pose, x, y, D, s, warna, naik, latar = B.white, cermin = false, tanpaLatar = false, bulat = false }) => {
    if (s <= 0.001) return null;
    const k = D / 2 / pose.r, w = pose.w * k, h = pose.h * k, ax = pose.cx * k, ay = pose.cy * k, r = D / 2;
    const dy = (1 - naik) * (ay + r + 4); // puncak foto tepat di bawah dasar lingkaran saat naik = 0
    // 30 Okt malam (Simon: "masking orang ke lingkaran seharusnya mengikuti warna ungu mudanya bukan outline"): lengkung masker = TEPI DALAM cincin
    const ri = tanpaLatar ? r : r - SISI;
    // lingkaran (searah jarum jam) — dipakai masker `bulat` dan masker kepala
    const lingkar = `M ${ax - ri} ${ay - dy} A ${ri} ${ri} 0 0 1 ${ax + ri} ${ay - dy} A ${ri} ${ri} 0 0 1 ${ax - ri} ${ay - dy} Z`;
    // pose.kepala (30 Okt malam, Simon: "Masking seharusnya ada dilingkarkan warna muda, bukan dari outline warna gelap"): lingkaran DALAM penuh + pita
    // selebar kepala → bahu dipotong lengkung lingkaran muda (dulu seluruh lebar foto tampil di atas garis tengah, bahu menutupi cincin warna)
    const kw = (pose.kepala ?? 0) * k;
    const klip = bulat ? `path('${lingkar}')`
      : kw > 0 ? `path('M ${ax - kw} ${-4 - dy} H ${ax + kw} V ${ay - dy} H ${ax - kw} Z ${lingkar}')`
        : `path('M -4 ${-4 - dy} H ${w + 4} V ${ay - dy} H ${ax + ri} A ${ri} ${ri} 0 0 1 ${ax - ri} ${ay - dy} H -4 Z')`;
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformOrigin: '0 0', transform: `${geser(x, y)} scale(${skalaPop(s)})` }}>
        {tanpaLatar ? null : <div style={{ position: 'absolute', left: -r, top: -r, width: D, height: D, borderRadius: '50%', background: latar, border: `${SISI}px solid ${warna}`, boxSizing: 'border-box',
          boxShadow: `0 10px 22px -14px ${warna}4d, 0 3px 8px -5px rgba(22,24,27,0.12)` }} />}
        {naik > 0.001 && !MODE_TANPA_FOTO ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: cermin ? 'scaleX(-1)' : undefined, transformOrigin: '0 0' }}>
            <Img src={staticFile(pose.src)} style={{ position: 'absolute', left: -ax, top: -ay, width: w, height: h, maxWidth: 'none', clipPath: klip,
              transform: `translate3d(0, ${dy}px, 0) rotate(0.001deg)` /* sub-piksel, bukan `top` (loncatan 1 px di ekor ease) */ }} />
          </div>) : null}
      </div>);
  };

/** pose benda/orang untuk FotoLingkar (px gambar asli; r = jari-jari lingkaran dalam px gambar) */
export const POSE_BENDA = {
  /** gedung kantor realistis (389 × 480): dasar gedung = dasar lingkaran, puncak menyembul ±30 px (lebar ±0,9 D) */
  gedung: { src: 'media/perusahaan.webp', w: 389, h: 480, cx: 194, cy: 260, r: 220 },
  /** tas belanja realistis (924 × 1190): lebar 0,8 D, dasar tas = dasar lingkaran */
  belanja: { src: 'media/realistis/belanja.webp', w: 924, h: 1190, cx: 462, cy: 613, r: 577 },
  /** orang kemeja biru tua (V06, sama ukuran dengan ORANG_SAKU) */
  orangTua: { src: 'karakter/orang_biru_tua.webp', w: 1024, h: 1536, cx: 511, cy: 494, r: 273, kepala: 98 }, // kepala terukur ±86 px + 12 (masker pita-kepala)
  /** ilustrasi 3D kiriman Simon 30 Okt (S04: "Ganti icon aktivitas dan bekerja dengan gambar yang aku kirimkan") — 1312 × 1199 latar transparan,
   *  dipasang dengan masker lingkaran PENUH (`bulat`): r 650 px gambar → seluruh adegan muat, kepala orang di dalam lingkaran */
  bekerja: { src: 'media/realistis/bekerja-kantor.webp', w: 1312, h: 1199, cx: 656, cy: 600, r: 650 },
  aktivitas: { src: 'media/realistis/aktivitas-rumah.webp', w: 1312, h: 1199, cx: 656, cy: 600, r: 650 },
} satisfies Record<string, PoseKarakter>;

/** lerp posisi bertahap (inOut cubic 60 f berpusat di `at`) — dipakai untuk "memberi ruang" */
export const geserKe = (f: number, at: number, a: number, b: number) => lerp(a, b, R(f, at - 30, at + 30, 0, 1, io));
