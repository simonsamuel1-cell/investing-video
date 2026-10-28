/**
 * VI07 · SC03 — "Harga Berubah, Belum Tentu Perusahaannya Berubah". Situation 1, Panik.
 *
 *  A  a jagged price line, like a real daily chart, rises ("terasa semakin bagus") and falls ("semakin buruk"), the
 *     feeling — a thumb — riding its tip.
 *  B  "Padahal": the Harga card slims to a strip on top and keeps ticking (new points come in from the right); the
 *     Perusahaan card slides up under it, with one line — "Bisnisnya tetap jalan." — and stays perfectly still. Simon 28 Oct: "jangan
 *     dibuat berubah2 liquid", "serabutan aja", and the old Harga ≠ Perusahaan pair "ganti visual" — storyboard
 *     docs/vi-style/storyboards/VI07-SC03-harga-perusahaan.jpg.
 *  C  the stock page in Tuntun and its two things: Company Quality, then Fair Value — a scale with the fair value
 *     marked and the price as a dot. The dot runs far above (a hand: don't chase), drops below; both cards are
 *     checked, both still ✓ — only the price moved.
 *  D  Orang Tuntun: "Periksa dulu, baru bereaksi."
 *
 * No figures anywhere: the line is a shape, the scale has no numbers (nothing here is a real stock).
 */
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SoftGround, Stage, seeded, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Line, Mark, ORANG_TUNTUN_RIGHT, OpeningHeading, OrangTuntun, SITUATION, Skel, ease, useWords } from "../components/kit";

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

// C — the stock page
const PAGE: Box = { x: 220, y: 230, w: 1480, h: 640 };
const CQ: Box = { x: PAGE.x + 50, y: PAGE.y + 140, w: 660, h: 450 };
const FV: Box = { x: PAGE.x + PAGE.w - 50 - 660, y: PAGE.y + 140, w: 660, h: 450 };
const SCALE = { x: 60, w: 540, y: 290 };

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
const COIN = { d: 46, thick: 0.17, halfTurn: 0.66 };
const COINS = [
  { x: 1191, y: 80, phase: 0 }, // above the short tower
  { x: 960, y: 192, phase: 0.35 }, // under the cloud
  { x: 1320, y: 214, phase: 0.7 },
];
const SpinCoin = ({ t, p, x, y, phase, id }: { t: number; p: number; x: number; y: number; phase: number; id: string }) => {
  const c = usePalette();
  const r = COIN.d / 2;
  const th = (t / COIN.halfTurn + phase) * Math.PI;
  const sq = Math.abs(Math.cos(th));
  const e = ((COIN.thick * COIN.d) / 2) * Math.sin(th) * Math.sign(Math.cos(th) || 1);
  const star = (x: number, y: number, k: number) => `M ${x} ${y - k} Q ${x} ${y} ${x + k} ${y} Q ${x} ${y} ${x} ${y + k} Q ${x} ${y} ${x - k} ${y} Q ${x} ${y} ${x} ${y - k} Z`;
  const w = COIN.d + COIN.thick * COIN.d;
  return (
    <svg width={w} height={COIN.d} viewBox={`${-w / 2} ${-r} ${w} ${COIN.d}`} style={{ position: "absolute", left: x - w / 2, top: y - r, opacity: p, transform: `scale(${(0.75 + 0.25 * p).toFixed(3)})` }}>
      <clipPath id={id}>
        <circle cx={0} cy={0} r={r * 0.74} />
      </clipPath>
      {Array.from({ length: 9 }, (_, k) => (
        <ellipse key={k} cx={-e + (2 * e * k) / 8} cy={0} rx={r * sq} ry={r} fill={theme.color.coinSpinEdge} />
      ))}
      <g transform={`translate(${e.toFixed(2)} 0) scale(${Math.max(sq, 0.001).toFixed(4)} 1)`}>
        <circle cx={0} cy={0} r={r} fill={theme.color.coinSpinRing} />
        <circle cx={0} cy={0} r={r * 0.74} fill={theme.color.coinSpinFace} />
        <g clipPath={`url(#${id})`}>
          <path d={`M ${-r * 0.2} ${-r} L ${r * 0.25} ${-r} L ${-r * 0.55} ${r} L ${-r} ${r} Z M ${r * 0.42} ${-r} L ${r * 0.58} ${-r} L ${-r * 0.22} ${r} L ${-r * 0.38} ${r} Z`} fill={theme.color.coinSpinShine} />
        </g>
        <text x={0} y={r * 0.17} textAnchor="middle" fontFamily={theme.text.family} fontWeight={800} fontSize={r * 0.62} fill={c.cardBg}>Rp</text>
        <path d={`${star(-r * 0.6, -r * 0.62, r * 0.13)} ${star(r * 0.66, r * 0.56, r * 0.1)}`} fill={c.cardBg} />
      </g>
    </svg>
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

  // C — the page and its two things
  const pageAt = W("Karena itu,");
  const pageP = ease(f, pageAt + m.sec(0.2), m.reveal);
  const slotsAt = W("dua hal");
  const cqAt = W("Company Quality");
  const fvAt = W("Fair Value");
  /** The price dot on the scale (0 = left, 1 = right): near the fair value, far above, then far below. */
  const dotX = interpolate(ease(f, W("naik jauh"), m.move), [0, 1], [0.44, 0.9]) - 0.72 * ease(f, W("Saat harga turun"), m.move);
  const dotP = ease(f, W("harga sekarang"), m.pop);
  const chase = ease(f, W("nggak langsung"), m.pop) * (1 - ease(f, W("Saat harga turun"), m.fade));
  const checkCq = ease(f, W("kualitas perusahaan"), m.reveal) * (1 - ease(f, W("Kalau keduanya"), m.fade));
  const checkFv = ease(f, W("fair value-nya"), m.reveal) * (1 - ease(f, W("Kalau keduanya"), m.fade));
  const same = ease(f, W("masih sama"), m.pop);
  const onlyPrice = ease(f, W("baru harganya"), m.reveal);
  const pageOut = ease(f, W("Bukan berarti"), m.fade);

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

      {/* C — the stock page: Company Quality, Fair Value */}
      {pageP > 0.001 && pageOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: pageP * (1 - pageOut) }}>
          <Card x={PAGE.x} y={PAGE.y + (1 - pageP) * 20} w={PAGE.w} h={PAGE.h} line={theme.color.hairlineBrandSolid}>
            <div style={{ position: "absolute", left: 50, top: 44, width: 64, height: 64, borderRadius: 999, background: theme.color.neutralDisc }} />
            <Skel w={160} h={20} style={{ left: 134, top: 50 }} />
            <Skel w={110} h={14} style={{ left: 134, top: 84 }} />
          </Card>
          {[CQ, FV].map((b, i) => {
            const slot = ease(f, slotsAt + i * m.sec(0.1), m.pop);
            const fill = ease(f, (i === 0 ? cqAt : fvAt) - m.sec(0.1), m.reveal);
            const look = i === 0 ? checkCq : checkFv;
            return slot > 0.001 ? (
              <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, opacity: slot }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: theme.shape.cardRadius, border: `2px dashed ${theme.color.connectorMuteSolid}`, opacity: 1 - fill }} />
                <Card x={0} y={(1 - fill) * 14} w={b.w} h={b.h} style={{ opacity: fill, background: c.bg, boxShadow: `inset 0 0 0 ${(2 * Math.max(look, same)).toFixed(2)}px ${theme.color.connector}, 0 0 ${(40 * look).toFixed(1)}px ${(8 * look).toFixed(1)}px ${theme.color.indigoGlow}` }}>
                  <div style={{ position: "absolute", left: 40, top: 36, display: "flex", alignItems: "center", gap: 20 }}>
                    <Disc icon={i === 0 ? "company" : "scale"} size={64} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                    <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink }}>{i === 0 ? "Company Quality" : "Fair Value"}</div>
                  </div>
                  {i === 0
                    ? [0, 1, 2].map((r) => {
                        const p = ease(f, (r === 0 ? W("kualitas bisnis") : r === 1 ? W("fundamental") : W("fundamental") + m.sec(0.2)) - m.sec(0.1), m.reveal);
                        return (
                          <div key={r} style={{ position: "absolute", left: 40, top: 170 + r * 84, opacity: p, display: "flex", alignItems: "center", gap: 20 }}>
                            <Disc icon="tick" size={44} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                            <div style={{ position: "relative", width: 380, height: 20 }}>
                              <Skel w={[300, 250, 340][r]} h={18} style={{ left: 0, top: 1 }} />
                            </div>
                          </div>
                        );
                      })
                    : (
                      <>
                        {/* the scale: the fair value marked, the price as a dot */}
                        <div style={{ position: "absolute", left: SCALE.x, top: SCALE.y - 5, width: SCALE.w, height: 10, borderRadius: 5, background: theme.color.neutralDot }} />
                        {dotP > 0.001 ? (
                          <div style={{ position: "absolute", left: SCALE.x + Math.min(0.5, dotX) * SCALE.w, top: SCALE.y - 5, width: Math.abs(dotX - 0.5) * SCALE.w, height: 10, borderRadius: 5, background: theme.color.indigoWashStrongSolid, opacity: dotP }} />
                        ) : null}
                        <div style={{ position: "absolute", left: SCALE.x + 0.5 * SCALE.w - 3, top: SCALE.y - 40, width: 6, height: 80, borderRadius: 3, background: c.indigo }} />
                        <div style={{ position: "absolute", left: SCALE.x + 0.5 * SCALE.w - 100, top: SCALE.y + 56, width: 200, textAlign: "center", ...typeStyle("label"), color: c.indigo }}>Fair value</div>
                        {dotP > 0.001 ? (
                          <div style={{ position: "absolute", left: SCALE.x + dotX * SCALE.w - 70, top: SCALE.y - 110, width: 140, opacity: dotP, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                            <div style={{ ...typeStyle("label"), color: c.ink }}>Harga</div>
                            <div style={{ width: 30, height: 30, borderRadius: 999, background: c.ink, boxShadow: `0 0 0 ${(10 * onlyPrice).toFixed(1)}px ${theme.color.indigoWashSolid}` }} />
                          </div>
                        ) : null}
                        {chase > 0.001 ? (
                          <div style={{ position: "absolute", left: SCALE.x + dotX * SCALE.w - 34, top: SCALE.y - 200, opacity: chase, transform: `translateY(${((1 - chase) * 10).toFixed(2)}px)` }}>
                            <Disc icon="stop" size={68} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                          </div>
                        ) : null}
                      </>
                    )}
                </Card>
                <Mark kind="check" p={same} x={b.w - 36} y={36} />
              </div>
            ) : null;
          })}
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
