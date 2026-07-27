/**
 * Scene13C — from 8433, duration 401 (13.37s). Three Soldiers & Three Crows.
 * Full CaseStudyLayoutFrame; right DemoChart split with a lower volume sub-panel;
 * open ticks into the prior body; a lengthening momentum baseline (not an arrow);
 * mirror to Three Black Crows.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CaseStudyLayoutFrame, LEFT_SUBZONE } from "../components/CaseStudyLayoutFrame";
import { ReferenceCard } from "../components/ReferenceCard";
import { DemoChart, type Annotation, RIGHT_PANEL } from "../components/DemoChart";
import { IllustrationTag } from "../components/IllustrationTag";
import { theme } from "../theme";
import { sec, progress, textReveal, mulberry32, type OHLC } from "../helpers";

const SOLDIERS_REF: OHLC[] = [
  { open: 1240, high: 1312, low: 1234, close: 1304 },
  { open: 1268, high: 1372, low: 1262, close: 1364 },
  { open: 1330, high: 1436, low: 1324, close: 1428 },
];
const CROWS_REF: OHLC[] = [
  { open: 1436, high: 1442, low: 1364, close: 1372 },
  { open: 1408, high: 1414, low: 1304, close: 1312 },
  { open: 1346, high: 1352, low: 1240, close: 1248 },
];

const buildDemo = (up: boolean): OHLC[] => {
  const rnd = mulberry32(up ? 141 : 142);
  const out: OHLC[] = [];
  const a = up ? 1140 : 1440;
  const b = up ? 1230 : 1350;
  let prev = a;
  for (let i = 0; i < 9; i++) {
    const drift = a + ((b - a) * i) / 8;
    const open = prev;
    const close = Math.round(drift + (rnd() - 0.5) * 16);
    out.push({ open, high: Math.round(Math.max(open, close) + 3 + rnd() * 8), low: Math.round(Math.min(open, close) - (3 + rnd() * 8)), close });
    prev = close;
  }
  if (up) {
    out.push({ open: 1236, high: 1312, low: 1230, close: 1304 });
    out.push({ open: 1272, high: 1372, low: 1266, close: 1364 });
    out.push({ open: 1332, high: 1436, low: 1326, close: 1428 });
    prev = 1428;
    for (let i = 0; i < 6; i++) {
      const drift = 1428 + ((1540 - 1428) * (i + 1)) / 6;
      const open = prev;
      const close = Math.round(drift + (rnd() - 0.5) * 14);
      out.push({ open, high: Math.round(Math.max(open, close) + 4 + rnd() * 8), low: Math.round(Math.min(open, close) - (4 + rnd() * 8)), close });
      prev = close;
    }
  } else {
    out.push({ open: 1440, high: 1446, low: 1364, close: 1372 });
    out.push({ open: 1404, high: 1410, low: 1304, close: 1312 });
    out.push({ open: 1344, high: 1350, low: 1240, close: 1248 });
    prev = 1248;
    for (let i = 0; i < 6; i++) {
      const drift = 1248 + ((1140 - 1248) * (i + 1)) / 6;
      const open = prev;
      const close = Math.round(drift + (rnd() - 0.5) * 14);
      out.push({ open, high: Math.round(Math.max(open, close) + 4 + rnd() * 8), low: Math.round(Math.min(open, close) - (4 + rnd() * 8)), close });
      prev = close;
    }
  }
  return out;
};

const DEMO_UP = buildDemo(true);
const DEMO_DOWN = buildDemo(false);

const T = { frame: 0.0, ref: 0.4, base: 1.0, s1: 2.4, s2: 3.6, s3: 4.8, after: 6.0, flip: 7.6, hold: 13.4 };

const Row = ({ f, from, left, right }: { f: number; from: number; left: string; right: string }) => {
  const r = textReveal(f, from);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", opacity: r.opacity, transform: `translateY(${r.y}px)`, fontFamily: theme.type.family, fontSize: theme.type.label.size, fontWeight: theme.type.label.weight, color: theme.colors.ink, marginBottom: 22 }}>
      <span style={{ color: theme.colors.slate }}>{left}</span>
      <span>{right}</span>
    </div>
  );
};

export const Scene13C = () => {
  const f = useCurrentFrame();
  const flip = f >= sec(T.flip) ? progress(f, sec(T.flip), sec(0.8)) : 0;
  const isCrows = flip >= 0.5;
  const upOpacity = f < sec(T.flip) ? 1 : 1 - flip;
  const downOpacity = flip;

  const ann = (down: boolean): Annotation[] => [
    { index: 9, text: down ? "Opens inside yesterday's body." : "Opens inside yesterday's body.", atFrame: sec(T.s1) },
    { index: 10, text: down ? "Closes near the low." : "Closes near the high.", atFrame: sec(T.s2) },
    { index: 11, text: down ? "Same sellers, further each day." : "Same buyers, further each day.", atFrame: sec(T.s3) },
  ];
  const vol = { heights: [0.5, 0.72, 0.95], labels: ["1.2M", "1.8M", "2.4M"], from: sec(T.s1), stagger: sec(1.2), startIndex: 9 };

  // lengthening momentum baseline beneath the candle sub-zone
  const momentum = Math.max(0, Math.min(3, Math.floor((f - sec(T.s1)) / sec(1.2)) + (f >= sec(T.s1) ? 1 : 0)));
  const mFrac = f >= sec(T.s1) ? Math.min(1, (f - sec(T.s1)) / sec(3.6)) : 0;

  return (
    <SafeArea>
      <CaseStudyLayoutFrame
        tabs={[
          { label: "Engulfing", state: "done" },
          { label: "Hammer &\nShooting Star", state: "done" },
          { label: "Morning &\nEvening Star", state: "done" },
          { label: "Soldiers &\nCrows", state: "active", ruleColor: isCrows ? "red" : "green" },
        ]}
        leftPanel={<ReferenceCard candles={isCrows ? CROWS_REF : SOLDIERS_REF} caption={isCrows ? "Three Black Crows" : "Three White Soldiers"} reveal={progress(f, sec(T.ref), sec(0.5))} flip={flip < 0.5 ? flip : 1 - flip} />}
        leftSubZone={
          <div style={{ position: "absolute", left: LEFT_SUBZONE.x, top: LEFT_SUBZONE.y + 40, width: LEFT_SUBZONE.w }}>
            <Row f={f} from={sec(T.s1)} left="Opens" right="Inside Prior Body" />
            <Row f={f} from={sec(T.s2)} left="Closes" right={isCrows ? "Near The Low" : "Near The High"} />
            <Row f={f} from={sec(T.s3)} left="Reading" right={isCrows ? "Committed Selling" : "Committed Buying"} />
          </div>
        }
        rightPanel={
          <>
            {upOpacity > 0.001 && <DemoChart data={DEMO_UP} buildFrom={sec(T.base)} buildStagger={2} annotations={f < sec(T.flip) ? ann(false) : []} refTickIndex={9} volume={vol} opacity={upOpacity} />}
            {downOpacity > 0.001 && <DemoChart data={DEMO_DOWN} buildFrom={0} buildStagger={0} annotations={ann(true)} refTickIndex={9} volume={{ ...vol, from: 0, stagger: 0 }} opacity={downOpacity} />}
            {/* momentum baseline — a lengthening measure, not an arrow */}
            {momentum > 0 && (
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={theme.canvas.width} height={theme.canvas.height}>
                <line x1={RIGHT_PANEL.x + 30} y1={RIGHT_PANEL.y + 478} x2={RIGHT_PANEL.x + 30 + (RIGHT_PANEL.w - 200) * mFrac} y2={RIGHT_PANEL.y + 478} stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} />
              </svg>
            )}
          </>
        }
      />
      <IllustrationTag />
    </SafeArea>
  );
};
