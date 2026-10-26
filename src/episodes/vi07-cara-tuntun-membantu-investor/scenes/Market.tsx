/**
 * VI07 · SC08 — "Lihat Kondisi Market Sebelum Menambah Risiko". Still situation 4 (the heading stays). From the ChatGPT
 * storyboard docs/vi-style/storyboards/VI07-SC08.jpg.
 *
 *  A  one stock → the whole market (a mosaic of cards round it); the loan coin glows; everyone's cards tick up.
 *  B  two instruments in one card: Valuasi IHSG on its historical range (Murah … Mahal) and a Sentimen gauge
 *     (Takut … Serakah).
 *  C  both high → Waspada; both low → Peluang.
 *  D  the card is named Market Valuation; it doesn't pick a stock (✕); it shows whether everyone is moving the same
 *     way — a field of arrows turning to one direction.
 *
 * No figures: the range and the gauge have no numbers (nothing here is a real reading).
 */
import { interpolate, useCurrentFrame } from "remotion";
import { SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Heading, Mark, SITUATION, Skel, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A — the mosaic
const TILE = { w: 150, h: 100, gap: 24 };
const COLS = 7;
const ROWS_N = 5;
const tileX = (col: number) => CX - (COLS * TILE.w + (COLS - 1) * TILE.gap) / 2 + col * (TILE.w + TILE.gap);
const tileY = (row: number) => 540 - (ROWS_N * TILE.h + (ROWS_N - 1) * TILE.gap) / 2 + row * (TILE.h + TILE.gap);
const CENTER = { col: 3, row: 2 };

// B–D — the Market Valuation card
const MV = { x: CX - 680, y: 250, w: 1360, h: 420 };
const RANGE = { x: 90, w: 520, y: 250 };
const GAUGE = { cx: 1010, cy: 300, r: 170 };

/** A small stock card: a skeleton name and a sparkline. */
const StockTile = ({ up }: { up: number }) => (
    <>
      <Skel w={70} h={10} style={{ left: 16, top: 16 }} />
      <svg width={TILE.w - 32} height={40} style={{ position: "absolute", left: 16, top: 44 }}>
        <polyline points="0,30 20,26 38,30 58,20 78,24 98,12 118,8" fill="none" stroke={theme.color.neutralDot} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {up > 0.001 ? <div style={{ position: "absolute", right: 12, top: 10, fontFamily: theme.text.family, fontSize: 18, color: theme.color.gainGreen, opacity: up, transform: `translateY(${((1 - up) * 6).toFixed(2)}px)` }}>▲</div> : null}
    </>
);

export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(8, BLOCK.SC08);
  const g = f + BLOCK.SC08;

  // A
  const oneAt = W("satu saham");
  const wholeAt = W("kondisi market");
  const loanAt = W("Karena leverage");
  const upAt = W("semua orang sedang");
  const aOut = ease(f, W("Sebelum memperbesar"), m.fade);

  // B/C
  const rangeAt = W("valuasi IHSG");
  const gaugeAt = W("sentimen pasar");
  const high = ease(f, W("Saat valuasi dan"), m.move);
  const low = ease(f, W("Saat valuasi rendah"), m.move);
  const marker = interpolate(ease(f, W("berada dibandingkan"), m.move), [0, 1], [0.2, 0.5]) + 0.38 * high - 0.76 * low;
  const needleSwing = ease(f, W("ketakutan atau"), m.move) - 2 * ease(f, W("keserakahan."), m.move) + ease(f, W("keserakahan.") + m.sec(0.6), m.move);
  const needle = 0.5 - 0.38 * needleSwing + 0.38 * high - 0.76 * low;
  const careP = ease(f, W("lebih waspada"), m.pop) * (1 - ease(f, W("Saat valuasi rendah"), m.fade));
  const chanceP = ease(f, W("dari peluang"), m.pop) * (1 - ease(f, W("Market Valuation"), m.fade));

  // D
  const nameP = ease(f, W("Market Valuation"), m.reveal);
  const pickP = ease(f, W("memilihkan saham"), m.reveal) * (1 - ease(f, W("Fitur ini"), m.fade));
  const fieldAt = W("suasana pasar");
  const align = ease(f, W("mendorong semua"), W("sama?", 0, "f1") - W("mendorong semua"));

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />
      <Heading n={4} text={SITUATION[3].label} />

      {/* A — one stock, then the whole market round it */}
      {aOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - aOut }}>
          {Array.from({ length: COLS * ROWS_N }, (_, k) => {
            const col = k % COLS;
            const row = Math.floor(k / COLS);
            const centre = col === CENTER.col && row === CENTER.row;
            const dist = Math.hypot(col - CENTER.col, row - CENTER.row);
            const p = centre ? ease(f, oneAt - m.sec(0.1), m.reveal) : ease(f, wholeAt + dist * m.sec(0.07), m.reveal);
            if (p <= 0.001) return null;
            const up = ease(f, upAt + dist * m.sec(0.06), m.pop);
            return (
              <Card key={k} x={tileX(col)} y={tileY(row) + (1 - p) * 14} w={TILE.w} h={TILE.h} line={centre ? theme.color.connector : undefined} style={{ opacity: p, borderRadius: 18 }}>
                <StockTile up={up} />
              </Card>
            );
          })}
          {/* the loan, tempting in the middle of it */}
          <Appear at={loanAt} style={{ left: CX - 60, top: 540 - 60 }}>
            <div style={{ borderRadius: 999, boxShadow: `${shadow.soft}, 0 0 ${(30 + 14 * Math.sin((f / m.sec(0.8)) * Math.PI)).toFixed(1)}px 8px ${theme.color.alarmWashSolid}` }}>
              <Disc icon="loan" size={120} tone={theme.color.alarmRed} tint={c.cardBg} />
            </div>
          </Appear>
        </div>
      ) : null}

      {/* B–D — the two instruments, in one card that is named when the VO names it */}
      <Appear at={rangeAt - m.sec(0.15)} style={{ left: 0, top: 0 }}>
        <Card x={MV.x} y={MV.y} w={MV.w} h={MV.h} line={theme.color.hairlineBrandSolid}>
          <div style={{ position: "absolute", left: 50, top: 26, display: "flex", alignItems: "center", gap: 18, opacity: nameP }}>
            <Disc icon="gauge" size={60} tone={c.indigo} tint={theme.color.indigoWashSolid} />
            <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink }}>Market Valuation</div>
          </div>
          {/* the valuation's range over its history */}
          <div style={{ position: "absolute", left: RANGE.x, top: RANGE.y - 90, ...typeStyle("body"), color: c.ink }}>Valuasi IHSG</div>
          <div style={{ position: "absolute", left: RANGE.x, top: RANGE.y - 8, width: RANGE.w, height: 16, borderRadius: 8, background: `linear-gradient(90deg, ${theme.color.indigoWashSolid}, ${theme.color.indigoWashStrongSolid})` }} />
          <div style={{ position: "absolute", left: RANGE.x, top: RANGE.y + 30, ...typeStyle("label"), color: c.slate }}>Murah</div>
          <div style={{ position: "absolute", left: RANGE.x + RANGE.w - 100, top: RANGE.y + 30, width: 100, textAlign: "right", ...typeStyle("label"), color: c.slate }}>Mahal</div>
          {f >= W("berada dibandingkan") - m.sec(0.1) ? <div style={{ position: "absolute", left: RANGE.x + marker * RANGE.w - 16, top: RANGE.y - 16, width: 32, height: 32, borderRadius: 999, background: c.indigo, boxShadow: shadow.soft, opacity: ease(f, W("berada dibandingkan") - m.sec(0.1), m.pop) }} /> : null}
          {/* the sentiment gauge */}
          {f >= gaugeAt - m.sec(0.1) ? (
            <div style={{ position: "absolute", inset: 0, opacity: ease(f, gaugeAt - m.sec(0.1), m.reveal) }}>
              <div style={{ position: "absolute", left: GAUGE.cx - 120, top: GAUGE.cy - GAUGE.r - 90, width: 240, textAlign: "center", ...typeStyle("body"), color: c.ink }}>Sentimen</div>
              <svg width={MV.w} height={MV.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <path d={`M ${GAUGE.cx - GAUGE.r} ${GAUGE.cy} A ${GAUGE.r} ${GAUGE.r} 0 0 1 ${GAUGE.cx + GAUGE.r} ${GAUGE.cy}`} fill="none" stroke={theme.color.indigoWashStrongSolid} strokeWidth={22} strokeLinecap="round" />
                {(() => {
                  const a = Math.PI * (1 - Math.max(0.02, Math.min(0.98, needle)));
                  return (
                    <>
                      <line x1={GAUGE.cx} y1={GAUGE.cy} x2={GAUGE.cx + (GAUGE.r - 30) * Math.cos(a)} y2={GAUGE.cy - (GAUGE.r - 30) * Math.sin(a)} stroke={c.ink} strokeWidth={6} strokeLinecap="round" />
                      <circle cx={GAUGE.cx} cy={GAUGE.cy} r={12} fill={c.ink} />
                    </>
                  );
                })()}
              </svg>
              <div style={{ position: "absolute", left: GAUGE.cx - GAUGE.r - 60, top: GAUGE.cy + 30, width: 120, textAlign: "center", ...typeStyle("label"), color: c.slate }}>Takut</div>
              <div style={{ position: "absolute", left: GAUGE.cx + GAUGE.r - 60, top: GAUGE.cy + 30, width: 120, textAlign: "center", ...typeStyle("label"), color: c.slate }}>Serakah</div>
            </div>
          ) : null}
        </Card>
      </Appear>

      {/* C — what each reading asks of you */}
      {careP > 0.001 ? (
        <div style={{ position: "absolute", left: CX - 160, top: MV.y + MV.h + 50, width: 320, height: 98, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.alarmRed}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, opacity: careP }}>
          <Disc icon="panic" size={60} tone={theme.color.alarmRed} tint={theme.color.alarmWashSolid} />
          <div style={{ ...typeStyle("title"), fontWeight: 500, color: theme.color.alarmRed }}>Waspada</div>
        </div>
      ) : null}
      {chanceP > 0.001 ? (
        <div style={{ position: "absolute", left: CX - 160, top: MV.y + MV.h + 50, width: 320, height: 98, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connector}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, opacity: chanceP }}>
          <Disc icon="eye" size={60} tone={c.indigo} tint={theme.color.indigoWashSolid} />
          <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.indigo }}>Peluang</div>
        </div>
      ) : null}

      {/* D — it doesn't pick a stock for you */}
      {pickP > 0.001 ? (
        <>
          <Card x={CX - TILE.w / 2} y={MV.y + MV.h + 50} w={TILE.w} h={TILE.h} style={{ opacity: pickP, borderRadius: 18 }}>
            <StockTile up={0} />
          </Card>
          <Mark kind="cross" p={pickP} x={CX + TILE.w / 2} y={MV.y + MV.h + 50} />
        </>
      ) : null}

      {/* … it shows whether everyone is moving the same way */}
      {f >= fieldAt - m.sec(0.2) ? (
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, opacity: ease(f, fieldAt - m.sec(0.2), m.reveal) }}>
          {Array.from({ length: 2 * 16 }, (_, k) => {
            const col = k % 16;
            const row = Math.floor(k / 16);
            const x = CX - 15 * 38 + col * 76;
            const y = MV.y + MV.h + 80 + row * 90;
            const scatter = ((k * 137) % 360) - 180;
            const target = -40;
            const ang = scatter + (target - scatter) * align + 8 * (1 - align) * Math.sin(f / m.sec(1.4) + k);
            const rad = (ang * Math.PI) / 180;
            const len = 22;
            const x2 = x + len * Math.cos(rad);
            const y2 = y + len * Math.sin(rad);
            const hx = x2 - 12 * Math.cos(rad - 0.5);
            const hy = y2 - 12 * Math.sin(rad - 0.5);
            const kx = x2 - 12 * Math.cos(rad + 0.5);
            const ky = y2 - 12 * Math.sin(rad + 0.5);
            return (
              <g key={k} stroke={align > 0.6 ? c.indigo : theme.color.neutralIcon} strokeWidth={3.5} strokeLinecap="round" fill="none">
                <line x1={x - len * Math.cos(rad)} y1={y - len * Math.sin(rad)} x2={x2} y2={y2} />
                <polyline points={`${hx},${hy} ${x2},${y2} ${kx},${ky}`} strokeLinejoin="round" />
              </g>
            );
          })}
        </svg>
      ) : null}
    </Stage>
  );
};
