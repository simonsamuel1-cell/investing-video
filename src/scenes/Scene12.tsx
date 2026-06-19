/**
 * S12 (B) — three layers. The asset Scene_12_-_3_Tabs.png is a wide 4167×834 (5:1)
 * tab strip — NOT a portrait phone screen — so it is shown at its true aspect as a
 * framed tab banner, with each of the three tabs highlighted in sequence and a
 * leader down to its explanation card. (spec §7 — Sektor / Konsep / Grup)
 *
 * TODO(studio): tune BOX x-thirds to the real tab positions in the strip; if a
 * proper portrait screenshot of this view exists, swap to a PhoneStill instead.
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { Card } from "../components/Card";
import { ASSETS } from "../timeline";
import { COLORS, RADII } from "../theme";
import { fadeIn, ease } from "../util/anim";

const BANNER = { x: 260, y: 212, w: 1400, h: 280 };
const TAB_W = BANNER.w / 3;

const TABS = [
  { label: "Sektor", body: "Industries & sub-sectors", accent: COLORS.purple },
  { label: "Konsep", body: "The themes that move them", accent: COLORS.cyan },
  { label: "Grup", body: "Conglomerate families", accent: COLORS.purpleDark },
];

export const Scene12 = () => {
  const frame = useCurrentFrame();
  return (
    <SceneWrap>
      <Heading x={96} y={92} width={1728} align="center" size={52}>
        Three layers, one screen.
      </Heading>

      {/* the tab strip, shown at its true wide aspect */}
      <div
        style={{
          position: "absolute",
          left: BANNER.x,
          top: BANNER.y,
          width: BANNER.w,
          height: BANNER.h,
          borderRadius: RADII.card,
          border: `2px solid ${COLORS.purple}`,
          overflow: "hidden",
          background: COLORS.white,
          boxShadow: "0 18px 44px rgba(70,54,184,0.14)",
          opacity: fadeIn(frame, 4, 12),
        }}
      >
        <Img src={staticFile(ASSETS.tabs3)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* per-tab highlight box + vertical leader + explanation card */}
      {TABS.map((t, i) => {
        const slotX = BANNER.x + i * TAB_W;
        const cx = slotX + TAB_W / 2;
        const delay = 16 + i * 22;
        const boxOp = fadeIn(frame, delay, 8);
        const leadT = ease(frame, [delay + 4, delay + 16], [0, 1]);
        const cardTop = 556;
        return (
          <div key={t.label}>
            {/* highlight on the tab */}
            <div
              style={{
                position: "absolute",
                left: slotX + 24,
                top: BANNER.y + 26,
                width: TAB_W - 48,
                height: BANNER.h - 52,
                borderRadius: 14,
                border: `2px solid ${t.accent}`,
                background: COLORS.purpleWash,
                opacity: boxOp,
              }}
            />
            {/* leader down to the card */}
            <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none", opacity: boxOp }}>
              <line
                x1={cx}
                y1={BANNER.y + BANNER.h}
                x2={cx}
                y2={cardTop}
                stroke={COLORS.cyan}
                strokeWidth={2}
                strokeDasharray={cardTop - (BANNER.y + BANNER.h)}
                strokeDashoffset={(cardTop - (BANNER.y + BANNER.h)) * (1 - leadT)}
              />
              <circle cx={cx} cy={BANNER.y + BANNER.h} r={4} fill={t.accent} />
            </svg>
            {/* card */}
            <Card
              x={slotX + 16}
              y={cardTop}
              w={TAB_W - 32}
              h={236}
              accent={t.accent}
              delay={delay + 6}
              title={t.label}
              titleSize={40}
              body={t.body}
              bodySize={26}
            />
          </div>
        );
      })}
    </SceneWrap>
  );
};
