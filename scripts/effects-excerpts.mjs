// effects-excerpts.mjs — effects that live inside a scene: muted clips of the finished videos (Hasil/*_Full.mp4).
// excerpts.tsv: video, 5 s tile of its contact sheet (clip = tile×5 s − 4 … + 2), group, name, how. Writes excerpts.json (codes are kept
// once given) and public/effects-library/<code>.mp4 (640 px) + .jpg for the missing ones.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
const HASIL = `${homedir()}/Documents/01 Academy/Hasil`, OUT = "public/effects-library", J = "src/effects-library/excerpts.json";
const GROUP = { TK: "Teks", KT: "Kotak & sorotan", PH: "Penghubung", CH: "Chart", UI: "UI", DT: "Angka & data", LT: "Latar & maskot", KM: "Kamera", OR: "Orang & ilustrasi" };
const file = Object.fromEntries(readdirSync(HASIL).filter((f) => f.endsWith("_Full.mp4")).map((f) => [f.slice(0, 4), f]));
const compIds = [...readFileSync("src/Root.tsx", "utf8").matchAll(/id="((?:TA|IN|VI)\d\d-[^"]+)"/g)].map((m) => m[1]);
const old = existsSync(J) ? JSON.parse(readFileSync(J, "utf8")) : [];
const base = readFileSync("src/effects-library/effects.tsx", "utf8");
const next = {};
const bump = (id) => { const [g, n] = id.split("-"); next[g] = Math.max(next[g] ?? 0, +n); };
[...base.matchAll(/id: "([A-Z]{2}-\d\d)"/g)].forEach((m) => bump(m[1]));
old.forEach((e) => bump(e.id));
const rows = readFileSync("src/effects-library/excerpts.tsv", "utf8").trim().split("\n").map((l) => l.split("\t"));
const out = rows.map(([video, tile, g, name, how]) => {
  const was = old.find((e) => e.video === video && e.name === name);
  const id = was?.id ?? `${g}-${String((next[g] = (next[g] ?? 0) + 1)).padStart(2, "0")}`;
  const start = Math.max(0, +tile * 5 - 4);
  return { id, group: GROUP[g], name, how, video, start, comp: compIds.find((c) => c.startsWith(video + "-")) ?? "" };
});
writeFileSync(J, JSON.stringify(out, null, 1) + "\n");
for (const e of out) {
  const mp4 = `${OUT}/${e.id}.mp4`, was = old.find((o) => o.id === e.id);
  if (existsSync(mp4) && was?.start === e.start) continue;
  const src = `${HASIL}/${file[e.video]}`;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(e.start), "-t", "6", "-i", src, "-an", "-vf", "fps=30,scale=640:-2", "-c:v", "libx264", "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", "4.2", "-i", mp4, "-frames:v", "1", "-vf", "scale=384:-2", mp4.replace("mp4", "jpg")]);
}
console.log(out.length, "excerpts;", "no composition:", [...new Set(out.filter((e) => !e.comp).map((e) => e.video))].join(" ") || "none");
