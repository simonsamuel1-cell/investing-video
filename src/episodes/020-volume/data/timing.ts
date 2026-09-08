/**
 * data/timing.ts — the frame table, VO-LOCKED.
 *
 * ⚠ EVERY NUMBER IS COPIED FROM docs/Video20_Volume_Script_SYNCED.md AND IS
 * ALREADY IN 60fps FRAMES. That table was computed from the corrected SRT's
 * milliseconds. Nothing here converts, re-derives or doubles anything.
 *
 * BLOCK boundaries, not VO in/out: each scene runs until the next begins, cut
 * at the midpoint of the silence between them, so the timeline is continuous
 * from f0 to f19592 and no frame is unowned.
 */
export const BLOCK = {
  SC01: 0, SC02: 809, SC03: 1516, SC04: 2448, SC05: 3399, SC06: 4260,
  SC07: 4954, SC08: 5951, SC09: 6858, SC10: 7533,
  SC11: 8214, SC12: 8911, SC13: 9601, SC14: 10471,
  /**
   * ⚠ 11289, NOT 11261 — Simon's frame. He wanted the two breakdown columns to
   * run to 11288 and the quiz to open on 11289.
   *
   * ⚠ AND IT MOVES NOTHING VO-LOCKED. Every beat inside CG-D is written
   * `local(BEAT.x, FROM)` against this same number, so a beat's GLOBAL frame is
   * `FROM + (BEAT.x − FROM)` = `BEAT.x` whatever FROM is. Only the group's own
   * frame-zero work — the chart building — moves with it, and that is delayed
   * further on purpose so it does not draw under the quiz title.
   */
  SC15A: 11289, SC15B: 13026,
  /**
   * ⚠ SC17 MOVED FROM 15415 TO 16078 — Simon's cut. The chart now runs on
   * through what used to be SC17's opening, and the two product windows take
   * only the last 575 frames of it.
   */
  SC16: 14518, SC17: 16078, SC18: 16681, SC19: 17848, SC20: 18792,
  END: 19680,
} as const;

/**
 * The seven transition cards, as OVERLAY windows.
 *
 * ⚠ THEY STRADDLE THE CUT — there is no gap to sit in. The recording leaves
 * 0.27–0.63s of silence between scenes and NONE AT ALL at SC10 → SC11. Each
 * card starts 36f before the outgoing scene's last word and clears 36f after
 * the incoming scene's first; by then the outgoing scene has made its point.
 *
 * ⚠ THE FOUR-COMBINATION RECAP IS NOT HERE. Zero silence at SC10 → SC11 means
 * it cannot exist as a card at all. It is built a row at a time across
 * SC07–SC10 by ComboTable, and is already complete when CHAPTER 03 lands over
 * it.
 */
/* ⚠ THE PRACTICE CARD IS GONE — Simon's call, and it is the same reason 02's
   and 03's went: the beat that hands the chapter over already exists. `QUIZ`
   below announces the section by name, from the middle of the frame, and a
   full-screen card saying "Now you try / BRPT" 80 frames earlier said it twice
   — and covered the two columns Simon wanted to run to 11288. */
export const CARDS = {
  roadmap: { at: 1410, over: 100 },
  ch02: { at: 4906, over: 96 },
  ch03: { at: 8178, over: 96 },
  recap: { at: 18748, over: 88 },
} as const;

/**
 * ⚠ THE TWO HARD CUTS, both mid-word, both without a transition of any kind.
 * The narration runs straight through them: f6798 falls between "posisi." and
 * "Ketiga,", f8154 between "sudah datang." and "Nah,". A wipe on a word is a
 * wipe the viewer reads as a mistake.
 */
export const HARD_CUT = [6858, 8214] as const;

/**
 * ═══ THE FOUR COMBINATIONS, AS TABS ═══  (Simon's frames)
 *
 * The row appears at f5259 with none of them current, and then each takes its
 * turn as the voice reaches it. Replaces the chapter card that used to say
 * "Empat kombinasi dasar" — the row says the same thing and keeps saying it,
 * which a card that comes and goes cannot.
 *
 * ⚠ ARROWS, NOT THE WORDS. Simon's call, and it is what lets four labels sit on
 * one line at 20px: "harga naik, volume naik" four times over is a paragraph.
 */
export const COMBO_TABS = {
  /** ⚠ 5250, and they arrive one at a time — Simon's frame. */
  at: 5250,
  stepIn: 10,
  y: 110,
  /** ⚠ 30, WAS 20 — it was unreadable at a glance. Selected is 34. */
  size: 30,
  lift: 4,
  /** ⚠ MEASURED AGAINST THE LOGO, not chosen. See the check below the row. */
  gap: 34,
  labels: [
    "harga ↑, volume ↑",
    "harga ↑, volume ↓",
    "harga ↓, volume ↑",
    "harga ↓, volume ↓",
  ],
  /** The frame each becomes the current one. */
  select: [5434, 5949, 6865, 7532],
} as const;

/**
 * ═══ THE FOUR COMBINATIONS ═══  (Simon's layout)
 *
 * A window on one side holding the tape and its histogram, the reading typed
 * out on the other — and the two SWAP SIDES for the falling pair, so the
 * chapter turns over halfway rather than repeating one arrangement four times.
 *
 * ⚠ THE WINDOW IS THE ROADMAP CARD, STILL. It grows out of "cara baca volume"
 * at f5149 and is the same object for the rest of the chapter; it never
 * reappears or restarts.
 *
 * ⚠ THE WORDS ARE MINE, TAKEN FROM THE NARRATION, not supplied. Simon gave the
 * shape — title, conditions, conclusion, with the caution in red — and the
 * sentences are lifted from what the voice actually says over each one. They
 * are the first thing to correct.
 */
export const COMBOS = {
  open: { at: 5149, over: 60 },
  win: { x: 96, y: 300, w: 780, h: 540 },
  /**
   * ⚠ THE TITLE IS THE SMALL ONE. 36 at weight 400 over 46 at weight 800 —
   * the sentence leads and the title labels it, which is the opposite of the
   * usual arrangement and is Simon's call. It works because the two are not
   * competing: the title names the combination, the sentence says what it
   * means, and only one of them is the point.
   *
   * ⚠ `body` IS DELIBERATELY NOT NANGGUNG. 46 is big enough that the sentence
   * wraps on its own; the rows below hold ONE string each and let it break
   * where it lands, so nothing has to be re-broken by hand when a word changes.
   *
   * ⚠ THE TITLE IS SET IN `theme.text.mono`. The face is what separates it from
   * the sentence now — there is no rule above it any more, and at 36 against 46
   * the size step alone was not enough to say "this one is a label".
   *
   * ⚠ `lead` IS 76, NOT 46 × 1.3. The marked line carries a selection band that
   * overhangs its box by 10px top and bottom plus a grab dot; on ordinary
   * leading the band crowds the line above it.
   *
   * ⚠ `gap` IS MEASURED FROM THE TITLE'S BOTTOM TO THE SENTENCE'S FIRST LINE,
   * which is why the sentence is anchored by its TOP and not its middle. A
   * centre-anchored block moves its own top edge the moment a row wraps onto a
   * third line, and the 100 would quietly become something else.
   */
  text: { x: 936, w: 888, title: 36, body: 46, lead: 76, gap: 65 },
  /**
   * ⚠ THE THREE BEATS ARE SIMON'S, GIVEN FOR THE FIRST COMBINATION: f5438,
   * f5621, f5781 — 4, 187 and 347 frames after its tab lights at f5434. The
   * other three carry the same offsets from their own tab, because the voice
   * paces them alike; if any of them drifts, it is this line to correct.
   *
   * The third beat no longer brings a new sentence — the sentence is already
   * there. It brings the MARK: the second line is highlighted and thickens, so
   * the point lands on words the viewer has already read.
   */
  beats: [4, 187, 347],
  rows: [
    /**
     * ⚠ ONE STRING, NOT TWO LINES. It wraps by itself at `text.w`; a sentence
     * broken by hand has to be re-broken every time a word changes, and the
     * hand-break is always the first thing to go stale.
     *
     * ⚠ A `mark` NEVER WRAPS — see core/Text.tsx. Keep each one short enough to
     * sit on a single line at `body`, or its selection band ends up with two
     * right-hand edges.
     */
    {
      title: "Harga naik, Volume naik",
      text: "Kenaikan lebih meyakinkan, karna aktivitas transaksi meningkat",
      mark: "aktivitas transaksi meningkat",
    },
    {
      title: "Harga naik, Volume turun",
      text: "Bukan otomatis sinyal jual, tapi aktivitas pendukungnya berkurang",
      mark: "aktivitas pendukungnya berkurang",
    },
    {
      title: "Harga turun, Volume naik",
      text: "Tekanan jual lebih serius, karna aktivitas transaksi makin tinggi",
      mark: "aktivitas transaksi makin tinggi",
    },
    {
      title: "Harga turun, Volume turun",
      text: "Tekanan jual mulai mereda, tapi buyer belum tentu datang",
      mark: "buyer belum tentu datang",
    },
  ],
} as const;

/**
 * ═══ THE COMBOS CHAPTER HAS TWO BUILDS ═══
 *
 * ⚠ THIS IS THE LEVER. 1 is the tab row with the reading typed beside the
 * window; 2 is the rolling list with the reading in a dashed box under it;
 * 3 is the board — a rail of four buttons on the left with one travelling
 * highlight, and the picture and its reading on the right.
 * Nothing else selects between them — flip this one number and re-run.
 *
 * Both are wired to the same stage frames (`COMBO_TABS.select`) and the same
 * four series, so switching cannot desynchronise the chapter from the voice.
 */
export const COMBOS_VERSION: 1 | 2 | 3 = 3;

/**
 * ═══ VERSION 2 ═══ f5149–8214.
 *
 * ⚠ THE LIST IS ON THE LEFT AND THE PICTURE IS ON THE RIGHT, and neither ever
 * moves. Version 1 traded sides once and Simon rejected it for the same reason
 * the roll only ever shows three: the viewer should be comparing this chart
 * with the one before it, not re-finding it.
 */
export const COMBOS_V2 = {
  /** ⚠ `y` IS THE CURRENT ITEM'S CENTRE, not the top of the list. The list is
   *  placed by whichever item is current, which is what keeps the reading spot
   *  still while everything else rolls past it. */
  list: { x: 96, y: 558, lead: 96, size: 30, grow: 6, dim: 0.5, roll: 22 },
  /**
   * ⚠ VERSION 2 HAS ITS OWN LABELS — words, not arrows, and split in two so the
   * halves can be coloured apart. `COMBO_TABS.labels` still belongs to version
   * 1's tab row; the two must not be made to share, or a change meant for one
   * silently rewrites the other.
   *
   * ⚠ THE RED IS `warn`, NOT `candleRed`. candleGreen/candleRed are for candle
   * bodies and wicks only — see the contract at the top of core/theme.ts. `warn`
   * is the palette's one red for WORDS, which is exactly what this is.
   */
  items: [
    ["Harga naik ↑ ", "Volume naik ↑"],
    ["Harga naik ↑ ", "Volume turun ↓"],
    ["Harga turun ↓ ", "Volume naik ↑"],
    ["Harga turun ↓ ", "Volume turun ↓"],
  ],
  win: { x: 640, y: 190, w: 1184, h: 500 },
  box: { x: 640, y: 726, w: 1184, h: 200 },
  /** ⚠ THE LINE BREAKS ARE SIMON'S, one entry per line — his wording arrived
   *  already broken, so the break is content here and not a layout decision. */
  rows: [
    ["Kenaikan lebih meyakinkan,", "karna aktivitas meningkat"],
    ["Harga masih bisa naik, tapi harus hati-hati.", "Aktivitas mulai berkurang"],
    ["Harga turun saat aktivitas tinggi,", "tanda tekanan jual yang serius."],
    ["Harga belum tentu berbalik,", "tapi tekanan jual mulai mereda."],
  ],
  quote: { size: 40, lead: 58, weight: 500 },
  /**
   * ⚠ ONE MARKED PHRASE PER READING, IN THE ROW'S OWN WORDS. A mark is matched
   * by word sequence against the text it sits in, so a phrase retyped from
   * memory — "hati hati" for "hati-hati.", "Tanda" for "tanda" — matches
   * nothing and fails silently, with the sentence simply arriving unmarked.
   */
  marks: [
    "Kenaikan lebih meyakinkan",
    "Harga masih bisa naik, tapi harus hati-hati.",
    "tanda tekanan jual yang serius.",
    "tekanan jual mulai mereda.",
  ],
} as const;

/**
 * ═══ VERSION 3 ═══ the board.
 *
 * ⚠ EVERY CHOICE IS ON SCREEN AT ONCE HERE, which is the opposite of version
 * 2's roll and the whole point of the difference: version 2 hides how many
 * there are, version 3 shows the shape of the list and moves through it. Both
 * read the same four labels and the same four readings from COMBOS_V2 — the
 * words are the chapter's, not a version's.
 */
export const COMBOS_V3 = {
  /** The panel everything sits on. */
  board: { x: 96, y: 176, w: 1728, h: 768, pad: 40 },
  /** ⚠ THE PILL IS ONE OBJECT THAT TRAVELS — see core/PickRail.tsx. `move` is
   *  how long it takes to cross one row, not how long a fade lasts. */
  /**
   * ⚠ `y` IS THE CHART WINDOW'S OWN TOP — the rail is aligned to the picture,
   * not centred in the board. `w` is measured off the longest LINE ("Volume
   * turun" at 30px, about 186px) plus the dot and both insets; a pill narrower
   * than its label is the one thing that makes a button rail look broken.
   */
  rail: {
    x: 128, y: 136, w: 300, h: 104, gap: 16, radius: 22,
    size: 30, lead: 40, move: 22, stepIn: 8, pad: 20, dotSize: 16, dotGap: 16,
  },
  /**
   * ⚠ FOUR COLOURS, ALL OF THEM BETWEEN INDIGO AND CYAN. The brand contract
   * locks decorative hues to the two anchors (247 and 192) — four unrelated
   * hues would read as a different product. Walking the ramp between them gives
   * four that are plainly distinguishable without leaving the family.
   */
  dots: ["#5F4DEE", "#4F7BF0", "#45A6DC", "#5CC8E3"],
  /**
   * ⚠ THE CHART'S SIZE IS FIXED. It is the floor under everything else here:
   * shortening the board by moving this number shrinks the tape, which is the
   * one thing that must not get smaller.
   */
  /** ⚠ THE TAPE REACHES THE BOTTOM OF THE BOARD. The board's own `tail` used
   *  to be empty white below the histogram; the window now runs down into it,
   *  so the board is unchanged and the chart is 62px taller. */
  /**
   * ⚠ IT GREW UPWARD, NOT BOTH WAYS — Simon's call, "anchor down". The bottom
   * edge is where the reading box hangs off, so raising the top by 90 and
   * adding the same 90 to the height leaves everything below it untouched.
   *
   * ⚠ THE BOARD NOW ENTERS THE LOGO'S 360x150 ZONE by about 30px, and that is
   * allowed here at Simon's direction. It is the one place in the episode where
   * that clearance is deliberately given up.
   */
  win: { x: 460, y: 136, w: 1324, h: 604 },
  /**
   * ⚠ THE READING SITS BELOW THE BOARD, CENTRED ON THE CANVAS — not on the
   * board, which is off-centre because the rail is only on one side. `x` is
   * (1920 - w) / 2 and must stay that way; the stamped shadow is an ornament
   * hanging off the right and is deliberately NOT counted in the centring.
   */
  box: { x: 270, y: 785, w: 1380, h: 110 },
  /**
   * ⚠ 38 AT WEIGHT 700, AND THE BOX IS SIZED TO IT — measured off a render,
   * not chosen. Set on ONE line, the longest of the four ("Harga masih bisa
   * naik, tapi harus hati-hati. Aktivitas mulai berkurang") runs 1285px bold,
   * against 1251 at weight 500. The box at 1380 leaves 47px either side.
   *
   * ⚠ RE-MEASURE IF THE WORDS OR THE WEIGHT CHANGE. Nothing in the build can
   * catch this — there is no `maxWidth` to wrap against, so an overlong line
   * simply runs past its own frame.
   */
  quote: { size: 38, weight: 700 },
  /** ⚠ THE BOARD IS DERIVED, NOT TYPED — it is the union of the three above,
   *  grown by `pad`. Nudge any of them and the board follows; a hardcoded rect
   *  would quietly stop hugging its contents. */
  pad: 15,
  /** A stamped shadow, not a floating one. */
  shadow: { x: 12, y: 12 },
  /** ⚠ EXTRA BOARD BELOW ITS CONTENTS, ADDED DOWNWARD ONLY, at Simon's
   *  measurement. The board is otherwise the exact union of the rail and the
   *  chart; this is the one place it is allowed to be taller than what stands
   *  on it. */
  tail: 50,
} as const;

/**
 * BEAT ANCHORS — the frame a phrase is spoken on, GLOBAL, from the sync
 * document. A scene converts with `local()`. These are the only timing a scene
 * may key off; a beat invented to make a picture feel right is a beat that
 * will drift away from the voice.
 */
export const BEAT = {
  resistance: 210, breakout: 372, valid: 556, buy: 748,
  notYet: 822, volumeWord: 1114, twoBreakouts: 1206, different: 1330,
  whatIsVolume: 1560, onePeriod: 1896, daily: 1968, fiveMin: 2238,
  notPeople: 2544, bigPlayers: 2754, handToHand: 2898, notHowMany: 3276,
  alone: 3510, tenMillion: 3608, normalElsewhere: 3784, average: 4170,
  priceWhere: 4374, volumeHow: 4518, together: 4752,
  fourCombos: 5262, first: 5454, convincing: 5724,
  second: 5962, notASellSignal: 6308, weakening: 6510, careful: 6672,
  third: 6858, volumeGrows: 6990, sellingSerious: 7278,
  fourth: 7542, easing: 7794, notBuyers: 8118,
  confirm: 8508, backToBreakout: 8592, heldItDown: 8844,
  absorb: 9102, muchHigher: 9306, convincing2: 9438,
  ordinaryVolume: 9792, notFailed: 9912, weaker: 10032, retest: 10290,
  breakdownToo: 10482, bigVolume: 10704, thinVolume: 10974, notCertain: 11196,
  brpt: 11560, monthLow: 11716, lastTwoDays: 11864, atBreakdown: 12006,
  lessThanSpikes: 12130, rebound: 12352, question: 12588,
  three: 12830, two: 12932, one: 12972,
  upTo: 13176, twoCandles: 13350, reboundBigger: 13758,
  losingConfirmation: 13950, noGuarantee: 14196,
  trendHealth: 14780, healthyUptrend: 14892, strongerVolume: 15044,
  pullback: 15162, lighterVolume: 15306,
  context: 15606, spike: 15726, thanUsual: 16050, nearBreakout: 16104,
  afterRally: 16304, sharpDrop: 16476,
  misread: 16858, barColour: 17026, followsCandle: 17206,
  onlyBuying: 17350, buyerAndSeller: 17782,
  limits: 17864, alreadyHappened: 18088, notCertainty: 18152,
  trend: 18442, levels: 18484, pattern: 18564, market: 18634,
  direction: 18868, behindIt: 19056, notAGuess: 19156,
  convincing3: 19438, watchOut: 19572,
} as const;

/** ⚠ THE COUNTDOWN IS UNEVEN AND THAT IS CORRECT — 102 frames then 40. Each
 *  numeral lands on the word as it is spoken. Never space these on a grid. */
export const COUNTDOWN = [BEAT.three, BEAT.two, BEAT.one];

/**
 * ═══ CAMERA CUTS ═══
 *
 * ⚠ GLOBAL FRAMES. Both halves of a cut read the same entry — see
 * core/CameraCut.ts. A scene inside a Sequence must add its own `from` back
 * before evaluating one.
 *
 * `intoSC01` has no outgoing half on purpose: it is an ENTRANCE, landing on
 * frame 0, so the move is the arrival rather than a hand-over from something
 * before it. The blur still peaks on the cut, which is what stops it reading
 * as a slide up from nowhere.
 */
export const CUTS = {
  /**
   * ⚠ THE QUIZ → SC16, ON f14518 — Simon's frame, "14517-14518 beri transisi
   * camera cut". Horizontal, like `toQuiz` and for the same reason: the picture
   * either side ends close to the subtitle band, and a vertical throw would put
   * content inside it for the twelve frames the move lasts.
   */
  toSC16: { at: 14518, over: 24, distance: 90, blur: 10, axis: "x" as const },
  /** The chart out, the two product windows in — Simon's frame, "16078
   *  transisi camera cut ke scene selanjutnya". */
  toSpikes: { at: 16078, over: 24, distance: 90, blur: 10, axis: "x" as const },
  /** SC18 out, SC19 in — Simon's frames, "17847-17848 transisi camera cut". */
  toLimits: { at: 17848, over: 24, distance: 90, blur: 10, axis: "x" as const },
  /**
   * ⚠ SC11 → THE QUIZ, ON f11289 — Simon's frame, "beri transisi 11288-11289".
   *
   * ⚠ IT IS NOW TWO-SIDED, AND THAT IS THE FIX, NOT A TIDY-UP. The quiz used to
   * arrive by fading up: "Quiz Time" big and centred, then the picture behind
   * it. But the picture and the shape covering it faded on the SAME opacity, so
   * at every frame of the fade the cover was half-transparent and the answer
   * showed straight through it — Simon: "aku maunya tertutup sempurna bahkan
   * ketika transisi sekalipun". A camera cut has no opacity in it at all. The
   * layout TRAVELS in, whole and fully opaque, and the cover can never be seen
   * through because it is never transparent.
   *
   * ⚠ HORIZONTAL, NOT VERTICAL. A vertical throw of 90 would start the picture
   * 90px below its rest position, and its rest position already ends 8px above
   * the subtitle band — the incoming frames would put it inside a band nothing
   * may enter. Sideways there is no such neighbour.
   */
  toQuiz: { at: 11289, over: 24, distance: 90, blur: 10, axis: "x" as const },
  intoSC01: { at: 0, over: 30, distance: 90, blur: 12, axis: "y" as const },
  /** SC01 → the "Satu hal yang perlu dicek" mascot card. A real cut: SC01 is
   *  carried out and the card carried in on one move at f892. */
  toMascot: { at: 892, over: 30, distance: 90, blur: 10, axis: "y" as const },
  /**
   * ⚠ THE LINE UNDER THE MASCOT SWAPS, AND NOTHING ELSE MOVES. A cut with
   * `blur: 0` at Simon's direction: the mascot and the card are holding still
   * around it, and a blur on a two-word line with a static frame behind it
   * reads as a focus error rather than as speed.
   */
  textToVolume: { at: 1106, over: 24, distance: 60, blur: 0, axis: "y" as const },
  /**
   * The note carried out and the phase clips carried in, on one move — Simon's
   * frames, "di antara 2460-2461", so the swap lands on f2461.
   *
   * ⚠ THE GROUND CHANGES ACROSS THIS CUT, from the episode's #F5F5F5 to white,
   * because the clips are white to their own edges and anything darker behind
   * them draws a box around footage that has no box.
   *
   * ⚠ blur: 0, AT SIMON'S DIRECTION — the same exception as `textToVolume`. A
   * blur filter softens the moving layer's EDGES too, and on a white ground
   * around white footage that soft edge reads as a drop shadow the clip does
   * not have. The move alone carries it here.
   */
  intoFase: { at: 2461, over: 30, distance: 90, blur: 0, axis: "y" as const },
  /**
   * SC04's drawings carried out and the closing card carried in — Simon's
   * frames, "3066-3067", so the swap lands on f3067.
   *
   * ⚠ blur: 0, like the cut before it. Everything either side of this one is
   * white to its own edges, and a blur filter softens the moving layer's EDGE
   * as well as its contents — on white that soft edge reads as a drop shadow
   * nothing in the frame actually has.
   */
  intoQuote: { at: 3067, over: 30, distance: 90, blur: 0, axis: "y" as const },
  /**
   * The closing card carried out and the two stocks carried in — Simon's frame.
   *
   * ⚠ SIDEWAYS, NOT VERTICAL: `axis: "x"`, and with a positive distance the
   * outgoing half travels LEFT while the incoming one arrives from the right,
   * which is the move he asked for. Vertical was right for the cards before
   * this because each replaced the one above it; here the frame moves ALONG a
   * comparison, and the eye should be carried across rather than down.
   *
   * ⚠ blur: 0, like both cuts before it — same reason: white content to its own
   * edges, and a blur filter softens the moving layer's edge into a shadow.
   */
  intoPair: { at: 3411, over: 30, distance: 90, blur: 0, axis: "x" as const },
  /**
   * The two stocks carried out and SC06's split reading carried in — Simon's
   * frames, "4252-4253", so the swap lands on f4253.
   *
   * ⚠ IT ALSO CLOSES A TWO-FRAME HOLE. The pair ended at f4253 and SC06 began
   * at f4255, so f4253-4254 fell through to SC05's own scene and flashed a
   * frame of "Volume itu relatif" with its labels colliding. The cut and the
   * scene now start on the same frame, and there is nothing left to fall
   * through to.
   */
  intoSplit: { at: 4253, over: 30, distance: 90, blur: 0, axis: "y" as const },
};

/** A global beat, in a scene mounted at `from`. */
export const local = (beat: number, from: number) => beat - from;

/**
 * ═══ SC01's OPENING MOVE — dot → line → screen ═══
 *
 * The chart does not fade in; it is drawn. A point lands on the card's centre,
 * opens sideways into a rule, then gains height into a screen — and only then
 * does the traced tape start building inside it. The order is the point: a box
 * that grows in both directions at once is just a scaling rectangle, and the
 * horizontal rule in the middle is what makes it read as a screen being made.
 *
 * ⚠ THESE ARE FRAMES, and they live here rather than in the scene because a
 * bare frame count inside a component is the thing audit.mjs forbids — this
 * file is the frame table, where exact beats belong.
 */
export const OPEN = {
  dot: 109, dotOver: 16,
  wide: 128, wideOver: 20,
  tall: 152, tallOver: 30,
  chart: 182,
  size: 18,
} as const;

/**
 * ⚠ THE FIGURE SHRINKS TO 30%, ANCHORED AT ITS FEET. The bottom edge does not
 * move; only the top comes down, so it collapses toward its own foot rather
 * than sliding. `transformOrigin: center bottom` in the scene is the whole of
 * it — no translate.
 */
export const SHRINK = { at: OPEN.dot, over: 40, to: 0.3 } as const;

/**
 * ═══ SC01 — THE ZOOM, THE PAN, THE BREAKOUT ═══  (Simon's steps 1–5)
 *
 * ⚠ THE RESISTANCE BOX AND THE ZOOM HAPPEN TOGETHER (his point 4). One `at`
 * drives both. The zoom is a super push into the RIGHT END, and it pans so the
 * last existing candle lands at frame-centre + `panX`. Only AFTER it settles
 * does the breakout candle arrive.
 *
 * ⚠ FRAMES, in the frame table on purpose. `scale`/`panX` are not durations, so
 * they carry here too rather than being split across two files.
 */
/**
 * ⚠ THE RESISTANCE BOX ARRIVES EARLY, ON ITS OWN — Simon's revision. It creeps
 * left→right across the full-width chart from f182 to f280, WHILE the candles
 * are still drawing, well before the zoom. `Zone` grows its width on `over`, so
 * this range IS the crawl.
 */
export const RES = { at: 182, over: 98 } as const;
export const ZOOM = { at: 345, over: 48, scale: 3, panX: 100 } as const;
export const BREAK1 = { at: 405, over: 60 } as const;
/** The big green "Beli?" question, after the breakout. Simon's frame. */
export const ASK1 = 686;
/** "Belum tentu" — the answer stamping over the question. Simon's frame. */
export const ANS1 = 825;
/** The bulb above the mascot: in on the cut, gone at 1089. */
export const BULB = { at: 892, gone: 1089, over: 20 } as const;
/** The line under the mascot arrives late — the mascot lands alone first. */
export const LINE1 = 968;
/**
 * ⚠ THE CARD MAKES ROOM. The mascot halves and the pair rises, closing the gap
 * between the mark and the word under it, so the middle of the frame is free
 * for the two windows that follow.
 */
export const TIDY = { at: 1152, over: 50, to: 0.5 } as const;
/**
 * ⚠ THE GRID GROUND runs from the cut to the moment the card tidies up, and
 * goes as the windows arrive — it is the transition's own texture, and it would
 * fight two charts for attention.
 */
export const GROUND = { at: 892, gone: 1151, over: 20 } as const;
/** The two side-by-side windows: in at 1203, holding to the end of the card. */
export const WINDOWS = { at: 1203, over: 34 } as const;

/**
 * ═══ THE FOUR-CARD ROADMAP ═══  (Simon's frames)
 *
 * SC01 does not cut away — it SHRINKS INTO the top card, the way Moving
 * Average's chapter board was built. `MAP.at` starts the shrink; the three
 * remaining cards land one after another, still empty, and the board holds
 * until `MAP_HOLD`.
 *
 * ⚠ EVERY NUMBER HERE IS ALREADY IN FINAL FRAME SPACE. The roadmap was built
 * AFTER the 60-frame pad at f1460, so it must never be shifted by that pad
 * again. It sits entirely before f1516, so the later 30-frame cut does not
 * touch it either — only `MAP_HOLD`, which sat past the cut, came back by 30.
 */
export const MAP = { at: 1400, over: 100, cards: [1450, 1472, 1494], cardDur: 22 } as const;
/**
 * The board holds here, then the next scene takes over.
 *
 * ⚠ 1691, NOT 1667 — this is the end of the board's own DISSOLVE, not the start
 * of the next scene. SC03 is mounted underneath from f1516 and is not delayed by
 * a frame; all that reaches past f1652 is the roadmap fading off the top of it,
 * which is what makes the hand-over a cross-fade instead of a cut.
 */
export const MAP_HOLD = 1691;
export const MAP_LABELS: [string, string, string, string] = [
  /* ⚠ LOWER CASE VERBATIM, Simon's call. The case lives in the string, not in
     a textTransform, so what the file says is what the frame shows. */
  "intro to volume",
  "mengenal volume",
  "cara baca volume",
  "cara pakai volume",
];

/**
 * ⚠ THE SECOND CARD LIGHTS UP — Simon's frame. While the roadmap holds, the
 * "Mengenal Volume" card takes an indigo halo and a volume histogram appears
 * inside it, so the board stops being a static contents page and starts
 * pointing at what comes next.
 *
 * `bars` trails `at` on purpose: the halo arrives first and the histogram
 * builds into the lit card, rather than both landing on the same frame.
 */
export const CARD2 = { at: 1537, over: 26 } as const;

/**
 * ═══ THE BOARD HANDS OVER ═══  (Simon's frames)
 *
 * The camera closes on "mengenal volume" — the card the next chapter belongs
 * to — and the whole board dissolves into the scene behind it.
 *
 * ⚠ THE PUSH RUNS ITS FULL LENGTH AND THE FADE STARTS WHERE IT ENDS — Simon's
 * frames: 1617→1667, then the dissolve. `amount` is unchanged, so the same
 * distance is covered over 50 frames instead of 30; the move is slower and has
 * settled by the time the board goes.
 */
/**
 * ⚠ `amount` IS CAPPED BY THE SUBTITLE BAND, not chosen for feel. The card's
 * caption sits 185px below the card's centre, and the push scales about that
 * centre: at 1.6 the caption landed at y956+ and ran into the 108px reserve the
 * burned-in subtitles own. 1.25 puts its lowest pixel at y≈956, clear of it,
 * and still carries the card to 1206px wide — more than twice its size.
 */
export const PUSH = { at: 1617, over: 50, card: 1, amount: 1.25 } as const;
export const FADE = { at: 1667, over: 24 } as const;

/**
 * ═══ THE RUNNING TRADE CAPTURE ═══  (Simon's frames)
 *
 * The screen recording. It starts the frame the roadmap has finished dissolving and runs to the frame
 * before the two BBCA screenshots arrive, so nothing overlaps and nothing is
 * spent playing behind the board.
 *
 * ⚠ 280 FRAMES OF A 300-FRAME CLIP. The recording is 5.00s at 60fps and this
 * window is 4.67s, so the last 20 frames are never reached — it is cut short
 * rather than sped up or looped, because a running trade tape that jumps reads
 * as a broken feed.
 */
export const RUNNING = { at: 1691, gone: 1971 } as const;

/**
 * The line beside the capture — the SAME words the voice is speaking, joined
 * back into the one sentence the SRT had to break into three cues.
 *
 * ⚠ IT IS NOT A NEW LINE, IT IS THE SUBTITLE MOVED. So the band below is muted
 * for exactly the cues it absorbs — 1648, 1722 and 1896 — or the frame would
 * say the same thing twice. The cue at 1968 is NOT muted: it opens the next
 * sentence, which belongs to the two screenshots after this.
 *
 * ⚠ MATCHED ON CUE START, NOT ON OVERLAP. The first of the three begins at
 * f1648, before the capture is even on screen; muting by overlap would leave it
 * on the band for 43 frames and then cut it off mid-phrase.
 */
export const RUNNING_LINE = {
  /** The word being defined, alone and large. */
  word: "Volume",
  /**
   * The definition, in the dashed box under it.
   *
   * ⚠ TWO LINES BECAUSE SIMON WROTE TWO, and the break is his. Left to wrap on
   * its own the box would break wherever the measure happened to run out, and
   * "berapa lembar" and "satu periode" — the two halves he marks — would not
   * land one per line.
   *
   * ⚠ HIS WORDING, VERBATIM. It is not quite the narration: the voice says
   * "berapa banyak lembar saham", the card says "berapa lembar saham". The card
   * is his, and it is not retyped from the SRT.
   */
  lines: ["berapa lembar saham yang", "diperdagangkan dalam satu periode"],
  /**
   * ⚠ ONE FRAME PER WORD, TAKEN FROM THE SUBTITLE CUES — Simon's instruction:
   * the words arrive as they are SPOKEN, not on a metronome. Each cue's span is
   * divided by the number of words the voice says inside it, and every word on
   * the card is placed at the frame its own word is reached:
   *
   *   f1648-1714  "Volume menunjukkan"                              2 words
   *   f1722-1882  "berapa banyak lembar saham yang diperdagangkan"  6 words
   *   f1896-1950  "dalam satu periode."                             3 words
   *
   * ⚠ MATCHED BY SPOKEN POSITION, NOT BY POSITION ON THE CARD. The card drops
   * "banyak" — Simon's wording — so "lembar" is the card's second word but the
   * voice's THIRD, and it lands on the third slot. Counting along the card
   * instead would run the whole line ahead of the narration.
   */
  at: [
    [1722, 1775, 1802, 1829],
    [1855, 1896, 1914, 1932],
  ],
  /** The two phrases under a highlighter — cyan on the first, amber on the
   *  second. What is counted, and over what stretch of time. */
  markCyan: "berapa lembar",
  markAmber: "satu periode",
  mute: [{ from: 1648, to: 1897 }],
  /** Frames between one word landing and the next. */
  stagger: 9,
} as const;

/**
 * ⚠ THE TWO TIMEFRAME WINDOWS — Simon's frames, and `gone` sits 7 frames PAST
 * SC04's start (f2448) because that is the range he gave. SC04 draws nothing
 * until its own first beat, so the overlap is empty air rather than two scenes
 * fighting over the frame.
 */
export const TFW = { at: 1971, gone: 2455, over: 34, right: 2236 } as const;

/**
 * ═══ WHICH SCREENSHOT IS BEING TALKED ABOUT ═══  (Simon's frames)
 *
 * The narration takes the left one to f2236 and the right one after it, so the
 * frame says which is being read: the one under discussion lifts and lights,
 * the other steps back BY FADING — Simon's correction. It keeps its size and
 * loses 30% of its opacity.
 *
 * ⚠ ONLY THE SELECTED ONE IS SCALED, and always FROM THE ORIGINAL. Nothing is
 * applied on top of anything else, so a picture cannot drift after several
 * hand-overs.
 *
 * ⚠ THE ARROWS BELONG TO THE SELECTION, not to the screenshot. They arrive one
 * after another when their side takes its turn and leave with it — that is what
 * makes them read as someone pointing rather than as marks that were always on
 * the picture.
 */
/**
 * ═══ ⚠ TEMPORARY — SC04's OWN SCENE IS SET ASIDE ═══  (Simon's frames)
 *
 * f2455-3408 is given over to the phase clips. The stretches either side of
 * them draw nothing: the production notes that stood here are gone at his
 * instruction, so what is left is an empty frame rather than a caption about an
 * empty frame.
 *
 * Nothing has been deleted — SC04's code is untouched below this and comes back
 * by removing one early return.
 *
 * ⚠ THE VOICE AND THE FRAME TABLE ARE UNTOUCHED. SC04 still owns its frames, so
 * the narration keeps running over an empty stage rather than the block
 * collapsing and everything after it sliding.
 */
export const NOTE = { at: 2455, gone: 4253 } as const;

/**
 * ═══ THE MASCOT LINE ═══  (Simon's frames)
 *
 * The mascot over the sentence the voice is landing: "volume menunjukkan
 * seberapa banyak saham yang diperdagangkan, bukan berapa banyak orang yang
 * ikut transaksi". His two lines are the short form of it.
 *
 * ⚠ HIS WORDING AND HIS LINE BREAK, VERBATIM — not retyped from the SRT.
 */
export const MASCOT = {
  at: 3067,
  /**
   * ⚠ THE GROUND ARRIVES LONG BEFORE THE MASCOT — Simon's call: f2461, the frame
   * SC04 itself opens on, not f3067. The grid is the room this whole stretch
   * happens in, not a backdrop the closing card brings with it.
   */
  groundAt: 2461,
  gone: 3413,
  lines: ["Volume menghitung lembar saham,", "bukan pelakunya."],
  mark: "menghitung lembar saham",
  /** The slow rise and fall, the same pair SC01's mascot breathes on. */
  float: { amount: 12, period: 240 },
  /**
   * ⚠ MOVING AVERAGE'S CLOSING CARD, at Simon's instruction: the mark floating
   * over a bordered panel that sits on a solid indigo block, quote marks in
   * opposite corners, on the same drifting grid. Ported into core/QuoteCard so
   * the two episodes cannot drift apart — see there for the ink measurements
   * that put the marks 20px off the type.
   *
   * The card is sized to its contents rather than chosen: padding, two lines,
   * the closing mark under them, and a floor.
   */
  card: { w: 980, h: 300, size: 48, lead: 66, markH: 120, gap: 54, lift: 50 },
} as const;

/**
 * ═══ THE HEADLINE ═══  (Simon's frames)
 *
 * One line, top left, that CORRECTS ITSELF: it states the wrong answer, strikes
 * it out, then rolls through the two right ones.
 *
 *   f2541  "Volume: jumlah orang transaksi"
 *   +hold  the phrase is struck through and goes grey
 *   f2706  it ROLLS UP and out; "bisa dari pemain besar, atau..." rolls in
 *   f2880  that rolls out in turn and the second cause takes its place
 *
 * ⚠ THREE PHRASES IN ONE SLOT, not two and then a new line — Simon's revision.
 * The two causes are alternatives to each other, so they occupy the same place
 * one after the other rather than stacking up as a list.
 *
 * ⚠ THE STRIKE WAITS. `hold` is 30 frames AFTER the words have finished
 * arriving, not 30 from the frame they start: striking through type that is
 * still fading in reads as a glitch rather than as a correction.
 *
 * ⚠ HIS WORDING VERBATIM, ellipsis included.
 */
/**
 * ═══ QUIZ TIME ═══  (Simon's frame)
 *
 * ⚠ IT NO LONGER ARRIVES BIG AND WALKS UP — Simon changed his mind once he saw
 * what the fade cost: "camera cutnya langsung ke layout Quiz Time di pojok kiri
 * atas dan image di tengah". The cut lands on the FINISHED layout. 019's
 * travelling version is still in core as `QuizTitle` for whoever wants it; this
 * section is a plain heading now, on `HEAD`'s own anchor — the same rail SC11's
 * heading stood on, so the name does not jump between the two sections.
 */
export const QUIZ = { at: 11289, text: "Quiz Time" } as const;

/**
 * ═══ SC15A + SC15B ARE STRIPPED BACK TO THEIR TITLES ═══  (Simon's call)
 *
 * "11289-14508 hilangkan visual, kecuali judul" — f11289 to f14508 is exactly
 * CG-D's span. The BRPT quiz's whole picture goes: the card, the tape, the
 * histogram, the support level, the reveal mask, both crosshairs, both stat
 * strips, the question line, the countdown, the price chip and the closing
 * point — and, since "textnya juga", the scene's own centred heading in both
 * its states ("Menurutmu, apa yang terjadi?" and "False breakdown").
 *
 * ⚠ "QUIZ TIME" IS THE ONE THING LEFT STANDING, and deliberately. It is the
 * SECTION's name rather than the scene's, it sits in the heading rail rather
 * than in the picture, and Simon asked for it two changes before this one —
 * blanking it would undo the work the blanking is clearing space for.
 *
 * ⚠ IT IS A LEVER, NOT A DELETION. Every one of those still compiles and is
 * still keyed to the same VO-locked beats, so flipping this to `false` brings
 * the section back exactly as it was. Deleting the code would mean rebuilding
 * it from the script the day he wants it again — and he has asked for a blank
 * stretch before, to redesign into.
 *
 * ⚠ THE HEADING MOVED OUT OF THE PICTURE WRAPPER TO SURVIVE THIS. It used to
 * be inside the group that fades in with the chart; a title that is exempt
 * from a blanking has to be mounted outside the thing being blanked.
 */
export const SC15_BLANK: boolean = true;

/**
 * ═══ THE BRPT SCREENSHOT ═══  (Simon's file, "align-center")
 *
 * `VIDEO 21 - Volume/BRPT.png` — a phone screen showing BRPT's daily chart and
 * its volume. It stands alone in the blanked section.
 *
 * ⚠ THE RATIO IS THE FILE'S OWN, 1230:1800, not a chosen shape. Only the HEIGHT
 * is a free number here; the width follows, so the screenshot can never be
 * stretched by someone nudging a box.
 *
 * ⚠ AND THE HEIGHT IS WHAT THE ROOM ALLOWS. The heading rail ends at 176 and
 * the subtitle band starts at 972 — 796 of room, and 780 leaves 8px of air
 * either side of the picture once it is centred in it. At that height it is
 * 533 wide and sits between x=693 and x=1226, clear of both the heading on the
 * left and the logo zone on the right.
 *
 * ⚠ IT ARRIVES WHEN THE TITLE LEAVES THE MIDDLE, on the same frame the chart
 * used to start — the section cannot announce itself over its own picture.
 */
export const SC15_ART = {
  src: "art/brpt.png",
  ratio: 1230 / 1800,
  /** The size it arrives at and holds — centred in the room between the
   *  heading rail and the subtitle band. */
  h: 780,
  /**
   * ⚠ THE BOTTOM EDGE, AND IT NEVER MOVES. It is where the picture sits at its
   * arriving size, and it is also the anchor the enlargement grows from — one
   * number, so the two states cannot disagree about where the bottom is.
   */
  bottom: 964,
  /**
   * ═══ AND AT f11848 IT GROWS INTO THE PART SIMON SCREENSHOTTED ═══
   *
   * ⚠ 100% BIGGER, ANCHORED ON THE BOTTOM — his numbers. 780 → 1560 over
   * f11848–11931, with the bottom pinned, so the picture opens upward.
   *
   * ⚠ WHAT THAT CROPS IS WHY IT IS THE RIGHT MOVE. Growing upward from 964 puts
   * the top edge at −596, which in the FILE's own pixels is y 688 — within two
   * pixels of `price.y0`, the top of the price plot. The app's header, its
   * price, the Prev/Open/High/Low row and the timeframe tabs all leave the
   * frame, and what is left is the chart and its volume: the part he marked.
   *
   * ⚠ EASED, NOT LINEAR. Unlike a drifting camera this one starts and stops on
   * screen, and a move the viewer can see beginning and ending is exactly what
   * an eased curve is for.
   *
   * ⚠ AND THE END STATE BREAKS TWO STANDING RULES, WHICH IS SIMON'S CALL TO
   * MAKE. At 1066 wide, centred, it runs 427 → 1493: past the logo zone's
   * `maxX` of 1368 in the top 150px (though still 47px clear of the mark
   * itself), and it reaches the frame's top edge rather than stopping at the
   * 54px margin. A picture that satisfies both can only reach 814 tall — a 4%
   * enlargement, not 100%.
   */
  zoom: { at: 11848, over: 83, to: 1560 },
  /**
   * ═══ EVERYTHING BELOW IS IN THE FILE'S OWN PIXELS ═══
   *
   * ⚠ AND IT IS MEASURED, NOT PLACED BY EYE. The screenshot was scanned for
   * candle-green and candle-red: the price tape lives in y 720–1259, the
   * histogram in y 1423–1646, and the orange 1.800 line pins the plot's width
   * at x 43–1202. The volume bars separate cleanly into FORTY columns, first
   * centre 57 and last 1188, so the pitch is 29.0 — the candles share that axis
   * and therefore that pitch.
   *
   * ⚠ THE SCENE CONVERTS THESE, it does not hold canvas numbers. The picture's
   * height and position are free numbers above; if either moves, the cover and
   * the level move with it because they are expressed against the FILE.
   */
  img: { w: 1230, h: 1800 },
  plot: { x0: 43, x1: 1202 },
  /**
   * ⚠ THE COVER RUNS 10px PAST THE PLOT'S RIGHT EDGE. `x1` is where the orange
   * 1.800 line stops, and the last column's antialiased edge reaches a pixel or
   * two beyond it — enough to leave a red hairline standing outside the panel,
   * which reads as a rendering fault rather than as a withheld answer.
   *
   * ⚠ AND THE PANEL'S ROUNDED CORNER IS WHY IT IS THIS BIG. A 16px radius in
   * canvas pixels is 37 of the file's, so the bottom-right corner arc cuts back
   * a long way; at 10 the last bar's own corner pixel sat 0.3px OUTSIDE the arc
   * and showed through. 16, with the histogram pane taken 14 lower, puts it
   * comfortably inside.
   */
  padRight: 16,
  /** The two panes, top and bottom, generous enough to hide a whole column. */
  price: { y0: 690, y1: 1300 },
  vol: { y0: 1400, y1: 1670 },
  bars: { n: 40, first: 57, pitch: 29.0 },
  /**
   * ⚠ TEN COLUMNS FROM THE RIGHT, COVERED FROM THE FIRST FRAME — Simon's call,
   * and the shape is the one episode 019 uses for the same job: a solid GREY
   * rounded panel, not indigo. Indigo is this episode's marking colour, and a
   * big indigo panel reads as something being pointed AT rather than something
   * withheld.
   *
   * ⚠ TWO PANELS, NOT ONE. Simon named the candles and the volume bars
   * separately, and one tall rect between them would swallow the month row that
   * dates the tape.
   */
  hide: 10,
  /**
   * ⚠ THE LOW IS THE TAPE'S OWN, FOUND BY SCANNING — the lowest candle ink in
   * the file sits at y 1259, on the column at x 898. That works out as bar 29,
   * which is the LAST BAR STILL VISIBLE: the level lands on the low of the
   * tape the viewer can actually see, with the answer still covered.
   */
  low: 1259,
  supportAt: 11505,
  supportOver: 30,
  /**
   * ═══ THE RING ON THE LOWEST RED CANDLE ═══  (Simon's frame)
   *
   * ⚠ THE CANDLE WAS FOUND, NOT CHOSEN. Scanning the file for the app's own
   * candle red — (236, 90, 90), which needs r−g > 110 to tell it apart from the
   * ORANGE 1.800 line that a looser test happily matched — the column at bar 29
   * runs y 1187–1252 and x 886–910. It is red for all 1820 of its pixels, and
   * it is the lowest thing on the tape: the same bar the support level sits
   * under, and the last one still visible before the cover.
   *
   * ⚠ 46 IS BIGGER THAN THE CANDLE ON PURPOSE. The body's half-diagonal is 35,
   * so 46 clears it with room; a ring drawn tight to a 24px-wide body reads as
   * a badly-fitting box rather than as something circled. It is wider than the
   * 29px pitch, which is what circling one bar in a tape looks like.
   *
   * ⚠ IN THE FILE'S PIXELS, like everything else here, so it grows with the
   * picture at f11848 instead of sitting still while the candle moves.
   */
  ring: { at: 11628, x: 898, y: 1220, r: 69 },
  /**
   * ⚠ BOTH MARKS LEAVE AS THE PICTURE GROWS — Simon's frames, and they are the
   * ZOOM's frames, not a second pair. The level and the ring are about the low;
   * once the view opens into the volume the reading has moved on, and a mark
   * left standing is a mark still making its claim.
   */
  marksOut: { at: 11848, over: 83 },
  /**
   * ⚠ 0 — SIMON CANCELLED THE GLOW ("gajadi glow"). The 3px stays; only the
   * light around it goes. Kept as a lever rather than torn out because the
   * marks and all three highlight boxes read it, and a number is a cheaper way
   * back than re-threading a prop through five call sites.
   */
  markGlow: 0,
  /**
   * ═══ THE TWO HIGHLIGHTS ON THE HISTOGRAM ═══  (Simon's frames)
   *
   * ⚠ BAR RANGES, NOT PIXELS. "3 volume bar dari paling kanan setelah ditutup
   * shape" is bars 27–29: the cover starts at bar 30, so the three still
   * visible at the right are 27, 28 and 29. The rest — everything from bar 0 to
   * 26 — is the second box at f12128, and the two of them together are the
   * comparison the scene is making.
   *
   * ⚠ THEY DO NOT TOUCH. Two boxes sharing an edge draw a double stroke down
   * the middle and read as one box with a line in it; 6 of the file's pixels
   * between them is enough to say they are two claims.
   *
   * ⚠ AND THEY ARE THE COVER'S OWN HEIGHT, so the histogram row reads as one
   * strip: three bars marked, the rest marked, ten withheld.
   */
  hl: [
    /** ⚠ HALF HEIGHT, SITTING ON THE BASELINE — Simon's call, and only this one.
     *  These three bars are the short ones; a full-height box round them is
     *  mostly empty paper, and an empty box reads as a box round nothing. */
    { at: 12006, from: 27, to: 29, half: true },
    { at: 12128, from: 0, to: 26 },
  ],
  hlGap: 6,
  /**
   * ⚠ THE COVERS GIVE UP TWO COLUMNS, FROM THE LEFT — Simon's frame, "anchor
   * kanan". The right edge is pinned and the left edge walks right by two
   * pitches, so `hide` goes 10 → 8 and bars 30 and 31 come out from under it.
   * Both shapes move together: they are covering the same two columns of the
   * same tape.
   */
  reveal: { at: 12300, over: 30, by: 2 },
  /** ⚠ AND BOTH HIGHLIGHTS LEAVE ON THAT SAME FRAME. They are readings of the
   *  bars that were visible BEFORE; the moment two more arrive they are
   *  readings of a picture that no longer exists. */
  hlOut: { at: 12300, over: 24 },
  /**
   * ⚠ CYAN, ON THE TWO THAT JUST APPEARED — Simon's frame and his colour. Every
   * other mark in this section is indigo; the pair being uncovered is the one
   * thing that is NEW, and it gets the one hue that says so.
   */
  hl2: { at: 12420, from: 30, to: 31 },
  /** ⚠ 10px EITHER SIDE, IN CANVAS PIXELS — Simon's number, and canvas is the
   *  right unit for it: it is breathing room around a mark, so it should stay
   *  10 on screen whatever size the picture behind it is. Everything else in
   *  this block is in the FILE's pixels; this one deliberately is not. */
  hl2Pad: 10,
  /**
   * ⚠ THE HATCH IS GONE — Simon cancelled it. What separates the cover from the
   * chart now is a DASHED EDGE: the panel is the chart's own white, so the only
   * thing saying "something is over this" is its outline, and a dashed one says
   * it is temporary in a way a solid one does not.
   *
   * ⚠ IN CANVAS PIXELS, NOT THE FILE'S, for the same reason the hatch was: the
   * shapes grow with the picture, and a dash pattern that grew with them would
   * turn into a row of blocks at double size.
   *
   * ⚠ `dash` AND `gap` ONLY MEAN ANYTHING BECAUSE THE OUTLINE IS DRAWN IN SVG.
   * CSS `border-style: dashed` picks its own pattern and there is no property
   * that changes it — the first version of this set both numbers and the
   * browser ignored them. A stroked rect with `stroke-dasharray` is the only
   * way to say how long a dash is.
   */
  edge: { width: 2, dash: 22, gap: 12 },
  /**
   * ⚠ THE WHOLE PICTURE SLIDES LEFT UNTIL IT TOUCHES THE MARGIN — Simon's
   * frame. The distance is DERIVED (`theme.margin.left` minus wherever the
   * picture's left edge is), not typed, so it stays flush whatever size the
   * picture ended up at. Everything stuck to it — covers, highlights, question
   * marks — rides the same wrapper.
   */
  shift: { at: 12575, over: 40 },
  /**
   * ═══ THE ANSWER LANDS ═══  (Simon's frame)
   *
   * Five things at f13057: the numeral goes, the right answer is marked and the
   * wrong one drains to grey, both covers wipe away to the RIGHT — question
   * marks with them — and the cyan highlight fades.
   *
   * ⚠ THE COVERS WIPE, THE CYAN FADES, AND THAT IS NOT AN INCONSISTENCY. A
   * cover is a thing being TAKEN OFF, so it has to travel; the cyan band is a
   * reading, and a reading is simply no longer being made.
   *
   * ⚠ AND THE WIPE UNCOVERS LEFT TO RIGHT, which is the direction the tape is
   * read in. Going the other way the newest bars — the ones the whole quiz is
   * about — would appear first and the answer would be given backwards.
   */
  answer: { at: 13057, over: 24, wipe: 46 },
  /**
   * ═══ THE ARROW ALONG THE RECOVERY ═══  (Simon's frame)
   *
   * ⚠ BOTH ENDS ARE MEASURED, NOT DRAWN BY EYE. It runs from the tape's own low
   * — bar 29, the candle the ring and the level are already about, whose bottom
   * sits at y 1259 — to the top of bar 39 at y 1009, which is the highest ink
   * anywhere in the ten columns the cover has just given back. The tip is put a
   * little past and above that so the head does not sit on the candle it is
   * pointing at.
   *
   * ⚠ IN THE FILE'S PIXELS, so it rides the picture; its STROKE is in canvas
   * pixels and does not, for the reason every other mark here does not.
   *
   * ⚠ THE MARKER'S SHAPE, THE SECTION'S COLOUR — Simon's call. It keeps the
   * hand-drawn wobble, the taper and the two-stroke head of the f9019 arrow but
   * takes indigo, so it reads as part of this section's marking rather than as
   * a second, louder voice on a chart that already carries three indigo marks.
   * The marker red stays where it started, at f9019.
   */
  /**
   * ═══ THE QUIZ PACKS UP ═══  (Simon's frames)
   *
   * f13441 — the question, both answers and the arrow all leave, and the
   * picture goes back to the middle it came from. The slide back reuses the
   * SAME derived distance as the slide out, negated: two numbers would be two
   * chances for the picture to come to rest somewhere other than where it
   * started. The heading rides it home too, since it rides it out.
   *
   * f13520 — the two indigo readings of the histogram come BACK. Same boxes,
   * same bars, a second entrance; they were put away at f12300 because two more
   * bars were about to arrive, and now the tape is settled they are true again.
   *
   * f13685 — a third box lands on the ten VOLUME BARS the cover was hiding, and
   * the two already there STAY. All three hold to the end of the scene: between
   * them they tile the whole histogram — the old days, the three before the
   * breakdown, and the ten that answer it — and taking two away to make room
   * for the third would break the comparison at the moment it is complete.
   *
   * f13859 — the picture rises 200 to make room under it. The HEADING does not
   * go with it: it is anchored to the picture's SLIDE, which is what carries it
   * off the left edge, and riding a 200px rise as well would take it off the
   * top of the frame instead.
   */
  outro: { at: 13441, over: 30 },
  unshift: { at: 13441, over: 40 },
  hlBack: { at: 13520 },
  hl3: { at: 13685, from: 30, to: 39 },
  rise: { at: 13859, over: 40, by: 200 },
  /**
   * ═══ THE TWO CLOSING LINES ═══  (Simon's frames)
   *
   * They stand in the room the rise opens: the picture's bottom lands at 764
   * and the subtitle band starts at 972, so 208px, and two 44px lines sit in it
   * with air to spare. Centred on the picture, which is centred on the frame.
   */
  says: {
    size: 44,
    /** ⚠ 58 APART, WAS 76 — Simon's "kecilin lagi". At 44px a line box is about
     *  57 tall, so 58 is single-spaced: the two read as one sentence broken in
     *  two rather than as two statements. */
    /** ⚠ IT FINISHES BEFORE ANYTHING ELSE STARTS — Simon: "fade out selesai
     *  dulu, lalu muncul text box nya". 30 frames from f14190, so the paper is
     *  clear at f14220. */
    gone: { at: 14190, over: 30 },
    lines: [
      { at: 13914, y: 802, text: "Breakdown kehilangan konfirmasi," },
      { at: 14047, y: 860, text: "buyer memberi respons" },
    ],
  },
  /**
   * ═══ WHAT THE WHOLE QUIZ WAS FOR ═══  (Simon's frame)
   *
   * The two lines above give way to the point they were building to, in the
   * episode's dashed marquee.
   *
   * ⚠ THE BOX IS A FIXED SIZE, WHICH IS `DashedBox`'s OWN RULE. Its dashes have
   * to land on known coordinates — that is why the component takes a rect
   * rather than measuring its text — so the width here is chosen against the
   * longest line rather than derived from it.
   *
   * ⚠ AND IT FITS THE ROOM THE RISE OPENED. The picture's bottom is at 764 and
   * the subtitle band starts at 972; a 176-tall box at 782 ends at 958.
   */
  point: {
    /**
     * ⚠ f14232 — TWELVE FRAMES OF EMPTY PAPER AFTER THE FADE ENDS. Simon:
     * "tidak perlu buru buru… timing tidak harus sama dengan subtitle atau
     * voice". The three beats are now strictly one after another: the lines
     * clear at 14220, the frame opens 14232→14270, the words follow at 14282.
     *
     * ⚠ AND THE FRAME OPENS AT ITS OWN SPEED, NOT THE LIBRARY'S DEFAULT. That
     * default reproduces what the four dashed boxes Simon already approved in
     * this episode do; this one is deliberately slower, and says so with
     * `beats` rather than by re-timing the others.
     */
    at: 14232,
    beats: { rise: 0.3, open: 0.34 },
    /** A beat of stillness between the frame landing and the words starting. */
    textGap: 12,
    x: 520,
    y: 782,
    w: 880,
    h: 176,
    size: 44,
    lead: 58,
    lines: ["Volume memberi sinyal kuat untuk", "mewaspadai potensi breakdown"],
    /** ⚠ THE SECOND LINE IS THE MARK. It is the whole of it, so the run and the
     *  line are the same string — no substring matching to get wrong. */
    mark: "mewaspadai potensi breakdown",
  },
  /**
   * ⚠ THE PRICE THE ARROW ARRIVES AT, 20px ABOVE IT — Simon's number, and the
   * "above" is measured off `markerGeom`, not typed. Where the arrow's top edge
   * falls depends on its bow, its head and its stroke together; the same
   * function the component draws from reports it, so the gap stays 20 whatever
   * the picture is doing.
   */
  tag: { at: 13166, text: "1750", size: 40, gap: 20 },
  arrow: {
    at: 13103,
    over: 34,
    from: { x: 880, y: 1276 },
    to: { x: 1204, y: 980 },
    bow: 42,
    width: 10,
    headLen: 54,
  },
  /**
   * ═══ THE TWO ANSWERS ═══  (Simon's frame)
   *
   * They stand in the room the picture just gave up. The bullets are circles
   * and deliberately larger than the list markers earlier in the episode —
   * those name points, these are things to CHOOSE, and a choice wants a target.
   *
   * ⚠ THE PULSE REPEATS, which nothing else in this episode does. A ring that
   * fires once is a mark landing; a ring that keeps going is an invitation
   * still open, and it is open for as long as the question is.
   */
  ask: {
    at: 12704,
    x: 1240,
    /** ⚠ 440, WHICH IS 540 LESS SIMON'S 100. A layout number, not a move — he
     *  said so explicitly: the block simply sits 100 higher, it does not
     *  travel there. */
    midY: 440,
    lead: 50,
    gap: 42,
    /** ⚠ THE SAME AS `size` — Simon spotted them differing. The question and
     *  the two answers are one block of type; 44 against 48 read as a heading
     *  and its list, which is not what this is. */
    headSize: 48,
    size: 48,
    dot: 15,
    dotGap: 30,
    pulse: 1.4,
    head: "Apa yang akan terjadi?",
    /**
     * ⚠ THE COUNTDOWN IS ONE GLYPH, SWAPPED — Simon's three frames. Three
     * numerals stacked would be a list; a countdown is the same place saying a
     * different thing, which is also how 019 does it.
     *
     * ⚠ AND IT IS ABSOLUTELY PLACED, NOT IN THE BLOCK'S FLOW. That block is
     * centred on `midY`, so a numeral added under it would push the question
     * and both answers back up by half its height the moment it appeared.
     */
    count: {
      at: [12847, 12922, 12985],
      /** ⚠ 670 — 640 plus Simon's 30. */
      y: 670,
      /** ⚠ 120 — 96, plus his 10, plus his 14. */
      size: 120,
      /**
       * ⚠ CENTRED ON THE THREE LINES, AND THE CENTRE IS MEASURED, NOT THE
       * COLUMN'S. The three texts are flush LEFT in a 584px column, so their
       * ink runs 1238–1760 and its middle is 1499 — centring the numeral in the
       * column instead would put it at 1532, 33px to the right of everything it
       * is supposed to sit under.
       *
       * ⚠ AND IT MOVED WHEN `headSize` DID. At 44 the heading ended at 1717 and
       * this was 1478; matching it to the answers' 48 widened it to 1760. The
       * heading is the longest of the three and it is what sets this — change
       * its wording or its size and re-measure.
       */
      cx: 1499,
    },
    options: ["harga akan naik", "harga akan turun"],
  },
  /**
   * ⚠ A QUESTION MARK IN EACH COVER — Simon's call, one per shape. 019 puts its
   * countdown glyph in the same place for the same reason: the question belongs
   * where the answer is about to appear, not somewhere else on screen.
   *
   * ⚠ IN THE FILE'S PIXELS so it grows with the picture. 150 is a little under
   * half the cover's 306px width — big enough to own the shape, small enough
   * that the shape still reads as a panel rather than as a letter.
   */
  /** ⚠ 118, WHICH IS 150 LESS SIMON'S 14 — but his 14 is CANVAS pixels and
   *  this is the FILE's, so it is 14 / 0.4333 = 32 of these. At the size the
   *  picture arrives in that is 51px on screen; doubled it is 102. */
  qmSize: 118,
} as const;

/**
 * ═══ SC16 — TWO WINDOWS, IN THE REFERENCE'S OWN LANGUAGE ═══  (Simon's call)
 *
 * The chart, the volume and the three captions that used to stand here are
 * gone: "hilangkan semua visual karna tidak dipakai". What replaces them is the
 * ConversBank look — a pastel ground and two panes of glass — with one line in
 * each.
 *
 * ⚠ THE GROUND IS NOT THE EPISODE'S. This scene paints its own, so `Stage` is
 * mounted transparent; every other scene in the episode would be wrong if it
 * did this, which is why the colours are named `glass*` in the theme rather
 * than added to the palette.
 *
 * ⚠ THE TWO ARE THE SAME SIZE. They are two halves of one answer — what volume
 * is for — and a pair where one is larger says one of them matters more.
 */
/**
 * ⚠ WHICH SC16 IS BUILT. 1 is the two padded chips; 2 is the portrait window
 * with Simon's own breakout screenshot traced into it. Nothing else selects
 * between them — see Composition.tsx, the same handle the combos chapter uses.
 */
export const SC16_VERSION: 1 | 2 = 2;

/**
 * ═══ SC16 · VERSION 2 — ONE PORTRAIT WINDOW ═══  (Simon's frames)
 *
 * Nothing but the ground until f14577, then a window that draws itself the way
 * a rectangle gets drawn: a dot, then its WIDTH, then its HEIGHT. Three beats
 * that never overlap — a box that grows both ways at once is a box scaling up,
 * which is a different gesture and the one this is not.
 *
 * ⚠ THE WINDOW CARRIES THE SCREENSHOT'S OWN RATIO. SS1.png is 384x535, so
 * 560x780 is the same shape at 1.46x — the tape inside is not stretched to fit
 * a rectangle chosen for the stage.
 */
export const SC16_V2 = {
  win: { w: 560, h: 780, radius: 32, dot: 18 },
  open: { at: 14577, dot: 10, wide: 24, tall: 28 },
  /** Inside the window, where the tape may draw. */
  plot: { x: 44, y: 56 },
  /**
   * ⚠ THE CANDLES DO NOT ARRIVE ONE BY ONE — Simon changed his mind, and he was
   * right. They are simply THERE, laid out against the window's FINISHED rect,
   * and the frame opening over them is what reveals them: the same clip that
   * makes the box grow is the chart's mask. A tape built bar by bar inside a box
   * that is also growing is two entrances fighting each other.
   *
   * ⚠ WHICH MEANS THE GRID IS BUILT FROM THE FINAL RECT, NOT THE CURRENT ONE.
   * Laid out against a growing box the candles would stretch as it opened, and
   * a stretched candle is a lie about its price.
   */
  /**
   * ⚠ THE LEVEL IS THERE FROM THE FIRST FRAME — Simon: "sudah ada sejak awal".
   * It is not animated on at all; the window opening over it is what reveals
   * it, exactly as with the candles. A level that arrives after the tape reads
   * as a thing someone added; a level already on the chart reads as a thing
   * that was always true of it.
   */
  label: { text: "Resistance", size: 26, gap: 10 },
  /**
   * ⚠ AND IT SITS 100px LOWER — Simon's number, converted to a PRICE once and
   * for all. 100 canvas pixels means a different price at every zoom level, so
   * applying it as a screen offset would make the band drift against the
   * candles all the way through the widening. It is measured in the close-up's
   * own grid and subtracted from the band's two values, which makes it a level
   * again — flat, and fixed to the tape.
   */
  bandDrop: 100,
  /**
   * ═══ THE TREND ARROW ═══  (Simon's reference: the opening seconds of
   * 65cdc0e9…mp4)
   *
   * One straight heavy line from a swing low to a swing high with a solid head
   * at the leading end, drawn from the tail forwards. In the reference it is
   * white on a dark chart, so on this pale ground it takes the scene's own ink
   * rather than a brand accent — that is what "white" means there.
   *
   * ⚠ IT COMES AFTER THE VIEW HAS OPENED. The leg it draws spans 87 bars, and
   * 41 of those are outside the close-up: drawn before the widening it would be
   * a line that mostly points off the edge of the window.
   */
  /** ⚠ 3px, AND THE HEAD CAME DOWN WITH IT. A 34px head on a 3px line is a
   *  dart on a thread; the reference's head is about four times its own stroke,
   *  so this one is 14 by 6. Say the word if you want it big again. */
  trend: { at: 14740, over: 46, width: 3, head: { len: 14, half: 6 } },
  /**
   * ═══ AND AT f14665 IT OPENS OUT ═══  (Simon's frame, SS2 as the reference)
   *
   * The white panel grows to fill the screen and the view widens from the 46
   * bars of the close-up to all 232 — SS1 becoming SS2.
   *
   * ⚠ ONE CURVE DRIVES BOTH, which is what "konsisten dengan background
   * putihnya" has to mean. The panel's rect and the chart's grid are read off
   * the same progress value, so the tape cannot finish opening before the paper
   * under it does.
   *
   * ⚠ AND IT IS A CHANGE OF GRID, NOT A CHANGE OF PICTURE. Both states are
   * expressed as (box, domain) over the SAME 232 bars and interpolated, so no
   * candle is created or destroyed — the viewer can see that nothing moved
   * except the frame, which is the only thing that makes a zoom-out legible.
   */
  wide: { at: 14665, over: 54 },
  /** Where the tape may draw once the panel is the whole screen. */
  full: { x: 120, y: 200, w: 1680, h: 700 },

  /**
   * ═══ f14893 · THE VIEW LEAVES, AND TWENTY CANDLES STAY ═══  (Simon's frame)
   *
   * "candlestick chartnya bergeser ke kiri dan ke bawah hingga keluar dan
   * tersisa 20 candlestick paling kanan" — and then a new tape grows out of
   * those twenty, this time with its volume under it.
   *
   * ⚠ IT IS ONE GRID CHANGE, NOT A TRANSLATION OF A PICTURE. Sliding the whole
   * chart by a pixel offset would be a lie the moment a new candle arrives: the
   * newcomers would have to be laid out against a box that no longer matches
   * the one the survivors were drawn in. Both states are (box, domain) over the
   * same 232 bars, so what moves is the FRAME — the survivors travel left
   * because 212 bars are being pushed off the left edge, and DOWN because the
   * domain is opening upward to make room for a rise that has not happened yet.
   * That second half is the whole reason Simon asked for "ke bawah".
   */
  /**
   * ═══ THE LINE OVER THE CHART ═══  (Simon: 14665–14884, 60px, 100px above)
   *
   * ⚠ ITS y IS THE BAND'S, NOT A TYPED NUMBER. "100 px di atas area resistance"
   * measures from a thing that MOVES: the band is still travelling while the
   * view widens at 14665, and it sits wherever `DROP` in ResistanceArea.tsx
   * puts it. The gap is applied to the band's own top edge every frame, so the
   * line keeps its 100px whatever either of those does later.
   */
  caption: {
    text: "Volume bisa juga buat membaca performa trend",
    at: 14665,
    gone: 14884,
    over: 26,
    size: 60,
    gap: 100,
  },
  clear: { at: 14893, over: 30 },
  pan: {
    at: 14925,
    over: 54,
    /**
     * ⚠ WHERE THE FIRST SURVIVOR LANDS IS DERIVED, NOT TYPED — see `x0` in
     * SC16v2.tsx. Twenty candles have to be twenty, and the tape is clipped at
     * the plot's left edge, so that edge has to fall exactly between the last
     * hidden candle and the first kept one. Typed, it was 124 and correct only
     * while the tape was 140 bars long; `SS_HIDE` changes the pitch, and with
     * it the only number that can be right.
     */
    /** The price panel gives up its bottom 200px so the histogram can have it. */
    price: { y: 200, h: 500 },
    volume: { y: 740, h: 160 },
  },
  /** The histogram arrives under the twenty before anything new is added to
   *  them — the panel is established, then it starts filling. */
  vol: { at: 14955, over: 26 },
  /**
   * ⚠ UN-EASED, AND THAT IS THE POINT. An eased build would deal the candles
   * slowly, then fast, then slowly, which reads as a machine speeding up
   * rather than as a tape printing.
   *
   * ⚠ IT ENDS ON 15051 — Simon's frame, and that number is what sets every
   * other one above it. 158 frames is the whole act, so the clear, the move
   * and the print cannot each have as long as they would like: the move came
   * down from 84 frames to 54 to leave the print 70, which is 1.7 candles a
   * frame. Shortening the print instead would have put 120 candles inside 30
   * frames, and four a frame stops being a tape printing and becomes a wipe.
   */
  build: { at: 14981, over: 70 },

  /**
   * ═══ TWO MARKS ON THE HISTOGRAM ═══  (Simon's frames and his two crops)
   *
   * "wipe in ke kanan" then "wipe out ke kiri" is exactly HighlightBox's own
   * `grow`: it opens from its LEFT edge rightwards and closes back the way it
   * came, so the edge where the claim starts never moves.
   *
   * ⚠ THE RANGES ARE BAR INDICES, NOT PIXELS, and that is the only way they can
   * be right. The tape is laid out by the grid, so a box typed in canvas pixels
   * would come off its bars the moment anything upstream — the pitch, x0, the
   * plot's width — is touched. `from`/`to` are inclusive slots in the grown
   * 140-bar tape; slot 0 is the first surviving candle.
   *
   * ⚠ AND THEY ARE READ OFF SIMON'S CROPS, WHICH IS A JUDGEMENT. The two crops
   * have no coordinates in them, so each one was matched by its own landmarks —
   * the first by the twin 148/147 green bars that are the tallest greens on the
   * tape, the second by the flat stretch and its near-zero bar. If a box is a
   * few bars out, these four numbers are the whole fix.
   */
  /**
   * ⚠ BOTH LEAVE TOGETHER ON 15476 — Simon's change, and it is not a tidy-up.
   * The first box used to go at 15190, before the second arrived, so the two
   * readings were never on screen at once and "kuat" versus "ringan" was a
   * claim the viewer had to hold in their head. Overlapping them from 15240
   * makes it a comparison you can see, which is why each now carries its own
   * word.
   */
  marks: [
    {
      from: 8, to: 55, label: "Volume kuat", tone: "cyan" as const, trend: "support" as const,
      in: { at: 15061, over: 26 }, out: { at: 15454, over: 22 },
    },
    {
      from: 78, to: 98, label: "Volume ringan", tone: "indigo" as const, trend: "resistance" as const,
      in: { at: 15240, over: 26 }, out: { at: 15454, over: 22 },
    },
  ],
  /** How far outside the bars the box sits. A mark that touches what it marks
   *  reads as part of it. */
  markPad: { x: 8, top: 14, bottom: 10 },
  /** The word over each box: flush with its left edge, clear of its top, and
   *  in the box's own colour so the pair cannot be read the wrong way round. */
  markLabel: { size: 36, gap: 14 },
  /**
   * ⚠ EACH LINE ARRIVES WITH ITS OWN BOX, NOT BOTH WITH THE FIRST. Simon tagged
   * both "(saat Volume kuat)", but he also tagged them with different crops —
   * the higher-lows line is the first box's range and the lower-highs line is
   * the second's, and a resistance line drawn 179 frames before the box it
   * belongs to would be pointing at nothing. Read as a slip; say the word and
   * `at` here becomes each mark's own `in.at` — or both become 15061.
   */
  swingLine: { over: 34, width: 3, gone: { at: 15454, over: 22 } },
  /**
   * ═══ THE PRICE LINES ═══  (Simon: "bebas saja penempatannya yang penting
   * rapi, jaraknya rapi")
   *
   * ⚠ ROUND LEVELS, NOT EQUAL DIVISIONS OF THE PANEL. Both are evenly spaced,
   * so both are "rapi" — but a chart divided into sevenths is divided by its
   * own height, and one drawn on 70, 80, 90 … is divided by price. Only the
   * second keeps its spacing when anything moves the domain, which `SS_HIDE`
   * just did.
   *
   * ⚠ AND THEY WAIT FOR THE MOVE TO FINISH. Ticks over an interpolating domain
   * slide against the candles for the whole pan, which reads as the grid coming
   * loose from the chart.
   */
  rules: { at: 14981, over: 30, want: 8 },
  /**
   * ═══ f15500 · THE PREVIEW OPENS ON THE TWO SPIKES ═══  (Simon's crop)
   *
   * ⚠ ONE FACTOR, BOTH AXES — Simon: "jangan di stretch". The first version
   * framed twenty slots across the plot and narrowed the domain to what those
   * twenty reach, which are two DIFFERENT magnifications: 5× sideways and about
   * 2.7× up, so every candle came out fat. Here `k` scales the bar pitch, the
   * price panel's height and the histogram's height by the same number, the
   * domain does not change at all, and no candle changes shape.
   *
   * ⚠ WHICH MEANS THINGS LEAVE THE FRAME, and that is what zooming in IS. The
   * volume baseline is the anchor — it stays on y=900 — and slot `centre` is
   * put in the middle of the screen; everything else follows from those two,
   * so the tape's high prices ride off the top exactly as they would in a
   * charting app. A zoom where nothing leaves is a zoom that stretched.
   *
   * ⚠ AND THE HISTOGRAM STILL NEEDS NOTHING NORMALISING. Its peak is bar 21,
   * which is on screen throughout; the panel grows with everything else, so the
   * bars keep both their heights relative to each other and their proportions.
   */
  zoom: { at: 15500, over: 60, k: 2.2, centre: 26 },
  /**
   * ═══ f15712–15962 · THE TWO SPIKES, ALONE IN COLOUR ═══  (Simon's frames)
   *
   * "2 volume bars yang paling tinggi, berkedip glow, sedangkan volume bar lain
   * berubah warna jadi greyscale. Setelah itu warna kembali normal."
   *
   * ⚠ WHICH TWO IS DERIVED, NOT TYPED — see SS_VOL_TOP2. Naming the bars by
   * index would be a claim about the data that stops being true the moment
   * SS_HIDE or the trace changes.
   */
  spikes: {
    at: 15712,
    gone: 15962,
    fade: 24,
    /** One full breath, and slow: a glow that flickers reads as a fault. */
    beat: 46,
    glow: { min: 10, max: 34 },
  },
} as const;

/**
 * ═══ SC17 · TWO PRODUCT WINDOWS ═══  (Simon's reference screenshot)
 *
 * A mobile product page: a display area with the thing in it, a title, and a
 * description. The reference has a price beside the title and Simon struck it
 * — "dalam konteks chart, jangan gunakan harga" — so the title row is a title
 * and nothing else.
 *
 * ⚠ 440 WIDE, WHICH IS A CHUNKIER PHONE THAN THE REFERENCE'S, AND DELIBERATELY.
 * The description is the longest line in the shot at 44 characters; on a
 * correctly-proportioned 376px phone it only fits at 15px, and Simon has just
 * spent a beat telling me the last thing was too small to read on a phone.
 * Widening the device is the one change here that nobody will notice and
 * everybody will benefit from.
 *
 * ⚠ AND THEY START AT y=150, WHICH IS THE LOGO ZONE'S FLOOR. The pair is 1080
 * wide and centred, so the right-hand window ends at x=1500 — inside the strip
 * the logo owns. Below 150 that rule does not apply.
 */
export const SPIKES = {
  win: { w: 440, h: 640, y: 200, gap: 200, radius: 46 },
  /**
   * Inside the window, in its own coordinates.
   *
   * ⚠ NO CHROME AT ALL — Simon took the clock, the signal, the battery, the
   * chevron, the search glyph, the plus button and the home bar out, one
   * message after another, and he was right to. Every one of them was the
   * REFERENCE's furniture rather than this shot's: they say "this is a phone",
   * and what this shot has to say is "this is one thing, named, and explained".
   * What is left is the display, the name and the paragraph — which was the
   * part of the reference that was actually being borrowed.
   */
  ui: {
    pad: 20,
    display: { x: 20, y: 20, w: 400, h: 442, radius: 30 },
    /** Where the tape may draw inside the display. */
    price: { x: 34, y: 34, w: 372, h: 286 },
    volume: { x: 34, y: 340, w: 372, h: 108 },
    title: { y: 500, size: 36 },
    /**
     * ⚠ 18px, MEASURED RATHER THAN CHOSEN. The longest line is 44 characters;
     * at 20 it ran 430px wide inside a 372px column and hung over the window's
     * right edge. The lines are typed rather than wrapped, so nothing on screen
     * would have told me — the assertion at the foot of SC17.tsx does.
     */
    desc: { y: 558, size: 18, leading: 1.55 },
  },
  /**
   * ⚠ THE TAPE BUILDS, IT DOES NOT APPEAR. The window pops, and ten frames
   * later the candles start printing into it — the same rule as every other
   * chart in the episode, and the reason is the same: a chart that is simply
   * there was never drawn, so nobody watched it being drawn.
   */
  pop: 26,
  build: { after: 10, over: 40 },
  words: { after: 18, over: 22, stagger: 8 },
  cards: [
    {
      at: 16140,
      title: "Volume Spike Hijau",
      desc: ["Dekat breakout, volume spike jadi konfirmasi.", "Setelah rally panjang, bisa profit taking."],
    },
    {
      at: 16462,
      title: "Volume Merah",
      desc: ["Harga jatuh tajam,", "menunjukkan panic selling"],
    },
  ],
} as const;

export const SC16_UI = {
  /**
   * ⚠ THE PANES ARE NOT SIZED, THEY ARE PADDED — Simon's call. Each one hugs
   * its own line with 40px either side and 60 above and below, so the two come
   * out at different widths because the two lines are different lengths. That
   * is the point: a pair forced to one width would be a table, and this is two
   * chips.
   *
   * ⚠ WHICH MEANS NO NUMBER HERE MEASURES TEXT. The old `x`, `w`, `h` and `top`
   * were a rect chosen against the longest line; flex layout gets the same
   * answer from the browser, and keeps getting it when the wording changes.
   */
  pad: { x: 40, y: 60 },
  gap: 40,
  radius: 40,
  size: 36,
  /** The second pane follows the first rather than arriving with it. */
  stagger: 10,
  lines: ["Untuk konfirmasi breakout", "Membaca performa trend"],
  /**
   * ⚠ THE BLURRED PANELS BEHIND — the reference's own depth at 0:06, where a
   * whole app's worth of cards sits out of focus behind the one in front.
   *
   * ⚠ FIXED POSITIONS, NOT RANDOM. `Math.random()` in a Remotion scene is a
   * different picture every frame; a seeded generator would be deterministic
   * but would still change the moment anyone touched the seed. Eight rectangles
   * typed out are eight rectangles that stay put.
   */
  /**
   * ═══ THE GROUND NEVER STOPS ═══  (Simon's call, and the reference's law)
   *
   * ⚠ LINEAR AND UNCLAMPED, NOT EASED. This is the one thing the study of
   * Simon's reference folder settled: a camera drift is CONSTANT VELOCITY,
   * because it never starts or stops on screen. An eased drift reads as a move
   * that is about to finish, which is the dead frame it exists to prevent.
   *
   * ⚠ TWO LAYERS, OPPOSITE WAYS, DIFFERENT DISTANCES. Two layers at the same
   * speed are one layer; the parallax IS the depth, and the blurred cards
   * moving further than the ground behind them is what puts them in front of
   * it. Quoted over 900 frames, which is roughly the scene's length — nothing
   * clamps there, it is just where the numbers are readable.
   */
  drift: {
    over: 900,
    ground: { x: 34, y: 22, zoom: 0.02 },
    ghost: { x: -78, y: -46 },
  },
  ghost: {
    blur: 14,
    radius: 28,
    rects: [
      { x: -60, y: 70, w: 420, h: 150 },
      { x: 250, y: 250, w: 330, h: 210 },
      { x: -40, y: 520, w: 380, h: 260 },
      { x: 380, y: 700, w: 460, h: 240 },
      { x: 900, y: 40, w: 520, h: 180 },
      { x: 1300, y: 300, w: 420, h: 300 },
      { x: 1560, y: 660, w: 420, h: 220 },
      { x: 940, y: 820, w: 500, h: 180 },
    ],
  },
} as const;

export const HEAD = {
  at: 2541,
  hold: 30,
  roll: [2706, 2880],
  gone: 3067,
  label: "Volume:",
  phrases: [
    "jumlah orang transaksi",
    "bisa dari pemain besar, atau...",
    "saham sama pindah tangan berkali-kali",
  ],
  x: 96,
  y: 100,
  size: 48,
  lead: 66,
} as const;

/**
 * ═══ SC06 — ONE READING, SPLIT IN TWO ═══  (Simon's frames)
 *
 * The left window from f1371 rebuilt, then TAKEN APART: the candles in one
 * window, the volume bars in another under it. Same tape, same domain, same
 * band — only the panes are separated, which is the point the voice is making
 * ("harga menunjukkan ke mana pasar bergerak… volume menunjukkan seberapa ramai
 * transaksi di balik pergerakan itu").
 *
 * ⚠ THE PAIR IS CENTRED AND THEN MOVED 150 LEFT, Simon's number, to open the
 * right-hand side for the two labels. The labels are placed against the windows
 * they name, not spaced by eye.
 *
 *   f4255  everything else is cleared
 *   f4371  "arah pasar"           beside the candles
 *   f4511  "keramaian transaksi"  beside the bars
 *   f4746  "selalu baca volume bersama harga", in the dashed box, under it all
 */
export const SPLIT = {
  at: 4253,
  gone: 4958,
  /** ⚠ 200 — 150, then another 50 at Simon's word. */
  shift: 200,
  w: 560,
  price: { y: 196, h: 360 },
  vol: { y: 576, h: 180 },
  pad: 30,
  /**
   * ⚠ EACH WINDOW ARRIVES WITH ITS OWN LABEL, not before it — Simon's revision.
   * The window and the words are one statement; showing the box first and
   * naming it later makes the viewer hold an unnamed thing in mind.
   */
  label: { x: 1150, size: 48, at: [4371, 4511], text: ["arah pasar", "keramaian transaksi"] },
  quote: { at: 4746, y: 796, h: 130, w: 900, text: "selalu baca volume bersama harga" },
} as const;

/**
 * ═══ THE SCENE TRANSITION ═══  (Simon's name for it, and his frames)
 *
 * The move the episode uses to change chapter, and it always does the same two
 * things: the scene that was on screen SHRINKS INTO the card that was already
 * selected, and the card to its RIGHT is then pushed forward as the preview of
 * what comes next.
 *
 * ⚠ IT LANDS IN CARD 1, NOT CARD 0. The board was last seen with "mengenal
 * volume" lit — that is the chapter just finished, so that is where this scene
 * belongs. Card 2, "cara baca volume", is the one that lights and grows.
 *
 * ⚠ IT OUTLIVES CG-B's OWN BLOCK. The scene being shrunk is SC06's, so the
 * group that draws SC06 has to still be mounted while it shrinks — see the
 * note beside CG-B in Composition.tsx for why it is also drawn last.
 */
export const TRANS = {
  at: 4958,
  over: 100,
  landing: 1,
  next: 2,
  /** The other three cards open one after another, behind the shrink. */
  cards: [5010, 5032, 5054],
  cardDur: 22,
  /** The camera closing on the next chapter's card. */
  push: { at: 5100, over: 44, amount: 0.55 },
  /**
   * ⚠ THE BOARD LEAVES BEFORE THE HAND-OVER, NOT ON IT. CG-C is already drawing
   * the same card, in the same place, underneath — so fading CG-B out over the
   * last frames removes only the grid, the other three cards, their labels and
   * the glow, and leaves the card standing. On f5149 there is then nothing left
   * to disappear, which is what makes the join invisible.
   */
  fade: { at: 5125, over: 24 },
  /**
   * ⚠ THE CARD DOES NOT BECOME THE PAGE — Simon's correction. CG-B simply stops
   * on f5149 and CG-C picks the same card up and grows it into the chart window
   * it keeps for the whole chapter. One object, handed between two groups,
   * rather than a shape that expands and is thrown away.
   */
  gone: 5149,
} as const;

/**
 * ═══ THE THIRD SCENE TRANSISI ═══  (Simon's frames, and it replaces CHAPTER 05)
 *
 * The same gesture as TRANS and TRANS2 with one beat added: the two product
 * windows shrink into the LAST card on the board, the whole board then leaves
 * upward and a card that was never on it rises from below — "Bonus Tips -
 * Common Mistakes" — and that card is pushed into the frame and faded off it.
 *
 * ⚠ IT REPLACES A CARD THAT WAS DOING NOTHING THIS ONE DOES. The CHAPTER 05
 * card dropped a contents list over a chart still being read; this hands the
 * chapter over. Simon: "yang aku screenshot, hapus".
 *
 * ═══ 90 FRAMES OF NEW TIME, 120 FRAMES OF TRANSITION ═══
 *
 * ⚠ AND THAT IS THE WHOLE REASON THE VO ONLY NEEDED 90 — "tambahkan 120 frames
 * di antara 16646-16647, tapi voice overnya hanya ditambahkan 90 frame". The
 * four beats that hold the screen alone are 30 + 15 + 30 + 15; the closing fade
 * runs OVER SC18, which by then has started. Padding the recording by 120 would
 * have put a second and a half of silence under a scene that is already
 * talking, and padding the visuals by 90 would have cut the fade in half.
 *
 * ⚠ THE PAD GOES IN THE GAP THE RECORDING ALREADY HAS, at 277.5s — between
 * "bisa menunjukkan panic selling." ending on f16644 and "Sebelum selesai,"
 * starting on f16662. Every cue and every beat from there on moves 90 frames
 * with it, which is why this edit touches BEAT and subtitles.ts as well.
 *
 * ⚠ 126, NOT 120, AND THE SIX ARE INVISIBLE. Simon cut SC17 six frames before
 * the old block boundary ("perpanjang scene 16599 hingga 16646"), so the fade —
 * which has to begin on SC18's first frame or it fades onto nothing — starts
 * six frames later than 120 would put it. They sit inside a hold.
 */
/**
 * ═══ SC18 · THE LIVE CANDLE ═══  (Simon's frames, 16891–17847)
 *
 * "Ganti semua visual, tapi keep background putihnya" — so the white panel
 * stays and everything that stood on it goes: the title, the two chips, the
 * colour key and the reading. What is left is one narrow card with ten bars in
 * it, and the last of them alternating for as long as the scene runs.
 *
 * ⚠ A THIRD OF THE SCREEN WIDE, AND THAT IS WHAT MAKES THE POINT LEGIBLE. Ten
 * bars across 528px of plot is a 36px candle; the same ten across the full card
 * would be 105px apart and read as a diagram rather than a chart. The panel got
 * narrower so the candles could get bigger.
 *
 * ⚠ THE LOOP IS A SINE, NOT A SWITCH. Simon: "satu saat di atas harga
 * sebelumnya (warna jadi hijau), satu saat di bawah (warna jadi merah), dan ini
 * berulang naik turun". A flip between two states would change colour on a
 * frame where the body is at full height, which reads as a glitch; a close that
 * travels through its own open crosses at ZERO body height, so the colour
 * changes on the one frame where there is nothing to see changing.
 *
 * ⚠ AND THE WICK DOES NOT MOVE WITH IT. High and low are a fixed envelope round
 * the oscillation, so what the viewer watches is one candle updating rather
 * than ten different candles taking turns.
 */
export const SC18_TICK = {
  at: 16891,
  /**
   * ⚠ THE PANEL MOVES LEFT 200 TO MAKE A COLUMN, not to be off-centre. The two
   * readings that arrive at 17015 and 17338 need a place to stand, and a
   * third-width panel in the middle of the frame leaves two narrow gutters
   * instead of one usable column.
   */
  shift: 200,
  /**
   * ⚠ THE PANEL AND THE COLUMN ARE ONE OBJECT NOW — Simon: "kelompokkan ini,
   * lalu geser lagi ke kiri 200 px". `shift` above moved the panel alone to
   * make room for the column; this moves the two of them together, so the gap
   * between them is fixed and any later nudge is one number rather than two
   * kept in step by hand.
   *
   * ⚠ AND THE HEADING IS NOT IN THE GROUP. It belongs to the margin, not to
   * this arrangement — Simon's crop of "ini" starts at the white panel.
   */
  group: 200,
  /**
   * ═══ THE TWO READINGS ═══  (Simon's frames)
   *
   * ⚠ ONE IS TYPED AND THE OTHER IS NOT, at Simon's direction — and the split
   * is the right way round. The first line is what the loop beside it has been
   * demonstrating for two seconds, so letters arriving one at a time reads as
   * the viewer's own conclusion being written down. The pair below it is a
   * misreading being named and struck out; that wants to be simply THERE.
   */
  /** ⚠ `between` IS 100 — Simon's number, measured from the bottom of the
   *  typed line to the top of the cross, not between the two blocks' boxes. */
  col: { x: 1160, y: 380, icon: 64, gap: 20, between: 100 },
  right: {
    at: 17015,
    /** ⚠ 2 FRAMES A LETTER, LINEAR. Eased typing speeds up and slows down,
     *  which is a machine, not a hand. */
    perChar: 2,
    size: 36,
    text: "Warna volume mengikuti candle",
  },
  /** ⚠ IT NAMES THE MISTAKE, NOT THE SUBJECT. "Warna volume bar" alone was the
   *  old heading and it announced a topic; the chapter this now belongs to is
   *  the bonus one, so the heading says which kind of thing is coming. */
  title: "Common Mistake: Warna Volume Bar",
  wrong: {
    at: 17338,
    over: 22,
    stagger: 8,
    size: 32,
    lines: ["Volume hijau = pembelian", "Volume merah = penjualan"],
  },
  /** Of the canvas. */
  cardWidth: 1 / 3,
  /** One full up-and-down, in frames. */
  period: 120,
  /** How far the close travels either side of its open, as a fraction of the
   *  tape's own range. */
  amp: 0.17,
  /** The wick's envelope, as a multiple of `amp`. */
  wick: 1.35,
} as const;

export const BONUS = {
  /**
   * ═══ TRANS2'S CADENCE, WITH ONE BEAT ADDED ═══  (Simon: "ikuti dari Scene
   * Transisi di 8245")
   *
   * Every duration and every hold below is the one that was approved at f8178,
   * carried across rather than re-invented:
   *
   *     shrink 44 · three cards at +8 / +20 / +32, 22 each · HOLD 30 ·
   *     [the added beat] · HOLD 30 · push 60 · HOLD 24 · fade 12
   *
   * ⚠ THE HOLDS ARE THE PART THAT MATTERS, and they are the two TRANS2 spells
   * out. Thirty frames before the camera moves, "so the roadmap can be read
   * before it is used"; twenty-four before the fade, because "the card is what
   * the chapter is being handed to — it has to be LOOKED at before it goes, and
   * a fade that starts on the frame the move ends reads as the card being taken
   * away rather than shown."
   *
   * ⚠ THE ADDED BEAT BORROWS THE SHRINK'S 44 AND THE PUSH'S HOLD. It is the
   * same KIND of event as the shrink — the picture changing hands — so it takes
   * the same duration, and it earns the same thirty frames of stillness after
   * it that TRANS2 gives the board.
   *
   * ⚠ THERE IS NO GLOW, and TRANS2 has one. Its glow lights the card the camera
   * is about to close on, which is the NEXT chapter, already on the board. Here
   * the thing being handed to is not on the board at all — that is the whole
   * point of it — so there is nothing to light until it has arrived, by which
   * time the move itself is the emphasis.
   */
  at: 16647,
  over: 44,
  landing: 3,
  /**
   * ⚠ THE BOARD IS ALREADY THERE — Simon: "kotak kotak yang lain, harusnya uda
   * ga perlu animasi muncul lagi, harusnya uda ada, dan visualnya yang dari
   * 8245". And he is right that this is not a detail. At f8178 the board was
   * being ASSEMBLED for the first time, so the cards opening one by one was the
   * event. By here the viewer has seen it twice; opening it a third time says
   * "here is a new thing" about the one object in the video that is meant to be
   * the same every time. It is simply standing there, complete, and the picture
   * shrinking onto it is the only thing that moves.
   *
   * ⚠ WHICH IS WHY THE HOLD IS STILL WORTH ITS 30 FRAMES. Nothing is arriving
   * in them any more — but the board is now the finished map of everything the
   * video has covered, and that is the thing being looked at.
   */
  /**
   * The cards leave upward and the bonus card rises into the middle.
   *
   * ⚠ THE GROUND DOES NOT GO WITH THEM — Simon: "background kotak-kotak nya
   * tetap stay". Only the cards travel. What that buys is a room the bonus card
   * arrives INTO rather than a second room that replaces the first, and it is
   * the difference between one continuous move and two cuts pretending to be
   * one.
   */
  rise: { at: 16731, over: 44 },
  /** ⚠ A BEAT OF ITS OWN, not the same curve as the fade. Growing and vanishing
   *  together read as one gesture; separated, the card arrives, is read, and
   *  only then hands over. */
  grow: { at: 16805, over: 60, amount: 0.55 },
  /**
   * ⚠ IT RUNS 220 FRAMES OVER SC18, WHICH NOW STARTS AT 16681 — Simon moved the
   * recording forward to 16690 and said the transition is the layer that wins:
   * "Scene juga boleh ikut, yang pasti Scene Transisi adalah prioritas".
   *
   * ⚠ AND THAT COSTS SOMETHING WORTH SAYING OUT LOUD. The schedule used to be
   * built backwards from "saat menggunakan volume. Pertama," so the card was
   * gone before SC18 had anything to show. At 28 frames of pad that line lands
   * on 16858, and the card is still up for another 43 frames — so SC18's first
   * point is spoken over the transition rather than under it. Shortening the
   * 60-frame push, or bringing the fade to 16846, is the fix if that reads
   * wrong on screen.
   */
  fade: { at: 16889, over: 12 },
  /**
   * ⚠ THE NAME GOES UNDER THE CARD, NOT INSIDE IT — Simon, with the roadmap's
   * own cards as the reference. Inside, it was a card whose entire content was
   * its title; under it, it is the fifth thing on a board where every other
   * card is a picture with its name beneath. The gap and the type come from
   * ROADMAP_CARD.label and theme.text.tag, so it is the same label, not one
   * that looks like it.
   *
   * ⚠ AND THE CARD NOW CARRIES A PICTURE: a histogram with a red cross over
   * it. Every other card on that board shows what its chapter looks like; this
   * one has to show what a mistake looks like.
   */
  card: {
    title: "Bonus Tips - Common Mistakes",
    /** ⚠ `warn`, WHICH IS THE ONE RED THIS PROJECT ALLOWS OUTSIDE A CANDLE —
     *  and only for naming a mistake, which is exactly what this is. */
    mark: { d: 108, stroke: 9, arm: 26 },
  },
} as const;

/**
 * ═══ THE SECOND SCENE TRANSISI ═══  (Simon's frame, f8178)
 *
 * The same gesture as TRANS, one chapter further along, and it REPLACES the
 * full-screen CHAPTER 03 card that used to land here. That card was a contents
 * list dropped over a chart that was still being read; this hands the chapter
 * over instead — the scene shrinks into the card it belongs to, and the next
 * chapter's card grows out of the board to take the frame.
 *
 * ⚠ IT IS DRAWN OVER SC11, which starts at f8214 and has no silence in front of
 * it. Everything here is therefore on a budget: 124 frames from first move to
 * clear, against the old card's 96. Lengthen it and you are covering narration.
 *
 * ⚠ landing 2 IS THE CHAPTER THAT JUST ENDED ("cara baca volume") and `next` 3
 * is the one starting ("cara pakai volume") — the rightmost card, which is why
 * the frame leaves through the right-hand box.
 */
export const TRANS2 = {
  at: 8178,
  over: 44,
  landing: 2,
  next: 3,
  /** The other three cards open one after another, behind the shrink. */
  cards: [8186, 8198, 8210],
  cardDur: 22,
  glow: { at: 8214, over: 26 },
  /**
   * The camera closing on the next chapter's card.
   *
   * ⚠ IT WAITS 30 FRAMES AFTER THE BOARD IS COMPLETE — Simon's number, 8226 to
   * 8256. The board arriving and the camera immediately leaving on it gave the
   * viewer no frame in which the four cards were simply THERE; the pause is
   * what lets the roadmap be read before it is used.
   */
  push: { at: 8256, over: 60, amount: 0.55 },
  /**
   * ⚠ IT LEAVES ON A FADE, NOT ON A SECOND MOVE — Simon's call. The card used
   * to keep opening until it was the frame; the gesture worked but the chapter
   * did not need two moves.
   *
   * ⚠ AND ANOTHER 24 FRAMES AFTER THE PUSH SETTLES — Simon's frame, 8340. The card
   * is what the chapter is being handed to; it has to be LOOKED at before it
   * goes, and a fade that starts on the frame the move ends reads as the card
   * being taken away rather than shown.
   *
   * ⚠ THE WHOLE HAND-OVER NOW COVERS SC11'S FIRST 138 FRAMES, and SC11 has no
   * silence in front of it. That is Simon's call, made twice; the cost is
   * written here so it is a decision rather than a surprise.
   */
  clear: { at: 8340, over: 12 },
  gone: 8352,
} as const;

/**
 * ═══ SC11 DRAWS THE TAPE AGAIN, FROM NOTHING ═══  (Simon's frames)
 *
 * ⚠ THE SAME TAPE AS SC01, REBUILT — not a second chart. CG-A has carried MAIN
 * since f0 and simply stopped drawing it between f1691 and here; coming back
 * with it already complete made SC11 open on a picture the viewer had last seen
 * six thousand frames ago. Building it again, slowly, is the scene saying "kita
 * kembali ke breakout tadi" with the picture instead of only with the words.
 *
 * ⚠ 226 FRAMES, WHICH IS SLOW ON PURPOSE — Simon's "jangan cepet cepet". SC01
 * built the same tape in 3.4 seconds; this takes 3.8 and has no other event in
 * it, so the candles arriving IS the scene for that stretch.
 */
export const SC11 = {
  build: { at: 8352, over: 226 },
  /**
   * ⚠ THE RESISTANCE ARRIVES AS AN AREA, WIPED LEFT TO RIGHT — Simon's frame
   * and his gesture. `Zone`'s `border` mode is exactly this: the fill grows by
   * WIDTH rather than by height, which is what makes it read as a level being
   * traced across the chart rather than a box fading up out of it.
   */
  zone: 8681,
  /**
   * ⚠ SC01'S TWO MOVES, RE-APPLIED — Simon's frame. SC01 pushes in at f345 and
   * its breakout candle creeps up 60 frames later at f405; the gap is carried
   * across rather than retyped, so the pair keeps the rhythm it was built with
   * even if SC01's own frames move.
   */
  zoom: { at: 8905, over: ZOOM.over },
  broke: { at: 8905 + (BREAK1.at - ZOOM.at), over: BREAK1.over },
  /**
   * ⚠ THE CARD GIVES UP 150px OF ITS OWN HEIGHT — Simon's number and frame.
   * The chart, its mask and the zoom all shorten with it; the room that opens
   * underneath is what the histogram then stands in, so the two numbers are the
   * same number and cannot drift apart.
   *
   * ⚠ AND THE VIEW PULLS BACK ON THE SAME CURVE. The push-in stays at 3x
   * HORIZONTALLY — that is what "sepertiga chart dari kanan" means — but the
   * price domain is widened by the same 3x, so the tape's whole height lands
   * back inside the box. Before this, 3x in both directions threw most of the
   * candles below the card and left a third of a chart with holes in it.
   *
   * `drop` is how far the histogram's window then runs PAST the card's original
   * bottom edge.
   */
  shrink: { at: 9240, over: 36, by: 150, gap: 22, drop: 96 },
  /**
   * ⚠ THE CARD ALSO NARROWS TO 65%, AND THE TAPE SHIFTS RATHER THAN SHRINKS —
   * Simon was explicit. Scaling it down would undo the pull-back that just
   * happened; the drawing keeps its size and slides left so its newest bar
   * stays inside the narrower frame, and the oldest bars leave off the left.
   */
  narrow: 0.65,
  /**
   * ═══ THE HAND-DRAWN ARROW ═══  (Simon's frame and his reference photo)
   *
   * A red marker stroke curving in from the right and pointing at the
   * resistance area, with the reason written under it. It is the only thing in
   * the episode that is meant to look like it was drawn ON the video rather
   * than rendered in it — see core/MarkerArrow.
   *
   * ⚠ IT LIVES ENTIRELY IN THE EMPTY RIGHT THIRD. At f9019 the push-in has
   * pulled the tape to the left of x≈1160 and everything right of that is bare
   * card; the arrow and its two lines are one callout standing in that room.
   *
   * ⚠ AND IT IS GONE BEFORE f9240. That frame narrows the card to 65% and the
   * column it is standing in BECOMES the reading column — the first kicker
   * lands there at f9293. Anything still drawn here would be under it.
   */
  mark: {
    at: 9019,
    over: 34,
    gone: 9228,
    out: 12,
    /** Where the pen lands, and where it stops. The tip sits just outside the
     *  zone's rounded right end so it points at it without covering it. */
    tail: { x: 1700, y: 590 },
    tip: { x: 1190, y: 634 },
    bow: -52,
    width: 17,
    headLen: 90,
    /**
     * ⚠ SIMON'S THREE OPERATIONS, IN HIS ORDER, AND ABOUT THE TIP. Half size,
     * mirrored top-to-bottom, then turned 60° to the left. The tip is the pivot
     * because it is the only part of an arrow that means anything — it must
     * still be pointing at the same place after all three.
     */
    scale: 0.5,
    flipY: true,
    rotate: -60,
    text: {
      at: 9088,
      x: 1200,
      /** ⚠ 20px ABOVE THE ARROW, AND `y` IS DERIVED FROM THAT — Simon's number.
       *  Where the arrow's top edge falls depends on the bow, the turn, the
       *  head and the stroke width together, so it is measured by `markerGeom`
       *  in the scene rather than typed here and left to rot. */
      gap: 20,
      /**
       * ⚠ THE 20 IS INK TO INK, NOT BOX TO BOX. A 42px line inside a 56px line
       * box carries 14px of empty descent under its last letter, so a 20px gap
       * measured off the BOX renders as 34px of visible air — which is what
       * anyone looking at the frame would measure. Pulled back by the measured
       * descent so the gap on screen is the gap Simon asked for.
       *
       * ⚠ MEASURED AT size 42 / lead 56. Change either and re-measure: it is
       * the font's own descent, not a fraction anyone can derive.
       */
      descent: 14,
      size: 42,
      lead: 56,
      lines: ["Biar bisa tembus resistance,", "minat beli harus kuat"],
    },
  },
  /**
   * ═══ THE CAMERA NEVER STOPS ═══  (from the reference folder, 2026-09-07)
   *
   * Every chart clip Simon put in `VIDEO 21 - Volume/Video Reference` has TWO
   * layers running at different speeds: a slow one that never arrives and never
   * leaves, and a fast one that is the beat. Between f9240 and f10470 this
   * scene had only the fast one — four text beats with three long holds between
   * them, and in those holds not a single pixel moved.
   *
   * ⚠ THE DRIFT IS LINEAR AND UNCLAMPED, AND THAT IS THE WHOLE POINT.
   * `progress` would ease it, and an eased drift reads as a move that is about
   * to finish — which puts the dead frame back, just later. The references
   * drift at CONSTANT velocity because their camera never starts or stops on
   * screen. `over` is the stretch the numbers below are QUOTED over, not a
   * stop: past f10471 the same rate simply carries on under the split.
   *
   * ⚠ IT MOVES THE COLUMN, NOT THE WORDS. The drift rides the same wrapper the
   * pick-lift uses, so the card, the tape, the histogram and the cyan band
   * travel as one thing and cannot fall out of register. The reading beside the
   * chart and the note under it are outside it: type that creeps reads as a
   * bug, and the references never move it either.
   */
  cam: {
    over: 1231,
    /**
     * ⚠ IT PULLS BACK, IT DOES NOT PUSH IN — and that is geometry, not taste.
     * The card already stands ON the 96px left margin, so ANY push-in grows it
     * straight through the margin: at two per cent its left edge lands at 84,
     * and at the split the right column's edge lands past 1824. Receding keeps
     * every edge inside the stage at every frame of the stretch, and a picture
     * that slowly settles away under a heading that holds is the same move the
     * references make anyway.
     *
     * Under a pixel a frame, in both terms.
     */
    zoom: -0.018,
    x: 5,
    y: -10,
    /** ⚠ THE GROUND GOES THE OTHER WAY, AND FURTHER. Two layers at the same
     *  speed are one layer; the parallax IS the depth. */
    bloom: { x: 78, y: 48 },
    /**
     * ⚠ THE HISTOGRAM ARRIVES BAR BY BAR, LEFT TO RIGHT — and only once the
     * pull-back has settled. During the shrink the view is still widening, so
     * bars are still coming into existence; starting the stagger inside it
     * would drop a late bar in at full height, which is the pop it exists to
     * avoid. `at` is measured from `shrink.at`, so the two cannot drift apart.
     */
    bars: { at: 36, spread: 26, over: 16 },
  },
  /**
   * ═══ THE READING BESIDE THE CHART ═══  (Simon's frames)
   *
   * ⚠ EACH GROUP IS LAID OUT WHOLE FROM ITS FIRST FRAME, kicker and body
   * together, even though the body lands later. Centring only what has arrived
   * would shove the kicker upward the moment the body appeared, and the two are
   * one statement.
   *
   * ⚠ 50px BETWEEN KICKER AND BODY — Simon's number, and it holds for the
   * breakdown groups later in the episode too.
   */
  note: {
    gap: 50,
    /**
     * ⚠ THE KICKER IS THE SAME SIZE AS THE BODY, AND BLACK — Simon's call. The
     * two lines are not a label and its heading; they are one statement in two
     * parts, and shrinking the first made it read as a caption for the second.
     * The colour is what separates them now: black states the case, indigo says
     * what to conclude from it.
     *
     * ⚠ THAT MAKES THE LONGEST LINE "Breakout dengan volume tinggi" at 52px,
     * about 730px, against roughly 605px of room beside a 65%-wide card. The
     * kicker therefore WRAPS where the body does not — see `kickWidth`.
     */
    kickSize: 52,
    /**
     * ⚠ THE READING IS SET FLUSH LEFT — Simon's call, all three groups. Centred
     * it had two ragged edges and neither line started where the eye was; one
     * hard left edge is what makes two lines read as one statement.
     *
     * ⚠ WHICH IS WHY THERE IS A `pad`. Centred, the block floated in the middle
     * of the gutter and the 22px either side came for free; flush left it would
     * stand ON the card's right edge. `pad` + `width` are budgeted against the
     * 605px of gutter beside a 65%-wide card and must stay inside it — at 44 and
     * 560 the column ends at 1823, one pixel inside the right margin.
     */
    pad: 44,
    /** ⚠ TIGHTER THAN `gap`. That one separates the two halves of a single
     *  statement; these are three peers in a list and want to read as a group. */
    itemGap: 26,
    /**
     * ⚠ SMALLER THAN `size`, AND IT IS MEASURED, NOT CHOSEN. At the group's own
     * 52px the longest point — "Tunggu sinyal tambahan" — renders 601px wide
     * against 563px of column, so it wrapped and the third point stood two
     * lines tall while its peers stood one. 48 is the largest that fits; 46
     * leaves 31px of air, which is what a list of three needs to still read as
     * one block. Every item is `nowrap` so a future edit fails visibly rather
     * than silently re-breaking a line.
     */
    itemSize: 44,
    /**
     * ⚠ A SQUARE TURNED 45° — Simon's shape. Its box is the DIAGONAL, not the
     * side: a 14px square standing on its corner is 19.8 wide, so the marker
     * sits in a 20px well of its own and the text starts clear of it whatever
     * the square does.
     *
     * ⚠ AND THE INDENT IS WHY `itemSize` DROPPED FROM 46 TO 44. The well plus
     * its gap take 42px off the column, and at 46 the longest point ran 13px
     * past the right margin.
     */
    bullet: { size: 14, well: 20, gap: 22 },
    /** The column the reading is set in, beside a 65%-wide card. */
    width: 560,
    size: 52,
    lead: 70,
    out: 12,
    groups: [
      {
        gone: 9604,
        kick: { at: 9293, text: "Breakout dengan volume tinggi" },
        body: { at: 9432, lines: ["Konfirmasi breakout", "meyakinkan"] },
      },
      {
        gone: 10183,
        kick: { at: 9698, text: "Breakout dengan volume rendah" },
        body: { at: 9908, lines: ["belum tentu gagal"] },
      },
      {
        /* ⚠ IT LEAVES WHEN THE COLUMN SPLITS — the duplicated layout carries
           no text at all. */
        gone: 10471,
        /**
         * ⚠ THREE POINTS, ONE AT A TIME — Simon's frames, and "Saran:" goes
         * with them. Three options arriving in turn ARE the advice; a word in
         * front announcing that they are advice says it twice, and it was the
         * only thing forcing the block to wrap.
         *
         * ⚠ AND IT STAYS INDIGO. The black is for the lines that STATE what
         * happened; these are what to do about it, which is what indigo means
         * everywhere else in the episode.
         */
        items: [
          { at: 10261, text: "Wait and see" },
          { at: 10290, text: "Tunggu retest" },
          { at: 10338, text: "Tunggu sinyal tambahan" },
        ],
      },
    ],
  },
  /** ⚠ IT WIPES TOP TO BOTTOM, and finishes 20px BELOW the histogram's window
   *  — Simon's number. Stopping level with the window would make the band read
   *  as part of it; overshooting says the band is over both panes. */
  /**
   * ⚠ IT LEAVES BEFORE THE TAPE TURNS AND COMES BACK AFTER — Simon's frames.
   * Going out it wipes BOTTOM TO TOP, the reverse of how it arrived; a band
   * that stayed put while the candles underneath it changed identity would be
   * pointing at bars that are no longer the ones it was pointing at.
   */
  hl: { at: 9390, over: 20, bars: 7, past: 20, rule: 3, back: 10672 },
  /**
   * ═══ THE TWO COLUMNS ARE READ ONE AT A TIME ═══  (Simon's frames)
   *
   * ⚠ THE BAND IS WHAT SELECTS, AND THE COLUMN SAYS SO. When a column's band
   * wipes in, that column lifts 10% and takes a glow; the other one stays where
   * it is. Two lit columns would be two things being pointed at, which is the
   * one thing a comparison cannot afford.
   */
  picks: [
    { band: 10672, note: { at: 10748, text: "Tekanan jual, serius" } },
    { band: 10880, note: { at: 11068, text: "Tetap waspada" } },
  ],
  pick: { grow: 0.1, noteSize: 44, noteGap: 56 },
  /** The second reading: no burst, and 15% quieter throughout. */
  weak: { at: 9603, over: 30 },
  /**
   * ⚠ THE COLUMN DUPLICATES — Simon's frame. What was SC14's own scene is now
   * this one carrying on: the single column narrows from 65% of the card to
   * half of it, and a second copy arrives in the room it gives up. Both sides
   * are identical and carry no text; the difference between them comes later.
   */
  split: {
    at: 10471, over: 42, gap: 60, lag: 16,
    /** ⚠ THE PAIR IS 150 SHORTER, TOP ANCHORED — the same operation as the
     *  first shrink: the price panel gives up the height and the histogram's
     *  window comes up with it, so the tops stay put and only the bottom rises. */
    raise: 150,
    /**
     * ⚠ AND THE WHOLE PAIR SITS 30px LOWER — Simon's number, and it applies to
     * THIS state only. `raise` takes 150 off the group's height with the top
     * anchored, which leaves it hanging high with a band of empty paper under
     * it; 30 down puts it back in the middle of the room it has.
     *
     * ⚠ IT CANNOT BE APPLIED TO THE WHOLE OF SC11. Before the split the group
     * is 150 taller and its histogram already ends level with the subtitle
     * band at y=972 — 30 more would put the pane, and the cyan band's 20px
     * overshoot, inside the band the subtitles own. So it rides `splitT`: zero
     * on the frame the columns divide, and fully down once they have.
     *
     * The title, the logo and the subtitles are outside the pair and do not
     * move — Simon was explicit.
     */
    down: 30,
    /** The two readings, one per column. */
    labels: ["Breakdown, volume besar", "Breakdown, volume rendah"],
    labelSize: 34,
  },
} as const;

export const RAIL = {
  at: 2706,
  gone: 3067,
  /** The two columns everything sits on. */
  col: { a: 640, b: 1280 },
  /** p2 and p3, at the same size; ratio is the files' own 923:558. */
  clip: { w: 700, h: 423 },
  /**
   * ⚠ THE WINDOW'S WIDTH IS NOT TYPED — it is derived from the bars, in the
   * scene, so the 10px gap Simon asked for cannot be broken by nudging the box.
   * Only its height is a free number.
   */
  win: { h: 440, pad: 46 },
  /** Centre-y, shared by all three. */
  midY: 561,
  cam: { at: 2881, over: 40 },
  /**
   * The three bars. The first two are barely there; the third arrives slowly
   * across the whole of p2's stretch, then keeps growing across p3's.
   *
   * ⚠ IT GROWS FROM ITS BASELINE, which is what "wipe in" has to mean for a
   * bar: the thing being said about it is its HEIGHT, and a left-to-right
   * reveal of a single bar would say nothing about that.
   */
  bars: {
    /** Bar width and the gap between two of them, in canvas pixels. */
    w: 56,
    gap: 10,
    short: [0.1, 0.13],
    /** ⚠ TALLER IN BOTH PHASES — Simon's call. Was 0.24 and 0.62. */
    mid: 0.42,
    tall: 0.9,
    grow1: { at: 2706, over: 174 },
    grow2: { at: 2881, over: 185 },
  },
  /** p3 runs twice inside the pan's stretch — 233 source frames each. */
  loop: { at: 2881, gone: 3067, times: 2, src: 233 },
} as const;

/**
 * ═══ TWO STOCKS, SIDE BY SIDE ═══  (Simon's frame)
 *
 * ULTJ on the left, JELI on the right, each as its own header strip over its
 * own chart. This is the picture the narration is asking for — "10 juta lembar
 * bisa sangat besar untuk satu saham, tapi biasa saja untuk saham lain" — and
 * it REPLACES the single BBCA screen that stood here, which could only show
 * one stock and so could not make that comparison at all.
 *
 * ⚠ THE COLUMN WIDTH IS WHAT THE HEIGHT ALLOWS, not a chosen number. Header and
 * chart carry their files' own ratios (5.76:1 and 0.946:1), and with the 40px
 * Simon asked for between them a 600px column stands 778 tall — inside the 822
 * between the logo zone and the caption band, with the pair centred in it.
 */
export const PAIR_SHOTS = {
  at: 3411,
  gone: 4253,
  /** ⚠ 480 — 20% off the 600 it was built at, Simon's second number. */
  w: 480,
  gap: 40,
  /** Between the two columns. */
  between: 80,
  cols: [
    { head: "art/a03.png", chart: "art/a04.png" },
    { head: "art/a05.png", chart: "art/a06.png" },
  ],
  /** Each file's own ratio, so the boxes are derived rather than typed. */
  ratio: { head: 5.76, chart: 0.946 },
  /**
   * ═══ THE MARKED CANDLE, AND ITS READOUT ═══
   *
   * Each chart carries a dashed vertical marker over one candle; this bands
   * that candle from just under the SMA20 line down to the VOL tab, which is
   * the stretch Simon pointed at.
   *
   * ⚠ EVERY NUMBER IS A FRACTION MEASURED OFF THE FILES, not placed by eye. The
   * marker was found by colour-keying its blue-grey and taking the column it
   * fills; the top and bottom are the text bands either side of the plot, found
   * by scanning for rows of dark ink. So the band lands on the candle whatever
   * size the screenshot is drawn at.
   *
   * ⚠ HALF-WIDTH IS ONE CANDLE PLUS AIR. The median candle in these charts is
   * 15-23px of 1200; 26 brackets it without swallowing its neighbours.
   */
  hl: {
    x: [0.5992, 0.5942],
    half: 0.0217,
    y1: 0.1499,
    y2: 0.9685,
    /** ULTJ first, then JELI — Simon's frames. */
    at: [3601, 3774],
  },
  /**
   * The readout that comes with each.
   *
   * ⚠ IT OVERLAPS ITS CHART BY HALF ITS OWN WIDTH — Simon's number. Sitting
   * clear in the margin made it a caption standing next to a picture; hanging
   * half over the chart makes it a label ON it, which is what it is.
   */
  callout: [
    { art: "art/a09.png", ratio: 2.857 },
    { art: "art/a10.png", ratio: 2.8 },
  ],
  calloutW: 340,
} as const;

/**
 * The stand-in shape, so the pop-in can be judged on something before it goes
 * on the real footage.
 *
 * ⚠ 17 FRAMES, NOT 26 — Simon asked for it 50% faster, so the duration is
 * divided by 1.5 rather than reduced by half. `from` is where it starts: 30% of
 * size, growing to 100% and a tenth past on the way.
 */
export const NOTE_POP = { at: 2470, over: 17, r: 120, from: 0.3 } as const;

/**
 * ═══ THE THREE PHASE CLIPS ═══  (Simon's frames)
 *
 * Each one pops in on the frame its window opens, using the move settled on the
 * placeholder circle: 30% of size to 100%, a tenth past on the way, over 17
 * frames.
 *
 * ⚠ EVERY CLIP FREEZES ON ITS LAST FRAME — Simon's instruction — rather than
 * vanishing when it runs out. `src` is each clip's own length IN THIS
 * COMPOSITION'S FRAMES (its 8fps frames × 7.5), which is what tells the scene
 * where playing stops and holding begins.
 *
 * That also settles the mismatch between clip and window: p2 is 120 frames in a
 * 175-frame window and used to leave 55 frames of empty stage; now it holds its
 * last drawing there instead. p3 is 233 in 186 and is still cut short.
 *
 * ⚠ THEY ARE 8fps FILES in a 60fps composition. Every source frame therefore
 * holds for seven and a half frames — that stepping is in the files, not in the
 * playback.
 *
 * ⚠ 923x558, NOT 16:9. The re-exports Simon sent are 1.657:1, so the frame they
 * sit in is derived from that rather than from a shape they do not have.
 *
 * ⚠ THE SOURCE IS p1-p3.png — Animated PNG out of Procreate, with a REAL alpha
 * channel. Two earlier attempts had none: .mp4 (H.264) and .mov (HEVC Main)
 * both flattened the transparency to solid black on the way out, and because
 * the drawings contain black INK as well, no key could separate the two — it
 * was tried, by connectivity and by stroke thickness, and both failed.
 *
 * The copies under public/art are the same frames re-encoded as VP9 with an
 * alpha plane, which is what a browser composites. Nothing is keyed and nothing
 * is guessed; the alpha comes straight from the file.
 */
export const FASE = [
  /* ⚠ p1 IS NOT DRAWN FROM HERE — see FIELD. It keeps its row so the window
     boundaries stay in one table, but its picture is the field of copies. */
  { at: 2461, gone: 2706, art: "art/p1.webm", src: 300 },
  { at: 2706, gone: 2881, art: "art/p2.webm", src: 120 },
  { at: 2881, gone: 3067, art: "art/p3.webm", src: 233 },
] as const;

/** The clips' own pixels, so the frame they sit in is measured, not typed. */
export const FASE_IMG = { w: 923, h: 558 } as const;
/**
 * The white halo behind each clip — Simon's call, so the drawings sit on
 * something rather than floating on the grid.
 *
 * ⚠ IT IS LARGER THAN THE TILE ON PURPOSE, and the tile therefore cannot clip
 * it: a feathered edge cut off by a rectangle is just a rectangle. `scale` is
 * against the longer side of the tile.
 */
export const HALO = { scale: 1.22 } as const;
/**
 * ⚠ SIZED FOR THE POP'S PEAK, NOT ITS RESTING STATE. The clip is drawn at 110%
 * on the way in, and at the resting size that put its top edge inside the
 * 360x150 the logo owns. The room here runs from the bottom of that zone to the
 * top of the caption band; the height is what fits inside it AT 110%, and the
 * box is centred in that room so the overshoot has the same air above as below.
 */
export const FASE_BOX = { h: 730 } as const;

/**
 * ═══ THE FIELD OF p1 ═══  (Simon's frames and layout)
 *
 * One clip at rest in the middle, and ten copies of it racing around the edges.
 *
 * ⚠ THE MIDDLE ONE IS SPED UP TO LAND ON f2685, not cut off there. p1 runs 40
 * frames at 8fps — 300 frames of this composition — and the window Simon wants
 * it finished in is 224, so it plays at 300/224. Trimming instead would stop
 * the drawing mid-gesture, which is the one thing a looping field makes obvious.
 *
 * ⚠ ONE START AND ONE SPEED FOR ALL THREE — Simon's call after seeing them
 * staggered and racing: `step: 0`, and `rate` is derived from the middle one's
 * own window rather than set per copy, so "the same speed" cannot drift apart
 * later. Three drawings doing the same thing at the same moment read as one
 * picture; twelve arriving at twelve speeds split the attention.
 *
 * ⚠ EVERY ONE OF THEM HOLDS ITS LAST DRAWING TO THE END OF THE WINDOW, f2705 —
 * Simon's frame. `main.done` is only where the middle one stops PLAYING; it is
 * not where anything leaves. The whole field stands until p2 replaces it on
 * f2706, so there is no gap and nothing thins out on its own.
 *
 * ⚠ THE SPOTS ARE PROVEN NOT TO TOUCH, here and in the assertion below: no two
 * rectangles intersect, none enters the 360x150 logo zone or the caption band,
 * and none crosses the side margins.
 */
export const FIELD = {
  at: 2461,
  /** p1's own length, in this composition's frames: 40 at 8fps. */
  srcFrames: 300,
  /**
   * ⚠ ALL THREE ARE THE SAME SIZE NOW — Simon's call. The middle one used to be
   * 604x365 and the flanks 330x200, which read as one picture with two
   * thumbnails beside it rather than as three of the same thing.
   *
   * 548x331 is the largest tile that puts three in a row inside the active area
   * with a 12px gap, and the ratio is the file's own 923:558.
   */
  main: { done: 2685, w: 548, h: 331, x: 686, y: 396 },
  copy: { step: 0, w: 548, h: 331 },
  /** ⚠ 12px APART, pulled in three times now — from 218, then 60, then 24. */
  spots: [
    { x: 126, y: 396 }, { x: 1246, y: 396 },
  ],
} as const;

export const TF_PICK = { over: 24, up: 1.1, dim: 0.7, lead: 18, step: 4 } as const;
