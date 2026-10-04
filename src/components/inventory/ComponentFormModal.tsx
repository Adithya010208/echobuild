/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import {
  ComponentItem,
  ComponentCategory,
  ComponentCondition,
  ComponentSource,
  VerificationStatus,
} from '../../types';
import { Camera, AlertCircle, Info, Sparkles } from 'lucide-react';

interface ComponentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ComponentItem) => void;
  initialItem?: ComponentItem | null;
}

const COMMON_CATALOG_OPTIONS = [
  { id: 'arduino-uno', name: 'Arduino Uno Rev3', category: 'microcontroller', defaultMass: 25 },
  { id: 'esp32-devkit', name: 'ESP32 NodeMCU DevKit V1', category: 'microcontroller', defaultMass: 12 },
  { id: 'hc-sr04', name: 'HC-SR04 Ultrasonic Distance Sensor', category: 'sensor', defaultMass: 9 },
  { id: 'sg90-servo', name: 'TowerPro SG90 9g Micro Servo', category: 'actuator', defaultMass: 11 },
  { id: 'led-5mm', name: '5mm Diffused LEDs', category: 'passive', defaultMass: 0.3 },
  { id: 'jumper-wires', name: 'Jumper Wire Ribbon (40-pack)', category: 'prototyping', defaultMass: 30 },
  { id: 'breadboard-half', name: 'Half-Size Breadboard (400-Point)', category: 'prototyping', defaultMass: 38 },
  { id: 'resistor-220', name: '220 Ohm 1/4W Resistors', category: 'passive', defaultMass: 0.2 },
  { id: 'resistor-10k', name: '10k Ohm 1/4W Resistors', category: 'passive', defaultMass: 0.2 },
  { id: 'ldr-gl5528', name: 'GL5528 Light Dependent Resistor', category: 'sensor', defaultMass: 0.8 },
  { id: 'buzzer-piezo', name: '5V Active Piezo Buzzer', category: 'actuator', defaultMass: 4.5 },
  { id: 'dc-motor-toy', name: '3V-6V Dual Shaft DC Gear Motor', category: 'actuator', defaultMass: 28 },
  { id: 'l298n-driver', name: 'L298N Dual H-Bridge Motor Driver', category: 'actuator', defaultMass: 26 },
  { id: 'dht11-sensor', name: 'DHT11 Temperature & Humidity Sensor', category: 'sensor', defaultMass: 5 },
  { id: 'oled-096-i2c', name: '0.96 inch I2C OLED Display', category: 'display', defaultMass: 8 },
  { id: 'soil-sensor', name: 'Capacitive Soil Moisture Probe', category: 'sensor', defaultMass: 14 },
  { id: 'push-button', name: 'Tactile Momentary Push Button', category: 'passive', defaultMass: 0.75 },
  { id: 'custom-hardware', name: 'Custom / Other Component', category: 'other', defaultMass: 0 },
];

export function ComponentFormModal({
  isOpen,
  onClose,
  onSave,
  initialItem,
}: ComponentFormModalProps) {
  const isEditing = Boolean(initialItem);

  const [catalogId, setCatalogId] = useState('arduino-uno');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ComponentCategory>('microcontroller');
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [reservedQuantity, setReservedQuantity] = useState(0);
  const [installedQuantity, setInstalledQuantity] = useState(0);
  const [condition, setCondition] = useState<ComponentCondition>('working');
  const [source, setSource] = useState<ComponentSource>('purchased');
  const [unitMassGrams, setUnitMassGrams] = useState<string>('25');
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>('user-reported-working');
  const [isSharedForCollaboration, setIsSharedForCollaboration] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialItem) {
      setCatalogId(initialItem.catalogId);
      setName(initialItem.name);
      setCategory(initialItem.category);
      setTotalQuantity(initialItem.totalQuantity);
      setReservedQuantity(initialItem.reservedQuantity);
      setInstalledQuantity(initialItem.installedQuantity);
      setCondition(initialItem.condition);
      setSource(initialItem.source);
      setUnitMassGrams(
        initialItem.unitMassGrams !== null && initialItem.unitMassGrams !== undefined
          ? String(initialItem.unitMassGrams)
          : ''
      );
      setNotes(initialItem.notes || '');
      setPhotoPreview(initialItem.photoPreview || null);
      setVerificationStatus(initialItem.verificationStatus);
      setIsSharedForCollaboration(
        initialItem.isSharedForCollaboration !== undefined
          ? initialItem.isSharedForCollaboration
          : true
      );
    } else {
      // Default new component
      setCatalogId('arduino-uno');
      setName('Arduino Uno Rev3');
      setCategory('microcontroller');
      setTotalQuantity(1);
      setReservedQuantity(0);
      setInstalledQuantity(0);
      setCondition('working');
      setSource('purchased');
      setUnitMassGrams('25');
      setNotes('');
      setPhotoPreview(null);
      setVerificationStatus('user-reported-working');
      setIsSharedForCollaboration(true);
    }
    setErrors({});
  }, [initialItem, isOpen]);

  const handleCatalogChange = (selectedId: string) => {
    setCatalogId(selectedId);
    const found = COMMON_CATALOG_OPTIONS.find((opt) => opt.id === selectedId);
    if (found && selectedId !== 'custom-hardware') {
      if (!name || name === 'Arduino Uno Rev3' || COMMON_CATALOG_OPTIONS.some(o => o.name === name)) {
        setName(found.name);
      }
      setCategory(found.category as ComponentCategory);
      if (found.defaultMass) {
        setUnitMassGrams(String(found.defaultMass));
      }
    }
  };

  const handleConditionChange = (newCondition: ComponentCondition) => {
    setCondition(newCondition);
    if (newCondition === 'working') {
      setVerificationStatus('user-reported-working');
    } else if (newCondition === 'untested') {
      setVerificationStatus('untested');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: 'Image must be under 2MB.',
        }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.photo;
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Component display name is required.';
    }

    if (!catalogId.trim()) {
      newErrors.catalogId = 'Catalog component model is required.';
    }

    if (!Number.isInteger(totalQuantity) || totalQuantity < 0) {
      newErrors.totalQuantity = 'Total quantity must be a non-negative integer.';
    }

    if (!Number.isInteger(reservedQuantity) || reservedQuantity < 0) {
      newErrors.reservedQuantity =
        'Reserved quantity must be a non-negative integer.';
    }

    if (!Number.isInteger(installedQuantity) || installedQuantity < 0) {
      newErrors.installedQuantity =
        'Installed quantity must be a non-negative integer.';
    }

    if (reservedQuantity + installedQuantity > totalQuantity) {
      newErrors.quantityMath =
        'Reserved quantity plus installed quantity cannot exceed total quantity.';
    }

    let parsedMass: number | null = null;
    if (unitMassGrams.trim() !== '') {
      parsedMass = parseFloat(unitMassGrams);
      if (isNaN(parsedMass) || parsedMass < 0) {
        newErrors.unitMassGrams = 'Unit mass must be a non-negative number.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const itemToSave: ComponentItem = {
      id: initialItem?.id || `inv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      catalogId: catalogId.trim(),
      name: name.trim(),
      category,
      totalQuantity,
      reservedQuantity,
      installedQuantity,
      condition,
      source,
      unitMassGrams: parsedMass,
      notes: notes.trim(),
      photoPreview,
      lastUpdated: new Date().toISOString(),
      verificationStatus,
      isSharedForCollaboration,
    };

    onSave(itemToSave);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Component Record' : 'Add Component to Inventory'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Catalog Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Catalog Component Type & Model <span className="text-rose-500">*</span>
          </label>
          <select
            value={catalogId}
            onChange={(e) => handleCatalogChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83] focus:ring-1 focus:ring-[#087F83] transition-colors"
          >
            {COMMON_CATALOG_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name} ({opt.id})
              </option>
            ))}
          </select>
          <div className="text-[11px] text-slate-500 mt-1">
            Deterministic matching compares this catalog identifier with project recipe requirements.
          </div>
        </div>

        {/* Display Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Display Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arduino Uno Rev3"
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-800 transition-colors ${
                errors.name
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-slate-200 focus:border-[#087F83]'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-rose-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hardware Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ComponentCategory)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
            >
              <option value="microcontroller">Microcontroller</option>
              <option value="sensor">Sensor</option>
              <option value="actuator">Actuator / Motor</option>
              <option value="passive">Passive Component (LED, Resistor)</option>
              <option value="prototyping">Prototyping (Breadboard, Wires)</option>
              <option value="display">Display</option>
              <option value="power">Power</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Quantities (Total, Reserved, Installed) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Quantities & Allocation
            </label>
            <span className="text-xs font-mono text-emerald-700 font-semibold tabular-nums">
              Free: {Math.max(0, totalQuantity - reservedQuantity - installedQuantity)} units
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-xs text-slate-600 mb-1 block">Total Count</span>
              <input
                type="number"
                min="0"
                step="1"
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
              />
            </div>
            <div>
              <span className="text-xs text-slate-600 mb-1 block">Reserved</span>
              <input
                type="number"
                min="0"
                step="1"
                value={reservedQuantity}
                onChange={(e) =>
                  setReservedQuantity(parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
              />
            </div>
            <div>
              <span className="text-xs text-slate-600 mb-1 block">Installed</span>
              <input
                type="number"
                min="0"
                step="1"
                value={installedQuantity}
                onChange={(e) =>
                  setInstalledQuantity(parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
              />
            </div>
          </div>

          {errors.quantityMath && (
            <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.quantityMath}
            </p>
          )}
        </div>

        {/* Condition & Source */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reported Condition <span className="text-rose-500">*</span>
            </label>
            <select
              value={condition}
              onChange={(e) =>
                handleConditionChange(e.target.value as ComponentCondition)
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
            >
              <option value="working">Working (Eligible for build coverage)</option>
              <option value="untested">Untested (Requires bench check)</option>
              <option value="partially-working">Partially Working (Damaged channel)</option>
              <option value="faulty">Faulty (Not usable for builds)</option>
              <option value="unsafe">Unsafe (Hazardous / Quarantine)</option>
            </select>
            <div className="text-[11px] text-slate-500 mt-1">
              Selecting "Working" records your report. It does not replace physical bench testing.
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hardware Source <span className="text-rose-500">*</span>
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as ComponentSource)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
            >
              <option value="purchased">Purchased new / store</option>
              <option value="previous-project">Previous completed build</option>
              <option value="salvaged">Salvaged from discarded electronics</option>
              <option value="donated">Donated / Makerspace loan</option>
            </select>
          </div>
        </div>

        {/* Verification Status & Unit Mass */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Verification Protocol
            </label>
            <select
              value={verificationStatus}
              onChange={(e) =>
                setVerificationStatus(e.target.value as VerificationStatus)
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
            >
              <option value="user-reported-working">User-reported working</option>
              <option value="untested">Untested</option>
              <option value="recorded-test">Recorded bench test (multimeter/logic)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Estimated Unit Mass (grams)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 25"
              value={unitMassGrams}
              onChange={(e) => setUnitMassGrams(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
            />
            {errors.unitMassGrams && (
              <p className="text-xs text-rose-600 mt-1">{errors.unitMassGrams}</p>
            )}
            <div className="text-[11px] text-slate-500 mt-1">
              Used strictly for potential reuse weight on matched recipes.
            </div>
          </div>
        </div>

        {/* Sharing & Privacy Setting for Collaboration */}
        <div className="p-3.5 bg-[#EAF4F3]/60 border border-[#087F83]/20 rounded-xl space-y-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSharedForCollaboration}
              onChange={(e) => setIsSharedForCollaboration(e.target.checked)}
              className="w-4 h-4 text-[#087F83] rounded border-slate-300 focus:ring-[#087F83]"
            />
            <span className="text-xs font-bold text-[#132B3B]">
              Available for Maker Network Collaboration
            </span>
          </label>
          <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
            When enabled, free working units of this component can be offered in partner suggestions to help other makers finish project recipes.
          </p>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Maker Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Pins soldered; tested with blink sketch; stored in anti-static bag."
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83]"
          />
        </div>

        {/* Photo Preview (Session-only notice) */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              Component Photo (Session Preview)
            </span>
            {photoPreview && (
              <button
                type="button"
                onClick={() => setPhotoPreview(null)}
                className="text-xs text-rose-600 hover:underline"
              >
                Remove photo
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Component preview"
                className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-2xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-white border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                <Camera className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                id="component-photo-input"
                className="hidden"
              />
              <label
                htmlFor="component-photo-input"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                Select Image File
              </label>
              <p className="text-[11px] text-slate-500 mt-1">
                Notice: In Phase 1, uploaded photos are session-only previews and will not survive a browser refresh. Photo upload does not verify physical operation.
              </p>
            </div>
          </div>
        </div>

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {isEditing ? 'Save Changes' : 'Add Component'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
