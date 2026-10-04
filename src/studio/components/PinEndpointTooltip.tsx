/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Zap, CornerDownRight } from 'lucide-react';
import { PinEndpoint, WireConnection } from '../types';

interface PinEndpointTooltipProps {
  pin: PinEndpoint;
  connectedWires: WireConnection[];
  onClose?: () => void;
}

export function PinEndpointTooltip({
  pin,
  connectedWires,
  onClose,
}: PinEndpointTooltipProps) {
  return (
    <div className="bg-[#132B3B]/95 backdrop-blur-xs text-white rounded-xl shadow-xl p-3 text-xs max-w-xs border border-slate-700 space-y-1.5 animate-fade-in pointer-events-auto">
      <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1.5">
        <div className="flex items-center gap-1.5 font-bold">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              pin.signalType === 'power-5v'
                ? 'bg-rose-500'
                : pin.signalType === 'ground'
                ? 'bg-slate-400'
                : pin.signalType === 'pwm'
                ? 'bg-orange-500'
                : 'bg-emerald-400'
            }`}
          />
          <span>{pin.name}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-300">
        <span className="font-mono bg-slate-800/80 px-1.5 py-0.5 rounded">
          {pin.label}
        </span>
        <span className="font-semibold text-emerald-400">{pin.voltage}</span>
      </div>

      <p className="text-[11px] text-slate-300 leading-relaxed">
        {pin.description}
      </p>

      {connectedWires.length > 0 && (
        <div className="pt-1.5 border-t border-slate-700/80 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <CornerDownRight className="w-3 h-3 text-[#087F83]" />
            <span>Connected Circuits:</span>
          </span>
          {connectedWires.map((w) => (
            <div
              key={w.id}
              className="text-[10px] text-slate-300 flex items-center gap-1.5"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: w.hexColor }}
              />
              <span>{w.signalName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
