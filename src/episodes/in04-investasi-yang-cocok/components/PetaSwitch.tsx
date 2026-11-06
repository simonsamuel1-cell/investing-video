/**
 * The before/after switch for the 2 Nov 2026 revision (the boss's notes: "rumah" → "tujuan investasi", one master
 * route map). Simon: "sebelum visualnya diganti, dibuatin switch dulu ya, switch before after".
 *
 *   baru (after)  — the master route map (components/RouteMap.tsx): SC02 and SC03's opening.
 *   lama (before) — the two islands and the house (components/Islands.tsx), as approved on 22 Oct.
 *
 * Studio has both: "IN04-InvestasiYangCocok" (baru) and "IN04-InvestasiYangCocok-Sebelum" (lama). The VO is the new
 * one in both — only the picture switches. To make "lama" the episode again, flip PETA_BARU.
 */
import React, { createContext, useContext } from "react";

export const PETA_BARU = true;

const Ctx = createContext(PETA_BARU);
export const PetaProvider = ({ baru, children }: { baru: boolean; children: React.ReactNode }) => <Ctx.Provider value={baru}>{children}</Ctx.Provider>;
export const usePetaBaru = () => useContext(Ctx);
