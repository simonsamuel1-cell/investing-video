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
 * moved 20 more. Then +20 at 2110 (2030 of the original) — "2110 berikan
 * jeda 20 frame … (transisinya juga geser)" — and everything from 2110 on,
 * the SC02 → SC03 cut included, moved 20 more.
 */

/** Scene-local frame for a beat written in GLOBAL frames. */
export const local = (beat: number, from: number) => beat - from;

/**
 * Scene boundaries — each cut at the midpoint of the silence between the two
 * scenes, so they butt end to end and every frame from 0 to END is owned.
 */
export const BLOCK = {
  SC01: 0, SC02: 1019, SC03: 2133,
  SC04: 3125, SC05: 4078, SC06: 5375, SC07: 6457, SC08: 7668,
  SC09: 8622, SC10: 9644, SC11: 10700, SC12: 11786,
  SC13: 12573, SC14: 13709, SC15: 14979,
  SC16: 16018, SC17: 16894, SC18: 18106,
  /** The VO's last word ends on f19094; 206 frames hold the closing card. */
  END: 19300,
} as const;

/** The last frame of speech, for the guard in Composition.tsx. */
export const VO_LAST = 19094;

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
  /**
   * Simon: "2143 Ubah visual jadi jam dinding, kedua jarum jamnya berputar 120
   * derajat, posisi jarum jamnya awalnya dari pukul 02.10" — "1 hari" over it,
   * "24 jam" under it. Then "2300 Jam dan 2 text scroll naik keluar layar. Lalu
   * muncul OrangMikir.png … lalu di sekitarnya muncul 50 text random".
   */
  clock: 2143,
  clockOut: 2300,
  day: 2146, // "Masalahnya,"
  jam: 2265, // "24 jam."
  dewasa: 2324, // "Semakin dewasa,"
  full: 2509, // "…makin banyak."
  /** Simon: "2560 Muncul dulu text kecil 'Pertanyaan 1'" — then the question, word by word as it is spoken. */
  label1: 2560,
  /** Gimana · caranya · aku · bisa · menghasilkan · lebih · banyak? (the word clock, docs/VI01_sentences.json) */
  q1Words: [2674, 2693, 2715, 2726, 2740, 2776, 2793] as const,
  /** "2831 Text sebelumnya transisi hilang, lalu muncul text kecil 'Pertanyaan 2'". */
  label2: 2831,
  /** Gimana · caranya · uang · yang · sudah · aku · hasilkan · ikut bekerja? */
  q2Words: [2936, 2956, 2978, 2992, 3006, 3023, 3035, 3068] as const,
  q1: 2578, // "Jadi selain bertanya, …"
  q1Type: 2674, // the question itself
  q2: 2858, // "Kita juga perlu mulai bertanya:"
  q2Type: 2936,
  ikutBekerja: 3068, // "ikut bekerja?"
};

// ═══ PART 01 — UANG YANG IKUT BEKERJA ═════════════════════════════════════
export const SC04 = {
  title: 3198, // "passive income"
  bukan: 3324, // "Bukan berarti investasi hari ini,"
  strike: 3517, // "…langsung berhenti kerja."
  tetap: [3588, 3650, 3718] as const, // "Kita tetap kerja, tetap bangun karier, dan tetap belajar."
  bedanya: 3808, // "Bedanya,"
  sebagian: 3836, // "sebagian uang yang kita hasilkan"
  aset: 4018, // "menjadi aset."
};

export const SC05 = {
  axis: 4168, // "waktu punya peran besar."
  kalau: 4286, // "Kalau sebuah aset menghasilkan keuntungan,"
  lagi: 4418, // "keuntungan itu bisa ikut menghasilkan keuntungan"
  /** "100 … 110 … 121 … 133" — each bar lands on its own number. */
  bars: [4672, 4764, 4858, 4997] as const,
  compounding: 5152, // "compounding:"
  line: 5218, // "hasil yang terus ikut bertumbuh seiring waktu."
};

export const SC06 = {
  modal: 5536, // "modal besar dulu."
  strike: 5583,
  habit: 5708, // "mulai membangun kebiasaannya."
  habitName: 5771,
  bukanUang: 5858, // "Karena investasi bukan cuma soal uang."
  loop: 6026, // "Semakin sering kita belajar …"
  belajar: 6094, // "belajar"
  toEvaluasi: 6122, // the arrow on to "mengevaluasi"
  toKelola: 6300, // the arrow on to "mengelola aset", under "semakin baik"
  evaluasi: 6135, // "mengevaluasi keputusan,"
  baik: 6252, // "semakin baik juga kemampuan kita"
  kelola: 6384, // "mengelola aset."
};

export const SC07 = {
  split: 6573, // "dua bagian."
  human: 6670, // "human asset:"
  humanRows: [6724, 6766, 6814] as const, // waktu, kemampuan, pengalaman
  financial: 7057, // "financial asset:"
  financialRows: [7128, 7188, 7256] as const, // tabungan, investasi, aset
  batas: 7455, // "punya batas."
  terus: 7507, // "Financial asset bisa terus kita miliki."
};

export const SC08 = {
  muda: 7684, // "Waktu masih muda,"
  idealnya: 7934, // "Tapi idealnya,"
  tumbuh: 8078, // "aset kita juga ikut tumbuh."
  estafet: 8244, // "Bayangin seperti estafet:"
  kerja: 8297, // "kita kerja untuk menghasilkan uang,"
  teruskan: 8400, // "lalu sebagian uang itu kita teruskan"
  aset: 8563, // "untuk membangun aset."
};

// ═══ PART 02 — IKUT PUNYA BISNIS ══════════════════════════════════════════
export const SC09 = {
  company: 8685, // "dari investasi"
  nggak: 8770, // "kita nggak harus bekerja di sebuah perusahaan"
  karyawan: 9120, // "Ada orang yang bekerja di BCA"
  bca: 9194,
  gaji: 9278, // "penghasilan."
  investor: 9348, // "Di sisi lain, sebagai investor,"
  slice: 9533, // "sebagian kecil dari bisnis BCA."
};

export const SC10 = {
  around: 9656, // "Hal yang sama sebenarnya ada di sekitar kita"
  products: [9908, 9964, 10012, 10069] as const, // Indomie, Ultra Milk, dan banyak produk
  konsumen: 10164, // "Sebagai konsumen,"
  flip: 10370, // "Tapi lewat investasi,"
  pemilik: 10519, // "sebagian kecil dari bisnis"
  balik: 10604, // "di balik produk-produk itu."
};

export const SC11 = {
  uang: 10759, // "bedanya antara sekadar menghasilkan uang,"
  aset: 10970, // "dengan mulai membangun aset."
  wheel: 11100, // "Sebuah bisnis"
  steps: [11188, 11222, 11355] as const, // pendapatan, laba, berkembang
  pemilik: 11430, // "Sebagai pemilik sebagian dari bisnis tersebut,"
  exposure: 11628, // "exposure terhadap pertumbuhan nilainya."
};

export const SC12 = {
  start: 11837, // "nggak harus besar."
  /** "Rp50 … Rp100 … Rp300" — 28 f then 83 f apart; pops, not reveals. */
  amounts: [11925, 11953, 12036] as const,
  dim: 12165, // "bukan nominal pertamanya,"
  habit: 12254, // "tapi kebiasaan untuk menyisihkan sebagian income"
  aset: 12473, // "dan mulai mengubahnya menjadi aset."
};

// ═══ PART 03 — CERITA LO KHENG HONG ═══════════════════════════════════════
export const SC13 = {
  name: 12584, // "Lo Kheng Hong"
  /** The four steps of the timeline, each on its word. */
  steps: [13026, 13131, 13195, 13298] as const, // pegawai bank, menabung, membaca laporan, pelan-pelan
  untr: 13620, // "United Tractors."
};

export const SC14 = {
  krisis: 13750, // "krisis 1998,"
  rp250: 14063, // "Rp250 per saham."
  later: 14168, // "Beberapa tahun kemudian,"
  lipat: 14300, // "berkali-kali lipat,"
  rp15: 14500, // "Rp15 ribu."
  caution: 14560, // "Tapi tentu saja, ini adalah contoh dari masa lalu."
  nggak: 14782, // "Nggak semua investasi …"
};

export const SC15 = {
  bukan: 14984, // "Yang menarik dari cerita ini sebenarnya bukan:"
  quote: 15133, // "“Cari saham …”"
  strike: 15312, // "Yang lebih penting justru prosesnya."
  /** The five steps, each on its word (88 / 96 / 64 / 172). */
  steps: [15464, 15552, 15648, 15712, 15884] as const,
};

// ═══ PENUTUP ═══════════════════════════════════════════════════════════════
export const SC16 = {
  lari: 16192, // "lari dari pekerjaan."
  strike: 16241,
  tetap: [16365, 16407, 16482] as const, // karier, keluarga, menikmati hidup
  bedanya: 16586, // "Bedanya, sebagian hasil kerja kita hari ini"
  depan: 16836, // "untuk masa depan."
};

export const SC17 = {
  kecil: 16941, // "aset kita mungkin masih kecil."
  grow: [17107, 17198, 17270] as const, // kemampuan, income, aset
  pillars: 17354, // "pelan-pelan kita nggak cuma punya satu sumber kekuatan finansial."
  pilihan: 17627, // "lebih banyak pilihan."
  tanya: 17728, // "Jadi setiap kali income masuk, coba tanya:"
  quote: 17912, // "“Berapa yang bisa aku sisihkan …”"
  mark: 18040, // "mulai punya aset?"
};

export const SC18 = {
  kerja: 18184, // "kerja berarti kita menggunakan waktu …"
  investasi: 18410, // "Sedangkan investasi,"
  bekerja: 18648, // "ikut bekerja untuk masa depan."
  close: 18792, // "Jadi kita pelan-pelan berubah …"
  mark: 19046, // "juga punya aset."
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
  // ST2 · SC08 → SC09 (0.27 s; SC08's last word ends f8614)
  { at: 8586, freeze: 8585, landing: 1, next: 2, cards: [8596, 8604, 8624], thumbs: [3089, null, null, null] },
  // ST3 · SC12 → SC13 (0.37 s; SC12's last word ends f12562)
  { at: 12537, freeze: 12536, landing: 2, next: 3, cards: [12547, 12555, 12575], thumbs: [3089, 8585, null, null] },
];

/**
 * ST1 · SC03 → SC04 is its own — Simon: "Semua fade out, lalu masuk scene
 * transisi. Tapi scene transisi kali mau ku buat berbeda. Background tetap
 * kotak kotak bergerak. Lalu muncul 4 point scrollable (Introduction, Passive
 * Income, Punya Bisnis, Lo Kheng Hong), size kecil, font huruf sambung,
 * abu-abu terang. Buat begini dulu jangan dianimasikan." — and "fade outnya di
 * 3155 aja". SC03 holds on its last frame past its block until `out`, fades,
 * the grid and the list come up, and the whole card leaves off SC04 at `end`.
 */
export const LIST_TRANS = { freeze: 3124, out: 3155, end: 3260 };
export const LIST_POINTS = ["Introduction", "Passive Income", "Punya Bisnis", "Lo Kheng Hong"];

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
