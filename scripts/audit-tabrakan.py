#!/usr/bin/env python3
"""AUDIT TABRAKAN V03 (porting 14 Okt dari Video 02 Candlestick; Simon: "spacing, size, alignment juga masih bermasalah") — tahap 2: nilai. Membaca out/audit/kotak.jsonl (hasil
scripts/audit-tabrakan.mjs) dan mencari elemen yang saling menabrak.

Aturan (hanya elemen dengan opasitas efektif >= 0,5 — separuh crossfade
antar-scene tidak dihitung):
  TEKS-TEKS         dua teks bertumpuk
  TEKS-CANDLE       teks menimpa badan/sumbu candle
  TEKS-LEWAT-TEPI   teks melintasi tepi kartu/panel di bawahnya
  TEKS-TERTUTUP     kartu/panel di ATAS teks menutupinya
  TEKS-KENA-GARIS   garis tegas (alfa >= 0,3) melintasi teks
  PERMUKAAN-TUMPANG dua kartu/panel/pil tumpang-tindih sebagian
  CANDLE-TERTUTUP   kartu di ATAS candle
  CANDLE-LEWAT-TEPI candle keluar dari panel tempatnya berdiri
  GARIS-POTONG-KARTU garis tegas masuk sebagian ke kartu
  LUAR-AMAN         keluar dari safe area L96 R96 T54 B108
  KENA-LOGO         menabrak watermark Tuntun
  TEKS-MEPET        teks terlalu dekat tepi wadahnya — kalibrasi dari contoh Simon
                    (2026-09-24: angka sumbu 0–10 px dari tepi papan, "500" di sel
                    order book 0 px atas/bawah, "20" rata tepi pita baris):
                    wadah kecil (pil/sel, tinggi < 70): kiri/kanan >= 12, atas/bawah >= 2
                    kartu/panel: kiri/kanan >= 16, atas/bawah >= 12
  PERMUKAAN-MEPET   kartu di dalam kartu/panel < 16 px dari tepinya
  CANDLE-MEPET      candle < 16 px dari tepi panelnya
  TEKS-DEKAT-CANDLE teks < 16 px dari candle
  TEKS-DEKAT-GARIS  teks < 6 px dari garis tegas
  KONTRAS-RENDAH    teks vs permukaan di bawahnya (WCAG): < 3:1 untuk teks besar
                    (>= 24 px, atau >= 18,66 px tebal), < 4,5:1 untuk teks kecil
  WARNA-LUAR-BRAND  warna yang bukan warna brand Tuntun atau turunannya (campuran
                    dengan putih dan/atau Midnight); hitam netral dihitung netral
  WARNA-PASAR       merah/hijau candle — didaftar per elemen untuk DIPERIKSA:
                    hanya boleh di candlestick & order book (Simon 2026-09-24)
  GARIS-TEBAL       garis tegas (alfa >= 0,4, panjang >= 40 px) yang tebalnya
                    bukan 3 px — "gunakan 3 px untuk seluruh video" (Simon)

Semua kotak DIPOTONG ke kanvas sebelum aturan tumpang-tindih dinilai: benda
yang tersembunyi di luar layar (panggung yang menunggu di atas layar selama
jeda) tidak bisa menabrak apa pun yang terlihat.

Benda di BAWAH tabir pekat selebar kanvas (latar breakscene) tidak dinilai —
ia memang tidak terlihat. Tepi kartu yang TERTUTUP kartu pekat lain (mis.
penyangga di balik kartu putihnya) juga tidak dinilai.
Elemen bertanda `data-audit-izin="<alasan>"` di kode (pil harga yang menutup
angka sumbu, cincin pulsa, titik tambat di candle, takik penunjuk, kepala
kartu bab, bayangan candle) boleh menumpang — alasannya tertulis di kode.

Pakai: python3 scripts/audit-tabrakan.py
"""
import json, sys, collections

SAFE = (96, 54, 1824, 950)
ABAI = {"Backdrop", "Subtitle"}
MIN_O = 0.5
SEMUA = True  # aturan jarak selalu aktif sejak brief spacing 2026-09-24

def inter(a, b):
    x0, y0, x1, y1 = max(a[0], b[0]), max(a[1], b[1]), min(a[2], b[2]), min(a[3], b[3])
    return (x0, y0, x1, y1) if x1 > x0 and y1 > y0 else None
def area(b): return max(0, b[2] - b[0]) * max(0, b[3] - b[1])
def inter_k(a, b):
    """irisan yang TERLIHAT: irisan dua kotak, dipotong ke kanvas 1920×1080"""
    r = inter(a, b)
    return inter(r, (0, 0, 1920, 1080)) if r else None
def contains(o, i, tol=1): return o[0] - tol <= i[0] and o[1] - tol <= i[1] and o[2] + tol >= i[2] and o[3] + tol >= i[3]
def shrink(b, d): return (b[0] + d, b[1] + d, b[2] - d, b[3] - d)
def gap_in(o, i): return min(i[0] - o[0], i[1] - o[1], o[2] - i[2], o[3] - i[3])
def gap(a, b):
    dx = max(b[0] - a[2], a[0] - b[2], 0); dy = max(b[1] - a[3], a[1] - b[3], 0)
    return max(dx, dy) if (dx == 0 or dy == 0) else (dx * dx + dy * dy) ** 0.5
def w(b): return b[2] - b[0]
def h(b): return b[3] - b[1]
def desc(i):
    t = i.get("t")
    return f"{i['l']}:{i['k']}:" + (f'"{t}"' if t else f"{w(i['b'])}x{h(i['b'])}@{i['b'][0]},{i['b'][1]}")

temuan = collections.defaultdict(list)   # (aturan, idA, idB) -> [(frame, descA, descB, detail)]

import re
KANVAS = (0, 0, 1920, 1080)
def warna(s):
    """'rgb(1, 2, 3)' / 'rgba(1,2,3,0.5)' / 'rgb(1 2 3 / 0.5)' / '#rrggbb' → (r,g,b,a) atau None"""
    if not s or s in ("none", "transparent") or s.startswith("url(") or s == "gradien": return None
    if s.startswith("#"):
        x = s[1:]; return (int(x[0:2], 16), int(x[2:4], 16), int(x[4:6], 16), 1.0)
    m = re.match(r"rgba?\(([^)]+)\)", s)
    if not m: return None
    n = [float(v) for v in re.split(r"[ ,/]+", m.group(1).strip()) if v]
    return (n[0], n[1], n[2], n[3] if len(n) > 3 else 1.0)
def hx(h): return (int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16))
PUTIH, MIDNIGHT, HITAM = hx("#FFFFFF"), hx("#16181B"), hx("#000000")
BRAND = {"indigo": hx("#5F4DEE"), "cyan": hx("#5CC8E3"), "orange": hx("#E49C2C"), "gray": hx("#8E8E96")}
PASAR = {"hijau": hx("#22B573"), "merah": hx("#E5475D")}
def _jarak_segitiga(c, A, B, C):
    """jarak terdekat c ke segitiga campuran A·B·C (a,b >= 0, a+b <= 1)"""
    best = 1e9
    for i in range(0, 101, 2):
        a = i / 100
        for j in range(0, 101 - i, 2):
            b = j / 100; k = 1 - a - b
            d = sum((c[t] - (a * A[t] + b * B[t] + k * C[t])) ** 2 for t in range(3)) ** 0.5
            if d < best: best = d
    return best
_kelas = {}
def kelas_warna(rgb):
    """'brand' · 'netral' · 'pasar:<nama>' · 'luar'"""
    key = tuple(round(v) for v in rgb[:3])
    if key in _kelas: return _kelas[key]
    TOL = 10
    if _jarak_segitiga(key, PUTIH, MIDNIGHT, HITAM) <= TOL: r = "netral"
    elif min(_jarak_segitiga(key, B, PUTIH, MIDNIGHT) for B in BRAND.values()) <= TOL: r = "brand"
    else:
        pas = [(n, _jarak_segitiga(key, B, PUTIH, MIDNIGHT)) for n, B in PASAR.items()]
        n, d = min(pas, key=lambda x: x[1])
        r = f"pasar:{n}" if d <= TOL else "luar"
    _kelas[key] = r
    return r
def lum(c):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])
def kontras(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)
def tumpuk(bawah, atas, alfa):
    return tuple(bawah[t] + (atas[t] - bawah[t]) * alfa for t in range(3))
LATAR = hx("#F3F1FB")  # latar rumah V03 (rona terang)

def pekat(u, ref=None):
    """permukaan pekat — alfa isinya >= 0,9 dan tidak lebih transparan dari yang
    ditutupnya (kartu & penyangganya memudar BERSAMA, jadi dibandingkan relatif)"""
    if u["k"] not in ("box", "fill") or u.get("a", 1) < 0.9: return False
    return u["o"] >= 0.9 * (ref["o"] if ref else 1)
def tertutup(surfs, bawah, atas, kotak):
    """ada permukaan PEKAT di antara `bawah` dan `atas` (urutan cat) yang memuat `kotak`?"""
    return any(pekat(u, bawah) and bawah["z"] < u["z"] < atas["z"] and contains(u["b"], kotak) for u in surfs)
def tinta(A):
    """kotak TINTA teks: kotak baris dikurangi ruang leading di atas & bawah —
    yang dilihat mata ("menabrak" = tinta menyentuh tepi), bukan kotak baris"""
    fs = A.get("fs") or 20
    lh = A.get("lh") or (A["b"][3] - A["b"][1])
    pad = max(0.0, (lh - 0.72 * fs) / 2)
    b = A["b"]
    return (b[0], b[1] + pad, b[2], b[3] - pad)
MENDARAT = 0.95  # aturan JARAK hanya dinilai pada elemen yang sudah mendarat
def sk(x): return x.get("sk", 1)
def mendarat_skala(*xs):
    """tidak sedang TUMBUH dari kecil (pop 0→1): skala >= 0,97"""
    return all(sk(x) >= 0.97 for x in xs)
def seskala(a, b):
    """dua benda berskala SAMA — tata letaknya tetap (keduanya diam, atau satu
    kamera memperbesar keduanya). Pop yang sedang tumbuh/overshoot di dalam panel
    yang diam = beda skala → jarak sesaat, bukan tata letak."""
    return abs(sk(a) - sk(b)) <= 0.02
def _iz(x): return [p for p in ((x or {}).get("iz") or "").split("|") if p]
def izin(*xs):
    """izin TUMPANG-TINDIH yang ditulis di kode (bukan tanda sapuan)"""
    return any(not p.startswith("sapuan") for x in xs for p in _iz(x))
def sapuan(*xs):
    """lapisan yang SEDANG menyapu masuk/keluar layar"""
    return any(p.startswith("sapuan") for x in xs for p in _iz(x))

def lapor(rule, f, A, B=None, detail=""):
    # lapisan yang sedang MENYAPU memang melewati tepi kanvas & zona logo; tapi
    # tabrakan ANTAR-lapisan selama sapuan TETAP dilaporkan (itu cacat nyata)
    if rule in ("LUAR-AMAN", "KENA-LOGO"):
        if sapuan(A, B): return
    elif rule in ("KONTRAS-RENDAH", "WARNA-LUAR-BRAND", "WARNA-PASAR", "GARIS-TEBAL", "FRAME-KOSONG"):
        pass  # izin di kode hanya membebaskan TUMPANG-TINDIH, bukan warna/kontras/tebal
    elif izin(A, B): return
    key = (rule, A["l"] + A["id"], (B["l"] + B["id"]) if B else "")
    temuan[key].append((f, desc(A), desc(B) if B else "", detail))

# pra-pindai: elemen yang di frame LAIN tercatat sebagai kotak lebar = batang yang
# sedang tumbuh (pita sorot scaleX), bukan garis — dibebaskan dari GARIS-TEBAL
PERNAH_KOTAK = set()
for line in open("out/audit/kotak.jsonl"):
    for i in json.loads(line)["items"]:
        if i["k"] == "box": PERNAH_KOTAK.add(i["l"] + i["id"])

for line in open("out/audit/kotak.jsonl"):
    j = json.loads(line); f = j["f"]
    semua = j["items"]
    isi = [i for i in semua if i["l"] not in ABAI and i["l"] != "Watermark" and i["k"] != "bg" and i["o"] >= 0.3]
    di_layar = 0
    for i in isi:
        b = i["b"]
        r = inter(b, (0, 0, 1920, 1080))
        if r and area(r) >= 400: di_layar += 1
    if di_layar == 0:
        temuan[("FRAME-KOSONG", "", "")].append((f, "layar hanya latar", "", ""))
    tabir = [i["z"] for i in semua if i["k"] == "bg" and i["l"] not in ABAI and i.get("a", 0) * i["o"] >= 0.5]
    zmin = max(tabir) if tabir else -1
    it = [i for i in semua if i["o"] >= MIN_O and i["l"] not in ABAI and i["k"] != "bg" and i["z"] > zmin]
    logo = [i for i in it if i["l"] == "Watermark" and i["k"] == "img"]
    it = [i for i in it if i["l"] != "Watermark"]
    # potong ke kanvas: benda di luar layar tidak terlihat → tidak bisa menabrak.
    # Kotak mentahnya disimpan untuk LUAR-AMAN (benda yang menjulur keluar layar).
    for i in it:
        i["b"] = i["mentah"] = tuple(i["b"])
    it = [i for i in it if inter(i["b"], KANVAS)]
    # KONTRAS — teks yang sudah mendarat vs tumpukan permukaan di bawah titik tengahnya
    for A in it:
        if A["k"] != "txt" or A["o"] < MENDARAT or sk(A) < 0.9: continue  # pop yang masih kecil
        if len((A.get("t") or "").strip()) <= 1 and not (A.get("t") or "").strip().isalnum(): continue  # pemisah "•"
        # teks yang DITUTUP salinannya sendiri (salinan putih sorotan, dicat sesudahnya)
        if any(B is not A and B["k"] == "txt" and B.get("t") == A.get("t") and B["z"] > A["z"]
               and inter(tinta(A), B["b"]) for B in it): continue
        tc = warna(A.get("c"))
        if not tc or tc[3] < 0.3: continue
        ti = tinta(A); cx, cy = (ti[0] + ti[2]) / 2, (ti[1] + ti[3]) / 2
        dasar = [u for u in semua if u["k"] in ("box", "fill") and u["l"] not in ABAI and u["o"] >= 0.3
                 and "penyangga" not in (u.get("iz") or "")  # cincin di BALIK kartu (dipotong lubang kartu)
                 and (u["z"] < A["z"] or (u["id"] == A["id"] and u["l"] == A["l"]))
                 and u["b"][0] <= cx <= u["b"][2] and u["b"][1] <= cy <= u["b"][3]]
        latar = LATAR; pasti = True
        for u in sorted(dasar, key=lambda u: u["z"]):
            if u["k"] == "box" and u.get("bgi"):
                # gradien: warna dasar dulu, lalu RATA-RATA hentian gradiennya
                dc = warna(u.get("bgc"))
                if dc and dc[3] >= 0.04: latar = tumpuk(latar, dc, dc[3] * u["o"])
                stops = [warna(m) for m in re.findall(r"rgba?\([^)]*\)", u["bgi"])]
                stops = [x for x in stops if x]
                if stops:
                    rata = tuple(sum(x[t] for x in stops) / len(stops) for t in range(4))
                    latar = tumpuk(latar, rata, rata[3] * u["o"])
                continue
            uc = warna(u.get("bg") if u["k"] == "box" else u.get("fl"))
            if uc is None:
                if (u.get("bg") or u.get("fl") or "").startswith(("url(", "gradien")): pasti = False
                continue
            latar = tumpuk(latar, uc, uc[3] * u["o"])
        teks = tumpuk(latar, tc, tc[3])
        rasio = kontras(teks, latar)
        besar = (A.get("fs") or 0) >= 24 or ((A.get("fs") or 0) >= 18.66 and (A.get("fw") or 400) >= 700)
        batas = 3.0 if besar else 4.5
        if rasio < batas:
            lapor("KONTRAS-RENDAH", f, A, None, f"{rasio:.2f}:1 < {batas} · fs {A.get('fs')} · teks {A.get('c')} di atas rgb{tuple(round(v) for v in latar)}" + ("" if pasti else " (latar bergradien, perkiraan)"))
    txt = [i for i in it if i["k"] == "txt"]
    candle = [i for i in it if i["k"] == "candle"]
    # permukaan: kotak HTML, atau isian SVG yang pekat (tint < 0,2 = latar pita, bukan benda)
    surf = [i for i in it if (i["k"] == "box" or (i["k"] == "fill" and i.get("a", 1) >= 0.2))
            and area(i["b"]) >= 150 and not (w(i["b"]) >= 1800 or h(i["b"]) >= 1000)]
    garis = [i for i in it if i["k"] == "line" and i.get("a", 1) * i["o"] >= 0.3 and (w(i["b"]) <= 6 or h(i["b"]) <= 6)]

    # PUSAT — kotak gabungan isi scene yang sudah mendarat (judul y<200, logo, subtitle dibuang) harus berpusat di 960/540 (Simon 7 Okt)
    isi_p = [i for i in it if i["k"] in ("txt", "box", "img", "fill") and i["o"] >= MENDARAT and i["b"][3] > 200 and i["l"].startswith("S")
             and area(inter(i["b"], KANVAS) or (0, 0, 0, 0)) >= 200]
    if isi_p:
        ux0 = min(i["b"][0] for i in isi_p); uy0 = min(i["b"][1] for i in isi_p); ux1 = max(i["b"][2] for i in isi_p); uy1 = max(i["b"][3] for i in isi_p)
        dx, dy = (ux0 + ux1) / 2 - 960, (uy0 + uy1) / 2 - 540
        if abs(dx) > 30 or abs(dy) > 45:
            temuan[("PUSAT", isi_p[0]["l"], "")].append((f, f"{isi_p[0]['l']}:isi x{ux0}–{ux1} y{uy0}–{uy1}", "", f"simpang ({dx:+.0f}, {dy:+.0f})"))
    # TEKS-TEKS
    for x in range(len(txt)):
        for y in range(x + 1, len(txt)):
            A, B = txt[x], txt[y]
            if A.get("t") == B.get("t"): continue  # salinan putih kotak sorot = kata yang sama
            r = inter_k(shrink(A["b"], 1), shrink(B["b"], 1))
            fs = min(A.get("fs") or 20, B.get("fs") or 20)
            if r and h(r) > 0.3 * fs and w(r) > 0.15 * fs: lapor("TEKS-TEKS", f, A, B, f"irisan {w(r)}x{h(r)}")
    # TEKS vs CANDLE
    for A in txt:
        for C in candle:
            r = inter_k(A["b"], C["b"])
            if r and area(r) >= 4: lapor("TEKS-CANDLE", f, A, C, f"irisan {w(r)}x{h(r)}")
            elif SEMUA and mendarat_skala(A) and gap(A["b"], C["b"]) < 16: lapor("TEKS-DEKAT-CANDLE", f, A, C, f"jarak {gap(A['b'], C['b']):.0f}")
    # TEKS vs PERMUKAAN
    for A in txt:
        for S in surf:
            if S["id"] == A["id"] and S["l"] == A["l"]: continue
            r = inter_k(A["b"], S["b"])
            if not r or area(r) < 6: continue
            if S["z"] > A["z"]:
                if S.get("a", 1) * S["o"] >= 0.2:  # sorotan tembus pandang di atas teks bukan penutup
                    lapor("TEKS-TERTUTUP", f, A, S, f"irisan {w(r)}x{h(r)}")
                continue
            if tertutup(surf, S, A, A["b"]): continue  # teks duduk di kartu pekat yang menutup S
            ti = tinta(A)
            if not contains(S["b"], ti):
                lapor("TEKS-LEWAT-TEPI", f, A, S, f"irisan {w(r)}x{h(r)}")
            elif A["o"] >= MENDARAT and S["o"] >= MENDARAT and seskala(A, S) and mendarat_skala(A, S):
                o, i = S["b"], ti
                kecil = h(o) < 70
                hmin, vmin = (12, 2) if kecil else (16, 10) if h(o) < 110 else (16, 12)
                sisi = [(n, round(v)) for n, v, m in (("kiri", i[0] - o[0], hmin), ("kanan", o[2] - i[2], hmin),
                                              ("atas", i[1] - o[1], vmin), ("bawah", o[3] - i[3], vmin)) if v < m]
                if sisi: lapor("TEKS-MEPET", f, A, S, " ".join(f"{n}={v}" for n, v in sisi))
    # TEKS vs GARIS
    for A in txt:
        for G in garis:
            r = inter_k(shrink(A["b"], 2), G["b"])
            if r: lapor("TEKS-KENA-GARIS", f, A, G, f"garis a={G.get('a')}")
            elif mendarat_skala(A, G) and gap(A["b"], G["b"]) < 6: lapor("TEKS-DEKAT-GARIS", f, A, G, f"jarak {gap(A['b'], G['b']):.0f}")
    # PERMUKAAN vs PERMUKAAN
    for x in range(len(surf)):
        for y in range(x + 1, len(surf)):
            A, B = surf[x], surf[y]
            r = inter_k(A["b"], B["b"])
            if not r or area(r) < 16: continue
            if A["b"] == B["b"]: continue  # lapisan kembar (mis. penyangga berganti rona) = satu benda
            lo, hi = (A, B) if A["z"] < B["z"] else (B, A)
            # tepi `lo` di daerah irisan tertutup permukaan pekat lain → tidak terlihat
            if any(pekat(u) and u is not hi and u["z"] > lo["z"] and contains(u["b"], r) for u in surf): continue
            if contains(A["b"], B["b"]) or contains(B["b"], A["b"]):
                o, i = (A, B) if contains(A["b"], B["b"]) else (B, A)
                need = 8 if h(o["b"]) < 80 else 10 if h(o["b"]) < 110 else 16  # pil · kartu baris · kartu/panel
                if SEMUA and gap_in(o["b"], i["b"]) < need and w(i["b"]) >= 40 and h(i["b"]) >= 20 and i["z"] > o["z"] \
                   and i["o"] >= MENDARAT and o["o"] >= MENDARAT and seskala(i, o) and mendarat_skala(i, o) and not tertutup(surf, o, i, i["b"]):
                    lapor("PERMUKAAN-MEPET", f, i, o, f"jarak {gap_in(o['b'], i['b'])}")
                continue
            # penyangga: kembaran seukuran yang digeser (kartu bab, papan hero)
            if abs(w(A["b"]) - w(B["b"])) <= 3 and abs(h(A["b"]) - h(B["b"])) <= 3 and \
               abs(A["b"][0] - B["b"][0]) <= 40 and abs(A["b"][1] - B["b"][1]) <= 40: continue
            lapor("PERMUKAAN-TUMPANG", f, A, B, f"irisan {w(r)}x{h(r)}")
    # CANDLE vs PERMUKAAN
    for C in candle:
        for S in surf:
            r = inter_k(C["b"], S["b"])
            if not r or area(r) < 4: continue
            if S["z"] > C["z"]: lapor("CANDLE-TERTUTUP", f, C, S, f"irisan {w(r)}x{h(r)}")
            elif not contains(S["b"], C["b"]): lapor("CANDLE-LEWAT-TEPI", f, C, S, f"irisan {w(r)}x{h(r)}")
            elif SEMUA and gap_in(S["b"], C["b"]) < 16: lapor("CANDLE-MEPET", f, C, S, f"jarak {gap_in(S['b'], C['b'])}")
    # GARIS vs PERMUKAAN (garis tegas masuk SEBAGIAN ke kartu)
    for G in garis:
        for S in surf:
            if area(S["b"]) >= 400000: continue  # panel besar: garis di dalamnya wajar
            r = inter_k(G["b"], S["b"])
            if r and not contains(S["b"], G["b"]) and max(w(r), h(r)) >= 3:
                lapor("GARIS-POTONG-KARTU", f, G, S, "garis di atas kartu" if G["z"] > S["z"] else "garis di balik kartu")
    # LUAR-AMAN
    for A in txt + candle + surf + garis:
        b = A["mentah"]
        if w(b) >= 1800 or h(b) >= 1000: continue
        lebih = [(n, v) for n, v in (("kiri", SAFE[0] - b[0]), ("atas", SAFE[1] - b[1]), ("kanan", b[2] - SAFE[2]), ("bawah", b[3] - SAFE[3])) if v > 2]
        if lebih: lapor("LUAR-AMAN", f, A, None, " ".join(f"{n}+{v}" for n, v in lebih))
    # KENA-LOGO
    for L in logo:
        for A in txt + candle + [s for s in surf if area(s["b"]) < 300000] + garis:
            r = inter(A["b"], L["b"])
            if r and area(r) >= 4: lapor("KENA-LOGO", f, A, L, f"irisan {w(r)}x{h(r)}")

def rentang(fs):
    fs = sorted(set(fs)); out = []; s = p = fs[0]
    for x in fs[1:]:
        if x - p > 60: out.append((s, p)); s = x  # 60: sampel audit bisa berlangkah 30
        p = x
    out.append((s, p))
    return ", ".join(f"{a}" if a == b else f"{a}–{b}" for a, b in out)

URUT = ["PUSAT", "FRAME-KOSONG", "TEKS-TEKS", "TEKS-CANDLE", "TEKS-TERTUTUP", "CANDLE-TERTUTUP", "TEKS-LEWAT-TEPI", "CANDLE-LEWAT-TEPI",
        "PERMUKAAN-TUMPANG", "TEKS-KENA-GARIS", "GARIS-POTONG-KARTU", "KENA-LOGO", "LUAR-AMAN",
        "TEKS-MEPET", "PERMUKAAN-MEPET", "CANDLE-MEPET", "TEKS-DEKAT-CANDLE", "TEKS-DEKAT-GARIS",
        "KONTRAS-RENDAH", "WARNA-LUAR-BRAND", "GARIS-TEBAL", "WARNA-PASAR"]
per = collections.Counter(k[0] for k in temuan)
print("RINGKASAN:", ", ".join(f"{r} {per[r]}" for r in URUT if per[r]) or "BERSIH")
for rule in URUT:
    ks = sorted([k for k in temuan if k[0] == rule], key=lambda k: temuan[k][0][0])
    for k in ks:
        v = temuan[k]; f0, da, db, det = v[len(v) // 2]
        print(f"[{rule}] f{rentang([x[0] for x in v])} ({len(v)}×)  {da}  ⟂  {db}  · {det} (contoh f{f0})")
