#!/usr/bin/env python3
"""
vo-pause.py — Simon's "(jeda 15f)" notes straight into data/vo-edits.json: an extra pause of N frames after a line,
cut into the silence that already follows it in the ORIGINAL take (so nothing is clipped and no breath is lost).

  ~/.venvs/tuntun/bin/python scripts/vi/vo-pause.py src/episodes/<ep> "jual, tahan, atau beli." 10 \
      "untuk diperiksa." 15 [more "line end" frames pairs] [--fps 60] [--note "27 Oct, SC02: "]

The line can be the whole sentence or just its last few words — enough to be found exactly once in the original take
(data/vo-original-words.json). The pause goes in the middle of the longest run of silence between that line's last
word and the next word (or the quietest dip if the take runs on). Then run scripts/vi/vo-refresh.sh.
"""
import argparse
import json
import re
import subprocess
from pathlib import Path

import numpy as np

SR = 16000
HOP = 0.01
SILENT_DB = -42.0


def norm(w):
    return re.sub(r"[^0-9a-z]", "", w.lower())


def envelope(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32)
    n = int(HOP * SR)
    return 20 * np.log10(np.sqrt((x[: len(x) // n * n].reshape(-1, n) ** 2).mean(axis=1)) + 1e-9)


def middle_of_silence(env, lo, hi):
    """The middle of the longest silent run inside [lo, hi] s; the quietest dip if there is none."""
    a, b = max(0, int(lo / HOP)), min(len(env), int(hi / HOP))
    best, run = None, None
    for i in range(a, b):
        if env[i] < SILENT_DB:
            run = (run[0], i + 1) if run else (i, i + 1)
            if best is None or run[1] - run[0] > best[1] - best[0]:
                best = run
        else:
            run = None
    if best is None:
        k = a + int(np.argmin(env[a:b]))
        print(f"  no silence between {lo:.2f}s and {hi:.2f}s; pausing at the dip {k * HOP:.2f}s ({env[k]:.0f} dB)")
        return k * HOP
    return (best[0] + best[1]) / 2 * HOP


def find_end(words, line):
    q = [norm(t) for t in line.split() if norm(t)]
    toks = [norm(w["w"]) for w in words]
    hits = [i for i in range(len(toks) - len(q) + 1) if toks[i : i + len(q)] == q]
    if len(hits) != 1:
        raise SystemExit(f"{line!r}: found {len(hits)} times in the original take — give a few more words")
    return hits[0] + len(q) - 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("pairs", nargs="+")
    ap.add_argument("--fps", type=int, default=60)
    ap.add_argument("--note", default="")
    a = ap.parse_args()
    ep = Path(a.episode)
    spec_path = ep / "data/vo-edits.json"
    spec = json.loads(spec_path.read_text())
    words = json.loads((ep / "data/vo-original-words.json").read_text())["words"]
    env = envelope(Path(spec["base"]) / spec["source"])
    pieces = spec["pieces"]

    for line, frames in zip(a.pairs[::2], a.pairs[1::2]):
        j = find_end(words, line)
        if j + 1 >= len(words):
            raise SystemExit(f"{line!r} is the take's last line — nothing follows it to pause before")
        lo, hi = words[j]["end"] - 0.05, words[j + 1]["start"] + 0.05
        cut = round(middle_of_silence(env, lo, hi), 3)
        secs = round(int(frames) / a.fps, 4)
        pause = {"_": f"{a.note}+{frames}f after '{line}'".strip(), "silence": secs}
        at = [k for k, p in enumerate(pieces) if p.get("src") == "ORIGINAL" and p.get("from", 0) < cut < p.get("to", 1e9)]
        if len(at) == 1:
            old = pieces[at[0]]
            pieces[at[0] : at[0] + 1] = [
                {"src": "ORIGINAL", "from": old.get("from", 0), "to": cut},
                pause,
                {"src": "ORIGINAL", "from": cut} | ({"to": old["to"]} if "to" in old else {}),
            ]
            print(f"+{frames}f ({secs}s) after {line!r}: at original {cut:.2f}s")
            continue
        # the silence after this line is where a re-recorded line begins or ends: the pause goes on that seam — after
        # an original stretch that stops in this silence, or before one that starts in it
        seam = None
        for k, p in enumerate(pieces):
            if p.get("src") != "ORIGINAL":
                continue
            if "to" in p and lo <= p["to"] <= hi:
                seam = k + 1
                break
            if k > 0 and lo <= p.get("from", 0) <= hi:
                seam = k
                break
        if seam is None:
            raise SystemExit(f"{line!r}: no silence or seam to pause in between {lo:.2f}s and {hi:.2f}s")
        pieces.insert(seam, pause)
        print(f"+{frames}f ({secs}s) after {line!r}: on the seam with a re-recorded line")
    spec_path.write_text(json.dumps(spec, ensure_ascii=False, indent=1) + "\n")


if __name__ == "__main__":
    main()
