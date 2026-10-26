/**
 * VI07 · SC09 — "Hari yang Sama, Dua Cara Mengambil Keputusan". Back to SC01's day. From the ChatGPT storyboard
 * docs/vi-style/storyboards/VI07-SC09.jpg.
 *
 *  A  28 Januari 2026 · 13.43 again; two columns, the same you and the same IHSG −8% on top of each.
 *  B  column 1: the screen goes red, three voice notes, "Jual" pressed straight away.
 *  C  column 2: the fear stays (a small red mark), but four checks come first — Portofolio, Market Valuation, Event
 *     Research, Tuntun AI.
 *  D  three possible outcomes, all neutral (Jual · Tahan · Beli bertahap) — then they dim, column 2's process glows,
 *     column 1 dims, and the one line: "Bedanya di proses, bukan hasil."
 */
import { useCurrentFrame } from "remotion";
import { SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Disc, Ico, Line, Mark, NumRing, VoiceBubble, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const COL = { w: 640, y: 340, h: 540 };
const colX = (i: number) => (i === 0 ? CX - 80 - COL.w : CX + 80);
const HEAD_Y = 240;

const STEPS = [
  { text: "Portofolio", icon: "model", at: "analisis portofolio" },
  { text: "Market Valuation", icon: "gauge", at: "Market Valuation" },
  { text: "Event Research", icon: "event", at: "Event Research" },
  { text: "Tuntun AI", icon: "ai", at: "Tuntun AI" },
] as const;
const STEP = { y0: COL.y + 40, h: 76, gap: 14 };
const OUTCOMES = [
  { text: "Jual", at: "tetap menjual", w: 150 },
  { text: "Tahan", at: "Mungkin menahan", w: 170 },
  { text: "Beli bertahap", at: "membeli secara", w: 250 },
] as const;
const OUT_Y = COL.y + COL.h - 104;

export const SC09 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(9, BLOCK.SC09);
  const g = f + BLOCK.SC09;

  const dateAt = W("28 Januari");
  const linesAt = W("Yang membedakan");
  const dateOut = ease(f, linesAt, m.fade);

  // B — column 1
  const red = ease(f, W("layar penuh"), m.reveal);
  const pressAt = W("ditekan.");
  const press = ease(f, pressAt, m.sec(0.2)) * (1 - ease(f, pressAt + m.sec(0.25), m.sec(0.25)));
  const pressed = ease(f, pressAt, m.pop);
  const fingerIn = ease(f, W("tombol jual"), W("ditekan.") - W("tombol jual"));

  // C/D — column 2
  const fearP = ease(f, W("rasa takutnya"), m.pop);
  const outcomesDim = ease(f, W("bukan hasil"), m.reveal);
  const processGlow = ease(f, W("setelah memeriksa"), m.reveal);
  const col1Dim = ease(f, W("desakan teman"), m.reveal);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — the same day again */}
      {dateOut < 0.999 ? (
        <Appear at={dateAt - m.sec(0.1)} style={{ left: CX - 230, top: 110, opacity: 1 - dateOut }}>
          <div style={{ width: 460, height: 76, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, ...typeStyle("body"), color: c.ink }}>
            <Ico name="date" size={34} tone={c.indigo} />
            28 Januari 2026 · 13.43
          </div>
        </Appear>
      ) : null}
      {/* the one line, where the date was */}
      <Appear at={linesAt + m.sec(0.2)} style={{ left: 0, top: 0 }}>
        <Line x={0} y={150} w={theme.canvas.width} align="center" size={56} weight={500} text="Bedanya di proses, bukan hasil." mark="proses" />
      </Appear>

      {/* the divider between the two ways */}
      <div style={{ position: "absolute", left: CX - 1, top: HEAD_Y - 40, width: 2, height: (COL.y + COL.h - HEAD_Y + 40) * ease(f, W("berbeda."), m.sec(0.6)), background: c.border }} />

      {[0, 1].map((i) => {
        const x = colX(i);
        const dim = i === 0 ? col1Dim : 0;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, filter: dim > 0.001 ? `grayscale(${dim.toFixed(3)})` : undefined }}>
            {/* the head: the number, the same you, the same market */}
            <Appear at={W(i === 0 ? "skenario pertama" : "skenario kedua") - m.sec(0.1)} style={{ left: x, top: HEAD_Y - 28 }}>
              <NumRing n={i + 1} size={56} />
            </Appear>
            <Appear at={W("Orangnya sama") - m.sec(0.05) + i * m.sec(0.08)} style={{ left: x + COL.w / 2 - 150, top: HEAD_Y - 45 }}>
              <Disc icon="user" size={90} tone={theme.color.selfAmberInk} tint={theme.color.selfAmberWashSolid} />
            </Appear>
            <Appear at={W("Market-nya sama") - m.sec(0.05) + i * m.sec(0.08)} style={{ left: x + COL.w / 2 - 20, top: HEAD_Y - 32 }}>
              <div style={{ height: 64, padding: "0 26px", borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", gap: 12, ...typeStyle("body"), fontSize: 32 }}>
                <span style={{ color: c.ink }}>IHSG</span>
                <span style={{ color: theme.color.alarmRed }}>−8%</span>
              </div>
            </Appear>
            {/* the column itself — flat, no shadow, so it stays clear of the subtitle band */}
            <div style={{ position: "absolute", left: x, top: COL.y, width: COL.w, height: COL.h, borderRadius: 28, boxShadow: `inset 0 0 0 2px ${i === 1 && processGlow > 0.5 ? theme.color.connector : theme.color.connectorMuteSolid}`, background: i === 0 ? "transparent" : c.cardBg, opacity: ease(f, W(i === 0 ? "skenario pertama" : "skenario kedua") - m.sec(0.1), m.reveal) }}>
              {i === 0 ? <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: theme.color.alarmWashSolid, opacity: red }} /> : null}
            </div>
          </div>
        );
      })}

      {/* B — column 1: voice notes, then "Jual" pressed at once */}
      <div style={{ position: "absolute", inset: 0, filter: col1Dim > 0.001 ? `grayscale(${col1Dim.toFixed(3)})` : undefined }}>
        {[0, 1, 2].map((k) => (
          <Appear key={k} at={W("terus bilang") + k * m.sec(0.18)} style={{ left: colX(0) + 50 + k * 40, top: COL.y + 50 + k * 92 }}>
            <VoiceBubble played={ease(f, W("terus bilang") + k * m.sec(0.18) + m.sec(0.2), m.sec(0.6))} />
          </Appear>
        ))}
        {f >= W("perdagangan dibuka") - m.sec(0.1) ? (
          <div style={{ position: "absolute", left: colX(0) + 60, top: COL.y + COL.h - 150 + 4 * press, width: COL.w - 120, height: 98, borderRadius: 24, background: theme.color.alarmRed, filter: pressed > 0.5 ? "brightness(0.82)" : undefined, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), color: c.cardBg, opacity: ease(f, W("perdagangan dibuka") - m.sec(0.1), m.reveal), transform: `scale(${(1 - 0.03 * press).toFixed(3)})` }}>Jual</div>
        ) : null}
        {fingerIn > 0.001 ? (
          <div style={{ position: "absolute", left: colX(0) + COL.w / 2 + 60 + (1 - fingerIn) * 160, top: COL.y + COL.h - 120 + (1 - fingerIn) * 140 + 10 * press, opacity: fingerIn * (1 - ease(f, pressAt + m.sec(0.6), m.fade)) }}>
            <Ico name="finger" size={120} tone={c.ink} />
          </div>
        ) : null}
      </div>

      {/* C — column 2: the fear stays, the checks come first */}
      {fearP > 0.001 ? (
        <div style={{ position: "absolute", left: colX(1) + COL.w - 70, top: HEAD_Y - 34, opacity: fearP, borderRadius: 999, boxShadow: shadow.soft }}>
          <Disc icon="panic" size={68} tone={theme.color.alarmRed} tint={c.cardBg} />
        </div>
      ) : null}
      {/* the steps hang on one line, as in the storyboard */}
      {f >= W(STEPS[0].at) - m.sec(0.1) ? (
        <div style={{ position: "absolute", left: colX(1) + 22, top: STEP.y0 + STEP.h / 2, width: 2, height: (STEPS.length - 1) * (STEP.h + STEP.gap) * ease(f, W(STEPS[0].at), W(STEPS[3].at) - W(STEPS[0].at)), background: theme.color.hairlineBrandSolid }} />
      ) : null}
      {STEPS.map((s, k) => {
        const at = W(s.at);
        const p = ease(f, at - m.sec(0.1), m.reveal);
        if (p <= 0.001) return null;
        const y = STEP.y0 + k * (STEP.h + STEP.gap);
        return (
          <div key={s.text} style={{ position: "absolute", left: colX(1) + 40, top: y + (1 - p) * 12, width: COL.w - 80, height: STEP.h, borderRadius: 20, background: c.bg, opacity: p, display: "flex", alignItems: "center", gap: 20, padding: "0 20px", boxSizing: "border-box", boxShadow: processGlow > 0.01 ? `0 0 ${(30 * processGlow).toFixed(1)}px ${(4 * processGlow).toFixed(1)}px ${theme.color.indigoWashSolid}` : undefined }}>
            <Disc icon={s.icon} size={52} tone={c.indigo} tint={theme.color.indigoWashSolid} />
            <div style={{ ...typeStyle("body"), fontSize: 32, color: c.ink, flex: 1 }}>{s.text}</div>
            <div style={{ opacity: ease(f, at + m.sec(0.35), m.pop) }}>
              <Ico name="tick" size={30} tone={c.indigo} />
            </div>
          </div>
        );
      })}

      {/* D — any of three outcomes; what differs is how it was reached */}
      <div style={{ position: "absolute", left: colX(1) + 40, top: OUT_Y, width: COL.w - 80, display: "flex", justifyContent: "space-between", filter: outcomesDim > 0.001 ? `grayscale(${outcomesDim.toFixed(3)})` : undefined }}>
        {OUTCOMES.map((o) => {
          const p = ease(f, W(o.at) - m.sec(0.1), m.pop);
          return (
            <div key={o.text} style={{ width: o.w, height: 70, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("body"), fontSize: 32, color: c.ink, opacity: p, transform: `translateY(${((1 - p) * 12).toFixed(2)}px)` }}>{o.text}</div>
          );
        })}
      </div>
      <Mark kind="check" p={processGlow} x={colX(1) + COL.w - 30} y={COL.y + 30} />
    </Stage>
  );
};
