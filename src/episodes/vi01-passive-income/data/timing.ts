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
 * the SC02 → SC03 cut included, moved 20 more. Then +30 at 3316 (3216 of
 * the original) — "3316 beri jeda 30 frame, vo dan visual ikut geser" — and
 * everything from 3316 on moved 30 more.
 *
 * Then two RETAKES (data/retakes.json): "10 Bukan berarti.MP3" from 3335 and
 * "11 Tetap kerja.MP3" after it, replacing 3335-3612 and 3612-3812. 3335 was
 * 19 frames into that pause, so it keeps 19; the takes are longer than what
 * they replace, so everything after 3812 moved 55 later. Beats inside the
 * takes were carried from the old speech onto the new linearly. Then +30 at
 * 4150 (3965 of the original) — "4150 beri jeda 30 frame" — and everything
 * from 4150 on moved 30 more. Then +20 at 6571 (6356 of the original) —
 * "6571 kasih jeda 20 frame" — and everything from 6571 on, the SC06 → SC07
 * cut included, moved 20 more.
 */

/** Scene-local frame for a beat written in GLOBAL frames. */
export const local = (beat: number, from: number) => beat - from;

/**
 * Scene boundaries — each cut at the midpoint of the silence between the two
 * scenes, so they butt end to end and every frame from 0 to END is owned.
 */
export const BLOCK = {
  SC01: 0, SC02: 1019, SC03: 2133,
  SC04: 3125, SC05: 4193, SC06: 5490, SC07: 6592, SC08: 7803,
  SC09: 8757, SC10: 9779, SC11: 10835, SC12: 11921,
  SC13: 12708, SC14: 13844, SC15: 15114,
  SC16: 16153, SC17: 17029, SC18: 18241,
  /** The VO's last word ends on f19229; 206 frames hold the closing card. */
  END: 19435,
} as const;

/** The last frame of speech, for the guard in Composition.tsx. */
export const VO_LAST = 19229;

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
  /**
   * The Total Asset card — "Remake gambar ini" — then "UI nya ikut muncul dari
   * 3290, anchor to Passive Income": it comes up with the carried title, riding
   * under it.
   */
  asset: [3290] as const,
  /** "jumlah cash dan invested nya berubah dari 3396-3488" — the cash counts across into investments. */
  invest: [3396, 3488] as const,
  /** "Lalu UI ini scroll keluar layar ke kiri, lalu dari kanan geser masuk Orang Resign.png" */
  resign: 3500,
  /**
   * "3619-3858 Orang Resign nya scroll ke kiri keluar layar. Lalu dari kanan,
   * masuk Orang Tuntun png (preview dari kepala hingga dada)" — ending "300 px
   * ke kiri dari tengah"; it fades at the end of the range. ("My bad, harusnya
   * Orang Tuntun 2.")
   */
  tuntun: [3619] as const, // Orang Resign leaves here (OrangTuntun2 itself was taken out again)
  /**
   * "3859 Instead of visual fade out semua, buat Orang Tuntun nya geser ke kiri
   * kluar layar. Lalu yang 3 poin, extend ke kanan membuat mapping seperti
   * gambar" — the three to the left, their lines drawn into "Penghasilan" on
   * "uang yang kita hasilkan", which branches into "ubah jadi asset" and
   * "Simpan" on "ubah menjadi aset".
   */
  map: 3856,
  /**
   * Then: "yang 3 poin, remove Orang Tuntun nya … di tengah layar … indigo. Di
   * sebelah kanan tiap poin ada icon (Monitor, Tas kerja, Toga pendidikan)" in
   * bubbles; "saat transisi di 3856, geser ke kiri dan kotak & check & text nya
   * fade out kecuali icons nya"; "3967 Text Penghasilannya ada icon uang di
   * atasnya … indigo"; "4048 Muncul garis ke kanannya … jadi 'Asset' saja
   * dengan icon perusahaan."
   */
  hub: 3967,
  branch: 4048,
  bukan: 3349, // "Bukan berarti investasi hari ini,"
  strike: 3558, // "…langsung berhenti kerja."
  tetap: [3639, 3706, 3788] as const, // "Kita tetap kerja, tetap bangun karier, dan tetap belajar."
  bedanya: 3893, // "Bedanya,"
  sebagian: 3921, // "sebagian uang yang kita hasilkan"
  aset: 4103, // "menjadi aset."
};

export const SC05 = {
  /**
   * Simon: "Di 4257, Passive Income mengecil sedikit, lalu di atasnya ada
   * tambahan text judul 'Peran Waktu di'." The title is the one carried from
   * ST1 — it rides through the SC04 → SC05 cut untouched ("Transisi camera cut
   * nya tetap ada, kecuali Passive Income"), and the grid fades in behind it.
   */
  peran: 4257,
  /**
   * The coin tree, in three steps — "4327 Tahap 1: satu koin di tengah; 4383
   * Tahap 2: 5 koin dari koin tengah; 4546 Tahap 3: 10 koin di paling luar."
   */
  tree: [4327, 4383, 4546] as const,
  /** "4715 Semua visual hilang kecuali judul, garis waktu muncul, di bawah garis waktu juga ada Tahun 1 … Tahun 4" */
  axis: 4715,
  kalau: 4401, // "Kalau sebuah aset menghasilkan keuntungan,"
  lagi: 4533, // "keuntungan itu bisa ikut menghasilkan keuntungan"
  /** Simon: one bar per year — "4768 … Tahun 1, 4850 … Tahun 2, 4946 … Tahun 3, 5045 … Tahun 4". */
  bars: [4768, 4850, 4946, 5045] as const,
  compounding: 5267, // "compounding:"
  /**
   * Simon: "5462 seluruh visual geser naik hingga keluar layar, kecuali
   * background kotak kotaknya. At the same time, anchor to visual chart, dari
   * bawah geser masuk visual baru" — the Bank balance card. That scroll is the
   * SC05 → SC06 transition: the card rides across the cut, so the cut itself
   * is gone (CUTS).
   */
  scroll: 5462,
  line: 5333, // "hasil yang terus ikut bertumbuh seiring waktu."
};

export const SC06 = {
  /** "5578 balancenya dari Rp 0,- jadi Rp 1,000,000,000,- dan UI nya ikut membesar 10%" */
  balance: 5578,
  /**
   * Simon: "5700 Hapus visual di sini. Buat 3 row" — Bulan 1-3, each a Bank
   * balance card and a Total invested card, a coin sent across, 30 frames
   * apart. `months` is when the rows come up; `send` is each row's coin.
   */
  months: 5700,
  send: [5760, 5790, 5820] as const,
  /**
   * "Gimana kalo kartu Total Investednya 1 aja, jadi dari 5800-5885 angkanya
   * naik dari 0 hingga 15,000,000. 1 kartunya ini sejajar dengan row bulan 2."
   */
  invested: [5800, 5885] as const,
  /** "5931 Muncul text box garis putus putus di atas subtitle, isinya 'Investasi bukan cuma soal uang'" */
  notMoney: 5931,
  /**
   * "6127 text dan textbox nya juga ikut hilang, tapi dengan reverse
   * animation. lalu muncul OrangTuntun2 dari bawah, masuk … diperbesar hingga
   * perut." The months go with it.
   */
  tuntun: 6127,
  /**
   * "Sekarang buat lingkaran putih nya berjalan dari kiri ke kanan mengikuti
   * trail nya. Ada 6 titik, termasuk end point garis, setiap titik yang
   * dilewati lingkaran, muncul text" — when it reaches each of the six:
   * Belajar, Belajar, Evaluasi, Evaluasi, Skill acquired, Skill owned.
   */
  /* "aku mau animasinya selesai di 6388" — the six evenly from the walker's start */
  walk: [6246, 6274, 6303, 6331, 6360, 6388] as const,
  modal: 5651, // "modal besar dulu."
  strike: 5698,
  habit: 5823, // "mulai membangun kebiasaannya."
  habitName: 5886,
  bukanUang: 5973, // "Karena investasi bukan cuma soal uang."
  loop: 6141, // "Semakin sering kita belajar …"
  belajar: 6209, // "belajar"
  toEvaluasi: 6237, // the arrow on to "mengevaluasi"
  toKelola: 6415, // the arrow on to "mengelola aset", under "semakin baik"
  evaluasi: 6250, // "mengevaluasi keputusan,"
  baik: 6367, // "semakin baik juga kemampuan kita"
  kelola: 6499, // "mengelola aset."
};

export const SC07 = {
  /**
   * Simon: "6653 mulai muncul text 'Kekayaan punya 2 bagian' di tengah
   * horizontal vertikal, animasi munculnya adalah ketikan, setelah muncul
   * textnya geser naik ke bagian atas layar." Then "6761 muncul kartu pertama,
   * tapi muncul dari tengah dulu secara horizontal … kecilin … fit to 3 poin
   * dan judul."
   */
  heading: 6653,
  card1: 6761,
  /**
   * "7153 Kartu human asset geser naik 40 px, transparansi jadi 40%, size
   * mengecil 10%. Lalu di tempat … kartu human asset sebelum geser naik,
   * muncul kartu kedua Financial Asset. Stylenya samakan."
   */
  card2: 7153,
  /** "7534 Kedua kartu dibuat side-by-side … Lalu di bawah kartu human asset muncul text 'punya batas'" */
  side: 7534,
  /** "7647 muncul text 'bisa terus dimiliki' di bawah kartu financial asset." */
  forever: 7647,
  split: 6708, // "dua bagian."
  human: 6805, // "human asset:"
  humanRows: [6859, 6901, 6949] as const, // waktu, kemampuan, pengalaman
  financial: 7192, // "financial asset:"
  financialRows: [7263, 7323, 7391] as const, // tabungan, investasi, aset
  batas: 7590, // "punya batas."
  terus: 7642, // "Financial asset bisa terus kita miliki."
};

export const SC08 = {
  /**
   * Simon: "7803 Ada Orang Kerja png di layar bagian kanan, lalu di atasnya
   * ada UI Account balance, lalu muncul juga GedungKantor.png di bagian layar
   * sebelah kiri". They hold until the relay ("estafet").
   */
  office: 7803,
  /**
   * "7883 Gedung kantor mengirim koin dan account balance berubah dari
   * Rp 5,000,000 jadi 25,000,000" — a coin with a dashed trail; the balance
   * pulses green as it counts, a green up-triangle beside it.
   */
  pay: 7883,
  /**
   * "8083 GedungKantor nya geser ke kiri hingga keluar layar, Orang Kerjanya
   * geser ke kiri ke posisi Gedung Kantor. Lalu dari kanan (luar layar), masuk
   * UI Total Invested."
   */
  shift: 8083,
  /** "8138 Total invested nominalnya jadi Rp 5,000,000. Ada animasi koin dari UI account balance ke UI total invested" (dashed indigo trail). */
  invest: 8138,
  /** "8310 Gedungnya masuk lagi, membentuk bagan Gedung-OrangKerja-Asset" */
  chart: 8310,
  muda: 7819, // "Waktu masih muda,"
  idealnya: 8069, // "Tapi idealnya,"
  tumbuh: 8213, // "aset kita juga ikut tumbuh."
  estafet: 8379, // "Bayangin seperti estafet:"
  kerja: 8432, // "kita kerja untuk menghasilkan uang,"
  teruskan: 8535, // "lalu sebagian uang itu kita teruskan"
  aset: 8698, // "untuk membangun aset."
};

// ═══ PART 02 — IKUT PUNYA BISNIS ══════════════════════════════════════════
export const SC09 = {
  company: 8820, // "dari investasi"
  nggak: 8905, // "kita nggak harus bekerja di sebuah perusahaan"
  karyawan: 9255, // "Ada orang yang bekerja di BCA"
  bca: 9329,
  gaji: 9413, // "penghasilan."
  investor: 9483, // "Di sisi lain, sebagai investor,"
  slice: 9668, // "sebagian kecil dari bisnis BCA."
};

export const SC10 = {
  around: 9791, // "Hal yang sama sebenarnya ada di sekitar kita"
  products: [10043, 10099, 10147, 10204] as const, // Indomie, Ultra Milk, dan banyak produk
  konsumen: 10299, // "Sebagai konsumen,"
  flip: 10505, // "Tapi lewat investasi,"
  pemilik: 10654, // "sebagian kecil dari bisnis"
  balik: 10739, // "di balik produk-produk itu."
};

export const SC11 = {
  uang: 10894, // "bedanya antara sekadar menghasilkan uang,"
  aset: 11105, // "dengan mulai membangun aset."
  wheel: 11235, // "Sebuah bisnis"
  steps: [11323, 11357, 11490] as const, // pendapatan, laba, berkembang
  pemilik: 11565, // "Sebagai pemilik sebagian dari bisnis tersebut,"
  exposure: 11763, // "exposure terhadap pertumbuhan nilainya."
};

export const SC12 = {
  start: 11972, // "nggak harus besar."
  /** "Rp50 … Rp100 … Rp300" — 28 f then 83 f apart; pops, not reveals. */
  amounts: [12060, 12088, 12171] as const,
  dim: 12300, // "bukan nominal pertamanya,"
  habit: 12389, // "tapi kebiasaan untuk menyisihkan sebagian income"
  aset: 12608, // "dan mulai mengubahnya menjadi aset."
};

// ═══ PART 03 — CERITA LO KHENG HONG ═══════════════════════════════════════
export const SC13 = {
  name: 12719, // "Lo Kheng Hong"
  /** The four steps of the timeline, each on its word. */
  steps: [13161, 13266, 13330, 13433] as const, // pegawai bank, menabung, membaca laporan, pelan-pelan
  untr: 13755, // "United Tractors."
};

export const SC14 = {
  krisis: 13885, // "krisis 1998,"
  rp250: 14198, // "Rp250 per saham."
  later: 14303, // "Beberapa tahun kemudian,"
  lipat: 14435, // "berkali-kali lipat,"
  rp15: 14635, // "Rp15 ribu."
  caution: 14695, // "Tapi tentu saja, ini adalah contoh dari masa lalu."
  nggak: 14917, // "Nggak semua investasi …"
};

export const SC15 = {
  bukan: 15119, // "Yang menarik dari cerita ini sebenarnya bukan:"
  quote: 15268, // "“Cari saham …”"
  strike: 15447, // "Yang lebih penting justru prosesnya."
  /** The five steps, each on its word (88 / 96 / 64 / 172). */
  steps: [15599, 15687, 15783, 15847, 16019] as const,
};

// ═══ PENUTUP ═══════════════════════════════════════════════════════════════
export const SC16 = {
  lari: 16327, // "lari dari pekerjaan."
  strike: 16376,
  tetap: [16500, 16542, 16617] as const, // karier, keluarga, menikmati hidup
  bedanya: 16721, // "Bedanya, sebagian hasil kerja kita hari ini"
  depan: 16971, // "untuk masa depan."
};

export const SC17 = {
  kecil: 17076, // "aset kita mungkin masih kecil."
  grow: [17242, 17333, 17405] as const, // kemampuan, income, aset
  pillars: 17489, // "pelan-pelan kita nggak cuma punya satu sumber kekuatan finansial."
  pilihan: 17762, // "lebih banyak pilihan."
  tanya: 17863, // "Jadi setiap kali income masuk, coba tanya:"
  quote: 18047, // "“Berapa yang bisa aku sisihkan …”"
  mark: 18175, // "mulai punya aset?"
};

export const SC18 = {
  kerja: 18319, // "kerja berarti kita menggunakan waktu …"
  investasi: 18545, // "Sedangkan investasi,"
  bekerja: 18783, // "ikut bekerja untuk masa depan."
  close: 18927, // "Jadi kita pelan-pelan berubah …"
  mark: 19181, // "juga punya aset."
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
  // ST2 · SC08 → SC09 (0.27 s; SC08's last word ends f8749)
  { at: 8721, freeze: 8720, landing: 1, next: 2, cards: [8731, 8739, 8759], thumbs: [3089, null, null, null] },
  // ST3 · SC12 → SC13 (0.37 s; SC12's last word ends f12697)
  { at: 12672, freeze: 12671, landing: 2, next: 3, cards: [12682, 12690, 12710], thumbs: [3089, 8720, null, null] },
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
/**
 * Then the lens — "Di tengah layar, buat 2 garis horizontal dengan jarak 200 px" (later 150
 * … masking … seperti menjadi lensa pembesar. Text Introduction akan di
 * dalamnya terlebih dahulu, lalu akan scroll naik per poin." At `scroll` the
 * list moves up one point, carrying "Passive Income" into the lens.
 */
/**
 * …and its end — Simon: "buat text 'Passive Income' di scene transisi tetap
 * saja (jangan fade out), lalu buat text lainnya dan background kotak kotaknya
 * fade out. Next scene yang harusnya ada fade in text Passive Income, tidak
 * jadi." From `end` everything but the word fades; from `carry` the word eases
 * up into SC04's title place; at `handoff` SC04's title takes over, already
 * there — no fade-in of its own.
 */
export const LIST_TRANS = { freeze: 3124, out: 3155, scroll: 3205, end: 3260, carry: 3284, handoff: 3324 };
/** SC04's title, where the carried word lands. */
export const SC04_TITLE = { y: 230, size: 88 };
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
