/**
 * Stickman-Walk — a test composition, only to look at the walking stickman (Simon, 19 Oct: "coba buat
 * composition baru, khusus buat liat animasi stickman jalan"). Left: facing the viewer, walking on the spot on
 * an island. Right: in profile, walking across a ground line, turning round at each end.
 *
 * Also the sandbox for the VI style tokens (Simon, 20 Oct: "coba bikin dulu di stickman-walk mulai dari nomor 1.
 * Tulis Lorem Ipsum dengan 5 kategori tersebut"): the type scale, one line per level, at the top.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GridGround, PaletteProvider, Stage, TYPE_LEVELS, theme, typeStyle, useMotion, usePalette } from "../../core";
import { Walker } from "./components/Walker";

export const STICKMAN_WALK_FRAMES = 600;

const SAMPLE: Record<(typeof TYPE_LEVELS)[number], string> = {
  hero: "Lorem Ipsum",
  statement: "Lorem ipsum dolor sit",
  title: "Lorem ipsum dolor sit amet",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  label: "Lorem ipsum dolor sit amet",
};
const LEVEL_NAME = { hero: "Hero", statement: "Statement", title: "Title", body: "Body", label: "Label" };

/** The five type levels, each with its name and size beside it. */
const TypeSpecimen = () => {
  const c = usePalette();
  return (
    <div style={{ position: "absolute", left: theme.margin.left, top: 70, display: "flex", flexDirection: "column", gap: 24 }}>
      {TYPE_LEVELS.map((level) => (
        <div key={level} style={{ display: "flex", alignItems: "baseline" }}>
          <div style={{ ...typeStyle("label"), width: 300, color: c.slate, flex: "none" }}>
            {LEVEL_NAME[level]} · {theme.type[level].size}
          </div>
          <div style={{ ...typeStyle(level), color: level === "hero" ? c.indigo : c.ink, whiteSpace: "nowrap" }}>{SAMPLE[level]}</div>
        </div>
      ))}
    </div>
  );
};

const Body = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  // the profile walker crosses from x0 to x1 and back, slowing to a stop at each end
  const lap = m.sec(4.5);
  const pause = m.sec(0.5);
  const cycle = 2 * (lap + pause);
  const t = f % cycle;
  const x0 = 1100;
  const x1 = 1740;
  let x = x0;
  let facing: 1 | -1 = 1;
  let walking = 1;
  if (t < lap) {
    x = x0 + (x1 - x0) * (t / lap);
    walking = Math.min(1, t / m.sec(0.3), (lap - t) / m.sec(0.3));
  } else if (t < lap + pause) {
    x = x1;
    walking = 0;
  } else if (t < 2 * lap + pause) {
    const u = (t - lap - pause) / lap;
    x = x1 - (x1 - x0) * u;
    facing = -1;
    walking = Math.min(1, (t - lap - pause) / m.sec(0.3), (2 * lap + pause - t) / m.sec(0.3));
  } else {
    x = x0;
    facing = -1;
    walking = 0;
  }
  const ground = 760;
  return (
    <Stage>
      <GridGround f={f} paper={c.bg} />
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, color: c.ink }}>
        {/* left: an island to stand on */}
        <polygon points="480,600 760,740 480,880 200,740" fill={theme.color.isoTop} />
        <polygon points="200,740 480,880 480,920 200,780" fill={theme.color.isoLeft} />
        <polygon points="480,880 760,740 760,780 480,920" fill={theme.color.isoRight} />
        <Walker x={480} y={760} view="front" />
        {/* right: a ground line to walk along */}
        <line x1={x0 - 80} y1={ground} x2={x1 + 80} y2={ground} stroke={theme.color.isoLeft} strokeWidth={10} strokeLinecap="round" />
        <Walker x={x} y={ground} view="side" facing={facing} walking={walking} />
      </svg>
      <TypeSpecimen />
      <div style={{ ...typeStyle("label"), position: "absolute", left: 280, top: 932, width: 400, textAlign: "center", color: c.indigo }}>Tampak depan</div>
      <div style={{ ...typeStyle("label"), position: "absolute", left: x0, top: ground + 40, width: x1 - x0, textAlign: "center", color: c.indigo }}>Tampak samping</div>
    </Stage>
  );
};

export const StickmanWalk = () => (
  <AbsoluteFill>
    <PaletteProvider>
      <Body />
    </PaletteProvider>
  </AbsoluteFill>
);
