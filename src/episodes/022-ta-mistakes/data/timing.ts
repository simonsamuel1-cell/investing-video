/**
 * data/timing.ts — the frame table, VO-LOCKED.
 *
 * ⚠ EVERY NUMBER IS COPIED FROM docs/Video22_TA_Mistakes_Script_SYNCED.md AND
 * IS ALREADY IN 60fps FRAMES. That table was computed from the corrected SRT's
 * milliseconds (assets/TA_Mistakes_Sub_CORRECTED.srt). Nothing here converts,
 * re-derives or doubles anything.
 *
 * BLOCK boundaries, not VO in/out: each scene runs until the next begins, cut
 * at the midpoint of the silence between them, so the timeline is continuous
 * from f0 to BLOCK.END and no frame is unowned.
 */

/** Scene-local frame for a beat written in GLOBAL frames.
 *
 *  ⚠ THIS IS WHAT MAKES A RIPPLE EDIT SAFE. Every beat inside a scene is
 *  `local(V.x, FROM)`, so its global frame is `FROM + (x − FROM)` = `x`
 *  whatever FROM becomes. Only the scene's own frame-zero work moves.
 *  Anything handed to CameraCut is the opposite — it wants `f + FROM`. */
export const local = (beat: number, from: number) => beat - from;

export const BLOCK = {
  SC01: 0, SC02: 646, SC03: 1140,
  SC04: 1995, SC05: 3084,
  SC06: 4047, SC07: 5031,
  SC08: 5954, SC09: 7034, SC10: 7965, SC11: 8968,
  SC12: 10005, SC13: 11044,
  SC14: 12316, SC15: 13040, SC16: 13670, SC17: 14750, SC18: 15724,
  /**
   * ⚠ 180 FRAMES PAST THE LAST WORD. The voice ends on 16620 and the closing
   * quote card is still standing there; ending on that frame cuts the last
   * sentence off at the moment it lands. Nothing starts these three seconds —
   * SC18's duration is `END - SC18` and the tail is the closing picture held.
   */
  END: 16800,
} as const;

/**
 * The six transition cards, as OVERLAY windows.
 *
 * ⚠ THEY STRADDLE THE CUT. The recording leaves 0.30–0.83 s of silence at these
 * six joins — enough for all six, which is why NONE of them had to be folded
 * into a scene and why the VO needed no padding. Each starts 36 f before the
 * outgoing scene's last word ends and clears 36 f after the incoming scene's
 * first word starts; by then the outgoing scene has made its point.
 */
export const CARDS = {
  roadmap: { at: 1938, over: 114 },
  ch02: { at: 4002, over: 90 },
  ch03: { at: 5908, over: 92 },
  /** ⚠ THE LONGEST ONE, 122 f — this join has 0.83 s of air, the most in the
   *  whole recording. It is the only card that is not fighting for room. */
  ch04: { at: 9944, over: 122 },
  ch05: { at: 12262, over: 108 },
  recap: { at: 15676, over: 96 },
} as const;

/** The roadmap, as five parts. Verb-first, and the same object all the way
 *  through: it opens at 1938, lights the next part on every chapter card, and
 *  comes back all-✓ under `CARDS.recap`. (CG-D) */
export const STEPS = [
  { n: "01", label: "Tentukan Invalidation" },
  { n: "02", label: "Kendalikan Emosi" },
  { n: "03", label: "Jaga Objektivitas" },
  { n: "04", label: "Uji Skenario di Chart" },
  { n: "05", label: "Jalankan Prosesmu" },
] as const;

/**
 * ═══ CG-E · THE MISTAKE COUNTER ═══
 *
 * ONE chip, top-left, whose number climbs 01 → 08. It is a single mounted
 * layer rather than a heading each scene draws for itself, because eight
 * headings that happen to look alike are eight headings.
 *
 * ⚠ IT LEAVES FOR PART 04. SC12–SC13 are the worked example, not another
 * entry in the list, and leaving the counter up there would file the ADMR case
 * as "mistake 07½".
 */
export const COUNTER = {
  from: BLOCK.SC04,
  to: BLOCK.SC15,
  /** Out for the ADMR case study. */
  gap: { from: BLOCK.SC12, to: BLOCK.SC14 },
  over: 18,
  items: [
    { n: "01", label: "TANPA INVALIDATION", at: BLOCK.SC04 },
    { n: "02", label: "OVERTRADING", at: BLOCK.SC06 },
    { n: "03", label: "REVENGE TRADING", at: BLOCK.SC07 },
    { n: "04", label: "CONFIRMATION BIAS", at: BLOCK.SC08 },
    { n: "05", label: "ABAI KONTEKS MARKET", at: BLOCK.SC09 },
    { n: "06", label: "INDICATOR OVERLOAD", at: BLOCK.SC10 },
    { n: "07", label: "HINDSIGHT BIAS", at: BLOCK.SC11 },
    { n: "08", label: "ASAL COPY TRADE", at: BLOCK.SC14 },
  ],
} as const;

/**
 * ═══ ⚠ A/B LEVER — CG-A's CHART DESIGN ═══
 *
 *   "dashboard" → Simon's `Chart Dashboard.jpeg`: ticker strip, an instrument
 *                 header with the price opposite the name, a right-hand scale
 *                 and a 2×3 grid of stat tiles beside the plot. Every readout
 *                 counts with the tape.
 *   "ma"        → VIDEO 19's GGRM panel: one identity line, indicator pills
 *                 opposite it, a big price scale down the LEFT, month labels
 *                 along the bottom, and nothing else.
 *
 * ⚠ BOTH COVER THE SAME FRAMES AND READ THE SAME BEATS. Nothing VO-locked
 * changes when this flips — only what is drawn around the tape. This is the
 * only place either of them is chosen.
 */
export const CHART_STYLE: "dashboard" | "ma" = "ma";

/* ═══ SC01 — the setup that looks complete ═══════════════════════════════ */
/** ⚠ `trend` HAS NO AIR BEFORE IT. Cue 1 → 2 runs straight through at f227;
 *  the second chip has to be moving on that frame, not waiting for a gap. */
export const OPEN = {
  /**
   * ═══ THE DASHBOARD ASSEMBLES BEFORE THE TAPE ═══
   *
   * Simon: "gunakan design dari gambar Chart Dashboard karna sekarang chartnya
   * polos banget". The screen builds itself in the order a screen loads —
   * card, ticker strip, rules, header — and only then does the tape start
   * drawing. Reversed, the chrome arrives as decoration on a chart that is
   * already there; this way the viewer is looking at an app.
   *
   * ⚠ `chart.at` MOVED 24 → 96 to make room for it. Nothing VO-locked moved:
   * the first spoken beat is 119 and the first check chip is 227.
   */
  /** ⚠ THE CARD IS PART OF "THE CHART IS ALREADY THERE". Left at f8 it dealt
   *  itself over a tape that was already standing on the paper. */
  shell: { at: -60, over: 20 },
  strip: { at: 26, step: 5 },
  rules: { at: 64, over: 26 },
  header: 78,
  /** The stat tiles land last, as the tape reaches them. */
  tiles: { at: 300, step: 5 },
  /**
   * ⚠ THE TAPE IS SIMPLY THERE — Simon: "dari 0 chartnya uda keliatan … jangan
   * animasi muncul satu per satu". It used to print a bar at a time across the
   * whole sentence. A chart told to arrive before the scene began is a chart
   * that is standing there on frame 0, and `at` in the past is how that is
   * said — the same trick the roadmap uses for a board built long ago.
   *
   * ⚠ WHAT ARRIVES IN TIME IS THE READING, NOT THE PRICE. The three marks land
   * on their own clauses instead: the lows' trend line on "trend naik", the
   * support line on "support bertahan", the histogram on "volume menguat".
   */
  chart: { at: -60, over: 30 },
  /** The three marks, each a few frames after the word that names it. */
  trend: { at: 236, over: 40 },
  support: { at: 301, over: 40 },
  vol: { at: 365, over: 26 },
  /**
   * ⚠ THE ONLY BARS THAT ARRIVE IN TIME. The setup stands complete from f0
   * EXCEPT its breakout: four candles are withheld and print one at a time
   * from here, the last landing on f464 — the word "breakout". Which four is
   * not typed; see SETUP_BREAK_FROM.
   */
  print: { at: 441, over: 24 },
  /**
   * ⚠ ONE MARK AT A TIME — Simon: "tiap bukan gilirannya, buat jadi transparan
   * 30%". A mark hands its turn to the next one and steps back; it does not
   * leave, because the point of the scene is that all four readings were there
   * at once. They all come back up on the breakout, which is the frame the
   * sentence states them as one finished setup.
   *
   * ⚠ THE FOUR CHIPS AND THE RESISTANCE ARE NOT IN THE ROTATION — his call.
   * The chips are the list being read; the level is what the last item is
   * about.
   */
  dim: 0.3,
  /** ⚠ AND IT LASTS TO THE END OF SC02 — Simon: "transparansi 30% nya
   *  perpanjang sampe akhir scene di 1139". A mark that hands over stays
   *  handed over; nothing lights back up inside the opening. The group is dark
   *  through SC03 and comes back at full for SC04, which is a different
   *  argument about the same chart. */
  dimTo: 1139,
  setup: 119,
  /** ⚠ SENTENCE CASE, AND NO ARROW — Simon. Four shouted labels under a chart
   *  read as a banner; these are things the trader ticked off, so they are
   *  written the way he would have written them. The arrow after "Trend" said
   *  the same thing the word already says. */
  checks: [
    { label: "Trend", at: 227 },
    { label: "Support bertahan", at: 295 },
    { label: "Volume menguat", at: 362 },
    { label: "Breakout", at: 464 },
  ],
  /** The resistance line is drawn early and RESTYLES when the tape closes over
   *  it — it is never redrawn. */
  resistance: { at: 150, over: 44 },
  broken: 464,
  /**
   * ⚠ THE BUTTON IS THE STORY, NOT ADVICE. It is pressed and becomes a status
   * chip; no arrow is ever drawn on the price. See scenes/SetupGroup.tsx.
   *
   * ⚠ IT IS A SPEECH BUBBLE NOW — Simon's shape, his frames: up on 536 and it
   * does not leave until 680, which is INSIDE SC02. The trade is still being
   * spoken about while the price has started turning, and the bubble sitting
   * there through the first frames of the reversal is the whole point.
   */
  buy: 536,
  bubbleGone: 680,
  taken: 586,
  close: 604,
} as const;

/* ═══ SC02 — and it reverses ═════════════════════════════════════════════ */
export const REVERSE = {
  turn: 670,
  down: 838,
  /** The four ✓ chips go quiet here rather than disappearing: the evidence did
   *  not vanish, it stopped being enough. */
  dim: 838,
  /**
   * ═══ AND THEN THE WHOLE READING LEAVES ═══  (Simon's f918)
   *
   * ⚠ ONE FRAME TAKES EVERYTHING THE SETUP CLAIMED. The four chips, the support
   * and the resistance — lines and labels both — go together, because they were
   * one argument and it has just stopped being true. Left one at a time they
   * would read as four small corrections instead of one failed thesis.
   *
   * ⚠ THE WINDOW ITSELF DOES NOT LEAVE, IT STEPS BACK: down to half strength,
   * and then the picture inside it pushes in. The chart is still the subject of
   * the sentence — it is just no longer the thing being pointed at.
   *
   * ⚠ IT USED TO SLIDE UP UNTIL HALF OF IT WAS OFF SCREEN, and Simon killed it:
   * "ternyata jelek ya kalo di jadiin terlihat 50%". The half that survived was
   * the bottom one — the histogram and the feet of the candles — which is the
   * half with nothing in it. A push IN keeps the whole white panel and gives
   * the question a room to land in instead of a gap.
   */
  clear: 918,
  fade: { at: 918, over: 20 },
  /** 80% in, anchored on the panel's top edge so it grows downward. */
  zoom: { at: 938, over: 35, by: 0.8 },
  /** Simon's frame for the question, and it lands as the push settles. */
  ask: 973,
  /**
   * ⚠ THE ANSWER JOINS THE QUESTION, it does not replace it. Both stand until
   * the scene ends — the question is what the viewer is still holding while
   * the answer arrives, and swapping one for the other threw it away.
   *
   * ⚠ AND IT IS TYPED. The question is stated; the answer is somebody working
   * it out, which is what a line appearing a letter at a time reads as.
   */
  notYet: 1084,
  perChar: 3,
} as const;

/* ═══ SC03 — probabilitas, bukan kepastian ═══════════════════════════════ */
/** ⚠ NO NUMBER APPEARS IN THIS SCENE. No win rate, no probability, no score —
 *  the split frame is the argument. An "uncapped probability" is exactly the
 *  thing the compliance line forbids. */
export const PREMISE = {
  leave: { at: 0, over: 34 },
  /**
   * ═══ THE CUT NOBODY SEES ═══  (Simon's idea)
   *
   * SC02 ends asking whether Technical Analysis failed; SC03 opens on what
   * Technical Analysis actually gives you. Same two words, so they are not
   * drawn twice: on this frame everything else fades, "gagal?" and the answer
   * go with it, and the two words slide to the middle of the frame and stay
   * there through the cut. See scenes/CarryLine.tsx.
   */
  carry: { at: 1139, over: 30 },
  /** The two readings, each on its own word. */
  probabilitas: 1294,
  kepastian: 1370,
  /**
   * ═══ AND THE CHART COMES BACK ═══  (Simon's 1460)
   *
   * ⚠ IT RETURNS WHERE IT LEFT — half strength and still pushed in, the frame
   * it went out on. A chart that came back at full size would be a new chart
   * arriving, and this one is the same trade the scene has been talking about
   * the whole time. Only after it is back does the picture undo the push.
   */
  resume: { at: 1460, over: 24 },
  normal: { at: 1496, over: 40 },
  /** ⚠ THE TWO SENTENCES UNDER THE READINGS ARE GONE — Simon: "itu hapus aja
   *  dari awal". They were written for two cards that no longer exist, and the
   *  chart coming back over the top of them is what made that obvious. */
  close: 1848,
} as const;

/* ═══ SC04 — masuk tanpa invalidation ════════════════════════════════════ */
export const INVALID = {
  danger: 2123,
  without: 2177,
  /** The support level is drawn on the tape CG-A has been carrying. */
  support: { at: 2392, over: 40 },
  /** ⚠ RESTYLED, NOT REDRAWN — core/chart Level takes `broken`. */
  broken: 2790,
  reasonGone: 2810,
  strike: 2810,
  close: 2976,
} as const;

/* ═══ SC05 — harapan, lalu invalidation sebelum entry ════════════════════ */
export const HOPE = {
  hope: 3245,
  /** ⚠ VERBATIM, CURLY QUOTES INCLUDED — reproduced exactly as Simon corrected
   *  them in the SRT. Not Title-Cased, not straightened. */
  quotes: [
    { text: "“Sedikit lagi.”", at: 3308 },
    { text: "“Mungkin nanti balik.”", at: 3376 },
  ],
  quotesOut: { at: 3480, over: 26 },
  rail: 3523,
  rows: [
    { text: "SEBELUM ENTRY → tentukan invalidation", at: 3585, ok: true },
    { text: "SETELAH POSISI RUGI → cari alasan", at: 3646, ok: false },
  ],
  mark: 3828,
  close: 3900,
} as const;

/* ═══ SC06 — overtrading ═════════════════════════════════════════════════ */
export const OVERTRADE = {
  fromUs: 4103,
  name: 4230,
  /** The stack of little entries piling up. One per step, seeded. */
  pile: { at: 4260, step: 12, count: 9 },
  always: 4349,
  conds: [
    { label: "TREND BELUM JELAS", at: 4534 },
    { label: "LEVEL BELUM MENARIK", at: 4602 },
    { label: "TRIGGER BELUM MUNCUL", at: 4694 },
  ],
  /**
   * ⚠ f4900 HAS NO AIR AT ALL — cue 21 runs straight into cue 22. The closing
   * line has to be moving on this frame, so the pile clears on a short curve
   * that STARTS earlier and the line rides in behind it. Nothing waits here.
   */
  clear: { at: 4864, over: 30 },
  close: 4900,
} as const;

/* ═══ SC07 — revenge trading ═════════════════════════════════════════════ */
export const REVENGE = {
  name: 5091,
  loss: 5156,
  /** The loop back into a new trade — fast, and that speed is the point. */
  loop: { at: 5325, over: 26 },
  next: 5325,
  cut: 5524,
  caption: 5560,
  verdict: 5741,
  gate: 5794,
  close: 5860,
} as const;

/* ═══ SC08 — confirmation bias ═══════════════════════════════════════════ */
export const BIASED = {
  name: 6062,
  chart: { at: 5990, over: 120 },
  /** Six markers on the tape: three that support the scenario, three against.
   *  `i` is a bar index into the BIAS tape. */
  marks: [
    { i: 9, supports: true }, { i: 17, supports: false }, { i: 26, supports: true },
    { i: 34, supports: false }, { i: 43, supports: true }, { i: 52, supports: false },
  ],
  box: { at: 6325, over: 30 },
  fade: { at: 6409, over: 30 },
  q1: 6619,
  q2: 6787,
  /** ⚠ f6917 HAS NO AIR — cue 31 runs straight into 32. The box collapses and
   *  the three ignored markers come back to full on the same frame. */
  collapse: 6917,
  close: 6960,
} as const;

/* ═══ SC09 — konteks market ══════════════════════════════════════════════ */
export const CONTEXT = {
  name: 7044,
  /** Two windows, the SAME setup in both — only the context strip differs. */
  panes: { at: 7100, over: 40 },
  left: 7298,
  right: 7447,
  same: 7554,
  /** The frame that draws the wider market around both. */
  wider: 7732,
  close: 7800,
} as const;

/* ═══ SC10 — indicator overload ══════════════════════════════════════════ */
export const OVERLOAD = {
  name: 8045,
  chart: { at: 7990, over: 90 },
  /**
   * ⚠ THE PANES ARRIVE BETWEEN 8112 AND 8283 — the stretch the voice spends on
   * "menambahkan banyak indikator … tidak selalu menambah kualitas". The
   * crowding IS the argument, so they land on the sentence that describes it.
   */
  add: { at: 8112, step: 34, count: 5 },
  /** Which of the five read the same thing. Indexed, so re-ordering the panes
   *  in layout.ts re-orders the highlight with them. */
  similar: [1, 2, 4],
  lit: 8450,
  merge: { at: 8604, over: 40 },
  close: 8734,
} as const;

/* ═══ SC11 — hindsight bias ══════════════════════════════════════════════ */
export const HINDSIGHT = {
  name: 9049,
  /** The whole tape, already annotated, arrives finished. */
  chart: { at: 8990, over: 90 },
  obvious: 9140,
  /**
   * ⚠ THE MASK RUNS BACKWARDS HERE. Everywhere else in the library a reveal
   * mask opens; this one CLOSES over the right-hand side, hiding the future
   * that was already on screen. It is the same device SC12–SC13 use for real,
   * introduced first so the ADMR case reads as its application.
   */
  hide: { at: 9364, over: 56 },
  note: 9452,
  chips: 9642,
  close: 9844,
} as const;

/* ═══ SC12 + SC13 — the ADMR case (CG-B) ═════════════════════════════════ */
/**
 * ⚠ ONE TAPE, TWO SCENES. SC12 reads the evidence with the future masked;
 * SC13 opens the mask on THE SAME tape. Drawing it twice would delete the
 * whole point — that the evidence did not change, the reading of it did.
 */
export const ADMR = {
  chart: { at: 10030, over: 150 },
  title: 10135,
  uptrend: { at: 10367, over: 44 },
  triangle: { at: 10398, over: 60 },
  volume: 10530,
  macd: 10666,
  focus: 10780,
  rebound: 11018,
  /** The three evidence chips SC13 then turns over one at a time. */
  evidence: [
    { label: "UPTREND JANGKA PANJANG", at: 10367 },
    { label: "VOLUME MASIH AKTIF", at: 10530 },
    { label: "MACD HISTOGRAM HIJAU", at: 10666 },
  ],
  /* ── SC13 ───────────────────────────────────────────────────────────── */
  watch: 11050,
  ma100: { at: 11229, over: 60 },
  events: [
    { tag: "11 MEI 2026", label: "BREAK DI BAWAH MA100", at: 11328, hit: 11428 },
    { tag: "RETEST", label: "GAGAL KEMBALI KE ATAS MA100", at: 11590, hit: 11716 },
    { tag: "18 MEI", label: "SUPPORT TRIANGLE DITEMBUS", at: 11880, hit: 11990 },
  ],
  /** Which evidence chip each event turns over. Indexed by name in the scene,
   *  never by position — swapping two events must swap their frames, not their
   *  drawings. */
  turns: [
    { label: "UPTREND JANGKA PANJANG", at: 11428, strike: true },
    { label: "MACD HISTOGRAM HIJAU", at: 11990, strike: false },
  ],
  close: 12142,
} as const;

/* ═══ SC14 — asal copy trade ═════════════════════════════════════════════ */
/** ⚠ NO PRICES. The four rows differ in WORDS, not numbers: a made-up entry
 *  price beside a real-looking ticker is the fabricated number rule and the
 *  buy-marker rule at the same time. */
export const COPY = {
  name: 12395,
  cards: { at: 12440, over: 40 },
  /** ⚠ f12496 HAS NO AIR — cue 57 runs straight into 58. */
  same: 12496,
  rows: [
    { label: "TIMEFRAME", a: "Harian", b: "Mingguan", at: 12610 },
    { label: "HARGA ENTRY", a: "lebih awal", b: "lebih tinggi", at: 12638 },
    { label: "BATAS RISIKO", a: "lebih ketat", b: "lebih longgar", at: 12695 },
    { label: "RENCANA EXIT", a: "bertahap", b: "sekaligus", at: 12780 },
  ],
  close: 12916,
} as const;

/* ═══ SC15 — the question worth asking ═══════════════════════════════════ */
export const ASK = {
  shrink: { at: 13050, over: 34 },
  wrong: 13147,
  strike: 13230,
  better: [
    { text: "“KENAPA TRADE ITU DIAMBIL?”", at: 13309 },
    { text: "“KAPAN LOGIKANYA DIANGGAP SALAH?”", at: 13404 },
  ],
  close: 13597,
} as const;

/* ═══ SC16 — the process, six questions (CG-C) ═══════════════════════════ */
/**
 * ⚠ THE SIX QUESTIONS ARE NOT EVENLY SPACED, and that is not a defect to be
 * tidied. The gaps are 70 · 88 · 56 · 74 f, then 120 f to "Dan yang paling
 * penting:" and 117 f more to the sixth. They are spoken that way. Spreading
 * them on a grid is exactly how a build comes off its own voice.
 */
export const PROCESS = {
  rail: { at: 13700, over: 40 },
  pull: 13725,
  items: [
    { text: "“Trend-nya bagaimana?”", at: 13940 },
    { text: "“Level pentingnya di mana?”", at: 14010 },
    { text: "“Setup-nya apa?”", at: 14098 },
    { text: "“Volume mendukung?”", at: 14154 },
    { text: "“Timeframe lain sejalan?”", at: 14228 },
  ],
  /** The five go one step quiet while the voice says the sixth is the one. */
  quiet: 14348,
  sixth: { text: "“apa invalidation-nya?”", at: 14465 },
  /** One row empties out to show "satu bagian belum jelas". */
  blank: 14542,
  close: 14600,
} as const;

/* ═══ SC17 — cek dirimu sendiri ══════════════════════════════════════════ */
export const SELF = {
  /** The rail from SC16 shrinks to the left and STAYS. The process did not go
   *  away; what is being checked now is the person running it. (CG-C) */
  shrink: { at: 14768, over: 40 },
  panel: 14800,
  flags: [
    { label: "FOMO", at: 14999 },
    { label: "KESAL", at: 15024 },
    { label: "INGIN MEMBALAS LOSS", at: 15099 },
  ],
  stop: 15148,
  tool: 15275,
  notCertainty: 15347,
  /** ⚠ THE EMOTION CHIPS ARE NOT DELETED — they move out of the process's
   *  path. "Emosi boleh ada" is the line; deleting them would say the
   *  opposite. */
  move: { at: 15584, over: 40 },
  close: 15650,
} as const;

/* ═══ SC18 — the close ═══════════════════════════════════════════════════ */
/** ⚠ THE FOUR RULES ARE UNEVEN TOO: 102 · 130 · 150 f. Same rule as SC16. */
export const CLOSE = {
  ground: { at: 15724, over: 60 },
  simple: 15736,
  rules: [
    { cond: "BELUM LENGKAP", act: "TUNGGU", at: 15852 },
    { cond: "SUDAH INVALID", act: "KELUAR", at: 15954 },
    { cond: "KONDISI BERUBAH", act: "EVALUASI ULANG", at: 16084 },
    { cond: "ALASANNYA EMOSIONAL", act: "JANGAN DIPAKSAKAN", at: 16234 },
  ],
  collapse: { at: 16380, over: 40 },
  /** ⚠ THE SAME CARD THE ROADMAP OPENED ON, not one that looks like it — the
   *  mark over a bordered panel on the drifting grid, so the ending rhymes
   *  with the opening instead of introducing a new look at the last minute. */
  card: 16428,
  text: 16452,
  lines: ["No trade unless the conditions are met."],
  mark: "conditions are met",
} as const;
