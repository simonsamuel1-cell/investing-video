/**
 * VI03 · SC05–SC06 — chapter 01, Uang Aktif, continued: where it lives, what it is for, the emergency fund.
 * Storyboards: docs/vi-style/storyboards/VI03-SC05.jpg, VI03-SC06.jpg. Every beat is a WORD of the VO.
 * Lessons applied from Simon's notes on SC01–04: every sentence moves something; no repeated words in
 * points; the mascot doesn't wander (it isn't here at all); pills size to their text.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { Stage, theme, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, Arrow, Art, Badge, Coin, Ground, Ico, ORANG_TUNTUN_RIGHT, OrangTuntun, Panel3, Statement, Tag, Wallet, along, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const GREEN = theme.color.walletAktif;
const GREEN_WASH = theme.color.walletAktifWash;

/** A destination card: an illustration or icon at the left, its name, and a tag under it. */
const Place = ({ x, y, w, h, art, icon, title, tag, tagIcon, titleOn, tagOn }: { x: number; y: number; w: number; h: number; art?: { src: string; aspect: number }; icon?: string; title: string; tag: string; tagIcon: string; titleOn: number; tagOn: number }) => {
  const c = usePalette();
  return (
    <Panel3 x={x} y={y} w={w} h={h} style={{ display: "flex", alignItems: "center", gap: 28, padding: "0 36px" }}>
      <div style={{ width: h - 50, height: h - 50, flex: "none", position: "relative" }}>
        {art ? <Art src={art.src} aspect={art.aspect} cx={(h - 50) / 2} cy={(h - 50) / 2} h={h - 50} /> : null}
        {icon ? (
          <div style={{ width: "100%", height: "100%", borderRadius: 999, background: GREEN_WASH, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico name={icon} size={(h - 50) * 0.6} />
          </div>
        ) : null}
      </div>
      <div style={{ fontFamily: theme.text.family, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: c.ink, lineHeight: 1.1, whiteSpace: "nowrap", opacity: titleOn, transform: `translateY(${((1 - titleOn) * 10).toFixed(1)}px)` }}>{title}</div>
        <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 10, padding: "8px 18px 8px 12px", borderRadius: 999, background: GREEN_WASH, fontSize: 28, fontWeight: 700, color: GREEN, opacity: tagOn, transform: `translateY(${((1 - tagOn) * 10).toFixed(1)}px)`, whiteSpace: "nowrap" }}>
          <Ico name={tagIcon} size={30} />
          {tag}
        </div>
      </div>
    </Panel3>
  );
};

// ═══ SC05 — where uang aktif lives; liquidity and stability first ═══════
const WAL5 = { x: 430, y: 540, h: 270 };
const CARD5 = { x: 1010, w: 770, h: 200, y: [230, 560] };
const CARDS5_ROW = { y: 330, w: 440, h: 330, gap: 70, icon: 150 };

export const SC05 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(5, BLOCK.SC05);
  const placeAt = W("ditempatkan");
  const mudahAt = W("mudah dicairkan");
  const bankAt = W("rekening bank");
  const sebagianAt = W("sebagian");
  const belumAt = W("belum akan dipakai");
  const likuidAt = W("likuiditas tinggi");
  const rdpuAt = W("reksa dana pasar uang");
  const fokusAt = W("fokus utamanya");
  const out = ease(f, fokusAt, m.move);
  /* the wallet holds the middle on "uang aktif", then steps left as its money is placed */
  const walX = CX + (WAL5.x - CX) * ease(f, placeAt - m.sec(0.5), m.move);
  const a1 = { x: walX + 150, y: WAL5.y - 70 };
  const b1 = { x: CARD5.x - 14, y: CARD5.y[0] + CARD5.h / 2 };
  const a2 = { x: walX + 150, y: WAL5.y + 40 };
  const b2 = { x: CARD5.x - 14, y: CARD5.y[1] + CARD5.h / 2 };
  /* coins along each arrow, one after another */
  const coins = (from: { x: number; y: number }, to: { x: number; y: number }, at: number, n: number, bend: number) =>
    Array.from({ length: n }, (_, i) => {
      const t = ease(f, at + m.sec(0.22) * i, m.sec(0.7));
      if (t <= 0.001 || t >= 0.999) return null;
      const p = along(from, to, t, bend);
      return <Coin key={i} x={p.x} y={p.y} opacity={Math.min(1, (1 - t) * 6)} />;
    });
  /* C — the three priorities */
  const ret = ease(f, W("return"), m.reveal);
  const strike = ease(f, W("tapi likuiditas"), m.sec(0.35));
  const liq = ease(f, W("tapi likuiditas") + m.sec(0.15), m.reveal);
  const stab = ease(f, W("stabilitas"), m.reveal);
  const rowX = (i: number) => CX + (i - 1) * (CARDS5_ROW.w + CARDS5_ROW.gap);
  return (
    <Stage>
      <Ground from={BLOCK.SC05} />
      <Tag x={theme.margin.left} y={110} text="01 — Uang Aktif" tint={GREEN_WASH} color={GREEN} />

      {/* A, B — the wallet, and the two places its money goes */}
      {out < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateX(${(-80 * out).toFixed(1)}px)` }}>
          <Appear at={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
            <Wallet kind="aktif" cx={walX} cy={WAL5.y} h={WAL5.h} />
            <div style={{ position: "absolute", left: walX - 200, width: 400, top: WAL5.y + WAL5.h / 2 + 10, textAlign: "center", fontFamily: theme.text.family, fontSize: 40, fontWeight: 800, color: GREEN }}>Uang Aktif</div>
          </Appear>
          <Arrow a={a1} b={b1} p={ease(f, placeAt, m.sec(0.6))} color={GREEN} bend={80} />
          {coins(a1, b1, mudahAt, 3, 80)}
          <Appear at={placeAt + m.sec(0.3)} style={{ left: 0, top: 0 }}>
            <Place x={CARD5.x} y={CARD5.y[0]} w={CARD5.w} h={CARD5.h} icon="bank-aktif" title="Rekening bank" tag="Mudah dicairkan" tagIcon="cashout-aktif" titleOn={ease(f, bankAt, m.reveal)} tagOn={ease(f, mudahAt, m.reveal)} />
          </Appear>
          {/* "sebagian yang belum akan dipakai" — a part of it, on the dashed way */}
          <Arrow a={a2} b={b2} p={ease(f, belumAt, m.sec(0.6))} color={GREEN} bend={-60} dashed />
          {coins(a2, b2, belumAt + m.sec(0.4), 2, -60)}
          <Appear at={sebagianAt + m.sec(0.2)} style={{ left: 0, top: 0 }}>
            <Place x={CARD5.x} y={CARD5.y[1]} w={CARD5.w} h={CARD5.h} icon="pie-aktif" title="Reksa dana pasar uang" tag="Likuiditas tinggi" tagIcon="drop-aktif" titleOn={ease(f, rdpuAt, m.reveal)} tagOn={ease(f, likuidAt, m.reveal)} />
          </Appear>
        </div>
      ) : null}

      {/* C — not the highest return, but liquidity and stability */}
      <Appear at={fokusAt + m.sec(0.2)} style={{ left: 0, width: theme.canvas.width, top: 200 }}>
        <div style={{ textAlign: "center", fontFamily: theme.text.family, fontSize: 36, fontWeight: 700, letterSpacing: 2, color: GREEN }}>Fokus utama</div>
      </Appear>
      {[
        { icon: "trend-slate", label: "Return tertinggi", p: ret, tone: c.slate },
        { icon: "drop-aktif", label: "Likuiditas", p: liq, tone: GREEN },
        { icon: "shield-aktif", label: "Stabilitas", p: stab, tone: GREEN },
      ].map((card, i) => {
        if (card.p <= 0.001) return null;
        const x = rowX(i) - CARDS5_ROW.w / 2;
        const dim = i === 0 ? strike : 0;
        return (
          <div key={card.label} style={{ position: "absolute", inset: 0, opacity: card.p * (1 - 0.45 * dim), transform: `translateY(${((1 - card.p) * 20).toFixed(1)}px)` }}>
            <Panel3 x={x} y={CARDS5_ROW.y} w={CARDS5_ROW.w} h={CARDS5_ROW.h} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
              <div style={{ width: CARDS5_ROW.icon, height: CARDS5_ROW.icon, borderRadius: 999, background: i === 0 ? theme.color.slateWash : GREEN_WASH, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico name={card.icon} size={CARDS5_ROW.icon * 0.6} />
              </div>
              <div style={{ fontFamily: theme.text.family, fontSize: 44, fontWeight: 800, color: card.tone }}>{card.label}</div>
            </Panel3>
            {i === 0 && strike > 0.001 ? (
              <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
                <line x1={x + 50} y1={CARDS5_ROW.y + CARDS5_ROW.h / 2 + 86} x2={x + 50 + (CARDS5_ROW.w - 100) * strike} y2={CARDS5_ROW.y + CARDS5_ROW.h / 2 + 86} stroke={theme.color.calendarRed} strokeWidth={6} strokeLinecap="round" />
              </svg>
            ) : null}
          </div>
        );
      })}
      <Badge x={rowX(0) + CARDS5_ROW.w / 2 - 20} y={CARDS5_ROW.y + 20} kind="cross" p={ease(f, W("tapi likuiditas") + m.sec(0.3), m.reveal)} />
      <Badge x={rowX(1) + CARDS5_ROW.w / 2 - 20} y={CARDS5_ROW.y + 20} kind="check" p={ease(f, W("tapi likuiditas") + m.sec(0.45), m.reveal)} />
      <Badge x={rowX(2) + CARDS5_ROW.w / 2 - 20} y={CARDS5_ROW.y + 20} kind="check" p={ease(f, W("stabilitas") + m.sec(0.3), m.reveal)} />
    </Stage>
  );
};

// ═══ SC06 — the emergency fund ═══════════════════════════════════════════
const WAL6 = { x: 460, y: 560, h: 270 };
/** The emergency kit and its shield — Iconify for now (the ChatGPT flat versions are waiting to be downloaded). */
const KIT = { icon: "firstaid-aktif", h: 170 };
const SHIELD = { icon: "shield-aktif", h: 250, x: 900, y: 470 };
/** A big icon in a soft green disc — standing in for a flat illustration. */
const Disc = ({ icon, cx, cy, h, style }: { icon: string; cx: number; cy: number; h: number; style?: React.CSSProperties }) => {
  const c = usePalette();
  return (
    <div style={{ position: "absolute", left: cx - h / 2, top: cy - h / 2, width: h, height: h, borderRadius: 999, background: c.cardBg, boxShadow: `0 0 0 ${Math.round(h * 0.06)}px ${GREEN_WASH}`, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
      <Ico name={icon} size={h * 0.62} />
    </div>
  );
};
const STEP6 = { y: 560, w: 460, h: 160, x: [1000, 1540] };
const MONTHS = { y: 380, w: 300, h: 260, gap: 60, icon: 90 };
const EVENTS: { word: string; label: string; icon: string }[] = [
  { word: "kehilangan pekerjaan", label: "Kehilangan pekerjaan", icon: "briefcase-indigo" },
  { word: "motor rusak", label: "Motor rusak", icon: "motorcycle-indigo" },
  { word: "biaya medis", label: "Biaya medis", icon: "stethoscope-indigo" },
];
const EV = { x: theme.margin.left + 60, w: 440, h: 120, y: [290, 460, 630] };
const INVEST6 = { x: 1300, y: 370, w: 420, h: 220 };

export const SC06 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(6, BLOCK.SC06);
  const intoAt = W("termasuk");
  const orderAt = W("idealnya");
  const acuanAt = W("salah satu acuan");
  const jadiAt = W("jadi kalau");
  const siapkanAt = W("siapkan dana darurat");
  const phaseA = 1 - ease(f, acuanAt, m.fade);
  const phaseB = ease(f, acuanAt, m.reveal) * (1 - ease(f, jadiAt, m.fade));
  const phaseC = ease(f, jadiAt, m.reveal) * (1 - ease(f, siapkanAt, m.fade));
  /* the kit drops into the wallet on "termasuk dalam uang aktif" */
  const into = ease(f, intoAt, m.move);
  const kitY = 280 + (WAL6.y - 150 - 280) * into;
  const kitH = KIT.h * (1 - 0.25 * into);
  /* each event hits the shield: a little push as its arrow lands */
  const hit = EVENTS.map((e) => ease(f, W(e.word) + m.sec(0.45), m.sec(0.15)) * (1 - ease(f, W(e.word) + m.sec(0.6), m.sec(0.3))));
  const push = Math.max(...hit);
  return (
    <Stage>
      <Ground from={BLOCK.SC06} />
      <div style={{ opacity: 1 - ease(f, siapkanAt - m.fade, m.fade) }}>
        <Tag x={theme.margin.left} y={110} text="01 — Uang Aktif" tint={GREEN_WASH} color={GREEN} />
      </div>

      {/* A — the emergency fund goes into uang aktif; it comes before other investments */}
      {phaseA > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: phaseA }}>
          <Appear at={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
            <Wallet kind="aktif" cx={WAL6.x} cy={WAL6.y} h={WAL6.h} />
            <div style={{ position: "absolute", left: WAL6.x - 200, width: 400, top: WAL6.y + WAL6.h / 2 + 10, textAlign: "center", fontFamily: theme.text.family, fontSize: 40, fontWeight: 800, color: GREEN }}>Uang Aktif</div>
          </Appear>
          <Appear at={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
            <Disc icon={KIT.icon} cx={WAL6.x} cy={kitY} h={kitH} />
            <div style={{ position: "absolute", left: WAL6.x + 110, top: kitY - 24, opacity: 1 - into, fontFamily: theme.text.family, fontSize: 40, fontWeight: 800, color: c.ink, whiteSpace: "nowrap" }}>Dana darurat</div>
          </Appear>
          {/* the order: 1 the emergency fund, 2 the rest */}
          {[
            { n: "1", label: "Dana darurat", at: orderAt, on: true },
            { n: "2", label: "Investasi lainnya", at: W("investasi lainnya"), on: false },
          ].map((s, i) => (
            <Appear key={s.n} at={s.at} style={{ left: 0, top: 0 }}>
              <Panel3 x={STEP6.x[i] - STEP6.w / 2} y={STEP6.y - STEP6.h / 2} w={STEP6.w} h={STEP6.h} style={{ display: "flex", alignItems: "center", gap: 22, padding: "0 30px", border: s.on ? `4px solid ${GREEN}` : undefined, opacity: s.on ? 1 : 0.6 }}>
                <div style={{ width: 72, height: 72, borderRadius: 999, flex: "none", background: s.on ? GREEN : c.muted, color: c.cardBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: 38, fontWeight: 800 }}>{s.n}</div>
                <div style={{ fontFamily: theme.text.family, fontSize: 36, fontWeight: 800, color: s.on ? GREEN : c.slate, lineHeight: 1.1, whiteSpace: "nowrap" }}>{s.label}</div>
              </Panel3>
            </Appear>
          ))}
          <Arrow a={{ x: STEP6.x[0] + STEP6.w / 2 + 10, y: STEP6.y }} b={{ x: STEP6.x[1] - STEP6.w / 2 - 14, y: STEP6.y }} p={ease(f, W("sebelum investasi"), m.sec(0.4))} color={c.muted} />
        </div>
      ) : null}

      {/* B — the usual yardstick: about 1–3 months of living costs */}
      {phaseB > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: phaseB }}>
          <Appear at={acuanAt} style={{ left: 0, width: theme.canvas.width, top: 230 }}>
            <div style={{ textAlign: "center", fontFamily: theme.text.family, fontSize: 36, fontWeight: 700, letterSpacing: 2, color: GREEN }}>Acuan umum</div>
          </Appear>
          {[0, 1, 2].map((i) => {
            const at = i === 0 ? W("1") : W("sampai 3") + m.sec(0.18) * (i - 1);
            /* all three in place, empty, as the yardstick is named; each fills on its number */
            const p = ease(f, acuanAt + m.sec(0.3) + m.sec(0.1) * i, m.reveal);
            const fill = ease(f, at, m.sec(0.5));
            const x = CX + (i - 1) * (MONTHS.w + MONTHS.gap) - MONTHS.w / 2;
            return (
              <div key={i} style={{ position: "absolute", inset: 0, opacity: p, transform: `translateY(${((1 - p) * 18).toFixed(1)}px)` }}>
                <Panel3 x={x} y={MONTHS.y} w={MONTHS.w} h={MONTHS.h} style={{ overflow: "hidden" }}>
                  {/* the month fills up */}
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${(fill * 100).toFixed(1)}%`, background: GREEN_WASH }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <Ico name="calendar-aktif" size={MONTHS.icon} />
                    <div style={{ fontFamily: theme.text.family, fontSize: 72, fontWeight: 800, color: fill > 0.5 ? GREEN : c.muted, lineHeight: 1 }}>{i + 1}</div>
                  </div>
                </Panel3>
              </div>
            );
          })}
          <Appear at={W("bulan biaya hidup")} style={{ left: 0, width: theme.canvas.width, top: MONTHS.y + MONTHS.h + 90 }}>
            <Statement cx={CX} cy={0} text="Sekitar 1–3 bulan biaya hidup" mark="1–3 bulan" markInk={GREEN} size={56} maxWidth={1400} />
          </Appear>
        </div>
      ) : null}

      {/* C — the unexpected hits the emergency fund, not the investments */}
      {phaseC > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: phaseC }}>
          {EVENTS.map((e, i) => {
            const at = W(e.word);
            return (
              <React.Fragment key={e.label}>
                <Appear at={at - m.sec(0.1)} style={{ left: 0, top: 0 }}>
                  <Panel3 x={EV.x} y={EV.y[i]} w={EV.w} h={EV.h} style={{ display: "flex", alignItems: "center", gap: 20, padding: "0 26px" }}>
                    <div style={{ width: 76, height: 76, borderRadius: 999, flex: "none", background: theme.color.indigoWash, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Ico name={e.icon} size={48} />
                    </div>
                    <div style={{ fontFamily: theme.text.family, fontSize: 34, fontWeight: 800, color: c.ink, lineHeight: 1.1 }}>{e.label}</div>
                  </Panel3>
                </Appear>
                <Arrow a={{ x: EV.x + EV.w + 14, y: EV.y[i] + EV.h / 2 }} b={{ x: SHIELD.x - SHIELD.h * 0.42, y: SHIELD.y + (i - 1) * 60 }} p={ease(f, at + m.sec(0.15), m.sec(0.35))} color={c.indigo} bend={(1 - i) * 30} />
              </React.Fragment>
            );
          })}
          <Appear at={jadiAt + m.sec(0.1)} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
            <Disc icon={SHIELD.icon} cx={SHIELD.x} cy={SHIELD.y} h={SHIELD.h} style={{ transform: `scale(${(1 + 0.06 * push).toFixed(3)})` }} />
            <div style={{ position: "absolute", left: SHIELD.x - 200, width: 400, top: SHIELD.y + SHIELD.h / 2 + 10, textAlign: "center", fontFamily: theme.text.family, fontSize: 40, fontWeight: 800, color: GREEN }}>Dana darurat</div>
          </Appear>
          {/* the investments stay locked away, untouched */}
          <Appear at={W("nggak perlu")} style={{ left: 0, top: 0 }}>
            <Panel3 x={INVEST6.x} y={INVEST6.y} w={INVEST6.w} h={INVEST6.h} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <Ico name="chartup-indigo" size={90} />
              <div style={{ fontFamily: theme.text.family, fontSize: 38, fontWeight: 800, color: c.ink }}>Investasi lain</div>
            </Panel3>
          </Appear>
          <Appear at={W("menjual investasi")} style={{ left: INVEST6.x + INVEST6.w - 50, top: INVEST6.y - 40 }}>
            <div style={{ width: 92, height: 92, borderRadius: 999, background: c.cardBg, boxShadow: `0 0 0 4px ${theme.color.indigoWash}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico name="lock-indigo" size={58} />
            </div>
          </Appear>
        </div>
      ) : null}

      {/* D — the insight: Orang Tuntun */}
      <OrangTuntun at={siapkanAt} />
      <Appear at={siapkanAt + m.sec(0.2)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Statement cx={ORANG_TUNTUN_RIGHT + 80} cy={500} text="Siapkan dana darurat dulu, baru pikirkan investasi berikutnya." mark="dulu" markInk={GREEN} size={72} maxWidth={theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 80} align="left" />
      </Appear>
    </Stage>
  );
};
