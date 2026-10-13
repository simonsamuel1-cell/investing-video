# VI pipeline — v0 (draft, will change)

Goal (Simon, 13 Oct 2026): *"setelah kamu generate, aku maunya minim revisi."* At least half the visuals
built by Claude without Simon's revision.

## Inputs (every episode)
Script (text), VO (mp3), SRT — as always. The script is right about the words; the audio about the time.

## Steps

1. **Words on frames.** `scripts/vi/align-words.py VO.mp3 data/words.json --script script.txt`
   → every word with its frame. Beats are named by word ("on *Rp50*"), never typed by hand.
2. **Scenes.** The script cut into scenes at sentence/idea boundaries (sync doc, as before), each with: its
   lines, its key words, and the ONE block it should be (STYLE.md §1).
3. **Storyboard in ChatGPT** — one frame per scene, **layout only, greyscale, no colour**. It is an
   **explanatory-video layout**, not film-making: no camera angles, shots, lighting or acting. A 16:9 board
   with the safe areas, where things sit, how big, what arrives first. Prompt template below.
4. **Build** each scene from its storyboard, with core templates and the assets (STYLE.md §5).
5. **Check** before Simon sees anything: `tsc`, `audit`, stills, `audit-frames`; overlaps and clipping.
   Then the **`vi-reviewer` agent** (`.claude/agents/vi-reviewer.md`) reviews the batch independently —
   one review per batch of scenes, not per element — and its FIXes are applied before Simon sees it.
6. **Gate.**
   - **First episode on this system:** the first **5 scenes** go to Simon for approval (storyboard + built
     stills). Only after that, the rest without approval.
   - **Afterwards:** build straight from the storyboard. If Simon says it is fine, carry on without
     approval. If it falls short, **back to the 5-scene approval step**.

## ChatGPT
Claude drives Simon's ChatGPT (already open, already logged in — "biasa" opens it). No API. Claude never
logs in. Downloads are moved from ~/Downloads into `public/art/<episode>/` through `cutout.py`.

### Storyboard prompt (template)
> Storyboard frame for an **explanatory motion-graphics video** (not a film): a 16:9 layout wireframe,
> **greyscale only, flat boxes and simple line icons, no colour, no shading, no camera directions**.
> Leave the bottom 10% empty (subtitles) and the top-right corner empty (logo).
> Scene: «what the VO says, in one line».
> Show: «the block — e.g. a mindmap with a centre node "X" and branches "A", "B", "C"; Orang Tuntun at the
> left from head to belly, pointing at it». Label every element with its on-screen text. Number the order in
> which elements appear (1, 2, 3…).

### Image prompt (template)
> «subject», flat illustration in the style of a fintech icon set: violet-to-indigo gradient (#5F4DEE),
> soft translucent layered shapes, light soft shadow, no outline, no text. **Transparent background, PNG.**

(For Orang Tuntun: attach the existing `orang-tuntun.png` and ask for the same man, same suit and badge,
new pose «…», full body, transparent background.)

## Tools installed (13 Oct)
- `~/.venvs/tuntun` — Python 3.12 (uv-managed) with faster-whisper (model `small` cached under
  ~/.cache/huggingface) and rembg. Run the scripts with `~/.venvs/tuntun/bin/python`.
- `scripts/vi/align-words.py`, `scripts/vi/cutout.py`, `scripts/vi/iconify.mjs`.

## Next (not built yet)
- A template catalogue in `src/core` for the blocks in STYLE.md §1 (mindmap, path, hub, icon card).
- An overlap/clipping check on rendered frames, run before anything reaches Simon.
