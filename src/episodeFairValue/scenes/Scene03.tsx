import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { SafeArea } from "../components/SafeArea";

export const Scene03: React.FC = () => {
  const frame = useCurrentFrame();

  // ── PART 1: Question (frames 0–66) ──────────────────────────────────────
  const questionOpacity = Math.min(
    interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [56, 66], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  const questionY = interpolate(frame, [0, 20], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── PART 2: Bridge line (frames 68–144) ─────────────────────────────────
  // 00:38.10–00:40.11; fade in 68-83, hold, fade out 129-144
  const bridgeOpacity = Math.min(
    interpolate(frame, [68, 83], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(frame, [129, 144], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );

  // ── PART 3 & 4: Three-row card (frames 154–320) ─────────────────────────
  // Part 2 empty hold extends to frame 154 (00:41.06). Card appears at 154.
  const cardOpacity = Math.min(
    interpolate(frame, [154, 169], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(frame, [310, 320], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  // Rows stagger 30 frames apart, same as original spec
  const row1Op = interpolate(frame, [154, 169], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const row1Y  = interpolate(frame, [154, 169], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const row2Op = interpolate(frame, [184, 199], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const row2Y  = interpolate(frame, [184, 199], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const row3Op = interpolate(frame, [214, 229], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const row3Y  = interpolate(frame, [214, 229], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // ── PART 5: Shop visual (frames 320–423) ────────────────────────────────
  // 00:46.22 → composition frame 1402 → scene frame 320
  const shopFadeOut  = interpolate(frame, [413, 423], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const drawProgress = interpolate(frame, [320, 350], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const captionOp    = interpolate(frame, [350, 365], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const ROOF_LEN = 250;
  const BLDG_LEN = 760;
  const WIN_LEN  = 184;
  const DOOR_LEN = 272;

  // ── PART 6: Annual Earnings card (frames 425–694) ─────────────────────
  // 00:50.07 → composition frame 1507 → scene frame 425
  const card6Opacity = Math.min(
    interpolate(frame, [425, 440], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    interpolate(frame, [674, 694], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const ruleW = interpolate(frame, [425, 440], [0, 800], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  // Columns span 00:50.10–00:54.27 → scene frames 428–565
  // Col1: 428 (00:50.10), Col2: 486 (00:52.08), Col3: 545 (00:54.10) done at 565 (00:54.27)
  const col1Op = interpolate(frame, [428, 448], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const col1Y  = interpolate(frame, [428, 448], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const col2Op = interpolate(frame, [486, 506], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const col2Y  = interpolate(frame, [486, 506], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const col3Op = interpolate(frame, [545, 565], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const col3Y  = interpolate(frame, [545, 565], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <SafeArea>

      {/* ── PART 1: Question ── */}
      {frame < 68 && (
        <div style={{
          opacity: questionOpacity,
          transform: `translateY(${questionY}px)`,
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 700,
          fontSize: 72,
          color: "#000000",
          textAlign: "center",
        }}>
          What Determines Fair Value?
        </div>
      )}

      {/* ── PART 2: Bridge line ── */}
      {frame >= 68 && frame < 148 && (
        <div style={{
          opacity: bridgeOpacity,
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 400,
          fontSize: 48,
          color: "#626266",
          textAlign: "center",
        }}>
          A Stock's Value Comes From Its Business.
        </div>
      )}

      {/* ── PART 3 & 4: Three-row card ── */}
      {frame >= 154 && frame < 320 && (
        <div style={{
          opacity: cardOpacity,
          width: 900,
          background: "#FFFFFF",
          borderRadius: 24,
          border: "1px solid #EDEEF0",
          overflow: "hidden",
        }}>
          {/* Row 1 — Profit */}
          <div style={{
            height: 140, display: "flex", alignItems: "center",
            padding: "0 40px", gap: 24,
            opacity: row1Op, transform: `translateY(${row1Y}px)`,
          }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(95,77,238,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#5F4DEE" strokeWidth="2" />
                <circle cx="12" cy="12" r="4"  stroke="#5F4DEE" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 40, color: "#000000" }}>Profit</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266" }}>How Much the Business Earns</div>
            </div>
          </div>

          <div style={{ height: 1, background: "#EDEEF0" }} />

          {/* Row 2 — Growth */}
          <div style={{
            height: 140, display: "flex", alignItems: "center",
            padding: "0 40px", gap: 24,
            opacity: row2Op, transform: `translateY(${row2Y}px)`,
          }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(95,77,238,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 19L10 12L14 16L19 8" stroke="#5F4DEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 8H14M19 8V13"       stroke="#5F4DEE" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 40, color: "#000000" }}>Growth</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266" }}>How Fast the Business Expands</div>
            </div>
          </div>

          <div style={{ height: 1, background: "#EDEEF0" }} />

          {/* Row 3 — Quality */}
          <div style={{
            height: 140, display: "flex", alignItems: "center",
            padding: "0 40px", gap: 24,
            opacity: row3Op, transform: `translateY(${row3Y}px)`,
          }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(95,77,238,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L4 7V12C4 16.4 7.4 20.5 12 21C16.6 20.5 20 16.4 20 12V7L12 3Z" stroke="#5F4DEE" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 40, color: "#000000" }}>Quality</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266" }}>How Strong the Company's Foundation Is</div>
            </div>
          </div>
        </div>
      )}

      {/* ── PART 5: Shop visual ── */}
      {frame >= 320 && frame < 425 && (
        <div style={{ opacity: shopFadeOut, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>

          <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
            {/* Roof — open triangle, purple */}
            <path
              d="M30 90 L140 30 L250 90"
              stroke="#5F4DEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={ROOF_LEN}
              strokeDashoffset={ROOF_LEN * (1 - drawProgress)}
            />
            {/* Building body */}
            <rect
              x="30" y="90" width="220" height="160"
              stroke="#5CC8E3" strokeWidth="2" fill="none" rx="4"
              strokeDasharray={BLDG_LEN}
              strokeDashoffset={BLDG_LEN * (1 - drawProgress)}
            />
            {/* Left window */}
            <rect
              x="42" y="100" width="48" height="44"
              stroke="#5CC8E3" strokeWidth="2" fill="none"
              strokeDasharray={WIN_LEN}
              strokeDashoffset={WIN_LEN * (1 - drawProgress)}
            />
            {/* Right window */}
            <rect
              x="190" y="100" width="48" height="44"
              stroke="#5CC8E3" strokeWidth="2" fill="none"
              strokeDasharray={WIN_LEN}
              strokeDashoffset={WIN_LEN * (1 - drawProgress)}
            />
            {/* Door */}
            <rect
              x="112" y="170" width="56" height="80"
              stroke="#5CC8E3" strokeWidth="2" fill="none"
              strokeDasharray={DOOR_LEN}
              strokeDashoffset={DOOR_LEN * (1 - drawProgress)}
            />
            {/* Sign — appears after 70% of drawing */}
            {drawProgress > 0.7 && (
              <>
                <rect x="100" y="130" width="80" height="24" rx="3" fill="rgba(92,200,227,0.20)" />
                <text x="140" y="147" textAnchor="middle" fontFamily="Plus Jakarta Sans" fontWeight="700" fontSize="20" fill="#5CC8E3">Shop</text>
              </>
            )}
          </svg>

          <div style={{
            opacity: captionOp,
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 400,
            fontSize: 40,
            color: "#626266",
            textAlign: "center",
            maxWidth: 800,
          }}>
            You're Buying a Business.
          </div>
        </div>
      )}

      {/* ── PART 6: Annual Earnings card ── */}
      {frame >= 425 && (
        <div style={{
          opacity: card6Opacity,
          width: 860,
          background: "#FFFFFF",
          borderRadius: 24,
          border: "1px solid #EDEEF0",
          boxSizing: "border-box",
        }}>
          <div style={{
            fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 48, color: "#000000",
            textAlign: "center", padding: "40px 0 16px",
          }}>
            Annual Earnings
          </div>
          <div style={{ height: 2, width: ruleW, background: "#5F4DEE", margin: "0 auto 32px" }} />
          <div style={{ display: "flex", alignItems: "stretch", paddingBottom: 48 }}>
            {/* Column 1 — 2024 (scene frame 449, 00:51.01) */}
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "20px 0",
              opacity: col1Op, transform: `translateY(${col1Y}px)`,
            }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266" }}>2024</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 44, color: "#5F4DEE" }}>Rp 1,000</div>
            </div>
            <div style={{ width: 1, background: "#EDEEF0", alignSelf: "stretch" }} />
            {/* Column 2 — 2025 (scene frame 539, 00:54.01) */}
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "20px 0",
              opacity: col2Op, transform: `translateY(${col2Y}px)`,
            }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266" }}>2025</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 44, color: "#5F4DEE" }}>Rp 2,000</div>
            </div>
            <div style={{ width: 1, background: "#EDEEF0", alignSelf: "stretch" }} />
            {/* Column 3 — 2026 (scene frame 629, 00:57.01) */}
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "20px 0",
              opacity: col3Op, transform: `translateY(${col3Y}px)`,
            }}>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 400, fontSize: 36, color: "#626266" }}>2026</div>
              <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 44, color: "#5F4DEE" }}>Rp 2,500</div>
            </div>
          </div>
        </div>
      )}

    </SafeArea>
  );
};
