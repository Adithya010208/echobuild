/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Modal } from './Modal';
import { Users, Layers, Activity, Wrench, Sparkles, ShieldCheck } from 'lucide-react';

export type FutureFeatureType =
  | 'maker-network'
  | 'build-studio'
  | 'impact'
  | 'partner-match'
  | 'ask-mentor'
  | '3d-guide';

interface FutureFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureType: FutureFeatureType | null;
  projectName?: string;
}

export function FutureFeatureModal({
  isOpen,
  onClose,
  featureType,
  projectName,
}: FutureFeatureModalProps) {
  if (!featureType) return null;

  const contentMap: Record<
    FutureFeatureType,
    {
      title: string;
      icon: React.ReactNode;
      shortDescription: string;
      details: string[];
      phaseTarget: string;
    }
  > = {
    'maker-network': {
      title: 'Maker Network & Component Exchange',
      icon: <Users className="w-8 h-8 text-[#087F83]" />,
      shortDescription:
        'A local and campus community network to trade unneeded hardware, donate surplus parts to student teams, and discover nearby build events.',
      details: [
        'Geographic distance-aware component swaps with local electronics clubs.',
        'Verified hardware handoffs with component condition verification checklists.',
        'Zero-waste university lab and makerspace inventory pooling.',
      ],
      phaseTarget: 'Phase 2 Architecture',
    },
    'build-studio': {
      title: 'Build Studio & Collaboration Rooms',
      icon: <Layers className="w-8 h-8 text-[#087F83]" />,
      shortDescription:
        'Virtual maker benches with synchronized code editors, live breadboard schematics, and multi-user debugging rooms.',
      details: [
        'Interactive wire-by-wire circuit simulation before powering real hardware.',
        'Real-time peer reviews of Arduino & ESP32 pinouts and firmware.',
        'Integrated logic analyzer waveforms for remote hardware troubleshooting.',
      ],
      phaseTarget: 'Phase 3 Architecture',
    },
    impact: {
      title: 'Sustainability & Impact Recording',
      icon: <Activity className="w-8 h-8 text-[#087F83]" />,
      shortDescription:
        'Verifiable environmental ledger measuring diverted e-waste, avoided carbon emissions, and component lifecycle extensions.',
      details: [
        'Cryptographically signed component passports documenting total operational runtime.',
        'Standardized lifecycle analysis (LCA) converting hardware mass to avoided virgin silicon extraction.',
        'Institutional impact reports for schools, hackathons, and corporate maker labs.',
      ],
      phaseTarget: 'Phase 2 Architecture',
    },
    'partner-match': {
      title: 'Partner Matching Engine',
      icon: <Users className="w-8 h-8 text-[#087F83]" />,
      shortDescription: `Find collaborators who hold complementary parts or coding skills to build "${projectName || 'this project'}" together.`,
      details: [
        'Matches makers whose inventory satisfies your remaining missing requirements.',
        'Pairs software developers with hardware builders based on stated interests.',
        'Safe, privacy-preserving messaging with agreed component pooling terms.',
      ],
      phaseTarget: 'Phase 2 Architecture',
    },
    'ask-mentor': {
      title: 'Peer Mentorship & Lab Office Hours',
      icon: <ShieldCheck className="w-8 h-8 text-[#087F83]" />,
      shortDescription: `Request advice from senior hardware builders or electrical engineering students for "${projectName || 'this project'}".`,
      details: [
        'Structured issue tickets including circuit schematics, pin maps, and serial logs.',
        'Scheduled 15-minute screen share or async circuit review notes.',
        'Community reputation system rewarding patient, constructive mentors.',
      ],
      phaseTarget: 'Phase 2 Architecture',
    },
    '3d-guide': {
      title: 'Interactive 3D Animated Build Guide',
      icon: <Wrench className="w-8 h-8 text-[#087F83]" />,
      shortDescription: `Step-by-step 3D exploded assembly instructions with interactive rotatable wiring for "${projectName || 'this project'}".`,
      details: [
        'Inspect breadboard hole connections from any camera angle or zoom level.',
        'Animated cable routing showing exact jumper wire lengths and colors.',
        'Interactive component highlights preventing reversed polarity and short circuits.',
      ],
      phaseTarget: 'Phase 3 Architecture',
    },
  };

  const feature = contentMap[featureType];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={feature.title} maxWidth="max-w-lg">
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#EAF4F3] rounded-xl shrink-0">
            {feature.icon}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Planned for a later phase ({feature.phaseTarget})
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {feature.shortDescription}
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Upcoming Capabilities
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            {feature.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#087F83] font-bold">·</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3.5 bg-[#EAF4F3]/60 border border-[#087F83]/20 rounded-xl text-xs text-slate-600 leading-relaxed">
          <strong className="text-[#132B3B]">Phase 1 Focus:</strong> Current implementation delivers deterministic matching, verified local inventory tracking, sustainability mass metrics, and personalized library ranking.
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-lg transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </Modal>
  );
}
