// What the "remotion" import means inside referensi-rizky/Value-Investing-V01/ (see webpack.mjs): the real thing, except that
// its files live under public/rizky/, and its .wav VOs were never in the repo, so they play as silence.
import React from "react";
import { Audio as RealAudio, staticFile as realStaticFile } from "remotion";

export * from "remotion";
export const staticFile = (p: string) => realStaticFile(`rizky/Value-Investing-V01/public/${p.replace(/^\//, "")}`);
export const Audio = (props: React.ComponentProps<typeof RealAudio>) => (String(props.src).endsWith(".wav") ? null : <RealAudio {...props} />);
