/**
 * VI02 · SC07 — "Empat Pertanyaan sebelum Membeli" in VI01's look (Simon 13 Nov: "revamp visual untuk scene 5-8"), from the
 * ChatGPT storyboard docs/vi-style/storyboards/VI02-SC07-v3.png. The old scene is scenes/FourQuestions.tsx (VI01_LOOK = false).
 *
 *  A  "jangan mulai dari: “Target harganya berapa?”": the sentence in short, nothing else (Simon 16 Nov: no X, no tag).
 *  B  "empat pertanyaan sederhana" (a cut): four tall cards, numbered; each lights on its ordinal ("Pertama" …) with its
 *     question, and its picture comes on the next sentence: SC01's box (what it sells), a profit line over the years (a shape, no
 *     figures; Simon 25 Nov), Laba → Dividen / Reinvestasi, bars rising into dashed ones (the future).
 *  C  "Kalau empat pertanyaan ini bisa dijawab": the cards fold into four ticked tiles at the top; under them SC06's balance
 *     scale with Harga on one pan and Bisnis on the other — now the price has something to be weighed against.
 *  D  "Kalau belum": the scale stays; its point in one line under it (Simon 16 Nov: the lone ABCD was "gabut").
 */
import { interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Drawing, Glyph, Line, Pic, Shot, ease, useWords } from "../components/kit";
import { ProfitLine } from "../components/ProfitLine";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A — the tag
const OPENER = { y: 480, size: 68 };
const CLOSING = { y: 898, size: 48 };

// B — four cards
const CARD = { w: 360, h: 560, gap: 40, y: 290, disc: 76, ask: 42, art: 470 };
/**
 * The heading over the cards (Simon 16 Nov): "Mulai dari 4 pertanyaan", then on "Pertama" it turns over to "Perusahaan ini ..." —
 * the words every card finishes. It leaves as the cards fold into tiles.
 */
const HEAD = { y: 168, size: 60, shift: 34 };
const HEADS = ["Mulai dari 4 pertanyaan", "Perusahaan ini ..."] as const;
const cardX = (i: number) => CX - (4 * CARD.w + 3 * CARD.gap) / 2 + i * (CARD.w + CARD.gap);
const QUESTIONS = [
  { ask: "Jual apa?", at: "Pertama", artAt: "Produk atau" },
  { ask: "Menghasilkan laba?", at: "Kedua", artAt: "Apakah bisnisnya" },
  { ask: "Labanya untuk apa?", at: "Ketiga", artAt: "Apakah dibagikan" },
  { ask: "Bisa tumbuh?", at: "Terakhir", artAt: "Apakah laba" },
] as const;
/** card 2's profit line: to `half` on "Apakah bisnisnya", the rest of the years on "perkembangan profitabilitasnya … waktu ke waktu" */
const PROFIT = { x: 52, y: 260, w: CARD.w - 104, h: 210, half: 0.5 };
const GROW = [0.32, 0.46, 0.58, 0.74, 0.92];

// C — the tiles and the scale (SC06's parts)
const TILE = { w: 160, h: 110, gap: 28, y: 190 };
const tileX = (i: number) => CX - (4 * TILE.w + 3 * TILE.gap) / 2 + i * (TILE.w + TILE.gap);
const PART = {
  stand: { src: "art/vi02/scale-line/stand.png", w: 333, h: 533, knob: { x: 166, y: 48 } },
  beam: { src: "art/vi02/scale-line/beam.png", w: 617, h: 116, mid: { x: 308.5, y: 58 }, ring: 265.5 },
  pan: { src: "art/vi02/scale-line/pan.png", w: 317, h: 413, ring: { x: 158, y: 39 }, rim: 287 },
} as const;
const SCALE = { cx: CX, pivot: 430, standH: 440, half: 300, panW: 230 };
const K_STAND = SCALE.standH / PART.stand.h;
const K_BEAM = SCALE.half / PART.beam.ring;
const K_PAN = SCALE.panW / PART.pan.w;

/** A price tag, its nose to the left; its fill and line follow `grey`. */
const Tag = ({ w, h, nose, hole, grey, children }: { w: number; h: number; nose: number; hole: number; grey: number; children: React.ReactNode }) => {
  const c = usePalette();
  return (
    <>
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={`M ${nose} 12 Q ${nose + 6} 0 ${nose + 22} 0 L ${w - 34} 0 Q ${w} 0 ${w} 34 L ${w} ${h - 34} Q ${w} ${h} ${w - 34} ${h} L ${nose + 22} ${h} Q ${nose + 6} ${h} ${nose} ${h - 12} L 14 ${h / 2 + 14} Q 0 ${h / 2} 14 ${h / 2 - 14} Z`} fill={interpolateColors(grey, [0, 1], [c.cardBg, theme.color.neutralDisc])} stroke={c.ink} strokeWidth={4} strokeLinejoin="round" />
        <circle cx={nose - 8} cy={h / 2} r={hole / 2} fill={c.cardBg} stroke={c.ink} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: nose + 10, right: 20, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </>
  );
};

export const SC07 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(7, BLOCK.SC07);
  const g = f + BLOCK.SC07;

  const cardsAt = W("empat pertanyaan");
  const doneAt = W("Kalau keempat");
  const notAt = W("Kalau belum");

  // A

  // B–C
  const lightAt = QUESTIONS.map((q) => W(q.at));
  const lit = QUESTIONS.map((_, i) => ease(f, lightAt[i], m.pop) * (i < 3 ? 1 - ease(f, lightAt[i + 1], m.pop) : 1 - ease(f, doneAt, m.pop)));
  const growAt = W("perkembangan profitabilitasnya");
  const profitP = PROFIT.half * ease(f, W("Apakah bisnisnya"), m.sec(0.9)) + (1 - PROFIT.half) * ease(f, growAt, W("ke waktu") - growAt);
  const fold = ease(f, doneAt, m.move);
  const scaleAt = W("barulah kita");
  const scaleIn = ease(f, scaleAt - m.sec(0.2), m.reveal);
  /** the beam settles level: a small sway that dies out */
  const since = Math.max(0, f - scaleAt) / m.sec(1);
  const tilt = f < scaleAt ? 0 : 6 * Math.exp(-2.2 * since) * Math.cos(since * Math.PI * 2.2);
  const rad = (tilt * Math.PI) / 180;
  const ends = [-1, 1].map((s) => ({ x: SCALE.cx + s * SCALE.half * Math.cos(rad), y: SCALE.pivot + s * SCALE.half * Math.sin(rad) }));

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A: the question to skip */}
      <Shot from={-1} to={cardsAt} block={BLOCK.SC07} cutIn={false}>
        <Appear at={W("Jadi ketika") + m.sec(0.15)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={OPENER.y} w={theme.canvas.width} align="center" size={OPENER.size} weight={500} text="Jangan mulai dari “Target harganya berapa?”" mark="Jangan mulai" />
        </Appear>
      </Shot>

      {/* B–C: four questions, then what they make possible */}
      <Shot from={cardsAt} to={1e6} block={BLOCK.SC07} cutOut={false}>
        {/* B: the heading over the cards, turning over once */}
        {(() => {
          const swap = ease(f, W("Pertama"), m.move);
          const gone = ease(f, W("Kalau keempat"), m.fade);
          return HEADS.map((text, i) => {
            const inP = i === 0 ? ease(f, cardsAt + m.sec(0.1), m.reveal) : swap;
            const outP = i === 0 ? swap : 0;
            const p = inP * (1 - outP) * (1 - gone);
            if (p <= 0.001) return null;
            const dy = (1 - inP) * HEAD.shift - outP * HEAD.shift;
            return (
              <div key={text} style={{ position: "absolute", left: 0, top: HEAD.y + dy, width: theme.canvas.width, transform: "translateY(-50%)", textAlign: "center", ...typeStyle("title"), fontSize: HEAD.size, fontWeight: 600, color: c.ink, opacity: p, whiteSpace: "nowrap" }}>{text}</div>
            );
          });
        })()}
        {QUESTIONS.map((q, i) => {
          const p = ease(f, cardsAt + i * m.sec(0.1), m.reveal);
          const asked = ease(f, lightAt[i], m.reveal);
          const art = ease(f, W(q.artAt), m.reveal);
          const x = mix(cardX(i), tileX(i), fold);
          const y = mix(CARD.y, TILE.y, fold);
          const w = mix(CARD.w, TILE.w, fold);
          const h = mix(CARD.h, TILE.h, fold);
          const inside = 1 - Math.min(1, fold * 2.5);
          const tick = ease(f, doneAt + m.sec(0.35) + i * m.sec(0.12), m.pop);
          return (
            <div key={q.ask} style={{ position: "absolute", left: x, top: y + (1 - p) * 16, width: w, height: h, opacity: p }}>
              <Card x={0} y={0} w={w} h={h} style={{ boxShadow: `${lit[i] > 0.5 ? shadow.glow : shadow.soft}, inset 0 0 0 ${lit[i] > 0.5 ? 4 : 2}px ${lit[i] > 0.5 ? c.indigo : theme.color.skeleton}` }}>
                {/* the number, on the card's top edge; on a tile, in its corner */}
                <div style={{ position: "absolute", left: mix(w / 2 - CARD.disc / 2, 16, fold), top: mix(-CARD.disc / 2, h / 2 - 28, fold), width: mix(CARD.disc, 56, fold), height: mix(CARD.disc, 56, fold), borderRadius: 999, background: lit[i] > 0.5 ? c.indigo : c.cardBg, boxShadow: `inset 0 0 0 3px ${lit[i] > 0.5 ? c.indigo : c.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: mix(40, 30, fold), fontWeight: 600, color: lit[i] > 0.5 ? c.cardBg : c.ink }}>{i + 1}</div>
                {tick > 0.001 ? (
                  <div style={{ position: "absolute", right: 18, top: h / 2 - 26, width: 52, height: 52, borderRadius: 999, background: theme.color.ok, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontWeight: 700, fontSize: 28, color: c.cardBg, opacity: tick, transform: `scale(${(0.7 + 0.3 * tick).toFixed(3)})` }}>✓</div>
                ) : null}
                {inside > 0.001 ? (
                  <div style={{ position: "absolute", inset: 0, opacity: inside }}>
                    <div style={{ position: "absolute", left: 24, right: 24, top: 80, textAlign: "center", ...typeStyle("title"), fontSize: CARD.ask, fontWeight: 600, lineHeight: 1.15, color: c.ink, opacity: asked, textWrap: "balance" }}>{q.ask}</div>
                    {i === 0 ? <Drawing name="box" cx={CARD.w / 2} floor={CARD.art} h={190} style={{ opacity: art }} /> : null}
                    {i === 1 ? <ProfitLine x={PROFIT.x} y={PROFIT.y} w={PROFIT.w} h={PROFIT.h} on={art} p={profitP} /> : null}
                    {i === 2 ? (
                      <div style={{ position: "absolute", inset: 0, opacity: art }}>
                        <Connector a={{ x: CARD.w / 2, y: 300 }} b={{ x: 96, y: 410 }} p={ease(f, W("dividen"), m.sec(0.4))} shape="elbow" axis="y" width={3} />
                        <Connector a={{ x: CARD.w / 2, y: 300 }} b={{ x: CARD.w - 96, y: 410 }} p={ease(f, W("ditanam kembali"), m.sec(0.4))} shape="elbow" axis="y" width={3} />
                        <div style={{ position: "absolute", left: CARD.w / 2, top: 270, transform: "translate(-50%, -50%)", padding: "8px 26px", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 3px ${c.ink}`, ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: c.ink }}>Laba</div>
                        {[
                          { text: "Dividen", x: 96, at: W("dividen") },
                          { text: "Reinvestasi", x: CARD.w - 96, at: W("ditanam kembali") },
                        ].map((k) => (
                          <div key={k.text} style={{ position: "absolute", left: k.x, top: 440, transform: "translate(-50%, -50%)", padding: "8px 18px", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, ...typeStyle("label"), fontSize: 26, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap", opacity: ease(f, k.at + m.sec(0.25), m.reveal) }}>{k.text}</div>
                        ))}
                      </div>
                    ) : null}
                    {i === 3 ? (
                      <div style={{ position: "absolute", left: 44, bottom: 90, width: CARD.w - 88, height: 220, display: "flex", alignItems: "flex-end", gap: 14 }}>
                        {GROW.map((v, k) => {
                          const future = k >= 3;
                          const p2 = ease(f, W(q.artAt) + k * m.sec(0.12), m.reveal);
                          if (p2 <= 0.01) return <div key={k} style={{ flex: 1 }} />;
                          return <div key={k} style={{ flex: 1, height: `${v * 100 * p2}%`, borderRadius: 10, background: future ? c.cardBg : k === 2 ? c.indigo : theme.color.hairlineBrandSolid, border: future ? `3px dashed ${c.indigo}` : undefined, boxSizing: "border-box" }} />;
                        })}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </Card>
            </div>
          );
        })}

        {/* C: now the price has something to be weighed against */}
        {scaleIn > 0.001 ? (
          <div style={{ position: "absolute", inset: 0, opacity: scaleIn }}>
            <Pic src={staticFile(PART.stand.src)} style={{ position: "absolute", left: SCALE.cx - PART.stand.knob.x * K_STAND, top: SCALE.pivot - PART.stand.knob.y * K_STAND, width: PART.stand.w * K_STAND, height: SCALE.standH }} />
            <Pic src={staticFile(PART.beam.src)} style={{ position: "absolute", left: SCALE.cx - PART.beam.mid.x * K_BEAM, top: SCALE.pivot - PART.beam.mid.y * K_BEAM, width: PART.beam.w * K_BEAM, height: PART.beam.h * K_BEAM, transformOrigin: `${PART.beam.mid.x * K_BEAM}px ${PART.beam.mid.y * K_BEAM}px`, transform: `rotate(${tilt.toFixed(3)}deg)` }} />
            {ends.map((e, s) => (
              <Pic key={s} src={staticFile(PART.pan.src)} style={{ position: "absolute", left: e.x - PART.pan.ring.x * K_PAN, top: e.y - PART.pan.ring.y * K_PAN, width: SCALE.panW, height: PART.pan.h * K_PAN }} />
            ))}
            {/* on the left pan the price, on the right the business */}
            {(() => {
              const rimL = ends[0].y + (PART.pan.rim - PART.pan.ring.y) * K_PAN;
              const rimR = ends[1].y + (PART.pan.rim - PART.pan.ring.y) * K_PAN;
              return (
                <>
                  <div style={{ position: "absolute", left: ends[0].x - 125, top: rimL - 96, width: 250, height: 92 }}>
                    <Tag w={250} h={92} nose={50} hole={16} grey={0}>
                      <div style={{ ...typeStyle("title"), fontSize: 38, fontWeight: 600, color: c.ink }}>Harga</div>
                    </Tag>
                  </div>
                  <div style={{ position: "absolute", left: ends[1].x - 120, top: rimR - 96, width: 240, height: 92, borderRadius: 18, background: c.cardBg, boxShadow: `inset 0 0 0 4px ${c.ink}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <Glyph icon="book-open" size={38} tone={c.ink} />
                    <div style={{ ...typeStyle("title"), fontSize: 38, fontWeight: 600, color: c.ink }}>Bisnis</div>
                  </div>
                </>
              );
            })()}
          </div>
        ) : null}
      </Shot>

      {/* D: "Kalau belum…" — the scale stays, its point in one line under it (Simon 16 Nov: no lone ABCD) */}
      <Appear at={notAt + m.sec(0.15)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={0} y={CLOSING.y} w={theme.canvas.width} align="center" size={CLOSING.size} weight={500} text="Belum bisa dijawab? Yang dibeli masih sekadar kode saham." mark="sekadar kode saham" />
      </Appear>
    </Stage>
  );
};
