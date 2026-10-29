/**
 * VI07 · SC06 — "Ramai di Grup Belum Tentu Ramai di Pasar". Situation 3, Ikut ramai. From the ChatGPT storyboard
 * docs/vi-style/storyboards/VI07-SC06.jpg.
 *
 *  A  the heading opens big in the middle (as SC03/SC04) with the topic as its subjudul: one "Trending Stock" label
 *     (red fire), a voice note sliding down from behind it while "Masuk sekarang!" plays and back up behind it after —
 *     and the company beside it, linked only by a dashed line and a "?". The heading docks on "Sebelum ikut masuk"
 *     (Simon 29 Oct).
 *  B  three things to check, numbered: Dampak ke bisnis, Dana masuk, Transaksi naik.
 *  C  each gets its tool — Event Research, Fund Flow, Volume — and a check; their lines feed one bar that fills as
 *     they agree, and stops short of full (no guarantee), with a summary line under it on "Tapi tetap".
 *  D  one summary line on "Kalau buktinya…" (Simon 29 Oct: "text ringkasan aja"): the question alone in the middle,
 *     then "Tunggu dulu." on "menunggu", pushing it left — then Grup beside Pasar (an orderbook, Simon 29 Oct), and
 *     the scene's one line.
 *
 * No figures: the volume bars, the flows and the orderbook are shapes.
 */
import { random, useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Line, Mark, NumRing, OpeningHeading, SITUATION, VoiceBubble, ease, useWords } from "../components/kit";
import { SpinCoin } from "../components/SpinCoin";

const CX = theme.canvas.width / 2;

// A — the subjudul row, laid out inside its own box: label (+ voice note under it) · dashed line with "?" · company
const TREND = { w: 440, h: 120 };
const VOICE = { w: 280, h: 76, gap: 24 };
const LINK = 300;
const FIRM = { w: 420, h: 120 };
const SUB = { w: TREND.w + LINK + FIRM.w, h: TREND.h + VOICE.gap + VOICE.h };

// B/C
const CARD = { w: 440, h: 360, gap: 60, y: 340 };
const cardX = (i: number) => CX - (3 * CARD.w + 2 * CARD.gap) / 2 + i * (CARD.w + CARD.gap);
const CHECKS = [
  { text: "Dampak ke bisnis", icon: "event", at: "peristiwanya", tool: "Event Research", toolAt: "Event Research" },
  { text: "Dana masuk", icon: "flow", at: "dana benar-benar", tool: "Fund Flow", toolAt: "Fund Flow" },
  { text: "Transaksi naik", icon: "volume", at: "aktivitas transaksinya", tool: "Volume", toolAt: "Sementara volume" },
] as const;
const BAR = { x: CX - 450, y: 800, w: 900, h: 22 };
/** The bar never fills: agreement makes the basis stronger, not a guarantee. */
const BAR_MAX = 0.82;

// D
const GRUP = { x: 360, y: 290, w: 500, h: 380 };
const PASAR = { x: 1060, y: 290, w: 500, h: 380 };
/** Pasar as an orderbook: Bid | Offer, five levels each, depth bars growing out from the middle; the rows are bars, not numbers. */
const BOOK = { pad: 36, gap: 12, head: 92, top: 140, pitch: 44, row: 34, price: 72, lot: 52, pill: 14 };
const BOOK_BID = [0.55, 0.78, 0.62, 0.95, 0.7];
const BOOK_OFFER = [0.62, 0.5, 0.86, 0.68, 0.98];

/** Dana masuk: yellow coins rolling into the company, one after another (Simon 29 Oct: "koin ke icon perusahaan"). */
const FLOW = { x0: 110, x1: 310, coin: 40, disc: 66, every: 1.2 };
/**
 * Transaksi naik: a live volume strip — bars scroll in from the right, each as tall as the market was busy when it came
 * in, so the strip climbs while the VO says the activity rises.
 */
const VOL = { x: 70, w: 300, h: 66, bar: 14, pitch: 24, speed: 80 };

/** The small picture inside each check card (C), drawn from its tool's name (`at`). */
const Mini = ({ i, p, at, busy }: { i: number; p: number; at: number; busy: { from: number; to: number } }) => {
  const c = usePalette();
  const f = useCurrentFrame();
  const m = useMotion();
  if (p <= 0.001) return null;
  const t = Math.max(0, f - at);
  if (i === 0)
    return (
      <div style={{ position: "absolute", left: 0, top: 250, width: CARD.w, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, opacity: p }}>
        <Disc icon="event" size={56} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
        <div style={{ width: 70 * p, height: 3, borderRadius: 2, background: c.indigo }} />
        <Disc icon="company" size={56} tone={c.indigo} tint={theme.color.indigoWashSolid} />
      </div>
    );
  if (i === 1)
    return (
      <div style={{ position: "absolute", left: 0, top: 250, width: CARD.w, height: 70, opacity: p }}>
        {/* the coins first: they roll in behind the company's disc */}
        {[0, 1, 2].map((k) => {
          const u = (t / m.sec(FLOW.every) + k / 3) % 1;
          return <SpinCoin key={k} id={`vi07-sc06-coin-${k}`} d={FLOW.coin} x={FLOW.x0 + (FLOW.x1 - FLOW.x0) * u} y={35} phase={k * 0.3} t={t / m.sec(1)} p={Math.min(1, u / 0.15)} />;
        })}
        <div style={{ position: "absolute", left: FLOW.x1 - FLOW.disc / 2, top: 35 - FLOW.disc / 2 }}>
          <Disc icon="company" size={FLOW.disc} tone={c.indigo} tint={theme.color.indigoWashSolid} />
        </div>
      </div>
    );
  const v = VOL.speed / m.sec(1);
  const every = VOL.pitch / v;
  const last = Math.floor(t / every);
  const bars = [];
  for (let k = last - Math.ceil(VOL.w / VOL.pitch) - 1; k <= last; k++) {
    const x = VOL.w - (t - k * every) * v;
    if (x < -VOL.bar || x > VOL.w) continue;
    const b = ease(at + k * every, busy.from, busy.to - busy.from);
    const h = Math.max(6, (24 + 40 * b) * (0.6 + 0.4 * random(`vi07-sc06-vol-${k}`)) * p);
    bars.push(<rect key={k} x={x} y={VOL.h - h} width={VOL.bar} height={h} rx={5} fill={b > 0.5 ? c.indigo : theme.color.indigoWashStrongSolid} />);
  }
  return (
    <svg width={VOL.w} height={VOL.h + 2} style={{ position: "absolute", left: VOL.x, top: 250, opacity: p }}>
      {bars}
      <line x1={0} y1={VOL.h + 1} x2={VOL.w} y2={VOL.h + 1} stroke={theme.color.neutralDot} strokeWidth={2} />
    </svg>
  );
};

export const SC06 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(6, BLOCK.SC06);
  const g = f + BLOCK.SC06;

  // A
  const topicP = ease(f, W("satu topik") - m.sec(0.1), m.reveal);
  const playA = W("Masuk sekarang");
  const playZ = W("Masuk sekarang", 0, "f1");
  const played = ease(f, playA, Math.max(1, playZ - playA));
  /** The voice note: out from behind the label on "voice note", back behind it once it has played. */
  const voiceOut = ease(f, W("voice note"), m.move) - ease(f, playZ + m.sec(0.25), m.move);
  const firmAt = W("Tapi topik");
  const askAt = W("belum tentu");
  /** The label stands alone in the middle until the company comes; then the row slides left to make room for it. */
  const rowShift = ((SUB.w - TREND.w) / 2) * (1 - ease(f, firmAt - m.sec(0.3), m.move));
  const dock = ease(f, W("Sebelum ikut"), m.move);

  // B/C
  const slotsAt = W("cek tiga hal");
  const agreeAt = W("sejalan");
  const fill = BAR_MAX * ease(f, agreeAt, W("pergerakannya.", 0, "f1") - agreeAt);
  const cOut = ease(f, W("Kalau buktinya"), m.fade);

  // D
  const waitAt = W("Kalau buktinya");
  const waitP = ease(f, W("menunggu"), m.move);
  const grupAt = W("ramai di grup");
  /** The orderbook comes on "belum tentu" (Simon 29 Oct), not on "ramai di pasar". */
  const pasarAt = W("belum tentu", 1);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />
      {/* A — the heading opens in the middle; the trending topic and the company it may not touch are its subjudul */}
      <OpeningHeading
        n={3}
        text={SITUATION[2].label}
        p={ease(f, W("Situasi berikutnya"), m.reveal)}
        dock={dock}
        subP={topicP}
        sub={
          <div style={{ position: "relative", width: SUB.w, height: SUB.h, transform: `translateX(${rowShift.toFixed(2)}px)` }}>
            {/* the voice note first, so the label covers it while it is "behind" */}
            {voiceOut > 0.001 ? (
              <div style={{ position: "absolute", left: (TREND.w - VOICE.w) / 2, top: (TREND.h - VOICE.h) / 2 + (TREND.h / 2 + VOICE.gap + VOICE.h / 2) * voiceOut }}>
                <VoiceBubble played={played} />
              </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, top: (1 - topicP) * 14, width: TREND.w, height: TREND.h, opacity: topicP }}>
              <Card x={0} y={0} w={TREND.w} h={TREND.h} style={{ display: "flex", alignItems: "center", gap: 22, padding: "0 32px" }}>
                <Disc icon="hype" size={70} tone={theme.color.alarmRed} tint={theme.color.alarmWashSolid} />
                <div style={{ ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>Trending Stock</div>
              </Card>
            </div>
            <Connector a={{ x: TREND.w, y: TREND.h / 2 }} b={{ x: TREND.w + LINK, y: TREND.h / 2 }} p={ease(f, firmAt + m.sec(0.2), m.sec(0.5))} shape="curve" dashed dash="10 10" tone={theme.color.connectorMuteSolid} />
            <Appear at={askAt} style={{ left: TREND.w + LINK / 2 - 42, top: TREND.h / 2 - 42 }}>
              <div style={{ borderRadius: 999, boxShadow: shadow.soft }}>
                <Disc icon="question" size={84} tone={c.indigo} tint={c.cardBg} />
              </div>
            </Appear>
            <Appear at={firmAt} style={{ left: 0, top: 0 }}>
              <Card x={TREND.w + LINK} y={0} w={FIRM.w} h={FIRM.h} style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 36px" }}>
                <Disc icon="company" size={70} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                <div style={{ ...typeStyle("body"), color: c.ink }}>Perusahaan</div>
              </Card>
            </Appear>
          </div>
        }
      />

      {/* B/C — three checks, each with its tool; their agreement fills one bar */}
      {cOut < 0.999 && f >= slotsAt - m.sec(0.1) ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - cOut }}>
          {CHECKS.map((k, i) => (
            <Connector key={k.tool} a={{ x: cardX(i) + CARD.w / 2, y: CARD.y + CARD.h }} b={{ x: BAR.x + BAR.w * (0.2 + i * 0.3), y: BAR.y }} p={ease(f, agreeAt + i * m.sec(0.12), m.sec(0.45))} shape="curve" axis="y" />
          ))}
          {CHECKS.map((k, i) => {
            const slot = ease(f, slotsAt + i * m.sec(0.08), m.pop);
            const fillP = ease(f, W(k.at) - m.sec(0.1), m.reveal);
            const toolP = ease(f, W(k.toolAt), m.reveal);
            const x = cardX(i);
            return (
              <div key={k.text} style={{ position: "absolute", left: x, top: CARD.y, width: CARD.w, height: CARD.h, opacity: slot }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: theme.shape.cardRadius, border: `2px dashed ${theme.color.connectorMuteSolid}`, opacity: 1 - fillP }} />
                <Card x={0} y={(1 - fillP) * 14} w={CARD.w} h={CARD.h} line={toolP > 0.5 ? theme.color.hairlineBrandSolid : undefined} style={{ opacity: fillP }}>
                  <div style={{ position: "absolute", left: 28, top: 28 }}>
                    <NumRing n={i + 1} size={52} />
                  </div>
                  <div style={{ position: "absolute", left: CARD.w / 2 - 50, top: 50 }}>
                    <Disc icon={k.icon} size={100} tone={toolP > 0.5 ? c.indigo : theme.color.neutralIcon} tint={toolP > 0.5 ? theme.color.indigoWashSolid : theme.color.neutralDisc} />
                  </div>
                  <div style={{ position: "absolute", left: 0, top: 172, width: CARD.w, textAlign: "center", ...typeStyle("body"), color: c.ink }}>{k.text}</div>
                  <Mini i={i} p={toolP} at={W(k.toolAt)} busy={{ from: W("aktivitas pasar"), to: W("meningkat.", 1, "f1") }} />
                </Card>
                {/* the tool's name, tagged above its card */}
                {toolP > 0.001 ? (
                  <div style={{ position: "absolute", left: CARD.w / 2, top: -64 - (1 - toolP) * 10, transform: "translateX(-50%)", opacity: toolP, padding: "10px 26px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connector}`, ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>{k.tool}</div>
                ) : null}
                <Mark kind="check" p={ease(f, agreeAt + i * m.sec(0.12), m.pop)} x={CARD.w - 34} y={34} />
              </div>
            );
          })}
          {/* the basis: fills as they agree, never to the end */}
          {f >= agreeAt ? (
            <div style={{ position: "absolute", left: BAR.x, top: BAR.y, width: BAR.w, height: BAR.h, borderRadius: BAR.h / 2, background: theme.color.neutralDot, opacity: ease(f, agreeAt, m.reveal) }}>
              {/* what the bar is (the storyboard's "Dasar lebih kuat", cut to its keyword) */}
              <div style={{ position: "absolute", right: BAR.w + 28, top: BAR.h / 2, transform: "translateY(-50%)", ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>Dasar</div>
              <div style={{ position: "absolute", left: 0, top: 0, width: BAR.w * fill, height: BAR.h, borderRadius: BAR.h / 2, background: c.indigo }} />
              <div style={{ position: "absolute", left: BAR.w * BAR_MAX, top: -6, width: BAR.w * (1 - BAR_MAX), height: BAR.h + 12, borderRadius: (BAR.h + 12) / 2, border: `2px dashed ${theme.color.connectorMuteSolid}`, boxSizing: "border-box", opacity: ease(f, W("bukan jaminan"), m.reveal) }} />
            </div>
          ) : null}
          {/* "Tapi tetap bukan jaminan…" as one summary line under the bar (Simon 29 Oct) */}
          <Appear at={W("Tapi tetap")} style={{ left: 0, top: 0 }}>
            <Line x={0} y={BAR.y + BAR.h + 72} w={theme.canvas.width} align="center" size={48} weight={500} text="Bukan jaminan harga pasti naik." mark="Bukan jaminan" />
          </Appear>
        </div>
      ) : null}

      {/* D — wait; group ≠ market */}
      <Appear at={waitAt} out={W("Karena ramai")} style={{ left: 0, top: 0 }}>
        <div style={{ position: "absolute", left: 0, top: theme.canvas.height / 2, width: theme.canvas.width, transform: "translateY(-50%)", display: "flex", justifyContent: "center", fontFamily: theme.text.family, fontSize: 56, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.22, color: c.ink, whiteSpace: "nowrap" }}>
          <span>Bukti belum cukup?</span>
          {/* "Tunggu dulu." opens its own room (a grid column at waitP of its width), so the question slides left for it */}
          <div style={{ display: "grid", gridTemplateColumns: `minmax(0, ${waitP.toFixed(4)}fr)` }}>
            <span style={{ paddingLeft: "0.28em", color: c.indigo, opacity: waitP, transform: `translateY(${((1 - waitP) * 14).toFixed(2)}px)` }}>Tunggu dulu.</span>
          </div>
        </div>
      </Appear>
      <Appear at={grupAt} style={{ left: 0, top: 0 }}>
        <Card x={GRUP.x} y={GRUP.y} w={GRUP.w} h={GRUP.h}>
          <div style={{ position: "absolute", left: 38, top: 28, ...typeStyle("body"), color: c.ink }}>Grup</div>
          {[0, 1, 2, 3, 4].map((k) => (
            <div key={k} style={{ position: "absolute", left: k % 2 ? 150 : 36, top: 100 + k * 52, width: [260, 300, 220, 290, 240][k], height: 42, borderRadius: k % 2 ? "22px 8px 22px 22px" : "8px 22px 22px 22px", background: k % 2 ? theme.color.indigoWashSolid : theme.color.neutralDisc, opacity: ease(f, grupAt + k * m.sec(0.07), m.pop) }} />
          ))}
        </Card>
      </Appear>
      <Appear at={pasarAt} style={{ left: 0, top: 0 }}>
        <Card x={PASAR.x} y={PASAR.y} w={PASAR.w} h={PASAR.h}>
          <div style={{ position: "absolute", left: 38, top: 28, ...typeStyle("body"), color: c.ink }}>Pasar</div>
          {(["Bid", "Offer"] as const).map((side, s) => (
            <div key={side} style={{ position: "absolute", left: s ? PASAR.w / 2 + BOOK.gap / 2 : BOOK.pad, top: BOOK.head, width: PASAR.w / 2 - BOOK.gap / 2 - BOOK.pad, textAlign: s ? "right" : "left", ...typeStyle("label"), color: s ? theme.color.cyanInk : c.indigo }}>{side}</div>
          ))}
          <div style={{ position: "absolute", left: BOOK.pad, top: BOOK.top - 14, width: PASAR.w - 2 * BOOK.pad, height: 2, background: theme.color.neutralDot }} />
          {BOOK_BID.map((bid, k) => {
            const rowP = ease(f, pasarAt + k * m.sec(0.07), m.pop);
            const depth = ease(f, pasarAt + k * m.sec(0.07) + m.sec(0.1), m.reveal);
            const half = PASAR.w / 2 - BOOK.gap / 2 - BOOK.pad;
            const y = BOOK.top + k * BOOK.pitch;
            const pill = (x: number, w: number, fill: string) => <div style={{ position: "absolute", left: x, top: y + (BOOK.row - BOOK.pill) / 2, width: w, height: BOOK.pill, borderRadius: BOOK.pill / 2, background: fill }} />;
            return (
              <div key={k} style={{ opacity: rowP }}>
                {/* depth: bid grows left from the middle, offer right */}
                <div style={{ position: "absolute", left: PASAR.w / 2 - BOOK.gap / 2 - half * bid * depth, top: y, width: half * bid * depth, height: BOOK.row, borderRadius: 8, background: theme.color.indigoWashDeepSolid }} />
                <div style={{ position: "absolute", left: PASAR.w / 2 + BOOK.gap / 2, top: y, width: half * BOOK_OFFER[k] * depth, height: BOOK.row, borderRadius: 8, background: theme.color.cyanWashDeepSolid }} />
                {pill(BOOK.pad + 12, BOOK.lot, theme.color.neutralDot)}
                {pill(PASAR.w / 2 - BOOK.gap / 2 - 12 - BOOK.price, BOOK.price, c.indigo)}
                {pill(PASAR.w / 2 + BOOK.gap / 2 + 12, BOOK.price, theme.color.cyanInk)}
                {pill(PASAR.w - BOOK.pad - 12 - BOOK.lot, BOOK.lot, theme.color.neutralDot)}
              </div>
            );
          })}
        </Card>
      </Appear>
      <Appear at={grupAt} style={{ left: 0, top: 0 }}>
        <Line x={0} y={790} w={theme.canvas.width} align="center" size={54} weight={500} text="Ramai di grup, belum tentu ramai di pasar." mark="ramai di pasar" />
      </Appear>
    </Stage>
  );
};
