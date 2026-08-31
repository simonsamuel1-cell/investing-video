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
  SC01: 0, SC02: 809, SC03: 1460, SC04: 2388, SC05: 3339, SC06: 4200,
  SC07: 4894, SC08: 5891, SC09: 6798, SC10: 7473,
  SC11: 8154, SC12: 8851, SC13: 9541, SC14: 10411,
  SC15A: 11201, SC15B: 12966,
  SC16: 14449, SC17: 15355, SC18: 16593, SC19: 17760, SC20: 18704,
  END: 19592,
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
  ch02: { at: 4846, over: 96 },
  ch03: { at: 8118, over: 96 },
  practice: { at: 11146, over: 110 },
  ch04: { at: 14398, over: 102 },
  ch05: { at: 16548, over: 90 },
  recap: { at: 18660, over: 88 },
} as const;

/**
 * ⚠ THE TWO HARD CUTS, both mid-word, both without a transition of any kind.
 * The narration runs straight through them: f6798 falls between "posisi." and
 * "Ketiga,", f8154 between "sudah datang." and "Nah,". A wipe on a word is a
 * wipe the viewer reads as a mistake.
 */
export const HARD_CUT = [6798, 8154] as const;

/**
 * BEAT ANCHORS — the frame a phrase is spoken on, GLOBAL, from the sync
 * document. A scene converts with `local()`. These are the only timing a scene
 * may key off; a beat invented to make a picture feel right is a beat that
 * will drift away from the voice.
 */
export const BEAT = {
  resistance: 210, breakout: 372, valid: 556, buy: 748,
  notYet: 822, volumeWord: 1114, twoBreakouts: 1206, different: 1330,
  whatIsVolume: 1530, onePeriod: 1836, daily: 1908, fiveMin: 2178,
  notPeople: 2484, bigPlayers: 2694, handToHand: 2838, notHowMany: 3216,
  alone: 3450, tenMillion: 3548, normalElsewhere: 3724, average: 4110,
  priceWhere: 4314, volumeHow: 4458, together: 4692,
  fourCombos: 5202, first: 5394, convincing: 5664,
  second: 5902, notASellSignal: 6248, weakening: 6450, careful: 6612,
  third: 6798, volumeGrows: 6930, sellingSerious: 7218,
  fourth: 7482, easing: 7734, notBuyers: 8058,
  confirm: 8448, backToBreakout: 8532, heldItDown: 8784,
  absorb: 9042, muchHigher: 9246, convincing2: 9378,
  ordinaryVolume: 9732, notFailed: 9852, weaker: 9972, retest: 10230,
  breakdownToo: 10422, bigVolume: 10644, thinVolume: 10914, notCertain: 11136,
  brpt: 11500, monthLow: 11656, lastTwoDays: 11804, atBreakdown: 11946,
  lessThanSpikes: 12070, rebound: 12292, question: 12528,
  three: 12770, two: 12872, one: 12912,
  upTo: 13116, twoCandles: 13290, reboundBigger: 13698,
  losingConfirmation: 13890, noGuarantee: 14136,
  trendHealth: 14720, healthyUptrend: 14832, strongerVolume: 14984,
  pullback: 15102, lighterVolume: 15246,
  context: 15546, spike: 15666, thanUsual: 15990, nearBreakout: 16044,
  afterRally: 16244, sharpDrop: 16416,
  misread: 16770, barColour: 16938, followsCandle: 17118,
  onlyBuying: 17262, buyerAndSeller: 17694,
  limits: 17776, alreadyHappened: 18000, notCertainty: 18064,
  trend: 18354, levels: 18396, pattern: 18476, market: 18546,
  direction: 18780, behindIt: 18968, notAGuess: 19068,
  convincing3: 19350, watchOut: 19484,
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
