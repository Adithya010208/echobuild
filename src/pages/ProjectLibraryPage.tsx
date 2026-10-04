/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ProjectMatchResult, ProjectDifficulty } from '../types';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Search, Filter, BookOpen, CheckCircle2, Clock } from 'lucide-react';

interface ProjectLibraryPageProps {
  projectMatches: ProjectMatchResult[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export function ProjectLibraryPage({
  projectMatches,
  savedIds,
  onToggleSave,
}: ProjectLibraryPageProps) {
  const [, setLocation] = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCoverage, setSelectedCoverage] = useState<string>('all');

  // Filter project matches
  const filteredMatches = useMemo(() => {
    return projectMatches.filter((match) => {
      const { project, coveragePercentage, isFullyCovered } = match;

      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.interestTags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === 'all' || project.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;

      let matchesCoverage = true;
      if (selectedCoverage === 'ready') {
        matchesCoverage = isFullyCovered;
      } else if (selectedCoverage === 'partial') {
        matchesCoverage = coveragePercentage > 0 && !isFullyCovered;
      } else if (selectedCoverage === 'missing') {
        matchesCoverage = coveragePercentage === 0;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesCoverage
      );
    });
  }, [
    projectMatches,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedCoverage,
  ]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set(projectMatches.map((m) => m.project.category));
    return Array.from(set);
  }, [projectMatches]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#132B3B]">
          Project Library
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore curated maker blueprints with quantity-aware component matching against your active stock.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project name, description, purpose, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83] transition-colors"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:border-[#087F83] transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Difficulty */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:border-[#087F83] transition-colors"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Coverage Status */}
            <select
              value={selectedCoverage}
              onChange={(e) => setSelectedCoverage(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:border-[#087F83] transition-colors"
            >
              <option value="all">Any Coverage</option>
              <option value="ready">100% Ready (All Parts Free)</option>
              <option value="partial">Partially Covered (&gt; 0%)</option>
              <option value="missing">Zero Parts Covered</option>
            </select>
          </div>
        </div>

        {/* Counter and reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredMatches.length}</strong> of{' '}
            {projectMatches.length} library recipes
          </span>
          {(searchQuery ||
            selectedCategory !== 'all' ||
            selectedDifficulty !== 'all' ||
            selectedCoverage !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSelectedCoverage('all');
              }}
              className="text-[#087F83] hover:underline font-medium cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredMatches.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#EAF4F3] flex items-center justify-center text-[#087F83]">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#132B3B]">
            No matching projects found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to explore all available projects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <ProjectCard
              key={match.project.id}
              match={match}
              isSaved={savedIds.includes(match.project.id)}
              onToggleSave={onToggleSave}
              onSelect={(id) => setLocation(`/projects/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
