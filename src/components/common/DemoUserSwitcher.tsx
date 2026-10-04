/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MakerProfile, CollaborationProposal, MentorshipRequest } from '../../types';
import { User, ChevronDown, Check, ShieldCheck, Sparkles, Bell } from 'lucide-react';

interface DemoUserSwitcherProps {
  activeUser: MakerProfile;
  allMakers: MakerProfile[];
  proposals: CollaborationProposal[];
  mentorRequests: MentorshipRequest[];
  onSelectUser: (userId: string) => void;
}

export function DemoUserSwitcher({
  activeUser,
  allMakers,
  proposals,
  mentorRequests,
  onSelectUser,
}: DemoUserSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Calculate pending items for each maker
  const getMakerPendingCount = (makerId: string) => {
    const pendingIncomingProposals = proposals.filter(
      (p) => p.receiverId === makerId && p.status === 'pending'
    ).length;
    const pendingMentorRequests = mentorRequests.filter(
      (r) => r.mentorId === makerId && (r.status === 'open' || r.status === 'accepted')
    ).length;
    return pendingIncomingProposals + pendingMentorRequests;
  };

  const activePendingCount = getMakerPendingCount(activeUser.id);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-[#EAF4F3] hover:bg-[#d8ecea] text-[#132B3B] border border-[#087F83]/30 rounded-lg transition-colors cursor-pointer shadow-2xs"
        aria-label="Switch active demo identity"
        aria-expanded={isOpen}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-slate-500 font-normal hidden sm:inline">Role:</span>
        <span className="font-bold text-[#087F83]">{activeUser.displayName}</span>
        <span className="text-[10px] text-slate-500 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">
          Demo
        </span>

        {activePendingCount > 0 && (
          <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold font-mono text-white bg-amber-500 rounded-full">
            {activePendingCount}
          </span>
        )}

        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100">
          <div className="p-3 bg-[#F7F9F8]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Switch Demo Identity
              </span>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Local Prototype
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Switch roles to test proposal acceptance, inspect complementary inventories, and reply as a mentor.
            </p>
          </div>

          <div className="py-1 max-h-80 overflow-y-auto">
            {allMakers.map((maker) => {
              const isSelected = maker.id === activeUser.id;
              const pendingCount = getMakerPendingCount(maker.id);
              const isMentor = Boolean(maker.mentorProfile?.isAvailable);

              return (
                <button
                  key={maker.id}
                  onClick={() => {
                    onSelectUser(maker.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start justify-between p-3 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#EAF4F3]/70 font-semibold'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#132B3B]">
                        {maker.displayName}
                      </span>
                      {isMentor && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#087F83] bg-white px-1.5 py-0.2 rounded border border-[#087F83]/30 font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          Mentor
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500">
                        ({maker.experience})
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {maker.skills.slice(0, 2).join(' · ')}
                    </div>

                    {maker.locationLabel && (
                      <div className="text-[10px] text-slate-400">
                        {maker.locationLabel}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    {pendingCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono text-amber-800 bg-amber-100 rounded-full" title={`${pendingCount} pending items for ${maker.displayName}`}>
                        {pendingCount} new
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#087F83]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-2.5 bg-slate-50 text-[11px] text-slate-500 text-center">
            Inventories and permissions remain strictly partitioned per maker.
          </div>
        </div>
      )}
    </div>
  );
}
