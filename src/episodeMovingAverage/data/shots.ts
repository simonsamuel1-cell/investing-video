/**
 * shots.ts — the shape of Simon's five TradingView screenshots, traced.
 *
 * ⚠ READ THIS BEFORE USING THESE ANYWHERE ELSE.
 *
 * These are NOT an export and NOT a record. Each series below is a set of
 * anchor points read OFF the screenshot BY EYE — the turns, the peaks, the
 * gaps and the closing level — and then interpolated. The landmarks are in the
 * right places and the levels are within a few tens of rupiah, but no
 * individual bar is the bar that actually printed.
 *
 * That is why Scene 01 keeps its "Ilustrasi" tag even though its quoted
 * numbers are real: the QUOTES come from the screenshots' own headers and are
 * exact, while the CANDLES are this. Swap in a real OHLC export and the tag
 * comes off — nothing else in the scene has to change.
 *
 * The quoted last price of each series is the one its screenshot's header
 * shows, so the drawn chart and the header cannot disagree about where it
 * closed.
 */
import { mulberry32 as seeded } from "../helpers";

/** `[t, price]` with t running 0 → 1 across the chart's own window. */
export type Anchor = [number, number];

/** BBCA · 1D · IDX — Apr → Sep. The June crash and its recovery are the shape. */
export const BBCA_1D: Anchor[] = [
  [0.0, 6900],
  [0.03, 6800],
  [0.06, 6450],
  [0.1, 6800],
  [0.13, 6700],
  [0.16, 6350],
  [0.2, 6050],
  [0.23, 5900],
  [0.26, 6250],
  [0.29, 6300],
  [0.32, 6050],
  [0.35, 5800],
  [0.37, 5300],
  [0.39, 4850],
  [0.41, 5750],
  [0.44, 6200],
  [0.47, 6500],
  [0.5, 6300],
  [0.53, 6100],
  [0.56, 6250],
  [0.58, 5650],
  [0.6, 5800],
  [0.63, 6100],
  [0.66, 6300],
  [0.7, 6250],
  [0.73, 6550],
  [0.76, 6450],
  [0.79, 6200],
  [0.82, 6350],
  [0.85, 6450],
  [0.88, 6300],
  [0.92, 6250],
  [0.96, 6350],
  [1.0, 6325],
];

/** BBRI · 1H — the 17th step up, the 29th trough, the August range. */
export const BBRI_1H: Anchor[] = [
  [0.0, 2850],
  [0.05, 2870],
  [0.1, 2840],
  [0.14, 2870],
  [0.18, 3040],
  [0.22, 3080],
  [0.28, 3090],
  [0.33, 3060],
  [0.38, 2960],
  [0.44, 2930],
  [0.48, 2960],
  [0.52, 3000],
  [0.57, 2990],
  [0.62, 3030],
  [0.66, 3060],
  [0.7, 3120],
  [0.74, 3160],
  [0.78, 3100],
  [0.82, 3080],
  [0.86, 3110],
  [0.9, 3140],
  [0.94, 3120],
  [1.0, 3080],
];

/** TLKM · 1H — two pushes to 2.740/2.780, then back to 2.590. */
export const TLKM_1H: Anchor[] = [
  [0.0, 2530],
  [0.05, 2560],
  [0.09, 2510],
  [0.13, 2540],
  [0.17, 2660],
  [0.21, 2740],
  [0.25, 2700],
  [0.3, 2680],
  [0.35, 2600],
  [0.4, 2560],
  [0.45, 2620],
  [0.5, 2680],
  [0.55, 2740],
  [0.58, 2780],
  [0.62, 2720],
  [0.66, 2740],
  [0.7, 2700],
  [0.75, 2640],
  [0.8, 2600],
  [0.85, 2590],
  [0.9, 2620],
  [0.95, 2630],
  [1.0, 2590],
];

/** ASII · 1H — the 22nd spike, then a long slide into 4.770. */
export const ASII_1H: Anchor[] = [
  [0.0, 4830],
  [0.05, 4900],
  [0.1, 4880],
  [0.14, 5150],
  [0.18, 5130],
  [0.22, 5250],
  [0.26, 5100],
  [0.31, 4980],
  [0.36, 5010],
  [0.4, 4930],
  [0.45, 5150],
  [0.5, 5080],
  [0.55, 5100],
  [0.58, 5150],
  [0.62, 5100],
  [0.66, 5120],
  [0.7, 5000],
  [0.75, 4900],
  [0.8, 4850],
  [0.85, 4800],
  [0.9, 4790],
  [0.95, 4780],
  [1.0, 4770],
];

/** BMRI · 1H — the 17th jump to 4.480, the 24th drop, a flat August. */
export const BMRI_1H: Anchor[] = [
  [0.0, 4100],
  [0.04, 4180],
  [0.08, 4120],
  [0.12, 4460],
  [0.17, 4480],
  [0.22, 4470],
  [0.26, 4440],
  [0.3, 4340],
  [0.34, 4150],
  [0.38, 4120],
  [0.42, 4090],
  [0.46, 4130],
  [0.5, 4180],
  [0.54, 4230],
  [0.58, 4270],
  [0.62, 4230],
  [0.66, 4200],
  [0.7, 4130],
  [0.74, 4110],
  [0.78, 4130],
  [0.82, 4200],
  [0.86, 4180],
  [0.92, 4160],
  [1.0, 4150],
];

/**
 * BBRI · 1D · IDX — Apr → Sep, 2.500 to 3.700, closing 3.220.
 *
 * The shape is the whole point: a stepped decline off the 3.600 April high, a
 * capitulation to 2.500 at the start of June, a second low at 2.650 in July,
 * and a recovery that ends on a 3.220 close. The two lows are what the market
 * structure on this chart is read from.
 */
export const BBRI_1D: Anchor[] = [
  [0.0, 3480],
  [0.02, 3600],
  [0.05, 3400],
  [0.08, 3330],
  [0.11, 3250],
  [0.13, 3180],
  [0.15, 3480],
  [0.17, 3500],
  [0.19, 3420],
  [0.2, 3400],
  [0.24, 3250],
  [0.26, 3200],
  [0.28, 3120],
  [0.3, 3300],
  [0.31, 3300],
  [0.33, 3180],
  [0.35, 3120],
  [0.37, 3050],
  [0.39, 3120],
  [0.41, 3200],
  [0.43, 2900],
  [0.45, 2800],
  [0.46, 2600],
  [0.47, 2500],
  [0.49, 2900],
  [0.51, 2850],
  [0.53, 3100],
  [0.55, 2950],
  [0.57, 2900],
  [0.59, 2800],
  [0.61, 2700],
  [0.63, 2650],
  [0.65, 2800],
  [0.67, 2780],
  [0.69, 2850],
  [0.71, 2900],
  [0.74, 3100],
  [0.77, 3050],
  [0.79, 2950],
  [0.81, 3000],
  [0.84, 3050],
  [0.87, 3150],
  [0.9, 3100],
  [0.93, 3120],
  [0.96, 3150],
  [1.0, 3220],
];

/**
 * BMRI · 1D · IDX — Apr → Sep, 3.500 to 5.100, closing 4.210.
 *
 * Off the 5.000 April high it steps down to 3.660 in June, makes a second low
 * at 3.810 in July, and spends August in a 4.100–4.500 range it is still in at
 * the close. It is deliberately the LAST chart in the run: the range is what a
 * moving average and a band are drawn over most usefully.
 */
export const BMRI_1D: Anchor[] = [
  [0.0, 4880],
  [0.03, 5000],
  [0.05, 4950],
  [0.08, 4820],
  [0.11, 4700],
  [0.14, 4650],
  [0.17, 4700],
  [0.2, 4720],
  [0.24, 4750],
  [0.26, 4550],
  [0.28, 4420],
  [0.3, 4400],
  [0.32, 4600],
  [0.35, 4720],
  [0.37, 4450],
  [0.39, 4300],
  [0.41, 4280],
  [0.43, 4300],
  [0.46, 4050],
  [0.48, 3900],
  [0.5, 3660],
  [0.52, 4300],
  [0.54, 4450],
  [0.55, 4500],
  [0.57, 4400],
  [0.59, 4200],
  [0.61, 4050],
  [0.63, 3900],
  [0.64, 3810],
  [0.66, 4000],
  [0.68, 4100],
  [0.7, 4180],
  [0.72, 4250],
  [0.75, 4400],
  [0.77, 4500],
  [0.79, 4450],
  [0.81, 4180],
  [0.83, 4100],
  [0.85, 4250],
  [0.87, 4300],
  [0.89, 4250],
  [0.91, 4150],
  [0.93, 4120],
  [0.95, 4180],
  [1.0, 4210],
];

/**
 * SC02/SC03's explainer chart — Apr → Aug, 72.000 to 124.000, closing 112.472.
 *
 * ⚠ The crop Simon sent has its symbol header cut off, so the instrument is
 * NOT known here and this series is deliberately not attributed to one. The
 * explainer chart carries no ticker on screen either, which is what makes that
 * safe: the scene is about what a smoothed line does to a noisy one, and this
 * supplies a real market's shape to do it on.
 *
 * If it is ever labelled, the label has to come with an export — not with a
 * ticker typed over a traced path.
 */
export const EXPLAINER: Anchor[] = [
  [0.0, 86000],
  [0.02, 88000],
  [0.05, 84000],
  [0.07, 88500],
  [0.09, 85000],
  [0.11, 78000],
  [0.13, 84000],
  [0.16, 85000],
  [0.18, 87000],
  [0.2, 94000],
  [0.23, 96500],
  [0.25, 94000],
  [0.27, 97000],
  [0.3, 104000],
  [0.33, 104500],
  [0.35, 103000],
  [0.38, 106000],
  [0.4, 110000],
  [0.42, 106000],
  [0.44, 108500],
  [0.46, 105000],
  [0.48, 103500],
  [0.5, 104500],
  [0.53, 110000],
  [0.55, 106000],
  [0.57, 105500],
  [0.59, 103000],
  [0.61, 106000],
  [0.63, 100000],
  [0.65, 106000],
  [0.67, 108000],
  [0.7, 107000],
  [0.72, 108500],
  [0.74, 108000],
  [0.76, 118000],
  [0.78, 120000],
  [0.8, 118000],
  [0.82, 119500],
  [0.84, 117500],
  [0.86, 118000],
  [0.88, 115000],
  [0.9, 113500],
  [0.92, 117000],
  [0.94, 119000],
  [0.96, 123000],
  [0.98, 117000],
  [1.0, 112472],
];

/**
 * SC02/SC03's chart — the crop Simon supplied for the explainer, traced.
 *
 * ⚠ THE INSTRUMENT IS NOT KNOWN. The screenshot has no symbol header: it is a
 * bare candlestick crop with a "74.854 BUY" chip in the corner and a dotted
 * level line. So this series is deliberately NOT attributed to anything, and
 * the scene shows no ticker — which is what makes it safe. The chart is there
 * to demonstrate what a smoothed line does to a noisy one.
 *
 * The price scale is anchored on the ONE number the crop does show: the dotted
 * level is read as 74.854 and the rest of the band is set from the pixel scale
 * around it. If this is ever labelled with a symbol, it has to come with an
 * export — not with a ticker typed over a traced path.
 */
export const EXPLAINER_2: Anchor[] = [
  [0.0, 72770],
  [0.03, 72940],
  [0.06, 73020],
  [0.08, 72900],
  [0.1, 73190],
  [0.12, 73690],
  [0.13, 74100],
  [0.14, 74470],
  [0.16, 74640],
  [0.18, 74430],
  [0.19, 74270],
  [0.21, 74470],
  [0.22, 74560],
  [0.23, 74270],
  [0.24, 74060],
  [0.26, 73810],
  [0.27, 74020],
  [0.29, 73930],
  [0.3, 73770],
  [0.32, 73930],
  [0.33, 74180],
  [0.35, 74350],
  [0.36, 74510],
  [0.37, 74680],
  [0.38, 75100],
  [0.39, 75680],
  [0.41, 76090],
  [0.42, 76380],
  [0.43, 76550],
  [0.44, 76340],
  [0.46, 76260],
  [0.47, 76380],
  [0.48, 76170],
  [0.49, 75930],
  [0.5, 75510],
  [0.52, 75300],
  [0.53, 75430],
  [0.54, 75180],
  [0.55, 75300],
  [0.57, 75680],
  [0.58, 75930],
  [0.59, 76550],
  [0.6, 76670],
  [0.62, 76460],
  [0.63, 76300],
  [0.64, 76670],
  [0.65, 77330],
  [0.66, 77380],
  [0.68, 77330],
  [0.7, 77080],
  [0.71, 77170],
  [0.72, 77580],
  [0.73, 77670],
  [0.74, 77250],
  [0.76, 76920],
  [0.77, 76260],
  [0.78, 75760],
  [0.79, 75510],
  [0.8, 75630],
  [0.81, 75590],
  [0.82, 75760],
  [0.84, 75930],
  [0.85, 75680],
  [0.86, 75010],
  [0.87, 74430],
  [0.88, 74270],
  [0.89, 74350],
  [0.9, 74510],
  [0.92, 74600],
  [0.93, 74930],
  [0.94, 75140],
  [0.95, 75180],
  [0.96, 75010],
  [0.97, 74850],
  [0.99, 74510],
  [1.0, 74180],
];

/**
 * SC04's chart — SMA vs EMA. Traced from the candles Simon supplied; that crop
 * carries no axis and no symbol, so only the SHAPE is taken and the levels are
 * written straight into the band the axis is read on.
 *
 * The run that matters to the scene is the peak near two fifths across and the
 * long decline after it: that is the one turn both averages have to react to,
 * and the whole scene is about which of them reacts first.
 */
export const SMA_EMA: Anchor[] = [
  [0.0, 830],
  [0.02, 840],
  [0.04, 860],
  [0.06, 856],
  [0.08, 876],
  [0.1, 890],
  [0.12, 904],
  [0.14, 928],
  [0.155, 940],
  [0.17, 924],
  [0.19, 934],
  [0.21, 920],
  [0.23, 904],
  [0.25, 896],
  [0.27, 908],
  [0.29, 912],
  [0.31, 920],
  [0.33, 930],
  [0.35, 948],
  [0.37, 940],
  [0.39, 956],
  [0.41, 972],
  [0.425, 980],
  [0.44, 968],
  [0.46, 974],
  [0.47, 964],
  [0.49, 940],
  [0.51, 920],
  [0.52, 928],
  [0.53, 944],
  [0.55, 934],
  [0.57, 924],
  [0.58, 916],
  [0.6, 920],
  [0.62, 908],
  [0.64, 890],
  [0.66, 880],
  [0.67, 884],
  [0.68, 872],
  [0.7, 890],
  [0.71, 876],
  [0.72, 856],
  [0.73, 868],
  [0.74, 860],
  [0.75, 880],
  [0.77, 890],
  [0.78, 896],
  [0.79, 884],
  [0.81, 892],
  [0.82, 900],
  [0.83, 890],
  [0.85, 896],
  [0.86, 884],
  [0.87, 874],
  [0.88, 896],
  [0.9, 920],
  [0.92, 936],
  [0.93, 948],
  [0.95, 940],
  [0.97, 932],
  [1.0, 924],
];

/**
 * SC04's chart — the crop Simon supplied for SMA vs EMA, traced.
 *
 * ⚠ THE INSTRUMENT IS NOT KNOWN. Like EXPLAINER_2 this crop carries no symbol
 * header and no price axis, so the series is NOT attributed and the scene
 * shows neither ticker nor price labels. Only the SHAPE is taken; the band it
 * is written into is arbitrary and exists so the arithmetic has numbers to run
 * on, not because those numbers mean anything.
 *
 * The run that matters is the long climb into the double top and the decline
 * after it: that is the one turn both averages have to react to, and the whole
 * scene is about which of them reacts first.
 */
export const SMA_EMA_2: Anchor[] = [
  [0.0, 5000],
  [0.03, 5040],
  [0.05, 5020],
  [0.07, 5060],
  [0.09, 5100],
  [0.1, 5180],
  [0.12, 5410],
  [0.13, 5450],
  [0.14, 5510],
  [0.15, 5610],
  [0.16, 5750],
  [0.18, 5920],
  [0.19, 6040],
  [0.2, 6100],
  [0.21, 6060],
  [0.22, 6140],
  [0.23, 6180],
  [0.24, 6160],
  [0.25, 5970],
  [0.26, 5850],
  [0.27, 6000],
  [0.29, 6080],
  [0.3, 6200],
  [0.31, 6510],
  [0.32, 6670],
  [0.33, 6760],
  [0.34, 6630],
  [0.35, 6510],
  [0.36, 6350],
  [0.37, 6900],
  [0.38, 7000],
  [0.4, 6900],
  [0.41, 6740],
  [0.42, 6660],
  [0.43, 6680],
  [0.44, 6620],
  [0.45, 6580],
  [0.46, 6550],
  [0.47, 6530],
  [0.48, 6550],
  [0.49, 6630],
  [0.51, 6880],
  [0.52, 6820],
  [0.53, 6740],
  [0.54, 6680],
  [0.55, 6620],
  [0.56, 6510],
  [0.57, 6370],
  [0.58, 6290],
  [0.59, 6330],
  [0.6, 6430],
  [0.61, 6550],
  [0.63, 6670],
  [0.64, 6710],
  [0.65, 6860],
  [0.66, 6880],
  [0.67, 6660],
  [0.68, 6160],
  [0.69, 6240],
  [0.7, 6350],
  [0.71, 6220],
  [0.72, 6160],
  [0.73, 6240],
  [0.74, 6180],
  [0.75, 6280],
  [0.77, 6380],
  [0.78, 6420],
  [0.79, 6200],
  [0.8, 6160],
  [0.81, 6180],
  [0.82, 5960],
  [0.83, 5800],
  [0.84, 5840],
  [0.85, 5920],
  [0.86, 5960],
  [0.87, 5760],
  [0.89, 5650],
  [0.9, 5570],
  [0.91, 5490],
  [0.92, 5410],
  [0.93, 5290],
  [0.94, 5370],
  [0.95, 5450],
  [0.96, 5490],
  [0.97, 5450],
  [0.98, 5570],
  [1.0, 5610],
];

/**
 * SC05's chart — the crop Simon supplied for "how to read it", traced.
 *
 * ⚠ THE INSTRUMENT IS NOT KNOWN: no symbol header, no price axis. Not
 * attributed, and the scene shows neither ticker nor price labels.
 *
 * ONLY THE CANDLES ARE TRACED. The crop has no average drawn on it, and the
 * line the scene draws is computed FROM these closes — an average traced as a
 * shape would be a curve that merely looks like the mean of the bars under it.
 *
 * The shape is a steady climb with shallow pauses in it, which is what the
 * scene needs: price spends the whole run above a rising line and comes back
 * to touch it without ever breaking through.
 *
 * ⚠ Its LAST anchor is READ_2's FIRST. The scene runs the two as one series
 * and scrolls from one into the other, so a mismatch there would print as a
 * gap bar at the join. Change one end and change the other with it.
 */
export const READ_1: Anchor[] = [
  [0.0, 5000],
  [0.03, 5060],
  [0.05, 5190],
  [0.07, 5340],
  [0.09, 5400],
  [0.11, 5410],
  [0.13, 5430],
  [0.15, 5650],
  [0.17, 6050],
  [0.19, 5990],
  [0.2, 6080],
  [0.22, 6050],
  [0.24, 6020],
  [0.26, 6080],
  [0.28, 6140],
  [0.3, 6170],
  [0.32, 6200],
  [0.34, 6260],
  [0.36, 6380],
  [0.38, 6540],
  [0.4, 6570],
  [0.42, 6540],
  [0.44, 6510],
  [0.46, 6410],
  [0.48, 6260],
  [0.5, 6290],
  [0.52, 6380],
  [0.53, 6440],
  [0.55, 6480],
  [0.57, 6460],
  [0.59, 6480],
  [0.61, 6450],
  [0.63, 6450],
  [0.65, 6480],
  [0.67, 6510],
  [0.69, 6570],
  [0.71, 6540],
  [0.73, 6600],
  [0.75, 6630],
  [0.77, 6570],
  [0.79, 6510],
  [0.81, 6480],
  [0.83, 6570],
  [0.85, 6600],
  [0.87, 6660],
  [0.88, 6690],
  [0.9, 6780],
  [0.92, 6940],
  [0.94, 7000],
  [0.96, 6940],
  [0.98, 6790],
  [1.0, 6850],
];

/**
 * SC05's SECOND chart — the downtrend crop, traced. Same rules as READ_1: no
 * symbol, no axis, not attributed, and ONLY the candles are traced.
 *
 * It is the mirror of the lesson: price spends this run BELOW a falling line,
 * rallying back to it twice without getting through.
 *
 * ⚠ Its FIRST anchor is READ_1's LAST and its LAST is READ_3's FIRST — see
 * the notes there. It also spans the SAME 5.000–7.000 band as READ_1, which is
 * what lets one fixed scale hold them without either being squashed to make
 * room for the other.
 */
export const READ_2: Anchor[] = [
  [0.0, 6850],
  [0.01, 6910],
  [0.03, 6790],
  [0.05, 6940],
  [0.07, 7000],
  [0.08, 6970],
  [0.1, 6940],
  [0.12, 6880],
  [0.14, 6820],
  [0.15, 6760],
  [0.17, 6380],
  [0.19, 6290],
  [0.2, 6440],
  [0.22, 6470],
  [0.24, 6380],
  [0.25, 6290],
  [0.27, 6230],
  [0.29, 6150],
  [0.3, 6060],
  [0.32, 6120],
  [0.34, 6180],
  [0.35, 6210],
  [0.37, 6260],
  [0.39, 6180],
  [0.41, 6230],
  [0.42, 6290],
  [0.44, 6350],
  [0.46, 6410],
  [0.47, 6470],
  [0.49, 6440],
  [0.51, 6350],
  [0.52, 6290],
  [0.54, 6260],
  [0.56, 6200],
  [0.57, 6230],
  [0.59, 6260],
  [0.61, 6230],
  [0.62, 6060],
  [0.64, 5910],
  [0.66, 5850],
  [0.68, 5820],
  [0.69, 5880],
  [0.71, 5910],
  [0.73, 5880],
  [0.74, 5940],
  [0.76, 6030],
  [0.78, 6000],
  [0.79, 5910],
  [0.81, 5820],
  [0.83, 5730],
  [0.84, 5590],
  [0.86, 5560],
  [0.88, 5530],
  [0.89, 5440],
  [0.91, 5350],
  [0.93, 5290],
  [0.95, 5200],
  [0.96, 5110],
  [0.98, 5030],
  [1.0, 5000],
];

/**
 * SC05's THIRD chart — the sideways crop, traced. Same rules as the other two:
 * no symbol, no axis, not attributed, and ONLY the candles are traced.
 *
 * ⚠ Its FIRST anchor is READ_2's LAST, so the three run as one series without
 * a gap bar at either seam.
 *
 * It sits in a NARROW band at the bottom of the same 5.000–7.000 scale —
 * 5.000 to 5.600, a range that forms where the decline stopped. That band is
 * the whole point: an average through a range has nowhere to slope, and a flat
 * line is what the scene needs to show. Widening the band would also widen the
 * shared domain and squash the two charts before it.
 */
export const READ_3: Anchor[] = [
  [0.0, 5000],
  [0.01, 5150],
  [0.03, 5250],
  [0.04, 5320],
  [0.06, 5230],
  [0.07, 5140],
  [0.09, 5120],
  [0.1, 5020],
  [0.12, 5090],
  [0.13, 5140],
  [0.15, 5160],
  [0.16, 5230],
  [0.18, 5350],
  [0.19, 5390],
  [0.21, 5460],
  [0.22, 5550],
  [0.24, 5510],
  [0.25, 5550],
  [0.27, 5530],
  [0.28, 5460],
  [0.3, 5530],
  [0.31, 5490],
  [0.33, 5550],
  [0.34, 5600],
  [0.36, 5530],
  [0.37, 5460],
  [0.39, 5420],
  [0.4, 5350],
  [0.42, 5250],
  [0.43, 5140],
  [0.45, 5000],
  [0.46, 5090],
  [0.48, 5190],
  [0.49, 5300],
  [0.51, 5280],
  [0.52, 5320],
  [0.54, 5230],
  [0.55, 5300],
  [0.57, 5250],
  [0.58, 5320],
  [0.6, 5280],
  [0.61, 5370],
  [0.63, 5320],
  [0.64, 5350],
  [0.66, 5320],
  [0.67, 5250],
  [0.69, 5210],
  [0.7, 5230],
  [0.72, 5190],
  [0.73, 5160],
  [0.75, 5210],
  [0.76, 5140],
  [0.78, 5070],
  [0.79, 5000],
  [0.81, 5050],
  [0.82, 5120],
  [0.84, 5210],
  [0.85, 5140],
  [0.87, 5250],
  [0.88, 5300],
  [0.9, 5230],
  [0.91, 5320],
  [0.93, 5370],
  [0.94, 5420],
  [0.96, 5490],
  [0.97, 5580],
  [0.99, 5550],
  [1.0, 5490],
];

/**
 * Anchors → a series of `n` closes.
 *
 * Straight lines between anchors would read as a polyline, so a little seeded
 * jitter is added — enough to look like a tape, small enough that it cannot
 * move a level. The LAST value is forced back onto the final anchor, because
 * that one is the screenshot's quoted close and has to be exact.
 */
/**
 * ═══ CG-B — THE BOLLINGER CHART, READ FROM THE CROP ═══
 *
 * [PLACEHOLDER] NOT traced by eye. Every bar below was read out of Simon's
 * screenshot pixel by pixel: the candle grid was recovered from the coloured
 * columns, then for each column the wide run of colour gave the body's two
 * edges and the one-pixel runs above and below it gave the wick's. Green closes
 * higher, red closes lower, which fixes which body edge is the open.
 *
 * Two things had to be subtracted first, and both would otherwise have been
 * read as candles: the dotted horizontal PRICE LINE, which is the one thing on
 * a chart that spans its whole width, and the two BAND LINES, which sit on the
 * boundary of the channel fill and are therefore easy to find exactly.
 *
 * ═══ AND IT WAS CHECKED AGAINST THE CROP'S OWN BANDS ═══
 *
 * That crop draws its Bollinger Bands, so the read is verifiable rather than
 * merely plausible. Computing BB(20, 2) over these closes and comparing it
 * with the bands the crop actually draws gives a mean error of 1.0% of the
 * price range — about five pixels, which is the width of the band lines
 * themselves. The chart in this scene is not a likeness of the reference; it
 * is the reference, to within the thickness of its own ink.
 *
 * The SHAPE is the crop's; the PRICES are not. Simon's note — follow the
 * chart, not the ticker — so the pixel heights are mapped linearly onto the
 * episode's own illustrative range and the scene draws no price axis. A linear
 * map preserves every proportion, so nothing about the shape is lost.
 *
 * ═══ ⚠ THE BODIES WERE THEN CORRECTED — A DELIBERATE DEPARTURE ═══
 *
 * The read collapsed most bodies. At the crop's resolution a body is often one
 * or two pixels of colour, so 42 of these 130 bars came back with open exactly
 * equal to close and 78 of them with a body under 8px on this chart — more
 * than half the tape drawn as doji, which the reference is not. Simon: "banyak
 * candlestick yang bodynya tipis (doji), harusnya tidak sama sekali."
 *
 * So every body under about 12px was OPENED OUT, and three rules kept the
 * correction from touching anything else:
 *
 *   CLOSES ARE UNTOUCHED. Only the open moves. Every close is exactly what was
 *     read, so the Bollinger bands, the squeeze, the volatility zones and the
 *     band touches this episode points at are all computed from the same
 *     numbers as before — the correction cannot move a single thing the scene
 *     makes a claim about. Verified: all 130 closes are identical.
 *   THE WICK GIVES WAY, not the body. A new open outside the read high or low
 *     extends that wick to meet it, which is why the range's floor moved from
 *     4300 to 4254 — 2% — and its ceiling did not move at all.
 *   DIRECTION COMES FROM THE MOVE. A bar with no body has no open to compare
 *     against, and `c >= o` had been colouring every one of them green. Each
 *     is now read against the PREVIOUS CLOSE, which is what actually happened
 *     there: 91 green / 39 red became 82 / 48.
 *
 * The sizes are spread between 12 and 22px from a seeded `mulberry32(20260826)`
 * rather than clamped flat, because 101 bars all given exactly the same body
 * would read as a bar chart. Seeded, so the tape is identical on every render.
 */
export const BANDS_OHLC: [number, number, number, number][] = [
  [4254, 4364, 4254, 4332],
  [4425, 4425, 4304, 4332],
  [4397, 4397, 4314, 4321],
  [4302, 4371, 4302, 4357],
  [4402, 4402, 4335, 4335],
  [4285, 4360, 4285, 4343],
  [4279, 4371, 4279, 4343],
  [4399, 4399, 4300, 4339],
  [4290, 4389, 4290, 4367],
  [4288, 4389, 4288, 4371],
  [4433, 4433, 4353, 4364],
  [4406, 4406, 4346, 4346],
  [4267, 4364, 4267, 4357],
  [4284, 4357, 4284, 4357],
  [4433, 4433, 4335, 4350],
  [4360, 4634, 4350, 4619],
  [4565, 4815, 4353, 4619],
  [4653, 4889, 4619, 4715],
  [4910, 4910, 4726, 4829],
  [4754, 4878, 4754, 4829],
  [4765, 4942, 4765, 4829],
  [4888, 4942, 4829, 4942],
  [4983, 4983, 4854, 4896],
  [4917, 4917, 4846, 4854],
  [4912, 4921, 4804, 4846],
  [4863, 4863, 4786, 4804],
  [4754, 4878, 4701, 4818],
  [4748, 4854, 4719, 4839],
  [4750, 4882, 4750, 4839],
  [4773, 4932, 4773, 4854],
  [4854, 4953, 4839, 4932],
  [4932, 4981, 4822, 4839],
  [4755, 4871, 4755, 4839],
  [4798, 4864, 4798, 4854],
  [4783, 4932, 4566, 4864],
  [4855, 4964, 4680, 4932],
  [4876, 4946, 4876, 4942],
  [4994, 5017, 4910, 4910],
  [4921, 4921, 4829, 4843],
  [4753, 4854, 4753, 4843],
  [4786, 4854, 4786, 4846],
  [4829, 4900, 4807, 4893],
  [4952, 4952, 4875, 4885],
  [4830, 4942, 4830, 4893],
  [4882, 4907, 4751, 4761],
  [4736, 4836, 4736, 4793],
  [4781, 4850, 4781, 4836],
  [4885, 4885, 4818, 4825],
  [4825, 4946, 4807, 4942],
  [4953, 5045, 4939, 5035],
  [5110, 5110, 4999, 5017],
  [4995, 5013, 4914, 4917],
  [4948, 4995, 4779, 4875],
  [4932, 4932, 4815, 4839],
  [4797, 4875, 4797, 4854],
  [4770, 4942, 4770, 4854],
  [4891, 4900, 4793, 4825],
  [4772, 4854, 4772, 4836],
  [4756, 4854, 4756, 4836],
  [4764, 4857, 4729, 4836],
  [4836, 4836, 4630, 4630],
  [4747, 4747, 4559, 4559],
  [4594, 4751, 4594, 4669],
  [4634, 4786, 4634, 4786],
  [4702, 4786, 4702, 4786],
  [4825, 4825, 4765, 4765],
  [4682, 4836, 4682, 4765],
  [4677, 4793, 4677, 4768],
  [4685, 4822, 4685, 4775],
  [4749, 4836, 4749, 4822],
  [4882, 4882, 4754, 4811],
  [4823, 4868, 4747, 4754],
  [4754, 4896, 4736, 4868],
  [4799, 4914, 4799, 4882],
  [4899, 4899, 4807, 4825],
  [4770, 4868, 4770, 4832],
  [4817, 4893, 4817, 4868],
  [4938, 4938, 4832, 4850],
  [4841, 4907, 4839, 4900],
  [4910, 5020, 4896, 5003],
  [5013, 5162, 5010, 5127],
  [5057, 5191, 5057, 5134],
  [5043, 5148, 5043, 5134],
  [5084, 5176, 5084, 5141],
  [5103, 5219, 5103, 5169],
  [5179, 5262, 5130, 5255],
  [5265, 5453, 5240, 5414],
  [5399, 5521, 5389, 5489],
  [5483, 5624, 5483, 5535],
  [5509, 5570, 5509, 5567],
  [5577, 5726, 5567, 5680],
  [5595, 5748, 5595, 5684],
  [5739, 5739, 5588, 5673],
  [5673, 5684, 5524, 5592],
  [5567, 5687, 5510, 5645],
  [5588, 5673, 5556, 5655],
  [5582, 5705, 5582, 5670],
  [5670, 5762, 5655, 5758],
  [5786, 5805, 5670, 5709],
  [5790, 5790, 5655, 5705],
  [5626, 5730, 5626, 5716],
  [5791, 5791, 5634, 5705],
  [5719, 5719, 5460, 5638],
  [5557, 5638, 5418, 5496],
  [5412, 5517, 5407, 5496],
  [5424, 5655, 5424, 5503],
  [5581, 5655, 5503, 5655],
  [5545, 5655, 5545, 5627],
  [5537, 5783, 5537, 5627],
  [5609, 5851, 5609, 5851],
  [5776, 6025, 5776, 6025],
  [5968, 6067, 5861, 6025],
  [6090, 6090, 5964, 6017],
  [6055, 6248, 5975, 5996],
  [6007, 6358, 6007, 6248],
  [6259, 6379, 6230, 6358],
  [6358, 6383, 6145, 6230],
  [6236, 6305, 6099, 6145],
  [6201, 6201, 6103, 6135],
  [6083, 6237, 6083, 6166],
  [6166, 6174, 6003, 6060],
  [6060, 6088, 5893, 5897],
  [5897, 6103, 5890, 6074],
  [6083, 6083, 5989, 6000],
  [6000, 6450, 5989, 6415],
  [6436, 6436, 6298, 6376],
  [6310, 6500, 6310, 6379],
  [6379, 6390, 6078, 6103],
  [6103, 6276, 6060, 6255],
  [6263, 6298, 6177, 6191],
];

/**
 * The nineteen closes BEFORE the first visible bar — the ones the crop's bands
 * are computed from and its window does not show. Not invented freely: their
 * level and their spread were SOLVED so that the computed band at bar 0 lands
 * on the band the crop actually draws.
 */
/**
 * ═══ CG-B — THE UPTREND THE TAPE RUNS INTO ═══
 *
 * [PLACEHOLDER] Sixty-five more bars, RIGHT of `BANDS_OHLC`, read out of
 * Simon's second pair of screenshots by the same pixel method described above
 * — "Screenshot 2026-08-26 at 15.40.22" for the candles and "…15.40.34" for
 * the bands. Bars 58–122 of that crop: the rally, ending at its high.
 *
 * ⚠ THE BANDS ARE NOT TRACED, THEY ARE COMPUTED. `bollinger` runs over the
 * joined closes, so the channel across the junction is the real 20-bar
 * calculation rather than two channels stitched together — which is also what
 * makes the second screenshot a CHECK on this read rather than a second source.
 *
 * ═══ HOW IT IS JOINED ═══
 *
 * TWO NUMBERS DO ALL THE WORK, and both are forced rather than chosen:
 *
 *   ASPECT. One reference pixel of height becomes 13.116/11.1406 chart-px —
 *     the ratio of our bar spacing to the crop's. That is the only mapping
 *     under which the new bars have the same steepness and the same body
 *     sizes, relative to their spacing, that they have in the reference. Pick
 *     any other and the rally is drawn either flatter or wilder than it is.
 *   LEVEL. The first new bar's OPEN is set to the last old bar's CLOSE, so the
 *     tape continues instead of gapping.
 *
 * Everything else follows. The rally rises 638 chart-px above where the old
 * tape ends, which is why the camera has to travel up as well as right.
 *
 * The no-doji correction documented above was applied here too, on the same
 * terms: 31 of the 65 bodies were opened out, and no close was touched.
 */
export const BANDS_EXT: [number, number, number, number][] = [
  [6191, 6447, 6169, 6414],
  [6383, 6548, 6336, 6486],
  [6440, 6575, 6440, 6525],
  [6569, 6569, 6458, 6509],
  [6506, 6620, 6497, 6581],
  [6517, 6598, 6517, 6581],
  [6549, 6648, 6549, 6620],
  [6620, 6653, 6475, 6503],
  [6423, 6536, 6423, 6509],
  [6545, 6545, 6347, 6453],
  [6453, 6609, 6447, 6564],
  [6564, 6603, 6386, 6453],
  [6381, 6509, 6381, 6481],
  [6467, 6570, 6467, 6548],
  [6548, 6704, 6525, 6687],
  [6687, 6943, 6676, 6882],
  [6915, 6915, 6787, 6854],
  [6854, 6876, 6670, 6709],
  [6743, 6804, 6609, 6653],
  [6726, 6726, 6626, 6642],
  [6674, 6674, 6520, 6603],
  [6603, 6653, 6475, 6536],
  [6536, 6726, 6520, 6648],
  [6648, 7144, 6648, 7082],
  [7031, 7177, 7010, 7105],
  [7084, 7200, 7084, 7149],
  [7089, 7172, 7088, 7161],
  [7161, 7489, 7155, 7417],
  [7417, 8058, 7411, 8002],
  [8036, 8102, 7751, 7946],
  [7946, 8325, 7829, 8119],
  [8119, 8208, 7857, 7902],
  [7896, 8219, 7890, 8158],
  [8192, 8208, 8097, 8130],
  [8164, 8186, 8002, 8074],
  [8033, 8269, 8033, 8119],
  [8119, 8370, 8119, 8253],
  [8253, 8431, 8191, 8392],
  [8392, 8721, 8375, 8676],
  [8615, 8771, 8592, 8715],
  [8715, 8715, 8592, 8626],
  [8571, 8687, 8492, 8643],
  [8643, 8709, 8269, 8297],
  [8297, 8431, 8141, 8219],
  [8219, 8598, 8214, 8503],
  [8545, 8548, 8414, 8481],
  [8481, 8693, 8470, 8609],
  [8609, 8609, 8514, 8537],
  [8505, 8637, 8492, 8592],
  [8592, 8659, 8397, 8492],
  [8394, 8526, 8342, 8498],
  [8498, 8732, 8414, 8698],
  [8693, 9038, 8236, 8576],
  [8570, 8927, 8542, 8776],
  [8713, 8821, 8713, 8776],
  [8772, 8882, 8698, 8865],
  [8865, 8871, 8386, 8604],
  [8619, 8665, 8392, 8548],
  [8548, 8921, 8492, 8865],
  [8871, 8960, 8737, 8787],
  [8782, 8916, 8737, 8882],
  [8799, 8966, 8799, 8882],
  [8882, 9139, 8877, 9088],
  [9094, 9328, 9022, 9205],
  [9117, 9367, 9117, 9211],
];

export const BANDS_PRIOR: number[] = [
  4245, 4144, 4239, 4166, 4164, 4191, 4251, 4159, 4269, 4182, 4161, 4212, 4110,
  4155, 4167, 4166, 4164, 4183, 4220,
];

export const fromAnchors = (
  anchors: Anchor[],
  n: number,
  seed: number,
  jitter = 0.004,
): number[] => {
  const rnd = seeded(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let k = 0;
    while (k < anchors.length - 2 && anchors[k + 1][0] < t) k++;
    const [t0, v0] = anchors[k];
    const [t1, v1] = anchors[k + 1];
    const span = Math.max(1e-9, t1 - t0);
    const p = Math.max(0, Math.min(1, (t - t0) / span));
    /* smoothstep, so a turn is a turn and not a corner */
    const e = p * p * (3 - 2 * p);
    const base = v0 + (v1 - v0) * e;
    out.push(base * (1 + (rnd() - 0.5) * 2 * jitter));
  }
  out[out.length - 1] = anchors[anchors.length - 1][1];
  return out;
};
