/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import {
  MakerProfile,
  ProjectTemplate,
  MentorshipRequest,
  MentorshipHelpCategory,
} from '../../types';
import { ShieldCheck, Send, Info, HelpCircle } from 'lucide-react';

interface MentorRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMentor: MakerProfile | null;
  allMentors: MakerProfile[];
  projects: ProjectTemplate[];
  defaultProjectId?: string;
  defaultWorkspaceId?: string;
  defaultQuestion?: string;
  defaultStage?: string;
  activeUser: MakerProfile;
  onSubmitRequest: (request: MentorshipRequest) => void;
}

const HELP_CATEGORIES: { id: MentorshipHelpCategory; label: string; desc: string }[] = [
  { id: 'understanding-circuit', label: 'Understanding a circuit', desc: 'Voltage dividers, pullups, grounding & signal flow' },
  { id: 'troubleshooting', label: 'Troubleshooting & debugging', desc: 'Isolating noise, reset brownouts, faulty sensor readings' },
  { id: 'programming', label: 'Firmware & programming', desc: 'Arduino sketches, non-blocking timers, I2C/SPI code' },
  { id: 'testing-component', label: 'Testing a component', desc: 'Multimeter resistance tests, logic probing, unverified parts' },
  { id: 'choosing-components', label: 'Choosing components', desc: 'Selecting compatible drivers, sensors & logic level shifters' },
  { id: 'planning-assembly', label: 'Planning assembly', desc: 'Mechanical mounting, thermal dissipation, battery sizing' },
];

export function MentorRequestModal({
  isOpen,
  onClose,
  selectedMentor,
  allMentors,
  projects,
  defaultProjectId,
  defaultWorkspaceId,
  defaultQuestion,
  defaultStage,
  activeUser,
  onSubmitRequest,
}: MentorRequestModalProps) {
  const [mentorId, setMentorId] = useState<string>(
    selectedMentor?.id || (allMentors[0]?.id || '')
  );
  const [projectId, setProjectId] = useState<string>(
    defaultProjectId || (projects[0]?.id || '')
  );
  const [helpCategory, setHelpCategory] =
    useState<MentorshipHelpCategory>('understanding-circuit');
  const [question, setQuestion] = useState(defaultQuestion || '');
  const [currentStage, setCurrentStage] = useState(defaultStage || '');
  const [relevantComponentsText, setRelevantComponentsText] = useState('');
  const [notesOrCode, setNotesOrCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultQuestion) setQuestion(defaultQuestion);
    if (defaultStage) setCurrentStage(defaultStage);
  }, [defaultQuestion, defaultStage]);

  useEffect(() => {
    if (selectedMentor) {
      setMentorId(selectedMentor.id);
    } else if (allMentors.length > 0 && !mentorId) {
      setMentorId(allMentors[0].id);
    }
    if (defaultProjectId) {
      setProjectId(defaultProjectId);
      const proj = projects.find((p) => p.id === defaultProjectId);
      if (proj && !relevantComponentsText) {
        setRelevantComponentsText(
          proj.requirements.map((r) => r.name.split('(')[0].trim()).slice(0, 3).join(', ')
        );
      }
    }
  }, [selectedMentor, defaultProjectId, allMentors, projects]);

  const currentMentor = allMentors.find((m) => m.id === mentorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please provide a specific question or issue description.');
      return;
    }
    if (!mentorId) {
      setError('Please select an opted-in mentor.');
      return;
    }

    const relevantComponents = relevantComponentsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const request: MentorshipRequest = {
      id: `req-mentor-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      requesterId: activeUser.id,
      mentorId,
      projectId,
      workspaceId: defaultWorkspaceId,
      helpCategory,
      question: question.trim(),
      currentStage: currentStage.trim() || 'Circuit breadboarding / bench test',
      relevantComponents:
        relevantComponents.length > 0 ? relevantComponents : ['Arduino circuit'],
      notesOrCode: notesOrCode.trim() || undefined,
      status: 'open',
      responses: [],
      createdAt: new Date().toISOString(),
    };

    onSubmitRequest(request);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Maker Mentorship"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Mentor Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Mentor
          </label>
          <select
            value={mentorId}
            onChange={(e) => setMentorId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
          >
            {allMentors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.displayName} — {m.skills.slice(0, 2).join(', ')} ({m.locationLabel || 'Lab Mentor'})
              </option>
            ))}
          </select>

          {currentMentor?.mentorProfile && (
            <div className="mt-2 p-3 bg-[#EAF4F3]/60 rounded-lg border border-[#087F83]/20 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-[#132B3B]">
                Mentor Availability Note:
              </div>
              <p>{currentMentor.mentorProfile.availabilityNotes}</p>
              <div className="text-[11px] text-slate-500">
                Self-declared experience: <strong>{currentMentor.experience}</strong> · Preferred language: {currentMentor.mentorProfile.preferredLanguage || 'English'}
              </div>
            </div>
          )}
        </div>

        {/* Project Reference & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Project Context
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Help Category
            </label>
            <select
              value={helpCategory}
              onChange={(e) => setHelpCategory(e.target.value as MentorshipHelpCategory)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
            >
              {HELP_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Question */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            What specific circuit or code issue are you facing? <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. When the motor turns on, the Arduino resets. How should I isolate the power supplies or debounce the trigger?"
            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
          />
          {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
        </div>

        {/* Current Stage & Relevant Components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Current Stage of Build
            </label>
            <input
              type="text"
              value={currentStage}
              onChange={(e) => setCurrentStage(e.target.value)}
              placeholder="e.g. Bench breadboard wired, testing with 5V USB"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Relevant Components
            </label>
            <input
              type="text"
              value={relevantComponentsText}
              onChange={(e) => setRelevantComponentsText(e.target.value)}
              placeholder="e.g. Arduino Uno, L298N driver, TT motor"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
            />
          </div>
        </div>

        {/* Notes or Code Snippet */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Code Snippet or Multimeter Readings (Optional)
          </label>
          <textarea
            rows={3}
            value={notesOrCode}
            onChange={(e) => setNotesOrCode(e.target.value)}
            placeholder="// Paste short code loop or serial monitor output..."
            className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
          />
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
          Prototype Note: Requests stay inside this browser environment. You can switch to the mentor's demo profile in the top-right switcher to read and respond to this ticket.
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
            <span>Submit Request</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
