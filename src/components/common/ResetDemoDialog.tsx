/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Modal } from './Modal';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface ResetDemoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetDemoDialog({
  isOpen,
  onClose,
  onConfirm,
}: ResetDemoDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset Demo Data" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 leading-relaxed">
            This will reset your local browser inventory, preferences, and saved projects back to the pristine demo dataset (Adithya's baseline inventory with 12 components).
          </div>
        </div>

        <p className="text-sm text-slate-600">
          Any custom components you added or quantities you modified during this session will be replaced.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Demo State
          </button>
        </div>
      </div>
    </Modal>
  );
}
