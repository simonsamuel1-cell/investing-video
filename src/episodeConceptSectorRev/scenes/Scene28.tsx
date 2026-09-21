/**
 * S28 (B) — multiple themes = conviction. Reuse the Company tab (combined clip
 * 35–43s); highlight 2+ memberships and build a "Conviction" meter (cyan→purple).
 * Highlight uses a purple ring + check (not gain/loss green). (spec §7)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneFrame } from "../components/PhoneFrame";
import { Heading } from "../components/Heading";
import { ASSETS } from "../timeline";
import { COLORS, RADII } from "../theme";
import { fadeIn, rise, ease } from "../util/anim";

const MEMBERSHIPS = [
  { name: "Infrastructure", pct: "+4.2%", c: COLORS.purple },
  { name: "Government Projects", pct: "+2.6%", c: COLORS.cyan },
  { name: "Basic Materials", pct: "+1.4%", c: COLORS.purpleLight },
];

const Check = () => (
  <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5 10 17 19 7" />
  </svg>
);

export const Scene28 = () => {
  const frame = useCurrentFrame();
  const meter = ease(frame, [70, 130], [0, 1]); // builds conviction
  return (
    <SceneWrap>
      <PhoneFrame x={108} y={80} w={428} video={ASSETS.combo23_27} startSec={35} />
      <Heading x={640} y={108} width={800} size={46} delay={4}>
        In several themes at once? That's conviction.
      </Heading>

      {MEMBERSHIPS.map((m, i) => {
        const d = 16 + i * 10;
        const lit = i < 2; // highlight 2+
        return (
          <div
            key={m.name}
            style={{
              position: "absolute",
              left: 640,
              top: 250 + i * 120,
              width: 1100,
              height: 96,
              borderRadius: RADII.card,
              border: `2px solid ${lit ? COLORS.purple : COLORS.hairline}`,
              background: lit ? COLORS.purpleWash : COLORS.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 30px",
              opacity: fadeIn(frame, d, 12),
              transform: `translateY(${rise(frame, d, 14, 16)}px)`,
              boxShadow: lit ? "0 10px 26px rgba(95,77,238,0.16)" : "0 6px 16px rgba(0,0,0,0.04)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {lit && (
                <span style={{ width: 34, height: 34, borderRadius: 10, background: COLORS.purple, display: "flex", alignItems: "center", justifyContent: "center", opacity: fadeIn(frame, 40 + i * 8, 8) }}>
                  <Check />
                </span>
              )}
              <span style={{ fontSize: 30, fontWeight: 700, color: COLORS.black }}>{m.name}</span>
            </span>
            <span style={{ fontSize: 30, fontWeight: 800, color: m.c }}>{m.pct}</span>
          </div>
        );
      })}

      {/* conviction meter */}
      <div style={{ position: "absolute", left: 640, top: 640, width: 1100, opacity: fadeIn(frame, 66, 12) }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 700, color: COLORS.black, marginBottom: 12 }}>
          <span>Conviction</span>
          <span style={{ color: COLORS.purple }}>{meter > 0.66 ? "High" : meter > 0.33 ? "Building" : "Low"}</span>
        </div>
        <div style={{ width: "100%", height: 30, borderRadius: 15, background: COLORS.hairline, overflow: "hidden" }}>
          <div
            style={{
              width: `${meter * 100}%`,
              height: "100%",
              borderRadius: 15,
              background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.purple})`,
            }}
          />
        </div>
      </div>
    </SceneWrap>
  );
};
