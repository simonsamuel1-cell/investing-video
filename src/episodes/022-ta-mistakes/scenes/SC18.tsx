/**
 * SC18 — the close. `from 15724 · dur 1076 (VO ends 16620; the tail is held)`
 *
 * Four rules land one per spoken sentence, then collapse into the card the
 * episode opened on.
 *
 * ⚠ THE FOUR ARE UNEVEN — 102 · 130 · 150 frames apart. Same rule as SC16:
 * they land on the word, not on a grid.
 *
 * ⚠ THE SAME OBJECT THE ROADMAP STOOD ON, not one that looks like it: the mark
 * over a bordered panel on the drifting grid. Using it again says "this is the
 * same kind of statement as the one the video opened with" without spending a
 * word on it.
 *
 * ⚠ THE LAST 180 FRAMES ARE A HOLD. Nothing starts them and nothing moves in
 * them — the voice ends on 16620 and the card is still standing there, and
 * ending on that frame would cut the sentence off as it lands.
 */
import { useCurrentFrame } from "remotion";
import {
  GridGround, Line, QuoteCard, Stage, TuntunMark, Words,
  fadeOut, progress, quoteListY, textReveal, theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, CLOSE, local } from "../data/timing";
import { QUOTE_BAND, QUOTE_CARD, RULES } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC18;
const V = CLOSE;
// ═══════════════════════════════════════════════════════════════════════════

const X = theme.canvas.width / 2 - QUOTE_CARD.w / 2;
const TOP = QUOTE_BAND - (QUOTE_CARD.markH + QUOTE_CARD.gap + QUOTE_CARD.h) / 2;
const BOX_Y = TOP + QUOTE_CARD.markH + QUOTE_CARD.gap;
/** Everything between the logo zone and the caption band. */
const GROUND = {
  x: 0,
  y: theme.logoZone.height,
  w: theme.canvas.width,
  h: theme.captionBand.top - theme.logoZone.height,
};

export const SC18 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;
  const ground = progress(f, local(V.ground.at, FROM), V.ground.over);
  const gone = fadeOut(f, local(V.collapse.at, FROM), V.collapse.over);
  const at = local(V.card, FROM);
  const listY = quoteListY(BOX_Y, QUOTE_CARD.h, QUOTE_CARD.lead, V.lines.length);
  const rowH = RULES.h / V.rules.length;

  return (
    <Stage>
      {/* ⚠ CLIPPED TO THE BAND BETWEEN THE TWO RESERVES. The grid paints its
          own white paper full-bleed, so unclipped it puts the ground into the
          108px subtitle band and the 360×150 logo zone — audit-frames failed
          this exact frame. Both reserves keep the episode's own #F5F5F5. */}
      <GridGround f={f} opacity={ground} vignette={false} clip={GROUND} />

      <div style={{ opacity: gone }}>
        <Line
          text="Rule penutupnya sederhana."
          x={theme.canvas.width / 2}
          y={theme.stage.title.y}
          at={local(V.simple, FROM)}
          size={theme.text.body.size}
          weight={theme.text.body.weight}
          color={c.slate}
        />
        {V.rules.map((r, i) => {
          const rv = textReveal(f, local(r.at, FROM), m.reveal);
          return (
            <div
              key={r.cond}
              style={{
                position: "absolute",
                left: RULES.x,
                top: RULES.y + rowH * (i + 0.5),
                width: RULES.w,
                display: "flex",
                alignItems: "baseline",
                gap: theme.text.body.size * 0.5,
                fontFamily: theme.text.family,
                fontSize: theme.text.body.size,
                opacity: rv.opacity,
                transform: `translate(0, ${rv.dy - theme.text.body.size / 2}px)`,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: c.slate, fontWeight: theme.text.body.weight }}>{r.cond}</span>
              <span style={{ color: c.muted }}>→</span>
              <span style={{ color: c.indigo, fontWeight: theme.text.title.weight }}>{r.act}</span>
            </div>
          );
        })}
      </div>

      {g >= V.card && (
        <>
          <TuntunMark x={theme.canvas.width / 2} y={TOP} height={QUOTE_CARD.markH} />
          <QuoteCard
            x={X}
            y={BOX_Y}
            w={QUOTE_CARD.w}
            h={QUOTE_CARD.h}
            at={at}
            listY={listY}
            lead={QUOTE_CARD.lead}
            count={V.lines.length}
          >
            {V.lines.map((line) => (
              <Words
                key={line}
                text={line}
                x={theme.canvas.width / 2}
                y={listY + QUOTE_CARD.size * 0.62}
                at={local(V.text, FROM)}
                stagger={m.sec(0.1)}
                anchor="center"
                size={QUOTE_CARD.size}
                weight={theme.text.chip.weight}
                marks={[{ text: V.mark, color: theme.color.hlCyan }]}
              />
            ))}
          </QuoteCard>
        </>
      )}
    </Stage>
  );
};
