/**
 * Rizky's five videos in our Studio, as references (Simon, 4 Nov 2026: "video dari branch lain ga kamu masukin ke
 * Module 1 ini?"). They stay his projects in referensi-rizky/, each loaded only when its comp is opened. Lengths are
 * their own (their TOTAL + OUTRO_N). No VO: the .wav files are not in the repo. A .jsx because tsc must not follow
 * these imports into code written to other settings; RizkyComps.d.ts gives Root.tsx its type.
 */
import React from "react";
import { Composition, Folder } from "remotion";

const episode = (load) => () => load().then((m) => ({ default: m.Episode }));
const COMPS = [
  { id: "Rizky-InvestmentInstruments", frames: 22194, lazyComponent: episode(() => import("../referensi-rizky/Investing-101-V02/src/Episode")) },
  { id: "Rizky-TigaJenisUang", frames: 28911, lazyComponent: episode(() => import("../referensi-rizky/Investing-101-V03/src/Episode")) },
  { id: "Rizky-JalurBertumbuh", frames: 29597, lazyComponent: episode(() => import("../referensi-rizky/Investing-101-V05/src/Episode")) },
  { id: "Rizky-KesalahanInvestor", frames: 31777, lazyComponent: episode(() => import("../referensi-rizky/Investing-101-V06/src/Episode")) },
  { id: "Rizky-ApaItuValueInvesting", frames: 38524, lazyComponent: episode(() => import("../referensi-rizky/Value-Investing-V01/src/Episode")) },
];

export const RizkyComps = () => (
  <Folder name="Rizky">
    {COMPS.map(({ id, frames, lazyComponent }) => (
      <Composition key={id} id={id} lazyComponent={lazyComponent} durationInFrames={frames} fps={60} width={1920} height={1080} />
    ))}
  </Folder>
);
