# LONJAKAN SATU-FRAME: frame dengan banyak petak berubah sementara frame sebelum DAN sesudahnya hampir diam (data judder-cepat.mjs).
# pakai: python3 scripts/lonjakan.py out/judder/Ide-S06-label.jsonl
import json, sys
rows = {}
for l in open(sys.argv[1]):
    r = json.loads(l); rows[r['f']] = r['petak']
def luas(f): return sum(d for _, _, d in rows.get(f, []))  # jumlah % berubah
hasil = []
for f in sorted(rows):
    a, b, c = luas(f - 1), luas(f), luas(f + 1)
    if b >= 8 and a <= b / 5 and c <= b / 5:
        ps = rows[f]; xs = [j for _, j, _ in ps]; ys = [i for i, _, _ in ps]
        hasil.append(f"  f{f} ({f/60:.2f} dtk) · {b:.0f} %-petak · x {min(xs)*60}–{(max(xs)+1)*60} y {min(ys)*60}–{(max(ys)+1)*60} · tetangga {a:.1f}/{c:.1f}")
print(f"{sys.argv[1].split('/')[-1]}: {len(hasil)} lonjakan satu-frame")
print("\n".join(hasil[:25]))
