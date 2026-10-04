/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation } from 'wouter';
import { ProjectMatchResult } from '../types';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Bookmark, ArrowRight, BookOpen } from 'lucide-react';

interface SavedProjectsPageProps {
  projectMatches: ProjectMatchResult[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export function SavedProjectsPage({
  projectMatches,
  savedIds,
  onToggleSave,
}: SavedProjectsPageProps) {
  const [, setLocation] = useLocation();

  // Filter only saved projects, using live calculated match results
  const savedMatches = projectMatches.filter((match) =>
    savedIds.includes(match.project.id)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#132B3B]">
          Saved Projects
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your bookmarked build blueprints. Availability percentages and missing parts dynamically update whenever you edit your components.
        </p>
      </div>

      {savedMatches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#EAF4F3] flex items-center justify-center text-[#087F83]">
            <Bookmark className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg font-bold text-[#132B3B]">
              No saved projects yet
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bookmark interesting projects from the library or recommendations to track their missing components and plan future assemblies.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Project Library</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            You have <strong className="text-slate-800">{savedMatches.length}</strong> saved {savedMatches.length === 1 ? 'project' : 'projects'} in your workbench queue.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedMatches.map((match) => (
              <ProjectCard
                key={match.project.id}
                match={match}
                isSaved={true}
                onToggleSave={onToggleSave}
                onSelect={(id) => setLocation(`/projects/${id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
