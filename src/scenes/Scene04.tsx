import React from "react";
import { useCurrentFrame, interpolate, Easing, staticFile, Img } from "remotion";
import { SafeArea } from "../components/SafeArea";

const rows = [
  {
    label: "Valuation Model",
    desc: "Discounted Cash Flow, P/E, P/B...",
    icon: (
      <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="14" width="4" height="6" stroke="#5F4DEE" strokeWidth="1.8" rx="1"/>
        <rect x="9" y="8" width="4" height="12" stroke="#5F4DEE" strokeWidth="1.8" rx="1"/>
        <rect x="16" y="3" width="4" height="17" stroke="#5F4DEE" strokeWidth="1.8" rx="1"/>
      </svg>
    ),
  },
  {
    label: "Financial Statements",
    desc: "Revenue, Assets, Debt, Cash Flow...",
    icon: (
      <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="2" width="14" height="18" rx="2" stroke="#5F4DEE" strokeWidth="1.8"/>
        <line x1="7" y1="8" x2="13" y2="8" stroke="#5F4DEE" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="7" y1="12" x2="13" y2="12" stroke="#5F4DEE" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="7" y1="16" x2="10" y2="16" stroke="#5F4DEE" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Peer Comparison",
    desc: "Benchmarked Against Similar Companies",
    icon: (
      <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
        <path d="M3 11H19M11 3V19" stroke="#5F4DEE" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="7" cy="7" r="2.5" stroke="#5F4DEE" strokeWidth="1.8"/>
        <circle cx="15" cy="15" r="2.5" stroke="#5F4DEE" strokeWidth="1.8"/>
      </svg>
    ),
  },
];

export const Scene04: React.FC = () => {
  const frame = useCurrentFrame();

  // Beat 1 elements fade out at 420
  const beat1Opacity = interpolate(frame, [420, 435], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // "Here's the problem." — 0:59.25 → scene frame 17
  const introOpacity = interpolate(frame, [17, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const introY = interpolate(frame, [17, 32], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Rows timed to VO: 1:03.15 / 1:05.29 / 1:07.22 → scene frames 127 / 201 / 254
  const rowStarts = [127, 201, 254];

  // Tagline: 1:10.05 → scene frame 327
  const taglineOpacity = interpolate(frame, [327, 342], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const taglineY = interpolate(frame, [327, 342], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const underlineWidth = interpolate(frame, [342, 357], [0, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Beat 2
  const beat2Opacity = interpolate(frame, [435, 445], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const badgeOpacity = interpolate(frame, [435, 445], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Scroll: image is tall (approx 1400px natural). Container 600×700px.
  const containerH = 700;
  const imageH = 1400;
  const scrollY = interpolate(frame, [435, 816], [0, -(imageH - containerH)], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade-to-background at bottom
  const wipeOpacity = interpolate(frame, [780, 816], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SafeArea>
      {/* Beat 1 */}
      {frame < 435 && (
        <div style={{ opacity: beat1Opacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          {/* "Here's the problem." — fades in at frame 17 */}
          <div style={{
            opacity: introOpacity,
            transform: `translateY(${introY}px)`,
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 700,
            fontSize: 48,
            color: "#000000",
            textAlign: "center",
          }}>
            Here's the problem.
          </div>
          <div style={{ width: 1100, background: "#FFFFFF", borderRadius: 24, border: "1px solid #EDEEF0", overflow: "hidden" }}>
            {rows.map((row, i) => {
              const rowOp = interpolate(frame, [rowStarts[i], rowStarts[i] + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
              const rowY = interpolate(frame, [rowStarts[i], rowStarts[i] + 20], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
              return (
                <React.Fragment key={i}>
                  <div style={{ height: 140, display: "flex", alignItems: "center", padding: "0 40px", gap: 24, opacity: rowOp, transform: `translateY(${rowY}px)` }}>
                    <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(95,77,238,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {row.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 40, color: "#000000" }}>{row.label}</div>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266" }}>{row.desc}</div>
                    </div>
                  </div>
                  {i < rows.length - 1 && <div style={{ height: 1, background: "#EDEEF0" }} />}
                </React.Fragment>
              );
            })}
          </div>
          {/* Tagline below card */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: taglineOpacity, transform: `translateY(${taglineY}px)` }}>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 48, color: "#000000", textAlign: "center" }}>
              Takes Skill. Takes Hours. For Just One Stock.
            </div>
            <div style={{ height: 2, width: underlineWidth, background: "#5CC8E3" }} />
          </div>
        </div>
      )}

      {/* Beat 2 — absolute so it doesn't push Beat 1 in the flex row during crossfade */}
      {frame >= 420 && (
        <div style={{ opacity: beat2Opacity, position: "absolute", top: 54, left: 96, width: 1728, height: 918, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, transform: "translateX(-100px) translateY(-100px)" }}>
          {/* Badge */}
          <div style={{ opacity: badgeOpacity, background: "#5F4DEE", borderRadius: 40, padding: "16px 36px", fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 28, color: "#FFFFFF" }}>
            900+ Stocks on IDX
          </div>
          {/* Scroll container */}
          <div style={{ width: 600, height: containerH, overflow: "hidden", borderRadius: 12, position: "relative" }}>
            <div style={{ transform: `translateY(${scrollY}px)` }}>
              <Img src={staticFile("Scene_04.jpg")} style={{ width: 600, display: "block" }} />
            </div>
            {/* Wipe to background */}
            {frame >= 780 && (
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: containerH,
                background: "#F5F5F5",
                opacity: wipeOpacity,
                transformOrigin: "bottom",
              }} />
            )}
          </div>
          </div>
        </div>
      )}
    </SafeArea>
  );
};
