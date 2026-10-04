/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ProjectTemplate,
  ProjectWorkspace,
  ProjectRequirement,
  ComponentReservation,
} from '../types';

export interface WorkspaceRequirementCoverage {
  requirement: ProjectRequirement;
  requiredQuantity: number;
  reservedQuantity: number;
  missingQuantity: number;
  reservations: ComponentReservation[];
  isFullyCovered: boolean;
}

export interface WorkspaceMatchResult {
  project: ProjectTemplate;
  workspace: ProjectWorkspace;
  totalRequiredUnits: number;
  matchedReservedUnits: number;
  missingCount: number;
  coveragePercentage: number;
  isFullyCovered: boolean;
  requirementCoverages: WorkspaceRequirementCoverage[];
  potentialReuseMassGrams: number;
}

/**
 * Calculates project requirement coverage for an active collaboration workspace.
 * Explicitly counts the workspace's OWN active reservations as satisfied requirements!
 */
export function calculateWorkspaceProjectMatch(
  project: ProjectTemplate,
  workspace: ProjectWorkspace
): WorkspaceMatchResult {
  const activeReservations = workspace.reservations.filter(
    (res) => res.status === 'active'
  );

  let totalRequiredUnits = 0;
  let matchedReservedUnits = 0;
  let missingCount = 0;
  let potentialReuseMassGrams = 0;

  const requirementCoverages: WorkspaceRequirementCoverage[] = [];

  for (const req of project.requirements) {
    totalRequiredUnits += req.quantity;

    // Find active reservations matching this catalogId
    const matchingReservations = activeReservations.filter(
      (res) => res.catalogId === req.catalogId
    );

    const reservedForReq = matchingReservations.reduce(
      (sum, res) => sum + res.quantity,
      0
    );

    const matchedQuantity = Math.min(req.quantity, reservedForReq);
    const missingQuantity = Math.max(0, req.quantity - matchedQuantity);

    if (missingQuantity > 0) {
      missingCount += 1;
    }

    matchedReservedUnits += matchedQuantity;

    // Accumulate mass for allocated reserved units
    if (req.typicalUnitMassGrams) {
      potentialReuseMassGrams += req.typicalUnitMassGrams * matchedQuantity;
    }

    requirementCoverages.push({
      requirement: req,
      requiredQuantity: req.quantity,
      reservedQuantity: matchedQuantity,
      missingQuantity,
      reservations: matchingReservations,
      isFullyCovered: missingQuantity === 0,
    });
  }

  const coveragePercentage =
    totalRequiredUnits > 0
      ? Math.round((matchedReservedUnits / totalRequiredUnits) * 1000) / 10
      : 0;

  return {
    project,
    workspace,
    totalRequiredUnits,
    matchedReservedUnits,
    missingCount,
    coveragePercentage,
    isFullyCovered: missingCount === 0,
    requirementCoverages,
    potentialReuseMassGrams: Math.round(potentialReuseMassGrams * 10) / 10,
  };
}
