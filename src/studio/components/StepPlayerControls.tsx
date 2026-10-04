/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Camera,
  AlertTriangle,
  Lightbulb,
  Sliders,
  Eye,
  Info,
  GraduationCap,
} from 'lucide-react';
import { AssemblyStep, CameraPreset } from '../types';

interface StepPlayerControlsProps {
  steps: AssemblyStep[];
  currentStepIndex: number;
  completedStepIndices: number[];
  isPlaying: boolean;
  playbackSpeed: number;
  activeCameraPreset: CameraPreset;
  onSelectStep: (index: number) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onTogglePlay: () => void;
  onToggleSpeed: () => void;
  onReplayStep: () => void;
  onToggleStepCompleted: (index: number) => void;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  onAskMentorAboutStep?: (step: AssemblyStep) => void;
}

export function StepPlayerControls({
  steps,
  currentStepIndex,
  completedStepIndices,
  isPlaying,
  playbackSpeed,
  activeCameraPreset,
  onSelectStep,
  onPrevStep,
  onNextStep,
  onTogglePlay,
  onToggleSpeed,
  onReplayStep,
  onToggleStepCompleted,
  onSelectCameraPreset,
  onAskMentorAboutStep,
}: StepPlayerControlsProps) {
  const currentStep = steps[currentStepIndex];
  const isCompleted = completedStepIndices.includes(currentStepIndex);

  const cameraPresets: { preset: CameraPreset; label: string }[] = [
    { preset: 'overview', label: 'Overview' },
    { preset: 'power-rails', label: 'Power Rails' },
    { preset: 'servo-mount', label: 'Servo & PWM' },
    { preset: 'sensor-front', label: 'Sonar Mount' },
    { preset: 'linkage', label: 'Linkage Arm' },
    { preset: 'simulation', label: 'Simulation' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Step Progress Tracker Pill Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#132B3B] uppercase tracking-wider">
            Assembly Progress
          </span>
          <span className="font-mono text-slate-500 font-semibold">
            Step {currentStepIndex + 1} of {steps.length} ({completedStepIndices.length} completed)
          </span>
        </div>

        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {steps.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isDone = completedStepIndices.includes(idx);

            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(idx)}
                className={`group flex flex-col items-center py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#EAF4F3] border-[#087F83] text-[#087F83] ring-2 ring-[#087F83]/20 shadow-xs'
                    : isDone
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/60'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
                title={step.title}
              >
                <div className="flex items-center gap-1">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full text-[10px] font-bold flex items-center justify-center bg-slate-200 text-slate-700">
                      {idx + 1}
                    </span>
                  )}
                  <span className="hidden md:inline text-[11px] font-semibold truncate max-w-[80px]">
                    {step.shortName}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Title & Summary Header */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-[#087F83] text-white tracking-wider">
              Step {currentStep.stepNumber}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#132B3B]">
              {currentStep.title}
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentStep.summary}
          </p>
        </div>

        {/* Mark Completed Toggle */}
        <button
          onClick={() => onToggleStepCompleted(currentStepIndex)}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
            isCompleted
              ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {currentStepIndex === steps.length - 1
              ? isCompleted
                ? 'Learning Guide Completed'
                : 'Complete Learning Guide'
              : isCompleted
              ? 'Learning Step Completed'
              : 'Mark Learning Step Complete'}
          </span>
        </button>
      </div>

      {/* Step Instructions Accordion / List */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Guided Actions:
        </div>
        <ul className="space-y-1.5 text-xs text-slate-700">
          {currentStep.detailedInstructions.map((instruction, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-200 text-[#132B3B] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{instruction}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Safety & Passport Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentStep.safetyWarning && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{currentStep.safetyWarning}</span>
          </div>
        )}
        {currentStep.checkpointTip && (
          <div className="p-3 bg-[#EAF4F3] border border-[#087F83]/20 rounded-xl flex items-start gap-2 text-xs text-[#132B3B]">
            <Lightbulb className="w-4 h-4 text-[#087F83] shrink-0 mt-0.5" />
            <span className="leading-relaxed">{currentStep.checkpointTip}</span>
          </div>
        )}
      </div>

      {/* Power Design Note if present */}
      {currentStep.powerDesignNote && (
        <div className="p-2.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
          <span>
            <strong>Power Architecture Note:</strong> {currentStep.powerDesignNote}
          </span>
        </div>
      )}

      {/* Conceptual Learning Milestone Disclaimer */}
      <div className="p-2.5 bg-slate-100/70 border border-slate-200 rounded-lg text-[11px] text-slate-500 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Learning Progress Isolation:</strong> Marking steps completed in this interactive guide tracks your conceptual study progress only. Physical component assembly, workspace reservations, and hardware verification evidence remain separate workbench actions.
        </span>
      </div>

      {/* Bottom Controls Bar: Playback + Camera Presets */}
      <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-lg shadow-xs transition-colors cursor-pointer"
            title={isPlaying ? 'Pause Auto-Play' : 'Play Step-by-Step'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Auto-Play</span>
              </>
            )}
          </button>

          <button
            onClick={onToggleSpeed}
            className="px-2.5 py-2 text-xs font-mono font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Change Playback Speed"
          >
            {playbackSpeed}x
          </button>

          <button
            onClick={onReplayStep}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Replay Step View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onNextStep}
            disabled={currentStepIndex === steps.length - 1}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Angles Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Camera:</span>
          </span>
          {cameraPresets.map(({ preset, label }) => (
            <button
              key={preset}
              onClick={() => onSelectCameraPreset(preset)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeCameraPreset === preset
                  ? 'bg-[#132B3B] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
