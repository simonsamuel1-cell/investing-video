/**
 * PENUTUP — SC16 · SC17 · SC18.
 *
 * Not running from work: keep the life, and set part of today aside for later;
 * the three things that grow together, the two pillars, and the question to ask
 * every payday; then the two lines the video is about, and the closing card —
 * TA09's quote card on the grid, the Tuntun mark over it, the worker beside it.
 */
import { useCurrentFrame } from "remotion";
import { GridGround, Stage, TuntunMark, quoteListY, theme, useMotion, usePalette } from "../../../core";
import { BLOCK, SC16 as B16, SC17 as B17, SC18 as B18, local } from "../data/timing";
import { ease, Pill, WordLine, QuoteFrame, OUTSIDE_RESERVES, Say, TypeBox, Worker, useLife } from "../components/kit";

// ═══ SC16 — keep the life; set part of today aside ═══════════════════════
const BAR = { x: 820, y: 760, w: 940, h: 74, future: 0.26 };

export const SC16 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC16);
  const bar = ease(f, L(B16.bedanya), m.move);
  const split = ease(f, L(B16.depan) - 30, 30);
  return (
    <Stage>
      <Worker x={380} y={925} h={700} at={0} poses={[[0, 1]]} />
      <Say text="Lari dari pekerjaan" x={BAR.x} y={260} at={L(B16.lari)} anchor="left" size={60} weight={800} color={c.slate} strikeAt={L(B16.strike)} />
      {["Bangun karier", "Urus keluarga", "Menikmati hidup"].map((label, i) => (
        <Pill key={label} label={label} x={BAR.x} y={390 + i * 92} at={L(B16.tetap[i])} anchor="left" check size={42} />
      ))}
      <Say text="Hasil kerja hari ini" x={BAR.x} y={BAR.y - 56} at={L(B16.bedanya)} anchor="left" size={40} weight={700} />
      {bar > 0.001 ? (
        <>
          {/* today's share shrinks back by the future's share plus a gap,
              and the future's share is a rounded bar of its own */}
          <div style={{ position: "absolute", left: BAR.x, top: BAR.y, width: BAR.w * bar - (BAR.w * BAR.future + 10) * split, height: BAR.h, borderRadius: 16, background: c.indigo }} />
          <div
            style={{
              position: "absolute",
              left: BAR.x + BAR.w * (1 - BAR.future),
              top: BAR.y,
              width: BAR.w * BAR.future,
              height: BAR.h,
              borderRadius: 16,
              background: theme.color.cyanInk,
              opacity: split,
            }}
          />
        </>
      ) : null}
      <Say text="Hari ini" x={BAR.x + 20} y={BAR.y + BAR.h + 42} at={L(B16.depan) - 20} anchor="left" size={34} weight={700} color={c.indigo} />
      <Say text="Masa depan" x={BAR.x + BAR.w} y={BAR.y + BAR.h + 42} at={L(B16.depan)} anchor="right" size={34} weight={700} color={theme.color.cyanInk} />
    </Stage>
  );
};

// ═══ SC17 — growing together; the question to ask every payday ═══════════
const GROW = { base: 820, w: 150, x: [240, 460, 680] };
const GROW_BARS: { label: string; tone: "indigo" | "cyan"; from: number; to: number }[] = [
  { label: "Kemampuan", tone: "indigo", from: 130, to: 330 },
  { label: "Income", tone: "indigo", from: 150, to: 380 },
  { label: "Aset", tone: "cyan", from: 50, to: 300 },
];
const ROOF = { x: 1060, w: 700, y: 430, h: 86 };
const PILLARS = [
  { x: 1140, label: "Kerja", tone: "indigo" as const },
  { x: 1540, label: "Aset", tone: "cyan" as const },
];

export const SC17 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC17);
  const clear = L(B17.tanya) - 10;
  const first = useLife(L(B17.kecil) - 20, clear);
  const ink = (t: "indigo" | "cyan") => (t === "indigo" ? c.indigo : theme.color.cyanInk);
  const pillars = ease(f, L(B17.pillars), m.move);
  const roof = ease(f, L(B17.pillars) + 30, m.move);
  return (
    <Stage>
      {first > 0.001 ? (
        <div style={{ opacity: first }}>
          {GROW_BARS.map((b, i) => {
            const h = b.from + (b.to - b.from) * ease(f, L(B17.grow[i]), 40);
            return (
              <div key={b.label}>
                <div style={{ position: "absolute", left: GROW.x[i], top: GROW.base - h, width: GROW.w, height: h, borderRadius: 14, background: b.tone === "indigo" ? theme.color.indigoWashStrong : theme.color.hlCyan, border: `${theme.shape.rule}px solid ${ink(b.tone)}`, boxSizing: "border-box" }} />
                <Say text={b.label} x={GROW.x[i] + GROW.w / 2} y={GROW.base + 40} at={L(B17.kecil) - 20} size={32} weight={700} color={ink(b.tone)} />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: GROW.x[0] - 30, top: GROW.base, width: GROW.x[2] + GROW.w - GROW.x[0] + 60, height: theme.shape.rule, background: c.slate }} />
          <Say text="Aset kita mungkin masih kecil" x={(GROW.x[0] + GROW.x[2] + GROW.w) / 2} y={260} at={L(B17.kecil)} size={40} weight={700} />

          {/* two pillars under one roof */}
          {PILLARS.map((p) => (
            <div key={p.label}>
              <div style={{ position: "absolute", left: p.x, top: GROW.base - 300 * pillars, width: 120, height: 300 * pillars, background: ink(p.tone), borderRadius: 12 }} />
              <Say text={p.label} x={p.x + 60} y={GROW.base + 40} at={L(B17.pillars)} size={32} weight={700} color={ink(p.tone)} />
            </div>
          ))}
          {roof > 0.001 ? (
            <div style={{ position: "absolute", left: ROOF.x, top: ROOF.y, width: ROOF.w, height: ROOF.h, borderRadius: 18, background: c.cardBg, border: `${theme.shape.rule}px solid ${c.ink}`, opacity: roof, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: 38, fontWeight: 800, color: c.ink }}>
              Kekuatan finansial
            </div>
          ) : null}
          <Say text="Lebih banyak pilihan" x={ROOF.x + ROOF.w / 2} y={ROOF.y - 60} at={L(B17.pilihan)} size={44} weight={800} color={theme.color.cyanInk} />
        </div>
      ) : null}

      <Say text="Setiap kali income masuk, coba tanya:" x={960} y={360} at={L(B17.tanya)} size={44} weight={600} color={c.slate} />
      <TypeBox cx={960} y={470} w={1560} h={170} at={L(B17.tanya) + 40} typeAt={L(B17.quote)} text="“Berapa yang bisa aku sisihkan untuk mulai punya aset?”" mark="mulai punya aset" markAt={L(B17.mark)} tone="cyan" size={50} />
    </Stage>
  );
};

// ═══ SC18 — the two lines, then the closing card ═════════════════════════
const RULE = { gutter: 960, y: [400, 560], size: 64 };
const CARD = { x: 560, y: 360, w: 1180, h: 330, size: 54, lead: 76 };
const LINES = ["Dari sekadar pekerja,", "menjadi pekerja yang juga punya aset."];
const CARD_LIST_Y = quoteListY(CARD.y, CARD.h, CARD.lead, LINES.length);

export const SC18 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC18);
  const rulesOut = L(B18.close) - 16;
  const closing = ease(f, L(B18.close), m.move);
  const g = f + BLOCK.SC18;
  return (
    <Stage>
      {/* the two rules, meeting at the gutter (TA11's Rules) */}
      <Say text="Kerja" x={RULE.gutter - 40} y={RULE.y[0]} at={L(B18.kerja) - 30} out={rulesOut} anchor="right" size={RULE.size} weight={800} />
      <Say text="waktu jadi uang" x={RULE.gutter + 40} y={RULE.y[0]} at={L(B18.kerja)} out={rulesOut} anchor="left" size={RULE.size} weight={800} color={c.indigo} />
      <Say text="Investasi" x={RULE.gutter - 40} y={RULE.y[1]} at={L(B18.investasi)} out={rulesOut} anchor="right" size={RULE.size} weight={800} />
      <Say text="uang ikut bekerja" x={RULE.gutter + 40} y={RULE.y[1]} at={L(B18.bekerja)} out={rulesOut} anchor="left" size={RULE.size} weight={800} color={theme.color.cyanInk} />

      {/* the closing card on the grid, the mark floating over it */}
      {closing > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: closing }}>
          <div style={{ position: "absolute", inset: 0, clipPath: OUTSIDE_RESERVES }}>
            <GridGround f={g} paper={c.bg} />
          </div>
          <TuntunMark x={CARD.x + CARD.w / 2} y={CARD.y - 170 + Math.sin(((g - B18.close) / 240) * Math.PI * 2) * 10} height={130} />
          <QuoteFrame x={CARD.x} y={CARD.y} w={CARD.w} h={CARD.h} at={L(B18.close) + 12} listY={CARD_LIST_Y} lead={CARD.lead} count={LINES.length}>
            {LINES.map((line, n) => (
              <WordLine
                key={line}
                text={line}
                x={CARD.x + CARD.w / 2}
                y={CARD_LIST_Y + CARD.lead * n + CARD.size * 0.62}
                at={L(B18.close) + 40 + n * 60}
                stagger={6}
                size={CARD.size}
                weight={700}
                mark={n === 1 ? "juga punya aset." : undefined}
                markColor={theme.color.hlCyan}
                markAt={L(B18.mark)}
              />
            ))}
          </QuoteFrame>
          <Worker x={300} y={925} h={600} at={L(B18.close) + 20} poses={[[0, 5]]} />
        </div>
      ) : null}
    </Stage>
  );
};
