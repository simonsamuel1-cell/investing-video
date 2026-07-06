# Event-Driven episode — assets

Runtime assets are loaded with `staticFile(...)`, which resolves against the
Remotion **`public/`** folder. Place the files below in `public/eventDriven/`:

| File | Used by | Notes |
|---|---|---|
| `voiceover.mp3` | root `<Audio>` (Composition.tsx) | VO track. Flip `MOUNT_VO = true` in `Composition.tsx` once added. Frames are VO-locked — if the VO is re-synced, recompute each scene's `from`/`duration`, cascade downstream, update group spans + `durationInFrames`. |
| Scene 10 — Watchlist / Bullish Signals / Concepts & Sectors screens | `Scene10` `PhoneFrame` | Until supplied, `PhoneFrame` shows a `[NEEDS ASSET]` placeholder. Pass the capture via the `img`/`video` prop. Integrate captures verbatim — no recolouring. |
| Scene 15 — stock page → News tab → Tuntun AI Key Events recording | `Scene15` `PhoneFrame` | Same as above. |

**⚠ Needs review before publishing**
- Scene 4 VO names "Bank Indonesia" (VO-only, no BI figure on screen) — confirm compliance accepts the named institution in narration.
- Scene 12 credits "Jesse Livermore" — name-only card, no portrait/likeness.
- No OJK-style disclaimer scene is in the script; add one if the app requires it.
