#!/usr/bin/env python3
"""
words-to-srt.py — subtitles straight from the word alignment: one cue per sentence, a sentence too wide for
one line cut at the comma (or colon) nearest its middle, else at its middle word. Text is the SCRIPT's.

  ~/.venvs/tuntun/bin/python scripts/vi/words-to-srt.py words.json out.srt [--max-px 1560] [--offset-frames 0]
"""
import argparse
import json
from pathlib import Path

from PIL import ImageFont

FPS = 60
FONT = ImageFont.truetype(str(Path.home() / "Library/Fonts/PlusJakartaSans-Medium.ttf"), 36)


def width(t):
    return FONT.getlength(t)


def ts(f):
    s = f / FPS
    h, m = int(s // 3600), int(s % 3600 // 60)
    return f"{h:02d}:{m:02d}:{s % 60:06.3f}".replace(".", ",")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("words")
    ap.add_argument("out")
    ap.add_argument("--max-px", type=int, default=1560)
    ap.add_argument("--offset-frames", type=int, default=0)
    a = ap.parse_args()
    ws = json.load(open(a.words))["words"]
    cues = []

    def flush(sent):
        text = " ".join(x["w"] for x in sent)
        if width(text) > a.max_px and len(sent) > 1:
            cuts = [k for k, x in enumerate(sent[:-1]) if x["w"].endswith((",", ":", ";"))]
            k = min(cuts, key=lambda k: abs(k + 1 - len(sent) / 2)) if cuts else len(sent) // 2 - 1
            flush(sent[: k + 1])
            flush(sent[k + 1 :])
            return
        cues.append([sent[0]["f0"] + a.offset_frames, sent[-1]["f1"] + a.offset_frames, text])

    sent = []
    for w in ws:
        sent.append(w)
        if w["w"].rstrip("”\"’'").endswith((".", "?", "!")):
            flush(sent)
            sent = []
    if sent:
        flush(sent)
    for c, d in zip(cues, cues[1:]):
        c[1] = min(c[1], d[0])
    Path(a.out).write_text("\n".join(f"{i + 1}\n{ts(s)} --> {ts(e)}\n{t}\n" for i, (s, e, t) in enumerate(cues)))
    print(f"{len(cues)} cues -> {a.out}; widest {max(width(t) for _, _, t in cues):.0f}px")


if __name__ == "__main__":
    main()
