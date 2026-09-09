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
  cutInStyle, useMotion, progress, progressInOut, theme,
} from "../../../core";
import { BLOCK, CLOSE, CUTS, MASCOT, local } from "../data/timing";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC20;
const V = CLOSE;
// ═══════════════════════════════════════════════════════════════════════════

/** ⚠ MASCOT'S OWN RECT, not a copy of it — see the header. */
const CARD = MASCOT.card;
const X = theme.canvas.width / 2 - CARD.w / 2;
/** One line instead of two, so the second card is a lead shorter. */
const H2 = CARD.h - CARD.lead;
const BAND = (theme.logoZone.height + theme.captionBand.top) / 2;

/**
 * ⚠ TWO STACKS, EACH CENTRED IN THE BAND, AND THE SCENE MOVES BETWEEN THEM.
 * Simon: "maskot dan text box pertama akan naik ya, menyesuaikan posisi". The
 * mascot and the first card are one object; what changes is where the whole
 * stack sits, so the gap between them cannot drift while it happens.
 *
 * ⚠ AND THE LIFT ONLY APPLIES TO THE SHORT STACK. `card.lift` nudges 474px of
 * content off centre so it does not sit low under the logo; 748px does not have
 * that problem, and the same nudge would push it up into the logo zone.
 */
const stackTop = (total: number, lift: number) => BAND - total / 2 - lift;
const TOP_ONE = stackTop(CARD.markH + CARD.gap + CARD.h, CARD.lift);
const TOP_TWO = stackTop(CARD.markH + CARD.gap + CARD.h + V.second.gap + H2, 0);

export const SC20 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const at = local(V.at, FROM);
  const words = local(V.text, FROM);
  const two = local(V.second.at, FROM);
  const ground = progress(f, local(V.ground.at, FROM), V.ground.over);

  /** One curve moves the stack and brings the second card in, so the card
   *  cannot land before the room for it exists. */
  const rise = progressInOut(f, two, V.second.over);
  const markY = TOP_ONE + (TOP_TWO - TOP_ONE) * rise;
  const boxY = markY + CARD.markH + CARD.gap;
  const box2Y = boxY + CARD.h + V.second.gap;
  const listY = quoteListY(boxY, CARD.h, CARD.lead, V.lines.length);
  const list2Y = quoteListY(box2Y, H2, CARD.lead, V.second.lines.length);

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
                markY +
                Math.sin(((f - at) / MASCOT.float.period) * Math.PI * 2) * MASCOT.float.amount
              }
              height={CARD.markH}
            />
            <QuoteCard
              x={X}
              y={boxY}
              w={CARD.w}
              h={CARD.h}
              at={at + m.sec(0.2)}
              listY={listY}
              lead={CARD.lead}
              count={V.lines.length}
            >
              {V.lines.map((line, n) => (
                <Words
                  key={line}
                  text={line}
                  x={theme.canvas.width / 2}
                  y={listY + CARD.lead * n + CARD.size * 0.62}
                  at={words + n * V.lines[0].split(" ").length * 6}
                  stagger={6}
                  anchor="center"
                  size={CARD.size}
                  weight={600}
                  marks={[{ text: V.mark, color: theme.color.hlCyan }]}
                />
              ))}
            </QuoteCard>

            {/* ── and the second reading, once there is room for it ─────── */}
            {f >= two && (
              <QuoteCard
                x={X}
                y={box2Y}
                w={CARD.w}
                h={H2}
                at={two}
                listY={list2Y}
                lead={CARD.lead}
                count={V.second.lines.length}
              >
                {V.second.lines.map((line, n) => (
                  <Words
                    key={line}
                    text={line}
                    x={theme.canvas.width / 2}
                    y={list2Y + CARD.lead * n + CARD.size * 0.62}
                    at={two + m.sec(0.4)}
                    stagger={6}
                    anchor="center"
                    size={CARD.size}
                    weight={600}
                    marks={[{ text: V.second.mark, color: theme.color.hlCyan }]}
                  />
                ))}
              </QuoteCard>
            )}
          </>
        )}
      </div>
    </Stage>
  );
};
