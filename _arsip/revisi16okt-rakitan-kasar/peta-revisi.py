#!/usr/bin/env python3
"""
PETA WAKTU RAKITAN REVISI 16 OKT — frame video BARU (VO v5, naskah 10 scene) → frame video LAMA (Babak, VO v4).
Dipakai komposisi `Revisi-16Okt` untuk memutar VO v5 + subtitle v5 di atas visual yang SUDAH ADA:
  · scene yang narasinya identik (S01, S02, S04, S06, S10) = visual lamanya, digeser utuh → tetap sinkron per kata;
  · scene yang narasinya berubah (S03, S05, S07, S08, S09) = visual scene lama padanannya, diregangkan/dimampatkan
    linear ke durasi barunya — SEMENTARA, belum sinkron dengan narasi baru (menunggu revisi visual).
Batas scene baru = 3 frame sebelum suara scene itu (aturan BATAS lama), dari sync/vo-words-v5.json.
Keluar: src/revisi16okt.gen.ts
"""
import json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
O = int(re.search(r"VO_OFFSET = (\d+)", (ROOT / "src/offset.ts").read_text()).group(1))
bt = (ROOT / "src/batas.ts").read_text()
L = {k: O + int(v) for k, v in re.findall(r"(s\d+|akhir): O \+ (\d+)", bt)}
W = json.loads((ROOT / "sync/vo-words-v5.json").read_text()); V = W["energi"]["voiced"]; byt = {w["tid"]: w for w in W["words"]}
md = (ROOT.parent / "04_Asset/VO-Script-Investment-Instruments-Revisi-Lengkap.md").read_text(encoding="utf-8")
parts = re.split(r"## SCENE (\d\d)[^\n]*\n", md)
n = [len(parts[i + 1].replace("---", " ").split()) for i in range(1, len(parts), 2)]
st = [sum(n[:k]) for k in range(len(n) + 1)]
cues = (ROOT / "src/cues-v5.ts").read_text()
TOTAL = int(re.search(r"TOTAL = (\d+)", cues).group(1))
N = {1: 0}
for k in range(2, 11):
    a = byt[min(t for t in byt if t >= st[k - 1])]["a"]
    on = min(s for s, e in V if e >= a - 0.05)
    N[k] = O + round(on * 60) - 3
N[11] = TOTAL
S12_MASUK = 52  # Scene 11 lama keluar lewat masker 52f mulai BATAS.s12 — dilewati (Scene 11 tidak ada di naskah revisi)
# (scene baru, sumber lama [o0, o1), sinkron?)
SUMBER = {1: (0, L["s2"], True), 2: (L["s2"], L["s3"], True), 3: (L["s3"], L["s5"], False), 4: (L["s5"], L["s6"], True),
          5: (L["s6"], L["s7"], False), 6: (L["s7"], L["s8"], True), 7: (L["s8"], L["s9"], False), 8: (L["s9"], L["s10"], False),
          9: (L["s12"] + S12_MASUK, L["s13"], False), 10: (L["s13"], L["akhir"], True)}
# scene SINKRON: geser utuh (laju 1) sejauh median selisih onset kata v4 − v5 — bukan diregangkan antar-batas (celah ujung scene
# lama ≠ baru sampai 6f; meregangkannya membuat kata bergeser beberapa frame di ujung scene)
W4 = json.loads((ROOT / "sync/vo-words.json").read_text()); b4 = {w["tid"]: w for w in W4["words"]}
md4 = (ROOT.parent / "04_Asset/VO-Script-Investment-Instruments.md").read_text(encoding="utf-8")
p4 = re.split(r"## SCENE (\d\d)[^\n]*\n", md4); n4 = [len(p4[i + 1].replace("---", " ").split()) for i in range(1, len(p4), 2)]
st4 = [sum(n4[:k]) for k in range(len(n4) + 1)]
LAMA_DARI = {1: 1, 2: 2, 4: 5, 6: 7, 10: 13}  # scene baru → scene VO v4 yang narasinya identik
def geser(k):
    j = LAMA_DARI[k]; d = []
    for i in range(st[k] - st[k - 1]):
        t5, t4 = st[k - 1] + i, st4[j - 1] + i
        if t5 in byt and t4 in b4: d.append((b4[t4]["a"] - byt[t5]["a"]) * 60)
    d.sort(); return round(d[len(d) // 2])
rows = []
for k in range(1, 11):
    o0, o1, sync = SUMBER[k]
    if sync:
        g = geser(k); o0 = N[k] + g; o1 = o0 + N[k + 1] - N[k]  # frame terakhir n1−1 → o1−1
    rows.append((k, N[k], N[k + 1], o0, o1, sync))
assert N[3] == L["s3"], (N[3], L["s3"])  # S01–S02 = VO v4 apa adanya
ts = ["/* DIBANGKITKAN oleh scripts/peta-revisi.py — jangan diedit tangan.",
      " * [scene baru, n0, n1, o0, o1, sinkron]: frame baru n∈[n0,n1) → frame lama o0 + (n−n0)·(o1−o0)/(n1−n0).",
      " * sinkron = narasi identik dengan VO v4 (geser utuh, laju 1); tidak = visual lama sementara, diregangkan ke durasi baru. */",
      f"export const TOTAL_REVISI = {TOTAL};",
      "export const PETA_REVISI: [number, number, number, number, number, boolean][] = ["]
for k, n0, n1, o0, o1, sync in rows:
    ts.append(f"  [{k}, {n0}, {n1}, {o0}, {o1}, {'true' if sync else 'false'}], // laju {(o1 - o0) / (n1 - n0):.3f}")
ts.append("];")
(ROOT / "src/revisi16okt.gen.ts").write_text("\n".join(ts) + "\n")
for k, n0, n1, o0, o1, sync in rows:
    print(f"S{k:02d} baru f{n0:>5}–{n1:<5} ({n1 - n0:>4}f) ← lama f{o0:>5}–{o1:<5} ({o1 - o0:>4}f) laju {(o1 - o0) / (n1 - n0):.3f} {'SINKRON' if sync else 'sementara'}")
