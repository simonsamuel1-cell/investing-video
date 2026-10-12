/**
 * PART 03 — CERITA LO KHENG HONG · SC13–SC15.
 *
 * His path as a timeline that ends on a card (United Tractors · UNTR); that
 * card carries into SC14, where only the two prices the narration speaks are
 * shown — no chart, no data nobody supplied — and then set behind the caution
 * the narration gives; and the five-step process the story is really about.
 */
import { useCurrentFrame } from "remotion";
import { quizLabelStyle } from "./ColdOpen";
import { GridGround, Stage, cutOutStyle, theme, useMotion, usePalette, useShadow } from "../../../core";
import { BG_FADE, BLOCK, CUT, SC13 as B13, SC14 as B14, SC15 as B15, local } from "../data/timing";
import { Cutout, LOWER_THIRD_NAME, LowerThird, OUTSIDE_RESERVES, ease, Icon, Link, Node, Say, nodeEdge, type IconName, type NodeBox } from "../components/kit";

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
const ROAD = { stem: 100, stemW: 2, label: 36, leading: 1.25, headAbove: 300 };
/**
 * "Previewnya zoom in ke text 'Mulai berinvestasi'": the last label grows to the size of the lower third's
 * name and goes to the far left, centred top to bottom; UNTR.png appears to its right.
 */
const ZOOM = { scale: LOWER_THIRD_NAME / ROAD.label, outSecs: 0.6, inSecs: 1 };
/**
 * "gedein … sampe heightnya menyentuh batas margin", then "kecilin 20%": the machine itself — not the
 * transparent frame around it — was sized to run from the top margin to the bottom margin, its right
 * edge on the logo zone's left edge so the ring's glow never enters it; it is now 80% of that, about
 * the same centre. `ink` is the picture's opaque extent in its own pixels; `edge` keeps the antialiased
 * rim a hair inside the margins.
 */
const UNTR_PX = { w: 1122, h: 1402, ink: { x0: 24, x1: 1122, y0: 223, y1: 1161 }, edge: 4, shrink: 0.8, right: 250 };
const UNTR_FULL = (theme.canvas.height - theme.margin.top - theme.margin.bottom - 2 * UNTR_PX.edge) / (UNTR_PX.ink.y1 - UNTR_PX.ink.y0);
const UNTR_K = UNTR_FULL * UNTR_PX.shrink;
/** Where the machine's own centre sat at full size, and in its own pixels. */
const UNTR_C = {
  x: theme.canvas.width - theme.logoZone.width - ((UNTR_PX.ink.x1 - UNTR_PX.ink.x0) * UNTR_FULL) / 2,
  y: theme.margin.top + UNTR_PX.edge + ((UNTR_PX.ink.y1 - UNTR_PX.ink.y0) * UNTR_FULL) / 2,
  ix: (UNTR_PX.ink.x0 + UNTR_PX.ink.x1) / 2,
  iy: (UNTR_PX.ink.y0 + UNTR_PX.ink.y1) / 2,
};
const UNTR_IMG = {
  src: "art/vi01/untr.png",
  aspect: UNTR_PX.w / UNTR_PX.h,
  h: UNTR_PX.h * UNTR_K,
  /* "geser kanan 100 px", then "geser lagi 200 px", then "geser kiri 50 px": 250 in all */
  cx: UNTR_C.x + UNTR_PX.right + (UNTR_PX.w / 2 - UNTR_C.ix) * UNTR_K,
  bottom: UNTR_C.y + (UNTR_PX.h - UNTR_C.iy) * UNTR_K,
};
/** Lo Kheng Hong's portrait: his head and shoulders, from under the subtitle band up to just below the two lines of text. */
const FOTO = { src: "art/vi01/lo-kheng-hong.png", aspect: 1199 / 1312, top: 60, h: 640, solid: 78, rise: 120 };
/** The lower third: bottom centre, its foot above the subtitle band. */
const LT_Y = theme.captionBand.top - 80 - 170;

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
  /* the background fades in over SC12's last picture, so until it has the stage is see-through */
  const bg = ease(f, 0, BG_FADE);
  return (
    <Stage transparent={f < BG_FADE}>
      {/* the new background: silver paper and the grid, as at 11580; */}
      <div style={{ position: "absolute", inset: 0, opacity: bg, clipPath: OUTSIDE_RESERVES }}>
        <GridGround f={f + BLOCK.SC13} paper={c.bg} />
      </div>
      <div style={{ position: "absolute", inset: 0 }}>
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

// ═══ SC14 — what he paid, what it became, and the caution ════════════════
/**
 * SC13's picture carries on over a plain cut (the grid, the zoomed label, UNTR.png). At 13870 UNTR shrinks
 * to 50% and Lo Kheng Hong comes up on its left at the same height; the label "UNTR = Rp 250" follows and a
 * coin and a document change places; at 14305 UNTR moves left and a roadmap fills in beneath it.
 */
const P14 = { trail: 7, dash: "14 12", samples: 48, trailFade: 0.6, shrink: 0.5, gap: 500, rowCy: 430, below: 56, foot: 0.22, coin: 80, doc: 76, arc: 230, hand: 70, top2: 150 };
const G14 = (() => {
  const k1 = UNTR_K * P14.shrink;
  const w1 = (UNTR_PX.ink.x1 - UNTR_PX.ink.x0) * k1;
  const h1 = (UNTR_PX.ink.y1 - UNTR_PX.ink.y0) * k1;
  const wL = h1 * FOTO.aspect;
  const left = (theme.canvas.width - (wL + P14.gap + w1)) / 2;
  return { k1, w1, h1, wL, lkhX: left + wL / 2, untrX: left + wL + P14.gap + w1 / 2 };
})();
/** The roadmap under UNTR once it has moved left: one line margin to margin, black dots from UNTR's own x to the right end. */
const R14 = { y: 760, rule: 3, end: 8, r: 12, n: 7, price: 4, stem: 70, price44: 44 };
const QUOTE = { w: 1180, pad: 64, badge: 96, icon: 52, gap: 28, title: 54, body: 38, y: 500, blur: 8, dim: 0.6 };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const SC14 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const L = (g: number) => local(g, BLOCK.SC14);
  const p1 = ease(f, L(B14.pair), m.move);
  const p2 = ease(f, L(B14.shift), m.move);
  /* UNTR's visible centre and scale, from SC13's size to half of it to its place on the left */
  const k = lerp(UNTR_K, G14.k1, p1);
  const vx = lerp(lerp(UNTR_C.x + UNTR_PX.right, G14.untrX, p1), theme.margin.left + G14.w1 / 2, p2);
  /* "sejajar bawah dengan Rp 15 ribu": at its place on the left, UNTR's label sits on the price label's line */
  const priceY = R14.y - R14.r - R14.stem - R14.price44;
  const vy = lerp(lerp(UNTR_C.y, P14.rowCy, p1), priceY - P14.below - G14.h1 / 2, p2);
  const untrH = (UNTR_PX.ink.y1 - UNTR_PX.ink.y0) * k;
  /* the exchange: the coin goes over the top, the document comes back underneath */
  const q = ease(f, L(B14.swap), m.sec(1.4));
  /* both icons live BEHIND both pictures: the coin leaves from behind Lo Kheng Hong and goes behind UNTR, the document the other way */
  const lkh = { x: G14.lkhX, y: P14.rowCy };
  const untr = { x: G14.untrX, y: P14.rowCy };
  const bez = (a: { x: number; y: number }, b: { x: number; y: number }, bend: number, t: number) => {
    const cx = (a.x + b.x) / 2;
    const cy = (a.y + b.y) / 2 + bend;
    const u = 1 - t;
    return { x: u * u * a.x + 2 * u * t * cx + t * t * b.x, y: u * u * a.y + 2 * u * t * cy + t * t * b.y };
  };
  /* "kasih jejak": a dashed trail drawn behind each, left in place a moment after they arrive */
  const trailOpacity = 1 - ease(f, L(B14.swap) + m.sec(1.4) + m.sec(0.4), m.sec(P14.trailFade));
  const trail = (a: { x: number; y: number }, b: { x: number; y: number }, bend: number) =>
    Array.from({ length: P14.samples + 1 }, (_, i) => {
      const t = (q * i) / P14.samples;
      const u = bez(a, b, bend, t);
      return `${i === 0 ? "M" : "L"} ${u.x.toFixed(1)} ${u.y.toFixed(1)}`;
    }).join(" ");
  const coin = bez(lkh, untr, -P14.arc * 2, q);
  const doc = bez(untr, lkh, P14.arc * 2, q);
  /* the roadmap */
  const x0 = theme.margin.left;
  const x1 = theme.canvas.width - theme.margin.right;
  const dotX = (i: number) => lerp(theme.margin.left + G14.w1 / 2, x1, i / (R14.n - 1));
  const lineP = ease(f, L(B14.shift) + m.move, m.sec(0.8));
  /* the quote: everything but the grid steps back */
  const dim = ease(f, L(B14.caution), m.move);
  const card = ease(f, L(B14.caution), m.reveal);
  const body = ease(f, L(B14.nggak), m.reveal);
  return (
    <Stage>
      <div style={{ position: "absolute", inset: 0, clipPath: OUTSIDE_RESERVES }}>
        <GridGround f={f + BLOCK.SC14} paper={c.bg} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - QUOTE.dim * dim, filter: dim > 0.01 ? `blur(${(QUOTE.blur * dim).toFixed(2)}px)` : undefined }}>
        {/* SC13's last label, as it stood, leaving as the pair forms */}
        {f < L(B14.pair) + m.sec(0.25) ? (
          <div style={{ position: "absolute", left: ZOOM_TO.x, top: ZOOM_TO.y, opacity: 1 - ease(f, L(B14.pair), m.sec(0.25)), fontFamily: theme.text.family, fontSize: ROAD.label * ZOOM.scale, fontWeight: 600, lineHeight: ROAD.leading, color: c.ink, whiteSpace: "pre" }}>
            {STOPS[3].lines.join("\n")}
          </div>
        ) : null}
        {/* the coin and the document, each leaving a dashed trail — all of it behind both pictures */}
        {q > 0.001 && trailOpacity > 0.001 ? (
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: trailOpacity }}>
            <path d={trail(lkh, untr, -P14.arc * 2)} fill="none" stroke={c.indigo} strokeWidth={P14.trail} strokeLinecap="round" strokeDasharray={P14.dash} />
            <path d={trail(untr, lkh, P14.arc * 2)} fill="none" stroke={c.indigo} strokeWidth={P14.trail} strokeLinecap="round" strokeDasharray={P14.dash} />
          </svg>
        ) : null}
        {q > 0.001 && q < 0.999 ? (
          <>
            <div style={{ position: "absolute", left: coin.x - P14.coin / 2, top: coin.y - P14.coin / 2, width: P14.coin, height: P14.coin, borderRadius: 99, background: theme.color.coinYellow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: P14.coin * 0.4, fontWeight: 800, color: c.ink }}>
              Rp
            </div>
            <div style={{ position: "absolute", left: doc.x - P14.doc / 2, top: doc.y - P14.doc / 2 }}>
              <Icon name="doc" size={P14.doc} color={c.indigo} stroke={2.6} fill={theme.color.indigoWash} />
            </div>
          </>
        ) : null}
        {/* Lo Kheng Hong, on the left of UNTR at its height, his name beneath him; the foot of the portrait fades */}
        <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `linear-gradient(to bottom, black ${P14.rowCy + G14.h1 / 2 - P14.foot * G14.h1}px, transparent ${P14.rowCy + G14.h1 / 2}px)`, maskImage: `linear-gradient(to bottom, black ${P14.rowCy + G14.h1 / 2 - P14.foot * G14.h1}px, transparent ${P14.rowCy + G14.h1 / 2}px)` }}>
          <Cutout src={FOTO.src} aspect={FOTO.aspect} x={G14.lkhX} y={P14.rowCy + G14.h1 / 2} h={G14.h1} at={L(B14.pair)} out={L(B14.shift)} rise={FOTO.rise / 4} riseFrames={m.move} />
        </div>
        <Say text="Lo Kheng Hong" x={G14.lkhX} y={P14.rowCy + G14.h1 / 2 + P14.below} at={L(B14.pair)} out={L(B14.shift)} size={48} weight={800} />
        {/* UNTR.png: from SC13's size to half, then to the left */}
        <Cutout src={UNTR_IMG.src} aspect={UNTR_IMG.aspect} x={vx + (UNTR_PX.w / 2 - UNTR_C.ix) * k} y={vy + (UNTR_PX.h - UNTR_C.iy) * k} h={UNTR_PX.h * k} at={-m.sec(2)} rise={0} />
        <Say text="UNTR = Rp 250" x={vx} y={vy + untrH / 2 + P14.below} at={L(B14.label)} size={48} weight={800} />
        {/* the roadmap: the line draws on, the dots come up one by one to its right end; the third from the right carries the price */}
        {f >= L(B14.shift) + m.move ? (
          <>
            <div style={{ position: "absolute", left: x0 - R14.end / 2, top: R14.y - R14.end / 2, width: R14.end, height: R14.end, borderRadius: 99, background: c.ink }} />
            <div style={{ position: "absolute", left: x0, top: R14.y - R14.rule / 2, width: (x1 - x0) * lineP, height: R14.rule, background: c.ink }} />
          </>
        ) : null}
        {Array.from({ length: R14.n }, (_, i) => {
          const at = L(B14.dots[0]) + ((L(B14.dots[1]) - L(B14.dots[0])) * i) / (R14.n - 1);
          const dot = ease(f, at, m.reveal);
          if (dot <= 0.001) return null;
          return <div key={i} style={{ position: "absolute", left: dotX(i) - R14.r, top: R14.y - R14.r, width: 2 * R14.r, height: 2 * R14.r, borderRadius: 99, background: c.ink, transform: `scale(${dot.toFixed(4)})` }} />;
        })}
        {f >= L(B14.rp15) ? (
          <>
            <div style={{ position: "absolute", left: dotX(R14.price) - 1, top: R14.y - R14.r - R14.stem, width: 2, height: R14.stem, background: c.ink, transformOrigin: "bottom", transform: `scaleY(${ease(f, L(B14.rp15), m.sec(0.3)).toFixed(4)})` }} />
            <Say text="Rp 15,000" x={dotX(R14.price)} y={priceY} at={L(B14.rp15)} size={56} weight={800} />
          </>
        ) : null}
      </div>
      {/* the quote — "Contoh dari masa lalu", then the line it stands for, on one clean card */}
      {card > 0.001 ? (
        <div style={{ position: "absolute", left: (theme.canvas.width - QUOTE.w) / 2, top: QUOTE.y, width: QUOTE.w, boxSizing: "border-box", padding: QUOTE.pad, transform: `translateY(calc(-50% + ${((1 - card) * 24).toFixed(2)}px))`, opacity: card, background: c.cardBg, border: `${theme.shape.rule}px solid ${c.border}`, borderRadius: theme.shape.cardRadius, boxShadow: shadow.soft, fontFamily: theme.text.family }}>
          <div style={{ display: "flex", alignItems: "center", gap: QUOTE.gap }}>
            <div style={{ width: QUOTE.badge, height: QUOTE.badge, flex: "none", borderRadius: 99, background: theme.color.indigoWash, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="hourglass" size={QUOTE.icon} color={c.indigo} />
            </div>
            <div style={{ fontSize: QUOTE.title, fontWeight: 800, color: c.ink, lineHeight: 1.15 }}>Contoh dari masa lalu</div>
          </div>
          <div style={{ height: theme.shape.rule, background: c.border, margin: `${QUOTE.gap}px 0` }} />
          <div style={{ fontSize: QUOTE.body, fontWeight: 600, color: c.slate, lineHeight: 1.3, opacity: body, transform: `translateY(${((1 - body) * 12).toFixed(2)}px)` }}>Nggak semua investasi akan memberikan hasil seperti ini.</div>
        </div>
      ) : null}
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

/** The scalloped badge on a box's corner: a starburst, the ✗ or the ✓ drawn across it in the paper's colour. */
const BADGE = { r: 58, teeth: 18, dip: 0.9, mark: 0.42, stroke: 11 };
const Badge = ({ mark, fill, p }: { mark: "x" | "check"; fill: string; p: number }) => {
  const c = usePalette();
  const pts = Array.from({ length: BADGE.teeth * 2 }, (_, i) => {
    const a = (Math.PI * i) / BADGE.teeth;
    const r = BADGE.r * (i % 2 === 0 ? 1 : BADGE.dip);
    return `${(BADGE.r + r * Math.cos(a)).toFixed(2)},${(BADGE.r + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  const u = BADGE.r * BADGE.mark;
  const o = BADGE.r;
  return (
    <svg width={2 * BADGE.r} height={2 * BADGE.r} style={{ overflow: "visible", opacity: p, transform: `scale(${(0.8 + 0.2 * p).toFixed(4)})` }}>
      <polygon points={pts} fill={fill} stroke={fill} strokeWidth={6} strokeLinejoin="round" />
      {mark === "x" ? (
        <path d={`M ${o - u} ${o - u} L ${o + u} ${o + u} M ${o + u} ${o - u} L ${o - u} ${o + u}`} stroke={c.cardBg} strokeWidth={BADGE.stroke} strokeLinecap="round" fill="none" />
      ) : (
        <path d={`M ${o - u * 1.1} ${o + u * 0.05} L ${o - u * 0.3} ${o + u * 0.85} L ${o + u * 1.15} ${o - u * 0.8}`} stroke={c.cardBg} strokeWidth={BADGE.stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      )}
    </svg>
  );
};
/**
 * "Myth or Fact" layout: a title, then two stacked boxes, each with a badge on its top-left corner. The
 * title is set exactly as "Tanya juga" is (ColdOpen's quiz label); the pair of boxes is 75% of its size ("kedua kotaknya coba kecilin" after 90%),
 * hung from its top edge.
 */
const MF = { w: 1200, h: 250, gap: 60, titleY: 160, top: 270, text: 50, rise: 24, scale: 0.75 };
/**
 * OrangTuntun.png at the left, standing on the floor — "buat … align-left semua, lalu geser kanan semua,
 * supaya di kiri bisa muat OrangTuntun" — his visible figure from `top` down to the subtitle band, and
 * the boxes beside him: the figure, a gap, and the boxes centred on the canvas together.
 */
const MAN15 = { src: "art/vi01/orang-tuntun.png", w: 941, h: 1672, ink: { x0: 233, x1: 794, y0: 84, y1: 1619 }, top: 130, gap: 140, lift: 56 };
/** His feet stand `lift` above the subtitle band, so the floor shadow under them stays out of it. */
const MAN_FLOOR = theme.captionBand.top - MAN15.lift;
const MAN_K = (MAN_FLOOR - MAN15.top) / (MAN15.ink.y1 - MAN15.ink.y0);
const MAN_W = (MAN15.ink.x1 - MAN15.ink.x0) * MAN_K;
const MAN_LEFT = (theme.canvas.width - (MAN_W + MAN15.gap + MF.w * MF.scale)) / 2;
/** Left edge of the title and of both boxes. */
const BOX_LEFT = MAN_LEFT + MAN_W + MAN15.gap;

export const SC15 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const L = (g: number) => local(g, BLOCK.SC15);
  const x = BOX_LEFT;
  const boxTop = (i: number) => MF.top + i * (MF.h + MF.gap);
  /* the boxes give way when the five steps come up */
  const gone = ease(f, L(B15.steps[0]) - m.fade, m.fade);
  const title = ease(f, L(B15.bukan), m.reveal);
  /** One box: it comes up, its words after, its badge at `badgeAt`; `mute` (0→1) greys the box and its words. */
  const box = (i: number, at: number, textAt: number, badgeAt: number, fill: string, mark: "x" | "check", badge: string, words: string, mute: number, type: { ink: string; weight: number; italic: boolean }) => {
    const p = ease(f, at, m.reveal);
    const t = ease(f, textAt, m.reveal);
    const b = ease(f, badgeAt, m.reveal);
    if (p <= 0.001) return null;
    return (
      <div key={i}>
        <div style={{ position: "absolute", left: x, top: boxTop(i), width: MF.w, height: MF.h, opacity: p, transform: `translateY(${((1 - p) * MF.rise).toFixed(2)}px)`, background: fill, borderRadius: theme.shape.cardRadius, boxShadow: shadow.soft, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: MF.text, fontWeight: type.weight, fontStyle: type.italic ? "italic" : "normal", textAlign: "center", padding: "0 80px", boxSizing: "border-box" }}>
          {/* the grey it turns to, over the box and under the words */}
          <div style={{ position: "absolute", inset: 0, borderRadius: theme.shape.cardRadius, background: c.border, opacity: mute }} />
          <span style={{ position: "relative", opacity: t, transform: `translateY(${((1 - t) * 12).toFixed(2)}px)` }}>
            <span style={{ color: type.ink, opacity: 1 - mute }}>{words}</span>
            <span style={{ position: "absolute", left: 0, top: 0, width: "100%", color: c.muted, opacity: mute }}>{words}</span>
          </span>
        </div>
        {b > 0.001 ? (
          <div style={{ position: "absolute", left: x - BADGE.r, top: boxTop(i) - BADGE.r }}>
            <Badge mark={mark} fill={badge} p={b} />
          </div>
        ) : null}
      </div>
    );
  };
  /* box 1: its words, then its ✗, then the whole box goes grey */
  const xAt = L(B15.quote) + m.reveal;
  const mute1 = ease(f, xAt + m.reveal, m.move);
  return (
    <Stage>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - gone }}>
        {/* OrangTuntun, at the left with his feet on the floor */}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${theme.captionBand.height}px 0)` }}>
          <Cutout src={MAN15.src} aspect={MAN15.w / MAN15.h} x={MAN_LEFT + MAN_W / 2 + (MAN15.w / 2 - (MAN15.ink.x0 + MAN15.ink.x1) / 2) * MAN_K} y={MAN_FLOOR + (MAN15.h - MAN15.ink.y1) * MAN_K} h={MAN15.h * MAN_K} at={L(B15.bukan)} rise={theme.canvas.height - MAN15.top} riseFrames={m.move} shadow floor={MAN15.ink.y1 / MAN15.h} />
        </div>
        {/* "yang menarik adalah", in the type of "Tanya juga", left-aligned with the boxes */}
        <div style={{ position: "absolute", left: BOX_LEFT, top: MF.titleY, textAlign: "left", whiteSpace: "nowrap", opacity: title, transform: `translateY(${((1 - title) * 12).toFixed(2)}px)`, ...quizLabelStyle(c) }}>yang menarik adalah</div>
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${BOX_LEFT}px ${MF.top}px`, transform: `scale(${MF.scale})` }}>
          {box(0, L(B15.box1), L(B15.quote), xAt, c.cardBg, "x", theme.color.calendarRed, "Cari saham yang bisa naik berkali-kali", mute1, { ink: c.ink, weight: 400, italic: true })}
          {box(1, L(B15.box2), L(B15.strike), L(B15.box2), theme.color.checkGreenWash, "check", theme.color.checkGreen, "Yang penting prosesnya", 0, { ink: theme.color.checkGreenInk, weight: 700, italic: false })}
        </div>
      </div>
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
