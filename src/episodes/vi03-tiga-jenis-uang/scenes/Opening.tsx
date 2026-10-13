/**
 * VI03 · SC01–SC04 — the opening and chapter 01 (Uang Aktif). Built from the ChatGPT storyboards
 * (docs/vi-style/storyboards/VI03-SC0x.jpg); every beat is a WORD of the VO (useWords → data/words.json).
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { GridGround, Stage, TuntunMark, theme, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, Art, Panel3, Tag, Cutout, Ico, KIND, OUTSIDE_RESERVES, Pill, Statement, TypeBox, Wallet, ease, ink, useWords, wash, type Kind } from "../components/kit";

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
const NOTE = { w: 620, h: 112, gap: 22, top: 250, icon: 52 };
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
        <Art src="art/vi03/coins.png" aspect={601 / 452} cx={CX + 460} cy={NOTE.top + 3 * (NOTE.h + NOTE.gap) - 40} h={230} />
      </Appear>

      {/* B — "Uang ini enaknya diinvestasikan ke mana?" with the products around it */}
      <Appear at={askAt} out={manAt} style={{ left: 0, top: 0, width: theme.canvas.width }}>
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
      <Appear at={keyAt - m.sec(0.2)} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Art src="art/vi03/calendar.png" aspect={568 / 505} cx={1240} cy={310} h={200} />
      </Appear>
      <Appear at={keyAt} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Statement cx={1240} cy={560} text="Uang ini, kapan akan saya pakai?" mark="kapan" size={76} maxWidth={900} />
      </Appear>

      {/* the mascot, over it all, from the first notification */}
      {/* beside the notifications in A, above the question in B */}
      <div style={{ opacity: ease(f, W("gaji"), m.reveal) * (1 - ease(f, manAt, m.fade)) }}>
        <TuntunMark x={CX + 470 + (CX - (CX + 470)) * ease(f, askAt, m.move)} y={230 + (180 - 230) * ease(f, askAt, m.move) + bob(g)} height={MASCOT_H} />
      </div>
    </Stage>
  );
};

// ═══ SC02 — next month ≠ five years; split the money first ══════════════
const LINE2 = { y: 720, x0: 240, x1: 1700 };
const ENV = [
  { x: 560, label: "Bulan depan", word: "bulan depan" },
  { x: 1360, label: "5 tahun lagi", word: "lima tahun lagi" },
];
/** Two schematic charts — up and down over a short window, and over a long one that has room to come back. Not data. */
const wave = (x0: number, w: number, y0: number, h: number, long: boolean, p: number) => {
  const pts: string[] = [];
  const n = 60;
  for (let i = 0; i <= n * p; i++) {
    const t = i / n;
    const y = long ? 0.55 - 0.18 * Math.sin(t * 7) - 0.32 * t + 0.08 * Math.sin(t * 19) : 0.45 - 0.12 * Math.sin(t * 9) + 0.35 * t;
    pts.push(`${i ? "L" : "M"} ${(x0 + t * w).toFixed(1)} ${(y0 + y * h).toFixed(1)}`);
  }
  return pts.join(" ");
};

export const SC02 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(2, BLOCK.SC02);
  const timeAt = W("waktu penggunaannya");
  const splitAt = W("jadi sebelum");
  const pisahAt = W("pisahkan");
  const clear = ease(f, splitAt, m.fade);
  const split = ease(f, pisahAt, m.move);
  const line = ease(f, 0, m.sec(0.6));
  return (
    <Stage>
      <Ground from={BLOCK.SC02} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - clear }}>
        {/* A — the time line, two envelopes on it, ≠ between them */}
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d={`M ${LINE2.x0} ${LINE2.y} L ${LINE2.x0 + (LINE2.x1 - LINE2.x0) * line} ${LINE2.y}`} stroke={c.ink} strokeWidth={4} strokeLinecap="round" />
          {line > 0.98 ? <path d={`M ${LINE2.x1 + 18} ${LINE2.y} L ${LINE2.x1 - 4} ${LINE2.y - 14} L ${LINE2.x1 - 4} ${LINE2.y + 14} Z`} fill={c.ink} /> : null}
          <circle cx={LINE2.x0} cy={LINE2.y} r={10} fill={c.ink} />
        </svg>
        <Tag x={LINE2.x0 - 70} y={LINE2.y + 30} text="Sekarang" tint={theme.color.indigoWash} />
        {ENV.map((e, i) => (
          <React.Fragment key={e.label}>
            <Appear at={W(e.word)} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
              <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
                <circle cx={e.x} cy={LINE2.y} r={12} fill={i === 0 ? theme.color.walletAktif : theme.color.walletPanjang} />
              </svg>
              <Art src="art/vi03/envelope.png" aspect={533 / 504} cx={e.x} cy={LINE2.y - 150} h={200} />
              <div style={{ position: "absolute", left: e.x - 200, width: 400, top: LINE2.y + 34, textAlign: "center", fontFamily: theme.text.family, fontSize: 36, fontWeight: 800, color: i === 0 ? theme.color.walletAktif : theme.color.walletPanjang }}>{e.label}</div>
            </Appear>
          </React.Fragment>
        ))}
        <Appear at={W("nggak seharusnya")} out={timeAt} style={{ left: CX - 70, top: LINE2.y - 230 }}>
          <div style={{ fontFamily: theme.text.family, fontSize: 150, fontWeight: 800, color: c.indigo, lineHeight: 1 }}>≠</div>
        </Appear>

        {/* B — over each envelope, a little up-and-down: a short window and a long one */}
        {ENV.map((e, i) => {
          const at = timeAt + m.sec(0.25) * i;
          const p = ease(f, at, m.sec(1.2));
          const life = ease(f, at, m.reveal);
          if (life <= 0.001) return null;
          return (
            <div key={`w-${e.label}`} style={{ position: "absolute", inset: 0, opacity: life }}>
              <Panel3 x={e.x - 230} y={150} w={460} h={230} />
              <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
                <path d={wave(e.x - 200, 400, 190, 160, i === 1, p)} fill="none" stroke={i === 0 ? theme.color.walletAktif : theme.color.walletPanjang} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ position: "absolute", left: e.x - 230, width: 460, top: 100, textAlign: "center", fontFamily: theme.text.family, fontSize: 30, fontWeight: 700, color: c.slate }}>{i === 0 ? "Waktunya singkat" : "Waktunya panjang"}</div>
            </div>
          );
        })}
        <Appear at={W("kemampuan")} style={{ left: 0, width: theme.canvas.width, top: LINE2.y + 110 }}>
          <div style={{ textAlign: "center", fontFamily: theme.text.family, fontSize: 40, fontWeight: 800, color: c.ink }}>
            Daya tahan menghadapi <span style={{ color: c.indigo }}>naik-turun</span> juga berbeda
          </div>
        </Appear>
      </div>

      {/* C — one pile of coins, split three ways by what it is for */}
      <Appear at={splitAt + m.sec(0.2)} style={{ left: 0, width: theme.canvas.width, top: 190 }}>
        <Statement cx={CX} cy={0} text="Pisahkan dulu berdasarkan kebutuhan" mark="kebutuhan" size={60} maxWidth={1500} />
      </Appear>
      {f >= splitAt
        ? [0, 1, 2].map((i) => {
            const x = CX + (i - 1) * 420 * split;
            const life = ease(f, splitAt + m.sec(0.2), m.reveal);
            return (
              <div key={i} style={{ position: "absolute", inset: 0, opacity: life }}>
                {split > 0.02 ? <div style={{ position: "absolute", left: x - 150, top: 640, width: 300, height: 36, borderRadius: 999, background: wash(KINDS[i]), opacity: split }} /> : null}
                <Art src="art/vi03/coins.png" aspect={601 / 452} cx={x} cy={520} h={260 - 70 * split} />
              </div>
            );
          })
        : null}
      {split > 0.5 ? (
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, opacity: (split - 0.5) * 2 }}>
          {[CX - 210, CX + 210].map((x) => (
            <line key={x} x1={x} y1={350} x2={x} y2={720} stroke={c.muted} strokeWidth={4} strokeDasharray="14 12" strokeLinecap="round" />
          ))}
        </svg>
      ) : null}
    </Stage>
  );
};

// ═══ SC03 — three groups, three wallets ═════════════════════════════════
const COL3 = { w: 460, top: 300, h: 540, gap: 50, label: 38 };
const colX = (i: number) => CX + (i - 1) * (COL3.w + COL3.gap);

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(3, BLOCK.SC03);
  const g = f + BLOCK.SC03;
  const walletAt = W("bayangkan");
  const tasksAt = W("setiap dompet");
  const wordAt = [W("uang aktif"), W("uang stabil"), W("uang jangka panjang")];
  const glide = ease(f, tasksAt, W("berbeda", 0, "f1") - tasksAt);
  const mascotX = colX(0) + (colX(2) - colX(0)) * glide;
  return (
    <Stage>
      <Ground from={BLOCK.SC03} />
      <Appear at={W("tiga kelompok")} out={walletAt} style={{ left: 0, width: theme.canvas.width, top: 170 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "12px 28px", borderRadius: 999, background: theme.color.indigoWash, fontFamily: theme.text.family, fontSize: 36, fontWeight: 700, letterSpacing: 2, color: c.indigo }}>Tiga kelompok uang</div>
        </div>
      </Appear>
      {KINDS.map((k, i) => {
        const p = ease(f, wordAt[i], m.reveal);
        if (p <= 0.001) return null;
        const wal = ease(f, walletAt + m.sec(0.1) * i, m.reveal);
        const x = colX(i);
        return (
          <div key={k} style={{ position: "absolute", inset: 0, opacity: p, transform: `translateY(${((1 - p) * 20).toFixed(2)}px)` }}>
            <Panel3 x={x - COL3.w / 2} y={COL3.top} w={COL3.w} h={COL3.h} style={{ borderTop: `10px solid ${ink(k)}` }} />
            {/* before "bayangkan": a coin icon; after it, the wallet */}
            <div style={{ position: "absolute", left: x - 60, top: COL3.top + 90, opacity: 1 - wal }}>
              <div style={{ width: 120, height: 120, borderRadius: 999, background: wash(k), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico name="ph-coins-duotone" size={72} />
              </div>
            </div>
            <Wallet kind={k} cx={x} cy={COL3.top + 150} h={210} style={{ opacity: wal, transform: `scale(${(0.85 + 0.15 * wal).toFixed(3)})` }} />
            <div style={{ position: "absolute", left: x - COL3.w / 2, width: COL3.w, top: COL3.top + 280, textAlign: "center", fontFamily: theme.text.family, fontSize: COL3.label, fontWeight: 800, color: ink(k), lineHeight: 1.1 }}>{KIND[k].label}</div>
            {/* C — its job and its time */}
            {[
              { at: W("tugas sendiri"), icon: k === "aktif" ? "check-aktif" : "check-indigo", text: "Punya tugas" },
              { at: W("waktu penggunaan"), icon: k === "aktif" ? "clock-aktif" : k === "stabil" ? "clock-stabil" : "ph-clock-duotone", text: "Punya waktu pakai" },
            ].map((row, r) => (
              <Appear key={row.text} at={row.at + m.sec(0.08) * i} style={{ left: x - COL3.w / 2 + 40, top: COL3.top + 370 + r * 70 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: theme.text.family, fontSize: 30, fontWeight: 700, color: c.ink }}>
                  <Ico name={row.icon} size={40} />
                  {row.text}
                </div>
              </Appear>
            ))}
          </div>
        );
      })}
      {/* the mascot: over the middle wallet on "bayangkan", then along the three as each one's job is named */}
      <div style={{ opacity: ease(f, walletAt, m.reveal) }}>
        <TuntunMark x={tasksAt <= f ? mascotX : CX} y={COL3.top - MASCOT_H - 30 + bob(g)} height={MASCOT_H} />
      </div>
    </Stage>
  );
};

// ═══ SC04 — 01 Uang Aktif: what it is, what it pays for, the rule ═══════
const MAP4 = { cy: 500, hub: 220, pill: 400, row: 200, small: 0.8, lift: -60 };
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
            const ex = n.x + (n.x < CX ? 1 : -1) * (MAP4.pill / 2);
            return <path key={n.label} d={`M ${CX} ${MAP4.cy} C ${CX} ${n.y}, ${(CX + ex) / 2} ${n.y}, ${ex} ${n.y}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke={theme.color.walletAktif} strokeWidth={4} strokeLinecap="round" />;
          })}
        </svg>
        {NEEDS.map((n) => (
          <Appear key={n.label} at={W(n.word)} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
            <Pill cx={n.x} cy={n.y} w={MAP4.pill} icon={n.icon} label={n.label} tint={theme.color.walletAktifWash} />
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
      <TypeBox cx={CX} y={700} w={1000} h={140} at={ruleAt + m.sec(0.2)} text="Saat dibutuhkan, uangnya harus tersedia" mark="harus tersedia" markAt={W("harus tersedia")} size={40} italic={false} fadeIn />
    </Stage>
  );
};
