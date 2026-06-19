/**
 * S27 (B) — Company tab: every Concept Sector membership. Phone shows the Company
 * tab (combined clip 35–43s). Right zone: a small membership list, each row with
 * its momentum %. Illustrative infographic (generic theme labels; % in brand
 * purple/cyan, never gain/loss green/red). (spec §7)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneClip } from "../components/DeviceFrame";
import { Heading } from "../components/Heading";
import { ASSETS } from "../timeline";
import { COLORS, RADII } from "../theme";
import { fadeIn, rise } from "../util/anim";

export const MEMBERSHIPS = [
  { name: "Infrastruktur", pct: "+4.2%", c: COLORS.purple },
  { name: "Proyek Pemerintah", pct: "+2.6%", c: COLORS.cyan },
  { name: "Material Dasar", pct: "+1.4%", c: COLORS.purpleLight },
];

export const Scene27 = () => {
  const frame = useCurrentFrame();
  return (
    <SceneWrap>
      <PhoneClip src={ASSETS.combo23_27} startSec={35} />
      <Heading x={640} y={120} width={800} size={46} delay={4}>
        One stock can sit in many themes.
      </Heading>
      {MEMBERSHIPS.map((m, i) => {
        const d = 18 + i * 12;
        return (
          <div
            key={m.name}
            style={{
              position: "absolute",
              left: 640,
              top: 290 + i * 132,
              width: 1100,
              height: 104,
              borderRadius: RADII.card,
              border: `2px solid ${COLORS.hairline}`,
              background: COLORS.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 32px",
              opacity: fadeIn(frame, d, 12),
              transform: `translateY(${rise(frame, d, 14, 18)}px)`,
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, background: m.c }} />
              <span style={{ fontSize: 32, fontWeight: 700, color: COLORS.black }}>{m.name}</span>
            </span>
            <span style={{ fontSize: 32, fontWeight: 800, color: m.c }}>{m.pct}</span>
          </div>
        );
      })}
    </SceneWrap>
  );
};
