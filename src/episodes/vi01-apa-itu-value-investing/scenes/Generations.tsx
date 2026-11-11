/**
 * VI01 · SC03 — "Dari Satu Investor Menjadi Banyak Generasi", from Simon's VISUAL / TEKS LAYAR notes and the ChatGPT
 * storyboard docs/vi-style/storyboards/VI01-SC03.png.
 *
 *  A  "nggak berhenti di Graham": Graham big, then a line 1934 → 2026 with the names the VO says popping along it.
 *  B  six names, one at a time: the name grows on the line and a card above it gives the VO's own figures — the years, and
 *     the return against what it was compared with (Fairfax: no comparison — its own letter compares with nothing, and
 *     Simon 11 Nov dropped its "Book value per share" note; the empty row keeps every card's text in one place).
 *  C  "Mereka hidup di era berbeda": the card closes, Simon's first line over the timeline.
 *  D  "pahami bisnisnya, hitung… nilainya, bandingkan… harga": Orang Tuntun rises at the left (Simon 11 Nov), three steps
 *     joined by arrows beside him.
 *  E  "Value investing bukan metode dari satu orang": the Tuntun mascot over Simon's closing line.
 *
 * The figures are the script's, word for word (Simon: verify before final); the card prints nothing the VO doesn't say.
 */
import { useCurrentFrame } from "remotion";
import { TuntunMark, theme, typeStyle, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { Card, Glyph, Line, LogoTile, ORANG_TUNTUN_RIGHT, OrangTuntun, PhotoTile, ease, useWords, type LogoName } from "../components/kit";
import { Timeline, type MasterName } from "../components/Timeline";

const CX = theme.canvas.width / 2;

type Stat = { at: string; name: MasterName; title: string; period: string; face?: "schloss" | "buffett"; logo?: LogoName; main: number; mainText: string; bench?: string; benchV?: number; benchText?: string };
const STATS: Stat[] = [
  { at: "Walter Schloss", name: "Walter Schloss", title: "Walter Schloss", period: "45 tahun", face: "schloss", main: 15.3, mainText: "15,3%", bench: "S&P 500", benchV: 10, benchText: "10%" },
  { at: "Berkshire Hathaway", name: "Berkshire Hathaway", title: "Berkshire Hathaway", period: "61 tahun", face: "buffett", main: 19.7, mainText: "19,7%", bench: "S&P 500", benchV: 10.5, benchText: "10,5%" },
  { at: "Sequoia Fund", name: "Sequoia Fund", title: "Sequoia Fund", period: "55 tahun", logo: "sequoia", main: 13.5, mainText: "13,5%", bench: "S&P 500", benchV: 11.5, benchText: "11,5%" },
  { at: "Fairfax Financial", name: "Fairfax Financial", title: "Fairfax Financial", period: "40 tahun", logo: "fairfax", main: 18.7, mainText: "18,7%" },
  { at: "Nomad Investment", name: "Nomad", title: "Nomad Investment Partnership", period: "12 tahun", logo: "nomad", main: 20.8, mainText: "20,8%", bench: "MSCI World", benchV: 6.5, benchText: "6,5%" },
  { at: "Dan Fundsmith", name: "Fundsmith", title: "Fundsmith", period: "16 tahun", logo: "fundsmith", main: 13, mainText: "13%", bench: "MSCI World (GBP)", benchV: 12.4, benchText: "12,4%" },
];
// wide enough for the face, the 320 px label ("Pertumbuhan per tahun", Simon 11 Nov), the bar and the figure (Simon 10 Nov:
// the figures ran out of the card). Every card says its length in years only (Simon 11 Nov: "range waktunya ga usah");
// Fundsmith's "2010 sampai September 2026" is about 16.
const CARD = { x: CX - 600, y: 120, w: 1200, h: 380, face: 220, barMax: 21, barW: 320, barH: 30, label: 320, figure: 120 };
const STEPS = [
  { icon: "magnifying-glass", text: "Pahami bisnis", at: "pahami" },
  { icon: "coins", text: "Hitung nilai", at: "hitung" },
  { icon: "scales", text: "Bandingkan harga", at: "bandingkan" },
] as const;
// D — Orang Tuntun at the left (Simon 11 Nov: "di visual ini, kasih Orang Tuntun"), the three steps in the room right of him
// E — the mascot, centred over the closing line
const MASCOT = { y: 280, h: 170, float: 3, line: 570 };
const STEP_ROW = { left: ORANG_TUNTUN_RIGHT + 40, right: theme.canvas.width - theme.margin.right };
const STEP = { w: 316, h: 270, y: 345, gap: (STEP_ROW.right - STEP_ROW.left - 3 * 316) / 2, disc: 110, icon: 60, text: 30 };

const Bar = ({ label, v, text, tone, p }: { label: string; v: number; text: string; tone: string; p: number }) => {
  const c = usePalette();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, height: 48 }}>
      <div style={{ width: CARD.label, flex: "none", ...typeStyle("label"), fontSize: 28, fontWeight: 500, color: tone === theme.color.neutralDotOn ? c.slate : c.indigo, whiteSpace: "nowrap" }}>{label}</div>
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
      {/* A: Graham, big, until the line starts (Simon 11 Nov: no small Graham on the line) */}
      {bigGraham > 0.001 ? <PhotoTile name="graham" d={400} style={{ left: CX - 200, top: 220, opacity: bigGraham }} /> : null}
      <Timeline grow={grow} lit={st?.name} litP={cardP} opacity={1 - tlOut} />

      {/* B: the card */}
      {st && cardShow > 0.001 ? (
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, opacity: cardShow }}>
          <Card x={0} y={0} w={CARD.w} h={CARD.h}>
            <div key={st.name} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 48, padding: "0 56px", opacity: cardP }}>
              {st.face ? (
                <PhotoTile name={st.face} d={CARD.face} style={{ position: "relative" }} />
              ) : st.logo ? (
                <LogoTile name={st.logo} d={CARD.face} style={{ position: "relative" }} />
              ) : (
                <div style={{ width: CARD.face, height: CARD.face, borderRadius: 40, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <Glyph icon="bank" size={110} tone={theme.color.neutralIcon} />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ ...typeStyle("title"), fontSize: 50, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{st.title}</div>
                <div style={{ ...typeStyle("label"), fontSize: 32, fontWeight: 500, color: c.slate, marginBottom: 14 }}>{st.period}</div>
                <Bar label="Pertumbuhan per tahun" v={st.main} text={st.mainText} tone={c.indigo} p={bars} />
                {st.bench ? <Bar label={st.bench} v={st.benchV as number} text={st.benchText as string} tone={theme.color.neutralDotOn} p={bars} /> : <div style={{ height: 48 }} />}
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

      {/* D: Orang Tuntun, and the three steps beside him */}
      {f >= W(STEPS[0].at) - 1 && stepsOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - stepsOut }}>
          <OrangTuntun at={W(STEPS[0].at)} />
        </div>
      ) : null}
      {STEPS.map((s, i) => {
        const p = steps[i] * (1 - stepsOut);
        if (p <= 0.001) return null;
        const x = STEP_ROW.left + i * (STEP.w + STEP.gap);
        return (
          <div key={s.text}>
            <div style={{ position: "absolute", left: x, top: STEP.y, width: STEP.w, height: STEP.h, opacity: p, transform: `translateY(${((1 - p) * 20).toFixed(1)}px)` }}>
              <Card x={0} y={0} w={STEP.w} h={STEP.h}>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
                  <div style={{ width: STEP.disc, height: STEP.disc, borderRadius: 999, background: theme.color.indigoWashSolid, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Glyph icon={s.icon} size={STEP.icon} tone={c.indigo} />
                  </div>
                  <div style={{ ...typeStyle("label"), fontSize: STEP.text, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{s.text}</div>
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

      {/* E — the Tuntun mascot over Simon's closing line (Simon 11 Nov: "Tambahin maskot tuntun"), floating as in IN07 SC11 */}
      {closing > 0.001 ? (
        <div style={{ opacity: closing, transform: `translateY(${((1 - closing) * 16).toFixed(1)}px)` }}>
          <TuntunMark x={CX} y={MASCOT.y + MASCOT.float * Math.sin((f / m.sec(1.6)) * Math.PI * 2)} height={MASCOT.h} />
          <Line x={CX - 750} y={MASCOT.line} w={1500} text="Value Investing adalah salah satu pendekatan utama investor profesional dunia." size={60} align="center" weight={500} mark="Value Investing" />
        </div>
      ) : null}
    </>
  );
};
