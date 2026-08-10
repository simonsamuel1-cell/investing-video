/**
 * SC20 — Foundation stack, the closer (from 10122, dur 464).
 *
 * The one conceptual visual in the episode. Everything before this earns its
 * place by being a real chart; a closing hierarchy has no chart to be, so it is
 * drawn as plain blocks.
 *
 * The base is exactly as wide as all four tools together — deliberately, so the
 * picture says the tools cannot stand on anything narrower.
 *
 * The last 60 frames of this scene are the outro hold: the VO ends at 10526 and
 * the stack simply stays on screen, finished and still.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { textReveal, pulse } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  base: 0, // "membaca struktur harga"
  pulse: 167, // "arah dan bentuk pergerakannya"
  stack: 284, // "indikator atau alat bantu"
};
const TOOLS = ["Indikator", "Volume", "Momentum", "Alat Bantu Lain"];
const TOOL = { w: 260, h: 100, gap: 20, cy: 552 };
const BASE = { w: TOOL.w * 4 + TOOL.gap * 3, h: 116, cy: 700 };
const TAG_Y = 424;
const STEP = 16; // frames between one block landing and the next
// ═══════════════════════════════════════════════════════════════════════════

const CX = theme.canvas.width / 2;

export const Scene20 = () => {
  const f = useCurrentFrame();
  const base = textReveal(f, T.base, 22, 40);
  const beat = pulse(f, T.pulse, 30); // one breath, no bounce

  return (
    <SafeArea>
      {/* the tools, each settling onto the base in turn */}
      {TOOLS.map((t, i) => {
        const r = textReveal(f, T.stack + i * STEP, 20, 26);
        return (
          <div
            key={t}
            style={{
              position: "absolute",
              left: CX - BASE.w / 2 + i * (TOOL.w + TOOL.gap),
              top: TOOL.cy - TOOL.h / 2 + r.y,
              width: TOOL.w,
              height: TOOL.h,
              borderRadius: theme.radius.card,
              background: theme.colors.cardBg,
              border: `${theme.stroke.hair}px solid ${theme.colors.indigo}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.type.family,
              fontSize: theme.type.chip.size,
              fontWeight: theme.type.chip.weight,
              color: theme.colors.indigo,
              opacity: r.opacity,
              boxSizing: "border-box",
              textAlign: "center",
              padding: "0 12px",
            }}
          >
            {t}
          </div>
        );
      })}

      {/* what everything else stands on */}
      <div
        style={{
          position: "absolute",
          left: CX - BASE.w / 2,
          top: BASE.cy - BASE.h / 2 + base.y,
          width: BASE.w,
          height: BASE.h,
          borderRadius: theme.radius.card,
          background: theme.colors.indigo,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.type.family,
          fontSize: theme.type.header.size,
          fontWeight: theme.type.header.weight,
          color: theme.colors.onIndigo,
          opacity: base.opacity,
          transform: `scale(${1 + 0.012 * beat})`,
          boxShadow: theme.shadow.rest,
        }}
      >
        Struktur Pergerakan Harga
      </div>

      {/* the tools' job, named once */}
      <Chip label="Konfirmasi" x={CX} y={TAG_Y} variant="cyan" startFrame={T.stack + 80} check />
    </SafeArea>
  );
};
