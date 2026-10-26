/**
 * VI07 · SC03 — "Harga Berubah, Belum Tentu Perusahaannya Berubah". Situation 1, Panik.
 *
 *  A  a price line rises ("terasa semakin bagus") and falls ("semakin buruk"), the feeling riding its tip.
 *  B  "Padahal": the line shrinks to the left as Harga, still moving; Perusahaan beside it, flat.
 *  C  the stock page in Tuntun and its two things: Company Quality, then Fair Value — a scale with the fair value
 *     marked and the price as a dot. The dot runs far above (a hand: don't chase), drops below; both cards are
 *     checked, both still ✓ — only the price moved.
 *  D  Orang Tuntun: "Periksa dulu, baru bereaksi."
 *
 * No figures anywhere: the line is a shape, the scale has no numbers (nothing here is a real stock).
 */
import { interpolate, useCurrentFrame } from "remotion";
import { SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Heading, Line, Mark, ORANG_TUNTUN_RIGHT, OrangTuntun, SITUATION, Skel, ease, useWords } from "../components/kit";

type Box = { x: number; y: number; w: number; h: number };
const mix = (a: Box, b: Box, t: number): Box => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t });

// A/B — the price line: big in the middle, then the left half
const BIG: Box = { x: 360, y: 300, w: 1200, h: 440 };
const HALF: Box = { x: 180, y: 330, w: 640, h: 380 };
const FIRM = { x: 1100, y: 330, w: 640, h: 380 };
/** Knots (0..1 across, 0..1 down) — up to a high, down to a low, then on. */
const KNOTS: [number, number][] = [[0, 0.62], [0.08, 0.55], [0.16, 0.48], [0.24, 0.36], [0.32, 0.28], [0.4, 0.14], [0.47, 0.2], [0.54, 0.36], [0.62, 0.5], [0.7, 0.66], [0.78, 0.82], [0.86, 0.74], [0.93, 0.6], [1, 0.66]];
const HIGH = 5;
const LOW = 10;

// C — the stock page
const PAGE: Box = { x: 220, y: 230, w: 1480, h: 640 };
const CQ: Box = { x: PAGE.x + 50, y: PAGE.y + 140, w: 660, h: 450 };
const FV: Box = { x: PAGE.x + PAGE.w - 50 - 660, y: PAGE.y + 140, w: 660, h: 450 };
const SCALE = { x: 60, w: 540, y: 290 };

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(3, BLOCK.SC03);
  const g = f + BLOCK.SC03;

  // A — rise and fall
  const upP = ease(f, W("Ketika harga naik"), W("bagus.", 0, "f1") - W("Ketika harga naik"));
  const downP = ease(f, W("Ketika harga turun"), W("buruk.", 0, "f1") - W("Ketika harga turun"));
  const draw = interpolate(upP + downP, [0, 1, 2], [0.04, KNOTS[HIGH][0], KNOTS[LOW][0] + 0.02]);
  const restAt = W("Padahal:");
  const rest = ease(f, restAt, m.move);
  const drawAll = draw + (1 - draw) * ease(f, restAt, m.sec(0.8));
  const box = mix(BIG, HALF, rest);
  /** After "Padahal" the price keeps moving — the company does not. */
  const live = ease(f, restAt + m.sec(0.4), m.reveal);
  const pts = KNOTS.map(([x, y], k) => [box.x + x * box.w, box.y + (y + live * 0.06 * Math.sin(g / m.sec(0.9) + k * 1.3)) * box.h] as const);
  const lineOut = ease(f, W("Karena itu,"), m.fade);
  const tip = (() => {
    const t = Math.min(drawAll, 1);
    let k = 0;
    while (k < KNOTS.length - 2 && KNOTS[k + 1][0] < t) k++;
    const [x0, y0] = pts[k];
    const [x1, y1] = pts[k + 1];
    const u = Math.max(0, Math.min(1, (t - KNOTS[k][0]) / (KNOTS[k + 1][0] - KNOTS[k][0])));
    return { x: x0 + (x1 - x0) * u, y: y0 + (y1 - y0) * u };
  })();
  const goodP = ease(f, W("semakin bagus"), m.pop) * (1 - ease(f, W("Ketika harga turun"), m.fade));
  const badP = ease(f, W("semakin buruk"), m.pop) * (1 - rest);

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

      <Appear at={W("situasi pertama")} out={insightAt} style={{ left: 0, top: 0 }}>
        <Heading n={1} text={SITUATION[0].label} />
      </Appear>

      {/* A/B — the price line, then Harga beside Perusahaan */}
      {lineOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: (1 - lineOut) * ease(f, W("saat keputusan"), m.reveal) }}>
          {rest > 0.001 ? (
            <Card x={box.x - 40} y={box.y - 80} w={box.w + 80} h={box.h + 120} style={{ opacity: rest }}>
              <div style={{ position: "absolute", left: 40, top: 28, ...typeStyle("body"), color: c.ink }}>Harga</div>
            </Card>
          ) : null}
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            <clipPath id="vi07-sc03-draw">
              <rect x={0} y={0} width={box.x + box.w * Math.min(1, drawAll) + 4} height={theme.canvas.height} />
            </clipPath>
            <polyline points={pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} fill="none" stroke={c.indigo} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" clipPath="url(#vi07-sc03-draw)" />
            <circle cx={tip.x} cy={tip.y} r={10} fill={c.cardBg} stroke={c.indigo} strokeWidth={4} opacity={1 - rest} />
          </svg>
          {/* the feeling rides the tip */}
          {[
            { p: goodP, icon: "good", text: "Bagus" },
            { p: badP, icon: "bad", text: "Buruk" },
          ].map((k) =>
            k.p > 0.001 ? (
              <div key={k.text} style={{ position: "absolute", left: tip.x - 110, top: tip.y + (k.icon === "good" ? -150 : 50), width: 220, height: 84, borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, opacity: k.p, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, transform: `translateY(${((1 - k.p) * 12).toFixed(2)}px)` }}>
                <Disc icon={k.icon} size={52} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
                <div style={{ ...typeStyle("body"), color: c.ink }}>{k.text}</div>
              </div>
            ) : null,
          )}
          {/* ≠ between them on "belum tentu" (the storyboard's B) */}
          <Appear at={W("belum tentu")} style={{ left: (HALF.x + HALF.w + 40 + FIRM.x - 40) / 2 - 30, top: HALF.y + HALF.h / 2 - 60 }}>
            <div style={{ width: 60, textAlign: "center", ...typeStyle("statement"), fontWeight: 400, color: c.indigo }}>≠</div>
          </Appear>
          {/* the company: flat */}
          <Appear at={W("perusahaannya ikut")} style={{ left: 0, top: 0 }}>
            <Card x={FIRM.x - 40} y={FIRM.y - 80} w={FIRM.w + 80} h={FIRM.h + 120}>
              <div style={{ position: "absolute", left: 40, top: 28, display: "flex", alignItems: "center", gap: 18 }}>
                <Disc icon="company" size={52} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                <div style={{ ...typeStyle("body"), color: c.ink }}>Perusahaan</div>
              </div>
              <svg width={FIRM.w} height={FIRM.h} style={{ position: "absolute", left: 40, top: 80 }}>
                <line x1={0} y1={FIRM.h * 0.5} x2={FIRM.w * ease(f, W("perusahaannya ikut"), m.sec(0.8))} y2={FIRM.h * 0.5} stroke={c.indigo} strokeWidth={5} strokeLinecap="round" />
              </svg>
            </Card>
          </Appear>
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
