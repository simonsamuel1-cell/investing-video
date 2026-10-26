/**
 * VI07 · SC04 — "Saat Nggak Punya Waktu Melakukan Semua Riset Sendiri". Situation 2, Terburu-buru. From the ChatGPT
 * storyboard docs/vi-style/storyboards/VI07-SC04.jpg.
 *
 *  A  why decisions get rushed: three chips — Waktu terbatas, Dasar kurang, Satu kalimat (the last one glows: it
 *     "sounds so convincing").
 *  B  not only "think longer" (+) — information put in order: loose skeleton bits fly into one tidy report.
 *  C  Tuntun's research team as an isometric exploded view (Simon's Pinterest reference, 26 Oct): one slab per job —
 *     laporan keuangan, model, kualitas, harga wajar, peristiwa — the same for saham and reksa dana (ResearchStack).
 *  D  waktu, proses, data drop down the axis; the slabs press into one tested block, beside one thin voice note.
 */
import { useCurrentFrame } from "remotion";
import { SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { ResearchStack } from "./ResearchStack";
import { Appear, BoardGrid, Card, Disc, Heading, SITUATION, Skel, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A — the three causes
const CHIP = { w: 420, h: 130, gap: 60, y: 440 };
const chipX = (i: number) => CX - (3 * CHIP.w + 2 * CHIP.gap) / 2 + i * (CHIP.w + CHIP.gap);
const CAUSES = [
  { text: "Waktu terbatas", icon: "time", at: "waktunya terbatas" },
  { text: "Dasar kurang", icon: "report", at: "dasarnya belum cukup" },
  { text: "Satu kalimat", icon: "ask", at: "satu kalimat" },
] as const;

// B — think longer + information in order
const THINK = { x: 300, y: 450, w: 440, h: 130 };
const REPORT = { x: 1060, y: 300, w: 420, h: 440 };
const ROWS = [
  { w: 300, y: 150 },
  { w: 240, y: 196 },
  { w: 320, y: 242 },
  { w: 200, y: 288 },
  { w: 280, y: 334 },
  { w: 160, y: 380 },
];
/** Where each loose bit starts (canvas px, around the report), before it is put in order. */
const LOOSE = [
  { x: 900, y: 260, r: -14 },
  { x: 1560, y: 330, r: 10 },
  { x: 980, y: 720, r: 8 },
  { x: 1600, y: 640, r: -9 },
  { x: 1300, y: 230, r: 6 },
  { x: 1380, y: 790, r: -6 },
];

export const SC04 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(4, BLOCK.SC04);
  const g = f + BLOCK.SC04;

  // A
  const littleAt = W("informasi yang kita punya");
  const causesAt = W("Keputusan terburu-buru");
  const sure = ease(f, W("sangat meyakinkan"), m.reveal);
  const aOut = ease(f, W("Solusinya"), m.fade);

  // B
  const thinkAt = W("Coba pikirkan");
  const plusAt = W("Kita juga perlu");
  const bitsAt = W("informasi yang sudah");
  const order = ease(f, W("disusun"), W("dipahami.", 0, "f1") - W("disusun"));
  const bOut = ease(f, W("Tim riset"), m.fade);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      <Appear at={W("Lalu bagaimana")} style={{ left: 0, top: 0 }}>
        <Heading n={2} text={SITUATION[1].label} />
      </Appear>

      {/* A — too little to go on, and why it gets rushed */}
      {aOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - aOut }}>
          <Appear at={littleAt} out={causesAt} style={{ left: CX - 160, top: 400 }}>
            <Card x={0} y={0} w={320} h={200}>
              <div style={{ position: "absolute", left: 36, top: 36 }}>
                <Disc icon="page" size={64} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
              </div>
              <Skel w={160} h={16} style={{ left: 36, top: 130 }} />
            </Card>
          </Appear>
          {CAUSES.map((k, i) => {
            const p = ease(f, W(k.at) - m.sec(0.1), m.reveal);
            if (p <= 0.001) return null;
            const glow = i === 2 ? sure : 0;
            return (
              <Card key={k.text} x={chipX(i)} y={CHIP.y + (1 - p) * 18} w={CHIP.w} h={CHIP.h} line={i === 2 && glow > 0.5 ? theme.color.connector : undefined} style={{ opacity: p, display: "flex", alignItems: "center", gap: 22, padding: "0 32px", boxShadow: `${shadow.soft}, 0 0 ${(44 * glow).toFixed(1)}px ${(10 * glow).toFixed(1)}px ${theme.color.indigoGlow}` }}>
                <Disc icon={k.icon} size={70} tone={i === 2 && glow > 0.5 ? c.indigo : theme.color.neutralIcon} tint={i === 2 && glow > 0.5 ? theme.color.indigoWashSolid : theme.color.neutralDisc} />
                <div style={{ ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>{k.text}</div>
              </Card>
            );
          })}
        </div>
      ) : null}

      {/* B — think longer, AND information put in order */}
      {bOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - bOut }}>
          <Appear at={thinkAt - m.sec(0.1)} style={{ left: 0, top: 0 }}>
            <Card x={THINK.x} y={THINK.y} w={THINK.w} h={THINK.h} style={{ display: "flex", alignItems: "center", gap: 22, padding: "0 32px" }}>
              <Disc icon="time" size={70} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
              <div style={{ ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>Pikir lebih lama</div>
            </Card>
          </Appear>
          <Appear at={plusAt} style={{ left: (THINK.x + THINK.w + REPORT.x) / 2 - 40, top: THINK.y + THINK.h / 2 - 40 }}>
            <div style={{ width: 80, height: 80, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.connector}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("statement"), fontWeight: 400, lineHeight: 1, color: c.indigo }}>+</div>
          </Appear>
          {/* the frame of the report, as the bits come in */}
          {order > 0.001 ? <Card x={REPORT.x} y={REPORT.y} w={REPORT.w} h={REPORT.h} line={theme.color.hairlineBrandSolid} style={{ opacity: order }} /> : null}
          {order > 0.001 ? (
            <div style={{ position: "absolute", left: REPORT.x + 40, top: REPORT.y + 40, opacity: order }}>
              <Disc icon="report" size={72} tone={c.indigo} tint={theme.color.indigoWashSolid} />
            </div>
          ) : null}
          {ROWS.map((r, i) => {
            const p = ease(f, bitsAt + i * m.sec(0.06), m.pop);
            if (p <= 0.001) return null;
            const t = Math.max(0, Math.min(1, order * 1.2 - i * 0.04));
            const from = LOOSE[i];
            const x = from.x + (REPORT.x + 40 - from.x) * t;
            const y = from.y + (REPORT.y + r.y + 30 - from.y) * t;
            return <Skel key={i} w={r.w} h={16} style={{ left: x, top: y, opacity: p, transform: `rotate(${(from.r * (1 - t)).toFixed(2)}deg)`, transformOrigin: "left center" }} />;
          })}
        </div>
      ) : null}

      {/* C/D — the research team as an isometric exploded view (scenes/ResearchStack.tsx) */}
      <ResearchStack />
    </Stage>
  );
};
