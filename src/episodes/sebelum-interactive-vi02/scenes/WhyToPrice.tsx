/**
 * VI02 · SC08 — "Dari “Kenapa” ke “Berapa Harganya?”" in VI01's look (Simon 13 Nov: "revamp visual untuk scene 5-8"), from the
 * ChatGPT storyboard docs/vi-style/storyboards/VI02-SC08-v3.png, on the 12 Nov VO. The old scene is scenes/FromWhyToPrice.tsx
 * (VI01_LOOK = false).
 *
 *  A  "Tiga hal yang perlu diingat": "3 hal yang perlu diingat" over three numbered cards, each filling on its sentence with
 *     a small picture recalling its scene and one plain sentence (Simon 16 Nov: no icon strings, no abbreviations).
 *  B  "Prinsip ini digunakan oleh investor…" (a cut): a title, Simon's picture of Schloss, Buffett and Lynch whole (16 Nov,
 *     "3 figures.png"), each name and figure (the script's) under its man; on "Investor seperti" the picture slides left and
 *     Templeton and Nick Sleep come in at its right, each on his name (25 Nov), then a line under their names with "Beda gaya
 *     investasi" and "Beda beli perusahaan" on those sentences; "Yang dibeli tetap perusahaan, bukan kode saham".
 *  C  "Di Tuntun" (a cut): the mascot, the heading and the three features as pills; Simon's screens (5 Nov) on their words.
 *  D  "Dari empat pertanyaan tadi" (a cut): SC07's four questions at the left, each joined to where the app answers it:
 *     1–2 Revenue Composition, 3 the dividend (SC04's screen), 4 Deep Research.
 *  E  "Tapi setelah memahami perusahaannya" (a cut; Simon 16 Nov: not the two static cards, not a scale — Tuntun's own UI):
 *     "Perusahaan bagus" ✓ with SC01's factory on top; "satu pertanyaan": Tuntun's Company Quality / Reference Fair Value /
 *     Bullish Signals card under it; Company Quality boxed on "perusahaan bagus", then on "membayar terlalu mahal" Fair Value
 *     boxed in red, its pointer into the red, "Terlalu mahal" on it; "Perusahaan bagus belum tentu investasi bagus" under all.
 *  F  "Jadi di video selanjutnya" (a cut): the next video's question.
 */
import { Img, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { Connector, HighlightBox, SoftGround, Stage, TuntunMark, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, DashBox, Drawing, Glyph, Line, Pic, Shot, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const R = theme.shape.cardRadius;

// A — three things to remember (Simon 16 Nov: the icon list was "terlalu maksa"; storyboard VI02-SC08-opening-v4): three cards,
// each a small picture recalling its scene and one plain sentence
const THREE = { w: 500, h: 590, gap: 50, y: 272, disc: 76, headY: 172, headSize: 56, textY: 440, textSize: 36 };
const threeX = (i: number) => CX - (3 * THREE.w + 2 * THREE.gap) / 2 + i * (THREE.w + THREE.gap);
const POINTS = [
  { text: "Di balik kode saham, ada bisnis nyata.", at: "Di balik" },
  { text: "Rumor ga berguna bagi yang paham buku bisnisnya", at: "Bagi orang" },
  { text: "Sebelum beli untuk 10 menit, pikirkan bisnisnya 10 tahun.", at: "sebelum membeli" },
] as const;
const MINI_BOOK = { x: 118, y: 92, w: 264, rowH: 62, gap: 12, head: 64 };
/** the two rumours bouncing off the book, inside the card: their centres, width, height and how far they spring back */
const RUMOUR = { w: 88, h: 54, xs: [64, 436], ys: [150, 300], bounce: 14 };

// B — three investors (VI01's line-art tiles; the figures are the script's)
/** Simon's picture whole, one image (16 Nov: "ini 1 gambar, jangan di crop"; 25 Nov: Buffett in Munger's place, as the script says), each name and figure under its man */
const GROUP = { w: 1140, y: 232, src: "art/vi02/three-figures-buffett.jpg", w0: 2172, h0: 724, cxs: [360, 1080, 1768], name: 26, pct: 78, line: 892, boxW: 1240, boxH: 112 };
const GROUP_K = GROUP.w / GROUP.w0;
const GROUP_H = GROUP.h0 * GROUP_K;
const GROUP_X = CX - GROUP.w / 2;
/**
 * "Investor seperti John Templeton dan Nick Sleep" (Simon 25 Nov: "gambar 3 digeser ke kiri, lalu muncul gambar 1 dan gambar 2"):
 * the picture goes to the left margin at `h`, its top staying where it is, and his two squares whole at its right fill the
 * row to the right margin. No figures: the script gives none.
 */
const ROW = { x: theme.margin.left, h: 336, gap: 24, at: "Investor seperti", sec: 0.75 };
const ROW_K = ROW.h / GROUP_H;
const ROW_Y = GROUP.y;
const ROW_X = (i: number) => ROW.x + GROUP.w * ROW_K + ROW.gap + i * (ROW.h + ROW.gap);
const MORE = [
  { name: "John Templeton", src: "art/vi02/john-templeton.jpg", at: "John Templeton" },
  { name: "Nick Sleep", src: "art/vi02/nick-sleep.jpg", at: "Nick Sleep" },
] as const;
/**
 * "Gaya investasi mereka berbeda. Perusahaan yang mereka beli juga berbeda" (Simon 25 Nov, his drawing): an indigo line of 3 px
 * under the two names, from the left of "John Templeton" to the right of "Nick Sleep", its ends meeting in the middle; under it
 * one line per sentence. `h` = the line's depth, `ys` = the texts' centres.
 */
const DIFF = { x1: 1172, x2: 1746, y: 654, h: 46, r: 34, stroke: 3, sec: 0.6, size: 32, at: "Gaya investasi" };
const DIFF_W = DIFF.x2 - DIFF.x1;
/** half the line: down from one end, round the corner, to the middle */
const DIFF_HALF = (side: 1 | -1) => `M ${(side * DIFF_W) / 2} 0 V ${DIFF.h - DIFF.r} Q ${(side * DIFF_W) / 2} ${DIFF.h} ${side * (DIFF_W / 2 - DIFF.r)} ${DIFF.h} H 0`;
const DIFFS = [
  { text: "Beda gaya investasi", y: 736, at: "Gaya investasi", wait: 0.45 },
  { text: "Beda beli perusahaan", y: 778, at: "Perusahaan yang mereka", wait: 0 },
] as const;
/** the title over the three (Simon 16 Nov: "kasih judul"), from "Prinsip ini digunakan oleh investor dari generasi yang berbeda" */
const PEOPLE_HEAD = { y: 172, size: 56, text: "Prinsip yang sama, generasi berbeda" };
/**
 * Their photos (Simon 16 Nov: "coba apply foto2 walter schloss, charlie munger, dan peter lynch"): Schloss's from VI01 (11 Nov),
 * Munger's and Lynch's from his VIDEO 04 folder (Scene 2 - Figur-figur). Theirs are low-key studio portraits whose black suits
 * melt into a black background, so they can't be cut out; all three sit on that same black, head and shoulders, heads alike
 * (VI01's PhotoTile framing: `head` = its centre, top and width in the picture's own pixels).
 */
const INVESTORS = [
  { name: "Walter Schloss", pct: "15,3%", years: "45 tahun", at: "Walter Schloss" },
  { name: "Warren Buffett", pct: "19,7%", years: "60+ tahun", at: "Warren Buffett" },
  { name: "Peter Lynch", pct: "29,2%", years: "13 tahun", at: "Peter Lynch" },
] as const;

// C — the app (Simon's screens, 5 Nov): 1080 × 1700 from y 300, the report's first page to the same shape
const APP = { headX: theme.margin.left, mascot: 84, mascotGap: 22, bob: 3, bobFor: 1.6, y: 190, size: 56, pillX: 506, pillH: 64, pillGap: 22, pillSize: 34, tick: 34, top: 258, gap: 80, ratio: 0.6353 };
const APP_H = theme.captionBand.top - 12 - APP.top;
const APP_W = APP_H * APP.ratio;
const FEATURES = [
  { text: "Revenue Composition", src: "art/vi02/app/sc08-revenue-breakdown.jpg", at: "Revenue Breakdown", nth: 0 },
  { text: "Profit Chart", src: "art/vi02/app/sc08-perkembangan-laba.jpg", at: "Profitability Chart", nth: 0 },
] as const; // Deep Research is not said in this shot, so it has no pill here (Simon 16 Nov); it comes in D

// D — the four questions, and where each is answered
const ASKS = ["Jual apa?", "Uang dari mana?", "Labanya untuk apa?", "Bisa tumbuh?"];
const QCOL = { x: 200, w: 470, h: 104, ys: [270, 400, 560, 720] };
const ANSWER = { x: 1060, w: 620, h: 150, thumb: 120 };
const TARGETS = [
  { text: "Revenue Composition", src: "art/vi02/app/sc08-revenue-breakdown.jpg", y: 335, from: [0, 1], at: "bisa mulai dipahami" },
  { text: "Dividen", src: "art/vi02/app/sc04-dividend.jpg", y: 560, from: [2], at: "berapa besar dividen" },
  { text: "Deep Research", src: "art/vi02/app/sc08-deep-research.jpg", y: 720, from: [3], at: "Deep Research", askAt: "pertanyaan keempat" },
] as const;

// E — good company, but the price?
/**
 * E (Simon 16 Nov: "pake UI Tuntun yang menunjukkan Company Quality, Reference Fair Value, dan Bullish Signals … di atasnya
 * gambar pabrik tadi"): the good-company card with SC01's factory on top; under it Tuntun's own card (IN07's BUMI screenshot,
 * public/art/in07/app/BUMI-kartu.png, its gauge pointer painted out so it can be redrawn and moved — data/bumi-card.ts
 * there). Company Quality boxed on "perusahaan bagus"; on "kalau kita membayar terlalu mahal" Fair Value boxed and its pointer
 * slides into the red, the "Undervalued" line covered (it would contradict the pointer, as in IN07); Bullish Signals greyed.
 */
const GOOD = { w: 860, h: 190, y: 136 };
const BUMI = {
  src: "art/in07/app/BUMI-kartu.png",
  w: 2160,
  card: { x: 93, y: 93, w: 1974, h: 608 },
  radius: 54,
  signals: { x0: 1484, x1: 2063, y0: 96, y1: 532 },
  cq: { x1: 130, y1: 154, x2: 617, y2: 469 },
  fv: { x1: 734, y1: 154, x2: 1425, y2: 471 },
  gauge: { x0: 737, x1: 1423, y: 382, at: (835 - 737) / (1423 - 737), red: 0.88 },
  pointer: { w: 23, h: 16, k: 1.5 },
  fvNote: { x1: 800, y1: 426, x2: 1360, y2: 488 },
} as const;
const UI = { w: 1240, y: 400 };
const UI_K = UI.w / BUMI.card.w;
const UI_H = BUMI.card.h * UI_K;
const UI_X = CX - UI.w / 2;
/** a rectangle of the card's pixels on the canvas, padded */
const onUI = (r: { x1: number; y1: number; x2: number; y2: number }, pad = 14) => ({ x1: UI_X + (r.x1 - BUMI.card.x) * UI_K - pad, y1: UI.y + (r.y1 - BUMI.card.y) * UI_K - pad, x2: UI_X + (r.x2 - BUMI.card.x) * UI_K + pad, y2: UI.y + (r.y2 - BUMI.card.y) * UI_K + pad });
const VERDICT_Y = 880;


export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(8, BLOCK.SC08);
  const g = f + BLOCK.SC08;

  const peopleAt = W("Prinsip yang");
  const slide = ease(f, W(ROW.at), m.sec(ROW.sec));
  const diffP = ease(f, W(DIFF.at), m.sec(DIFF.sec));
  const appAt = W("Di Tuntun");
  const mapAt = W("Pertanyaan ketiga");
  const twoAt = W("Namun, setelah");
  const nextAt = W("Karena itu");

  // E
  const uiAt = W("satu pertanyaan");
  const cqOn = ease(f, W("Perusahaan yang bagus"), m.reveal);
  const fvOn = ease(f, W("kalau kita"), m.reveal);
  const toRed = ease(f, W("kalau kita") + m.sec(0.15), m.sec(0.9));
  const pointerAt = BUMI.gauge.at + (BUMI.gauge.red - BUMI.gauge.at) * toRed;

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A: three things to remember — each card a picture from its scene and one sentence */}
      <Shot from={-1} to={peopleAt} block={BLOCK.SC08} cutIn={false}>
        <Appear at={W("Ada tiga hal")} style={{ left: 0, top: THREE.headY, width: theme.canvas.width, textAlign: "center" }}>
          <div style={{ transform: "translateY(-50%)", ...typeStyle("title"), fontSize: THREE.headSize, fontWeight: 600, color: c.ink }}>3 hal yang perlu diingat</div>
        </Appear>
        {POINTS.map((pt, i) => {
          const p = ease(f, W("Ada tiga hal") + m.sec(0.2) + i * m.sec(0.12), m.reveal);
          const filled = ease(f, W(pt.at), m.reveal);
          const on = ease(f, W(pt.at), m.pop) * (i < 2 ? 1 - ease(f, W(POINTS[i + 1].at), m.pop) : 1);
          return (
            <div key={pt.text} style={{ position: "absolute", left: threeX(i), top: THREE.y + (1 - p) * 14, width: THREE.w, height: THREE.h, opacity: p }}>
              <Card x={0} y={0} w={THREE.w} h={THREE.h} style={{ boxShadow: `${on > 0.5 ? shadow.glow : shadow.soft}, inset 0 0 0 ${on > 0.5 ? 4 : 2}px ${on > 0.5 ? c.indigo : theme.color.skeleton}` }}>
                <div style={{ position: "absolute", left: THREE.w / 2 - THREE.disc / 2, top: -THREE.disc / 2, width: THREE.disc, height: THREE.disc, borderRadius: 999, background: on > 0.5 ? c.indigo : c.cardBg, boxShadow: `inset 0 0 0 3px ${on > 0.5 ? c.indigo : c.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 40, fontWeight: 600, color: on > 0.5 ? c.cardBg : c.ink }}>{i + 1}</div>
                <div style={{ position: "absolute", inset: 0, opacity: filled }}>
                  {i === 0 ? (
                    <>
                      {/* SC01: a code, and the business behind it */}
                      <svg width={THREE.w} height={THREE.h} style={{ position: "absolute", left: 0, top: 0 }}>
                        <path d={`M ${THREE.w / 2} 142 L ${THREE.w / 2} 186 M 145 214 L 145 198 Q 145 186 157 186 L 348 186 Q 360 186 360 198 L 360 268`} fill="none" stroke={c.ink} strokeWidth={3} strokeLinecap="round" />
                      </svg>
                      <div style={{ position: "absolute", left: THREE.w / 2, top: 110, transform: "translate(-50%, -50%)", padding: "8px 30px", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 3px ${c.ink}`, fontFamily: theme.text.family, fontSize: 40, fontWeight: 700, letterSpacing: 1, color: c.indigo }}>ABCD</div>
                      <Drawing name="factory" cx={145} floor={380} h={160} />
                      <Drawing name="shops" cx={360} floor={380} h={104} />
                    </>
                  ) : null}
                  {i === 1 ? (
                    <>
                      {/* SC05: the business book, the rumours bouncing off it */}
                      <div style={{ position: "absolute", left: MINI_BOOK.x, top: MINI_BOOK.y, width: MINI_BOOK.w, height: MINI_BOOK.head + 3 * MINI_BOOK.rowH + 2 * MINI_BOOK.gap + 22, borderRadius: 20, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 3px ${c.ink}` }}>
                        <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", ...typeStyle("title"), fontSize: 30, fontWeight: 600, color: c.ink }}>Buku bisnis</div>
                        {["package", "coins", "chart-line-up"].map((ic, k) => (
                          <div key={ic} style={{ position: "absolute", left: 18, right: 18, top: MINI_BOOK.head + k * (MINI_BOOK.rowH + MINI_BOOK.gap), height: MINI_BOOK.rowH, borderRadius: 14, boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`, display: "flex", alignItems: "center", gap: 16, padding: "0 14px" }}>
                            <div style={{ width: 40, height: 40, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                              <Glyph icon={ic} size={24} tone={theme.color.neutralIcon} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <div style={{ width: 130, height: 9, borderRadius: 5, background: c.indigo }} />
                              <div style={{ width: 86, height: 9, borderRadius: 5, background: theme.color.skeleton }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      {[
                        { x: RUMOUR.xs[0], y: RUMOUR.ys[0], side: -1, phase: 0 },
                        { x: RUMOUR.xs[1], y: RUMOUR.ys[1], side: 1, phase: 0.5 },
                      ].map((b, k) => {
                        const bounce = Math.abs(Math.sin(((f - W(pt.at)) / m.sec(1.1) + b.phase) * Math.PI));
                        const x = b.x + b.side * RUMOUR.bounce * bounce;
                        return (
                          <div key={k} style={{ position: "absolute", left: x - RUMOUR.w / 2, top: b.y - RUMOUR.h / 2, width: RUMOUR.w, height: RUMOUR.h, borderRadius: b.side < 0 ? "20px 20px 20px 6px" : "20px 20px 6px 20px", background: theme.color.neutralDisc, boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            {[0, 1, 2].map((d) => <div key={d} style={{ width: 9, height: 9, borderRadius: 999, background: theme.color.mute }} />)}
                          </div>
                        );
                      })}
                    </>
                  ) : null}
                  {i === 2 ? (
                    <>
                      {/* SC06: the factory, ten years on */}
                      <Drawing name="factory" cx={THREE.w / 2} floor={318} h={210} />
                      <div style={{ position: "absolute", left: THREE.w / 2, top: 362, transform: "translate(-50%, -50%)", padding: "6px 24px", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, ...typeStyle("label"), fontSize: 28, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>10 tahun ke depan</div>
                    </>
                  ) : null}
                  <div style={{ position: "absolute", left: 36, right: 36, top: THREE.textY, textAlign: "center", ...typeStyle("title"), fontSize: THREE.textSize, fontWeight: 600, lineHeight: 1.25, color: c.ink, textWrap: "balance" }}>{pt.text}</div>
                </div>
              </Card>
            </div>
          );
        })}
      </Shot>

      {/* B: three investors, one principle */}
      <Shot from={peopleAt} to={appAt} block={BLOCK.SC08}>
        <Appear at={peopleAt + m.sec(0.1)} style={{ left: 0, top: PEOPLE_HEAD.y, width: theme.canvas.width, textAlign: "center" }}>
          <div style={{ transform: "translateY(-50%)", ...typeStyle("title"), fontSize: PEOPLE_HEAD.size, fontWeight: 600, color: c.ink }}>{PEOPLE_HEAD.text}</div>
        </Appear>
        <div style={{ position: "absolute", left: GROUP_X, top: GROUP.y, width: GROUP.w, height: GROUP_H, transformOrigin: "0px 0px", translate: `${(ROW.x - GROUP_X) * slide}px ${(ROW_Y - GROUP.y) * slide}px`, scale: String(1 + (ROW_K - 1) * slide) }}>
          <Appear at={peopleAt + m.sec(0.2)} style={{ left: 0, top: 0, width: GROUP.w, height: GROUP_H }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: R, overflow: "hidden", boxShadow: shadow.soft, background: c.ink }}>
              <Pic src={staticFile(GROUP.src)} style={{ position: "absolute", left: 0, top: 0, width: GROUP.w, height: GROUP_H }} />
            </div>
          </Appear>
        </div>
        {INVESTORS.map((iv, i) => {
          const p = ease(f, peopleAt + m.sec(0.35) + i * m.sec(0.15), m.reveal);
          const said = ease(f, W(iv.at), m.reveal);
          const x0 = GROUP_X + GROUP.cxs[i] * GROUP_K;
          const x = x0 + (ROW.x + GROUP.cxs[i] * GROUP_K * ROW_K - x0) * slide;
          const top = GROUP.y + GROUP_H + (ROW_Y + ROW.h - GROUP.y - GROUP_H) * slide;
          return (
            <div key={iv.name} style={{ position: "absolute", left: x - 200, width: 400, top, textAlign: "center" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: GROUP.name, opacity: p, ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>{iv.name}</div>
              <div style={{ position: "absolute", left: 0, right: 0, top: GROUP.pct, opacity: said, transform: `translateY(${((1 - said) * 10).toFixed(1)}px)` }}>
                <div style={{ ...typeStyle("title"), fontSize: 64, fontWeight: 600, lineHeight: 1.05, color: c.indigo, fontVariantNumeric: "tabular-nums" }}>{iv.pct}</div>
                <div style={{ fontFamily: theme.text.mono, fontSize: 28, fontWeight: 500, letterSpacing: 0, color: c.indigo }}>{iv.years}</div>
              </div>
            </div>
          );
        })}
        {MORE.map((iv, i) => {
          const p = ease(f, W(iv.at), m.reveal);
          return (
            <div key={iv.name} style={{ position: "absolute", left: ROW_X(i), top: ROW_Y, width: ROW.h, height: ROW.h, opacity: p, translate: `${((1 - p) * 40).toFixed(2)}px 0px` }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: R * ROW_K, overflow: "hidden", boxShadow: shadow.soft, background: c.ink }}>
                <Pic src={staticFile(iv.src)} style={{ position: "absolute", left: 0, top: 0, width: ROW.h, height: ROW.h }} />
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: ROW.h + GROUP.name, textAlign: "center", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>{iv.name}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: DIFF.x1, top: DIFF.y, width: DIFF_W, height: DIFF.h }}>
          {diffP > 0.001 ? (
            <svg width={DIFF_W} height={DIFF.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <g transform={`translate(${DIFF_W / 2} 0)`} fill="none" stroke={c.indigo} strokeWidth={DIFF.stroke} strokeLinecap="round">
                <path d={DIFF_HALF(-1)} pathLength={1} strokeDasharray="1 2" strokeDashoffset={1 - diffP} />
                <path d={DIFF_HALF(1)} pathLength={1} strokeDasharray="1 2" strokeDashoffset={1 - diffP} />
              </g>
            </svg>
          ) : null}
        </div>
        {DIFFS.map((d) => (
          <Appear key={d.text} at={W(d.at) + m.sec(d.wait)} style={{ left: DIFF.x1, top: d.y, width: DIFF_W, textAlign: "center" }}>
            <div style={{ transform: "translateY(-50%)", ...typeStyle("label"), fontSize: DIFF.size, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>{d.text}</div>
          </Appear>
        ))}
        {/* in the dashed text box (Simon 16 Nov: "kasih text box garis putus putus") */}
        <DashBox cx={CX} y={GROUP.line - GROUP.boxH / 2} w={GROUP.boxW} h={GROUP.boxH} at={W("Sebuah bisnis")}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 50, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>
            <span>
              Yang dibeli tetap <span style={{ color: c.indigo }}>perusahaan</span>, bukan kode saham
            </span>
          </div>
        </DashBox>
      </Shot>

      {/* C: the app — the heading, a pill per feature, the screens on their words */}
      <Shot from={appAt} to={mapAt} block={BLOCK.SC08}>
        <TuntunMark x={APP.headX + APP.mascot / 2} y={APP.y - APP.mascot / 2 + APP.bob * Math.sin(((f - appAt) / m.sec(APP.bobFor)) * Math.PI * 2)} height={APP.mascot} />
        <Line x={APP.headX + APP.mascot + APP.mascotGap} y={APP.y} w={300} size={APP.size} weight={500} text="Di Tuntun" />
        <div style={{ position: "absolute", left: APP.pillX, top: APP.y - APP.pillH / 2, height: APP.pillH, display: "flex", alignItems: "center", gap: APP.pillGap }}>
          {FEATURES.map((k, i) => {
            const shown = ease(f, appAt + m.sec(0.3) + i * m.sec(0.12), m.reveal);
            const ok = ease(f, W(k.at, k.nth), m.pop);
            return (
              <div key={k.text} style={{ height: APP.pillH, display: "flex", alignItems: "center", gap: 10 * ok, padding: "0 26px", borderRadius: 999, background: interpolateColors(ok, [0, 1], [c.cardBg, theme.color.ok]), boxShadow: `${shadow.soft}, inset 0 0 0 2px ${interpolateColors(ok, [0, 1], [theme.color.connector, theme.color.ok])}`, ...typeStyle("label"), fontSize: APP.pillSize, fontWeight: 600, color: interpolateColors(ok, [0, 1], [c.indigo, c.cardBg]), whiteSpace: "nowrap", opacity: shown }}>
                <div style={{ width: APP.tick * ok, height: APP.tick, borderRadius: 999, background: c.cardBg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontSize: 22, fontWeight: 700, color: theme.color.ok, opacity: ok }}>✓</div>
                {k.text}
              </div>
            );
          })}
        </div>
        {FEATURES.map((k, i) => {
          const p = ease(f, W(k.at, k.nth), m.reveal);
          if (p <= 0.001) return null;
          const rowW = 2 * APP_W + APP.gap;
          return (
            <div key={k.src} style={{ position: "absolute", left: CX - rowW / 2 + i * (APP_W + APP.gap), top: APP.top + (1 - p) * 24, width: APP_W, height: APP_H, borderRadius: R, overflow: "hidden", background: c.cardBg, boxShadow: shadow.soft, opacity: p }}>
              <Img src={staticFile(k.src)} style={{ width: APP_W, height: APP_H, display: "block", maxWidth: "none" }} />
            </div>
          );
        })}
      </Shot>

      {/* D: the four questions, and where the app answers each */}
      <Shot from={mapAt} to={twoAt} block={BLOCK.SC08}>
        {ASKS.map((a, i) => {
          const p = ease(f, mapAt + m.sec(0.2) + i * m.sec(0.1), m.reveal);
          const t = TARGETS.find((k) => (k.from as readonly number[]).includes(i))!;
          const on = ease(f, W("askAt" in t ? t.askAt : t.at), m.pop);
          return (
            <div key={a} style={{ position: "absolute", left: QCOL.x, top: QCOL.ys[i] - QCOL.h / 2 + (1 - p) * 12, width: QCOL.w, height: QCOL.h, opacity: p }}>
              <Card x={0} y={0} w={QCOL.w} h={QCOL.h} style={{ display: "flex", alignItems: "center", gap: 20, padding: "0 22px", boxShadow: `${shadow.soft}, inset 0 0 0 ${on > 0.5 ? 3 : 0}px ${c.indigo}` }}>
                <div style={{ width: 60, height: 60, borderRadius: 999, flex: "none", background: on > 0.5 ? c.indigo : c.cardBg, boxShadow: `inset 0 0 0 3px ${on > 0.5 ? c.indigo : c.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 32, fontWeight: 600, color: on > 0.5 ? c.cardBg : c.ink }}>{i + 1}</div>
                <div style={{ ...typeStyle("label"), fontSize: 36, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{a}</div>
              </Card>
            </div>
          );
        })}
        {TARGETS.map((t) => {
          const at = W(t.at);
          const p = ease(f, at, m.reveal);
          return (
            <div key={t.text} style={{ position: "absolute", inset: 0 }}>
              {t.from.map((q) => (
                <Connector key={q} a={{ x: QCOL.x + QCOL.w + 8, y: QCOL.ys[q] }} b={{ x: ANSWER.x - 10, y: t.y }} p={ease(f, at, m.sec(0.5))} shape="elbow" width={3} />
              ))}
              {p > 0.001 ? (
                <div style={{ position: "absolute", left: ANSWER.x, top: t.y - ANSWER.h / 2 + (1 - p) * 12, width: ANSWER.w, height: ANSWER.h, opacity: p }}>
                  <Card x={0} y={0} w={ANSWER.w} h={ANSWER.h} style={{ display: "flex", alignItems: "center", gap: 28, padding: "0 16px", overflow: "hidden" }}>
                    <div style={{ width: ANSWER.thumb, height: ANSWER.h - 32, borderRadius: 14, overflow: "hidden", flex: "none", boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}` }}>
                      <Img src={staticFile(t.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%", display: "block", maxWidth: "none" }} />
                    </div>
                    <div style={{ ...typeStyle("title"), fontSize: 40, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>{t.text}</div>
                  </Card>
                </div>
              ) : null}
            </div>
          );
        })}
      </Shot>

      {/* E: a good company — at what price? Tuntun's own card says both */}
      <Shot from={twoAt} to={nextAt} block={BLOCK.SC08}>
        <Appear at={twoAt} style={{ left: CX - GOOD.w / 2, top: GOOD.y, width: GOOD.w, height: GOOD.h }}>
          <Card x={0} y={0} w={GOOD.w} h={GOOD.h} style={{ display: "flex", alignItems: "center", gap: 34, padding: "0 46px" }}>
            <div style={{ position: "relative", width: 170, height: 150, flex: "none" }}>
              <Drawing name="factory" cx={85} floor={150} h={150} />
            </div>
            <div style={{ ...typeStyle("title"), fontSize: 50, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Perusahaan bagus</div>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: theme.color.ok, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontWeight: 700, fontSize: 36, color: c.cardBg, flex: "none", transform: `scale(${(0.7 + 0.3 * ease(f, twoAt + m.sec(0.4), m.pop)).toFixed(3)})` }}>✓</div>
          </Card>
        </Appear>
        <Appear at={uiAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <div style={{ position: "absolute", left: UI_X, top: UI.y, width: UI.w, height: UI_H, borderRadius: BUMI.radius * UI_K, overflow: "hidden", boxShadow: shadow.soft }}>
            <Img src={staticFile(BUMI.src)} style={{ position: "absolute", left: -BUMI.card.x * UI_K, top: -BUMI.card.y * UI_K, width: BUMI.w * UI_K, maxWidth: "none" }} />
            {/* Bullish Signals greyed: the two that matter here are the other two */}
            <div style={{ position: "absolute", left: (BUMI.signals.x0 - BUMI.card.x) * UI_K, top: (BUMI.signals.y0 - BUMI.card.y) * UI_K, width: (BUMI.signals.x1 - BUMI.signals.x0) * UI_K, height: (BUMI.signals.y1 - BUMI.signals.y0) * UI_K, overflow: "hidden" }}>
              <Img src={staticFile(BUMI.src)} style={{ position: "absolute", left: -BUMI.signals.x0 * UI_K, top: -BUMI.signals.y0 * UI_K, width: BUMI.w * UI_K, maxWidth: "none", filter: "grayscale(1)" }} />
            </div>
            {/* the "Undervalued" line, covered once the pointer heads into the red */}
            <div style={{ position: "absolute", left: (BUMI.fvNote.x1 - BUMI.card.x) * UI_K, top: (BUMI.fvNote.y1 - BUMI.card.y) * UI_K, width: (BUMI.fvNote.x2 - BUMI.fvNote.x1) * UI_K, height: (BUMI.fvNote.y2 - BUMI.fvNote.y1) * UI_K, background: c.cardBg, opacity: ease(f, W("kalau kita"), m.sec(0.3)) }} />
          </div>
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            {(() => {
              const x = UI_X + (BUMI.gauge.x0 + (BUMI.gauge.x1 - BUMI.gauge.x0) * pointerAt - BUMI.card.x) * UI_K;
              const y = UI.y + (BUMI.gauge.y - BUMI.card.y) * UI_K;
              const w = BUMI.pointer.w * UI_K * BUMI.pointer.k;
              const h = BUMI.pointer.h * UI_K * BUMI.pointer.k;
              return <path d={`M ${x} ${y} L ${x + w / 2} ${y + h} L ${x - w / 2} ${y + h} Z`} fill={c.ink} stroke={c.ink} strokeWidth={2} strokeLinejoin="round" />;
            })()}
            <HighlightBox rect={onUI(BUMI.cq)} grow={cqOn} opacity={cqOn} fill="none" width={4} radius={18} />
            <HighlightBox rect={onUI(BUMI.fv)} grow={fvOn} opacity={fvOn} fill="none" width={4} radius={18} stroke={theme.color.crossRed} />
          </svg>
          <Appear at={W("terlalu mahal")} style={{ left: 0, top: 0 }}>
            <div style={{ position: "absolute", left: (onUI(BUMI.fv).x1 + onUI(BUMI.fv).x2) / 2, top: UI.y - 34, transform: "translate(-50%, -50%)", padding: "8px 26px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 3px ${theme.color.crossRed}`, ...typeStyle("label"), fontSize: 32, fontWeight: 600, color: theme.color.crossRed, whiteSpace: "nowrap" }}>Terlalu mahal</div>
          </Appear>
        </Appear>
        <Appear at={W("Perusahaan yang bagus")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={VERDICT_Y} w={theme.canvas.width} align="center" size={48} weight={500} text="Perusahaan bagus belum tentu investasi bagus" mark="belum tentu" />
        </Appear>
      </Shot>

      {/* F: the next video's question */}
      <Shot from={nextAt} to={1e6} block={BLOCK.SC08} cutOut={false}>
        <Appear at={nextAt + m.sec(0.15)} style={{ left: 0, top: 250, width: theme.canvas.width, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 34px 12px 16px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}` }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background: c.indigo, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={22} height={24} viewBox="0 0 22 24"><path d="M 3 2 L 20 12 L 3 22 Z" fill={c.cardBg} stroke={c.cardBg} strokeWidth={3} strokeLinejoin="round" /></svg>
            </div>
            <div style={{ ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>Video selanjutnya</div>
          </div>
        </Appear>
        <Appear at={W("berapa harga")} style={{ left: CX - 640, top: 380, width: 1280 }}>
          <Card x={0} y={0} w={1280} h={300} style={{ display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `${shadow.soft}, inset 0 0 0 4px ${c.indigo}` }}>
            <div style={{ ...typeStyle("title"), fontSize: 96, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>
              Berapa harga yang <span style={{ color: c.indigo }}>layak</span>?
            </div>
          </Card>
        </Appear>
      </Shot>
    </Stage>
  );
};
