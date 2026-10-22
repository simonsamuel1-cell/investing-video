/**
 * VI04 · SC04 — "Seberapa Besar Ombak yang Bisa Kamu Tahan?", rebuilt to Benchmark v1 + minimal (STYLE.md §0;
 * Simon, 22 Oct 2026) from the ChatGPT storyboard docs/vi-style/storyboards/VI04-SC04-v2.jpg. The lines are grey;
 * the brand is only the hairlines that point at what the VO says — the shaded fall, the dashed levels, the dots.
 *
 *  A  "Pertanyaan pertama": ONE shot with SC03 — SC03's "Pertanyaan 1 · Ombak" card grows into the question card;
 *     it then stays as the heading.
 *  B  "“Ombak” adalah seberapa dalam investasi kita sempat turun": a line that rises, falls and recovers; its fall
 *     below the earlier high is shaded and measured — that depth is the wave.
 *  C/D the bank stock (unnamed, as the script): 1.880 in Mei 2020 → down about 21% (Rp10 juta → Rp7,9 juta) →
 *     7.300 four years on, total return about 288%. The line is SCHEMATIC — a shape through the script's own
 *     figures, never above the buy price before its low nor below the low after it — so no figure appears that
 *     the script doesn't say.
 *  E  the same chart moves aside (its box shrinks — a new grid, not a scale) for another stock: 600 → 300, never
 *     back to the buy price. "Dua-duanya bisa terjadi."
 *  F  the question for YOU: a dashed amber box opening from its centre.
 *  G  "saat harga naik … berani" and "saat market benar-benar turun", linked; "jual karena panik" hangs off the second.
 *  H  "nggak masalah": the three routes again, and the one with the smallest waves is picked.
 */
import { interpolateColors, useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, Card, Heading, IsoIcon, Line, ROUTE_CARD, ROUTE_CARDS, RouteCard, ease, useWords } from "../components/kit";
import { ASK as SC03_ASK, AskCard, AskLead, AskMain, askX } from "./Routes";

const CX = theme.canvas.width / 2;
const LEFT = 140;

type Box = { x: number; y: number; w: number; h: number };
const mixBox = (a: Box, b: Box, t: number): Box => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t });
/** Inside a chart box: room above for the labels, a little at the sides. */
type Pad = { l: number; r: number; t: number; b: number };
const PAD: Pad = { l: 40, r: 60, t: 100, b: 30 };
/** The two stocks sit in white cards (Simon, 22 Oct: "kasih pemisah … rectangle rounded corner putih"): room inside for the name, the figures above and the 21% under the low. */
const CARD_PAD: Pad = { l: 90, r: 80, t: 120, b: 110 };
const plot = (b: Box, pad: Pad = PAD) => ({ x: b.x + pad.l, y: b.y + pad.t, w: b.w - pad.l - pad.r, h: b.h - pad.t - pad.b });

/**
 * A price-like line through knots (t 0..1, value): each segment gets a few small zigzags in log space, kept inside
 * `clamp` so the shape never says more than the knots do.
 */
type Knot = [number, number];
const jag = (knots: Knot[], clamp: (t: number, v: number) => number, per = 4, amp = 0.022): Knot[] => {
  const out: Knot[] = [knots[0]];
  for (let s = 0; s < knots.length - 1; s++) {
    const [t0, v0] = knots[s];
    const [t1, v1] = knots[s + 1];
    for (let k = 1; k <= per; k++) {
      const u = k / (per + 1);
      const t = t0 + (t1 - t0) * u;
      const v = Math.exp(Math.log(v0) + (Math.log(v1) - Math.log(v0)) * u) * (1 + (k % 2 === 0 ? 1 : -1) * amp);
      out.push([t, clamp(t, v)]);
    }
    out.push(knots[s + 1]);
  }
  return out;
};

// A — the question card SC03's Ombak card grows into
const Q_CARD = { x: CX - 560, y: 360, w: 1120, h: 230 };
/** SC03's card text, measured from the type scale (label line + 4 px + title line), so the hand-over doesn't jump. */
const SC03_TEXT = { titleTop: theme.type.label.size * theme.type.label.leading + 4, h: theme.type.label.size * theme.type.label.leading + 4 + theme.type.title.size * theme.type.title.leading };

// B — what a wave is (a shape, no figures)
const DEF: Box = { x: 260, y: 300, w: 1400, h: 520 };
const DEF_KNOTS: Knot[] = [[0, 100], [0.14, 112], [0.3, 140], [0.42, 118], [0.55, 96], [0.66, 112], [0.8, 150], [1, 176]];
const DEF_PTS = jag(DEF_KNOTS, (_, v) => v, 3, 0.012);
const DEF_LO = 90;
const DEF_HI = 182;
const DEF_PEAK = 0.3;
const DEF_LOW = 0.55;
/** Where the line first gets back above the high it fell from. */
const DEF_BACK = 0.74;

// C–E — the bank stock (the script's figures) and another one
const BANK = { buy: 1880, low: 1880 * (1 - 0.21), sell: 7300, lowAt: 0.2 };
const BANK_PTS = jag(
  [[0, BANK.buy], [0.1, 1700], [BANK.lowAt, BANK.low], [0.32, 2050], [0.42, 1850], [0.58, 3300], [0.68, 3050], [0.82, 5100], [0.9, 4800], [1, BANK.sell]],
  (t, v) => (t < BANK.lowAt ? Math.min(v, BANK.buy) : Math.max(v, BANK.low * 1.03)),
);
const bankY = (v: number) => (Math.log(v) - Math.log(BANK.low * 0.92)) / (Math.log(BANK.sell * 1.04) - Math.log(BANK.low * 0.92));
const OTHER = { buy: 600, low: 300, lowAt: 0.4 };
const OTHER_PTS = jag(
  [[0, OTHER.buy], [0.12, 520], [0.22, 555], [OTHER.lowAt, OTHER.low], [0.55, 380], [0.68, 345], [0.82, 430], [1, 395]],
  (t, v) => (t < OTHER.lowAt ? Math.min(v, OTHER.buy) : Math.min(Math.max(v, OTHER.low * 1.03), OTHER.buy * 0.82)),
);
const otherY = (v: number) => (v - 260) / (700 - 260);

const BIG: Box = { x: LEFT, y: 270, w: 1080, h: 610 };
const HALF_L: Box = { x: LEFT, y: 270, w: 800, h: 560 };
const HALF_R: Box = { x: 980, y: 270, w: 800, h: 560 };
const SIDE = { x: 1280, w: 500, h: 200, ys: [330, 590] };

/** "Rp10 juta" counting down to "Rp7,9 juta". */
const rupiahJuta = (v: number) => `Rp${Math.abs(v - 10) < 0.05 ? "10" : v.toFixed(1).replace(".", ",")} juta`;
/** Rp10 juta held from 1.880 to 7.300 — the script's "total return sekitar 288%" — is Rp10 juta × 7.300 / 1.880. */
const BALANCE = { start: 10, low: 10 * (1 - 0.21), end: (10 * BANK.sell) / BANK.buy };

// F — the question for you
const ASK = { w: 1300, h: 250, y: 400 };

// G — rising and falling
const UPDN = { w: 600, h: 300, y: 330, gap: 120 };
const updnX = (i: number) => CX + (i === 0 ? -UPDN.gap / 2 - UPDN.w : UPDN.gap / 2);

// H — the routes again
const PICK = { y: 370, gap: 60 };
const pickX = (i: number) => CX + (i - 1) * (ROUTE_CARD.w + PICK.gap) - ROUTE_CARD.w / 2;

/**
 * A chart line: knots in a plot box, drawn up to x = `upTo` (px from the plot's left). `fill`: a soft brand wash under
 * the line, fading to nothing at the plot's floor, drawn along with it (Simon, 22 Oct: "kasih fill area di bawah garis").
 */
const ChartLine = ({ pts, yOf, area, upTo, id, fill = false }: { pts: Knot[]; yOf: (v: number) => number; area: Box; upTo: number; id: string; fill?: boolean }) => {
  if (upTo <= 0.5) return null;
  const xy = pts.map(([t, v]) => [area.x + t * area.w, area.y + (1 - yOf(v)) * area.h]);
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const floor = area.y + area.h;
  const under = `${d} L ${xy[xy.length - 1][0].toFixed(1)} ${floor} L ${xy[0][0].toFixed(1)} ${floor} Z`;
  return (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <clipPath id={id}>
          <rect x={area.x - 20} y={area.y - 80} width={upTo + 20} height={area.h + 160} />
        </clipPath>
        <linearGradient id={`${id}-fill`} x1="0" y1={area.y} x2="0" y2={floor} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={theme.color.connector} stopOpacity={0.18} />
          <stop offset="1" stopColor={theme.color.connector} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill ? <path d={under} fill={`url(#${id}-fill)`} clipPath={`url(#${id})`} /> : null}
      <path d={d} fill="none" stroke={theme.color.neutralDotOn} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#${id})`} />
    </svg>
  );
};

/** A point on a line: a white dot ringed with the brand hairline. */
const Dot = ({ x, y, p }: { x: number; y: number; p: number }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return <div style={{ position: "absolute", left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 3px ${theme.color.connector}`, opacity: p, transform: `scale(${(0.6 + 0.4 * p).toFixed(3)})` }} />;
};

/** A figure by a point: a small word over it, the number under. `anchor` says which side of (x, y) it sits on. */
const Tag = ({ x, y, lead, value, p, anchor = "above" }: { x: number; y: number; lead?: string; value: string; p: number; anchor?: "above" | "right" | "below" }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  const pos =
    anchor === "above" ? { left: x, top: y - 24, transform: "translate(-50%, -100%)", textAlign: "center" as const }
    : anchor === "below" ? { left: x, top: y + 22, transform: "translateX(-50%)", textAlign: "center" as const }
    : { left: x + 26, top: y, transform: "translateY(-50%)", textAlign: "left" as const };
  return (
    <div style={{ position: "absolute", ...pos, opacity: p, whiteSpace: "nowrap" }}>
      {lead ? <div style={{ ...typeStyle("label"), fontSize: 24, color: c.slate }}>{lead}</div> : null}
      <div style={{ ...typeStyle("body"), fontWeight: 600, color: c.ink }}>{value}</div>
    </div>
  );
};

/** A dashed brand hairline. */
const Dash = ({ x1, y1, x2, y2, p = 1 }: { x1: number; y1: number; x2: number; y2: number; p?: number }) =>
  p <= 0.001 ? null : (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme.color.connector} strokeWidth={2.5} strokeDasharray="2 9" strokeLinecap="round" />
    </svg>
  );

/** The depth of a fall: a bracket from the earlier level down to the low. */
const Depth = ({ x, y0, y1, p }: { x: number; y0: number; y1: number; p: number }) =>
  p <= 0.001 ? null : (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
      <line x1={x} y1={y0 + 8} x2={x} y2={y0 + 8 + (y1 - y0 - 22) * p} stroke={theme.color.connector} strokeWidth={2.5} strokeLinecap="round" />
      <path d={`M ${x - 8} ${y0 + 8} L ${x + 8} ${y0 + 8}`} stroke={theme.color.connector} strokeWidth={2.5} strokeLinecap="round" />
      {p > 0.95 ? <path d={`M ${x - 7} ${y1 - 22} L ${x} ${y1 - 14} L ${x + 7} ${y1 - 22}`} fill="none" stroke={theme.color.connector} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
  );

export const SC04 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(4, BLOCK.SC04);
  const g = f + BLOCK.SC04;

  /** SC03's Ombak card growing into this scene's question card; SC03's other pieces letting go. */
  const morph = ease(f, 0, m.sec(0.8));
  const leave = ease(f, 0, m.fade);
  const lerp = (a: number, b: number) => a + (b - a) * morph;
  const defAt = W("“Ombak” adalah");
  const exAt = W("Contohnya");
  const otherAt = W("Tapi saham lain");
  const askAt = W("Jadi pertanyaannya");
  const upAt = W("Saat harga naik");
  const honestAt = W("Yang lebih jujur");
  const panicAt = W("Kalau langsung jual");
  const okAt = W("Kalau belum kuat");

  // B
  const da = plot(DEF);
  const dx = (t: number) => da.x + t * da.w;
  const dy = (v: number) => da.y + (1 - (v - DEF_LO) / (DEF_HI - DEF_LO)) * da.h;
  const defLine = ease(f, defAt + m.sec(0.2), m.sec(1.4));
  const depth = ease(f, W("sempat turun"), m.reveal);
  const peakV = DEF_KNOTS[2][1];
  const lowV = DEF_KNOTS[4][1];
  const shade = DEF_PTS.filter(([t]) => t >= DEF_PEAK && t <= DEF_BACK);

  // C–E: the bank chart, big, then moved aside
  const aside = ease(f, otherAt, m.move);
  const bb = mixBox(BIG, HALF_L, aside);
  const ba = plot(bb, CARD_PAD);
  const bx = (t: number) => ba.x + t * ba.w;
  const by = (v: number) => ba.y + (1 - bankY(v)) * ba.h;
  const leg1 = ease(f, W("sempat turun maksimum"), m.sec(0.8));
  const leg2 = ease(f, W("empat tahun kemudian"), m.sec(1.6));
  const lowX = BANK.lowAt * ba.w;
  const bUpTo = leg2 > 0 ? lowX + (ba.w - lowX) * leg2 : lowX * leg1;
  const drop = ease(f, W("21%"), m.reveal);
  const count = ease(f, W("sempat menjadi"), m.sec(1.0));
  /**
   * The balance: Rp10 juta down to Rp7,9 juta (red), then — as the line climbs to 7.300 — up to Rp38,8 juta (green),
   * the script's +288% (Simon, 22 Oct: "harusnya jadi naik sesuai dengan perhitungan return 288%").
   */
  const balance = BALANCE.start + (BALANCE.low - BALANCE.start) * count + (BALANCE.end - BALANCE.low) * leg2;
  const oa = plot(HALF_R, CARD_PAD);
  const ox = (t: number) => oa.x + t * oa.w;
  const oy = (v: number) => oa.y + (1 - otherY(v)) * oa.h;
  const oLeg1 = ease(f, W("turun ke 300"), m.sec(0.7));
  const oLeg2 = ease(f, W("nggak pernah kembali"), m.sec(1.0));
  const oLowX = OTHER.lowAt * oa.w;
  const oUpTo = oLeg2 > 0 ? oLowX + (oa.w - oLowX) * oLeg2 : oLowX * oLeg1;

  // F
  const open = ease(f, askAt + m.sec(0.1), m.sec(0.9));

  // G
  const honest = ease(f, honestAt, m.move);

  // H
  const pick = ease(f, W("lebih kecil"), m.reveal);

  return (
    <Stage>
      <SoftGround f={g} />

      {/* A — ONE shot with SC03 (no cut; Simon, 22 Oct): it opens on SC03's last picture; the lines and the Kemudi
          card let go, and the Ombak card itself grows into the question — "Pertanyaan 1 · Ombak" becoming
          "Pertanyaan pertama" and, on its words, the question. */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
        <AskLead />
        <AskMain />
        <AskCard i={1} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - ease(f, defAt, m.fade) }}>
        <Card x={lerp(askX(0), Q_CARD.x)} y={lerp(SC03_ASK.y, Q_CARD.y)} w={lerp(SC03_ASK.w, Q_CARD.w)} h={lerp(SC03_ASK.h, Q_CARD.h)} style={{ display: "flex", alignItems: "center", gap: lerp(30, 40), padding: `0 ${lerp(40, 56).toFixed(1)}px` }}>
          <IsoIcon name="waves" h={lerp(100, 120)} />
          <div style={{ position: "relative", flex: 1, height: lerp(SC03_TEXT.h, 150) }}>
            <div style={{ position: "absolute", left: 0, top: 0, ...typeStyle("label"), color: c.slate, whiteSpace: "nowrap", opacity: 1 - morph }}>Pertanyaan 1</div>
            <div style={{ position: "absolute", left: 0, top: 0, ...typeStyle("label"), color: c.slate, whiteSpace: "nowrap", opacity: morph }}>Pertanyaan pertama</div>
            <div style={{ position: "absolute", left: 0, top: SC03_TEXT.titleTop, ...typeStyle("title"), color: c.ink, whiteSpace: "nowrap", opacity: 1 - morph }}>Ombak</div>
            <div style={{ position: "absolute", left: 0, top: 46, width: Q_CARD.w - 112 - 120 - 40, ...typeStyle("title"), fontWeight: 500, color: c.ink, opacity: ease(f, W("seberapa besar ombak"), m.reveal) }}>Seberapa besar ombak yang sanggup kamu hadapi?</div>
          </div>
        </Card>
      </div>
      <Appear at={defAt} style={{ left: 0, top: 0 }}>
        <Heading n={1} text="Seberapa besar ombak yang sanggup kamu hadapi?" />
      </Appear>

      {/* B — what a wave is */}
      <Appear at={defAt} out={exAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {depth > 0.001 ? (
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, opacity: depth }}>
            <polygon points={[[DEF_PEAK, peakV] as Knot, ...shade, [DEF_BACK, peakV] as Knot].map(([t, v]) => `${dx(t).toFixed(1)},${dy(v).toFixed(1)}`).join(" ")} fill={theme.color.indigoWash} opacity={0.7} />
          </svg>
        ) : null}
        <ChartLine pts={DEF_PTS} yOf={(v) => (v - DEF_LO) / (DEF_HI - DEF_LO)} area={da} upTo={da.w * defLine} id="vi04-sc04-def" />
        <Dash x1={dx(DEF_PEAK)} y1={dy(peakV)} x2={dx(DEF_BACK) + 40} y2={dy(peakV)} p={depth} />
        <Depth x={dx(DEF_LOW)} y0={dy(peakV)} y1={dy(lowV)} p={depth} />
        <Dot x={dx(DEF_LOW)} y={dy(lowV)} p={depth} />
        <Appear at={W("sempat turun") + m.sec(0.2)} style={{ left: dx(DEF_LOW), top: dy(peakV) - 24, transform: "translate(-50%, -100%)", textAlign: "center" }}>
          <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>“Ombak”</div>
        </Appear>
      </Appear>

      {/* C–E — the bank stock, then beside another one */}
      <Appear at={exAt} out={askAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Card x={bb.x} y={bb.y} w={bb.w} h={bb.h} />
        <Appear at={W("Mei 2020")} style={{ left: bb.x + CARD_PAD.l, top: bb.y + 36 }}>
          <div style={{ ...typeStyle("label"), color: c.slate, whiteSpace: "nowrap" }}>
            Mei 2020 · <span style={{ color: c.ink }}>sebuah saham bank</span>
          </div>
        </Appear>
        <ChartLine pts={BANK_PTS} yOf={bankY} area={ba} upTo={bUpTo} id="vi04-sc04-bank" fill />
        <Dash x1={bx(0)} y1={by(BANK.buy)} x2={bx(BANK.lowAt) + 40} y2={by(BANK.buy)} p={drop * (1 - aside)} />
        <Depth x={bx(BANK.lowAt)} y0={by(BANK.buy)} y1={by(BANK.low)} p={drop * (1 - aside)} />
        <Dot x={bx(0)} y={by(BANK.buy)} p={ease(f, W("1.880"), m.reveal)} />
        <Tag x={bx(0) + 10} y={by(BANK.buy)} lead="Beli" value="1.880" p={ease(f, W("1.880"), m.reveal)} />
        <Dot x={bx(BANK.lowAt)} y={by(BANK.low)} p={drop} />
        <Tag x={bx(BANK.lowAt)} y={by(BANK.low)} lead="turun maks. sekitar" value="21%" p={drop * (1 - aside)} anchor="below" />
        <Dot x={bx(1)} y={by(BANK.sell)} p={ease(f, W("7.300"), m.reveal)} />
        <Tag x={bx(1) - 10} y={by(BANK.sell)} lead="Dijual" value="7.300" p={ease(f, W("7.300"), m.reveal)} />

        <Appear at={W("Rp10 juta")} out={otherAt} style={{ left: 0, top: 0 }}>
          <Card x={SIDE.x} y={SIDE.ys[0]} w={SIDE.w} h={SIDE.h} style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 44px" }}>
            <div style={{ ...typeStyle("label"), color: c.slate }}>Balance</div>
            {/* turns red as it falls (Simon, 22 Oct), the same red as SC03's −30% */}
            <div style={{ marginTop: 6, ...typeStyle("statement"), fontSize: 64, color: interpolateColors(balance, [BALANCE.start - 0.7, BALANCE.start - 0.05, BALANCE.start + 0.05, BALANCE.start + 0.7], [theme.color.calendarRed, c.ink, c.ink, theme.color.checkGreen]), whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{rupiahJuta(balance)}</div>
          </Card>
        </Appear>
        <Appear at={W("total return") + m.sec(0.3)} out={otherAt} style={{ left: 0, top: 0 }}>
          <Card x={SIDE.x} y={SIDE.ys[1]} w={SIDE.w} h={SIDE.h} style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 44px" }}>
            <div style={{ ...typeStyle("label"), color: c.slate }}>Total return sekitar</div>
            <div style={{ marginTop: 6, ...typeStyle("statement"), fontSize: 64, color: c.indigo, opacity: ease(f, W("288%"), m.reveal) }}>+288%</div>
          </Card>
        </Appear>

        {/* E — another stock */}
        <Appear at={otherAt + m.sec(0.3)} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <Card x={HALF_R.x} y={HALF_R.y} w={HALF_R.w} h={HALF_R.h} />
          <div style={{ position: "absolute", left: HALF_R.x + CARD_PAD.l, top: HALF_R.y + 36, ...typeStyle("label"), color: c.ink, whiteSpace: "nowrap" }}>Saham lain</div>
          <Dash x1={ox(0)} y1={oy(OTHER.buy)} x2={ox(1)} y2={oy(OTHER.buy)} p={ease(f, W("beli di 600"), m.reveal)} />
          <Appear at={W("harga beli")} style={{ left: ox(1), top: oy(OTHER.buy) - 12, transform: "translate(-100%, -100%)" }}>
            <div style={{ ...typeStyle("label"), color: c.indigo, whiteSpace: "nowrap" }}>Harga beli</div>
          </Appear>
          <ChartLine pts={OTHER_PTS} yOf={otherY} area={oa} upTo={oUpTo} id="vi04-sc04-other" fill />
          <Dot x={ox(0)} y={oy(OTHER.buy)} p={ease(f, W("beli di 600"), m.reveal)} />
          <Tag x={ox(0) + 10} y={oy(OTHER.buy)} lead="Beli" value="600" p={ease(f, W("beli di 600"), m.reveal)} />
          <Dot x={ox(OTHER.lowAt)} y={oy(OTHER.low)} p={ease(f, W("turun ke 300"), m.reveal)} />
          <Tag x={ox(OTHER.lowAt)} y={oy(OTHER.low)} value="300" p={ease(f, W("turun ke 300"), m.reveal)} anchor="right" />
        </Appear>
        <Appear at={W("Dua-duanya")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={900} w={theme.canvas.width} align="center" size={48} weight={500} text="Dua-duanya bisa terjadi." mark="bisa terjadi" />
        </Appear>
      </Appear>

      {/* F — the question for you: a dashed amber box opening from its centre */}
      <Appear at={askAt} out={upAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <div style={{ position: "absolute", left: CX - (ASK.w * open) / 2, top: ASK.y, width: ASK.w * open, height: ASK.h, borderRadius: theme.shape.cardRadius, border: `2px dashed ${theme.color.selfAmber}`, background: c.cardBg, boxSizing: "border-box", opacity: Math.min(1, open * 3) }} />
        <div style={{ position: "absolute", left: CX - ASK.w / 2, top: ASK.y, width: ASK.w, height: ASK.h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: ease(f, askAt + m.sec(0.5), m.reveal) }}>
          <div style={{ ...typeStyle("label"), color: theme.color.selfAmberInk }}>Jadi pertanyaannya:</div>
          <div style={{ width: ASK.w - 160, textAlign: "center", ...typeStyle("title"), fontWeight: 500, lineHeight: 1.25, color: c.ink, opacity: ease(f, W("“Kalau ini"), m.reveal) }}>“Kalau ini terjadi ke uangku, aku masih sanggup lanjut nggak?”</div>
        </div>
      </Appear>

      {/* G — when it rises, when it falls */}
      <Appear at={upAt} out={okAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {(
          [
            { at: upAt, lead: "Saat harga naik", text: "semua orang bisa merasa berani.", textAt: "semua orang", rise: true },
            { at: honestAt, lead: "Saat market benar-benar turun", text: "apa yang kita lakukan?", textAt: "apa yang kita", rise: false },
          ] as const
        ).map((k, i) => (
          <Appear key={k.lead} at={k.at} style={{ left: 0, top: 0 }}>
            <Card x={updnX(i)} y={UPDN.y} w={UPDN.w} h={UPDN.h} style={{ opacity: i === 0 ? 1 - 0.5 * honest : 1 }}>
              <svg width={UPDN.w} height={120} style={{ position: "absolute", left: 0, top: 36 }}>
                <polyline points={(k.rise ? [[60, 96], [150, 70], [210, 84], [300, 46], [360, 58], [440, 18]] : [[60, 18], [150, 44], [210, 32], [300, 70], [360, 58], [440, 100]]).map((p) => p.join(",")).join(" ")} fill="none" stroke={theme.color.neutralDotOn} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={440} cy={k.rise ? 18 : 100} r={8} fill={c.cardBg} stroke={theme.color.connector} strokeWidth={3} />
              </svg>
              <div style={{ position: "absolute", left: 60, top: 170, width: UPDN.w - 120 }}>
                <div style={{ ...typeStyle("label"), color: c.slate }}>{k.lead}</div>
                <div style={{ marginTop: 6, ...typeStyle("body"), color: c.ink, opacity: ease(f, W(k.textAt), m.reveal) }}>{k.text}</div>
              </div>
            </Card>
          </Appear>
        ))}
        <Connector a={{ x: updnX(0) + UPDN.w, y: UPDN.y + UPDN.h / 2 }} b={{ x: updnX(1), y: UPDN.y + UPDN.h / 2 }} p={ease(f, honestAt, m.sec(0.5))} shape="curve" />
        <Connector a={{ x: updnX(1) + UPDN.w / 2, y: UPDN.y + UPDN.h }} b={{ x: updnX(1) + UPDN.w / 2, y: 750 }} p={ease(f, panicAt, m.sec(0.5))} shape="curve" axis="y" />
        <Appear at={panicAt + m.sec(0.3)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={updnX(0)} y={830} w={updnX(1) + UPDN.w - updnX(0)} align="center" size={40} weight={500} text="Kalau langsung jual karena panik, mungkin ombaknya memang terlalu besar buat kita." mark="terlalu besar" />
        </Appear>
      </Appear>

      {/* H — no problem: the smaller waves */}
      <Appear at={okAt} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={0} y={290} w={theme.canvas.width} align="center" size={44} weight={500} text="Kalau belum kuat, nggak masalah." />
      </Appear>
      {ROUTE_CARDS.map((r, i) => (
        <Appear key={r.name} at={W("Pilih jalur") - m.sec(0.3) + m.sec(0.1) * i} style={{ left: 0, top: 0 }}>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: i === 0 ? 1 : 1 - 0.55 * pick }}>
            <RouteCard i={i} x={pickX(i)} y={PICK.y} draw={1} line={i === 0 && pick > 0.5 ? theme.color.connector : undefined} />
          </div>
        </Appear>
      ))}
      <Appear at={W("Pilih jalur")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={0} y={820} w={theme.canvas.width} align="center" size={44} weight={500} text="Pilih jalur dengan ombak yang lebih kecil." mark="ombak yang lebih kecil" />
      </Appear>
    </Stage>
  );
};
