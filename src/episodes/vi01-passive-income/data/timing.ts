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

/** Scene-local frame for a beat written in GLOBAL frames. */
export const local = (beat: number, from: number) => beat - from;

/**
 * Scene boundaries — each cut at the midpoint of the silence between the two
 * scenes, so they butt end to end and every frame from 0 to END is owned.
 */
export const BLOCK = {
  SC01: 0, SC02: 939, SC03: 2033,
  SC04: 3025, SC05: 3978, SC06: 5275, SC07: 6357, SC08: 7568,
  SC09: 8522, SC10: 9544, SC11: 10600, SC12: 11686,
  SC13: 12473, SC14: 13609, SC15: 14879,
  SC16: 15918, SC17: 16794, SC18: 18006,
  /** The VO's last word ends on f18994; 206 frames hold the closing card. */
  END: 19200,
} as const;

/** The last frame of speech, for the guard in Composition.tsx. */
export const VO_LAST = 18994;

// ═══ COLD OPEN ═════════════════════════════════════════════════════════════
export const SC01 = {
  calendar: 6, // the month card arrives with "Setiap bulan"
  days: [30, 150] as const, // the cursor runs through the month
  gajian: 160, // "GAJIAN."
  kerja: 190, // "Kita kerja,"
  penghasilan: 271, // "dapat penghasilan,"
  hidup: 430, // "…menjalani hidup."
  berhenti: 671, // "berhenti kerja sementara"
  apakah: 796, // "Apakah penghasilan kita juga ikut berhenti?"
};

export const SC02 = {
  title: 956, // "Makanya,"
  /** The five, each on its own word — NOT an even grid (72 / 92 / 58 / 142). */
  ways: [1258, 1330, 1422, 1480, 1622] as const,
  bagus: 1702, // "Semua itu bagus,"
  waktu: 1942, // "waktu dan tenaga kita."
};

export const SC03 = {
  day: 2046, // "Masalahnya,"
  jam: 2165, // "24 jam."
  dewasa: 2224, // "Semakin dewasa,"
  full: 2409, // "…makin banyak."
  q1: 2478, // "Jadi selain bertanya, …"
  q1Type: 2574, // the question itself
  q2: 2758, // "Kita juga perlu mulai bertanya:"
  q2Type: 2836,
  ikutBekerja: 2968, // "ikut bekerja?"
};

// ═══ PART 01 — UANG YANG IKUT BEKERJA ═════════════════════════════════════
export const SC04 = {
  title: 3098, // "passive income"
  bukan: 3224, // "Bukan berarti investasi hari ini,"
  strike: 3417, // "…langsung berhenti kerja."
  tetap: [3488, 3550, 3618] as const, // "Kita tetap kerja, tetap bangun karier, dan tetap belajar."
  bedanya: 3708, // "Bedanya,"
  sebagian: 3736, // "sebagian uang yang kita hasilkan"
  aset: 3918, // "menjadi aset."
};

export const SC05 = {
  axis: 4068, // "waktu punya peran besar."
  kalau: 4186, // "Kalau sebuah aset menghasilkan keuntungan,"
  lagi: 4318, // "keuntungan itu bisa ikut menghasilkan keuntungan"
  /** "100 … 110 … 121 … 133" — each bar lands on its own number. */
  bars: [4572, 4664, 4758, 4897] as const,
  compounding: 5052, // "compounding:"
  line: 5118, // "hasil yang terus ikut bertumbuh seiring waktu."
};

export const SC06 = {
  modal: 5436, // "modal besar dulu."
  strike: 5483,
  habit: 5608, // "mulai membangun kebiasaannya."
  habitName: 5671,
  bukanUang: 5758, // "Karena investasi bukan cuma soal uang."
  loop: 5926, // "Semakin sering kita belajar …"
  belajar: 5994, // "belajar"
  toEvaluasi: 6022, // the arrow on to "mengevaluasi"
  toKelola: 6200, // the arrow on to "mengelola aset", under "semakin baik"
  evaluasi: 6035, // "mengevaluasi keputusan,"
  baik: 6152, // "semakin baik juga kemampuan kita"
  kelola: 6284, // "mengelola aset."
};

export const SC07 = {
  split: 6473, // "dua bagian."
  human: 6570, // "human asset:"
  humanRows: [6624, 6666, 6714] as const, // waktu, kemampuan, pengalaman
  financial: 6957, // "financial asset:"
  financialRows: [7028, 7088, 7156] as const, // tabungan, investasi, aset
  batas: 7355, // "punya batas."
  terus: 7407, // "Financial asset bisa terus kita miliki."
};

export const SC08 = {
  muda: 7584, // "Waktu masih muda,"
  idealnya: 7834, // "Tapi idealnya,"
  tumbuh: 7978, // "aset kita juga ikut tumbuh."
  estafet: 8144, // "Bayangin seperti estafet:"
  kerja: 8197, // "kita kerja untuk menghasilkan uang,"
  teruskan: 8300, // "lalu sebagian uang itu kita teruskan"
  aset: 8463, // "untuk membangun aset."
};

// ═══ PART 02 — IKUT PUNYA BISNIS ══════════════════════════════════════════
export const SC09 = {
  company: 8585, // "dari investasi"
  nggak: 8670, // "kita nggak harus bekerja di sebuah perusahaan"
  karyawan: 9020, // "Ada orang yang bekerja di BCA"
  bca: 9094,
  gaji: 9178, // "penghasilan."
  investor: 9248, // "Di sisi lain, sebagai investor,"
  slice: 9433, // "sebagian kecil dari bisnis BCA."
};

export const SC10 = {
  around: 9556, // "Hal yang sama sebenarnya ada di sekitar kita"
  products: [9808, 9864, 9912, 9969] as const, // Indomie, Ultra Milk, dan banyak produk
  konsumen: 10064, // "Sebagai konsumen,"
  flip: 10270, // "Tapi lewat investasi,"
  pemilik: 10419, // "sebagian kecil dari bisnis"
  balik: 10504, // "di balik produk-produk itu."
};

export const SC11 = {
  uang: 10659, // "bedanya antara sekadar menghasilkan uang,"
  aset: 10870, // "dengan mulai membangun aset."
  wheel: 11000, // "Sebuah bisnis"
  steps: [11088, 11122, 11255] as const, // pendapatan, laba, berkembang
  pemilik: 11330, // "Sebagai pemilik sebagian dari bisnis tersebut,"
  exposure: 11528, // "exposure terhadap pertumbuhan nilainya."
};

export const SC12 = {
  start: 11737, // "nggak harus besar."
  /** "Rp50 … Rp100 … Rp300" — 28 f then 83 f apart; pops, not reveals. */
  amounts: [11825, 11853, 11936] as const,
  dim: 12065, // "bukan nominal pertamanya,"
  habit: 12154, // "tapi kebiasaan untuk menyisihkan sebagian income"
  aset: 12373, // "dan mulai mengubahnya menjadi aset."
};

// ═══ PART 03 — CERITA LO KHENG HONG ═══════════════════════════════════════
export const SC13 = {
  name: 12484, // "Lo Kheng Hong"
  /** The four steps of the timeline, each on its word. */
  steps: [12926, 13031, 13095, 13198] as const, // pegawai bank, menabung, membaca laporan, pelan-pelan
  untr: 13520, // "United Tractors."
};

export const SC14 = {
  krisis: 13650, // "krisis 1998,"
  rp250: 13963, // "Rp250 per saham."
  later: 14068, // "Beberapa tahun kemudian,"
  lipat: 14200, // "berkali-kali lipat,"
  rp15: 14400, // "Rp15 ribu."
  caution: 14460, // "Tapi tentu saja, ini adalah contoh dari masa lalu."
  nggak: 14682, // "Nggak semua investasi …"
};

export const SC15 = {
  bukan: 14884, // "Yang menarik dari cerita ini sebenarnya bukan:"
  quote: 15033, // "“Cari saham …”"
  strike: 15212, // "Yang lebih penting justru prosesnya."
  /** The five steps, each on its word (88 / 96 / 64 / 172). */
  steps: [15364, 15452, 15548, 15612, 15784] as const,
};

// ═══ PENUTUP ═══════════════════════════════════════════════════════════════
export const SC16 = {
  lari: 16092, // "lari dari pekerjaan."
  strike: 16141,
  tetap: [16265, 16307, 16382] as const, // karier, keluarga, menikmati hidup
  bedanya: 16486, // "Bedanya, sebagian hasil kerja kita hari ini"
  depan: 16736, // "untuk masa depan."
};

export const SC17 = {
  kecil: 16841, // "aset kita mungkin masih kecil."
  grow: [17007, 17098, 17170] as const, // kemampuan, income, aset
  pillars: 17254, // "pelan-pelan kita nggak cuma punya satu sumber kekuatan finansial."
  pilihan: 17527, // "lebih banyak pilihan."
  tanya: 17628, // "Jadi setiap kali income masuk, coba tanya:"
  quote: 17812, // "“Berapa yang bisa aku sisihkan …”"
  mark: 17940, // "mulai punya aset?"
};

export const SC18 = {
  kerja: 18084, // "kerja berarti kita menggunakan waktu …"
  investasi: 18310, // "Sedangkan investasi,"
  bekerja: 18548, // "ikut bekerja untuk masa depan."
  close: 18692, // "Jadi kita pelan-pelan berubah …"
  mark: 18946, // "juga punya aset."
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
  // ST1 · SC03 → SC04 (0.30 s of air; SC03's last word ends f3016)
  { at: 2990, freeze: 2989, landing: 0, next: 1, cards: [3008, 3018, 3028], thumbs: [null, null, null, null] },
  // ST2 · SC08 → SC09 (0.27 s; SC08's last word ends f8514)
  { at: 8486, freeze: 8485, landing: 1, next: 2, cards: [8496, 8504, 8524], thumbs: [2989, null, null, null] },
  // ST3 · SC12 → SC13 (0.37 s; SC12's last word ends f12462)
  { at: 12437, freeze: 12436, landing: 2, next: 3, cards: [12447, 12455, 12475], thumbs: [2989, 8485, null, null] },
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
