/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import {
  ComponentItem,
  UserProfile,
  MakerProfile,
  CollaborationProposal,
  ProjectWorkspace,
  MentorshipRequest,
  WorkspaceTask,
} from './types';
import { StorageService } from './services/storageService';
import { PROJECT_LIBRARY } from './data/projectLibrary';
import { calculateAllProjectsMatch } from './utils/matching';
import { rankAndExplainProjects } from './utils/ranking';

import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ComponentFormModal } from './components/inventory/ComponentFormModal';
import { ResetDemoDialog } from './components/common/ResetDemoDialog';
import {
  FutureFeatureModal,
  FutureFeatureType,
} from './components/common/FutureFeatureModal';
import { OnboardingModal } from './components/common/OnboardingModal';
import { MentorRequestModal } from './components/network/MentorRequestModal';

import { DiscoverPage } from './pages/DiscoverPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProjectLibraryPage } from './pages/ProjectLibraryPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { SavedProjectsPage } from './pages/SavedProjectsPage';
import { ProfilePage } from './pages/ProfilePage';
import { MakerNetworkPage } from './pages/MakerNetworkPage';
import { WorkspaceDetailPage } from './pages/WorkspaceDetailPage';
import { FutureFeaturePage } from './pages/FutureFeaturePage';

// Lazy-loaded 3D Build Studio module
const BuildStudioPage = React.lazy(() =>
  import('./pages/BuildStudioPage').then((m) => ({ default: m.BuildStudioPage }))
);

export default function App() {
  const [, setLocation] = useLocation();

  // App State backed by LocalStorage Repository v2
  const [activeUser, setActiveUser] = useState<MakerProfile>(() =>
    StorageService.getActiveUser()
  );
  const [allMakers, setAllMakers] = useState<MakerProfile[]>(() =>
    StorageService.getMakerProfiles()
  );
  const [allInventories, setAllInventories] = useState<Record<string, ComponentItem[]>>(() =>
    StorageService.getAllInventories()
  );
  const [inventory, setInventory] = useState<ComponentItem[]>(() =>
    StorageService.getInventory()
  );
  const [proposals, setProposals] = useState<CollaborationProposal[]>(() =>
    StorageService.getProposals()
  );
  const [workspaces, setWorkspaces] = useState<ProjectWorkspace[]>(() =>
    StorageService.getWorkspaces()
  );
  const [mentorRequests, setMentorRequests] = useState<MentorshipRequest[]>(() =>
    StorageService.getMentorRequests()
  );
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    StorageService.getSavedProjectIds()
  );

  // Sync state with StorageService updates
  useEffect(() => {
    const unsubscribe = StorageService.subscribe(() => {
      setActiveUser(StorageService.getActiveUser());
      setAllMakers(StorageService.getMakerProfiles());
      setAllInventories(StorageService.getAllInventories());
      setInventory(StorageService.getInventory());
      setProposals(StorageService.getProposals());
      setWorkspaces(StorageService.getWorkspaces());
      setMentorRequests(StorageService.getMentorRequests());
      setSavedIds(StorageService.getSavedProjectIds());
    });
    return unsubscribe;
  }, []);

  // First Visit Onboarding Check
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  useEffect(() => {
    const hasSeen = localStorage.getItem('ecobuild_has_onboarded_v1');
    if (!hasSeen) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleExploreDemo = () => {
    localStorage.setItem('ecobuild_has_onboarded_v1', 'true');
    setIsOnboardingOpen(false);
  };

  const handleSaveProfileFromOnboarding = (newProfile: UserProfile) => {
    localStorage.setItem('ecobuild_has_onboarded_v1', 'true');
    StorageService.saveProfile(newProfile);
    setIsOnboardingOpen(false);
  };

  // UI Modals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddComponentOpen, setIsAddComponentOpen] = useState(false);
  const [editingComponent, setEditingComponent] =
    useState<ComponentItem | null>(null);
  const [isResetDemoOpen, setIsResetDemoOpen] = useState(false);
  const [futureModalType, setFutureModalType] =
    useState<FutureFeatureType | null>(null);
  const [futureProjectName, setFutureProjectName] = useState<string | undefined>();

  // Global Mentor Request Modal (opened from project details or workspace)
  const [globalMentorProjectId, setGlobalMentorProjectId] = useState<string | null>(null);
  const [globalMentorWorkspaceId, setGlobalMentorWorkspaceId] = useState<string | undefined>();
  const [globalMentorPrefillQuestion, setGlobalMentorPrefillQuestion] = useState<string | undefined>();
  const [globalMentorPrefillStage, setGlobalMentorPrefillStage] = useState<string | undefined>();

  // Deterministic Matching Recalculation (Pure & Memoized against Active User's Inventory)
  const projectMatches = useMemo(() => {
    return calculateAllProjectsMatch(PROJECT_LIBRARY, inventory);
  }, [inventory]);

  // Deterministic Personalized Ranking for Active User
  const rankedMatches = useMemo(() => {
    return rankAndExplainProjects(
      projectMatches,
      StorageService.getProfile(),
      inventory
    );
  }, [projectMatches, inventory]);

  // Computed free items count for active user
  const freeCount = useMemo(() => {
    return inventory
      .filter((item) => item.condition === 'working')
      .reduce(
        (sum, item) =>
          sum +
          Math.max(
            0,
            item.totalQuantity - item.reservedQuantity - item.installedQuantity
          ),
        0
      );
  }, [inventory]);

  // Active workspaces count for active user
  const activeWorkspacesCount = useMemo(() => {
    return workspaces.filter(
      (w) => w.status === 'active' && w.memberIds.includes(activeUser.id)
    ).length;
  }, [workspaces, activeUser.id]);

  // Demo User Switching
  const handleSelectUser = useCallback((userId: string) => {
    StorageService.setActiveUserId(userId);
  }, []);

  // Inventory CRUD handlers
  const handleSaveComponent = useCallback(
    (item: ComponentItem) => {
      if (editingComponent) {
        StorageService.updateComponent(item, activeUser.id);
        setEditingComponent(null);
      } else {
        StorageService.addComponent(item, activeUser.id);
      }
    },
    [editingComponent, activeUser.id]
  );

  const handleEditComponent = useCallback((item: ComponentItem) => {
    setEditingComponent(item);
    setIsAddComponentOpen(true);
  }, []);

  const handleDeleteComponent = useCallback(
    (id: string) => {
      StorageService.deleteComponent(id, activeUser.id);
    },
    [activeUser.id]
  );

  const handleToggleSave = useCallback((projectId: string) => {
    StorageService.toggleSaveProject(projectId);
  }, []);

  const handleResetDemoConfirm = useCallback(() => {
    StorageService.resetToDemo();
  }, []);

  const handleOpenFutureModal = useCallback(
    (type: FutureFeatureType, projectName?: string) => {
      setFutureModalType(type);
      setFutureProjectName(projectName);
    },
    []
  );

  // Collaboration Proposal Handlers
  const handleSendProposal = useCallback((proposal: CollaborationProposal) => {
    StorageService.saveProposal(proposal);
  }, []);

  const handleAcceptProposal = useCallback((proposalId: string) => {
    return StorageService.acceptProposal(proposalId);
  }, []);

  const handleDeclineProposal = useCallback((proposalId: string) => {
    StorageService.declineProposal(proposalId);
  }, []);

  const handleCancelProposal = useCallback((proposalId: string) => {
    StorageService.cancelProposal(proposalId);
  }, []);

  // Workspace Handlers
  const handleAddTask = useCallback(
    (workspaceId: string, task: Omit<WorkspaceTask, 'id' | 'createdAt'>) => {
      StorageService.addWorkspaceTask(workspaceId, task);
    },
    []
  );

  const handleUpdateTask = useCallback(
    (workspaceId: string, task: WorkspaceTask) => {
      StorageService.updateWorkspaceTask(workspaceId, task);
    },
    []
  );

  const handleDeleteTask = useCallback(
    (workspaceId: string, taskId: string) => {
      StorageService.deleteWorkspaceTask(workspaceId, taskId);
    },
    []
  );

  const handleAddWorkspaceMessage = useCallback(
    (workspaceId: string, message: { authorId: string; content: string }) => {
      StorageService.addWorkspaceMessage(workspaceId, message);
    },
    []
  );

  const handleCancelWorkspace = useCallback((workspaceId: string) => {
    StorageService.cancelWorkspace(workspaceId);
  }, []);

  // Mentorship Handlers
  const handleSubmitMentorRequest = useCallback(
    (request: MentorshipRequest) => {
      StorageService.saveMentorRequest(request);
    },
    []
  );

  const handleRespondMentorRequest = useCallback(
    (requestId: string, content: string) => {
      StorageService.respondToMentorRequest(requestId, activeUser.id, content);
    },
    [activeUser.id]
  );

  const handleResolveMentorRequest = useCallback((requestId: string) => {
    StorageService.resolveMentorRequest(requestId);
  }, []);

  // Network Navigation shortcuts from Project Details
  const handleFindPartnerForProject = useCallback(
    (projectId: string) => {
      setLocation(`/network?project=${projectId}`);
    },
    [setLocation]
  );

  const handleAskMentorForProject = useCallback(
    (projectId: string, workspaceId?: string, prefillQuestion?: string, prefillStage?: string) => {
      setGlobalMentorProjectId(projectId);
      setGlobalMentorWorkspaceId(workspaceId);
      setGlobalMentorPrefillQuestion(prefillQuestion);
      setGlobalMentorPrefillStage(prefillStage);
    },
    []
  );

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col font-sans selection:bg-[#EAF4F3] selection:text-[#087F83]">
      {/* Accessible Top Bar */}
      <Header
        onOpenAddComponent={() => {
          setEditingComponent(null);
          setIsAddComponentOpen(true);
        }}
        onOpenResetDemo={() => setIsResetDemoOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        savedCount={savedIds.length}
        activeUser={activeUser}
        allMakers={allMakers}
        proposals={proposals}
        mentorRequests={mentorRequests}
        onSelectUser={handleSelectUser}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          inventoryCount={inventory.length}
          freeCount={freeCount}
          savedCount={savedIds.length}
          activeWorkspacesCount={activeWorkspacesCount}
          activeUser={activeUser}
          onOpenFutureFeature={handleOpenFutureModal}
        />

        {/* Dynamic Route Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Switch>
            <Route path="/">
              <DiscoverPage
                profile={activeUser}
                inventory={inventory}
                rankedMatches={rankedMatches}
                savedIds={savedIds}
                allMakers={allMakers}
                allInventories={allInventories}
                proposals={proposals}
                mentorRequests={mentorRequests}
                projects={PROJECT_LIBRARY}
                onToggleSave={handleToggleSave}
                onOpenAddComponent={() => {
                  setEditingComponent(null);
                  setIsAddComponentOpen(true);
                }}
                onOpenFutureFeature={handleOpenFutureModal}
              />
            </Route>

            <Route path="/components">
              <InventoryPage
                inventory={inventory}
                onAdd={() => {
                  setEditingComponent(null);
                  setIsAddComponentOpen(true);
                }}
                onEdit={handleEditComponent}
                onDelete={handleDeleteComponent}
                onOpenResetDemo={() => setIsResetDemoOpen(true)}
              />
            </Route>

            <Route path="/projects">
              <ProjectLibraryPage
                projectMatches={rankedMatches}
                savedIds={savedIds}
                onToggleSave={handleToggleSave}
              />
            </Route>

            <Route path="/projects/:id">
              <ProjectDetailPage
                projectMatches={projectMatches}
                savedIds={savedIds}
                onToggleSave={handleToggleSave}
                onOpenFutureFeature={handleOpenFutureModal}
                onOpenAddComponent={() => {
                  setEditingComponent(null);
                  setIsAddComponentOpen(true);
                }}
                onFindPartnerForProject={handleFindPartnerForProject}
                onAskMentorForProject={handleAskMentorForProject}
              />
            </Route>

            {/* Maker Network (Phase 2 Working Destination) */}
            <Route path="/network">
              <MakerNetworkPage
                projects={PROJECT_LIBRARY}
                activeUser={activeUser}
                allMakers={allMakers}
                allInventories={allInventories}
                proposals={proposals}
                workspaces={workspaces}
                mentorRequests={mentorRequests}
                onSendProposal={handleSendProposal}
                onAcceptProposal={handleAcceptProposal}
                onDeclineProposal={handleDeclineProposal}
                onCancelProposal={handleCancelProposal}
                onSubmitMentorRequest={handleSubmitMentorRequest}
                onRespondMentorRequest={handleRespondMentorRequest}
                onResolveMentorRequest={handleResolveMentorRequest}
              />
            </Route>

            {/* Working Project Workspace Room */}
            <Route path="/workspaces/:id">
              <WorkspaceDetailPage
                workspaces={workspaces}
                projects={PROJECT_LIBRARY}
                allMakers={allMakers}
                activeUser={activeUser}
                mentorRequests={mentorRequests}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onAddMessage={handleAddWorkspaceMessage}
                onCancelWorkspace={handleCancelWorkspace}
                onOpenFutureFeature={handleOpenFutureModal}
                onOpenMentorRequest={handleAskMentorForProject}
              />
            </Route>

            <Route path="/saved">
              <SavedProjectsPage
                projectMatches={projectMatches}
                savedIds={savedIds}
                onToggleSave={handleToggleSave}
              />
            </Route>

            <Route path="/profile">
              <ProfilePage
                profile={StorageService.getProfile()}
                onSaveProfile={(updated) => StorageService.saveProfile(updated)}
                onOpenResetDemo={() => setIsResetDemoOpen(true)}
              />
            </Route>

            {/* Phase 3 Working Destination: Interactive 3D Build Studio */}
            <Route path="/studio">
              <React.Suspense
                fallback={
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
                    <div className="w-10 h-10 border-4 border-[#087F83] border-t-transparent rounded-full animate-spin mx-auto" />
                    <h3 className="text-base font-bold text-[#132B3B]">
                      Loading 3D Build Studio...
                    </h3>
                    <p className="text-xs text-slate-500">
                      Preparing interactive 3D WebGL scene and circuit components.
                    </p>
                  </div>
                }
              >
                <BuildStudioPage
                  activeUser={activeUser}
                  inventory={inventory}
                  onOpenAddComponent={() => {
                    setEditingComponent(null);
                    setIsAddComponentOpen(true);
                  }}
                  onAskMentor={handleAskMentorForProject}
                />
              </React.Suspense>
            </Route>

            <Route path="/impact">
              <FutureFeaturePage type="impact" />
            </Route>

            {/* Fallback */}
            <Route>
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
                <h2 className="text-xl font-bold text-[#132B3B]">Page Not Found</h2>
                <p className="text-xs text-slate-500">
                  The requested workbench destination is not recognized.
                </p>
                <button
                  onClick={() => setLocation('/')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#087F83] rounded-lg cursor-pointer"
                >
                  Return to Discover
                </button>
              </div>
            </Route>
          </Switch>
        </main>
      </div>

      {/* Global Modals */}
      <ComponentFormModal
        isOpen={isAddComponentOpen}
        onClose={() => {
          setIsAddComponentOpen(false);
          setEditingComponent(null);
        }}
        onSave={handleSaveComponent}
        initialItem={editingComponent}
      />

      <ResetDemoDialog
        isOpen={isResetDemoOpen}
        onClose={() => setIsResetDemoOpen(false)}
        onConfirm={handleResetDemoConfirm}
      />

      <FutureFeatureModal
        isOpen={Boolean(futureModalType)}
        onClose={() => {
          setFutureModalType(null);
          setFutureProjectName(undefined);
        }}
        featureType={futureModalType}
        projectName={futureProjectName}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onExploreDemo={handleExploreDemo}
        onSaveProfile={handleSaveProfileFromOnboarding}
        currentProfile={StorageService.getProfile()}
      />

      {/* Global Mentor Request Modal */}
      {globalMentorProjectId && (
        <MentorRequestModal
          isOpen={Boolean(globalMentorProjectId)}
          onClose={() => {
            setGlobalMentorProjectId(null);
            setGlobalMentorWorkspaceId(undefined);
            setGlobalMentorPrefillQuestion(undefined);
            setGlobalMentorPrefillStage(undefined);
          }}
          selectedMentor={null}
          allMentors={allMakers.filter((m) => m.mentorProfile?.isAvailable)}
          projects={PROJECT_LIBRARY}
          defaultProjectId={globalMentorProjectId}
          defaultWorkspaceId={globalMentorWorkspaceId}
          defaultQuestion={globalMentorPrefillQuestion}
          defaultStage={globalMentorPrefillStage}
          activeUser={activeUser}
          onSubmitRequest={handleSubmitMentorRequest}
        />
      )}
    </div>
  );
}
