/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, ProjectDifficulty } from '../types';
import {
  User,
  Check,
  Shield,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Compass,
} from 'lucide-react';

interface ProfilePageProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onOpenResetDemo: () => void;
}

const AVAILABLE_INTERESTS = [
  { id: 'robotics', label: 'Robotics' },
  { id: 'home automation', label: 'Home Automation' },
  { id: 'learning electronics', label: 'Learning Electronics' },
  { id: 'environmental monitoring', label: 'Environmental Monitoring' },
  { id: 'creative projects', label: 'Creative Projects' },
];

export function ProfilePage({
  profile,
  onSaveProfile,
  onOpenResetDemo,
}: ProfilePageProps) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    profile.experience
  );
  const [preferredDifficulty, setPreferredDifficulty] =
    useState<ProjectDifficulty>(profile.preferredDifficulty);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [availableTime, setAvailableTime] = useState(profile.availableTime);
  const [isSavedBanner, setIsSavedBanner] = useState(false);

  const toggleInterest = (interestId: string) => {
    if (interests.includes(interestId)) {
      setInterests(interests.filter((i) => i !== interestId));
    } else {
      setInterests([...interests, interestId]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      displayName: displayName.trim() || 'Adithya',
      experience,
      interests: interests.length > 0 ? interests : ['learning electronics'],
      preferredDifficulty,
      availableTime,
      hasCompletedOnboarding: true,
    });
    setIsSavedBanner(true);
    setTimeout(() => setIsSavedBanner(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#132B3B]">
          Profile & Maker Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize your experience, skills, and topic interests to guide personalized project rankings.
        </p>
      </div>

      {/* Browser Demo Session Notice */}
      <div className="p-4 bg-[#EAF4F3] border border-[#087F83]/20 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-[#087F83] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1">
          <p className="font-semibold text-[#132B3B]">
            Browser Session Storage (Phase 1)
          </p>
          <p className="leading-relaxed">
            Your preferences, component catalog, and saved projects are stored in your local browser’s localStorage. No external credentials, logins, or cloud accounts are used in this phase.
          </p>
        </div>
      </div>

      {/* Saved Notification */}
      {isSavedBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 transition-all">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated and saved to local session. Recommendations recalculating...</span>
        </div>
      )}

      {/* Profile Form */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6"
      >
        {/* Display Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full max-w-md px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83] transition-colors"
          />
          <div className="text-[11px] text-slate-500 mt-1">
            Used for greeting and workbench identity.
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Electronics Experience Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
              <button
                type="button"
                key={lvl}
                onClick={() => setExperience(lvl)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  experience === lvl
                    ? 'border-[#087F83] bg-[#EAF4F3] text-[#132B3B]'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="text-sm font-bold">{lvl}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {lvl === 'Beginner' && 'Breadboards, LEDs, basic Arduino sketches.'}
                  {lvl === 'Intermediate' && 'I2C displays, sensor integration, state logic.'}
                  {lvl === 'Advanced' && 'Custom drivers, RTOS, robotics kinematics.'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Project Difficulty */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Preferred Recipe Difficulty
          </label>
          <div className="flex flex-wrap gap-2.5">
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
              <button
                type="button"
                key={diff}
                onClick={() => setPreferredDifficulty(diff)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  preferredDifficulty === diff
                    ? 'bg-[#087F83] text-white border-[#087F83]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5">
            Projects matching this difficulty receive a ranking priority boost in your Discover feed.
          </div>
        </div>

        {/* Topic Interests */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Maker Interests (Select all that apply)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {AVAILABLE_INTERESTS.map((interest) => {
              const isSelected = interests.includes(interest.id);
              return (
                <button
                  type="button"
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#EAF4F3] border-[#087F83] text-[#132B3B] font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{interest.label}</span>
                  {isSelected ? (
                    <Check className="w-4 h-4 text-[#087F83]" />
                  ) : (
                    <span className="w-4 h-4 rounded border border-slate-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Available Time Preference */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Available Time Cadence (Optional)
          </label>
          <select
            value={availableTime}
            onChange={(e) => setAvailableTime(e.target.value)}
            className="w-full max-w-md px-3.5 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83] transition-colors"
          >
            <option value="Rapid 30-min sprints">Rapid 30-min quick builds</option>
            <option value="1-2 hours / week">1–2 hours per week</option>
            <option value="Weekend projects (3-5 hours)">Weekend projects (3–5 hours)</option>
            <option value="Flexible / As time permits">Flexible / Open ended</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onOpenResetDemo}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo to Defaults</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
