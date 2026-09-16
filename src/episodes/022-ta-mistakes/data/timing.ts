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
  SC06: 4047,
  /**
   * ⚠ 5046, AND IT MOVED WITH THE SILENCE — Simon put 30 frames of hold in at
   * 5035. This file's rule is that a boundary is cut at the MIDPOINT of the
   * silence between two scenes: that gap was 5022 → 5040 and is now 5022 →
   * 5070, so its middle went from 5031 to 5046. The pause is therefore held on
   * the platform rather than on SC07's empty opening.
   */
  SC07: 5046,
  SC08: 5984, SC09: 7064, SC10: 7995, SC11: 8998,
  SC12: 10035, SC13: 11074,
  SC14: 12346, SC15: 13070, SC16: 13700, SC17: 14780, SC18: 15754,
  /**
   * ⚠ 120 FRAMES PAST THE LAST WORD NOW, NOT 180. It was three seconds: the
   * voice ended on 16650 and the closing quote card was still standing there,
   * because ending on that frame cuts the last sentence off at the moment it
   * lands. The two pads at 8060 and 8200 moved the last word to 16710 and END
   * was left alone, so the hold is two seconds. That still does the job and the
   * audio still fits — it runs out at 16776 — but it is a number that has
   * shrunk by side effect rather than by decision, and the next voice-only pad
   * takes another 30 off it.
   */
  END: 16830,
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
  ch03: { at: 5938, over: 92 },
  /** ⚠ THE LONGEST ONE, 122 f — this join has 0.83 s of air, the most in the
   *  whole recording. It is the only card that is not fighting for room. */
  ch04: { at: 9974, over: 122 },
  ch05: { at: 12292, over: 108 },
  recap: { at: 15706, over: 96 },
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
/** Hoisted so `gaps` can name it — a gap that runs to the end of the counter's
 *  life should say so rather than repeat the frame. */
const COUNTER_TO = BLOCK.SC15;

export const COUNTER = {
  from: BLOCK.SC04,
  to: COUNTER_TO,
  /**
   * Stretches the counter is OUT for.
   *
   * ⚠ SC12→SC14 is the ADMR case study: a worked example is not another entry
   * in the list, and leaving the counter up there files it as "mistake 07½".
   *
   * ⚠ SC06→SC10 is Simon's, in four steps: the counter came off the platform
   * ("hapus tulisan Mistake 02 dan OVERTRADING"), then off SC07 with the rest
   * of that scene ("judulnya juga hapus"), then off SC08 ("hapus semua visual
   * scene 8 termasuk text") and now off SC09 the same way. All four are one —
   * nothing there is a named mistake any more, so a counter over them would be
   * labelling something that is not being said. The counter is not drawn BY
   * those scenes, which is exactly why it has to be taken off here: deleting a
   * scene does not remove an overlay that outlives it.
   *
   * ⚠ THE CONSEQUENCE, ON THE RECORD, AND IT KEEPS GROWING: entries 02, 03, 04
   * and 05 never appear on the counter. Their windows are exactly this gap, so
   * it now reads 01, then 06 07 08 — four of the eight. The CARDS name all
   * eight, so the list itself is whole; it is the running tally that has holes,
   * and every one arrived as a side effect of deleting a scene rather than as a
   * decision about the tally. ⚠ SC08's stretch is NOT empty any more — the two
   * windows fill it — and its counter entry has still not come back, which is
   * the precedent this one follows. Whatever fills 4282–7994 can carry all four
   * again.
   */
  /**
   * ⚠ ONE GAP NOW, AND IT RUNS TO THE END OF THE COUNTER'S OWN LIFE — Simon:
   * "hapus semua visual dari scene 10 ke belakang". This chip is an overlay
   * that outlives the scenes it labels, so blanking them does not remove it;
   * it has to be taken off, and this is the fifth time for the same reason. A
   * counter reading "06 INDICATOR OVERLOAD" over an empty screen is naming
   * something that is not being said.
   *
   * ⚠ WHICH LEAVES IT WITH NOTHING TO DRAW AT ALL, and that is worth saying
   * plainly rather than discovering later. Its only live stretch is now
   * 1995→4047, entry 01 — and the card list is mounted above it across
   * 1994→4282, so the one entry left is underneath an opaque layer for every
   * frame of it. The chip is in the episode and is never seen. CG-E is still
   * mounted because that is one line to undo; what would bring it back is a
   * scene under it, not a change here.
   *
   * ⚠ AND THE ADMR GAP IS GONE because this one swallows it, not because the
   * case study stopped being a case study. If SC12–SC13 come back, so does
   * `{ from: BLOCK.SC12, to: BLOCK.SC14 }`.
   */
  gaps: [{ from: BLOCK.SC06, to: COUNTER_TO }],
  over: 18,
  items: [
    { n: "01", label: "TANPA INVALIDATION", at: BLOCK.SC04 },
    { n: "02", label: "OVERTRADING", at: BLOCK.SC06 },
    { n: "03", label: "REVENGE TRADING", at: BLOCK.SC07 },
    { n: "04", label: "CONFIRMATION BIAS", at: BLOCK.SC08 },
    { n: "05", label: "ABAI KONTEKS MARKET", at: BLOCK.SC09 },
    { n: "06", label: "INDICATOR OVERLOAD", at: BLOCK.SC10 },
    /** ⚠ THESE SIX ARE BACK ON THEIR BLOCK BOUNDARIES. 06 and 07 had been moved
     *  to 8270 and 9050 to follow SC10's picture, which no longer exists; a
     *  number tuned to a deleted picture is worse than the plain boundary,
     *  because it looks deliberate. Whatever fills these stretches moves them
     *  again — and 07 must move with anything held past 8998, which is what
     *  caught the chip reading "07 HINDSIGHT BIAS" over SC10's panes. */
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
   *  chart coming back over the top of them is what made that obvious.
   *
   *  ⚠ WHAT REPLACES THEM IS ONE DASHED BOX over the chart, and it lands on
   *  f1541 because that is the frame the old left-hand sentence used: the cue
   *  it belongs to runs 1460–1806, so the box is stamped while the sentence is
   *  being said rather than after it. */
  note: 1541,
  /** ⚠ TYPED, LIKE SC02'S ANSWER — two frames a letter, so both lines are down
   *  well before the cue they belong to ends on 1806. */
  notePerChar: 2,
} as const;

/**
 * ═══ SCENE TRANSISI · THE CARD LIST ═══  (Simon's f1994, his reference clip)
 *
 * Six cards in a row, a pointer that hovers one of them, and the hovered card
 * floods with colour — `VIDEO 22 - TA Mistakes/card list.mp4`.
 *
 * ⚠ THE TIMING HERE IS A PROPOSAL, NOT A LOCK. Simon: "coba kamu atur dulu tapi
 * jangan terpaku pada subtitle … aku hanya mau tau di detik berapa aku bisa
 * menambahkan durasi voice over". So the scene is written as a length rather
 * than as a set of VO-locked beats: it opens on 1994 (00:33.233) and wants
 * `over` frames. Whatever he adds to the recording at that timecode, only
 * `over` changes and the beats inside scale with nothing — they are offsets
 * from the scene's own start.
 *
 * ⚠ IT OVERLAPS SC04 AND IS DRAWN ON TOP, his instruction. Until the VO has
 * room in it, the card list plays over the opening of the next scene.
 */
export const CARD_LIST = {
  at: 1994,
  /**
   * ⚠ IT NOW RUNS TO THE SC05/SC06 CUT — 1994 → 4047. Three seconds of that is
   * the list being read; the rest is the leaving, the chart, and then the chart
   * STANDING there. Simon extended it to 4041 and had SC05's visuals deleted,
   * so this layer is the only thing drawing across that whole stretch.
   *
   * ⚠ AND IT NOW RUNS PAST SC06'S START, because the second Scene Transisi is
   * this layer's too: at 4046 everything leaves to the left and the six cards
   * come back for mistake 02, and at 4227 they leave to the right again. Simon:
   * overlapping SC06 is fine. The window ends on the frame the last card clears
   * the edge — 4267, not the 4245 he asked for before the exit existed, because
   * the exit needs room to be a move rather than a strobe: six cards leaving
   * four frames apart, each taking 34, puts the last one clear at 4281.
   */
  /** ⚠ +8 FOR THE TWO CARDS THE LIST GAINED. The exit is one card every four
   *  frames, so eight of them take eight frames longer to clear than six did.
   *  Simon's own rule for this exit the last time it moved: "perpanjang juga
   *  scene nya kalo perlu, biar timingnya pas". */
  over: 2288 + 8,
  /** The six cards arrive left to right. */
  deal: { at: 0, step: 5, over: 26 },
  /** The pointer comes in from off-frame and lands on a card. */
  cursor: { at: 30, over: 34, card: 0 },
  /** The flood, from where the pointer touched. */
  hover: { at: 62, over: 46 },
  /**
   * ⚠ THE SCENE IS FADED INTO, AND THE FADE FINISHES BEFORE IT STARTS — Simon:
   * "transisi scene 1 di 1993-1994 berikan transisi fade".
   *
   * It used to fade its own ground up over its first 14 frames, which is not
   * the same thing: the cards were dealing through a half-transparent ground,
   * and SC04's chips and note were snapping in UNDERNEATH at 1995, in full
   * view. What reads as a hard join there is that snap, not the cut.
   *
   * So the fade is 18 frames of pre-roll ENDING on 1993, mounted as its own
   * window in Composition.tsx. This layer opens on a ground that is already
   * solid, and nothing under it is ever seen changing.
   */
  fade: 18,
  /**
   * ═══ THE EXIT ═══  Simon, at 2173.
   *
   * ⚠ IT LEAVES BY MOVING, NOT BY FADING. Cards 2–6 slide off to the right as
   * one row; the card the pointer picked follows them only as far as the
   * middle, opening out to 640 wide on the way. A list that dissolves says
   * "that was the list"; a list that leaves one card standing in the middle
   * says "and THIS is the one we are about to talk about", which is the join
   * this transition is being asked to make.
   *
   * `lead` is how long after the row starts before the picked card moves —
   * Simon's "lalu". Small enough that the two overlap, because a card that
   * waits for an empty frame reads as a second transition.
   */
  exit: { at: 179, row: 32, lead: 20, one: 36 },
  /**
   * ⚠ THE TAPE INSIDE THE OPENED CARD — Simon, 2261 → 2372. Ten bars, each
   * uncovered IN THE DIRECTION IT MOVED rather than appearing whole: green
   * grows up out of its low, red grows down out of its high. What is being
   * watched here is the chart being DRAWN, and a bar that pops has not been
   * drawn, it has arrived.
   *
   * `step` is deliberately shorter than `over`, so a bar is still growing when
   * the next one starts and the tape never stops moving.
   */
  tape: { at: 267, step: 23, over: 28 },
  /**
   * ⚠ THE LEVEL IS DRAWN ONLY ONCE THE TAPE HAS FINISHED ASKING FOR IT — Simon,
   * 2496. Ten bars have fallen into it and bounced off it three times by then,
   * so the line is not being introduced, it is being CONFIRMED. Drawn on, the
   * way every line in this project arrives.
   */
  support: { at: 502, over: 28 },
  /**
   * ⚠ THE SAME BUY BUBBLE SC01 USES — Simon: "copy and paste design label Buy
   * di 603". Not a second design for the same act: the viewer has already been
   * shown what taking the trade looks like in this video, and showing it the
   * same way is what makes this the SAME MISTAKE rather than a new picture.
   *
   * 2556 → 2644 in global frames. It arrives after the level has been drawn,
   * because the level is the reason the trade gets taken.
   */
  buy: 562,
  buyGone: 650,
  /** ⚠ THE ENTRY, LEFT ON THE CHART AFTER THE BUBBLE HAS GONE — Simon's dashed
   *  line from the buy point. It arrives with the bubble and STAYS, because
   *  everything that happens next only means something measured against it. */
  entry: { at: 562, over: 30 },
  /**
   * ═══ THE CARD OPENS ALL THE WAY ═══  Simon: the preview grows to the size of
   * the chart at 286, and the chart inside it zooms OUT. The two overlap by
   * design — one move, not a grow and then a separate shrink.
   */
  /**
   * ⚠ THE TWO ARE NOT ONE GESTURE ANY MORE — Simon: "aku hanya minta timing
   * pelebaran width nya saja". The card opens at 3083; the chart zooms out
   * where it always did, at 2676, inside a card that is still 640 wide.
   *
   * ⚠ WHICH MEANS THE CARD SHOWS LESS OF THE TAPE FOR THOSE 407 FRAMES, and
   * that is a consequence of the split, not a bug: zooming out moves the tape
   * 150px left, and a 640-wide card cannot hold what was only just fitting in
   * it. The window solves itself around it — see `windowOf` in CardList.
   */
  grow: { at: 1089, over: 48 },
  zoom: { at: 682, over: 48 },
  /**
   * ⚠ TWELVE, AND TWELVE IS WHAT THE SMALL CARD CAN HOLD — Simon, after asking
   * how many more would fill the paper on the right. Measured off the render:
   * 169px of it, at a 27.4px pitch, is six more bars to the card's inner margin
   * and seven to its very edge. It is the mask that enforces the number, not
   * the tape: the fall runs on its own locked schedule behind it, and the
   * card's window is solved so exactly twelve are ever seen arriving.
   */
  seen: 12,
  /** ⚠ AND THEN IT FALLS. Fourteen bars, wiping on the same way the first ten
   *  did, so the fall is the same tape continuing and not a second chart. */
  fall: { at: 746, step: 14, over: 18 },
  /**
   * ═══ WHAT IS BELOW THE LEVEL ARRIVES ONE AT A TIME ═══  Simon: "animasi
   * candlestick satu per satu, hanya berlaku pada candlesticks di bawah garis
   * support".
   *
   * ⚠ AND ONLY WHAT IS BELOW IT. The eighteen bars of history are above the
   * level and were always there — the card opening is the whole of their
   * arrival, because nothing happened to them, they were simply out of frame.
   * What is below the level is the trade going wrong, and that is worth
   * watching happen bar by bar.
   *
   * Nineteen bars across 433 frames — the last two of the fall and all
   * seventeen of the grind — each taking 37 to come out and the next starting
   * 22 later, so the last lands on 3516.
   */
  reveal: { at: 1089, step: 22, over: 37 },

  /**
   * ═══ AND THEN IT REWINDS ═══  Simon, from 3517, back to how 2721 looked.
   *
   * ⚠ ONLY THE CANDLES AND THE CARD'S WIDTH GO BACK — his words. The words on
   * screen are not un-said; what is undone is the picture, so the scene can
   * make its point again on the setup rather than on the wreck.
   *
   * ⚠ AND THE BARS LEAVE RIGHT TO LEFT, which is the only order a rewind has.
   * The card following them rather than leading is what makes it read as the
   * tape retreating and the frame closing after it, instead of a window simply
   * shutting on a chart.
   *
   * ⚠ THE BUY LINE DOES NOT COME BACK — Simon: "tanpa garis putus putus
   * indigo". It leaves with the card. What replaces it is `tool`, which marks
   * the same price properly.
   */
  rev: { at: 1523, step: 2, over: 20, card: { at: 1543, over: 60 } },

  /**
   * ⚠ THE LONG POSITION TOOL, after the rewind — Simon's screenshot. It is the
   * answer to the mistake this whole stretch has been about: the lower edge is
   * a line you draw BEFORE the trade, and it is measured from the support,
   * because that is where the reason for the trade stops being true.
   */
  tool: { at: 1620, over: 34 },

  /**
   * ═══ AND THE WHOLE THING LEAVES TO THE LEFT ═══  Simon, 4046 → the second
   * Scene Transisi.
   *
   * ⚠ ONLY THE CONTENT MOVES, NOT THE GROUND. The card, the note, the tool and
   * the tape travel off the left edge together as one object; the paper they
   * are on stays, because the row that arrives next has to arrive ONTO
   * something. A ground that left with them would flash the scene underneath.
   */
  away: { at: 2052, over: 44 },

  /**
   * ═══ THE SECOND ROUND ═══  Simon: the six cards come back from the right,
   * the pointer picks the second one, and the first is cyan because it is done.
   *
   * ⚠ THEY RETURN THE WAY THEY LEFT — as one row, one distance, one curve. The
   * first round DEALT them, card by card, because the list was new; a list that
   * has already been read comes back as the thing it is rather than being
   * introduced a second time.
   */
  row2: {
    /** ⚠ THE SAME FRAME THE PICTURE LEAVES ON. One goes left, the other comes
     *  in from the right, and they cross — which is what makes it one move and
     *  not a scene ending followed by a scene starting. */
    at: 2052,
    /** ⚠ LONGER THAN THE ROW'S OWN TRAVEL NEEDS, because the cards do not all
     *  travel the same distance any more — see `spread`. The one at the back
     *  covers nearly three times the frame's width, and 48 frames made that a
     *  strobe rather than a move. */
    over: 60,
    /**
     * ⚠ THEY COME IN LOOSE AND CLOSE UP — Simon, "demi estetika". The gap starts
     * four times its resting width, so the six arrive as a spread pack and
     * gather into a row instead of sliding in already formed. One curve, six
     * different distances: that difference IS the closing up.
     */
    /** ⚠ FOUR FRAMES BETWEEN CARDS ON THE WAY IN — Simon: "masuk kartu nya
     *  satu per satu". The same step the exit uses, so the row arrives the way
     *  it leaves: close enough to read as one gesture, far enough apart that it
     *  is six cards arriving rather than a block sliding on. */
    step: 4,
    spread: 4,
    cursor: { at: 2092, over: 34, card: 1 },
    hover: { at: 2124, over: 46 },
    /**
     * ⚠ OUT AT 4227, ONE AT A TIME — Simon: "keluar satu per satu, tapi
     * timingnya berdekatan". Four frames between starts, which is close enough
     * that it reads as one gesture and far enough apart that it is six cards
     * leaving rather than a block sliding off.
     *
     * ⚠ THE RIGHTMOST GOES FIRST, and it has to: they are all travelling right,
     * so a card that set off before the one in front of it would drive into it.
     * Leaving from the far end is also what opens the gaps up, which is the
     * look Simon asked for the last time this row moved — so there is no
     * separate spreading to arrange, the stagger IS the spread.
     *
     * ⚠ 34 FRAMES EACH. The leftmost has 1864px to cover before it clears the
     * frame; much quicker and it crosses the screen faster than the eye tracks.
     */
    out: { at: 2233, step: 4, over: 34 },
    /** ⚠ THE CARDS ALREADY DEALT WITH. Cyan, not gone: a list that removes its
     *  finished items is a queue, and this is a syllabus. */
    done: [0],
  },

  /**
   * ⚠ AND THE FALL IS RUN AGAIN — Simon, from 3832. Twelve bars down to the
   * right, on the same beat they had the first time, because it is the same
   * twelve bars: what changed between the two runs is not the market, it is
   * that a line has been drawn saying when to stop.
   */
  again: { at: 1838, step: 14, over: 18 },

  /**
   * ⚠ THE SENTENCE THE WHOLE STRETCH HAS BEEN FOR. Stamped in a dashed frame
   * over the empty lower half of the card — a note written on the chart, which
   * is what it is.
   */
  note: { at: 1902, perChar: 2 },

  /**
   * ⚠ THE LEVEL FLASHES AS IT GOES — Simon, from 2751, three times. It is the
   * one moment in this card where the line is doing something rather than just
   * being somewhere: price is closing through it as it blinks.
   *
   * ⚠ AND THE THICKENING IS +3, NOT →3. At rest this level is already drawn at
   * `theme.shape.line`, which IS 3px, so setting it to 3 would be no change at
   * all. Simon's number is taken as the amount it gains.
   */
  blink: { at: 757, times: 3, over: 18 },

  /**
   * ═══ WHAT PEOPLE SAY WHILE A TRADE GOES WRONG ═══  Simon, 3294 and 3367,
   * both gone at 3663.
   *
   * ⚠ VERBATIM, AND WITH HIS QUOTE MARKS. He asked for the quotation marks
   * explicitly, and they are the point: these are not the video's claims about
   * the market, they are the two sentences a person says to themselves to keep
   * a position that has already broken its own reason. Curly, like the other
   * quoted speech in this episode.
   *
   * ⚠ EACH IS PINNED TO A BAR, AND THE BAR IS NOW FIXED — Simon: "lock posisi".
   * They were derived from whichever candle was arriving on their frame, which
   * was right while the reveal's schedule was still being decided and is wrong
   * now that it is: shortening the reveal to 3516 would have slid both words
   * four bars to the right. The indices are what that derivation gave, frozen.
   */
  hopes: {
    /** ⚠ THEY GO AS THE LAST CANDLE LANDS — Simon, 3516. The fade lands on that
     *  frame rather than starting there, so the two things finish together:
     *  the tape stops moving and the talking stops with it. */
    out: 1522,
    said: [
      { text: "“Sedikit lagi”", at: 1300, above: true, bar: 45 },
      { text: "“Mungkin nanti balik”", at: 1373, above: false, bar: 47 },
    ],
  },

  /** ⚠ THE VERDICT, UNDER THE CHART — Simon, 2966 → 3102. White on solid red:
   *  `warn` is this episode's one red outside a candle and it is for WORDS that
   *  name a mistake, which is exactly what this word is. */
  invalid: { at: 972, out: 1108 },
  /* ⚠ THERE IS NO `out`, AND THAT IS THE POINT. The opened card holds to the
     end of the window and is CUT. A dissolve here would be a wipe between
     scenes by another name, and this join is a cut — see `over`. */
  /**
   * ⚠ EIGHT, NOT SIX — Simon: "ternyata harusnya 8 kartu". The list had been
   * missing the two mistakes between confirmation bias and hindsight bias, and
   * that was not only a short row: it is exactly the discrepancy `COUNTER` has
   * carried a note about, where the video counts eight and the cards named six.
   * These eight are now one for one with `COUNTER.items`, and asserted to be —
   * a card and a counter entry are the same mistake said twice, so they cannot
   * be allowed to disagree about how many there are.
   *
   * ⚠ THE WORDING IS SIMON'S, INCLUDING ITS CASE. The two new ones are typed as
   * he typed them; the four already on screen keep the wording he approved,
   * which is why "Hindsight Bias" is still Title Case although his latest list
   * says "Hindsight bias" — restyling an approved card off a re-typed list is a
   * silent edit to finished work.
   */
  titles: [
    "Entry tanpa tahu kapan salah",
    "Overtrading",
    "Revenge Trading",
    "Confirmation Bias",
    "Ignore market context",
    "Indicator overload",
    /** ⚠ SPELT CORRECTLY. Simon first typed "Hindisght"; the same mistake is
     *  named "HINDSIGHT BIAS" by the counter in SC11, and two spellings of one
     *  term in one video is the kind of thing only the video notices. */
    "Hindsight Bias",
    "Asal Copy Trade",
  ],
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
/**
 * ⚠ NOTHING DRAWS THIS ANY MORE — Simon: "visual yang awalnya ada di timeframe
 * ini, dihapus saja". The card list covers 3084 → 4047 now. The table is kept
 * because it is the VO's own frame table for that stretch and re-deriving it
 * from the SRT is the expensive part; the scene that read it is gone.
 */
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

/**
 * ═══ SC06 · THE PLATFORM ARRIVES ═══  Simon: a camera cut without blur, and a
 * fade on top of it.
 *
 * ⚠ THE TWO LAND ON THE SAME FRAME, AND THAT IS THE WHOLE TRICK. The cut is
 * written as a 40-frame move whose midpoint is 4282, so its visible half runs
 * 4282 → 4302; the fade is 20 and ends there too. Given different lengths they
 * would read as a slide with a fade happening near it.
 *
 * ⚠ AND THE FADE IS DOING THE JOB THE BLUR USED TO. core/CameraCut.ts is blunt
 * about it — without the blur a cut reads as a slide — but the blur was only
 * ever there to stop the eye resolving detail mid-move. Something arriving out
 * of nothing cannot have its detail resolved either.
 */
export const PLATFORM = { at: 4282, fade: 20 } as const;
export const PLATFORM_CUT = {
  at: 4282,
  /** ⚠ HALF OF THIS IS NEVER SEEN. The card list owns every frame before 4282,
   *  so the incoming half is the only half there is — which is also why `at` is
   *  the frame the panel first appears on and not the frame it starts moving. */
  over: 40,
  /** ⚠ SHORT. With no blur, the distance is the only thing keeping this a
   *  camera move rather than a slide. */
  distance: 96,
  blur: 0,
  axis: "y",
} as const;

/**
 * ⚠ A "Buy" ON EVERY SWING — Simon, from 4356. Thirteen of them, four frames
 * apart, so they land as a rattle rather than a row appearing.
 *
 * ⚠ AND THEY ARE THE MISTAKE, NOT A SIGNAL. This is the overtrading scene: what
 * the badges say is that somebody acted at every turn the chart made, which is
 * the thing being warned about. The episode's rule against buy markers is about
 * marks that TELL the viewer to act; these are a portrait of somebody who did.
 */
export const BUYS = { at: 4356, step: 4, over: 14 } as const;

/**
 * ═══ THE REST OF THE PLATFORM'S STRETCH ═══  (Simon)
 *
 * ⚠ EVERY BEAT IS A GLOBAL FRAME, because the panel it drives is held on one
 * frame of ANOTHER episode's clock — see scenes/Platform.tsx. Nothing in this
 * block may be derived from 019's numbers or from each other.
 */
export const PLAT = {
  /** 4501 — the window changes name, and the structure draws on the new one. */
  swap: { at: 4501, over: 12 },
  /** ⚠ IT CRAWLS — Simon: 4501 → 4641. 140 frames for a line that used to take
   *  44: at that speed it was a line appearing, and what he wants is a line
   *  being traced across the chart. */
  zig: { at: 4501, over: 140 },
  /** 4679 — the chart's own extremes, drawn as two lines. */
  levels: { at: 4679, over: 30 },
  /** 4775 — everything drawn ON the chart goes. The chart itself stays. */
  clear: { at: 4775, over: 24 },
  /**
   * 4894 — the panel shrinks toward the middle, making room under it.
   *
   * ⚠ `lift` RIDES THE SAME CURVE AS THE SCALE, and that is the point: Simon
   * wants the finished arrangement 40px higher, not the panel 40px higher for
   * the whole scene. On one curve nothing before 4894 moves at all.
   */
  shrink: { at: 4894, over: 40, by: 0.72, lift: 40 },
  /** And the sentence that room was made for. */
  note: { at: 4944, perChar: 2 },
} as const;

/**
 * ═══ SCENE TRANSISI 3 ═══  Simon, from 5045: the platform leaves UPWARD and the
 * list comes back for mistake 03.
 *
 * ⚠ THE SAME SHAPE AS THE SECOND ROUND, offset. Every beat here is the second
 * round's own offset from its start, carried onto this one — "cara masuk dan
 * keluarnya sama". What differs is which card is picked and how many are done,
 * which is the only thing that SHOULD differ between two turns of one list.
 *
 * ⚠ AND EVERY NUMBER IS GLOBAL. Round two counts inside CardList's window;
 * this round is its own window, so the two tables cannot be read the same way
 * and nothing here may be derived from that one.
 */
export const ROW3 = {
  from: 5045,
  /** ⚠ IT ENDS ON THE FRAME THE LAST CARD CLEARS. Simon moved the exit forward
   *  to 5192; six cards four frames apart, each taking 34, puts the last one
   *  off screen at 5246. */
  /** ⚠ +8 FOR THE TWO CARDS THE LIST GAINED. The exit is one card every four
   *  frames, so eight of them take eight frames longer to clear than six did.
   *  Simon's own rule for this exit the last time it moved: "perpanjang juga
   *  scene nya kalo perlu, biar timingnya pas". */
  over: 202 + 8,
  /** ⚠ UP, NOT LEFT — Simon. The platform is a window onto a screen; a screen
   *  that slides sideways reads as another screen arriving, one that lifts away
   *  reads as this one being put down. */
  away: { at: 5045, over: 44 },
  row: {
    at: 5045,
    over: 60,
    /** ⚠ FOUR FRAMES BETWEEN CARDS ON THE WAY IN — Simon: "masuk kartu nya
     *  satu per satu". The same step the exit uses, so the row arrives the way
     *  it leaves: close enough to read as one gesture, far enough apart that it
     *  is six cards arriving rather than a block sliding on. */
    step: 4,
    spread: 4,
    /** ⚠ THE THIRD CARD THIS TIME. */
    cursor: { at: 5085, over: 34, card: 2 },
    hover: { at: 5117, over: 46 },
    /** ⚠ TWO DONE NOW. The list is a syllabus, and it keeps what it has done. */
    done: [0, 1],
    /** ⚠ 5192 — Simon. Same exit as the second round: one at a time, from the
     *  far end, because they all travel right and a card that set off before
     *  the one in front of it would drive into it. */
    out: { at: 5192, step: 4, over: 34 },
  },
} as const;

/**
 * ═══ THE CHART COMES BACK ═══  Simon, from 5247: the same picture as 4044,
 * sliding in from off the left.
 *
 * ⚠ `frame` IS CardList's OWN CLOCK, not this timeline's. 4044 is a global
 * frame; the layer that draws that picture counts from 1994, so what it has to
 * be shown is 2050. Holding one and writing the other is how a recall like this
 * silently drifts.
 *
 * ⚠ AND IT IS THE SAME LAYER, FROZEN — not a copy of it. Same card, same tape,
 * same tool, same everything, because it IS that drawing; only the note is
 * switched off, which is a flag rather than a second picture.
 */
export const RECALL = {
  at: 5247,
  /** ⚠ IT HANDS OVER AT 5394, where the picture stops being a memory and starts
   *  moving again — see REVENGE. */
  over: 147,
  in: 44,
  frame: 4044 - 1994,
  /**
   * ⚠ THE VERDICT ON THE FIRST TRADE — Simon: "Loss", white on a red pill, in
   * the middle of the Long Position tool. It lands ON the cue that names it:
   * 5216 opens "Setelah loss, kita ingin cepat mengembalikan kerugian", so the
   * word is on screen while the word is being said.
   *
   * ⚠ AND AFTER THE SLIDE HAS SETTLED (5247 + `in`). A stamp that arrives while
   * the thing it stamps is still travelling is a label on a moving object.
   */
  loss: 5310,
} as const;

/**
 * ═══ THE REVENGE TRADE ═══  Simon, from 5394.
 *
 * The recalled chart pans up and left until only its last seven bars are on the
 * card, a position tool is drawn on the price it closed at, and then the tape
 * runs again: seven bars up into profit, eight back down through the stop.
 *
 * ⚠ NOTHING HERE IS IN A HURRY — Simon: "timing dan durasi tidak buru-buru".
 * Each bar takes 28 frames to come out and the next starts 22 later, which is a
 * third of a second apart. The whole beat fills the 589 frames SC07's deleted
 * visuals left, and ends with 71 of them still held.
 */
export const REVENGE_T = {
  at: 5394,
  /**
   * ⚠ IT HANDS OVER AT 6023 — Simon: "perpanjang scene nya hingga 6023. Lalu
   * transisi ke Scene Transisi". 6023 is this scene's LAST frame and the
   * transition's FIRST, which is the same one-frame overlap round three uses:
   * the row arriving and the picture leaving have to cross, and on that frame
   * there are two copies of this scene in the same place at the same progress.
   *
   * ⚠ AND IT NOW RUNS OVER SC08 — Simon: "tidak masalah overlap dengan scene
   * lain", said while the timing is still open. The two windows genuinely
   * overlap from 5984; nothing downstream has been moved to make room yet.
   */
  over: 6023 - 5394 + 1,
  /** ⚠ THE PAN IS A CHANGE OF GRID, not a transform on a picture — see
   *  scenes/Revenge.tsx. `left` and `up` are what the chart moves by. */
  /**
   * ⚠ `up` IS MEASURED, NOT CHOSEN. At 200 the whole story — the seven bars
   * kept, the rally and the fall — sat in the card's top half with 240px of
   * paper under it. 115 is what centres what the card will END UP holding, read
   * off a render of the finished beat rather than off the frame it starts on.
   */
  pan: { at: 5394, over: 70, up: 115 },
  tool: { at: 5484, over: 36 },
  /**
   * ⚠ EVERYTHING THE CHART DOES IS OVER BY `endsAt` — Simon: "seluruh animasi
   * chart sebaiknya selesai di 5676". Held here as his number rather than left
   * as whatever the last bar happens to add up to, and asserted below, so a
   * later nudge to a step or a reveal cannot quietly walk past it.
   *
   * ⚠ THE FIFTEEN BARS ARE ONE RUN. `down.at` is `up.at + 7 * step`, which is
   * where the eighth bar of a continuous tape falls; the two keys exist so the
   * legs can be retimed apart, not because they are two events. The reveal is
   * long against the step on purpose — three bars are always mid-growth, which
   * is what makes a compressed run still read as a tape rather than a count.
   */
  up: { at: 5530, step: 8, over: 34 },
  down: { at: 5586, step: 8, over: 34 },
  endsAt: 5676,
  /**
   * ⚠ THE VERDICT ON THE SECOND TRADE — Simon: "Loss lagi", same stamp, middle
   * of the new tool, "setelah 5676".
   *
   * ⚠ IN THE SILENCE, NOT OVER A WORD. Cue 41 ends at 5668 and cue 42 opens at
   * 5684; 5682 is inside that gap. The tape lands, the sentence about it
   * finishes, and then the word arrives on its own — which is the beat the
   * whole scene has been building, and it would be stepped on by either
   * sentence.
   */
  lossAgain: 5682,
  /**
   * ⚠ THE CHART RISES TO MAKE ROOM — Simon, 5721. How far is solved in
   * data/layout.ts (`REVENGE_NOTE.up`); this is only when.
   */
  lift: { at: 5721, over: 40 },
  /**
   * ⚠ THE BOX STARTS BEFORE THE LIFT HAS FINISHED. Waiting for the chart to
   * settle would be two events in a row where the eye only has one thing to
   * follow; overlapped, the room appearing and the thing filling it are one
   * move. It still cannot collide — the box's home is empty paper from 5721.
   *
   * ⚠ ON THE CUE IT BELONGS TO: 5684 opens "Kalau belum ada setup, jawabannya
   * tetap: jangan trade", which is the sentence this box is.
   */
  note: {
    at: 5751,
    perChar: 2,
    /**
     * ⚠ THE CYAN MARK ON THE FIRST LINE — Simon. Only a DURATION and a gap
     * live here, never a frame: a highlighter drawn across a half-written
     * sentence is a pen moving faster than the hand. The scene starts it
     * `gap` frames after that line finishes being typed, which is a number it
     * can work out and I cannot, because the typing begins when the dashed
     * frame snaps open rather than when the box is asked for.
     */
    mark: { gap: 12, over: 26 },
  },
  /**
   * ⚠ THE SECOND LINE JOINS THE FIRST, IT DOES NOT REPLACE IT — Simon: replacing
   * read as rushed. 5876 lands 22 frames into cue 43, "Setiap trade baru harus
   * memenuhi aturan yang sama", so the second sentence is written as the second
   * sentence is said, underneath the first one rather than over it.
   *
   * ⚠ IT TYPES, like the line above it. A line that faded in would be the only
   * text in the episode that arrives without being written.
   */
  line2: { at: 5876, perChar: 2 },
  /** ⚠ THE FIRST TRADE GOES WITH THE PAN — its tool AND the support line and
   *  label it was drawn against. That trade is over; left up, they would stretch
   *  across a chart they are no longer about, and the support would sit under
   *  the new tool as though the new trade were a claim about it. One curve, so
   *  they cannot come apart. */
  clear: { at: 5394, over: 40 },
} as const;

{
  const V = REVENGE_T;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/timing: ${m}`);
  };
  /** The two legs have to stay one tape. */
  if (V.down.at !== V.up.at + 7 * V.up.step) {
    fail(`the revenge fall starts at ${V.down.at}, not where the rally's run reaches (${V.up.at + 7 * V.up.step})`);
  }
  const last = V.down.at + 7 * V.down.step + V.down.over;
  if (last !== V.endsAt) fail(`the revenge tape finishes at ${last}, not ${V.endsAt}`);
  for (const [name, end] of [
    ["the pan", V.pan.at + V.pan.over],
    ["the tool", V.tool.at + V.tool.over],
  ] as const) {
    if (end > V.endsAt) fail(`${name} finishes at ${end}, after ${V.endsAt}`);
  }
  if (V.endsAt > V.at + V.over) fail("the chart is still animating when the scene ends");
  /** ⚠ THE SECOND VERDICT COMES AFTER THE TAPE IT JUDGES, and before the scene
   *  is over. Simon's "setelah 5676", kept as a relation rather than as a
   *  number that happens to be bigger. */
  if (V.lossAgain < V.endsAt) fail(`"Loss lagi" lands at ${V.lossAgain}, before the tape finishes`);
  if (V.lossAgain > V.at + V.over) fail(`"Loss lagi" lands after the scene ends`);
  /** The note cannot open before the room for it starts being made, and the
   *  line it swaps to cannot land before the box holding it is up. */
  if (V.note.at < V.lift.at) fail("the revenge note opens before the chart lifts");
  if (V.line2.at <= V.note.at) fail("the revenge note's second line lands before its first");
}

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
/**
 * ⚠ NOTHING DRAWS THIS ANY MORE — Simon: "visual scene 07 hapus aja". Kept for
 * the same reason HOPE is: it is the VO's own frame table for that stretch and
 * re-deriving it from the SRT is the expensive part. Only the scene that read
 * it is gone.
 */
export const REVENGE = {
  name: 5121,
  loss: 5186,
  /** The loop back into a new trade — fast, and that speed is the point. */
  loop: { at: 5355, over: 26 },
  next: 5355,
  cut: 5554,
  caption: 5590,
  verdict: 5771,
  gate: 5824,
  close: 5890,
} as const;

/**
 * ═══ SCENE TRANSISI 4 ═══  Simon: "transisi ke Scene Transisi, highlight kartu
 * 4", and "lakukan dulu tanpa pedulikan timing".
 *
 * ⚠ ROUND THREE'S RHYTHM, MOVED. Every gap here is the one ROW3 uses — 40 to
 * the pointer, 72 to the flood, 147 to the exit — because the two rounds are
 * the same gesture and a transition that breathed differently each time would
 * read as a different device rather than a returning one. The frames are
 * PROVISIONAL: Simon has parked the timing, and this is the shape to tune.
 */
export const ROW4 = {
  from: 6023,
  /** Ends on the frame the last card clears: six cards four apart, each taking
   *  34, from 6170. */
  /** ⚠ +8 FOR THE TWO CARDS THE LIST GAINED. The exit is one card every four
   *  frames, so eight of them take eight frames longer to clear than six did.
   *  Simon's own rule for this exit the last time it moved: "perpanjang juga
   *  scene nya kalo perlu, biar timingnya pas". */
  over: 202 + 8,
  /** ⚠ LEFT, NOT UP. What leaves here is a chart on a card — a page — and a
   *  page is pushed aside by what comes next. Round three lifted because what
   *  left there was a window onto a screen, which reads as being put down. */
  away: { at: 6023, over: 44 },
  row: {
    at: 6023,
    over: 60,
    /** ⚠ FOUR FRAMES BETWEEN CARDS ON THE WAY IN — Simon: "masuk kartu nya
     *  satu per satu". The same step the exit uses, so the row arrives the way
     *  it leaves: close enough to read as one gesture, far enough apart that it
     *  is six cards arriving rather than a block sliding on. */
    step: 4,
    spread: 4,
    /** ⚠ THE FOURTH CARD THIS TIME — Simon's "highlight kartu 4", zero-based. */
    cursor: { at: 6063, over: 34, card: 3 },
    hover: { at: 6095, over: 46 },
    /** ⚠ THREE DONE NOW. The list is a syllabus, and it keeps what it has done. */
    done: [0, 1, 2],
    out: { at: 6170, step: 4, over: 34 },
  },
} as const;

/**
 * ═══ SC08 · TWO WINDOWS, THE SAME CHART ═══  Simon: "buat 2 window kiri kanan,
 * isi chartnya sama", and — as with the last few — the timing is not the point
 * yet.
 *
 * ⚠ IT OPENS AFTER THE CARD ROW HAS CLEARED. The fourth transition's last card
 * is off screen on 6232; a window arriving under it would be two lists of
 * things moving at once.
 */
export const TWIN = {
  at: 6250,
  /**
   * ⚠ IT RUNS PAST ITS OWN BLOCK — Simon: "perpanjang scene hingga 7102".
   * SC09's window opens on 7064, so the last 38 frames of this one are drawn
   * over the top of it. That is deliberate and it is the same arrangement the
   * fourth card row has with SC08; what it costs is on the record rather than
   * discovered later: SC09's first 38 frames are hidden.
   */
  to: 7102,

  /* ── WINDOW 1 BUILDS ITSELF, ALONE AND CENTRED ──────────────────────── */
  /**
   * ═══ STEP 1 · THE WINDOW, WITH ITS CHART ALREADY ON IT ═══
   * ⚠ NO SWEEP ANY MORE — Simon: "animasi chart window 1 cancel aja, jadi kartu
   * putih muncul sudah ada chartnya". The tape used to draw across bar by bar.
   * What this scene animates is somebody READING a chart, and the chart is not
   * the part they made; drawing it first put the emphasis on the wrong thing.
   */
  card: { at: 6250, over: 20 },
  /**
   * ═══ STEP 2 · THE TWO INDIGO LINES ═══
   * ⚠ BOTH AT ONCE — Simon: "sekaligus". `step` is 0, which is how that is said
   * here: the stagger is a number rather than a branch, so taking it away does
   * not take away the machinery that could bring it back.
   */
  lines: { at: 6276, step: 0, over: 32 },
  /**
   * ═══ STEP 3 · THE SWING LINE AND THE ARROW, AS ONE STROKE ═══
   * ⚠ ONE KEY NOW, AND THAT IS THE FIX. They were two — the zigzag to 6352 and
   * the arrow from it — and each carried its own ease, so the pen slowed to a
   * stop at the join and started again from nothing. Simon saw it: "di 6350
   * entah kenapa panahnya ada sedikit berhenti". Nothing was wrong with either
   * curve; the seam was in having two of them. The swing line already ends
   * exactly where the arrow starts, so on screen this was always one pen moving
   * from the leftmost candle to the arrowhead — it is now one reveal as well,
   * eased once across the whole length.
   */
  stroke: { at: 6312, over: 60 },
  /** ⚠ WINDOW 1 IS FINISHED HERE. Asserted below: every step above lands by it,
   *  and the hand-over cannot start before it. */
  done: 6372,

  /* ── AND THEN IT MAKES ROOM ──────────────────────────────────────────── */
  /**
   * ⚠ 6375 IS THE HAND-OVER — Simon: "di 6375 adalah transisi munculnya window
   * 2". Three things start on it: window 1 slides left, grows 10%, and lights.
   */
  split: { at: 6375, over: 32 },
  /** ⚠ RIDES THE SLIDE rather than following it: one move, not a shuffle and
   *  then a swell. */
  grow: { at: 6375, over: 32, by: 1.1 },
  /**
   * ⚠ THE LIGHT RUNNING ROUND WINDOW 1's EDGE — Simon: "animasi seperti lampu
   * neon yang menjalar berulang di bordernya".
   *
   * ⚠ IT LIGHTS ON THE HAND-OVER, NOT WITH THE CARD. Before window 2 exists
   * there is nothing to be picked out FROM, so a lit window on an empty screen
   * is decoration. The moment the second one is on its way it becomes a
   * statement about which of the two is being read.
   *
   * `lap` is one trip round; `hold` is the dark between passes. A light that
   * runs continuously reads as a spinner; one that arrives, stops and goes
   * again reads as a pass being made.
   *
   * ⚠ AND IT GOES ROUND TWICE, THEN STOPS — Simon: "beamnya muter 2x aja,
   * berhenti di 6600". `laps` is the count and `stop` is his frame; the two are
   * checked against each other below rather than one of them being derived,
   * because they are two different statements about the same moment and a
   * silent disagreement between them is exactly what an assertion is for. The
   * GLOW stays: the beam saying its piece twice is a gesture, but which window
   * is being read does not stop being true.
   */
  neon: { at: 6375, over: 30, lap: 100, hold: 10, laps: 2, stop: 6600 },
  /**
   * ⚠ WINDOW 2 WAITS FOR WINDOW 1 TO STOP MOVING. They used to arrive on the
   * same frame and collided in mid-air — Simon sent the frame where they
   * overlap. The slide ends on 6407, so this begins after it: one thing moves
   * at a time, which is also the only way the eye can follow either.
   */
  second: { at: 6411, over: 36 },
} as const;

{
  const V = TWIN;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/timing: ${m}`);
  };
  /** ⚠ THE STEPS ARE IN SIMON'S ORDER AND THEY ALL LAND BY `done`. Both were
   *  given as instructions; both are checked rather than left to the reading of
   *  four separate keys. */
  const ends: [string, number][] = [
    ["the card", V.card.at + V.card.over],
    ["the indigo lines", V.lines.at + V.lines.step + V.lines.over],
    ["the swing line and its arrow", V.stroke.at + V.stroke.over],
  ];
  for (const [name, e] of ends) {
    if (e > V.done) fail(`${name} finishes at ${e}, after ${V.done}`);
  }
  if (V.lines.at < ends[0][1]) fail("the lines start before the card has arrived");
  if (V.stroke.at < ends[1][1]) fail("the swing line starts before the lines are drawn");
  if (V.split.at <= V.done) fail("the windows split before the first one is finished");
  /** ⚠ AND WINDOW 2 WAITS FOR THE SLIDE. The collision Simon photographed was
   *  exactly this check being absent. */
  if (V.second.at < V.split.at + V.split.over) {
    fail(`window 2 starts at ${V.second.at}, before the slide ends at ${V.split.at + V.split.over}`);
  }
  /** ⚠ TWO LAPS HAVE TO FIT INSIDE SIMON'S STOP FRAME. They end on 6595 against
   *  his 6600 — the five frames between are inside the dark hold, so the two
   *  numbers describe the same picture — but a change to `lap` or `hold` could
   *  put the light still travelling when it is meant to be over. */
  const lastLap = V.neon.at + V.neon.laps * (V.neon.lap + V.neon.hold);
  if (lastLap > V.neon.stop) {
    fail(`the beam's ${V.neon.laps} laps end at ${lastLap}, after it is meant to stop on ${V.neon.stop}`);
  }
}

/**
 * ═══ SC08 · THE QUESTION, AND THE ONE NOBODY ASKS ═══  Simon, 6594 and 6787.
 *
 * ⚠ THE WINDOWS GIVE UP THE FRAME TO A SENTENCE. Both shrink together toward
 * the middle, which leaves the room the box needs and — more to the point —
 * demotes them: the two readings stop being the subject the moment the question
 * about how to read anything at all turns up under them.
 *
 * ⚠ AND THE BOX GROWS DOWNWARD FROM A FIXED TOP. The second line is an
 * ADDITION, not a replacement — the same correction Simon made to the revenge
 * note at 5876 — so the first question has to stay exactly where it was while
 * the second arrives under it.
 */
export const PROVE = {
  shrink: { at: 6594, over: 40, by: 0.7 },
  /** ⚠ IT OPENS BEFORE THE SHRINK FINISHES. The room appearing and the thing
   *  filling it are one move; waited out, they are two. */
  box: { at: 6620, perChar: 2 },
  grow: { at: 6787, over: 24, perChar: 2 },
  lines: [
    "Apa yang membuat analisis benar?",
    "Apa yang bisa membuktikan salah?",
  ],
  /**
   * ⚠ THE TWO QUESTIONS GIVE WAY TO WHAT THEY WERE FOR — Simon, 6967: "Stay
   * objective", green, as tall as the two lines it replaces. The box does not
   * change size; only what is in it does, which is the point — the same frame
   * that held the questions now holds the answer.
   *
   * ⚠ ON THE VOICE. Cue 48 opens at 6977 with "Ini membantu tetap objektif";
   * the words land ten frames ahead of it, which is the margin every other
   * caption in this episode is written to.
   */
  close: { at: 6967, over: 20, text: "Stay objective" },
} as const;

/* ═══ SC08 — confirmation bias ═══════════════════════════════════════════ */
/**
 * ⚠ NOTHING DRAWS THIS ANY MORE — Simon: "hapus semua visual scene 8 termasuk
 * text". Kept for the same reason REVENGE and HOPE are: it is the VO's own
 * frame table for that stretch, and re-deriving it from the SRT is the
 * expensive part. Only the scene that read it is gone.
 */
export const BIASED = {
  name: 6092,
  chart: { at: 6020, over: 120 },
  /** Six markers on the tape: three that support the scenario, three against.
   *  `i` is a bar index into the BIAS tape. */
  marks: [
    { i: 9, supports: true }, { i: 17, supports: false }, { i: 26, supports: true },
    { i: 34, supports: false }, { i: 43, supports: true }, { i: 52, supports: false },
  ],
  box: { at: 6355, over: 30 },
  fade: { at: 6439, over: 30 },
  q1: 6649,
  q2: 6817,
  /** ⚠ f6947 HAS NO AIR — cue 31 runs straight into 32. The box collapses and
   *  the three ignored markers come back to full on the same frame. */
  collapse: 6947,
  close: 6990,
} as const;

/**
 * ═══ SCENE TRANSISI 5 ═══  Simon: "7101-7102 transisi ke scene transisi,
 * seleksi kartu ke 5".
 *
 * ⚠ ROUND FOUR'S RHYTHM AGAIN, moved by 1078 — the same gaps the list has used
 * every time it has turned, because it is the same gesture returning and a
 * transition that breathed differently each round would read as a different
 * device.
 *
 * ⚠ EXCEPT THE POINTER, WHICH HAD TO WAIT FOUR MORE FRAMES. Card 5 sits one
 * slot further along than card 4 did, and the row arrives one card at a time —
 * so at round four's spacing the pointer would have reached it two frames
 * BEFORE it landed. The assertion in scenes/SceneTransition.tsx caught it; the
 * cursor and the flood both move with it.
 */
export const ROW5 = {
  from: 7101,
  over: 210,
  /** ⚠ LEFT, like round four: what leaves is a page, and a page is pushed
   *  aside by what comes next. */
  away: { at: 7101, over: 44 },
  row: {
    at: 7101,
    over: 60,
    step: 4,
    spread: 4,
    /** ⚠ THE FIFTH CARD THIS TIME — Simon's "kartu ke 5", zero-based. */
    cursor: { at: 7145, over: 34, card: 4 },
    hover: { at: 7179, over: 46 },
    /** ⚠ FOUR DONE NOW. The list is a syllabus, and it keeps what it has done. */
    done: [0, 1, 2, 3],
    out: { at: 7248, step: 4, over: 34 },
  },
} as const;

/* ═══ SC09 — konteks market ══════════════════════════════════════════════ */
/**
 * ⚠ NOTHING DRAWS THIS ANY MORE — Simon: "hilangkan dulu semua visual di scene
 * 09". Kept for the same reason REVENGE, HOPE and BIASED are: it is the VO's
 * own frame table for that stretch and re-deriving it from the SRT is the
 * expensive part. Only the scene that read it is gone.
 */
export const CONTEXT = {
  name: 7074,
  /** Two windows, the SAME setup in both — only the context strip differs. */
  panes: { at: 7130, over: 40 },
  left: 7328,
  right: 7477,
  same: 7584,
  /** The frame that draws the wider market around both. */
  wider: 7762,
  close: 7830,
} as const;

/**
 * ═══ SC09 · ONE SETUP, TWO MARKETS ═══  Simon, 7311, from his sketch.
 *
 * ⚠ THE BEATS LAND ON THE SENTENCE THAT NAMES THEM. Cue 7260–7622 is "Setup
 * yang berjalan baik saat market trending bisa lebih sering gagal saat market
 * sideways" — so the setup is named first, then the trending column while the
 * voice is on "market trending", then the sideways one on "market sideways".
 * The two verdicts wait for 7644, "Setup-nya bisa sama, tapi konteksnya
 * berbeda", which is what they are the proof of.
 */
export const BREAKOUT = {
  at: 7311,
  /**
   * ⚠ IT OUTLIVES ITS OWN BLOCK — Simon: "perpanjang scene nya hingga 8060".
   * SC10's window opens at 7995, so the last 65 frames of this picture are held
   * over the top of it, the way SC08 was held to 7102.
   *
   * ⚠ WHICH IS WHY `OVERLOAD.chart` MOVED TO 8060. SC10's chart used to begin
   * fading at 8020 — under this overlay, where nobody could see it — and would
   * have been revealed already half-arrived. It now starts as this lifts.
   */
  to: 8060,
  title: { at: 7311, over: 34 },
  cols: [
    { at: 7380, over: 30, tape: { at: 7404, step: 1.2, over: 14 } },
    { at: 7500, over: 30, tape: { at: 7524, step: 1.2, over: 14 } },
  ],
  /** ⚠ ONE AFTER THE OTHER, not together: the second verdict is the surprise,
   *  and landing both at once spends it. */
  verdict: { at: 7650, step: 40, over: 26 },
  heads: ["Market trending", "Market sideways"],
  says: ["Setup berhasil", "Setup gagal"],
  /**
   * ⚠ THE SETUP IS NAMED IN TWO PIECES because Simon wants only half of it
   * coloured: "Setup:" is the label and stays ink; "beli di garis support" is
   * the rule itself and is indigo. Split here rather than in the scene so the
   * words and the way they are broken travel together.
   */
  setup: { lead: "Setup:", term: "beli di garis support" },
  /**
   * ⚠ THE ANALYSIS IS LAID OVER A FINISHED CHART. Each column draws its tape,
   * and only then the level it was read against, the entry, and the exit — in
   * that order, because a support drawn while the bars are still arriving is a
   * line the viewer watches the market being fitted to.
   */
  marks: [
    { support: { at: 7460, over: 22 }, buy: { at: 7486, over: 16 }, sell: { at: 7510, over: 16 } },
    { support: { at: 7576, over: 22 }, buy: { at: 7602, over: 16 }, sell: { at: 7626, over: 16 } },
  ],
} as const;

{
  const V = BREAKOUT;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/timing: ${m}`);
  };
  /** ⚠ EACH COLUMN'S CHART HAS TO BE DRAWN BEFORE ITS VERDICT. A tick under a
   *  chart that has not finished is a conclusion drawn from nothing. */
  V.cols.forEach((c, i) => {
    const drawn = c.tape.at + 55 * c.tape.step + c.tape.over;
    const said = V.verdict.at + i * V.verdict.step;
    if (said < drawn) fail(`verdict ${i + 1} lands at ${said}, before its chart finishes at ${drawn.toFixed(0)}`);
  });
  if (V.cols[1].at < V.cols[0].at) fail("the second column arrives before the first");
  /** ⚠ AND THE PICTURE HAS TO OUTLAST ITS OWN LAST MOVE, or the extension is a
   *  cut dressed as a hold. */
  const last = V.verdict.at + V.verdict.step + V.verdict.over;
  if (V.to <= last) fail(`SC09 ends at ${V.to}, before its second verdict lands at ${last}`);
  /** ⚠ AND THE READING IS IN ITS OWN ORDER — level, entry, exit. A "Sell" that
   *  lands before the "Buy" is a trade shown backwards. */
  V.marks.forEach((m, i) => {
    if (m.buy.at < m.support.at + m.support.over) {
      fail(`column ${i + 1}'s entry lands at ${m.buy.at}, before its support finishes at ${m.support.at + m.support.over}`);
    }
    if (m.sell.at < m.buy.at + m.buy.over) {
      fail(`column ${i + 1}'s exit lands at ${m.sell.at}, before its entry finishes at ${m.buy.at + m.buy.over}`);
    }
    const said = V.verdict.at + i * V.verdict.step;
    if (said < m.sell.at + m.sell.over) {
      fail(`verdict ${i + 1} lands at ${said}, before the trade it is judging closes at ${m.sell.at + m.sell.over}`);
    }
  });
}

/**
 * ═══ SCENE TRANSISI 6 ═══  Simon: "dari 8060 ke scene 10, tambahkan scene
 * transisi seleksi kartu ke 6".
 *
 * ⚠ IT LANDS ON THE NAMING, AND THAT IS THE POINT. The voice spends 8076–8194
 * on "Jangan terjebak indicator overload" — which is card six's own text. The
 * list is up, the pointer is on that card, and the words are read off the thing
 * the viewer is looking at. SC10 then opens having already been introduced.
 *
 * ⚠ 210, LIKE EVERY ROUND SINCE THE THIRD. The length is not a taste: the exit
 * is one card every four frames and eight of them take 210 frames to arrive,
 * be picked, and clear.
 */
export const ROW6 = {
  from: 8060,
  over: 210,
  /** ⚠ LEFT, like rounds four and five: what leaves is a page. */
  away: { at: 8060, over: 44 },
  row: {
    at: 8060,
    over: 60,
    step: 4,
    spread: 4,
    /**
     * ⚠ THE SIXTH CARD — Simon's "kartu ke 6", zero-based.
     *
     * ⚠ AND FOUR FRAMES LATER THAN ROUND FIVE'S, WHICH IS NOT A TASTE. The row
     * arrives one card every four frames, so the sixth card lands four frames
     * after the fifth; copying round five's 44 put the pointer on it two frames
     * before it existed. The assertion caught exactly that.
     */
    cursor: { at: 8108, over: 34, card: 5 },
    hover: { at: 8142, over: 46 },
    /** ⚠ FIVE DONE NOW. The list is a syllabus, and it keeps what it has done. */
    done: [0, 1, 2, 3, 4],
    out: { at: 8207, step: 4, over: 34 },
  },
} as const;

/* ═══ SC10 — indicator overload ══════════════════════════════════════════ */
export const OVERLOAD = {
  /**
   * ⚠ THE SCENE NOW OPENS WHERE ITS TRANSITION CLEARS, not where its block
   * does. Everything in here moved forward by 210 with `ROW6`, and it is worth
   * saying what that cost and what it did not: SC10's beats used to run 60
   * frames AHEAD of the words they belong to — the 7099 pad was voice-only, so
   * the picture had been leading the voice since then. Re-laying them against
   * the cue table has quietly closed that. Each one is now inside the sentence
   * that describes it, which is what the old comment claimed and the old
   * numbers no longer did.
   */
  from: ROW6.from + ROW6.over,
  /**
   * ⚠ AND IT OUTLIVES ITS BLOCK AT THE OTHER END — Simon: "scene 10 perpanjang
   * hingga 9050". SC11's window opens at 8998; the last 52 frames of this
   * picture are held over it. 9050 is four frames after this scene's last word.
   */
  to: 9050,
  /** 8296 · the title, arriving with the scene rather than under the card that
   *  already said it. */
  name: 8296,
  /** 8270 · as the row clears. */
  chart: { at: 8270, over: 56 },
  /**
   * ⚠ THE PANES ARRIVE BETWEEN 8336 AND 8472 — inside 8202–8476, the stretch
   * the voice spends on "Menambahkan banyak indikator tidak selalu menambah
   * kualitas analisis". The crowding IS the argument, so they land on the
   * sentence that describes it.
   */
  add: { at: 8336, step: 34, count: 5 },
  /** Which of the five read the same thing. Indexed, so re-ordering the panes
   *  in layout.ts re-orders the highlight with them. */
  similar: [1, 2, 4],
  /** 8560 · inside "Kalau beberapa indikator membaca hal yang mirip…" (8506). */
  lit: 8560,
  merge: { at: 8672, over: 40 },
  /** 8870 · inside "Lebih banyak indikator belum tentu berarti lebih banyak
   *  insight" (8824–9046). */
  close: 8870,
} as const;

{
  const V = OVERLOAD;
  const fail = (m: string) => {
    throw new Error(`022-ta-mistakes/timing: ${m}`);
  };
  /** ⚠ THE CHART HAS TO BE A CHART BEFORE THE FIRST PANE LANDS ON IT. The whole
   *  scene is about what happens when you pile indicators onto a reading; a
   *  pane arriving on a tape still drawing itself is piling onto nothing. */
  if (V.chart.at + V.chart.over > V.add.at) {
    fail(`SC10's chart finishes at ${V.chart.at + V.chart.over}, after its first pane at ${V.add.at}`);
  }
  if (V.name < V.chart.at) fail("SC10 is named before its chart exists");
  /** ⚠ NOTHING IN THE SCENE MAY START BEFORE THE SCENE DOES. Every beat here is
   *  a global frame turned local against `from`, so one left behind the move
   *  would not throw — it would simply be a beat that had already happened when
   *  the picture appeared. */
  const beats: [string, number][] = [
    ["chart", V.chart.at], ["name", V.name], ["first pane", V.add.at],
    ["lit", V.lit], ["merge", V.merge.at], ["close", V.close],
  ];
  beats.forEach(([n, at]) => {
    if (at < V.from) fail(`SC10's ${n} is at ${at}, before the scene opens at ${V.from}`);
    if (at > V.to) fail(`SC10's ${n} is at ${at}, after the scene ends at ${V.to}`);
  });
  const last = V.add.at + (V.add.count - 1) * V.add.step;
  if (V.lit < last) fail(`SC10 lights its panes at ${V.lit}, before the last one arrives at ${last}`);
  /** ⚠ AND THE COUNTER HAS TO COME BACK WHERE THE SCENE DOES. Its gap and its
   *  sixth entry are literals up at the head of this file — they cannot name
   *  ROW6, which is declared 1200 lines below them — so this is what keeps the
   *  three in step. */
  /** ⚠ THE THREE COUNTER CHECKS THAT WERE HERE ARE GONE WITH THE PICTURE. They
   *  held the chip's gap and its sixth and seventh entries to SC10's own window;
   *  the counter is now off for this whole stretch, so they would have been
   *  three assertions guarding a relationship that no longer exists. What they
   *  were protecting is written into `gaps` and `items` instead. */
  /** ⚠ AND SC09 HAS TO HAND OVER TO THE ROW THAT REPLACES IT — no bare frame
   *  between one picture ending and the next layer starting. */
  if (ROW6.from !== BREAKOUT.to) {
    fail(`round six starts at ${ROW6.from}, but SC09 is held to ${BREAKOUT.to}`);
  }
  if (ROW6.from + ROW6.over !== V.from) {
    fail(`round six clears at ${ROW6.from + ROW6.over}, but SC10 opens at ${V.from}`);
  }
}

/* ═══ SC11 — hindsight bias ══════════════════════════════════════════════ */
export const HINDSIGHT = {
  name: 9079,
  /**
   * The whole tape, already annotated, arrives finished.
   *
   * ⚠ BACK ON 9020, ITS OWN VO VALUE. It was moved to 9050 while SC10's picture
   * was held that far — it would otherwise have been uncovered a third of the
   * way through its own fade — and that picture is gone. Anything held past
   * 8998 again has to move this again; that is the whole of what 9050 knew.
   */
  chart: { at: 9020, over: 90 },
  obvious: 9170,
  /**
   * ⚠ THE MASK RUNS BACKWARDS HERE. Everywhere else in the library a reveal
   * mask opens; this one CLOSES over the right-hand side, hiding the future
   * that was already on screen. It is the same device SC12–SC13 use for real,
   * introduced first so the ADMR case reads as its application.
   */
  hide: { at: 9394, over: 56 },
  note: 9482,
  chips: 9672,
  close: 9874,
} as const;

/* ═══ SC12 + SC13 — the ADMR case (CG-B) ═════════════════════════════════ */
/**
 * ⚠ ONE TAPE, TWO SCENES. SC12 reads the evidence with the future masked;
 * SC13 opens the mask on THE SAME tape. Drawing it twice would delete the
 * whole point — that the evidence did not change, the reading of it did.
 */
export const ADMR = {
  chart: { at: 10060, over: 150 },
  title: 10165,
  uptrend: { at: 10397, over: 44 },
  triangle: { at: 10428, over: 60 },
  volume: 10560,
  macd: 10696,
  focus: 10810,
  rebound: 11048,
  /** The three evidence chips SC13 then turns over one at a time. */
  evidence: [
    { label: "UPTREND JANGKA PANJANG", at: 10397 },
    { label: "VOLUME MASIH AKTIF", at: 10560 },
    { label: "MACD HISTOGRAM HIJAU", at: 10696 },
  ],
  /* ── SC13 ───────────────────────────────────────────────────────────── */
  watch: 11080,
  ma100: { at: 11259, over: 60 },
  events: [
    { tag: "11 MEI 2026", label: "BREAK DI BAWAH MA100", at: 11358, hit: 11458 },
    { tag: "RETEST", label: "GAGAL KEMBALI KE ATAS MA100", at: 11620, hit: 11746 },
    { tag: "18 MEI", label: "SUPPORT TRIANGLE DITEMBUS", at: 11910, hit: 12020 },
  ],
  /** Which evidence chip each event turns over. Indexed by name in the scene,
   *  never by position — swapping two events must swap their frames, not their
   *  drawings. */
  turns: [
    { label: "UPTREND JANGKA PANJANG", at: 11458, strike: true },
    { label: "MACD HISTOGRAM HIJAU", at: 12020, strike: false },
  ],
  close: 12172,
} as const;

/* ═══ SC14 — asal copy trade ═════════════════════════════════════════════ */
/** ⚠ NO PRICES. The four rows differ in WORDS, not numbers: a made-up entry
 *  price beside a real-looking ticker is the fabricated number rule and the
 *  buy-marker rule at the same time. */
export const COPY = {
  name: 12425,
  cards: { at: 12470, over: 40 },
  /** ⚠ f12526 HAS NO AIR — cue 57 runs straight into 58. */
  same: 12526,
  rows: [
    { label: "TIMEFRAME", a: "Harian", b: "Mingguan", at: 12640 },
    { label: "HARGA ENTRY", a: "lebih awal", b: "lebih tinggi", at: 12668 },
    { label: "BATAS RISIKO", a: "lebih ketat", b: "lebih longgar", at: 12725 },
    { label: "RENCANA EXIT", a: "bertahap", b: "sekaligus", at: 12810 },
  ],
  close: 12946,
} as const;

/* ═══ SC15 — the question worth asking ═══════════════════════════════════ */
export const ASK = {
  shrink: { at: 13080, over: 34 },
  wrong: 13177,
  strike: 13260,
  better: [
    { text: "“KENAPA TRADE ITU DIAMBIL?”", at: 13339 },
    { text: "“KAPAN LOGIKANYA DIANGGAP SALAH?”", at: 13434 },
  ],
  close: 13627,
} as const;

/* ═══ SC16 — the process, six questions (CG-C) ═══════════════════════════ */
/**
 * ⚠ THE SIX QUESTIONS ARE NOT EVENLY SPACED, and that is not a defect to be
 * tidied. The gaps are 70 · 88 · 56 · 74 f, then 120 f to "Dan yang paling
 * penting:" and 117 f more to the sixth. They are spoken that way. Spreading
 * them on a grid is exactly how a build comes off its own voice.
 */
export const PROCESS = {
  rail: { at: 13730, over: 40 },
  pull: 13755,
  items: [
    { text: "“Trend-nya bagaimana?”", at: 13970 },
    { text: "“Level pentingnya di mana?”", at: 14040 },
    { text: "“Setup-nya apa?”", at: 14128 },
    { text: "“Volume mendukung?”", at: 14184 },
    { text: "“Timeframe lain sejalan?”", at: 14258 },
  ],
  /** The five go one step quiet while the voice says the sixth is the one. */
  quiet: 14378,
  sixth: { text: "“apa invalidation-nya?”", at: 14495 },
  /** One row empties out to show "satu bagian belum jelas". */
  blank: 14572,
  close: 14630,
} as const;

/* ═══ SC17 — cek dirimu sendiri ══════════════════════════════════════════ */
export const SELF = {
  /** The rail from SC16 shrinks to the left and STAYS. The process did not go
   *  away; what is being checked now is the person running it. (CG-C) */
  shrink: { at: 14798, over: 40 },
  panel: 14830,
  flags: [
    { label: "FOMO", at: 15029 },
    { label: "KESAL", at: 15054 },
    { label: "INGIN MEMBALAS LOSS", at: 15129 },
  ],
  stop: 15178,
  tool: 15305,
  notCertainty: 15377,
  /** ⚠ THE EMOTION CHIPS ARE NOT DELETED — they move out of the process's
   *  path. "Emosi boleh ada" is the line; deleting them would say the
   *  opposite. */
  move: { at: 15614, over: 40 },
  close: 15680,
} as const;

/* ═══ SC18 — the close ═══════════════════════════════════════════════════ */
/** ⚠ THE FOUR RULES ARE UNEVEN TOO: 102 · 130 · 150 f. Same rule as SC16. */
export const CLOSE = {
  ground: { at: 15754, over: 60 },
  simple: 15766,
  rules: [
    { cond: "BELUM LENGKAP", act: "TUNGGU", at: 15882 },
    { cond: "SUDAH INVALID", act: "KELUAR", at: 15984 },
    { cond: "KONDISI BERUBAH", act: "EVALUASI ULANG", at: 16114 },
    { cond: "ALASANNYA EMOSIONAL", act: "JANGAN DIPAKSAKAN", at: 16264 },
  ],
  collapse: { at: 16410, over: 40 },
  /** ⚠ THE SAME CARD THE ROADMAP OPENED ON, not one that looks like it — the
   *  mark over a bordered panel on the drifting grid, so the ending rhymes
   *  with the opening instead of introducing a new look at the last minute. */
  card: 16458,
  text: 16482,
  lines: ["No trade unless the conditions are met."],
  mark: "conditions are met",
} as const;

/** ⚠ AT THE FOOT OF THE FILE, because COUNTER is declared above CARD_LIST
 *  and a check between them cannot run before both exist.
 *
 *  ⚠ THE CARDS AND THE COUNTER ARE ONE LIST SAID TWICE. Worded differently on
 *  purpose — the cards are headings, the counter is a tag in caps — but they
 *  cannot disagree about HOW MANY mistakes this video has. Six cards against
 *  eight entries is the bug Simon just caught by hand. */
{
  if (CARD_LIST.titles.length !== COUNTER.items.length) {
    throw new Error(
      `022-ta-mistakes/timing: ${CARD_LIST.titles.length} cards against ${COUNTER.items.length} counter entries`,
    );
  }
}
