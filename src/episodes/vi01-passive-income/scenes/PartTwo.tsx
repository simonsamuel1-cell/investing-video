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
import { Img, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadVibes } from "@remotion/google-fonts/GreatVibes";
import { GridGround, Stage, theme, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK, SC09 as B9, SC10 as B10, SC11 as B11, SC12 as B12, local } from "../data/timing";
import { Cutout, OUTSIDE_RESERVES, ease, Pill, Icon, Say, TypeBox, useLife } from "../components/kit";

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
/** The whole group — lamp, sunburst, words — 100 px higher than first set ("grup them all, lalu geser naik 100 px"). */
const LAMP = { cx: 960, cy: 300, h: 300, rays: 24, script: 140, sans: 84, gap: 36, textY: 0 };
/**
 * "pilih 2 fase aja: fase normal dan fase rotate. fase 1, 2 detik; fase 2, 2
 * detik; balik lagi." — a jump, no in-between frames.
 */
const WOBBLE = { deg: 10, holdSec: 1 }; // then "tiap 1 detik aja deh, rotatenya 10 derajat"
const LAMP_IMG_H = (LAMP.h * 5000) / (4757 - 253);
const SUN_D = LAMP.h + 30;

const Fakta = ({ at, shrinkAt }: { at: number; shrinkAt: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const life = useLife(at);
  /* stop motion: no in-between frames, just a jump every hold */
  const tilt = Math.floor(f / m.sec(WOBBLE.holdSec)) % 2 ? WOBBLE.deg : 0;
  /* 9250: the words blur out; the lamp and its sunburst go to half size, up to the top */
  const shrink = ease(f, shrinkAt, m.move);
  const wordsOut = ease(f, shrinkAt, m.move);
  if (life <= 0.001) return null;
  const R = SUN_D / 2;
  const k = 1 - KORP.lampShrink * shrink;
  const dy = (KORP.lampY - LAMP.cy) * shrink;
  const wedge = (k: number) => {
    const a0 = (k / LAMP.rays) * Math.PI * 2;
    const a1 = ((k + 1) / LAMP.rays) * Math.PI * 2;
    return `M ${R} ${R} L ${R + Math.cos(a0) * R} ${R + Math.sin(a0) * R} A ${R} ${R} 0 0 1 ${R + Math.cos(a1) * R} ${R + Math.sin(a1) * R} Z`;
  };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: life }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${dy.toFixed(2)}px) scale(${k.toFixed(4)})`, transformOrigin: `${LAMP.cx}px ${LAMP.cy}px` }}>
      {/* the sunburst behind the lamp — alternating rays, cut to a circle */}
      <svg width={SUN_D} height={SUN_D} style={{ position: "absolute", left: LAMP.cx - R, top: LAMP.cy - R, transform: `rotate(${tilt}deg)` }}>
        {/* yellow rays only — the orange ones taken out, left empty ("biarkan bagian yang dihapus itu kosong") */}
        {Array.from({ length: LAMP.rays }, (_, k) => (k % 2 ? <path key={k} d={wedge(k)} fill={theme.color.sunYellow} /> : null))}
      </svg>
      <Cutout src="art/vi01/lampu.png" aspect={1} x={LAMP.cx} y={LAMP.cy + LAMP.h / 2 + ((5000 - 4757) / 5000) * LAMP_IMG_H} h={LAMP_IMG_H} at={at} rise={0} />
      </div>
      {wordsOut < 0.999 ? (
      <div style={{ position: "absolute", left: 0, right: 0, top: LAMP.cy + LAMP.h / 2 + LAMP.gap + LAMP.textY, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 22, lineHeight: 1, opacity: 1 - wordsOut, filter: `blur(${(wordsOut * KORP.blur).toFixed(2)}px)` }}>
        <span style={{ fontFamily: VIBES, fontSize: LAMP.script, color: c.ink }}>fakta</span>
        <span style={{ fontFamily: theme.text.family, fontSize: LAMP.sans, fontWeight: 700, color: c.indigo }}>menarik</span>
      </div>
      ) : null}
    </div>
  );
};

/**
 * 9250's picture: "KerjaKorporat.png" (1448 × 1086), rounded, blurring in
 * under the lamp once the words have blurred out.
 */
const KORP = { lampShrink: 0.5, lampY: 175, blur: 14, top: 290, h: 640, radius: 32, small: 0.5, overhang: 160, drop: -50 };
/** "GedungBCA.jpg" (1200 × 675) at its own ratio, the same height — its width follows ("lock ratio"). */
const BCA_W = (KORP.h * 1200) / 675;
const KORP_W = (KORP.h * 1448) / 1086;

/** One rounded photo, blurring in. */
const Photo = ({ src, left, top, w, h, at, children }: { src: string; left: number; top: number; w: number; h: number; at: number; children?: React.ReactNode }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const shadow = useShadow();
  const t = ease(f, at, m.move);
  if (t <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left, top, width: w, height: h, borderRadius: KORP.radius, overflow: "hidden", boxShadow: shadow.soft, opacity: t, filter: `blur(${((1 - t) * KORP.blur).toFixed(2)}px)` }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} showInTimeline={false} />
      {children}
    </div>
  );
};

/**
 * "dengan posisi dan size yang sama, ada foto GedungBCA.jpg, tapi gambar
 * KerjaKorporat nya ngga hilang, melainkan ukurannya kecil (60%) overlap
 * dengan GedungBCA di pojok kiri bawah" — and on the small one, bottom left,
 * "AI generated image".
 */
const Korporat = ({ at, insetAt }: { at: number; insetAt: number }) => {
  const c = usePalette();
  const left = (theme.canvas.width - BCA_W) / 2;
  const sw = KORP_W * KORP.small;
  const sh = KORP.h * KORP.small;
  return (
    <>
      <Photo src="art/vi01/gedung-bca.jpg" left={left} top={KORP.top} w={BCA_W} h={KORP.h} at={at} />
      <Photo src="art/vi01/kerja-korporat.png" left={left - KORP.overhang} top={KORP.top + KORP.h + KORP.drop - sh} w={sw} h={sh} at={insetAt}>
        <div style={{ position: "absolute", left: 16, bottom: 16, padding: "6px 12px", borderRadius: 10, background: c.ink, opacity: 0.75, fontFamily: theme.text.family, fontSize: 20, fontWeight: 600, color: c.cardBg, lineHeight: 1, whiteSpace: "nowrap" }}>
          AI generated image
        </div>
      </Photo>
    </>
  );
};


/** The dashed box under "fakta menarik". */
const TAK = { y: 680, w: 1340, h: 120, size: 44 };

/**
 * After the slide at 9474: the man looking at his phone on the left
 * ("LiatHP.png", 1086 × 1448, cut at the waist — his feet are off the file),
 * the BBCA chart screenshot beside him ("ChartBBCA.png", 4084 × 5834); at 9599
 * the portfolio screenshot ("Portfolio.jpg", 750 × 512) rises in, centred on the
 * chart top to bottom, 20% of it over the chart's right edge and 80% beyond; at 9662 he becomes "OrangSenang.png".
 */
/* then "Portfolio nya kecilin 30%, chartnya gedein 15%", and the man 50 px to the left */
/* portDown: "Geser portofolionya 80 px ke bawah" */
const BBCA = { personH: 660, chartH: 600 * 1.15, top: 268, gap: 60, radius: 24, portW: 560 * 0.7, portInside: 0.2, portDown: 80, portRise: 200, personShift: -50 };
const PERSON_W = (BBCA.personH * 1086) / 1448;
const CHART_W = (BBCA.chartH * 4084) / 5834;
const BBCA_LEFT = (theme.canvas.width - (PERSON_W + BBCA.gap + CHART_W)) / 2;
const PERSON_X = BBCA_LEFT + PERSON_W / 2 + BBCA.personShift;
const CHART_LEFT = BBCA_LEFT + PERSON_W + BBCA.gap;
const PORT_H = (BBCA.portW * 512) / 750;

const BbcaSet = ({ portfolioAt, senangAt }: { portfolioAt: number; senangAt: number }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const shadow = useShadow();
  const port = ease(f, portfolioAt, m.move);
  /* "transisi antar imagenya jangan fade, tapi no animation aja (jadi patah)" */
  const swap = f >= senangAt ? 1 : 0;
  const card = (left: number, top: number, w: number, h: number, src: string, extra?: React.CSSProperties) => (
    <div style={{ position: "absolute", left, top, width: w, height: h, borderRadius: BBCA.radius, overflow: "hidden", boxShadow: shadow.soft, ...extra }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} showInTimeline={false} />
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${theme.captionBand.height}px 0)` }}>
      {/* the man, cut at the caption band; at 9662 he is simply happy — a hard swap */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - swap }}>
        <Cutout src="art/vi01/liat-hp.png" aspect={1086 / 1448} x={PERSON_X} y={theme.captionBand.top} h={BBCA.personH} at={-m.reveal} rise={0} shadow floor={1.2} />
      </div>
      {swap > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: swap }}>
          <Cutout src="art/vi01/orang-senang.png" aspect={1086 / 1448} x={PERSON_X} y={theme.captionBand.top} h={BBCA.personH} at={-m.reveal} rise={0} shadow floor={1.2} />
        </div>
      ) : null}
      {card(CHART_LEFT, BBCA.top, CHART_W, BBCA.chartH, "art/vi01/chart-bbca.png")}
      {port > 0.001
        ? card(CHART_LEFT + CHART_W - BBCA.portInside * BBCA.portW, BBCA.top + BBCA.chartH / 2 - PORT_H / 2 + BBCA.portDown + (1 - port) * BBCA.portRise, BBCA.portW, PORT_H, "art/vi01/portfolio.jpg", { opacity: port })
        : null}
    </div>
  );
};

export const SC09 = () => {
  const c = usePalette();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC09);
  const f = useCurrentFrame();
  const out = ease(f, L(B9.korporat), m.move);
  /* 9474: everything but the lamp slides out left, the BBCA set in from the right */
  const slide = ease(f, L(B9.slide), m.move);
  /* "visual yang ada di scene ini sebelumnya, hapus aja (kecuali visual dariku)" */
  return (
    <Stage>
      {/* in from the first frame, so it comes in with the CameraCut */}
      <Fakta at={-m.reveal} shrinkAt={L(B9.korporat)} />
      {/* Simon's short line, under "fakta menarik", in an indigo dashed box — blurs out at 9250 */}
      {out < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out, filter: `blur(${(out * KORP.blur).toFixed(2)}px)` }}>
          <TypeBox cx={theme.canvas.width / 2} y={TAK.y} w={TAK.w} h={TAK.h} at={L(B9.tak)} text="Tak perlu jadi karyawan untuk ikut memiliki bisnisnya." size={TAK.size} boxInk={c.indigo} italic={false} />
        </div>
      ) : null}
      {/* then the office floor blurs in; at 9474 it slides out to the left */}
      {slide < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(-theme.canvas.width * slide).toFixed(2)}px)` }}>
          <Korporat at={L(B9.korporat) + m.move / 2} insetAt={L(B9.korporatInset)} />
        </div>
      ) : null}
      {slide > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(theme.canvas.width * (1 - slide)).toFixed(2)}px)` }}>
          <BbcaSet portfolioAt={L(B9.portfolio)} senangAt={L(B9.senang)} />
        </div>
      ) : null}
    </Stage>
  );
};

// ═══ SC10 — the products around us, and who is behind them ═══════════════
/**
 * The worker at an empty table ("Makanan Meja Kosong.png", 1086 × 1448), head
 * to knee, centred under the title and cut at the caption band; the products
 * come up on the table where "Makanan Meja Isi.png" has them. Each product is
 * a 1254 × 1254 file; `at` is its spot in the table file's pixels
 * (x0–x1, its bottom on the table top), `solid` its own drawn columns/rows.
 */
const MEJA = { fileW: 1086, fileH: 1448, top: 31, knee: 1000, feet: 1430, from: 250 };
/** At SC10.fullBody the whole picture shrinks about the top of his head until his feet clear the caption band. */
const MEJA_FULL = (theme.captionBand.top - 12 - MEJA.from) / (MEJA.feet - MEJA.top) / ((theme.captionBand.top - MEJA.from) / (MEJA.knee - MEJA.top));
const MEJA_K = (theme.captionBand.top - MEJA.from) / (MEJA.knee - MEJA.top);
const MEJA_H = MEJA.fileH * MEJA_K;
const MEJA_LEFT = (theme.canvas.width - MEJA.fileW * MEJA_K) / 2;
const MEJA_TOP = MEJA.from - MEJA.top * MEJA_K;
type Product = { src: string; x0: number; x1: number; y1: number; solid: [number, number, number, number]; beat: 0 | 1 | 2 };
const PRODUCTS: Product[] = [
  { src: "art/vi01/indomie.png", x0: 197, x1: 413, y1: 695, solid: [34, 1221, 199, 1053], beat: 0 },
  { src: "art/vi01/mangkok-mie.png", x0: 420, x1: 660, y1: 698, solid: [24, 1229, 273, 1050], beat: 0 },
  { src: "art/vi01/susu.png", x0: 82, x1: 200, y1: 680, solid: [324, 930, 42, 1195], beat: 1 },
  { src: "art/vi01/kopiko.png", x0: 682, x1: 828, y1: 696, solid: [222, 1031, 47, 1202], beat: 2 },
  { src: "art/vi01/tolak-angin.png", x0: 835, x1: 1033, y1: 696, solid: [37, 1217, 242, 1029], beat: 2 },
];

/** A product easing down onto the table. */
const OnTable = ({ p, at }: { p: Product; at: number }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const t = ease(f, at, m.reveal);
  if (t <= 0.001) return null;
  const [sx0, sx1, , sy1] = p.solid;
  const size = ((p.x1 - p.x0) * MEJA_K * 1254) / (sx1 - sx0);
  const k = size / 1254;
  const left = MEJA_LEFT + p.x0 * MEJA_K - sx0 * k;
  const top = MEJA_TOP + p.y1 * MEJA_K - sy1 * k;
  return <Img src={staticFile(p.src)} showInTimeline={false} style={{ position: "absolute", left, top: top - (1 - t) * 30, width: size, height: size, opacity: t }} />;
};

/**
 * THE PHONES. One phone template — slate bezel, round corners, an island —
 * showing a stock page — the whole "Saham_" screenshot (4084 × 8000), uncut
 * ("ukurannya sesuai aja, jangan di crop"); the screen takes its ratio.
 */
const SCREEN_RATIO = 4084 / 8000;
const PH = { h: 700, top: 250, bezel: 8, radius: 52, big: 1.45, row: 0.82, gap: 40 };
const PH_SCREEN_H = PH.h - PH.bezel * 2;
const PH_W = PH_SCREEN_H * SCREEN_RATIO + PH.bezel * 2;
/** Left to right once there are four; the first phone (ICBP) is second from the left. */
const SAHAM = ["ultj", "icbp", "myor", "sido"];
const MAIN = 1;

const PhoneShot = ({ code, cx }: { code: string; cx: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
    <div style={{ position: "absolute", left: cx - PH_W / 2, top: PH.top, width: PH_W, height: PH.h, borderRadius: PH.radius, background: c.slate, boxShadow: shadow.soft, padding: PH.bezel, boxSizing: "border-box" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: PH.radius - PH.bezel, overflow: "hidden", background: c.cardBg }}>
        <Img src={staticFile(`art/vi01/saham-${code}.png`)} showInTimeline={false} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "auto" }} />
        <div style={{ position: "absolute", left: "50%", top: 10, width: 86, height: 24, marginLeft: -43, borderRadius: 12, background: c.ink }} />
      </div>
    </div>
  );
};

/**
 * 10500: one phone rises from below the frame, big enough to cover the man and
 * the table; once it has, they are gone. It shrinks (about its top centre)
 * until it fits between the title and the caption band. 10657: three more slide
 * out from behind it — one to the left, two to the right — and the main one
 * moves left, all settling a little smaller so four fit in one row.
 */
const Phones = ({ at, spreadAt, dropAt }: { at: number; spreadAt: number; dropAt: number }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  if (f < at) return null;
  const rise = ease(f, at, m.move);
  const fit = ease(f, at + m.move + m.sec(0.2), m.move);
  const spread = ease(f, spreadAt, m.move);
  const scale = PH.big + (1 - PH.big) * fit + (PH.row - 1) * spread;
  /* and at the scene's end they all drop out of the frame */
  const drop = ease(f, dropAt, m.move);
  const lift = (1 - rise) * (theme.canvas.height - PH.top + 40) + drop * (theme.canvas.height - PH.top + 40);
  const step = (PH_W * PH.row + PH.gap) / PH.row;
  const slot = (i: number) => theme.canvas.width / 2 + (i - (SAHAM.length - 1) / 2) * step;
  const x = (i: number) => theme.canvas.width / 2 + (slot(i) - theme.canvas.width / 2) * spread;
  const order = SAHAM.map((_, i) => i).filter((i) => i !== MAIN).concat(MAIN);
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${theme.captionBand.height}px 0)` }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${lift.toFixed(2)}px) scale(${scale.toFixed(4)})`, transformOrigin: `${theme.canvas.width / 2}px ${PH.top}px` }}>
        {/* the three extras behind the main one until they slide out */}
        {order.map((i) => (i === MAIN || spread > 0.001 ? <PhoneShot key={SAHAM[i]} code={SAHAM[i]} cx={x(i)} /> : null))}
      </div>
    </div>
  );
};

export const SC10 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const L = (g: number) => local(g, BLOCK.SC10);
  const shrink = ease(f, L(B10.fullBody), m.move);
  /* the man and the products are gone once the rising phone covers them */
  const covered = f >= L(B10.phone) + m.move;
  const full = 1 - (1 - MEJA_FULL) * shrink;
  const c = usePalette();
  return (
    <Stage>
      {/* "Saat mengecil, muncul background kotak kotak" — the grid comes up with the shrink */}
      {shrink > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: shrink, clipPath: OUTSIDE_RESERVES }}>
          <GridGround f={f + BLOCK.SC10} paper={c.bg} />
        </div>
      ) : null}
      {/* the title in two stages: from the scene's start (9779), then from the phone (10500) */}
      <Say text="Ga perlu beli produk buat jadi investor" x={960} y={190} at={0} out={L(B10.phone)} size={52} color={c.indigo} />
      <Say text="Investasi jadi pemilik bisnis" x={960} y={190} at={L(B10.phone) + m.fade} out={BLOCK.SC11 - BLOCK.SC10 - m.move} size={52} color={c.indigo} />
      {!covered ? (
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${theme.captionBand.height}px 0)` }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${full.toFixed(4)})`, transformOrigin: `${theme.canvas.width / 2}px ${MEJA.from}px` }}>
        <Cutout src="art/vi01/meja-kosong.png" aspect={MEJA.fileW / MEJA.fileH} x={theme.canvas.width / 2} y={MEJA_TOP + MEJA_H} h={MEJA_H} at={L(B10.around)} rise={0} />
        {PRODUCTS.map((p) => (
          <OnTable key={p.src} p={p} at={L(B10.table[p.beat]) + (p.src.includes("mangkok") || p.src.includes("tolak") ? m.sec(0.15) : 0)} />
        ))}
        </div>
      </div>
      ) : null}
      <Phones at={L(B10.phone)} spreadAt={L(B10.phones)} dropAt={BLOCK.SC11 - BLOCK.SC10 - m.move} />
    </Stage>
  );
};

// ═══ SC11 — earning money vs building assets; the business wheel ═════════
const WHEEL = { cx: 900, cy: 620 };

/**
 * "OrangTuntun3.png", 941 × 1672: hair from row 115, the belly at about row
 * 880, head on column 466 — head to belly, rising in from below as SC10's
 * phones drop away. The two typed phrases sit either side of him.
 */
const TUNTUN3 = { aspect: 941 / 1672, rows: 1672, top: 115, belly: 880, headU: 466 / 941, from: 220 };
const TUNTUN3_H = ((theme.captionBand.top - TUNTUN3.from) * TUNTUN3.rows) / (TUNTUN3.belly - TUNTUN3.top);
/** Shoulder height, where he is narrowest — the phrases close in on either side without leaving the frame. */
const SIDE = { y: 490, size: 56, left: 660, right: 1260 }; // then 50 px lower; twice 50 px further out each side

/** A phrase typed out letter by letter. */
const Typed = ({ text, x, y, at, anchor, color }: { text: string; x: number; y: number; at: number; anchor: "left" | "right"; color: string }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const shown = Math.max(0, Math.floor(f - at));
  return (
    <div style={{ position: "absolute", top: y - SIDE.size * 0.6, ...(anchor === "left" ? { left: x } : { right: theme.canvas.width - x }), fontFamily: theme.text.family, fontSize: SIDE.size, fontWeight: 800, color, whiteSpace: "pre", lineHeight: 1.2 }}>
      {text.slice(0, shown)}
    </div>
  );
};

/**
 * 11220: he moves 300 px left and becomes "OrangTuntun4.png" (same 941 × 1672
 * canvas, hair from row 89, head on column 401 — pointing right), and the
 * panel fills the space on his right inside the margins and clear of the logo
 * zone. The business wheel and the owner, as they were, are stacked inside it.
 */
/**
 * "geser kiri sampe mentok" — his visible left edge (column 160) on the left
 * margin; his reach goes to column 926; the panel starts 50 px past it and
 * runs to the right margin.
 */
const TUNTUN4B = { top: 89, headU: 401 / 941, left: 160, right: 926, feet: 1600 };
/**
 * "komposisinya jadi 25 75": between the margins, his visible width (columns
 * 160–926), 50 px, then the panel, at 25 : 75. He shrinks while he moves left
 * — standing on the caption band, his left edge on the left margin — so
 * OrangTuntun4 arrives already small.
 */
const ROW_W = theme.canvas.width - theme.margin.left - theme.margin.right;
const PERSON11_W = (ROW_W - 50) * 0.25;
const K11 = PERSON11_W / (TUNTUN4B.right - TUNTUN4B.left);
/* "buat jadi keliatan full body": his shoes stand just over the caption band */
const HEAD11 = { x: theme.margin.left + (401 - TUNTUN4B.left) * K11, y: theme.captionBand.top - 12 - (TUNTUN4B.feet - TUNTUN4B.top) * K11 };
/**
 * The panel, fitted to the cycle: "width panelnya adjust lagi, sesuaikan sama
 * bagannya, geser juga ke kanan" — the cycle's own extent (its words and arcs)
 * plus `pad`, centred in the space to his right; it may touch his hand.
 */
const CYC = { l: -405, r: 315, t: -325, b: 300 };
const PANEL_PAD = 70;
const PANEL = {
  w: CYC.r - CYC.l + 2 * PANEL_PAD,
  y: theme.logoZone.height + 20,
  h: theme.captionBand.top - 80 - (theme.logoZone.height + 20),
  border: 4,
  x: 0,
};
const FREE_L = theme.margin.left + PERSON11_W;
PANEL.x = (FREE_L + theme.canvas.width - theme.margin.right) / 2 - PANEL.w / 2;
/** The cycle sits at the panel's top, its left-right middle on the panel's. */
const CYCLE_SHIFT = {
  x: PANEL.x + PANEL.w / 2 - (WHEEL.cx + (CYC.l + CYC.r) / 2),
  y: PANEL.y + 22 - (WHEEL.cy + CYC.t),
};
/** "di bagian bawah panel (overlap), muncul text box garis putus putus" — straddling the panel's bottom edge. */
const KITA = { h: 104, w: 1260, size: 32, text: "Kita (pemilik bisnis) dapat exposure dari pertumbuhan nilainya", mark: "Kita (pemilik bisnis) dapat exposure" };

/**
 * The business cycle, after Simon's reference ("Earn → Save → Invest →
 * Repeat"): the three words on a circle, curved arrows running clockwise
 * between them, "Sebuah bisnis" in the middle. Each word comes on its own
 * word in the VO; each arc draws on into the next one.
 */
const CYCLE = { r: 290, pad: 22, word: 52, arrow: 5, head: 18, icon: 150 };
/** How far round from a word the arc must start (or end) to clear the word's box by `pad`. */
const clearDeg = (text: string, deg: number, dir: 1 | -1) => {
  const hw = (text.length * CYCLE.word * 0.58) / 2 + CYCLE.pad;
  const hh = CYCLE.word * 0.6 + CYCLE.pad;
  const c0 = { x: Math.cos((deg * Math.PI) / 180) * CYCLE.r, y: Math.sin((deg * Math.PI) / 180) * CYCLE.r };
  for (let d = 1; d < 120; d++) {
    const a = ((deg + dir * d) * Math.PI) / 180;
    const x = Math.cos(a) * CYCLE.r - c0.x;
    const y = Math.sin(a) * CYCLE.r - c0.y;
    if (Math.abs(x) > hw || Math.abs(y) > hh) return d;
  }
  return 60;
};
const CYCLE_WORDS: { text: string; deg: number }[] = [
  { text: "Pendapatan", deg: -90 },
  { text: "Laba", deg: 30 },
  { text: "Berkembang", deg: 150 },
];

const Cycle = ({ steps, wheelAt }: { steps: number[]; wheelAt: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const { cx, cy } = WHEEL;
  const mid = ease(f, wheelAt, m.reveal);
  const pt = (deg: number) => ({ x: cx + CYCLE.r * Math.cos((deg * Math.PI) / 180), y: cy + CYCLE.r * Math.sin((deg * Math.PI) / 180) });
  /* each arc leaves one word and reaches the next, drawn on just before that word lands */
  const arcs = CYCLE_WORDS.map((w, i) => {
    const next = CYCLE_WORDS[(i + 1) % CYCLE_WORDS.length];
    const a0 = w.deg + clearDeg(w.text, w.deg, 1);
    const a1 = (next.deg <= w.deg ? next.deg + 360 : next.deg) - clearDeg(next.text, next.deg, -1);
    const at = i < CYCLE_WORDS.length - 1 ? steps[i + 1] - m.sec(0.4) : steps[2] + m.sec(0.2);
    return { a0, a1, p: ease(f, at, m.sec(0.5)) };
  });
  return (
    <>
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {arcs.map(({ a0, a1, p }, i) => {
          if (p <= 0.001) return null;
          const s = pt(a0);
          const e = pt(a1);
          const end = (a1 * Math.PI) / 180;
          const tx = -Math.sin(end);
          const ty = Math.cos(end);
          const nx = -ty;
          const ny = tx;
          const H = CYCLE.head;
          return (
            <g key={i}>
              <path d={`M ${s.x} ${s.y} A ${CYCLE.r} ${CYCLE.r} 0 0 1 ${e.x} ${e.y}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke={c.indigo} strokeWidth={CYCLE.arrow} strokeLinecap="round" />
              {p > 0.95 ? <path d={`M ${e.x + tx * H} ${e.y + ty * H} L ${e.x + nx * H * 0.7} ${e.y + ny * H * 0.7} L ${e.x - nx * H * 0.7} ${e.y - ny * H * 0.7} Z`} fill={c.indigo} strokeLinejoin="round" stroke={c.indigo} strokeWidth={2} /> : null}
            </g>
          );
        })}
      </svg>
      {CYCLE_WORDS.map((w, i) => {
        const p = pt(w.deg);
        return <Say key={w.text} text={w.text} x={p.x} y={p.y} at={steps[i]} size={CYCLE.word} weight={800} color={c.indigo} />;
      })}
      {/* "ganti 'Sebuah bisnis' jadi icon aja" — a company, easing in where the words were */}
      <div style={{ position: "absolute", left: cx - CYCLE.icon / 2, top: cy - CYCLE.icon / 2 + (1 - mid) * 16, opacity: mid }}>
        <Icon name="building" size={CYCLE.icon} color={c.indigo} stroke={2.6} fill={c.indigoSoft} />
      </div>
    </>
  );
};

export const SC11 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const L = (g: number) => local(g, BLOCK.SC11);
  const shift = ease(f, L(B11.panel), m.move);
  const swapped = f >= L(B11.panel) + m.move;
  const panel = ease(f, L(B11.panel), m.move);
  /* his scale, head position and head top, from where he stood to where Tuntun4 stands */
  const k0 = TUNTUN3_H / TUNTUN3.rows;
  const k = k0 + (K11 - k0) * shift;
  const H = TUNTUN3.rows * k;
  const headX = theme.canvas.width / 2 + (HEAD11.x - theme.canvas.width / 2) * shift;
  const headY = TUNTUN3.from + (HEAD11.y - TUNTUN3.from) * shift;
  return (
    <Stage>
      {/* the grid carries on from SC10 */}
      <div style={{ position: "absolute", inset: 0, clipPath: OUTSIDE_RESERVES }}>
        <GridGround f={f + BLOCK.SC11} paper={c.bg} />
      </div>
      {/* the panel: white, soft shadow, a silver gradient border */}
      {panel > 0.001 ? (
        <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: theme.shape.cardRadius, padding: PANEL.border, boxSizing: "border-box", background: `linear-gradient(135deg, ${c.border}, ${c.muted}, ${c.cardBg}, ${c.muted}, ${c.border})`, boxShadow: shadow.soft, opacity: panel, transform: `scale(${(0.97 + 0.03 * panel).toFixed(4)})` }}>
          <div style={{ width: "100%", height: "100%", borderRadius: theme.shape.cardRadius - PANEL.border, background: c.cardBg }} />
        </div>
      ) : null}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${theme.captionBand.height}px 0)` }}>
        {!swapped ? (
          <Cutout src="art/vi01/orang-tuntun-3.png" aspect={TUNTUN3.aspect} x={headX - (TUNTUN3.headU - 0.5) * H * TUNTUN3.aspect} y={headY - TUNTUN3.top * k + H} h={H} at={0} rise={theme.canvas.height - TUNTUN3.from} riseFrames={m.move} shadow floor={1.2} />
        ) : (
          /* "berubah (no fade)": the same scale, his head where it was */
          <Cutout src="art/vi01/orang-tuntun-4.png" aspect={TUNTUN3.aspect} x={HEAD11.x - (TUNTUN4B.headU - 0.5) * TUNTUN3.rows * K11 * TUNTUN3.aspect} y={HEAD11.y - TUNTUN4B.top * K11 + TUNTUN3.rows * K11} h={TUNTUN3.rows * K11} at={-m.reveal} rise={0} shadow floor={1.2} />
        )}
      </div>
      {/* "Di 11220, kedua text ini fade out" — as he moves */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - shift }}>
        <Typed text="menghasilkan uang" x={SIDE.left} y={SIDE.y} at={L(B11.typeUang)} anchor="right" color={c.indigo} />
        <Typed text="membangun aset" x={SIDE.right} y={SIDE.y} at={L(B11.typeAset)} anchor="left" color={c.indigo} />
      </div>


      {/* the cycle inside the panel; the Pemilik box and its two lines are gone */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${CYCLE_SHIFT.x}px, ${CYCLE_SHIFT.y}px)` }}>
        <Cycle steps={B11.steps.map(L)} wheelAt={L(B11.wheel)} />
      </div>
      {/* the line that closes it, a dashed box on the panel's bottom edge, "Kita … exposure" highlighted */}
      <TypeBox cx={PANEL.x + PANEL.w / 2} y={PANEL.y + PANEL.h - KITA.h / 2} w={KITA.w} h={KITA.h} at={L(B11.exposure)} text={KITA.text} mark={KITA.mark} markAt={L(B11.exposure) + 90} size={KITA.size} />
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
