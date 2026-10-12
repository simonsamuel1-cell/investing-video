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
import { BG_FADE, BLOCK, SC16 as B16, SC17 as B17, SC18 as B18, local } from "../data/timing";
import { Cutout, DashBox, dashOpenAt, ease, WordLine, QuoteFrame, OUTSIDE_RESERVES, Say, TypeBox, Worker, useLife } from "../components/kit";

// ═══ SC16 — not running from work: keep the life ════════════════════════
/**
 * Everyone stands on one floor line at one scale (so the seated worker is smaller than the standing men, as
 * he would be). `ink` is each picture's opaque extent in its own pixels; `place` puts that extent's
 * centre on `cx` and its bottom on the floor.
 */
type Pic = { src: string; w: number; h: number; ink: { x0: number; x1: number; y0: number; y1: number } };
const PICS = {
  resign: { src: "art/vi01/orang-resign.png", w: 1086, h: 1448, ink: { x0: 269, x1: 898, y0: 11, y1: 1426 } },
  kerja: { src: "art/vi01/orang-kerja.png", w: 1448, h: 1086, ink: { x0: 127, x1: 1335, y0: 18, y1: 1069 } },
  family: { src: "art/vi01/berkeluarga.png", w: 1024, h: 1536, ink: { x0: 165, x1: 854, y0: 14, y1: 1511 } },
  healing: { src: "art/vi01/healing.png", w: 1024, h: 1536, ink: { x0: 70, x1: 1007, y0: 114, y1: 1469 } },
} satisfies Record<string, Pic>;
const S16 = { floor: 850, k: 0.5, gap: 70, boxH: 120, boxW: 1500, boxFoot: 60, size: 38, resignSecs: 0.6 };
const place = (p: Pic, cx: number) => ({
  src: p.src,
  aspect: p.w / p.h,
  x: cx + (p.w / 2 - (p.ink.x0 + p.ink.x1) / 2) * S16.k,
  y: S16.floor + (p.h - p.ink.y1) * S16.k,
  h: p.h * S16.k,
  floorAt: p.ink.y1 / p.h,
  half: ((p.ink.x1 - p.ink.x0) * S16.k) / 2,
});
const SAY16 = ["Membangun passive income bukan berarti lari dari pekerjaan", "Kita tetap bisa bangun karier, urus keluarga, dan menikmati hidup sekarang."];

export const SC16 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC16);
  const centre = theme.canvas.width / 2;
  const resign = place(PICS.resign, centre);
  const kerja = place(PICS.kerja, centre);
  /* the two scenes either side stand clear of the widest picture in the middle */
  const reach = Math.max(resign.half, kerja.half) + S16.gap;
  const family = place(PICS.family, centre - reach - (((PICS.family.ink.x1 - PICS.family.ink.x0) * S16.k) / 2));
  const healing = place(PICS.healing, centre + reach + (((PICS.healing.ink.x1 - PICS.healing.ink.x0) * S16.k) / 2));
  const grid = ease(f, 0, BG_FADE);
  /* the dashed box over the feet: its words typed, then swapped for the next line */
  const at = L(B16.box);
  const typeAt = dashOpenAt(at, m);
  const swap = L(B16.swap);
  const t1 = Math.max(0, Math.min(Math.floor(f - typeAt), SAY16[0].length));
  const t2 = Math.max(0, Math.min(Math.floor(f - (swap + m.sec(0.25))), SAY16[1].length));
  const gone1 = ease(f, swap, m.fade);
  const boxY = S16.floor - S16.boxFoot;
  const word = (text: string, shown: number, opacity: number, key: string) => (
    <div key={key} style={{ position: "absolute", left: 0, top: 0, width: S16.boxW, height: S16.boxH, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: S16.size, fontWeight: 600, color: c.ink, whiteSpace: "pre", opacity }}>
      {text.slice(0, shown)}
    </div>
  );
  return (
    <Stage>
      {/* "fade in background kotak kotak" */}
      <div style={{ position: "absolute", inset: 0, opacity: grid, clipPath: OUTSIDE_RESERVES }}>
        <GridGround f={f + BLOCK.SC16} paper={c.bg} />
      </div>
      {/* Berkeluarga on the left, Healing on the right */}
      <Cutout src={family.src} aspect={family.aspect} x={family.x} y={family.y} h={family.h} at={L(B16.family)} shadow floor={family.floorAt} />
      <Cutout src={healing.src} aspect={healing.aspect} x={healing.x} y={healing.y} h={healing.h} at={L(B16.healing)} shadow floor={healing.floorAt} />
      {/* Orang Resign, then — at the swap — a fade over to Orang Kerja */}
      <Cutout src={resign.src} aspect={resign.aspect} x={resign.x} y={resign.y} h={resign.h} at={L(B16.resign)} out={swap} shadow floor={resign.floorAt} />
      <Cutout src={kerja.src} aspect={kerja.aspect} x={kerja.x} y={kerja.y} h={kerja.h} at={swap} rise={0} shadow floor={kerja.floorAt} />
      {/* the dashed box, over their feet */}
      <DashBox cx={centre} y={boxY - S16.boxH / 2} w={S16.boxW} h={S16.boxH} at={at}>
        {word(SAY16[0], t1, 1 - gone1, "a")}
        {word(SAY16[1], t2, ease(f, swap + m.sec(0.25), m.fade), "b")}
      </DashBox>
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
