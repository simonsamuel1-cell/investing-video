/**
 * VI01 · Passive Income — every frame number in the episode, at 60fps.
 *
 * Copied from docs/VI01_PassiveIncome_Script_SYNCED.md, whose numbers come from
 * the recorded VO (assets/VI01_PassiveIncome_Sub_CORRECTED.srt, aligned word by
 * word by scripts/vi01-align.py). A beat is the GLOBAL frame its word is spoken
 * on; a scene reads it as `local(beat, BLOCK.SCxx)`.
 *
 * Never re-derive one of these from a stopwatch or a word count: if the VO is
 * re-cut, re-run the aligner and copy again.
 */

/**
 * ⚠ PADDED VO. Every frame below is a frame of the PADDED recording that
 * public/vo/passive-income.mp3 is built as (scripts/vi01-vo.py, from
 * data/pads.json): +30 at 150 — Simon, 2026-10-06: "Di frame 150, beri jeda
 * 30 frame (VO dan scene visual)". Everything after 150 moved 30. Then +30
 * at 230 (200 of the original) — "230 kasih jeda 30 frame" — and everything
 * after 230 moved 30 more.
 */

/** Scene-local frame for a beat written in GLOBAL frames. */
export const local = (beat: number, from: number) => beat - from;

/**
 * Scene boundaries — each cut at the midpoint of the silence between the two
 * scenes, so they butt end to end and every frame from 0 to END is owned.
 */
export const BLOCK = {
  SC01: 0, SC02: 999, SC03: 2093,
  SC04: 3085, SC05: 4038, SC06: 5335, SC07: 6417, SC08: 7628,
  SC09: 8582, SC10: 9604, SC11: 10660, SC12: 11746,
  SC13: 12533, SC14: 13669, SC15: 14939,
  SC16: 15978, SC17: 16854, SC18: 18066,
  /** The VO's last word ends on f19054; 206 frames hold the closing card. */
  END: 19260,
} as const;

/** The last frame of speech, for the guard in Composition.tsx. */
export const VO_LAST = 19054;

// ═══ COLD OPEN ═════════════════════════════════════════════════════════════
export const SC01 = {
  calendar: 6, // the calendar page (Januari, 1) arrives with "Setiap bulan"
  /** "80-150 angka 1 nya scroll hingga angka 25" — lands on 25 as the pause begins. */
  scroll: [80, 150] as const,
  payday: 25,
  gajian: 190, // "GAJIAN." — the word appears mid-screen and starts to rise
  /** GAJIAN has risen and grown; the calendar has shrunk 30% and dropped. */
  settled: 236,
  /** Then the second pause (230-260); after it the pair slides up and out — "Setelah jeda, grup gajian dan kalender, mereka geser naik hingga hilang". */
  exit: 260,
  /** "…lalu muncul orang kerja png nya dari bawah, posisinya di tengah vertikal" — up to the frame's middle, then out. */
  photo: [276, 530] as const, // starts up as the pair is still leaving, so the frame is never empty
  kerja: 266, // "Kita kerja," — measured in the audio (3.44 s of the recording), after both pads
  /** The Kerja node, once the pair has cleared the frame. */
  kerjaNode: 306,
  penghasilan: 331, // "dapat penghasilan,"
  hidup: 490, // "…menjalani hidup."
  berhenti: 731, // "berhenti kerja sementara"
  apakah: 856, // "Apakah penghasilan kita juga ikut berhenti?"
};

export const SC02 = {
  title: 1016, // "Makanya,"
  /** The five, each on its own word — NOT an even grid (72 / 92 / 58 / 142). */
  ways: [1318, 1390, 1482, 1540, 1682] as const,
  bagus: 1762, // "Semua itu bagus,"
  waktu: 2002, // "waktu dan tenaga kita."
};

export const SC03 = {
  day: 2106, // "Masalahnya,"
  jam: 2225, // "24 jam."
  dewasa: 2284, // "Semakin dewasa,"
  full: 2469, // "…makin banyak."
  q1: 2538, // "Jadi selain bertanya, …"
  q1Type: 2634, // the question itself
  q2: 2818, // "Kita juga perlu mulai bertanya:"
  q2Type: 2896,
  ikutBekerja: 3028, // "ikut bekerja?"
};

// ═══ PART 01 — UANG YANG IKUT BEKERJA ═════════════════════════════════════
export const SC04 = {
  title: 3158, // "passive income"
  bukan: 3284, // "Bukan berarti investasi hari ini,"
  strike: 3477, // "…langsung berhenti kerja."
  tetap: [3548, 3610, 3678] as const, // "Kita tetap kerja, tetap bangun karier, dan tetap belajar."
  bedanya: 3768, // "Bedanya,"
  sebagian: 3796, // "sebagian uang yang kita hasilkan"
  aset: 3978, // "menjadi aset."
};

export const SC05 = {
  axis: 4128, // "waktu punya peran besar."
  kalau: 4246, // "Kalau sebuah aset menghasilkan keuntungan,"
  lagi: 4378, // "keuntungan itu bisa ikut menghasilkan keuntungan"
  /** "100 … 110 … 121 … 133" — each bar lands on its own number. */
  bars: [4632, 4724, 4818, 4957] as const,
  compounding: 5112, // "compounding:"
  line: 5178, // "hasil yang terus ikut bertumbuh seiring waktu."
};

export const SC06 = {
  modal: 5496, // "modal besar dulu."
  strike: 5543,
  habit: 5668, // "mulai membangun kebiasaannya."
  habitName: 5731,
  bukanUang: 5818, // "Karena investasi bukan cuma soal uang."
  loop: 5986, // "Semakin sering kita belajar …"
  belajar: 6054, // "belajar"
  toEvaluasi: 6082, // the arrow on to "mengevaluasi"
  toKelola: 6260, // the arrow on to "mengelola aset", under "semakin baik"
  evaluasi: 6095, // "mengevaluasi keputusan,"
  baik: 6212, // "semakin baik juga kemampuan kita"
  kelola: 6344, // "mengelola aset."
};

export const SC07 = {
  split: 6533, // "dua bagian."
  human: 6630, // "human asset:"
  humanRows: [6684, 6726, 6774] as const, // waktu, kemampuan, pengalaman
  financial: 7017, // "financial asset:"
  financialRows: [7088, 7148, 7216] as const, // tabungan, investasi, aset
  batas: 7415, // "punya batas."
  terus: 7467, // "Financial asset bisa terus kita miliki."
};

export const SC08 = {
  muda: 7644, // "Waktu masih muda,"
  idealnya: 7894, // "Tapi idealnya,"
  tumbuh: 8038, // "aset kita juga ikut tumbuh."
  estafet: 8204, // "Bayangin seperti estafet:"
  kerja: 8257, // "kita kerja untuk menghasilkan uang,"
  teruskan: 8360, // "lalu sebagian uang itu kita teruskan"
  aset: 8523, // "untuk membangun aset."
};

// ═══ PART 02 — IKUT PUNYA BISNIS ══════════════════════════════════════════
export const SC09 = {
  company: 8645, // "dari investasi"
  nggak: 8730, // "kita nggak harus bekerja di sebuah perusahaan"
  karyawan: 9080, // "Ada orang yang bekerja di BCA"
  bca: 9154,
  gaji: 9238, // "penghasilan."
  investor: 9308, // "Di sisi lain, sebagai investor,"
  slice: 9493, // "sebagian kecil dari bisnis BCA."
};

export const SC10 = {
  around: 9616, // "Hal yang sama sebenarnya ada di sekitar kita"
  products: [9868, 9924, 9972, 10029] as const, // Indomie, Ultra Milk, dan banyak produk
  konsumen: 10124, // "Sebagai konsumen,"
  flip: 10330, // "Tapi lewat investasi,"
  pemilik: 10479, // "sebagian kecil dari bisnis"
  balik: 10564, // "di balik produk-produk itu."
};

export const SC11 = {
  uang: 10719, // "bedanya antara sekadar menghasilkan uang,"
  aset: 10930, // "dengan mulai membangun aset."
  wheel: 11060, // "Sebuah bisnis"
  steps: [11148, 11182, 11315] as const, // pendapatan, laba, berkembang
  pemilik: 11390, // "Sebagai pemilik sebagian dari bisnis tersebut,"
  exposure: 11588, // "exposure terhadap pertumbuhan nilainya."
};

export const SC12 = {
  start: 11797, // "nggak harus besar."
  /** "Rp50 … Rp100 … Rp300" — 28 f then 83 f apart; pops, not reveals. */
  amounts: [11885, 11913, 11996] as const,
  dim: 12125, // "bukan nominal pertamanya,"
  habit: 12214, // "tapi kebiasaan untuk menyisihkan sebagian income"
  aset: 12433, // "dan mulai mengubahnya menjadi aset."
};

// ═══ PART 03 — CERITA LO KHENG HONG ═══════════════════════════════════════
export const SC13 = {
  name: 12544, // "Lo Kheng Hong"
  /** The four steps of the timeline, each on its word. */
  steps: [12986, 13091, 13155, 13258] as const, // pegawai bank, menabung, membaca laporan, pelan-pelan
  untr: 13580, // "United Tractors."
};

export const SC14 = {
  krisis: 13710, // "krisis 1998,"
  rp250: 14023, // "Rp250 per saham."
  later: 14128, // "Beberapa tahun kemudian,"
  lipat: 14260, // "berkali-kali lipat,"
  rp15: 14460, // "Rp15 ribu."
  caution: 14520, // "Tapi tentu saja, ini adalah contoh dari masa lalu."
  nggak: 14742, // "Nggak semua investasi …"
};

export const SC15 = {
  bukan: 14944, // "Yang menarik dari cerita ini sebenarnya bukan:"
  quote: 15093, // "“Cari saham …”"
  strike: 15272, // "Yang lebih penting justru prosesnya."
  /** The five steps, each on its word (88 / 96 / 64 / 172). */
  steps: [15424, 15512, 15608, 15672, 15844] as const,
};

// ═══ PENUTUP ═══════════════════════════════════════════════════════════════
export const SC16 = {
  lari: 16152, // "lari dari pekerjaan."
  strike: 16201,
  tetap: [16325, 16367, 16442] as const, // karier, keluarga, menikmati hidup
  bedanya: 16546, // "Bedanya, sebagian hasil kerja kita hari ini"
  depan: 16796, // "untuk masa depan."
};

export const SC17 = {
  kecil: 16901, // "aset kita mungkin masih kecil."
  grow: [17067, 17158, 17230] as const, // kemampuan, income, aset
  pillars: 17314, // "pelan-pelan kita nggak cuma punya satu sumber kekuatan finansial."
  pilihan: 17587, // "lebih banyak pilihan."
  tanya: 17688, // "Jadi setiap kali income masuk, coba tanya:"
  quote: 17872, // "“Berapa yang bisa aku sisihkan …”"
  mark: 18000, // "mulai punya aset?"
};

export const SC18 = {
  kerja: 18144, // "kerja berarti kita menggunakan waktu …"
  investasi: 18370, // "Sedangkan investasi,"
  bekerja: 18608, // "ikut bekerja untuk masa depan."
  close: 18752, // "Jadi kita pelan-pelan berubah …"
  mark: 19006, // "juga punya aset."
};

// ═══ SCENE TRANSISI — TA09's roadmap, over the cut ════════════════════════
/**
 * The board: one card across the top for the cold open, three chapters in a
 * row beneath it. Labels are Simon's to rename; Title Case as he asked of TA05's.
 */
export const MAP_LABELS: [string, string, string, string] = [
  "Gaji & Waktu",
  "Uang Yang Ikut Bekerja",
  "Ikut Punya Bisnis",
  "Cerita Lo Kheng Hong",
];

/**
 * One transition per chapter. The outgoing scene's last still frame (`freeze`,
 * GLOBAL) shrinks into its card (`landing`); the others open; `next` lights and
 * the camera pushes into it; the board fades off the scene already running
 * underneath. `at` is ~36 frames before the outgoing scene's last word ends.
 */
export type Trans = {
  at: number;
  freeze: number;
  landing: number;
  next: number;
  /** Frames (global) the cards that are not `landing` open on, in card order. */
  cards: number[];
  /** Earlier chapters' last frames, shown in their cards. GLOBAL, by slot. */
  thumbs: (number | null)[];
};
export const TRANS_SHRINK = 60;
export const TRANS_CARD = 22;
export const TRANS_GLOW = 26;
export const TRANS_PUSH = { over: 44, amount: 0.55 };
export const TRANS_FADE = 24;
/** at → shrink → cards → glow → push → fade: the whole move, in frames. */
export const TRANS_LEN = 130;

export const TRANS: Trans[] = [
  // ST1 · SC03 → SC04 (0.30 s of air; SC03's last word ends f3076)
  { at: 3050, freeze: 3049, landing: 0, next: 1, cards: [3068, 3078, 3088], thumbs: [null, null, null, null] },
  // ST2 · SC08 → SC09 (0.27 s; SC08's last word ends f8574)
  { at: 8546, freeze: 8545, landing: 1, next: 2, cards: [8556, 8564, 8584], thumbs: [3049, null, null, null] },
  // ST3 · SC12 → SC13 (0.37 s; SC12's last word ends f12522)
  { at: 12497, freeze: 12496, landing: 2, next: 3, cards: [12507, 12515, 12535], thumbs: [3049, 8545, null, null] },
];

// ═══ EVERY OTHER SCENE CHANGE — a CameraCut ═══════════════════════════════
/**
 * Simon: "Harus selalu ada animasi transisi, meski normal banget, lalu animasi
 * harus easy ease." The three chapter cuts have their Scene Transisi; every
 * other boundary gets core's CameraCut (its curve is the in-out ease): the
 * outgoing scene slides off with a blur, the incoming one slides in behind it.
 * Always sideways: a rise would carry a scene's lowest things (the worker's
 * feet) down through the caption band on the way in.
 *
 * ⚠ NOT SC13 → SC14. The United Tractors card is carried across that cut —
 * SC13 leaves it exactly where SC14 picks it up — so the move IS the
 * transition, and SC13 fades everything else off around it (scenes/PartThree).
 */
export const CUT = { over: 40, distance: 120, blur: 10 } as const;
export const CUTS: { at: number; axis: "x" | "y" }[] = [
  { at: BLOCK.SC02, axis: "x" },
  { at: BLOCK.SC03, axis: "x" },
  { at: BLOCK.SC05, axis: "x" },
  { at: BLOCK.SC06, axis: "x" },
  { at: BLOCK.SC07, axis: "x" },
  { at: BLOCK.SC08, axis: "x" },
  { at: BLOCK.SC10, axis: "x" },
  { at: BLOCK.SC11, axis: "x" },
  { at: BLOCK.SC12, axis: "x" },
  { at: BLOCK.SC15, axis: "x" },
  { at: BLOCK.SC16, axis: "x" },
  { at: BLOCK.SC17, axis: "x" },
  { at: BLOCK.SC18, axis: "x" },
];
/** How long SC13 takes to clear around the carried card before the cut. */
export const CARRY_CLEAR = 30;
