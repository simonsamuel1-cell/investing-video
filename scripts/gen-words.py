#!/usr/bin/env python3
"""Onset kata VO (forced alignment MMS) -> src/words.gen.ts : [kata-bersih, frame onset 60fps] per token naskah."""
import json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
toks = (ROOT / "sync/NASKAH.txt").read_text(encoding="utf-8").split()
W = json.loads((ROOT / "sync/vo-words.json").read_text())["words"]
OFFSET = int(re.search(r'VO_OFFSET = (\d+)', (ROOT / 'src/offset.ts').read_text()).group(1))  # src/offset.ts
A = [None] * len(toks)
for w in W: A[w["tid"]] = round(w["a"] * 60) + OFFSET  # frame VIDEO (VO mulai di OFFSET)
for i in range(len(A)):  # panah tanpa waktu -> ikut kata sebelumnya
    if A[i] is None: A[i] = A[i - 1]
# awal FRASA tiap token: klausa naskah dipisah tanda baca , . ? ! : ; (Simon 7 Okt: elemen MULAI ±12–24f sebelum frasanya)
F0, mulai = [], 0
for i, t in enumerate(toks):
    F0.append(A[mulai])
    if re.search("[,.?!:;][\u0027\u0022\u201d\u2019)]*$", t): mulai = i + 1
bersih = lambda t: re.sub(r"[^a-z0-9\-]", "", t.lower().replace("’", ""))
rows = ",".join(f"[{json.dumps(bersih(t))},{a},{fa}]" for t, a, fa in zip(toks, A, F0))
(ROOT / "src/words.gen.ts").write_text(
    "/* DIBANGKITKAN oleh scripts/gen-words.py — [kata, onset, onset FRASA-nya] per token naskah (frame VIDEO 60fps, sudah + VO_OFFSET). Jangan diedit tangan. */\n"
    f"export const WORDS: [string, number, number][] = [{rows}];\n", encoding="utf-8")
print(len(toks), "token -> src/words.gen.ts")
