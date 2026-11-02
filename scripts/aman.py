# sampel yang isinya keluar wilayah aman (x 110–1810, y 150–950, zona logo x>1464 y<204)
import sys, glob, re
import numpy as np
from PIL import Image
fs = sorted(glob.glob(sys.argv[1] + '/f*.png')); buruk = []
for p in fs:
    a = np.asarray(Image.open(p).convert('RGB')).astype(np.int16)
    m = ((a[..., 1] - np.maximum(a[..., 0], a[..., 2])) < 60) | (np.maximum(a[..., 0], a[..., 2]) > 90)
    kol = np.nonzero(m.sum(axis=0) >= 3)[0]; bar = np.nonzero(m.sum(axis=1) >= 3)[0]
    if len(kol) < 4: continue
    x0, x1, y0, y1 = kol[0], kol[-1] + 1, bar[0], bar[-1] + 1
    lok = int(re.search(r"f(\d+)\.png", p).group(1)); why = []
    if x0 < 110: why.append(f'kiri {x0}')
    if x1 > 1810: why.append(f'kanan {x1}')
    if y0 < 150: why.append(f'atas {y0}')
    if y1 > 950: why.append(f'bawah {y1}')
    if m[:204, 1464:].sum() > 30: why.append('zona logo')
    if why: buruk.append(f'  f{lok} ({lok/60:.1f} dtk): ' + ', '.join(why))
print(f'{sys.argv[1].split("/")[-1]} {len(fs)} sampel · {len(buruk)} keluar wilayah aman'); print('\n'.join(buruk))
