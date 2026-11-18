/**
 * VI03's switches: a rebuilt scene keeps its earlier versions behind a switch, so any can be shown again.
 * SC02_LOOK — "build": one layout built sentence by sentence in VI01/VI02's language (Simon 16 Nov: "pelajarin dulu deh dari
 * VI01-VI02"); "take": one camera take (SecondPillarFlow.tsx, rejected: "jelek banget"); "shots": the first build, one Shot per
 * sentence (SecondPillar.tsx, rejected: "kebanyakan transisi camera cut").
 */
export const SC02_LOOK: "build" | "take" | "shots" = "build";

/** SC01_LOOK — "build": one story frame built sentence by sentence (16 Nov, "lanjut scene 1 dengan cara yang sama");
 * "shots": the first build, one Shot per sentence (BuyingMangoes.tsx). */
export const SC01_LOOK: "build" | "shots" = "build";

/** SC03_LOOK — "sendiri": Simon builds it himself from Studio 3802, empty till then (17 Nov; IbuSariSendiri.tsx);
 * "build": one layout built sentence by sentence (17 Nov, "lanjut revisi scene 3"; IbuSariBuild.tsx);
 * "shots": the first build, one Shot per sentence (IbuSariValue.tsx). */
export const SC03_LOOK: "sendiri" | "build" | "shots" = "sendiri";

/** SC04_LOOK — "build": told the way SC03 was (17 Nov, "pelajarin cara storytelling nya scene 1-3, lalu revisi scene 4";
 * MarginBuild.tsx); "shots": the first build, one Shot per sentence (MarginOfSafety.tsx). */
export const SC04_LOOK: "build" | "shots" = "build";

/** SC05_LOOK — "build": told the way SC03/SC04 were (17 Nov, "lanjut revisi scene 5"; BbcaBuild.tsx); "shots": the first build
 * (BbcaTwoPrices.tsx). */
export const SC05_LOOK: "build" | "shots" = "build";

/** SC06_LOOK — "build": told the way SC01–SC03 were (17 Nov, "Habis ini langsung revisi scene 06"; FutureValueBuild.tsx);
 * "shots": the first build (RealCheap.tsx). */
export const SC06_LOOK: "build" | "shots" = "build";

/** SC07: live mindmap with one worked example per branch (IllusionsMindmap). */
export const SC07_LOOK: "build" | "shots" = "build";
