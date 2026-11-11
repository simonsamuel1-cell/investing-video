/**
 * VI01 · SC07 — "Enam Penurunan Besar", rebuilt in IN07's look with SC02's chart (Simon 11 Nov: "Skalian ubah scene
 * selanjutnya ya, scene 5-akhir … Kalau mau nunjukkin chart, samain kayak di scene 2") from the ChatGPT storyboard
 * docs/vi-style/storyboards/VI01-SC07-v2.png, on REAL data: IHSG closes 2006–2026 (data/ihsg-20y.ts, Yahoo Finance).
 *
 *  A  (Simon 11 Nov: "ganti visual jadi yang lebih ber-value") the chart on top and, under it, a table of the six drops — how
 *     far each fell from its peak (the highest close in the year before the low) and how many months from the low until a
 *     close at that peak again (2026: not yet), all computed from the same closes. The line draws across twenty years; the six drops, each ringed at its lowest close as the VO names its
 *     year; "market yang kemudian kembali": from each low the climb back to where the drop began, thicker (2026 has not
 *     come back, so it has none); "setiap kali ada investor yang menjual": a grey person at every low — no sell marker
 *     (the compliance line: no buy/sell markers anywhere).
 *  B  a camera cut to 2026 alone: the trading halt on 28 Jan (8.320,56 after 8.980,23: −7,3 % that day) and 8 Jun's close of
 *     5.342 (−41,5 % from the year's peak close, 9.134,70 on 20 Jan).
 *  C  Orang Tuntun: bear market — the test, and one of the best classes.
 */
import { useCurrentFrame } from "remotion";
import { SourceTag, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { IHSG } from "../data/ihsg-20y";
import { AreaLine, BoardGrid, Card, Glyph, ORANG_TUNTUN_RIGHT, OrangTuntun, RingMark, Shot, ease, inBox, useWords, type Box } from "../components/kit";

/** A: the chart on top, the table of drops under it. B: 2026 alone, the full card. */
const CH = { x: 140, y: 180, w: 1640, h: 460 };
const PLOT: Box = { x: CH.x + 110, y: CH.y + 110, w: CH.w - 220, h: 260 };
const TABLE = { x: 140, y: 670, w: 1640, h: 270, labelW: 420, colW: (1640 - 420 - 40) / 6, row1: 100, row2: 180 };
const CH_Z = { x: 140, y: 170, w: 1640, h: 700 };
const PLOT_Z: Box = { x: CH_Z.x + 110, y: CH_Z.y + 140, w: CH_Z.w - 220, h: 400 };
/** −59,5 % style. */
const pct = (v: number) => `${v < 0 ? "−" : "+"}${Math.abs(v * 100).toFixed(1).replace(".", ",")}%`;
const HI = 9500;
const T0 = Date.parse("2006-01-01");
const T1 = Date.parse("2026-11-30");
const SERIES = IHSG.map(([d, v]) => [(Date.parse(d) - T0) / (T1 - T0), v / HI] as [number, number]);

/** The six drops the script names, each searched for its lowest close in its own window; `row` keeps close labels apart. */
const DROPS = [
  { label: "2008", from: "2008-06-01", to: "2009-03-31", at: "2008.", row: 0 },
  { label: "2013", from: "2013-05-01", to: "2013-12-31", at: "2013.", row: 0 },
  { label: "2015", from: "2015-04-01", to: "2015-12-31", at: "2015.", row: 0 },
  { label: "Mar 2020", from: "2020-03-01", to: "2020-03-31", at: "Maret 2020.", row: 0 },
  { label: "Apr 2025", from: "2025-04-01", to: "2025-04-30", at: "April 2025.", row: 1 },
  { label: "2026", from: "2026-01-01", to: "2026-11-30", at: "2026.", row: 0 },
];
const low = (from: string, to: string) => IHSG.reduce((best, p, i) => (p[0] >= from && p[0] <= to && (best < 0 || p[1] < IHSG[best][1]) ? i : best), -1);
const TROUGHS = DROPS.map((d) => {
  const i = low(d.from, d.to);
  // the level the drop started from: the highest close in the year before the low; `back` = the first close at it again
  const yearBefore = new Date(Date.parse(IHSG[i][0]) - 365 * 864e5).toISOString().slice(0, 10);
  let top = i;
  for (let k = i; k >= 0 && IHSG[k][0] >= yearBefore; k--) if (IHSG[k][1] > IHSG[top][1]) top = k;
  let back = -1;
  for (let k = i; k < IHSG.length; k++)
    if (IHSG[k][1] >= IHSG[top][1]) {
      back = k;
      break;
    }
  // how far it fell from that level, and the months from the low until it was back (null: not yet — 2026)
  const drop = IHSG[i][1] / IHSG[top][1] - 1;
  const months = back > 0 ? Math.round((Date.parse(IHSG[back][0]) - Date.parse(IHSG[i][0])) / (30.44 * 864e5)) : null;
  return { ...d, i, back, drop, months };
});

// B — 2026 alone
const Y26 = IHSG.map((p, i) => ({ p, i })).filter(({ p }) => p[0] >= "2026-01-01");
const Z_LO = 4500;
const Z_HI = 9500;
const Z0 = Date.parse("2026-01-01");
const Z1 = Date.parse(Y26[Y26.length - 1].p[0]);
const ZOOM = Y26.map(({ p }) => [(Date.parse(p[0]) - Z0) / (Z1 - Z0), (p[1] - Z_LO) / (Z_HI - Z_LO)] as [number, number]);
const HALT = Y26.findIndex(({ p }) => p[0] === "2026-01-28");
const JUNE = Y26.findIndex(({ p }) => p[0] === "2026-06-08");
/** 28 Jan's close against 27 Jan's (8.320,56 / 8.980,23); 8 Jun's against the year's peak close (20 Jan, 9.134,70). */
const HALT_DROP = Y26[HALT].p[1] / Y26[HALT - 1].p[1] - 1;
const JUNE_DROP = Y26[JUNE].p[1] / Math.max(...Y26.filter(({ p }) => p[0] < "2026-03-01").map(({ p }) => p[1])) - 1;
const MONTHS = ["Jan", "Mar", "Mei", "Jul", "Sep", "Nov"].map((label, k) => ({ label, t: (Date.parse(`2026-${String(1 + 2 * k).padStart(2, "0")}-01`) - Z0) / (Z1 - Z0) }));

const pathOf = (pts: [number, number][], box: Box) => pts.map((p, k) => { const [x, y] = inBox(box, p); return `${k ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`; }).join(" ");

export const SC07 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(7, BLOCK.SC07);
  const g = f + BLOCK.SC07;
  const B = BLOCK.SC07;
  const cut = (phrase: string) => W(phrase) - m.sec(0.15);
  const END = BLOCK.SC08 - BLOCK.SC07;

  const Z = cut("Pada 2026");
  const Q = cut("Kenapa pembelajaran");

  const cardIn = ease(f, 0, m.reveal);
  const draw = ease(f, W("IHSG"), W("Ada enam") - W("IHSG"));
  const back = ease(f, W("kemudian kembali"), m.sec(1.4));
  const sellers = ease(f, W("dan setiap kali"), m.reveal);
  const zDraw = ease(f, Z, m.sec(1.2));
  const halt = ease(f, W("trading halt"), m.pop);
  const june = ease(f, W("dan pada Juni"), m.pop);
  const base = PLOT.y + PLOT.h;
  const baseZ = PLOT_Z.y + PLOT_Z.h;

  return (
    <>
      <BoardGrid g={g} on={1} />

      {/* A — one frame: twenty years on top, the six drops as a table under it (Simon 11 Nov: "ganti visual jadi yang lebih
          ber-value") — how far each fell from its peak and how long it took to get back there; the climbs back; a grey person
          at every low */}
      <Shot from={0} to={Z} block={B} cutIn={false}>
        <div style={{ position: "absolute", inset: 0, opacity: cardIn, transform: `translateY(${((1 - cardIn) * 18).toFixed(1)}px)` }}>
          <Card x={CH.x} y={CH.y} w={CH.w} h={CH.h}>
            <div style={{ position: "absolute", left: PLOT.x - CH.x, top: 34, ...typeStyle("title"), fontSize: 40, fontWeight: 700, color: c.ink }}>IHSG 2006–2026</div>
            <SourceTag kind="market" label="IHSG · 2006–2026 · Yahoo Finance" x={PLOT.x - CH.x + PLOT.w} y={64} />
            <svg width={CH.w} height={CH.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <g transform={`translate(${-CH.x} ${-CH.y})`}>
                <AreaLine box={PLOT} pts={SERIES} upto={draw} id="sc07-ihsg" />
                {back > 0.001
                  ? TROUGHS.filter((t) => t.back > 0).map((t) => {
                      const end = Math.round(t.i + (t.back - t.i) * back);
                      return <path key={t.label} d={pathOf(SERIES.slice(t.i, end + 1), PLOT)} fill="none" stroke={c.cyan} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />;
                    })
                  : null}
                {TROUGHS.map((t) => {
                  const [x, y] = inBox(PLOT, SERIES[t.i]);
                  return <RingMark key={t.label} x={x} y={y} y2={base} p={ease(f, W(t.at), m.pop)} />;
                })}
              </g>
            </svg>
            {TROUGHS.map((t) => {
              const p = ease(f, W(t.at), m.pop);
              if (p <= 0.001) return null;
              const [x] = inBox(PLOT, SERIES[t.i]);
              return (
                <div key={t.label} style={{ position: "absolute", left: x - CH.x, top: base - CH.y + 12 + t.row * 32, transform: "translateX(-50%)", ...typeStyle("label"), fontSize: 22, fontWeight: 600, color: c.ink, whiteSpace: "nowrap", opacity: p }}>{t.label}</div>
              );
            })}
            {/* someone sold at every low: a grey person on the ring, nothing more */}
            {sellers > 0.001
              ? TROUGHS.map((t, i) => {
                  const [x, y] = inBox(PLOT, SERIES[t.i]);
                  const p = ease(f, W("dan setiap kali") + i * m.sec(0.08), m.pop);
                  return (
                    <div key={t.label} style={{ position: "absolute", left: x - CH.x + 16, top: y - CH.y - 60, width: 46, height: 46, borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: `scale(${(0.7 + 0.3 * p).toFixed(3)})` }}>
                      <Glyph icon="user-circle" size={34} tone={theme.color.neutralIcon} />
                    </div>
                  );
                })
              : null}
            <div style={{ position: "absolute", left: PLOT.x - CH.x + 360, top: 30, height: 48, padding: "0 20px", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${c.cyan}`, display: "flex", alignItems: "center", gap: 12, ...typeStyle("label"), fontSize: 24, fontWeight: 600, color: theme.color.cyanInk, opacity: back }}>
              <div style={{ width: 28, height: 5, borderRadius: 3, background: c.cyan }} />
              Kembali ke puncak
            </div>
          </Card>
          {/* the six drops, a column each as the VO names its year */}
          <Card x={TABLE.x} y={TABLE.y} w={TABLE.w} h={TABLE.h} style={{ opacity: ease(f, W("Ada enam") - m.sec(0.1), m.reveal) }}>
            {[
              { text: "Turun dari puncak", y: TABLE.row1 },
              { text: "Kembali ke puncak dalam", y: TABLE.row2 },
            ].map((r) => (
              <div key={r.text} style={{ position: "absolute", left: 40, top: r.y, height: 50, display: "flex", alignItems: "center", ...typeStyle("label"), fontSize: 26, fontWeight: 600, color: c.slate }}>{r.text}</div>
            ))}
            <div style={{ position: "absolute", left: 40, right: 40, top: TABLE.row1 - 12, height: 2, background: theme.color.skeleton }} />
            {TROUGHS.map((t, i) => {
              const p = ease(f, W(t.at), m.pop);
              const recP = ease(f, W("kemudian kembali") + i * m.sec(0.15), m.reveal);
              const x = TABLE.labelW + i * TABLE.colW;
              return p > 0.001 ? (
                <div key={t.label} style={{ position: "absolute", left: x, width: TABLE.colW, top: 0, height: TABLE.h, opacity: p }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", ...typeStyle("title"), fontSize: 30, fontWeight: 700, color: c.ink }}>{t.label}</div>
                  <div style={{ position: "absolute", left: 0, right: 0, top: TABLE.row1, height: 50, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 36, fontWeight: 600, color: theme.color.crossRed, fontVariantNumeric: "tabular-nums" }}>{pct(t.drop)}</div>
                  <div style={{ position: "absolute", left: 0, right: 0, top: TABLE.row2, height: 50, display: "flex", alignItems: "center", justifyContent: "center", opacity: recP }}>
                    <div style={{ height: 46, padding: "0 18px", borderRadius: 999, background: t.months === null ? theme.color.neutralDisc : c.cardBg, boxShadow: t.months === null ? "none" : `inset 0 0 0 2px ${c.cyan}`, display: "flex", alignItems: "center", ...typeStyle("label"), fontSize: 26, fontWeight: 600, color: t.months === null ? c.slate : theme.color.cyanInk, whiteSpace: "nowrap" }}>{t.months === null ? "Belum" : `±${t.months} bulan`}</div>
                  </div>
                </div>
              ) : null;
            })}
          </Card>
        </div>
      </Shot>

      {/* B — 2026 alone */}
      <Shot from={Z} to={Q} block={B}>
        <Card x={CH_Z.x} y={CH_Z.y} w={CH_Z.w} h={CH_Z.h}>
          <div style={{ position: "absolute", left: PLOT_Z.x - CH_Z.x, top: 46, ...typeStyle("title"), fontSize: 48, fontWeight: 600, color: c.ink }}>IHSG 2026</div>
          <SourceTag kind="market" label="IHSG · 2026 · Yahoo Finance" x={PLOT_Z.x - CH_Z.x + PLOT_Z.w} y={82} />
          <svg width={CH_Z.w} height={CH_Z.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <g transform={`translate(${-CH_Z.x} ${-CH_Z.y})`}>
              <AreaLine box={PLOT_Z} pts={ZOOM} upto={zDraw} id="sc07-2026" />
              {[
                { k: HALT, p: halt },
                { k: JUNE, p: june },
              ].map(({ k, p }) => {
                const [x, y] = inBox(PLOT_Z, ZOOM[k]);
                return <RingMark key={k} x={x} y={y} y2={baseZ} p={p} />;
              })}
            </g>
          </svg>
          {MONTHS.map((mo) => (
            <div key={mo.label} style={{ position: "absolute", left: inBox(PLOT_Z, [mo.t, 0])[0] - CH_Z.x, top: baseZ - CH_Z.y + 22, transform: "translateX(-50%)", ...typeStyle("label"), fontSize: 26, fontWeight: 500, color: c.slate }}>{mo.label}</div>
          ))}
          {[
            { k: HALT, p: halt, text: `28 Jan: trading halt · ${pct(HALT_DROP)} sehari`, dx: 30, dy: -40 },
            { k: JUNE, p: june, text: `Jun: 5.342 · ${pct(JUNE_DROP)} dari puncak Januari`, dx: 30, dy: 10 },
          ].map(({ k, p, text, dx, dy }) =>
            p > 0.001 ? (
              <div key={text} style={{ position: "absolute", left: inBox(PLOT_Z, ZOOM[k])[0] - CH_Z.x + dx, top: inBox(PLOT_Z, ZOOM[k])[1] - CH_Z.y + dy, height: 64, padding: "0 26px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${c.indigo}`, display: "flex", alignItems: "center", ...typeStyle("title"), fontSize: 34, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap", opacity: p, transform: `scale(${(0.85 + 0.15 * p).toFixed(3)})`, transformOrigin: "left center" }}>{text}</div>
            ) : null,
          )}
        </Card>
      </Shot>

      {/* C — Orang Tuntun: why it matters when the market is bearish */}
      <Shot from={Q} to={END} block={B} cutOut={false}>
        <OrangTuntun at={Q} />
        <div style={{ position: "absolute", left: ORANG_TUNTUN_RIGHT + 90, top: 500, width: theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 90, transform: "translateY(-50%)", fontFamily: theme.text.family, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.22 }}>
          <div style={{ fontSize: 48, color: c.slate, marginBottom: 24, opacity: ease(f, W("Kenapa pembelajaran") + m.sec(0.2), m.reveal) }}>Kenapa penting saat bearish?</div>
          <div style={{ fontSize: 88, color: c.ink, opacity: ease(f, W("bear market adalah") - m.sec(0.1), m.reveal) }}>Bear market</div>
          <div style={{ fontSize: 56, color: c.ink, marginTop: 16, opacity: ease(f, W("ujian bagi") - m.sec(0.1), m.reveal) }}>Ujian bagi value investor,</div>
          <div style={{ fontSize: 56, color: c.indigo, marginTop: 6, opacity: ease(f, W("kelas terbaiknya") - m.sec(0.1), m.reveal) }}>sekaligus salah satu kelas terbaiknya</div>
        </div>
      </Shot>
    </>
  );
};
