/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'wouter';
import { FutureFeatureType } from '../components/common/FutureFeatureModal';
import {
  Users,
  Layers,
  Activity,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

interface FutureFeaturePageProps {
  type: FutureFeatureType;
}

export function FutureFeaturePage({ type }: FutureFeaturePageProps) {
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
      icon: <Users className="w-10 h-10 text-[#087F83]" />,
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
      icon: <Layers className="w-10 h-10 text-[#087F83]" />,
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
      icon: <Activity className="w-10 h-10 text-[#087F83]" />,
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
      icon: <Users className="w-10 h-10 text-[#087F83]" />,
      shortDescription:
        'Find collaborators who hold complementary parts or coding skills to build projects together.',
      details: [
        'Matches makers whose inventory satisfies your remaining missing requirements.',
        'Pairs software developers with hardware builders based on stated interests.',
        'Safe, privacy-preserving messaging with agreed component pooling terms.',
      ],
      phaseTarget: 'Phase 2 Architecture',
    },
    'ask-mentor': {
      title: 'Peer Mentorship & Lab Office Hours',
      icon: <ShieldCheck className="w-10 h-10 text-[#087F83]" />,
      shortDescription:
        'Request advice from senior hardware builders or electrical engineering students for complex circuit problems.',
      details: [
        'Structured issue tickets including circuit schematics, pin maps, and serial logs.',
        'Scheduled 15-minute screen share or async circuit review notes.',
        'Community reputation system rewarding patient, constructive mentors.',
      ],
      phaseTarget: 'Phase 2 Architecture',
    },
    '3d-guide': {
      title: 'Interactive 3D Animated Build Guide',
      icon: <Wrench className="w-10 h-10 text-[#087F83]" />,
      shortDescription:
        'Step-by-step 3D exploded assembly instructions with interactive rotatable wiring.',
      details: [
        'Inspect breadboard hole connections from any camera angle or zoom level.',
        'Animated cable routing showing exact jumper wire lengths and colors.',
        'Interactive component highlights preventing reversed polarity and short circuits.',
      ],
      phaseTarget: 'Phase 3 Architecture',
    },
  };

  const feature = contentMap[type] || contentMap['maker-network'];

  return (
    <div className="max-w-3xl space-y-6 pb-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#087F83] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discover</span>
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-[#EAF4F3] rounded-2xl shrink-0">
            {feature.icon}
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Planned for a later phase ({feature.phaseTarget})</span>
            </div>
            <h1 className="text-2xl font-bold text-[#132B3B]">
              {feature.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              {feature.shortDescription}
            </p>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Planned Specifications & Milestones
          </h2>
          <ul className="space-y-2.5 text-sm text-slate-700">
            {feature.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#087F83] shrink-0 mt-0.5" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-[#EAF4F3]/60 border border-[#087F83]/20 rounded-xl text-xs text-slate-600 space-y-1">
          <strong className="text-[#132B3B] block">Current Phase 1 Delivery:</strong>
          <p>
            In Phase 1, EcoBuild focuses on high-precision deterministic inventory matching, condition-aware verification passports, and instant recalculation across 8 core hardware recipes.
          </p>
        </div>

        <div className="pt-2 flex justify-start">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-xl shadow-xs transition-colors"
          >
            <span>Explore Working Library</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
