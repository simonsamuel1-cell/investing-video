/**
 * VI01 · SC03 — "Dari Satu Investor Menjadi Banyak Generasi", from Simon's VISUAL / TEKS LAYAR notes and the ChatGPT
 * storyboard docs/vi-style/storyboards/VI01-SC03.png.
 *
 *  A  "nggak berhenti di Graham": Graham at the start of a line 1934 → 2026; his whole master list pops along it.
 *  B  six names, one at a time: the name grows on the line and a card above it gives the VO's own figures — the years, and
 *     the return against what it was compared with (Fairfax: book value per share, no comparison).
 *  C  "Mereka hidup di era berbeda": the card closes, Simon's first line over the timeline.
 *  D  "pahami bisnisnya, hitung… nilainya, bandingkan… harga": three steps joined by arrows.
 *  E  "Value investing bukan metode dari satu orang": Simon's closing line.
 *
 * The figures are the script's, word for word (Simon: verify before final); the card prints nothing the VO doesn't say.
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { theme, typeStyle, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { ART, Card, Glyph, Line, PhotoTile, ease, useWords } from "../components/kit";
import { Timeline, type MasterName } from "../components/Timeline";

const CX = theme.canvas.width / 2;

type Stat = { at: string; name: MasterName; title: string; period: string; face?: "schloss" | "buffett"; main: number; mainText: string; bench?: string; benchV?: number; benchText?: string; note?: string };
const STATS: Stat[] = [
  { at: "Walter Schloss", name: "Walter Schloss", title: "Walter Schloss", period: "45 tahun", face: "schloss", main: 15.3, mainText: "15,3%", bench: "S&P 500", benchV: 10, benchText: "10%" },
  { at: "Berkshire Hathaway", name: "Berkshire Hathaway", title: "Berkshire Hathaway", period: "1965–2025 · 61 tahun", face: "buffett", main: 19.7, mainText: "19,7%", bench: "S&P 500", benchV: 10.5, benchText: "10,5%" },
  { at: "Sequoia Fund", name: "Sequoia Fund", title: "Sequoia Fund", period: "55 tahun", main: 13.5, mainText: "13,5%", bench: "Pembanding", benchV: 11.5, benchText: "11,5%" },
  { at: "Fairfax Financial", name: "Fairfax Financial", title: "Fairfax Financial", period: "40 tahun", main: 18.7, mainText: "18,7%", note: "Book value per share" },
  { at: "Nomad Investment", name: "Nomad", title: "Nomad Investment Partnership", period: "12 tahun", main: 20.8, mainText: "20,8%", bench: "MSCI World", benchV: 6.5, benchText: "6,5%" },
  { at: "Dan Fundsmith", name: "Fundsmith", title: "Fundsmith", period: "2010 – Sep 2026", main: 13, mainText: "13%", bench: "MSCI World (GBP)", benchV: 12.4, benchText: "12,4%" },
];
// wide enough for the face, the 260 px label, the bar and the figure (Simon 10 Nov: the figures ran out of the card)
const CARD = { x: CX - 600, y: 120, w: 1200, h: 380, face: 220, barMax: 21, barW: 380, barH: 30, label: 260, figure: 120 };
const STEPS = [
  { icon: "magnifying-glass", text: "Pahami bisnis", at: "pahami" },
  { icon: "coins", text: "Hitung nilai", at: "hitung" },
  { icon: "scales", text: "Bandingkan harga", at: "bandingkan" },
] as const;
const STEP = { w: 400, h: 300, gap: 120, y: 330 };

const Bar = ({ label, v, text, tone, p }: { label: string; v: number; text: string; tone: string; p: number }) => {
  const c = usePalette();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, height: 48 }}>
      <div style={{ width: CARD.label, flex: "none", ...typeStyle("label"), fontSize: 28, fontWeight: 500, color: c.slate, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ position: "relative", width: CARD.barW, flex: "none", height: CARD.barH, borderRadius: CARD.barH / 2, background: theme.color.neutralDisc }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: CARD.barH, width: (CARD.barW * v * p) / CARD.barMax, borderRadius: CARD.barH / 2, background: tone }} />
      </div>
      <div style={{ width: CARD.figure, flex: "none", ...typeStyle("label"), fontSize: 36, fontWeight: 600, color: tone === theme.color.neutralDotOn ? c.slate : c.indigo, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", opacity: p }}>{text}</div>
    </div>
  );
};

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(3, BLOCK.SC03);

  const bigGraham = ease(f, 0, m.reveal) * (1 - ease(f, W("Dari satu") - m.move, m.move));
  const grow = ease(f, W("Dari satu"), W("puluhan tahun") - W("Dari satu"));
  const smallGraham = ease(f, W("Dari satu"), m.move);
  const era = ease(f, W("Mereka hidup"), m.reveal);
  const tlOut = ease(f, W("pahami") - m.move, m.move);
  const steps = STEPS.map((s) => ease(f, W(s.at), m.reveal));
  const stepsOut = ease(f, W("Value investing bukan") - m.fade, m.fade);
  const closing = ease(f, W("Value investing bukan"), m.reveal);

  // which card is up
  const idx = STATS.findIndex((s, i) => f >= W(s.at) && (i === STATS.length - 1 || f < W(STATS[i + 1].at)));
  const st = idx >= 0 && f < W("Mereka hidup") ? STATS[idx] : undefined;
  const cardP = st ? ease(f, W(st.at), m.reveal) : 0;
  const cardOut = ease(f, W("Mereka hidup") - m.fade, m.fade);
  const cardShow = ease(f, W(STATS[0].at), m.reveal) * (1 - cardOut);
  const bars = st ? ease(f, W(st.at) + m.sec(0.6), m.sec(1.2)) : 0;

  return (
    <>
      {/* A: Graham, big, then at the start of the line */}
      {bigGraham > 0.001 ? <PhotoTile name="graham" d={400} style={{ left: CX - 200, top: 220, opacity: bigGraham }} /> : null}
      <Timeline grow={grow} lit={st?.name} litP={cardP} opacity={1 - tlOut} graham={smallGraham} />

      {/* B: the card */}
      {st && cardShow > 0.001 ? (
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, opacity: cardShow }}>
          <Card x={0} y={0} w={CARD.w} h={CARD.h}>
            <div key={st.name} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 48, padding: "0 56px", opacity: cardP }}>
              {st.face === "buffett" ? (
                <PhotoTile name="buffett" d={CARD.face} style={{ position: "relative" }} />
              ) : st.face ? (
                <Img src={staticFile(`art/vi01/${st.face}.png`)} style={{ width: CARD.face, height: (CARD.face * ART[st.face].h) / ART[st.face].w, flex: "none" }} />
              ) : (
                <div style={{ width: CARD.face, height: CARD.face, borderRadius: 40, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <Glyph icon="bank" size={110} tone={theme.color.neutralIcon} />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ ...typeStyle("title"), fontSize: 50, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{st.title}</div>
                <div style={{ ...typeStyle("label"), fontSize: 32, fontWeight: 500, color: c.slate, marginBottom: 14 }}>{st.period}</div>
                <Bar label="Per tahun" v={st.main} text={st.mainText} tone={c.indigo} p={bars} />
                {st.bench ? <Bar label={st.bench} v={st.benchV as number} text={st.benchText as string} tone={theme.color.neutralDotOn} p={bars} /> : <div style={{ ...typeStyle("label"), fontSize: 28, fontWeight: 500, color: c.slate, height: 48, display: "flex", alignItems: "center" }}>{st.note}</div>}
              </div>
            </div>
          </Card>
        </div>
      ) : null}

      {/* C: Simon's first line */}
      {era > 0.001 && tlOut < 0.999 ? (
        <div style={{ opacity: era * (1 - tlOut) }}>
          <Line x={CX - 700} y={300} w={1400} text="Pilihan yang konsisten digunakan oleh investor dan institusi profesional dengan track record jangka panjang." size={46} align="center" weight={500} mark="track record jangka panjang" />
        </div>
      ) : null}

      {/* D: three steps */}
      {STEPS.map((s, i) => {
        const p = steps[i] * (1 - stepsOut);
        if (p <= 0.001) return null;
        const x = CX - (3 * STEP.w + 2 * STEP.gap) / 2 + i * (STEP.w + STEP.gap);
        return (
          <div key={s.text}>
            <div style={{ position: "absolute", left: x, top: STEP.y, width: STEP.w, height: STEP.h, opacity: p, transform: `translateY(${((1 - p) * 20).toFixed(1)}px)` }}>
              <Card x={0} y={0} w={STEP.w} h={STEP.h}>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
                  <div style={{ width: 130, height: 130, borderRadius: 999, background: theme.color.indigoWashSolid, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Glyph icon={s.icon} size={70} tone={c.indigo} />
                  </div>
                  <div style={{ ...typeStyle("label"), fontSize: 42, fontWeight: 600, color: c.ink }}>{s.text}</div>
                </div>
              </Card>
            </div>
            {i > 0 ? (
              <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, opacity: p }}>
                <g fill="none" stroke={theme.color.connector} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <line x1={x - STEP.gap + 24} y1={STEP.y + STEP.h / 2} x2={x - 24} y2={STEP.y + STEP.h / 2} />
                  <path d={`M ${x - 40} ${STEP.y + STEP.h / 2 - 14} L ${x - 24} ${STEP.y + STEP.h / 2} L ${x - 40} ${STEP.y + STEP.h / 2 + 14}`} />
                </g>
              </svg>
            ) : null}
          </div>
        );
      })}

      {/* E */}
      {closing > 0.001 ? (
        <div style={{ opacity: closing, transform: `translateY(${((1 - closing) * 16).toFixed(1)}px)` }}>
          <Line x={CX - 750} y={500} w={1500} text="Value Investing adalah salah satu pendekatan utama investor profesional dunia." size={60} align="center" weight={500} mark="Value Investing" />
        </div>
      ) : null}
    </>
  );
};
