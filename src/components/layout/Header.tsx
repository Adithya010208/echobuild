/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation } from 'wouter';
import { Plus, RotateCcw, Menu, X, Users } from 'lucide-react';
import { DemoUserSwitcher } from '../common/DemoUserSwitcher';
import { MakerProfile, CollaborationProposal, MentorshipRequest } from '../../types';

interface HeaderProps {
  onOpenAddComponent: () => void;
  onOpenResetDemo: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  savedCount: number;
  activeUser: MakerProfile;
  allMakers: MakerProfile[];
  proposals: CollaborationProposal[];
  mentorRequests: MentorshipRequest[];
  onSelectUser: (userId: string) => void;
}

export function Header({
  onOpenAddComponent,
  onOpenResetDemo,
  mobileMenuOpen,
  setMobileMenuOpen,
  savedCount,
  activeUser,
  allMakers,
  proposals,
  mentorRequests,
  onSelectUser,
}: HeaderProps) {
  const [location] = useLocation();

  const navLinks = [
    { href: '/', label: 'Discover' },
    { href: '/components', label: 'My Components' },
    { href: '/projects', label: 'Project Library' },
    { href: '/network', label: 'Maker Network' },
    { href: '/studio', label: '3D Studio' },
    { href: '/saved', label: 'Saved Projects', count: savedCount },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#132B3B] hover:text-[#087F83] transition-colors whitespace-nowrap"
          >
            EcoBuild
          </Link>
        </div>

        {/* Zone 2: Clean nav links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? location === '/'
                : location.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  isActive
                    ? 'text-[#087F83] font-semibold'
                    : 'text-slate-600 hover:text-[#132B3B]'
                }`}
              >
                {link.label}
                {link.count !== undefined && link.count > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-mono bg-slate-100 text-slate-700 rounded">
                    {link.count}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#087F83] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions + Demo User Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Labelled Demo User Switcher */}
          <DemoUserSwitcher
            activeUser={activeUser}
            allMakers={allMakers}
            proposals={proposals}
            mentorRequests={mentorRequests}
            onSelectUser={onSelectUser}
          />

          <button
            onClick={onOpenResetDemo}
            title="Reset demo data to initial state"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Reset Demo</span>
          </button>

          <button
            onClick={onOpenAddComponent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Component</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? location === '/'
                : location.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EAF4F3] text-[#087F83] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{link.label}</span>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="px-2 py-0.5 text-xs font-mono bg-slate-100 rounded">
                      {link.count}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResetDemo();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Baseline
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
