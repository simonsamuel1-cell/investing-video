/**
 * CaseStudyLayout — shared scaffold for SC09–SC12.
 * The per-scene title + signal chip were replaced by the persistent
 * CaseStudyTabs header (mounted once in Composition, spanning SC09–SC12), so
 * this component is now a thin passthrough. The title / signalChip / headerFrame
 * props are kept (optional, ignored) so the scenes need no edits.
 * Layout slots beneath: SessionView (y 220 → 700), ContextStrip below it.
 */
import React from "react";
import type { ChipVariant } from "./Chip";

export const CaseStudyLayout = ({
  children,
}: {
  title?: string;
  signalChip?: { label: string; variant: ChipVariant };
  headerFrame?: number;
  children: React.ReactNode; // SessionView + ContextStrip + overlays
}) => <>{children}</>;
