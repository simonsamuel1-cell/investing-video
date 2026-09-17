/**
 * CG-B — SC12 + SC13, the ADMR case. `from 10185 · to 12514`
 *
 * ONE tape, drawn once. SC12 reads the evidence with the future still ahead of
 * it; SC13 re-reads THAT SAME tape after it has played out. If the chart were
 * mounted twice the scene would be saying "here is one chart, and here is
 * another one that agrees with me" — the argument is that the evidence did not
 * change, the reading of it did, and only a carried tape can make it.
 *
 * ═══ WHAT CHANGED, 2026-09-17 ═══
 * The tape is no longer drawn in the house style off a placeholder series. It
 * is Simon's own TradingView export, `ADMR_03.png`, reproduced — traced by
 * scripts/trace-admr2.mjs into data/admr-chart.json and drawn by
 * scenes/AdmrChart.tsx at one uniform scale. His words for the old version were
 * "JELEK BANGET", and he was right: the candle bodies were hairlines, the
 * volume was one flat block and the MACD was a row of blue dashes, because
 * every one of those went through a domain and a grid on the way in.
 *
 * ⚠ THE READING LAYER IS NOT HERE YET, ON PURPOSE. "Kamu ga perlu peduliin
 * dulu bar yang mana yang 11 mei dan 18 mei, itu ga penting. Yang penting
 * gambarnya dulu." The evidence chips, the three dated events and the captions
 * that used to live in this file are in git at 85c4cdb; they were hung on bar
 * indices from the placeholder tape and none of those indices survive the swap,
 * so they come back only once they are re-hung on the traced bars. Nothing in
 * AdmrChart.tsx needs to change when they do — annotations go on top of it.
 *
 * ⚠ AND IT ARRIVES ON A CAMERA CUT, WHICH IS WHY IT HAS NO ENTRANCE OF ITS OWN.
 * SC11 leaves through the outgoing half of CUT11 at f10185; this is the half
 * that cut brings in. `cutInStyle` is read from GLOBAL frames — the Sequence
 * rebases them, so FROM has to be added back. That is the number one bug in
 * this pipeline and it is silent when you get it wrong.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cutInStyle, theme } from "../../../core";
import { CUT11 } from "../data/timing";
import { AdmrChart } from "./AdmrChart";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** The frame this Sequence is mounted on, which is the cut itself. */
const FROM = CUT11.at;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE CUT ITSELF HAS TO BE FENCED OFF THE TWO RESERVES, and nothing else in
 * this episode has needed that before.
 *
 * At rest the window sits at y152..968, clear of the logo zone above it and the
 * subtitle band below. But `cutInStyle` hands it a 120px throw and a 10px blur,
 * and a 10px blur on an 816px-tall dark panel reaches well past its own edge:
 * scripts/audit-frames.mjs failed f10185, f10186, f10190 and f10195 on both
 * reserves at once, with the throw carrying the panel's right edge to x1890
 * while the blur smeared its top up to y142.
 *
 * Shrinking the window to leave room for the blur costs it 30px of height for
 * twenty frames of motion. Clipping the moving half to the band between the two
 * reserves costs nothing and cannot be got wrong later: the reserves are empty
 * because they are OUTSIDE THE CLIP, not because the arithmetic happened to
 * work out. The clip is on the parent, so the filter renders first and is then
 * cut — which is also why it cannot live on the same element as the transform.
 */
const FENCE = {
  clipPath: `inset(${theme.logoZone.height}px 0px ${theme.captionBand.height}px 0px)`,
} as const;

export const AdmrGroup = () => {
  const g = useCurrentFrame() + FROM;
  return (
    <AbsoluteFill style={FENCE}>
      <AbsoluteFill style={cutInStyle(g, CUT11)}>
        <AdmrChart />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
