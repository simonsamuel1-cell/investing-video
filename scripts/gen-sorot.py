#!/usr/bin/env python3
"""
UKURAN TINTA KATA JUDUL -> src/sorot.gen.ts (+ daftar kata src/judulKata.gen.ts).
Simon 7 Okt: kotak sorot "kurang besar … mepet … pastikan tetap center"; Simon 13 Okt: "spacing textnya belum konsisten di seluruh video"
→ SEMUA kata judul (bukan hanya kata sorot) diukur: tinta tiap kata terhadap kotak span-nya, supaya <Judul> bisa menata jarak TINTA ke TINTA
(dan tinta ke tepi kotak sorot) dengan satu nilai di seluruh video (kit.tsx JARAK_JUDUL), tidak bergantung bentuk huruf.
Cara: daftar kata = SOROT_KATA (src/sorotKata.ts) ∪ semua kata di prop `kata={[...]}` komponen <Judul> di src/**; komposisi Ukur-Sorot
merender 44 kata per frame (4 kolom × 11 baris) dengan gaya judul di atas kotak hijau murni; tinta = piksel G < 128, kotak = hijau murni.
"""
import json, math, pathlib, re, subprocess, os
from PIL import Image
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
sorot = json.loads(re.search(r"SOROT_KATA = (\[.*?\])", (ROOT / "src/sorotKata.ts").read_text(), re.S).group(1).replace("'", '"').replace("\n", " "))
judul = []
for p in sorted((ROOT / "src").rglob("*.tsx")):
    for m in re.finditer(r"<Judul\b[^>]*?kata=\{\[(.*?)\]\}", p.read_text(), re.S):
        judul += re.findall(r"'([^']*)'", m.group(1))
kata = list(dict.fromkeys(sorot + judul))
(ROOT / "src/judulKata.gen.ts").write_text("/* DIBANGKITKAN oleh scripts/gen-sorot.py — semua kata judul + kata sorot (diukur di komposisi Ukur-Sorot). Jangan diedit tangan. */\n"
                                          f"export const JUDUL_KATA: string[] = {json.dumps(kata, ensure_ascii=False)};\n")
PER, KOL, ux, uy, ub, uk = 44, 4, 60, 30, 92, 465  # = UKUR di src/UkurSorot.tsx
halaman = math.ceil(len(kata) / PER)
subprocess.run(["node", "scripts/stills.mjs", *[str(i) for i in range(halaman)]], cwd=ROOT, check=True, env={**os.environ, "COMP": "Ukur-Sorot"}, capture_output=True)
out = {}
for k, w in enumerate(kata):
    hal, j = divmod(k, PER)
    a = np.asarray(Image.open(ROOT / f"out/stills/Ukur-Sorot_f{hal:05d}.png").convert("RGB")).astype(int)
    y0 = uy + (j // KOL) * ub; x0 = ux + (j % KOL) * uk
    reg = a[y0 - 10:y0 + ub - 10, x0 - 20:x0 + uk - 25]
    hijau = (reg[:, :, 0] < 20) & (reg[:, :, 1] > 235) & (reg[:, :, 2] < 20)
    ys, xs = np.where(hijau)
    bx0, by0, bx1, by1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    assert bx1 < reg.shape[1] - 2, f"kata '{w}' terlalu lebar untuk kolom ukur"
    ink = reg[:, :, 1] < 128
    iy, ix = np.where(ink)
    out[w] = {"lebar": int(bx1 - bx0), "tinggi": int(by1 - by0), "kiri": int(ix.min() - bx0), "kanan": int(ix.max() + 1 - bx0),
              "atas": int(iy.min() - by0), "bawah": int(iy.max() + 1 - by0)}
    o = out[w]
    print(f"{w:18} kotak {o['lebar']}x{o['tinggi']} · tinta x {o['kiri']}–{o['kanan']} (sisa kanan {o['lebar'] - o['kanan']}) y {o['atas']}–{o['bawah']}")
lines = ["/* DIBANGKITKAN oleh scripts/gen-sorot.py — kotak tinta tiap kata judul terhadap kotak span-nya (px, judul 52px). Jangan diedit tangan. */",
         "export const SOROT_UKUR: Record<string, { lebar: number; tinggi: number; kiri: number; kanan: number; atas: number; bawah: number }> = {"]
obj = lambda v: "{ " + ", ".join(f"{k}: {n}" for k, n in v.items()) + " }"
lines += [f"  {json.dumps(w, ensure_ascii=False)}: {obj(v)}," for w, v in out.items()]
lines += ["};"]
(ROOT / "src/sorot.gen.ts").write_text("\n".join(lines) + "\n")
print(f"{len(out)} kata -> src/sorot.gen.ts ({halaman} halaman ukur)")
