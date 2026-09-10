/**
 * CG-E — the mistake counter. `from 1995 · dur 11045, dark for the ADMR case`
 *
 * ONE chip whose number climbs 01 → 08, mounted once above the tiling. Eight
 * scenes each drawing their own heading is eight headings that happen to look
 * alike; this is the spine the episode is actually counting along.
 *
 * ⚠ IT GOES DARK FOR PART 04. SC12–SC13 are the worked example on ADMR, not
 * another entry in the list, and a counter left standing over them files the
 * case study as "mistake 07½".
 *
 * ⚠ TOP-LEFT, NEVER TOP-RIGHT. The 360×150 top-right belongs to the logo and
 * this chip is on screen for most of the episode.
 */
import { useCurrentFrame } from "remotion";
import { Chip, Line, theme, useMotion, textReveal, usePalette } from "../../../core";
import { COUNTER, local } from "../data/timing";
import { COUNTER_AT } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = COUNTER.from;
const V = COUNTER;
// ═══════════════════════════════════════════════════════════════════════════

export const MistakeCounter = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;

  /* ⚠ OUT FOR THE CASE STUDY — see the header. */
  if (g >= V.gap.from && g < V.gap.to) return null;

  /* The current entry is the last one the voice has reached. Found by frame,
     not by index, so re-ordering the table cannot desynchronise the label from
     its number. */
  const item = [...V.items].reverse().find((q) => g >= q.at);
  if (!item) return null;

  const at = local(item.at, FROM);
  const r = textReveal(f, at, m.reveal);

  return (
    /* keyed on the entry so each one arrives rather than morphing */
    <div key={item.n} style={{ opacity: r.opacity, transform: `translateY(${r.dy}px)` }}>
      <Line
        text={`MISTAKE ${item.n}`}
        x={COUNTER_AT.x}
        y={COUNTER_AT.y}
        at={at}
        anchor="left"
        size={theme.text.tag.size}
        weight={theme.text.tag.weight}
        color={c.muted}
      />
      <Chip
        label={item.label}
        x={COUNTER_AT.x}
        y={COUNTER_AT.y + theme.text.chip.size + m.sec(0.2)}
        at={at}
        anchor="left"
        tone="warn"
        pill
      />
    </div>
  );
};
