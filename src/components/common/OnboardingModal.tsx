/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Modal } from './Modal';
import { UserProfile, ProjectDifficulty } from '../../types';
import { Sparkles, Check, ArrowRight, BookOpen, Compass } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreDemo: () => void;
  onSaveProfile: (profile: UserProfile) => void;
  currentProfile: UserProfile;
}

export function OnboardingModal({
  isOpen,
  onClose,
  onExploreDemo,
  onSaveProfile,
  currentProfile,
}: OnboardingModalProps) {
  const [step, setStep] = useState<'welcome' | 'setup'>('welcome');

  const [displayName, setDisplayName] = useState(currentProfile.displayName || 'Adithya');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    currentProfile.experience || 'Beginner'
  );
  const [preferredDifficulty, setPreferredDifficulty] =
    useState<ProjectDifficulty>(currentProfile.preferredDifficulty || 'Beginner');
  const [interests, setInterests] = useState<string[]>(
    currentProfile.interests || ['robotics', 'home automation', 'learning electronics']
  );
  const [availableTime, setAvailableTime] = useState(
    currentProfile.availableTime || '1-2 hours / week'
  );

  const toggleInterest = (interestId: string) => {
    if (interests.includes(interestId)) {
      setInterests(interests.filter((i) => i !== interestId));
    } else {
      setInterests([...interests, interestId]);
    }
  };

  const handleFinishSetup = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      displayName: displayName.trim() || 'Adithya',
      experience,
      interests: interests.length > 0 ? interests : ['learning electronics'],
      preferredDifficulty,
      availableTime,
      hasCompletedOnboarding: true,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'welcome' ? 'Welcome to EcoBuild' : 'Set Up Your Maker Profile'}
      maxWidth="max-w-xl"
    >
      {step === 'welcome' ? (
        <div className="space-y-6">
          <div className="p-4 bg-[#EAF4F3] border border-[#087F83]/20 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[#087F83] font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Turn unused electronic components into useful projects</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              EcoBuild inspects your spare parts, breadboards, and sensors, calculating deterministic recipe coverage and recommending realistic builds you can create right now.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              How would you like to start?
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onExploreDemo}
                className="p-4 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-[#087F83] rounded-xl text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 text-[#087F83] font-bold text-sm group-hover:translate-x-0.5 transition-transform">
                  <Compass className="w-4 h-4" />
                  <span>Explore Demo</span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Start immediately with Adithya's preloaded inventory (12 components, Arduino, sensors, servos).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStep('setup')}
                className="p-4 bg-[#EAF4F3]/50 hover:bg-[#EAF4F3] border-2 border-[#087F83]/40 hover:border-[#087F83] rounded-xl text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 text-[#087F83] font-bold text-sm group-hover:translate-x-0.5 transition-transform">
                  <Sparkles className="w-4 h-4" />
                  <span>Set Up My Profile</span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Tailor your maker name, skill level, and topics of interest for custom recommendations.
                </p>
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500">
            Note: All progress is safely saved inside this browser session (localStorage). No login account or passwords needed for Phase 1.
          </div>
        </div>
      ) : (
        <form onSubmit={handleFinishSetup} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Adithya"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Experience Level
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-[#087F83]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Difficulty
              </label>
              <select
                value={preferredDifficulty}
                onChange={(e) => setPreferredDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-[#087F83]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Topics of Interest
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'robotics', label: 'Robotics' },
                { id: 'home automation', label: 'Home Automation' },
                { id: 'learning electronics', label: 'Learning Electronics' },
                { id: 'environmental monitoring', label: 'Environmental' },
                { id: 'creative projects', label: 'Creative Projects' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleInterest(item.id)}
                  className={`p-2 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between ${
                    interests.includes(item.id)
                      ? 'bg-[#EAF4F3] border-[#087F83] text-[#132B3B] font-semibold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <span>{item.label}</span>
                  {interests.includes(item.id) && (
                    <Check className="w-3.5 h-3.5 text-[#087F83]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep('welcome')}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Profile & Start
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
