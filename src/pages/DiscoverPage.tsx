/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ComponentItem,
  MakerProfile,
  ProjectMatchResult,
  ProjectTemplate,
  CollaborationProposal,
  MentorshipRequest,
} from '../types';
import { ProjectCard } from '../components/projects/ProjectCard';
import {
  Plus,
  Cpu,
  CheckCircle2,
  Clock,
  Scale,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Send,
} from 'lucide-react';
import { FutureFeatureType } from '../components/common/FutureFeatureModal';
import { calculatePartnerSuggestions } from '../utils/partnerMatching';

interface DiscoverPageProps {
  profile: MakerProfile;
  inventory: ComponentItem[];
  rankedMatches: ProjectMatchResult[];
  savedIds: string[];
  allMakers: MakerProfile[];
  allInventories: Record<string, ComponentItem[]>;
  proposals: CollaborationProposal[];
  mentorRequests: MentorshipRequest[];
  projects: ProjectTemplate[];
  onToggleSave: (id: string) => void;
  onOpenAddComponent: () => void;
  onOpenFutureFeature: (type: FutureFeatureType) => void;
}

export function DiscoverPage({
  profile,
  inventory,
  rankedMatches,
  savedIds,
  allMakers,
  allInventories,
  proposals,
  mentorRequests,
  projects,
  onToggleSave,
  onOpenAddComponent,
  onOpenFutureFeature,
}: DiscoverPageProps) {
  const [, setLocation] = useLocation();

  // Inventory Summary Metrics
  const totalItems = inventory.reduce((sum, item) => sum + item.totalQuantity, 0);
  const freeWorkingUnits = inventory
    .filter((item) => item.condition === 'working')
    .reduce(
      (sum, item) =>
        sum +
        Math.max(
          0,
          item.totalQuantity - item.reservedQuantity - item.installedQuantity
        ),
      0
    );
  const reservedOrInstalled = inventory.reduce(
    (sum, item) => sum + item.reservedQuantity + item.installedQuantity,
    0
  );
  const untestedCount = inventory
    .filter((item) => item.condition === 'untested')
    .reduce(
      (sum, item) =>
        sum +
        Math.max(
          0,
          item.totalQuantity - item.reservedQuantity - item.installedQuantity
        ),
      0
    );

  // Pending proposals for active user
  const pendingIncomingProposals = useMemo(() => {
    return proposals.filter(
      (p) => p.receiverId === profile.id && p.status === 'pending'
    );
  }, [proposals, profile.id]);

  // Featured partner opportunity (find candidate who improves coverage on an almost-ready project)
  const partnerOpportunity = useMemo(() => {
    for (const match of rankedMatches) {
      if (match.missingCount > 0 && match.coveragePercentage > 0) {
        const suggestions = calculatePartnerSuggestions(
          match.project,
          profile,
          inventory,
          allMakers,
          allInventories
        );
        if (suggestions.length > 0 && suggestions[0].coverageImprovementPercentage > 0) {
          return {
            project: match.project,
            suggestion: suggestions[0],
          };
        }
      }
    }
    return null;
  }, [rankedMatches, profile, inventory, allMakers, allInventories]);

  // Featured mentor
  const featuredMentor = useMemo(() => {
    return allMakers.find(
      (m) => m.mentorProfile?.isAvailable && m.id !== profile.id
    );
  }, [allMakers, profile.id]);

  // Projects division
  const almostReadyProjects = rankedMatches.filter(
    (m) => !m.isFullyCovered && m.coveragePercentage >= 50
  );
  const topRecommendations = rankedMatches.slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Pending Proposal Alert Banner (if user has incoming proposal needing action) */}
      {pendingIncomingProposals.length > 0 && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-200/80 rounded-xl text-amber-900 shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Action Required ({pendingIncomingProposals.length} Pending Proposal)
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                You have an incoming collaboration proposal from{' '}
                <strong>
                  {allMakers.find((m) => m.id === pendingIncomingProposals[0].senderId)?.displayName || 'a maker'}
                </strong>. Review and accept to reserve hardware.
              </p>
            </div>
          </div>
          <Link
            href="/network"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shrink-0 shadow-2xs"
          >
            <span>Review in Network</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Hero Greeting & Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-semibold text-[#087F83] tracking-wide uppercase">
              Maker Workspace (Active Identity: {profile.displayName})
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#132B3B]">
              Welcome back, {profile.displayName}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              EcoBuild transforms your spare electronics and salvaged components into functional builds. Review your matches and team collaboration opportunities below.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddComponent}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Components</span>
            </button>
            <Link
              href="/network"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#132B3B] hover:text-[#087F83] bg-slate-100 hover:bg-[#EAF4F3] rounded-xl transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#087F83]" />
              <span>Maker Network</span>
            </Link>
          </div>
        </div>

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-[#F7F9F8] border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total Owned Stock</span>
              <Cpu className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#132B3B] tabular-nums mt-1">
              {totalItems}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Across {inventory.length} distinct item types
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-medium">
              <span>Free Working Units</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums mt-1">
              {freeWorkingUnits}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              Available immediately for builds
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Reserved / Installed</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-700 tabular-nums mt-1">
              {reservedOrInstalled}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Excluded from free part matching
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between text-xs text-amber-800 font-medium">
              <span>Untested Components</span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-800 tabular-nums mt-1">
              {untestedCount}
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5">
              Requires test before coverage
            </div>
          </div>
        </div>
      </div>

      {/* Network Opportunities Section (Phase 2 Addition) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#132B3B] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#087F83]" />
              <span>Maker Network Opportunities</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalized partner suggestions and opted-in lab mentors from your local prototyping network.
            </p>
          </div>
          <Link
            href="/network"
            className="text-xs font-semibold text-[#087F83] hover:underline"
          >
            Open Network Directory →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Partner Spotlight */}
          {partnerOpportunity ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Partner Match Suggestion
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +{partnerOpportunity.suggestion.coverageImprovementPercentage} percentage points
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#132B3B]">
                  Team up on {partnerOpportunity.project.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>{partnerOpportunity.suggestion.maker.displayName}</strong>{' '}
                  ({partnerOpportunity.suggestion.maker.experience}) has shareable parts that satisfy your missing requirements.
                </p>

                <div className="p-3 bg-[#EAF4F3]/60 rounded-lg text-xs text-[#132B3B]">
                  {partnerOpportunity.suggestion.matchExplanation}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Combined: {partnerOpportunity.suggestion.combinedCoveragePercentage}%
                </span>
                <Link
                  href="/network"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087F83] hover:underline"
                >
                  <span>View in Network</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Partner Matching
                </span>
                <h3 className="text-base font-bold text-[#132B3B] mt-1">
                  Connect with Local Teammates
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Browse community makers holding complementary motors, sensors, and microcontrollers.
                </p>
              </div>
              <Link
                href="/network"
                className="mt-4 text-xs font-semibold text-[#087F83] hover:underline"
              >
                Browse All Candidates →
              </Link>
            </div>
          )}

          {/* Mentor Spotlight */}
          {featuredMentor && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Opted-In Mentor
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#087F83] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-[#087F83]" />
                    Verified
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#132B3B]">
                  {featuredMentor.displayName} ({featuredMentor.experience})
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {featuredMentor.bio}
                </p>

                <div className="text-xs text-slate-500 pt-1">
                  <strong>Specialties:</strong> {featuredMentor.skills.slice(0, 3).join(', ')}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {featuredMentor.locationLabel}
                </span>
                <Link
                  href="/network"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087F83] hover:underline"
                >
                  <span>Request Advice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Projects Feed */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#132B3B]">
              Recommended for You
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked deterministically based on your component inventory, interests ({profile.interests.join(', ')}), and {profile.experience} level.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs font-semibold text-[#087F83] hover:underline self-start sm:self-center"
          >
            View all {rankedMatches.length} library recipes →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRecommendations.map((match) => (
            <ProjectCard
              key={match.project.id}
              match={match}
              isSaved={savedIds.includes(match.project.id)}
              onToggleSave={onToggleSave}
              onSelect={(id) => setLocation(`/projects/${id}`)}
            />
          ))}
        </div>
      </section>

      {/* "Almost Ready" Section */}
      {almostReadyProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#132B3B]">
                Almost Ready to Build
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These projects have high coverage but require 1 or 2 more parts to complete the circuit.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {almostReadyProjects.map((match) => (
              <div
                key={match.project.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      {match.project.category} · {match.project.difficulty}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#132B3B] bg-slate-100 px-2 py-0.5 rounded">
                      {match.coveragePercentage}% Covered
                    </span>
                  </div>

                  <h3
                    onClick={() => setLocation(`/projects/${match.project.id}`)}
                    className="text-base font-bold text-[#132B3B] hover:text-[#087F83] transition-colors cursor-pointer mt-1"
                  >
                    {match.project.name}
                  </h3>

                  {/* Missing Requirement Items Pill-Free List */}
                  <div className="mt-3 p-3 bg-amber-50/50 rounded-lg border border-amber-200/60">
                    <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                      Needed to complete circuit:
                    </div>
                    <ul className="space-y-1 text-xs text-amber-900">
                      {match.requirementMatches
                        .filter((r) => r.missingQuantity > 0)
                        .map((r, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span>
                              {r.missingQuantity}× {r.requirement.name}
                            </span>
                            {r.requirement.estimatedUnitPriceUsd && (
                              <span className="text-[11px] font-mono text-amber-800">
                                ~${(r.missingQuantity * r.requirement.estimatedUnitPriceUsd).toFixed(2)} est.
                              </span>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">
                    Est. Duration: {match.project.estimatedDuration}
                  </span>
                  <button
                    onClick={() => setLocation(`/projects/${match.project.id}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#087F83] hover:underline cursor-pointer"
                  >
                    <span>Inspect Requirements</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
