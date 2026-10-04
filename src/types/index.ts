/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ComponentCondition =
  | 'working'
  | 'partially-working'
  | 'untested'
  | 'faulty'
  | 'unsafe';

export type VerificationStatus =
  | 'untested'
  | 'user-reported-working'
  | 'recorded-test';

export type ComponentSource =
  | 'purchased'
  | 'previous-project'
  | 'salvaged'
  | 'donated';

export type ComponentCategory =
  | 'microcontroller'
  | 'sensor'
  | 'actuator'
  | 'passive'
  | 'prototyping'
  | 'display'
  | 'power'
  | 'other';

export interface ComponentItem {
  id: string;
  catalogId: string;
  name: string;
  category: ComponentCategory;
  totalQuantity: number;
  reservedQuantity: number;
  installedQuantity: number;
  condition: ComponentCondition;
  source: ComponentSource;
  unitMassGrams: number | null;
  notes?: string;
  photoPreview?: string | null;
  lastUpdated: string;
  verificationStatus: VerificationStatus;
  // Phase 2 Collaboration Fields
  ownerId?: string;
  isSharedForCollaboration?: boolean;
}

export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ProjectRequirement {
  catalogId: string;
  name: string;
  quantity: number;
  isCritical: boolean;
  category: ComponentCategory;
  estimatedUnitPriceUsd?: number;
  typicalUnitMassGrams?: number;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  purpose: string;
  category: string;
  interestTags: string[];
  difficulty: ProjectDifficulty;
  estimatedDuration: string;
  requirements: ProjectRequirement[];
  mechanicalSupplies: string[];
  learningOutcomes: string[];
  highLevelOverview: string[];
  illustrationKey: string;
}

export interface RequirementMatch {
  requirement: ProjectRequirement;
  requiredQuantity: number;
  matchedWorkingQuantity: number;
  untestedPotentialQuantity: number;
  missingQuantity: number;
  allocatedInventoryItems: {
    item: ComponentItem;
    quantity: number;
  }[];
  isFullyCovered: boolean;
}

export type ReadinessState =
  | 'missing-components'
  | 'testing-needed'
  | 'supplies-needed'
  | 'covered';

export interface ProjectMatchResult {
  project: ProjectTemplate;
  totalRequiredUnits: number;
  matchedWorkingUnits: number;
  untestedUnits: number;
  coveragePercentage: number;
  missingCount: number;
  isFullyCovered: boolean;
  requirementMatches: RequirementMatch[];
  readinessState: ReadinessState;
  potentialReuseMassGrams: number;
  isMassDataComplete: boolean;
  estimatedMissingCostUsd: number;
  recommendationReasons: string[];
}

export interface UserProfile {
  displayName: string;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  interests: string[];
  preferredDifficulty: ProjectDifficulty;
  availableTime: string;
  hasCompletedOnboarding: boolean;
}

// ==========================================
// PHASE 2: COLLABORATIVE MAKER NETWORK TYPES
// ==========================================

export type CollaborationPreference =
  | 'Open to team builds'
  | 'Mentoring only'
  | 'Project-specific'
  | 'Solo maker';

export type MentorshipHelpCategory =
  | 'choosing-components'
  | 'understanding-circuit'
  | 'programming'
  | 'testing-component'
  | 'troubleshooting'
  | 'planning-assembly';

export interface MakerMentorProfile {
  isAvailable: boolean;
  topics: MentorshipHelpCategory[];
  preferredLanguage?: string;
  availabilityNotes: string;
}

export interface MakerProfile {
  id: string;
  displayName: string;
  isDemo: boolean;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  interests: string[];
  collaborationPreference: CollaborationPreference;
  locationLabel?: string;
  bio?: string;
  mentorProfile?: MakerMentorProfile;
}

export interface ContributionItem {
  inventoryItemId: string;
  catalogId: string;
  name: string;
  quantity: number;
}

export interface ResponsibilityItem {
  memberId: string;
  roleDescription: string;
}

export type ProposalStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'cancelled'
  | 'expired';

export interface CollaborationProposal {
  id: string;
  projectId: string;
  senderId: string;
  receiverId: string;
  proposedSenderContributions: ContributionItem[];
  proposedReceiverContributions: ContributionItem[];
  remainingDeficits: {
    catalogId: string;
    name: string;
    quantity: number;
  }[];
  suggestedResponsibilities: ResponsibilityItem[];
  message: string;
  status: ProposalStatus;
  createdAt: string;
  respondedAt?: string;
  workspaceId?: string;
  rejectionReason?: string;
}

export interface ComponentReservation {
  id: string;
  workspaceId: string;
  proposalId?: string;
  inventoryItemId: string;
  ownerId: string;
  catalogId: string;
  name: string;
  quantity: number;
  reservedAt: string;
  status: 'active' | 'released';
}

export interface ReservationEvent {
  id: string;
  workspaceId: string;
  reservationId: string;
  eventType: 'reserved' | 'released';
  ownerId: string;
  catalogId: string;
  quantity: number;
  timestamp: string;
  reason?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface WorkspaceTask {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  status: TaskStatus;
  createdAt: string;
}

export interface WorkspaceMessage {
  id: string;
  workspaceId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface ProjectWorkspace {
  id: string;
  projectId: string;
  proposalId?: string;
  memberIds: string[];
  memberRoles: Record<string, string>;
  status: 'active' | 'completed' | 'cancelled';
  reservations: ComponentReservation[];
  tasks: WorkspaceTask[];
  messages: WorkspaceMessage[];
  mentorRequestIds: string[];
  createdAt: string;
}

export type MentorshipRequestStatus =
  | 'open'
  | 'accepted'
  | 'resolved'
  | 'cancelled';

export interface MentorshipResponse {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface MentorshipRequest {
  id: string;
  requesterId: string;
  mentorId: string;
  projectId: string;
  workspaceId?: string;
  helpCategory: MentorshipHelpCategory;
  question: string;
  currentStage: string;
  relevantComponents: string[];
  notesOrCode?: string;
  status: MentorshipRequestStatus;
  responses: MentorshipResponse[];
  createdAt: string;
  resolvedAt?: string;
}

export interface PartnerSuggestion {
  maker: MakerProfile;
  project: ProjectTemplate;
  userCoveragePercentage: number;
  combinedCoveragePercentage: number;
  coverageImprovementPercentage: number;
  userMatchedUnits: number;
  partnerMatchedUnits: number;
  totalRequiredUnits: number;
  partnerOfferedItems: {
    item: ComponentItem;
    satisfiesRequirement: ProjectRequirement;
    offeredQuantity: number;
  }[];
  userContributedItems: {
    item: ComponentItem;
    satisfiesRequirement: ProjectRequirement;
    quantity: number;
  }[];
  stillMissingRequirements: {
    requirement: ProjectRequirement;
    missingQuantity: number;
  }[];
  complementarySkills: string[];
  sharedInterests: string[];
  matchExplanation: string;
  rankingScore: number;
}
