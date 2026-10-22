/**
 * SC21 — the next video, spoken over TA09-Outro.mp3 (Simon, 20 Oct 2026: "Setelah scene terakhir, tambahkan
 * TA09-Outro.mp3. Kasih jeda dulu 30 frame. Setelah itu langsung berikan visual").
 *
 *   "Di video selanjutnya …"                  a chip, "Video selanjutnya"
 *   "… multi time frame analisis."            the title
 *   "Gimana melihat satu saham …"             three chart cards — the same stock, drawn at three densities
 *   "… dari beberapa time frame"              each card's timeframe tab lands, 1W · 1D · 1H
 *   "… dan menggabungkan sinyal …"            each card gets its check
 *   "… yang saling mendukung."                three lines meet in one pill
 *
 * ⚠ THE CHARTS ARE GENERATED (fromShape), so no ticker is named and no number is shown. No arrows, no entry marks —
 * the checks say the three readings agree, nothing more.
 *
 * It arrives on a camera cut from SC20 (CUTS.toNext); the episode then fades to the paper and Outro.mp4 plays
 * (core/EpisodeWrap).
 */
import { useCurrentFrame } from "remotion";
import {
  Stage, GridGround, Panel, Candles, gridOf, domainOf, fromShape, cutInStyle, progressInOut, useMotion, usePalette,
  theme, NextVideoHead, NextTab, NextCheck, NEXT_LAYOUT,
} from "../../../core";
import { CUTS, NEXT, local } from "../data/timing";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Mounted half a camera move before the cut lands. */
export const SC21_FROM = NEXT.at - CUTS.toNext.over / 2;
const FROM = SC21_FROM;
const V = NEXT;
// ═══════════════════════════════════════════════════════════════════════════

const CX = theme.canvas.width / 2;
const CARD = { w: 500, h: 340, gap: 50, y: NEXT_LAYOUT.body.top };
const cardX = (i: number) => CX - (3 * CARD.w + 2 * CARD.gap) / 2 + i * (CARD.w + CARD.gap);
const PILL = { y: 840, h: 64, w: 560 };
const MERGE_Y = PILL.y;
const CHECK = 52;

/** One stock, three densities: fewer, bigger bars on the higher timeframe. */
const TAPES = [
  fromShape({ seed: 2101, n: 22, shape: "uptrend", noise: 1.1 }),
  fromShape({ seed: 2207, n: 36, shape: "uptrend", noise: 1.3 }),
  fromShape({ seed: 2313, n: 52, shape: "uptrend", noise: 1.5 }),
];

export const SC21Next = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const w = (k: keyof typeof V.words) => local(V.at + V.words[k], FROM);

  const merge = progressInOut(f, w("together"), m.sec(0.7));
  const pill = progressInOut(f, w("together") + m.sec(0.45), m.reveal);

  return (
    <Stage>
      <div style={{ position: "absolute", inset: 0, ...cutInStyle(f + FROM, CUTS.toNext) }}>
        <GridGround f={f} />

        <NextVideoHead title={V.title} chipAt={w("next")} titleAt={w("title")} />

        {/* three timeframes of one stock */}
        {TAPES.map((tape, i) => {
          const x = cardX(i);
          const at = w("saham") + m.sec(0.3) * i;
          const box = { x: x + 20, y: CARD.y + 84, w: CARD.w - 40, h: CARD.h - 104 };
          const g = gridOf(tape.closes, domainOf(tape.closes, tape.bars), box, 0.1);
          const tab = progressInOut(f, w("frames") + m.sec(0.25) * i, m.pop);
          const check = progressInOut(f, w("signal") + m.sec(0.2) * i, m.pop);
          return (
            <Panel key={i} rect={{ x, y: CARD.y, w: CARD.w, h: CARD.h }} at={at} radius={theme.shape.cardRadius}>
              {f >= at && <Candles bars={tape.bars} grid={g} shown={progressInOut(f, at + m.sec(0.15), m.sec(0.9))} />}
              <NextTab x={x + 28} y={CARD.y + 24} text={V.tabs[i]} p={tab} on={check > 0.5} />
              <NextCheck x={x + CARD.w - 24 - CHECK} y={CARD.y + 21} size={CHECK} p={check} />
            </Panel>
          );
        })}

        {/* … and the three readings meet */}
        {merge > 0.001 && (
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            {[0, 1, 2].map((i) => {
              const sx = cardX(i) + CARD.w / 2;
              const sy = CARD.y + CARD.h;
              const d = `M ${sx} ${sy} C ${sx} ${sy + 50}, ${CX} ${MERGE_Y - 60}, ${CX} ${MERGE_Y}`;
              return <path key={i} d={d} pathLength={1} fill="none" stroke={c.indigo} strokeWidth={theme.shape.line + 1} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - merge} />;
            })}
          </svg>
        )}
        {pill > 0.001 && (
          <div style={{ position: "absolute", left: CX - PILL.w / 2, top: PILL.y, width: PILL.w, height: PILL.h, borderRadius: 999, background: c.indigo, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, opacity: pill, transform: `scale(${(0.94 + 0.06 * pill).toFixed(3)})` }}>
            <svg width={34} height={34}>
              <circle cx={17} cy={17} r={17} fill={c.cardBg} />
              <path d="M 10 17.5 L 15 22.5 L 24.5 12.5" fill="none" stroke={c.indigo} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ fontFamily: theme.text.family, fontSize: theme.text.tag.size + 2, fontWeight: 800, color: c.cardBg }}>{V.merged}</div>
          </div>
        )}
      </div>
    </Stage>
  );
};
