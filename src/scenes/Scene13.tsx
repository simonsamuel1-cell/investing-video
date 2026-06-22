/**
 * S13 (Layout B-side, TWO states; phone FIXED) — "Sectors cover real business
 * categories — Agriculture, Consumer, Mining, Infrastructure — broken down further
 * into Tuntun's own sub-sectors for deeper precision."
 *
 * One fixed <PhoneFrame> on the left; only the recording inside cross-fades:
 *  State 1: Scene_12__13__14__15.mp4 @00:07 (Sector list).
 *  State 2: Scene_13.mp4 (Tuntun Sub-Sectors) + bottom strip appears.
 * Chips pop sequentially as the VO names each. No grey panels (G2). Ref:
 * Scene_13.png / Scene_13_2.png (layout only). (spec §13)
 */
import { OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneFrame } from "../components/PhoneFrame";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn } from "../util/anim";

const SPLIT = 206; // VO: "further into Tuntun's own sub-sectors"
const screen = (opacity: number): CSSProperties => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  opacity,
});

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
  const s2 = fadeIn(frame, SPLIT, 12); // 0 → State 1, 1 → State 2
  const showS1 = frame < SPLIT + 16;
  const showS2 = frame >= SPLIT - 2;

  return (
    <SceneWrap>
      {/* fixed phone; inner recording cross-fades */}
      <PhoneFrame x={108} y={80} w={428}>
        {showS1 && <OffthreadVideo src={staticFile(ASSETS.combo12_15)} trimBefore={7 * 30} muted style={screen(1 - s2)} />}
        {/* Scene_13.mp4 00:02–00:05 played ~1:1 (slight slow ×1.11) per v2; the
            State-2 tail beyond ~3s holds the last frame. */}
        {showS2 && (
          <OffthreadVideo
            src={staticFile(ASSETS.sectorScroll)}
            trimBefore={60}
            playbackRate={0.9}
            muted
            style={screen(s2)}
          />
        )}
      </PhoneFrame>

      <Heading x={648} y={170} width={800} size={44} delay={4}>
        Every sector splits into sub-sectors.
      </Heading>

      {CHIPS.map((c, i) => (
        <Chip
          key={c.label}
          x={648}
          y={290 + i * 82}
          width={1128}
          variant={c.variant}
          size={30}
          delay={20 + i * 16}
          badge={c.icon}
        >
          {c.label}
        </Chip>
      ))}

      {/* State-2 bottom strip */}
      <div style={{ position: "absolute", left: 648, top: 638, width: 1128, opacity: s2 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.black, marginBottom: 12 }}>
          One sector → several sub-sectors
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {SUBS.map((s, i) => (
            <div key={i} style={{ width: s.w, height: 48, borderRadius: 12, background: s.c }} />
          ))}
        </div>
      </div>
    </SceneWrap>
  );
};
