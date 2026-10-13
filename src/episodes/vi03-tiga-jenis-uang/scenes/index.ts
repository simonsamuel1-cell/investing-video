/** Scene registry — a built scene replaces its placeholder here. */
import type React from "react";
import { BLOCK } from "../data/timing";
import { placeholder } from "./Placeholder";

type Key = Exclude<keyof typeof BLOCK, "END">;
export const SCENE_COMPONENTS: Record<Key, React.FC> = {
  SC01: placeholder(1, BLOCK.SC01),
  SC02: placeholder(2, BLOCK.SC02),
  SC03: placeholder(3, BLOCK.SC03),
  SC04: placeholder(4, BLOCK.SC04),
  SC05: placeholder(5, BLOCK.SC05),
  SC06: placeholder(6, BLOCK.SC06),
  SC07: placeholder(7, BLOCK.SC07),
  SC08: placeholder(8, BLOCK.SC08),
  SC09: placeholder(9, BLOCK.SC09),
  SC10: placeholder(10, BLOCK.SC10),
  SC11: placeholder(11, BLOCK.SC11),
  SC12: placeholder(12, BLOCK.SC12),
  SC13: placeholder(13, BLOCK.SC13),
  SC14: placeholder(14, BLOCK.SC14),
  SC15: placeholder(15, BLOCK.SC15),
  SC16: placeholder(16, BLOCK.SC16),
  SC17: placeholder(17, BLOCK.SC17),
  SC18: placeholder(18, BLOCK.SC18),
  SC19: placeholder(19, BLOCK.SC19),
  SC20: placeholder(20, BLOCK.SC20),
};
