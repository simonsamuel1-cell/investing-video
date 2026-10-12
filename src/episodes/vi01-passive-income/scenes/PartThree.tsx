/**
 * PART 03 — CERITA LO KHENG HONG · SC13–SC15.
 *
 * His path as a timeline that ends on a card (United Tractors · UNTR); that
 * card carries into SC14, where only the two prices the narration speaks are
 * shown — no chart, no data nobody supplied — and then set behind the caution
 * the narration gives; and the five-step process the story is really about.
 */
import { useCurrentFrame } from "remotion";
import { GridGround, Stage, cutOutStyle, theme, useMotion, usePalette } from "../../../core";
import { BG_FADE, BLOCK, CARRY_CLEAR, CUT, SC13 as B13, SC14 as B14, SC15 as B15, local } from "../data/timing";
import { Cutout, LOWER_THIRD_NAME, LowerThird, OUTSIDE_RESERVES, ease, Pill, Sheet, Icon, Link, Node, Say, Strike, TypeBox, nodeEdge, type IconName, type NodeBox } from "../components/kit";

// ═══ SC13 — the path, ending on UNTR ═════════════════════════════════════
/**
 * The roadmap runs margin to margin — "hingga paling kanan" — which also centres it. Its four dots are
 * spread evenly along it, with a gap of one pitch at both ends.
 */
const LINE = { y: 560, x0: theme.margin.left, x1: theme.canvas.width - theme.margin.right, rule: 3, end: 8, draw: 0.9 };
const PITCH = (LINE.x1 - LINE.x0) / 5;
const FIRST = LINE.x0 + PITCH;
/** The roadmap after Simon's reference: thin black line, dots of one size on it, a stem to each label, the labels alternating below and above. */
const STOPS: { x: number; r: number; up: boolean; lines: string[] }[] = [
  { x: FIRST, r: 12, up: false, lines: ["1. Pegawai bank"] },
  { x: FIRST + PITCH, r: 12, up: true, lines: ["2. Menabung"] },
  { x: FIRST + 2 * PITCH, r: 12, up: false, lines: ["3. Belajar & baca", "laporan perusahaan"] },
  { x: FIRST + 3 * PITCH, r: 12, up: true, lines: ["4. Mulai", "berinvestasi"] },
];
/** SC14's card enters from here — nothing of it is on screen in SC13 any more. */
export const UNTR_AT: NodeBox = { x: LINE.x1 - 380, y: 470, w: 380, h: 180 };
const ROAD = { stem: 100, stemW: 2, label: 36, leading: 1.25, headAbove: 300 };
/**
 * "Previewnya zoom in ke text 'Mulai berinvestasi'": the last label grows to the size of the lower third's
 * name and goes to the far left, centred top to bottom; UNTR.png appears to its right.
 */
const ZOOM = { scale: LOWER_THIRD_NAME / ROAD.label, outSecs: 0.6, inSecs: 1 };
/**
 * "gedein … sampe heightnya menyentuh batas margin": the machine itself — not the transparent frame
 * around it — runs from the top margin to the bottom margin. Its right edge rests where the logo zone
 * begins, so the glow around the ring never enters it. `ink` is the picture's opaque extent in its own
 * pixels; `edge` keeps the antialiased rim a hair inside the margins.
 */
const UNTR_PX = { w: 1122, h: 1402, ink: { x1: 1122, y0: 223, y1: 1161 }, edge: 4 };
const UNTR_K = (theme.canvas.height - theme.margin.top - theme.margin.bottom - 2 * UNTR_PX.edge) / (UNTR_PX.ink.y1 - UNTR_PX.ink.y0);
const UNTR_IMG = {
  src: "art/vi01/untr.png",
  aspect: UNTR_PX.w / UNTR_PX.h,
  h: UNTR_PX.h * UNTR_K,
  cx: theme.canvas.width - theme.logoZone.width - UNTR_PX.ink.x1 * UNTR_K + (UNTR_PX.w * UNTR_K) / 2,
  bottom: theme.margin.top + UNTR_PX.edge - UNTR_PX.ink.y0 * UNTR_K + UNTR_PX.h * UNTR_K,
};
/** Lo Kheng Hong's portrait: his head and shoulders, from under the subtitle band up to just below the two lines of text. */
const FOTO = { src: "art/vi01/lo-kheng-hong.png", aspect: 1199 / 1312, top: 60, h: 640, solid: 78, rise: 120 };
/** The lower third: bottom centre, its foot above the subtitle band. */
const LT_Y = theme.captionBand.top - 80 - 170;
const UNTR_TOP: NodeBox = { x: 770, y: 160, w: 380, h: 180 };

const labelH = (s: { lines: string[] }) => s.lines.length * ROAD.label * ROAD.leading;
const labelTop = (s: { up: boolean; r: number; lines: string[] }) => (s.up ? LINE.y - s.r - ROAD.stem - labelH(s) : LINE.y + s.r + ROAD.stem);
/** Where the zoomed label's top-left lands: the left margin, its block centred on the canvas. */
const ZOOM_TO = { x: theme.margin.left, y: theme.canvas.height / 2 - (labelH(STOPS[3]) * ZOOM.scale) / 2 };

export const SC13 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC13);
  const lineP = ease(f, L(B13.roadmap), m.sec(LINE.draw));
  const fadeOthers = 1 - ease(f, L(B13.zoom), m.sec(ZOOM.outSecs));
  const zoom = ease(f, L(B13.zoom), m.sec(ZOOM.inSecs));
  /** A label at its stem, moved by (dx, dy) and scaled about its top-left corner. */
  const label = (s: (typeof STOPS)[number], text: number, dx: number, dy: number, scale: number) => (
    <div key={`l${s.x}`} style={{ position: "absolute", left: s.x - ROAD.stemW / 2, top: labelTop(s), transformOrigin: "0 0", opacity: text, transform: `translate(${dx.toFixed(2)}px, ${(dy + (1 - text) * (s.up ? 10 : -10)).toFixed(2)}px) scale(${scale.toFixed(4)})`, fontFamily: theme.text.family, fontSize: ROAD.label, fontWeight: 600, lineHeight: ROAD.leading, color: c.ink, whiteSpace: "pre" }}>
      {s.lines.join("\n")}
    </div>
  );
  /* ⚠ THE CARD IS CARRIED INTO SC14 — everything else clears around it first,
     so the cut is a move and not a jump (data/timing.ts: CUTS). */
  const clear = 1 - ease(f, L(BLOCK.SC14) - CARRY_CLEAR, CARRY_CLEAR - 4);
  /* the background fades in over SC12's last picture, so until it has the stage is see-through */
  const bg = ease(f, 0, BG_FADE);
  return (
    <Stage transparent={f < BG_FADE}>
      {/* the new background: silver paper and the grid, as at 11580; it clears with the rest before the card is carried on */}
      <div style={{ position: "absolute", inset: 0, opacity: clear * bg, clipPath: OUTSIDE_RESERVES }}>
        <GridGround f={f + BLOCK.SC13} paper={c.bg} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: clear }}>
      {/* 12992: everything but the grid leaves on a camera cut — the out half, then it is gone */}
      {f + BLOCK.SC13 < B13.cut + CUT.over / 2 ? (
        <div style={{ position: "absolute", inset: 0, ...cutOutStyle(f + BLOCK.SC13, { at: B13.cut + CUT.over / 2, axis: "x", ...CUT }) }}>
      {/* his portrait, rising a beat after the lower third; its foot fades out so the lower third sits under it */}
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `linear-gradient(to bottom, black ${FOTO.solid}%, transparent 100%)`, maskImage: `linear-gradient(to bottom, black ${FOTO.solid}%, transparent 100%)`, WebkitMaskSize: `100% ${FOTO.top + FOTO.h}px`, maskSize: `100% ${FOTO.top + FOTO.h}px`, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" }}>
        <Cutout src={FOTO.src} aspect={FOTO.aspect} x={theme.canvas.width / 2} y={FOTO.top + FOTO.h} h={FOTO.h} at={L(B13.foto)} rise={FOTO.rise} riseFrames={m.move} />
      </div>
      {/* the lower third — "Lo Kheng Hong / Warren Buffet-nya Indonesia", bottom centre, in the reference's letter-by-letter move */}
      <LowerThird first="Lo Kheng " last="Hong" role="Warren Buffet-nya Indonesia" at={L(B13.name)} cx={theme.canvas.width / 2} y={LT_Y} />
        </div>
      ) : null}
      {/* from 13568 everything but the last label — and the grid — fades out */}
      {fadeOthers > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: fadeOthers }}>
          {/* "Sebelum seperti sekarang", 300 px above the line, aligned left with the roadmap, half the size of the lower third's name */}
          <Say text="Sebelum seperti sekarang" x={LINE.x0} y={LINE.y - ROAD.headAbove} at={L(B13.roadmap)} anchor="left" size={LOWER_THIRD_NAME / 2} weight={800} />
          {/* the line draws on from its left dot; a dot closes it on the right */}
          {f >= L(B13.roadmap) ? (
            <>
              <div style={{ position: "absolute", left: LINE.x0 - LINE.end / 2, top: LINE.y - LINE.end / 2, width: LINE.end, height: LINE.end, borderRadius: 99, background: c.ink }} />
              <div style={{ position: "absolute", left: LINE.x0, top: LINE.y - LINE.rule / 2, width: (LINE.x1 - LINE.x0) * lineP, height: LINE.rule, background: c.ink }} />
              <div style={{ position: "absolute", left: LINE.x1 - LINE.end / 2, top: LINE.y - LINE.end / 2, width: LINE.end, height: LINE.end, borderRadius: 99, background: c.ink, opacity: ease(f, L(B13.roadmap) + m.sec(LINE.draw), m.fade) }} />
            </>
          ) : null}
          {STOPS.map((s, i) => {
            const at = L(B13.steps[i]);
            const dot = ease(f, at, m.reveal);
            if (dot <= 0.001) return null;
            const stem = ease(f, at + m.sec(0.15), m.sec(0.3));
            const text = ease(f, at + m.sec(0.3), m.reveal);
            return (
              <div key={s.x}>
                <div style={{ position: "absolute", left: s.x - s.r, top: LINE.y - s.r, width: 2 * s.r, height: 2 * s.r, borderRadius: 99, background: c.ink, transform: `scale(${dot.toFixed(4)})` }} />
                <div style={{ position: "absolute", left: s.x - ROAD.stemW / 2, top: s.up ? LINE.y - s.r - ROAD.stem : LINE.y + s.r, width: ROAD.stemW, height: ROAD.stem, background: c.ink, transformOrigin: s.up ? "bottom" : "top", transform: `scaleY(${stem.toFixed(4)})` }} />
                {i < STOPS.length - 1 ? label(s, text, 0, 0, 1) : null}
              </div>
            );
          })}
        </div>
      ) : null}
      {/* the last label, kept as the rest goes: it zooms up to the far left, centred top to bottom */}
      {ease(f, L(B13.steps[3]) + m.sec(0.3), m.reveal) > 0.001 ? label(STOPS[3], ease(f, L(B13.steps[3]) + m.sec(0.3), m.reveal), (ZOOM_TO.x - (STOPS[3].x - ROAD.stemW / 2)) * zoom, (ZOOM_TO.y - labelTop(STOPS[3])) * zoom, 1 + (ZOOM.scale - 1) * zoom) : null}
      {/* UNTR.png, to its right */}
      <Cutout src={UNTR_IMG.src} aspect={UNTR_IMG.aspect} x={UNTR_IMG.cx} y={UNTR_IMG.bottom} h={UNTR_IMG.h} at={L(B13.untr)} />
      </div>
    </Stage>
  );
};

// ═══ SC14 — the two prices the narration gives, then the caution ═════════
export const SC14 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC14);
  /** The card: SC13 no longer shows it, so it comes in at its old place and then lifts. */
  const lift = ease(f, 0, 40);
  const card = {
    x: UNTR_AT.x + (UNTR_TOP.x - UNTR_AT.x) * lift,
    y: UNTR_AT.y + (UNTR_TOP.y - UNTR_AT.y) * lift,
    w: UNTR_AT.w,
    h: UNTR_AT.h,
  };
  const dim = ease(f, L(B14.caution), m.move);
  return (
    <Stage>
      <div style={{ opacity: 1 - 0.8 * dim }}>
        <Node box={card} label="United Tractors" sub="UNTR" icon="building" tone="cyan" layout="column" at={0} size={40} />
        <Pill label="Krisis 1998" x={500} y={470} at={L(B14.krisis)} tone="slate" size={42} />
        <Say text="± Rp250 / saham" x={500} y={570} at={L(B14.rp250)} size={60} weight={800} />
        <Link a={{ x: 700, y: 640 }} b={{ x: 1210, y: 470 }} at={L(B14.later)} tone="cyan" width={6} />
        <Say text="beberapa tahun kemudian" x={955} y={640} at={L(B14.later) + 20} size={32} weight={600} color={c.slate} />
        <Say text="berkali-kali lipat" x={1420} y={520} at={L(B14.lipat)} size={40} weight={700} color={theme.color.cyanInk} />
        <Say text="± Rp15 ribu" x={1420} y={440} at={L(B14.rp15)} size={60} weight={800} color={theme.color.cyanInk} />
      </div>
      <Sheet x={360} y={640} w={1200} h={240} at={L(B14.caution)} />
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
