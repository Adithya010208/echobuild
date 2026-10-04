/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ComponentItem } from '../../types';
import {
  Cpu,
  Layers,
  ShieldCheck,
  Scale,
  Edit2,
  Trash2,
  FileBadge2,
  AlertTriangle,
  Lock,
} from 'lucide-react';

interface ComponentCardProps {
  item: ComponentItem;
  onEdit: (item: ComponentItem) => void;
  onDelete: (id: string) => void;
  onViewPassport: (item: ComponentItem) => void;
  viewMode?: 'grid' | 'list';
}

export function ComponentCard({
  item,
  onEdit,
  onDelete,
  onViewPassport,
  viewMode = 'grid',
}: ComponentCardProps) {
  const freeQuantity = Math.max(
    0,
    item.totalQuantity - item.reservedQuantity - item.installedQuantity
  );

  const conditionStyles: Record<string, { label: string; text: string; bg: string }> = {
    working: { label: 'Working', text: 'text-emerald-800', bg: 'bg-emerald-50' },
    'partially-working': { label: 'Partial', text: 'text-amber-800', bg: 'bg-amber-50' },
    untested: { label: 'Untested', text: 'text-slate-700', bg: 'bg-slate-100' },
    faulty: { label: 'Faulty', text: 'text-rose-800', bg: 'bg-rose-50' },
    unsafe: { label: 'Unsafe', text: 'text-red-900', bg: 'bg-red-100' },
  };

  const currentCondition = conditionStyles[item.condition] || conditionStyles.untested;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="p-2.5 bg-[#EAF4F3] rounded-lg text-[#087F83] shrink-0 mt-0.5">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono">{item.catalogId}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{item.category}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{item.source.replace('-', ' ')}</span>
            </div>
            <h4
              onClick={() => onViewPassport(item)}
              className="text-sm font-bold text-[#132B3B] hover:text-[#087F83] transition-colors cursor-pointer truncate mt-0.5"
            >
              {item.name}
            </h4>
            {item.notes && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{item.notes}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 self-start md:self-center shrink-0">
          {/* Quantities summary */}
          <div className="text-right">
            <div className="text-xs text-slate-500">Free / Total</div>
            <div className="font-mono text-sm font-bold text-[#132B3B] tabular-nums">
              <span className="text-emerald-700">{freeQuantity}</span> / {item.totalQuantity}
            </div>
          </div>

          {/* Condition tag */}
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${currentCondition.bg} ${currentCondition.text}`}>
            {currentCondition.label}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewPassport(item)}
              title="View Component Passport"
              className="p-1.5 text-slate-500 hover:text-[#087F83] hover:bg-[#EAF4F3] rounded-lg transition-colors cursor-pointer"
            >
              <FileBadge2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(item)}
              title="Edit item"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              title="Delete item"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between overflow-hidden">
      <div className="p-5">
        {/* Header line */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="capitalize">{item.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono text-[11px]">{item.catalogId}</span>
          </div>

          <span className={`px-2 py-0.5 text-xs font-semibold rounded-md shrink-0 ${currentCondition.bg} ${currentCondition.text}`}>
            {currentCondition.label}
          </span>
        </div>

        {/* Title */}
        <h4
          onClick={() => onViewPassport(item)}
          className="text-sm font-bold text-[#132B3B] hover:text-[#087F83] transition-colors cursor-pointer line-clamp-1"
        >
          {item.name}
        </h4>

        {/* Notes or photo indicator */}
        <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 min-h-[32px] leading-relaxed">
          {item.notes || 'No notes entered for this component.'}
        </p>

        {/* Stock Breakdown Grid */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#F7F9F8] p-2 rounded-lg">
            <div className="text-[10px] text-slate-500 font-medium">Total</div>
            <div className="font-mono font-bold text-sm text-[#132B3B] tabular-nums mt-0.5">
              {item.totalQuantity}
            </div>
          </div>
          <div className="bg-emerald-50/70 p-2 rounded-lg">
            <div className="text-[10px] text-emerald-800 font-medium">Free</div>
            <div className="font-mono font-bold text-sm text-emerald-700 tabular-nums mt-0.5">
              {freeQuantity}
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            <div className="text-[10px] text-slate-500 font-medium">Reserved</div>
            <div className="font-mono font-bold text-sm text-slate-700 tabular-nums mt-0.5">
              {item.reservedQuantity + item.installedQuantity}
            </div>
          </div>
        </div>

        {/* Mass & verification summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100/80">
          <span className="flex items-center gap-1">
            <Scale className="w-3 h-3 text-slate-400" />
            {item.unitMassGrams ? `${item.unitMassGrams}g` : 'No weight'}
          </span>
          <span className="capitalize text-slate-400">
            {item.source.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Action footer */}
      <div className="px-5 py-3 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewPassport(item)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087F83] hover:text-[#066366] transition-colors cursor-pointer"
        >
          <FileBadge2 className="w-3.5 h-3.5" />
          Passport Details
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            aria-label="Edit component"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            aria-label="Delete component"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
