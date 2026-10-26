/**
 * VI07 · SC06 — "Ramai di Grup Belum Tentu Ramai di Pasar". Situation 3, Ikut ramai. From the ChatGPT storyboard
 * docs/vi-style/storyboards/VI07-SC06.jpg.
 *
 *  A  a topic blowing up (chat bubbles piling in, a voice note: "Masuk sekarang") — and the company beside it, linked
 *     only by a dashed line and a "?".
 *  B  three things to check, numbered: Dampak ke bisnis, Dana masuk, Transaksi naik.
 *  C  each gets its tool — Event Research, Fund Flow, Volume — and a check; their lines feed one bar that fills as
 *     they agree, and stops short of full (no guarantee).
 *  D  "Tunggu" — then Grup beside Pasar, and the scene's one line.
 *
 * No figures: the volume bars and the flows are shapes.
 */
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Heading, Line, Mark, NumRing, SITUATION, Skel, VoiceBubble, ease, useWords } from "../components/kit";
import { Lens } from "../components/Dalio";

const CX = theme.canvas.width / 2;

// A
const TOPIC = { x: 260, y: 280, w: 560, h: 520 };
const FIRM = { x: 1180, y: 410, w: 460, h: 200 };
const PILE = [
  { x: 40, y: 130, w: 300 },
  { x: 140, y: 200, w: 260 },
  { x: 60, y: 270, w: 340 },
  { x: 180, y: 340, w: 220 },
];

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
const PASAR_BARS = [26, 34, 22, 30, 24, 28, 20, 32];

/** The small picture inside each check card (C), drawn when its tool is named. */
const Mini = ({ i, p }: { i: number; p: number }) => {
  const c = usePalette();
  const f = useCurrentFrame();
  const m = useMotion();
  if (p <= 0.001) return null;
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
      <svg width={CARD.w} height={70} style={{ position: "absolute", left: 0, top: 250, opacity: p }}>
        {[0, 1, 2].map((k) => {
          const t = ((f / m.sec(1.2) + k / 3) % 1) * p;
          const x = 110 + t * 200;
          return <polyline key={k} points={`${x - 14},${20} ${x},${35} ${x - 14},${50}`} fill="none" stroke={c.indigo} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={Math.sin(t * Math.PI)} />;
        })}
        <rect x={322} y={14} width={12} height={42} rx={6} fill={c.indigo} />
      </svg>
    );
  return (
    <svg width={CARD.w} height={70} style={{ position: "absolute", left: 0, top: 250, opacity: p }}>
      {[18, 26, 22, 36, 44, 58].map((h, k) => {
        const hh = h * Math.min(1, Math.max(0, p * 1.4 - k * 0.07));
        return <rect key={k} x={140 + k * 28} y={66 - hh} width={18} height={hh} rx={5} fill={k > 2 ? c.indigo : theme.color.indigoWashStrongSolid} />;
      })}
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
  const topicAt = W("satu topik");
  const pileAt = W("tiba-tiba ramai");
  const voiceAt = W("voice note");
  const playA = W("Masuk sekarang");
  const played = ease(f, playA, Math.max(1, W("Masuk sekarang", 0, "f1") - playA));
  const firmAt = W("Tapi topik");
  const askAt = W("belum tentu");
  const aOut = ease(f, W("Sebelum ikut"), m.fade);

  // B/C
  const slotsAt = W("cek tiga hal");
  const agreeAt = W("sejalan");
  const fill = BAR_MAX * ease(f, agreeAt, W("pergerakannya.", 0, "f1") - agreeAt);
  const cOut = ease(f, W("Kalau buktinya"), m.fade);

  // D
  const waitAt = W("Kalau buktinya");
  const waitOut = ease(f, W("Karena ramai"), m.fade);
  const grupAt = W("ramai di grup");
  const pasarAt = W("ramai di pasar");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />
      <Appear at={0} style={{ left: 0, top: 0 }}>
        <Heading n={3} text={SITUATION[2].label} />
      </Appear>

      {/* A — the topic everyone is talking about, and the company it may or may not touch */}
      {aOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - aOut }}>
          <Appear at={topicAt - m.sec(0.1)} style={{ left: 0, top: 0 }}>
            <Card x={TOPIC.x} y={TOPIC.y} w={TOPIC.w} h={TOPIC.h}>
              <div style={{ position: "absolute", left: 40, top: 36, display: "flex", alignItems: "center", gap: 20 }}>
                <Disc icon="hype" size={70} tone={theme.color.alarmRed} tint={theme.color.alarmWashSolid} />
                <div style={{ position: "relative", width: 220, height: 20 }}>
                  <Skel w={200} h={20} style={{ left: 0, top: 0 }} />
                </div>
              </div>
              {PILE.map((b, k) => {
                const p = ease(f, pileAt + k * m.sec(0.12), m.pop);
                if (p <= 0.001) return null;
                return (
                  <div key={k} style={{ position: "absolute", left: b.x, top: b.y + (1 - p) * 14, width: b.w, height: 56, borderRadius: k % 2 ? "26px 8px 26px 26px" : "8px 26px 26px 26px", background: k % 2 ? theme.color.indigoWashSolid : theme.color.neutralDisc, opacity: p, display: "flex", alignItems: "center", padding: "0 22px", boxSizing: "border-box" }}>
                    <div style={{ position: "relative", width: b.w - 80, height: 14 }}>
                      <Skel w={b.w - 80} h={14} style={{ left: 0, top: 0 }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: 40, top: 420, opacity: ease(f, voiceAt, m.pop), transform: `translateY(${((1 - ease(f, voiceAt, m.pop)) * 14).toFixed(2)}px)` }}>
                <VoiceBubble played={played} />
              </div>
            </Card>
          </Appear>
          <Connector a={{ x: TOPIC.x + TOPIC.w, y: FIRM.y + FIRM.h / 2 }} b={{ x: FIRM.x, y: FIRM.y + FIRM.h / 2 }} p={ease(f, firmAt + m.sec(0.2), m.sec(0.5))} shape="curve" dashed dash="10 10" tone={theme.color.connectorMuteSolid} />
          <Appear at={askAt} style={{ left: (TOPIC.x + TOPIC.w + FIRM.x) / 2 - 42, top: FIRM.y + FIRM.h / 2 - 42 }}>
            <div style={{ borderRadius: 999, boxShadow: shadow.soft }}>
              <Disc icon="question" size={84} tone={c.indigo} tint={c.cardBg} />
            </div>
          </Appear>
          <Appear at={firmAt} style={{ left: 0, top: 0 }}>
            <Card x={FIRM.x} y={FIRM.y} w={FIRM.w} h={FIRM.h} style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 40px" }}>
              <Disc icon="company" size={80} tone={c.indigo} tint={theme.color.indigoWashSolid} />
              <div style={{ ...typeStyle("body"), color: c.ink }}>Perusahaan</div>
            </Card>
          </Appear>
        </div>
      ) : null}

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
                  <Mini i={i} p={toolP} />
                </Card>
                {/* the tool's name, tagged above its card */}
                {toolP > 0.001 ? (
                  <div style={{ position: "absolute", left: CARD.w / 2, top: -64 - (1 - toolP) * 10, transform: "translateX(-50%)", opacity: toolP, padding: "10px 26px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connector}`, ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>{k.tool}</div>
                ) : null}
                <Mark kind="check" p={ease(f, agreeAt + i * m.sec(0.12), m.pop)} x={CARD.w - 34} y={34} />
              </div>
            );
          })}
          {/* the lens dives into the volume: inside, the transactions it is made of — more of them as activity rises
              (Benchmark v2: the Economic Machine's magnifier) */}
          {(() => {
            const p = ease(f, W("aktivitas pasar") - m.sec(0.1), m.pop) * (1 - ease(f, agreeAt, m.fade));
            if (p <= 0.001) return null;
            const r = 56;
            const busy = ease(f, W("aktivitas pasar"), W("meningkat.", 1, "f1") - W("aktivitas pasar"));
            const n = Math.round(6 + 16 * busy);
            return (
              <Lens cx={cardX(2) + CARD.w / 2 + 50} cy={CARD.y + 292} r={r} p={p}>
                {Array.from({ length: n }, (_, k) => {
                  const x = ((k * 53 + f * (1.6 + (k % 3) * 0.5)) % (2 * r + 40)) - 20;
                  const y = 22 + ((k * 29) % (2 * r - 44));
                  return <div key={k} style={{ position: "absolute", left: x, top: y, width: 20, height: 11, borderRadius: 4, background: k % 3 === 0 ? c.indigo : theme.color.indigoWashStrongSolid }} />;
                })}
              </Lens>
            );
          })()}
          {/* the basis: fills as they agree, never to the end */}
          {f >= agreeAt ? (
            <div style={{ position: "absolute", left: BAR.x, top: BAR.y, width: BAR.w, height: BAR.h, borderRadius: BAR.h / 2, background: theme.color.neutralDot, opacity: ease(f, agreeAt, m.reveal) }}>
              {/* what the bar is (the storyboard's "Dasar lebih kuat", cut to its keyword) */}
              <div style={{ position: "absolute", right: BAR.w + 28, top: BAR.h / 2, transform: "translateY(-50%)", ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>Dasar</div>
              <div style={{ position: "absolute", left: 0, top: 0, width: BAR.w * fill, height: BAR.h, borderRadius: BAR.h / 2, background: c.indigo }} />
              <div style={{ position: "absolute", left: BAR.w * BAR_MAX, top: -6, width: BAR.w * (1 - BAR_MAX), height: BAR.h + 12, borderRadius: (BAR.h + 12) / 2, border: `2px dashed ${theme.color.connectorMuteSolid}`, boxSizing: "border-box", opacity: ease(f, W("bukan jaminan"), m.reveal) }} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* D — wait; group ≠ market */}
      {waitOut < 0.999 ? (
        <Appear at={waitAt} style={{ left: CX - 170, top: 450, opacity: 1 - waitOut }}>
          <div style={{ width: 340, height: 130, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
            <Disc icon="time" size={76} tone={c.indigo} tint={theme.color.indigoWashSolid} />
            <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink }}>Tunggu</div>
          </div>
        </Appear>
      ) : null}
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
          <svg width={PASAR.w - 72} height={200} style={{ position: "absolute", left: 36, top: 140 }}>
            <line x1={0} y1={199} x2={PASAR.w - 72} y2={199} stroke={theme.color.neutralDot} strokeWidth={2} />
            {PASAR_BARS.map((h, k) => (
              <rect key={k} x={k * 56} y={198 - h} width={34} height={h} rx={6} fill={theme.color.neutralDot} />
            ))}
          </svg>
        </Card>
      </Appear>
      <Appear at={grupAt} style={{ left: 0, top: 0 }}>
        <Line x={0} y={790} w={theme.canvas.width} align="center" size={54} weight={500} text="Ramai di grup, belum tentu ramai di pasar." mark="ramai di pasar" />
      </Appear>
    </Stage>
  );
};
