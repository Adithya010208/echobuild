/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Activity,
  Sliders,
  Hand,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { BehaviorSimulationState } from '../types';

interface BehaviorSimulatorPanelProps {
  simulationState: BehaviorSimulationState;
  onDistanceChange: (distanceCm: number) => void;
  onApproachHand: () => void;
  onRetractHand: () => void;
  onPassByWave: () => void;
  onResetSimulation: () => void;
}

export function BehaviorSimulatorPanel({
  simulationState,
  onDistanceChange,
  onApproachHand,
  onRetractHand,
  onPassByWave,
  onResetSimulation,
}: BehaviorSimulatorPanelProps) {
  const {
    obstacleDistanceCm,
    lidState,
    lidOpenProgress,
    servoAngleDegrees,
    servoPwmMicroseconds,
    isTriggered,
    triggerTimerSeconds,
  } = simulationState;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-4 max-w-md w-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900">
            <Activity className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#132B3B]">
              Expected Behavior Preview
            </h3>
            <span className="text-[11px] text-slate-500">
              Virtual model preview of expected sensor and actuator response
            </span>
          </div>
        </div>

        <button
          onClick={onResetSimulation}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          title="Reset Preview"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Obstacle Distance Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Hand className="w-3.5 h-3.5 text-[#087F83]" />
            <span>Virtual Hand Distance (Model)</span>
          </span>
          <span className="font-mono font-bold text-sm text-[#132B3B]">
            {obstacleDistanceCm.toFixed(1)} cm
          </span>
        </div>

        <input
          type="range"
          min="5"
          max="50"
          step="0.5"
          value={obstacleDistanceCm}
          onChange={(e) => onDistanceChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#087F83]"
        />

        <div className="flex justify-between text-[10px] text-slate-400">
          <span>5 cm (Close)</span>
          <span className="font-bold text-emerald-700">Virtual Trigger Threshold: 15 cm</span>
          <span>50 cm (Far)</span>
        </div>
      </div>

      {/* Quick Action Simulation Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onApproachHand}
          className="py-1.5 px-2 bg-[#EAF4F3] hover:bg-[#d8ecea] text-[#087F83] border border-[#087F83]/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          Approach Hand (10cm)
        </button>
        <button
          onClick={onRetractHand}
          className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          Retract Hand (40cm)
        </button>
        <button
          onClick={onPassByWave}
          className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          Pass-By Wave
        </button>
      </div>

      {/* Live Telemetry Display */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Virtual Model Telemetry (Simulated Values):
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Sonar Trigger Status */}
          <div
            className={`p-2.5 rounded-xl border ${
              isTriggered
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span className="text-[10px] text-slate-500 block">Virtual Sonar Trigger (Model)</span>
            <div className="font-bold text-sm flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isTriggered ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>{isTriggered ? 'TARGET DETECTED' : 'CLEAR / IDLE'}</span>
            </div>
            <span className="text-[10px] text-slate-500">
              {isTriggered ? 'Model Echo < 875µs (< 15cm)' : 'Model Echo > 875µs (> 15cm)'}
            </span>
          </div>

          {/* Lid Flap Position */}
          <div
            className={`p-2.5 rounded-xl border ${
              lidOpenProgress > 0.1
                ? 'bg-[#EAF4F3] border-[#087F83]/30 text-[#132B3B]'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span className="text-[10px] text-slate-500 block">Virtual Lid Position (Model)</span>
            <div className="font-bold text-sm uppercase mt-0.5">
              {lidState} ({Math.round(lidOpenProgress * 75)}°)
            </div>
            <span className="text-[10px] text-slate-500">
              {Math.round(lidOpenProgress * 100)}% Lifted
            </span>
          </div>

          {/* Servo Motor Angle */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
            <span className="text-[10px] text-slate-500 block">Simulated Servo Angle</span>
            <div className="font-bold text-sm text-[#132B3B] mt-0.5">
              {servoAngleDegrees.toFixed(0)}° / 90°
            </div>
            <span className="text-[10px] text-slate-500">
              Calculated PWM: {servoPwmMicroseconds}µs
            </span>
          </div>

          {/* Auto-Close Hold Timer */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
            <span className="text-[10px] text-slate-500 block">Virtual Dwell Timer (Model)</span>
            <div className="font-bold text-sm text-[#132B3B] mt-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{triggerTimerSeconds.toFixed(1)}s</span>
            </div>
            <span className="text-[10px] text-slate-500">
              {triggerTimerSeconds > 0 ? 'Hold open cycle' : 'Idle resting'}
            </span>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Predefined client-side JavaScript model demonstrating expected touchless lid timing and motion. Does not execute binary microcontroller firmware or perform SPICE circuit simulation.
        </span>
      </div>
    </div>
  );
}
