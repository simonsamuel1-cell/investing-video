/**
 * S24 (B) — the two checks: Company Quality + Reference Fair Value. Phone shows
 * the stock page (combined clip 3–13s). Right zone: two cards, each with a purple
 * box on the matching phone region; the fair-value 3-zone bar uses derived cyan
 * tints (range 933–1,094). Hold on each. Mid-flow. (spec §7)
 *
 * TODO(studio): tune BOX_Q / BOX_V to the real regions in Scene_23__24__25__26__27.mp4.
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneClip } from "../components/DeviceFrame";
import { Card } from "../components/Card";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn, ease } from "../util/anim";

const BOX_Q = { x: 120, y: 250, w: 404, h: 120 };
const BOX_V = { x: 120, y: 430, w: 404, h: 170 };

const PhoneBox = ({ box, to, delay }: { box: { x: number; y: number; w: number; h: number }; to: { x: number; y: number }; delay: number }) => {
  const frame = useCurrentFrame();
  const op = fadeIn(frame, delay, 8);
  const x1 = box.x + box.w;
  const y1 = box.y + box.h / 2;
  const len = Math.hypot(to.x - x1, to.y - y1);
  const t = ease(frame, [delay + 4, delay + 18], [0, 1]);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          borderRadius: 12,
          border: `2px solid ${COLORS.purple}`,
          background: COLORS.purpleWash,
          opacity: op,
        }}
      />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none", opacity: op }}>
        <line x1={x1} y1={y1} x2={to.x} y2={to.y} stroke={COLORS.cyan} strokeWidth={1.5} strokeDasharray={len} strokeDashoffset={len * (1 - t)} />
        <circle cx={x1} cy={y1} r={4} fill={COLORS.purple} />
      </svg>
    </>
  );
};

const FairValueBar = () => {
  const frame = useCurrentFrame();
  const reveal = ease(frame, [60, 84], [0, 1]);
  const markerX = ease(frame, [70, 96], [0, 0.58]); // settles inside the fair band
  const zones = [
    { w: 0.34, c: COLORS.cyanLight, label: "Undervalued" },
    { w: 0.32, c: COLORS.cyan, label: "Fair" },
    { w: 0.34, c: COLORS.cyanDark, label: "Overvalued" },
  ];
  const BAR_W = 1040;
  return (
    <div style={{ marginTop: 8, opacity: fadeIn(frame, 58, 12) }}>
      <div style={{ position: "relative", width: BAR_W, height: 56, display: "flex", gap: 6 }}>
        {zones.map((z, i) => (
          <div key={i} style={{ width: BAR_W * z.w, borderRadius: 12, background: z.c, opacity: reveal, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white, fontSize: 22, fontWeight: 700 }}>
            {z.label}
          </div>
        ))}
        {/* price marker */}
        <div style={{ position: "absolute", left: BAR_W * markerX - 2, top: -10, width: 4, height: 76, background: COLORS.black, borderRadius: 2, opacity: reveal }} />
        <div style={{ position: "absolute", left: BAR_W * markerX - 30, top: -42, fontSize: 22, fontWeight: 800, color: COLORS.black, opacity: reveal }}>Price</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: BAR_W, marginTop: 12, fontSize: 24, fontWeight: 700, color: COLORS.black, opacity: reveal }}>
        <span>Rp 933</span>
        <span style={{ color: COLORS.ink, fontWeight: 600 }}>Reference fair value</span>
        <span>Rp 1,094</span>
      </div>
    </div>
  );
};

export const Scene24 = () => {
  const frame = useCurrentFrame();
  return (
    <SceneWrap>
      <PhoneClip src={ASSETS.combo23_27} startSec={3} />

      <PhoneBox box={BOX_Q} to={{ x: 640, y: 336 }} delay={18} />
      <PhoneBox box={BOX_V} to={{ x: 640, y: 640 }} delay={46} />

      <Card x={640} y={236} w={1100} h={200} accent={COLORS.purple} delay={20} title="1 · Company Quality" titleSize={36}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 6 }}>
          <span style={{ padding: "10px 28px", borderRadius: 14, background: COLORS.purple, color: COLORS.white, fontSize: 34, fontWeight: 800 }}>Good</span>
          <span style={{ fontSize: 26, fontWeight: 500, color: COLORS.black, opacity: fadeIn(frame, 30, 12) }}>
            Profitability, balance sheet & growth — graded.
          </span>
        </div>
      </Card>

      <Card x={640} y={478} w={1180} h={300} accent={COLORS.cyan} delay={48} title="2 · Reference Fair Value" titleSize={36}>
        <FairValueBar />
      </Card>
    </SceneWrap>
  );
};
