/**
 * VI07 · SC03 — "Harga Berubah, Belum Tentu Perusahaannya Berubah". Situation 1, Panik.
 *
 *  A  a jagged price line, like a real daily chart, rises ("terasa semakin bagus") and falls ("semakin buruk"), the
 *     feeling — a thumb — riding its tip.
 *  B  "Padahal": the Harga card slims to a strip on top and keeps ticking (new points come in from the right); the
 *     Perusahaan card slides up under it, with one line — "Bisnisnya tetap jalan." — and stays perfectly still. Simon 28 Oct: "jangan
 *     dibuat berubah2 liquid", "serabutan aja", and the old Harga ≠ Perusahaan pair "ganti visual" — storyboard
 *     docs/vi-style/storyboards/VI07-SC03-harga-perusahaan.jpg.
 *  C  "Karena itu, di halaman saham Tuntun …" to "… bukan bisnisnya": the REAL Tuntun stock page (Simon 28 Oct:
 *     "bisa divisualisasikan dengan screenshot aplikasi Tuntun real nya"). BUMI_1 is the shot; its Company Quality /
 *     Fair Value / Bullish Signals card is cut by the Buy bar, so the card comes whole from BUMI_2, stitched in
 *     (public/art/vi07/app/BUMI-halaman-saham.png). The phone comes in on "Karena itu"; on "dua hal" the card is
 *     marked and its sharp copy (BUMI_3 → BUMI-kartu.png) flies out of the phone to the right, Bullish Signals
 *     greyed — the two things are the other two. Then on the big card (Simon 28 Oct): "Pertama, Company Quality" →
 *     a box on that column with "Company Quality" over it; "Kedua, Fair Value" → the same on Fair Value; the gauge's
 *     black pointer, redrawn (the original painted out of BUMI-kartu.png), slides into the red on "Saat harga naik
 *     jauh" and back on "Saat harga turun"; "Kalau keduanya" → both boxes. Under the card, one summary line for each
 *     of those three sentences.
 *  D  Orang Tuntun: "Periksa dulu, baru bereaksi."
 *
 * No figures anywhere: the line is a shape (nothing here is a real stock).
 */
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { HighlightBox, SoftGround, Stage, seeded, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { PHONE_BEZEL, PhoneScreens } from "../../vi04-investasi-yang-cocok/components/PhoneScreens";
import { BUMI_CARD } from "../data/bumi-card";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, HEADING, Line, ORANG_TUNTUN_RIGHT, OpeningHeading, OrangTuntun, SITUATION, ease, useWords } from "../components/kit";
import { SpinCoin } from "../components/SpinCoin";

type Box = { x: number; y: number; w: number; h: number };
const mix = (a: Box, b: Box, t: number): Box => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t });

// A/B — the price line: a wide card, then a strip on top with Perusahaan under it
const CARD_BIG: Box = { x: 260, y: 290, w: 1400, h: 540 };
const CARD_STRIP: Box = { x: 260, y: 270, w: 1400, h: 260 };
const PLOT_BIG: Box = { x: 320, y: 430, w: 1280, h: 350 };
const PLOT_STRIP: Box = { x: 320, y: 355, w: 1280, h: 150 };
const FIRM: Box = { x: 260, y: 560, w: 1400, h: 360 };

/**
 * The price, jagged like a real daily chart: points 0..N−1 fill the card (0..1 across, 0..1 down), the EXTRA after
 * them come in from the right once it is a strip. A trend (up to a high, down to a low, a little back) plus two
 * mean-reverting random walks — a fast one for the day-to-day zigzag, a slow one for the swings — and the odd jump;
 * seeded, so every render is the same. A shape, not data: no numbers anywhere.
 */
const N = 160;
const EXTRA = 56;
const HIGH_X = 0.48;
const LOW_X = 0.86;
const TAPE: number[] = (() => {
  const rnd = seeded(703);
  const trend = (x: number) =>
    x < HIGH_X ? 0.72 - (0.72 - 0.16) * (x / HIGH_X) : x < LOW_X ? 0.16 + (0.76 - 0.16) * ((x - HIGH_X) / (LOW_X - HIGH_X)) : x <= 1 ? 0.76 - 0.1 * ((x - LOW_X) / (1 - LOW_X)) : 0.64 + 0.06 * Math.sin((x - 1) * 9);
  let fast = 0;
  let slow = 0;
  return Array.from({ length: N + EXTRA }, (_, i) => {
    fast = 0.6 * fast + (rnd() - 0.5) * 0.12 + (rnd() < 0.08 ? (rnd() - 0.5) * 0.14 : 0);
    slow = 0.93 * slow + (rnd() - 0.5) * 0.04;
    return trend(i / (N - 1)) + fast + slow;
  });
})();
/** The tape from window x 0 to `t` (0..1), slid `o` (0..1 of EXTRA) to the left, with exact ends. */
const tapeSlice = (t: number, o: number) => {
  const shift = (o * EXTRA) / (N - 1);
  const at = (x: number) => {
    const u = (x + shift) * (N - 1);
    const i = Math.min(Math.floor(u), N + EXTRA - 2);
    return TAPE[i] + (TAPE[i + 1] - TAPE[i]) * (u - i);
  };
  const pts: [number, number][] = [[0, at(0)]];
  for (let i = 0; i < N + EXTRA; i++) {
    const x = i / (N - 1) - shift;
    if (x > 0 && x < t) pts.push([x, TAPE[i]]);
  }
  pts.push([t, at(t)]);
  return pts;
};


/**
 * The company: a hand-drawn ink sketch in VI04's bridge/ferry/plane style (Simon 28 Oct: "balik lagi ke chatgpt buat
 * generate image business icon, stylenya sama seperti di VI04"), ChatGPT from sk-bridge.png. The one detailed drawing in
 * the episode, for this moment only. Outer white cut away; the whites inside the drawing stay opaque.
 */
const SK_BUSINESS = 1200 / 694;

/**
 * By the sketch, one yellow coin spinning on its upright axis — the business still earning (Simon 28 Oct: "aku ambil
 * koinnya aja … animasinya gini aja", his Pinterest pin 215046950940139624; "koinnya pun warna kuning"). A flat disc
 * squeezed by |cos θ|, its edge drawn as a stack of discs between the two faces, so edge-on it is a bar like the pin's.
 * Half a turn every 0.66 s, as in the pin; the spin never starts or stops on screen, so it runs at an even speed.
 * Three of them round the sketch, half the first size (Simon: "50% lebih kecil, lalu duplikat 2x dan sebar … jangan
 * jauh2"), each a little out of step so they don't flip together.
 */
const COINS = [
  { x: 1191, y: 80, phase: 0 }, // above the short tower
  { x: 960, y: 192, phase: 0.35 }, // under the cloud
  { x: 1320, y: 214, phase: 0.7 },
];

// C — the real stock page in a phone, and its card enlarged beside it
/** The stitched shot: BUMI_1 rows 110–1790 (status bar cut, Simon 22 Oct), BUMI_2 rows 1401–1800, BUMI_1 from 2002. */
const SHOT = { w: 1080, h: 2417 };
/** Where the card sits in the shot, and in BUMI-kartu.png (2160 × 752): measured on the PNGs. */
const SHOT_CARD = { x: 46, y: 1731, w: 987, h: 304 };
/** BUMI-kartu.png, measured (data/bumi-card.ts — SC07 shows its Fair Value too). */
const ART = BUMI_CARD;
/**
 * The phone fills the height between the "Panik" heading and the caption band, left edge on the word "Panik" (Simon
 * 28 Oct: "tinggi hp nya dibuat fit di antara batas margin bawah dengan judul Panik … align-left terhadap Panik").
 */
const PHONE_TOP = HEADING.y + HEADING.disc / 2 + 40;
const PHONE_H = theme.captionBand.top - PHONE_TOP;
const SCREEN_W = Math.round((PHONE_H - 2 * PHONE_BEZEL) * (SHOT.w / SHOT.h));
const SCREEN_K = SCREEN_W / SHOT.w;
const PHONE_W = SCREEN_W + 2 * PHONE_BEZEL;
const PHONE = { cx: HEADING.x + HEADING.disc + 24 + PHONE_W / 2, y: PHONE_TOP, h: PHONE_H };
/** The card where the phone shows it, in canvas pixels. */
const CARD_IN_PHONE: Box = { x: PHONE.cx - PHONE_W / 2 + PHONE_BEZEL + SHOT_CARD.x * SCREEN_K, y: PHONE.y + PHONE_BEZEL + SHOT_CARD.y * SCREEN_K, w: SHOT_CARD.w * SCREEN_K, h: SHOT_CARD.h * SCREEN_K };
/**
 * Its enlarged copy in the free space on the right, sized to it; the labels over it, the card and the two-line
 * summary under it sit as one block, centred on the phone.
 */
const ZOOM_TYPE = { label: 40, labelGap: 70, summary: 48, summaryGap: 36, leading: 1.3 };
const ZOOM_W = 1160;
const ZOOM_H = (ZOOM_W * SHOT_CARD.h) / SHOT_CARD.w;
const ZOOM_BLOCK = ZOOM_TYPE.labelGap + ZOOM_H + ZOOM_TYPE.summaryGap + 2 * ZOOM_TYPE.summary * ZOOM_TYPE.leading;
const CARD_ZOOM: Box = { x: theme.canvas.width - theme.margin.right - 24 - ZOOM_W, w: ZOOM_W, h: ZOOM_H, y: PHONE.y + PHONE.h / 2 - ZOOM_BLOCK / 2 + ZOOM_TYPE.labelGap };
const ZK = CARD_ZOOM.w / ART.card.w;
/** A rectangle of BUMI-kartu.png's pixels, on the canvas where the big card shows it, padded. */
const onZoom = (r: { x1: number; y1: number; x2: number; y2: number }, pad = 16) => ({ x1: CARD_ZOOM.x + (r.x1 - ART.card.x) * ZK - pad, y1: CARD_ZOOM.y + (r.y1 - ART.card.y) * ZK - pad, x2: CARD_ZOOM.x + (r.x2 - ART.card.x) * ZK + pad, y2: CARD_ZOOM.y + (r.y2 - ART.card.y) * ZK + pad });
/** The redrawn pointer is half again the original's size, so its slide reads on the big card. */
const POINTER_K = 1.5;
/** Simon's rule for a box over a phone: 20 px wider than the phone on each side. */
const CARD_HL = { x1: PHONE.cx - PHONE_W / 2 - 20, x2: PHONE.cx + PHONE_W / 2 + 20, y1: CARD_IN_PHONE.y - 10, y2: CARD_IN_PHONE.y + CARD_IN_PHONE.h + 10 };

/** BUMI_3's card at box `b` (its white margin cropped), with the Bullish Signals column greyed by `mute`. */
const BigCard = ({ b, mute, lift }: { b: Box; mute: number; lift: number }) => {
  const shadow = useShadow();
  const k = b.w / ART.card.w;
  const src = staticFile("art/vi07/app/BUMI-kartu.png");
  const sg = ART.signals;
  return (
    <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: ART.radius * k, overflow: "hidden", boxShadow: lift > 0.001 ? shadow.soft : undefined }}>
      <Img src={src} style={{ position: "absolute", left: -ART.card.x * k, top: -ART.card.y * k, width: ART.w * k, maxWidth: "none" }} />
      {mute > 0.001 ? (
        <div style={{ position: "absolute", left: (sg.x0 - ART.card.x) * k, top: (sg.y0 - ART.card.y) * k, width: (sg.x1 - sg.x0) * k, height: (sg.y1 - sg.y0) * k, overflow: "hidden", opacity: mute }}>
          <Img src={src} style={{ position: "absolute", left: -sg.x0 * k, top: -sg.y0 * k, width: ART.w * k, maxWidth: "none", filter: "grayscale(1)" }} />
        </div>
      ) : null}
    </div>
  );
};

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(3, BLOCK.SC03);
  const g = f + BLOCK.SC03;

  // the heading docks just before "Ketika harga naik", so the line has the stage
  const dockAt = W("Ketika harga naik") - m.sec(0.4);
  const dock = ease(f, dockAt, m.move);

  // A — rise and fall
  const upP = ease(f, W("Ketika harga naik"), W("bagus.", 0, "f1") - W("Ketika harga naik"));
  const downP = ease(f, W("Ketika harga turun"), W("buruk.", 0, "f1") - W("Ketika harga turun"));
  const draw = interpolate(upP + downP, [0, 1, 2], [0.02, HIGH_X, LOW_X]);
  const restAt = W("Padahal:");
  const rest = ease(f, restAt, m.move);
  const drawAll = draw + (1 - draw) * ease(f, restAt, m.sec(0.8));
  const card = mix(CARD_BIG, CARD_STRIP, rest);
  const plot = mix(PLOT_BIG, PLOT_STRIP, rest);
  const lineOut = ease(f, W("Karena itu,"), m.fade);
  /** After "Padahal" the price keeps ticking — new points from the right; the company does not move. */
  const tickAt = restAt + m.move;
  const tick = ease(f, tickAt, W("Karena itu,") + m.fade - tickAt);
  const pts = tapeSlice(Math.min(1, drawAll), tick).map(([x, y]) => [plot.x + x * plot.w, plot.y + y * plot.h] as const);
  const tip = { x: pts[pts.length - 1][0], y: pts[pts.length - 1][1] };
  const goodP = ease(f, W("semakin bagus"), m.pop) * (1 - ease(f, W("Ketika harga turun"), m.fade));
  const badP = ease(f, W("semakin buruk"), m.pop) * (1 - rest);
  const firmP = ease(f, restAt + m.sec(0.35), m.reveal);
  const firmOn = ease(f, W("perusahaannya ikut"), m.reveal);
  const coinAt = restAt + m.sec(0.8);

  // C — the stock page
  const phoneP = ease(f, W("Karena itu,") + m.sec(0.25), m.reveal);
  const hlP = ease(f, W("dua hal"), m.reveal);
  const flyAt = W("dua hal") + m.sec(0.35);
  const fly = ease(f, flyAt, m.move);
  const muteP = ease(f, flyAt + m.move, m.reveal);
  const pageOut = ease(f, W("Bukan berarti"), m.fade);
  const bothAt = W("Kalau keduanya");
  const cqOn = ease(f, W("Pertama, Company"), m.reveal) * (1 - ease(f, W("Kedua, Fair"), m.fade)) + ease(f, bothAt, m.reveal);
  const fvOn = ease(f, W("Kedua, Fair"), m.reveal);
  /** The pointer: into the red on "Saat harga naik jauh", back on "Saat harga turun". */
  const toRed = ease(f, W("Saat harga naik"), m.sec(1)) - ease(f, W("Saat harga turun"), m.sec(1));
  const pointerAt = ART.gauge.at + (ART.gauge.red - ART.gauge.at) * toRed;
  /** One summary line under the card at a time (Simon 28 Oct): on "Saat harga naik", "Saat harga turun", "Kalau keduanya". */
  const upAt = W("Saat harga naik");
  const downAt = W("Saat harga turun");
  const summaries = [
    { p: ease(f, upAt + m.sec(0.3), m.reveal) * (1 - ease(f, downAt, m.fade)), lead: "Terlalu mahal? ", mark: "Jangan langsung dikejar." },
    { p: ease(f, downAt + m.sec(0.3), m.reveal) * (1 - ease(f, bothAt, m.fade)), lead: "Harga turun? ", mark: "Cek kualitas & fair value." },
    // two lines, Simon's wording verbatim: "Kalau keduanya sama," / "cuma harga yang bergerak, bisnis masih sama."
    { p: ease(f, bothAt + m.sec(0.3), m.reveal), lead: "Kalau keduanya sama,", mark: "cuma harga yang bergerak, bisnis masih sama.", twoLines: true },
  ];

  const insightAt = W("Bukan berarti");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1 - ease(f, insightAt, m.fade)} />

      {/* the heading opens big in the middle with its subjudul, then docks top left as the price line comes in */}
      <OpeningHeading n={1} text={SITUATION[0].label} sub="Keputusan hanya dari pergerakan harga" p={ease(f, W("situasi pertama"), m.reveal) * (1 - ease(f, insightAt, m.fade))} dock={dock} subP={ease(f, W("saat keputusan"), m.reveal)} />

      {/* A/B — the price line, then the strip with Perusahaan under it */}
      {lineOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: (1 - lineOut) * ease(f, dockAt + m.sec(0.25), m.reveal) }}>
          <Card x={card.x} y={card.y} w={card.w} h={card.h}>
            <div style={{ position: "absolute", left: 40, top: 28, display: "flex", alignItems: "center", gap: 18 }}>
              <Disc icon="chart-line" size={52} tone={c.indigo} tint={theme.color.indigoWashSolid} />
              <div style={{ ...typeStyle("body"), color: c.ink }}>Harga</div>
            </div>
          </Card>
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            <polyline points={pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} fill="none" stroke={c.indigo} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={tip.x} cy={tip.y} r={10} fill={c.cardBg} stroke={c.indigo} strokeWidth={4} />
          </svg>
          {/* the feeling rides the tip */}
          {[
            { p: goodP, icon: "thumbs-up", text: "Bagus" },
            { p: badP, icon: "thumbs-down", text: "Buruk" },
          ].map((k) =>
            k.p > 0.001 ? (
              <div key={k.text} style={{ position: "absolute", left: Math.min(tip.x - 110, card.x + card.w - 250), top: tip.y + (k.icon === "thumbs-up" ? -140 : 40), width: 220, height: 84, borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, opacity: k.p, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, transform: `translateY(${((1 - k.p) * 12).toFixed(2)}px)` }}>
                <Disc icon={k.icon} size={52} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
                <div style={{ ...typeStyle("body"), color: c.ink }}>{k.text}</div>
              </div>
            ) : null,
          )}
          {/* the company: still, its checks still ticked */}
          {firmP > 0.001 ? (
            <Card x={FIRM.x} y={FIRM.y + (1 - firmP) * 40} w={FIRM.w} h={FIRM.h} style={{ opacity: firmP, boxShadow: `${shadow.soft}, inset 0 0 0 ${(2 * firmOn).toFixed(2)}px ${theme.color.connector}, 0 0 ${(40 * firmOn).toFixed(1)}px ${(8 * firmOn).toFixed(1)}px ${theme.color.indigoGlow}` }}>
              <div style={{ position: "absolute", left: 40, top: 28, display: "flex", alignItems: "center", gap: 18 }}>
                <Disc icon="company" size={52} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                <div style={{ ...typeStyle("body"), color: c.ink }}>Perusahaan</div>
              </div>
              <Img src={staticFile("art/vi07/sk-business.png")} style={{ position: "absolute", right: 60, top: 30, height: 300, width: 300 * SK_BUSINESS }} />
              {COINS.map((k, i) => (
                <SpinCoin key={i} id={`vi07-sc03-coin-${i}`} x={k.x} y={k.y} phase={k.phase} t={Math.max(0, f - coinAt) / m.sec(1)} p={ease(f, coinAt + m.sec(0.12 * i), m.pop)} />
              ))}
              {/* one line instead of check rows (Simon 28 Oct: "remove aja, lalu ganti tulisan … pendek, ringkas, memorable") */}
              <div style={{ position: "absolute", left: 40 + 52 + 18, top: 170, opacity: ease(f, restAt + m.sec(0.5), m.reveal), transform: `translateY(${((1 - ease(f, restAt + m.sec(0.5), m.reveal)) * 12).toFixed(2)}px)`, ...typeStyle("title"), fontSize: 64, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>
                Bisnisnya <span style={{ color: c.indigo }}>tetap jalan.</span>
              </div>
            </Card>
          ) : null}
        </div>
      ) : null}

      {/* C — the real stock page, then its card */}
      {phoneP > 0.001 && pageOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: phoneP * (1 - pageOut) }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${((1 - phoneP) * 20).toFixed(2)}px)` }}>
            <PhoneScreens cx={PHONE.cx} y={PHONE.y} h={PHONE.h} ratio={SHOT.w / SHOT.h} screens={[{ src: "art/vi07/app/BUMI-halaman-saham.png", at: 0 }]} />
          </div>
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            <HighlightBox rect={CARD_HL} grow={hlP} fill="none" width={4} radius={18} />
          </svg>
          {fly > 0.001 ? <BigCard b={mix(CARD_IN_PHONE, CARD_ZOOM, fly)} mute={muteP} lift={fly} /> : null}
          {fly > 0.001 ? (
            <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
              {/* the gauge's pointer, redrawn so it can move; it rides the card while it flies out */}
              {(() => {
                const b = mix(CARD_IN_PHONE, CARD_ZOOM, fly);
                const k = b.w / ART.card.w;
                const x = b.x + (ART.gauge.x0 + (ART.gauge.x1 - ART.gauge.x0) * pointerAt - ART.card.x) * k;
                const y = b.y + (ART.gauge.y - ART.card.y) * k;
                const w = ART.pointer.w * k * POINTER_K;
                const h = ART.pointer.h * k * POINTER_K;
                return <path d={`M ${x} ${y} L ${x + w / 2} ${y + h} L ${x - w / 2} ${y + h} Z`} fill={c.ink} stroke={c.ink} strokeWidth={Math.max(1, 3 * k)} strokeLinejoin="round" />;
              })()}
              <HighlightBox rect={onZoom(ART.cq)} grow={Math.min(1, cqOn)} opacity={Math.min(1, cqOn)} fill="none" width={4} radius={18} />
              <HighlightBox rect={onZoom(ART.fv)} grow={fvOn} opacity={fvOn} fill="none" width={4} radius={18} />
            </svg>
          ) : null}
          {[
            { p: Math.min(1, cqOn), r: onZoom(ART.cq), text: "Company Quality" },
            { p: fvOn, r: onZoom(ART.fv), text: "Fair Value" },
          ].map((l) =>
            l.p > 0.001 ? (
              <div key={l.text} style={{ position: "absolute", left: l.r.x1, width: l.r.x2 - l.r.x1, top: CARD_ZOOM.y - ZOOM_TYPE.labelGap + (1 - l.p) * 10, textAlign: "center", opacity: l.p, ...typeStyle("body"), fontSize: ZOOM_TYPE.label, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>
                {l.text}
              </div>
            ) : null,
          )}
          {/* the summary under the card (Simon: "kasih text ringkasan deh di bawahnya") */}
          {summaries.map((l) =>
            l.p > 0.001 ? (
              <div key={l.mark} style={{ position: "absolute", left: CARD_ZOOM.x, width: CARD_ZOOM.w, top: CARD_ZOOM.y + CARD_ZOOM.h + ZOOM_TYPE.summaryGap + (1 - l.p) * 12, textAlign: "center", opacity: l.p, ...typeStyle("title"), fontSize: ZOOM_TYPE.summary, fontWeight: 500, lineHeight: ZOOM_TYPE.leading, color: c.ink, whiteSpace: "nowrap" }}>
                {l.lead}
                {"twoLines" in l ? <br /> : null}
                <span style={{ color: c.indigo }}>{l.mark}</span>
              </div>
            ) : null,
          )}
        </div>
      ) : null}

      {/* D — the insight */}
      <OrangTuntun at={insightAt} />
      <Appear at={W("Tapi setidaknya")} style={{ left: 0, top: 0 }}>
        <Line x={ORANG_TUNTUN_RIGHT + 90} y={500} w={theme.canvas.width - ORANG_TUNTUN_RIGHT - 300} size={72} weight={500} text="Periksa dulu, baru bereaksi." mark="Periksa dulu" />
      </Appear>
    </Stage>
  );
};
