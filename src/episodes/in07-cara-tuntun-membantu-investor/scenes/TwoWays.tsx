/**
 * IN07 · SC09 — "Hari yang Sama, Dua Cara Mengambil Keputusan". Back to SC01's day. From the ChatGPT storyboard
 * docs/vi-style/storyboards/IN07-SC09.jpg.
 *
 *  A  28 Januari 2026 again (bold, indigo, no time); ONE you in the middle — Orang_1, as in SC07 — on "Orangnya sama", with the market
 *     (IHSG −8%) over the head on "Market-nya sama" (Simon 30 Oct: "pake Orang_1 dan 1 aja, jangan bikin 2. Posisinya
 *     di tengah. Tulisan marketnya (IHSG) di atas orangnya"). You stay there for the whole scene, between the two
 *     numbered columns, left and right ("Orangnya tetep di tengah aja. Skema di kiri kanan") — you are the line
 *     between the two ways.
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
import { PERSON, Person, personCy } from "../components/Person";

const CX = theme.canvas.width / 2;
const HEAD_Y = 240;
/** The scenario number, centred over its column (Simon: "angka 1 nya align center pada rectangle merah nya, angka 2 pada rectangle putih"). */
const NUM = 56;
/** A: the one you, head top at `top`, at `s`; the market pill over the head. */
const YOU = { top: 330, s: 0.8, marketGap: 22, marketH: 64 };
/** The two ways, left and right of you, `gap` clear of your circle (inside the margins at this width). */
/** Narrower since 30 Oct (Simon: "width keseluruhannya bisa di pendekin"); `pad` the inset of what sits inside. */
const COL = { w: 480, y: 340, h: 540, gap: 40, pad: 36 };
const YOU_R = (PERSON.d * YOU.s) / 2;
const colX = (i: number) => (i === 0 ? CX - YOU_R - COL.gap - COL.w : CX + YOU_R + COL.gap);

const STEPS = [
  { text: "Portofolio", icon: "model", at: "analisis portofolio" },
  { text: "Market Valuation", icon: "gauge", at: "Market Valuation" },
  { text: "Event Research", icon: "event", at: "Event Research" },
  { text: "Tuntun AI", icon: "ai", at: "Tuntun AI" },
] as const;
const STEP = { y0: COL.y + 40, h: 72, gap: 14, size: 28, disc: 48 };
const OUTCOMES = [
  { text: "Jual", at: "tetap menjual" },
  { text: "Tahan", at: "Mungkin menahan" },
  { text: "Beli bertahap", at: "membeli secara" },
] as const;
const OUT = { y: COL.y + COL.h - 96, h: 60, size: 26, gap: 10 };
/** Column 1: the voice notes left-aligned at `pad` (Simon: "voice notenya bisa di align left"); the button spans the red column inside the same pad ("fit to rectangle merahnya"). */
const NOTE = { y0: COL.y + 44, pitch: 92 };
const SELL = { w: COL.w - 2 * COL.pad, h: 72, size: 36 };

export const SC09 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(9, BLOCK.SC09);
  const g = f + BLOCK.SC09;

  const dateAt = W("28 Januari");
  const youP = ease(f, W("Orangnya sama") - m.sec(0.05), m.reveal);
  const marketP = ease(f, W("Market-nya sama") - m.sec(0.05), m.reveal);
  const linesAt = W("Yang membedakan");
  const dateOut = ease(f, linesAt, m.fade);

  // B — column 1
  const red = ease(f, W("layar penuh"), m.reveal);
  const pressAt = W("ditekan.");
  const press = ease(f, pressAt, m.sec(0.2)) * (1 - ease(f, pressAt + m.sec(0.25), m.sec(0.25)));
  const pressed = ease(f, pressAt, m.pop);
  const fingerIn = ease(f, W("tombol jual"), W("ditekan.") - W("tombol jual"));

  // C/D — column 2
  const outcomesDim = ease(f, W("bukan hasil"), m.reveal);
  const processGlow = ease(f, W("setelah memeriksa"), m.reveal);
  const col1Dim = ease(f, W("desakan teman"), m.reveal);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — the same day again */}
      {dateOut < 0.999 ? (
        <Appear at={dateAt - m.sec(0.1)} style={{ left: 0, width: theme.canvas.width, top: 110, display: "flex", justifyContent: "center", opacity: 1 - dateOut }}>
          {/* the date alone, bold and indigo, no pill (Simon 30 Oct: "bold dan indigo. 13.43 nya remove", "remove pill design nya") */}
          <div style={{ height: 76, display: "flex", alignItems: "center", gap: 16, ...typeStyle("body"), fontWeight: 700, color: c.indigo }}>
            <Ico name="date" size={34} tone={c.indigo} />
            28 Januari 2026
          </div>
        </Appear>
      ) : null}
      {/* the one line, where the date was */}
      <Appear at={linesAt + m.sec(0.2)} style={{ left: 0, top: 0 }}>
        <Line x={0} y={150} w={theme.canvas.width} align="center" size={56} weight={500} text="Bedanya di proses, bukan hasil." mark="proses" />
      </Appear>

      {/* A — the one you, the same market over the head */}
      {youP > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: youP, transform: `translateY(${((1 - youP) * 20).toFixed(2)}px)` }}>
          <Person cx={CX} cy={personCy(YOU.top, YOU.s)} s={YOU.s} />
          {marketP > 0.001 ? (
            <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: YOU.top - YOU.marketGap - YOU.marketH + (1 - marketP) * 12, display: "flex", justifyContent: "center", opacity: marketP }}>
              <div style={{ height: YOU.marketH, padding: "0 26px", borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", gap: 12, ...typeStyle("body"), fontSize: 32 }}>
                <span style={{ color: c.ink }}>IHSG</span>
                <span style={{ color: theme.color.alarmRed }}>−8%</span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}


      {[0, 1].map((i) => {
        const x = colX(i);
        const dim = i === 0 ? col1Dim : 0;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, filter: dim > 0.001 ? `grayscale(${dim.toFixed(3)})` : undefined }}>
            {/* the head: the number (the one you and the market were shown once, in the middle) */}
            <Appear at={W(i === 0 ? "skenario pertama" : "skenario kedua") - m.sec(0.1)} style={{ left: x + (COL.w - NUM) / 2, top: HEAD_Y - NUM / 2 }}>
              <NumRing n={i + 1} size={NUM} />
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
          <Appear key={k} at={W("terus bilang") + k * m.sec(0.18)} style={{ left: colX(0) + COL.pad, top: NOTE.y0 + k * NOTE.pitch }}>
            <VoiceBubble played={ease(f, W("terus bilang") + k * m.sec(0.18) + m.sec(0.2), m.sec(0.6))} />
          </Appear>
        ))}
        {f >= W("perdagangan dibuka") - m.sec(0.1) ? (
          <div style={{ position: "absolute", left: colX(0) + COL.pad, top: COL.y + COL.h - COL.pad - SELL.h + 4 * press, width: SELL.w, height: SELL.h, borderRadius: 20, background: theme.color.alarmRed, filter: pressed > 0.5 ? "brightness(0.82)" : undefined, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: SELL.size, color: c.cardBg, opacity: ease(f, W("perdagangan dibuka") - m.sec(0.1), m.reveal), transform: `scale(${(1 - 0.03 * press).toFixed(3)})` }}>Jual</div>
        ) : null}
        {fingerIn > 0.001 ? (
          <div style={{ position: "absolute", left: colX(0) + COL.pad + SELL.w * 0.55 + (1 - fingerIn) * 160, top: COL.y + COL.h - COL.pad - SELL.h + 20 + (1 - fingerIn) * 140 + 10 * press, opacity: fingerIn * (1 - ease(f, pressAt + m.sec(0.6), m.fade)) }}>
            <Ico name="finger" size={120} tone={c.ink} fill={c.cardBg} />
          </div>
        ) : null}
      </div>

      {/* C — column 2: the checks come first (the fear icon removed, Simon 30 Oct: "icon ini remove") */}
      {STEPS.map((s, k) => {
        const at = W(s.at);
        const p = ease(f, at - m.sec(0.1), m.reveal);
        if (p <= 0.001) return null;
        const y = STEP.y0 + k * (STEP.h + STEP.gap);
        return (
          <div key={s.text} style={{ position: "absolute", left: colX(1) + COL.pad, top: y + (1 - p) * 12, width: COL.w - 2 * COL.pad, height: STEP.h, borderRadius: 20, background: c.bg, opacity: p, display: "flex", alignItems: "center", gap: 18, padding: "0 18px", boxSizing: "border-box", boxShadow: processGlow > 0.01 ? `0 0 ${(30 * processGlow).toFixed(1)}px ${(4 * processGlow).toFixed(1)}px ${theme.color.indigoWashSolid}` : undefined }}>
            <Disc icon={s.icon} size={STEP.disc} tone={c.indigo} tint={theme.color.indigoWashSolid} />
            <div style={{ ...typeStyle("body"), fontSize: STEP.size, color: c.ink, flex: 1, whiteSpace: "nowrap" }}>{s.text}</div>
            <div style={{ opacity: ease(f, at + m.sec(0.35), m.pop) }}>
              <Ico name="tick" size={30} tone={c.indigo} />
            </div>
          </div>
        );
      })}

      {/* D — any of three outcomes; what differs is how it was reached */}
      <div style={{ position: "absolute", left: colX(1) + COL.pad, top: OUT.y, width: COL.w - 2 * COL.pad, display: "flex", justifyContent: "space-between", gap: OUT.gap, filter: outcomesDim > 0.001 ? `grayscale(${outcomesDim.toFixed(3)})` : undefined }}>
        {OUTCOMES.map((o) => {
          const p = ease(f, W(o.at) - m.sec(0.1), m.pop);
          return (
            <div key={o.text} style={{ flex: "1 1 auto", height: OUT.h, padding: "0 14px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("body"), fontSize: OUT.size, color: c.ink, whiteSpace: "nowrap", opacity: p, transform: `translateY(${((1 - p) * 12).toFixed(2)}px)` }}>{o.text}</div>
          );
        })}
      </div>
      <Mark kind="check" p={processGlow} x={colX(1) + COL.w - 30} y={COL.y + 30} />
    </Stage>
  );
};
