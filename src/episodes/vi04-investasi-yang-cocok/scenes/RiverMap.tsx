/**
 * VI04 · SC02 — "Mulai dari Pertanyaan yang Tepat", on the MASTER ROUTE MAP (2 Nov 2026: the boss's notes via
 * Simon — "rumah" → "tujuan investasi", the goal FAR away, one master map reused later; storyboard
 * docs/vi-style/storyboards/VI04-SC02-v3.jpg, panel A). The switch's "baru" side; scenes/River.tsx is "lama".
 *
 *  A  "Bayangin kamu berdiri di satu sisi sungai,": the camera starts close on Kamu, the river beside him — the land,
 *     Kamu, the river rise on their words. "sementara tujuan investasimu berada jauh di seberang.": the camera travels
 *     east along the map, a long way, to the flag (it pops up on "jauh"), then pulls out to the whole map — Kamu at
 *     one end, the flag at the other (Simon, 2 Nov: "buat ilustrasi jarak antara karakter dengan tujuan tuh jauh";
 *     his reference: the camera riding a trip on a flat map, then pulling out to all of it).
 *  B  "Kebanyakan orang … “Mana yang paling cepat?”": the map settles small at the bottom, the question card comes
 *     in above; "bukan itu": it greys and gets a ✕.
 *  C  "Yang lebih penting: “Cara mana … sampai tujuan?”": the second card; on "tujuan" the flag gets a ✓. No route
 *     is drawn yet — the three ways are SC03's.
 *  D  "Sebelum menentukan investasinya, kita perlu kenali diri kita dulu": the cards go and the camera dives onto
 *     Kamu while the line is said. SC03 opens on this frame.
 */
import { useCurrentFrame } from "remotion";
import { SoftGround, Stage, theme, useMotion } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, ease, useWords } from "../components/kit";
import { mixFrame } from "../components/Islands";
import { MAP_FRAME, MapCamera } from "../components/RouteMap";
import { KenaliLine, QuestionCards } from "./River";

export const SC02Baru = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const W = useWords(2, BLOCK.SC02);
  const g = f + BLOCK.SC02;

  const picAt = W("Bayangin");
  const goalAt = W("jauh");
  const askAt = W("Kebanyakan");
  const notAt = W("bukan itu");
  const betterAt = W("Yang lebih penting");
  const lineAt = W("Sebelum menentukan");

  // near Kamu → the long pan east to the flag → out to the whole map → small under the cards → the dive onto Kamu
  const pan = ease(f, W("sementara"), m.sec(2.6));
  const out = ease(f, W("seberang") - m.sec(0.25), m.sec(1.1));
  const settle = ease(f, askAt + m.sec(0.3), m.move);
  const dive = ease(f, lineAt, m.sec(1.2));
  const fr = [[MAP_FRAME.goal, pan], [MAP_FRAME.full, out], [MAP_FRAME.low, settle], [MAP_FRAME.dive, dive]].reduce((a, [b, t]) => mixFrame(a, b as typeof a, t as number), MAP_FRAME.near);
  const yes = ease(f, W("tujuan", 1), m.pop);

  return (
    <Stage>
      <SoftGround f={g} />

      {/* A–D — the map, framed by a camera that never cuts away */}
      <Appear at={picAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <MapCamera fr={fr} g={g} landAt={picAt} youAt={W("kamu berdiri")} riverAt={W("satu sisi sungai")} goalAt={goalAt} check={yes * (1 - dive)} />
      </Appear>

      <QuestionCards W={W} askAt={askAt} notAt={notAt} betterAt={betterAt} lineAt={lineAt} />

      {/* D — the line, while the camera dives onto Kamu (SC03 opens on it and lets it go) */}
      <Appear at={lineAt + m.sec(0.3)} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <KenaliLine main={ease(f, W("kita perlu"), m.reveal)} />
      </Appear>
    </Stage>
  );
};
