/**
 * IN07 · SC04 — "… melalui fundamental research, industry research, dan company research. Analisisnya
 * juga terus diperbarui mengikuti perkembangan terbaru." Simon, 9 Nov (it replaced the analyst-tiles block built from
 * docs/vi-style/storyboards/IN07-SC04-analis.png):
 *
 *  · the three ways as pictures made in ChatGPT (docs/vi-style/storyboards/IN07-SC04-cara.png, cut to
 *    public/art/in07/sc04-cara-*.png); "tiap gambar muncul dulu besar, lalu mengecil menjadi bagan" — each comes in big
 *    in the middle on its words, then shrinks into its circle of a three-step diagram, arrows between, its title under
 *    it. His reference (three circles, RESEARCH → IDEA → GOAL) gave the order only, not the look;
 *  · "Analisisnya juga terus diperbarui mengikuti perkembangan terbaru." as a line of text under the diagram, his words,
 *    in a text box ("Text ini, kasih text box") — the dashed one, opening from its centre ("text box garis putus
 *    putus ya"), "terus diperbarui" in indigo (his "highlight \"terus diperbarui\"").
 * Under the analyst and the folder (scenes/ResearchFiles.tsx); out on "Riset Tuntun mencakup".
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { DashBox, dashOpenAt, ease, useWords } from "../components/kit";
import { UNDER_DOCK } from "./ResearchFiles";

const WAYS = [
  { src: "sc04-cara-1-fundamental", title: "Fundamental research", at: "fundamental research" },
  { src: "sc04-cara-2-industry", title: "Industry research", at: "industry research" },
  // "Company research" (Simon 11 Nov 2026), on screen and in the VO — it was "kunjungan langsung ke perusahaan"
  { src: "sc04-cara-3-kunjungan", title: "Company research", at: "company research" },
] as const;

/** The diagram: three circles in a row, centred, under the analyst row; each comes in `big` across, in the middle. */
const D = 240;
const STEP = 420;
const CY = UNDER_DOCK + 70 + D / 2;
const cxOf = (i: number) => theme.canvas.width / 2 + (i - 1) * STEP;
const BIG = { d: 400, cy: CY + 15 };
const TITLE = { y: CY + D / 2 + 22, w: 360 };
const ARROW = { gap: 26, head: 14 };
const LINE_Y = TITLE.y + 125;
/** The dashed box draws its dashes on known coordinates, so it is sized to the line (≈1140 px at 36 px) rather than measuring it. */
const BOX = { w: 1240, h: 88 };

export const Coverage = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(4, BLOCK.SC04);

  const inAt = WAYS.map((w) => W(w.at) - m.sec(0.1));
  /** Each holds big for a moment, then goes to its place. */
  const shrinkAt = inAt.map((a) => a + m.reveal + m.sec(0.35));
  /** The box opens just before "Analisisnya", so its line is up early in the sentence. */
  const boxAt = W("Analisisnya") - m.sec(0.5);
  const lineP = ease(f, dashOpenAt(boxAt, m), m.fade);
  const out = ease(f, W("Riset Tuntun mencakup"), m.fade);

  if (f < inAt[0] || out >= 0.999) return null;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {/* the arrows, each drawn as the next circle lands */}
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
        {[0, 1].map((i) => {
          const p = ease(f, shrinkAt[i + 1] + m.move * 0.6, m.sec(0.4));
          if (p <= 0.001) return null;
          const a = cxOf(i) + D / 2 + ARROW.gap;
          const b = cxOf(i + 1) - D / 2 - ARROW.gap;
          return (
            <g key={i}>
              <line x1={a} y1={CY} x2={a + (b - a) * p} y2={CY} stroke={theme.color.connector} strokeWidth={4} strokeLinecap="round" />
              {p > 0.95 ? <polyline points={`${b - ARROW.head},${CY - ARROW.head} ${b},${CY} ${b - ARROW.head},${CY + ARROW.head}`} fill="none" stroke={theme.color.connector} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : null}
            </g>
          );
        })}
      </svg>

      {WAYS.map((w, i) => {
        const p = ease(f, inAt[i], m.reveal);
        if (p <= 0.001) return null;
        const t = ease(f, shrinkAt[i], m.move);
        const d = BIG.d + (D - BIG.d) * t;
        const cx = theme.canvas.width / 2 + (cxOf(i) - theme.canvas.width / 2) * t;
        const cy = BIG.cy + (CY - BIG.cy) * t;
        const titleP = ease(f, shrinkAt[i] + m.move * 0.6, m.reveal);
        return (
          <div key={w.src}>
            <div style={{ position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: 999, overflow: "hidden", background: c.cardBg, border: `4px solid ${c.indigo}`, boxSizing: "border-box", boxShadow: shadow.soft, opacity: p, transform: `scale(${(0.92 + 0.08 * p).toFixed(3)})` }}>
              <Img src={staticFile(`art/in07/${w.src}.png`)} style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
            </div>
            {titleP > 0.001 ? (
              <div style={{ position: "absolute", left: cxOf(i) - TITLE.w / 2, width: TITLE.w, top: TITLE.y + (1 - titleP) * 12, textAlign: "center", ...typeStyle("body"), fontSize: 30, lineHeight: 1.2, color: c.ink, whiteSpace: "pre-line", opacity: titleP }}>{w.title}</div>
            ) : null}
          </div>
        );
      })}

      {/* "Analisisnya juga terus diperbarui mengikuti perkembangan terbaru." — under the diagram */}
      <DashBox cx={theme.canvas.width / 2} y={LINE_Y} w={BOX.w} h={BOX.h} at={boxAt}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("body"), fontSize: 36, color: c.ink, whiteSpace: "nowrap", opacity: lineP }}>
          Analisisnya juga&nbsp;<span style={{ color: c.indigo }}>terus diperbarui</span>&nbsp;mengikuti perkembangan terbaru.
        </div>
      </DashBox>
    </div>
  );
};
