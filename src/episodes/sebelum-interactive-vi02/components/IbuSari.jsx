/**
 * Ibu Sari as she is in Value Investing V01 (referensi-rizky/Value-Investing-V01, its rig and its shop), so the viewer
 * meets the same person: only the breathing pose is here. A .jsx because tsc must not follow these imports into code
 * written to other settings; IbuSari.d.ts gives the scene its type.
 */
import React from "react";
import { BERDIRI, TokohTegak } from "../../../../referensi-rizky/Value-Investing-V01/src/flat/rigTegak";
import { B } from "../../../../referensi-rizky/Value-Investing-V01/src/theme";

/** `x`, `ground`: where she stands; `s`: the rig's scale; `f`: the frame she breathes on. */
export const IbuSari = ({ x, ground, s, f }) => {
  const breath = Math.sin((2 * Math.PI * f) / 210);
  const sway = Math.sin((2 * Math.PI * f) / 420 + 1.3);
  const pose = { ...BERDIRI, badan: 0.6 * breath + 0.8 * sway, kepala: -0.6 * breath };
  return (
    <svg width={800} height={900} style={{ position: "absolute", left: x - 400, top: ground - 820, overflow: "visible" }}>
      <TokohTegak x={400} tanah={820} s={s} pose={pose} kostum="kini" kepala={{ set: "wanita", eks: "netral" }} baju={B.blue} sepatu={B.night} bayangan={false} />
    </svg>
  );
};
