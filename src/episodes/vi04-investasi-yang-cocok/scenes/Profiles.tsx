/**
 * VI04 · SC06 — "Gabungkan Dua Jawaban", rebuilt whole (Simon, 22 Oct 2026: "revisi total scene 06" — new script,
 * new VO "Revisi Scene 6.mp3", the four investor types from the app). From the ChatGPT storyboard
 * docs/vi-style/storyboards/VI04-SC06-v2.jpg, in Benchmark v1 (STYLE.md §0): neutral colours for the obvious things,
 * the brand only on hairlines and a few words; minimalist, wide gaps, normal-weight type.
 *
 *  A  "gabungkan dua jawaban tadi": the two answers — Toleransi (how big a wave you can take) and Kemampuan (how
 *     ready you are to steer) — and a connector from each meets in one point.
 *  B  "empat jalur yang berbeda": from that point four connectors branch to four numbered nodes, climbing like steps.
 *  C–F the four types. The steps fold up into a stepper at the top; the phone shows that type's screen from the app
 *     (the top of Simon's PDFs); at the right, the main investment and the next one, linked. The four form a LADDER —
 *     each type's next step is the next type's main investment — so the cards scroll up one slot per type: the
 *     card that was "next" becomes "main".
 *  G  "prinsipnya tetap sama": one allocation bar — most of it where you fit now, a small part to learn the next step.
 *  H  "nggak perlu membawa seluruh uang ke satu kendaraan yang sama": the line, and two vehicles carrying unequal loads.
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, ease, Sketch, useWords } from "../components/kit";
import { PhoneScreens } from "../components/PhoneScreens";

const CX = theme.canvas.width / 2;
const ICON = (n: string) => `art/vi04/ic-${n}.png`;

// A — the two answers and where they meet
// just the two names (Simon, 22 Oct: the "seberapa …" lines removed)
const ANS = { w: 480, h: 140, y: 240, xs: [600, 1320] };
const MEET = { x: CX, y: 520 };
const ANSWERS = [
  { icon: "waves", title: "Toleransi", at: "seberapa besar ombak" },
  { icon: "wheel", title: "Kemampuan", at: "seberapa siap" },
];

// B → C–F — four nodes: as steps, then as the stepper at the top
const STEPS = [
  { x: 560, y: 870 },
  { x: 830, y: 800 },
  { x: 1100, y: 730 },
  { x: 1370, y: 660 },
];
const STEPPER = { y: 150, x0: 810, gap: 100 };

// C–F — the four types
const TYPES = [
  { name: "Guardian Achiever", screen: "art/vi04/types/guardian-achiever-screen.jpg", start: "Kalau kamu belum siap memilih investasi", nameAt: "Guardian Achiever", next: "reksa dana indeks jadi pilihan", nextLabel: "Naik level" },
  { name: "Stable Architech", screen: "art/vi04/types/stable-architech-screen.jpg", start: "Kalau kamu belum siap memilih saham", nameAt: "Stable Architect", next: "reksa dana saham jadi pilihan", nextLabel: "Berikutnya" },
  { name: "Bold Leader", screen: "art/vi04/types/bold-leader-screen.jpg", start: "Kalau kamu ingin bergerak", nameAt: "Bold Leader", next: "saham individual", nextLabel: "Mulai dipelajari, porsi lebih kecil" },
  { name: "Strategic Master", screen: "art/vi04/types/strategic-master-screen.jpg", start: "Terakhir", nameAt: "Strategic Master", next: "sebagian dana tetap", nextLabel: "Cadangan" },
];
/** The ladder: item k is type k's main investment and type k−1's next one. */
const LADDER = [
  { icon: "stable", text: "Instrumen yang relatif stabil" },
  { icon: "index", text: "Reksa dana indeks" },
  { icon: "equity", text: "Reksa dana saham" },
  { icon: "stock", text: "Saham individual", asMain: "Saham" },
  { icon: "stable", text: "Instrumen yang relatif stabil" },
];
const PHONE = { cx: 560, y: 220, h: 720 };
const COL = { x: 900, w: 700 };
const CARD = { h: 132, slot: 230, top: 470 };

// G — the allocation bar
const BAR = { x: 360, w: 1200, y: 560, h: 64, big: 0.8 };

/** A white card with a neutral icon, a small label and its value. */
const ItemCard = ({ x, y, w, icon, label, text, labelInk, p = 1, line }: { x: number; y: number; w: number; icon: string; label: string; text: string; labelInk?: string; p?: number; line?: string }) => {
  const c = usePalette();
  const shadow = useShadow();
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: CARD.h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: line ? `${shadow.soft}, inset 0 0 0 2px ${line}` : shadow.soft, display: "flex", alignItems: "center", gap: 28, padding: "0 32px", boxSizing: "border-box", opacity: p }}>
      <Img src={staticFile(ICON(icon))} style={{ height: 84, width: 84, objectFit: "contain", maxWidth: "none", flex: "none" }} />
      <div>
        <div style={{ ...typeStyle("label"), fontWeight: 500, color: labelInk ?? c.slate }}>{label}</div>
        <div style={{ marginTop: 4, ...typeStyle("body"), color: c.ink }}>{text}</div>
      </div>
    </div>
  );
};

export const SC06 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(6, BLOCK.SC06);
  const g = f + BLOCK.SC06;

  const startAt = W("Sekarang gabungkan");
  const pathsAt = W("empat jalur");
  const typeAt = TYPES.map((t) => W(t.start));
  const nameAt = TYPES.map((t) => W(t.nameAt));
  const nextAt = TYPES.map((t) => W(t.next));
  const mainAt = W("Investasi utama bisa ditempatkan");
  const ruleAt = W("Jadi prinsipnya");
  const bigAt = W("sebagian besar dana");
  const smallAt = W("sebagian kecil");
  const lineAt = W("Kita nggak perlu");

  // A/B fade as the types begin; the nodes travel from the steps to the stepper (the same objects, no cut)
  const abOut = ease(f, typeAt[0], m.fade);
  const fold = ease(f, typeAt[0], m.move);
  const typesOut = ease(f, ruleAt, m.fade);
  const barOut = ease(f, lineAt, m.fade);
  /** Which type is current, 0..3, eased across each change — drives the stepper and the ladder's scroll. */
  const k = TYPES.reduce((acc, _, i) => (i === 0 ? 0 : acc + ease(f, typeAt[i], m.move)), 0);
  const active = Math.round(k);

  return (
    <Stage>
      <SoftGround f={g} />
      {/* the grid under the answers and paths, and the bar — not under the phone with the four types */}
      <BoardGrid g={g} on={1 - ease(f, typeAt[0], m.fade) + ease(f, ruleAt, m.reveal)} />

      {/* A — the two answers meet */}
      {abOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - abOut }}>
          {ANSWERS.map((a, i) => {
            const at = W(a.at);
            const x = ANS.xs[i] - ANS.w / 2;
            return (
              <div key={a.title}>
                <Appear at={i === 0 ? startAt : at} style={{ left: 0, top: 0 }}>
                  <div style={{ position: "absolute", left: x, top: ANS.y, width: ANS.w, height: ANS.h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", justifyContent: "center", gap: 26, padding: "0 30px", boxSizing: "border-box" }}>
                    <Img src={staticFile(ICON(a.icon))} style={{ height: 96, width: 96, objectFit: "contain", maxWidth: "none", flex: "none" }} />
                    <div>
                      <div style={{ ...typeStyle("title"), fontSize: 44, color: c.ink }}>{a.title}</div>
                    </div>
                  </div>
                </Appear>
                <Connector a={{ x: ANS.xs[i], y: ANS.y + ANS.h }} b={MEET} p={ease(f, W("dan seberapa siap") + m.sec(0.2 * i), m.sec(0.7))} shape="curve" axis="y" />
              </div>
            );
          })}
          {/* B — four paths branch from where they met */}
          {STEPS.map((s, i) => (
            <Connector key={i} a={MEET} b={{ x: s.x, y: s.y - 34 }} p={ease(f, pathsAt + m.sec(0.12 * i), m.sec(0.6))} shape="curve" axis="y" dot={i === 0} />
          ))}
        </div>
      ) : null}

      {/* the four nodes: steps (B), then the stepper (C–F) */}
      {typesOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - typesOut }}>
          {fold > 0.001 ? (
            <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, opacity: fold }}>
              <line x1={STEPPER.x0} y1={STEPPER.y} x2={STEPPER.x0 + 3 * STEPPER.gap} y2={STEPPER.y} stroke={theme.color.hairlineBrand} strokeWidth={2} />
            </svg>
          ) : null}
          {STEPS.map((s, i) => {
            const born = ease(f, pathsAt + m.sec(0.12 * i) + m.sec(0.45), m.reveal);
            if (born <= 0.001) return null;
            const x = s.x + (STEPPER.x0 + i * STEPPER.gap - s.x) * fold;
            const y = s.y + (STEPPER.y - s.y) * fold;
            const r = 34 - 12 * fold;
            const on = fold > 0.5 && i === active;
            const done = fold > 0.5 && i < active;
            return (
              <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: 999, background: on ? c.ink : c.cardBg, boxShadow: `inset 0 0 0 2px ${on || done ? c.ink : theme.color.hairlineBrand}, ${shadow.soft}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("label"), fontSize: 30 - 8 * fold, fontWeight: 600, color: on ? c.cardBg : c.ink, opacity: born, transform: `scale(${(0.7 + 0.3 * born).toFixed(3)})` }}>
                {i + 1}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* C–F — the types: phone, name, the ladder */}
      {f >= typeAt[0] && typesOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: (1 - typesOut) * ease(f, typeAt[0], m.reveal) }}>
          <PhoneScreens cx={PHONE.cx} y={PHONE.y} h={PHONE.h} screens={TYPES.map((t, i) => ({ src: t.screen, at: typeAt[i] }))} />
          {TYPES.map((t, i) => {
            const p = ease(f, nameAt[i], m.reveal) * (i < 3 ? 1 - ease(f, typeAt[i + 1], m.fade) : 1);
            if (p <= 0.001) return null;
            return (
              <div key={t.name} style={{ position: "absolute", left: COL.x, top: 270, opacity: p, transform: `translateY(${((1 - ease(f, nameAt[i], m.reveal)) * 14).toFixed(2)}px)` }}>
                <div style={{ ...typeStyle("label"), color: c.slate }}>Tipe {i + 1}</div>
                <div style={{ marginTop: 4, ...typeStyle("statement"), fontSize: 64, color: c.ink }}>{t.name}</div>
              </div>
            );
          })}
          {/* the ladder: two slots visible — the main investment, and below it the next one */}
          {LADDER.map((item, j) => {
            const slot = j - k; // 0 = main, 1 = next
            if (slot < -0.999 || slot > 1.999) return null;
            // a card leaving the top moves only half a slot and is gone by then, so it never crosses the type name
            const y = CARD.top + (slot < 0 ? slot * 0.5 : slot) * CARD.slot;
            const isMain = slot < 0.5;
            const typeIdx = Math.min(3, Math.max(0, j - (isMain ? 0 : 1)));
            const born = j === 0 ? ease(f, mainAt, m.reveal) : ease(f, nextAt[j - 1], m.reveal);
            const fadeUp = slot < 0 ? Math.max(0, 1 + 2 * slot) : 1;
            const label = isMain ? "Investasi utama" : TYPES[typeIdx].nextLabel;
            const text = isMain && item.asMain ? item.asMain : item.text;
            return <ItemCard key={j} x={COL.x} y={y} w={COL.w} icon={item.icon} label={label} text={text} p={born * fadeUp} line={isMain ? theme.color.hairlineBrand : undefined} />;
          })}
          {/* main → next */}
          <Connector a={{ x: COL.x + 70, y: CARD.top + CARD.h }} b={{ x: COL.x + 70, y: CARD.top + CARD.slot }} p={ease(f, nextAt[Math.min(3, active)] - m.sec(0.1), m.sec(0.5)) * (1 - Math.abs(k - active) * 2)} shape="curve" axis="y" />
        </div>
      ) : null}

      {/* G — the principle: most of it where you fit now, a little to learn the next step */}
      {f >= ruleAt && barOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: (1 - barOut) * ease(f, ruleAt + m.sec(0.2), m.reveal) }}>
          <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: 250, textAlign: "center", ...typeStyle("title"), fontWeight: 700, color: c.indigo }}>Prinsip</div>
          <div style={{ position: "absolute", left: BAR.x, top: BAR.y, width: BAR.w, height: BAR.h, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrand}` }} />
          <div style={{ position: "absolute", left: BAR.x, top: BAR.y, width: BAR.w * BAR.big * ease(f, bigAt, m.sec(0.9)), height: BAR.h, borderRadius: 999, background: theme.color.neutralDotOn }} />
          <div style={{ position: "absolute", left: BAR.x, top: BAR.y - 150, width: BAR.w * BAR.big, opacity: ease(f, bigAt, m.reveal) }}>
            <div style={{ ...typeStyle("label"), color: c.slate }}>Sebagian besar</div>
            <div style={{ marginTop: 4, ...typeStyle("body"), color: c.ink }}>Yang paling sesuai dengan kemampuan sekarang</div>
          </div>
          <div style={{ position: "absolute", left: BAR.x + BAR.w * BAR.big + 24, top: BAR.y + BAR.h + 34, width: BAR.w * (1 - BAR.big) + 120, opacity: ease(f, smallAt, m.reveal) }}>
            <div style={{ ...typeStyle("label"), color: c.indigo }}>Sebagian kecil</div>
            <div style={{ marginTop: 4, ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>Digunakan untuk belajar</div>
          </div>
          <div style={{ position: "absolute", left: BAR.x + BAR.w * BAR.big + 10, top: BAR.y + 12, width: BAR.w * (1 - BAR.big) - 22, height: BAR.h - 24, borderRadius: 999, background: theme.color.indigoWash, opacity: ease(f, smallAt, m.reveal) }} />
        </div>
      ) : null}

      {/* H — not all of it in one vehicle */}
      <Appear at={lineAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <div style={{ position: "absolute", left: 200, width: theme.canvas.width - 400, top: 220, textAlign: "center", ...typeStyle("statement"), fontSize: 64, color: c.ink }}>
          Kita nggak perlu membawa seluruh uang ke <span style={{ color: c.indigo }}>satu kendaraan</span> yang sama.
        </div>
        <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: 520, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 220 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: ease(f, lineAt + m.sec(0.4), m.reveal) }}>
            <Sketch name="ferry" h={220} neutral />
            <div style={{ ...typeStyle("label"), color: c.slate }}>Sebagian besar</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: ease(f, lineAt + m.sec(0.7), m.reveal) }}>
            <Sketch name="plane" h={130} neutral />
            <div style={{ ...typeStyle("label"), color: c.indigo }}>Sebagian kecil</div>
          </div>
        </div>
      </Appear>
    </Stage>
  );
};
