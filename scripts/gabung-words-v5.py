#!/usr/bin/env python3
"""
WAKTU KATA v5 GABUNGAN (16 Okt). Audio scene yang narasinya identik dengan v4 (S01–S02, Properti, Reksa Dana, Penutup) = salinan
sampel-persis VO v4 (splice-vo3.py), jadi waktu katanya = alignment v4 digeser BULAT sejauh geser frame batas scene
(0 / 1284 / 632 / 5549 f, src/batas.ts) → animasi scene itu identik per frame dengan v4. Alignment ulang di berkas gabungan
(sync/vo-words-v5-alignment-ulang.json) menggeser sebagian onset ±1–2 frame (konteks potongan berbeda) — dipakai HANYA untuk
scene baru (S03, S05, S07–S09). Segmen bersuara (energi) ikut sumber yang sama.
Masuk : sync/v4/vo-words.json · sync/vo-words-v5-alignment-ulang.json · naskah md v4 & revisi
Keluar: sync/vo-words.json (v5)
"""
import json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
A = ROOT.parent / "04_Asset"
def n_scene(md):
    p = re.split(r"## SCENE (\d\d)[^\n]*\n", md)
    return [len(p[i + 1].replace("---", " ").split()) for i in range(1, len(p), 2)]
n4 = n_scene((A / "VO-Script-Investment-Instruments.md").read_text(encoding="utf-8"))
n5 = n_scene((A / "VO-Script-Investment-Instruments-Revisi-Lengkap.md").read_text(encoding="utf-8"))
st4 = [sum(n4[:k]) for k in range(len(n4) + 1)]; st5 = [sum(n5[:k]) for k in range(len(n5) + 1)]
W4 = json.loads((ROOT / "sync/v4/vo-words.json").read_text()); W5 = json.loads((ROOT / "sync/vo-words-v5-alignment-ulang.json").read_text())
LAMA = {1: (1, 0), 2: (2, 0), 4: (5, 1284), 6: (7, 632), 10: (13, 5549)}  # scene v5 → (scene v4, geser frame)
b4 = {w["tid"]: w for w in W4["words"]}
words, voiced, rentang_lama = [], [], []
for k in range(1, 11):
    t0, t1 = st5[k - 1], st5[k]
    if k in LAMA:
        j, g = LAMA[k]; d = g / 60
        for i in range(t1 - t0):
            w = b4.get(st4[j - 1] + i)
            # "f60" = frame VO onset PERSIS (frame v4 − geser bulat): pembulatan detik pecahan bisa berbeda 1 frame dari v4
            if w: words.append({**w, "tid": t0 + i, "a": w["a"] - d, "b": w["b"] - d, "f60": round(w["a"] * 60) - g})
        a = b4[min(t for t in b4 if t >= st4[j - 1])]["a"]; b = b4[max(t for t in b4 if t < st4[j])]["b"]
        rentang_lama.append((a - d - 0.15, b - d + 0.15, d, a - 0.15, b + 0.15))
    else:
        words += [w for w in W5["words"] if t0 <= w["tid"] < t1]
# segmen bersuara: v4 (digeser) di rentang scene lama, v5 di luar
def di_lama(s, e): return any(x0 <= s and e <= x1 for x0, x1, *_ in rentang_lama)
for x0, x1, d, a4, b4_ in rentang_lama:
    voiced += [[round(s - d, 3), round(e - d, 3)] for s, e in W4["energi"]["voiced"] if s >= a4 - 0.3 and e <= b4_ + 0.3]
voiced += [v for v in W5["energi"]["voiced"] if not any(x0 - 0.3 <= v[0] and v[1] <= x1 + 0.3 for x0, x1, *_ in rentang_lama)]
voiced.sort()
words.sort(key=lambda w: w["tid"])
assert [w["tid"] for w in words] == sorted(set(w["tid"] for w in words)), "tid ganda"
assert all(words[i]["a"] <= words[i + 1]["a"] for i in range(len(words) - 1)), "onset tidak monoton"
out = {**W5, "meta": {**W5["meta"], "gabungan": "scene identik = v4 digeser bulat (gabung-words-v5.py)"}, "words": words, "energi": {"voiced": voiced}}
(ROOT / "sync/vo-words.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(words), "kata ·", len(voiced), "segmen bersuara")
