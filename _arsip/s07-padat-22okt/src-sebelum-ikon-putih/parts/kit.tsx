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
/** KEMAJUAN masuk 0→1 LINEAR 60f dipusatkan di `at` — EASING DIBERIKAN KOMPONEN sesuai jenisnya (Simon 19 Okt):
 *  ikon & tag = POP easeOutBack (`skalaPop`), panel/kartu/orang/foto/teks = SWIPE UP easeInOut cubic (`naikY`/`alfaP`). */
export const popIn = (f: number, at: number, d = D) => R(f, at - d / 2, at + d / 2, 0, 1, Easing.linear);
/** kemajuan keluar 1→0 linear (ikon/tag: ease-IN-back lewat skalaPop; panel: inOut cubic) */
export const popOut = (f: number, at: number, d = D) => 1 - R(f, at - d / 2, at + d / 2, 0, 1, Easing.linear);
/** POP ikon/tag: skala dari kemajuan linear — masuk easeOutBack, keluar (kemajuan menurun) = easeInBack */
export const skalaPop = (p: number) => popScale(p);
/**
 * SWIPE = GESER SAMPAI KELUAR FRAME (Simon 22 Okt, aturan wajib: "alih alih cuman geser sedikit dan menambahkan fade out … geser saja sampai
 * outframe, kamu bisa menggeser keatas atau kebawah, kekanan atau kekiri, tergantung dengan kebutuhan, bentuk, dan layout dari visual").
 * 60f easeInOut cubic, TANPA pudar. Dengan kotak elemen (pusat + ukuran, koordinat layar) → lewat TEPI TERDEKAT sejauh yang perlu untuk
 * keluar penuh; tanpa kotak → tegak 1100 px (masuk dari bawah, keluar ke atas) — selalu keluar frame untuk elemen mana pun di dalam frame.
 */
export const SWIPE = 1100;
export type Arah = 'atas' | 'bawah' | 'kiri' | 'kanan';
export type KotakLayar = { x: number; y: number; w: number; h: number };
const TEPI_LUAR = 40; // lewat tepi frame + bayangan
/** jarak (px) agar kotak keluar PENUH lewat tepi `a` */
export const jarakTepi = (k: KotakLayar, a: Arah) =>
  a === 'atas' ? k.y + k.h / 2 + TEPI_LUAR : a === 'bawah' ? 1080 - (k.y - k.h / 2) + TEPI_LUAR
    : a === 'kiri' ? k.x + k.w / 2 + TEPI_LUAR : 1920 - (k.x - k.w / 2) + TEPI_LUAR;
/** tepi terdekat (jarak tempuh terpendek); seri → tegak */
export const arahTerdekat = (k: KotakLayar): Arah => {
  const urut: Arah[] = ['bawah', 'atas', 'kiri', 'kanan'];
  return urut.reduce((m, a) => (jarakTepi(k, a) < jarakTepi(k, m) - 1 ? a : m), urut[0]);
};
/** offset {x, y} swipe untuk kemajuan LINEAR p (0 = di luar frame, 1 = di tempat) */
export const swipeOff = (p: number, k?: KotakLayar, arah?: Arah) => {
  const e = 1 - io(Math.max(0, Math.min(1, p)));
  if (e <= 0) return { x: 0, y: 0 };
  const a = arah ?? (k ? arahTerdekat(k) : 'bawah');
  const d = (k ? jarakTepi(k, a) : SWIPE) * e;
  return a === 'atas' ? { x: 0, y: -d } : a === 'bawah' ? { x: 0, y: d } : a === 'kiri' ? { x: -d, y: 0 } : { x: d, y: 0 };
};
/** jarak sisa TEGAK (px) — kompatibel dengan pemanggil lama: kini sejauh keluar frame */
export const naikY = (p: number, jarak = SWIPE) => (1 - io(Math.max(0, Math.min(1, p)))) * jarak;
/** ARAH KELUAR: di dalam papan yang sedang keluar (<ArahKeluar aktif>) elemen tanpa kotak PERGI KE ATAS; di luar itu masuk dari bawah. */
export const KonteksKeluar = React.createContext(false);
export const ArahKeluar: React.FC<{ aktif: boolean; children: React.ReactNode }> = ({ aktif, children }) => (
  <KonteksKeluar.Provider value={aktif}>{children}</KonteksKeluar.Provider>);
/** offset swipe TEGAK bertanda: + (dari bawah) saat masuk, − (ke atas) bila papan sedang keluar — sejauh keluar frame (1100 px) */
export const useGeser = () => {
  const keluar = React.useContext(KonteksKeluar);
  return (p: number, _jarak?: number) => naikY(p) * (keluar ? -1 : 1);
};
/** swipe 2D bertepi terdekat: `kotak` = pusat & ukuran elemen di layar; `arah` memaksa tepi tertentu */
export const useSwipe = () => {
  const keluar = React.useContext(KonteksKeluar);
  return (p: number, kotak?: KotakLayar, arah?: Arah) => swipeOff(p, kotak, arah ?? (kotak ? undefined : keluar ? 'atas' : 'bawah'));
};
/** PAPAN: masuk dari bawah / keluar ke atas SAMPAI KELUAR FRAME (dorong 1080 px), tanpa pudar — papan lama & baru bergerak dalam 60f yang sama.
 *  `jarakMasuk` 0 = papan yang masuknya lewat morf (tetap pudar karena isinya sudah ada di layar). `arah` memaksa arah dorong. */
export const gayaPapan = (o: number, keluar: boolean, jarakMasuk = 1080, jarakKeluar = 1080, arah?: Arah) => {
  const v = Math.max(0, Math.min(1, o)); // `o` SUDAH ter-ease (cin) — jangan di-ease lagi (easing ganda)
  const e = 1 - v;
  if (!keluar && jarakMasuk === 0) return { opacity: v < 0.9999 ? v : undefined };
  const d = e * (keluar ? jarakKeluar : jarakMasuk);
  const a = arah ?? (keluar ? 'atas' : 'bawah');
  const [x, y] = a === 'atas' ? [0, -d] : a === 'bawah' ? [0, d] : a === 'kiri' ? [-d * 1920 / 1080, 0] : [d * 1920 / 1080, 0];
  return { transform: e > 0 ? `translate3d(${x}px, ${y}px, 0)` : undefined };
};
/** opasitas elemen yang di-SWIPE: TANPA pudar (Simon 22 Okt: swipe sampai keluar frame, bukan geser + fade) — hanya alfa elemen itu sendiri */
export const alfaP = (p: number, alfa = 1) => (p > 0.001 ? alfa : 0);
/** gaya opacity: undefined bila penuh (tidak memaksa lapisan baru) */
export const opa = (o: number) => (o < 0.9999 ? o : undefined);

/** jeda antar-kata dalam satu frasa (frame) — tiap kata tetap bergerak PENUH `d` frame */
const JEDA_KATA = 8;
/** progres kata ke-i (22 Okt, Simon "swipe teks … easeInOut cubic, 60 frame"): tiap kata swipe naik `d` (60) frame easeInOut cubic, berurutan
 *  JEDA_KATA frame (dirapatkan bila frasa panjang supaya total ≤ d + 30); seluruh frasa dipusatkan di `at`.
 *  (dulu: satu sapuan 60f per frasa, tiap kata hanya 27f) */
export const kataP = (f: number, at: number, i: number, n: number, d = D) => {
  const jeda = n > 1 ? Math.min(JEDA_KATA, 30 / (n - 1)) : 0;
  const mulai = at - (d + (n - 1) * jeda) / 2 + i * jeda;
  return io(Math.max(0, Math.min(1, (f - mulai) / d)));
};

/**
 * KATA BERTOPENG (Simon 22 Okt: swipe = geser sampai keluar "frame", tanpa pudar): tiap kata duduk di kotak ber-overflow hidden selebar
 * kata (+ bantalan untuk ekor huruf & kotak sorot); isinya naik dari BAWAH kotak ke tempatnya (masuk) dan terus naik keluar ATAS kotak
 * (keluar) — 60f easeInOut cubic, tanpa opacity. `masuk`/`keluar` = kemajuan TER-EASE 0…1.
 */
export const KataTopeng: React.FC<{ masuk: number; keluar?: number; size: number; style?: React.CSSProperties; children: React.ReactNode; dx?: number }> =
  ({ masuk, keluar = 0, size, style, children, dx = 0 }) => {
    const pad = size * 0.42, padX = size * 0.12, jalan = size * 1.25 + pad;
    const y = (1 - masuk) * jalan - keluar * jalan;
    const tampak = masuk > 0.001 && keluar < 0.999;
    return (
      <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: `${pad}px ${padX}px`, margin: `${-pad}px ${-padX}px`,
        transform: dx ? `translate3d(${dx}px, 0, 0)` : undefined, ...style }}>
        <span style={{ display: 'inline-block', whiteSpace: 'pre', visibility: tampak ? undefined : 'hidden',
          transform: y !== 0 ? `translate3d(0, ${y + 0.03}px, 0) rotate(0.001deg)` : undefined }}>{children}</span>
      </span>);
  };

/** teks per kata — tiap kata SWIPE NAIK dari balik topengnya 60f easeInOut cubic (berurutan, frasa dipusatkan di `at`); `until` = keluar naik */
export const WordText: React.FC<{
  children: string; at: number; f: number; until?: number; d?: number; style?: React.CSSProperties; rise?: number;
  /** spasi antar-kata di LUAR span → runtuh di ujung baris terbungkus, baris benar-benar rata tengah (label peta bab; Simon 8 Okt) */
  rataBaris?: boolean;
  /** (lama) geser halus — kini semua kata bertopeng memakai translate3d + rotasi mikro */
  halus?: boolean;
}> = ({ children, at, f, until, d = D, style, rataBaris }) => {
  const words = children.split(' ');
  const size = Number(style?.fontSize ?? 28);
  const n = words.length;
  return (
    <span style={{ ...style, display: 'inline-block' }}>
      {words.map((w, i) => {
        const p = kataP(f, at, i, n, d);
        const k = until === undefined ? 0 : kataP(f, until, i, n, d);
        const akhir = i === n - 1;
        return rataBaris ? (
          <React.Fragment key={`${w}-${i}`}>
            <KataTopeng masuk={p} keluar={k} size={size}>{w}</KataTopeng>
            {akhir ? null : ' '}
          </React.Fragment>) : (
          <KataTopeng key={`${w}-${i}`} masuk={p} keluar={k} size={size}>{w}{akhir ? '' : ' '}</KataTopeng>);
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
      position: 'absolute', left: x, top: y, transform: `translate(${anchor === 'center' ? '-50%' : '0'}, -50%) scale(${popScale(p)})`,
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
 * (src/sorot.gen.ts, diukur scripts/gen-sorot.py dari render Remotion): jarak tinta ke tepi atas = bawah = 12 px, kiri = kanan = 20 px.
 * Kata tanpa ukuran → galat (jalankan scripts/gen-sorot.py — kata judul dikumpulkan otomatis dari <Judul kata={[...]}>).
 */
const SOROT = { padX: 20, padY: 12, radius: 12 };
/** SPASI JUDUL SATU NILAI (Simon 13 Okt: "spacing textnya belum konsisten di seluruh video" — terukur: kotak → kata sesudahnya 5–11 px, kata
 *  sebelumnya → kotak 12–15 px, spasi kata biasa 8–16 px karena bentuk huruf, mis. kait "j" pada "juga"). Kini jarak TINTA kata ke TINTA kata
 *  berikutnya — dan tinta kata ke TEPI kotak sorot — = JARAK_JUDUL (px pada 52 px, diskalakan linear), di kiri maupun kanan kotak. */
export const JARAK_JUDUL = 14;
/** metrik tinta kata judul `w` di ukuran `size` (px): kiri = tinta ke tepi kiri span, sisa = tepi kanan span ke tinta (boleh negatif) */
export const tintaKata = (w: string, size: number) => {
  const u0 = SOROT_UKUR[w];
  if (!u0) throw new Error(`kata judul "${w}" belum diukur — jalankan scripts/gen-sorot.py`);
  const k = size / 52;
  return { kiri: u0.kiri * k, sisa: (u0.lebar - u0.kanan) * k };
};
/** metrik kotak sorot kata `w` di ukuran `size` (px) — satu sumber untuk <Sorot> dan geserSorot() */
const ukurSorot = (w: string, size: number) => {
  const u0 = SOROT_UKUR[w];
  if (!u0) throw new Error(`kotak sorot "${w}" belum diukur — tambahkan di src/sorotKata.ts lalu jalankan scripts/gen-sorot.py`);
  const k = size / 52; // metrik tinta diukur di 52 px; ukuran lain = skala linear
  const u = { lebar: u0.lebar * k, kiri: u0.kiri * k, kanan: u0.kanan * k, atas: u0.atas * k, bawah: u0.bawah * k };
  const S = { padX: SOROT.padX * k, padY: SOROT.padY * k, radius: SOROT.radius * k };
  const padL = S.padX - u.kiri, padR = S.padX - (u.lebar - u.kanan);
  return { u, S, padL, padR };
};
/**
 * GESER SEBELUM KOTAK TAMPIL: tata letak sudah memesan ruang kotak (padding 20 px tiap sisi). Sebelum kotak tampil kata-kata SEBELUM kata sorot
 * digeser ke kanan dan kata-kata SESUDAHNYA ke kiri sejauh nilai ini × (1 − h) → jarak di kedua sisi kata sorot = JARAK_JUDUL biasa dan baris tetap
 * berpusat; saat kotak menyapu (60f) kedua sisi meluncur keluar bersamaan. Transform, bukan tata letak.
 */
export const geserSorot = (w: string, size = 52) => ukurSorot(w, size).S.padX;
export const Sorot: React.FC<{ w: string; h: number; col?: string; size?: number }> = ({ w, h, col = '#5F4DEE', size = 52 }) => {
  const { u, S, padL, padR } = ukurSorot(w, size);
  // tepi KIRI kotak ikut kata sebelumnya yang sedang meluncur (selalu JARAK_JUDUL dari tintanya); tepi KANAN menyapu ke kanan.
  // Huruf putih = salinan kata yang dipotong oleh kotak itu sendiri (overflow hidden).
  const L = S.padX * (1 - h);
  const atas = u.atas - S.padY;
  return (
    <span style={{ position: 'relative', display: 'inline-block', paddingLeft: padL, paddingRight: padR }}>
      <span style={{ position: 'relative' }}>{w}</span>
      {h > 0 ? (
        <span style={{ position: 'absolute', left: L, top: atas, height: u.bawah - u.atas + 2 * S.padY, width: `calc(${h} * (100% - ${L}px))`, background: col, borderRadius: S.radius, overflow: 'hidden', opacity: Math.min(1, h * 6) }}>
          <span style={{ position: 'absolute', left: padL - L, top: -atas, color: '#FFFFFF', whiteSpace: 'pre' }}>{w}</span>
        </span>) : null}
    </span>);
};
