/**
 * VI07 · SC04 — "Saat Nggak Punya Waktu Melakukan Semua Riset Sendiri". Situation 2, Terburu-buru. From the ChatGPT
 * storyboard docs/vi-style/storyboards/VI07-SC04.jpg.
 *
 *  A  "Lalu bagaimana … terlalu sedikit?": two short lines, "Gimana kalo masalahnya" / "bukan harga, tapi informasi." Then "Keputusan terburu-buru
 *     …" opens the heading like SC03's — big in the middle, the number above it — with the three cause chips as its
 *     subjudul (Waktu terbatas, Dasar kurang, Satu kalimat, each on its words; the last glows: it "sounds so
 *     convincing"), and it docks top left before "Solusinya" (Simon 28 Oct: "kasih animasi judul dan subjudul kayak
 *     1.Panik … 3 poin … yang jadi subjudul (style labelnya jangan di-remove)").
 *  B  rebuilt from docs/vi-style/storyboards/VI07-SC04-solusi.jpg (Simon 28 Oct: "jelek visualnya. Coba buat baru"):
 *     "Coba pikirkan lebih lama" — a thought bubble, its clock spinning, question marks piling up; "Kita juga perlu
 *     informasi" — loose bits of information around (a chart, a news card, a page, a chat, a table, bars); "sudah
 *     disusun" — they fly into one tidy card, three rows; "lebih mudah dipahami" — the bubble's clock and question
 *     marks give way to a lightbulb.
 *  C  Tuntun's research team as an isometric exploded view (Simon's Pinterest reference, 26 Oct): one slab per job —
 *     laporan keuangan, model, kualitas, harga wajar, peristiwa — the same for saham and reksa dana (ResearchStack).
 *  D  waktu, proses, data drop down the axis; the slabs press into one tested block, beside one thin voice note.
 */
import { interpolateColors, useCurrentFrame } from "remotion";
import { SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK, heldAt } from "../data/timing";
import { ResearchStack } from "./ResearchStack";
import { BoardGrid, Card, Disc, Ico, OpeningHeading, SITUATION, Skel, ease, useWords } from "../components/kit";

// A — the three causes, as the heading's subjudul
const CHIP = { w: 420, h: 130, gap: 60 };
const CAUSES = [
  { text: "Waktu terbatas", icon: "time", at: "waktunya terbatas" },
  { text: "Dasar kurang", icon: "report", at: "dasarnya belum cukup" },
  { text: "Satu kalimat", icon: "ask", at: "satu kalimat" },
] as const;

// B — think longer, then information put in order
const BUBBLE = { cx: 520, cy: 520, a: 230, b: 160, bumps: 9 };
/** The bubble's outline: bumps (outward arcs) between points round an ellipse. */
const bubblePath = (() => {
  const pts = Array.from({ length: BUBBLE.bumps }, (_, k) => {
    const t = (k / BUBBLE.bumps) * 2 * Math.PI;
    return [BUBBLE.cx + BUBBLE.a * Math.cos(t), BUBBLE.cy + BUBBLE.b * Math.sin(t)];
  });
  const chord = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]);
  return `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} ` + pts.map((_, k) => { const q = pts[(k + 1) % pts.length]; return `A ${(chord * 0.62).toFixed(1)} ${(chord * 0.62).toFixed(1)} 0 0 1 ${q[0].toFixed(1)} ${q[1].toFixed(1)}`; }).join(" ") + " Z";
})();
const QUESTIONS = [
  { x: 640, y: 420, s: 64 },
  { x: 700, y: 330, s: 48 },
  { x: 390, y: 600, s: 56 },
];
/** The tidy card the bits fly into, and its three rows (an icon and two skeleton lines each). */
/** The rows are inset by `pad` on the sides and at the bottom too (Simon 28 Oct: "kasih margin lagi di bawahnya"). */
const TIDY_BASE = { x: 1060, y: 290, w: 620, head: 96, row: 118, rowGap: 12, pad: 28 };
const TIDY = { ...TIDY_BASE, h: TIDY_BASE.head + 20 + 3 * TIDY_BASE.row + 2 * TIDY_BASE.rowGap + TIDY_BASE.pad };
const TIDY_ROWS = ["chart-line", "report", "news"] as const;
const rowCenter = (r: number) => ({ x: TIDY.x + TIDY.w / 2, y: TIDY.y + TIDY.head + r * (TIDY.row + TIDY.rowGap) + TIDY.row / 2 + 20 });
/** The loose bits: where they float (centre, tilt), their size, and the row they are sorted into. */
const BITS = [
  { kind: "chart", x: 930, y: 330, r: -6, w: 230, h: 150, row: 0 },
  { kind: "news", x: 1290, y: 290, r: 4, w: 270, h: 130, row: 2 },
  { kind: "page", x: 1640, y: 380, r: 7, w: 170, h: 210, row: 1 },
  { kind: "chat", x: 990, y: 650, r: 5, w: 270, h: 96, row: 2 },
  { kind: "table", x: 1340, y: 640, r: -4, w: 240, h: 160, row: 1 },
  { kind: "bars", x: 1660, y: 720, r: -8, w: 160, h: 130, row: 0 },
] as const;

/** One loose bit of information, drawn as skeleton UI (no words). */
const Bit = ({ kind, w, h }: { kind: (typeof BITS)[number]["kind"]; w: number; h: number }) => {
  const c = usePalette();
  const pad = 20;
  switch (kind) {
    case "chart":
      return (
        <svg width={w - 2 * pad} height={h - 2 * pad} style={{ position: "absolute", left: pad, top: pad }}>
          <polyline points={[0, 0.8, 0.12, 0.62, 0.22, 0.7, 0.34, 0.45, 0.46, 0.55, 0.6, 0.3, 0.72, 0.38, 0.86, 0.15, 1, 0.08].reduce<string[]>((acc, v, i, arr) => (i % 2 ? acc : [...acc, `${(v * (w - 2 * pad)).toFixed(1)},${(arr[i + 1] * (h - 2 * pad)).toFixed(1)}`]), []).join(" ")} fill="none" stroke={c.indigo} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      );
    case "news":
      return (
        <>
          <div style={{ position: "absolute", left: pad, top: pad, width: h - 2 * pad, height: h - 2 * pad, borderRadius: 12, background: theme.color.neutralDisc }} />
          {[0.9, 0.7, 0.8].map((k, i) => <Skel key={i} w={(w - h - pad) * k} h={12} style={{ left: h, top: pad + 8 + i * 28 }} />)}
        </>
      );
    case "page":
      return <>{[0.8, 0.95, 0.7, 0.9, 0.6, 0.85].map((k, i) => <Skel key={i} w={(w - 2 * pad) * k} h={11} style={{ left: pad, top: pad + 6 + i * 28 }} />)}</>;
    case "chat":
      return (
        <>
          <div style={{ position: "absolute", left: pad, top: (h - 50) / 2, width: 50, height: 50, borderRadius: 999, background: theme.color.neutralDisc }} />
          {[0.9, 0.6].map((k, i) => <Skel key={i} w={(w - 110) * k} h={12} style={{ left: 88, top: h / 2 - 18 + i * 24 }} />)}
        </>
      );
    case "table":
      return (
        <svg width={w - 2 * pad} height={h - 2 * pad} style={{ position: "absolute", left: pad, top: pad }}>
          <rect x={0} y={0} width={w - 2 * pad} height={22} rx={6} fill={theme.color.skeleton} />
          {[1, 2, 3, 4].map((r) => <line key={r} x1={0} x2={w - 2 * pad} y1={22 + r * 22} y2={22 + r * 22} stroke={theme.color.skeleton} strokeWidth={3} />)}
          {[1, 2].map((k) => <line key={k} x1={((w - 2 * pad) * k) / 3} x2={((w - 2 * pad) * k) / 3} y1={0} y2={h - 2 * pad} stroke={theme.color.skeleton} strokeWidth={3} />)}
        </svg>
      );
    case "bars":
      return <>{[0.35, 0.6, 0.45, 0.85].map((k, i) => <div key={i} style={{ position: "absolute", left: pad + i * ((w - 2 * pad) / 4) + 4, bottom: pad, width: (w - 2 * pad) / 4 - 10, height: (h - 2 * pad) * k, borderRadius: 6, background: i === 3 ? c.indigo : theme.color.hairlineBrandSolid }} />)}</>;
  }
};

export const SC04 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(4, BLOCK.SC04);
  const g = f + BLOCK.SC04;
  const held = heldAt(g) !== null;

  // A
  const causesAt = W("Keputusan terburu-buru");
  const sure = ease(f, W("sangat meyakinkan"), m.reveal);
  /** Docks at Studio 10333 (Simon 28 Oct: "judul nya pindah ke kiri atas di 10333 aja"), 13 frames before "Solusinya". */
  const dock = ease(f, W("Solusinya") - m.sec(13 / 60), m.move);
  const lineP = ease(f, W("Lalu bagaimana") + m.sec(0.2), m.reveal) * (1 - ease(f, causesAt - m.sec(0.35), m.fade));
  const chipP = CAUSES.map((k) => ease(f, W(k.at) - m.sec(0.1), m.reveal));

  // B
  const thinkAt = W("Coba pikirkan");
  const bubbleP = ease(f, thinkAt - m.sec(0.1), m.reveal);
  const bitsAt = W("Kita juga perlu");
  const sortAt = W("sudah disusun");
  const clearAt = W("lebih mudah");
  const clear = ease(f, clearAt, m.reveal);
  const tidyP = ease(f, sortAt - m.sec(0.2), m.reveal);
  const bOut = ease(f, W("Tim riset"), m.fade);
  /** Seconds since the bubble came in — the clock's hands spin from then: time going by. */
  const tThink = Math.max(0, f - thinkAt) / m.sec(1);
  const bubbleTone = interpolateColors(clear, [0, 1], [theme.color.neutralIcon, c.indigo]);

  return (
    <Stage transparent={held}>
      {/* the paper, grid and heading stay put through the cut into SC05 (the Composition draws them then) */}
      {held ? null : <SoftGround f={g} />}
      {held ? null : <BoardGrid g={g} on={1} />}

      {/* A — one short line, then the heading opens with the three causes under it */}
      {lineP > 0.001 ? (
        <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: theme.canvas.height / 2 - 92 + (1 - lineP) * 12, textAlign: "center", opacity: lineP, ...typeStyle("title"), fontSize: 64, fontWeight: 500, lineHeight: 1.3, color: c.ink, whiteSpace: "nowrap" }}>
          {/* two lines, Simon's wording and case (28 Oct): "Gimana kalo masalahnya" / "bukan harga, tapi informasi." */}
          Gimana kalo masalahnya
          <br />
          bukan harga, <span style={{ color: c.indigo }}>tapi informasi.</span>
        </div>
      ) : null}
      <OpeningHeading
        n={2}
        hidden={held}
        text={SITUATION[1].label}
        p={ease(f, causesAt, m.reveal)}
        dock={dock}
        subP={chipP[0]}
        sub={
          <div style={{ display: "flex", gap: CHIP.gap }}>
            {CAUSES.map((k, i) => {
              const p = chipP[i];
              const glow = i === 2 ? sure : 0;
              return (
                <div key={k.text} style={{ position: "relative", width: CHIP.w, height: CHIP.h, opacity: p, transform: `translateY(${((1 - p) * 18).toFixed(2)}px)` }}>
                  <Card x={0} y={0} w={CHIP.w} h={CHIP.h} line={i === 2 && glow > 0.5 ? theme.color.connector : undefined} style={{ display: "flex", alignItems: "center", gap: 22, padding: "0 32px", boxShadow: `${shadow.soft}, 0 0 ${(44 * glow).toFixed(1)}px ${(10 * glow).toFixed(1)}px ${theme.color.indigoGlow}` }}>
                    <Disc icon={k.icon} size={70} tone={i === 2 && glow > 0.5 ? c.indigo : theme.color.neutralIcon} tint={i === 2 && glow > 0.5 ? theme.color.indigoWashSolid : theme.color.neutralDisc} />
                    <div style={{ ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>{k.text}</div>
                  </Card>
                </div>
              );
            })}
          </div>
        }
      />

      {/* B — think longer (a bubble of question marks), and information put in order */}
      {bubbleP > 0.001 && bOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - bOut }}>
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, opacity: bubbleP, transformOrigin: `${BUBBLE.cx}px ${BUBBLE.cy}px`, transform: `scale(${(0.9 + 0.1 * bubbleP).toFixed(3)})` }}>
            <circle cx={BUBBLE.cx - BUBBLE.a * 0.85} cy={BUBBLE.cy + BUBBLE.b + 45} r={18} fill={c.cardBg} stroke={bubbleTone} strokeWidth={4} />
            <circle cx={BUBBLE.cx - BUBBLE.a * 1.05} cy={BUBBLE.cy + BUBBLE.b + 85} r={10} fill={c.cardBg} stroke={bubbleTone} strokeWidth={4} />
            <path d={bubblePath} fill={c.cardBg} stroke={bubbleTone} strokeWidth={4} strokeLinejoin="round" />
            {/* the clock, hands spinning while it "thinks longer"; it gives way to the bulb */}
            <g opacity={1 - clear}>
              <circle cx={BUBBLE.cx} cy={BUBBLE.cy} r={70} fill={c.cardBg} stroke={theme.color.neutralIcon} strokeWidth={6} />
              <line x1={BUBBLE.cx} y1={BUBBLE.cy} x2={BUBBLE.cx + 48 * Math.sin(tThink * 2 * Math.PI)} y2={BUBBLE.cy - 48 * Math.cos(tThink * 2 * Math.PI)} stroke={theme.color.neutralIcon} strokeWidth={6} strokeLinecap="round" />
              <line x1={BUBBLE.cx} y1={BUBBLE.cy} x2={BUBBLE.cx + 32 * Math.sin((tThink / 12) * 2 * Math.PI)} y2={BUBBLE.cy - 32 * Math.cos((tThink / 12) * 2 * Math.PI)} stroke={theme.color.neutralIcon} strokeWidth={7} strokeLinecap="round" />
            </g>
          </svg>
          {QUESTIONS.map((q, i) => {
            const p = ease(f, thinkAt + m.sec(0.4 + 0.22 * i), m.pop) * (1 - clear);
            return p > 0.001 ? (
              <div key={i} style={{ position: "absolute", left: q.x - q.s / 2, top: q.y - q.s * 0.6, width: q.s, textAlign: "center", opacity: p, transform: `scale(${(0.75 + 0.25 * p).toFixed(3)})`, fontFamily: theme.text.family, fontSize: q.s, fontWeight: 700, lineHeight: 1, color: theme.color.neutralIcon }}>?</div>
            ) : null;
          })}
          {clear > 0.001 ? (
            <div style={{ position: "absolute", left: BUBBLE.cx - 70, top: BUBBLE.cy - 70, opacity: clear, transform: `scale(${(0.75 + 0.25 * clear).toFixed(3)})` }}>
              <Ico name="lightbulb" size={140} tone={c.indigo} />
            </div>
          ) : null}
          {/* its label: "Pikir lebih lama", then "Lebih mudah dipahami" */}
          {[
            { p: bubbleP * (1 - clear), text: "Pikir lebih lama", ink: c.ink },
            { p: clear, text: "Lebih mudah dipahami", ink: c.indigo },
          ].map((l) =>
            l.p > 0.001 ? (
              <div key={l.text} style={{ position: "absolute", left: BUBBLE.cx - 260, width: 520, top: BUBBLE.cy + BUBBLE.b + 80, textAlign: "center", opacity: l.p, ...typeStyle("body"), fontWeight: 600, color: l.ink, whiteSpace: "nowrap" }}>{l.text}</div>
            ) : null,
          )}

          {/* the tidy card, its rows filling as the bits arrive */}
          {tidyP > 0.001 ? (
            <Card x={TIDY.x} y={TIDY.y + (1 - tidyP) * 14} w={TIDY.w} h={TIDY.h} line={theme.color.hairlineBrandSolid} style={{ opacity: tidyP }}>
              <div style={{ position: "absolute", left: 36, top: 28, display: "flex", alignItems: "center", gap: 18 }}>
                <Disc icon="report" size={52} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                <div style={{ ...typeStyle("body"), color: c.ink }}>Informasi tersusun</div>
              </div>
              {TIDY_ROWS.map((icon, r) => {
                const p = ease(f, sortAt + m.sec(0.45 + 0.1 * r), m.reveal);
                return (
                  <div key={icon} style={{ position: "absolute", left: TIDY.pad, top: TIDY.head + r * (TIDY.row + TIDY.rowGap) + 20, width: TIDY.w - 2 * TIDY.pad, height: TIDY.row, borderRadius: 18, background: c.bg, opacity: p, display: "flex", alignItems: "center", gap: 24, padding: "0 24px", boxSizing: "border-box" }}>
                    <Disc icon={icon} size={64} tone={c.indigo} tint={theme.color.indigoWashStrongSolid} />
                    <div style={{ position: "relative", width: 340, height: 50 }}>
                      <Skel w={340} h={14} style={{ left: 0, top: 6 }} />
                      <Skel w={240} h={14} style={{ left: 0, top: 32 }} />
                    </div>
                  </div>
                );
              })}
            </Card>
          ) : null}

          {/* the loose bits: in on "Kita juga perlu informasi", into the card's rows on "sudah disusun" */}
          {BITS.map((bit, i) => {
            const p = ease(f, bitsAt + m.sec(0.08 * i), m.pop);
            const t = ease(f, sortAt + m.sec(0.05 * i), m.sec(0.7));
            if (p <= 0.001 || t >= 0.999) return null;
            const to = rowCenter(bit.row);
            const x = bit.x + (to.x - bit.x) * t;
            const y = bit.y + (to.y - bit.y) * t + 6 * Math.sin((f / m.sec(2.4)) * 2 * Math.PI + i) * (1 - t);
            const k = 1 - 0.7 * t;
            return (
              <Card key={i} x={x - bit.w / 2} y={y - bit.h / 2} w={bit.w} h={bit.h} style={{ opacity: p * (1 - ease(f, sortAt + m.sec(0.05 * i + 0.45), m.sec(0.25))), transform: `rotate(${(bit.r * (1 - t)).toFixed(2)}deg) scale(${(k * (0.85 + 0.15 * p)).toFixed(3)})` }}>
                <Bit kind={bit.kind} w={bit.w} h={bit.h} />
              </Card>
            );
          })}
        </div>
      ) : null}

      {/* C/D — the research team as an isometric exploded view (scenes/ResearchStack.tsx) */}
      <ResearchStack />
    </Stage>
  );
};
