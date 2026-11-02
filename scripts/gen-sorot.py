#!/usr/bin/env python3
"""
UKURAN TINTA kata sorot -> src/sorot.gen.ts. Simon 7 Okt: kotak sorot "kurang besar … mepet … pastikan tetap center" lalu
"return" "kurang kecenter" (patokan huruf tinggi b/h tidak berlaku untuk kata yang puncaknya hanya huruf t).
Cara: komposisi Ukur-Sorot (src/UkurSorot.tsx) merender tiap kata dengan gaya judul di atas kotak hijau murni; still-nya
diukur: tinta = piksel dengan G < 128 (hitam, termasuk tepi antialias ≥50%), kotak = hijau murni.
"""
import json, pathlib, re, subprocess
from PIL import Image
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
kata = json.loads(re.search(r"SOROT_KATA = (\[.*?\])", (ROOT / "src/sorotKata.ts").read_text(), re.S).group(1).replace("'", '"').replace("\n", " "))
ux, uy, ub, uk = 100, 30, 84, 900  # = UKUR di src/UkurSorot.tsx
subprocess.run(["node", "scripts/stills.mjs", "0"], cwd=ROOT, check=True, env={**__import__("os").environ, "COMP": "Ukur-Sorot"}, capture_output=True)
a = np.asarray(Image.open(ROOT / "out/stills/Ukur-Sorot_f00000.png").convert("RGB")).astype(int)
out = {}
for k, w in enumerate(kata):
    y0 = uy + (k // 2) * ub; x0 = ux + (k % 2) * uk
    reg = a[y0 - 10:y0 + ub - 10, x0 - 30:x0 + 860]
    hijau = (reg[:, :, 0] < 20) & (reg[:, :, 1] > 235) & (reg[:, :, 2] < 20)
    ys, xs = np.where(hijau)
    bx0, by0, bx1, by1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    ink = reg[:, :, 1] < 128
    iy, ix = np.where(ink)
    out[w] = {"lebar": int(bx1 - bx0), "tinggi": int(by1 - by0), "kiri": int(ix.min() - bx0), "kanan": int(ix.max() + 1 - bx0),
              "atas": int(iy.min() - by0), "bawah": int(iy.max() + 1 - by0)}
    o = out[w]
    print(f"{w:18} kotak baris {o['lebar']}x{o['tinggi']} · tinta x {o['kiri']}–{o['kanan']} y {o['atas']}–{o['bawah']}")
lines = ["/* DIBANGKITKAN oleh scripts/gen-sorot.py — kotak tinta tiap kata sorot terhadap kotak barisnya (px, judul 52px). Jangan diedit tangan. */",
         "export const SOROT_UKUR: Record<string, { lebar: number; tinggi: number; kiri: number; kanan: number; atas: number; bawah: number }> = {"]
obj = lambda v: "{ " + ", ".join(f"{k}: {n}" for k, n in v.items()) + " }"
lines += [f"  {json.dumps(w)}: {obj(v)}," for w, v in out.items()]
lines += ["};"]
(ROOT / "src/sorot.gen.ts").write_text("\n".join(lines) + "\n")
print(f"{len(out)} kata -> src/sorot.gen.ts")
