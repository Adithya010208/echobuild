/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, Zap, AlertCircle, Cpu, ExternalLink } from 'lucide-react';
import { StudioComponentSpec, PinEndpoint } from '../types';
import { ComponentItem } from '../../types';

interface ComponentInspectorPanelProps {
  component: StudioComponentSpec | null;
  selectedPin: PinEndpoint | null;
  userInventory: ComponentItem[];
  onClose: () => void;
  onOpenPassport?: (item: ComponentItem) => void;
}

export function ComponentInspectorPanel({
  component,
  selectedPin,
  userInventory,
  onClose,
  onOpenPassport,
}: ComponentInspectorPanelProps) {
  if (!component) return null;

  // Find matching component in active user's inventory
  const matchingInventoryItem = userInventory.find(
    (item) => item.catalogId === component.catalogId
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-4 max-w-md w-full animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700">
              {component.category}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {component.catalogId}
            </span>
          </div>
          <h3 className="text-base font-bold text-[#132B3B]">
            {component.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 leading-relaxed">
        {component.description}
      </p>

      {/* User's Matched Inventory Status Banner */}
      <div className="p-3.5 bg-[#F7F9F8] rounded-xl border border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#132B3B] flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#087F83]" />
            <span>Your Inventory Status</span>
          </span>
          {matchingInventoryItem ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>In Stock ({matchingInventoryItem.totalQuantity} units)</span>
            </span>
          ) : (
            <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Missing from bench
            </span>
          )}
        </div>

        {matchingInventoryItem && (
          <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-200/60">
            <div className="flex items-center justify-between">
              <span>Condition:</span>
              <span className="font-semibold capitalize text-slate-800">
                {matchingInventoryItem.condition}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Passport Source:</span>
              <span className="font-semibold capitalize text-slate-800">
                {matchingInventoryItem.source}
              </span>
            </div>
            {onOpenPassport && (
              <button
                onClick={() => onOpenPassport(matchingInventoryItem)}
                className="inline-flex items-center gap-1 text-[#087F83] hover:underline font-semibold pt-1 cursor-pointer"
              >
                <span>View Component Passport Evidence</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Electrical Specifications with Separated Categories */}
      <div className="space-y-3">
        <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Technical Specifications & Physics Analysis</span>
        </div>

        {/* Category 1: Manufacturer-Sourced Datasheet Specs */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#132B3B] text-[11px] uppercase tracking-wide">
              1. Manufacturer-Sourced Specification
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
              Datasheet Verified
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
            <div>
              <span className="text-slate-400 block text-[10px]">Operating Voltage</span>
              <span className="font-bold text-slate-800">{component.electricalSpecs.manufacturerSpecs.operatingVoltage}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Quiescent Current</span>
              <span className="font-bold text-slate-800">{component.electricalSpecs.manufacturerSpecs.quiescentCurrent}</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
            <strong>Source:</strong> {component.electricalSpecs.manufacturerSpecs.datasheetSource}
          </div>
        </div>

        {/* Category 2: Illustrative Animation / Model Parameters */}
        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-950 text-[11px] uppercase tracking-wide">
              2. Illustrative Animation Parameter
            </span>
            <span className="text-[10px] text-blue-800 bg-blue-100/60 px-1.5 py-0.2 rounded font-semibold">
              Model Preview Value
            </span>
          </div>
          <div className="text-[11px] text-blue-900 space-y-0.5">
            <div><strong>Simulated Range:</strong> {component.electricalSpecs.animationParameters.simulatedRangeOrAngle}</div>
            <div><strong>Timing / Signal:</strong> {component.electricalSpecs.animationParameters.timingOrPwmPulse}</div>
            <p className="text-[10px] text-blue-700 italic pt-0.5">{component.electricalSpecs.animationParameters.notes}</p>
          </div>
        </div>

        {/* Category 3: Unknown or Variant-Dependent Ratings */}
        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-950 text-[11px] uppercase tracking-wide">
              3. Unknown or Variant-Dependent Value
            </span>
            <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
              Clone Variability
            </span>
          </div>
          <div className="text-[11px] text-amber-900 space-y-1">
            <div><strong>Stall / Peak Rating:</strong> {component.electricalSpecs.variantDependent.stallCurrentRating}</div>
            <div><strong>Clone Tolerances:</strong> {component.electricalSpecs.variantDependent.cloneVariations}</div>
            <div className="text-[10px] text-amber-800 pt-1 border-t border-amber-200/60">
              <strong>Unresolved Assumptions:</strong> {component.electricalSpecs.variantDependent.unresolvedAssumptions}
            </div>
          </div>
        </div>

        {/* Safety Caution */}
        <div className="p-2.5 bg-rose-50/80 border border-rose-200 rounded-lg text-xs text-rose-900 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed text-[11px]">{component.electricalSpecs.cautions}</span>
        </div>
      </div>

      {/* Pin Endpoints Table */}
      {component.pins.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Connection Endpoints ({component.pins.length}):
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {component.pins.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              return (
                <div
                  key={pin.id}
                  className={`p-2 rounded-lg border text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#EAF4F3] border-[#087F83] text-[#132B3B]'
                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          pin.signalType === 'power-5v'
                            ? 'bg-rose-500'
                            : pin.signalType === 'ground'
                            ? 'bg-slate-900'
                            : pin.signalType === 'pwm'
                            ? 'bg-orange-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <span>{pin.name}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {pin.voltage}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    {pin.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
