/**
 * S1 (A) — ~30 abstract ticker tiles scrolling fast & flickering, too dense to
 * read. Heading top-left "Most traders start with stocks." The overwhelm is
 * intentional. (spec §7)
 */
import { useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { TickerGrid } from "../components/TickerGrid";
import { COLORS } from "../theme";
import { fadeIn, rise } from "../util/anim";

export const Scene01 = () => {
  const frame = useCurrentFrame();
  const op = fadeIn(frame, 8, 16);
  const ty = rise(frame, 8, 18, 22);
  return (
    // allowLogoSlot: no logo-reserve mask — the abstract ticker grid is full-bleed
    // (no silver cut in the top-right corner).
    <SceneWrap allowLogoSlot>
      <TickerGrid />
      {/* heading on a silver backing panel so it stays legible over the grid */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 92,
          width: 700,
          padding: "30px 38px",
          borderRadius: 24,
          background: "rgba(237,238,240,0.92)",
          border: `1px solid ${COLORS.hairline}`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.10)",
          opacity: op,
          transform: `translateY(${ty}px)`,
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.purple, marginBottom: 8 }}>
          Most traders start here
        </div>
        <div style={{ fontSize: 58, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.05, color: COLORS.black }}>
          Most traders start with stocks.
        </div>
      </div>
    </SceneWrap>
  );
};
