/**
 * SC06 — overtrading. `from 4047 · dur 984`
 *
 * ⚠ f4900 HAS NO AIR IN FRONT OF IT. Cue 21 runs straight into cue 22: "…belum
 * tentu ada trade yang layak." / "Tidak trading, juga keputusan." The closing
 * line has to be MOVING on that frame, so the pile of entries starts clearing
 * 36 f early and the line rides in behind it. Nothing waits at this join, and
 * nothing may be given an entrance that needs a run-up.
 */
import { useCurrentFrame } from "remotion";
import {
  Card, Chip, Line, Stage, Words,
  fadeOut, popIn, progress, seeded, theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, OVERTRADE, local } from "../data/timing";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC06;
const V = OVERTRADE;
// ═══════════════════════════════════════════════════════════════════════════

/** Where each little entry lands. ⚠ SEEDED — Math.random() would give every
 *  render of every frame a different pile. */
const rnd = seeded(0x2261);
const PILE = Array.from({ length: V.pile.count }, () => ({
  dx: rnd(),
  dy: rnd(),
}));

export const SC06 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;
  const gone = fadeOut(f, local(V.clear.at, FROM), V.clear.over);
  const box = theme.stage.card;

  return (
    <Stage>
      <Line
        text="Kesalahan berikutnya datang dari diri kita."
        x={theme.canvas.width / 2}
        y={theme.stage.title.y}
        at={local(V.fromUs, FROM)}
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />

      <Card rect={box} opacity={progress(f, local(V.name, FROM), m.fade) * gone} soft />

      {/* ── the pile: "harus selalu punya posisi" ──────────────────────────── */}
      <div style={{ opacity: gone }}>
        {PILE.map((p, i) => {
          const at = local(V.pile.at + i * V.pile.step, FROM);
          const pop = popIn(f, at, m.pop);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: box.x + box.w * (0.56 + p.dx * 0.34),
                top: box.y + box.h * (0.16 + p.dy * 0.62),
                transform: `translate(-50%, -50%) scale(${pop.scale})`,
                opacity: pop.opacity * 0.9,
                padding: `${m.sec(0.13)}px ${m.sec(0.3)}px`,
                borderRadius: theme.shape.chipRadius,
                background: theme.color.indigoWash,
                border: `${theme.shape.hairline}px solid ${c.border}`,
                fontFamily: theme.text.mono,
                fontSize: theme.text.axis.size,
                color: c.slate,
                whiteSpace: "nowrap",
              }}
            >
              TRADE
            </div>
          );
        })}
      </div>

      <Words
        text="OVERTRADING — merasa harus selalu punya posisi"
        x={box.x + box.w * 0.06}
        y={box.y + box.h * 0.14}
        at={local(V.always, FROM)}
        anchor="left"
        maxWidth={box.w * 0.44}
        size={theme.text.body.size}
      />

      {/* ⚠ EACH CHIP LANDS ON ITS OWN SPOKEN WORD — 4534 / 4602 / 4694. They
          are 68 and 92 frames apart because that is how they were said. */}
      <div style={{ opacity: gone }}>
        {V.conds.map((q, i) => (
          <Chip
            key={q.label}
            label={q.label}
            x={box.x + box.w * 0.06}
            y={box.y + box.h * (0.4 + i * 0.16)}
            at={local(q.at, FROM)}
            anchor="left"
            tone="slate"
            strike={progress(f, local(q.at, FROM), m.reveal)}
            pill
          />
        ))}
      </div>

      {g >= V.close && (
        <Line
          text="TIDAK TRADING, JUGA KEPUTUSAN."
          x={theme.canvas.width / 2}
          y={box.y + box.h * 0.5}
          at={local(V.close, FROM)}
          /* ⚠ THREE QUARTERS OF DISPLAY. At full size the line ran within a
             few pixels of both margins, and it is a sentence, not a title
             card. */
          size={theme.text.display.size * 0.75}
          weight={theme.text.display.weight}
        />
      )}
    </Stage>
  );
};
