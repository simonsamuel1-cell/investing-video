/**
 * Scene13D — from 8834, duration 210 (7.0s). The format dismantles itself: tab
 * labels fade one by one, then the checks + rule; the left panel dissolves and
 * the right panel expands to full width as every family's candles ease onto one
 * shared baseline — ending on a single plain unnamed chart.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { PatternTabRow, type PatternTab } from "../components/PatternTabRow";
import { CandleSeries } from "../components/CandleSeries";
import { IllustrationTag } from "../components/IllustrationTag";
import { theme } from "../theme";
import { sec, progress, fadeOut, mulberry32, type OHLC } from "../helpers";

// Combined chronological series — the four families embedded in one price path.
const COMBINED: OHLC[] = (() => {
  const rnd = mulberry32(139);
  const out: OHLC[] = [];
  let prev = 1200;
  const pts = [1200, 1320, 1260, 1180, 1300, 1420, 1360, 1280, 1240, 1360, 1480, 1560, 1500, 1440, 1520, 1600, 1560];
  for (let i = 0; i < pts.length; i++) {
    for (let k = 0; k < 2; k++) {
      const target = i + 1 < pts.length ? pts[i] + (pts[i + 1] - pts[i]) * (k / 2) : pts[i];
      const open = prev;
      const close = Math.round(target + (rnd() - 0.5) * 26);
      out.push({ open, high: Math.round(Math.max(open, close) + 5 + rnd() * 12), low: Math.round(Math.min(open, close) - (5 + rnd() * 12)), close });
      prev = close;
    }
  }
  return out;
})();

const T = { tab1: 0.6, tab2: 1.0, tab3: 1.4, tab4: 1.8, chrome: 2.4, expand: 3.2, land: 3.2, settle: 5.6 };

export const Scene13D = () => {
  const f = useCurrentFrame();
  const chromeFade = f >= sec(T.chrome) ? fadeOut(f, sec(T.chrome), sec(0.6)) : 1;
  const expand = f >= sec(T.expand) ? progress(f, sec(T.expand), sec(1.4)) : 0;

  const labelFade = (from: number) => (f >= sec(from) ? fadeOut(f, sec(from), sec(0.3)) : 1);
  const tabs: PatternTab[] = [
    { label: "Engulfing", state: "done", labelReveal: { opacity: labelFade(T.tab1), y: 0 }, checkPop: chromeFade },
    { label: "Hammer &\nShooting Star", state: "done", labelReveal: { opacity: labelFade(T.tab2), y: 0 }, checkPop: chromeFade },
    { label: "Morning &\nEvening Star", state: "done", labelReveal: { opacity: labelFade(T.tab3), y: 0 }, checkPop: chromeFade },
    { label: "Soldiers &\nCrows", state: "done", labelReveal: { opacity: labelFade(T.tab4), y: 0 }, checkPop: chromeFade },
  ];

  // right panel expands 603,1047 → 194,1456
  const px = interpolate(expand, [0, 1], [603, 194]);
  const pw = interpolate(expand, [0, 1], [1047, 1456]);

  return (
    <SafeArea>
      {/* Left panel dissolves as the expansion begins. */}
      <div style={{ position: "absolute", left: 194, top: 220, width: 389, height: 315, background: theme.colors.neutralFill, border: `${theme.stroke.hairline}px solid ${theme.colors.neutralLine}`, borderRadius: theme.radius.panel, opacity: 1 - expand }} />

      {/* Right panel expands into the full-width chart. */}
      <CandleSeries
        data={COMBINED}
        x={px}
        y={220}
        width={pw}
        height={680}
        revealFrom={sec(T.land)}
        revealStagger={1}
        opacity={1}
      />

      <div style={{ opacity: chromeFade }}>
        <PatternTabRow tabs={tabs} ruleDraw={chromeFade} />
      </div>
      <IllustrationTag />
    </SafeArea>
  );
};
