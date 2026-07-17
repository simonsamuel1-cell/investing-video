/**
 * Phone device-frame geometry constants.
 *
 * These live in their own plain .ts module ON PURPOSE. React Fast Refresh can only
 * hot-swap a module when EVERY export is a component; a plain value exported from a
 * component file (as FRAME_ASPECT used to be, from PhoneFrame.tsx) disqualifies that
 * file as a refresh boundary, so every edit to it invalidates up through PhoneCenter
 * into every phone scene — which shows up as a stale Studio preview that only a full
 * page refresh clears. Keeping constants out of .tsx files avoids that.
 */
export const FRAME_ASPECT = 1924 / 3890; // ≈ 0.4946 (w:h) — scene geometry depends on this
