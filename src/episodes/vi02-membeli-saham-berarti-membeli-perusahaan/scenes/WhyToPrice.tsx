/**
 * VI02 · SC08 — "Dari “Kenapa” ke “Berapa Harganya?”" in VI01's look (Simon 13 Nov: "revamp visual untuk scene 5-8"), from the
 * ChatGPT storyboard docs/vi-style/storyboards/VI02-SC08-v3.png, on the 12 Nov VO. The old scene is scenes/FromWhyToPrice.tsx
 * (VI01_LOOK = false).
 *
 *  A  "Tiga hal yang perlu diingat": three numbered cards, each filling on its sentence: Di balik kode / Buku bisnis > rumor /
 *     10 menit → 10 tahun.
 *  B  "Prinsip ini digunakan oleh investor…" (a cut): Schloss, Munger, Lynch as VI01's line-art portrait tiles (Lynch drawn by
 *     ChatGPT 13 Nov in the same set), each figure as the script gives it; "perusahaan, bukan kode saham" in one line.
 *  C  "Di Tuntun" (a cut): the mascot, the heading and the three features as pills; Simon's screens (5 Nov) on their words.
 *  D  "Dari empat pertanyaan tadi" (a cut): SC07's four questions at the left, each joined to where the app answers it:
 *     1–2 Revenue Composition, 3 the dividend (SC04's screen), 4 Deep Research.
 *  E  "Tapi setelah memahami perusahaannya" (a cut): Perusahaan bagus ✓ beside Harga? — a gauge whose needle swings to Mahal.
 *  F  "Jadi di video selanjutnya" (a cut): the next video's question.
 */
import { Img, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, TuntunMark, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Glyph, Line, Pic, Shot, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const R = theme.shape.cardRadius;

// A — three things to remember
const THREE = { w: 1060, h: 150, gap: 34, y: 230, disc: 72, icon: 52 };
const POINTS = [
  { icons: ["factory", "users-three", "coins"], text: "Di balik kode", at: "Di balik" },
  { icons: ["book-open"], text: "Buku bisnis > rumor", at: "Rumor nggak" },
  { icons: ["clock", "→", "calendar-blank"], text: "10 menit → 10 tahun", at: "sebelum membeli" },
] as const;

// B — three investors (VI01's line-art tiles; the figures are the script's)
const TILE = { d: 300, gap: 90, y: 190 };
const TILE_H = (TILE.d * 423) / 404;
const tileX = (i: number) => CX - (3 * TILE.d + 2 * TILE.gap) / 2 + i * (TILE.d + TILE.gap);
const INVESTORS = [
  { name: "Walter Schloss", src: "art/vi01/schloss.png", pct: "15,3%", years: "45 tahun", at: "Walter Schloss" },
  { name: "Charlie Munger", src: "art/vi01/munger.png", pct: "19,8%", years: "14 tahun", at: "Charlie Munger" },
  { name: "Peter Lynch", src: "art/vi02/lynch.png", pct: "29,2%", years: "13 tahun", at: "Peter Lynch" },
] as const;

// C — the app (Simon's screens, 5 Nov): 1080 × 1700 from y 300, the report's first page to the same shape
const APP = { headX: theme.margin.left, mascot: 84, mascotGap: 22, bob: 3, bobFor: 1.6, y: 190, size: 56, pillX: 506, pillH: 64, pillGap: 22, pillSize: 34, tick: 34, top: 258, gap: 80, ratio: 0.6353 };
const APP_H = theme.captionBand.top - 12 - APP.top;
const APP_W = APP_H * APP.ratio;
const FEATURES = [
  { text: "Revenue Composition", src: "art/vi02/app/sc08-revenue-breakdown.jpg", at: "Revenue Composition", nth: 0 },
  { text: "Profit Chart", src: "art/vi02/app/sc08-perkembangan-laba.jpg", at: "Profit Chart", nth: 0 },
  { text: "Deep Research", src: "art/vi02/app/sc08-deep-research.jpg", at: "Deep Research", nth: 0 },
] as const;

// D — the four questions, and where each is answered
const ASKS = ["Jual apa?", "Uang dari mana?", "Labanya untuk apa?", "Bisa tumbuh?"];
const QCOL = { x: 200, w: 470, h: 104, ys: [270, 400, 560, 720] };
const ANSWER = { x: 1060, w: 620, h: 150, thumb: 120 };
const TARGETS = [
  { text: "Revenue Composition", src: "art/vi02/app/sc08-revenue-breakdown.jpg", y: 335, from: [0, 1], at: "dua pertanyaan" },
  { text: "Dividen", src: "art/vi02/app/sc04-dividend.jpg", y: 560, from: [2], at: "Pertanyaan ketiga" },
  { text: "Deep Research", src: "art/vi02/app/sc08-deep-research.jpg", y: 720, from: [3], at: "Deep Research" },
] as const;

// E — good company, but the price?
const TWO = { w: 640, h: 440, y: 220, gap: 60 };
const twoX = (i: number) => CX - TWO.w - TWO.gap / 2 + i * (TWO.w + TWO.gap);
const GAUGE = { cx: TWO.w / 2, cy: 330, r: 200, band: 34 };

export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(8, BLOCK.SC08);
  const g = f + BLOCK.SC08;

  const peopleAt = W("Prinsip ini");
  const appAt = W("Di Tuntun");
  const mapAt = W("Dari empat");
  const twoAt = W("Tapi setelah");
  const nextAt = W("Jadi di video");

  // E
  const swing = ease(f, W("terlalu mahal"), m.sec(0.8));
  /** the needle's angle, degrees from the +x axis going up: 180 = Murah, 0 = Mahal */
  const needle = (mix(150, 30, swing) * Math.PI) / 180;

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A: three things to remember */}
      <Shot from={-1} to={peopleAt} block={BLOCK.SC08} cutIn={false}>
        {POINTS.map((pt, i) => {
          const p = ease(f, W("Tiga hal") + i * m.sec(0.12), m.reveal);
          const filled = ease(f, W(pt.at), m.reveal);
          const on = ease(f, W(pt.at), m.pop) * (i < 2 ? 1 - ease(f, W(POINTS[i + 1].at), m.pop) : 1);
          const y = THREE.y + i * (THREE.h + THREE.gap);
          return (
            <div key={pt.text} style={{ position: "absolute", left: CX - THREE.w / 2, top: y + (1 - p) * 14, width: THREE.w, height: THREE.h, opacity: p }}>
              <Card x={0} y={0} w={THREE.w} h={THREE.h} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 40px", boxShadow: `${shadow.soft}, inset 0 0 0 ${on > 0.5 ? 3 : 0}px ${c.indigo}` }}>
                <div style={{ width: THREE.disc, height: THREE.disc, borderRadius: 999, flex: "none", background: on > 0.5 ? c.indigo : c.cardBg, boxShadow: `inset 0 0 0 3px ${on > 0.5 ? c.indigo : c.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 38, fontWeight: 600, color: on > 0.5 ? c.cardBg : c.ink }}>{i + 1}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 18, width: 300, flex: "none", opacity: filled }}>
                  {pt.icons.map((ic, k) => (ic === "→" ? <div key={k} style={{ ...typeStyle("title"), fontSize: 44, color: c.ink }}>→</div> : <Glyph key={k} icon={ic} size={THREE.icon} tone={on > 0.5 ? c.indigo : c.ink} />))}
                </div>
                <div style={{ width: 3, height: 80, borderRadius: 2, background: theme.color.skeleton, flex: "none" }} />
                <div style={{ ...typeStyle("title"), fontSize: 50, fontWeight: 600, color: c.ink, whiteSpace: "nowrap", opacity: filled }}>{pt.text}</div>
              </Card>
            </div>
          );
        })}
      </Shot>

      {/* B: three investors, one principle */}
      <Shot from={peopleAt} to={appAt} block={BLOCK.SC08}>
        {INVESTORS.map((iv, i) => {
          const p = ease(f, peopleAt + m.sec(0.2) + i * m.sec(0.15), m.reveal);
          const said = ease(f, W(iv.at), m.reveal);
          const x = tileX(i);
          return (
            <div key={iv.name} style={{ position: "absolute", left: x, top: TILE.y + (1 - p) * 14, width: TILE.d, opacity: p }}>
              <Pic src={staticFile(iv.src)} style={{ position: "absolute", left: 0, top: 0, width: TILE.d, height: TILE_H }} />
              <div style={{ position: "absolute", left: -40, width: TILE.d + 80, top: TILE_H + 22, textAlign: "center", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>{iv.name}</div>
              <div style={{ position: "absolute", left: -40, width: TILE.d + 80, top: TILE_H + 74, textAlign: "center", opacity: said, transform: `translateY(${((1 - said) * 10).toFixed(1)}px)` }}>
                <div style={{ ...typeStyle("title"), fontSize: 64, fontWeight: 600, color: c.indigo, fontVariantNumeric: "tabular-nums" }}>{iv.pct}</div>
                <div style={{ ...typeStyle("label"), fontSize: 30, fontWeight: 500, color: c.slate }}>{iv.years}</div>
              </div>
            </div>
          );
        })}
        <Appear at={W("perusahaan, bukan")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={850} w={theme.canvas.width} align="center" size={56} weight={500} text="Perusahaan, bukan kode saham." mark="Perusahaan" />
        </Appear>
      </Shot>

      {/* C: the app — the heading, a pill per feature, the screens on their words */}
      <Shot from={appAt} to={mapAt} block={BLOCK.SC08}>
        <TuntunMark x={APP.headX + APP.mascot / 2} y={APP.y - APP.mascot / 2 + APP.bob * Math.sin(((f - appAt) / m.sec(APP.bobFor)) * Math.PI * 2)} height={APP.mascot} />
        <Line x={APP.headX + APP.mascot + APP.mascotGap} y={APP.y} w={300} size={APP.size} weight={500} text="Di Tuntun" />
        <div style={{ position: "absolute", left: APP.pillX, top: APP.y - APP.pillH / 2, height: APP.pillH, display: "flex", alignItems: "center", gap: APP.pillGap }}>
          {FEATURES.map((k, i) => {
            const shown = ease(f, appAt + m.sec(0.3) + i * m.sec(0.12), m.reveal);
            const ok = i < 2 ? ease(f, W(k.at, k.nth), m.pop) : 0;
            return (
              <div key={k.text} style={{ height: APP.pillH, display: "flex", alignItems: "center", gap: 10 * ok, padding: "0 26px", borderRadius: 999, background: interpolateColors(ok, [0, 1], [c.cardBg, theme.color.ok]), boxShadow: `${shadow.soft}, inset 0 0 0 2px ${interpolateColors(ok, [0, 1], [theme.color.connector, theme.color.ok])}`, ...typeStyle("label"), fontSize: APP.pillSize, fontWeight: 600, color: interpolateColors(ok, [0, 1], [c.indigo, c.cardBg]), whiteSpace: "nowrap", opacity: shown }}>
                <div style={{ width: APP.tick * ok, height: APP.tick, borderRadius: 999, background: c.cardBg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontSize: 22, fontWeight: 700, color: theme.color.ok, opacity: ok }}>✓</div>
                {k.text}
              </div>
            );
          })}
        </div>
        {FEATURES.slice(0, 2).map((k, i) => {
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
          const on = ease(f, W(t.at), m.pop);
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

      {/* E: a good company — at what price? */}
      <Shot from={twoAt} to={nextAt} block={BLOCK.SC08}>
        {[0, 1].map((i) => {
          const p = ease(f, i === 0 ? twoAt + m.sec(0.2) : W("satu pertanyaan"), m.reveal);
          return p > 0.001 ? (
            <div key={i} style={{ position: "absolute", left: twoX(i), top: TWO.y + (1 - p) * 14, width: TWO.w, height: TWO.h, opacity: p }}>
              <Card x={0} y={0} w={TWO.w} h={TWO.h}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 56, textAlign: "center", ...typeStyle("title"), fontSize: 54, fontWeight: 600, color: c.ink }}>{i === 0 ? "Perusahaan bagus" : "Harga?"}</div>
                {i === 0 ? (
                  <div style={{ position: "absolute", left: TWO.w / 2 - 80, top: 190, width: 160, height: 160, borderRadius: 999, background: theme.color.ok, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: 84, fontWeight: 700, color: c.cardBg, transform: `scale(${(0.8 + 0.2 * ease(f, twoAt + m.sec(0.5), m.pop)).toFixed(3)})` }}>✓</div>
                ) : (
                  <svg width={TWO.w} height={TWO.h} style={{ position: "absolute", left: 0, top: 0 }}>
                    {[0, 1, 2, 3, 4].map((k) => {
                      const a0 = Math.PI + (k / 5) * Math.PI + 0.02;
                      const a1 = Math.PI + ((k + 1) / 5) * Math.PI - 0.02;
                      const pt = (a: number, r: number) => `${(GAUGE.cx + r * Math.cos(a)).toFixed(1)} ${(GAUGE.cy + r * Math.sin(a)).toFixed(1)}`;
                      const ro = GAUGE.r;
                      const ri = GAUGE.r - GAUGE.band;
                      return <path key={k} d={`M ${pt(a0, ro)} A ${ro} ${ro} 0 0 1 ${pt(a1, ro)} L ${pt(a1, ri)} A ${ri} ${ri} 0 0 0 ${pt(a0, ri)} Z`} fill={[theme.color.skeleton, theme.color.neutralDisc, theme.color.hairlineBrandSolid, c.indigo, theme.color.crossRed][k]} />;
                    })}
                    <line x1={GAUGE.cx} y1={GAUGE.cy} x2={GAUGE.cx + (GAUGE.r - 50) * Math.cos(needle)} y2={GAUGE.cy - (GAUGE.r - 50) * Math.sin(needle)} stroke={c.ink} strokeWidth={10} strokeLinecap="round" />
                    <circle cx={GAUGE.cx} cy={GAUGE.cy} r={16} fill={c.ink} />
                    <text x={GAUGE.cx - GAUGE.r + GAUGE.band / 2} y={GAUGE.cy + 56} textAnchor="middle" fontFamily={theme.text.family} fontSize={30} fontWeight={600} fill={c.slate}>Murah</text>
                    <text x={GAUGE.cx + GAUGE.r - GAUGE.band / 2} y={GAUGE.cy + 56} textAnchor="middle" fontFamily={theme.text.family} fontSize={30} fontWeight={600} fill={interpolateColors(swing, [0, 1], [c.slate, theme.color.crossRed])}>Mahal</text>
                  </svg>
                )}
              </Card>
            </div>
          ) : null;
        })}
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
