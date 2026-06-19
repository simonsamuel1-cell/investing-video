/**
 * S13 (B) — Sectors → sub-sectors. Phone scrolls the Sector list. Right zone:
 * 4 icon-chips appear on cue + a small nested bar showing sector → sub-sector.
 * (spec §7)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneClip } from "../components/DeviceFrame";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn } from "../util/anim";

const Leaf = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round">
    <path d="M12 21V9" />
    <path d="M12 12c0-4 3-7 8-7 0 4-3 7-8 7Z" />
    <path d="M12 15c0-3-2-5-6-5 0 3 2 5 6 5Z" />
  </svg>
);
const Cart = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h2l2 10h9l2-7H7" />
    <circle cx="9" cy="19" r="1.4" />
    <circle cx="17" cy="19" r="1.4" />
  </svg>
);
const Mountain = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round">
    <path d="M3 19 10 7l4 6 2-3 5 9z" />
  </svg>
);
const Building = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round">
    <rect x="5" y="4" width="14" height="16" rx="1" />
    <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" />
  </svg>
);

const CHIPS = [
  { label: "Agriculture", icon: <Leaf />, variant: "purple" as const },
  { label: "Consumer", icon: <Cart />, variant: "cyan" as const },
  { label: "Mining", icon: <Mountain />, variant: "purple" as const },
  { label: "Infrastructure", icon: <Building />, variant: "cyan" as const },
];

const SUBS = [
  { w: 300, c: COLORS.purple },
  { w: 220, c: COLORS.cyan },
  { w: 260, c: COLORS.purpleLight },
  { w: 280, c: COLORS.cyanDark },
];

export const Scene13 = () => {
  const frame = useCurrentFrame();
  return (
    <SceneWrap>
      <PhoneClip src={ASSETS.combo12_15} startSec={0} />
      <Heading x={640} y={110} width={800} size={46} delay={4}>
        Every sector splits into sub-sectors.
      </Heading>

      {CHIPS.map((c, i) => (
        <Chip
          key={c.label}
          x={640}
          y={236 + i * 96}
          width={560}
          variant={c.variant}
          size={32}
          delay={18 + i * 12}
          badge={c.icon}
        >
          {c.label}
        </Chip>
      ))}

      {/* nested bar: one sector → several sub-sectors */}
      <div style={{ position: "absolute", left: 640, top: 700, width: 1120, opacity: fadeIn(frame, 70, 14) }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.black, marginBottom: 14 }}>
          One sector → several sub-sectors
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {SUBS.map((s, i) => (
            <div
              key={i}
              style={{
                width: s.w,
                height: 64,
                borderRadius: 14,
                background: s.c,
                opacity: fadeIn(frame, 78 + i * 8, 10),
              }}
            />
          ))}
        </div>
      </div>
    </SceneWrap>
  );
};
