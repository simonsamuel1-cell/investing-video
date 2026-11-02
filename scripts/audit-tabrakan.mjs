// AUDIT TABRAKAN (porting dari Video 02 Candlestick, 14 Okt) — tahap 1: ukur. Merender frame dengan inputProps.audit,
// probe (src/audit/AuditProbe.tsx) mencetak kotak layar setiap
// teks / permukaan / bentuk / garis / candle; baris itu ditangkap di sini dan
// ditulis ke out/audit/kotak.jsonl. Penilaian: scripts/audit-tabrakan.py.
//
// Pakai: node scripts/audit-tabrakan.mjs [langkah=20] [awal=0] [akhir=19488]
//        node scripts/audit-tabrakan.mjs daftar 4792,7415   (frame tertentu)
import { bundle } from "@remotion/bundler";
import { renderFrames, selectComposition } from "@remotion/renderer";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const DAFTAR = argv[0] === "daftar" ? argv[1].split(",").map(Number) : null;
const LANGKAH = DAFTAR ? 1 : Number(argv[0] ?? 20);
const AWAL = DAFTAR ? 0 : Number(argv[1] ?? 0);
const AKHIR = DAFTAR ? 0 : Number(argv[2] ?? 28381);
const OUT = path.resolve("out/audit");
mkdirSync(OUT, { recursive: true });
const inputProps = { audit: true };

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "ApaItuValueInvesting", inputProps });
const baris = new Map();
const galat = [];
const tangkap = (log) => {
  const t = log.text ?? "";
  if (t.startsWith("AUDIT{")) { const j = JSON.parse(t.slice(5)); baris.set(j.f, t.slice(5)); }
  else if (t.startsWith("AUDITERR")) galat.push(t);
};
const tmp = path.join(OUT, "_frames");
const jalan = async (frameRange, everyNthFrame) => {
  rmSync(tmp, { recursive: true, force: true });
  await renderFrames({
    composition, serveUrl, inputProps, outputDir: tmp, imageFormat: "jpeg", jpegQuality: 20,
    scale: 0.25, frameRange, everyNthFrame, onBrowserLog: tangkap, onStart: () => {}, logLevel: "error",
    onFrameUpdate: (n) => { if (n % 50 === 0) process.stdout.write(`\r  ${n} frame`); },
  });
};
if (DAFTAR) for (const f of DAFTAR) await jalan([f, f], 1);
else await jalan([AWAL, AKHIR], LANGKAH);
rmSync(tmp, { recursive: true, force: true });
rmSync(serveUrl, { recursive: true, force: true }); // bundle ±950 MB per panggilan
const frames = [...baris.keys()].sort((a, b) => a - b);
writeFileSync(path.join(OUT, "kotak.jsonl"), frames.map((f) => baris.get(f)).join("\n") + "\n");
console.log(`\nterukur ${frames.length} frame → out/audit/kotak.jsonl` + (galat.length ? ` · GALAT ${galat.length}: ${galat[0]}` : ""));
