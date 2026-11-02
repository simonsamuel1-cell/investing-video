#!/usr/bin/env python3
"""
FORCED ALIGNMENT HANYA SCENE 20 (15 Okt: S20 direkam ulang — 01_VO/MiniMax_2026-10-15_14_17_10, naskah baru "Di Tuntun, kamu bisa memilih instrumen …").
VO utuh baru = VO 13 Okt s/d batas S20 (f25838) + rekaman baru (public/vo/inv03_vo_15okt.wav). Kata S01–S19 TIDAK diubah (audionya identik);
kata S20 (token mulai "Jadi ingat satu hal:") dijajarkan ulang pada potongan audio sesudah batas — 42 dtk, satu kali jalan (tanpa pemotongan, jadi
tidak ada jebakan "kata jatuh ke potongan yang salah"). Segmen bersuara (energi.voiced) sesudah batas dihitung ulang dari audio baru.
Jalankan:  ../../../_fondasi/.venv-align/bin/python scripts/align-s20.py
"""
import json, pathlib, re, sys
import numpy as np
import torch, torchaudio
from torchaudio.functional import forced_align, merge_tokens
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from importlib import util
spec = util.spec_from_file_location("af", str(pathlib.Path(__file__).resolve().parent / "align-forced.py")); af = util.module_from_spec(spec); spec.loader.exec_module(af)

ROOT = af.ROOT
BATAS_S20 = 25838  # frame (src/batas.ts s20, VO_OFFSET 0)
T0 = BATAS_S20 / 60
OUT = ROOT / "sync" / "vo-words.json"


def main():
    wav = af.load_audio()  # sync/_work16k.wav (dari VO baru)
    toks_all = af.SCRIPT.read_text(encoding="utf-8").split()
    # token pertama S20 = "Jadi" yang diikuti "ingat"
    t20 = next(i for i in range(len(toks_all) - 1) if toks_all[i] == "Jadi" and toks_all[i + 1] == "ingat")
    words = []
    for tid in range(t20, len(toks_all)):
        for piece in af.norm(toks_all[tid]).split():
            words.append({"raw": toks_all[tid], "norm": piece, "tid": tid})
    bundle = torchaudio.pipelines.MMS_FA
    model = bundle.get_model(with_star=False); model.eval()
    LEX = bundle.get_dict(star=None)
    tk = lambda w: [LEX[c] for c in w if c in LEX]
    keep = [w for w in words if tk(w["norm"])]
    s0 = round(T0 * af.SR)
    seg = wav[s0:].unsqueeze(0)
    with torch.inference_mode():
        emission, _ = model(seg)
    targets = torch.tensor([[t for w in keep for t in tk(w["norm"])]], dtype=torch.int32)
    ali, scores = forced_align(emission, targets, blank=0)
    spans = merge_tokens(ali[0], scores[0].exp())
    ratio = seg.shape[1] / emission.shape[1] / af.SR
    res, k = [], 0
    for w in keep:
        n = len(tk(w["norm"])); grp = spans[k:k + n]; k += n
        res.append({"w": w["raw"], "tid": w["tid"], "a": T0 + grp[0].start * ratio, "b": T0 + grp[-1].end * ratio, "score": float(sum(g.score for g in grp) / len(grp))})
    merged = []
    for r in res:
        if merged and merged[-1]["tid"] == r["tid"]:
            m = merged[-1]; m["b"] = r["b"]; m["score"] = (m["score"] * m["_n"] + r["score"]) / (m["_n"] + 1); m["_n"] += 1
        else:
            merged.append({**r, "_n": 1})
    for m in merged:
        m.pop("_n"); m["a"], m["b"], m["score"] = round(m["a"], 3), round(m["b"], 3), round(m["score"], 3)
    # segmen bersuara: lama s/d batas + baru dari audio baru (sesudah batas)
    old = json.loads(OUT.read_text())
    vm_baru = [[round(T0 + a, 2), round(T0 + b, 2)] for a, b in af.voiced_segments(wav[s0:])]
    vm = [v for v in old["energi"]["voiced"] if v[1] <= T0] + vm_baru
    kata = [w for w in old["words"] if w["tid"] < t20] + merged
    old["words"] = kata
    old["energi"]["voiced"] = vm
    old["meta"].update({"audio": "inv03_vo_15okt.wav", "durasi_s": round(len(wav) / af.SR, 3), "token": len(toks_all), "kata": len(kata),
                        "s20": "dijajarkan ulang 15 Okt (align-s20.py) pada rekaman baru"})
    OUT.write_text(json.dumps(old, ensure_ascii=False, indent=1), encoding="utf-8")
    low = [m for m in merged if m["score"] < 0.5]
    print(f"S20: {len(merged)} kata dari tid {t20} · skor rendah (<0,50): {len(low)} · segmen bersuara baru {len(vm_baru)}")
    for m in merged: print(f"  {m['a']:8.3f}  f{round(m['a'] * 60):6d}  {m['score']:.2f}  {m['w']}")


if __name__ == "__main__":
    main()
