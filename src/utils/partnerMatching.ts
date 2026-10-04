/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ProjectTemplate,
  MakerProfile,
  ComponentItem,
  PartnerSuggestion,
  ProjectRequirement,
} from '../types';
import { calculateProjectMatch } from './matching';

/**
 * Calculates project-specific partner recommendations based on complementary shareable inventory,
 * skills, and interest overlap.
 */
export function calculatePartnerSuggestions(
  project: ProjectTemplate,
  activeUser: MakerProfile,
  userInventory: ComponentItem[],
  allMakers: MakerProfile[],
  allInventories: Record<string, ComponentItem[]>
): PartnerSuggestion[] {
  // 1. Calculate Active User's Baseline Match
  const userMatch = calculateProjectMatch(project, userInventory);
  const totalRequiredUnits = userMatch.totalRequiredUnits;
  const userMatchedUnits = userMatch.matchedWorkingUnits;
  const userCoveragePercentage = userMatch.coveragePercentage;

  // Extract which requirements still have missing quantities
  const missingRequirements = userMatch.requirementMatches
    .filter((r) => r.missingQuantity > 0)
    .map((r) => ({
      requirement: r.requirement,
      neededQuantity: r.missingQuantity,
    }));

  const userContributedItems = userMatch.requirementMatches
    .flatMap((rm) =>
      rm.allocatedInventoryItems.map((alloc) => ({
        item: alloc.item,
        satisfiesRequirement: rm.requirement,
        quantity: alloc.quantity,
      }))
    );

  const candidateSuggestions: PartnerSuggestion[] = [];

  // 2. Evaluate Each Other Maker
  const candidates = allMakers.filter(
    (m) => m.id !== activeUser.id && m.collaborationPreference !== 'Solo maker'
  );

  for (const candidate of candidates) {
    const candidateInventory = allInventories[candidate.id] || [];

    // Track candidate's available free working shareable units
    const candidateAllocations = new Map<string, { remaining: number; item: ComponentItem }>();
    for (const item of candidateInventory) {
      if (item.isSharedForCollaboration === false) continue;
      if (item.condition !== 'working') continue;

      const free = Math.max(
        0,
        item.totalQuantity - item.reservedQuantity - item.installedQuantity
      );
      if (free > 0) {
        candidateAllocations.set(item.id, { remaining: free, item });
      }
    }

    let partnerMatchedUnits = 0;
    const partnerOfferedItems: PartnerSuggestion['partnerOfferedItems'] = [];
    const stillMissing: PartnerSuggestion['stillMissingRequirements'] = [];

    // Attempt to fill remaining deficits with candidate's shareable stock
    for (const missing of missingRequirements) {
      let needed = missing.neededQuantity;
      let candidateFilled = 0;

      // Find candidate inventory items with exact catalogId
      const candidateMatching = Array.from(candidateAllocations.values()).filter(
        (entry) => entry.item.catalogId === missing.requirement.catalogId
      );

      for (const entry of candidateMatching) {
        if (needed <= 0) break;
        if (entry.remaining <= 0) continue;

        const take = Math.min(needed, entry.remaining);
        candidateFilled += take;
        entry.remaining -= take;
        needed -= take;

        partnerOfferedItems.push({
          item: entry.item,
          satisfiesRequirement: missing.requirement,
          offeredQuantity: take,
        });
      }

      partnerMatchedUnits += candidateFilled;

      if (needed > 0) {
        stillMissing.push({
          requirement: missing.requirement,
          missingQuantity: needed,
        });
      }
    }

    // Combined coverage
    const combinedUnits = userMatchedUnits + partnerMatchedUnits;
    const combinedCoveragePercentage =
      totalRequiredUnits > 0
        ? Math.round((combinedUnits / totalRequiredUnits) * 1000) / 10
        : 0;

    const coverageImprovementPercentage = Math.round(
      (combinedCoveragePercentage - userCoveragePercentage) * 10
    ) / 10;

    // Complementary skills (skills candidate has that active user does not)
    const complementarySkills = candidate.skills.filter(
      (skill) => !activeUser.skills.includes(skill)
    );

    // Shared interests
    const sharedInterests = candidate.interests.filter((interest) =>
      activeUser.interests.includes(interest)
    );

    // Construct plain-language explanation
    const offeredNames = Array.from(
      new Set(
        partnerOfferedItems.map(
          (o) => `${o.offeredQuantity}× ${o.item.name.split('(')[0].trim()}`
        )
      )
    );

    let matchExplanation = '';
    if (partnerOfferedItems.length > 0) {
      matchExplanation = `${candidate.displayName} offers ${offeredNames.join(', ')}, boosting coverage by +${coverageImprovementPercentage} percentage points.`;
    } else if (complementarySkills.length > 0) {
      matchExplanation = `${candidate.displayName} doesn't hold missing parts, but brings complementary expertise in ${complementarySkills.slice(0, 2).join(' and ')}.`;
    } else {
      matchExplanation = `${candidate.displayName} shares your interest in ${sharedInterests.join(', ') || 'maker builds'}.`;
    }

    // Deterministic ranking score:
    // Coverage improvement is dominant (x100)
    // +20 per complementary skill
    // +15 per shared interest
    // +25 if open to team builds
    let rankingScore = coverageImprovementPercentage * 10;
    if (combinedCoveragePercentage === 100) rankingScore += 50;
    rankingScore += complementarySkills.length * 15;
    rankingScore += sharedInterests.length * 10;
    if (candidate.collaborationPreference === 'Open to team builds') {
      rankingScore += 20;
    }

    // Include candidate if they offer parts OR have strong skill/interest synergy
    candidateSuggestions.push({
      maker: candidate,
      project,
      userCoveragePercentage,
      combinedCoveragePercentage,
      coverageImprovementPercentage,
      userMatchedUnits,
      partnerMatchedUnits,
      totalRequiredUnits,
      partnerOfferedItems,
      userContributedItems,
      stillMissingRequirements: stillMissing,
      complementarySkills,
      sharedInterests,
      matchExplanation,
      rankingScore,
    });
  }

  // Deterministic Sort
  return candidateSuggestions.sort((a, b) => {
    if (b.rankingScore !== a.rankingScore) return b.rankingScore - a.rankingScore;
    if (b.coverageImprovementPercentage !== a.coverageImprovementPercentage) {
      return b.coverageImprovementPercentage - a.coverageImprovementPercentage;
    }
    return a.maker.displayName.localeCompare(b.maker.displayName);
  });
}
