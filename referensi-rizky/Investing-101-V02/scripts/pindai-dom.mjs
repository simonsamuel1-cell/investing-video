// PINDAI DOM (15 Okt) — tahap 1: ukur. Untuk scripts/hilang-dom.py (elemen hilang / muncul / loncat dalam SATU frame).
// Kenapa: pindai piksel (jeglek-lokal.py, blok 64 px, skala 0,5) merata-ratakan blok → elemen < ±30 px yang hilang tidak terlihat. Probe DOM
// (src/audit/AuditProbe.tsx, hanya aktif dengan inputProps.audit) mencatat SETIAP teks / gambar / kartu / bentuk beserta opasitas efektif,
// skala CSS, kotak layar & berkas gambarnya — ukurannya tidak berpengaruh.
// Pakai: JENDELA="8800-8860,13330-13370" KE=nama [ENTRY=src/index.ts] node scripts/pindai-dom.mjs   → out/dom/<KE>.jsonl
//        (frame berurutan, LANGKAH 1; screenshot dibuang — jpeg 0,25 hanya karena renderFrames wajib memotret)
import { bundle } from "@remotion/bundler";
import { renderFrames, selectComposition } from "@remotion/renderer";
import { mkdirSync, rmSync, createWriteStream } from "node:fs";
import path from "node:path";

const JENDELA = process.env.JENDELA.split(",").map((w) => w.split("-").map(Number));
const KE = process.env.KE || "dom";
const ENTRY = path.resolve(process.env.ENTRY || "src/index.ts");
const OUT = path.resolve("out/dom");
mkdirSync(OUT, { recursive: true });
const inputProps = { audit: true };
const serveUrl = await bundle({ entryPoint: ENTRY });
const composition = await selectComposition({ serveUrl, id: "InvestmentInstruments", inputProps });
// PISAH=1: satu berkas per jendela (<KE>_<awal>.jsonl) — sapuan seluruh video tidak dimuat sekaligus oleh penilai
const PISAH = process.env.PISAH === "1";
let tulis = createWriteStream(path.join(OUT, `${KE}${PISAH ? "_" + JENDELA[0][0] : ""}.jsonl`));
let n = 0, galat = 0;
const tangkap = (log) => {
  const t = log.text ?? "";
  if (t.startsWith("AUDIT{")) { tulis.write(t.slice(5) + "\n"); n++; }
  else if (t.startsWith("AUDITERR")) { galat++; if (galat < 4) console.log(t); }
};
const tmp = path.join(OUT, `_frames_${KE}`);
for (const [a, b] of JENDELA) {
  if (PISAH && a !== JENDELA[0][0]) { await new Promise((r) => tulis.end(r)); tulis = createWriteStream(path.join(OUT, `${KE}_${a}.jsonl`)); }
  rmSync(tmp, { recursive: true, force: true });
  await renderFrames({
    composition, serveUrl, inputProps, outputDir: tmp, imageFormat: "jpeg", jpegQuality: 10, scale: 0.25, frameRange: [a, b],
    onBrowserLog: tangkap, onStart: () => {}, onFrameUpdate: () => {}, logLevel: "error", concurrency: Number(process.env.PARALEL || 6),
  });
}
rmSync(tmp, { recursive: true, force: true });
rmSync(serveUrl, { recursive: true, force: true }); // bundle ±950 MB per panggilan
await new Promise((r) => tulis.end(r));
console.log(`${KE}: ${n} frame terukur → out/dom/${KE}.jsonl` + (galat ? ` · GALAT ${galat}` : ""));
