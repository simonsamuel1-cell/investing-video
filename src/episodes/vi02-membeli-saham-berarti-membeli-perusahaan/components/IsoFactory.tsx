/**
 * Simon's factory.svg (6 Nov) in Template-iso-plant's style, on the same grey paper. The art comes from
 * scripts/vi/vi02-plant-restyle.py, which keeps every shape of his file and repaints it.
 */
import { AbsoluteFill, Img, staticFile } from "remotion";
import { theme } from "../../../core";

const ART = { h: 980 };

export const IsoFactory = () => (
  <AbsoluteFill style={{ background: theme.color.plantPaper, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Img src={staticFile("art/vi02/plant/factory.svg")} style={{ height: ART.h, width: "auto" }} />
  </AbsoluteFill>
);
