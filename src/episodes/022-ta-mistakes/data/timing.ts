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
  /**
   * Stretches the counter is OUT for.
   *
   * ⚠ SC12→SC14 is the ADMR case study: a worked example is not another entry
   * in the list, and leaving the counter up there files it as "mistake 07½".
   *
   * ⚠ SC06→SC07 is Simon's — "hapus tulisan Mistake 02 dan OVERTRADING". That
   * stretch is VIDEO 19's platform panel held still, a shot about what a chart
   * looks like rather than about a mistake being named, and a counter over it
   * would be labelling the wrong thing.
   *
   * ⚠ THE CONSEQUENCE, ON THE RECORD: entry 02 now never appears. Its window
   * was exactly this one, so the counter reads 01 … 03 and the list of eight
   * shows seven. Say the word and it can move to wherever overtrading is
   * actually discussed instead.
   */
  gaps: [
    { from: BLOCK.SC06, to: BLOCK.SC07 },
    { from: BLOCK.SC12, to: BLOCK.SC14 },
  ],
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
  over: 2288,
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
  titles: [
    "Entry tanpa tahu kapan salah",
    "Overtrading",
    "Revenge Trading",
    "Confirmation Bias",
    /** ⚠ SPELT CORRECTLY. Simon typed "Hindisght"; the same mistake is named
     *  "HINDSIGHT BIAS" by the counter in SC11, and two spellings of one term
     *  in one video is the kind of thing only the video notices. */
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
  zig: { at: 4501, over: 44 },
  /** 4679 — the chart's own extremes, drawn as two lines. */
  levels: { at: 4679, over: 30 },
  /** 4775 — everything drawn ON the chart goes. The chart itself stays. */
  clear: { at: 4775, over: 24 },
  /** 4894 — the panel shrinks toward the middle, making room under it. */
  shrink: { at: 4894, over: 40, by: 0.72 },
  /** And the sentence that room was made for. */
  note: { at: 4944, perChar: 2 },
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
