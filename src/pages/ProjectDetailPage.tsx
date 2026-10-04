/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Link, useRoute } from 'wouter';
import { ProjectMatchResult, ComponentItem } from '../types';
import { ProjectIllustration } from '../components/illustrations/ProjectIllustrations';
import {
  Bookmark,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Scale,
  DollarSign,
  Users,
  ShieldCheck,
  Cpu,
  Package,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { FutureFeatureType } from '../components/common/FutureFeatureModal';
import { getProjectSustainabilitySummary } from '../utils/sustainability';

interface ProjectDetailPageProps {
  projectMatches: ProjectMatchResult[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenFutureFeature: (type: FutureFeatureType, projectName?: string) => void;
  onOpenAddComponent: () => void;
  onFindPartnerForProject?: (projectId: string) => void;
  onAskMentorForProject?: (projectId: string) => void;
}

export function ProjectDetailPage({
  projectMatches,
  savedIds,
  onToggleSave,
  onOpenFutureFeature,
  onOpenAddComponent,
  onFindPartnerForProject,
  onAskMentorForProject,
}: ProjectDetailPageProps) {
  const [, params] = useRoute('/projects/:id');
  const projectId = params?.id;

  const match = useMemo(() => {
    return projectMatches.find((m) => m.project.id === projectId);
  }, [projectMatches, projectId]);

  if (!match) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4 my-8">
        <h2 className="text-xl font-bold text-[#132B3B]">Project Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested project blueprint could not be found or has been moved.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#087F83] bg-[#EAF4F3] rounded-lg hover:bg-[#087F83] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Project Library
        </Link>
      </div>
    );
  }

  const { project, coveragePercentage, isFullyCovered, missingCount, readinessState } = match;
  const isSaved = savedIds.includes(project.id);
  const sustainability = getProjectSustainabilitySummary(match);

  return (
    <div className="space-y-8 pb-16">
      {/* Back button and quick actions */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#087F83] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </Link>

        <button
          onClick={() => onToggleSave(project.id)}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
            isSaved
              ? 'bg-[#087F83] text-white border-[#087F83]'
              : 'bg-white text-slate-700 hover:text-[#087F83] hover:bg-[#EAF4F3] border-slate-200'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          <span>{isSaved ? 'Saved in My Projects' : 'Save Project'}</span>
        </button>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Illustration Preview */}
          <div className="lg:col-span-5 bg-[#F8FAFC] border-b lg:border-b-0 lg:border-r border-slate-200 p-6 flex items-center justify-center min-h-[260px]">
            <ProjectIllustration
              illustrationKey={project.illustrationKey}
              className="max-h-64 object-contain"
            />
          </div>

          {/* Project Header Info */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              {/* Unboxed Metadata Line */}
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
                <span>{project.category}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{project.difficulty} Level</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {project.estimatedDuration} est.
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#132B3B]">
                {project.name}
              </h1>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {project.description}
              </p>

              <div className="mt-3 p-3 bg-[#F7F9F8] rounded-xl border border-slate-200/80">
                <span className="text-xs font-bold text-[#132B3B] block mb-0.5">
                  Intended Utility:
                </span>
                <span className="text-xs text-slate-600 leading-normal">
                  {project.purpose}
                </span>
              </div>
            </div>

            {/* Hardware Coverage Bar & Readiness Status */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Electronic Components Coverage
                </span>
                <span className="font-mono font-bold text-base text-[#132B3B] tabular-nums">
                  {coveragePercentage}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    coveragePercentage === 100
                      ? 'bg-emerald-500'
                      : coveragePercentage >= 60
                      ? 'bg-[#087F83]'
                      : coveragePercentage > 0
                      ? 'bg-amber-500'
                      : 'bg-slate-300'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, coveragePercentage))}%` }}
                />
              </div>

              {/* Status banner */}
              <div className="pt-1">
                {isFullyCovered ? (
                  <div className="flex items-start gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>All electronic parts covered:</strong> Your inventory has verified free units for every listed electronic component. Review mechanical supplies before assembly.
                    </div>
                  </div>
                ) : readinessState === 'testing-needed' ? (
                  <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Testing Needed:</strong> You have unverified inventory that could cover remaining requirements once tested and confirmed working.
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>{missingCount} missing electronic {missingCount === 1 ? 'part' : 'parts'}:</strong> Free inventory does not yet cover all listed items. Check the requirement breakdown below.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability & Additional Cost Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sustainability Display */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#087F83]" />
              Potential Hardware Reuse Mass
            </span>
            <span className="text-xl font-bold font-mono text-[#087F83] tabular-nums">
              {sustainability.potentialReuseMassGrams} grams
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Measures only the owned components allocated to this recipe ({sustainability.allocatedComponentCount} units). Missing parts are excluded. Total stock is never multiplied prematurely.
          </p>
          {!sustainability.isComplete && (
            <div className="text-[11px] text-amber-700 font-medium">
              * Partial weight data available for some matched parts.
            </div>
          )}
        </div>

        {/* Missing Components Cost Estimate */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-slate-600" />
              Additional Parts Cost (Illustrative)
            </span>
            <span className="text-xl font-bold font-mono text-[#132B3B] tabular-nums">
              {match.estimatedMissingCostUsd > 0
                ? `~$${match.estimatedMissingCostUsd.toFixed(2)}`
                : '$0.00 (All Owned)'}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Illustrative estimate based on typical retail replacement costs for missing parts. Local makerspace salvaging can reduce this to zero.
          </p>
          <div className="text-[11px] text-slate-500 italic">
            Illustrative estimate only · Technical prices vary by regional suppliers.
          </div>
        </div>
      </div>

      {/* Requirements Table */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-200 bg-[#F7F9F8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#132B3B]">
              Electronic Requirements & Allocation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact catalog matching with free stock (Total − Reserved − Installed). Faulty or unverified items are excluded.
            </p>
          </div>
          <button
            onClick={onOpenAddComponent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#087F83] hover:text-[#066366] bg-white border border-[#087F83]/30 rounded-lg shadow-2xs transition-colors self-start sm:self-center"
          >
            <span>+ Add Component</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Component Item & Model</th>
                <th className="py-3 px-4 text-center">Required</th>
                <th className="py-3 px-4 text-center">Matched Free</th>
                <th className="py-3 px-4 text-center">Missing</th>
                <th className="py-3 px-4">Coverage Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {match.requirementMatches.map((reqMatch, idx) => {
                const req = reqMatch.requirement;
                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#132B3B]">
                        {req.name}
                        {req.isCritical && (
                          <span className="ml-2 text-[10px] text-amber-700 font-normal">
                            (Critical)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        catalogId: {req.catalogId} · {req.category}
                      </div>

                      {/* Display matched inventory item name if allocated */}
                      {reqMatch.allocatedInventoryItems.length > 0 && (
                        <div className="mt-1 text-[11px] text-emerald-700 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>
                            Allocated from: {reqMatch.allocatedInventoryItems[0].item.name}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 tabular-nums">
                      {reqMatch.requiredQuantity}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700 tabular-nums">
                      {reqMatch.matchedWorkingQuantity}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold tabular-nums">
                      {reqMatch.missingQuantity > 0 ? (
                        <span className="text-rose-600">
                          {reqMatch.missingQuantity}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {reqMatch.isFullyCovered ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Ready
                        </span>
                      ) : reqMatch.untestedPotentialQuantity > 0 ? (
                        <span className="text-amber-800 font-medium">
                          {reqMatch.untestedPotentialQuantity} untested stock available
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">
                          Missing {reqMatch.missingQuantity} unit(s)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mechanical and Prototyping Supplies to Confirm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#087F83]" />
            <h3 className="text-sm font-bold text-[#132B3B] uppercase tracking-wider">
              Other Supplies to Confirm
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mechanical hardware, enclosures, and tools needed to complete physical assembly.
          </p>
          <ul className="space-y-2 pt-1 text-xs text-slate-700">
            {project.mechanicalSupplies.map((supply, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#087F83] mt-1.5 shrink-0" />
                <span>{supply}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Learning Outcomes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#087F83]" />
            <h3 className="text-sm font-bold text-[#132B3B] uppercase tracking-wider">
              Learning Outcomes
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Key electronics and software principles practiced in this build.
          </p>
          <ul className="space-y-2 pt-1 text-xs text-slate-700">
            {project.learningOutcomes.map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* High-Level Build Steps Overview */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#132B3B]">
            High-Level Build Steps Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Planning overview for Phase 1. Complete physical-build schematics and pinouts require physical peer validation before workbench release.
          </p>
        </div>

        <ol className="space-y-3 text-xs sm:text-sm text-slate-700">
          {project.highLevelOverview.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="w-5 h-5 rounded-full bg-[#087F83] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Safety & Bench Protocol:</strong> Always confirm power supply voltage (e.g. 5V vs 3.3V) and use proper current-limiting resistors before connecting batteries or microcontrollers.
          </span>
        </div>
      </section>

      {/* Collaboration and Mentorship Actions */}
      <section className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-900 mb-1">
            Maker Network Integration
          </div>
          <h3 className="text-base font-bold text-[#132B3B]">
            Team Collaboration & Mentorship Tools
          </h3>
          <p className="text-xs text-slate-600">
            Find complementary makers to share missing components, ask a lab mentor, or review assembly planning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              if (onFindPartnerForProject) {
                onFindPartnerForProject(project.id);
              } else {
                onOpenFutureFeature('partner-match', project.name);
              }
            }}
            className="flex items-center justify-center gap-2 p-3 bg-white hover:bg-[#EAF4F3] border border-slate-200 hover:border-[#087F83] rounded-xl text-xs font-semibold text-[#132B3B] hover:text-[#087F83] transition-colors cursor-pointer shadow-2xs"
          >
            <Users className="w-4 h-4 text-[#087F83]" />
            <span>Find a Partner for this Build</span>
          </button>

          <button
            onClick={() => {
              if (onAskMentorForProject) {
                onAskMentorForProject(project.id);
              } else {
                onOpenFutureFeature('ask-mentor', project.name);
              }
            }}
            className="flex items-center justify-center gap-2 p-3 bg-white hover:bg-[#EAF4F3] border border-slate-200 hover:border-[#087F83] rounded-xl text-xs font-semibold text-[#132B3B] hover:text-[#087F83] transition-colors cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-[#087F83]" />
            <span>Ask a Mentor About this Recipe</span>
          </button>

          <Link
            href={`/studio?project=${project.id}`}
            className="flex items-center justify-center gap-2 p-3 bg-[#EAF4F3] hover:bg-[#d5ebe8] border border-[#087F83]/30 rounded-xl text-xs font-semibold text-[#087F83] transition-colors cursor-pointer shadow-2xs"
          >
            <Wrench className="w-4 h-4 text-[#087F83]" />
            <span>Launch 3D Build Studio</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
