/**
 * SC09 — konteks market. `from 7034 · dur 931`
 *
 * Two windows, and the setup inside them is not similar — it is IDENTICAL, bar
 * for bar, for the first 34 bars (see data/series.ts, which copies the head
 * rather than re-generating it). That identity is the entire scene: the same
 * setup, read inside two different markets, finishes in two different places.
 *
 * ⚠ THE CONTEXT STRIP IS ABOVE THE SETUP, NOT BESIDE IT. Side by side they
 * read as two separate readings; stacked, the strip is plainly the room the
 * setup is standing in — which is what "market yang lebih luas" means.
 *
 * ⚠ ONE DOMAIN ACROSS BOTH WINDOWS. Left to themselves each tape normalises to
 * its own range and the failure looks the same size as the success, which is
 * the misreading the scene exists to prevent.
 */
import { useCurrentFrame } from "remotion";
import {
  Candles, Card, Chip, IndicatorLine, Line, Stage,
  domainOf, gridOf, progress, theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, CONTEXT, local } from "../data/timing";
import { contextPanes, halves } from "../data/layout";
import { CTX_FAILS, CTX_SHARED, CTX_WORKS, MKT_FLAT, MKT_UP } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC09;
const V = CONTEXT;
// ═══════════════════════════════════════════════════════════════════════════

const [LEFT, RIGHT] = halves();
const PANE_L = contextPanes(LEFT);
const PANE_R = contextPanes(RIGHT);
/** ⚠ SHARED — see the header. */
const DOMAIN = domainOf(
  [...CTX_WORKS.closes, ...CTX_FAILS.closes],
  [...CTX_WORKS.bars, ...CTX_FAILS.bars],
);
const MKT_DOMAIN = domainOf([...MKT_UP, ...MKT_FLAT]);

export const SC09 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;
  const open = progress(f, local(V.panes.at, FROM), V.panes.over);

  const gL = gridOf(CTX_WORKS.closes, DOMAIN, PANE_L.price, 0.12);
  const gR = gridOf(CTX_FAILS.closes, DOMAIN, PANE_R.price, 0.12);
  const sL = gridOf(MKT_UP, MKT_DOMAIN, PANE_L.strip, 0.16);
  const sR = gridOf(MKT_FLAT, MKT_DOMAIN, PANE_R.strip, 0.16);

  /* the shared head builds first in BOTH windows; the tails then diverge */
  const head = (CTX_SHARED + 1) / CTX_WORKS.bars.length;
  const shownHead = head * progress(f, local(V.panes.at, FROM) + m.reveal, m.sec(1.2));
  const tail = (side: number) => head + (1 - head) * progress(f, local(side, FROM), m.sec(1.0));

  return (
    <Stage>
      <Line
        text="Kondisi market juga penting."
        x={theme.canvas.width / 2}
        y={theme.stage.title.y}
        at={local(V.name, FROM)}
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />

      {[
        { rect: LEFT, pane: PANE_L, grid: gL, strip: sL, mkt: MKT_UP, s: CTX_WORKS,
          head: "MARKET TRENDING", at: V.left },
        { rect: RIGHT, pane: PANE_R, grid: gR, strip: sR, mkt: MKT_FLAT, s: CTX_FAILS,
          head: "MARKET SIDEWAYS / MELEMAH", at: V.right },
      ].map((w) => (
        <div key={w.head}>
          <Card rect={w.rect} opacity={open} soft />
          <Line
            text={w.head}
            x={w.rect.x + w.rect.w / 2}
            y={w.rect.y + w.rect.h * 0.09}
            at={local(V.panes.at, FROM)}
            size={theme.text.tag.size}
            weight={theme.text.tag.weight}
            color={c.slate}
          />
          <IndicatorLine
            values={w.mkt}
            grid={w.strip}
            at={local(w.at, FROM)}
            over={m.sec(0.8)}
            tone="cyan"
          />
          <Candles
            bars={w.s.bars}
            grid={w.grid}
            shown={g >= w.at ? tail(w.at) : shownHead}
          />
        </div>
      ))}

      {g >= V.same && (
        <>
          <Chip
            label="SETUP-NYA SAMA"
            x={theme.canvas.width / 2}
            y={PANE_L.price.y + PANE_L.price.h * 0.5}
            at={local(V.same, FROM)}
            tone="indigo"
            pill
          />
          <Chip
            label="KONTEKSNYA BEDA"
            x={theme.canvas.width / 2}
            /* ⚠ UNDER THE STRIPS, NOT ON THEM. Centred in the strip it sat
               across both market lines and hid the shapes it was labelling. */
            y={PANE_L.strip.y + PANE_L.strip.h + theme.text.chip.size}
            at={local(V.same, FROM)}
            tone="cyan"
            pill
          />
        </>
      )}

      {g >= V.close && (
        <Line
          text="SETUP SAMA, KONTEKS BEDA."
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
