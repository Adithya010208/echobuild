/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import {
  ProjectTemplate,
  MakerProfile,
  PartnerSuggestion,
  CollaborationProposal,
  ContributionItem,
  ResponsibilityItem,
} from '../../types';
import { Users, Send, CheckCircle2, AlertCircle, Info, Sparkles, Package } from 'lucide-react';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectTemplate | null;
  partnerSuggestion: PartnerSuggestion | null;
  activeUser: MakerProfile;
  onSubmitProposal: (proposal: CollaborationProposal) => void;
}

export function ProposalModal({
  isOpen,
  onClose,
  project,
  partnerSuggestion,
  activeUser,
  onSubmitProposal,
}: ProposalModalProps) {
  if (!project || !partnerSuggestion) return null;

  const partner = partnerSuggestion.maker;

  const [message, setMessage] = useState(
    `Hi ${partner.displayName}! I noticed you have components and experience that complement this ${project.name} build. Would you like to team up to finish this recipe together?`
  );
  const [senderRole, setSenderRole] = useState(
    `Circuit breadboarding & ${activeUser.skills[0] || 'assembly'}`
  );
  const [partnerRole, setPartnerRole] = useState(
    `${partner.skills[0] || 'Hardware integration'} & testing`
  );

  useEffect(() => {
    if (partnerSuggestion && project) {
      setMessage(
        `Hi ${partner.displayName}! I noticed you have components and experience that complement this ${project.name} build. Would you like to team up to finish this recipe together?`
      );
      setSenderRole(`Circuit breadboarding & ${activeUser.skills[0] || 'assembly'}`);
      setPartnerRole(`${partner.skills[0] || 'Hardware integration'} & testing`);
    }
  }, [partnerSuggestion, project, activeUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Sender contributions
    const senderContributions: ContributionItem[] =
      partnerSuggestion.userContributedItems.map((u) => ({
        inventoryItemId: u.item.id,
        catalogId: u.item.catalogId,
        name: u.item.name,
        quantity: u.quantity,
      }));

    // Receiver contributions
    const receiverContributions: ContributionItem[] =
      partnerSuggestion.partnerOfferedItems.map((p) => ({
        inventoryItemId: p.item.id,
        catalogId: p.item.catalogId,
        name: p.item.name,
        quantity: p.offeredQuantity,
      }));

    // Remaining deficits
    const remainingDeficits = partnerSuggestion.stillMissingRequirements.map(
      (m) => ({
        catalogId: m.requirement.catalogId,
        name: m.requirement.name,
        quantity: m.missingQuantity,
      })
    );

    const suggestedResponsibilities: ResponsibilityItem[] = [
      { memberId: activeUser.id, roleDescription: senderRole.trim() },
      { memberId: partner.id, roleDescription: partnerRole.trim() },
    ];

    const proposal: CollaborationProposal = {
      id: `prop-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      projectId: project.id,
      senderId: activeUser.id,
      receiverId: partner.id,
      proposedSenderContributions: senderContributions,
      proposedReceiverContributions: receiverContributions,
      remainingDeficits,
      suggestedResponsibilities,
      message: message.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    onSubmitProposal(proposal);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Propose Project Collaboration"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project & Teammate Banner */}
        <div className="p-4 bg-[#F7F9F8] rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">Target Recipe</div>
            <div className="text-base font-bold text-[#132B3B]">
              {project.name}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Current individual coverage: {partnerSuggestion.userCoveragePercentage}% → Combined potential:{' '}
              <strong className="text-emerald-700">
                {partnerSuggestion.combinedCoveragePercentage}%
              </strong>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 text-right shrink-0">
            <div className="text-[11px] text-slate-400">Proposed Partner</div>
            <div className="text-sm font-bold text-[#087F83]">
              {partner.displayName}
            </div>
            <div className="text-[11px] text-slate-500">
              {partner.experience} · {partner.locationLabel}
            </div>
          </div>
        </div>

        {/* Proposed Component Allocation Plan */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Proposed Hardware Contributions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sender Contribution */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Your Hardware ({activeUser.displayName})</span>
                <span className="font-mono text-emerald-700">
                  {partnerSuggestion.userMatchedUnits} units
                </span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1">
                {partnerSuggestion.userContributedItems.length > 0 ? (
                  partnerSuggestion.userContributedItems.map((u, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 truncate">
                      <span className="text-emerald-600">✔</span>
                      <span>
                        {u.quantity}× {u.item.name}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">No owned parts allocated.</li>
                )}
              </ul>
            </div>

            {/* Partner Contribution */}
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Offered by {partner.displayName}</span>
                <span className="font-mono text-emerald-700">
                  +{partnerSuggestion.partnerMatchedUnits} units
                </span>
              </div>
              <ul className="text-xs text-emerald-800 space-y-1">
                {partnerSuggestion.partnerOfferedItems.length > 0 ? (
                  partnerSuggestion.partnerOfferedItems.map((p, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 truncate">
                      <span className="text-[#087F83] font-bold">+</span>
                      <span>
                        {p.offeredQuantity}× {p.item.name}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">No parts offered.</li>
                )}
              </ul>
            </div>
          </div>

          {partnerSuggestion.stillMissingRequirements.length > 0 && (
            <div className="mt-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200/80">
              Still missing after combined inventory:{' '}
              {partnerSuggestion.stillMissingRequirements
                .map((m) => `${m.missingQuantity}× ${m.requirement.name}`)
                .join(', ')}
            </div>
          )}
        </div>

        {/* Suggested Responsibilities */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Suggested Member Responsibilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Your Role ({activeUser.displayName})
              </label>
              <input
                type="text"
                value={senderRole}
                onChange={(e) => setSenderRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Partner's Role ({partner.displayName})
              </label>
              <input
                type="text"
                value={partnerRole}
                onChange={(e) => setPartnerRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Invitation Message
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
          />
        </div>

        {/* Disclaimer on Reservation semantics */}
        <div className="p-3 bg-[#EAF4F3]/70 border border-[#087F83]/20 rounded-xl text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-[#087F83] shrink-0 mt-0.5" />
          <span>
            <strong>Reservation Policy:</strong> Sending this proposal does not reserve components yet. Components are only reserved upon explicit acceptance by {partner.displayName}. You can switch to {partner.displayName}'s role to test the acceptance flow.
          </span>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Proposal</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
