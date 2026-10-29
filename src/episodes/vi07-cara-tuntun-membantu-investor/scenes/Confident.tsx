/**
 * VI07 · SC07 — "Saat Lagi Paling Yakin, Justru Perlu Berhenti". Situation 4, Terlalu yakin. Rebuilt 29 Oct (Simon:
 * "Ganti visual semua, rasanya kurang tepat") from the ChatGPT storyboard docs/vi-style/storyboards/VI07-SC07-terlalu-yakin.jpg.
 *
 *  A  the heading opens in the middle (as SC03/SC04/SC06); its subjudul is a "Percaya diri" gauge (Simon's reference,
 *     red round to green) whose needle climbs on "rasa percaya diri" and runs past the green end on "terlalu besar",
 *     shaking there. It docks once the needle is done; you come in on the left — Orang_1 in front of a cyan circle, head
 *     to waist, the head out over its top (his reference); then three green "Profit" circles, one per word, big and
 *     vertically centred on your right (Simon 29 Oct: "bentuknya lingkaran aja"), shrinking down to their place after
 *     "untung,"; over them, on "Saya sudah…", a thought
 *     bubble "Jago banget gua" (iMessage's shape, Simon's pick) and "Fahhh" with its sound effect (timing.ts SFX.fah).
 *     (A zoom in on you was tried and cancelled.)
 *  B  "Posisi diperbesar": coins stack into a tower;
 *     on "dana pinjaman" dashed red coins go on top and the pile starts to lean and sway (the higher, the more).
 *  C  the tower moves left and Tuntun Guidance drops in beside it as a notification, the bell ringing on "pengingat",
 *     and opens on "Kalau harga" for two reminders —
 *     SC03's real BUMI card (Company Quality, Fair Value, Bullish Signals, Exclusive Research & Guidance) with the Fair
 *     Value pointer sliding far into the red, and a thin reason against leverage;
 *     on "leverage." the borrowed coins slide off and the tower stands straight.
 *  D  "Peringatan ini…": a warning — yellow, a black "!" (Simon 29 Oct) — in the middle; "Bukan larangan," then "tapi
 *     jeda." pushing it left (as SC06's "Tunggu dulu."); Percaya diri → warning → Keputusan besar on their words.
 *
 * No figures: the scale, the bars and the coins are shapes.
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BUMI_CARD } from "../data/bumi-card";
import { BLOCK, SFX, heldAt } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, HEADING, Mark, OpeningHeading, SITUATION, ease, useAppear, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A — the subjudul gauge: a half ring of six bands (degrees, 180 = the red end on the left, 0 = the green end)
const GAUGE = { r: 170, band: 54, needle: 150, knob: 28 };
const BANDS = [
  { from: 180, to: 157, tone: theme.color.gaugeRed },
  { from: 157, to: 124, tone: theme.color.gaugeOrange },
  { from: 124, to: 90, tone: theme.color.gaugeAmber },
  { from: 90, to: 56, tone: theme.color.gaugeYellow },
  { from: 56, to: 23, tone: theme.color.gaugeLime },
  { from: 23, to: 0, tone: theme.color.gaugeGreen },
];
/** The gauge makes the subjudul tall, so the heading opens higher (Simon 29 Oct: "di atasnya terlalu banyak white space"). */
const OPEN_Y = 380;
/** The needle's angle (from the red end, clockwise): low when it shows, high by "terlalu", past the green end after. */
const NEEDLE = { low: 18, high: 150, past: 198, shake: 2.5 };
// A (Simon 29 Oct, new layout): you on the left under the heading, head to waist, cut at the subtitles; on your right
// the thought, "Fahhh" and the three profits, stacked — the profits first, big in the middle
/**
 * You: Orang_1 (public/art/vi07/orang-1.png, cut from INV07/Orang_1.png) in front of a cyan circle. In the picture's own
 * pixels the circle is centred on x `cx` with its top at `top` and `d` across — on the shoulders, as in Simon's
 * reference, so the head stands out over it and the body ends at its rim. On the canvas the head's top sits under the
 * heading and stays there as you grow (Simon 29 Oct: "lebih besar ke bawah, anchor atas, hingga yang terlihat hanya
 * kepala hingga badan"): at `ME_S` the caption band cuts you just under the belt (picture row 446); the circle's left
 * edge is on the heading's word, as SC03's phone.
 */
const PIC = { src: "art/vi07/orang-1.png", w: 370, h: 1000, cx: 152, top: 150, d: 420 };
const ME_TOP = HEADING.y + HEADING.disc / 2 + 40;
const ME_S = (theme.captionBand.top - ME_TOP) / 446;
const ME = { d: PIC.d * ME_S, cx: HEADING.x + HEADING.disc + 24 + (PIC.d * ME_S) / 2, cy: ME_TOP + (PIC.top + PIC.d / 2) * ME_S };
/**
 * With the bubble, the meme over your face (Simon 29 Oct: "bareng sama thought bubble, timpa muka orangnya dengan meme
 * ini" — his picture, cut out of its white to public/art/vi07/meme-senyum.png, 377 × 315). In its pixels the dome's tip
 * is at (dome.x, dome.y); it lands on the top of your hair (picture x 178, row 0), `lift` higher, at `k`.
 */
const MEME = { src: "art/vi07/meme-senyum.png", w: 377, h: 315, dome: { x: 205, y: 45 }, k: 1.6, lift: 70 };
const MEME_AT = { x: ME.cx - PIC.cx * ME_S + 178 * ME_S, y: ME_TOP - MEME.lift };
/**
 * Which face meme (Simon 29 Oct: "coba aku mau liat kalo pake gambar ini sebagai meme muka nya. Jadiin switch aja"):
 * "senyum" = his first picture over the head; "awesome" = the Awesome Face, drawn, a disc `d` across on the head's
 * middle (picture x 178, row 80); "filter" = his third ("bikin filter muka kayak gini"): the wide-face, wide-grin phone
 * filter, done as a warp of the photo itself (scripts/vi/face-filter.py → orang-1-filter.png), cross-faded in.
 */
const FACE_MEME = "filter" as "senyum" | "awesome" | "filter";
const PIC_FILTER = "art/vi07/orang-1-filter.png";
const AWESOME = { d: 310, x: ME.cx - PIC.cx * ME_S + 178 * ME_S, y: ME_TOP + 80 * ME_S };
/** The stack on the right, centred on x `cx`: the bubble, "Fahhh" under it, the profits at the bottom. */
const RIGHT = { cx: 1340 };
/**
 * The bubble, iMessage's shape (Simon 29 Oct: "ubah style thought bubblenya jadi kayak gini deh. tapi warna fill nya
 * tetep yang sekarang"): a rounded pill, its tail hooked out of the bottom-left corner towards you; white.
 */
/** 30 % up on 29 Oct (Simon: "thought bubble dan isinya diperbesar 30%"): 460 × 112, type 48 before. */
const THOUGHT = { w: 598, h: 146, r: 60, tail: 29, cy: 460, size: 62 };
/** A box-shadow list as CSS drop-shadow()s, so a shadow follows the bubble's tail (commas inside rgba() kept). */
const asDropShadow = (box: string) =>
  box
    .split(/,(?![^(]*\))/)
    .map((p) => `drop-shadow(${p.trim()})`)
    .join(" ");
const FAH_Y = THOUGHT.cy + THOUGHT.h / 2 + 30;
const PROFIT = { d: 150, gap: 50, cy: 820 };
const profitCx = (i: number) => RIGHT.cx + (i - 1) * (PROFIT.d + PROFIT.gap);
/** First, on their words, big and vertically centred in the right column; then down to their place at PROFIT size (Simon 29 Oct). */
const PROFIT_BIG = { k: 1.6, gap: 50, cy: theme.canvas.height / 2 };
const profitBigCx = (i: number) => RIGHT.cx + (i - 1) * (PROFIT.d * PROFIT_BIG.k + PROFIT_BIG.gap);

// B/C — the tower: coins seen from the side, `t` thick, their tops ellipses `ry` deep
const COIN = { w: 200, t: 28, ry: 20 };
/** Taller since 29 Oct (Simon: "tambah lagi koinnya, masih terlalu pendek"). */
const TOWER = { cx: CX, left: 400, base: 860, own: 12, borrowed: 5, lean: 80 };

// C
const GUIDE = { x: 720, y: 250, w: 1040, h: 680, head: 136 };
const ROW1 = 158;
/**
 * Row 1: SC03's whole BUMI card with its border, `w` wide, centred (Simon 29 Oct: the Fair Value column alone came out
 * "gede banget"; then all three columns; then "kecilin lagi … biar bisa masuk di masking nya", with its Exclusive
 * Research & Guidance bar); the
 * Fair Value pointer slides from where BUMI's is to `far`, deep in the red.
 */
const FV = { w: 860, far: 0.95, pointerK: 1.5 };
const FV_K = FV.w / (BUMI_CARD.framed.x2 - BUMI_CARD.framed.x1);
const FV_H = (BUMI_CARD.framed.y2 - BUMI_CARD.framed.y1) * FV_K;
const ROW2 = ROW1 + FV_H + 30;
const SPLIT = 600;
const SIDE = 60;

// D
/** The warning in the middle of D. */
const WARN = { x: CX, y: 470, size: 170 };
const CHIP = { h: 100, disc: 60, gap: 110 };
const LINE_Y = 720;

/** The confidence gauge, the needle at `angle` (0 = on the red end, 180 = on the green end). */
const Gauge = ({ angle }: { angle: number }) => {
  const c = usePalette();
  const R = GAUGE.r + GAUGE.band / 2;
  const r = GAUGE.r - GAUGE.band / 2;
  const w = 2 * (R + 10);
  const h = R + GAUGE.band / 2 + 12;
  const at = (rad: number, deg: number) => `${(rad * Math.cos((deg * Math.PI) / 180)).toFixed(2)} ${(-rad * Math.sin((deg * Math.PI) / 180)).toFixed(2)}`;
  const band = (from: number, to: number) => `M ${at(R, from)} A ${R} ${R} 0 0 1 ${at(R, to)} L ${at(r, to)} A ${r} ${r} 0 0 0 ${at(r, from)} Z`;
  return (
    <svg width={w} height={h} viewBox={`${-w / 2} ${-R - 6} ${w} ${h}`} style={{ display: "block", overflow: "visible" }}>
      {/* the two ends are round, as in the reference */}
      <circle cx={-GAUGE.r} cy={0} r={GAUGE.band / 2} fill={BANDS[0].tone} />
      <circle cx={GAUGE.r} cy={0} r={GAUGE.band / 2} fill={BANDS[BANDS.length - 1].tone} />
      {BANDS.map((b) => (
        <path key={b.from} d={band(b.from, b.to)} fill={b.tone} />
      ))}
      <g transform={`rotate(${angle.toFixed(2)})`}>
        <path d={`M 0 -15 L ${-GAUGE.needle} -6 L ${-GAUGE.needle} 6 L 0 15 Z`} fill={theme.color.neutralIcon} />
        <circle cx={-GAUGE.needle} cy={0} r={6} fill={theme.color.neutralIcon} />
      </g>
      <circle cx={0} cy={0} r={GAUGE.knob} fill={c.ink} />
    </svg>
  );
};

/** One coin of the tower, its top at `y` (the ellipse's centre). Borrowed money is a dashed red outline. */
const StackCoin = ({ y, borrowed }: { y: number; borrowed?: boolean }) => {
  const r = COIN.w / 2;
  const side = `M ${-r} ${y} L ${-r} ${y + COIN.t} A ${r} ${COIN.ry} 0 0 0 ${r} ${y + COIN.t} L ${r} ${y} Z`;
  return borrowed ? (
    <g>
      <path d={side} fill={theme.color.alarmWashSolid} stroke={theme.color.alarmRed} strokeWidth={3} strokeDasharray="10 8" />
      <ellipse cx={0} cy={y} rx={r} ry={COIN.ry} fill={theme.color.alarmWashSolid} stroke={theme.color.alarmRed} strokeWidth={3} strokeDasharray="10 8" />
    </g>
  ) : (
    <g>
      <path d={side} fill={theme.color.coinSpinShade} stroke={theme.color.coinSpinRing} strokeWidth={2} />
      <ellipse cx={0} cy={y} rx={r} ry={COIN.ry} fill={theme.color.coinSpinRing} />
      <ellipse cx={0} cy={y} rx={r * 0.78} ry={COIN.ry * 0.74} fill={theme.color.coinSpinFace} />
    </g>
  );
};
/** Where coin `k` (0 = the bottom one) has its top. */
const coinTop = (k: number) => TOWER.base - COIN.t - k * COIN.t;

/** A profit: a green circle, a bold tick on white and the word. */
const Profit = () => {
  const c = usePalette();
  return (
    <div style={{ width: PROFIT.d, height: PROFIT.d, borderRadius: 999, background: theme.color.ok, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
      <div style={{ width: 56, height: 56, borderRadius: 999, background: c.cardBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: 32, fontWeight: 700, lineHeight: 1, color: theme.color.ok }}>✓</div>
      <div style={{ fontFamily: theme.text.family, fontSize: 28, fontWeight: 600, color: c.cardBg }}>Profit</div>
    </div>
  );
};

/** You, in front of your circle: the picture shows above the circle's middle, and below it only inside the circle. */
const Me = ({ cx, cy, filter = 0 }: { cx: number; cy: number; filter?: number }) => {
  const s = ME_S;
  const w = PIC.w * s;
  const h = PIC.h * s;
  const ox = PIC.cx * s;
  const oy = (PIC.top + PIC.d / 2) * s;
  const r = ME.d / 2;
  // one path, both parts clockwise so they add up: the band above the circle's middle, and the circle
  const clip = `path('M 0 0 H ${w.toFixed(1)} V ${oy.toFixed(1)} H 0 Z M ${(ox - r).toFixed(1)} ${oy.toFixed(1)} A ${r} ${r} 0 1 1 ${(ox + r).toFixed(1)} ${oy.toFixed(1)} A ${r} ${r} 0 1 1 ${(ox - r).toFixed(1)} ${oy.toFixed(1)} Z')`;
  return (
    <>
      <div style={{ position: "absolute", left: cx - r, top: cy - r, width: ME.d, height: ME.d, borderRadius: 999, background: theme.color.selfAmber }} />
      <Img src={staticFile(PIC.src)} style={{ position: "absolute", left: cx - ox, top: cy - oy, width: w, height: h, maxWidth: "none", clipPath: clip }} />
      {/* the face filter: the same picture warped, faded in over it (identical outside the face) */}
      {filter > 0.001 ? <Img src={staticFile(PIC_FILTER)} style={{ position: "absolute", left: cx - ox, top: cy - oy, width: w, height: h, maxWidth: "none", clipPath: clip, opacity: filter }} /> : null}
    </>
  );
};

/**
 * The Awesome Face, drawn from Simon's reference so it stays sharp at any size: in units of its radius — the outline, the
 * two eyes looking up and right, the open mouth under its bar, the tongue.
 */
const AwesomeFace = ({ d }: { d: number }) => {
  const c = usePalette();
  const line = 0.072;
  const eye = (x0: number, x1: number) => {
    const top = -0.53;
    const bottom = -0.07;
    const rx = (x1 - x0) / 2;
    return `M ${x0} ${bottom} V ${top + rx} A ${rx} ${rx} 0 0 1 ${x1} ${top + rx} V ${bottom} Z`;
  };
  const mouth = "M -0.69 0.13 L 0.56 0.13 C 0.56 0.5 0.35 0.77 0 0.77 C -0.38 0.77 -0.62 0.5 -0.69 0.13 Z";
  return (
    <svg width={d} height={d} viewBox="-1 -1 2 2" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <clipPath id="vi07-awesome-mouth">
          <path d={mouth} />
        </clipPath>
      </defs>
      <circle cx={0} cy={0} r={1 - line / 2} fill={theme.color.memeAwesomeYellow} stroke={c.ink} strokeWidth={line} />
      {[eye(-0.8, -0.3), eye(0.04, 0.58)].map((e, k) => (
        <path key={k} d={e} fill={c.cardBg} stroke={c.ink} strokeWidth={0.045} strokeLinejoin="round" />
      ))}
      <circle cx={-0.45} cy={-0.38} r={0.1} fill={c.ink} />
      <circle cx={0.44} cy={-0.38} r={0.1} fill={c.ink} />
      <path d={mouth} fill={theme.color.memeAwesomeMouth} />
      <ellipse cx={0.08} cy={0.74} rx={0.31} ry={0.2} fill={theme.color.memeAwesomeTongue} clipPath="url(#vi07-awesome-mouth)" />
      <path d={mouth} fill="none" stroke={c.ink} strokeWidth={0.045} strokeLinejoin="round" />
      {/* the bar over the mouth, with its little step at the left end */}
      <path d="M -0.76 0.07 H -0.69 V 0.11 H 0.58 V 0.155 H -0.76 Z" fill={c.ink} />
    </svg>
  );
};

/** A label: white card, an icon on a disc, a word or two (the SC05 context labels). */
const Chip = ({ icon, text }: { icon: string; text: string }) => {
  const c = usePalette();
  return (
    <Card x={0} y={0} w={0} h={CHIP.h} style={{ position: "relative", width: "auto", display: "flex", alignItems: "center", gap: 20, padding: "0 32px 0 22px" }}>
      <Disc icon={icon} size={CHIP.disc} tone={c.indigo} tint={theme.color.indigoWashSolid} />
      <div style={{ ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>{text}</div>
    </Card>
  );
};

export const SC07 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(7, BLOCK.SC07);
  const g = f + BLOCK.SC07;
  /** Through the cut into SC08 (same situation) the ground and the heading are the Composition's, held still. */
  const held = heldAt(g) !== null;

  // A — the heading and its meter
  const headP = ease(f, W("Masalah berikutnya"), m.reveal);
  const meterAt = W("rasa percaya");
  const tooAt = W("terlalu besar");
  const pastP = ease(f, tooAt, W("besar.", 0, "f1") - tooAt + m.sec(0.25));
  const needle =
    NEEDLE.low +
    (NEEDLE.high - NEEDLE.low) * ease(f, meterAt, tooAt - meterAt) +
    (NEEDLE.past - NEEDLE.high) * pastP +
    NEEDLE.shake * pastP * Math.sin(((f - tooAt) / m.sec(0.16)) * 2 * Math.PI);
  const winsAt = [W("Tiga"), W("kali"), W("untung,")];
  /**
   * Docked once the needle has done ("…terlalu besar." + its 60 f pause), so the order is: you, then the profits on their
   * words, then the thought and "Fahhh" (Simon 29 Oct: "Harusnya orang dulu, 3 profit, lalu thought bubble dan fahhh").
   */
  const dockAt = W("besar.", 0, "f1") + m.sec(0.3);
  const dock = ease(f, dockAt, m.move);

  // A — you; then a profit per word, big in the middle of the right column, going down to their place
  const profitP = winsAt.map((at) => ease(f, at - m.sec(0.05), m.pop));
  const settleAt = W("untung,", 0, "f1") + m.sec(0.15);
  const settle = ease(f, settleAt, m.move);
  /** You come in first, as the heading lands. */
  const meP = ease(f, dockAt + m.move - m.sec(0.1), m.reveal);
  const sayAt = W("Saya sudah");
  const posAt = W("Posisi diperbesar");
  const aOut = ease(f, posAt, m.fade);
  /** The bubble starts before "Saya sudah" (Simon 29 Oct: "18135, thought bubble dan isinya uda mulai muncul"). */
  const thinkAt = sayAt - m.sec(0.35);
  const bubbleP = useAppear(thinkAt, posAt);
  const fahP = useAppear(SFX.fah.at - BLOCK.SC07, posAt);

  // B — the tower
  const stackAt = W("diperbesar,");
  const ownP = Array.from({ length: TOWER.own }, (_, k) => ease(f, stackAt + k * m.sec(0.08), m.pop));
  const loanAt = W("dana pinjaman");
  const loanP = Array.from({ length: TOWER.borrowed }, (_, k) => ease(f, loanAt + k * m.sec(0.1), m.pop));
  const leverAt = W("leverage.");
  const offP = Array.from({ length: TOWER.borrowed }, (_, k) => ease(f, leverAt + (TOWER.borrowed - 1 - k) * m.sec(0.06), m.move));
  /**
   * Once the borrowed coins are on, the stack leans and sways like a pile about to go: each coin is pushed sideways by
   * the square of its height, so the foot stays put and the top swings.
   */
  const lean = ease(f, W("pinjaman."), m.move) * (1 - ease(f, leverAt, m.move));
  const sway = Math.sin(((f - W("pinjaman.")) / m.sec(1.4)) * 2 * Math.PI);
  const coinDx = (k: number) => lean * TOWER.lean * (1 + 0.35 * sway) * (k / (TOWER.own + TOWER.borrowed - 1)) ** 2;
  const towerX = TOWER.cx + (TOWER.left - TOWER.cx) * ease(f, W("Di saat"), m.move);

  // C — Tuntun Guidance
  const guideAt = W("Tuntun Guidance");
  const guideP = ease(f, guideAt - m.sec(0.1), m.move);
  /** It comes as a notification — just its header — and opens to its full height for the reminders. */
  const open = ease(f, W("Kalau harga") - m.sec(0.35), m.move);
  const guideH = GUIDE.head + (GUIDE.h - GUIDE.head) * open;
  const ring = W("pengingat.");
  const bell = 14 * Math.sin(((f - ring) / m.sec(0.18)) * Math.PI) * (1 - ease(f, ring, m.sec(0.9))) * (f >= ring ? 1 : 0);
  const row1 = ease(f, W("Kalau harga") - m.sec(0.1), m.reveal);
  const far = ease(f, W("jauh di atas"), m.move);
  const row2 = ease(f, W("Kalau alasan") - m.sec(0.1), m.reveal);
  const weak = ease(f, W("belum cukup"), m.move);
  const leverP = ease(f, W("jangan memperbesar") - m.sec(0.1), m.reveal);
  const cross = ease(f, leverAt, m.pop);
  const insightAt = W("Peringatan ini");
  const cOut = ease(f, insightAt, m.fade);

  // D — the warning; the line; confidence → warning → decision
  const warnP = ease(f, insightAt, m.pop);
  const jedaP = ease(f, W("jeda singkat"), m.move);
  const confAt = W("percaya diri", 1);
  const decideAt = W("keputusan besar.");

  const r = COIN.w / 2;

  return (
    <Stage transparent={held}>
      {held ? null : <SoftGround f={g} />}
      {held ? null : <BoardGrid g={g} on={1} />}
      {/* A — the heading opens in the middle; confidence past its limit is its subjudul */}
      <OpeningHeading
        n={4}
        hidden={held}
        openY={OPEN_Y}
        text={SITUATION[3].label}
        p={headP}
        dock={dock}
        subP={ease(f, meterAt - m.sec(0.15), m.reveal)}
        sub={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34, opacity: ease(f, meterAt - m.sec(0.15), m.reveal) }}>
            <Gauge angle={needle} />
            <div style={{ fontFamily: theme.text.family, fontSize: 44, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>Percaya diri</div>
          </div>
        }
      />

      {/* A — three profits and you over them */}
      {aOut < 0.999 && meP > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - aOut }}>
          {/* you, cut at the caption band */}
          <div style={{ position: "absolute", left: 0, top: 0, width: theme.canvas.width, height: theme.captionBand.top, overflow: "hidden" }}>
            {meP > 0.001 ? (
              <div style={{ position: "absolute", inset: 0, opacity: meP, transform: `translateY(${((1 - meP) * 20).toFixed(2)}px)` }}>
                <Me cx={ME.cx} cy={ME.cy} filter={FACE_MEME === "filter" ? bubbleP : 0} />
                {bubbleP > 0.001 && FACE_MEME === "awesome" ? (
                  <div style={{ position: "absolute", left: AWESOME.x - AWESOME.d / 2, top: AWESOME.y - AWESOME.d / 2, opacity: bubbleP, transform: `scale(${(0.8 + 0.2 * bubbleP).toFixed(3)})` }}>
                    <AwesomeFace d={AWESOME.d} />
                  </div>
                ) : null}
                {bubbleP > 0.001 && FACE_MEME === "senyum" ? (
                  <Img src={staticFile(MEME.src)} style={{ position: "absolute", left: MEME_AT.x - MEME.dome.x * MEME.k, top: MEME_AT.y - MEME.dome.y * MEME.k, width: MEME.w * MEME.k, height: MEME.h * MEME.k, maxWidth: "none", opacity: bubbleP, transformOrigin: `${MEME.dome.x * MEME.k}px ${MEME.dome.y * MEME.k}px`, transform: `scale(${(0.8 + 0.2 * bubbleP).toFixed(3)})` }} />
                ) : null}
              </div>
            ) : null}
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            {winsAt.map((_, i) => {
              if (profitP[i] <= 0.001) return null;
              const x = profitBigCx(i) + (profitCx(i) - profitBigCx(i)) * settle;
              const y = PROFIT_BIG.cy + (PROFIT.cy - PROFIT_BIG.cy) * settle;
              const k = (PROFIT_BIG.k + (1 - PROFIT_BIG.k) * settle) * (0.7 + 0.3 * profitP[i]);
              return (
                <div key={i} style={{ position: "absolute", left: x - PROFIT.d / 2, top: y - PROFIT.d / 2, opacity: profitP[i], transform: `scale(${k.toFixed(4)})` }}>
                  <Profit />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {/* A — what you think (Simon's words and case: "Jago banget gua"), in an iMessage-shaped bubble, tail towards you;
          then "Fahhh" under it, on its sound */}
      {bubbleP > 0.001 ? (
        <div style={{ position: "absolute", left: RIGHT.cx - THOUGHT.w / 2, top: THOUGHT.cy - THOUGHT.h / 2, width: THOUGHT.w, height: THOUGHT.h, opacity: bubbleP, transformOrigin: "0% 100%", transform: `scale(${(0.8 + 0.2 * bubbleP).toFixed(3)})`, filter: asDropShadow(shadow.soft) }}>
          <svg width={THOUGHT.w} height={THOUGHT.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {(() => {
              const { w, h, r, tail: t } = THOUGHT;
              // the pill, its bottom-left corner swapped for the tail: along the bottom, out to the tip, back up the side
              const d = `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r * 0.6} C ${r * 0.25} ${h} ${-t * 0.3} ${h + 1} ${-t} ${h} C ${-t * 0.2} ${h - 5} 0 ${h - 12} 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
              return <path d={d} fill={c.cardBg} />;
            })()}
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: THOUGHT.size, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>Jago banget gua</div>
        </div>
      ) : null}
      {fahP > 0.001 ? (
        <div style={{ position: "absolute", left: RIGHT.cx - 300, top: FAH_Y, width: 600, textAlign: "center", opacity: fahP, transform: `translateY(${((1 - fahP) * 18).toFixed(2)}px)`, fontFamily: theme.text.family, fontSize: 88, fontWeight: 500, lineHeight: 1, color: c.ink }}>Fahhh</div>
      ) : null}

      {/* B/C — the tower: own coins, then borrowed ones on top; it leans while they are on */}
      {f >= posAt && cOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - cOut }}>
          <svg width={COIN.w + 400} height={TOWER.base + COIN.ry + 40} viewBox={`${-r - 200} 0 ${COIN.w + 400} ${TOWER.base + COIN.ry + 40}`} style={{ position: "absolute", left: towerX - r - 200, top: 0, overflow: "visible" }}>
            <g>
              {ownP.map((p, k) => (p > 0.001 ? <g key={k} opacity={p} transform={`translate(${coinDx(k).toFixed(2)} ${((1 - p) * -60).toFixed(2)})`}><StackCoin y={coinTop(k)} /></g> : null))}
              {loanP.map((p, k) => {
                const off = offP[k];
                if (p <= 0.001 || off >= 0.999) return null;
                return (
                  <g key={k} opacity={p * (1 - off)} transform={`translate(${(coinDx(TOWER.own + k) - 180 * off).toFixed(2)} ${((1 - p) * -60 - 90 * off).toFixed(2)}) rotate(${(-24 * off).toFixed(2)} 0 ${coinTop(TOWER.own + k)})`}>
                    <StackCoin y={coinTop(TOWER.own + k)} borrowed />
                  </g>
                );
              })}
            </g>
          </svg>
          <div style={{ position: "absolute", left: towerX - 150, top: TOWER.base + COIN.ry + 18, width: 300, textAlign: "center", ...typeStyle("body"), color: c.ink, opacity: ease(f, stackAt, m.reveal) }}>Posisi</div>
          {/* over the top of the pile, riding its sway, clear of the Guidance card */}
          <div style={{ position: "absolute", left: towerX + coinDx(TOWER.own + TOWER.borrowed - 1) - 150, top: coinTop(TOWER.own + TOWER.borrowed - 1) - COIN.ry - 64, width: 300, textAlign: "center", ...typeStyle("body"), color: theme.color.alarmRed, whiteSpace: "nowrap", opacity: loanP[TOWER.borrowed - 1] * (1 - offP[0]) }}>Pinjaman</div>
        </div>
      ) : null}

      {/* C — Tuntun Guidance, two reminders */}
      {guideP > 0.001 && cOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: guideP * (1 - cOut) }}>
          <Card x={GUIDE.x} y={GUIDE.y - (1 - guideP) * 80} w={GUIDE.w} h={guideH} line={theme.color.hairlineBrandSolid} style={{ overflow: "hidden", boxShadow: `${shadow.soft}, 0 0 40px 8px ${theme.color.indigoGlow}` }}>
            <div style={{ position: "absolute", left: 48, top: 36, display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ transform: `rotate(${bell.toFixed(2)}deg)`, transformOrigin: "50% 15%" }}>
                <Disc icon="bell" size={72} tone={c.indigo} tint={theme.color.indigoWashSolid} />
              </div>
              <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink }}>Tuntun Guidance</div>
            </div>
            <div style={{ position: "absolute", left: 0, top: GUIDE.head, width: GUIDE.w, height: 2, background: c.border, opacity: open }} />

            {/* 1 — SC03's real BUMI card; the price slides far past the fair value, into the red */}
            <div style={{ position: "absolute", left: (GUIDE.w - FV.w) / 2, top: ROW1, width: FV.w, height: FV_H, overflow: "hidden", opacity: row1, transform: `translateY(${((1 - row1) * 14).toFixed(2)}px)` }}>
              <Img src={staticFile(BUMI_CARD.src)} style={{ position: "absolute", left: -BUMI_CARD.framed.x1 * FV_K, top: -BUMI_CARD.framed.y1 * FV_K, width: BUMI_CARD.w * FV_K, maxWidth: "none" }} />
              {/* "60% - 66% Undervalued" would say the opposite of a pointer in the red */}
              <div style={{ position: "absolute", left: (BUMI_CARD.fvNote.x1 - BUMI_CARD.framed.x1) * FV_K, top: (BUMI_CARD.fvNote.y1 - BUMI_CARD.framed.y1) * FV_K, width: (BUMI_CARD.fvNote.x2 - BUMI_CARD.fvNote.x1) * FV_K, height: (BUMI_CARD.fvNote.y2 - BUMI_CARD.fvNote.y1) * FV_K, background: c.cardBg, opacity: far }} />
              {(() => {
                const g = BUMI_CARD.gauge;
                const at = g.at + (FV.far - g.at) * far;
                const x = (g.x0 + (g.x1 - g.x0) * at - BUMI_CARD.framed.x1) * FV_K;
                const y = (g.y - BUMI_CARD.framed.y1) * FV_K;
                const w = BUMI_CARD.pointer.w * FV_K * FV.pointerK;
                const h = BUMI_CARD.pointer.h * FV_K * FV.pointerK;
                return (
                  <svg width={FV.w} height={FV_H} style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d={`M ${x} ${y} L ${x + w / 2} ${y + h} L ${x - w / 2} ${y + h} Z`} fill={c.ink} stroke={c.ink} strokeWidth={2} strokeLinejoin="round" />
                  </svg>
                );
              })()}
            </div>
            <div style={{ position: "absolute", left: 48, top: ROW2 - 10, width: GUIDE.w - 2 * 48, height: 2, background: c.border, opacity: row2 }} />

            {/* 2 — a thin reason: not with leverage */}
            <div style={{ position: "absolute", left: 0, top: ROW2, width: GUIDE.w, height: 200, opacity: row2, transform: `translateY(${((1 - row2) * 14).toFixed(2)}px)` }}>
              <div style={{ position: "absolute", left: SIDE, top: 64, display: "flex", alignItems: "center", gap: 24 }}>
                <Disc icon="report" size={72} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
                <div>
                  <div style={{ ...typeStyle("body"), color: c.ink }}>Alasan</div>
                  <div style={{ position: "relative", marginTop: 12, width: 300, height: 14, borderRadius: 7, background: theme.color.neutralDot }}>
                    <div style={{ position: "absolute", left: 0, top: 0, width: 300 * (0.62 - 0.36 * weak), height: 14, borderRadius: 7, background: theme.color.neutralIcon }} />
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", left: SPLIT, top: 30, width: 2, height: 150, background: c.border }} />
              <div style={{ position: "absolute", left: SPLIT + 40, top: 56, display: "flex", alignItems: "center", gap: 22, opacity: leverP }}>
                <div style={{ position: "relative" }}>
                  <Disc icon="loan" size={88} tone={theme.color.alarmRed} tint={theme.color.alarmWashSolid} />
                  <Mark kind="cross" p={cross} x={78} y={12} size={46} />
                </div>
                <div style={{ ...typeStyle("body"), color: c.ink }}>Leverage</div>
              </div>
            </div>
          </Card>
        </div>
      ) : null}

      {/* D — the warning: yellow, a black "!" (Simon 29 Oct, at "Peringatan ini") */}
      {warnP > 0.001 ? (
        <div style={{ position: "absolute", left: WARN.x - WARN.size / 2, top: WARN.y - WARN.size / 2, width: WARN.size, height: WARN.size, borderRadius: 999, background: theme.color.cautionYellow, boxShadow: shadow.soft, display: "flex", alignItems: "center", justifyContent: "center", opacity: warnP, transform: `scale(${(0.7 + 0.3 * warnP).toFixed(3)})`, fontFamily: theme.text.family, fontSize: WARN.size * 0.62, fontWeight: 700, lineHeight: 1, color: c.ink }}>!</div>
      ) : null}

      {/* D — confidence → warning → a big decision, each on its word */}
      <Appear at={confAt - m.sec(0.1)} style={{ right: theme.canvas.width - (WARN.x - WARN.size / 2 - CHIP.gap), top: WARN.y - CHIP.h / 2 }}>
        <Chip icon="confident" text="Percaya diri" />
      </Appear>
      <Connector a={{ x: WARN.x - WARN.size / 2 - CHIP.gap, y: WARN.y }} b={{ x: WARN.x - WARN.size / 2 - 8, y: WARN.y }} p={ease(f, confAt + m.sec(0.15), m.sec(0.4))} />
      <Connector a={{ x: WARN.x + WARN.size / 2 + 8, y: WARN.y }} b={{ x: WARN.x + WARN.size / 2 + CHIP.gap, y: WARN.y }} p={ease(f, decideAt - m.sec(0.35), m.sec(0.4))} />
      <Appear at={decideAt - m.sec(0.1)} style={{ left: WARN.x + WARN.size / 2 + CHIP.gap, top: WARN.y - CHIP.h / 2 }}>
        <Chip icon="decide" text="Keputusan besar" />
      </Appear>
      <Appear at={W("bukan larangan")} style={{ left: 0, top: 0 }}>
        <div style={{ position: "absolute", left: 0, top: LINE_Y, width: theme.canvas.width, transform: "translateY(-50%)", display: "flex", justifyContent: "center", fontFamily: theme.text.family, fontSize: 64, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.22, color: c.ink, whiteSpace: "nowrap" }}>
          <span>Bukan larangan,</span>
          {/* "tapi jeda." opens its own room, so the first half slides left for it (as SC06's "Tunggu dulu.") */}
          <div style={{ display: "grid", gridTemplateColumns: `minmax(0, ${jedaP.toFixed(4)}fr)` }}>
            <span style={{ paddingLeft: "0.28em", opacity: jedaP, transform: `translateY(${((1 - jedaP) * 14).toFixed(2)}px)` }}>
              tapi <span style={{ color: c.indigo }}>jeda.</span>
            </span>
          </div>
        </div>
      </Appear>
    </Stage>
  );
};
