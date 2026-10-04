/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  ProjectTemplate,
  MakerProfile,
  ComponentItem,
  CollaborationProposal,
  ProjectWorkspace,
  MentorshipRequest,
  PartnerSuggestion,
} from '../types';
import { calculatePartnerSuggestions } from '../utils/partnerMatching';
import { calculateProjectMatch } from '../utils/matching';
import { ProposalModal } from '../components/network/ProposalModal';
import { MentorRequestModal } from '../components/network/MentorRequestModal';
import {
  Users,
  ShieldCheck,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  Package,
  Layers,
  Check,
  X,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

interface MakerNetworkPageProps {
  projects: ProjectTemplate[];
  activeUser: MakerProfile;
  allMakers: MakerProfile[];
  allInventories: Record<string, ComponentItem[]>;
  proposals: CollaborationProposal[];
  workspaces: ProjectWorkspace[];
  mentorRequests: MentorshipRequest[];
  initialProjectId?: string;
  onSendProposal: (proposal: CollaborationProposal) => void;
  onAcceptProposal: (proposalId: string) => { success: boolean; error?: string; workspaceId?: string };
  onDeclineProposal: (proposalId: string) => void;
  onCancelProposal: (proposalId: string) => void;
  onSubmitMentorRequest: (request: MentorshipRequest) => void;
  onRespondMentorRequest: (requestId: string, content: string) => void;
  onResolveMentorRequest: (requestId: string) => void;
}

export function MakerNetworkPage({
  projects,
  activeUser,
  allMakers,
  allInventories,
  proposals,
  workspaces,
  mentorRequests,
  initialProjectId,
  onSendProposal,
  onAcceptProposal,
  onDeclineProposal,
  onCancelProposal,
  onSubmitMentorRequest,
  onRespondMentorRequest,
  onResolveMentorRequest,
}: MakerNetworkPageProps) {
  const [, setLocation] = useLocation();

  const [activeTab, setActiveTab] = useState<'partners' | 'mentors' | 'proposals'>('partners');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || projects[5]?.id || projects[0]?.id || '' // Default to Obstacle Rover if available
  );

  // Modals state
  const [activeProposalCandidate, setActiveProposalCandidate] = useState<PartnerSuggestion | null>(null);
  const [activeMentorToRequest, setActiveMentorToRequest] = useState<MakerProfile | null>(null);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);

  // Proposal acceptance notification
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Mentor response text input state (keyed by request ID)
  const [mentorReplyText, setMentorReplyText] = useState<Record<string, string>>({});

  // Active user's inventory
  const userInventory = useMemo(() => {
    return allInventories[activeUser.id] || [];
  }, [allInventories, activeUser.id]);

  // Selected project object
  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Calculate user's individual coverage for the selected project
  const userProjectMatch = useMemo(() => {
    if (!selectedProject) return null;
    return calculateProjectMatch(selectedProject, userInventory);
  }, [selectedProject, userInventory]);

  // Calculate partner suggestions for the selected project
  const partnerSuggestions = useMemo(() => {
    if (!selectedProject) return [];
    return calculatePartnerSuggestions(
      selectedProject,
      activeUser,
      userInventory,
      allMakers,
      allInventories
    );
  }, [selectedProject, activeUser, userInventory, allMakers, allInventories]);

  // Mentors list
  const availableMentors = useMemo(() => {
    return allMakers.filter((m) => m.mentorProfile?.isAvailable);
  }, [allMakers]);

  // User's relevant incoming and outgoing proposals
  const incomingProposals = proposals.filter((p) => p.receiverId === activeUser.id);
  const outgoingProposals = proposals.filter((p) => p.senderId === activeUser.id);

  // User's workspaces
  const userWorkspaces = workspaces.filter((w) => w.memberIds.includes(activeUser.id));

  // User's mentor requests (asked by activeUser OR assigned to activeUser as mentor)
  const myMentorRequests = mentorRequests.filter(
    (r) => r.requesterId === activeUser.id || r.mentorId === activeUser.id
  );

  const handleAccept = (proposalId: string) => {
    setActionError(null);
    setActionSuccess(null);
    const result = onAcceptProposal(proposalId);
    if (result.success && result.workspaceId) {
      setActionSuccess('Collaboration accepted! Workspaces created and components reserved.');
      setTimeout(() => {
        setLocation(`/workspaces/${result.workspaceId}`);
      }, 1200);
    } else {
      setActionError(result.error || 'Failed to accept proposal.');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087F83] uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Collaborative Maker Network (Phase 2 Prototype)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#132B3B]">
            Maker Network & Team Workbench
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover teammates with complementary parts, request guidance from opted-in mentors, and coordinate shared builds.
          </p>
        </div>

        {/* Quick Tabs Counter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'partners'
                ? 'bg-white text-[#087F83] shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Project Partners
          </button>
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'mentors'
                ? 'bg-white text-[#087F83] shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mentors ({availableMentors.length})
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer relative ${
              activeTab === 'proposals'
                ? 'bg-white text-[#087F83] shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Activity
            {incomingProposals.filter((p) => p.status === 'pending').length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                {incomingProposals.filter((p) => p.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Action Banners */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{actionError}</span>
        </div>
      )}

      {/* TAB 1: PROJECT PARTNERS */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          {/* Project Selector Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Project to Find Partners:
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full max-w-lg px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83] transition-colors"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.difficulty} · {p.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Individual Coverage badge */}
              {userProjectMatch && (
                <div className="p-3 bg-[#F7F9F8] rounded-xl border border-slate-200 text-right shrink-0">
                  <div className="text-[11px] text-slate-500">
                    Your Individual Coverage
                  </div>
                  <div className="text-xl font-bold font-mono text-[#132B3B] tabular-nums">
                    {userProjectMatch.coveragePercentage}%
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {userProjectMatch.matchedWorkingUnits} of {userProjectMatch.totalRequiredUnits} units owned
                  </div>
                </div>
              )}
            </div>

            {/* Missing Requirements pills */}
            {userProjectMatch && userProjectMatch.missingCount > 0 && (
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">
                  Deficits to fill:
                </span>
                {userProjectMatch.requirementMatches
                  .filter((r) => r.missingQuantity > 0)
                  .map((r, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/80 font-mono text-[11px]"
                    >
                      {r.missingQuantity}× {r.requirement.name.split('(')[0].trim()}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Partner Candidates Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#132B3B]">
                  Suggested Teammates for {selectedProject?.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Makers with shareable, eligible working parts and complementary maker skills.
                </p>
              </div>
            </div>

            {partnerSuggestions.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500 space-y-2">
                <p>No candidates available with complementary shareable stock.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {partnerSuggestions.map((suggestion) => {
                  const candidate = suggestion.maker;

                  return (
                    <div
                      key={candidate.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
                    >
                      <div>
                        {/* Candidate Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-bold text-[#132B3B]">
                                {candidate.displayName}
                              </h3>
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                                Demo Maker
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {candidate.experience} · {candidate.locationLabel || 'Campus Hub'}
                            </div>
                          </div>

                          {/* Combined Coverage Badge */}
                          <div className="text-right shrink-0">
                            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              {suggestion.combinedCoveragePercentage}% Combined
                            </span>
                            {suggestion.coverageImprovementPercentage > 0 && (
                              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                                +{suggestion.coverageImprovementPercentage} percentage points boost
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bio / Skills */}
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {candidate.bio}
                        </p>

                        {/* Match Explanation Box */}
                        <div className="mt-3 p-3 bg-[#EAF4F3]/60 rounded-lg border border-[#087F83]/15 text-xs text-[#132B3B] leading-relaxed">
                          <strong className="text-[#087F83]">Match Breakdown:</strong>{' '}
                          {suggestion.matchExplanation}
                        </div>

                        {/* Offered Components List */}
                        {suggestion.partnerOfferedItems.length > 0 && (
                          <div className="mt-3 space-y-1.5">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                              Offered Hardware:
                            </div>
                            <ul className="text-xs text-slate-700 space-y-1">
                              {suggestion.partnerOfferedItems.map((offered, idx) => (
                                <li key={idx} className="flex items-center gap-1.5">
                                  <span className="text-[#087F83] font-bold">✔</span>
                                  <span>
                                    {offered.offeredQuantity}× {offered.item.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-400 capitalize">
                          {candidate.collaborationPreference}
                        </span>

                        <button
                          onClick={() => setActiveProposalCandidate(suggestion)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Propose Collaboration</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MENTORS DIRECTORY */}
      {activeTab === 'mentors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#132B3B]">
                Opted-In Peer & Lab Mentors
              </h2>
              <p className="text-xs text-slate-500">
                Experienced electronics builders offering advice on circuit design, troubleshooting, and code.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {availableMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-[#132B3B]">
                          {mentor.displayName}
                        </h3>
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#087F83] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                          <ShieldCheck className="w-3 h-3 text-[#087F83]" />
                          Verified Mentor
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Self-declared experience: <strong>{mentor.experience}</strong> · {mentor.locationLabel}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {mentor.bio}
                  </p>

                  {/* Mentorship topics */}
                  {mentor.mentorProfile && (
                    <div className="mt-3 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Help Topics Supported:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {mentor.mentorProfile.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-0.5 text-[11px] rounded bg-slate-100 text-slate-700 capitalize"
                          >
                            {topic.replace('-', ' ')}
                          </span>
                        ))}
                      </div>

                      <div className="p-3 bg-[#EAF4F3]/60 rounded-lg border border-[#087F83]/15 text-xs text-slate-600 mt-2">
                        <strong className="text-[#132B3B]">Availability:</strong>{' '}
                        {mentor.mentorProfile.availabilityNotes}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Language: {mentor.mentorProfile?.preferredLanguage || 'English'}
                  </span>

                  <button
                    onClick={() => {
                      setActiveMentorToRequest(mentor);
                      setIsMentorModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#087F83] hover:text-white bg-[#EAF4F3] hover:bg-[#087F83] border border-[#087F83]/30 rounded-lg transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ask this Mentor</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MY ACTIVITY (Proposals, Requests, Workspaces) */}
      {activeTab === 'proposals' && (
        <div className="space-y-8">
          {/* Active Workspaces Section */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#132B3B] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#087F83]" />
                <span>My Active Workspaces ({userWorkspaces.length})</span>
              </h2>
            </div>

            {userWorkspaces.length === 0 ? (
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                You have no active collaborative workspaces. Propose or accept a collaboration to start building together!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userWorkspaces.map((ws) => {
                  const proj = projects.find((p) => p.id === ws.projectId);
                  return (
                    <div
                      key={ws.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{proj?.category}</span>
                          <span className="font-semibold text-emerald-700 capitalize">
                            {ws.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#132B3B] mt-1">
                          {proj?.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          Team: {ws.memberIds.map((id) => allMakers.find((m) => m.id === id)?.displayName || id).join(' & ')}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          {ws.reservations.length} components reserved
                        </span>
                        <button
                          onClick={() => setLocation(`/workspaces/${ws.id}`)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#087F83] hover:underline cursor-pointer"
                        >
                          <span>Open Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Incoming Collaboration Proposals */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#132B3B] flex items-center gap-1.5">
              <Send className="w-4 h-4 text-[#087F83]" />
              <span>Incoming Proposals for {activeUser.displayName} ({incomingProposals.length})</span>
            </h2>

            {incomingProposals.length === 0 ? (
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                No incoming proposals for your current profile.
              </div>
            ) : (
              <div className="space-y-4">
                {incomingProposals.map((prop) => {
                  const sender = allMakers.find((m) => m.id === prop.senderId);
                  const proj = projects.find((p) => p.id === prop.projectId);

                  return (
                    <div
                      key={prop.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="text-xs text-slate-500">
                            Proposal from <strong>{sender?.displayName}</strong>
                          </div>
                          <h3 className="text-base font-bold text-[#132B3B]">
                            {proj?.name}
                          </h3>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 text-xs font-bold rounded-md self-start sm:self-center capitalize ${
                            prop.status === 'pending'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : prop.status === 'accepted'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {prop.status}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 italic">
                        "{prop.message}"
                      </div>

                      {/* Hardware contributions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg border border-slate-200 bg-[#F7F9F8]">
                          <span className="font-bold text-slate-700 block mb-1">
                            {sender?.displayName} offers:
                          </span>
                          <ul className="space-y-1">
                            {prop.proposedSenderContributions.map((c, i) => (
                              <li key={i} className="text-slate-600">
                                • {c.quantity}× {c.name}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-lg border border-slate-200 bg-[#F7F9F8]">
                          <span className="font-bold text-slate-700 block mb-1">
                            Requested from you:
                          </span>
                          <ul className="space-y-1">
                            {prop.proposedReceiverContributions.map((c, i) => (
                              <li key={i} className="text-slate-600">
                                • {c.quantity}× {c.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {prop.status === 'pending' && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                          <button
                            onClick={() => onDeclineProposal(prop.id)}
                            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleAccept(prop.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept & Reserve Parts</span>
                          </button>
                        </div>
                      )}

                      {prop.status === 'accepted' && prop.workspaceId && (
                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => setLocation(`/workspaces/${prop.workspaceId}`)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#087F83] hover:underline cursor-pointer"
                          >
                            <span>Go to Project Workspace</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Outgoing Collaboration Proposals */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#132B3B]">
              Outgoing Proposals Sent by You ({outgoingProposals.length})
            </h2>

            {outgoingProposals.length === 0 ? (
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                You haven't sent any proposals yet. Select a project in the Project Partners tab to invite teammates!
              </div>
            ) : (
              <div className="space-y-3">
                {outgoingProposals.map((prop) => {
                  const receiver = allMakers.find((m) => m.id === prop.receiverId);
                  const proj = projects.find((p) => p.id === prop.projectId);

                  return (
                    <div
                      key={prop.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#132B3B]">
                          {proj?.name} (Sent to {receiver?.displayName})
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          Status: <strong className="capitalize">{prop.status}</strong> · Sent{' '}
                          {new Date(prop.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {prop.status === 'pending' && (
                          <button
                            onClick={() => onCancelProposal(prop.id)}
                            className="text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded border border-slate-200 hover:border-rose-200"
                          >
                            Cancel Proposal
                          </button>
                        )}
                        {prop.status === 'accepted' && prop.workspaceId && (
                          <button
                            onClick={() => setLocation(`/workspaces/${prop.workspaceId}`)}
                            className="text-[#087F83] font-semibold hover:underline"
                          >
                            Open Workspace →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Mentorship Tickets Section */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#132B3B] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#087F83]" />
              <span>Mentorship Tickets ({myMentorRequests.length})</span>
            </h2>

            {myMentorRequests.length === 0 ? (
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                No active mentorship questions or tickets.
              </div>
            ) : (
              <div className="space-y-4">
                {myMentorRequests.map((req) => {
                  const isMentorForThis = req.mentorId === activeUser.id;
                  const otherParty = allMakers.find(
                    (m) => m.id === (isMentorForThis ? req.requesterId : req.mentorId)
                  );
                  const proj = projects.find((p) => p.id === req.projectId);

                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="text-xs text-slate-500">
                            {isMentorForThis
                              ? `Question from ${otherParty?.displayName}`
                              : `Asked to ${otherParty?.displayName}`} · {proj?.name}
                          </div>
                          <h3 className="text-sm font-bold text-[#132B3B]">
                            {req.question}
                          </h3>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 text-xs font-semibold rounded-md self-start sm:self-center capitalize ${
                            req.status === 'resolved'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      {/* Stage & Code notes */}
                      {req.notesOrCode && (
                        <pre className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto">
                          {req.notesOrCode}
                        </pre>
                      )}

                      {/* Responses thread */}
                      {req.responses.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          {req.responses.map((resp) => {
                            const author = allMakers.find((m) => m.id === resp.authorId);
                            return (
                              <div
                                key={resp.id}
                                className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1"
                              >
                                <div className="font-bold text-emerald-900">
                                  {author?.displayName || resp.authorId}:
                                </div>
                                <p className="text-emerald-900 leading-relaxed">
                                  {resp.content}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Mentor Reply Form (if active user is the mentor) */}
                      {isMentorForThis && req.status !== 'resolved' && (
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <label className="block text-xs font-bold text-slate-700">
                            Reply as Mentor ({activeUser.displayName}):
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Write diagnostic advice or circuit guidance..."
                              value={mentorReplyText[req.id] || ''}
                              onChange={(e) =>
                                setMentorReplyText({
                                  ...mentorReplyText,
                                  [req.id]: e.target.value,
                                })
                              }
                              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
                            />
                            <button
                              onClick={() => {
                                const text = mentorReplyText[req.id];
                                if (text && text.trim()) {
                                  onRespondMentorRequest(req.id, text.trim());
                                  setMentorReplyText({
                                    ...mentorReplyText,
                                    [req.id]: '',
                                  });
                                }
                              }}
                              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#087F83] rounded-lg shadow-xs cursor-pointer"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Requester Resolve Button */}
                      {!isMentorForThis && req.status !== 'resolved' && req.responses.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => onResolveMentorRequest(req.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Question as Resolved</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Proposal Modal */}
      <ProposalModal
        isOpen={Boolean(activeProposalCandidate)}
        onClose={() => setActiveProposalCandidate(null)}
        project={selectedProject}
        partnerSuggestion={activeProposalCandidate}
        activeUser={activeUser}
        onSubmitProposal={onSendProposal}
      />

      {/* Mentor Request Modal */}
      <MentorRequestModal
        isOpen={isMentorModalOpen}
        onClose={() => {
          setIsMentorModalOpen(false);
          setActiveMentorToRequest(null);
        }}
        selectedMentor={activeMentorToRequest}
        allMentors={availableMentors}
        projects={projects}
        defaultProjectId={selectedProjectId}
        activeUser={activeUser}
        onSubmitRequest={onSubmitMentorRequest}
      />
    </div>
  );
}
