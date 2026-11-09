/**
 * IN07 · SC04 — "… serta telah mendapatkan pengakuan industri melalui penghargaan dari CNBC Indonesia pada 2025 dan
 * Media Asuransi pada 2024." Simon, 9 Nov: the three folders slide off to the left, "lalu muncul 2 awards tadi yang
 * dikemas dalam design seperti gambar 1 ini. Jadi design gambar 1 bakal ada 2 bersebelahan" — his reference is an
 * award pop-up card (a badge on a soft disc, a bold line, a button, two cards stacked under it).
 *
 * Two such cards side by side, each on its words, CNBC Indonesia first: the award he sent (INV07/Revisi VO/Awards,
 * cut out to public/art/in07/award-*.png) on a pale disc, who gave it, and the year where the button was. No close
 * mark and no body text — they would say nothing. On "Bukan berarti" the camera cuts away from them to the closing
 * lines (components/Folder.tsx `awardsCut`).
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { cutOutStyle, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { ease, useWords } from "../components/kit";
import { MID_Y, awardsCut } from "../components/Folder";

/** Each award: its picture and size (px), its height on the card, its words, who gave it and when. */
const AWARDS = [
  { src: "award-cnbc-2025", iw: 720, ih: 1947, h: 290, at: "CNBC Indonesia", name: "CNBC Indonesia", year: "2025" },
  { src: "award-media-asuransi-2024", iw: 1844, ih: 2000, h: 240, at: "Media Asuransi", name: "Media Asuransi", year: "2024" },
] as const;

/** The card, centred on MID_Y; the two side by side round the canvas's middle; the two under it each `layer` lower. */
const CARD = { w: 460, h: 500, gap: 80, r: 32, layer: 16, inset: 22 };
const TOP = MID_Y - CARD.h / 2;
const cxOf = (i: number) => theme.canvas.width / 2 + (i - 0.5) * (CARD.w + CARD.gap);
/** Inside, from the card's top: the disc and the award standing on its lower part, the name, the year's pill. */
const DISC = { cy: 180, d: 260, foot: 315 };
const NAME_Y = 338;
const PILL = { y: 410, w: 150, h: 56 };

export const Awards = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(4, BLOCK.SC04);

  const cut = awardsCut(W);
  if (f < W(AWARDS[0].at) - m.sec(0.2) || f >= cut.at) return null;
  const cutOut = f >= cut.at - cut.over / 2 ? cutOutStyle(f, cut) : {};

  return (
    <div style={{ position: "absolute", inset: 0, ...cutOut }}>
      {AWARDS.map((a, i) => {
        const at = W(a.at) - m.sec(0.15);
        const p = ease(f, at, m.reveal);
        if (p <= 0.001) return null;
        const pic = ease(f, at + m.sec(0.15), m.reveal);
        const words = ease(f, at + m.sec(0.3), m.reveal);
        const cx = cxOf(i);
        const w = (a.h * a.iw) / a.ih;
        return (
          <div key={a.src} style={{ position: "absolute", inset: 0, opacity: p, transformOrigin: `${cx}px ${MID_Y}px`, transform: `translateY(${((1 - p) * 30).toFixed(2)}px) scale(${(0.94 + 0.06 * p).toFixed(4)})` }}>
            {/* the two cards stacked under it, the farther one deeper in tint */}
            {[2, 1].map((k) => (
              <div key={k} style={{ position: "absolute", left: cx - CARD.w / 2 + k * CARD.inset, top: TOP + k * CARD.layer, width: CARD.w - 2 * k * CARD.inset, height: CARD.h, borderRadius: CARD.r, background: k === 2 ? theme.color.indigoWashStrongSolid : theme.color.indigoWashSolid, boxShadow: shadow.soft }} />
            ))}
            <div style={{ position: "absolute", left: cx - CARD.w / 2, top: TOP, width: CARD.w, height: CARD.h, borderRadius: CARD.r, background: c.cardBg, boxShadow: shadow.soft }}>
              <div style={{ position: "absolute", left: CARD.w / 2 - DISC.d / 2, top: DISC.cy - DISC.d / 2, width: DISC.d, height: DISC.d, borderRadius: 999, background: theme.color.indigoWashSolid }} />
              <Img src={staticFile(`art/in07/${a.src}.png`)} style={{ position: "absolute", left: CARD.w / 2 - w / 2, top: DISC.foot - a.h, width: w, height: a.h, opacity: pic, transformOrigin: "50% 100%", transform: `scale(${(0.88 + 0.12 * pic).toFixed(4)})` }} />
              <div style={{ position: "absolute", left: 0, width: CARD.w, top: NAME_Y + (1 - words) * 10, textAlign: "center", ...typeStyle("title"), fontSize: 38, fontWeight: 600, color: c.ink, opacity: words, whiteSpace: "nowrap" }}>{a.name}</div>
              <div style={{ position: "absolute", left: CARD.w / 2 - PILL.w / 2, top: PILL.y + (1 - words) * 10, width: PILL.w, height: PILL.h, borderRadius: 999, background: c.indigo, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("body"), fontSize: 28, fontWeight: 600, color: c.cardBg, opacity: words }}>{a.year}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
