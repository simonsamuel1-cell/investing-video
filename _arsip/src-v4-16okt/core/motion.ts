import { Easing, interpolate } from "remotion";

/**
 * SETTING ANIMASI 60 FPS — perintah Simon, 2026-09-23 (standar Tuntun
 * ST-Trading), ditulis ulang di SATU tempat ini supaya seluruh episode ikut:
 *
 *   *"pada dasarnya aku mau kamu membuat keyframe-nya 60 (keyframe 1 di
 *   frame 1, dan keyframe 2 ada di 60), menggunakan ease in-out cubic, dan
 *   ease out back untuk pop up."*
 *   *"Pop-up / scale 0% → 100%: Ease Out Back"*
 *   *"Main movement: minimum 60 frames / 1 second"*
 *
 * dan spesifikasi tertulisnya:
 *   • Masuk   : dipusatkan di kata pemicu — elemen ≈50% mendarat saat kata
 *               diucapkan
 *   • Keluar  : `R(f, LEN − 60, LEN)` — 60 frame, berakhir tepat di ujung umur
 *   • Stagger : +20 frame per lapisan (maks 20 frame per langkah)
 *   • Ease    : masuk/gerak `inOut(cubic)` · tumbuh/garis `out(cubic)` ·
 *               pop skala masuk Ease OUT Back, keluar Ease IN Back
 *   • Larangan: jangan tumpuk easing — pop WAJIB disuapi waktu LINEAR
 *
 * ⚠ Versi sebelumnya punya T.out = 40 dan T.step = 6. Keduanya tidak memenuhi
 * aturan di atas, jadi keduanya diganti di sini — bukan di tiap scene.
 */
export const T = {
  /** MASUK baku — 60 frame, dipusatkan di pemicunya */
  in: 60,
  /** KELUAR baku — 60 frame, berakhir di ujung umur elemen */
  out: 60,
  /** pergantian papan DI DALAM satu scene */
  swap: 60,
  /** papasan antar-scene */
  scene: 60,
  /** STAGGER antar-LAPISAN (kartu → ubin → isi) — +20 frame per lapisan */
  step: 20,
  /**
   * jeda antar-KATA untuk teks yang muncul per kata tanpa onset VO sendiri.
   * Dipisah dari `step`: 20 frame per kata membuat judul enam kata merayap
   * lebih dari 2 detik. 6 frame = baku `PerKata` di episode ST-Trading.
   */
  word: 6,
  /** urutan hierarki: eyebrow → judul → garis → body → kartu → isi kartu */
  order: { eyebrow: 0, head: 8, rule: 24, body: 30, card: 14, inner: 34 },
} as const;

/* ── KURVA ─────────────────────────────────────────────────────────────── */
/** gerak utama & fade masuk/keluar */
export const easeMove = Easing.inOut(Easing.cubic);
/** tumbuh / garis */
export const easeGrow = Easing.out(Easing.cubic);
/**
 * POP — skala 0% → 100%. Masuk mengembang sedikit melewati 1 lalu mendarat;
 * keluar "menarik napas" dulu baru mengecil ke nol. back(1.4) = nilai yang
 * dipakai `v3/pop.tsx` ST-Trading, yang Simon minta "tetap subtle dan natural".
 */
export const POP_IN = Easing.out(Easing.back(1.4));
export const POP_OUT = Easing.in(Easing.back(1.4));
/** nama lama, dipertahankan untuk pemanggil yang sudah ada */
export const easeBack = POP_IN;
export const easeSwap = Easing.bezier(0.45, 0, 0.35, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * TANJAKAN MASUK DIPUSATKAN DI PEMICUNYA:
 *     R(f, kata − d/2, kata + d/2)
 * Nilai `start` TETAP berarti ONSET KATA; yang bergeser hanya FASE tanjakan,
 * jadi tidak satu pun angka beat di scene perlu diubah.
 *
 * Kalau pemicunya lebih dekat ke nol daripada setengah durasi, tanjakan TIDAK
 * dipusatkan — kalau dipaksa, elemen tampil separuh-jadi di frame pertama
 * scene, karena Sequence memotong frame negatif.
 */
export const awalTanjakan = (start: number, dur: number) =>
  start >= dur / 2 ? start - dur / 2 : start;

export const ramp = (f: number, start: number, dur: number = T.in, easing = easeMove) => {
  const a = awalTanjakan(start, dur);
  return interpolate(f, [a, a + dur], [0, 1], { ...clamp, easing });
};

export const fadeIn = (f: number, start: number, dur: number = T.in) => ramp(f, start, dur);

/**
 * FRAME PERTAMA sebuah entrance TERLIHAT. Pakai ini untuk SETIAP penjaga
 * render (`f >= muncul(beat) ? … : null`, `if (f < muncul(beat)) return null`).
 *
 * ⚠ Penjaga yang ditulis `f >= beat` MEMOTONG separuh pertama tanjakan yang
 * dipusatkan: elemennya muncul mendadak di 50% tepat di beat — jeglek kecil
 * yang lolos pemindai rerata-layar karena luasnya kecil. Ada 52 penjaga
 * seperti itu di episode ini ketika tanjakan dipusatkan.
 */
export const muncul = (beat: number, dur: number = T.in) => awalTanjakan(beat, dur);

/** TUMBUH / GARIS — 0→1 dipusatkan di beat, Ease Out Cubic (spesifikasi Simon) */
export const grow = (f: number, beat: number, dur: number = T.in) => ramp(f, beat, dur, easeGrow);

/**
 * KELUAR — berangkat di `start`, habis 60 frame kemudian. TIDAK dipusatkan:
 * pemanggil yang ada menulis `start` sebagai "mulai pergi di sini", dan untuk
 * keluar di ujung umur elemen polanya memang `R(f, LEN − 60, LEN)`.
 * Untuk PERGANTIAN (yang lama pergi, yang baru datang di beat yang sama)
 * pakai `swapOut` supaya keduanya bersilang simetris di beat itu.
 */
export const fadeOut = (f: number, start: number, dur: number = T.out) =>
  interpolate(f, [start, start + dur], [1, 0], { ...clamp, easing: easeMove });

/** keluar yang bersilang SIMETRIS dengan masuk di beat yang sama */
export const swapOut = (f: number, beat: number, dur: number = T.swap) =>
  fadeOut(f, awalTanjakan(beat, dur), dur);

/** jendela hidup: masuk dipusatkan di `start`, keluar BERAKHIR di `end` */
export const win = (f: number, start: number, end: number) =>
  Math.min(fadeIn(f, start), fadeOut(f, end - T.out));

/** gerak skalar (pindah/tumbuh) — berangkat di `start`, minimal 60 frame */
export const tween = (f: number, start: number, dur: number, from: number, to: number, easing = easeMove) =>
  interpolate(f, [start, start + dur], [from, to], { ...clamp, easing });

/**
 * POP MASUK — skala 0% → 100% dengan Ease Out Back, untuk FOKUS UI saja
 * (badge, pil, chip, ubin ikon, highlight). Kartu dan teks TIDAK pop — mereka
 * `cardIn` / `textIn` (fade + geser).
 *
 * Tiga jebakan yang pernah lolos tsc DAN lolos mata di ST-Trading
 * ([[reference-pop-helper-traps]]) ditutup di sini:
 *   1. waktunya LINEAR — Ease Out Back dipasang SEKALI, tidak ditumpuk;
 *   2. gerbang "sudah diam" membaca MASUKAN mentah, bukan skala keluaran —
 *      skala Ease Out Back menyeberang 1,0 di tengah jalan, dan gerbang yang
 *      membaca skala akan memotong lonjakan baliknya;
 *   3. jangkar di TENGAH — tanpa itu benda tumbuh dari sudut kiri-atas dan
 *      terbaca sebagai teleport.
 */
export const pop = (f: number, start: number, dur: number = T.in) => {
  const a = awalTanjakan(start, dur);
  const raw = interpolate(f, [a, a + dur], [0, 1], { ...clamp, easing: Easing.linear });
  const diam = raw >= 1;
  return {
    opacity: raw > 0 ? 1 : 0,
    transform: diam ? undefined : `scale(${POP_IN(raw).toFixed(4)})`,
    transformOrigin: "center center",
  } as const;
};

/** POP KELUAR — 100% → 0% dengan Ease In Back, berangkat di `start` */
export const popOut = (f: number, start: number, dur: number = T.out) => {
  const raw = interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing: Easing.linear });
  return raw <= 0 ? 1 : Math.max(0, 1 - POP_OUT(raw));
};

/** TEKS: pudar + geser naik kecil. TIDAK PERNAH scale/bounce pada teks. */
export const textIn = (f: number, start: number, dur: number = T.in, slide = 16) => {
  const p = ramp(f, start, dur);
  // lapisan dipromosikan SELAMA bergerak — obat judder 1px (lihat helpers.textReveal)
  const bergerak = p > 0 && p < 1;
  return {
    opacity: p,
    transform: `translate3d(0, ${((1 - p) * slide).toFixed(3)}px, 0) rotate(0.001deg)`,
    willChange: bergerak ? "transform, opacity" : undefined,
    backfaceVisibility: bergerak ? ("hidden" as const) : undefined,
  };
};

/**
 * KARTU / PERMUKAAN: pudar + naik — bukan pop. Spesifikasi Simon: *"pop hanya
 * fokus UI (badge/pil/highlight) · teks = fade+slide"*. Kartu memuat teks, dan
 * kartu 700 px yang tumbuh dari skala nol terbaca kartun, bukan mahal.
 * Naik 22 px = `rise` baku `Reveal` di ST-Trading.
 */
export const cardIn = (f: number, start: number, dur: number = T.in, rise = 22) =>
  textIn(f, start, dur, rise);

/** counter bilangan bulat */
export const counter = (f: number, start: number, dur: number, from: number, to: number) =>
  Math.round(tween(f, start, dur, from, to));
