/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateProjectMatch } from './matching';
import { calculatePartnerSuggestions } from './partnerMatching';
import { calculateWorkspaceProjectMatch } from './workspaceMatching';
import { ProjectTemplate, ComponentItem, MakerProfile, ProjectWorkspace } from '../types';
import { getProjectSustainabilitySummary } from './sustainability';
import {
  SMART_DUSTBIN_STEPS,
  SMART_DUSTBIN_COMPONENTS,
  SMART_DUSTBIN_WIRES,
  SMART_DUSTBIN_PINS,
} from '../studio/data/smartDustbinRecipe';

function runTests() {
  console.log('--- Running EcoBuild Phase 1 & Phase 2 Verification Checks ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // ==========================================
  // PHASE 1 CHECKS
  // ==========================================

  // 1. Acceptance Check #11: The 75% quantity example calculates correctly
  const testProject75: ProjectTemplate = {
    id: 'test-75',
    name: 'Test Project 75',
    description: 'Testing 75% coverage calculation',
    purpose: 'Test',
    category: 'Test',
    interestTags: ['testing'],
    difficulty: 'Beginner',
    estimatedDuration: '10 mins',
    illustrationKey: 'night-light',
    mechanicalSupplies: [],
    learningOutcomes: [],
    highLevelOverview: [],
    requirements: [
      { catalogId: 'board', name: 'Microcontroller Board', quantity: 1, isCritical: true, category: 'microcontroller', typicalUnitMassGrams: 20 },
      { catalogId: 'sensor', name: 'Distance Sensor', quantity: 1, isCritical: true, category: 'sensor', typicalUnitMassGrams: 10 },
      { catalogId: 'led', name: 'LED', quantity: 2, isCritical: true, category: 'passive', typicalUnitMassGrams: 1 },
    ],
  };

  const inventory75: ComponentItem[] = [
    {
      id: 'i1',
      catalogId: 'board',
      name: 'Board',
      category: 'microcontroller',
      totalQuantity: 1,
      reservedQuantity: 0,
      installedQuantity: 0,
      condition: 'working',
      source: 'purchased',
      unitMassGrams: 20,
      lastUpdated: '',
      verificationStatus: 'user-reported-working',
      ownerId: 'maker-adithya',
      isSharedForCollaboration: true,
    },
    {
      id: 'i2',
      catalogId: 'sensor',
      name: 'Sensor',
      category: 'sensor',
      totalQuantity: 1,
      reservedQuantity: 0,
      installedQuantity: 0,
      condition: 'working',
      source: 'purchased',
      unitMassGrams: 10,
      lastUpdated: '',
      verificationStatus: 'user-reported-working',
      ownerId: 'maker-adithya',
      isSharedForCollaboration: true,
    },
    {
      id: 'i3',
      catalogId: 'led',
      name: 'LED',
      category: 'passive',
      totalQuantity: 1, // Only 1 LED eligible
      reservedQuantity: 0,
      installedQuantity: 0,
      condition: 'working',
      source: 'purchased',
      unitMassGrams: 1,
      lastUpdated: '',
      verificationStatus: 'user-reported-working',
      ownerId: 'maker-adithya',
      isSharedForCollaboration: true,
    },
  ];

  const result75 = calculateProjectMatch(testProject75, inventory75);
  assert(
    result75.totalRequiredUnits === 4,
    'Phase 1: Project requires 4 total units (1 board + 1 sensor + 2 LEDs)'
  );
  assert(
    result75.matchedWorkingUnits === 3,
    'Phase 1: Matched working units is 3 (1 board + 1 sensor + 1 LED)'
  );
  assert(
    result75.coveragePercentage === 75,
    'Phase 1: Coverage percentage calculates to exactly 75%'
  );
  assert(
    result75.missingCount === 1,
    'Phase 1: Missing component count is 1 (1 LED missing)'
  );

  // 2. Faulty or unsafe component does NOT improve coverage
  const inventoryWithFaulty: ComponentItem[] = [
    {
      id: 'i4',
      catalogId: 'led',
      name: 'Faulty LED',
      category: 'passive',
      totalQuantity: 5,
      reservedQuantity: 0,
      installedQuantity: 0,
      condition: 'faulty',
      source: 'salvaged',
      unitMassGrams: 1,
      lastUpdated: '',
      verificationStatus: 'untested',
      ownerId: 'maker-adithya',
    },
  ];
  const resultFaulty = calculateProjectMatch(testProject75, inventoryWithFaulty);
  assert(
    resultFaulty.coveragePercentage === 0,
    'Phase 1: Faulty components do not contribute to working coverage (0%)'
  );

  // 3. Potential reuse mass
  const sustainSummary = getProjectSustainabilitySummary(result75);
  assert(
    sustainSummary.potentialReuseMassGrams === 31,
    'Phase 1: Potential reuse mass accurately sums 31g for allocated units only'
  );

  // ==========================================
  // PHASE 2 COLLABORATIVE NETWORK CHECKS
  // ==========================================

  // Check 4: Partner Matching logic calculates combined coverage and improvement
  const activeMaker: MakerProfile = {
    id: 'maker-adithya',
    displayName: 'Adithya',
    isDemo: true,
    experience: 'Beginner',
    skills: ['Arduino programming'],
    interests: ['robotics'],
    collaborationPreference: 'Open to team builds',
  };

  const partnerMaker: MakerProfile = {
    id: 'maker-elena',
    displayName: 'Elena',
    isDemo: true,
    experience: 'Intermediate',
    skills: ['Mechanical assembly'],
    interests: ['robotics'],
    collaborationPreference: 'Open to team builds',
  };

  const partnerInventory: ComponentItem[] = [
    {
      id: 'p-led-1',
      catalogId: 'led',
      name: 'Partner LED',
      category: 'passive',
      totalQuantity: 2,
      reservedQuantity: 0,
      installedQuantity: 0,
      condition: 'working',
      source: 'purchased',
      unitMassGrams: 1,
      lastUpdated: '',
      verificationStatus: 'user-reported-working',
      ownerId: 'maker-elena',
      isSharedForCollaboration: true,
    },
  ];

  const allInventoriesMap = {
    'maker-adithya': inventory75,
    'maker-elena': partnerInventory,
  };

  const partnerSuggestions = calculatePartnerSuggestions(
    testProject75,
    activeMaker,
    inventory75,
    [activeMaker, partnerMaker],
    allInventoriesMap
  );

  assert(
    partnerSuggestions.length === 1,
    'Phase 2: Partner suggestion returned for candidate holding missing LED'
  );
  assert(
    partnerSuggestions[0].userCoveragePercentage === 75,
    'Phase 2: Partner suggestion accurately reflects user 75% baseline'
  );
  assert(
    partnerSuggestions[0].combinedCoveragePercentage === 100,
    'Phase 2: Combined coverage reaches 100% with partner missing LED'
  );
  assert(
    partnerSuggestions[0].coverageImprovementPercentage === 25,
    'Phase 2: Coverage improvement boost is +25%'
  );

  // Check 5: Unshared component exclusion
  const unsharedPartnerInventory: ComponentItem[] = [
    {
      id: 'p-led-unshared',
      catalogId: 'led',
      name: 'Private Partner LED',
      category: 'passive',
      totalQuantity: 2,
      reservedQuantity: 0,
      installedQuantity: 0,
      condition: 'working',
      source: 'purchased',
      unitMassGrams: 1,
      lastUpdated: '',
      verificationStatus: 'user-reported-working',
      ownerId: 'maker-elena',
      isSharedForCollaboration: false, // NOT shared!
    },
  ];

  const unsharedSuggestions = calculatePartnerSuggestions(
    testProject75,
    activeMaker,
    inventory75,
    [activeMaker, partnerMaker],
    {
      'maker-adithya': inventory75,
      'maker-elena': unsharedPartnerInventory,
    }
  );

  assert(
    unsharedSuggestions[0].partnerOfferedItems.length === 0,
    'Phase 2: Private unshared parts are excluded from partner offers'
  );
  assert(
    unsharedSuggestions[0].combinedCoveragePercentage === 75,
    'Phase 2: Combined coverage does not improve when candidate parts are unshared'
  );

  // Check 6: Workspace counts its own active reservations toward its requirements
  const testWorkspace: ProjectWorkspace = {
    id: 'ws-test-01',
    projectId: 'test-75',
    memberIds: ['maker-adithya', 'maker-elena'],
    memberRoles: {
      'maker-adithya': 'Electronics',
      'maker-elena': 'Assembly',
    },
    status: 'active',
    createdAt: new Date().toISOString(),
    tasks: [],
    messages: [],
    mentorRequestIds: [],
    reservations: [
      {
        id: 'r1',
        workspaceId: 'ws-test-01',
        inventoryItemId: 'i1',
        ownerId: 'maker-adithya',
        catalogId: 'board',
        name: 'Board',
        quantity: 1,
        reservedAt: '',
        status: 'active',
      },
      {
        id: 'r2',
        workspaceId: 'ws-test-01',
        inventoryItemId: 'i2',
        ownerId: 'maker-adithya',
        catalogId: 'sensor',
        name: 'Sensor',
        quantity: 1,
        reservedAt: '',
        status: 'active',
      },
      {
        id: 'r3',
        workspaceId: 'ws-test-01',
        inventoryItemId: 'i3',
        ownerId: 'maker-adithya',
        catalogId: 'led',
        name: 'LED 1',
        quantity: 1,
        reservedAt: '',
        status: 'active',
      },
      {
        id: 'r4',
        workspaceId: 'ws-test-01',
        inventoryItemId: 'p-led-1',
        ownerId: 'maker-elena',
        catalogId: 'led',
        name: 'LED 2',
        quantity: 1,
        reservedAt: '',
        status: 'active',
      },
    ],
  };

  const wsMatchResult = calculateWorkspaceProjectMatch(testProject75, testWorkspace);
  assert(
    wsMatchResult.coveragePercentage === 100,
    'Phase 2: Workspace retains 100% coverage from its own active reservations'
  );
  assert(
    wsMatchResult.matchedReservedUnits === 4,
    'Phase 2: Workspace counts all 4 reserved units as satisfied'
  );
  assert(
    wsMatchResult.missingCount === 0,
    'Phase 2: Zero missing units in fully reserved workspace'
  );

  // Check 7: Released reservation removes coverage
  const testWorkspaceWithReleased: ProjectWorkspace = {
    ...testWorkspace,
    reservations: testWorkspace.reservations.map((r) =>
      r.id === 'r4' ? { ...r, status: 'released' } : r
    ),
  };
  const wsReleasedResult = calculateWorkspaceProjectMatch(
    testProject75,
    testWorkspaceWithReleased
  );
  assert(
    wsReleasedResult.coveragePercentage === 75,
    'Phase 2: Released reservation reduces workspace coverage back to 75%'
  );
  assert(
    wsReleasedResult.missingCount === 1,
    'Phase 2: Missing count is 1 after releasing partner LED'
  );

  // ==========================================
  // PHASE 3 3D BUILD STUDIO CHECKS
  // ==========================================

  // Check 8: Smart Dustbin 3D recipe steps structure
  assert(
    SMART_DUSTBIN_STEPS.length === 6,
    'Phase 3: Smart Dustbin 3D recipe defines exactly 6 assembly steps'
  );
  assert(
    SMART_DUSTBIN_STEPS[0].id === 'step-bench-inspection',
    'Phase 3: Step 1 is bench inspection and component layout'
  );
  assert(
    SMART_DUSTBIN_STEPS[5].cameraPreset === 'simulation',
    'Phase 3: Step 6 features the live interactive circuit simulation'
  );

  // Check 9: Recipe components map to catalog items
  const componentCatalogIds = SMART_DUSTBIN_COMPONENTS.map((c) => c.catalogId);
  assert(
    componentCatalogIds.includes('arduino-uno'),
    'Phase 3: 3D Studio includes Arduino Uno component'
  );
  assert(
    componentCatalogIds.includes('hc-sr04'),
    'Phase 3: 3D Studio includes HC-SR04 ultrasonic distance sensor'
  );
  assert(
    componentCatalogIds.includes('sg90-servo'),
    'Phase 3: 3D Studio includes SG90 micro servo actuator'
  );
  assert(
    componentCatalogIds.includes('breadboard-half'),
    'Phase 3: 3D Studio includes Half-Size solderless breadboard'
  );

  // Check 10: Pin endpoints and wire connections validity
  assert(
    SMART_DUSTBIN_PINS.length >= 12,
    'Phase 3: Defined at least 12 interactive pin endpoints across components'
  );
  const pinIds = new Set(SMART_DUSTBIN_PINS.map((p) => p.id));
  const allWiresValid = SMART_DUSTBIN_WIRES.every(
    (w) => pinIds.has(w.fromPinId) && pinIds.has(w.toPinId)
  );
  assert(
    allWiresValid,
    'Phase 3: All 3D jumper wire connections map to valid from/to pin endpoints'
  );

  console.log(`\nTests Summary: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
