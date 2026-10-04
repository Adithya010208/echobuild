/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ComponentItem,
  UserProfile,
  MakerProfile,
  CollaborationProposal,
  ProjectWorkspace,
  MentorshipRequest,
  ComponentReservation,
  WorkspaceTask,
  WorkspaceMessage,
} from '../types';
import { BuildGuideProgress } from '../studio/types';
import { SEED_INVENTORY } from '../data/seedInventory';
import { DEMO_MAKERS, DEMO_INVENTORIES_BY_MAKER } from '../data/demoMakers';
import {
  SEED_PROPOSALS,
  SEED_WORKSPACES,
  SEED_MENTOR_REQUESTS,
} from '../data/seedNetwork';
import { PROJECT_LIBRARY } from '../data/projectLibrary';

// Storage Keys
const STORAGE_VERSION_KEY = 'ecobuild_storage_version';
const ACTIVE_USER_KEY = 'ecobuild_active_user_v2';
const MAKERS_KEY = 'ecobuild_makers_v2';
const INVENTORIES_KEY = 'ecobuild_inventories_v2';
const PROPOSALS_KEY = 'ecobuild_proposals_v2';
const WORKSPACES_KEY = 'ecobuild_workspaces_v2';
const MENTOR_REQUESTS_KEY = 'ecobuild_mentor_requests_v2';
const SAVED_PROJECTS_KEY = 'ecobuild_saved_projects_v1';
const GUIDE_PROGRESS_KEY = 'ecobuild_guide_progress_v1';

// Legacy keys for migration
const LEGACY_PROFILE_KEY = 'ecobuild_profile_v1';
const LEGACY_INVENTORY_KEY = 'ecobuild_inventory_v1';

export const DEFAULT_PROFILE: UserProfile = {
  displayName: 'Adithya',
  experience: 'Beginner',
  interests: ['robotics', 'home automation', 'learning electronics'],
  preferredDifficulty: 'Beginner',
  availableTime: '1-2 hours / week',
  hasCompletedOnboarding: true,
};

export const DEFAULT_SAVED_PROJECTS = ['proj-smart-dustbin'];

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error('Error notifying storage listener:', err);
    }
  });
}

/**
 * Executes safe versioned migration from Phase 1 to Phase 2.
 * Adithya's inventory and profile are preserved strictly.
 */
function ensureMigratedToV2() {
  try {
    const version = localStorage.getItem(STORAGE_VERSION_KEY);
    if (version === 'v2') return;

    console.log('[EcoBuild] Running versioned migration to Phase 2 (v2)...');

    // 1. Migrate / Initialize Active User
    const currentActive = localStorage.getItem(ACTIVE_USER_KEY);
    if (!currentActive) {
      localStorage.setItem(ACTIVE_USER_KEY, 'maker-adithya');
    }

    // 2. Migrate / Initialize Maker Profiles
    const existingMakersData = localStorage.getItem(MAKERS_KEY);
    let makers: MakerProfile[] = DEMO_MAKERS;
    if (existingMakersData) {
      try {
        const parsed = JSON.parse(existingMakersData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          makers = parsed;
        }
      } catch (e) {
        // fallback
      }
    }

    // If Adithya had a legacy profile, sync displayName and preferences to maker-adithya
    const legacyProfileData = localStorage.getItem(LEGACY_PROFILE_KEY);
    if (legacyProfileData) {
      try {
        const legacyProfile: UserProfile = JSON.parse(legacyProfileData);
        makers = makers.map((m) =>
          m.id === 'maker-adithya'
            ? {
                ...m,
                displayName: legacyProfile.displayName || m.displayName,
                experience: legacyProfile.experience || m.experience,
                interests: legacyProfile.interests || m.interests,
              }
            : m
        );
      } catch (e) {
        console.warn('Failed parsing legacy profile for migration:', e);
      }
    }
    localStorage.setItem(MAKERS_KEY, JSON.stringify(makers));

    // 3. Migrate Inventories per Maker
    const inventoriesByMaker: Record<string, ComponentItem[]> = {
      ...DEMO_INVENTORIES_BY_MAKER,
    };

    // Migrate Adithya's existing inventory from v1 if present
    const legacyInventoryData = localStorage.getItem(LEGACY_INVENTORY_KEY);
    if (legacyInventoryData) {
      try {
        const legacyItems: ComponentItem[] = JSON.parse(legacyInventoryData);
        if (Array.isArray(legacyItems) && legacyItems.length > 0) {
          inventoriesByMaker['maker-adithya'] = legacyItems.map((item) => ({
            ...item,
            ownerId: 'maker-adithya',
            isSharedForCollaboration:
              item.isSharedForCollaboration !== undefined
                ? item.isSharedForCollaboration
                : true,
          }));
        } else {
          inventoriesByMaker['maker-adithya'] = SEED_INVENTORY.map((item) => ({
            ...item,
            ownerId: 'maker-adithya',
            isSharedForCollaboration: true,
          }));
        }
      } catch (e) {
        inventoriesByMaker['maker-adithya'] = SEED_INVENTORY.map((item) => ({
          ...item,
          ownerId: 'maker-adithya',
          isSharedForCollaboration: true,
        }));
      }
    } else {
      inventoriesByMaker['maker-adithya'] = SEED_INVENTORY.map((item) => ({
        ...item,
        ownerId: 'maker-adithya',
        isSharedForCollaboration: true,
      }));
    }

    localStorage.setItem(INVENTORIES_KEY, JSON.stringify(inventoriesByMaker));

    // 4. Initialize Network Proposals, Workspaces, and Mentor Requests
    if (!localStorage.getItem(PROPOSALS_KEY)) {
      localStorage.setItem(PROPOSALS_KEY, JSON.stringify(SEED_PROPOSALS));
    }
    if (!localStorage.getItem(WORKSPACES_KEY)) {
      localStorage.setItem(WORKSPACES_KEY, JSON.stringify(SEED_WORKSPACES));
    }
    if (!localStorage.getItem(MENTOR_REQUESTS_KEY)) {
      localStorage.setItem(
        MENTOR_REQUESTS_KEY,
        JSON.stringify(SEED_MENTOR_REQUESTS)
      );
    }

    // Set storage version tag
    localStorage.setItem(STORAGE_VERSION_KEY, 'v2');
    console.log('[EcoBuild] Migration to Phase 2 v2 completed successfully.');
  } catch (err) {
    console.error('[EcoBuild] Error during v2 migration:', err);
  }
}

// Run migration immediately
ensureMigratedToV2();

export const StorageService = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // ==========================================
  // Active User & Profiles
  // ==========================================

  getActiveUserId(): string {
    return localStorage.getItem(ACTIVE_USER_KEY) || 'maker-adithya';
  },

  setActiveUserId(id: string): void {
    localStorage.setItem(ACTIVE_USER_KEY, id);
    notifyListeners();
  },

  getActiveUser(): MakerProfile {
    const activeId = this.getActiveUserId();
    const makers = this.getMakerProfiles();
    const found = makers.find((m) => m.id === activeId);
    return (
      found ||
      makers[0] || {
        id: 'maker-adithya',
        displayName: 'Adithya',
        isDemo: true,
        experience: 'Beginner',
        skills: ['Arduino programming', 'Circuit assembly'],
        interests: ['robotics', 'home automation', 'learning electronics'],
        collaborationPreference: 'Open to team builds',
      }
    );
  },

  getMakerProfiles(): MakerProfile[] {
    try {
      const data = localStorage.getItem(MAKERS_KEY);
      if (!data) return DEMO_MAKERS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_MAKERS;
    } catch (e) {
      return DEMO_MAKERS;
    }
  },

  getMakerProfile(id: string): MakerProfile | undefined {
    return this.getMakerProfiles().find((m) => m.id === id);
  },

  updateMakerProfile(profile: MakerProfile): void {
    try {
      const makers = this.getMakerProfiles();
      const updated = makers.map((m) => (m.id === profile.id ? profile : m));
      localStorage.setItem(MAKERS_KEY, JSON.stringify(updated));
      notifyListeners();
    } catch (e) {
      console.error('Failed to update maker profile:', e);
    }
  },

  // Backwards compatibility for UserProfile used in Phase 1 profile page
  getProfile(): UserProfile {
    const active = this.getActiveUser();
    return {
      displayName: active.displayName,
      experience: active.experience,
      interests: active.interests,
      preferredDifficulty:
        active.experience === 'Advanced'
          ? 'Advanced'
          : active.experience === 'Intermediate'
          ? 'Intermediate'
          : 'Beginner',
      availableTime: '1-2 hours / week',
      hasCompletedOnboarding: true,
    };
  },

  saveProfile(profile: UserProfile): void {
    const active = this.getActiveUser();
    this.updateMakerProfile({
      ...active,
      displayName: profile.displayName,
      experience: profile.experience,
      interests: profile.interests,
    });
  },

  // ==========================================
  // Inventory per Maker
  // ==========================================

  getAllInventories(): Record<string, ComponentItem[]> {
    try {
      const data = localStorage.getItem(INVENTORIES_KEY);
      if (!data) return DEMO_INVENTORIES_BY_MAKER;
      const parsed = JSON.parse(data);
      return parsed && typeof parsed === 'object'
        ? parsed
        : DEMO_INVENTORIES_BY_MAKER;
    } catch (e) {
      return DEMO_INVENTORIES_BY_MAKER;
    }
  },

  getInventory(ownerId?: string): ComponentItem[] {
    const targetOwner = ownerId || this.getActiveUserId();
    const all = this.getAllInventories();
    const items = all[targetOwner];
    if (Array.isArray(items)) {
      return items;
    }
    // Fallback if user has no initialized list
    return [];
  },

  saveInventory(inventory: ComponentItem[], ownerId?: string): void {
    try {
      const targetOwner = ownerId || this.getActiveUserId();
      const all = this.getAllInventories();
      const updated = {
        ...all,
        [targetOwner]: inventory.map((item) => ({
          ...item,
          ownerId: targetOwner,
          isSharedForCollaboration:
            item.isSharedForCollaboration !== undefined
              ? item.isSharedForCollaboration
              : true,
        })),
      };
      localStorage.setItem(INVENTORIES_KEY, JSON.stringify(updated));

      // Also mirror to legacy key if saving for Adithya
      if (targetOwner === 'maker-adithya') {
        localStorage.setItem(LEGACY_INVENTORY_KEY, JSON.stringify(inventory));
      }

      notifyListeners();
    } catch (e) {
      console.error('Failed to save inventory:', e);
    }
  },

  addComponent(item: ComponentItem, ownerId?: string): void {
    const targetOwner = ownerId || this.getActiveUserId();
    const current = this.getInventory(targetOwner);
    const updated = [
      {
        ...item,
        ownerId: targetOwner,
        isSharedForCollaboration:
          item.isSharedForCollaboration !== undefined
            ? item.isSharedForCollaboration
            : true,
      },
      ...current,
    ];
    this.saveInventory(updated, targetOwner);
  },

  updateComponent(item: ComponentItem, ownerId?: string): void {
    const targetOwner = ownerId || item.ownerId || this.getActiveUserId();
    const current = this.getInventory(targetOwner);
    const updated = current.map((existing) =>
      existing.id === item.id ? { ...existing, ...item } : existing
    );
    this.saveInventory(updated, targetOwner);
  },

  deleteComponent(id: string, ownerId?: string): void {
    const targetOwner = ownerId || this.getActiveUserId();
    const current = this.getInventory(targetOwner);
    const updated = current.filter((item) => item.id !== id);
    this.saveInventory(updated, targetOwner);
  },

  // ==========================================
  // Saved Projects
  // ==========================================

  getSavedProjectIds(): string[] {
    try {
      const data = localStorage.getItem(SAVED_PROJECTS_KEY);
      if (!data) return DEFAULT_SAVED_PROJECTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : DEFAULT_SAVED_PROJECTS;
    } catch (e) {
      return DEFAULT_SAVED_PROJECTS;
    }
  },

  saveSavedProjectIds(ids: string[]): void {
    try {
      localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(ids));
      notifyListeners();
    } catch (e) {
      console.error('Failed to save saved project IDs:', e);
    }
  },

  toggleSaveProject(projectId: string): boolean {
    const saved = this.getSavedProjectIds();
    const exists = saved.includes(projectId);
    const updated = exists
      ? saved.filter((id) => id !== projectId)
      : [...saved, projectId];
    this.saveSavedProjectIds(updated);
    return !exists;
  },

  isProjectSaved(projectId: string): boolean {
    return this.getSavedProjectIds().includes(projectId);
  },

  // ==========================================
  // Proposals
  // ==========================================

  getProposals(): CollaborationProposal[] {
    try {
      const data = localStorage.getItem(PROPOSALS_KEY);
      if (!data) return SEED_PROPOSALS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : SEED_PROPOSALS;
    } catch (e) {
      return SEED_PROPOSALS;
    }
  },

  saveProposal(proposal: CollaborationProposal): void {
    try {
      const current = this.getProposals();
      const existingIdx = current.findIndex((p) => p.id === proposal.id);
      let updated: CollaborationProposal[];
      if (existingIdx >= 0) {
        updated = current.map((p) => (p.id === proposal.id ? proposal : p));
      } else {
        updated = [proposal, ...current];
      }
      localStorage.setItem(PROPOSALS_KEY, JSON.stringify(updated));
      notifyListeners();
    } catch (e) {
      console.error('Failed to save proposal:', e);
    }
  },

  /**
   * Accepts a proposal with full inventory rechecking and reservation creation.
   */
  acceptProposal(
    proposalId: string
  ): { success: boolean; error?: string; workspaceId?: string } {
    try {
      const proposals = this.getProposals();
      const proposal = proposals.find((p) => p.id === proposalId);
      if (!proposal) {
        return { success: false, error: 'Proposal not found.' };
      }
      if (proposal.status !== 'pending') {
        return {
          success: false,
          error: `Proposal is already ${proposal.status}.`,
        };
      }

      // Re-verify availability of sender contributions
      const senderInventory = this.getInventory(proposal.senderId);
      for (const contrib of proposal.proposedSenderContributions) {
        const item = senderInventory.find(
          (i) => i.id === contrib.inventoryItemId
        );
        if (!item) {
          return {
            success: false,
            error: `Sender component "${contrib.name}" is no longer in inventory.`,
          };
        }
        const free = Math.max(
          0,
          item.totalQuantity - item.reservedQuantity - item.installedQuantity
        );
        if (
          free < contrib.quantity ||
          item.condition !== 'working' ||
          item.isSharedForCollaboration === false
        ) {
          return {
            success: false,
            error: `Sender component "${contrib.name}" lacks sufficient free working stock (${free} free, ${contrib.quantity} needed).`,
          };
        }
      }

      // Re-verify availability of receiver contributions
      const receiverInventory = this.getInventory(proposal.receiverId);
      for (const contrib of proposal.proposedReceiverContributions) {
        const item = receiverInventory.find(
          (i) => i.id === contrib.inventoryItemId
        );
        if (!item) {
          return {
            success: false,
            error: `Receiver component "${contrib.name}" is no longer in inventory.`,
          };
        }
        const free = Math.max(
          0,
          item.totalQuantity - item.reservedQuantity - item.installedQuantity
        );
        if (
          free < contrib.quantity ||
          item.condition !== 'working' ||
          item.isSharedForCollaboration === false
        ) {
          return {
            success: false,
            error: `Receiver component "${contrib.name}" lacks sufficient free working stock (${free} free, ${contrib.quantity} needed).`,
          };
        }
      }

      // Everything verified! Create Workspace and Reservations
      const workspaceId = `ws-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const nowIso = new Date().toISOString();

      const reservations: ComponentReservation[] = [];

      // 1. Reserve Sender parts
      const updatedSenderInventory = senderInventory.map((item) => {
        const contrib = proposal.proposedSenderContributions.find(
          (c) => c.inventoryItemId === item.id
        );
        if (contrib) {
          reservations.push({
            id: `res-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
            workspaceId,
            proposalId: proposal.id,
            inventoryItemId: item.id,
            ownerId: proposal.senderId,
            catalogId: contrib.catalogId,
            name: contrib.name,
            quantity: contrib.quantity,
            reservedAt: nowIso,
            status: 'active',
          });
          return {
            ...item,
            reservedQuantity: item.reservedQuantity + contrib.quantity,
            lastUpdated: nowIso,
          };
        }
        return item;
      });
      this.saveInventory(updatedSenderInventory, proposal.senderId);

      // 2. Reserve Receiver parts
      const updatedReceiverInventory = receiverInventory.map((item) => {
        const contrib = proposal.proposedReceiverContributions.find(
          (c) => c.inventoryItemId === item.id
        );
        if (contrib) {
          reservations.push({
            id: `res-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
            workspaceId,
            proposalId: proposal.id,
            inventoryItemId: item.id,
            ownerId: proposal.receiverId,
            catalogId: contrib.catalogId,
            name: contrib.name,
            quantity: contrib.quantity,
            reservedAt: nowIso,
            status: 'active',
          });
          return {
            ...item,
            reservedQuantity: item.reservedQuantity + contrib.quantity,
            lastUpdated: nowIso,
          };
        }
        return item;
      });
      this.saveInventory(updatedReceiverInventory, proposal.receiverId);

      // 3. Build Member roles map
      const memberRoles: Record<string, string> = {};
      proposal.suggestedResponsibilities.forEach((r) => {
        memberRoles[r.memberId] = r.roleDescription;
      });

      // 4. Create Workspace
      const newWorkspace: ProjectWorkspace = {
        id: workspaceId,
        projectId: proposal.projectId,
        proposalId: proposal.id,
        memberIds: [proposal.senderId, proposal.receiverId],
        memberRoles,
        status: 'active',
        reservations,
        tasks: [
          {
            id: `task-${Date.now().toString(36)}-1`,
            workspaceId,
            title: 'Verify physical component interfaces and pinouts',
            description: 'Check logic voltages and review team wiring schematic.',
            assigneeId: proposal.receiverId,
            status: 'todo',
            createdAt: nowIso,
          },
          {
            id: `task-${Date.now().toString(36)}-2`,
            workspaceId,
            title: 'Breadboard prototype circuit assembly',
            description: 'Connect shared components according to project specification.',
            assigneeId: proposal.senderId,
            status: 'todo',
            createdAt: nowIso,
          },
        ],
        messages: [
          {
            id: `msg-${Date.now().toString(36)}-1`,
            workspaceId,
            authorId: proposal.senderId,
            content: `Collaboration proposal accepted! Agreed component contributions are now reserved for this workspace.`,
            createdAt: nowIso,
          },
        ],
        mentorRequestIds: [],
        createdAt: nowIso,
      };

      this.saveWorkspace(newWorkspace);

      // 5. Update proposal status
      this.saveProposal({
        ...proposal,
        status: 'accepted',
        respondedAt: nowIso,
        workspaceId,
      });

      return { success: true, workspaceId };
    } catch (err: any) {
      console.error('Error accepting proposal:', err);
      return { success: false, error: err?.message || 'Failed to accept proposal.' };
    }
  },

  declineProposal(proposalId: string, reason?: string): void {
    const proposals = this.getProposals();
    const proposal = proposals.find((p) => p.id === proposalId);
    if (proposal && proposal.status === 'pending') {
      this.saveProposal({
        ...proposal,
        status: 'declined',
        respondedAt: new Date().toISOString(),
        rejectionReason: reason || 'Not available for this project at this time.',
      });
    }
  },

  cancelProposal(proposalId: string): void {
    const proposals = this.getProposals();
    const proposal = proposals.find((p) => p.id === proposalId);
    if (proposal && proposal.status === 'pending') {
      this.saveProposal({
        ...proposal,
        status: 'cancelled',
        respondedAt: new Date().toISOString(),
      });
    }
  },

  // ==========================================
  // Workspaces
  // ==========================================

  getWorkspaces(): ProjectWorkspace[] {
    try {
      const data = localStorage.getItem(WORKSPACES_KEY);
      if (!data) return SEED_WORKSPACES;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : SEED_WORKSPACES;
    } catch (e) {
      return SEED_WORKSPACES;
    }
  },

  getWorkspace(id: string): ProjectWorkspace | undefined {
    return this.getWorkspaces().find((w) => w.id === id);
  },

  saveWorkspace(workspace: ProjectWorkspace): void {
    try {
      const current = this.getWorkspaces();
      const existingIdx = current.findIndex((w) => w.id === workspace.id);
      let updated: ProjectWorkspace[];
      if (existingIdx >= 0) {
        updated = current.map((w) => (w.id === workspace.id ? workspace : w));
      } else {
        updated = [workspace, ...current];
      }
      localStorage.setItem(WORKSPACES_KEY, JSON.stringify(updated));
      notifyListeners();
    } catch (e) {
      console.error('Failed to save workspace:', e);
    }
  },

  cancelWorkspace(workspaceId: string): void {
    try {
      const workspaces = this.getWorkspaces();
      const workspace = workspaces.find((w) => w.id === workspaceId);
      if (!workspace || workspace.status === 'cancelled') return;

      // Release all active reservations and restore free stock
      const allInventories = this.getAllInventories();

      workspace.reservations.forEach((res) => {
        if (res.status === 'active') {
          const ownerInv = allInventories[res.ownerId];
          if (Array.isArray(ownerInv)) {
            allInventories[res.ownerId] = ownerInv.map((item) => {
              if (item.id === res.inventoryItemId) {
                return {
                  ...item,
                  reservedQuantity: Math.max(
                    0,
                    item.reservedQuantity - res.quantity
                  ),
                  lastUpdated: new Date().toISOString(),
                };
              }
              return item;
            });
          }
          res.status = 'released';
        }
      });

      localStorage.setItem(INVENTORIES_KEY, JSON.stringify(allInventories));

      // Mark workspace cancelled
      this.saveWorkspace({
        ...workspace,
        status: 'cancelled',
      });
    } catch (e) {
      console.error('Failed to cancel workspace:', e);
    }
  },

  addWorkspaceTask(
    workspaceId: string,
    task: Omit<WorkspaceTask, 'id' | 'createdAt'>
  ): void {
    const workspace = this.getWorkspace(workspaceId);
    if (!workspace) return;

    const newTask: WorkspaceTask = {
      ...task,
      id: `task-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      workspaceId,
      createdAt: new Date().toISOString(),
    };

    this.saveWorkspace({
      ...workspace,
      tasks: [...workspace.tasks, newTask],
    });
  },

  updateWorkspaceTask(workspaceId: string, task: WorkspaceTask): void {
    const workspace = this.getWorkspace(workspaceId);
    if (!workspace) return;

    this.saveWorkspace({
      ...workspace,
      tasks: workspace.tasks.map((t) => (t.id === task.id ? task : t)),
    });
  },

  deleteWorkspaceTask(workspaceId: string, taskId: string): void {
    const workspace = this.getWorkspace(workspaceId);
    if (!workspace) return;

    this.saveWorkspace({
      ...workspace,
      tasks: workspace.tasks.filter((t) => t.id !== taskId),
    });
  },

  addWorkspaceMessage(
    workspaceId: string,
    message: { authorId: string; content: string }
  ): void {
    const workspace = this.getWorkspace(workspaceId);
    if (!workspace) return;

    const newMsg: WorkspaceMessage = {
      id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      workspaceId,
      authorId: message.authorId,
      content: message.content.trim(),
      createdAt: new Date().toISOString(),
    };

    this.saveWorkspace({
      ...workspace,
      messages: [...workspace.messages, newMsg],
    });
  },

  // ==========================================
  // Mentorship Requests
  // ==========================================

  getMentorRequests(): MentorshipRequest[] {
    try {
      const data = localStorage.getItem(MENTOR_REQUESTS_KEY);
      if (!data) return SEED_MENTOR_REQUESTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : SEED_MENTOR_REQUESTS;
    } catch (e) {
      return SEED_MENTOR_REQUESTS;
    }
  },

  saveMentorRequest(request: MentorshipRequest): void {
    try {
      const current = this.getMentorRequests();
      const existingIdx = current.findIndex((r) => r.id === request.id);
      let updated: MentorshipRequest[];
      if (existingIdx >= 0) {
        updated = current.map((r) => (r.id === request.id ? request : r));
      } else {
        updated = [request, ...current];
      }
      localStorage.setItem(MENTOR_REQUESTS_KEY, JSON.stringify(updated));
      notifyListeners();
    } catch (e) {
      console.error('Failed to save mentor request:', e);
    }
  },

  respondToMentorRequest(
    requestId: string,
    authorId: string,
    content: string
  ): void {
    const requests = this.getMentorRequests();
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    const newResponse = {
      id: `resp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      authorId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    this.saveMentorRequest({
      ...request,
      status: request.status === 'open' ? 'accepted' : request.status,
      responses: [...request.responses, newResponse],
    });
  },

  resolveMentorRequest(requestId: string): void {
    const requests = this.getMentorRequests();
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    this.saveMentorRequest({
      ...request,
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
    });
  },

  // ==========================================
  // 3D Build Guide Progress Persistence (Scoped by Maker, Project, Recipe Version & Workspace)
  // ==========================================

  getGuideScopedKey(
    makerId: string,
    projectId: string,
    recipeVersion: string = 'v1',
    workspaceId?: string
  ): string {
    return `${makerId}::${projectId}::${workspaceId || 'standalone'}::${recipeVersion}`;
  },

  getAllGuideProgress(): Record<string, BuildGuideProgress> {
    try {
      const data = localStorage.getItem(GUIDE_PROGRESS_KEY);
      if (!data) return {};
      const parsed: Record<string, any> = JSON.parse(data) || {};

      // Safe migration: check for legacy un-scoped entries (e.g. key === 'proj-smart-dustbin')
      let hasMigrated = false;
      const migrated: Record<string, BuildGuideProgress> = {};

      for (const [key, value] of Object.entries(parsed)) {
        if (!key.includes('::')) {
          // Legacy Phase 3 un-scoped entry -> migrate to Adithya's standalone v1 scope
          const scopedKey = this.getGuideScopedKey(
            'maker-adithya',
            key,
            'v1',
            undefined
          );
          migrated[scopedKey] = {
            makerId: 'maker-adithya',
            projectId: key,
            recipeVersion: 'v1',
            workspaceId: undefined,
            currentStepIndex: value.currentStepIndex || 0,
            completedStepIndices: value.completedStepIndices || [],
            playbackSpeed: value.playbackSpeed || 1,
            lastUpdated: value.lastUpdated || new Date().toISOString(),
            isLearningCompleted:
              (value.completedStepIndices || []).length >= 6,
          };
          hasMigrated = true;
        } else {
          migrated[key] = value as BuildGuideProgress;
        }
      }

      if (hasMigrated) {
        localStorage.setItem(GUIDE_PROGRESS_KEY, JSON.stringify(migrated));
      }

      return migrated;
    } catch {
      return {};
    }
  },

  getGuideProgress(
    makerId?: string,
    projectId: string = 'proj-smart-dustbin',
    recipeVersion: string = 'v1',
    workspaceId?: string
  ): BuildGuideProgress {
    const effectiveMakerId = makerId || this.getActiveUser().id;
    const scopedKey = this.getGuideScopedKey(
      effectiveMakerId,
      projectId,
      recipeVersion,
      workspaceId
    );
    const all = this.getAllGuideProgress();

    if (all[scopedKey]) {
      return all[scopedKey];
    }

    return {
      makerId: effectiveMakerId,
      projectId,
      recipeVersion,
      workspaceId,
      currentStepIndex: 0,
      completedStepIndices: [],
      playbackSpeed: 1,
      isLearningCompleted: false,
      lastUpdated: new Date().toISOString(),
    };
  },

  saveGuideProgress(progress: BuildGuideProgress): void {
    try {
      const all = this.getAllGuideProgress();
      const scopedKey = this.getGuideScopedKey(
        progress.makerId,
        progress.projectId,
        progress.recipeVersion || 'v1',
        progress.workspaceId
      );

      all[scopedKey] = {
        ...progress,
        recipeVersion: progress.recipeVersion || 'v1',
        isLearningCompleted:
          progress.isLearningCompleted ??
          progress.completedStepIndices.length >= 6,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(GUIDE_PROGRESS_KEY, JSON.stringify(all));
      notifyListeners();
    } catch (e) {
      console.error('Failed to save guide progress:', e);
    }
  },

  resetGuideProgress(
    makerId?: string,
    projectId: string = 'proj-smart-dustbin',
    recipeVersion: string = 'v1',
    workspaceId?: string
  ): void {
    try {
      const effectiveMakerId = makerId || this.getActiveUser().id;
      const scopedKey = this.getGuideScopedKey(
        effectiveMakerId,
        projectId,
        recipeVersion,
        workspaceId
      );

      const all = this.getAllGuideProgress();
      delete all[scopedKey];
      localStorage.setItem(GUIDE_PROGRESS_KEY, JSON.stringify(all));
      notifyListeners();
    } catch (e) {
      console.error('Failed to reset guide progress:', e);
    }
  },

  // ==========================================
  // Reset Demo Action
  // ==========================================

  resetToDemo(): void {
    try {
      localStorage.setItem(STORAGE_VERSION_KEY, 'v2');
      localStorage.setItem(ACTIVE_USER_KEY, 'maker-adithya');
      localStorage.setItem(MAKERS_KEY, JSON.stringify(DEMO_MAKERS));

      const freshInventories: Record<string, ComponentItem[]> = {
        ...DEMO_INVENTORIES_BY_MAKER,
        'maker-adithya': SEED_INVENTORY.map((item) => ({
          ...item,
          ownerId: 'maker-adithya',
          isSharedForCollaboration: true,
        })),
      };

      localStorage.setItem(INVENTORIES_KEY, JSON.stringify(freshInventories));
      localStorage.setItem(PROPOSALS_KEY, JSON.stringify(SEED_PROPOSALS));
      localStorage.setItem(WORKSPACES_KEY, JSON.stringify(SEED_WORKSPACES));
      localStorage.setItem(
        MENTOR_REQUESTS_KEY,
        JSON.stringify(SEED_MENTOR_REQUESTS)
      );
      localStorage.setItem(
        SAVED_PROJECTS_KEY,
        JSON.stringify(DEFAULT_SAVED_PROJECTS)
      );
      localStorage.removeItem(GUIDE_PROGRESS_KEY);

      // Legacy key mirrors
      localStorage.setItem(LEGACY_PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      localStorage.setItem(
        LEGACY_INVENTORY_KEY,
        JSON.stringify(freshInventories['maker-adithya'])
      );

      notifyListeners();
      console.log('[EcoBuild] Reset to pristine Phase 2 demo state completed.');
    } catch (e) {
      console.error('Failed to reset demo data:', e);
    }
  },
};
