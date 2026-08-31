#!/usr/bin/env node
/**
 * scripts/audit.mjs — the STATIC half of the brand audit.
 *
 * Run:  node scripts/audit.mjs [srcDir]
 * Exit: 0 clean, 1 violations found.
 *
 * These are the rules that were previously enforced by memory, which is why
 * they drifted: five SafeAreas, four theme schemas, a background that changed
 * to #FFFFFF in one episode and nowhere else.
 *
 * ⚠ WHAT THIS CANNOT SEE. Nothing here proves an element stayed out of the
 * subtitle band or the logo zone — that is geometry at render time, and it is
 * checked by scripts/audit-frames.mjs against rendered stills. Treat the two as
 * one gate: this one first because it is instant, that one before a build is
 * called done.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, basename } from "node:path";

const SRC = process.argv[2] ?? "src";
const isCorePath = (f) => /(^|[\\/])core[\\/]/.test(f);
const isThemePath = (f) => /(^|[\\/])core[\\/]theme\.ts$/.test(f);
/**
 * The one file whose colours are NOT the palette's. A supplied brand mark is
 * reproduced, never re-tinted: a logo that follows a theme swap has stopped
 * being the logo. Matched by FILENAME, the same mechanism that confines
 * candleGreen/candleRed to Candles.tsx — an exemption you can see from the
 * file listing rather than one buried in a pragma.
 */
const isBrandAsset = (f) => /(^|[\\/])TuntunMark\.tsx$/.test(f);

/** Names an episode must never define for itself. */
const CORE_EXPORTS = [
  "Stage", "Card", "Layer", "Title", "Line", "Words", "Chip", "Ping",
  "HighlightBox", "HighlightCircle", "Captions", "Watermark", "SafeArea",
  "Subtitles", "TuntunMark",
];

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(p)) files.push(p);
  }
})(SRC);

const problems = [];
const add = (file, line, rule, msg) =>
  problems.push({ file: relative(process.cwd(), file), line, rule, msg });

/** Strip block and line comments so prose about a rule never trips the rule. */
const strip = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
   .replace(/\/\/[^\n]*/g, "");

for (const file of files) {
  const isCore = isCorePath(file);
  const isTheme = isThemePath(file);
  const raw = readFileSync(file, "utf8");
  const code = strip(raw);
  const lines = code.split("\n");

  lines.forEach((ln, i) => {
    const n = i + 1;

    // 1 — palette is closed. Hex literals live in core/theme.ts and nowhere
    //     else, with one named exception: the brand mark. See isBrandAsset.
    if (!isTheme && !isBrandAsset(file)) {
      const hex = ln.match(/#[0-9A-Fa-f]{6}\b/);
      if (hex) add(file, n, "palette", `hex literal ${hex[0]} — use a theme/palette slot`);
      const rgba = ln.match(/rgba?\(\s*\d+\s*,/);
      if (rgba && !isCore) add(file, n, "palette", "rgba() literal — use a theme wash");
    }

    // 2 — fps is the Composition's. A component may not name it.
    if (/\bfps\s*[:=]\s*\d+/.test(ln))
      add(file, n, "fps", "fps written as a literal — read useVideoConfig().fps");

    // 3 — durations must come from useMotion, not typed as frames.
    if (/\b(duration|over|fade|reveal|pop|hold|delay)\s*[:=]\s*\d{1,4}\b/.test(ln) &&
        !isCore && !file.includes("Composition") && !file.includes("/data/") && !file.includes("subtitles"))
      add(file, n, "frames", "bare frame count for a duration — use useMotion()");

    // 4 — candle colours are for candle bodies and wicks only.
    if (/candle(Green|Red)/.test(ln) && !/Candle/i.test(basename(file)) && !isCore)
      add(file, n, "candle-colour", "candleGreen/candleRed outside a candle component");

    // 5 — episodes never reach into each other.
    const cross = ln.match(/from\s+["'][^"']*\/(episode[A-Za-z0-9]+)\//);
    if (cross && !file.includes(cross[1]))
      add(file, n, "isolation", `imports from ${cross[1]} — episodes are independent`);

    // 6 — core is imported, never re-declared.
    if (!isCore) {
      const decl = ln.match(/export\s+const\s+([A-Z]\w+)\s*=/);
      if (decl && CORE_EXPORTS.includes(decl[1]))
        add(file, n, "duplicate", `redefines core component ${decl[1]} — import it instead`);
    }

    // 7 — margins are the theme's.
    if (/\b(96|54|108|1920|1080|360)\b/.test(ln) && /(margin|padding|left|right|top|bottom|width|height)\s*[:=]/i.test(ln) && !isCore)
      add(file, n, "layout", "canvas or margin number typed by hand — derive it from theme");
  });

  // 8 — every core component must accept a palette rather than a fixed colour.
  if (isCore && /\.tsx$/.test(file) && /theme\.color\.(indigo|cyan|ink|bg|slate)\b/.test(code) && !/usePalette/.test(code))
    add(file, 1, "palette", "reads theme.color directly — use usePalette() so segments reach it");
}

const byRule = {};
for (const p of problems) (byRule[p.rule] ??= []).push(p);

if (!problems.length) {
  console.log(`✓ audit clean — ${files.length} files`);
  process.exit(0);
}
console.log(`✗ ${problems.length} violations in ${files.length} files\n`);
for (const [rule, list] of Object.entries(byRule)) {
  console.log(`── ${rule} (${list.length})`);
  for (const p of list.slice(0, 12)) console.log(`   ${p.file}:${p.line}  ${p.msg}`);
  if (list.length > 12) console.log(`   … ${list.length - 12} more`);
  console.log();
}
process.exit(1);
