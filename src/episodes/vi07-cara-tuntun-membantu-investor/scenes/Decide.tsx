/**
 * VI07 · SC11 — "Kamu Memutuskan, Tuntun Membantu", the close. From the ChatGPT storyboard
 * docs/vi-style/storyboards/VI07-SC11.jpg.
 *
 *  A  the mascot (Membantu) and you (Memutuskan), one line between; Beli and Jual sit on YOUR side — the mascot's
 *     reach to them is crossed out.
 *  B  what travels along the line: Kualitas, Fair value, Peristiwa, Transaksi, Market.
 *  C  none of it is certain: the line goes dashed; the price can fall further below the fair value; a cheap market can
 *     get cheaper; no promise of a rise, no decision to follow.
 *  D  a voice note → an eye → the button; then the line SC01's question has been waiting for: "Lihat dulu. Baru
 *     putuskan."
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, TuntunMark, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, Mark, VoiceBubble, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const ROW_Y = 470;
const HELP_X = 400;
const YOU_X = 1520;
const BUTTONS = [
  { text: "Beli", sign: "▲", ink: theme.color.gainGreen, at: "tombol beli", cross: "untukmu." },
  { text: "Jual", sign: "▼", ink: theme.color.alarmRed, at: "tombol jual.", cross: "jual." },
] as const;
const buttonY = (i: number) => ROW_Y + 170 + i * 96;
const INFO = [
  { text: "Kualitas", icon: "company", at: "kualitas perusahaan" },
  { text: "Fair value", icon: "scale", at: "fair value," },
  { text: "Peristiwa", icon: "event", at: "dampak sebuah" },
  { text: "Transaksi", icon: "volume", at: "aktivitas transaksi" },
  { text: "Market", icon: "gauge", at: "kondisi market." },
] as const;
const infoX = (i: number) => 600 + i * 180;
const POP = { w: 420, h: 170, y: 190 };

export const SC11 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(11, BLOCK.SC11);
  const g = f + BLOCK.SC11;

  // A
  const lineP = ease(f, W("hubungan kita"), m.sec(0.8));
  const helpAt = W("Tuntun membantu,");
  const youAt = W("kamu yang memutuskan");
  const crossOut = ease(f, W("Tuntun membantu menampilkan"), m.fade);

  // C
  const unsure = ease(f, W("bukan kepastian"), m.reveal);
  const fvPop = ease(f, W("Harga masih"), m.reveal);
  const fvDrop = ease(f, W("di bawah fair"), m.move);
  const mkPop = ease(f, W("Market yang"), m.reveal);
  const mkDrop = ease(f, W("lebih murah."), m.move);
  const promiseAt = W("pasti naik");
  const followAt = W("harus kamu ikuti");

  // D
  const dAt = W("Tujuannya sederhana");
  const abOut = ease(f, dAt, m.fade);
  const friendAt = W("temanmu menyuruhmu");
  const eyeAt = W("untuk dilihat");
  const lookAt = W("lihat dulu.");
  const thenAt = W("Baru putuskan.");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A–C — the two of you, and what passes between */}
      {abOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - abOut }}>
          <Connector a={{ x: HELP_X + 100, y: ROW_Y }} b={{ x: YOU_X - 90, y: ROW_Y }} p={lineP} shape="curve" dashed={unsure > 0.5} dash="10 10" tone={unsure > 0.5 ? theme.color.connectorMuteSolid : theme.color.connector} dot={false} />
          <Appear at={helpAt - m.sec(0.1)} style={{ left: 0, top: 0 }}>
            <TuntunMark x={HELP_X} y={ROW_Y - 80 + 3 * Math.sin((g / m.sec(1.6)) * Math.PI * 2)} height={160} />
            <div style={{ position: "absolute", left: HELP_X - 150, top: ROW_Y + 100, width: 300, textAlign: "center", ...typeStyle("body"), color: c.ink }}>Membantu</div>
          </Appear>
          <Appear at={youAt - m.sec(0.1)} style={{ left: YOU_X - 80, top: ROW_Y - 80 }}>
            <Disc icon="user" size={160} tone={theme.color.selfAmberInk} tint={theme.color.selfAmberWashSolid} />
            <div style={{ position: "absolute", left: -70, top: 180, width: 300, textAlign: "center", ...typeStyle("body"), color: c.ink }}>Memutuskan</div>
          </Appear>

          {/* the buttons are yours; the mascot's reach to them is crossed out */}
          {BUTTONS.map((b, i) => {
            const at = W(b.at);
            const p = ease(f, at - m.sec(0.1), m.pop);
            const y = buttonY(i);
            return (
              <React.Fragment key={b.text}>
                <div style={{ opacity: 1 - crossOut }}>
                  <Connector a={{ x: HELP_X + 60, y: ROW_Y + 60 }} b={{ x: YOU_X - 300, y: y + 40 }} p={ease(f, at, m.sec(0.5))} shape="curve" dashed dash="8 10" tone={theme.color.connectorMuteSolid} />
                </div>
                {p > 0.001 ? (
                  <div style={{ position: "absolute", left: YOU_X - 300, top: y, width: 220, height: 80, borderRadius: 22, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, ...typeStyle("title"), fontSize: 38, fontWeight: 500, color: c.ink, opacity: p }}>
                    <span style={{ fontSize: 26, color: b.ink }}>{b.sign}</span>
                    {b.text}
                  </div>
                ) : null}
                <Mark kind="cross" p={ease(f, W(b.cross) - m.sec(0.05), m.pop) * (1 - crossOut)} x={YOU_X - 300 - 30} y={y + 40} />
              </React.Fragment>
            );
          })}

          {/* B — what Tuntun shows, along the line */}
          {INFO.map((k, i) => {
            const p = ease(f, W(k.at) - m.sec(0.1), m.pop);
            if (p <= 0.001) return null;
            return (
              <div key={k.text} style={{ position: "absolute", left: infoX(i) - 40, top: ROW_Y - 40 - (1 - p) * 16, width: 80, opacity: p, filter: unsure > 0.001 ? `grayscale(${unsure.toFixed(3)})` : undefined }}>
                <div style={{ borderRadius: 999, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${unsure > 0.5 ? theme.color.connectorMuteSolid : theme.color.connector}`, background: c.cardBg, width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Disc icon={k.icon} size={64} tone={c.indigo} tint={c.cardBg} />
                </div>
                <div style={{ position: "absolute", left: -60, top: 92, width: 200, textAlign: "center", ...typeStyle("label"), fontSize: 26, color: c.ink }}>{k.text}</div>
              </div>
            );
          })}

          {/* C — not certain: the price can fall further below the fair value … */}
          {fvPop > 0.001 ? (
            <Card x={infoX(1) - POP.w / 2} y={POP.y + (1 - fvPop) * 14} w={POP.w} h={POP.h} style={{ opacity: fvPop }}>
              <div style={{ position: "absolute", left: 40, top: 86, width: POP.w - 80, height: 10, borderRadius: 5, background: theme.color.neutralDot }} />
              <div style={{ position: "absolute", left: 40 + 0.6 * (POP.w - 80) - 3, top: 56, width: 6, height: 70, borderRadius: 3, background: c.indigo }} />
              <div style={{ position: "absolute", left: 40 + 0.6 * (POP.w - 80) - 80, top: 128, width: 160, textAlign: "center", ...typeStyle("label"), fontSize: 24, color: c.indigo }}>Fair value</div>
              <div style={{ position: "absolute", left: 40 + (0.42 - 0.34 * fvDrop) * (POP.w - 80) - 14, top: 77, width: 28, height: 28, borderRadius: 999, background: c.ink }} />
            </Card>
          ) : null}
          {/* … and a cheap market can get cheaper */}
          {mkPop > 0.001 ? (
            <Card x={infoX(4) - POP.w / 2} y={POP.y + (1 - mkPop) * 14} w={POP.w} h={POP.h} style={{ opacity: mkPop }}>
              <div style={{ position: "absolute", left: 40, top: 80, width: POP.w - 80, height: 14, borderRadius: 7, background: `linear-gradient(90deg, ${theme.color.indigoWashSolid}, ${theme.color.indigoWashStrongSolid})` }} />
              <div style={{ position: "absolute", left: 40 + (0.22 - 0.17 * mkDrop) * (POP.w - 80) - 14, top: 73, width: 28, height: 28, borderRadius: 999, background: c.indigo }} />
              <div style={{ position: "absolute", left: 40, top: 112, ...typeStyle("label"), fontSize: 24, color: c.slate }}>Murah</div>
              <div style={{ position: "absolute", left: POP.w - 140, top: 112, width: 100, textAlign: "right", ...typeStyle("label"), fontSize: 24, color: c.slate }}>Mahal</div>
            </Card>
          ) : null}
          {/* no promise of a rise, no decision to follow */}
          {[
            { icon: "confident", at: promiseAt },
            { icon: "decide", at: followAt },
          ].map((k, i) => (
            <React.Fragment key={k.icon}>
              <Appear at={k.at - m.sec(0.15)} style={{ left: HELP_X - 120 + i * 140, top: ROW_Y + 190 }}>
                <Disc icon={k.icon} size={100} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
              </Appear>
              <Mark kind="cross" p={ease(f, k.at + m.sec(0.15), m.pop)} x={HELP_X - 120 + i * 140 + 92} y={ROW_Y + 198} />
            </React.Fragment>
          ))}
        </div>
      ) : null}

      {/* D — before the next button: look first */}
      {f >= friendAt - m.sec(0.2) ? (
        <div style={{ position: "absolute", inset: 0 }}>
          <Appear at={friendAt - m.sec(0.1)} style={{ left: 300, top: 380 }}>
            <VoiceBubble played={ease(f, friendAt, m.sec(0.8))} />
          </Appear>
          <Connector a={{ x: 600, y: 418 }} b={{ x: CX - 90, y: 418 }} p={ease(f, eyeAt - m.sec(0.4), m.sec(0.5))} shape="curve" />
          <Appear at={eyeAt - m.sec(0.1)} style={{ left: CX - 80, top: 338 }}>
            <div style={{ borderRadius: 999, boxShadow: `${shadow.soft}, 0 0 ${(40 * ease(f, lookAt, m.reveal)).toFixed(1)}px 10px ${theme.color.indigoGlow}` }}>
              <Disc icon="eye" size={160} tone={c.indigo} tint={c.cardBg} />
            </div>
          </Appear>
          <Connector a={{ x: CX + 90, y: 418 }} b={{ x: 1340, y: 418 }} p={ease(f, W("Keputusan tetap") - m.sec(0.3), m.sec(0.5))} shape="curve" />
          {/* the decision: any of the three, still yours (the storyboard's D) — framed in indigo on "Baru putuskan" */}
          <Appear at={W("Keputusan tetap") - m.sec(0.1)} style={{ left: 1340, top: 300 }}>
            <div style={{ width: 250, padding: 14, borderRadius: 26, boxShadow: `inset 0 0 0 2px ${ease(f, thenAt, m.pop) > 0.5 ? theme.color.connector : theme.color.connectorMuteSolid}`, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { text: "Beli", sign: "▲", ink: theme.color.gainGreen },
                { text: "Tahan", sign: "‖", ink: theme.color.neutralIcon },
                { text: "Jual", sign: "▼", ink: theme.color.alarmRed },
              ].map((o) => (
                <div key={o.text} style={{ height: 62, borderRadius: 18, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", gap: 14, padding: "0 22px", ...typeStyle("body"), fontSize: 32, color: c.ink }}>
                  <span style={{ fontSize: 22, color: o.ink }}>{o.sign}</span>
                  {o.text}
                </div>
              ))}
            </div>
          </Appear>
          {/* the mascot under the eye (context), you under the choices (the decision) */}
          <Appear at={W("memberi konteks") - m.sec(0.1)} style={{ left: 0, top: 0 }}>
            <TuntunMark x={CX} y={540} height={90} />
          </Appear>
          <Appear at={W("di tanganmu") - m.sec(0.1)} style={{ left: 1340 + 125 - 45, top: 580 }}>
            <Disc icon="user" size={90} tone={theme.color.selfAmberInk} tint={theme.color.selfAmberWashSolid} />
          </Appear>
          <div style={{ position: "absolute", left: 0, top: 780, width: theme.canvas.width, textAlign: "center", fontFamily: theme.text.family, fontSize: 84, fontWeight: 500, letterSpacing: -1.5, transform: "translateY(-50%)" }}>
            <span style={{ color: c.indigo, opacity: ease(f, lookAt - m.sec(0.1), m.reveal) }}>Lihat dulu. </span>
            <span style={{ color: c.ink, opacity: ease(f, thenAt - m.sec(0.1), m.reveal) }}>Baru putuskan.</span>
          </div>
        </div>
      ) : null}
    </Stage>
  );
};
