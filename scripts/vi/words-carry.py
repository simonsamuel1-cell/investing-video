#!/usr/bin/env python3
"""
words-carry.py — after a VO splice, give every word whose audio did not change its PREVIOUS time, moved by exactly as
much as the splice moved its piece. align-words.py re-hears the whole file, and whisper's 30 s windows land elsewhere
once a line is added, so words in untouched scenes come back 10-30 frames off where they were (IN07, 9 Nov: SC05-SC11
all jittered by an SC04 insert) — and every approved W() beat with them. Only the re-recorded lines keep the new times.

  ~/.venvs/tuntun/bin/python scripts/vi/words-carry.py OLD-vo-edits.json OLD-words.json src/episodes/<ep>/data/vo-edits.json src/episodes/<ep>/data/words.json

The old pair is the last one the scenes were approved on (e.g. `git show HEAD:…`). A piece is "the same" when its src,
from, to, silence and match are; its output position is summed from the decoded lengths, as vo-splice.py builds it.
A stretch of the ORIGINAL that a revision split in two (VI01, 11 Nov: SC03's lines cut out of the middle of 58-560 s)
is no longer "the same piece", so its words are carried by their time in the original take instead: a word whose
start and end both fall inside one ORIGINAL piece of the new spec moves to where that piece put it.
"""
import difflib
import importlib.util
import json
import re
import sys
from pathlib import Path

FPS = 60
_spec = importlib.util.spec_from_file_location("vo_splice", Path(__file__).with_name("vo-splice.py"))
vs = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(vs)


def layout(spec_path):
    """[(key, start s, end s, piece)] of each piece in the spliced output."""
    sp = json.load(open(spec_path))
    base = Path(sp["base"])
    pos, out = 0, []
    for p in sp["pieces"]:
        if "silence" in p:
            n = int(p["silence"] * vs.SR)
        else:
            n = len(vs.load(base / sp["source"] if p["src"] == "ORIGINAL" else base / p["src"], p.get("from", 0.0), p.get("to")))
        out.append((json.dumps({k: v for k, v in p.items() if k != "_"}, sort_keys=True), pos / vs.SR, (pos + n) / vs.SR, p))
        pos += n
    return out


def norm(w):
    return re.sub(r"[^0-9a-z]", "", w.lower())


old_spec, old_words, new_spec, new_words = sys.argv[1:5]
A, B = layout(old_spec), layout(new_spec)
# old piece index -> how far it moved, for the pieces that are in both
moved = {}
for blk in difflib.SequenceMatcher(None, [k for k, *_ in A], [k for k, *_ in B], autojunk=False).get_matching_blocks():
    for j in range(blk.size):
        moved[blk.a + j] = B[blk.b + j][1] - A[blk.a + j][1]



def in_original(P, i, t):
    """Output time `t` inside piece i of layout P → the ORIGINAL take's time, or None for a re-recorded line / silence."""
    p = P[i][3]
    return p.get("from", 0.0) + (t - P[i][1]) if p.get("src") == "ORIGINAL" else None


def from_original(t0, t1):
    """The ORIGINAL take's [t0, t1] → its output times in the new spec, when one ORIGINAL piece holds all of it."""
    for _, a, b, p in B:
        if p.get("src") == "ORIGINAL" and p.get("from", 0.0) <= t0 and t1 <= p.get("to", 1e9):
            return a + t0 - p.get("from", 0.0), a + t1 - p.get("from", 0.0)
    return None


O = json.load(open(old_words))["words"]
data = json.load(open(new_words))
N = data["words"]
carried = 0
for blk in difflib.SequenceMatcher(None, [norm(w["w"]) for w in O], [norm(w["w"]) for w in N], autojunk=False).get_matching_blocks():
    for j in range(blk.size):
        o, n = O[blk.a + j], N[blk.b + j]
        piece = next((i for i, (_, a, b, _) in enumerate(A) if a <= o["start"] < b), None)
        if piece is None:
            continue
        end_piece = next((i for i, (_, a, b, _) in enumerate(A) if a < o["end"] <= b), piece)
        if piece not in moved:
            # an ORIGINAL stretch the new spec split: carry by the word's time in the original take
            t0, t1 = in_original(A, piece, o["start"]), in_original(A, end_piece, o["end"])
            at = from_original(t0, t1) if end_piece == piece and t0 is not None and t1 is not None else None
            if at is None:
                continue
            n.update(start=at[0], end=at[1], heard=o["heard"])
            n["f0"], n["f1"] = round(n["start"] * FPS), round(n["end"] * FPS)
            carried += 1
            continue
        # a word that runs over a seam into a changed piece is not the same audio any more
        if end_piece not in moved or moved[end_piece] != moved[piece]:
            continue
        d = moved[piece]
        n.update(start=o["start"] + d, end=o["end"] + d, heard=o["heard"])
        n["f0"], n["f1"] = round(n["start"] * FPS), round(n["end"] * FPS)
        carried += 1
bad = [N[i]["w"] for i in range(1, len(N)) if N[i]["start"] < N[i - 1]["start"]]
json.dump(data, open(new_words, "w"), ensure_ascii=False, indent=1)
open(new_words, "a").write("\n")
print(f"{carried} of {len(N)} words carried from {old_words}; {len(N) - carried} keep the new alignment" + (f"; OUT OF ORDER: {bad}" if bad else ""))
