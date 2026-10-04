/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ComponentItem,
  ProjectTemplate,
  ProjectMatchResult,
  RequirementMatch,
  ReadinessState,
} from '../types';

/**
 * Pure deterministic matching calculation for a single project against an inventory snapshot.
 */
export function calculateProjectMatch(
  project: ProjectTemplate,
  inventory: ComponentItem[]
): ProjectMatchResult {
  // Track remaining free quantities per inventory item to prevent double-allocating across requirements
  const inventoryAllocations = new Map<
    string,
    {
      workingRemaining: number;
      untestedRemaining: number;
      item: ComponentItem;
    }
  >();

  for (const item of inventory) {
    const freeQuantity = Math.max(
      0,
      item.totalQuantity - item.reservedQuantity - item.installedQuantity
    );

    const isWorking = item.condition === 'working';
    const isUntested = item.condition === 'untested';

    inventoryAllocations.set(item.id, {
      workingRemaining: isWorking ? freeQuantity : 0,
      untestedRemaining: isUntested ? freeQuantity : 0,
      item,
    });
  }

  const requirementMatches: RequirementMatch[] = [];
  let totalRequiredUnits = 0;
  let matchedWorkingUnits = 0;
  let untestedUnits = 0;
  let missingCount = 0;
  let potentialReuseMassGrams = 0;
  let isMassDataComplete = true;
  let estimatedMissingCostUsd = 0;

  for (const req of project.requirements) {
    totalRequiredUnits += req.quantity;

    let neededForReq = req.quantity;
    let matchedWorkingForReq = 0;
    let untestedForReq = 0;
    const allocatedItems: { item: ComponentItem; quantity: number }[] = [];

    // Find inventory items matching exact catalogId
    const matchingItems = inventory.filter(
      (item) => item.catalogId === req.catalogId
    );

    // 1. Allocate working units
    for (const item of matchingItems) {
      if (neededForReq <= 0) break;
      const tracker = inventoryAllocations.get(item.id);
      if (!tracker || tracker.workingRemaining <= 0) continue;

      const take = Math.min(neededForReq, tracker.workingRemaining);
      matchedWorkingForReq += take;
      tracker.workingRemaining -= take;
      neededForReq -= take;

      allocatedItems.push({
        item,
        quantity: take,
      });

      // Sustainability reuse mass: only count allocated units of owned components
      if (item.unitMassGrams !== null && item.unitMassGrams !== undefined) {
        potentialReuseMassGrams += item.unitMassGrams * take;
      } else if (req.typicalUnitMassGrams !== undefined) {
        potentialReuseMassGrams += req.typicalUnitMassGrams * take;
      } else {
        isMassDataComplete = false;
      }
    }

    // 2. Check untested potential units for the remainder
    if (neededForReq > 0) {
      for (const item of matchingItems) {
        if (neededForReq <= 0) break;
        const tracker = inventoryAllocations.get(item.id);
        if (!tracker || tracker.untestedRemaining <= 0) continue;

        const takeUntested = Math.min(neededForReq, tracker.untestedRemaining);
        untestedForReq += takeUntested;
        tracker.untestedRemaining -= takeUntested;
      }
    }

    const missingQuantity = req.quantity - matchedWorkingForReq;
    if (missingQuantity > 0) {
      missingCount += 1;
      estimatedMissingCostUsd +=
        missingQuantity * (req.estimatedUnitPriceUsd ?? 0);
    }

    matchedWorkingUnits += matchedWorkingForReq;
    untestedUnits += untestedForReq;

    requirementMatches.push({
      requirement: req,
      requiredQuantity: req.quantity,
      matchedWorkingQuantity: matchedWorkingForReq,
      untestedPotentialQuantity: untestedForReq,
      missingQuantity,
      allocatedInventoryItems: allocatedItems,
      isFullyCovered: missingQuantity === 0,
    });
  }

  // Coverage percentage: 100 * sum of matched required units / sum of required units
  const coveragePercentage =
    totalRequiredUnits > 0
      ? Math.round((matchedWorkingUnits / totalRequiredUnits) * 1000) / 10
      : 0;

  const isFullyCovered = missingCount === 0;

  // Determine readiness state
  let readinessState: ReadinessState;
  if (!isFullyCovered) {
    // If all missing units can be covered if untested parts are working
    const remainingMissingUnits = totalRequiredUnits - matchedWorkingUnits;
    if (untestedUnits >= remainingMissingUnits) {
      readinessState = 'testing-needed';
    } else {
      readinessState = 'missing-components';
    }
  } else {
    if (project.mechanicalSupplies && project.mechanicalSupplies.length > 0) {
      readinessState = 'supplies-needed';
    } else {
      readinessState = 'covered';
    }
  }

  return {
    project,
    totalRequiredUnits,
    matchedWorkingUnits,
    untestedUnits,
    coveragePercentage,
    missingCount,
    isFullyCovered,
    requirementMatches,
    readinessState,
    potentialReuseMassGrams: Math.round(potentialReuseMassGrams * 10) / 10,
    isMassDataComplete,
    estimatedMissingCostUsd: Math.round(estimatedMissingCostUsd * 100) / 100,
    recommendationReasons: [],
  };
}

/**
 * Calculates match results for an entire project list against an inventory snapshot.
 */
export function calculateAllProjectsMatch(
  projects: ProjectTemplate[],
  inventory: ComponentItem[]
): ProjectMatchResult[] {
  return projects.map((project) => calculateProjectMatch(project, inventory));
}
