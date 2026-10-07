/**
 * PART 01 — UANG YANG IKUT BEKERJA · SC04–SC08.
 *
 * The flow from the cold open gets its third node (Aset); compounding is shown
 * as bars that grow on the spoken numbers; the habit beats the lump sum; the
 * two kinds of asset get their colours (indigo human, cyan financial), and
 * those colours carry into the life-long picture and the relay.
 */
import { useCurrentFrame } from "remotion";
import { Stage, theme, useMotion, usePalette } from "../../../core";
import { BLOCK, LIST_TRANS, SC04_TITLE, SC04 as B4, SC05 as B5, SC06 as B6, SC07 as B7, SC08 as B8, local } from "../data/timing";
import { ease, Pill, Sheet, Icon, Link, Node, Say, nodeEdge, useLife, type IconName, type NodeBox } from "../components/kit";

/** An icon and a word on one line — a row of a list. */
const Item = ({ x, y, icon, label, tone, at, size = 44 }: { x: number; y: number; icon: IconName; label: string; tone: "indigo" | "cyan"; at: number; size?: number }) => {
  const c = usePalette();
  const ink = tone === "indigo" ? c.indigo : theme.color.cyanInk;
  return (
    <Say x={x} y={y} at={at} anchor="left" size={size} weight={600}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 22 }}>
        <Icon name={icon} size={size * 1.3} color={ink} />
        {label}
      </span>
    </Say>
  );
};

// ═══ SC04 — passive income: keep working, and part of it becomes an asset ══
const FLOW: NodeBox[] = [
  { x: 220, y: 500, w: 330, h: 150 },
  { x: 720, y: 500, w: 420, h: 150 },
  { x: 1320, y: 500, w: 340, h: 150 },
];

export const SC04 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC04);
  const c = usePalette();
  const clear = L(B4.bedanya) - 20;
  /* the title is the word Scene Transisi 1 carried here: it is simply there
     from the hand-off on, never fading in */
  const handoff = L(LIST_TRANS.handoff);
  return (
    <Stage>
      {f >= handoff ? (
        <Say text="Passive Income" x={960} y={SC04_TITLE.y} at={handoff - m.reveal} size={SC04_TITLE.size} weight={800} color={c.indigo} />
      ) : null}
      <Say
        text="Investasi hari ini  →  besok berhenti kerja"
        x={960}
        y={420}
        at={L(B4.bukan)}
        out={clear}
        size={50}
        weight={600}
        color={c.slate}
        strikeAt={L(B4.strike)}
      />
      {["Tetap kerja", "Tetap bangun karier", "Tetap belajar"].map((label, i) => (
        <Pill key={label} label={label} x={[520, 960, 1400][i]} y={590} at={L(B4.tetap[i])} out={clear} check size={40} />
      ))}
      <Node box={FLOW[0]} label="Kerja" icon="briefcase" at={L(B4.bedanya)} size={40} />
      <Link a={nodeEdge(FLOW[0], "r")} b={nodeEdge(FLOW[1], "l")} at={L(B4.sebagian) - 10} />
      <Node box={FLOW[1]} label="Penghasilan" icon="wallet" at={L(B4.sebagian)} size={40} />
      <Link a={nodeEdge(FLOW[1], "r")} b={nodeEdge(FLOW[2], "l")} at={L(B4.aset) - 50} tone="cyan" />
      <Say text="sebagian" x={(FLOW[1].x + FLOW[1].w + FLOW[2].x) / 2} y={FLOW[1].y - 36} at={L(B4.aset) - 50} size={32} weight={600} color={theme.color.cyanInk} />
      <Node box={FLOW[2]} label="Aset" icon="box" tone="cyan" at={L(B4.aset)} size={40} />
    </Stage>
  );
};


// ═══ SC05 — compounding, on the spoken numbers ════════════════════════════
const VALUES = [100, 110, 121, 133];
/** How much of each step's growth came from earlier growth (profit on profit). */
const ON_PROFIT = [0, 0, 1, 2.1];
const BARS = { base: 860, unit: 2.6, w: 180, x: [600, 860, 1120, 1380] };
/** Each step's growth sits on the old value with a hairline of air, so both keep round corners. */
const GAP = 5;
const CHAIN: NodeBox[] = [
  { x: 250, y: 290, w: 280, h: 120 },
  { x: 700, y: 290, w: 380, h: 120 },
  { x: 1250, y: 290, w: 470, h: 120 },
];

export const SC05 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC05);
  const chainOut = L(B5.compounding) - 30;
  const chainDim = ease(f, L(B5.bars[0]) - 30, m.fade);
  const axis = ease(f, L(B5.axis), m.move);
  return (
    <Stage>
      <Say text="Waktu punya peran besar" x={960} y={180} at={L(B5.axis)} out={L(B5.compounding) - 20} size={56} />
      <Say text="Compounding" x={960} y={170} at={L(B5.compounding)} size={84} weight={800} color={theme.color.cyanInk} />
      <Say text="hasil yang terus ikut bertumbuh seiring waktu" x={960} y={262} at={L(B5.line)} size={40} weight={600} color={c.slate} />

      <div style={{ opacity: 1 - 0.55 * chainDim }}>
        <Node box={CHAIN[0]} label="Aset" icon="box" tone="cyan" at={L(B5.kalau)} out={chainOut} size={36} />
        <Link a={nodeEdge(CHAIN[0], "r")} b={nodeEdge(CHAIN[1], "l")} at={L(B5.kalau) + 40} tone="cyan" out={chainOut} />
        <Node box={CHAIN[1]} label="Keuntungan" icon="coin" tone="cyan" at={L(B5.kalau) + 80} out={chainOut} size={36} />
        <Link a={nodeEdge(CHAIN[1], "r")} b={nodeEdge(CHAIN[2], "l")} at={L(B5.lagi)} tone="cyan" out={chainOut} />
        <Node box={CHAIN[2]} label="Keuntungan berikutnya" icon="coin" tone="cyan" at={L(B5.lagi) + 60} out={chainOut} size={36} />
      </div>

      {/* the time axis the bars stand on */}
      {axis > 0.001 ? (
        <>
          <div style={{ position: "absolute", left: 440, top: BARS.base, width: 1120 * axis, height: theme.shape.rule, background: c.slate }} />
          <Say text="waktu →" x={1560} y={BARS.base + 40} at={L(B5.axis) + 20} anchor="right" size={30} weight={600} color={c.slate} />
        </>
      ) : null}

      {VALUES.map((v, i) => {
        const at = L(B5.bars[i]);
        const grow = ease(f, at, 22);
        if (grow <= 0.001) return null;
        const prev = i === 0 ? v : VALUES[i - 1];
        const h = v * BARS.unit * grow;
        const prevH = (i === 0 ? v : prev) * BARS.unit * grow;
        const extra = ON_PROFIT[i] * BARS.unit * grow;
        const x = BARS.x[i] - BARS.w / 2;
        return (
          <div key={v}>
            {/* what was already there */}
            <div style={{ position: "absolute", left: x, top: BARS.base - prevH, width: BARS.w, height: prevH, background: c.cyanSoft, border: `${theme.shape.rule}px solid ${c.cyan}`, borderRadius: 12, boxSizing: "border-box" }} />
            {/* this step's growth, and the part of it that grew on growth */}
            {i > 0 ? (
              <>
                <div style={{ position: "absolute", left: x, top: BARS.base - h - GAP, width: BARS.w, height: h - prevH, background: c.cyan, borderRadius: 12 }} />
                {extra > 0.5 ? <div style={{ position: "absolute", left: x, top: BARS.base - h - 2 * GAP - extra, width: BARS.w, height: extra + GAP, background: theme.color.cyanInk, borderRadius: 12 }} /> : null}
              </>
            ) : null}
            <Say text={String(v)} x={BARS.x[i]} y={BARS.base - h - 52} at={at} size={52} weight={800} color={i === 0 ? c.ink : theme.color.cyanInk} />
          </div>
        );
      })}
    </Stage>
  );
};

// ═══ SC06 — the habit, not the lump sum ══════════════════════════════════
const HABIT = { x: 1060, y: 330, cell: 76, gap: 12, cols: 7, rows: 4 };
const LOOP: NodeBox[] = [
  { x: 420, y: 290, w: 360, h: 130 },
  { x: 700, y: 640, w: 420, h: 130 },
  { x: 140, y: 640, w: 360, h: 130 },
];
/** The skill bar steps up once per turn of the loop — on the loop's own beats. */
const SKILL = { x: 1380, w: 150, base: 860, heights: [130, 250, 370, 500] };
const SKILL_STEPS = [B6.belajar, B6.evaluasi, B6.baik, B6.kelola];

export const SC06 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const L = (g: number) => local(g, BLOCK.SC06);
  const firstOut = L(B6.loop) - 30;
  const lump = useLife(L(B6.modal), L(B6.bukanUang));
  const habit = useLife(L(B6.habit), firstOut);
  const skillH = SKILL_STEPS.reduce((h, s, i) => h + (SKILL.heights[i] - (SKILL.heights[i - 1] ?? 0)) * ease(f, L(s), 24), 0);
  return (
    <Stage>
      {/* "modal besar dulu?" — a stack of coins, struck */}
      {lump > 0.001 ? (
        <div style={{ opacity: lump }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ position: "absolute", left: 440 + k * 60, top: 300 + (k % 2) * 40 }}>
              <Icon name="coin" size={170} color={theme.color.cyanInk} stroke={2.6} />
            </div>
          ))}
        </div>
      ) : null}
      <Say text="Modal besar dulu?" x={600} y={600} at={L(B6.modal)} out={L(B6.bukanUang)} size={52} strikeAt={L(B6.strike)} />

      {/* the habit: a month of ticks, one a day */}
      {habit > 0.001 ? (
        <div style={{ opacity: habit }}>
          <Say text="Kebiasaan" x={HABIT.x} y={HABIT.y - 70} at={L(B6.habitName)} anchor="left" size={56} weight={800} color={c.indigo} />
          {Array.from({ length: HABIT.cols * HABIT.rows }, (_, i) => {
            const on = ease(f, L(B6.habit) + 24 + i * 5, 10);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: HABIT.x + (i % HABIT.cols) * (HABIT.cell + HABIT.gap),
                  top: HABIT.y + Math.floor(i / HABIT.cols) * (HABIT.cell + HABIT.gap),
                  width: HABIT.cell,
                  height: HABIT.cell,
                  borderRadius: 14,
                  background: on > 0.5 ? theme.color.indigoWashStrong : c.cardBg,
                  border: `${theme.shape.hairline}px solid ${on > 0.5 ? c.indigo : c.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {on > 0.001 ? <div style={{ opacity: on }}><Icon name="check" size={46} color={c.indigo} stroke={4} /></div> : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* the loop that makes the skill */}
      <Say text="Bukan cuma soal uang" x={960} y={180} at={L(B6.bukanUang)} size={56} />
      <Node box={LOOP[0]} label="Belajar" icon="book" at={L(B6.belajar)} size={38} />
      <Link a={{ x: LOOP[0].x + LOOP[0].w, y: LOOP[0].y + 90 }} b={{ x: LOOP[1].x + LOOP[1].w / 2, y: LOOP[1].y }} at={L(B6.toEvaluasi)} />
      <Node box={LOOP[1]} label="Evaluasi keputusan" icon="check" at={L(B6.evaluasi)} size={38} />
      <Link a={nodeEdge(LOOP[1], "l")} b={nodeEdge(LOOP[2], "r")} at={L(B6.toKelola)} />
      <Node box={LOOP[2]} label="Kelola aset" icon="box" tone="cyan" at={L(B6.kelola)} size={38} />
      <Link a={{ x: LOOP[2].x + LOOP[2].w / 2, y: LOOP[2].y }} b={{ x: LOOP[0].x, y: LOOP[0].y + 90 }} at={L(B6.kelola) + 20} />

      {/* and the skill, a step per turn */}
      {skillH > 0.5 ? (
        <>
          <div style={{ position: "absolute", left: SKILL.x, top: SKILL.base - skillH - 6, width: SKILL.w, height: skillH, background: c.indigo, borderRadius: 14 }} />
          <div style={{ position: "absolute", left: SKILL.x - 40, top: SKILL.base, width: SKILL.w + 80, height: theme.shape.rule, background: c.slate }} />
        </>
      ) : null}
      <Say text="Kemampuan" x={SKILL.x + SKILL.w / 2} y={SKILL.base + 44} at={L(SKILL_STEPS[0])} size={36} weight={700} color={c.indigo} />
      <Say text="semakin baik" x={SKILL.x + SKILL.w + 40} y={SKILL.base - 480} at={L(B6.baik)} anchor="left" size={36} weight={700} color={c.indigo} />
    </Stage>
  );
};

// ═══ SC07 — human asset vs financial asset ═══════════════════════════════
const HALF = { y: 210, w: 780, h: 690, left: 140, right: 1000 };

export const SC07 = () => {
  const c = usePalette();
  const L = (g: number) => local(g, BLOCK.SC07);
  const rows = (x: number, items: [IconName, string][], ats: readonly number[], tone: "indigo" | "cyan") =>
    items.map(([icon, label], i) => (
      <Item key={label} x={x} y={HALF.y + 220 + i * 105} icon={icon} label={label} tone={tone} at={L(ats[i])} />
    ));
  return (
    <Stage>
      <Say text="Kekayaan kita punya dua bagian" x={960} y={122} at={L(B7.split) - 20} size={48} />
      <Sheet x={HALF.left} y={HALF.y} w={HALF.w} h={HALF.h} at={L(B7.split)} />
      <Sheet x={HALF.right} y={HALF.y} w={HALF.w} h={HALF.h} at={L(B7.split) + 8} />
      <Say text="Human Asset" x={HALF.left + HALF.w / 2} y={HALF.y + 90} at={L(B7.human)} size={60} weight={800} color={c.indigo} />
      <Say text="Financial Asset" x={HALF.right + HALF.w / 2} y={HALF.y + 90} at={L(B7.financial)} size={60} weight={800} color={theme.color.cyanInk} />
      {rows(HALF.left + 120, [["clock", "Waktu"], ["spark", "Kemampuan"], ["book", "Pengalaman"]], B7.humanRows, "indigo")}
      {rows(HALF.right + 120, [["jar", "Tabungan"], ["chart", "Investasi"], ["box", "Aset"]], B7.financialRows, "cyan")}
      <div style={{ position: "absolute", left: HALF.left + 60, top: HALF.y + 548, width: HALF.w - 120, height: theme.shape.hairline, background: c.border }} />
      <div style={{ position: "absolute", left: HALF.right + 60, top: HALF.y + 548, width: HALF.w - 120, height: theme.shape.hairline, background: c.border }} />
      <Item x={HALF.left + 120} y={HALF.y + 620} icon="hourglass" label="Punya batas" tone="indigo" at={L(B7.batas)} size={46} />
      <Item x={HALF.right + 120} y={HALF.y + 620} icon="chart" label="Bisa terus dimiliki" tone="cyan" at={L(B7.terus)} size={46} />
    </Stage>
  );
};

// ═══ SC08 — over a working life, then the relay ══════════════════════════
const LIFE = { x0: 260, x1: 1660, base: 800, top: 300 };
/** Illustrative shapes, not data: work rises and eases off; assets keep growing. */
const work = (t: number) => 150 + 120 * Math.sin(Math.PI * Math.min(1, t * 0.95));
const asset = (t: number) => 18 + 300 * Math.pow(t, 1.7);
const RELAY: NodeBox[] = [
  { x: 220, y: 480, w: 360, h: 150 },
  { x: 1340, y: 480, w: 360, h: 150 },
];

export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC08);
  const chartOut = L(B8.estafet) - 24;
  const life = useLife(L(B8.muda) - 10, chartOut);
  /** Drawn left to right: youth first, then the rest under "Tapi idealnya". */
  const reach = 0.3 * ease(f, L(B8.muda), 60) + 0.7 * ease(f, L(B8.idealnya), L(B8.tumbuh) - L(B8.idealnya) + 30);
  const N = 60;
  const pts = Array.from({ length: N + 1 }, (_, i) => i / N);
  const X = (t: number) => LIFE.x0 + (LIFE.x1 - LIFE.x0) * t;
  const workPath = `M${X(0)},${LIFE.base} ` + pts.map((t) => `L${X(t)},${LIFE.base - work(t)}`).join(" ") + ` L${X(1)},${LIFE.base} Z`;
  const assetPath =
    `M${X(0)},${LIFE.base - work(0)} ` +
    pts.map((t) => `L${X(t)},${LIFE.base - work(t) - asset(t)}`).join(" ") +
    " " +
    [...pts].reverse().map((t) => `L${X(t)},${LIFE.base - work(t)}`).join(" ") +
    " Z";
  /** The baton: from the worker's hand to the asset's, under "kita teruskan". */
  const pass = ease(f, L(B8.teruskan), L(B8.aset) - L(B8.teruskan));
  /** The baton's centre, from beside the worker's node to beside the asset's. */
  const from = RELAY[0].x + RELAY[0].w + 130;
  const bx = from + (RELAY[1].x - 130 - from) * pass;
  const baton = ease(f, L(B8.kerja) + 40, m.reveal);
  return (
    <Stage>
      {life > 0.001 ? (
        <div style={{ opacity: life }}>
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <clipPath id="vi01-life-reach">
                <rect x={0} y={0} width={X(reach)} height={theme.canvas.height} />
              </clipPath>
            </defs>
            <g clipPath="url(#vi01-life-reach)">
              <path d={workPath} fill={theme.color.indigoWashStrong} stroke={c.indigo} strokeWidth={3} />
              <path d={assetPath} fill={theme.color.hlCyan} stroke={theme.color.cyanInk} strokeWidth={3} />
            </g>
            <line x1={LIFE.x0} y1={LIFE.base} x2={LIFE.x1} y2={LIFE.base} stroke={c.slate} strokeWidth={theme.shape.rule} />
          </svg>
          <Say text="Muda" x={LIFE.x0} y={LIFE.base + 42} at={L(B8.muda)} anchor="left" size={34} weight={600} color={c.slate} />
          <Say text="Tua" x={LIFE.x1} y={LIFE.base + 42} at={L(B8.idealnya)} anchor="right" size={34} weight={600} color={c.slate} />
          <Say text="Dari kerja" x={X(0.12)} y={LIFE.base - 80} at={L(B8.muda) + 30} anchor="left" size={36} weight={700} color={c.indigo} />
          <Say text="Dari aset" x={X(0.86)} y={LIFE.base - work(0.86) - asset(0.86) / 2} at={L(B8.tumbuh)} anchor="right" size={36} weight={700} color={theme.color.cyanInk} />
          <Say text="Saat income naik, aset ikut tumbuh" x={960} y={180} at={L(B8.idealnya)} size={48} />
        </div>
      ) : null}

      <Say text="Seperti estafet" x={960} y={220} at={L(B8.estafet)} size={60} weight={800} />
      <Node box={RELAY[0]} label="Kerja" icon="briefcase" at={L(B8.kerja)} size={42} />
      {f >= L(B8.estafet) ? (
        <div
          style={{
            position: "absolute",
            left: RELAY[0].x + RELAY[0].w + 60,
            top: RELAY[0].y + RELAY[0].h / 2,
            width: RELAY[1].x - RELAY[0].x - RELAY[0].w - 120,
            height: 0,
            borderTop: `${theme.shape.rule}px dashed ${c.muted}`,
            opacity: ease(f, L(B8.estafet) + 20, m.fade),
          }}
        />
      ) : null}
      {baton > 0.001 ? (
        <div style={{ position: "absolute", left: bx - 90, top: RELAY[0].y + 28, opacity: baton }}>
          <div
            style={{
              width: 180,
              height: 94,
              borderRadius: 999,
              background: pass > 0.5 ? theme.color.cyanInk : c.indigo,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              color: c.cardBg,
              fontFamily: theme.text.family,
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            <Icon name="coin" size={44} color={c.cardBg} />
            Uang
          </div>
        </div>
      ) : null}
      <Node box={RELAY[1]} label="Aset" icon="box" tone="cyan" at={L(B8.teruskan) + 60} size={42} filled={ease(f, L(B8.aset), 20)} />
    </Stage>
  );
};

