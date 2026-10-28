/**
 * VI07 · SC01 — "Saat Semua Orang Bilang, Cepat Jual", from the ChatGPT storyboard docs/vi-style/storyboards/VI07-SC01.jpg.
 *
 * One phone carries the first half, its screen changing with the VO: the lock screen (13.43, IHSG −8%, trading halt) →
 * the watchlist flooding red → the group's three voice notes → the sell page, a finger over "Jual". On "Tapi sebelum
 * menekannya" it freezes and blurs back behind the scene's one line, "Apa yang perlu kamu lihat?", which docks top left
 * and stays as the heading. The second half is a board: the previous video (a player, watched) and its 3 mistakes → the four situations they show
 * up in → the three steps Tuntun helps with.
 *
 * Text kept to what earns its place (STYLE.md §0.10): the time and the two numbers, "Jual", the question, four short
 * situation labels, three one-word steps. Everything else is skeleton lines, icons and motion.
 */
import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, TuntunMark, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Ico, NumRing, SITUATION, Skel, Typed, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// ── the phone ──────────────────────────────────────────────────────────────────────────────────────────────────────
const PHONE = { w: 390, h: 780, y: 96, r: 56, bezel: 12 };
const SCREEN = { w: PHONE.w - 2 * PHONE.bezel, h: PHONE.h - 2 * PHONE.bezel, r: PHONE.r - PHONE.bezel };
/** The screen's top-left on the canvas. */
const SX = CX - PHONE.w / 2 + PHONE.bezel;
const SY = PHONE.y + PHONE.bezel;
/** The sell button, in screen px. */
const BUTTON = { x: 20, y: SCREEN.h - 124, w: SCREEN.w - 40, h: 84 };
/** Where the finger hovers — over the button's right half, a little above its surface (canvas px). */
const HOVER = { x: SX + BUTTON.x + BUTTON.w * 0.66, y: SY + BUTTON.y + BUTTON.h / 2 };
const FINGER = 150;
/** The fingertip inside ph:hand-pointing (256 box): the index finger's top. */
const TIP = { x: (116 / 256) * FINGER, y: (16 / 256) * FINGER };

// ── the board ──────────────────────────────────────────────────────────────────────────────────────────────────────
const QC = { w: 1060, h: 200, x: CX - 530, y: 420 };
const DOCK = { x: 140, y: 96, s: 0.5 };
/**
 * "Di video sebelumnya" (Simon 28 Oct: a play icon and "3 kesalahan" alone don't say WHICH video — storyboard
 * VI07-SC01-video-sebelumnya.jpg): the previous video as a player, watched to the end, chip "Video sebelumnya" on top,
 * the current video smaller on its right; inside it the three mistakes, then "3 kesalahan".
 */
const VIDEO = { w: 600, h: 400, x: CX - 300, y: 330 };
const THUMB = { x: 20, y: 20, w: VIDEO.w - 40, h: 300 };
/** The player's bar: the previous-episode icon, then the progress track (filled — already watched). */
const BAR = { y: THUMB.y + THUMB.h + 40, icon: 34, x0: 82, x1: VIDEO.w - 28, h: 10 };
/** The current video, to the right — smaller, nothing watched yet; it steps aside before the connectors grow. */
const NOW = { w: 300, h: 210, x: VIDEO.x + VIDEO.w + 70, y: VIDEO.y + (VIDEO.h - 210) / 2 };
/** The three mistakes in the thumbnail: centred on arrival, then packed left for the arrow and "3 kesalahan". */
const MISTAKE = { h: 172, wide: { w: 136, gap: 30 }, packed: { w: 92, gap: 12, x: 22 } };
const TOTAL = { x: 384, w: 160, h: 196 };
const NODE = { w: 390, h: 116 };
const SITUATIONS = [
  { ...SITUATION[0], at: "panik", cx: CX - 600, cy: 300 },
  { ...SITUATION[1], at: "mengambil keputusan", cx: CX + 600, cy: 300 },
  { ...SITUATION[2], at: "mengejar", cx: CX - 600, cy: 740 },
  { ...SITUATION[3], at: "memperbesar", cx: CX + 600, cy: 740 },
];
const PATH = { y: 560, mascot: 330, disc: 150, xs: [760, 1140, 1520] };
const STEPS = [
  { label: "Berhenti", icon: "pause", at: "berhenti" },
  { label: "Periksa", icon: "magnifier", at: "memeriksa" },
  { label: "Putuskan", icon: "check", at: "mengambil keputusan" },
] as const;

const WIDE_X0 = (THUMB.w - (3 * MISTAKE.wide.w + 2 * MISTAKE.wide.gap)) / 2;
/** A mistake card's left edge at `pack` 0 (centred) → 1 (packed left). */
const mistakeX = (k: number, pack: number) => {
  const wide = WIDE_X0 + k * (MISTAKE.wide.w + MISTAKE.wide.gap);
  const packed = MISTAKE.packed.x + k * (MISTAKE.packed.w + MISTAKE.packed.gap);
  return wide + (packed - wide) * pack;
};
/** The arrow from the packed cards to "3 kesalahan". */
const ARROW = { x0: MISTAKE.packed.x + 3 * MISTAKE.packed.w + 2 * MISTAKE.packed.gap + 14, x1: TOTAL.x - 14 };

/** A lock-screen notification sliding down into place on `at`. */
const Notice = ({ y, at, children }: { y: number; at: number; children: React.ReactNode }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const p = ease(f, at, m.reveal);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 14, top: y - (1 - p) * 40, width: SCREEN.w - 28, height: 98, borderRadius: 24, background: c.cardBg, boxShadow: shadow.soft, opacity: p, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", boxSizing: "border-box" }}>
      {children}
    </div>
  );
};

/** Falling sparkline shapes for the watchlist rows — a shape, no figures. */
const SPARK = [
  [0, 4, 10, 9, 18, 6, 28, 15, 36, 12, 46, 21, 56, 19, 64, 27],
  [0, 6, 8, 5, 18, 12, 26, 10, 38, 18, 46, 16, 56, 24, 64, 26],
  [0, 3, 12, 10, 20, 8, 30, 16, 40, 14, 50, 22, 64, 28],
];
const sparkPts = (i: number) => {
  const a = SPARK[i % SPARK.length];
  const pts: string[] = [];
  for (let k = 0; k < a.length; k += 2) pts.push(`${a[k]},${a[k + 1]}`);
  return pts.join(" ");
};

/** A voice note's waveform — fixed bar heights (deterministic), `played` 0..1 of it in dark ink. */
const WAVE = [10, 18, 26, 14, 30, 22, 12, 28, 34, 20, 16, 30, 24, 12, 22, 32, 18, 26, 14, 20, 10, 16];
const VoiceNote = ({ y, at, played }: { y: number; at: number; played: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const p = ease(f, at, m.pop);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: y + (1 - p) * 24, width: SCREEN.w, height: 76, opacity: p }}>
      <div style={{ position: "absolute", left: 16, top: 30 }}>
        <Disc icon="user" size={44} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
      </div>
      <div style={{ position: "absolute", left: 70, top: 0, width: 280, height: 76, borderRadius: "8px 24px 24px 24px", background: c.cardBg, boxShadow: shadow.soft }}>
        <div style={{ position: "absolute", left: 14, top: 16 }}>
          <Disc icon="play" size={44} tone={theme.color.neutralDotOn} tint={theme.color.neutralDisc} />
        </div>
        {WAVE.map((h, i) => (
          <div key={i} style={{ position: "absolute", left: 72 + i * 8, top: 38 - h / 2, width: 4, height: h, borderRadius: 2, background: i / WAVE.length < played ? theme.color.neutralDotOn : theme.color.neutralDot }} />
        ))}
      </div>
    </div>
  );
};

export const SC01 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(1, BLOCK.SC01);
  const g = f + BLOCK.SC01;

  // ── beats ──
  const unlockAt = W("Layar");
  const chatAt = W("Di grup");
  const sellAt = W("Jempolmu");
  const freezeAt = W("Tapi");
  const askAt = W("pertanyaan");
  const boardAt = W("Di video");
  const fourAt = W("empat situasi");
  const pathAt = W("Sekarang");

  // the phone: in at the start, frozen and blurred on "Tapi", gone on "Di video"
  const inP = ease(f, 0, m.reveal);
  const freeze = ease(f, freezeAt, m.reveal);
  const leave = ease(f, boardAt, m.move);
  const phoneShow = inP * (1 - leave);

  // screen 1 → 2 → 3 → 4
  const unlock = ease(f, unlockAt, m.move);
  const toChat = ease(f, chatAt, m.move);
  const toSell = ease(f, sellAt, m.move);
  const ihsg = Math.round(8 * ease(f, W("turun"), W("persen", 0, "f1") - W("turun")));
  const flood = ease(f, W("merah"), m.reveal);

  // the finger: in on "sudah berada", over the button by "tombol"; it stops on "Tapi"
  const fingerIn = ease(f, W("sudah"), W("tombol") - W("sudah"));
  const tf = Math.min(f, freezeAt);
  const bob = 4 * Math.sin((tf / m.sec(1.1)) * Math.PI * 2) * fingerIn;
  const ringAt = W("Jual", 3);
  const ringT = ((Math.max(0, tf - ringAt) % m.sec(0.9)) / m.sec(0.9)) * (tf >= ringAt ? 1 : 0);

  // the question, then its dock
  const qShow = ease(f, askAt, m.reveal);
  const qGlow = ease(f, askAt + m.sec(0.3), m.reveal);
  const dock = ease(f, boardAt, m.move);

  // the board
  const grid = ease(f, boardAt, m.reveal);
  const mapOut = ease(f, pathAt, m.fade);

  // "Di video sebelumnya": the current video first, the previous one slides in from the left, already watched
  const nowP = ease(f, boardAt, m.reveal);
  const nowOut = ease(f, fourAt - m.sec(0.35), m.fade);
  const vidAt = W("sebelumnya") - m.sec(0.1);
  const vidP = ease(f, vidAt, m.move);
  const chipP = ease(f, vidAt + m.sec(0.25), m.reveal);
  const watched = 0.5 + 0.5 * ease(f, vidAt + m.sec(0.2), m.sec(0.8));
  // "tiga kesalahan": the three mistakes, one by one, then packed left beside "→ 3 kesalahan"
  const mistakeP = [0, 1, 2].map((k) => ease(f, W("tiga kesalahan") + k * m.sec(0.16), m.reveal));
  const playP = 1 - ease(f, W("tiga kesalahan") - m.sec(0.15), m.fade);
  const pack = ease(f, W("yang sering"), m.move);
  // the cards finish packing before "3 kesalahan" takes the room they left
  const totalP = ease(f, W("yang sering") + m.move, m.reveal);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={grid} />

      {/* ── the phone, its screens, and the finger ── */}
      {phoneShow > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: phoneShow, filter: freeze > 0.001 ? `blur(${(8 * freeze).toFixed(2)}px)` : undefined, transform: `translateY(${((1 - inP) * 60 + leave * 160).toFixed(2)}px) scale(${(1 - 0.04 * freeze).toFixed(4)})`, transformOrigin: `${CX}px ${PHONE.y + PHONE.h / 2}px` }}>
          <div style={{ position: "absolute", left: CX - PHONE.w / 2, top: PHONE.y, width: PHONE.w, height: PHONE.h, borderRadius: PHONE.r, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}` }}>
            <div style={{ position: "absolute", left: PHONE.bezel, top: PHONE.bezel, width: SCREEN.w, height: SCREEN.h, borderRadius: SCREEN.r, overflow: "hidden", background: c.bg }}>
              {/* 1 · the lock screen */}
              <div style={{ position: "absolute", inset: 0, opacity: 1 - unlock, transform: `translateY(${(-120 * unlock).toFixed(2)}px)` }}>
                <div style={{ position: "absolute", left: 0, top: 104, width: SCREEN.w, textAlign: "center", fontFamily: theme.text.family, fontSize: 100, fontWeight: 500, letterSpacing: -2, lineHeight: 1, color: c.ink, fontVariantNumeric: "tabular-nums" }}>13.43</div>
                <div style={{ position: "absolute", left: 0, top: 222, width: SCREEN.w, textAlign: "center", ...typeStyle("label"), fontSize: 24, color: c.slate }}>Rabu, 28 Januari 2026</div>
                <Notice y={316} at={W("IHSG")}>
                  <Disc icon="fall" size={52} tone={theme.color.alarmRed} tint={theme.color.alarmWashSolid} />
                  <div style={{ ...typeStyle("label"), fontWeight: 600, color: c.ink, flex: 1 }}>IHSG</div>
                  <div style={{ ...typeStyle("title"), fontSize: 38, color: theme.color.alarmRed, fontVariantNumeric: "tabular-nums" }}>−{ihsg}%</div>
                </Notice>
                <Notice y={428} at={W("dihentikan")}>
                  <Disc icon="pause" size={52} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
                  <div>
                    <div style={{ ...typeStyle("label"), fontWeight: 600, color: c.ink }}>Trading halt</div>
                    <div style={{ ...typeStyle("label"), fontSize: 24, color: c.slate, opacity: ease(f, W("30 menit"), m.reveal) }}>30 menit</div>
                  </div>
                </Notice>
              </div>

              {/* 2 · the watchlist, flooding red */}
              {unlock > 0.001 && toChat < 0.999 ? (
                <div style={{ position: "absolute", inset: 0, opacity: unlock * (1 - toChat), transform: `translate(${(-90 * toChat).toFixed(2)}px, ${((1 - unlock) * 60).toFixed(2)}px)` }}>
                  {/* the screen turning red: a solid ground under the rows (no transparent fills — Simon, 26 Oct) */}
                  <div style={{ position: "absolute", inset: 0, background: theme.color.alarmWashSolid, opacity: flood }} />
                  <Skel w={140} h={18} style={{ left: 24, top: 60 }} />
                  <Skel w={90} h={12} style={{ left: 24, top: 92 }} />
                  {Array.from({ length: 7 }, (_, i) => {
                    const p = ease(f, unlockAt + m.sec(0.15) + i * m.sec(0.1), m.pop);
                    const y = 136 + i * 86;
                    return (
                      <div key={i} style={{ position: "absolute", left: 0, top: y + (1 - p) * 16, width: SCREEN.w, height: 86, opacity: p }}>
                        <div style={{ position: "absolute", left: 22, top: 19, width: 48, height: 48, borderRadius: 999, background: theme.color.neutralDisc }} />
                        <Skel w={110 - (i % 3) * 14} h={14} style={{ left: 86, top: 26 }} />
                        <Skel w={64 + (i % 2) * 16} h={10} style={{ left: 86, top: 50 }} />
                        <svg width={64} height={30} style={{ position: "absolute", left: 206, top: 28, overflow: "visible" }}>
                          <polyline points={sparkPts(i)} fill="none" stroke={theme.color.alarmRed} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div style={{ position: "absolute", left: SCREEN.w - 86, top: 26, width: 64, height: 34, borderRadius: 17, background: interpolateColors(flood, [0, 1], [theme.color.alarmWashSolid, theme.color.alarmRed]), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: 16, color: interpolateColors(flood, [0, 1], [theme.color.alarmRed, c.cardBg]) }}>▼</div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* 3 · the group chat: three voice notes */}
              {toChat > 0.001 && toSell < 0.999 ? (
                <div style={{ position: "absolute", inset: 0, background: c.bg, opacity: 1 - toSell, transform: `translateX(${((1 - toChat) * SCREEN.w - 90 * toSell).toFixed(2)}px)` }}>
                  <div style={{ position: "absolute", left: 20, top: 52 }}>
                    <Disc icon="group" size={56} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
                  </div>
                  <Skel w={130} h={16} style={{ left: 92, top: 60 }} />
                  <Skel w={70} h={10} style={{ left: 92, top: 88 }} />
                  <div style={{ position: "absolute", left: 0, top: 132, width: SCREEN.w, height: 2, background: c.border }} />
                  {/* someone is recording… until the first note lands */}
                  {(() => {
                    const p = ease(f, W("temanmu"), m.pop) * (1 - ease(f, W("Cepat jual") - m.sec(0.2), m.fade));
                    if (p <= 0.001) return null;
                    return (
                      <div style={{ position: "absolute", left: 70, top: 168, width: 100, height: 52, borderRadius: "8px 24px 24px 24px", background: c.cardBg, boxShadow: shadow.soft, opacity: p, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        {[0, 1, 2].map((k) => (
                          <div key={k} style={{ width: 10, height: 10, borderRadius: 999, background: theme.color.neutralIcon, transform: `translateY(${(-5 * Math.max(0, Math.sin(((f - k * 6) / m.sec(0.6)) * Math.PI * 2))).toFixed(2)}px)` }} />
                        ))}
                      </div>
                    );
                  })()}
                  {[0, 1, 2].map((k) => {
                    const a = W("Cepat jual", k);
                    const b = W("Cepat jual", k, "f1");
                    return <VoiceNote key={k} y={160 + k * 100} at={a - m.sec(0.15)} played={ease(f, a, Math.max(1, b - a))} />;
                  })}
                </div>
              ) : null}

              {/* 4 · the sell page */}
              {toSell > 0.001 ? (
                <div style={{ position: "absolute", inset: 0, background: c.bg, transform: `translateX(${((1 - toSell) * SCREEN.w).toFixed(2)}px)` }}>
                  <Skel w={100} h={18} style={{ left: 24, top: 60 }} />
                  <Skel w={160} h={12} style={{ left: 24, top: 92 }} />
                  {(() => {
                    const draw = ease(f, sellAt + m.sec(0.3), m.sec(0.9));
                    const box = { x: 16, y: 150, w: SCREEN.w - 32, h: 250 };
                    const knots = [0.1, 0.16, 0.12, 0.3, 0.26, 0.44, 0.38, 0.58, 0.54, 0.74, 0.7, 0.9];
                    const pts = knots.map((v, i) => `${((i / (knots.length - 1)) * box.w).toFixed(1)},${(v * box.h).toFixed(1)}`);
                    return (
                      <svg width={box.w} height={box.h} style={{ position: "absolute", left: box.x, top: box.y, overflow: "visible" }}>
                        <clipPath id="vi07-sc01-fall">
                          <rect x={-6} y={-10} width={(box.w + 12) * draw} height={box.h + 20} />
                        </clipPath>
                        <g clipPath="url(#vi07-sc01-fall)">
                          <polygon points={`0,${box.h} ${pts.join(" ")} ${box.w},${box.h}`} fill={theme.color.alarmWashSolid} />
                          <polyline points={pts.join(" ")} fill="none" stroke={theme.color.alarmRed} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        {/* the pen-tip dot leading the line (Benchmark v2: Dalio's charts draw on behind a point) */}
                        {draw > 0.01 && draw < 0.999
                          ? (() => {
                              const t = Math.max(0, Math.min(1, ((box.w + 12) * draw - 6) / box.w)) * (knots.length - 1);
                              const k0 = Math.min(knots.length - 2, Math.floor(t));
                              const v = knots[k0] + (knots[k0 + 1] - knots[k0]) * (t - k0);
                              return <circle cx={(t / (knots.length - 1)) * box.w} cy={v * box.h} r={7} fill={c.cardBg} stroke={theme.color.alarmRed} strokeWidth={3} />;
                            })()
                          : null}
                      </svg>
                    );
                  })()}
                  <Skel w={120} h={14} style={{ left: 24, top: 440 }} />
                  <Skel w={80} h={14} style={{ left: SCREEN.w - 104, top: 440 }} />
                  <Skel w={150} h={14} style={{ left: 24, top: 480 }} />
                  <Skel w={60} h={14} style={{ left: SCREEN.w - 84, top: 480 }} />
                  <div style={{ position: "absolute", left: BUTTON.x, top: BUTTON.y, width: BUTTON.w, height: BUTTON.h, borderRadius: 24, background: theme.color.alarmRed, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 36, color: c.cardBg }}>Jual</div>
                </div>
              ) : null}
            </div>
            <div style={{ position: "absolute", left: PHONE.w / 2 - 44, top: PHONE.bezel + 10, width: 88, height: 22, borderRadius: 999, background: theme.color.neutralDotOn }} />
          </div>

          {/* the touch rings under the fingertip, then the finger */}
          {fingerIn > 0.001 && ringT > 0 ? (
            <div style={{ position: "absolute", left: HOVER.x - 70, top: HOVER.y - 70, width: 140, height: 140, borderRadius: 999, boxShadow: `inset 0 0 0 3px ${theme.color.neutralDotOn}`, opacity: (1 - ringT) * 0.55 * (1 - freeze), transform: `scale(${(0.3 + 0.7 * ringT).toFixed(3)})` }} />
          ) : null}
          {fingerIn > 0.001 ? (
            <div style={{ position: "absolute", left: HOVER.x - TIP.x + (1 - fingerIn) * 260, top: HOVER.y - TIP.y + 26 + (1 - fingerIn) * 300 + bob, opacity: fingerIn }}>
              <Ico name="finger" size={FINGER} tone={c.ink} fill={c.cardBg} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ── the question, then docked top left as the heading ── */}
      {qShow > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${QC.x}px ${QC.y}px`, transform: `translate(${((DOCK.x - QC.x) * dock).toFixed(2)}px, ${((DOCK.y - QC.y) * dock).toFixed(2)}px) scale(${(1 - (1 - DOCK.s) * dock).toFixed(4)})` }}>
          <Card x={QC.x} y={QC.y + (1 - qShow) * 18} w={QC.w} h={QC.h} line={theme.color.hairlineBrandSolid} style={{ opacity: qShow, display: "flex", alignItems: "center", gap: 34, padding: "0 52px", boxShadow: `${shadow.soft}, 0 0 ${(44 * qGlow).toFixed(1)}px ${(10 * qGlow).toFixed(1)}px ${theme.color.indigoGlow}` }}>
            <Disc icon="question" size={104} tone={c.indigo} tint={theme.color.indigoWashSolid} />
            <div style={{ fontFamily: theme.text.family, fontSize: 60, fontWeight: 500, letterSpacing: -0.5, color: c.ink }}>
              <Typed text="Apa yang perlu kamu lihat?" at={W("apa yang perlu")} mark="lihat" />
            </div>
          </Card>
        </div>
      ) : null}

      {/* ── the board: 3 mistakes → 4 situations ── */}
      {mapOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - mapOut }}>
          {SITUATIONS.map((s, i) => {
            const left = s.cx < CX;
            const grow = ease(f, fourAt + i * m.sec(0.08), m.sec(0.5));
            return (
              <Connector key={s.label} a={{ x: left ? VIDEO.x : VIDEO.x + VIDEO.w, y: VIDEO.y + VIDEO.h / 2 + (s.cy < 500 ? -40 : 40) }} b={{ x: s.cx + (left ? NODE.w / 2 : -NODE.w / 2), y: s.cy }} p={grow} shape="curve" />
            );
          })}
          {/* the current video, smaller, on the right — out of the way before the connectors grow */}
          {nowP * (1 - nowOut) > 0.001 ? (
            <Card x={NOW.x + 40 * nowOut} y={NOW.y} w={NOW.w} h={NOW.h} style={{ opacity: nowP * (1 - nowOut) }}>
              <div style={{ position: "absolute", left: 14, top: 14, width: NOW.w - 28, height: 140, borderRadius: 14, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Disc icon="play" size={64} tone={theme.color.neutralDot} tint={c.cardBg} />
              </div>
              <div style={{ position: "absolute", left: 18, top: 174, width: NOW.w - 36, height: 8, borderRadius: 4, background: theme.color.skeleton }} />
            </Card>
          ) : null}

          {/* the previous video: in from the left, watched to the end */}
          {vidP > 0.001 ? (
            <div style={{ position: "absolute", inset: 0, opacity: vidP, transform: `translateX(${(-(1 - vidP) * 260).toFixed(2)}px)` }}>
              <div style={{ position: "absolute", left: CX, top: VIDEO.y - 84 + (1 - chipP) * 10, transform: "translateX(-50%)", opacity: chipP, padding: "10px 26px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connector}`, ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>Video sebelumnya</div>
              <Card x={VIDEO.x} y={VIDEO.y} w={VIDEO.w} h={VIDEO.h}>
                <div style={{ position: "absolute", left: THUMB.x, top: THUMB.y, width: THUMB.w, height: THUMB.h, borderRadius: 20, background: theme.color.neutralDisc, overflow: "hidden" }}>
                  {playP > 0.001 ? (
                    <div style={{ position: "absolute", left: THUMB.w / 2 - 60, top: THUMB.h / 2 - 60, opacity: playP, transform: `scale(${(0.85 + 0.15 * playP).toFixed(3)})` }}>
                      <Disc icon="play" size={120} tone={theme.color.neutralIcon} tint={c.cardBg} />
                    </div>
                  ) : null}
                  {[0, 1, 2].map((k) => {
                    const p = mistakeP[k];
                    if (p <= 0.001) return null;
                    const x = mistakeX(k, pack);
                    const w = MISTAKE.wide.w + (MISTAKE.packed.w - MISTAKE.wide.w) * pack;
                    return (
                      <div key={k} style={{ position: "absolute", left: x, top: (THUMB.h - MISTAKE.h) / 2 + (1 - p) * 14, width: w, height: MISTAKE.h, borderRadius: 16, background: c.cardBg, boxShadow: shadow.soft, opacity: p, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22, gap: 14, boxSizing: "border-box" }}>
                        <NumRing n={k + 1} size={50} />
                        {[0.7, 0.55, 0.62].map((r, j) => (
                          <div key={j} style={{ width: w * r, height: 10, borderRadius: 5, background: theme.color.skeleton, marginTop: j === 0 ? 6 : 0 }} />
                        ))}
                      </div>
                    );
                  })}
                  {totalP > 0.001 ? (
                    <>
                      <svg style={{ position: "absolute", left: 0, top: 0 }} width={THUMB.w} height={THUMB.h}>
                        <path d={`M ${ARROW.x0} ${THUMB.h / 2} H ${ARROW.x0 + (ARROW.x1 - ARROW.x0) * totalP} M ${ARROW.x0 + (ARROW.x1 - ARROW.x0) * totalP - 10} ${THUMB.h / 2 - 10} L ${ARROW.x0 + (ARROW.x1 - ARROW.x0) * totalP} ${THUMB.h / 2} L ${ARROW.x0 + (ARROW.x1 - ARROW.x0) * totalP - 10} ${THUMB.h / 2 + 10}`} fill="none" stroke={theme.color.neutralIcon} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div style={{ position: "absolute", left: TOTAL.x, top: (THUMB.h - TOTAL.h) / 2 + (1 - totalP) * 14, width: TOTAL.w, height: TOTAL.h, borderRadius: 18, background: c.cardBg, boxShadow: shadow.soft, opacity: totalP, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ ...typeStyle("hero"), fontSize: 104, fontWeight: 600, lineHeight: 1, color: c.ink }}>3</div>
                        <div style={{ marginTop: 6, ...typeStyle("body"), fontSize: 28, color: c.slate }}>kesalahan</div>
                      </div>
                    </>
                  ) : null}
                </div>
                <div style={{ position: "absolute", left: 26, top: BAR.y - BAR.icon / 2 }}>
                  <Ico name="previous" size={BAR.icon} tone={c.ink} />
                </div>
                <div style={{ position: "absolute", left: BAR.x0, top: BAR.y - BAR.h / 2, width: BAR.x1 - BAR.x0, height: BAR.h, borderRadius: BAR.h / 2, background: theme.color.skeleton }} />
                <div style={{ position: "absolute", left: BAR.x0, top: BAR.y - BAR.h / 2, width: (BAR.x1 - BAR.x0) * watched, height: BAR.h, borderRadius: BAR.h / 2, background: c.indigo }} />
              </Card>
            </div>
          ) : null}
          {SITUATIONS.map((s, i) => {
            const slot = ease(f, fourAt + i * m.sec(0.08) + m.sec(0.35), m.pop);
            const fill = ease(f, W(s.at) - m.sec(0.1), m.reveal);
            if (slot <= 0.001) return null;
            return (
              <div key={s.label} style={{ position: "absolute", left: s.cx - NODE.w / 2, top: s.cy - NODE.h / 2, width: NODE.w, height: NODE.h, opacity: slot }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: theme.shape.cardRadius, border: `2px dashed ${theme.color.connectorMuteSolid}`, opacity: 1 - fill }} />
                <Card x={0} y={(1 - fill) * 12} w={NODE.w} h={NODE.h} style={{ opacity: fill, display: "flex", alignItems: "center", gap: 22, padding: "0 28px" }}>
                  <Disc icon={s.icon} size={66} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
                  <div style={{ ...typeStyle("body"), fontSize: 34, color: c.ink, whiteSpace: "nowrap" }}>{s.label}</div>
                </Card>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* ── Tuntun: berhenti → periksa → putuskan ── */}
      {/* the mascot arrives as soon as the map has gone ("kita akan melihat"), so the board is never empty */}
      <Appear at={W("kita akan melihat")} style={{ left: 0, top: 0 }}>
        <TuntunMark x={PATH.mascot} y={PATH.y - 66 + 3 * Math.sin((g / m.sec(1.6)) * Math.PI * 2)} height={132} />
      </Appear>
      {STEPS.map((s, i) => {
        const nth = s.at === "mengambil keputusan" ? 1 : 0;
        const at = W(s.at, nth);
        const from = i === 0 ? PATH.mascot + 80 : PATH.xs[i - 1] + PATH.disc / 2;
        const grow = ease(f, at - m.sec(0.45), m.sec(0.45));
        const p = ease(f, at, m.pop);
        const glow = i === 2 ? ease(f, W("jernih") - m.sec(0.2), m.reveal) : 0;
        return (
          <React.Fragment key={s.label}>
            <Connector a={{ x: from, y: PATH.y }} b={{ x: PATH.xs[i] - PATH.disc / 2, y: PATH.y }} p={grow} shape="curve" dot={i > 0} />
            {p > 0.001 ? (
              <div style={{ position: "absolute", left: PATH.xs[i] - PATH.disc / 2, top: PATH.y - PATH.disc / 2, width: PATH.disc, opacity: p, transform: `scale(${(0.9 + 0.1 * p).toFixed(3)})` }}>
                <div style={{ width: PATH.disc, height: PATH.disc, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connector}, 0 0 ${(48 * glow).toFixed(1)}px ${(12 * glow).toFixed(1)}px ${theme.color.indigoGlow}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ico name={s.icon} size={70} tone={c.indigo} />
                </div>
                <div style={{ marginTop: 26, width: PATH.disc, textAlign: "center", ...typeStyle("body"), fontSize: 34, color: c.ink, whiteSpace: "nowrap", display: "flex", justifyContent: "center" }}>{s.label}</div>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </Stage>
  );
};
