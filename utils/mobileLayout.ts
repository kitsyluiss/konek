// Mobile layout utilities for responsive grid conversion
import { BlockData } from '../types';

/**
 * Calculates the mobile grid layout for a block based on its desktop dimensions.
 *
 * Rules:
 * - Desktop colSpan 1-4 → Mobile 1 column (50% width)
 * - Desktop colSpan 5-9 → Mobile 2 columns (100% width)
 * - Medium blocks (colSpan 3-4) get minimum 2 rowSpan for better proportions
 */
export const getMobileLayout = (block: BlockData): { colSpan: number; rowSpan: number } => {
  // If a block is landscape (wider than tall) or explicitly wider than a standard 3-col square,
  // it should take up the full width (2 columns) on mobile to preserve its horizontal nature.
  const isLandscape = block.colSpan > block.rowSpan;
  const isWide = block.colSpan >= 4;

  const mobileColSpan = isLandscape || isWide ? 2 : 1;

  // Blocks that become narrow need to ensure they have enough height to not look squished
  const mobileRowSpan = mobileColSpan === 1 ? Math.max(block.rowSpan, 2) : block.rowSpan;

  return {
    colSpan: mobileColSpan,
    rowSpan: mobileRowSpan,
  };
};

/**
 * Mobile grid configuration constants
 */
export const MOBILE_GRID_CONFIG = {
  columns: 2,
  rowHeight: 80, // px per row
  gap: 12, // px between items
} as const;
