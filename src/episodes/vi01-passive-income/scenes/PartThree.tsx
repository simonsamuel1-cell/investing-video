/**
 * PART 03 — CERITA LO KHENG HONG · SC13–SC15.
 *
 * His path as a timeline that ends on a card (United Tractors · UNTR); that
 * card carries into SC14, where only the two prices the narration speaks are
 * shown — no chart, no data nobody supplied — and then set behind the caution
 * the narration gives; and the five-step process the story is really about.
 */
import { useCurrentFrame } from "remotion";
import { Chip, Panel, Stage, progress, progressInOut, theme, useMotion, usePalette } from "../../../core";
import { BLOCK, SC13 as B13, SC14 as B14, SC15 as B15, local } from "../data/timing";
import { Icon, Link, Node, Say, Strike, TypeBox, nodeEdge, type IconName, type NodeBox } from "../components/kit";

// ═══ SC13 — the path, ending on UNTR ═════════════════════════════════════
const LINE = { y: 560, x0: 200, x1: 1400 };
const STOPS: { x: number; icon: IconName; lines: string[] }[] = [
  { x: 280, icon: "building", lines: ["Pegawai bank"] },
  { x: 620, icon: "jar", lines: ["Menabung"] },
  { x: 960, icon: "book", lines: ["Belajar & baca", "laporan perusahaan"] },
  { x: 1300, icon: "chart", lines: ["Mulai", "berinvestasi"] },
];
/** UNTR, where SC13 leaves it and where SC14 picks it up. */
export const UNTR_AT: NodeBox = { x: 1450, y: 470, w: 380, h: 180 };
const UNTR_TOP: NodeBox = { x: 770, y: 160, w: 380, h: 180 };

export const SC13 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const L = (g: number) => local(g, BLOCK.SC13);
  const reach = B13.steps.reduce((r, g, i) => Math.max(r, progressInOut(f, L(g) - 10, 30) * (STOPS[i].x - LINE.x0)), 0);
  return (
    <Stage>
      <Say text="Lo Kheng Hong" x={960} y={190} at={L(B13.name)} size={76} weight={800} />
      <Say text="nggak langsung mulai sebagai investor besar" x={960} y={270} at={L(B13.name) + 60} size={38} weight={600} color={c.slate} />
      {reach > 0.5 ? (
        <div style={{ position: "absolute", left: LINE.x0, top: LINE.y - 2, width: reach, height: 4, borderRadius: 4, background: c.indigo }} />
      ) : null}
      {STOPS.map((s, i) => {
        const at = L(B13.steps[i]);
        const on = progress(f, at, 14);
        if (on <= 0.001) return null;
        return (
          <div key={s.x}>
            <div style={{ position: "absolute", left: s.x - 18, top: LINE.y - 18, width: 36, height: 36, borderRadius: 99, background: c.indigo, opacity: on, transform: `scale(${0.6 + 0.4 * on})` }} />
            <div style={{ position: "absolute", left: s.x - 34, top: LINE.y - 120, opacity: on }}>
              <Icon name={s.icon} size={68} color={c.indigo} />
            </div>
            {s.lines.map((t, k) => (
              <Say key={t} text={t} x={s.x} y={LINE.y + 64 + k * 46} at={at} size={36} weight={700} />
            ))}
          </div>
        );
      })}
      <Link a={{ x: STOPS[3].x + 30, y: LINE.y }} b={nodeEdge(UNTR_AT, "l")} at={L(B13.untr) - 20} tone="cyan" />
      <Node box={UNTR_AT} label="United Tractors" sub="UNTR" icon="building" tone="cyan" layout="column" at={L(B13.untr)} size={40} />
    </Stage>
  );
};

// ═══ SC14 — the two prices the narration gives, then the caution ═════════
export const SC14 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC14);
  /** The card, carried up from where SC13 left it. */
  const lift = progressInOut(f, 0, 40);
  const card = {
    x: UNTR_AT.x + (UNTR_TOP.x - UNTR_AT.x) * lift,
    y: UNTR_AT.y + (UNTR_TOP.y - UNTR_AT.y) * lift,
    w: UNTR_AT.w,
    h: UNTR_AT.h,
  };
  const dim = progress(f, L(B14.caution), m.move);
  return (
    <Stage>
      <div style={{ opacity: 1 - 0.8 * dim }}>
        <Node box={card} label="United Tractors" sub="UNTR" icon="building" tone="cyan" layout="column" at={-60} size={40} />
        <Chip label="Krisis 1998" x={500} y={470} at={L(B14.krisis)} pill tone="slate" size={42} />
        <Say text="± Rp250 / saham" x={500} y={570} at={L(B14.rp250)} size={60} weight={800} />
        <Link a={{ x: 700, y: 640 }} b={{ x: 1210, y: 470 }} at={L(B14.later)} tone="cyan" width={6} />
        <Say text="beberapa tahun kemudian" x={955} y={640} at={L(B14.later) + 20} size={32} weight={600} color={c.slate} />
        <Say text="berkali-kali lipat" x={1420} y={520} at={L(B14.lipat)} size={40} weight={700} color={theme.color.cyanInk} />
        <Say text="± Rp15 ribu" x={1420} y={440} at={L(B14.rp15)} size={60} weight={800} color={theme.color.cyanInk} />
      </div>
      <Panel rect={{ x: 360, y: 640, w: 1200, h: 240 }} at={L(B14.caution)} />
      <Say x={960} y={712} at={L(B14.caution) + 6} size={52} weight={800}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
          <Icon name="hourglass" size={58} color={c.ink} />
          Contoh dari masa lalu
        </span>
      </Say>
      <Say text="Nggak semua investasi akan memberikan hasil seperti ini." x={960} y={808} at={L(B14.nggak)} size={38} weight={600} color={c.slate} />
    </Stage>
  );
};

// ═══ SC15 — not the jackpot: the process ═════════════════════════════════
const STEPS: { label: string; icon: IconName; tone: "indigo" | "cyan" }[] = [
  { label: "Kerja", icon: "briefcase", tone: "indigo" },
  { label: "Sisihkan", icon: "coin", tone: "cyan" },
  { label: "Pelajari", icon: "book", tone: "cyan" },
  { label: "Beli yang dipahami", icon: "check", tone: "cyan" },
  { label: "Beri waktu", icon: "clock", tone: "cyan" },
];
const STEP = { y: 560, w: 300, h: 220, gap: 42 };
const stepBox = (i: number): NodeBox => ({
  x: (theme.canvas.width - (5 * STEP.w + 4 * STEP.gap)) / 2 + i * (STEP.w + STEP.gap),
  y: STEP.y,
  w: STEP.w,
  h: STEP.h,
});

export const SC15 = () => {
  const c = usePalette();
  const L = (g: number) => local(g, BLOCK.SC15);
  return (
    <Stage>
      <TypeBox cx={960} y={180} w={1180} h={130} at={L(B15.bukan)} typeAt={L(B15.quote)} text="“Cari saham yang bisa naik berkali-kali.”" size={44} />
      <Strike x={960 - 520} y={180 + 66} w={1040} at={L(B15.strike)} />
      <Say text="Yang lebih penting: prosesnya" x={960} y={430} at={L(B15.strike) + 20} size={54} weight={800} color={c.indigo} />
      {STEPS.map((s, i) => (
        <div key={s.label}>
          {i > 0 ? <Link a={nodeEdge(stepBox(i - 1), "r")} b={nodeEdge(stepBox(i), "l")} at={L(B15.steps[i]) - 16} tone={s.tone} /> : null}
          <Node box={stepBox(i)} label={s.label} icon={s.icon} tone={s.tone} layout="column" at={L(B15.steps[i])} size={36} />
          <Say text={String(i + 1)} x={stepBox(i).x + STEP.w / 2} y={STEP.y + STEP.h + 46} at={L(B15.steps[i])} size={40} weight={800} color={s.tone === "indigo" ? c.indigo : theme.color.cyanInk} />
        </div>
      ))}
    </Stage>
  );
};
