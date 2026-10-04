/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Modal } from '../common/Modal';
import { ComponentItem } from '../../types';
import {
  ShieldCheck,
  AlertCircle,
  Clock,
  Layers,
  Tag,
  Scale,
  Calendar,
  FileText,
  Edit,
  Cpu,
} from 'lucide-react';

interface ComponentPassportModalProps {
  item: ComponentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (item: ComponentItem) => void;
}

export function ComponentPassportModal({
  item,
  isOpen,
  onClose,
  onEdit,
}: ComponentPassportModalProps) {
  if (!item) return null;

  const freeQuantity = Math.max(
    0,
    item.totalQuantity - item.reservedQuantity - item.installedQuantity
  );

  const conditionColorMap: Record<string, { bg: string; text: string; label: string }> = {
    working: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Working (User Reported)' },
    'partially-working': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Partially Working' },
    untested: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700', label: 'Untested / Unverified' },
    faulty: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', label: 'Faulty (Excluded from Builds)' },
    unsafe: { bg: 'bg-red-100 border-red-300', text: 'text-red-900', label: 'Unsafe (Hazardous / Quarantine)' },
  };

  const conditionMeta = conditionColorMap[item.condition] || conditionColorMap.untested;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Component Passport" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-4 bg-[#F7F9F8] rounded-xl border border-slate-200">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-[#087F83] shrink-0 shadow-2xs">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                ID: {item.id} · Catalog: {item.catalogId}
              </div>
              <h3 className="text-lg font-bold text-[#132B3B] mt-0.5">
                {item.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="capitalize">{item.category}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">Source: {item.source.replace('-', ' ')}</span>
              </div>
            </div>
          </div>

          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#087F83] hover:text-[#066366] hover:bg-[#EAF4F3] border border-[#087F83]/30 rounded-lg transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Record
            </button>
          )}
        </div>

        {/* Quantity Breakdown Grid */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Stock Allocation & Availability
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-medium">Total Units</div>
              <div className="text-2xl font-bold font-mono text-[#132B3B] mt-1 tabular-nums">
                {item.totalQuantity}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
              <div className="text-xs text-emerald-800 font-medium">Free for Builds</div>
              <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
                {freeQuantity}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-center">
              <div className="text-xs text-amber-800 font-medium">Reserved</div>
              <div className="text-2xl font-bold font-mono text-amber-700 mt-1 tabular-nums">
                {item.reservedQuantity}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-center">
              <div className="text-xs text-slate-600 font-medium">Installed</div>
              <div className="text-2xl font-bold font-mono text-slate-700 mt-1 tabular-nums">
                {item.installedQuantity}
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5">
            Formula: Free stock = Total ({item.totalQuantity}) − Reserved ({item.reservedQuantity}) − Installed ({item.installedQuantity}) = <strong className="text-slate-800">{freeQuantity}</strong> units.
          </div>
        </div>

        {/* Condition & Verification Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border ${conditionMeta.bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-slate-600" />
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Reported Condition
              </div>
            </div>
            <div className={`text-base font-bold ${conditionMeta.text}`}>
              {conditionMeta.label}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {item.condition === 'working' && 'Eligible for active project matching coverage.'}
              {item.condition === 'untested' && 'Requires testing before counting toward confirmed coverage.'}
              {item.condition === 'faulty' && 'Excluded from matching to avoid project build failures.'}
              {item.condition === 'unsafe' && 'Quarantine immediately. Potential thermal or electrical hazard.'}
              {item.condition === 'partially-working' && 'Has damaged sub-channels or degraded specs.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-[#087F83]" />
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Verification Protocol
              </div>
            </div>
            <div className="text-base font-bold text-[#132B3B] capitalize">
              {item.verificationStatus === 'user-reported-working' && 'User Reported (Self-Attested)'}
              {item.verificationStatus === 'recorded-test' && 'Recorded Bench Test Verified'}
              {item.verificationStatus === 'untested' && 'No Test Evidence Recorded'}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Note: Self-reporting as "Working" records user claims; it does not replace a physical multimeter or oscilloscope bench test.
            </p>
          </div>
        </div>

        {/* Physical Mass & Environmental Properties */}
        <div className="p-4 bg-[#EAF4F3]/50 border border-[#087F83]/20 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#087F83]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Hardware Weight & Material Factor
              </span>
            </div>
            <div className="text-sm font-bold font-mono text-[#132B3B] tabular-nums">
              {item.unitMassGrams !== null && item.unitMassGrams !== undefined
                ? `${item.unitMassGrams} grams / unit`
                : 'Mass unrecorded'}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#087F83]/15 text-xs">
            <span className="text-slate-600 font-medium">Collaboration Sharing:</span>
            <span className={`font-semibold ${item.isSharedForCollaboration !== false ? 'text-emerald-700' : 'text-slate-500'}`}>
              {item.isSharedForCollaboration !== false ? 'Opted-In (Shareable for Partner Builds)' : 'Private (Excluded from Team Matching)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
            Component unit mass is used in Phase 1 to calculate potential e-waste reuse when allocated to active recipes. Total stock mass is never prematurely claimed as recycled until assembled.
          </p>
        </div>

        {/* Notes & Timestamp */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <FileText className="w-3.5 h-3.5" />
              Maker Notes
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 italic">
              {item.notes ? item.notes : 'No specific notes recorded for this component item.'}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Last Updated: {new Date(item.lastUpdated).toLocaleDateString()} at{' '}
              {new Date(item.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div>Verification Level: v1.0 Standard</div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close Passport
          </button>
        </div>
      </div>
    </Modal>
  );
}
