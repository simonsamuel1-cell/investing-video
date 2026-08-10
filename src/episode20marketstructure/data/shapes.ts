/**
 * data/shapes.ts — the named price shapes, written as the legs price walked.
 *
 * Read any of these aloud and it is the script's own sentence: STAIRCASE goes
 * "up to 5.000, down to 4.600, up to 5.400, down to 4.900" because that is
 * exactly what the narration says. Every label the episode puts on a turning
 * point is therefore read off the shape, never typed next to it.
 */
import { curve, type Shape } from "./shape";

const make = (s: Shape) => curve(s);

/**
 * SC01 → SC03. Traced point by point off Simon's reference screenshot — 58
 * legs, because the density IS the picture: a real chart is mostly small
 * indecisive turns with a few big ones inside them, and a shape written from a
 * handful of legs reads as a diagram of a chart rather than a chart.
 *
 * Drawn rather than embedded, so SC03 can dissolve the candles into the line
 * and put Puncak / Lembah markers on the shape's own turning points. With this
 * many turns, SC03 marks only the MAJOR ones — see majorTurns().
 */
export const HOOK = make({
  from: 4344,
  legs: [
    { to: 4434, weight: 1.0 }, { to: 4926, weight: 2.25 }, { to: 4948, weight: 1.0 }, { to: 4836, weight: 1.25 },
    { to: 4792, weight: 1.5 }, { to: 4948, weight: 1.75 }, { to: 4904, weight: 0.75 }, { to: 4703, weight: 1.5 },
    { to: 4881, weight: 1.0 }, { to: 4725, weight: 1.0 }, { to: 4681, weight: 1.0 }, { to: 4836, weight: 1.0 },
    { to: 4881, weight: 1.0 }, { to: 4792, weight: 0.75 }, { to: 4904, weight: 1.25 }, { to: 5463, weight: 1.0 },
    { to: 5597, weight: 1.5 }, { to: 5485, weight: 1.25 }, { to: 5575, weight: 1.0 }, { to: 5440, weight: 1.25 },
    { to: 5396, weight: 1.0 }, { to: 5150, weight: 0.75 }, { to: 5127, weight: 1.0 }, { to: 5195, weight: 0.75 },
    { to: 5060, weight: 0.75 }, { to: 5306, weight: 0.75 }, { to: 5620, weight: 1.0 }, { to: 5687, weight: 1.0 },
    { to: 5597, weight: 1.0 }, { to: 5642, weight: 0.75 }, { to: 5888, weight: 1.0 }, { to: 5866, weight: 0.75 },
    { to: 5821, weight: 0.75 }, { to: 5933, weight: 0.75 }, { to: 5642, weight: 1.0 }, { to: 5776, weight: 1.0 },
    { to: 6000, weight: 0.75 }, { to: 5843, weight: 0.75 }, { to: 5687, weight: 1.0 }, { to: 5374, weight: 1.0 },
    { to: 5329, weight: 0.75 }, { to: 5351, weight: 1.0 }, { to: 5306, weight: 1.0 }, { to: 5418, weight: 1.0 },
    { to: 5015, weight: 1.0 }, { to: 4926, weight: 0.75 }, { to: 4881, weight: 0.75 }, { to: 4948, weight: 1.0 },
    { to: 4881, weight: 0.75 }, { to: 4970, weight: 1.0 }, { to: 5171, weight: 1.25 }, { to: 5150, weight: 0.75 },
    { to: 4970, weight: 1.0 }, { to: 4792, weight: 1.0 }, { to: 4747, weight: 1.0 }, { to: 4814, weight: 1.0 },
    { to: 4836, weight: 1.0 }, { to: 4845, weight: 1.0 },
  ],
  jitter: 0.008,
  seed: 31,
  steps: 760,
});
/** Round gridlines. A price axis should read in steps a viewer recognises. */
export const HOOK_TICKS = [4600, 5200, 5800];

/**
 * SC04 — the mechanism. Rise, a pullback that stops ABOVE the starting low,
 * then the push to a new peak. Turn 0 is the prior low the dashed line marks;
 * turn 2 is the pullback that has to stay above it.
 */
export const MECHANISM = make({
  from: 4500,
  legs: [{ to: 5400, weight: 1.6 }, { to: 5000, weight: 1.1 }, { to: 5900, weight: 1.6 }],
  jitter: 0.016,
  seed: 7,
});

/**
 * CG-A. The four narrated prices ARE turns 1–4, so SC06's tags come from the
 * geometry. Three higher highs (5.000 / 5.400 / 5.800) and three higher lows
 * (4.600 / 4.900 / 5.300).
 */
export const STAIRCASE = make({
  from: 4300,
  legs: [{ to: 5000 }, { to: 4600 }, { to: 5400 }, { to: 4900 }, { to: 5800 }, { to: 5300 }, { to: 5950 }],
  jitter: 0.014,
  seed: 23,
});
export const STAIR_TICKS = [4400, 4800, 5200, 5600];
/** The pullback SC05 re-frames as a pause: between turns 3 and 4. */
export const STAIR_BREATH: [number, number] = [3, 4];

/** SC07 — the same argument upside down. */
export const DESCENT = make({
  from: 5900,
  legs: [{ to: 5100 }, { to: 5500 }, { to: 4750 }, { to: 5150 }, { to: 4400 }, { to: 4750 }, { to: 4150 }],
  jitter: 0.014,
  seed: 29,
});

/** SC08 — the drift behind the principle card. Muted, unlabelled, never still. */
export const DRIFT = make({
  from: 4600,
  legs: [{ to: 5050 }, { to: 4880 }, { to: 5400 }, { to: 5200 }, { to: 5750 }],
  jitter: 0.02,
  seed: 41,
});

/** SC09 — turns landing at the same two levels, over and over. */
export const CHANNEL = make({
  from: 4870,
  legs: [{ to: 5180 }, { to: 4830 }, { to: 5200 }, { to: 4820 }, { to: 5170 }, { to: 4845 }, { to: 5190 }, { to: 4880 }],
  jitter: 0.018,
  seed: 13,
});
export const CHANNEL_EDGES: [number, number] = [4820, 5200];

/**
 * SC10 — one curve through the whole cycle. The leg WEIGHTS are what make the
 * two flat phases flat: the base and the top take as long as the moves do.
 */
export const CYCLE = make({
  from: 6300,
  legs: [
    { to: 5850, weight: 0.6 }, { to: 6000, weight: 0.4 }, { to: 5200, weight: 0.6 }, { to: 5450, weight: 0.5 }, { to: 4650, weight: 0.7 },
    { to: 4820, weight: 0.5 }, { to: 4600, weight: 0.5 }, { to: 4830, weight: 0.5 }, { to: 4620, weight: 0.5 },
    { to: 5300, weight: 0.6 }, { to: 5150, weight: 0.5 }, { to: 5800, weight: 0.6 }, { to: 5650, weight: 0.5 }, { to: 6350, weight: 0.55 },
    { to: 6180, weight: 0.4 }, { to: 6420, weight: 0.4 }, { to: 6200, weight: 0.4 }, { to: 6400, weight: 0.4 },
    { to: 5700, weight: 0.45 }, { to: 5300, weight: 0.4 },
  ],
  jitter: 0.012,
  seed: 3,
});
/** Phase windows in `t`, matching the weights above. */
export const CYCLE_PHASES = {
  markdown: [0, 0.28] as [number, number],
  accumulation: [0.28, 0.48] as [number, number],
  markup: [0.48, 0.755] as [number, number],
  distribution: [0.755, 0.915] as [number, number],
  repeat: [0.915, 1] as [number, number],
};

/**
 * SC11 module 1. Drawn twice from ONE shape: once with the jitter (the swings)
 * and once without it (the trend). That is the claim the scene makes, so it is
 * built rather than illustrated.
 */
const MAJOR_LEGS: Shape = {
  from: 4400,
  legs: [{ to: 4950 }, { to: 4720 }, { to: 5350 }, { to: 5120 }, { to: 5850 }, { to: 5600 }, { to: 6350 }, { to: 6100 }, { to: 6700 }],
  seed: 19,
};
export const MAJOR = make({ ...MAJOR_LEGS, jitter: 0.045 });
export const MAJOR_TREND = make({ ...MAJOR_LEGS, jitter: 0 });
/**
 * The swing the lens opens on. Placed just AFTER the trough, so the window is a
 * rising stretch with a red bar or two inside it — "satu candle merah di tengah
 * major uptrend". Centred on the fall it would show a decline, which is a
 * different claim from the one the narration makes.
 */
export const MAJOR_LENS: [number, number] = [0.44, 0.52];

/** SC11 module 2 — the same climb at two speeds. */
export const GRADUAL = make({
  from: 4600,
  legs: [{ to: 4950, weight: 1.5 }, { to: 4870, weight: 0.7 }, { to: 5300, weight: 1.4 }, { to: 5220, weight: 0.6 }, { to: 5600, weight: 0.8 }],
  jitter: 0.016,
  seed: 37,
});
export const STEEP = make({
  from: 4600,
  legs: [{ to: 4700, weight: 2.8 }, { to: 4900, weight: 0.8 }, { to: 5250, weight: 0.7 }, { to: 5600, weight: 0.7 }],
  jitter: 0.012,
  seed: 43,
});

/**
 * SC12 — two rejections at 5.200, a break through it, then a retest that holds.
 * Turn 6 is the higher low the narration names.
 */
export const CEILING = make({
  from: 4800,
  legs: [{ to: 5150 }, { to: 4900 }, { to: 5170 }, { to: 4860 }, { to: 5480 }, { to: 5240 }, { to: 5800 }, { to: 5620 }, { to: 5900 }],
  jitter: 0.012,
  seed: 53,
});
export const CEILING_LEVEL = 5200;
export const CEILING_HL = 6;

/** SC13 — the mirror. Turn 6 is the rejection that becomes the lower high. */
export const FLOOR = make({
  from: 5400,
  legs: [{ to: 5050 }, { to: 5300 }, { to: 5030 }, { to: 5250 }, { to: 4680 }, { to: 4960 }, { to: 4400 }, { to: 4580 }, { to: 4300 }],
  jitter: 0.012,
  seed: 59,
});
export const FLOOR_LEVEL = 5000;
export const FLOOR_LH = 6;

/**
 * CG-B. The weights place the failed peak at t 0.58, which is where SC14's
 * draw stops and waits for SC15.
 *
 *   turn 3 (5.400) — the last real higher high; the dashed reference
 *   turn 4 (5.150) — the trough SC15 has to break
 *   turn 5 (5.320) — the push that stalls BELOW the reference
 *   turn 6 (4.900) — the lower low that confirms it
 */
export const FAILURE = make({
  from: 4600,
  legs: [
    { to: 5100, weight: 1 }, { to: 4850, weight: 0.8 }, { to: 5400, weight: 1.4 }, { to: 5150, weight: 1.2 },
    { to: 5320, weight: 1.4 }, { to: 4900, weight: 2.2 }, { to: 5120, weight: 1 }, { to: 4820, weight: 1 },
  ],
  jitter: 0.011,
  seed: 61,
});
export const FAIL_LAST_HH = 3;
export const FAIL_PRIOR_LOW = 4;
export const FAIL_STALL = 5;
export const FAIL_LOWER_LOW = 6;
/** Where SC14's draw halts — on the failed peak itself. */
export const FAIL_STOP_T = 0.58;

/**
 * SC16 — ONE daily climb. The "5-minute chart" is this shape magnified over
 * TF_WINDOW, never a second dataset: the camera pulls back, the price does not
 * change. Turn 6 is the higher low the zoomed-out view reveals.
 */
export const TIMEFRAME = make({
  from: 4500,
  legs: [
    { to: 4900, weight: 1.2 }, { to: 4720, weight: 0.8 }, { to: 5250, weight: 1.4 }, { to: 5050, weight: 1.1 },
    { to: 5600, weight: 1.3 }, { to: 5400, weight: 1.0 }, { to: 5950, weight: 1.4 }, { to: 5750, weight: 0.8 }, { to: 6200, weight: 1.0 },
  ],
  jitter: 0.014,
  seed: 67,
});
export const TF_WINDOW: [number, number] = [0.56, 0.71];
export const TF_HIGHER_LOW = 6;
