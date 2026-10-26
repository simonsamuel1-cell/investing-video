/**
 * VI07 · SC07 — "Saat Lagi Paling Yakin, Justru Perlu Berhenti". Situation 4, Terlalu yakin. From the ChatGPT
 * storyboard docs/vi-style/storyboards/VI07-SC07.jpg.
 *
 *  A  you (the cyan self icon) swelling with confidence; three wins; "Sudah mengerti market."
 *  B  the position bar stretches — then a dashed red block is added: Pinjaman.
 *  C  Tuntun Guidance drops in with two reminders: the price far above the fair price (pause), and leverage (✕).
 *  D  Orang Tuntun: "Bukan larangan, tapi jeda."
 */
import { useCurrentFrame } from "remotion";
import { SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Heading, Line, Mark, ORANG_TUNTUN_RIGHT, OrangTuntun, SITUATION, Skel, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A
const SELF = { cx: 640, cy: 560, size: 170 };
const WINS_X = 1000;
const WIN_GAP = 170;

// B
const POS = { x: 560, base: 760, w: 130, gap: 46, hs: [110, 170, 240, 320] };
const LOAN_H = 430;

// C
const GUIDE = { x: CX - 540, y: 250, w: 1080, h: 540 };
const SCALE = { x: 120, w: 540, y: 230 };

export const SC07 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(7, BLOCK.SC07);
  const g = f + BLOCK.SC07;

  // A
  const selfAt = W("Masalah berikutnya") + m.sec(0.3);
  const swell = ease(f, W("terlalu besar"), m.reveal);
  const winsAt = [W("Tiga"), W("kali"), W("untung,")];
  const thinkAt = W("Saya sudah");
  const aOut = ease(f, W("Posisi diperbesar"), m.fade);

  // B
  const grow = ease(f, W("Posisi diperbesar"), m.move);
  const loanP = ease(f, W("dana pinjaman"), m.reveal);
  const bOut = ease(f, W("Di saat"), m.fade);

  // C
  const guideAt = W("Tuntun Guidance");
  const guideP = ease(f, guideAt - m.sec(0.1), m.move);
  const row1 = ease(f, W("jauh di atas") - m.sec(0.1), m.reveal);
  const dot = ease(f, W("jauh di atas"), m.move);
  const pause = ease(f, W("pertimbangkan kembali"), m.pop);
  const row2 = ease(f, W("alasan investasinya") - m.sec(0.1), m.reveal);
  const lever = ease(f, W("leverage."), m.pop);
  const cOut = ease(f, W("Peringatan ini"), m.fade);

  const insightAt = W("Peringatan ini");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1 - ease(f, insightAt, m.fade)} />
      <Appear at={0} out={insightAt} style={{ left: 0, top: 0 }}>
        <Heading n={4} text={SITUATION[3].label} />
      </Appear>

      {/* A — confidence, three wins, the thought */}
      {aOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - aOut }}>
          <Appear at={selfAt - m.sec(0.1)} style={{ left: SELF.cx - SELF.size / 2, top: SELF.cy - SELF.size / 2 }}>
            <div style={{ borderRadius: 999, transform: `scale(${(1 + 0.14 * swell).toFixed(3)})`, boxShadow: `0 0 ${(50 * swell).toFixed(1)}px ${(12 * swell).toFixed(1)}px ${theme.color.selfAmberGlow}` }}>
              <Disc icon="user" size={SELF.size} tone={theme.color.selfAmberInk} tint={theme.color.selfAmberWashSolid} />
            </div>
          </Appear>
          {winsAt.map((at, i) => (
            <Appear key={i} at={at - m.sec(0.05)} style={{ left: WINS_X + i * WIN_GAP, top: SELF.cy - 60 }}>
              <div style={{ borderRadius: 999, boxShadow: shadow.soft }}>
                <Disc icon="win" size={120} tone={c.indigo} tint={c.cardBg} />
              </div>
            </Appear>
          ))}
          <Appear at={thinkAt - m.sec(0.1)} style={{ left: SELF.cx - 40, top: SELF.cy - SELF.size / 2 - 190 }}>
            <div style={{ padding: "24px 40px", borderRadius: 40, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, ...typeStyle("title"), fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>Sudah mengerti market.</div>
            <div style={{ position: "absolute", left: 20, top: 118, width: 22, height: 22, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}` }} />
          </Appear>
        </div>
      ) : null}

      {/* B — the position grows, then borrowed money is added */}
      {/* (the storyboard's stair of bars: each step bigger, then a dashed one on borrowed money) */}
      {bOut < 0.999 && grow > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - bOut }}>
          {POS.hs.map((h, i) => {
            const p = ease(f, W("Posisi diperbesar") + i * m.sec(0.14), m.reveal);
            return <div key={i} style={{ position: "absolute", left: POS.x + i * (POS.w + POS.gap), top: POS.base - h * p, width: POS.w, height: h * p, borderRadius: 20, background: i === POS.hs.length - 1 ? c.indigo : theme.color.indigoWashStrongSolid }} />;
          })}
          <div style={{ position: "absolute", left: POS.x, top: POS.base + 24, width: POS.hs.length * (POS.w + POS.gap) - POS.gap, textAlign: "center", ...typeStyle("body"), color: c.ink, opacity: grow }}>Posisi</div>
          {loanP > 0.001 ? (
            <>
              <div style={{ position: "absolute", left: POS.x + POS.hs.length * (POS.w + POS.gap), top: POS.base - LOAN_H * loanP, width: POS.w, height: LOAN_H * loanP, borderRadius: 20, border: `3px dashed ${theme.color.alarmRed}`, background: theme.color.alarmWashSolid, boxSizing: "border-box" }} />
              <div style={{ position: "absolute", left: POS.x + POS.hs.length * (POS.w + POS.gap) + POS.w / 2, top: POS.base - LOAN_H - 130, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: loanP }}>
                <Disc icon="loan" size={70} tone={theme.color.alarmRed} tint={theme.color.alarmWashSolid} />
                <div style={{ ...typeStyle("body"), fontSize: 32, color: theme.color.alarmRed, whiteSpace: "nowrap" }}>Pinjaman</div>
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {/* C — Tuntun Guidance, two reminders */}
      {guideP > 0.001 && cOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: guideP * (1 - cOut) }}>
          <Card x={GUIDE.x} y={GUIDE.y - (1 - guideP) * 80} w={GUIDE.w} h={GUIDE.h} line={theme.color.hairlineBrandSolid} style={{ boxShadow: `${shadow.soft}, 0 0 40px 8px ${theme.color.indigoGlow}` }}>
            <div style={{ position: "absolute", left: 50, top: 40, display: "flex", alignItems: "center", gap: 22 }}>
              {/* the bell rings on "pengingat" — something moves while the card waits for its rows */}
              <div style={{ transform: `rotate(${(14 * Math.sin(((f - W("pengingat.")) / m.sec(0.18)) * Math.PI) * (1 - ease(f, W("pengingat."), m.sec(0.9))) * (f >= W("pengingat.") ? 1 : 0)).toFixed(2)}deg)` }}>
                <Disc icon="alert" size={72} tone={c.indigo} tint={theme.color.indigoWashSolid} />
              </div>
              <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink }}>Tuntun Guidance</div>
            </div>
            <div style={{ position: "absolute", left: 0, top: 146, width: GUIDE.w, height: 2, background: c.border }} />
            {/* 1 — the price far above the fair price: pause */}
            <div style={{ position: "absolute", left: 0, top: 150, width: GUIDE.w, height: 190, opacity: row1 }}>
              <div style={{ position: "absolute", left: SCALE.x, top: 100, width: SCALE.w, height: 10, borderRadius: 5, background: theme.color.neutralDot }} />
              <div style={{ position: "absolute", left: SCALE.x + 0.4 * SCALE.w, top: 105 - 5, width: (0.5 * dot) * SCALE.w, height: 10, borderRadius: 5, background: theme.color.indigoWashStrongSolid }} />
              <div style={{ position: "absolute", left: SCALE.x + 0.4 * SCALE.w - 3, top: 70, width: 6, height: 70, borderRadius: 3, background: c.indigo }} />
              <div style={{ position: "absolute", left: SCALE.x + 0.4 * SCALE.w - 100, top: 146, width: 200, textAlign: "center", ...typeStyle("label"), color: c.indigo }}>Fair price</div>
              <div style={{ position: "absolute", left: SCALE.x + (0.45 + 0.45 * dot) * SCALE.w - 15, top: 90, width: 30, height: 30, borderRadius: 999, background: c.ink }} />
              <div style={{ position: "absolute", left: SCALE.x + SCALE.w + 120, top: 50, opacity: pause, transform: `scale(${(0.85 + 0.15 * pause).toFixed(3)})` }}>
                <Disc icon="pause" size={110} tone={c.indigo} tint={theme.color.indigoWashSolid} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 50, top: 350, width: GUIDE.w - 100, height: 2, background: c.border, opacity: row2 }} />
            {/* 2 — a thin reason: no leverage */}
            <div style={{ position: "absolute", left: 0, top: 362, width: GUIDE.w, height: 170, opacity: row2 }}>
              <div style={{ position: "absolute", left: SCALE.x, top: 50, display: "flex", alignItems: "center", gap: 20 }}>
                <Disc icon="report" size={64} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
                <div style={{ position: "relative", width: 260, height: 16 }}>
                  <Skel w={110} h={16} style={{ left: 0, top: 0 }} />
                </div>
              </div>
              <div style={{ position: "absolute", left: SCALE.x + SCALE.w + 80, top: 34, display: "flex", alignItems: "center", gap: 20, opacity: lever }}>
                <Disc icon="loan" size={96} tone={theme.color.alarmRed} tint={theme.color.alarmWashSolid} />
                <div style={{ ...typeStyle("body"), color: c.ink }}>Leverage</div>
              </div>
              <Mark kind="cross" p={lever} x={SCALE.x + SCALE.w + 80 + 86} y={44} />
            </div>
          </Card>
        </div>
      ) : null}

      {/* D — the insight */}
      <OrangTuntun at={insightAt} />
      <Appear at={W("bukan larangan")} style={{ left: 0, top: 0 }}>
        <Line x={ORANG_TUNTUN_RIGHT + 90} y={500} w={theme.canvas.width - ORANG_TUNTUN_RIGHT - 300} size={72} weight={500} text="Bukan larangan, tapi jeda." mark="jeda" />
      </Appear>
    </Stage>
  );
};
