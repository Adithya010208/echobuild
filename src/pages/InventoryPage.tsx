/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ComponentItem, ComponentCategory, ComponentCondition } from '../types';
import { ComponentCard } from '../components/inventory/ComponentCard';
import { ComponentPassportModal } from '../components/inventory/ComponentPassportModal';
import {
  Search,
  Plus,
  Filter,
  LayoutGrid,
  List,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Cpu,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

interface InventoryPageProps {
  inventory: ComponentItem[];
  onAdd: () => void;
  onEdit: (item: ComponentItem) => void;
  onDelete: (id: string) => void;
  onOpenResetDemo: () => void;
}

export function InventoryPage({
  inventory,
  onAdd,
  onEdit,
  onDelete,
  onOpenResetDemo,
}: InventoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Passport preview state
  const [activePassportItem, setActivePassportItem] =
    useState<ComponentItem | null>(null);

  // Deletion confirmation modal
  const [itemToDelete, setItemToDelete] = useState<ComponentItem | null>(null);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.catalogId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const matchesCondition =
        selectedCondition === 'all' || item.condition === selectedCondition;

      return matchesSearch && matchesCategory && matchesCondition;
    });
  }, [inventory, searchQuery, selectedCategory, selectedCondition]);

  const handleDeleteRequest = (id: string) => {
    const item = inventory.find((i) => i.id === id);
    if (item) {
      setItemToDelete(item);
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#132B3B]">
            My Components
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your hardware inventory, review passports, and reserve parts for active projects.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Component</span>
        </button>
      </div>

      {/* Search, Filter Bar & View Toggle */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, catalog model, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-[#087F83] transition-colors"
            />
          </div>

          {/* Filters & View Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:border-[#087F83] transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="microcontroller">Microcontrollers</option>
              <option value="sensor">Sensors</option>
              <option value="actuator">Actuators</option>
              <option value="passive">Passives</option>
              <option value="prototyping">Prototyping</option>
              <option value="display">Displays</option>
              <option value="power">Power</option>
              <option value="other">Other</option>
            </select>

            {/* Condition Filter */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:border-[#087F83] transition-colors"
            >
              <option value="all">All Conditions</option>
              <option value="working">Working</option>
              <option value="untested">Untested</option>
              <option value="partially-working">Partially Working</option>
              <option value="faulty">Faulty</option>
              <option value="unsafe">Unsafe</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#087F83] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#087F83] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Metrics Line */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredInventory.length}</strong> of{' '}
            {inventory.length} component records
          </span>
          {(searchQuery || selectedCategory !== 'all' || selectedCondition !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedCondition('all');
              }}
              className="text-[#087F83] hover:underline font-medium cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Inventory Items List / Grid */}
      {filteredInventory.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#EAF4F3] flex items-center justify-center text-[#087F83]">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-[#132B3B]">
              No components match your search
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Try adjusting your category or condition filter, or register a new electronic part to see it appear here.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onAdd}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#087F83] hover:bg-[#066366] rounded-lg transition-colors cursor-pointer"
            >
              Add New Component
            </button>
            <button
              onClick={onOpenResetDemo}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Reset Demo Records
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInventory.map((item) => (
            <ComponentCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={handleDeleteRequest}
              onViewPassport={setActivePassportItem}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInventory.map((item) => (
            <ComponentCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={handleDeleteRequest}
              onViewPassport={setActivePassportItem}
              viewMode="list"
            />
          ))}
        </div>
      )}

      {/* Passport Modal */}
      <ComponentPassportModal
        isOpen={Boolean(activePassportItem)}
        item={activePassportItem}
        onClose={() => setActivePassportItem(null)}
        onEdit={(item) => {
          setActivePassportItem(null);
          onEdit(item);
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        title="Confirm Component Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm text-rose-900 leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="font-semibold">{itemToDelete?.name}</strong>?
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Removing this record will immediately recalculate component coverage across all recipes in your Project Library and Saved Projects.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setItemToDelete(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Record
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
