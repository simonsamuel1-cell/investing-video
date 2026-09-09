/**
 * SC20 — the close. `from 18792 · dur 888`
 *
 * ⚠ THE SAME CARD THE EPISODE ALREADY USED, NOT ONE THAT LOOKS LIKE IT. The
 * roadmap and its ticks are gone — Simon: "ganti dengan maskot, quote dan
 * background kotak kotak, seperti di 3288". What closes the video is the object
 * that closed the first chapter: the mark floating over a bordered panel on a
 * solid indigo block, quote marks in opposite corners, on the same drifting
 * grid. Using it again says "this is the same kind of statement as that one"
 * without spending a word on it.
 *
 * ⚠ ITS GEOMETRY IS MASCOT'S OWN, read from the same constants f3288 uses. A
 * second set of numbers that happened to match today is a second set of numbers
 * that stops matching the first time either card is nudged.
 *
 * ⚠ AND THE GROUND ARRIVES BEFORE THE MASCOT, as it does at 2461: the grid is
 * the room the closing happens in, not something the card brings with it.
 */
import { useCurrentFrame } from "remotion";
import {
  Stage, GridGround, QuoteCard, Words, TuntunMark, quoteListY,
  cutInStyle, useMotion, progress, theme,
} from "../../../core";
import { BLOCK, CLOSE, CUTS, MASCOT, local } from "../data/timing";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC20;
const V = CLOSE;
// ═══════════════════════════════════════════════════════════════════════════

/** ⚠ MASCOT'S OWN RECT, not a copy of it — see the header. */
const CARD = MASCOT.card;
const RECT = (() => {
  const total = CARD.markH + CARD.gap + CARD.h;
  const top = (theme.logoZone.height + theme.captionBand.top) / 2 - total / 2 - CARD.lift;
  const boxY = top + CARD.markH + CARD.gap;
  return {
    markY: top,
    box: { x: theme.canvas.width / 2 - CARD.w / 2, y: boxY, w: CARD.w, h: CARD.h },
    /* centred in the card BY ITS INK, not by its boxes — see quoteListY */
    listY: quoteListY(boxY, CARD.h, CARD.lead, V.lines.length),
  };
})();

export const SC20 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const at = local(V.at, FROM);
  const ground = progress(f, local(V.ground.at, FROM), V.ground.over);

  return (
    <Stage>
      <div style={{ position: "absolute", inset: 0, ...cutInStyle(f + FROM, CUTS.toClose) }}>
        <GridGround f={f} opacity={ground} />

        {f >= at && (
          <>
            {/* ⚠ THE SAME BREATH THE OTHER TWO MASCOTS TAKE. One period, one
                amplitude, read from MASCOT.float — three readings of the same
                character that moved differently would be three characters. */}
            <TuntunMark
              x={theme.canvas.width / 2}
              y={
                RECT.markY +
                Math.sin(((f - at) / MASCOT.float.period) * Math.PI * 2) * MASCOT.float.amount
              }
              height={CARD.markH}
            />
            <QuoteCard
              x={RECT.box.x}
              y={RECT.box.y}
              w={RECT.box.w}
              h={RECT.box.h}
              at={at + m.sec(0.2)}
              listY={RECT.listY}
              lead={CARD.lead}
              count={V.lines.length}
            >
              {V.lines.map((line, n) => (
                <Words
                  key={line}
                  text={line}
                  x={theme.canvas.width / 2}
                  y={RECT.listY + CARD.lead * n + CARD.size * 0.62}
                  at={at + m.sec(0.45) + n * V.lines[0].split(" ").length * 6}
                  stagger={6}
                  anchor="center"
                  size={CARD.size}
                  weight={600}
                  marks={[{ text: V.mark, color: theme.color.hlCyan }]}
                />
              ))}
            </QuoteCard>
          </>
        )}
      </div>
    </Stage>
  );
};
