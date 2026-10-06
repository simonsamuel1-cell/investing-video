/**
 * COLD OPEN — SC01 · SC02 · SC03.
 *
 * A worker, a payday, and a flow that stops when he does; then the five ways
 * people add income, all drawing on the same two things; then the 24 hours
 * those two things live in, and the two questions the video is about.
 */
import { useCurrentFrame } from "remotion";
import { Stage, theme, useMotion, usePalette } from "../../../core";
import { BLOCK, SC01 as B1, SC02 as B2, SC03 as B3, local } from "../data/timing";
import { ease, Pill, Icon, Link, Node, Say, TypeBox, Worker, nodeEdge, type NodeBox } from "../components/kit";

// ═══ SC01 — payday, and the flow behind it ═════════════════════════════════
/**
 * A DESK CALENDAR, ONE PAGE — Simon: "Kalender ini harusnya cukup tanggalnya
 * (mulai dari 1 dulu aja), dan bulan Januari." The month on an indigo band,
 * the date under it and nothing else; two rings on top so it reads as a
 * calendar you tear a page from, not as a card. Every corner round.
 */
const CAL = { cx: 960, y: 290, w: 460, h: 500, band: 132, ring: { w: 26, h: 72, dx: 120 } };
/** The flow: three nodes in a row on the right, the worker on the left. */
const FLOW1: NodeBox[] = [
  { x: 720, y: 450, w: 300, h: 150 },
  { x: 1100, y: 450, w: 360, h: 150 },
  { x: 1540, y: 450, w: 280, h: 150 },
];

/**
 * The calendar page: month on the band, the date below. `date` may be
 * fractional — the dates are one strip that rolls up through the window, so
 * 1 → 25 is a scroll, not a swap.
 */
const Calendar = ({ month, date, last }: { month: string; date: number; last: number }) => {
  const c = usePalette();
  const left = CAL.cx - CAL.w / 2;
  const r = theme.shape.cardRadius;
  return (
    <>
      <div style={{ position: "absolute", left, top: CAL.y, width: CAL.w, height: CAL.h, borderRadius: r, background: c.cardBg, border: `${theme.shape.hairline}px solid ${c.border}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: CAL.w, height: CAL.band, background: c.indigo, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: 60, fontWeight: 800, color: c.cardBg, letterSpacing: 1 }}>
          {month}
        </div>
        <div style={{ position: "absolute", left: 0, top: CAL.band, width: CAL.w, height: CAL.h - CAL.band, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: CAL.w, transform: `translateY(${(-(date - 1) * (CAL.h - CAL.band)).toFixed(2)}px)` }}>
            {Array.from({ length: last }, (_, i) => (
              <div key={i} style={{ height: CAL.h - CAL.band, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: 260, fontWeight: 800, color: c.ink, lineHeight: 1 }}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            left: CAL.cx + side * CAL.ring.dx - CAL.ring.w / 2,
            top: CAL.y - CAL.ring.h / 2,
            width: CAL.ring.w,
            height: CAL.ring.h,
            borderRadius: CAL.ring.w / 2,
            background: c.ink,
          }}
        />
      ))}
    </>
  );
};

export const SC01 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC01);
  const calOut = ease(f, L(B1.kerja) - 6, m.move);
  const calIn = ease(f, L(B1.calendar), m.move);
  const cal = calIn * (1 - calOut);
  const stampIn = ease(f, L(B1.gajian), m.reveal);
  const stamp = { opacity: stampIn, scale: 0.9 + 0.1 * stampIn };
  const stopped = ease(f, L(B1.berhenti), m.move);

  return (
    <Stage>
      {/* the calendar, and payday beside it */}
      {cal > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: cal, transform: `translate(${-calOut * 80}px, ${(1 - calIn) * 30}px)` }}>
          <Calendar month="Januari" date={1 + (B1.payday - 1) * ease(f, L(B1.scroll[0]), L(B1.scroll[1]) - L(B1.scroll[0]))} last={B1.payday} />
          {stamp.opacity > 0.001 ? (
            <div
              style={{
                position: "absolute",
                left: CAL.cx + CAL.w / 2 + 60,
                top: CAL.y + CAL.h / 2,
                opacity: stamp.opacity,
                transform: `translateY(-50%) scale(${stamp.scale})`,
                transformOrigin: "0% 50%",
                padding: "18px 40px",
                borderRadius: 999,
                background: c.indigo,
                color: c.cardBg,
                fontFamily: theme.text.family,
                fontSize: theme.text.display.size,
                fontWeight: theme.text.display.weight,
                letterSpacing: 2,
              }}
            >
              GAJIAN
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the worker, and the flow he keeps going */}
      <Worker x={380} y={925} h={700} at={L(B1.kerja)} poses={[[0, 1], [L(B1.berhenti) + 10, 4]]} />
      <Node box={FLOW1[0]} label="Kerja" icon="briefcase" at={L(B1.kerja)} dim={stopped} />
      <Link a={nodeEdge(FLOW1[0], "r")} b={nodeEdge(FLOW1[1], "l")} at={L(B1.penghasilan) - 14} cut={stopped} />
      <Node box={FLOW1[1]} label="Penghasilan" icon="wallet" at={L(B1.penghasilan)} />
      <Link a={nodeEdge(FLOW1[1], "r")} b={nodeEdge(FLOW1[2], "l")} at={L(B1.hidup) - 14} cut={stopped} />
      <Node box={FLOW1[2]} label="Hidup" icon="home" at={L(B1.hidup)} dim={stopped * 0.5} />

      {/* "berhenti kerja sementara": a pause over the work */}
      {stopped > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: FLOW1[0].x + FLOW1[0].w / 2 - 44,
            top: FLOW1[0].y - 112,
            opacity: stopped,
          }}
        >
          <Icon name="pause" size={88} color={theme.color.warn} />
        </div>
      ) : null}
      <Say
        text="Penghasilan ikut berhenti?"
        x={FLOW1[1].x + FLOW1[1].w / 2}
        y={740}
        at={L(B1.apakah)}
        size={56}
        color={c.indigo}
      />
    </Stage>
  );
};

// ═══ SC02 — five ways, one source ═════════════════════════════════════════
/** The five on an arc over the one thing they all draw on — no line crosses a chip. */
const SOURCE: NodeBox = { x: 1010, y: 740, w: 520, h: 140 };
const ARC = { cx: SOURCE.x + SOURCE.w / 2, cy: SOURCE.y + 40, r: 470 };
const WAYS = ["Naik jabatan", "Skill baru", "Bangun bisnis", "Freelance", "Side hustle"].map((label, i) => {
  const a = ((200 + i * 35) * Math.PI) / 180;
  return { label, x: ARC.cx + ARC.r * Math.cos(a), y: ARC.cy + ARC.r * Math.sin(a) };
});

export const SC02 = () => {
  const f = useCurrentFrame();
  const L = (g: number) => local(g, BLOCK.SC02);
  return (
    <Stage>
      <Say text="Menambah Penghasilan" x={960} y={122} at={L(B2.title)} size={48} />
      <Worker x={330} y={925} h={700} at={0} poses={[[0, 6]]} />
      {WAYS.map((w, i) => {
        /* from just under the chip to just over the source, on the radius */
        const dx = ARC.cx - w.x;
        const dy = ARC.cy - w.y;
        const d = Math.hypot(dx, dy);
        return (
          <Link
            key={`l${i}`}
            a={{ x: w.x + (dx / d) * 64, y: w.y + (dy / d) * 64 }}
            b={{ x: w.x + (dx / d) * (d - 90), y: w.y + (dy / d) * (d - 90) }}
            at={L(B2.waktu) - 30 + i * 4}
            tone="slate"
            width={3}
          />
        );
      })}
      {WAYS.map((w, i) => (
        <Pill key={w.label} label={w.label} x={w.x} y={w.y} at={L(B2.ways[i])} size={40} />
      ))}
      <Node box={SOURCE} label="Waktu + Tenaga" icon="clock" at={L(B2.waktu)} filled={ease(f, L(B2.waktu) + 18, 18)} size={44} />
    </Stage>
  );
};

// ═══ SC03 — 24 hours, and the two questions ═══════════════════════════════
/** One day, hour by hour; and what fills it as you get older. */
const HOURS = { x: 170, y: 250, cell: 62, gap: 4, h: 96 };
const DAY_BLOCKS: { from: number; to: number; label: string; tone: "indigo" | "cyan" | "slate" }[] = [
  { from: 0, to: 7, label: "Istirahat", tone: "slate" },
  { from: 7, to: 9, label: "Jalan", tone: "slate" },
  { from: 9, to: 18, label: "Kerja", tone: "indigo" },
  { from: 18, to: 20, label: "Jalan", tone: "slate" },
  { from: 20, to: 24, label: "Keluarga", tone: "cyan" },
];

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC03);
  const day = ease(f, L(B3.day), m.reveal);
  /** Blocks fill left to right between "Semakin dewasa" and "…makin banyak." */
  const fill = (h: number) => ease(f, L(B3.dewasa) + ((L(B3.full) - L(B3.dewasa)) * h) / 24, 10);
  const dimDay = ease(f, L(B3.q1) - 10, m.move);
  const ink = (t: "indigo" | "cyan" | "slate") => (t === "indigo" ? c.indigo : t === "cyan" ? theme.color.cyanInk : c.slate);
  const wash = (t: "indigo" | "cyan" | "slate") =>
    t === "indigo" ? theme.color.indigoWashStrong : t === "cyan" ? theme.color.hlCyan : theme.color.slateWash;
  const rowW = 24 * HOURS.cell + 23 * HOURS.gap;
  return (
    <Stage>
      <div style={{ opacity: day * (1 - 0.7 * dimDay) }}>
        <Say text="Sehari tetap cuma 24 jam" x={HOURS.x} y={HOURS.y - 70} at={L(B3.day)} anchor="left" size={44} />
        <Say text={`${Math.round(24 * ease(f, L(B3.day), 50))} jam`} x={HOURS.x + rowW} y={HOURS.y - 70} at={L(B3.jam)} anchor="right" size={44} color={c.indigo} />
        {Array.from({ length: 24 }, (_, h) => {
          const blk = DAY_BLOCKS.find((b) => h >= b.from && h < b.to)!;
          const on = fill(h);
          return (
            <div
              key={h}
              style={{
                position: "absolute",
                left: HOURS.x + h * (HOURS.cell + HOURS.gap),
                top: HOURS.y,
                width: HOURS.cell,
                height: HOURS.h,
                borderRadius: 10,
                border: `${theme.shape.hairline}px solid ${on > 0.5 ? ink(blk.tone) : c.border}`,
                background: on > 0.001 ? wash(blk.tone) : c.cardBg,
              }}
            />
          );
        })}
        {DAY_BLOCKS.map((b) => (
          <Say
            key={`${b.label}${b.from}`}
            text={b.label}
            x={HOURS.x + ((b.from + b.to) / 2) * (HOURS.cell + HOURS.gap)}
            y={HOURS.y + 140}
            at={L(B3.dewasa) + ((L(B3.full) - L(B3.dewasa)) * b.from) / 24}
            size={30}
            weight={600}
            color={ink(b.tone)}
          />
        ))}
      </div>
      <TypeBox
        cx={960}
        y={500}
        w={1380}
        h={130}
        at={L(B3.q1) + 30}
        typeAt={L(B3.q1Type)}
        dim={ease(f, L(B3.q2), m.fade)}
        text="“Gimana caranya aku bisa menghasilkan lebih banyak?”"
        size={42}
      />
      <TypeBox
        cx={960}
        y={690}
        w={1560}
        h={150}
        at={L(B3.q2) + 14}
        typeAt={L(B3.q2Type)}
        text="“Gimana caranya uang yang sudah aku hasilkan ikut bekerja?”"
        mark="ikut bekerja"
        markAt={L(B3.ikutBekerja)}
        tone="cyan"
        size={46}
      />
    </Stage>
  );
};
