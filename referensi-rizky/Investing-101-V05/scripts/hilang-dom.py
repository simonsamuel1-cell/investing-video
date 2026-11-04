#!/usr/bin/env python3
"""HILANG-DOM (15 Okt) — tahap 2: nilai out/dom/<KE>.jsonl (scripts/pindai-dom.mjs). Mencari perubahan SATU FRAME yang tidak mungkin berasal
dari animasi rumah (pop 60f outBack: skala naik ≤ 0,08/frame · pudar 30–60f: opasitas ≤ 0,1/frame · gerak: kontinu dengan frame tetangga):

  HILANG           elemen terlihat (opasitas efektif ≥ 0,3, luas ≥ 36 px² sesudah dipotong) di f−1, TIDAK ADA di f (bug dompet S07 f8828,
                   pil Rp66.700.000 S11 f13350)
  MUNCUL           elemen tiba di f langsung penuh (opasitas ≥ 0,6, skala ≥ 0,85) — tanpa pop / pudar
  LONCAT-OPASITAS  elemen yang sama, opasitas berubah ≥ 0,4 dalam 1 frame
  LONCAT-SKALA     skala CSS kumulatif berubah ≥ 0,3 dalam 1 frame
  LONCAT-POSISI    tepi kotak bergeser ≥ 24 px dalam 1 frame DAN ≥ 3× gerak frame sebelum & sesudahnya (gerak cepat yang kontinu tidak dihitung)
  GANTI-GAMBAR     <img> yang sama berganti berkas seketika (opasitas ≥ 0,5)

Tidak dinilai: subtitle, watermark, latar, cahaya latar lembut; elemen yang ≥ 90 % tertutup kartu pekat di atasnya; teks yang hanya berganti
isi (angka berjalan). Luas dihitung SESUDAH dipotong kanvas & lingkaran masker (probe mencatat `cc`), jadi benda di luar lingkaran tidak dihitung.
Pakai: python3 scripts/hilang-dom.py <KE> [--semua]   (tanpa --semua: kejadian berturutan ≤ 2 frame digabung per elemen)
"""
import json, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
KE = sys.argv[1]
SEMUA = '--semua' in sys.argv
LEWATI_LAYER = {'Subtitle', 'Watermark', 'Backdrop', '?'}
W, H = 1920, 1080

F = {}
for l in open(ROOT / f'out/dom/{KE}.jsonl'):
    j = json.loads(l)
    F[j['f']] = j['items']
fr = sorted(F)


def siapkan(items):
    out = []
    for it in items:
        if it['l'] in LEWATI_LAYER or it['k'] == 'bg':
            continue
        # cahaya latar lembut (radial-gradient closest-side, lapisan Backdrop yang ikut di dalam masker) — tidak berbentuk, tidak dinilai
        if it['k'] == 'box' and (it.get('bgi') or '').startswith('radial-gradient(closest-side'):
            continue
        b = it['b']
        c = [max(0, b[0]), max(0, b[1]), min(W, b[2]), min(H, b[3])]
        luas = max(0, c[2] - c[0]) * max(0, c[3] - c[1])
        mentah = max(1e-6, (b[2] - b[0]) * (b[3] - b[1])) / max(it.get('kp', 1), 1e-3)  # luas sebelum dipotong leluhur
        if it.get('cc') and luas > 0:
            # luas yang benar-benar di DALAM lingkaran masker (sampel 12×12)
            cx, cy, r = it['cc']
            n = 12
            dalam = sum(1 for u in range(n) for v in range(n)
                        if (c[0] + (u + 0.5) * (c[2] - c[0]) / n - cx) ** 2 + (c[1] + (v + 0.5) * (c[3] - c[1]) / n - cy) ** 2 <= r * r)
            luas *= dalam / (n * n)
        utuh = luas / mentah  # < 0,9 = sedang keluar/masuk tepi jendela (zoom, geser-layar, masker) — bukan hilang/muncul seketika
        # keterlihatan = opasitas efektif × alfa permukaan (latar lingkaran berwarna 0,05 yang melintas 0 saat berganti warna bukan "hilang")
        alfa = (it.get('a') if it.get('a') is not None else 1) if it['k'] in ('box', 'fill') else 1
        it = dict(it, c=c, luas=luas, sk=it.get('sk', 1), kel='box' if it['k'] in ('box', 'hline', 'tipis') else it['k'], v=it['o'] * alfa, utuh=utuh)
        out.append(it)
    return out


def tertutup(it, items):
    """≥ 90 % kotaknya tertutup SATU permukaan pekat yang dicat sesudahnya"""
    b = it['c']
    if it['luas'] <= 0:
        return True
    for o in items:
        if o['z'] <= it['z'] or o['k'] != 'box' or (o.get('a') or 0) < 0.9 or o['o'] < 0.95:
            continue
        q = o['c']
        ix = max(0, min(b[2], q[2]) - max(b[0], q[0])) * max(0, min(b[3], q[3]) - max(b[1], q[1]))
        if ix >= 0.9 * it['luas']:
            return True
    return False


def tempat_sama(p, q):
    """kotak teks di baris yang sama & bertumpuk mendatar ≥ 50 % (angka berjalan rata kiri/kanan/tengah)"""
    if abs((p[1] + p[3]) / 2 - (q[1] + q[3]) / 2) > 6:
        return False
    ix = min(p[2], q[2]) - max(p[0], q[0])
    return ix >= 0.5 * min(p[2] - p[0], q[2] - q[0])


def mirip(a, b):
    # kotak yang diskalakan berganti kategori box ↔ hline ↔ tipis (ambang 8 / 10 px probe) — satu keluarga
    if a['kel'] != b['kel']:
        return False
    # teks LAIN isi = elemen yang sama hanya bila di tempat yang sama (dulu kata subjudul "bisa" dipasangkan dengan kata judul "produknya"
    # karena id DOM keduanya tertukar saat saudara baru lahir)
    if a['k'] == 'txt' and a.get('t') != b.get('t'):
        return tempat_sama(a['b'], b['b'])
    # candle tumbuh dari open ke close dalam 1–2 frame (tinggi ×3) — cukup id sama & tetap di kolomnya
    # (id bisa bergeser saat saudara lahir → cukup kolom yang sama & bertumpuk tegak)
    # kartu grafik bisa bergeser ±5 px/frame (≈ 1 slot candle) → kolom saja ambigu; kunci = ujung id sesudah <svg> (svg0>g17) + dekat
    if a['k'] == 'candle':
        ujung = lambda it: it['l'] + it['id'][it['id'].rfind('svg'):]
        p, q = a['b'], b['b']
        return ujung(a) == ujung(b) and abs((p[0] + p[2]) - (q[0] + q[2])) <= 80
    if a['k'] == 'img' and a.get('src') and b.get('src') and a['src'] != b['src']:
        return False
    p, q = a['b'], b['b']
    wa, ha, wb, hb = p[2] - p[0], p[3] - p[1], q[2] - q[0], q[3] - q[1]
    if min(wa, ha, wb, hb) <= 0:
        return False
    # teks berganti isi (lebar berubah) dengan id sama tetap elemen yang sama — tapi JARAK tetap diperiksa (dulu dilewati: kata judul "sampai"
    # dipasangkan dengan kata subjudul "kita" 179 px di bawahnya, label kartu lama dengan kartu baru 790 px jauhnya)
    if not (0.4 < wa / wb < 2.5 and 0.4 < ha / hb < 2.5) and not (a['k'] == 'txt' and a['id'] == b['id'] and 0.5 < ha / hb < 2):
        return False
    cx, cy = (p[0] + p[2]) / 2 - (q[0] + q[2]) / 2, (p[1] + p[3]) / 2 - (q[1] + q[3]) / 2
    # batas 140 px: kartu kembar 680 × 120 yang id-nya tertukar (kartu ke-2 ↔ ke-3, 155 px) dulu terbaca LONCAT-POSISI
    return (cx * cx + cy * cy) ** 0.5 <= min(0.6 * max(ha, hb, min(wa, wb)), 100) + 40


SAMA_ID = set()  # (list f−1, indeks) yang dipasangkan lewat id DOM yang sama — hanya itu yang boleh dinilai LONCAT-SKALA


def pasangkan(A, B):
    """→ dict indeks A → indeks B. Utama: id DOM sama + mirip; sisa: mirip terdekat (id bisa bergeser saat saudara lahir/hilang)."""
    pas, pakai = {}, set()
    byid = {}
    for j, b in enumerate(B):
        byid.setdefault(b['id'], []).append(j)
    for i, a in enumerate(A):
        for j in byid.get(a['id'], []):
            if j not in pakai and mirip(a, B[j]):
                pas[i] = j; pakai.add(j); SAMA_ID.add((id(A), i)); break
    sisaB = [j for j in range(len(B)) if j not in pakai]
    for i, a in enumerate(A):
        if i in pas:
            continue
        best, bd = None, 1e9
        for j in sisaB:
            if j in pakai or not mirip(a, B[j]):
                continue
            p, q = a['b'], B[j]['b']
            d = abs(p[0] - q[0]) + abs(p[1] - q[1]) + abs(p[2] - q[2]) + abs(p[3] - q[3])

            if d < bd:
                best, bd = j, d
        if best is not None:
            pas[i] = best; pakai.add(best)
    return pas


def geser(a, b):
    p, q = a['b'], b['b']
    return max(abs(p[k] - q[k]) for k in range(4))


S = {f: siapkan(F[f]) for f in fr}
P = {}  # (f−1 → f): pasangan
for f in fr:
    if f - 1 in S:
        P[f] = pasangkan(S[f - 1], S[f])

nama = lambda it: (it.get('t') or it.get('src') or '')[:32]
temuan = []
for f in fr:
    if f not in P:
        continue
    A, B, pas = S[f - 1], S[f], P[f]
    balik = {j: i for i, j in pas.items()}
    for i, a in enumerate(A):
        if i not in pas:
            # skala < 0,2 = pop-keluar yang sudah hampir habis (lepas di ujung animasi) — bukan hilang seketika
            # sisi ≥ 2 px: garis 1 px yang diskalakan masker ke < 1 px berhenti tercatat (bukan hilang)
            tipis = min(a['c'][2] - a['c'][0], a['c'][3] - a['c'][1])
            if a['v'] >= 0.3 and a['luas'] >= 36 and a['sk'] >= 0.2 and a['utuh'] >= 0.9 and tipis >= 2 and not tertutup(a, A):
                temuan.append((f, 'HILANG', a, f"o {a['o']:.2f} sk {a['sk']}"))
            continue
        b = B[pas[i]]
        if a['luas'] < 36 and b['luas'] < 36:
            continue
        if a['k'] != 'candle' and abs(a['o'] - b['o']) >= 0.4 and max(a['o'], b['o']) >= 0.4:
            temuan.append((f, 'LONCAT-OPASITAS', b, f"o {a['o']:.2f} → {b['o']:.2f}"))
        if (id(A), i) in SAMA_ID and abs(a['sk'] - b['sk']) >= 0.3 and max(a['o'], b['o']) >= 0.3:
            temuan.append((f, 'LONCAT-SKALA', b, f"sk {a['sk']} → {b['sk']}"))
        if a['k'] == 'img' and a.get('src') != b.get('src') and min(a['o'], b['o']) >= 0.5:
            temuan.append((f, 'GANTI-GAMBAR', b, f"{a.get('src')} → {b.get('src')}"))
        d = geser(a, b)
        # teks yang berganti isi (angka berjalan, "Rp99,9" → "Rp100,0") memang melebar/menyempit seketika — bukan loncatan
        if (a['k'] == 'txt' and a.get('t') != b.get('t')) or a['k'] == 'candle':
            d = 0
        if d >= 24 and min(a['o'], b['o']) >= 0.3:
            # gerak frame sebelum (f−2 → f−1) dan sesudah (f → f+1) untuk elemen yang sama
            d0 = d2 = 0.0
            if f - 1 in P:
                bal = {j: k for k, j in P[f - 1].items()}
                if i in bal:
                    d0 = geser(S[f - 2][bal[i]], a)
            if f + 1 in P and pas[i] in P[f + 1]:
                d2 = geser(b, S[f + 1][P[f + 1][pas[i]]])
            if d >= 3 * max(d0, d2, 4):
                temuan.append((f, 'LONCAT-POSISI', b, f"{d:.0f} px (sebelum {d0:.0f}, sesudah {d2:.0f})"))
    for j, b in enumerate(B):
        if j in balik:
            continue
        # garis: bisa tergambar bertahap (dash) dengan kotak penuh sejak frame pertama · candle: memang tumbuh cepat (ratusan per scene)
        if b['k'] in ('line', 'candle'):
            continue
        if b['o'] >= 0.6 and b['v'] >= 0.4 and b['sk'] >= 0.85 and b['luas'] >= 36 and b['utuh'] >= 0.9 and not tertutup(b, B):
            temuan.append((f, 'MUNCUL', b, f"o {b['o']:.2f} sk {b['sk']}"))

# gabung: elemen yang sama (aturan + nama + layer) pada frame berturutan ≤ 2 → satu kejadian
if not SEMUA:
    g, akhir = [], {}
    for t in temuan:
        kunci = (t[1], nama(t[2]), t[2]['k'], t[2]['l'])
        if kunci in akhir and t[0] - akhir[kunci][0] <= 2:
            akhir[kunci][0] = t[0]; akhir[kunci][1] += 1
            continue
        rec = [t[0], 1, t]
        akhir[kunci] = rec
        g.append(rec)
    keluar = [(r[2], r[1]) for r in g]
else:
    keluar = [(t, 1) for t in temuan]

for (f, aturan, it, ket), n in keluar:
    b = it['c']
    print(f"  f{f:<6} {aturan:<16} {it['k']:<5} {it['l'][:14]:<14} «{nama(it)}» kotak {b[0]},{b[1]}–{b[2]},{b[3]} · {ket}" + (f" · ×{n}" if n > 1 else ''))
print(f"{KE}: {len(fr)} frame ({fr[0] if fr else '-'}–{fr[-1] if fr else '-'}) · {len(P)} pasang · {len(keluar)} kejadian")
