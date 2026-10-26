/**
 * VI07 · SC02 — "Beda Situasi, Beda Pertanyaan", from the ChatGPT storyboard docs/vi-style/storyboards/VI07-SC02.jpg.
 *
 *  A  the one simple answer people look for: three pills, Jual · Tahan · Beli, each on its word.
 *  B  the four situations from SC01 down the left, each linked to an empty slot: "something different to check".
 *  C  each slot fills as its question is said — the row being talked about lit by a brand hairline.
 *  D  "not every page at once" (a messy stack, ✕) → one question linked to one page (✓), and the scene's one line.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Ico, Line, Mark, SITUATION, Skel, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A — the three answers
const PILL = { w: 260, h: 104, gap: 60, y: 470 };
/** Each answer with its sign (the storyboard's ▼ ‖ ▲): down in the market red, hold neutral, up in green. */
const ANSWERS = [
  { text: "Jual", at: "jual", sign: "▼", ink: theme.color.alarmRed },
  { text: "Tahan", at: "tahan", sign: "", ink: theme.color.neutralIcon },
  { text: "Beli", at: "beli", sign: "▲", ink: theme.color.gainGreen },
] as const;
const pillX = (i: number) => CX - (3 * PILL.w + 2 * PILL.gap) / 2 + i * (PILL.w + PILL.gap);

// B/C — situation → what to check
const ROW = { y0: 270, pitch: 152, h: 112 };
const SIT_COL = { x: 320, w: 400 };
const CHECK_COL = { x: 1080, w: 520 };
const rowY = (i: number) => ROW.y0 + i * ROW.pitch;
const CHECKS = [
  { text: "Harga atau bisnis?", icon: "company", on: "Saat", nth: 1, at: "yang berubah hanya harganya" },
  { text: "Dasar lengkap", icon: "report", on: "Saat", nth: 2, at: "apa dasar lengkap" },
  { text: "Dampak, dana, transaksi", icon: "volume", on: "Saat", nth: 3, at: "dampak" },
  { text: "Risiko & market", icon: "gauge", on: "Dan saat", nth: 0, at: "seberapa besar risiko" },
] as const;

// D — every page vs the right one
const PAGE = { w: 210, h: 280 };
const MESS = [
  { x: 250, y: 330, r: -7 },
  { x: 330, y: 300, r: 4 },
  { x: 410, y: 350, r: -3 },
  { x: 290, y: 400, r: 8 },
  { x: 470, y: 310, r: 6 },
  { x: 380, y: 420, r: -9 },
  { x: 520, y: 400, r: 2 },
];
const PAIR = { qx: 1000, qw: 300, qh: 190, px: 1440, y: 340 };

/** A page with skeleton lines — no copy. */
const Page = ({ icon }: { icon?: string }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
    <div style={{ position: "relative", width: PAGE.w, height: PAGE.h, borderRadius: 20, background: c.cardBg, boxShadow: shadow.soft }}>
      {icon ? (
        <div style={{ position: "absolute", left: 28, top: 28 }}>
          <Disc icon={icon} size={64} tone={c.indigo} tint={theme.color.indigoWashSolid} />
        </div>
      ) : (
        <div style={{ position: "absolute", left: 28, top: 28, width: 64, height: 64, borderRadius: 999, background: theme.color.neutralDisc }} />
      )}
      <Skel w={150} h={14} style={{ left: 28, top: 118 }} />
      <Skel w={120} h={14} style={{ left: 28, top: 148 }} />
      <Skel w={140} h={14} style={{ left: 28, top: 178 }} />
      <Skel w={90} h={14} style={{ left: 28, top: 208 }} />
    </div>
  );
};

export const SC02 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(2, BLOCK.SC02);
  const g = f + BLOCK.SC02;

  const rowsAt = W("Padahal");
  const slotsAt = W("berbeda untuk diperiksa");
  /** The rows hold until the pages come ("membuka semua"), so the board is never empty in between. */
  const allAt = W("membuka semua") - m.sec(0.2);
  const pillsOut = ease(f, rowsAt, m.fade);
  const rowsOut = ease(f, allAt, m.fade);
  /** Which row is being talked about: lit from its "Saat" to the next one's ("Di saat seperti itu" is Saat #0). */
  const rowOn = (i: number) => {
    const at = W(CHECKS[i].on, CHECKS[i].nth);
    const next = i < 3 ? W(CHECKS[i + 1].on, CHECKS[i + 1].nth) : allAt;
    return ease(f, at, m.reveal) * (1 - ease(f, next, m.reveal));
  };

  const messAt = W("membuka semua");
  const crossAt = W("sekaligus");
  const pageAt = W("informasi", 1);
  const askAt = W("pertanyaan");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — jual, tahan, beli: three empty slots on "satu jawaban", each filled on its word */}
      {pillsOut < 0.999
        ? ANSWERS.map((a, i) => {
            const slot = ease(f, W("satu jawaban") + i * m.sec(0.08), m.pop);
            const fill = ease(f, W(a.at) - m.sec(0.1), m.reveal);
            if (slot <= 0.001) return null;
            return (
              <div key={a.text} style={{ position: "absolute", left: pillX(i), top: PILL.y - pillsOut * 30, width: PILL.w, height: PILL.h, opacity: slot * (1 - pillsOut) }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 999, border: `2px dashed ${theme.color.connectorMuteSolid}`, opacity: 1 - fill }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, ...typeStyle("title"), fontWeight: 500, color: c.ink, opacity: fill, transform: `translateY(${((1 - fill) * 12).toFixed(2)}px)` }}>
                  {a.sign ? <span style={{ fontSize: 30, color: a.ink }}>{a.sign}</span> : <Ico name="pause" size={34} tone={a.ink} />}
                  {a.text}
                </div>
              </div>
            );
          })
        : null}

      {/* B/C — each situation, and the thing to check for it */}
      {rowsOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - rowsOut }}>
          {SITUATION.map((s, i) => {
            const inP = ease(f, rowsAt + m.sec(0.25) + i * m.sec(0.1), m.reveal);
            const grow = ease(f, slotsAt + i * m.sec(0.08), m.sec(0.5));
            const fill = ease(f, W(CHECKS[i].at) - m.sec(0.1), m.reveal);
            const on = rowOn(i);
            const y = rowY(i);
            if (inP <= 0.001) return null;
            return (
              <React.Fragment key={s.label}>
                <Connector a={{ x: SIT_COL.x + SIT_COL.w, y: y + ROW.h / 2 }} b={{ x: CHECK_COL.x, y: y + ROW.h / 2 }} p={grow} shape="curve" tone={fill > 0.5 ? theme.color.connector : theme.color.connectorMuteSolid} />
                <Card x={SIT_COL.x - (1 - inP) * 40} y={y} w={SIT_COL.w} h={ROW.h} line={on > 0.5 ? theme.color.connector : undefined} style={{ opacity: inP, display: "flex", alignItems: "center", gap: 22, padding: "0 28px" }}>
                  <Disc icon={s.icon} size={64} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
                  <div style={{ ...typeStyle("body"), fontSize: 34, color: c.ink, whiteSpace: "nowrap" }}>{s.label}</div>
                </Card>
                {grow > 0.001 ? (
                  <div style={{ position: "absolute", left: CHECK_COL.x, top: y, width: CHECK_COL.w, height: ROW.h, opacity: ease(f, slotsAt + i * m.sec(0.08) + m.sec(0.35), m.pop) }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: theme.shape.cardRadius, border: `2px dashed ${theme.color.connectorMuteSolid}`, opacity: 1 - fill }} />
                    <Card x={0} y={(1 - fill) * 12} w={CHECK_COL.w} h={ROW.h} style={{ opacity: fill, display: "flex", alignItems: "center", gap: 22, padding: "0 28px" }}>
                      <Disc icon={CHECKS[i].icon} size={64} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                      <div style={{ ...typeStyle("body"), fontSize: 34, color: c.ink, whiteSpace: "nowrap" }}>{CHECKS[i].text}</div>
                    </Card>
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      ) : null}

      {/* D — not every page at once … */}
      {MESS.map((p, i) => {
        const inP = ease(f, messAt - m.sec(0.15) + i * m.sec(0.06), m.pop);
        if (inP <= 0.001) return null;
        const dim = ease(f, crossAt, m.reveal);
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y + (1 - inP) * 30, opacity: inP, transform: `rotate(${p.r}deg)`, filter: dim > 0.001 ? `grayscale(${dim.toFixed(2)})` : undefined }}>
            <Page />
          </div>
        );
      })}
      <Mark kind="cross" p={ease(f, crossAt, m.pop)} x={720} y={300} />

      {/* … the right page, for the right question */}
      <Appear at={askAt - m.sec(0.15)} style={{ left: 0, top: 0 }}>
        <Card x={PAIR.qx} y={PAIR.y + (PAGE.h - PAIR.qh) / 2} w={PAIR.qw} h={PAIR.qh} line={theme.color.hairlineBrandSolid} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Disc icon="question" size={104} tone={c.indigo} tint={theme.color.indigoWashSolid} />
        </Card>
      </Appear>
      <Connector a={{ x: PAIR.qx + PAIR.qw, y: PAIR.y + PAGE.h / 2 }} b={{ x: PAIR.px, y: PAIR.y + PAGE.h / 2 }} p={ease(f, askAt, m.sec(0.5))} shape="curve" />
      <Appear at={pageAt - m.sec(0.1)} style={{ left: PAIR.px, top: PAIR.y }}>
        <Page icon="page" />
      </Appear>
      <Mark kind="check" p={ease(f, W("tepat"), m.pop)} x={PAIR.px + PAGE.w - 6} y={PAIR.y + 6} />
      <Appear at={pageAt} style={{ left: 0, top: 0 }}>
        <Line x={0} y={800} w={theme.canvas.width} align="center" size={54} weight={500} text="Informasi yang tepat, untuk pertanyaan yang tepat." mark="pertanyaan yang tepat" />
      </Appear>
    </Stage>
  );
};
