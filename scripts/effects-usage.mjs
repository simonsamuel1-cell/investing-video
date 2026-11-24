// effects-usage.mjs — which videos use each effect in src/effects-library/effects.tsx: its `symbol` imported by name in the
// episodes' code. Writes src/effects-library/usage.json. Re-run after a video is built.
// TA01, TA03 and TA05 are left out: they carry their own same-named components, not core's.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
const VIDEOS = { "TA07": "src/episodes/019-moving-average", "TA09": "src/episodes/020-volume", "TA11": "src/episodes/022-ta-mistakes", "IN01": "src/episodes/in01-passive-income", "IN04": "src/episodes/in04-investasi-yang-cocok", "IN07": "src/episodes/in07-cara-tuntun-membantu-investor", "VI01": "src/episodes/vi01-apa-itu-value-investing", "VI02": "src/episodes/vi02-membeli-saham-berarti-membeli-perusahaan", "VI03": "src/episodes/vi03-membeli-dengan-harga-yang-cukup-murah" };
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(n) ? [p] : []; });
const code = Object.entries(VIDEOS).flatMap(([v, d]) => { try { return [[v, walk(d).map((p) => readFileSync(p, "utf8").replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, "")).join("\n")]]; } catch { console.warn("missing", v, d); return []; } });
const src = readFileSync("src/effects-library/effects.tsx", "utf8");
const symbols = [...new Set([...src.matchAll(/symbol: "([^"]+)"/g)].map((m) => m[1]))];
const out = Object.fromEntries(symbols.map((s) => [s, code.filter(([, t]) => new RegExp(`(export const ${s} = )|import (type )?\\{[^}]*\\b${s}\\b[^}]*\\}`).test(t)).map(([v]) => v)]));
// their own component of the same effect
const ALSO = { Ping: ["TA01", "TA03"] };
for (const [s, v] of Object.entries(ALSO)) if (out[s]) out[s] = [...new Set([...v, ...out[s]])];
writeFileSync("src/effects-library/usage.json", JSON.stringify(out, null, 1) + "\n");
console.log(symbols.length, "symbols;", "unused:", symbols.filter((s) => !out[s].length).join(", ") || "none");
