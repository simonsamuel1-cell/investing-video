/**
 * The shared components as SCENES use them: each call gets a handle in Studio (core/nudge.tsx). Scene files import these names from
 * here; components and kits keep importing the plain ones, so a handle is never shared by several scenes or videos.
 */
import { Title as CoreTitle, Line as CoreLine, Words as CoreWords, nudgeable } from "./core";
import { Chip as TA03Chip } from "./episodeCandlestick/components/Chip";
import { Cutout as IN01Cutout, Say as IN01Say, Pill as IN01Pill } from "./episodes/in01-passive-income/components/kit";
import { Appear as A, Card as C, Line as L } from "./episodes/in04-investasi-yang-cocok/components/kit";
import { Disc as IN07Disc } from "./episodes/in07-cara-tuntun-membantu-investor/components/kit";
import { Figure as F, Pic as P } from "./episodes/vi01-apa-itu-value-investing/components/kit";
import { Drawing as D2, IconDisc as I2, WordPill as W2 } from "./episodes/vi02-membeli-saham-berarti-membeli-perusahaan/components/kit";
import { Drawing as D3 } from "./episodes/vi03-membeli-dengan-harga-yang-cukup-murah/components/kit";

export const CoreTitleE = nudgeable("Judul", CoreTitle);
export const CoreLineE = nudgeable("Teks", CoreLine);
export const CoreWordsE = nudgeable("Teks", CoreWords);
export const TA03ChipE = nudgeable("Label", TA03Chip);
export const IN01CutoutE = nudgeable("Orang", IN01Cutout);
export const IN01SayE = nudgeable("Teks", IN01Say);
export const IN01PillE = nudgeable("Pill", IN01Pill);
export const AppearE = nudgeable("Muncul", A);
export const CardE = nudgeable("Kartu", C);
export const LineE = nudgeable("Teks", L);
export const DiscE = nudgeable("Ikon", IN07Disc);
export const FigureE = nudgeable("Gambar", F);
export const PicE = nudgeable("Gambar", P);
export const DrawingVI02E = nudgeable("Gambar", D2);
export const IconDiscE = nudgeable("Ikon", I2);
export const WordPillE = nudgeable("Pill", W2);
export const DrawingVI03E = nudgeable("Gambar", D3);
