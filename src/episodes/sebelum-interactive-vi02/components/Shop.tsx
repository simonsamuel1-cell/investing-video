/**
 * Ibu Sari's shop in a window: Value Investing V01's art (toko-dunia.svg) with her in front of its door, used by SC03 and
 * SC05, and her name board on its roof. toko-dunia.svg is 2250 × 500 units from x −750; the shop's middle is at 375, her spot
 * at 295, the pavement at 433.
 */
import type React from "react";
import { Img, staticFile } from "remotion";
import { theme, typeStyle, usePalette } from "../../../core";
import { IbuSari } from "./IbuSari";
import { MONO } from "./kit";

export const SHOP = { w: 1040, y: theme.logoZone.height, h: theme.captionBand.top - 22 - theme.logoZone.height, left: theme.margin.left };
const ART = { w: 2250, h: 500, x0: -750, centre: 375, her: 295, pavement: 433, k: 1.36, at: 390, rig: 0.53 / 2.5 };
const artTop = SHOP.h - ART.h * ART.k;
const artX = (u: number) => ART.at + (u - ART.centre) * ART.k;
/** Her name board, on the front of the roof. */
const BOARD = { w: 280, h: 68, y: 268, size: 40 };

const NameBoard = () => {
  const c = usePalette();
  return (
    <div style={{ position: "absolute", left: ART.at - BOARD.w / 2, top: BOARD.y, width: BOARD.w, height: BOARD.h, borderRadius: 14, background: c.cardBg, boxShadow: `inset 0 0 0 4px ${theme.color.worldCartonDark}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: BOARD.size, color: c.ink, whiteSpace: "nowrap" }}>Ibu Sari</div>
  );
};

/** `close` zooms in on her door; `children` stand in the window, over the art. */
export const ShopWindow = ({ x, f, close = 1, shadow, children }: { x: number; f: number; close?: number; shadow: string; children?: React.ReactNode }) => (
  <div style={{ position: "absolute", left: x, top: SHOP.y, width: SHOP.w, height: SHOP.h, borderRadius: theme.shape.cardRadius, overflow: "hidden", boxShadow: shadow, background: `linear-gradient(to bottom, ${theme.color.worldMorning}, ${theme.color.worldWall})` }}>
    <div style={{ position: "absolute", inset: 0, filter: MONO, transform: `scale(${close.toFixed(4)})`, transformOrigin: `${artX(ART.her) + 80}px ${artTop + ART.pavement * ART.k}px` }}>
      <Img src={staticFile("rizky/Value-Investing-V01/public/flat/toko/toko-dunia.svg")} style={{ position: "absolute", left: artX(ART.x0), top: artTop, width: ART.w * ART.k, height: ART.h * ART.k, maxWidth: "none" }} />
      <NameBoard />
      <IbuSari x={artX(ART.her)} ground={artTop + ART.pavement * ART.k} s={ART.rig * ART.k} f={f} />
    </div>
    {children}
  </div>
);
