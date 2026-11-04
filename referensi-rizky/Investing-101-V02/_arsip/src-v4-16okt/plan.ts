import { SCENES } from './cues';
import { HOUSE } from './theme';

/**
 * RONA LATAR PER TAHAP (ATURAN-PRODUKSI §7: "warna berbeda per tahap video").
 * Tahap = bab di naskah Simon (src/cues.ts SCENES.bab). Rona bergilir ungu → biru → krim; berganti 60f
 * dipusatkan di kalimat pertama bab-nya (Backdrop: ramp).
 */
const GILIR = [HOUSE.ungu, HOUSE.biru, HOUSE.krim];
const TAHAP = SCENES.filter((s, i) => i === 0 || s.bab !== SCENES[i - 1].bab);
export const HUES: { at: number; hue: string; bab: string }[] = TAHAP.map((s, i) => ({ at: s.a, hue: GILIR[i % GILIR.length], bab: s.bab }));
