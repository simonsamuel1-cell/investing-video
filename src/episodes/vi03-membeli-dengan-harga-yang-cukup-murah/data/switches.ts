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
