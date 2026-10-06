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
 * 30 frame (VO dan scene visual)". Everything after 150 moved 30.
 */

/** Scene-local frame for a beat written in GLOBAL frames. */
export const local = (beat: number, from: number) => beat - from;

/**
 * Scene boundaries — each cut at the midpoint of the silence between the two
 * scenes, so they butt end to end and every frame from 0 to END is owned.
 */
export const BLOCK = {
  SC01: 0, SC02: 969, SC03: 2063,
  SC04: 3055, SC05: 4008, SC06: 5305, SC07: 6387, SC08: 7598,
  SC09: 8552, SC10: 9574, SC11: 10630, SC12: 11716,
  SC13: 12503, SC14: 13639, SC15: 14909,
  SC16: 15948, SC17: 16824, SC18: 18036,
  /** The VO's last word ends on f19024; 206 frames hold the closing card. */
  END: 19230,
} as const;

/** The last frame of speech, for the guard in Composition.tsx. */
export const VO_LAST = 19024;

// ═══ COLD OPEN ═════════════════════════════════════════════════════════════
export const SC01 = {
  calendar: 6, // the calendar page (Januari, 1) arrives with "Setiap bulan"
  gajian: 190, // "GAJIAN."
  kerja: 220, // "Kita kerja,"
  penghasilan: 301, // "dapat penghasilan,"
  hidup: 460, // "…menjalani hidup."
  berhenti: 701, // "berhenti kerja sementara"
  apakah: 826, // "Apakah penghasilan kita juga ikut berhenti?"
};

export const SC02 = {
  title: 986, // "Makanya,"
  /** The five, each on its own word — NOT an even grid (72 / 92 / 58 / 142). */
  ways: [1288, 1360, 1452, 1510, 1652] as const,
  bagus: 1732, // "Semua itu bagus,"
  waktu: 1972, // "waktu dan tenaga kita."
};

export const SC03 = {
  day: 2076, // "Masalahnya,"
  jam: 2195, // "24 jam."
  dewasa: 2254, // "Semakin dewasa,"
  full: 2439, // "…makin banyak."
  q1: 2508, // "Jadi selain bertanya, …"
  q1Type: 2604, // the question itself
  q2: 2788, // "Kita juga perlu mulai bertanya:"
  q2Type: 2866,
  ikutBekerja: 2998, // "ikut bekerja?"
};

// ═══ PART 01 — UANG YANG IKUT BEKERJA ═════════════════════════════════════
export const SC04 = {
  title: 3128, // "passive income"
  bukan: 3254, // "Bukan berarti investasi hari ini,"
  strike: 3447, // "…langsung berhenti kerja."
  tetap: [3518, 3580, 3648] as const, // "Kita tetap kerja, tetap bangun karier, dan tetap belajar."
  bedanya: 3738, // "Bedanya,"
  sebagian: 3766, // "sebagian uang yang kita hasilkan"
  aset: 3948, // "menjadi aset."
};

export const SC05 = {
  axis: 4098, // "waktu punya peran besar."
  kalau: 4216, // "Kalau sebuah aset menghasilkan keuntungan,"
  lagi: 4348, // "keuntungan itu bisa ikut menghasilkan keuntungan"
  /** "100 … 110 … 121 … 133" — each bar lands on its own number. */
  bars: [4602, 4694, 4788, 4927] as const,
  compounding: 5082, // "compounding:"
  line: 5148, // "hasil yang terus ikut bertumbuh seiring waktu."
};

export const SC06 = {
  modal: 5466, // "modal besar dulu."
  strike: 5513,
  habit: 5638, // "mulai membangun kebiasaannya."
  habitName: 5701,
  bukanUang: 5788, // "Karena investasi bukan cuma soal uang."
  loop: 5956, // "Semakin sering kita belajar …"
  belajar: 6024, // "belajar"
  toEvaluasi: 6052, // the arrow on to "mengevaluasi"
  toKelola: 6230, // the arrow on to "mengelola aset", under "semakin baik"
  evaluasi: 6065, // "mengevaluasi keputusan,"
  baik: 6182, // "semakin baik juga kemampuan kita"
  kelola: 6314, // "mengelola aset."
};

export const SC07 = {
  split: 6503, // "dua bagian."
  human: 6600, // "human asset:"
  humanRows: [6654, 6696, 6744] as const, // waktu, kemampuan, pengalaman
  financial: 6987, // "financial asset:"
  financialRows: [7058, 7118, 7186] as const, // tabungan, investasi, aset
  batas: 7385, // "punya batas."
  terus: 7437, // "Financial asset bisa terus kita miliki."
};

export const SC08 = {
  muda: 7614, // "Waktu masih muda,"
  idealnya: 7864, // "Tapi idealnya,"
  tumbuh: 8008, // "aset kita juga ikut tumbuh."
  estafet: 8174, // "Bayangin seperti estafet:"
  kerja: 8227, // "kita kerja untuk menghasilkan uang,"
  teruskan: 8330, // "lalu sebagian uang itu kita teruskan"
  aset: 8493, // "untuk membangun aset."
};

// ═══ PART 02 — IKUT PUNYA BISNIS ══════════════════════════════════════════
export const SC09 = {
  company: 8615, // "dari investasi"
  nggak: 8700, // "kita nggak harus bekerja di sebuah perusahaan"
  karyawan: 9050, // "Ada orang yang bekerja di BCA"
  bca: 9124,
  gaji: 9208, // "penghasilan."
  investor: 9278, // "Di sisi lain, sebagai investor,"
  slice: 9463, // "sebagian kecil dari bisnis BCA."
};

export const SC10 = {
  around: 9586, // "Hal yang sama sebenarnya ada di sekitar kita"
  products: [9838, 9894, 9942, 9999] as const, // Indomie, Ultra Milk, dan banyak produk
  konsumen: 10094, // "Sebagai konsumen,"
  flip: 10300, // "Tapi lewat investasi,"
  pemilik: 10449, // "sebagian kecil dari bisnis"
  balik: 10534, // "di balik produk-produk itu."
};

export const SC11 = {
  uang: 10689, // "bedanya antara sekadar menghasilkan uang,"
  aset: 10900, // "dengan mulai membangun aset."
  wheel: 11030, // "Sebuah bisnis"
  steps: [11118, 11152, 11285] as const, // pendapatan, laba, berkembang
  pemilik: 11360, // "Sebagai pemilik sebagian dari bisnis tersebut,"
  exposure: 11558, // "exposure terhadap pertumbuhan nilainya."
};

export const SC12 = {
  start: 11767, // "nggak harus besar."
  /** "Rp50 … Rp100 … Rp300" — 28 f then 83 f apart; pops, not reveals. */
  amounts: [11855, 11883, 11966] as const,
  dim: 12095, // "bukan nominal pertamanya,"
  habit: 12184, // "tapi kebiasaan untuk menyisihkan sebagian income"
  aset: 12403, // "dan mulai mengubahnya menjadi aset."
};

// ═══ PART 03 — CERITA LO KHENG HONG ═══════════════════════════════════════
export const SC13 = {
  name: 12514, // "Lo Kheng Hong"
  /** The four steps of the timeline, each on its word. */
  steps: [12956, 13061, 13125, 13228] as const, // pegawai bank, menabung, membaca laporan, pelan-pelan
  untr: 13550, // "United Tractors."
};

export const SC14 = {
  krisis: 13680, // "krisis 1998,"
  rp250: 13993, // "Rp250 per saham."
  later: 14098, // "Beberapa tahun kemudian,"
  lipat: 14230, // "berkali-kali lipat,"
  rp15: 14430, // "Rp15 ribu."
  caution: 14490, // "Tapi tentu saja, ini adalah contoh dari masa lalu."
  nggak: 14712, // "Nggak semua investasi …"
};

export const SC15 = {
  bukan: 14914, // "Yang menarik dari cerita ini sebenarnya bukan:"
  quote: 15063, // "“Cari saham …”"
  strike: 15242, // "Yang lebih penting justru prosesnya."
  /** The five steps, each on its word (88 / 96 / 64 / 172). */
  steps: [15394, 15482, 15578, 15642, 15814] as const,
};

// ═══ PENUTUP ═══════════════════════════════════════════════════════════════
export const SC16 = {
  lari: 16122, // "lari dari pekerjaan."
  strike: 16171,
  tetap: [16295, 16337, 16412] as const, // karier, keluarga, menikmati hidup
  bedanya: 16516, // "Bedanya, sebagian hasil kerja kita hari ini"
  depan: 16766, // "untuk masa depan."
};

export const SC17 = {
  kecil: 16871, // "aset kita mungkin masih kecil."
  grow: [17037, 17128, 17200] as const, // kemampuan, income, aset
  pillars: 17284, // "pelan-pelan kita nggak cuma punya satu sumber kekuatan finansial."
  pilihan: 17557, // "lebih banyak pilihan."
  tanya: 17658, // "Jadi setiap kali income masuk, coba tanya:"
  quote: 17842, // "“Berapa yang bisa aku sisihkan …”"
  mark: 17970, // "mulai punya aset?"
};

export const SC18 = {
  kerja: 18114, // "kerja berarti kita menggunakan waktu …"
  investasi: 18340, // "Sedangkan investasi,"
  bekerja: 18578, // "ikut bekerja untuk masa depan."
  close: 18722, // "Jadi kita pelan-pelan berubah …"
  mark: 18976, // "juga punya aset."
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
  // ST1 · SC03 → SC04 (0.30 s of air; SC03's last word ends f3046)
  { at: 3020, freeze: 3019, landing: 0, next: 1, cards: [3038, 3048, 3058], thumbs: [null, null, null, null] },
  // ST2 · SC08 → SC09 (0.27 s; SC08's last word ends f8544)
  { at: 8516, freeze: 8515, landing: 1, next: 2, cards: [8526, 8534, 8554], thumbs: [3019, null, null, null] },
  // ST3 · SC12 → SC13 (0.37 s; SC12's last word ends f12492)
  { at: 12467, freeze: 12466, landing: 2, next: 3, cards: [12477, 12485, 12505], thumbs: [3019, 8515, null, null] },
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
