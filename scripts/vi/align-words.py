#!/usr/bin/env python3
"""
align-words.py — every spoken word of a VO on the 60 fps frame grid, so a beat can be named by its WORD
("muncul di kata Rp50") instead of a frame number.

  ~/.venvs/tuntun/bin/python scripts/vi/align-words.py VO.mp3 out.json [--script script.txt] [--model small]
  ~/.venvs/tuntun/bin/python scripts/vi/align-words.py --find out.json "Rp50" "mulai punya aset"

faster-whisper (local, CPU) hears the words with their times. With --script, the SCRIPT's words are what
is written out — matched to the heard ones (difflib over normalised tokens), and any the model misheard
or skipped take a time interpolated between their matched neighbours — because the script is right
about the text and the audio is right about the time (the same split as vi01-align.py).

Output: {"fps": 60, "words": [{"i", "w", "start", "end", "f0", "f1", "heard"}]}  (seconds and frames).
"""
import argparse
import difflib
import json
import re
import sys

FPS = 60


def norm(w):
    """Lower-case letters and digits only; "Rp50" and the heard "50" are the same word."""
    t = re.sub(r"[^0-9a-z]", "", w.lower())
    return re.sub(r"^rp(?=\d)", "", t)


def hear(audio, model_size, language):
    from faster_whisper import WhisperModel

    import subprocess

    import numpy as np

    # decoded by ffmpeg here, not by PyAV inside faster-whisper (its PyAV call breaks on newer PyAV)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
    pcm = np.frombuffer(raw, dtype=np.float32)
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, _ = model.transcribe(pcm, language=language, word_timestamps=True, vad_filter=False)
    out = []
    for seg in segments:
        for w in seg.words or []:
            out.append({"w": w.word.strip(), "start": float(w.start), "end": float(w.end)})
    return out


def onto_script(heard, script_words):
    a = [norm(w["w"]) for w in heard]
    b = [norm(w) for w in script_words]
    times = [None] * len(script_words)
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            h = heard[blk.a + k]
            times[blk.b + k] = (h["start"], h["end"], True)
    # interpolate the unmatched between matched neighbours
    known = [i for i, t in enumerate(times) if t]
    for i, t in enumerate(times):
        if t:
            continue
        lo = max([k for k in known if k < i], default=None)
        hi = min([k for k in known if k > i], default=None)
        s = times[lo][1] if lo is not None else (times[hi][0] if hi is not None else 0.0)
        e = times[hi][0] if hi is not None else s + 0.3
        n = (hi if hi is not None else len(times)) - (lo if lo is not None else -1)
        k = i - (lo if lo is not None else -1)
        a0 = s + (e - s) * (k - 1) / max(n - 1, 1)
        a1 = s + (e - s) * k / max(n - 1, 1)
        times[i] = (a0, max(a1, a0 + 0.05), False)
    return [{"w": w, "start": t[0], "end": t[1], "heard": t[2]} for w, t in zip(script_words, times)]


def finish(words):
    for i, w in enumerate(words):
        w["i"] = i
        w["f0"] = round(w["start"] * FPS)
        w["f1"] = round(w["end"] * FPS)
    return {"fps": FPS, "words": words}


def find(path, phrases):
    words = json.load(open(path))["words"]
    toks = [norm(w["w"]) for w in words]
    for p in phrases:
        q = [norm(x) for x in p.split() if norm(x)]
        hits = [i for i in range(len(toks) - len(q) + 1) if toks[i : i + len(q)] == q]
        if not hits:
            print(f"{p!r}: not found")
        for i in hits:
            print(f"{p!r}: f{words[i]['f0']} – f{words[i + len(q) - 1]['f1']}  ({words[i]['start']:.2f}s)")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("audio", nargs="?")
    ap.add_argument("out", nargs="?")
    ap.add_argument("--script")
    ap.add_argument("--model", default="small")
    ap.add_argument("--language", default="id")
    ap.add_argument("--find", nargs="+", metavar=("JSON", "PHRASE"))
    a = ap.parse_args()
    if a.find:
        find(a.find[0], a.find[1:])
        sys.exit(0)
    heard = hear(a.audio, a.model, a.language)
    if a.script:
        # scene headers such as "[SCENE 13 | 02:44–02:59]" are not spoken
        text = re.sub(r"\[[^\]]*\]", " ", open(a.script).read())
        words = onto_script(heard, text.split())
    else:
        words = [dict(h, heard=True) for h in heard]
    json.dump(finish(words), open(a.out, "w"), ensure_ascii=False, indent=1)
    print(f"{len(words)} words -> {a.out}; matched {sum(w['heard'] for w in words)}")
