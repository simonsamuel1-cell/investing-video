# VI style — v0 (draft, will change)

The Value Investing series (VI02 on). VI is **more abstract** than TA: fewer real charts and app screens,
more ideas. The picture explains an idea; it does not decorate the voice. Simon, 13 Oct 2026:
*"lebih banyak flat design/icon, adanya karakter dan maskot, text, dan mindmap."*

References: `refs/ref-01 … ref-12` (Simon's picks). What they share is written down here, so the
references are not re-read every scene.

---

## 1. The building blocks

| Block | Use it for | From the references |
|---|---|---|
| **Flat icon / object** | a thing the VO names (uang, saham, laporan, toko) | ref-01…05: one hue family, soft gradient, layered translucent shapes, a light drop shadow; ref-04 isometric line-and-fill |
| **Text frame** | the sentence that matters, said on screen | TA-era dashed box, quiz statement ("Tanya juga"), quote card — still valid |
| **Mindmap** | one idea and its parts, causes or kinds | ref-06/08/09: a centre node, curved connectors, a colour per branch, pill nodes; ref-08 has a character sitting on the map |
| **Hub / network** | a system of parts that feed each other | ref-07: line art, a centre, dashed connectors to satellites |
| **Path / journey** | steps in time, a process, "pelan-pelan" | ref-10/11: an S-curve with dots, icons and labels on it; ref-12: numbered badges, the current step big and coloured, the rest grey |
| **Character** | a person who acts the idea out | Orang Tuntun (see §3) |
| **Mascot** | the brand's presence, a guide | Tuntun mascot (see §3) |

A scene is usually ONE of these, sometimes two (a character beside a mindmap). Never a collage.

## 2. Look

- **Palette.** Indigo `#5F4DEE` (hue 247) and cyan `#5CC8E3` (hue 192), with tints and gradients that keep
  the hue. Flat icons are violet→indigo or indigo→cyan gradients on lighter tints of themselves (ref-01, 03).
  Green only for a ✓ or a gain; red only for a ✗ or a loss — sparingly, as accents (ref-01's ✓ badge).
  Everything is a named `theme` key; no hex in scenes.
- **Ground.** The light paper `#F5F5F5`; the drifting grid where a scene needs a "board" (mindmaps, paths).
- **Type.** Plus Jakarta Sans. Labels 36 px / 700 / +2 tracking / indigo (the "Tanya juga" label). Big
  statements 100 px / 800 / −2 tracking. Body 34–48 px. Sentence case; Simon's quoted text exactly as typed.
- **Shape.** Round corners on every rectangle. Cards white, soft shadow. Pills for mindmap nodes.
- **Space.** The 108 px subtitle band and the 360×150 top-right logo zone stay empty. One focal point per frame.

## 3. Characters

- **Orang Tuntun** — the man in the grey suit with the Tuntun name badge (`public/art/vi01/orang-tuntun*.png`).
  *Berwibawa.* Cast him **only where the VO delivers an insight** — a conclusion, a principle, "yang penting…".
  Not for everyday situations. Head-to-belly framing with a fading foot when he sits beside text; full body
  when he stands in a scene. New poses come from ChatGPT (transparent PNG), kept identical in face and suit.
- **Tuntun mascot** — the existing mark (`core/TuntunMark`). **Not redrawn, no new poses** for now. It may
  MOVE: bob up and down, glide along a path, travel a mindmap's connectors.
- **Retired:** the people in blue / light-blue shirts (Orang Kerja, Orang Resign, LiatHP, the polo series)
  and the yellow office worker.

## 4. Motion (unchanged house rules)

Easy ease only. No pops except where asked. A transition at every scene change (CameraCut or a continuous
carry-over); **no wipes**. Dashed boxes open slowly from their centre. Things that belong together arrive
together; things that are said one after another arrive on their words.

## 5. Assets — where each comes from

1. **Icons:** Iconify first (`scripts/vi/iconify.mjs`, attribution-free sets only). If nothing fits and there
   is no other source, ChatGPT.
2. **Character poses, illustrations, real-style images:** ChatGPT, always a transparent PNG; every file goes
   through `scripts/vi/cutout.py` (real alpha, trimmed, ≤ 2000 px).
3. **Real data or real companies:** a real source, tagged; never invented numbers presented as real.
4. **BGM and the logo are never touched.**
