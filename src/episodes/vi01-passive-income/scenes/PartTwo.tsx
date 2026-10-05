/**
 * PART 02 — IKUT PUNYA BISNIS · SC09–SC12.
 *
 * One company, two ways to be connected to it (karyawan: gaji; investor: a
 * small slice); the products around us, turned over to show the companies
 * behind them; the business wheel and the owner's share of its growth; and
 * the small, regular slice that is the actual habit.
 *
 * ⚠ NO LOGOS. Companies are a name and their ticker on a card — never a
 * brand's mark redrawn. No price, no recommendation.
 */
import { useCurrentFrame } from "remotion";
import { Stage, theme, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK, SC09 as B9, SC10 as B10, SC11 as B11, SC12 as B12, local } from "../data/timing";
import { ease, Pill, Icon, Link, Node, Say, Worker, nodeEdge, type IconName, type NodeBox } from "../components/kit";

// ═══ SC09 — one company: the employee and the investor ═══════════════════
const COMPANY: NodeBox = { x: 760, y: 330, w: 400, h: 250 };
const INVESTOR: NodeBox = { x: 1420, y: 560, w: 340, h: 150 };

export const SC09 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC09);
  /** The slice: lifts off the company's corner and lands in the investor's hands. */
  const fly = ease(f, L(B9.slice), 40);
  const slice = ease(f, L(B9.slice) - 10, m.fade);
  const sx = COMPANY.x + COMPANY.w - 40 + (INVESTOR.x + INVESTOR.w / 2 - 30 - (COMPANY.x + COMPANY.w - 40)) * fly;
  const sy = COMPANY.y + 20 + (INVESTOR.y - 80 - (COMPANY.y + 20)) * fly;
  return (
    <Stage>
      <Say text="Ikut memiliki sebagian bisnis" x={960} y={190} at={L(B9.nggak)} size={52} />
      <Node box={COMPANY} label="Perusahaan" icon="building" layout="column" at={L(B9.company)} out={L(B9.bca) - 4} size={44} />
      <Node box={COMPANY} label="Bank Central Asia" sub="BBCA" icon="building" layout="column" at={L(B9.bca)} size={42} />

      {/* the employee: work goes in, salary comes back */}
      <Worker x={330} y={925} h={600} at={L(B9.karyawan)} poses={[[0, 1]]} />
      <Say text="Karyawan" x={330} y={300} at={L(B9.karyawan)} size={44} weight={800} color={c.indigo} />
      <Link a={{ x: 520, y: 470 }} b={nodeEdge(COMPANY, "l")} at={L(B9.karyawan) + 30} />
      <Say text="kerja" x={640} y={430} at={L(B9.karyawan) + 40} size={32} weight={600} color={c.indigo} />
      <Link a={{ x: COMPANY.x, y: COMPANY.y + COMPANY.h - 50 }} b={{ x: 520, y: 600 }} at={L(B9.gaji)} />
      <Say text="gaji" x={640} y={600} at={L(B9.gaji) + 10} size={32} weight={600} color={c.indigo} />

      {/* the investor: no work arrow — a small slice of the business */}
      <Node box={INVESTOR} label="Investor" icon="person" tone="cyan" at={L(B9.investor) + 40} size={42} />
      {slice > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: sx,
            top: sy,
            width: 60,
            height: 60,
            borderRadius: 12,
            background: theme.color.cyanInk,
            opacity: slice,
            boxShadow: shadow.lift,
          }}
        />
      ) : null}
      <Say text="sebagian kecil bisnisnya" x={INVESTOR.x + INVESTOR.w / 2} y={INVESTOR.y + INVESTOR.h + 50} at={L(B9.slice) + 30} size={34} weight={700} color={theme.color.cyanInk} />
    </Stage>
  );
};

// ═══ SC10 — the products around us, and who is behind them ═══════════════
const SHELF = { y: 330, w: 330, h: 300, x: [420, 800, 1180, 1560] };
const FRONT: { label: string; icon: IconName }[] = [
  { label: "Indomie", icon: "bowl" },
  { label: "Ultra Milk", icon: "milk" },
  { label: "Produk lain", icon: "box" },
  { label: "Produk lain", icon: "box" },
];
const BACK: { label: string; sub: string }[] = [
  { label: "Indofood CBP", sub: "ICBP" },
  { label: "Ultrajaya", sub: "ULTJ" },
  { label: "Perusahaan", sub: "Tbk" },
  { label: "Perusahaan", sub: "Tbk" },
];

export const SC10 = () => {
  const c = usePalette();
  const L = (g: number) => local(g, BLOCK.SC10);
  return (
    <Stage>
      <Say text="Ada di sekitar kita setiap hari" x={960} y={190} at={L(B10.around)} size={52} />
      {SHELF.x.map((cx, i) => {
        const box = { x: cx - SHELF.w / 2, y: SHELF.y, w: SHELF.w, h: SHELF.h };
        return (
          <div key={i}>
            <Node box={box} label={FRONT[i].label} icon={FRONT[i].icon} layout="column" at={L(B10.products[i])} out={L(B10.flip) + i * 6} size={40} />
            <Node box={box} label={BACK[i].label} sub={BACK[i].sub} icon="building" layout="column" tone="cyan" at={L(B10.flip) + 14 + i * 6} size={38} />
          </div>
        );
      })}
      <Say text="Sebagai konsumen: kita menikmati produknya" x={960} y={740} at={L(B10.konsumen)} out={L(B10.flip)} size={44} color={c.indigo} />
      <Say text="Lewat investasi: ikut punya sebagian kecil bisnisnya" x={960} y={740} at={L(B10.pemilik)} size={44} color={theme.color.cyanInk} />
    </Stage>
  );
};

// ═══ SC11 — earning money vs building assets; the business wheel ═════════
const WHEEL = { cx: 900, cy: 620 };
const SPOKES: NodeBox[] = [
  { x: WHEEL.cx - 170, y: WHEEL.cy - 250, w: 340, h: 116 },
  { x: WHEEL.cx + 80, y: WHEEL.cy + 120, w: 300, h: 116 },
  { x: WHEEL.cx - 380, y: WHEEL.cy + 120, w: 330, h: 116 },
];
const OWNER: NodeBox = { x: 1420, y: 520, w: 340, h: 150 };

export const SC11 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const L = (g: number) => local(g, BLOCK.SC11);
  /** The wheel grows a little with each turn. */
  const grow = 0.92 + 0.05 * B11.steps.reduce((s, g) => s + ease(f, L(g), 30), 0);
  return (
    <Stage>
      <Say text="Menghasilkan uang" x={560} y={190} at={L(B11.uang)} size={52} weight={800} color={c.indigo} />
      <Say text="vs" x={960} y={190} at={L(B11.aset) - 20} size={40} weight={600} color={c.slate} />
      <Say text="Membangun aset" x={1360} y={190} at={L(B11.aset)} size={52} weight={800} color={theme.color.cyanInk} />

      <div style={{ position: "absolute", inset: 0, transform: `scale(${grow.toFixed(4)})`, transformOrigin: `${WHEEL.cx}px ${WHEEL.cy}px` }}>
        <Node box={SPOKES[0]} label="Pendapatan" icon="wallet" at={L(B11.steps[0])} size={38} />
        <Link a={nodeEdge(SPOKES[0], "r")} b={nodeEdge(SPOKES[1], "t")} at={L(B11.steps[1]) - 20} />
        <Node box={SPOKES[1]} label="Laba" icon="coin" at={L(B11.steps[1])} size={38} />
        <Link a={nodeEdge(SPOKES[1], "l")} b={nodeEdge(SPOKES[2], "r")} at={L(B11.steps[2]) - 30} />
        <Node box={SPOKES[2]} label="Berkembang" icon="chart" at={L(B11.steps[2])} size={38} />
        <Link a={nodeEdge(SPOKES[2], "t")} b={nodeEdge(SPOKES[0], "l")} at={L(B11.steps[2]) + 10} />
        <Say text="Sebuah bisnis" x={WHEEL.cx} y={WHEEL.cy + 40} at={L(B11.wheel)} size={34} weight={700} color={c.slate} />
      </div>

      <Link a={{ x: OWNER.x - 20, y: OWNER.y + OWNER.h / 2 }} b={{ x: WHEEL.cx + 250, y: WHEEL.cy - 40 }} at={L(B11.pemilik) + 20} tone="cyan" dashed head={false} />
      <Node box={OWNER} label="Pemilik" sub="sebagian kecil" icon="person" tone="cyan" at={L(B11.pemilik)} size={40} />
      <Say text="ikut punya exposure ke" x={OWNER.x + OWNER.w / 2} y={OWNER.y + OWNER.h + 50} at={L(B11.exposure)} size={34} weight={600} color={theme.color.cyanInk} />
      <Say text="pertumbuhan nilainya" x={OWNER.x + OWNER.w / 2} y={OWNER.y + OWNER.h + 96} at={L(B11.exposure) + 12} size={34} weight={800} color={theme.color.cyanInk} />
    </Stage>
  );
};

// ═══ SC12 — start small; the habit is the slice ══════════════════════════
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
const ROW = { x0: 260, step: 190, base: 760, bar: 120, h: 230, slice: 46 };
const JAR = { x: 1440, y: 460, size: 300 };

export const SC12 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC12);
  const dim = ease(f, L(B12.dim), m.fade);
  const monthAt = (k: number) => L(B12.habit) + k * 30;
  const saved = MONTHS.reduce((s, _, k) => s + ease(f, monthAt(k) + 12, 22), 0);
  return (
    <Stage>
      <Say text="Mulainya nggak harus besar" x={960} y={190} at={L(B12.start)} size={52} />
      <div style={{ opacity: 1 - 0.65 * dim }}>
        {["Rp50 ribu", "Rp100 ribu", "Rp300 ribu"].map((label, i) => {
          /* 28 then 83 frames apart: a short ease, so each lands on its word */
          return <Pill key={label} label={label} x={[560, 960, 1360][i]} y={330} at={L(B12.amounts[i])} tone="cyan" size={52} />;
        })}
      </div>

      {/* month after month: income comes in, a slice goes to the jar */}
      {MONTHS.map((mo, k) => {
        const at = monthAt(k);
        const bar = ease(f, at, 14);
        if (bar <= 0.001) return null;
        const x = ROW.x0 + k * ROW.step;
        const go = ease(f, at + 12, 22);
        const tx = (JAR.x + JAR.size / 2 - ROW.bar / 2 - x) * go;
        const ty = (JAR.y + 120 - (ROW.base - ROW.h)) * go;
        return (
          <div key={mo}>
            <div style={{ position: "absolute", left: x, top: ROW.base - ROW.h * bar + ROW.slice, width: ROW.bar, height: (ROW.h - ROW.slice) * bar, background: theme.color.indigoWashStrong, border: `${theme.shape.rule}px solid ${c.indigo}`, borderRadius: 12, boxSizing: "border-box" }} />
            <div
              style={{
                position: "absolute",
                left: x + tx,
                top: ROW.base - ROW.h * bar + ty,
                width: ROW.bar,
                height: ROW.slice,
                background: theme.color.cyanInk,
                borderRadius: 10,
                opacity: go >= 0.999 ? 0 : 1,
                transform: `scale(${1 - 0.4 * go})`,
              }}
            />
            <Say text={mo} x={x + ROW.bar / 2} y={ROW.base + 40} at={at} size={30} weight={600} color={c.slate} />
          </div>
        );
      })}
      <Say text="income" x={ROW.x0 - 30} y={ROW.base - ROW.h / 2} at={L(B12.habit)} anchor="right" size={30} weight={700} color={c.indigo} />

      {/* the jar fills */}
      {f >= L(B12.habit) ? (
        <div style={{ position: "absolute", left: JAR.x, top: JAR.y, opacity: ease(f, L(B12.habit), m.fade) }}>
          <div style={{ position: "absolute", left: JAR.size * 0.24, top: JAR.size * (0.86 - 0.5 * (saved / MONTHS.length)), width: JAR.size * 0.52, height: JAR.size * 0.5 * (saved / MONTHS.length), background: theme.color.hlCyan, borderRadius: 10 }} />
          <Icon name="jar" size={JAR.size} color={theme.color.cyanInk} stroke={2.4} />
        </div>
      ) : null}
      <Say text="Aset" x={JAR.x + JAR.size / 2} y={JAR.y + JAR.size + 40} at={L(B12.aset)} size={44} weight={800} color={theme.color.cyanInk} />
      <Say text="Kebiasaan menyisihkan" x={JAR.x + JAR.size / 2} y={JAR.y - 40} at={L(B12.habit) + 40} size={36} weight={700} color={theme.color.cyanInk} />
    </Stage>
  );
};
