/**
 * IN07 · SC10 — "Harga Sama-Sama Turun, Konteksnya Bisa Berbeda". From the ChatGPT storyboard
 * docs/vi-style/storyboards/IN07-SC10.jpg.
 *
 *  A  the opening line as one summary line (Simon 30 Oct: "ganti visual ke text ringkasan aja, ringkas dari voice
 *     over"), fading across after "sama." to April 2025 alone, in the middle ("kartu aprilnya nanti muncul nya di posisi
 *     tengah"): an editorial chart of real closes (data/ihsg.ts, Yahoo Finance) and the news as an archival clipping
 *     (Benchmark v2, Simon 26 Oct: Dalio's chart and archive styles).
 *  B  April 2025's context: valuation at Murah, sentiment at Takut.
 *  C  the question changes — "Jual atau nggak?" ✕ → "Dampak nyata, atau reaksi berlebihan?" — read with three tools:
 *     Company Quality (unchanged ✓), Fair Value (price far below), Event Research.
 *  D  rebuilt 30 Oct from the storyboard docs/vi-style/storyboards/IN07-SC10-akhir.jpg (Simon: "dari 28225 hingga
 *     akhir scene, ganti visualnya"), all centred:
 *     D1 a jar of long-term money ("Dana jangka panjang"), its sprout on "peluang", then "Bertahap": three coin stacks
 *        growing one after another;
 *     D2 the jar steps back up, and three exclusions arrive on their words — Dana darurat, Segera dipakai, Otomatis —
 *        each an icon in a circle struck through;
 *     D3 the two drops as small cards (the real closes as sparklines, no axes) joined by a brace into the line
 *        "Sama-sama turun, konteksnya berbeda."
 *
 * Only what the script says, or the data shows, is drawn as fact: the two charts are real closes; April 2025's low
 * valuation and fear are the script's words (drawn as positions, not numbers); 28 Januari's context is left blank on
 * purpose.
 */
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Ico, Line, Mark, SITUATION, Typed, ease, useWords } from "../components/kit";
import { DataChart, NewsClipping } from "../components/Dalio";
import { BUMI_CQ, BUMI_FV, BumiCrop, cropW } from "../components/BumiCrop";
import { APR_2025, JAN_2026 } from "../data/ihsg";

const CX = theme.canvas.width / 2;

// A/B — the two drops
const DROP = { w: 640, h: 380, y: 200 };
/** April 2025 — its chart, the clipping and the context card — stands alone in the middle. */
const DROP_X = CX - DROP.w / 2;
/** The summary line, in the middle of the space above the subtitle band. */
const SUMMARY_Y = theme.captionBand.top / 2;
/** B's context: two cards side by side under the chart, Valuasi and Sentimen (Simon 30 Oct: "dipisah aja, beda kotak"). */
const MINI = { y: 610, h: 230, gap: 24, pad: 30, titleTop: 28 };
const MINI_W = (DROP.w - MINI.gap) / 2;
const BAR = { top: 110, h: 14, dot: 28, labelTop: 142 };
const GAUGE = { cy: 168, r: 80, labelW: 110, labelTop: 182 };
/** The two real series (data/ihsg.ts): their window, axis and the day each dropped. */
const CHARTS = [
  { title: "28 Januari 2026", series: JAN_2026, lo: 7500, hi: 9500, ticks: [8000, 9000], event: { d: "2026-01-28", label: "28 Jan" } },
  { title: "April 2025", series: APR_2025, lo: 5600, hi: 7400, ticks: [6000, 7000], event: { d: "2025-04-08", label: "8 Apr" } },
];

// C — the question and its three tools
const QUESTION = { w: 1160, h: 150, y: 220 };
/** While the question stands alone it sits in the vertical middle of the space above the subtitle band
 *  (Simon 30 Oct: "posisinya buat tengah vertikal"); it steps up to QUESTION.y as the tools arrive. */
const QUESTION_MID_Y = (theme.captionBand.top - QUESTION.h) / 2;
const TOOL = { w: 460, h: 280, y: 500, gap: 50 };
/**
 * Two of the tools show the app itself: BUMI_3's Company Quality and Fair Value columns, cut under their titles (Simon
 * 30 Oct: "beberapa elemen di bawahnya juga bisa diganti jadi screenshot existing"). Event Research has no screen of
 * its own in the episode, so it stays drawn.
 */
const TOOL_SHOT = { top: 112, h: 140 };
const toolX = (i: number) => CX - (3 * TOOL.w + 2 * TOOL.gap) / 2 + i * (TOOL.w + TOOL.gap);
const TOOLS = [
  { text: "Company Quality", icon: "company", at: "kualitas perusahaan" },
  { text: "Fair Value", icon: "scale", at: "harganya sudah" },
  { text: "Event Research", icon: "event", at: "berita tersebut" },
] as const;

// D1 — the jar of long-term money, and the steps under it
const JAR = { chipY: 160, chipH: 60, lidY: 300, lidW: 190, lidH: 34, bodyY: 326, bodyW: 260, bodyH: 250, r: 56, sprout: 54 };
const STACK = { chipY: 620, base: 850, gap: 160, r: 44, t: 20, ry: 12, coins: [2, 3, 4] };
// D2 — the jar steps back to this size (from its top), the three exclusions under it
const SHRINK = 0.8;
const EX = { y: 610, d: 150, gap: 340, chipH: 56 };
// D3 — the two drops, small, and the line they lead to
const END = { y: 200, w: 520, h: 300, gap: 60, braceY: 520, braceH: 60, lineY: 640, lineH: 104 };
const endX = (i: number) => CX - END.gap / 2 - END.w + i * (END.w + END.gap);
const NOT = [
  { text: "Dana darurat", icon: "emergency", at: "dana darurat" },
  { text: "Segera dipakai", icon: "spend", at: "segera dipakai" },
  { text: "Otomatis", icon: "auto", at: "keputusan otomatis" },
] as const;

/** A small chip: an icon and a word. */
const Chip = ({ icon, text, tone, p }: { icon: string; text: string; tone?: string; p: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  if (p <= 0.001) return null;
  return (
    <div style={{ height: 56, padding: "0 22px 0 10px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", gap: 12, opacity: p, transform: `translateY(${((1 - p) * 10).toFixed(2)}px)`, ...typeStyle("label"), fontSize: 28, color: c.ink, whiteSpace: "nowrap" }}>
      <Disc icon={icon} size={40} tone={tone ?? theme.color.neutralIcon} tint={theme.color.neutralDisc} />
      {text}
    </div>
  );
};

/** A white pill with one word or two (the storyboard's labels). */
const Pill = ({ text, h, size = 34 }: { text: string; h: number; size?: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
    <div style={{ height: h, padding: `0 ${h / 2}px`, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", ...typeStyle("body"), fontSize: size, color: c.ink, whiteSpace: "nowrap" }}>{text}</div>
  );
};

/** One coin seen from the side, its top face centred on (cx, y). */
const Coin = ({ cx, y, r, t, ry }: { cx: number; y: number; r: number; t: number; ry: number }) => (
  <g>
    <path d={`M ${cx - r} ${y} v ${t} A ${r} ${ry} 0 0 0 ${cx + r} ${y + t} v ${-t} Z`} fill={theme.color.coinSpinShade} stroke={theme.color.coinSpinRing} strokeWidth={2} />
    <ellipse cx={cx} cy={y} rx={r} ry={ry} fill={theme.color.coinSpinRing} />
    <ellipse cx={cx} cy={y} rx={r * 0.78} ry={ry * 0.74} fill={theme.color.coinSpinFace} />
  </g>
);

/** D1's jar of long-term money: glass, two stacks of coins, a lid, and a sprout growing on "peluang". */
const Jar = ({ sprout }: { sprout: number }) => {
  const c = usePalette();
  const bottom = JAR.bodyY + JAR.bodyH - 40;
  const stacks = [
    { cx: CX - 52, n: 4 },
    { cx: CX + 50, n: 6 },
  ];
  return (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <rect x={CX - JAR.bodyW / 2} y={JAR.bodyY} width={JAR.bodyW} height={JAR.bodyH} rx={JAR.r} fill={theme.color.indigoWashSolid} stroke={theme.color.hairlineBrandSolid} strokeWidth={4} />
      {stacks.map((st) => Array.from({ length: st.n }, (_, k) => <Coin key={`${st.cx}-${k}`} cx={st.cx} y={bottom - k * STACK.t} r={STACK.r} t={STACK.t} ry={STACK.ry} />))}
      <rect x={CX - JAR.lidW / 2} y={JAR.lidY} width={JAR.lidW} height={JAR.lidH} rx={12} fill={theme.color.indigoWashStrongSolid} stroke={theme.color.hairlineBrandSolid} strokeWidth={4} />
      {/* the sprout: opportunity, growing from the lid */}
      <g style={{ transformOrigin: `${CX}px ${JAR.lidY}px`, transform: `scale(${sprout.toFixed(3)})` }}>
        <line x1={CX} y1={JAR.lidY} x2={CX} y2={JAR.lidY - JAR.sprout} stroke={c.indigo} strokeWidth={6} strokeLinecap="round" />
        <ellipse cx={CX - 26} cy={JAR.lidY - JAR.sprout + 6} rx={28} ry={13} fill={c.indigo} transform={`rotate(30 ${CX - 26} ${JAR.lidY - JAR.sprout + 6})`} />
        <ellipse cx={CX + 26} cy={JAR.lidY - JAR.sprout + 6} rx={28} ry={13} fill={c.indigo} transform={`rotate(-30 ${CX + 26} ${JAR.lidY - JAR.sprout + 6})`} />
      </g>
    </svg>
  );
};

/** D1's steps: three stacks, each a coin taller, coming one after another with an arrow between. */
const Steps = ({ f, at }: { f: number; at: number }) => {
  const m = useMotion();
  const top = (i: number) => STACK.base - (STACK.coins[i] - 1) * STACK.t - STACK.ry;
  return (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {STACK.coins.map((n, i) => {
        const cx = CX + (i - 1) * STACK.gap;
        const p = ease(f, at + i * m.sec(0.3), m.reveal);
        return (
          <g key={i} opacity={p} style={{ transformOrigin: `${cx}px ${STACK.base}px`, transform: `translateY(${((1 - p) * 16).toFixed(2)}px)` }}>
            {Array.from({ length: n }, (_, k) => <Coin key={k} cx={cx} y={STACK.base - k * STACK.t} r={STACK.r} t={STACK.t} ry={STACK.ry} />)}
          </g>
        );
      })}
      {[0, 1].map((i) => {
        const x0 = CX + (i - 1) * STACK.gap + 20;
        const x1 = CX + i * STACK.gap - 24;
        const y0 = top(i) - 18;
        const y1 = top(i + 1) - 18;
        const p = ease(f, at + i * m.sec(0.3) + m.sec(0.15), m.sec(0.35));
        return (
          <g key={i} opacity={p > 0.001 ? 1 : 0}>
            <path d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${Math.min(y0, y1) - 46} ${x1} ${y1}`} fill="none" stroke={theme.color.neutralIcon} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
            <path d={`M ${x1 - 14} ${y1 - 12} L ${x1} ${y1} L ${x1 - 17} ${y1 + 5}`} fill="none" stroke={theme.color.neutralIcon} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.95 ? 1 : 0} />
          </g>
        );
      })}
    </svg>
  );
};

/** D2: an icon in a white circle, struck through (ring + slash drawn on with `p`). */
const NoSign = ({ icon, d, p }: { icon: string; d: number; p: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  const r = d / 2 - 5;
  const k = r * Math.SQRT1_2;
  return (
    <div style={{ position: "relative", width: d, height: d, borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Ico name={icon} size={d * 0.48} tone={theme.color.neutralIcon} />
      <svg width={d} height={d} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <circle cx={d / 2} cy={d / 2} r={r} fill="none" stroke={theme.color.crossRed} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform={`rotate(-135 ${d / 2} ${d / 2})`} />
        <line x1={d / 2 - k} y1={d / 2 - k} x2={d / 2 + k} y2={d / 2 + k} stroke={theme.color.crossRed} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, (p - 0.5) * 2)} />
      </svg>
    </div>
  );
};

/** D3: one drop as a small card — its date on a pill, the real closes as a line (no axes), the drop day marked. */
const DropCard = ({ i }: { i: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  const { title, series, lo, hi, event } = CHARTS[i];
  const pad = { l: 34, r: 34, t: 96, b: 52 };
  const pw = END.w - pad.l - pad.r;
  const ph = END.h - pad.t - pad.b;
  const px = (k: number) => pad.l + (k / (series.length - 1)) * pw;
  const py = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * ph;
  const ei = series.findIndex((s) => s.d === event.d);
  return (
    <div style={{ position: "relative", width: END.w, height: END.h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: shadow.soft }}>
      <div style={{ position: "absolute", left: 0, top: 26, width: END.w, display: "flex", justifyContent: "center" }}>
        <Pill text={title} h={48} size={26} />
      </div>
      <svg width={END.w} height={END.h} style={{ position: "absolute", left: 0, top: 0 }}>
        <polyline points={series.map((s, k) => `${px(k).toFixed(1)},${py(s.c).toFixed(1)}`).join(" ")} fill="none" stroke={theme.color.alarmRed} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={px(ei)} cy={py(series[ei].c)} r={8} fill={theme.color.alarmRed} />
      </svg>
      <div style={{ position: "absolute", right: 20, bottom: 14, fontFamily: theme.text.family, fontSize: 16, color: c.slate }}>^JKSE · Yahoo Finance</div>
    </div>
  );
};

export const SC10 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(10, BLOCK.SC10);
  const g = f + BLOCK.SC10;

  // A/B
  /** The summary fades across to April (Simon: at 25717, a breath after "sama."). */
  const aprAt = W("sama.", 0, "f1") + m.sec(0.25);
  const aOut = ease(f, W("Jadi pertanyaannya"), m.fade);
  const marker = 0.5 - 0.38 * ease(f, W("relatif rendah"), m.move);
  const needle = 0.5 - 0.38 * ease(f, W("dipenuhi ketakutan"), m.move);
  const miniP = ease(f, W("Bedanya,") - m.sec(0.1), m.reveal);

  // C
  const oldAt = W("Harus jual");
  /** "Tapi:" before the new question ("Tapi nggak semua" is Tapi #0). */
  const crossAt = W("Tapi:", 1);
  const newAt = W("Apakah dampaknya");
  const toolsAt = W("dibaca bersama");
  const qy = QUESTION.y + (QUESTION_MID_Y - QUESTION.y) * (1 - ease(f, toolsAt - m.sec(0.4), m.move));
  const cOut = ease(f, W("Bahkan untuk"), m.fade);
  const holds = ease(f, W("masih berlaku"), m.pop);

  // D
  const bankAt = W("dana jangka");
  const sproutAt = W("mencari peluang");
  const stepAt = W("secara bertahap");
  const shrink = ease(f, W("Bukan dana") - m.sec(0.2), m.move);
  const dOut = ease(f, W("Harga sama-sama"), m.fade);
  const endAt = W("Harga sama-sama");
  const lineAt = W("tapi konteksnya");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A/B — the same drop, twice */}
      {aOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - aOut }}>
          {/* A — the opening line, summarised */}
          <Appear at={0} out={aprAt} style={{ left: 0, top: 0, width: theme.canvas.width }}>
            <Line x={0} y={SUMMARY_Y} w={theme.canvas.width} align="center" size={64} weight={500} text="Beda penurunan, beda konteks." mark="beda konteks" />
          </Appear>
          {/* … then April 2025: real IHSG closes (data/ihsg.ts), drawn on like an editorial chart */}
          {f >= aprAt ? (
            <div style={{ position: "absolute", inset: 0, opacity: ease(f, aprAt, m.fade) }}>
              <DataChart
                x={DROP_X}
                y={DROP.y}
                w={DROP.w}
                h={DROP.h}
                title={CHARTS[1].title}
                series={CHARTS[1].series}
                lo={CHARTS[1].lo}
                hi={CHARTS[1].hi}
                ticks={CHARTS[1].ticks}
                draw={ease(f, W("April 2025"), m.sec(1.2))}
                event={CHARTS[1].event}
                eventP={ease(f, W("turun tajam"), m.reveal)}
                halt={f >= W("dihentikan")}
              />
            </div>
          ) : null}
          {/* the news, as an archival clipping (Benchmark v2) — the script's own words, no real paper named */}
          <NewsClipping x={DROP_X + 120} y={MINI.y} w={440} h={250} dateline="April 2025" headline="Kenaikan tarif terhadap Indonesia" p={ease(f, W("kenaikan tarif"), m.reveal) * (1 - miniP)} />
          {/* B — April 2025's context, in its own words: valuation low, fear high */}
          {miniP > 0.001 ? (
            <div style={{ position: "absolute", left: 0, top: (1 - miniP) * 14, width: theme.canvas.width, opacity: miniP }}>
              {/* valuation: low */}
              <Card x={DROP_X} y={MINI.y} w={MINI_W} h={MINI.h} line={theme.color.hairlineBrandSolid}>
                <div style={{ position: "absolute", left: 0, top: MINI.titleTop, width: MINI_W, textAlign: "center", ...typeStyle("label"), color: c.ink }}>Valuasi</div>
                <div style={{ position: "absolute", left: MINI.pad, top: BAR.top, width: MINI_W - 2 * MINI.pad, height: BAR.h, borderRadius: BAR.h / 2, background: `linear-gradient(90deg, ${theme.color.indigoWashSolid}, ${theme.color.indigoWashStrongSolid})` }} />
                <div style={{ position: "absolute", left: MINI.pad + marker * (MINI_W - 2 * MINI.pad) - BAR.dot / 2, top: BAR.top + BAR.h / 2 - BAR.dot / 2, width: BAR.dot, height: BAR.dot, borderRadius: 999, background: c.indigo }} />
                <div style={{ position: "absolute", left: MINI.pad, top: BAR.labelTop, ...typeStyle("label"), fontSize: 24, color: c.slate }}>Murah</div>
                <div style={{ position: "absolute", right: MINI.pad, top: BAR.labelTop, ...typeStyle("label"), fontSize: 24, color: c.slate }}>Mahal</div>
              </Card>
              {/* sentiment: fear */}
              <Card x={DROP_X + MINI_W + MINI.gap} y={MINI.y} w={MINI_W} h={MINI.h} line={theme.color.hairlineBrandSolid}>
                <div style={{ position: "absolute", left: 0, top: MINI.titleTop, width: MINI_W, textAlign: "center", ...typeStyle("label"), color: c.ink }}>Sentimen</div>
                <svg width={MINI_W} height={MINI.h} style={{ position: "absolute", left: 0, top: 0 }}>
                  {(() => {
                    const cx = MINI_W / 2;
                    const { cy, r } = GAUGE;
                    const a = Math.PI * (1 - needle);
                    return (
                      <>
                        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={theme.color.indigoWashStrongSolid} strokeWidth={14} strokeLinecap="round" />
                        <line x1={cx} y1={cy} x2={cx + (r - 18) * Math.cos(a)} y2={cy - (r - 18) * Math.sin(a)} stroke={c.ink} strokeWidth={5} strokeLinecap="round" />
                        <circle cx={cx} cy={cy} r={9} fill={c.ink} />
                      </>
                    );
                  })()}
                </svg>
                {/* each end's word centred under it */}
                {(["Takut", "Serakah"] as const).map((t, k) => (
                  <div key={t} style={{ position: "absolute", left: MINI_W / 2 + (k === 0 ? -1 : 1) * GAUGE.r - GAUGE.labelW / 2, top: GAUGE.labelTop, width: GAUGE.labelW, textAlign: "center", ...typeStyle("label"), fontSize: 24, color: c.slate }}>{t}</div>
                ))}
              </Card>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* C — the question that changes, and the three tools it is read with */}
      {cOut < 0.999 && f >= oldAt - m.sec(0.2) ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - cOut }}>
          {/* the old question, crossed out, giving way */}
          <Appear at={oldAt - m.sec(0.1)} out={newAt} style={{ left: CX - 260, top: qy + 20 }}>
            <div style={{ width: 520, height: 110, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontWeight: 500, color: c.slate }}>Jual atau nggak?</div>
          </Appear>
          {f < newAt + m.fade ? <Mark kind="cross" p={ease(f, crossAt, m.pop) * (1 - ease(f, newAt, m.fade))} x={CX + 250} y={qy + 30} /> : null}
          {/* the new one */}
          {f >= newAt - m.sec(0.1) ? (
            <Card x={CX - QUESTION.w / 2} y={qy} w={QUESTION.w} h={QUESTION.h} line={theme.color.hairlineBrandSolid} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 48px", opacity: ease(f, newAt - m.sec(0.1), m.reveal), boxShadow: `${shadow.soft}, 0 0 40px 8px ${theme.color.indigoGlow}` }}>
              <Disc icon="question" size={88} tone={c.indigo} tint={theme.color.indigoWashSolid} />
              <div style={{ fontFamily: theme.text.family, fontSize: 54, fontWeight: 500, letterSpacing: -0.5, color: c.ink }}>
                <Typed text="Dampak nyata, atau reaksi berlebihan?" at={newAt} cps={30} mark="Dampak nyata" />
              </div>
            </Card>
          ) : null}
          {TOOLS.map((t, i) => {
            const x = toolX(i);
            const p = ease(f, W(t.at) - m.sec(0.1), m.reveal);
            return (
              <div key={t.text}>
                <Connector a={{ x: CX, y: qy + QUESTION.h }} b={{ x: x + TOOL.w / 2, y: TOOL.y }} p={ease(f, toolsAt + i * m.sec(0.1), m.sec(0.5))} shape="curve" axis="y" />
                {f >= toolsAt + i * m.sec(0.1) + m.sec(0.3) ? (
                  <div style={{ position: "absolute", left: x, top: TOOL.y, width: TOOL.w, height: TOOL.h, opacity: ease(f, toolsAt + i * m.sec(0.1) + m.sec(0.3), m.pop) }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: theme.shape.cardRadius, border: `2px dashed ${theme.color.connectorMuteSolid}`, opacity: 1 - p }} />
                    <Card x={0} y={(1 - p) * 12} w={TOOL.w} h={TOOL.h} style={{ opacity: p }}>
                      <div style={{ position: "absolute", left: 30, top: 28, display: "flex", alignItems: "center", gap: 16 }}>
                        <Disc icon={t.icon} size={56} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                        <div style={{ ...typeStyle("body"), fontSize: 32, color: c.ink, whiteSpace: "nowrap" }}>{t.text}</div>
                      </div>
                      {i < 2 ? (
                        /* the app's own column: quality Good; the price 60–66 % under its fair value */
                        <div style={{ position: "absolute", left: (TOOL.w - cropW(i === 0 ? BUMI_CQ : BUMI_FV, TOOL_SHOT.h)) / 2, top: TOOL_SHOT.top }}>
                          <BumiCrop r={i === 0 ? BUMI_CQ : BUMI_FV} h={TOOL_SHOT.h} />
                        </div>
                      ) : (
                        /* the news, and whether it reaches the business */
                        <div style={{ position: "absolute", left: 0, top: TOOL_SHOT.top + TOOL_SHOT.h / 2 - 30, width: TOOL.w, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
                          <Disc icon="news" size={60} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
                          <div style={{ width: 90 * ease(f, W("berdampak pada"), m.sec(0.6)), height: 3, borderRadius: 2, background: c.indigo }} />
                          <Disc icon="company" size={60} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                        </div>
                      )}
                    </Card>
                    <Mark kind="check" p={holds} x={TOOL.w - 30} y={30} />
                  </div>
                ) : null}
              </div>
            );
          })}
          {/* no reason to panic */}
          <Appear at={W("ikut panik") - m.sec(0.15)} style={{ left: CX - 130, top: TOOL.y + TOOL.h + 50 }}>
            <Chip icon={SITUATION[0].icon} text={SITUATION[0].label} tone={theme.color.alarmRed} p={1} />
          </Appear>
          <Mark kind="cross" p={ease(f, W("ikut panik"), m.pop)} x={CX + 20} y={TOOL.y + TOOL.h + 50} />
        </div>
      ) : null}

      {/* D — long-term money, step by step … and what it is not */}
      {dOut < 0.999 && f >= bankAt - m.sec(0.2) ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - dOut }}>
          {/* D1 — the jar (and, in D2, steps back up from its top) */}
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${CX}px ${JAR.chipY}px`, transform: `scale(${(1 - (1 - SHRINK) * shrink).toFixed(4)})` }}>
            <Appear at={bankAt - m.sec(0.1)} style={{ left: 0, top: JAR.chipY, width: theme.canvas.width, display: "flex", justifyContent: "center" }}>
              <Pill text="Dana jangka panjang" h={JAR.chipH} />
            </Appear>
            <Appear at={bankAt} style={{ left: 0, top: 0 }}>
              <Jar sprout={ease(f, sproutAt, m.reveal)} />
            </Appear>
            <Appear at={stepAt - m.sec(0.15)} style={{ left: 0, top: STACK.chipY, width: theme.canvas.width, display: "flex", justifyContent: "center" }}>
              <Pill text="Bertahap" h={JAR.chipH} />
            </Appear>
            {/* the steps: a little more each time — gone once the jar steps back */}
            <div style={{ position: "absolute", inset: 0, opacity: 1 - shrink }}>
              <Steps f={f} at={stepAt} />
            </div>
          </div>
          {/* D2 — what it is not, each on its word */}
          {NOT.map((n, i) => {
            const at = W(n.at);
            const cx = CX + (i - 1) * EX.gap;
            return (
              <Appear key={n.text} at={at - m.sec(0.15)} style={{ left: cx - EX.gap / 2, top: EX.y, width: EX.gap, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                <Pill text={n.text} h={EX.chipH} size={30} />
                <NoSign icon={n.icon} d={EX.d} p={ease(f, at + m.sec(0.1), m.sec(0.4))} />
              </Appear>
            );
          })}
        </div>
      ) : null}

      {/* D3 — the same drop, twice, joined into the one line */}
      {f >= endAt - m.sec(0.1) ? (
        <div style={{ position: "absolute", inset: 0 }}>
          {[0, 1].map((i) => (
            <Appear key={i} at={endAt - m.sec(0.1) + i * m.sec(0.2)} style={{ left: endX(i), top: END.y }}>
              <DropCard i={i} />
            </Appear>
          ))}
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path
              d={`M ${endX(0) + END.w / 2} ${END.braceY} v ${END.braceH / 2} H ${endX(1) + END.w / 2} v ${-END.braceH / 2} M ${CX} ${END.braceY + END.braceH / 2} V ${END.lineY}`}
              fill="none"
              stroke={theme.color.connector}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - ease(f, lineAt - m.sec(0.45), m.sec(0.5))}
            />
          </svg>
          <Appear at={lineAt - m.sec(0.05)} style={{ left: 0, top: END.lineY, width: theme.canvas.width, display: "flex", justifyContent: "center" }}>
            <div style={{ height: END.lineH, padding: "0 56px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, display: "flex", alignItems: "center", fontFamily: theme.text.family, fontSize: 52, fontWeight: 500, letterSpacing: -0.5, color: c.ink, whiteSpace: "nowrap" }}>
              Sama-sama turun,&nbsp;<span style={{ color: c.indigo }}>konteksnya berbeda</span>.
            </div>
          </Appear>
        </div>
      ) : null}
    </Stage>
  );
};
