#!/usr/bin/env python3
"""MMS_FA untuk SATU rekaman sisipan (16 kHz mono) melawan naskahnya → [{w (token naskah asli), a, b, score}] waktu di klip.
Pakai: ../../../_fondasi/.venv-align/bin/python scripts/align-klip.py <klip16k.wav> <naskah.txt> <keluar.json>"""
import json, re, sys, unicodedata
import torch, torchaudio
from torchaudio.pipelines import MMS_FA as bundle
src, naskah, out = sys.argv[1:4]
tok = open(naskah, encoding="utf-8").read().split()
bersih = lambda t: re.sub(r"[^a-z]", "", unicodedata.normalize("NFKD", t.lower()))
kata = [bersih(t) for t in tok]
assert all(kata), [t for t, k in zip(tok, kata) if not k]
model = bundle.get_model(); tk = bundle.get_tokenizer(); al = bundle.get_aligner()
wav, sr = torchaudio.load(src); assert sr == 16000
with torch.inference_mode():
    em, _ = model(wav)
    spans = al(em[0], tk(kata))
r = wav.size(1) / em.size(1) / sr
res = [{"w": t, "a": round(s[0].start * r, 3), "b": round(s[-1].end * r, 3),
        "score": round(float(sum(x.score * len(x) for x in s) / sum(len(x) for x in s)), 3)} for t, s in zip(tok, spans)]
json.dump(res, open(out, "w"), ensure_ascii=False, indent=1)
lemah = [x for x in res if x["score"] < 0.6]
print(len(res), "kata · skor rendah:", [(x["w"], x["score"]) for x in lemah])
