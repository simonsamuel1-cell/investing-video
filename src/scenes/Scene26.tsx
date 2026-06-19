/**
 * S26 (B) — Technical: the MA5 signal & Chart Pro. Phone shows the Technical view
 * (combined clip 20–30s). Right zone: highlight the MA5 row (box + chip), a 54%
 * momentum gauge, and ⚠️ the compliance disclaimer chip. Longest validation scene,
 * mid-flow. (spec §7)
 *
 * TODO(studio): tune BOX_MA5 to the real MA5 row position in the clip.
 * TODO(compliance): confirm "earliest bullish signal" wording + disclaimer copy.
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneClip } from "../components/DeviceFrame";
import { Heading } from "../components/Heading";
import { Callout } from "../components/Callout";
import type { Box } from "../components/Callout";
import { DisclaimerChip } from "../components/DisclaimerChip";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn, ease } from "../util/anim";

const BOX_MA5: Box = { x: 120, y: 606, w: 404, h: 62 };

const Gauge = ({ pct }: { pct: number }) => {
  const frame = useCurrentFrame();
  const grow = ease(frame, [70, 100], [0, 1]);
  const r = 120;
  const arc = Math.PI * r; // semicircle length ≈ 377
  const val = arc * (pct / 100) * grow;
  return (
    <div style={{ position: "absolute", left: 640, top: 470, width: 320, opacity: fadeIn(frame, 66, 12) }}>
      <svg width={320} height={196} viewBox="0 0 320 196">
        <path d="M40 168 A120 120 0 0 1 280 168" fill="none" stroke={COLORS.hairline} strokeWidth={22} strokeLinecap="round" />
        <path
          d="M40 168 A120 120 0 0 1 280 168"
          fill="none"
          stroke={COLORS.purple}
          strokeWidth={22}
          strokeLinecap="round"
          strokeDasharray={`${val} ${arc}`}
        />
        <text x={160} y={150} textAnchor="middle" fontSize={58} fontWeight={800} fill={COLORS.black}>
          {Math.round(pct * grow)}%
        </text>
      </svg>
      <div style={{ textAlign: "center", fontSize: 28, fontWeight: 700, color: COLORS.black, marginTop: -6 }}>
        Momentum
      </div>
    </div>
  );
};

export const Scene26 = () => (
  <SceneWrap>
    <PhoneClip src={ASSETS.combo23_27} startSec={20} />
    <Heading x={640} y={108} width={800} size={46} delay={4}>
      Technical — timing the entry.
    </Heading>
    <Callout
      box={BOX_MA5}
      chip={{ x: 720, y: 250, w: 1010 }}
      label="MA5 — the earliest bullish signal"
      delay={16}
    />
    <Gauge pct={54} />
    <DisclaimerChip x={640} y={900} delay={20} />
  </SceneWrap>
);
