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
  SC15A: 11261, SC15B: 13026,
  SC16: 14509, SC17: 15415, SC18: 16653, SC19: 17820, SC20: 18764,
  END: 19652,
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
export const CARDS = {
  roadmap: { at: 1410, over: 100 },
  ch02: { at: 4906, over: 96 },
  ch03: { at: 8178, over: 96 },
  practice: { at: 11206, over: 110 },
  ch04: { at: 14458, over: 102 },
  ch05: { at: 16608, over: 90 },
  recap: { at: 18720, over: 88 },
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
export const COMBOS_VERSION: 1 | 2 | 3 = 2;

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
    ["Harga naik ", "Volume naik"],
    ["Harga naik ", "Volume turun"],
    ["Harga turun ", "Volume naik"],
    ["Harga turun ", "Volume turun"],
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
    x: 128, y: 226, w: 300, h: 104, gap: 16, radius: 22,
    size: 30, lead: 40, move: 22, stepIn: 8, pad: 20, dotSize: 16, dotGap: 16,
  },
  /**
   * ⚠ FOUR COLOURS, ALL OF THEM BETWEEN INDIGO AND CYAN. The brand contract
   * locks decorative hues to the two anchors (247 and 192) — four unrelated
   * hues would read as a different product. Walking the ramp between them gives
   * four that are plainly distinguishable without leaving the family.
   */
  dots: ["#5F4DEE", "#4F7BF0", "#45A6DC", "#5CC8E3"],
  win: { x: 460, y: 226, w: 1324, h: 452 },
  box: { x: 460, y: 716, w: 1324, h: 176 },
  /** ⚠ THE BOARD IS DERIVED, NOT TYPED — it is the union of the three above,
   *  grown by `pad`. Nudge any of them and the board follows; a hardcoded rect
   *  would quietly stop hugging its contents. */
  pad: 15,
  /** A stamped shadow, not a floating one. */
  shadow: { x: 12, y: 12 },
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
  misread: 16830, barColour: 16998, followsCandle: 17178,
  onlyBuying: 17322, buyerAndSeller: 17754,
  limits: 17836, alreadyHappened: 18060, notCertainty: 18124,
  trend: 18414, levels: 18456, pattern: 18536, market: 18606,
  direction: 18840, behindIt: 19028, notAGuess: 19128,
  convincing3: 19410, watchOut: 19544,
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
