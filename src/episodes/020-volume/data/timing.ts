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
 * ⚠ A PRODUCTION NOTE ON THE FRAME, NOT SCENE DESIGN. SC03 is blank while it
 * waits to be directed, and this marks what belongs there. It is meant to be
 * deleted, so it lives in the frame table with the rest of the temporary
 * scaffolding rather than as a number buried in a scene.
 */
export const NOTE = { from: 1515, to: 1970, text: "Note: Running Trade" } as const;

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
export const TF_PICK = { over: 24, up: 1.1, dim: 0.7, lead: 18, step: 4 } as const;
