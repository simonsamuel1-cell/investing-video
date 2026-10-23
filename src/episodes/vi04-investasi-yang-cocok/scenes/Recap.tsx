/**
 * VI04 · SC08 — "Ingat Tiga Hal Ini", rebuilt to Benchmark v1 + minimal (STYLE.md §0; Simon, 22 Oct 2026) from
 * the ChatGPT storyboard docs/vi-style/storyboards/VI04-SC08-v2.jpg. A stepper 1·2·3 at the top marks the point
 * being said; it stays through point 3 too (Simon, 22 Oct).
 *
 *  1  "jangan langsung tanya mana yang paling cepat" ✕ → a connector → "Tanya dulu: “Mana yang benar-benar bisa
 *     aku jalani?”" ✓ (amber: the question about YOU).
 *  2  Kemampuan and Toleransi — the wheel and the waves, the same icons SC03–SC06 use.
 *  3  the insight, Orang Tuntun: "berani menghadapi ombak, belum tentu berarti sudah bisa bawa pesawat" — waves ≠
 *     wheel, as in SC05.
 */
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, ease, IconDot, IsoIcon, Line, Mark, ORANG_TUNTUN_RIGHT, OrangTuntun, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const STEPPER = { y: 270, gap: 160, size: 56 };
const PAIR = { w: 760, y: 430, gap: 100 };
const pairX = (i: number) => CX + (i === 0 ? -PAIR.gap / 2 - PAIR.w : PAIR.gap / 2);

/** One step of the stepper: a number in a ring, brighter while it is the point being said. */
const Step = ({ n, on }: { n: number; on: number }) => {
  const c = usePalette();
  return (
    <div style={{ width: STEPPER.size, height: STEPPER.size, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${on > 0.5 ? theme.color.connector : theme.color.connectorMute}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: 26, fontWeight: on > 0.5 ? 600 : 500, color: on > 0.5 ? c.indigo : c.slate, transform: `scale(${(1 + 0.15 * on).toFixed(3)})` }}>{n}</div>
  );
};

export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(8, BLOCK.SC08);
  const g = f + BLOCK.SC08;

  const one = W("Pertama");
  const two = W("Kedua");
  const three = W("Dan yang paling penting");
  const steps = [one, two, three];
  const active = (i: number) => ease(f, steps[i], m.pop) * (1 - (i < 2 ? ease(f, steps[i + 1], m.fade) : 0));
  const askAt = W("Tanya dulu");
  const no = ease(f, askAt, m.pop);
  const yes = ease(f, W("jalani?”"), m.pop);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* the stepper: "ingat tiga hal" */}
      <Appear at={W("Kalau mau diringkas")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={0} y={170} w={theme.canvas.width} align="center" size={44} weight={500} text="Ingat tiga hal." mark="tiga hal" />
      </Appear>
      <Appear at={W("ingat tiga hal")} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={CX - STEPPER.gap + STEPPER.size / 2} y1={STEPPER.y} x2={CX - STEPPER.size / 2} y2={STEPPER.y} stroke={theme.color.connectorMute} strokeWidth={2.5} />
          <line x1={CX + STEPPER.size / 2} y1={STEPPER.y} x2={CX + STEPPER.gap - STEPPER.size / 2} y2={STEPPER.y} stroke={theme.color.connectorMute} strokeWidth={2.5} />
        </svg>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: CX + (i - 1) * STEPPER.gap - STEPPER.size / 2, top: STEPPER.y - STEPPER.size / 2 }}>
            <Step n={i + 1} on={active(i)} />
          </div>
        ))}
      </Appear>

      {/* 1 — the faster question, and the one you can walk */}
      <Appear at={W("jangan langsung tanya")} out={two} style={{ left: 0, top: 0 }}>
        <Card x={pairX(0)} y={PAIR.y} w={PAIR.w} h={240} style={{ display: "flex", alignItems: "center", gap: 26, padding: "0 40px", opacity: 1 - 0.45 * no }}>
          <IconDot name="lightning" size={40} neutral />
          <div>
            <div style={{ ...typeStyle("label"), color: c.slate }}>Jangan langsung tanya:</div>
            <div style={{ marginTop: 6, ...typeStyle("title"), fontSize: 44, fontWeight: 500, color: c.ink, opacity: ease(f, W("paling cepat") - m.sec(0.2), m.reveal) }}>“Mana yang paling cepat?”</div>
          </div>
        </Card>
        <Mark kind="cross" p={no} x={pairX(0) + PAIR.w - 30} y={PAIR.y + 30} />
      </Appear>
      <Appear at={askAt - m.sec(0.2)} out={two} rise={0} style={{ left: 0, top: 0 }}>
        <Connector a={{ x: pairX(0) + PAIR.w, y: PAIR.y + 120 }} b={{ x: pairX(1), y: PAIR.y + 120 }} p={ease(f, askAt - m.sec(0.2), m.sec(0.5))} shape="curve" />
      </Appear>
      <Appear at={askAt + m.sec(0.15)} out={two} style={{ left: 0, top: 0 }}>
        <Card x={pairX(1)} y={PAIR.y} w={PAIR.w} h={240} line={theme.color.selfAmber} style={{ display: "flex", alignItems: "center", gap: 26, padding: "0 40px" }}>
          <IconDot name="self-amber" size={40} tint={theme.color.neutralDisc} tone={theme.color.selfAmber} />
          <div>
            <div style={{ ...typeStyle("label"), color: theme.color.selfAmberInk }}>Tanya dulu:</div>
            <div style={{ marginTop: 6, ...typeStyle("title"), fontSize: 44, fontWeight: 500, lineHeight: 1.2, color: c.ink }}>“Mana yang benar-benar bisa aku jalani?”</div>
          </div>
        </Card>
        <Mark kind="check" p={yes} x={pairX(1) + PAIR.w - 30} y={PAIR.y + 30} />
      </Appear>

      {/* 2 — skill and tolerance */}
      {(
        [
          { icon: "wheel", title: "Kemampuan", text: "menentukan siap atau tidak", at: "kemampuan menentukan" },
          { icon: "waves", title: "Toleransi", text: "menentukan besar ombak yang sanggup ditahan.", at: "Toleransi menentukan" },
        ] as const
      ).map((k, i) => (
        <Appear key={k.title} at={W(k.at)} out={three} style={{ left: 0, top: 0 }}>
          <Card x={pairX(i)} y={PAIR.y} w={PAIR.w} h={300} style={{ display: "flex", alignItems: "center", gap: 34, padding: "0 44px" }}>
            <IsoIcon name={k.icon} h={110} />
            <div>
              <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink }}>{k.title}</div>
              <div style={{ marginTop: 8, ...typeStyle("body"), color: c.slate, lineHeight: 1.3 }}>{k.text}</div>
            </div>
          </Card>
        </Appear>
      ))}

      {/* 3 — the insight */}
      <OrangTuntun at={three} />
      {/* "Dan yang paling penting" removed (Simon, 22 Oct); the line, then the two icons under it */}
      <Appear at={W("berani menghadapi ombak")} style={{ left: 0, top: 0 }}>
        <Line x={ORANG_TUNTUN_RIGHT + 90} y={530} w={theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 160} size={60} text="berani menghadapi ombak, belum tentu berarti sudah bisa bawa pesawat." mark="belum tentu" />
      </Appear>
      <Appear at={W("belum tentu")} style={{ left: ORANG_TUNTUN_RIGHT + 90, top: 710, display: "flex", alignItems: "center", gap: 40 }}>
        <IsoIcon name="waves" h={100} />
        <div style={{ ...typeStyle("statement"), fontWeight: 400, color: c.slate }}>≠</div>
        <IsoIcon name="wheel" h={100} />
      </Appear>
    </Stage>
  );
};
