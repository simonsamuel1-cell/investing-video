/**
 * SC14 — asal copy trade. `from 12316 · dur 724`
 *
 * Two trade cards with the SAME ticker in both headers, and four rows that
 * fill one per spoken beat. The identical header is what makes the differing
 * rows mean anything.
 *
 * ⚠ AN ILLUSTRATIVE TICKER, NOT ADMR. The case study is 40 frames behind this
 * scene; putting ADMR in these headers would read as a comment on it.
 *
 * ⚠ NO PRICES, ANYWHERE. The rows differ in WORDS — "lebih awal" against
 * "lebih tinggi". A made-up entry price next to a ticker is a fabricated
 * number and an entry marker in the same stroke.
 *
 * ⚠ f12496 HAS NO AIR. "…copy trade orang lain." runs straight into "Sahamnya
 * mungkin sama," — the two cards must already be standing there.
 */
import { useCurrentFrame } from "remotion";
import {
  Card, Line, Stage, textReveal, progress, theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, COPY, local } from "../data/timing";
import { tradeCards } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC14;
const V = COPY;
// ═══════════════════════════════════════════════════════════════════════════

const [A, B] = tradeCards();
/** ⚠ A PLACEHOLDER TICKER — see the header. */
const TICKER = "SAHAM ABCD";

export const SC14 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;
  const open = progress(f, local(V.cards.at, FROM), V.cards.over);

  return (
    <Stage>
      <Line
        text="Sahamnya mungkin sama…"
        x={theme.canvas.width / 2}
        y={theme.stage.title.y}
        at={local(V.same, FROM)}
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />

      {[
        { rect: A, who: "TRADER A", pick: (r: (typeof V.rows)[number]) => r.a },
        { rect: B, who: "TRADER B", pick: (r: (typeof V.rows)[number]) => r.b },
      ].map((w) => (
        <div key={w.who}>
          <Card rect={w.rect} opacity={open} soft />
          <Line
            text={TICKER}
            x={w.rect.x + w.rect.w / 2}
            y={w.rect.y + w.rect.h * 0.12}
            at={local(V.same, FROM)}
            size={theme.text.title.size}
            weight={theme.text.title.weight}
            color={c.indigo}
          />
          <Line
            text={w.who}
            x={w.rect.x + w.rect.w / 2}
            y={w.rect.y + w.rect.h * 0.24}
            at={local(V.cards.at, FROM)}
            size={theme.text.tag.size}
            weight={theme.text.tag.weight}
            color={c.muted}
          />
          {V.rows.map((r, i) => {
            const at = local(r.at, FROM);
            const rv = textReveal(f, at, m.reveal);
            return (
              <div
                key={r.label}
                style={{
                  position: "absolute",
                  left: w.rect.x + w.rect.w * 0.1,
                  top: w.rect.y + w.rect.h * (0.4 + i * 0.14),
                  width: w.rect.w * 0.8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  fontFamily: theme.text.family,
                  opacity: rv.opacity,
                  transform: `translateY(${rv.dy}px)`,
                }}
              >
                <span style={{ fontSize: theme.text.tag.size, color: c.muted }}>{r.label}</span>
                <span
                  style={{
                    fontSize: theme.text.body.size,
                    fontWeight: theme.text.chip.weight,
                    color: c.ink,
                  }}
                >
                  {w.pick(r)}
                </span>
              </div>
            );
          })}
        </div>
      ))}

      {g >= V.close && (
        <Line
          text="SAHAM SAMA ≠ TRADE-NYA SAMA."
          x={theme.canvas.width / 2}
          y={theme.stage.caption.y}
          at={local(V.close, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
        />
      )}
    </Stage>
  );
};
