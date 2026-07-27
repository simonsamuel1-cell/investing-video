/**
 * Scene13B — from 8015, duration 418 (13.93s). Morning & Evening Star.
 * Full CaseStudyLayoutFrame: static ReferenceCard (left), read-out rows (left
 * sub-zone), and the beat-driven DemoChart (right) with the after-move. Pause
 * beat isolates the indecision candle, then a mirror flip inverts to Evening
 * Star. Left panel is static apart from the flip + dim.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CaseStudyLayoutFrame, LEFT_SUBZONE } from "../components/CaseStudyLayoutFrame";
import { ReferenceCard } from "../components/ReferenceCard";
import { DemoChart, type Annotation } from "../components/DemoChart";
import { type PatternTab } from "../components/PatternTabRow";
import { IllustrationTag } from "../components/IllustrationTag";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { sec, progress, textReveal, mulberry32, type OHLC } from "../helpers";

// Reference (Morning Star) — three candles.
const MORNING_REF: OHLC[] = [
  { open: 1382, high: 1390, low: 1298, close: 1306 },
  { open: 1288, high: 1298, low: 1274, close: 1284 },
  { open: 1292, high: 1372, low: 1286, close: 1366 },
];
const EVENING_REF: OHLC[] = [
  { open: 1306, high: 1398, low: 1298, close: 1382 },
  { open: 1384, high: 1394, low: 1370, close: 1380 },
  { open: 1376, high: 1382, low: 1296, close: 1302 },
];

const buildDemo = (down: boolean): OHLC[] => {
  const rnd = mulberry32(down ? 131 : 132);
  const out: OHLC[] = [];
  // trend 0–14
  const a = down ? 1620 : 1310;
  const b = down ? 1320 : 1620;
  let prev = a;
  for (let i = 0; i < 15; i++) {
    const drift = a + ((b - a) * i) / 14;
    const open = prev;
    const close = Math.round(drift + (rnd() - 0.5) * 20);
    out.push({ open, high: Math.round(Math.max(open, close) + 4 + rnd() * 10), low: Math.round(Math.min(open, close) - (4 + rnd() * 10)), close });
    prev = close;
  }
  // star 15–17 (down = Morning at the low, up = Evening at the high)
  if (down) {
    out.push({ open: 1340, high: 1348, low: 1288, close: 1296 });
    out.push({ open: 1284, high: 1294, low: 1272, close: 1282 });
    out.push({ open: 1288, high: 1372, low: 1282, close: 1362 });
  } else {
    out.push({ open: 1580, high: 1636, low: 1572, close: 1628 });
    out.push({ open: 1632, high: 1644, low: 1620, close: 1634 });
    out.push({ open: 1628, high: 1636, low: 1552, close: 1558 });
  }
  // after-move 18–21
  const c0 = down ? 1366 : 1558;
  const c1 = down ? 1478 : 1450;
  prev = c0;
  for (let i = 0; i < 4; i++) {
    const drift = c0 + ((c1 - c0) * (i + 1)) / 4;
    const open = prev;
    const close = Math.round(drift + (rnd() - 0.5) * 16);
    out.push({ open, high: Math.round(Math.max(open, close) + 4 + rnd() * 10), low: Math.round(Math.min(open, close) - (4 + rnd() * 10)), close });
    prev = close;
  }
  return out;
};

const DEMO_MORNING = buildDemo(true);
const DEMO_EVENING = buildDemo(false);

const T = { frame: 0.0, ref: 0.4, trend: 1.0, c15: 2.6, c16: 3.8, c17: 5.0, refLine: 6.0, after: 6.6, pause: 8.2, restore: 10.0, flip: 10.6, hold: 13.9 };

const Row = ({ f, from, left, right }: { f: number; from: number; left: string; right: string }) => {
  const r = textReveal(f, from);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", opacity: r.opacity, transform: `translateY(${r.y}px)`, fontFamily: theme.type.family, fontSize: theme.type.label.size, fontWeight: theme.type.label.weight, color: theme.colors.ink, marginBottom: 22 }}>
      <span style={{ color: theme.colors.slate }}>{left}</span>
      <span>{right}</span>
    </div>
  );
};

export const Scene13B = () => {
  const f = useCurrentFrame();
  const flip = f >= sec(T.flip) ? progress(f, sec(T.flip), sec(0.8)) : 0;
  const isEvening = flip >= 0.5;

  const pauseDim = f >= sec(T.pause) ? progress(f, sec(T.pause), 12) * (1 - progress(f, sec(T.restore), 12)) : 0;
  const isolate = f >= sec(T.pause) && f < sec(T.restore) ? 16 : undefined;

  const morningAnn: Annotation[] = [
    { index: 15, text: "Sellers still pushing.", atFrame: sec(T.c15) },
    { index: 16, text: "Neither side commits.", atFrame: sec(T.c16) },
    { index: 17, text: "Buyers take the level back.", atFrame: sec(T.c17) },
  ];
  const eveningAnn: Annotation[] = [
    { index: 15, text: "Buyers still pushing.", atFrame: sec(T.c15) },
    { index: 16, text: "Neither side commits.", atFrame: sec(T.c16) },
    { index: 17, text: "Sellers take the level back.", atFrame: sec(T.c17) },
  ];

  const tabs: PatternTab[] = [
    { label: "Engulfing", state: "done" },
    { label: "Hammer &\nShooting Star", state: "done" },
    { label: "Morning &\nEvening Star", state: "active", ruleColor: isEvening ? "red" : "green" },
    { label: "Soldiers &\nCrows", state: "pending" },
  ];

  const morningOpacity = f < sec(T.flip) ? 1 : 1 - flip;
  const eveningOpacity = flip;

  return (
    <SafeArea>
      <CaseStudyLayoutFrame
        tabs={tabs}
        leftPanel={
          <ReferenceCard
            candles={isEvening ? EVENING_REF : MORNING_REF}
            caption={isEvening ? "Evening Star" : "Morning Star"}
            reveal={progress(f, sec(T.ref), sec(0.5))}
            flip={flip < 0.5 ? flip : 1 - flip}
            dim={pauseDim}
          />
        }
        leftSubZone={
          <div style={{ position: "absolute", left: LEFT_SUBZONE.x, top: LEFT_SUBZONE.y + 40, width: LEFT_SUBZONE.w }}>
            <Row f={f} from={sec(T.c15)} left="Candle 1" right="Strong Move" />
            <Row f={f} from={sec(T.c16)} left="Candle 2" right="Indecision" />
            <Row f={f} from={sec(T.c17)} left="Candle 3" right="Reversal" />
          </div>
        }
        rightPanel={
          <>
            {morningOpacity > 0.001 && (
              <DemoChart
                data={DEMO_MORNING}
                buildFrom={sec(T.trend)}
                buildStagger={2}
                annotations={f < sec(T.flip) ? morningAnn : []}
                refLine={{ price: 1274, from: sec(T.refLine) }}
                refTickIndex={15}
                isolateIndex={isolate}
                opacity={morningOpacity}
              />
            )}
            {eveningOpacity > 0.001 && (
              <DemoChart data={DEMO_EVENING} buildFrom={0} buildStagger={0} annotations={eveningAnn} refLine={{ price: 1644, from: 0 }} refTickIndex={15} opacity={eveningOpacity} />
            )}
          </>
        }
      />
      {isolate !== undefined && <Chip label="Control Changes Here" x={1120} y={300} variant="indigo" startFrame={sec(T.pause)} anchor="center" />}
      <IllustrationTag />
    </SafeArea>
  );
};
