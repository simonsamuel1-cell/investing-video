# rentang (berurutan) sampel DIAM yang pusat tintanya meleset > AMBANG px dari (960, 540) — kamera + zoom aktif
import sys, glob, re
import numpy as np
from PIL import Image
AMBANG = 15
for sc in sys.argv[1:]:
    fs = sorted(glob.glob(f"out/pusat/{sc}-kamera/f*.png"))
    rows = []
    for p in fs:
        a = np.asarray(Image.open(p).convert("RGB")).astype(np.int16)
        m = ((a[..., 1] - np.maximum(a[..., 0], a[..., 2])) < 60) | (np.maximum(a[..., 0], a[..., 2]) > 90)
        kol = np.nonzero(m.sum(axis=0) >= 3)[0]; bar = np.nonzero(m.sum(axis=1) >= 3)[0]
        lok = int(re.search(r"f(\d+)\.png", p).group(1))
        if len(kol) < 4: rows.append((lok, None)); continue
        full = kol[0] <= 2 and kol[-1] >= 1917 and bar[0] <= 2 and bar[-1] >= 1077
        rows.append((lok, None if full else ((kol[0] + kol[-1] + 1) / 2, (bar[0] + bar[-1] + 1) / 2)))
    diam = []
    for k in range(1, len(rows) - 1):
        c0, c, c1 = rows[k - 1][1], rows[k][1], rows[k + 1][1]
        if c and c0 and c1 and max(abs(c[0] - c0[0]), abs(c[1] - c0[1]), abs(c1[0] - c[0]), abs(c1[1] - c[1])) <= 3:
            diam.append((rows[k][0], c[0] - 960, c[1] - 540))
    buruk = [d for d in diam if abs(d[1]) > AMBANG or abs(d[2]) > AMBANG]
    grup = []
    for d in buruk:
        if grup and d[0] - grup[-1][-1][0] <= 10: grup[-1].append(d)
        else: grup.append([d])
    dx = [abs(d[1]) for d in diam]; dy = [abs(d[2]) for d in diam]
    print(f"{sc}: {len(diam)} sampel diam · median |dx| {np.median(dx):.0f} |dy| {np.median(dy):.0f} · {len(grup)} rentang > {AMBANG} px")
    for g in grup:
        print(f"   f{g[0][0]}–f{g[-1][0]} ({g[0][0]/60:.1f}–{g[-1][0]/60:.1f} dtk, {len(g)} sampel)  dx {np.median([d[1] for d in g]):+.0f}  dy {np.median([d[2] for d in g]):+.0f}")
