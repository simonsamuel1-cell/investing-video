/**
 * SC20 — Foundation stack, the closer (from 10122, dur 464).
 *
 * The one conceptual visual in the episode. Everything before this earns its
 * place by being a real chart; a closing hierarchy has no chart to be, so it is
 * drawn as plain blocks.
 *
 * The base is exactly as wide as the four tools together — deliberately, so the
 * picture says the tools cannot stand on anything narrower.
 *
 * The last 60 frames are the outro hold: the voice ends at 10.526 and the
 * finished stack simply stays on screen, still.
 */
import { useCurrentFrame } from "remotion";
import { Stage } from "../components/Stage";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { textReveal, beat } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  base: 0, // "membaca struktur harga"
  pulse: 167, // "arah dan bentuk pergerakannya"
  stack: 284, // "indikator atau alat bantu"
};
const TOOLS = ["Indikator", "Volume", "Momentum", "Alat Bantu Lain"];
const TOOL = { w: 280, h: 104, gap: 20, cy: 556 };
const BASE = { w: TOOL.w * 4 + TOOL.gap * 3, h: 118, cy: 708 };
const TAG_Y = 424;
const STEP = 16; // frames between one block landing and the next
// ═══════════════════════════════════════════════════════════════════════════

const CX = theme.canvas.width / 2;

export const Scene20 = () => {
  const f = useCurrentFrame();
  const base = textReveal(f, T.base, 22, 40);
  const breath = beat(f, T.pulse, 30); // one breath, no bounce

  return (
    <Stage>
      {/* the tools, each settling onto the base in turn */}
      {TOOLS.map((tool, i) => {
        const r = textReveal(f, T.stack + i * STEP, 20, 26);
        return (
          <div
            key={tool}
            style={{
              position: "absolute",
              left: CX - BASE.w / 2 + i * (TOOL.w + TOOL.gap),
              top: TOOL.cy - TOOL.h / 2 + r.dy,
              width: TOOL.w,
              height: TOOL.h,
              borderRadius: theme.shape.panelRadius,
              background: theme.color.surface,
              border: `${theme.shape.hairline}px solid ${theme.color.indigo}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.text.family,
              fontSize: theme.text.chip.size,
              fontWeight: theme.text.chip.weight,
              color: theme.color.indigo,
              opacity: r.opacity,
              boxSizing: "border-box",
              textAlign: "center",
              padding: "0 12px",
            }}
          >
            {tool}
          </div>
        );
      })}

      {/* what everything else stands on */}
      <div
        style={{
          position: "absolute",
          left: CX - BASE.w / 2,
          top: BASE.cy - BASE.h / 2 + base.dy,
          width: BASE.w,
          height: BASE.h,
          borderRadius: theme.shape.panelRadius,
          background: theme.color.indigo,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.text.family,
          fontSize: theme.text.title.size,
          fontWeight: theme.text.title.weight,
          color: theme.color.onIndigo,
          opacity: base.opacity,
          transform: `scale(${1 + 0.012 * breath})`,
          boxShadow: theme.shape.shadow,
        }}
      >
        Struktur Pergerakan Harga
      </div>

      {/* the tools' job, named once */}
      <Chip label="Konfirmasi" x={CX} y={TAG_Y} tone="cyan" at={T.stack + 80} check />
    </Stage>
  );
};
