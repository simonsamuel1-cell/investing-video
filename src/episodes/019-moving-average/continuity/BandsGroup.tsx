/**
 * CG-B — Scenes 08 + 09 + 10 as ONE spanning Sequence (global 4227 → 6086).
 *
 * [PLACEHOLDER] The candles are traced by eye from Simon's crop — see
 * `BANDS_1` in data/shots.ts. That crop names a real instrument this scene
 * does not, so only its SHAPE is used and the chart carries neither ticker nor
 * price axis, the same treatment every other traced chart in the episode gets.
 *
 * The chart and its bands mount once and persist. The bands keep breathing
 * across the internal boundary: Scene 09's squeeze is a stretch of Scene 08's
 * own demonstration, not a new chart, and a remount would restart the breath
 * the viewer has just been taught to read.
 *
 * ⚠ COMPLIANCE (Scene 09). The scene's only claim about what follows a squeeze
 * is the pair of arrows with a question mark between them. They are generated
 * from ONE geometry with a mirrored sign flip — identical run, rise, stroke and
 * colour, enforced by construction rather than by eye. If one read as more
 * prominent, a volatility explainer would become a directional call.
 *
 * The struck `SQUEEZE = BULLISH / BEARISH → DIRECTION = UNKNOWN` panel that
 * used to close the scene is GONE at Simon's direction, along with
 * `SQUEEZE = MOVE MAY BE COMING`. The arrows carry what they carried: two
 * outcomes drawn to the same weight, and a question mark instead of an answer.
 */
import { useCurrentFrame } from "remotion";
import { Stage } from "../../../core";
import { ChartFrame, gridOf, Layer } from "../components/ChartFrame";
import { BollingerBands } from "../components/BollingerBands";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { QuoteBox } from "../components/QuoteBox";
import { Arrow } from "../components/Arrow";
import { theme } from "../theme";
import {
  sec,
  bollinger,
  layoutMode,
  progress,
  progressInOut,
  fadeOut,
} from "../helpers";
import { domainOf, type Bar } from "../series";
import { BANDS_OHLC, BANDS_PRIOR, BANDS_EXT } from "../data/shots";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/**
 * Global → local. The beats below are quoted in Simon's GLOBAL frames, so the
 * group can be moved by changing FROM alone.
 */
const FROM = 4227;
const at = (global: number) => global - FROM;
const T = {
  title: sec(0.0),
  /**
   * THE CANDLES ARE SIMPLY THERE. The roadmap dissolves onto this chart, and a
   * dissolve that lands on an empty card and then draws one is two entrances
   * where the scene only has room for none: by 4227 the picture has to already
   * be the thing the fade revealed.
   */
  price: 0,
  priceOver: 1,
  /** The middle band — a moving average — traced in from the left. */
  mid: at(4256),
  midOver: at(4328) - at(4256),
  /**
   * Then the outer pair TRAVELS in from the left, and the channel fills behind
   * it. Not an unfold out of the middle any more — Simon's call, and the two
   * cannot be combined: a band that grows outward while also travelling across
   * reads as neither move.
   */
  bands: at(4344),
  bandsOver: at(4540) - at(4344),
  /** The average's name is gone before the bands arrive. */
  maLabelOut: at(4324),
  /**
   * The two volatility call-outs arrive on their own lines — "Saat market
   * tenang, band menyempit" at 4548 and "Saat pergerakan membesar, band ikut
   * melebar" at 4605 — but they LEAVE together at 4774.
   *
   * They used to clear as soon as the next sentence began, and Simon was right
   * that it read as rushed. Holding them means the pinch and the two openings
   * are on screen at once under "Bollinger Bands seperti bernapas mengikuti
   * energi pasar" (4676–4761), which is the line that needs all three: the
   * breath is the contrast between them, and it cannot be seen one at a time.
   *
   * THE TWO WIDE ONES then go at 4845 and the PINCH stays. That is not an
   * asymmetry for its own sake: "Salah satu kondisi yang paling berguna"
   * begins at 4785 and the squeeze beat follows it, so the stretch the scene
   * is about to call a squeeze is the one already lit. Leaving it up is what
   * makes the squeeze land on ground the viewer has already been shown.
   */
  calm: at(4547),
  active: at(4601),
  wideGone: at(4845),
  // ── Scene 09 ──
  /**
   * The name lands and the camera closes on the stretch it names, together —
   * "diperhatikan adalah squeeze" runs 4839–4879. One gesture: a label that
   * arrives and THEN a move would say the two are about different things.
   */
  squeezeName: at(4836),
  zoomOver: 44,
  /** The line the squeeze beat leaves you with, on its own cue (4925). */
  quote: at(4923),
  /**
   * And it CLEARS at 5080, before the frame steps across — a sentence hung off
   * the window would either travel with it or be left behind by it, and both
   * read as a mistake. It has had five seconds, which is its own length twice
   * over.
   */
  quoteOut: at(5080),
  /**
   * THE FRAME STEPS RIGHT, so the squeeze sits at the left and the space the
   * two directions need opens beside it. Same beat as the quote leaving: the
   * move is what replaces it.
   *
   * It is a PAN, not a second zoom — the scale reached at 4880 is held, and
   * only the offset changes, so the squeeze is the same size before and after
   * and the step reads as the camera tracking rather than closing again.
   */
  pan: at(5080),
  panOver: 40,
  /**
   * "Tapi squeeze tidak memberi tahu arahnya" (5137–5208). The tape right of
   * the squeeze is CLEARED — what happens next is exactly what the sentence
   * says nobody knows, so leaving it on screen answers the question the scene
   * is about to ask.
   */
  clearRight: at(5140),
  clearOver: 30,
  /** "Harga bisa breakout ke atas atau ke bawah" (5216–5277). */
  arrows: at(5220),
  /**
   * The scene's answer to its own question mark, on its cue (5298–5409).
   *
   * It lands in the SAME place the squeeze's line hung, and that is the point:
   * one box, replaced. A second box somewhere new would read as two asides
   * rather than as the conclusion of the first — and this stretch was six dead
   * seconds of held frame until it arrived.
   */
  closing: at(5298),
  /**
   * ═══ THE HANDOVER (5417 → 5447) ═══
   *
   * The group hands the chart to Scene 10. Everything Scene 09 added — the
   * veil, the window, its name, the quote, the arrows, the heading — is
   * cleared and the cut tape is restored.
   *
   * ⚠ THE CAMERA DOES NOT PULL BACK. Simon's call, and it is the difference
   * between a scene ending and a scene continuing: the frame KEEPS its zoom
   * and simply travels right, off the squeeze and onto the rally that came out
   * of it. Widening to the whole chart would announce a new beginning; holding
   * the magnification and moving says the next thing is further along the same
   * tape, which is exactly what Scene 10 argues.
   *
   * TWO SPEEDS, on purpose. The marks go over the first 14 frames and the
   * travel takes all 30. They are anchored to the squeeze, so a mark still
   * fading while the frame slides would be moving AND dissolving at once —
   * two gestures on one object, which reads as a glitch. Clearing them first
   * leaves the move with nothing to drag.
   */
  reset: at(5417),
  resetOver: 30,
  marksOut: 14,
  /**
   * ═══ SCENE 10, ON THE SAME TAPE (5453 → 6085) ═══
   *
   * ⚠ RE-CUED. Scene 10's own beats were calibrated when it began at 5366 —
   * its docstring still says so — and it has since been pushed to 5453 without
   * its cues moving with it, so every beat in the standalone version fires 87
   * frames after the sentence it belongs to. The strike through `Sell?` is the
   * clearest casualty: it lands at 5783, well after "menyentuh upper band
   * bukan otomatis sinyal jual" has finished at 5714.
   *
   * These are cued to the VO as it actually is. That means part of what looks
   * better here is the timing, not the continuity — see the note to Simon.
   */
  /** "Ada satu jebakan yang sering terjadi pada pemula" (5420–5503). */
  trap: at(5453),
  /**
   * The touches themselves, ringed (5550–5726). They arrive under "harga bisa
   * terus bergerak dekat upper band" and leave the instant "Dalam uptrend
   * sehat" begins — so the ovals and the `Walking the Band` chip never share
   * the frame. Two marks on the same stretch at once would be one mark too
   * many, and the chip is the conclusion the ovals are the evidence for.
   */
  touches: at(5550),
  touchesGone: at(5726),
  /**
   * The trap said in the episode's own voice, on its own cue: "Jadi, menyentuh
   * upper band bukan otomatis sinyal jual" runs 5627–5714. The rings are the
   * evidence and this is the reading of it, which is why they overlap rather
   * than follow each other.
   */
  trapQuote: at(5620),
  /* WITH THE RINGS, not after them. Simon's call, and it is the right one:
     the sentence is the reading of those two marks, so it has nothing to sit
     under once they are gone. Same frame, one gesture. */
  trapQuoteOut: at(5726),
  /**
   * ═══ THE TAPE RUNS ON (5810 → 5840) ═══
   *
   * Sixty-five more bars PRINT, one at a time, while the frame travels right
   * and up to meet them.
   *
   * TWO LENGTHS, on purpose. The camera settles at 5840 and the tape keeps
   * printing to 5890 — Simon's call, and it is what makes the beat read as the
   * chart growing rather than as a picture being panned across. The frame
   * arrives first and fifty more frames of bars land in front of a camera that
   * has already stopped, which is where the eye is by then.
   *
   * It now runs right up to the closing quote at 5888, so the last bars are
   * still printing as the sentence opens. That is the right overlap: the line
   * is about where price sits against its bands, and it lands on a tape that
   * is still putting price there.
   *
   * The first bars print off the right edge, because at 5810 the old tape's
   * last bar is still on the right margin. They come into view as the frame
   * eases back, already drawn — which is the correct order: the tape is
   * running ahead of the camera, not waiting for it.
   */
  grow: at(5810),
  growOver: 30,
  printOver: at(5890) - at(5810),
  /** The line the scene closes on (5889–6038). */
  lastQuote: at(5888),
  lastQuoteOut: at(6040),
};
const PERIOD = 20;
const TICKS = [4400, 4800, 5200, 5600, 6000, 6400];
/**
 * And the levels the new stretch climbs through, at the same 400 step.
 *
 * ⚠ A SEPARATE LIST, not an extension of the one above. The plot has 12%
 * padding, so 6800 still lands INSIDE the box even though this tape's own
 * highest bar is 6519 — merge the two and a gridline nobody asked for appears
 * across Scenes 08 and 09. These are only ever handed to `ChartFrame` once
 * the tape has actually run on, and the span's own top then decides which of
 * them exist yet.
 */
const TICKS_UP = [...TICKS, 6800, 7200, 7600, 8000, 8400, 8800, 9200];
/** How far the grid stands off the tape it follows. */
const GRID_PAD = 60;
/** Where the moving average's own name attaches — mid-range, clear of the tape. */
const LABEL = { mid: 42 };
// ═══════════════════════════════════════════════════════════════════════════

const BARS: Bar[] = BANDS_OHLC.map(([o, h, l, c]) => ({ o, h, l, c }));
const SERIES = BARS.map((b) => b.c);
/**
 * ═══ THE TAPE RUNS ON ═══
 *
 * Sixty-five more bars to the right, drawn on the SAME grid: `G.x` is linear
 * in the bar index, so index 130 and up simply land 13.116px apart past the
 * card's edge. That is the whole trick, and it is why nothing before them
 * moves — the grid is still built on the original 130, so the squeeze, the
 * zones, the rings and every framing this group has already settled are
 * computed from exactly the numbers they were computed from before.
 */
const EXT: Bar[] = BANDS_EXT.map(([o, h, l, c]) => ({ o, h, l, c }));
const TAPE = [...BARS, ...EXT];
const TAPE_C = TAPE.map((b) => b.c);
/**
 * THE BANDS START AT THE LEFT EDGE, because the crop's do. `BANDS_PRIOR` is
 * the nineteen closes its window does not show — solved from the band the crop
 * draws at bar 0, not seeded with noise, which is why the opening channel is
 * the reference's own width rather than a plausible one.
 */
const PRIOR = BANDS_PRIOR;
/* over the JOINED closes: the channel across the junction is one 20-bar
   calculation, not two channels stitched. `bollinger` only ever looks back, so
   the first 130 values are bit-identical to what they were. */
const RAW = bollinger([...PRIOR, ...TAPE_C], PERIOD, 2);
const BB = {
  mid: RAW.mid.slice(PRIOR.length),
  upper: RAW.upper.slice(PRIOR.length),
  lower: RAW.lower.slice(PRIOR.length),
};
/**
 * ⚠ THE FIRST 130 BARS ONLY. The extension climbs 638px above where this tape
 * ends; letting it into the domain would rescale the whole chart to fit it and
 * every scene before 5810 would be redrawn smaller to make room for bars the
 * viewer has not seen. The grid stays exactly what it was and the new bars
 * simply map ABOVE the plot, which is what the camera then travels up to.
 */
const DOMAIN = domainOf(
  [...SERIES, ...BB.lower.slice(0, SERIES.length), ...BB.upper.slice(0, SERIES.length)],
  BARS,
);

/**
 * ═══ WHERE THE CHANNEL PINCHES, AND WHERE IT OPENS ═══
 *
 * ⚠ FOUND, NOT PLACED. These are RUNS of bars whose channel width sits under
 * or over a fraction of this tape's own range — not eyeballed rectangles.
 * Pointing at a pinch that was staged would teach a shape rather than a
 * reading, and if the tape is ever re-read the zones move with it.
 *
 * Three rules turn raw runs into things a scene can point at:
 *
 *   MIN    a run shorter than a few bars is a wobble, not a stretch.
 *   GAP    two runs separated by a handful of bars are ONE stretch: a
 *          highlight that blinks off for six bars and back on makes two claims
 *          where the tape only makes one. Merging is what turns the rally's
 *          two bursts into the single wide stretch Simon counted.
 *   EDGE   a zone is CLIPPED to the drawable margin, never dropped for
 *          crossing it — the last twelve bars are genuinely the widest the
 *          channel gets, and discarding them for touching the edge would be
 *          the search refusing to see the obvious.
 *
 * ⚠ TO MOVE ONE BY HAND, edit `ZONE` below. The numbers are BAR INDICES into
 * BANDS_OHLC, 0 … 129 — `{ from, to }`, inclusive. Set `ZONE.narrow` or
 * `ZONE.wide` to a literal array and the search is bypassed for that one.
 */
const ZONE_RULE = {
  /** Channel width, as a fraction of this tape's own min→max width. */
  narrowUnder: 0.3,
  wideOver: 0.6,
  minLen: 8,
  gap: 16,
  edge: 4,
};
type Zone = { from: number; to: number };
/** How far each box stands off the channel it encloses. */
const ZONE_PAD = 16;
/**
 * How far the rest of the chart steps back while a zone is lit. 0.72 leaves
 * the un-lit tape at a bit over a quarter strength — still legible as context,
 * which it has to be, because the claim is a COMPARISON between the lit
 * stretch and the rest.
 */
const SPOT = { veil: 0.72, grow: 18 };
/** How far the camera closes on the squeeze, and where it puts it. */
const CAM = { amount: 1.55, to: { x: 960, y: 470 } };
/**
 * How far the frame then steps right — i.e. how far the picture slides LEFT.
 *
 * 300 lands the squeeze's left edge at 157 and its right edge at 1163, leaving
 * the arrows (26 + 300 of run) ending near 1490 with three hundred px of clear
 * ground past them. Any less and the arrowheads crowd the safe margin the way
 * they did before the step; any more and the squeeze itself starts falling off
 * the left.
 */
const PAN = { dx: 300 };
/**
 * WHERE THE FRAME LANDS AT 5447 — the uptrend, at the SAME magnification.
 *
 * `left` is where the breakout bar sits on screen. Not the safe margin itself:
 * `Sell?` is centred on that bar, so a bar at 96 would have half its chip cut
 * off. 250 gives the chip its room and still puts the squeeze fully off-frame,
 * which is the whole instruction — what is visible is only the rally.
 *
 * `right` is the right safe margin, and reaching it is a STRETCH — the frame
 * widens horizontally only, from 1.55× to about 2.56×, while the vertical
 * magnification stays at 1.55×. Scaling both to fill the width would make the
 * rally 1056px tall against 918px of safe height, so the top of the channel
 * would leave the frame. Simon asked for the tape to reach the margin, and a
 * horizontal stretch is the only way to get there without losing the top.
 */
const HAND = { left: 250, right: 1824, y: 513 };
/**
 * ⚠ AND WHERE IT GOES ONCE THE TAPE RUNS ON — the new stretch, FITTED.
 *
 * The frame eases back about 20% here, and it has to. The rally rises 638
 * chart-px, which is more than the whole plot is tall, so at the magnification
 * the squeeze beat left behind only about twenty of its sixty-five bars fit
 * between the top and bottom of the frame — the first attempt ran the candles
 * straight off the top edge and through the logo.
 *
 * It is barely a zoom-out and it does not change the candles' SHAPE: fitting
 * the width gives 2.06 against 2.55 and fitting the height gives 1.24 against
 * 1.55, which is the same ratio to within a percent. The bars stay the shape
 * they were and there are simply more of them.
 *
 * ⚠ IT FITS UNDER THE LOGO, not into the safe area. Fitting the full safe
 * height put the top of the channel at y 90, straight through the top-right
 * clear-zone — the cyan band ran behind the wordmark. `top` is the first line
 * the chart may touch and `bottom` leaves the subtitle band alone.
 *
 * And it fits at the stretch's OWN ASPECT rather than to both edges
 * independently, so the candles keep their proportions and only their size
 * changes. Everything is computed from the extension's own box, so if the
 * tape is ever re-read the frame follows it instead of being re-tuned.
 */
const GROW = { top: 170, bottom: 950 };
/** The two directions a squeeze can break, and the question between them. */
const BREAK = { run: 300, rise: 210, gap: 26, mark: 132 };
/**
 * The scene's two asides. Both hang 50px UNDER the squeeze window — Simon's
 * call, and it is what makes each sentence belong to that stretch of tape
 * rather than to the scene in general. Below, because the window's own name
 * already sits 20px above it.
 *
 * They never coexist, and they share the anchor deliberately: the closing line
 * arrives where the squeeze's line left, so it reads as the same box saying
 * the next thing.
 */
const QUOTE = {
  gap: 50,
  /** "Saat squeeze, biasanya sideways & volatility rendah." Two lines. */
  squeeze: { w: 760, h: 118 },
  /** The closing line. ONE line, so 76 tall and narrower. */
  closing: { w: 660, h: 76 },
  /** The trap's line. One line too, but a longer one. */
  trap: { w: 700, h: 76, y: 880 },
  /** The scene's last word. Two lines. */
  last: { w: 820, h: 118, y: 850 },
};
/**
 * Extra HEIGHT for individual windows, in px, split evenly above and below so
 * the window stays centred on the channel it encloses.
 *
 * A window is as tall as the channel inside it, which is right for the wide
 * ones and too tight for the flat ones: where the band pinches, a box that
 * hugs it is a letterbox, and a letterbox does not read as a region. The two
 * flattest windows are given 50px each. Index matches ZONE.narrow / ZONE.wide.
 */
const ZONE_TALLER = { narrow: [50], wide: [50, 0] };

/* the zone search reads the ORIGINAL tape only — a stretch found in the
   extension would be a claim about bars the squeeze beat never showed */
const WIDTH = BB.upper.slice(0, SERIES.length).map((u, i) =>
  u === null || BB.lower[i] === null ? null : u - (BB.lower[i] as number),
);
const WIDE_MIN = Math.min(...WIDTH.filter((w): w is number => w !== null));
const WIDE_MAX = Math.max(...WIDTH.filter((w): w is number => w !== null));
const level = (q: number) => WIDE_MIN + (WIDE_MAX - WIDE_MIN) * q;

const findZones = (test: (w: number) => boolean): Zone[] => {
  const raw: Zone[] = [];
  let start = -1;
  WIDTH.forEach((w, i) => {
    if (w !== null && test(w)) {
      if (start < 0) start = i;
    } else if (start >= 0) {
      raw.push({ from: start, to: i - 1 });
      start = -1;
    }
  });
  if (start >= 0) raw.push({ from: start, to: WIDTH.length - 1 });

  const merged: Zone[] = [];
  for (const z of raw) {
    const last = merged[merged.length - 1];
    if (last && z.from - last.to <= ZONE_RULE.gap) last.to = z.to;
    else merged.push({ ...z });
  }
  const last = WIDTH.length - 1;
  return (
    merged
      .filter((z) => z.to - z.from + 1 >= ZONE_RULE.minLen)
      /* NOT the opening run. The first PERIOD bars' bands are computed from
       history this chart does not show, so they are the least trustworthy
       stretch on it and the worst one to point at — and it is why the quiet
       base reads as a pinch at all. Simon counted one narrow zone, not two,
       and this is the rule that agrees with him for a reason. */
      .filter((z) => z.from >= PERIOD)
      .map((z) => ({ from: z.from, to: Math.min(last - ZONE_RULE.edge, z.to) }))
      .filter((z) => z.to > z.from)
  );
};

/** The one stretch where the channel pinches, and the two where it opens. */
const ZONE = {
  narrow: findZones((w) => w < level(ZONE_RULE.narrowUnder)),
  wide: findZones((w) => w > level(ZONE_RULE.wideOver)),
};

/**
 * ═══ WHERE THE BAND GETS WALKED ═══
 *
 * ⚠ FOUND, NOT PLACED, and this is the whole reason Scene 10 can live on this
 * tape at all. `TOUCH` is the FIRST bar after the squeeze that closes at or
 * above the upper band — the exact moment a beginner reads "overbought" — and
 * `WALK` is where the price has got to while that thought was still standing.
 *
 * Searching AFTER the squeeze matters: the tape touches its upper band inside
 * the quiet stretch too, and a chip pinned there would have the price go
 * nowhere, which is the opposite of the claim.
 */
const TOUCH = (() => {
  const after = ZONE.narrow[0].to;
  for (let i = after + 1; i < SERIES.length; i++) {
    const u = BB.upper[i];
    if (u !== null && SERIES[i] >= u - 12) return i;
  }
  return after + 6;
})();
/* NO `WALK`. It was the bar the "Walking the Band" chip hung over, and the
   chip is gone — the two rings and the sentence under them carry that beat. */

/**
 * ═══ WHERE THE PRICE ACTUALLY TOUCHES THE BAND ═══
 *
 * ⚠ FOUND, NOT PLACED. Every bar in the rally that closes at or above the
 * upper band, gathered into RUNS — because that is how they occur. The point
 * of an oval rather than a ring is that a touch is not one candle: the price
 * leans on the band for a stretch, and marking one bar of that stretch would
 * teach the opposite of the thing being shown.
 *
 * `TOUCH_GAP` merges runs a couple of bars apart. A single bar dipping off the
 * band mid-lean is not the end of the lean, and two ovals side by side would
 * claim it was.
 */
/**
 * ⚠ HAND EXTENSION, one per run, in bars. Simon's eye rather than the test:
 * the lean does not end where a strict `close ≥ upper` ends. The second run's
 * next two bars are still riding the band's shoulder, and a ring that stopped
 * short of them looked like it had missed them. Index matches `TOUCH_RUNS`.
 */
const RUN_EXTEND = [0, 2];
const TOUCH_GAP = 4;
const TOUCH_RUNS = (() => {
  const hit: number[] = [];
  for (let i = TOUCH; i < SERIES.length; i++) {
    const u = BB.upper[i];
    if (u !== null && SERIES[i] >= u - 12) hit.push(i);
  }
  const runs: Zone[] = [];
  for (const i of hit) {
    const last = runs[runs.length - 1];
    if (last && i - last.to <= TOUCH_GAP) last.to = i;
    else runs.push({ from: i, to: i });
  }
  return runs.map((z, k) => ({
    from: z.from,
    to: Math.min(SERIES.length - 1, z.to + (RUN_EXTEND[k] ?? 0)),
  }));
})();
/**
 * How far each ring stands off the candles it encircles, on screen.
 *
 * CIRCLES, not ellipses — Simon's call. `r` is the larger of the two half-
 * extents, so the ring is as wide as the run needs AND as tall as the candles
 * in it need, whichever is the binding one. On this tape the two come out at
 * the same radius, which is worth keeping: two marks of equal weight make the
 * same claim twice, and one drawn bigger would rank them.
 */
const RING = { padX: 26, padY: 30, fill: 0.1, grow: 16 };

/* NO `assertBlocks` — the group renders no TextBlock at all now. Everything it
   says is the chart, the window, the rings, the arrows and three quote boxes,
   and no two of those are ever up together. */

export const BandsGroup = () => {
  const f = useCurrentFrame();
  /**
   * ONE LAYOUT, ALL THE WAY THROUGH. There used to be a switch to mode B at
   * 5169 that shrank the chart into the left half to make room for a panel.
   * It cannot stay: the camera is already closing on the squeeze and the tape
   * right of it is already cleared, so a third move on the same geometry made
   * the picture wander — the chart visibly slid right between 5180 and 5260
   * while nothing in the scene asked it to.
   *
   * The text blocks are unaffected: `TextBlock mode="B"` places itself in
   * `panelB` on its own and never read this.
   */
  /* ONE LAYOUT, FULL STRENGTH, ALL THE WAY THROUGH. The mode-C stop existed
     to dim the chart under Scene 10's closing block, and that block is gone —
     there is nothing left to read over it, and the quote that replaced it is
     opaque. */
  const box = layoutMode(f, [{ at: 0, mode: "A" }]);
  /* NO right-hand gutter: it reserved room for the price labels this chart no
     longer draws, and an empty 150px strip just narrows the tape. */
  const G = gridOf(SERIES, DOMAIN, box, 0.12, 0);
  /**
   * HOW MUCH TAPE EXISTS AT THIS FRAME.
   *
   * The extension does not exist at all until 5810 and then prints a bar at a
   * time. Nothing before it can be disturbed by that: the grid is built on the
   * original 130, so bar 131 arriving changes no coordinate that any earlier
   * beat was measured against.
   *
   * `progress` rather than a linear count, because that is the curve every
   * other draw in this episode uses — `ChartFrame`'s own tape reveal included.
   * The bands are sliced to the same N, so the channel grows with the candles
   * instead of running ahead of them to an end the viewer cannot see yet.
   */
  const printed = progress(f, T.grow, T.printOver);
  const N = SERIES.length + Math.round(EXT.length * printed);
  /**
   * ═══ THE GRID FOLLOWS THE TAPE ═══
   *
   * Simon: the new bars were standing on blank white. They were — the grid is
   * drawn in the plot box and the extension is entirely outside it, to the
   * right and 638px above.
   *
   * So once the tape runs on, the gridlines run on with it: `x2` reaches the
   * last bar that has printed, and `y1` is the top of what has printed, which
   * means a price level appears exactly when the tape climbs through it. That
   * is also what keeps 6800 out of Scenes 08 and 09 — until a bar is drawn up
   * there, the level is not in the span and is not drawn.
   */
  const gridSpan =
    N > SERIES.length
      ? (() => {
          let top = box.y;
          for (let i = SERIES.length; i < N; i++) {
            const u = BB.upper[i];
            top = Math.min(
              top,
              G.y(TAPE[i].h),
              u === null ? Infinity : G.y(u),
            );
          }
          return {
            x1: box.x,
            x2: G.x(N - 1) + GRID_PAD,
            y1: top - GRID_PAD,
            y2: box.y + box.h,
          };
        })()
      : undefined;
  /** The outer pair, travelling in from the left edge. */
  const bandTrace = progressInOut(f, T.bands, T.bandsOver);
  /**
   * A zone's box, in the chart's own coordinates. The vertical edges are the
   * widest the channel gets INSIDE that zone, padded — so the box is the shape
   * of the thing it is claiming rather than a band across the whole plot.
   */
  const zoneBoxOf = (z: { from: number; to: number }, taller = 0) => {
    let top = Infinity;
    let bot = -Infinity;
    for (let i = z.from; i <= z.to; i++) {
      const u = BB.upper[i];
      const l = BB.lower[i];
      if (u !== null) top = Math.min(top, G.y(u));
      if (l !== null) bot = Math.max(bot, G.y(l));
    }
    return {
      x1: G.x(z.from) - ZONE_PAD,
      x2: G.x(z.to) + ZONE_PAD,
      y1: top - ZONE_PAD - taller / 2,
      y2: bot + ZONE_PAD + taller / 2,
    };
  };

  /**
   * ═══ THE CAMERA ═══
   *
   * It closes on the squeeze window and carries it to the middle of the frame,
   * the same dolly the roadmap uses: a plain scale about the window's centre
   * would grow it in place, well left of centre, and leave the move reading as
   * the picture inflating rather than the camera approaching.
   *
   * It moves the CHART ONLY. The label, the quote and the closing blocks are
   * annotation — they sit at the sizes and margins the episode fixes for them,
   * and a camera that scaled the type would break both.
   */
  const SQ = zoneBoxOf(ZONE.narrow[0], ZONE_TALLER.narrow[0] ?? 0);
  /** How far the group has handed the chart back. 1 → as it was at 4227. */
  const reset = progressInOut(f, T.reset, T.resetOver);
  /** Everything the scene drew on top, on its own faster curve. */
  const marks = 1 - progressInOut(f, T.reset, T.marksOut);
  const zp = progressInOut(f, T.squeezeName, T.zoomOver);
  const zs = 1 + (CAM.amount - 1) * zp;
  const zc = { x: (SQ.x1 + SQ.x2) / 2, y: (SQ.y1 + SQ.y2) / 2 };
  /**
   * The step right is ONE MORE TERM IN THE SAME OFFSET, not a second transform.
   * That is what keeps every mark anchored: `px`/`py` below read this offset,
   * so the window's name, the cut edge, the arrows and the question mark are
   * all computed FROM the squeeze rather than parked at coordinates that would
   * have to be moved by hand every time the camera does.
   */
  const pan = progressInOut(f, T.pan, T.panOver) * PAN.dx;
  /**
   * TWO FRAMINGS, ONE MAGNIFICATION, and `reset` travels between them.
   *
   * Both are expressed as an OFFSET at the same scale, which is what keeps the
   * handover a pure translation — write it as a second zoom target and the
   * frame would breathe on the way across, however carefully the numbers were
   * matched.
   */
  const onSqueeze = {
    x: (CAM.to.x - zc.x) * zp - pan,
    y: (CAM.to.y - zc.y) * zp,
  };
  /** The rally the squeeze broke into: bar `TOUCH` to the end of the tape. */
  const UP = (() => {
    let x1 = Infinity;
    let x2 = -Infinity;
    let y1 = Infinity;
    let y2 = -Infinity;
    for (let i = TOUCH; i < BARS.length; i++) {
      const u = BB.upper[i];
      const l = BB.lower[i];
      x1 = Math.min(x1, G.x(i));
      x2 = Math.max(x2, G.x(i));
      y1 = Math.min(y1, G.y(BARS[i].h), u === null ? Infinity : G.y(u));
      y2 = Math.max(y2, G.y(BARS[i].l), l === null ? -Infinity : G.y(l));
    }
    return { x1, x2, y1, y2 };
  })();
  /**
   * THE STRETCH. Horizontal magnification alone rises, from the squeeze's
   * 1.55× to whatever puts the rally's two ends on Simon's two margins. The
   * vertical stays at 1.55× — see `HAND`.
   */
  const sxTrend = (HAND.right - HAND.left) / (UP.x2 - UP.x1);
  const sxSettled = zs + (sxTrend - zs) * reset;
  const onTrend = {
    x: HAND.left - zc.x - (UP.x1 - zc.x) * sxTrend,
    y: HAND.y - zc.y - ((UP.y1 + UP.y2) / 2 - zc.y) * zs,
  };
  /** The new stretch's own box, bands included. */
  const EXTBOX = (() => {
    let y1 = Infinity;
    let y2 = -Infinity;
    for (let i = SERIES.length; i < TAPE.length; i++) {
      const u = BB.upper[i];
      const l = BB.lower[i];
      y1 = Math.min(y1, G.y(TAPE[i].h), u === null ? Infinity : G.y(u));
      y2 = Math.max(y2, G.y(TAPE[i].l), l === null ? -Infinity : G.y(l));
    }
    return {
      x1: G.x(SERIES.length),
      x2: G.x(TAPE.length - 1),
      y1,
      y2,
    };
  })();
  const L = theme.layout;
  const FIT = {
    w: L.width - L.safeLeft - L.safeRight,
    h: GROW.bottom - GROW.top,
    cx: L.width / 2,
    cy: (GROW.top + GROW.bottom) / 2,
  };
  /** The stretch's own aspect — what the candles' proportions are made of. */
  const ASPECT = sxTrend / zs;
  const syGrow = Math.min(
    FIT.h / (EXTBOX.y2 - EXTBOX.y1),
    FIT.w / (EXTBOX.x2 - EXTBOX.x1) / ASPECT,
  );
  const sxGrow = syGrow * ASPECT;
  const onGrow = {
    x: FIT.cx - zc.x - ((EXTBOX.x1 + EXTBOX.x2) / 2 - zc.x) * sxGrow,
    y: FIT.cy - zc.y - ((EXTBOX.y1 + EXTBOX.y2) / 2 - zc.y) * syGrow,
  };
  const grow = progressInOut(f, T.grow, T.growOver);
  const settled = {
    x: onSqueeze.x + (onTrend.x - onSqueeze.x) * reset,
    y: onSqueeze.y + (onTrend.y - onSqueeze.y) * reset,
  };
  const zt = {
    x: settled.x + (onGrow.x - settled.x) * grow,
    y: settled.y + (onGrow.y - settled.y) * grow,
  };
  /* the two magnifications travel with the offset, so both ends of the move
     are exact and nothing has to be kept in step by hand */
  const sx = sxSettled + (sxGrow - sxSettled) * grow;
  const sy = zs + (syGrow - zs) * grow;
  const camera = {
    transform: `translate(${zt.x.toFixed(1)}px, ${zt.y.toFixed(1)}px) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`,
    transformOrigin: `${zc.x}px ${zc.y}px`,
  };
  /** A canvas point as the camera leaves it — for anything drawn OUTSIDE it. */
  const px = (x: number) => zc.x + (x - zc.x) * sx + zt.x;
  const py = (y: number) => zc.y + (y - zc.y) * sy + zt.y;
  /** The squeeze's right edge, on screen. Everything past it is cleared. */
  const edge = px(SQ.x2);
  const cut = progressInOut(f, T.clearRight, T.clearOver) * (1 - reset);
  /** The rings, at full size, in screen coordinates. */
  const rings = TOUCH_RUNS.map((run) => {
    let top = Infinity;
    let bot = -Infinity;
    for (let i = run.from; i <= run.to; i++) {
      top = Math.min(top, py(G.y(BARS[i].h)));
      bot = Math.max(bot, py(G.y(BARS[i].l)));
    }
    const x1 = px(G.x(run.from));
    const x2 = px(G.x(run.to));
    return {
      key: run.from,
      cx: (x1 + x2) / 2,
      cy: (top + bot) / 2,
      r: Math.max((x2 - x1) / 2 + RING.padX, (bot - top) / 2 + RING.padY),
    };
  });
  const clipRight = `inset(0px ${((theme.layout.width - edge) * cut).toFixed(1)}px 0px 0px)`;

  /**
   * The lit windows, and how far the veil has come up. Each hole opens from
   * its own left edge the way every highlight in this episode does — the edge
   * that anchors the reading never moves.
   */
  const spot = {
    /* the veil is up as long as ANY window is, and the pinch's runs to the end
       of the group — so within this scene it only ever comes up */
    on: progressInOut(f, T.calm, SPOT.grow) * marks,
    holes: [
      ...ZONE.narrow.map((z, i) => ({
        ...zoneBoxOf(z, ZONE_TALLER.narrow[i] ?? 0),
        grow: progressInOut(f, T.calm, SPOT.grow),
      })),
      /* the wide pair closes the way it opened, from the right edge back */
      ...ZONE.wide.map((z, i) => ({
        ...zoneBoxOf(z, ZONE_TALLER.wide[i] ?? 0),
        grow:
          progressInOut(f, T.active, SPOT.grow) *
          (1 - progressInOut(f, T.wideGone - SPOT.grow, SPOT.grow)),
      })),
    ].filter((h) => h.grow > 0.001),
  };

  return (
    <Stage>
      {/*
        THE CHART TRAVELS; THE TYPE DOES NOT. Everything the camera moves lives
        inside these two wrappers — the clip on the OUTER one, untransformed,
        because a clip on the scaling element would scale with it and never cut
        where the squeeze actually ends on screen.
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: clipRight,
          WebkitClipPath: clipRight,
        }}
      >
        <div style={{ position: "absolute", inset: 0, ...camera }}>
          {/*
        THE BANDS ARE DRAWN FIRST, so the candles sit ON them. Simon's call and
        the right one: the channel is a region the price moves through, and a
        pale wash laid over the bars makes the bars look like they are behind
        glass. Order in the tree is the only thing that decides this.
      */}
          {f >= T.mid && (
            <BollingerBands
              mid={BB.mid.slice(0, N)}
              upper={BB.upper.slice(0, N)}
              lower={BB.lower.slice(0, N)}
              grid={G}
              /* ORANGE, like every other single moving average in the episode.
             Indigo is the SLOW half of a fast/slow PAIR; here there is one
             average on screen and it is the same line the first half of the
             episode spent five scenes on. */
              midTone={theme.colors.maOrange}
              midTrace={progress(f, T.mid, T.midOver)}
              bandTrace={bandTrace}
              bandsIn={bandTrace > 0 ? 1 : 0}
              fill={0.2}
            />
          )}

          <ChartFrame
            closes={TAPE_C.slice(0, N)}
            bars={TAPE.slice(0, N)}
            grid={G}
            mode="candle"
            f={f}
            drawFrom={T.price}
            drawDur={T.priceOver}
            ticks={gridSpan ? TICKS_UP : TICKS}
            gridSpan={gridSpan}
            /* NO price labels. Simon's rule for an example chart — "karna ini
           hanya contoh jadi tidak relevan" — and here it is also the only
           honest option: the shape is read from a real instrument's crop, so a
           price axis would be either its numbers or invented ones. */
          />

          {/*
        Small, and hung well UNDER the line it names. `LABEL.mid` is in the
        quiet range, where the average runs along the bottom of the tape and
        the channel below it is empty — so a 46px drop clears the candles and
        the line both, which a 26px one at the old anchor did not.
      */}
          <LabelChip
            text="moving average"
            size={26}
            x={G.x(LABEL.mid)}
            y={G.y(BB.mid[LABEL.mid] ?? SERIES[LABEL.mid])}
            f={f}
            at={T.mid + sec(1)}
            anchor="below"
            gap={46}
            opacity={fadeOut(f, T.maLabelOut)}
          />
          {/* NO "UPPER BAND" / "LOWER BAND" names. Simon's call: the channel is
          one object and the voice names it; two more line labels on a chart
          that already carries the average's own name is three annotations
          competing for the same beat. */}

          {/*
        ── THE TWO VOLATILITY CALL-OUTS ──

        A SPOTLIGHT, not a tint. The first attempt laid a pale indigo wash
        inside each zone, over a channel that is already a pale cyan wash — two
        washes of nearly the same lightness, so nothing separated and nothing
        read as highlighted. Raising the tint only muddies the candles.

        So the zones are LIT by dimming everything else: a veil over the whole
        plot with a hole punched in it for each zone, and a drawn edge round
        the hole. The highlighted stretch keeps its true colours — which is the
        point, since what is being claimed is what the channel LOOKS like there
        — and the eye has nowhere else to go.
      */}
          {spot.on > 0.001 && (
            <Layer>
              <defs>
                <mask id="bbSpot">
                  <rect
                    x={box.x}
                    y={box.y - 60}
                    width={box.w}
                    height={box.h + 120}
                    fill="white"
                  />
                  {spot.holes.map((h) => (
                    <rect
                      key={`m${h.x1}`}
                      x={h.x1}
                      y={h.y1}
                      width={(h.x2 - h.x1) * h.grow}
                      height={h.y2 - h.y1}
                      rx={theme.layout.radius.sm}
                      fill="black"
                    />
                  ))}
                </mask>
              </defs>
              <rect
                x={box.x}
                y={box.y - 60}
                width={box.w}
                height={box.h + 120}
                fill={theme.colors.bg}
                opacity={SPOT.veil * spot.on}
                mask="url(#bbSpot)"
              />
              {spot.holes.map((h) => (
                <rect
                  key={`o${h.x1}`}
                  x={h.x1}
                  y={h.y1}
                  width={(h.x2 - h.x1) * h.grow}
                  height={h.y2 - h.y1}
                  rx={theme.layout.radius.sm}
                  fill="none"
                  stroke={theme.colors.indigo}
                  strokeWidth={theme.layout.border.thick}
                  opacity={spot.on * h.grow}
                />
              ))}
            </Layer>
          )}
        </div>
      </div>

      {/* OUTSIDE the camera. A heading that rode the zoom would leave the
          frame with it — the move is about the chart, not about the scene. */}
      {/*
        ONE HEADING FOR THE WHOLE GROUP. It used to leave at 5417 and be
        replaced by "Beginner Trap" — two headings, one for each half, which is
        exactly the boundary this group exists to remove. Simon's call: the
        chart is still Bollinger Bands, and the trap is a beat INSIDE that, so
        it arrives as a pill beside the name rather than in place of it.
      */}
      <TitleChip
        text="Bollinger Bands"
        f={f}
        at={T.title}
        badge={{ text: "Beginner Trap", at: T.trap }}
        /* NO exit. Simon's call: the heading and its badge stand to the end of
           the group. There is nothing left to hand the frame to — the closing
           block that used to take it is gone — so a heading that left at 5880
           would just be the scene losing its own name for its last seven
           seconds. Scene 11 replaces it at 6086 the way it always did. */
      />

      {/*
        ── Scene 09 ──
        NO second box on the squeeze. There used to be a pale indigo one here,
        pulsing, drawn around the same stretch — and since the pinch's spotlight
        now stays lit into this beat, the two marked one place twice: a wide
        flat window and a tall narrow box crossing through it, each making the
        same claim. The spotlight is the mark; this keeps only its name.
      */}
      <LabelChip
        text="Squeeze"
        /* on the window's own top edge, 20px clear of it, and read through the
           camera so it rides the move rather than sitting still under it */
        x={px((SQ.x1 + SQ.x2) / 2)}
        y={py(SQ.y1)}
        f={f}
        at={T.squeezeName}
        anchor="above"
        gap={20}
        opacity={marks}
      />

      {/* NO "BAND WIDTH ↓ / VOLATILITY ↓". Two arrows in a panel said in
          shorthand what the tape is already showing; this says it in the
          episode's own voice, in the box every other scene closes on. */}
      <QuoteBox
        f={f}
        at={T.quote}
        w={QUOTE.squeeze.w}
        h={QUOTE.squeeze.h}
        /* 50px under the window's lower edge, read through the camera. `y` is
           the box's CENTRE, so half its height is added on. */
        y={py(SQ.y2) + QUOTE.gap + QUOTE.squeeze.h / 2}
        opacity={fadeOut(f, T.quoteOut)}
        lines={[
          { segments: [{ text: "Saat squeeze, biasanya" }] },
          {
            segments: [
              {
                text: "sideways & volatility rendah.",
                tone: "indigo",
                ink: true,
              },
            ],
          },
        ]}
      />

      {/*
        ── THE ANSWER ──
        "Jadi, tetap lihat trend dan level penting sebelum mengambil
        kesimpulan," cut to the length a box can hold. `trend & level` is
        marked and takes the indigo INK — a marked run inside a sentence is
        lifted out by its colour, which is the opposite of the box above, where
        the whole line is marked and colouring every glyph would only wash it
        out. Same highlight, different job.
      */}
      <QuoteBox
        f={f}
        at={T.closing}
        w={QUOTE.closing.w}
        h={QUOTE.closing.h}
        y={py(SQ.y2) + QUOTE.gap + QUOTE.closing.h / 2}
        opacity={marks}
        lines={[
          {
            segments: [
              { text: "Cek " },
              { text: "trend & level", tone: "indigo" },
              { text: " dulu, baru simpulkan." },
            ],
          },
        ]}
      />

      {/*
        ── THE TWO DIRECTIONS, AND THE QUESTION BETWEEN THEM ──
        They start at the squeeze's own right edge, which is where the tape was
        cut: the arrows continue the line the chart stops on, so they read as
        the two things that could have happened next rather than as decoration.

        ⚠ COMPLIANCE: one geometry, mirrored. The rise, the run and the stroke
        are the SAME constants with the sign flipped, so neither direction can
        be drawn heavier than the other — enforced by construction, not by eye.
      */}
      {[-1, 1].map((dir) => (
        <Arrow
          key={dir}
          from={{ x: edge + BREAK.gap, y: py((SQ.y1 + SQ.y2) / 2) }}
          to={{
            x: edge + BREAK.gap + BREAK.run,
            y: py((SQ.y1 + SQ.y2) / 2) + dir * BREAK.rise,
          }}
          f={f}
          at={T.arrows}
          opacity={marks}
        />
      ))}
      {f >= T.arrows && (
        <div
          style={{
            position: "absolute",
            left: edge + BREAK.gap + BREAK.run / 2,
            top: py((SQ.y1 + SQ.y2) / 2),
            transform: "translate(-50%, -50%)",
            fontFamily: theme.type.family,
            fontSize: BREAK.mark,
            fontWeight: theme.type.display.weight,
            color: theme.colors.indigo,
            opacity: progress(f, T.arrows + 10, theme.motion.revealF) * marks,
          }}
        >
          ?
        </div>
      )}

      {/*
        NOTHING ELSE IS SAID. Four right-hand panels used to close this scene —
        "BREAKOUT ↑ ? / BREAKDOWN ↓ ?", "SQUEEZE = MOVE MAY BE COMING", and the
        struck "SQUEEZE = BULLISH / BEARISH → DIRECTION = UNKNOWN / CHECK TREND
        + KEY LEVELS". All four are gone at Simon's direction.

        They occupied `panelB`, which the two arrows now run straight through —
        the first of them was landing on top of the upper arrowhead. And they
        were saying, in shorthand beside the chart, exactly what the arrows say
        on it: two outcomes, drawn identically, with a question mark where the
        answer would go. ⚠ The compliance claim they carried travels with them:
        see the mirrored geometry on the arrows above.
      */}

      {/*
        ══ SCENE 10 — WALKING THE BAND ══════════════════════════════════════
        NO NEW CHART. This is the whole point of folding it in: the tape, its
        bands and its average were drawn at 4227 and have never left, so 5453
        is not a boundary the viewer can see. The scene arrives as a heading
        and two marks on ground it has been looking at for forty seconds.
      */}
      {/*
        NO `Sell?` CHIP. It hung above the first ring as a struck misconception
        and Simon has cut it. ⚠ The compliance claim it carried is NOT lost:
        the closing block still strikes `UPPER BAND = SELL` at 5928, which is
        the same misconception written out and struck in the episode's standard
        form. If that block is ever cut, this scene needs the chip back.
      */}

      {/*
        ── THE TOUCHES, RINGED ──
        Drawn OUTSIDE the camera, in screen coordinates, for two reasons. The
        frame is stretched 2.56× across and 1.55× down by now, so an ellipse
        drawn with the chart would carry that ratio into its own stroke and be
        visibly heavier at its top and bottom than at its sides. And the pad
        that keeps the oval clear of the candles is a look, not a quantity of
        price — it has to be the same number of pixels wherever the camera is.

        Each oval opens from its own centre over `grow` frames, which is the
        one entrance a closed shape has that does not imply a direction.
      */}
      {rings.map((o) => {
        const a =
          progressInOut(f, T.touches, RING.grow) *
          (1 - progressInOut(f, T.touchesGone - RING.grow, RING.grow));
        if (a <= 0.001) return null;
        return (
          <Layer key={`rg${o.key}`} opacity={a}>
            <circle
              cx={o.cx}
              cy={o.cy}
              r={o.r * a}
              fill={theme.colors.indigo}
              fillOpacity={RING.fill}
              stroke={theme.colors.indigo}
              strokeWidth={theme.layout.border.thick}
            />
          </Layer>
        );
      })}

      {/*
        ── THE TRAP, IN WORDS ──
        A FIXED y, not hung off a mark: by now the tape fills the frame and
        there is no box to hang from. 880 puts it over the empty ground under
        the channel and still clears the subtitle band, which starts at 972.
        `bukan berarti jual` is marked and takes the indigo ink — a run lifted
        out of a sentence, the same treatment the closing line gets.
      */}
      <QuoteBox
        f={f}
        at={T.trapQuote}
        w={QUOTE.trap.w}
        h={QUOTE.trap.h}
        y={QUOTE.trap.y}
        opacity={fadeOut(f, T.trapQuoteOut)}
        lines={[
          {
            segments: [
              { text: "Menyentuh upper band, " },
              { text: "bukan berarti jual", tone: "indigo" },
            ],
          },
        ]}
      />

      {/* NO "Walking the Band" chip — Simon cut it. The two rings and the
          sentence under them are the whole of that beat now. */}

      {/*
        ── THE LINE THE SCENE CLOSES ON ──
        On the cue that says it: "Bollinger Bands menunjukkan posisi harga
        terhadap rata-ratanya, bukan memberi keputusan entry atau exit"
        (5889–6038). Two lines, so it takes the taller box.
      */}
      <QuoteBox
        f={f}
        at={T.lastQuote}
        w={QUOTE.last.w}
        h={QUOTE.last.h}
        y={QUOTE.last.y}
        opacity={fadeOut(f, T.lastQuoteOut)}
        lines={[
          { segments: [{ text: "Bollinger Bands menunjukkan posisi harga," }] },
          {
            segments: [
              { text: "bukan penentu ", ink: true },
              { text: "entry/exit", tone: "indigo" },
            ],
          },
        ]}
      />

      {/*
        ⚠ NO CLOSING BLOCK, AND NO STRUCK LINE ANYWHERE IN THIS GROUP.

        "UPPER BAND = SELL" struck, over "STRONG TREND CAN STAY NEAR UPPER
        BAND" and "BAND TOUCH ≠ ENTRY / EXIT", closed this scene. Simon cut it:
        the quote above says the same thing in the episode's own voice instead
        of in capitals beside the chart, and the two were on screen together.

        What it also carried was this group's last struck misconception. The
        claim survives — the quote's second line IS "bukan penentu entry/exit"
        — but it is now made positively rather than by striking the error, and
        `Sell?` was cut earlier for the same reason. The episode still strikes
        one in Scene 11 ("INDICATOR = DECISION MAKER") and one in CG-C. If a
        reviewer ever asks where this scene refuses the sell signal, the answer
        is the quote at 5888 and nothing else.
      */}
    </Stage>
  );
};
