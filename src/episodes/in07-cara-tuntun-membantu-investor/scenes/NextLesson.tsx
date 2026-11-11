/**
 * IN07 · SC11, E — "Kalau kalian ingin belajar lebih lanjut dan memahami investasi dengan pendekatan yang lebih
 * mendalam, kalian bisa melanjutkan ke Module Value Investing. Di sana, kita akan belajar memahami bisnis di balik
 * sebuah saham, menilai harga yang layak dibayar, menghadapi pergerakan market, dan mengenali perusahaan yang
 * benar-benar kita pahami." (the 11 Nov VO; it replaced 9 Nov's "Di lesson berikutnya …", and Simon: "Skalian benerin
 * visualnya ya"). From the ChatGPT storyboard docs/vi-style/storyboards/IN07-SC11-next-lesson.png.
 *
 * A camera cut from the close into the series' next-video head — core's chip, here "Module" as the VO says it, and
 * the module's title, in their VI look — and under it:
 *  1  "belajar lebih lanjut …": a building with columns, drawn in ChatGPT in the episode's line style (Simon 9 Nov: "Ini
 *     benerin deh, bikin gambarnya aja dari chatgpt" — docs/vi-style/storyboards/IN07-SC11-fondasi.png, its outside cut
 *     away to public/art/in07/sc11-fondasi.png), shows from the ground up. Its "Fondasi" label went with the word
 *     "fondasi" (no longer in the VO);
 *  2  "kita akan belajar": the building steps aside, smaller, an arrow out of it, and the four things the module will
 *     teach come in one by one on their words.
 * The storyboard's words on the roof and the long base caption are left out: the title already names it.
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { NextVideoHead, cutInStyle, theme, typeStyle, useMotion, usePalette, type Cut } from "../../../core";
import { BLOCK } from "../data/timing";
import { Card, Disc, ease, useWords } from "../components/kit";

/** The building's picture (px). */
const PIC = { src: "art/in07/sc11-fondasi.png", w: 1148, h: 897 };
/** Its height alone in the middle; `k` scales that. */
const PIC_H = 380;
/** Where it stands: alone in the middle, then aside and smaller for the four cards. */
const SOLO = { cx: theme.canvas.width / 2, cy: 640, k: 1 };
const ASIDE = { cx: 420, cy: 640, k: 0.72 };
const LEARN = [
  { text: "Memahami\nbisnis", icon: "factory", at: "memahami bisnis" },
  { text: "Harga yang\nlayak", icon: "tag", at: "menilai harga" },
  { text: "Pergerakan\nmarket", icon: "chart-up", at: "menghadapi pergerakan" },
  { text: "Perusahaan\nyang dipahami", icon: "office", at: "mengenali perusahaan" },
] as const;
const CARD = { w: 230, h: 240, gap: 22, x0: 720 };
const ARROW = { x0: 620, x1: 690, head: 14 };

export const NextLesson = ({ cut }: { cut: Cut }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(11, BLOCK.SC11);

  if (f < cut.at) return null;
  const cutIn = f < cut.at + cut.over / 2 ? cutInStyle(f, cut) : {};

  /** On "belajar lebih lanjut", so the cut does not land on an empty board for long. */
  const buildAt = W("belajar lebih lanjut") - m.sec(0.1);
  /** Shown from the ground up: the foundation first, the roof last. */
  const rise = ease(f, buildAt, m.sec(1));
  const aside = ease(f, W("kita akan belajar"), m.move);
  const at = { cx: SOLO.cx + (ASIDE.cx - SOLO.cx) * aside, cy: SOLO.cy + (ASIDE.cy - SOLO.cy) * aside, k: SOLO.k + (ASIDE.k - SOLO.k) * aside };
  const s = (PIC_H * at.k) / PIC.h;
  const left = at.cx - (PIC.w * s) / 2;
  const top = at.cy - (PIC.h * s) / 2;
  const arrow = ease(f, W("kita akan belajar") + m.move * 0.6, m.sec(0.4));
  const lift = (p: number) => `translateY(${((1 - p) * 30).toFixed(2)}px)`;

  return (
    <div style={{ position: "absolute", inset: 0, ...cutIn }}>
      <NextVideoHead title="Value Investing" chip="Module" chipAt={cut.at} titleAt={W("Value Investing.") - m.sec(0.1)} light titleTone={c.indigo} />

      {/* the building, from the ground up */}
      {rise > 0.001 ? (
        <Img src={staticFile(PIC.src)} style={{ position: "absolute", left, top, width: PIC.w * s, height: PIC.h * s, clipPath: `inset(${((1 - rise) * 100).toFixed(2)}% 0 0 0)` }} />
      ) : null}

      {/* out of it, the four things the module teaches */}
      {arrow > 0.001 ? (
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={ARROW.x0} y1={ASIDE.cy} x2={ARROW.x0 + (ARROW.x1 - ARROW.x0) * arrow} y2={ASIDE.cy} stroke={theme.color.connector} strokeWidth={4} strokeLinecap="round" />
          {arrow > 0.95 ? <polyline points={`${ARROW.x1 - ARROW.head},${ASIDE.cy - ARROW.head} ${ARROW.x1},${ASIDE.cy} ${ARROW.x1 - ARROW.head},${ASIDE.cy + ARROW.head}`} fill="none" stroke={theme.color.connector} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : null}
        </svg>
      ) : null}
      {LEARN.map((l, i) => {
        const p = ease(f, W(l.at) - m.sec(0.1), m.reveal);
        if (p <= 0.001) return null;
        return (
          <div key={l.icon} style={{ position: "absolute", left: 0, top: 0, opacity: p, transform: lift(p) }}>
            <Card x={CARD.x0 + i * (CARD.w + CARD.gap)} y={ASIDE.cy - CARD.h / 2} w={CARD.w} h={CARD.h} line={theme.color.hairlineBrandSolid} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
              <Disc icon={l.icon} size={96} tone={c.indigo} tint={theme.color.indigoWashSolid} />
              <div style={{ ...typeStyle("label"), fontSize: 27, lineHeight: 1.2, color: c.ink, textAlign: "center", whiteSpace: "pre-line" }}>{l.text}</div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
