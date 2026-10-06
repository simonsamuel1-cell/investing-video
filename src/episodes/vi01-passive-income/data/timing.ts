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
 * after 230 moved 30 more. Then +20 at 530 (470 of the original) — "530
 * kasih jeda 20 frame. visual dan vo geser" — and everything from 530 on
 * moved 20 more.
 */

/** Scene-local frame for a beat written in GLOBAL frames. */
export const local = (beat: number, from: number) => beat - from;

/**
 * Scene boundaries — each cut at the midpoint of the silence between the two
 * scenes, so they butt end to end and every frame from 0 to END is owned.
 */
export const BLOCK = {
  SC01: 0, SC02: 1019, SC03: 2113,
  SC04: 3105, SC05: 4058, SC06: 5355, SC07: 6437, SC08: 7648,
  SC09: 8602, SC10: 9624, SC11: 10680, SC12: 11766,
  SC13: 12553, SC14: 13689, SC15: 14959,
  SC16: 15998, SC17: 16874, SC18: 18086,
  /** The VO's last word ends on f19074; 206 frames hold the closing card. */
  END: 19280,
} as const;

/** The last frame of speech, for the guard in Composition.tsx. */
export const VO_LAST = 19074;

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
  photo: [276, 550] as const, // starts up as the pair is still leaving, so the frame is never empty
  /** Simon: "395 — Kerja dan orang kerja png geser kiri dan fade out", then the phone to the middle and six icons. */
  spend: 395,
  /**
   * Simon: "555 Hp dan 6 icon fade out. Lalu muncul text 'Tapi coba bayangin:
   * suatu hari harus berhenti kerja sementara', tapi satu per satu" — "Tapi"
   * once they are gone, "coba bayangin:" at 591, the rest (and Layoff.png) at 652.
   */
  bayangin: [555, 591, 652] as const,
  /**
   * "861 Gambarnya membesar hingga close up pada wajah … langsung ganti ke
   * OrangBingung.png. Text di atas juga ganti 'Apakah penghasilan kita juga
   * ikut berhenti?'" — the push starts here; the swap lands as it ends.
   */
  closeUp: 861,
  kerja: 266, // "Kita kerja," — measured in the audio (3.44 s of the recording), after both pads
  /** The Kerja node, once the pair has cleared the frame. */
  kerjaNode: 306,
  penghasilan: 331, // "dapat penghasilan,"
  hidup: 490, // "…menjalani hidup."
  berhenti: 751, // "berhenti kerja sementara"
  apakah: 876, // "Apakah penghasilan kita juga ikut berhenti?"
};

export const SC02 = {
  title: 1036, // "Makanya,"
  /** The five, each on its own word — NOT an even grid (72 / 92 / 58 / 142). */
  ways: [1338, 1410, 1502, 1560, 1702] as const,
  bagus: 1782, // "Semua itu bagus,"
  waktu: 2022, // "waktu dan tenaga kita."
  /**
   * Simon: "1940 Text 5 bubble fade out dan text box juga menghilang (animasi
   * reverse), lalu buat semua 5 bubble berkumpul di 'Bangun bisnis', lalu semua
   * bubble menghilang fade out, dan nextnya muncul text 'Waktu + Tenaga'".
   */
  gather: 1940,
};

export const SC03 = {
  day: 2126, // "Masalahnya,"
  jam: 2245, // "24 jam."
  dewasa: 2304, // "Semakin dewasa,"
  full: 2489, // "…makin banyak."
  q1: 2558, // "Jadi selain bertanya, …"
  q1Type: 2654, // the question itself
  q2: 2838, // "Kita juga perlu mulai bertanya:"
  q2Type: 2916,
  ikutBekerja: 3048, // "ikut bekerja?"
};

// ═══ PART 01 — UANG YANG IKUT BEKERJA ═════════════════════════════════════
export const SC04 = {
  title: 3178, // "passive income"
  bukan: 3304, // "Bukan berarti investasi hari ini,"
  strike: 3497, // "…langsung berhenti kerja."
  tetap: [3568, 3630, 3698] as const, // "Kita tetap kerja, tetap bangun karier, dan tetap belajar."
  bedanya: 3788, // "Bedanya,"
  sebagian: 3816, // "sebagian uang yang kita hasilkan"
  aset: 3998, // "menjadi aset."
};

export const SC05 = {
  axis: 4148, // "waktu punya peran besar."
  kalau: 4266, // "Kalau sebuah aset menghasilkan keuntungan,"
  lagi: 4398, // "keuntungan itu bisa ikut menghasilkan keuntungan"
  /** "100 … 110 … 121 … 133" — each bar lands on its own number. */
  bars: [4652, 4744, 4838, 4977] as const,
  compounding: 5132, // "compounding:"
  line: 5198, // "hasil yang terus ikut bertumbuh seiring waktu."
};

export const SC06 = {
  modal: 5516, // "modal besar dulu."
  strike: 5563,
  habit: 5688, // "mulai membangun kebiasaannya."
  habitName: 5751,
  bukanUang: 5838, // "Karena investasi bukan cuma soal uang."
  loop: 6006, // "Semakin sering kita belajar …"
  belajar: 6074, // "belajar"
  toEvaluasi: 6102, // the arrow on to "mengevaluasi"
  toKelola: 6280, // the arrow on to "mengelola aset", under "semakin baik"
  evaluasi: 6115, // "mengevaluasi keputusan,"
  baik: 6232, // "semakin baik juga kemampuan kita"
  kelola: 6364, // "mengelola aset."
};

export const SC07 = {
  split: 6553, // "dua bagian."
  human: 6650, // "human asset:"
  humanRows: [6704, 6746, 6794] as const, // waktu, kemampuan, pengalaman
  financial: 7037, // "financial asset:"
  financialRows: [7108, 7168, 7236] as const, // tabungan, investasi, aset
  batas: 7435, // "punya batas."
  terus: 7487, // "Financial asset bisa terus kita miliki."
};

export const SC08 = {
  muda: 7664, // "Waktu masih muda,"
  idealnya: 7914, // "Tapi idealnya,"
  tumbuh: 8058, // "aset kita juga ikut tumbuh."
  estafet: 8224, // "Bayangin seperti estafet:"
  kerja: 8277, // "kita kerja untuk menghasilkan uang,"
  teruskan: 8380, // "lalu sebagian uang itu kita teruskan"
  aset: 8543, // "untuk membangun aset."
};

// ═══ PART 02 — IKUT PUNYA BISNIS ══════════════════════════════════════════
export const SC09 = {
  company: 8665, // "dari investasi"
  nggak: 8750, // "kita nggak harus bekerja di sebuah perusahaan"
  karyawan: 9100, // "Ada orang yang bekerja di BCA"
  bca: 9174,
  gaji: 9258, // "penghasilan."
  investor: 9328, // "Di sisi lain, sebagai investor,"
  slice: 9513, // "sebagian kecil dari bisnis BCA."
};

export const SC10 = {
  around: 9636, // "Hal yang sama sebenarnya ada di sekitar kita"
  products: [9888, 9944, 9992, 10049] as const, // Indomie, Ultra Milk, dan banyak produk
  konsumen: 10144, // "Sebagai konsumen,"
  flip: 10350, // "Tapi lewat investasi,"
  pemilik: 10499, // "sebagian kecil dari bisnis"
  balik: 10584, // "di balik produk-produk itu."
};

export const SC11 = {
  uang: 10739, // "bedanya antara sekadar menghasilkan uang,"
  aset: 10950, // "dengan mulai membangun aset."
  wheel: 11080, // "Sebuah bisnis"
  steps: [11168, 11202, 11335] as const, // pendapatan, laba, berkembang
  pemilik: 11410, // "Sebagai pemilik sebagian dari bisnis tersebut,"
  exposure: 11608, // "exposure terhadap pertumbuhan nilainya."
};

export const SC12 = {
  start: 11817, // "nggak harus besar."
  /** "Rp50 … Rp100 … Rp300" — 28 f then 83 f apart; pops, not reveals. */
  amounts: [11905, 11933, 12016] as const,
  dim: 12145, // "bukan nominal pertamanya,"
  habit: 12234, // "tapi kebiasaan untuk menyisihkan sebagian income"
  aset: 12453, // "dan mulai mengubahnya menjadi aset."
};

// ═══ PART 03 — CERITA LO KHENG HONG ═══════════════════════════════════════
export const SC13 = {
  name: 12564, // "Lo Kheng Hong"
  /** The four steps of the timeline, each on its word. */
  steps: [13006, 13111, 13175, 13278] as const, // pegawai bank, menabung, membaca laporan, pelan-pelan
  untr: 13600, // "United Tractors."
};

export const SC14 = {
  krisis: 13730, // "krisis 1998,"
  rp250: 14043, // "Rp250 per saham."
  later: 14148, // "Beberapa tahun kemudian,"
  lipat: 14280, // "berkali-kali lipat,"
  rp15: 14480, // "Rp15 ribu."
  caution: 14540, // "Tapi tentu saja, ini adalah contoh dari masa lalu."
  nggak: 14762, // "Nggak semua investasi …"
};

export const SC15 = {
  bukan: 14964, // "Yang menarik dari cerita ini sebenarnya bukan:"
  quote: 15113, // "“Cari saham …”"
  strike: 15292, // "Yang lebih penting justru prosesnya."
  /** The five steps, each on its word (88 / 96 / 64 / 172). */
  steps: [15444, 15532, 15628, 15692, 15864] as const,
};

// ═══ PENUTUP ═══════════════════════════════════════════════════════════════
export const SC16 = {
  lari: 16172, // "lari dari pekerjaan."
  strike: 16221,
  tetap: [16345, 16387, 16462] as const, // karier, keluarga, menikmati hidup
  bedanya: 16566, // "Bedanya, sebagian hasil kerja kita hari ini"
  depan: 16816, // "untuk masa depan."
};

export const SC17 = {
  kecil: 16921, // "aset kita mungkin masih kecil."
  grow: [17087, 17178, 17250] as const, // kemampuan, income, aset
  pillars: 17334, // "pelan-pelan kita nggak cuma punya satu sumber kekuatan finansial."
  pilihan: 17607, // "lebih banyak pilihan."
  tanya: 17708, // "Jadi setiap kali income masuk, coba tanya:"
  quote: 17892, // "“Berapa yang bisa aku sisihkan …”"
  mark: 18020, // "mulai punya aset?"
};

export const SC18 = {
  kerja: 18164, // "kerja berarti kita menggunakan waktu …"
  investasi: 18390, // "Sedangkan investasi,"
  bekerja: 18628, // "ikut bekerja untuk masa depan."
  close: 18772, // "Jadi kita pelan-pelan berubah …"
  mark: 19026, // "juga punya aset."
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
  // ST1 · SC03 → SC04 (0.30 s of air; SC03's last word ends f3096)
  { at: 3070, freeze: 3069, landing: 0, next: 1, cards: [3088, 3098, 3108], thumbs: [null, null, null, null] },
  // ST2 · SC08 → SC09 (0.27 s; SC08's last word ends f8594)
  { at: 8566, freeze: 8565, landing: 1, next: 2, cards: [8576, 8584, 8604], thumbs: [3069, null, null, null] },
  // ST3 · SC12 → SC13 (0.37 s; SC12's last word ends f12542)
  { at: 12517, freeze: 12516, landing: 2, next: 3, cards: [12527, 12535, 12555], thumbs: [3069, 8565, null, null] },
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
