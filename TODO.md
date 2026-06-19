# Open items (carried verbatim from the build spec §8)

These are the things this build cannot resolve on its own — review before publishing.

1. **S4 "leaves/tree" + S29 "currents"** — the VO references metaphors the visuals
   intentionally avoid (S4 stays a literal stock-vs-theme line split; S29 uses
   straight geometric arrows, not flowing water). Either re-voice those two lines
   or accept the word/picture gap. (Code comments mark both spots.)

2. **S30 (17s, no internal pause)** — verify the recap montage
   (`src/components/RecapMontage.tsx`) holds attention across the full 515-frame
   stretch. It's the biggest sync/pacing risk; tune the per-step cadence and
   Ken-Burns drift in Studio.

3. **S26 MA5 + disclaimer wording** — confirm the "earliest bullish signal" framing
   (`src/scenes/Scene26.tsx`) and the disclaimer copy "Edukasi, bukan saran
   investasi." (`src/components/DisclaimerChip.tsx`) against Tuntun/OJK compliance
   before publishing.

4. **Mid-flow scenes** (6, 8, 16, 19, 23, 25, 26, 30) — transitions land mid-speech,
   not on a pause; they animate continuously (no dip-to-silver). Re-check each against
   the VO in Studio.

## Build-specific follow-ups

5. **Callout coordinates (Layout-B scenes)** — every `TODO(studio)` box constant at
   the top of S12/S19/S21/S24/S26 is a rough guess of where the highlighted UI sits
   on the phone. Set `DEV_GUIDES = true` in `src/theme.ts`, open Studio, and nudge
   each box to the real region in the recording.

6. **Clip trim windows** — `startSec` values in the Layout-B scenes seek into the
   combined recordings per the §5 asset notes (e.g. combo 3–13s for S24). Scrub each
   scene to confirm the right UI moment is on screen for its whole duration; some
   scenes outlast their referenced window and rely on OffthreadVideo holding the
   last frame past EOF.

7. **S32 logo asset** — the end card renders a text "Tuntun" wordmark in the top-right
   reserve as a placeholder. Drop the real logo (PNG/SVG) into `public/` and swap it
   into `src/scenes/Scene32.tsx`.

8. **S27/S28 membership %s** — the momentum percentages are illustrative infographic
   values (brand purple/cyan, never gain/loss green/red). Replace with real numbers
   if this should reflect a specific stock, or keep generic.
