import { popIn as popInKit } from './kit';

/**
 * POP untuk Scene 02–13 — identik dengan `kit.popIn` (ease-out-back 60f berpusat di `at`), KECUALI nilai akhirnya: tidak pernah TEPAT 1.
 * Simon 9 Okt "masih ada jeglek / patah-patah": pemindai lonjakan satu-frame menemukan setiap elemen "menajam" satu frame tepat saat pop
 * selesai — transform scale(1) = identitas → Chrome pindah ke jalur raster tajam (reference_chrome_pixel_snap). Dengan 0,99996 jalurnya
 * tidak pernah berganti. `kit` tidak diubah supaya Scene 1 tidak tersentuh.
 */
export const popIn = (f: number, at: number, d?: number) => {
  const v = popInKit(f, at, d);
  return v === 1 ? 0.99996 : v;
};
