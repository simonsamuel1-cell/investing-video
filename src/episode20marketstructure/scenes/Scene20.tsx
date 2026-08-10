/**
 * SC20 — Foundation stack, the closer (from 10122, dur 464).
 *
 * The spec draws this as filled blocks. Nothing in this episode puts a fill or
 * a border around type, so the stack is built out of TYPE ALONE: the base line
 * is large and indigo, the four tools sit above it small and in a row, and one
 * hairline rule separates them. Size, position and that single rule carry the
 * hierarchy the blocks used to carry.
 *
 * The last 60 frames are the outro hold: the voice ends at 10.526 and the
 * finished stack simply stays on screen, still.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Layer } from "../components/Stage";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { textReveal, beat, progress } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  base: 0, // "membaca struktur harga"
  pulse: 167, // "arah dan bentuk pergerakannya"
  stack: 284, // "indikator atau alat bantu"
};
const TOOLS = ["Indikator", "Volume", "Momentum", "Alat bantu lain"];
/** The row of tools, the rule they rest on, and the line that carries them. */
const ROW_Y = 556;
const RULE_Y = 626;
const BASE_Y = 704;
const TAG_Y = 430;
const SPAN = 1180; // width the row and the rule share
const STEP = 16; // frames between one tool landing and the next
// ═══════════════════════════════════════════════════════════════════════════

const CX = theme.canvas.width / 2;
/** Evenly spaced across the span, so the row reads as one shelf. */
const toolX = (i: number) => CX - SPAN / 2 + (SPAN / TOOLS.length) * (i + 0.5);

export const Scene20 = () => {
  const f = useCurrentFrame();
  const base = textReveal(f, T.base, 22, 40);
  const breath = beat(f, T.pulse, 30); // one breath, no bounce
  const rule = f >= T.stack - 20 ? progress(f, T.stack - 20, 30) : 0;

  return (
    <Stage>
      {/* the tools, each settling onto the shelf in turn */}
      {TOOLS.map((tool, i) => {
        const r = textReveal(f, T.stack + i * STEP, 20, 26);
        return (
          <div
            key={tool}
            style={{
              position: "absolute",
              left: toolX(i),
              top: ROW_Y + r.dy,
              transform: "translate(-50%, -50%)",
              fontFamily: theme.text.family,
              fontSize: theme.text.chip.size,
              fontWeight: theme.text.chip.weight,
              color: theme.color.indigo,
              opacity: r.opacity,
              whiteSpace: "nowrap",
            }}
          >
            {tool}
          </div>
        );
      })}

      {/* the one rule in the scene: what the tools are standing on */}
      {rule > 0.001 && (
        <Layer>
          <line
            x1={CX - (SPAN / 2) * rule}
            y1={RULE_Y}
            x2={CX + (SPAN / 2) * rule}
            y2={RULE_Y}
            stroke={theme.color.indigo}
            strokeWidth={theme.shape.rule}
            strokeLinecap="round"
            opacity={0.5}
          />
        </Layer>
      )}

      {/* what everything else stands on */}
      <div
        style={{
          position: "absolute",
          left: CX,
          top: BASE_Y + base.dy,
          transform: `translate(-50%, -50%) scale(${1 + 0.015 * breath})`,
          fontFamily: theme.text.family,
          fontSize: theme.text.title.size,
          fontWeight: theme.text.title.weight,
          color: theme.color.indigo,
          opacity: base.opacity,
          whiteSpace: "nowrap",
        }}
      >
        Struktur pergerakan harga
      </div>

      {/* the tools' job, named once */}
      <Chip label="Konfirmasi" x={CX} y={TAG_Y} tone="cyan" at={T.stack + 80} check />
    </Stage>
  );
};
