#!/usr/bin/env python3
"""CEK KATA PEMICU (22 Okt, VO v2): simulasikan `urut(KATA, A0)` tiap scene terhadap src/words.gen.ts yang baru.
Melaporkan kata yang TIDAK ADA lagi di VO (Studio akan melempar galat) dan kata yang jatuh di LUAR rentang scene-nya
(urut melompat ke kemunculan kata itu di scene lain = ketukan diam-diam salah tempat)."""
import json, re, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
W = json.loads(re.search(r"WORDS: \[string, number, number\]\[\] = (\[.*\]);", (ROOT / "src/words.gen.ts").read_text()).group(1))
bt = dict((k, int(v)) for k, v in re.findall(r"^\s*(\w+): O \+ (\d+),", (ROOT / "src/batas.ts").read_text(), re.M))
TOTAL = int(re.search(r"TOTAL = (\d+)", (ROOT / "src/cues.ts").read_text()).group(1))
# scene yang ada = s2… di src/batas.ts (v3 22 Okt sore: S08 reserved, tidak ada) — scene terakhir berakhir di TOTAL
ADA = [1] + sorted(int(k[1:]) for k in bt if re.fullmatch(r"s\d+", k))
awal = {n: (0 if n == 1 else bt[f"s{n}"]) for n in ADA}
akhir = {n: (bt[f"s{ADA[i+1]}"] if i + 1 < len(ADA) else TOTAL) for i, n in enumerate(ADA)}
def kata(w, sesudah):
    for t, a, _ in W:
        if t == w and a >= sesudah: return a
    return None
pilih = [int(a) for a in sys.argv[1:]] or ADA
for n in pilih:
    src = (ROOT / f"src/s{n:02d}/Scene{n:02d}.tsx").read_text()
    m = re.search(r"const KATA = \[(.*?)\];", src, re.S) or re.search(r"urut\(\s*\[(.*?)\]", src, re.S)
    ws = re.findall(r"'([^']+)'", m.group(1))
    a0, b0 = awal[n], akhir[n]
    t, bad = a0, []
    for i, w in enumerate(ws):
        f = kata(w, a0 if i == 0 else t + 1)
        if f is None: bad.append((i, w, 'HILANG')); continue
        if f >= b0: bad.append((i, w, f'di luar scene f{f}'))
        t = f
    print(f"S{n:02d} f{a0}–{b0}: {len(ws)} kata, {len(bad)} bermasalah")
    for i, w, why in bad[:60]: print(f"   #{i:<3} {w:<16} {why}")
