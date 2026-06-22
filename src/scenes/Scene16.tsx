/**
 * S16 (Layout B-top, triple phone) — "One screen. Every angle the market moves in."
 * Title + cyan underline; three phones (Sector / Concept / Group) centred about
 * x=960; labels beneath on silver (no grey band, G2). Mid-flow & short (98f).
 * Ref: Scene_16.png (layout only).
 *
 * NB the Scene_16_-_Tab_*.jpg assets are screen-only (1080×2340, not pre-framed),
 * so they are wrapped in <PhoneFrame> (via PhoneCenter `img`) to read as phones.
 * (spec §16)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn, ease } from "../util/anim";

// GR4 (no-crop, 3-phone row): smaller phones centered about x=960 so the ROW
// (~x461–1459) clears the logo reserve x-range (1464) entirely; vertically centred
// so nothing is cropped top/bottom. Equal size + top.
const PHONES = [
  { src: ASSETS.tab1, cx: 606, label: "Sector" },
  { src: ASSETS.tab2, cx: 960, label: "Concept" },
  { src: ASSETS.tab3, cx: 1314, label: "Group" },
];
const PHONE_TOP = 266;
const PHONE_H = 576;
const LABEL_Y = 872;

export const Scene16 = () => {
  const frame = useCurrentFrame();
  const lineW = ease(frame, [8, 24], [0, 440]);
  return (
    <SceneWrap>
      {/* title + cyan underline */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 56,
          width: 1728,
          textAlign: "center",
          fontSize: 56,
          fontWeight: 800,
          letterSpacing: -0.5,
          color: COLORS.black,
          opacity: fadeIn(frame, 2, 12),
        }}
      >
        One screen, Every angle
      </div>
      <div style={{ position: "absolute", left: 0, top: 138, width: 1920, display: "flex", justifyContent: "center" }}>
        <div style={{ height: 6, width: lineW, background: COLORS.cyan, borderRadius: 3 }} />
      </div>

      {/* three framed phones */}
      {PHONES.map((p, i) => (
        <PhoneCenter key={p.label} img={p.src} cx={p.cx} top={PHONE_TOP} height={PHONE_H} delay={2 + i * 4} />
      ))}

      {/* labels on silver */}
      {PHONES.map((p, i) => (
        <div
          key={p.label}
          style={{
            position: "absolute",
            left: p.cx - 130,
            top: LABEL_Y,
            width: 260,
            textAlign: "center",
            fontSize: 32,
            fontWeight: 800,
            color: COLORS.black,
            opacity: fadeIn(frame, 14 + i * 4, 10),
          }}
        >
          {p.label}
        </div>
      ))}
    </SceneWrap>
  );
};
