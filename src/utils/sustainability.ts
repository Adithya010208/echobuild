/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectMatchResult } from '../types';

export interface SustainabilitySummary {
  potentialReuseMassGrams: number;
  allocatedComponentCount: number;
  isComplete: boolean;
  disclaimer: string;
}

/**
 * Calculates the potential electronic hardware reuse mass for a single project's matched allocation.
 * Strict rules:
 * - Only counts allocated units for this project.
 * - Never multiplies by entire unallocated inventory.
 * - Excludes missing or non-owned components.
 * - Flags incomplete data if any matched item has no mass.
 * - No CO2 or waste diversion claims in Phase 1.
 */
export function getProjectSustainabilitySummary(
  match: ProjectMatchResult
): SustainabilitySummary {
  let mass = 0;
  let allocatedCount = 0;
  let isComplete = true;

  for (const reqMatch of match.requirementMatches) {
    for (const alloc of reqMatch.allocatedInventoryItems) {
      allocatedCount += alloc.quantity;
      if (alloc.item.unitMassGrams !== null && alloc.item.unitMassGrams !== undefined) {
        mass += alloc.item.unitMassGrams * alloc.quantity;
      } else if (reqMatch.requirement.typicalUnitMassGrams !== undefined) {
        mass += reqMatch.requirement.typicalUnitMassGrams * alloc.quantity;
      } else {
        isComplete = false;
      }
    }
  }

  return {
    potentialReuseMassGrams: Math.round(mass * 10) / 10,
    allocatedComponentCount: allocatedCount,
    isComplete,
    disclaimer:
      'Phase 1 potential reuse metrics represent the physical mass of owned electronic parts allocated to this recipe. No completed waste diversion or CO2 reduction is claimed until physical assembly.',
  };
}
