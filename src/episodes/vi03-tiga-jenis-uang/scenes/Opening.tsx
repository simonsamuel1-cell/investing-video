/**
 * VI03 · SC01–SC04 — the opening and chapter 01 (Uang Aktif). Built from the ChatGPT storyboards
 * (docs/vi-style/storyboards/VI03-SC0x.jpg); every beat is a WORD of the VO (useWords → data/words.json).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { GridGround, Stage, TuntunMark, theme, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, Art, Panel3, Tag, Cutout, Ico, KIND, OUTSIDE_RESERVES, Pill, Statement, TypeBox, Wallet, ease, ink, useWords, type Kind } from "../components/kit";

const CX = theme.canvas.width / 2;
const KINDS: Kind[] = ["aktif", "stabil", "panjang"];

/** The grid ground every VI03 scene stands on (same global frame → the same drift across scenes). */
const Ground = ({ from }: { from: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: OUTSIDE_RESERVES }}>
      <GridGround f={f + from} paper={c.bg} />
    </div>
  );
};

/** The mascot's slow bob, off the GLOBAL frame. */
const bob = (g: number) => Math.sin((g / 240) * Math.PI * 2) * 10;
const MASCOT_H = 120;

// ═══ SC01 — the money comes in; the question that matters ════════════════
const NOTE = { w: 620, h: 112, gap: 22, top: 290, icon: 52 };
const NOTES = ["Gaji masuk", "Bonus masuk", "THR masuk"];
const PRODUCTS: { label: string; icon: string; x: number; y: number }[] = [
  { label: "Saham", icon: "ph-chart-line-up-duotone", x: 520, y: 300 },
  { label: "Reksa dana", icon: "ph-chart-pie-slice-duotone", x: 1400, y: 300 },
  { label: "Obligasi", icon: "ph-scroll-duotone", x: 290, y: 560 },
  { label: "Emas", icon: "keyline-icons-gold-bars-duotone", x: 1630, y: 560 },
  { label: "Deposito", icon: "ph-bank-duotone", x: CX, y: 760 },
];
/** Orang Tuntun (public/art/vi01/orang-tuntun.png), head to belly, at the left — the insight of this scene. */
const MAN = { src: "art/vi01/orang-tuntun.png", w: 941, h: 1672, ink: { x0: 233, x1: 794, y0: 84 }, belly: 820, top: 150, floor: 900, foot: 0.28 };
const MAN_K = (MAN.floor - MAN.top) / (MAN.belly - MAN.ink.y0);

export const SC01 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(1, BLOCK.SC01);
  const g = f + BLOCK.SC01;
  const askAt = W("biasanya");
  const turnAt = W("tapi");
  const manAt = W("ada satu pertanyaan");
  const keyAt = W("uang ini kapan");
  const productsGone = ease(f, turnAt, m.move);
  return (
    <Stage>
      <Ground from={BLOCK.SC01} />

      {/* A — Gaji, bonus, THR: three notifications stacking in, the coins under them */}
      {NOTES.map((t, i) => (
        <Appear key={t} at={W(["gaji", "bonus", "thr"][i])} out={askAt} style={{ left: CX - NOTE.w / 2, top: NOTE.top + i * (NOTE.h + NOTE.gap) }}>
          <Panel3 x={0} y={0} w={NOTE.w} h={NOTE.h} style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 32px" }}>
            <div style={{ width: NOTE.icon + 20, height: NOTE.icon + 20, borderRadius: 999, background: theme.color.walletStabilWash, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico name="ph-coins-duotone" size={NOTE.icon} />
            </div>
            <div style={{ fontFamily: theme.text.family, lineHeight: 1.15 }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: c.ink }}>{t}</div>
              <div style={{ fontSize: 26, fontWeight: 600, color: c.slate }}>Baru saja</div>
            </div>
          </Panel3>
        </Appear>
      ))}
      <Appear at={W("masuk")} out={askAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Art src="art/vi03/coins.png" aspect={601 / 452} cx={CX + 520} cy={NOTE.top + 3 * (NOTE.h + NOTE.gap) - 40} h={230} />
      </Appear>

      {/* B — "Uang ini enaknya diinvestasikan ke mana?" with the products around it */}
      <Appear at={askAt + m.fade} out={manAt} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: 330, textAlign: "center", fontFamily: theme.text.family, fontSize: 34, fontWeight: 700, letterSpacing: 2, color: c.indigo }}>Pertanyaan pertama</div>
      </Appear>
      <Appear at={W("uang ini enaknya") - m.sec(0.15)} out={manAt} style={{ left: CX - 470, top: 400 }}>
        <Panel3 x={0} y={0} w={940} h={220} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 60px" }}>
          <div style={{ fontFamily: theme.text.family, fontSize: 56, fontWeight: 800, color: c.ink, textAlign: "center", lineHeight: 1.15 }}>Uang ini enaknya diinvestasikan ke mana?</div>
        </Panel3>
      </Appear>
      {PRODUCTS.map((p, i) => {
        const at = W("diinvestasikan") + m.sec(0.12) * i;
        const life = ease(f, at, m.reveal) * (1 - productsGone);
        if (life <= 0.001) return null;
        return (
          <div key={p.label} style={{ position: "absolute", inset: 0, opacity: life, transform: `translateY(${((1 - ease(f, at, m.reveal)) * 14).toFixed(2)}px)` }}>
            <Pill cx={p.x} cy={p.y} w={300} icon={p.icon} label={p.label} />
            <div style={{ position: "absolute", left: p.x + 132, top: p.y - 64, width: 44, height: 44, borderRadius: 999, background: c.indigo, color: c.cardBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: 28, fontWeight: 800 }}>?</div>
          </div>
        );
      })}

      {/* C — the insight: Orang Tuntun, and the question that comes first */}
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `linear-gradient(to bottom, black ${MAN.floor - MAN.foot * (MAN.floor - MAN.top)}px, transparent ${MAN.floor}px)`, maskImage: `linear-gradient(to bottom, black ${MAN.floor - MAN.foot * (MAN.floor - MAN.top)}px, transparent ${MAN.floor}px)` }}>
        <Cutout src={MAN.src} aspect={MAN.w / MAN.h} x={theme.margin.left + 40 + (MAN.ink.x1 - MAN.ink.x0) * MAN_K / 2 + (MAN.w / 2 - (MAN.ink.x0 + MAN.ink.x1) / 2) * MAN_K} y={MAN.floor + (MAN.h - MAN.belly) * MAN_K} h={MAN.h * MAN_K} at={manAt} rise={theme.canvas.height - MAN.top} riseFrames={m.move} />
      </div>
      <Appear at={W("jauh lebih penting")} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Art src="art/vi03/calendar.png" aspect={568 / 505} cx={1240} cy={310} h={200} />
      </Appear>
      <Appear at={keyAt} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Statement cx={1240} cy={590} text="Uang ini, kapan akan saya pakai?" mark="kapan" size={100} maxWidth={900} />
      </Appear>

      {/* the mascot, over it all, from the first notification */}
      {/* the mascot stays where it is — top centre — bobbing, until Orang Tuntun takes over */}
      <div style={{ opacity: ease(f, W("gaji"), m.reveal) * (1 - ease(f, manAt, m.fade)) }}>
        <TuntunMark x={CX} y={150 + bob(g)} height={MASCOT_H} />
      </div>
    </Stage>
  );
};

// ═══ SC02 + SC03 — one continuous move ═══════════════════════════════════
/**
 * Simon on the first cut: "scene 2-3 rasanya kurang lengkap, animasinya juga kurang, dan gerakan maskotnya
 * unnecessary". So the two scenes are one movement with no cut between them (CONTINUOUS in timing.ts):
 *  SC02 A  two lanes from "Sekarang" — a short green one to "Bulan depan", a long indigo one to "5 tahun lagi",
 *          an envelope on each, ≠ between them;
 *       B  each lane turns into its market line: the short one ends in a dip (▼), the long one has time to
 *          come back (▲) — schematic, not data;
 *       C  "jadi sebelum memilih produk": the statement and one pile of coins; "pisahkan dulu uangnya": the pile
 *          splits three ways, dashed lines between (Simon preferred this to a version with the products passing
 *          by and coins flying into slots).
 *  SC03    the cards grow in around the three piles, named on their words; "tiga dompet": a wallet drops into
 *          each card and swallows its pile; each card's job and, on a time line under them, its time of use.
 * No mascot here.
 */
const LANE = { x0: 420, y: [360, 600], end: [660, 1640], bar: 16, env: 150, wave: 60 };
const COLS = { gap: 510 };
const colX = (i: number) => CX + (i - 1) * COLS.gap;
/** The one pile, then three: at the centre, h 260; split, each h 190 at its column. */
const PILE = { cy: 520, h: 260, split: 190, rule: { y0: 350, y1: 720 } };
const pileX = (i: number, split: number) => CX + (colX(i) - CX) * split;

/** A schematic market line along a lane: `o(t)` in −1…1 (negative = up), drawn to `p`. Not data. */
const lanePath = (x0: number, x1: number, y: number, a: number, o: (t: number) => number, p: number) => {
  const n = 80;
  const pts: string[] = [];
  for (let i = 0; i <= Math.floor(n * p); i++) {
    const t = i / n;
    pts.push(`${i ? "L" : "M"} ${(x0 + (x1 - x0) * t).toFixed(1)} ${(y + a * o(t)).toFixed(1)}`);
  }
  return pts.join(" ");
};
const SHORT = (t: number) => -0.5 * Math.sin(t * Math.PI * 2.2) + 0.9 * Math.pow(t, 1.5);
const LONG = (t: number) => 0.45 * Math.sin(t * Math.PI * 1.6) - 0.3 * Math.sin(t * Math.PI * 6) - 0.7 * t * t;

const CARD3 = { w: 460, top: 230, h: 440, wallet: { cy: 350, h: 170 }, name: 470, task: 540, label: 38 };
const TASKS: Record<Kind, { icon: string; text: string; time: string }> = {
  aktif: { icon: "check-aktif", text: "Kebutuhan sekarang", time: "Sewaktu-waktu" },
  stabil: { icon: "check-stabil", text: "Tujuan yang sudah jelas", time: "1–3 tahun" },
  panjang: { icon: "check-indigo", text: "Potensi tumbuh lebih tinggi", time: "3 tahun ke atas" },
};
const TIMELINE = { y: 770, x0: theme.margin.left + 40, x1: theme.canvas.width - theme.margin.right - 40 };

/** The coins: one pile, or three (split 0→1), with dashed rules between once split. */
const Piles = ({ life, split, rules, lift = 0, shrink = 0, swallow = [0, 0, 0] }: { life: number; split: number; rules: number; lift?: number; shrink?: number; swallow?: number[] }) => {
  const c = usePalette();
  if (life <= 0.001) return null;
  const ruleOn = Math.max(0, rules * 2 - 1);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: life }}>
      {[0, 1, 2].map((i) => {
        if (swallow[i] >= 0.999) return null;
        const h = (PILE.h + (PILE.split - PILE.h) * split) * (1 - 0.4 * shrink) * (1 - 0.7 * swallow[i]);
        const cy = PILE.cy + lift;
        return <Art key={i} src="art/vi03/coins.png" aspect={601 / 452} cx={pileX(i, split)} cy={cy} h={h} style={{ opacity: 1 - swallow[i] }} />;
      })}
      {ruleOn > 0.001 ? (
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, opacity: ruleOn }}>
          {[CX - COLS.gap / 2, CX + COLS.gap / 2].map((x) => (
            <line key={x} x1={x} y1={PILE.rule.y0} x2={x} y2={PILE.rule.y1} stroke={c.muted} strokeWidth={4} strokeDasharray="14 12" strokeLinecap="round" />
          ))}
        </svg>
      ) : null}
    </div>
  );
};

export const SC02 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(2, BLOCK.SC02);
  const timeAt = W("waktu penggunaannya");
  const waveAt = W("kemampuan");
  const splitAt = W("jadi sebelum");
  const pisahAt = W("pisahkan");
  const lanes = 1 - ease(f, splitAt, m.fade);
  const lanesUp = ease(f, splitAt, m.move) * -40;
  const barAt = [W("bulan depan"), W("lima tahun lagi")];
  /* each envelope comes with "uang" — the money that is talked about — before its lane is drawn */
  const envAt = [W("uang"), W("dengan uang")];
  const split = ease(f, pisahAt, m.move);
  return (
    <Stage>
      <Ground from={BLOCK.SC02} />

      {lanes > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: lanes, transform: `translateY(${lanesUp.toFixed(1)}px)` }}>
          {/* "Sekarang": where both lanes start */}
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: ease(f, 0, m.reveal) }}>
            <line x1={LANE.x0} y1={LANE.y[0] - 90} x2={LANE.x0} y2={LANE.y[1] + 90} stroke={c.muted} strokeWidth={3} strokeDasharray="10 10" strokeLinecap="round" />
          </svg>
          <Appear at={0} style={{ left: LANE.x0 - 80, top: LANE.y[1] + 104 }}>
            <Tag x={0} y={0} text="Sekarang" />
          </Appear>
          {[0, 1].map((lane) => {
            const kind: Kind = lane === 0 ? "aktif" : "panjang";
            const grow = ease(f, barAt[lane], m.sec(lane === 0 ? 0.5 : 1.1));
            if (f < envAt[lane]) return null;
            const y = LANE.y[lane];
            const x1 = LANE.x0 + (LANE.end[lane] - LANE.x0) * grow;
            const p = ease(f, waveAt + m.sec(0.2) * lane, m.sec(lane === 0 ? 0.6 : 1.4));
            return (
              <div key={lane} style={{ position: "absolute", inset: 0 }}>
                {/* the envelope at the lane's start */}
                <Art src="art/vi03/envelope.png" aspect={533 / 504} cx={LANE.x0 - 150} cy={y} h={LANE.env} style={{ opacity: ease(f, envAt[lane], m.reveal) }} />
                <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                  {/* the lane: a thick bar for the time, then its market line over it */}
                  <line x1={LANE.x0} y1={y} x2={x1} y2={y} stroke={ink(kind)} strokeWidth={LANE.bar} strokeLinecap="round" opacity={1 - 0.75 * p} />
                  {p > 0.001 ? <path d={lanePath(LANE.x0, LANE.end[lane], y, LANE.wave, lane === 0 ? SHORT : LONG, p)} fill="none" stroke={ink(kind)} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /> : null}
                  <circle cx={x1} cy={y} r={14 * grow} fill={ink(kind)} opacity={1 - p} />
                </svg>
                {/* its name at the end */}
                <div style={{ position: "absolute", ...(lane === 0 ? { left: LANE.end[0] + 34, top: y - 24 } : { right: theme.canvas.width - LANE.end[1], top: y + 50 }), opacity: ease(f, barAt[lane] + m.sec(lane === 0 ? 0.3 : 0.8), m.reveal), fontFamily: theme.text.family, fontSize: 38, fontWeight: 800, color: ink(kind), whiteSpace: "nowrap" }}>{lane === 0 ? "Bulan depan" : "5 tahun lagi"}</div>
                {/* "waktu penggunaannya berbeda" */}
                <Appear at={timeAt + m.sec(0.15) * lane} style={{ left: LANE.x0 + 10, top: y - 74 }}>
                  <div style={{ fontFamily: theme.text.family, fontSize: 28, fontWeight: 700, color: c.slate, whiteSpace: "nowrap" }}>{lane === 0 ? "Waktu pakai singkat" : "Waktu pakai panjang"}</div>
                </Appear>
                {/* where each line ends: down for the short one, back up for the long one */}
                {p > 0.98 ? (
                  <div style={{ position: "absolute", left: LANE.end[lane] - 22, top: y + LANE.wave * (lane === 0 ? SHORT(1) : LONG(1)) + (lane === 0 ? 18 : -66), width: 44, height: 44, borderRadius: 999, background: lane === 0 ? theme.color.calendarRed : theme.color.checkGreen, color: c.cardBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, opacity: ease(f, waveAt + m.sec(lane === 0 ? 0.6 : 1.6), m.reveal) }}>{lane === 0 ? "▼" : "▲"}</div>
                ) : null}
              </div>
            );
          })}
          <Appear at={W("lima tahun lagi") + m.sec(0.3)} style={{ left: LANE.x0 - 150 - 60, width: 120, top: (LANE.y[0] + LANE.y[1]) / 2 - 55 }}>
            <div style={{ fontFamily: theme.text.family, fontSize: 100, fontWeight: 800, color: c.indigo, lineHeight: 1, textAlign: "center" }}>≠</div>
          </Appear>
          <Appear at={waveAt + m.sec(0.3)} style={{ left: 0, width: theme.canvas.width, top: 820 }}>
            <div style={{ textAlign: "center", fontFamily: theme.text.family, fontSize: 40, fontWeight: 800, color: c.ink }}>
              Kemampuan menghadapi <span style={{ color: c.indigo }}>naik-turunnya</span> investasi juga berbeda
            </div>
          </Appear>
        </div>
      ) : null}

      {/* C — the statement and one pile; on "pisahkan" it splits three ways */}
      <Appear at={splitAt + m.sec(0.2)} style={{ left: 0, width: theme.canvas.width, top: 190 }}>
        <Statement cx={CX} cy={0} text="Pisahkan dulu uangnya berdasarkan kebutuhan" mark="kebutuhan" size={60} maxWidth={1500} />
      </Appear>
      {f >= splitAt ? <Piles life={ease(f, splitAt + m.sec(0.2), m.reveal)} split={split} rules={split} /> : null}
    </Stage>
  );
};

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(3, BLOCK.SC03);
  const caraAt = W("cara");
  const walletAt = W("bayangkan");
  const morph = ease(f, caraAt, m.move);
  const nameAt = [W("uang aktif"), W("uang stabil"), W("uang jangka panjang")];
  const taskAt = W("tugas sendiri");
  const timeAt = W("waktu penggunaan");
  const line = ease(f, timeAt, m.sec(0.7));
  return (
    <Stage>
      <Ground from={BLOCK.SC03} />
      {/* SC02's statement, leaving as the cards form */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - ease(f, caraAt, m.fade) }}>
        <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: 180 }}>
          <Statement cx={CX} cy={0} text="Pisahkan dulu uangnya berdasarkan kebutuhan" mark="kebutuhan" size={60} maxWidth={1500} />
        </div>
      </div>
      <Appear at={W("tiga kelompok")} style={{ left: 0, width: theme.canvas.width, top: 120 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "12px 28px", borderRadius: 999, background: theme.color.indigoWash, fontFamily: theme.text.family, fontSize: 36, fontWeight: 700, letterSpacing: 2, color: c.indigo }}>Tiga kelompok uang</div>
        </div>
      </Appear>
      {/* the cards grow in around the piles */}
      {KINDS.map((k, i) => (
        <div key={`card-${k}`} style={{ position: "absolute", inset: 0, opacity: morph, transformOrigin: `${colX(i)}px ${CARD3.top + CARD3.h / 2}px`, transform: `scale(${(0.92 + 0.08 * morph).toFixed(4)})` }}>
          <Panel3 x={colX(i) - CARD3.w / 2} y={CARD3.top} w={CARD3.w} h={CARD3.h} style={{ borderTop: `10px solid ${ink(k)}` }} />
        </div>
      ))}
      {/* the three piles from SC02, rising into the cards, then each swallowed by its wallet */}
      <Piles life={1} split={1} rules={1 - morph} lift={(CARD3.wallet.cy + 10 - PILE.cy) * morph} shrink={morph} swallow={KINDS.map((_, i) => ease(f, walletAt + m.sec(0.12) * i + m.move * 0.6, m.sec(0.4)))} />
      {KINDS.map((k, i) => {
        const x = colX(i);
        const drop = ease(f, walletAt + m.sec(0.12) * i, m.move);
        const name = ease(f, nameAt[i], m.reveal);
        return (
          <React.Fragment key={k}>
            {drop > 0.001 ? <Wallet kind={k} cx={x} cy={CARD3.wallet.cy - (1 - drop) * 140} h={CARD3.wallet.h} style={{ opacity: drop }} /> : null}
            <div style={{ position: "absolute", left: x - CARD3.w / 2, width: CARD3.w, top: CARD3.name, opacity: name, transform: `translateY(${((1 - name) * 12).toFixed(2)}px)`, textAlign: "center", fontFamily: theme.text.family, fontSize: CARD3.label, fontWeight: 800, color: ink(k), lineHeight: 1.1 }}>{KIND[k].label}</div>
            {/* its job */}
            <Appear at={taskAt + m.sec(0.15) * i} style={{ left: x - CARD3.w / 2 + 30, width: CARD3.w - 60, top: CARD3.task }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, fontFamily: theme.text.family }}>
                <div style={{ flex: "none", marginTop: 0 }}>
                  <Ico name={TASKS[k].icon} size={40} />
                </div>
                {/* no "Tugas" label over each one — "minimalisir kata-kata berulang di area penjelasan atau poin" */}
                <div style={{ lineHeight: 1.2, fontSize: 32, fontWeight: 800, color: c.ink }}>{TASKS[k].text}</div>
              </div>
            </Appear>
            {/* its time, on the line under the cards */}
            <Appear at={timeAt + m.sec(0.3) + m.sec(0.18) * i} style={{ left: x - 160, width: 320, top: TIMELINE.y + 30 }}>
              <div style={{ textAlign: "center", fontFamily: theme.text.family, fontSize: 34, fontWeight: 800, color: ink(k) }}>{TASKS[k].time}</div>
            </Appear>
          </React.Fragment>
        );
      })}
      {/* the time line: near on the left, far on the right */}
      {line > 0.001 ? (
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <line x1={TIMELINE.x0} y1={TIMELINE.y} x2={TIMELINE.x0 + (TIMELINE.x1 - TIMELINE.x0) * line} y2={TIMELINE.y} stroke={c.ink} strokeWidth={4} strokeLinecap="round" />
          {line > 0.98 ? <path d={`M ${TIMELINE.x1 + 18} ${TIMELINE.y} L ${TIMELINE.x1 - 4} ${TIMELINE.y - 14} L ${TIMELINE.x1 - 4} ${TIMELINE.y + 14} Z`} fill={c.ink} /> : null}
          {KINDS.map((k, i) => {
            const p = ease(f, timeAt + m.sec(0.3) + m.sec(0.18) * i, m.reveal);
            return <circle key={k} cx={colX(i)} cy={TIMELINE.y} r={14 * p} fill={ink(k)} />;
          })}
        </svg>
      ) : null}
      <Appear at={timeAt + m.sec(0.6)} style={{ right: theme.canvas.width - TIMELINE.x1, top: TIMELINE.y - 52 }}>
        <div style={{ fontFamily: theme.text.family, fontSize: 28, fontWeight: 700, color: c.slate, whiteSpace: "nowrap" }}>Waktu penggunaan →</div>
      </Appear>
    </Stage>
  );
};

// ═══ SC04 — 01 Uang Aktif: what it is, what it pays for, the rule ═══════
const MAP4 = { cy: 500, hub: 220, pill: 400, pillMin: 300, row: 200, small: 0.8, lift: -60 };
/** Where a need's connector ends: the pill's inner edge, which stays put while the pill grows outward. */
const innerX = (n: { x: number }) => n.x + (n.x < CX ? 1 : -1) * (MAP4.pill / 2);
const NEEDS: { label: string; icon: string; word: string; x: number; y: number }[] = [
  { label: "Makan", icon: "ph-fork-knife-duotone", word: "makan", x: CX - 470, y: 330 },
  { label: "Bayar kos / cicilan", icon: "ph-house-line-duotone", word: "bayar kos", x: CX + 470, y: 330 },
  { label: "Transportasi", icon: "ph-bus-duotone", word: "transportasi", x: CX - 470, y: 680 },
  { label: "Pengeluaran mendadak", icon: "ph-siren-duotone", word: "pengeluaran mendadak", x: CX + 470, y: 680 },
];

export const SC04 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(4, BLOCK.SC04);
  const growAt = W("uang aktif");
  const mapAt = W("misalnya");
  const ruleAt = W("prinsipnya");
  const grow = ease(f, growAt, m.move);
  const toMap = ease(f, mapAt, m.move);
  const aside = ease(f, ruleAt, m.move);
  /* the green wallet: in the row → big in the middle → the map's hub */
  const wy = 200 + (430 - 200) * grow + (MAP4.cy - 430) * toMap;
  const wh = 90 + (300 - 90) * grow + (MAP4.hub - 300) * toMap;
  /* C: the map shrinks a little and rises, the rule's box comes in under it */
  const groupY = MAP4.lift * aside;
  const groupK = 1 - (1 - MAP4.small) * aside;
  /* Uang Aktif starts in its place in the row, left of the other two */
  const wx = CX - MAP4.row * (1 - grow);
  return (
    <Stage>
      <Ground from={BLOCK.SC04} />
      <Tag x={theme.margin.left} y={110} text="01 — Uang Aktif" tint={theme.color.walletAktifWash} color={theme.color.walletAktif} />
      {/* the three wallets in a row; the other two step back as Uang Aktif comes forward */}
      {KINDS.map((k, i) =>
        k === "aktif" ? null : (
          <Wallet key={k} kind={k} cx={CX + (i - 1) * MAP4.row} cy={200} h={90} style={{ opacity: 0.35 * (1 - grow) }} />
        ),
      )}
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${CX}px ${MAP4.cy}px`, transform: `translateY(${groupY.toFixed(1)}px) scale(${groupK.toFixed(4)})` }}>
        {/* B — the needs it pays for, branching off it */}
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {NEEDS.map((n) => {
            const p = ease(f, W(n.word) - m.sec(0.15), m.sec(0.35));
            if (p <= 0.001) return null;
            const ex = innerX(n);
            return <path key={n.label} d={`M ${CX} ${MAP4.cy} C ${CX} ${n.y}, ${(CX + ex) / 2} ${n.y}, ${ex} ${n.y}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke={theme.color.walletAktif} strokeWidth={4} strokeLinecap="round" />;
          })}
        </svg>
        {NEEDS.map((n) => (
          <Appear key={n.label} at={W(n.word)} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
            <Pill cx={innerX(n)} cy={n.y} w={MAP4.pillMin} anchor={n.x < CX ? "right" : "left"} icon={n.icon} label={n.label} tint={theme.color.walletAktifWash} />
          </Appear>
        ))}
        <Wallet kind="aktif" cx={wx} cy={wy} h={wh} />
        {/* C — its check, once "harus tersedia" is said */}
        <Appear at={W("tersedia")} style={{ left: CX + MAP4.hub * 0.35, top: MAP4.cy - MAP4.hub * 0.55 }}>
          <div style={{ width: 84, height: 84, borderRadius: 999, background: c.cardBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico name="check-aktif" size={76} />
          </div>
        </Appear>
      </div>
      {/* A — what uang aktif is */}
      <Appear at={W("ini adalah uang")} out={mapAt} style={{ left: 0, width: theme.canvas.width, top: 0 }}>
        <Statement cx={CX} cy={720} text="Uang yang sewaktu-waktu bisa kita butuhkan" mark="sewaktu-waktu" markInk={theme.color.walletAktif} size={56} maxWidth={1400} />
      </Appear>
      {/* C — the rule, in the dashed box */}
      <TypeBox cx={CX} y={700} w={1000} h={140} at={ruleAt + m.sec(0.2)} text="Saat dibutuhkan, uangnya harus tersedia" mark="harus tersedia" markAt={W("harus tersedia")} size={40} italic={false} fadeIn markInk={theme.color.walletAktif} markWash={theme.color.walletAktifWash} />
    </Stage>
  );
};
