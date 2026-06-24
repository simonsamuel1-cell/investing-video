/**
 * Scene 2 (v2) — One Theme. The only on-screen number is a reported quarterly
 * earnings fact with a visible source + date (compliance). Catalysts are stated
 * public-policy facts. No price, no signal, no recommendation.
 *
 * ⚠ DATA VERIFICATION: the JPFA Q1-2026 +167% YoY figure was web-verified at
 * build (2026-06-24) against multiple independent sources — eFeedLink
 * (m.efeedlink.com, 2026-05-20: net profit IDR 1.816T vs IDR 680.4B, +167% YoY)
 * and IDNFinancials (idnfinancials.com news/63859). Re-confirm before final
 * render if the VO or claims change. Catalysts per Samuel Sekuritas (Apr 2026).
 */
export const S2_TICKERS = ["JPFA", "CPIN", "MAIN"] as const;

export const S2_THEME = "Poultry Sector";

export const S2_CATALYSTS = [
  "Free Meals Program (MBG)",
  "GPS Import Cut → Tighter Supply",
] as const;

export const S2_PROOF = {
  label: "JPFA Q1 2026 Net Profit",
  value: "+167% YoY",
  source: "Source: Japfa Comfeed Q1-2026 report · via eFeedLink, May 2026",
} as const;
