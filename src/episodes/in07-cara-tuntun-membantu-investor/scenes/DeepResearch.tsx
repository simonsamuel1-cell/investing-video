/**
 * IN07 · SC04 — "Di sinilah Tuntun Deep Research Report berperan, membantu investor memahami perusahaan melalui
 * penelitian yang lebih menyeluruh." (the line added on 9 Nov). Simon: "Coba masukin 2-3 gambar … Lalu kamu boleh
 * tambahin tambahan visual/elemen yang mendukung. Nanti aku arahin perbaikan."
 *
 * Two stills of the real thing, the first sent on to the second along a line:
 *  1  the stock page's Research tab, "View BBCA Deep Research" marked on "Deep Research"
 *     (INV09's Deep Research.jpg, from the top to just under that card);
 *  2  the report's first page (VI02's Deep Research.jpg, In-Depth Research BBCA, 24 Aug 2026), in on "berperan" — as
 *     wide as the room right of the line allows, its top in view (Simon 9 Nov: "perbesar hingga fit to width dengan
 *     sisa space yang ada di kanannya"; the table of contents and the mark on the company's name came out).
 * Out on "Tim riset", before the five research screens (scenes/ResearchFiles.tsx).
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { Connector, HighlightBox, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, Disc, ease, useWords } from "../components/kit";

/** A still in a window: drawn `w` wide (its own ratio), and `h` of it in view from the top. */
type Shot = { src: string; x: number; y: number; w: number; h: number; /** canvas px per image px */ s: number; ih: number };

const APP_H = 640;
const APP: Shot = { src: "art/in07/app/sc04-deep-research-app.jpg", x: 210, y: 290, w: (980 * APP_H) / 1560, h: APP_H, s: APP_H / 1560, ih: 1560 };
const REPORT_X = 720;
const REPORT_W = theme.canvas.width - theme.margin.right - REPORT_X;
const REPORT: Shot = { src: "art/in07/app/sc04-deep-research-report.jpg", x: REPORT_X, y: 230, w: REPORT_W, h: 720, s: REPORT_W / 1080, ih: 1461 };
/** The "View BBCA Deep Research" card, measured on the PNG, 12 px wider all round (core/HighlightBox: wider than what it marks). */
const HL_APP = { x1: APP.x + 42 * APP.s - 12, y1: APP.y + 1376 * APP.s - 12, x2: APP.x + 937 * APP.s + 12, y2: APP.y + 1521 * APP.s + 12 };
/** The label over the report, on its left edge (Simon 9 Nov: "align-left ke gambar 2"). */
const LABEL = { y: REPORT.y - 76, disc: 52 };
/**
 * The report scrolls up slowly from Studio 10987 to 11199 (Simon 9 Nov) — 7 frames before "memahami" to 21 before
 * "Tim riset" — until the end of its text (row 1210 of the PNG) sits on the window's bottom edge.
 */
const SCROLL = { by: 1210 * REPORT.s - REPORT.h, lead: 7 / 60, stop: 21 / 60 };

const Still = ({ k, at, scroll = 0 }: { k: Shot; at: number; scroll?: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
    <Appear at={at} style={{ left: k.x, top: k.y }}>
      <div style={{ width: k.w, height: k.h, borderRadius: 16, overflow: "hidden", background: c.cardBg, boxShadow: shadow.soft }}>
        <Img src={staticFile(k.src)} style={{ width: k.w, height: k.ih * k.s, display: "block", transform: `translateY(${(-scroll).toFixed(2)}px)` }} />
      </div>
    </Appear>
  );
};

export const DeepResearch = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(4, BLOCK.SC04);

  const inAt = W("Di sinilah");
  const markAt = W("Deep Research");
  const sendAt = W("Report");
  const reportAt = W("berperan,");
  const out = ease(f, W("Tim riset"), m.fade);
  const scrollFrom = W("memahami") - m.sec(SCROLL.lead);
  const scroll = SCROLL.by * ease(f, scrollFrom, W("Tim riset") - m.sec(SCROLL.stop) - scrollFrom);

  if (f < inAt || out >= 0.999) return null;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {/* 1 → 2, the line drawn as the report comes in */}
      <Connector a={{ x: HL_APP.x2 + 6, y: (HL_APP.y1 + HL_APP.y2) / 2 }} b={{ x: REPORT.x - 10, y: REPORT.y + REPORT.h / 2 }} p={ease(f, sendAt, m.sec(0.5))} />

      <Still k={APP} at={inAt + m.sec(0.15)} />
      <HighlightBox rect={HL_APP} grow={ease(f, markAt, m.sec(0.5))} opacity={ease(f, markAt, m.sec(0.1))} fill="none" width={4} radius={20} />

      {/* the name of the thing, over the report */}
      <Appear at={markAt} style={{ left: REPORT.x, top: LABEL.y, width: REPORT.w }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Disc icon="report" size={LABEL.disc} tone={c.indigo} tint={theme.color.indigoWashSolid} ring={c.indigo} />
          <div style={{ ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>Deep Research Report</div>
        </div>
      </Appear>
      <Still k={REPORT} at={reportAt} scroll={scroll} />
    </div>
  );
};
