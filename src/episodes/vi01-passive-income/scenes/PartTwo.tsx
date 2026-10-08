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
import { loadFont as loadVibes } from "@remotion/google-fonts/GreatVibes";
import { Stage, theme, useMotion, usePalette } from "../../../core";
import { BLOCK, SC10 as B10, SC11 as B11, SC12 as B12, local } from "../data/timing";
import { Cutout, ease, Pill, Icon, Link, Node, Say, nodeEdge, useLife, type IconName, type NodeBox } from "../components/kit";

/** "fakta" in a handwriting face, like Simon's "Best" reference — Great Vibes. */
const { fontFamily: VIBES } = loadVibes("normal", { weights: ["400"] });

// ═══ SC09 — one company: the employee and the investor ═══════════════════
/**
 * "FAKTA MENARIK" — the lamp on a sunburst, the two words under it: "fakta"
 * handwritten in ink, "menarik" in Plus Jakarta, indigo. "Lampu.png" is
 * 5000 × 5000, the bulb solid in rows 253–4757; the sunburst is 30 px wider
 * than the bulb is tall ("diameternya 30 px lebih besar aja dari Lampu.png").
 */
/** `gap` puts 35 px of clear space between the sunburst's foot and the words' tops ("jadiin 35 px"). */
const LAMP = { cx: 960, cy: 400, h: 300, rays: 24, script: 140, sans: 84, gap: 36, textY: 0 };
/**
 * "pilih 2 fase aja: fase normal dan fase rotate. fase 1, 2 detik; fase 2, 2
 * detik; balik lagi." — a jump, no in-between frames.
 */
const WOBBLE = { deg: 5, holdSec: 2 };
const LAMP_IMG_H = (LAMP.h * 5000) / (4757 - 253);
const SUN_D = LAMP.h + 30;

const Fakta = ({ at }: { at: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const life = useLife(at);
  /* stop motion: no in-between frames, just a jump every hold */
  const tilt = Math.floor(f / m.sec(WOBBLE.holdSec)) % 2 ? WOBBLE.deg : 0;
  if (life <= 0.001) return null;
  const R = SUN_D / 2;
  const wedge = (k: number) => {
    const a0 = (k / LAMP.rays) * Math.PI * 2;
    const a1 = ((k + 1) / LAMP.rays) * Math.PI * 2;
    return `M ${R} ${R} L ${R + Math.cos(a0) * R} ${R + Math.sin(a0) * R} A ${R} ${R} 0 0 1 ${R + Math.cos(a1) * R} ${R + Math.sin(a1) * R} Z`;
  };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: life }}>
      {/* the sunburst behind the lamp — alternating rays, cut to a circle */}
      <svg width={SUN_D} height={SUN_D} style={{ position: "absolute", left: LAMP.cx - R, top: LAMP.cy - R, transform: `rotate(${tilt}deg)` }}>
        {Array.from({ length: LAMP.rays }, (_, k) => (
          <path key={k} d={wedge(k)} fill={k % 2 ? c.indigoSoft : c.indigo} />
        ))}
      </svg>
      <Cutout src="art/vi01/lampu.png" aspect={1} x={LAMP.cx} y={LAMP.cy + LAMP.h / 2 + ((5000 - 4757) / 5000) * LAMP_IMG_H} h={LAMP_IMG_H} at={at} rise={0} />
      <div style={{ position: "absolute", left: 0, right: 0, top: LAMP.cy + LAMP.h / 2 + LAMP.gap + LAMP.textY, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 22, lineHeight: 1 }}>
        <span style={{ fontFamily: VIBES, fontSize: LAMP.script, color: c.ink }}>fakta</span>
        <span style={{ fontFamily: theme.text.family, fontSize: LAMP.sans, fontWeight: 700, color: c.indigo }}>menarik</span>
      </div>
    </div>
  );
};


export const SC09 = () => {
  const m = useMotion();
  /* "visual yang ada di scene ini sebelumnya, hapus aja (kecuali visual dariku)" */
  return (
    <Stage>
      {/* in from the first frame, so it comes in with the CameraCut */}
      <Fakta at={-m.reveal} />
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
