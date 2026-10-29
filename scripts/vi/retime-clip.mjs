#!/usr/bin/env node
/**
 * retime-clip.mjs — fit a supplied screen recording to the VO by re-timing it piecewise, so what happens in the
 * recording lands on the words that talk about it (VI07 SC05: each typed question on the spoken one, the answer on
 * "Tuntun AI membantu"). The pixels are untouched; only time is remapped.
 *
 *   node scripts/vi/retime-clip.mjs src/episodes/<ep>/data/<clip>.clip.json
 *
 * The spec names the source, the published path, the scene, an optional `crop` (ffmpeg w:h:x:y — e.g. the black
 * columns a recording carries at its edges), and `pairs`: a phrase of that scene (`say`, optional
 * `nth` and `edge` as in timing.ts's `w`, plus `plus` frames for a beat Simon gave between words) and the second of the
 * recording that should be on screen then (`src`). A freeze is two pairs one source frame apart. `id` names a pair
 * the scene reads (e.g. the freeze it draws a highlight over).
 * Output: <out> as 60 fps H.264 without audio, frame 0 = the scene's first frame, the last frame held to `tail`
 * seconds after the last pair; and <clip>.retime.json beside the spec, which the scene checks at load, so a VO
 * revision that moves the words fails loudly instead of drifting (rerun this script then).
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const FPS = 60;
const specPath = process.argv[2];
if (!specPath) throw new Error("usage: retime-clip.mjs <clip>.clip.json");
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const { words } = JSON.parse(readFileSync(join(dirname(specPath), "words.json"), "utf8"));

// the scene's first frame — the same midpoint rule as timing.ts BLOCK
const norm = (s) => s.toLowerCase().replace(/[^0-9a-z]/g, "");
const scenes = [...new Set(words.map((x) => x.scene))].sort((a, b) => a - b);
const speech = (n) => {
  const ws = words.filter((x) => x.scene === n);
  return { first: Math.min(...ws.map((x) => x.f0)), last: Math.max(...ws.map((x) => x.f1)) };
};
const i = scenes.indexOf(spec.scene);
const start = i === 0 ? 0 : Math.floor((speech(scenes[i - 1]).last + speech(spec.scene).first) / 2);

const w = (phrase, nth = 0, edge = "f0") => {
  const ws = words.filter((x) => x.scene === spec.scene);
  const q = phrase.split(/\s+/).map(norm).filter(Boolean);
  const hits = [];
  for (let k = 0; k + q.length <= ws.length; k++) if (q.every((t, j) => norm(ws[k + j].w) === t)) hits.push(k);
  if (hits[nth] === undefined) throw new Error(`"${phrase}" #${nth} not found in SC${spec.scene}`);
  return edge === "f0" ? ws[hits[nth]].f0 : ws[hits[nth] + q.length - 1].f1;
};

const pairs = spec.pairs.map((p) => ({ ...p, out: w(p.say, p.nth ?? 0, p.edge ?? "f0") + (p.plus ?? 0) - start }));
const knots = [{ out: 0, src: 0 }, ...pairs];
knots.slice(1).forEach((k, j) => {
  if (k.out <= knots[j].out || k.src <= knots[j].src) throw new Error(`pairs must rise in both clocks: "${k.say}"`);
});

// setpts maps INPUT time → output time: the inverse of the pairs, one linear piece per gap
const piece = (j) => {
  const a = knots[j], b = knots[j + 1];
  const k = b ? (b.out / FPS - a.out / FPS) / (b.src - a.src) : 1;
  return `${(a.out / FPS).toFixed(4)}+(T-${a.src})*${k.toFixed(6)}`;
};
let expr = piece(knots.length - 1);
for (let j = knots.length - 2; j >= 0; j--) expr = `if(lt(T\\,${knots[j + 1].src})\\,${piece(j)}\\,${expr})`;

const frames = knots[knots.length - 1].out + Math.round((spec.tail ?? 1) * FPS);
const out = resolve(spec.out);
mkdirSync(dirname(out), { recursive: true });
const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", spec.in, "-vf", `${spec.crop ? `crop=${spec.crop},` : ""}setpts=(${expr})/TB,fps=${FPS},tpad=stop_mode=clone:stop_duration=${spec.tail ?? 1}`, "-frames:v", String(frames), "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], { stdio: "inherit" });
if (r.status !== 0) throw new Error("ffmpeg failed");

const probe = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", out], { encoding: "utf8" });
const [width, height] = probe.stdout.trim().split(",").map(Number);
const meta = { scene: spec.scene, start, fps: FPS, frames, src: spec.public, width, height, pairs: pairs.map(({ id = "", say, nth = 0, edge = "f0", plus = 0, out, src }) => ({ id, say, nth, edge, plus, out, src })) };
writeFileSync(specPath.replace(/\.clip\.json$/, ".retime.json"), JSON.stringify(meta, null, 2) + "\n");
console.log(`${out}: ${frames} frames from SC${spec.scene} f${start}`);
pairs.forEach((p) => console.log(`  ${String(p.out).padStart(5)}f  ${p.src.toFixed(3)}s  ${p.say}${p.plus ? ` +${p.plus}` : ""}${p.id ? `  [${p.id}]` : ""}`));
