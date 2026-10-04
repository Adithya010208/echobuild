/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectMatchResult, UserProfile, ComponentItem } from '../types';

/**
 * Computes deterministic recommendation scores and human-readable explanation reasons.
 */
export function rankAndExplainProjects(
  matchResults: ProjectMatchResult[],
  profile: UserProfile,
  inventory: ComponentItem[]
): ProjectMatchResult[] {
  const hasInventory = inventory.some(
    (item) =>
      item.condition === 'working' &&
      item.totalQuantity - item.reservedQuantity - item.installedQuantity > 0
  );

  return matchResults
    .map((match) => {
      const reasons: string[] = [];
      let score = 0;

      // 1. Base score from coverage percentage (0 to 100 points)
      score += match.coveragePercentage * 1.5;

      // Identify specific high-value components owned and allocated
      const matchedNames: string[] = [];
      for (const reqMatch of match.requirementMatches) {
        if (reqMatch.matchedWorkingQuantity > 0) {
          matchedNames.push(reqMatch.requirement.name.split('(')[0].trim());
        }
      }

      if (matchedNames.length > 0) {
        const topComponents = Array.from(new Set(matchedNames)).slice(0, 2);
        reasons.push(`Uses your ${topComponents.join(' and ')}.`);
      }

      // 2. Interest alignment
      const matchingInterests = match.project.interestTags.filter((tag) =>
        profile.interests.includes(tag)
      );
      if (matchingInterests.length > 0) {
        score += matchingInterests.length * 15;
        reasons.push(`Matches your ${matchingInterests[0]} interest.`);
      }

      // 3. Difficulty preference alignment
      if (match.project.difficulty === profile.preferredDifficulty) {
        score += 20;
        reasons.push(`Aligned with your ${profile.preferredDifficulty} level.`);
      } else if (
        profile.preferredDifficulty === 'Beginner' &&
        match.project.difficulty === 'Intermediate'
      ) {
        score += 5;
      }

      // 4. Missing parts and cost penalty/bonus
      if (match.isFullyCovered) {
        score += 35;
        reasons.push('All listed electronic parts available right now.');
      } else if (match.missingCount === 1) {
        score += 10;
        reasons.push('Only 1 listed component missing.');
      } else if (match.missingCount > 0) {
        // slight penalty for expensive missing parts
        score -= Math.min(20, match.estimatedMissingCostUsd);
      }

      // 5. Handle zero inventory edge case
      if (!hasInventory) {
        if (match.project.difficulty === 'Beginner') {
          score += 40;
          reasons.unshift(
            'Recommended starter build. Add your electronic components for personalized matching.'
          );
        } else {
          reasons.unshift(
            'Add components to your inventory to calculate part availability.'
          );
        }
      }

      // Untested stock notice
      if (match.untestedUnits > 0 && !match.isFullyCovered) {
        reasons.push(
          `${match.untestedUnits} unverified component could cover missing needs once tested.`
        );
      }

      return {
        ...match,
        score,
        recommendationReasons: reasons.slice(0, 3), // Keep concise and clean
      };
    })
    .sort((a, b) => {
      // Deterministic sort: higher score first, then higher coverage, then lower missing cost, then project name
      if (b.score !== a.score) return b.score - a.score;
      if (b.coveragePercentage !== a.coveragePercentage)
        return b.coveragePercentage - a.coveragePercentage;
      if (a.estimatedMissingCostUsd !== b.estimatedMissingCostUsd)
        return a.estimatedMissingCostUsd - b.estimatedMissingCostUsd;
      return a.project.name.localeCompare(b.project.name);
    });
}
