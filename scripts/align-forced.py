#!/usr/bin/env python3
"""
FORCED ALIGNMENT VO Investing 101 · Video 05 Jalur Bertumbuh Seorang Investor (salinan Video 03/02) — naskah yang SUDAH PASTI ditempelkan ke gelombang suara
(torchaudio MMS_FA, resolusi 20 ms, skor per kata). Metode = Video 10 (mtf-episode/scripts/align-forced.py)
+ amplop energi CTA (cta-episode/scripts/align-forced.py).

VO 7,8 menit tidak bisa ditelan sekaligus (atensi O(n^2)) -> dipotong di titik HENING, ±24 dtk.
Kata dimasukkan ke potongan LEWAT WAKTU PERKIRAAN dari transkripsi whisper (difflib + interpolasi),
bukan proporsi durasi (jebakan #2 reference_forced_alignment).

Keluaran: sync/vo-words.json  {meta, words:[{w,tid,a,b,score}], energi:{voiced:[[a,b],...]}}
  `tid` = indeks token di NASKAH.txt (split spasi). Token tanpa huruf (panah "→") tidak dijajarkan;
  gen-cues.py mengisinya dari tetangga.
Jalankan:  ../../../_fondasi/.venv-align/bin/python scripts/align-forced.py
"""
import difflib, json, pathlib, re, unicodedata
import numpy as np
import torch, torchaudio
from torchaudio.functional import forced_align, merge_tokens

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "vo" / "inv05_vo_v3_isi.wav"  # 22 Okt sore (v3): VO 09:38 s/d "membelinya." (405,60 dtk; "Cara menilai…" dihapus) + VO S07 14:50 (+4,1 dB)
# (v2 22 Okt pagi: "inv05_vo_v2_isi.wav" — VO 09:38 dipotong 484,84 dtk sebelum outro)
# (v1 19 Okt: "inv05_vo.wav")  # MiniMax 19 Okt 14:34 (01_VO) + sambungan daftar indeks 19 Okt sore (= 01_VO/Video05_VO_indeks-disambung_19okt.wav)
WORK = ROOT / "sync" / "_work16k.wav"
SCRIPT = ROOT / "sync" / "NASKAH.txt"
REF = ROOT / "sync" / "vo-words.whisper-small.json"
OUT = ROOT / "sync" / "vo-words.json"
SR = 16000
# kata yang diucapkan VO tapi tidak ada di naskah — whisper 13 Okt: tidak ada
PENGISI = {}
CHUNK_S = 24.0


# Kamus MMS_FA hanya HURUF: angka & singkatan dieja sesuai BUNYI-nya (jebakan #3 reference_forced_alignment).
# Pecahannya disatukan lagi lewat `tid`, jadi subtitle tetap menampilkan token naskah aslinya.
BUNYI = {"1": "satu", "3": "tiga", "thr": "te ha er", "dp": "de pe"}
# Video 05: token naskah berangka/berkode → bunyi yang diucapkan VO (whisper 19 Okt: VO membaca kode dalam kurung juga, "IDX V30").
# 19 Okt sore: kalimat daftar indeks (S03) DIGANTI sambungan take MiniMax 15:53 (kalimat 1–4) + 15:51 (kalimat 5–6) yang TIDAK membaca
# kode dalam kurung → token "(IDXV30)" dst. berbunyi "" (tidak dijajarkan; gen-cues mengisi waktunya dari tetangga, subtitle tetap = naskah).
# Ejaan perkiraan bahasa Indonesia; MMS cukup toleran pada selisih vokal, yang wajib = angka jadi kata.
RAW = {
    "LQ45": "el ki empat puluh lima", "IDX": "i de eks", "IDX30": "i de eks tiga puluh",
    "Value30": "value tiga puluh", "(IDXV30)": "", "30": "tiga puluh", "(IDXQ30)": "",
    "Growth30": "grot tiga puluh", "(IDXG30)": "", "20": "dua puluh",
    "(IDXHIDIV20)": "", "BUMN20": "be u em en dua puluh", "BUMN.": "be u em en",
    "3%": "tiga persen", "5%": "lima persen", "S&P": "es en pi", "500": "lima ratus",
    "2007,": "dua ribu tujuh", "2008": "dua ribu delapan", "2008.": "dua ribu delapan", "2017,": "dua ribu tujuh belas",
    "125,8%,": "seratus dua puluh lima koma delapan persen", "7,1%": "tujuh koma satu persen",
    "36,3%,": "tiga puluh enam koma tiga persen", "36,3%.": "tiga puluh enam koma tiga persen", "2,2%": "dua koma dua persen",
}


def norm(w):
    w = unicodedata.normalize("NFKD", w)
    w = "".join(c for c in w if not unicodedata.combining(c)).lower()
    w = w.replace("’", "'").replace("–", " ").replace("—", " ")
    w = re.sub(r"[^a-z0-9' ]", " ", w)
    return " ".join(BUNYI.get(t, t) for t in w.split())


def load_audio():
    import wave
    with wave.open(str(WORK)) as wf:
        assert wf.getframerate() == SR and wf.getnchannels() == 1
        data = np.frombuffer(wf.readframes(wf.getnframes()), dtype="<i2").astype(np.float32) / 32768.0
    return torch.from_numpy(data.copy())


def voiced_segments(wav):
    """amplop energi 10 ms -> segmen bersuara (untuk ujung kalimat; MMS memotong ekor vokal)"""
    hop = SR // 100
    x = wav.numpy()
    rms = np.sqrt(np.mean(x[: len(x) // hop * hop].reshape(-1, hop) ** 2, axis=1))
    sm = np.convolve(rms, np.ones(5) / 5, mode="same")
    peak = float(np.percentile(sm, 99))
    hi, lo = 0.035 * peak, 0.012 * peak
    on, voiced, start = False, [], 0
    for i, v in enumerate(sm):
        if not on and v > hi:
            j = i
            while j > 0 and sm[j - 1] > lo: j -= 1
            on, start = True, j
        elif on and v < lo:
            on = False; voiced.append([start, i])
    if on: voiced.append([start, len(sm)])
    vm = []
    for a, b in voiced:  # gabung celah < 0,10 dtk, buang letupan < 0,08 dtk
        if vm and a - vm[-1][1] < 10: vm[-1][1] = b
        else: vm.append([a, b])
    return [[a / 100, b / 100] for a, b in vm if b - a >= 8]


def main():
    wav = load_audio()
    raw = SCRIPT.read_text(encoding="utf-8")
    words = []
    toks_all = raw.split()
    for tid, tok in enumerate(toks_all):
        for piece in (RAW[tok] if tok in RAW else norm(tok)).split():
            words.append({"raw": tok, "norm": piece, "tid": tid})
        # KATA PENGISI yang diucapkan VO tapi TIDAK ada di naskah — ikut dijajarkan supaya bunyinya tidak
        # menempel ke kata tetangga, lalu dibuang dari keluaran (tid −1). Subtitle tetap = naskah.
        for (sebelum, sesudah), isi in PENGISI.items():
            if tok == sebelum and tid + 1 < len(toks_all) and toks_all[tid + 1] == sesudah and not any(w["tid"] == -1 and w.get("_at") == tid for w in words):
                words.append({"raw": f"<{isi}>", "norm": isi, "tid": -1, "_at": tid})
    bundle = torchaudio.pipelines.MMS_FA
    model = bundle.get_model(with_star=False); model.eval()
    LEX = bundle.get_dict(star=None)
    toks = lambda w: [LEX[c] for c in w if c in LEX]
    keep = [w for w in words if toks(w["norm"])]
    print(f"naskah: {len(raw.split())} token · {len(keep)} potongan kata dijajarkan")

    # ── waktu PERKIRAAN tiap kata dari whisper ──
    ref = json.loads(REF.read_text())["words"]
    flat, ftime = [], []
    for w in ref:
        for t in norm(w["w"]).split():
            flat.append(t); ftime.append(w["a"])
    sm = difflib.SequenceMatcher(None, [w["norm"] for w in keep], flat, autojunk=False)
    approx = [None] * len(keep)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): approx[a + k] = ftime[b + k]
    known = [i for i, v in enumerate(approx) if v is not None]
    print(f"jangkar waktu: {len(known)}/{len(keep)} kata cocok langsung")
    for i in range(len(approx)):
        if approx[i] is not None: continue
        lo = max([k for k in known if k < i], default=None)
        hi = min([k for k in known if k > i], default=None)
        if lo is None: approx[i] = approx[hi]
        elif hi is None: approx[i] = approx[lo]
        else: approx[i] = approx[lo] + (approx[hi] - approx[lo]) * (i - lo) / (hi - lo)

    # ── potong HANYA di jeda AKHIR KALIMAT, kata dibagi menurut INDEKS ──
    # Percobaan 1 (potong di RMS minimum ±6 dtk, kata dibagi menurut waktu whisper) memberi 7 kata skor 0,00
    # yang SEMUANYA di tepi potongan: waktu whisper meleset beberapa ratus ms, kata jatuh ke potongan yang
    # salah lalu dijepit ke ujungnya. Sekarang: untuk tiap target ±24 dtk pilih kata ber-[.?!] terdekat,
    # potong di TENGAH celah sunyi (antar segmen bersuara) yang paling dekat dengan jeda whisper sesudah
    # kata itu, dan kata ≤ indeks itu masuk potongan kiri. Kata dan audio dipotong di batas yang sama.
    vm = voiced_segments(wav)
    gaps = [((b0 + a1) / 2, a1 - b0) for (_, b0), (a1, _) in zip(vm, vm[1:]) if a1 - b0 >= 0.20]
    total = len(wav) / SR
    ends = [i for i, w in enumerate(keep[:-1]) if re.search(r"[.?!][”\"]?$", w["raw"]) and keep[i + 1]["tid"] != w["tid"]]
    cut_idx, cut_t, t = [], [0.0], CHUNK_S
    while t < total - 10:
        # kandidat titik terdekat ke target; ambil yang PUNYA celah sunyi ≤ 1 dtk dari jeda whisper-nya
        cand = sorted((e for e in ends if not cut_idx or e > cut_idx[-1]), key=lambda e: abs(approx[e + 1] - t))
        pick = None
        for i in cand[:6]:
            guess = approx[i + 1]  # whisper: awal kata sesudah titik
            mid, glen = min(gaps, key=lambda g: abs(g[0] - guess))
            if abs(mid - guess) < 1.0 and (not cut_t or mid > cut_t[-1] + 5): pick = (i, mid); break
        if pick is None: break
        cut_idx.append(pick[0]); cut_t.append(pick[1]); t = pick[1] + CHUNK_S
    cut_t.append(total)
    cuts = [round(x * SR) for x in cut_t]
    edges = [0] + [i + 1 for i in cut_idx] + [len(keep)]
    bounds = list(zip(edges, edges[1:]))

    results = []
    for i, ((a, b), (s0, s1)) in enumerate(zip(bounds, zip(cuts, cuts[1:]))):
        chunk = keep[a:b]
        seg = wav[s0:s1].unsqueeze(0)
        if not chunk: continue
        with torch.inference_mode():
            emission, _ = model(seg)
        targets = torch.tensor([[t for w in chunk for t in toks(w["norm"])]], dtype=torch.int32)
        ali, scores = forced_align(emission, targets, blank=0)
        spans = merge_tokens(ali[0], scores[0].exp())
        ratio = seg.shape[1] / emission.shape[1] / SR
        off = s0 / SR
        k = 0
        for w in chunk:
            n = len(toks(w["norm"])); grp = spans[k:k + n]; k += n
            results.append({"w": w["raw"], "tid": w["tid"], "a": off + grp[0].start * ratio, "b": off + grp[-1].end * ratio,
                            "score": float(sum(g.score for g in grp) / len(grp))})
        print(f"  potongan {i + 1:>2}/{len(bounds)}: {len(chunk):>3} kata  {off:6.1f}–{s1 / SR:6.1f} dtk")

    results.sort(key=lambda r: r["a"])
    pengisi = [r for r in results if r["tid"] == -1]
    for r in pengisi: print(f"  pengisi {r['w']} @ {r['a']:.2f}s skor {r['score']:.2f} (tidak ditampilkan)")
    results = [r for r in results if r["tid"] != -1]
    merged = []
    for r in results:  # satukan pecahan satu token ("return-nya" -> return + nya)
        if merged and merged[-1]["tid"] == r["tid"]:
            m = merged[-1]; m["b"] = r["b"]; m["score"] = (m["score"] * m["_n"] + r["score"]) / (m["_n"] + 1); m["_n"] += 1
        else:
            merged.append({**r, "_n": 1})
    for m in merged:
        m.pop("_n")
        m["a"], m["b"], m["score"] = round(m["a"], 3), round(m["b"], 3), round(m["score"], 3)
    tids = [m["tid"] for m in merged]
    assert tids == sorted(tids) and len(set(tids)) == len(tids), "urutan kata hasil alignment tidak monoton"

    OUT.write_text(json.dumps({"meta": {"model": "torchaudio MMS_FA", "audio": SRC.name, "sr": SR,
                                        "durasi_s": round(len(wav) / SR, 3), "token": len(raw.split()), "kata": len(merged)},
                               "words": merged, "energi": {"voiced": vm}}, ensure_ascii=False, indent=1), encoding="utf-8")
    print("\nkata di tepi tiap potongan (skor):")
    for k, ct in enumerate(cut_t[1:-1], 1):
        L = [m for m in merged if m["b"] <= ct][-2:]; Rr = [m for m in merged if m["a"] >= ct][:2]
        print(f"  {ct:7.2f}s  " + " ".join(f"{m['w']}({m['score']:.2f})" for m in L) + "  |  " + " ".join(f"{m['w']}({m['score']:.2f})" for m in Rr))
    low = [m for m in merged if m["score"] < 0.5]
    print(f"\nSELESAI: {len(merged)} kata · skor rendah (<0,50): {len(low)} · segmen bersuara: {len(vm)}")
    for m in low: print(f"   {m['score']:.2f}  {m['a']:7.2f}s  {m['w']}")


if __name__ == "__main__":
    main()
