/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CollaborationProposal,
  ProjectWorkspace,
  MentorshipRequest,
} from '../types';

export const SEED_PROPOSALS: CollaborationProposal[] = [
  {
    id: 'prop-priya-adithya-reaction-01',
    projectId: 'proj-reaction-game',
    senderId: 'maker-priya',
    receiverId: 'maker-adithya',
    status: 'pending',
    createdAt: '2026-10-03T16:30:00Z',
    message:
      'Hi Adithya! I noticed you have the Arduino Uno and resistors for the Reaction Game, and I have tactile arcade push buttons and a 5V piezo buzzer. Would you like to team up to build this reflex tester?',
    proposedSenderContributions: [
      {
        inventoryItemId: 'inv-priya-button-01',
        catalogId: 'push-button',
        name: 'Tactile Momentary Push Button',
        quantity: 2,
      },
      {
        inventoryItemId: 'inv-priya-buzzer-01',
        catalogId: 'buzzer-piezo',
        name: '5V Active Piezo Buzzer Module',
        quantity: 1,
      },
    ],
    proposedReceiverContributions: [
      {
        inventoryItemId: 'inv-ard-01',
        catalogId: 'arduino-uno',
        name: 'Arduino Uno Rev3 (ATmega328P)',
        quantity: 1,
      },
      {
        inventoryItemId: 'inv-led-5mm-01',
        catalogId: 'led-5mm',
        name: '5mm Diffused LEDs (Red/Green/Yellow)',
        quantity: 3,
      },
      {
        inventoryItemId: 'inv-res-220-01',
        catalogId: 'resistor-220',
        name: '220 Ohm 1/4W Metal Film Resistors',
        quantity: 3,
      },
      {
        inventoryItemId: 'inv-breadboard-01',
        catalogId: 'breadboard-half',
        name: 'Half-Size Solderless Breadboard',
        quantity: 1,
      },
      {
        inventoryItemId: 'inv-jumpers-01',
        catalogId: 'jumper-wires',
        name: 'Male-to-Male Jumper Wire Ribbons',
        quantity: 1,
      },
    ],
    remainingDeficits: [
      {
        catalogId: 'resistor-10k',
        name: '10k Ohm Pull-Down Resistors',
        quantity: 2,
      },
    ],
    suggestedResponsibilities: [
      {
        memberId: 'maker-priya',
        roleDescription: 'Hardware button debouncing & buzzer sound signals',
      },
      {
        memberId: 'maker-adithya',
        roleDescription: 'Arduino millis() microsecond timer logic & state arbiter',
      },
    ],
  },
];

export const SEED_WORKSPACES: ProjectWorkspace[] = [
  {
    id: 'ws-rover-elena-adithya',
    projectId: 'proj-obstacle-robot',
    proposalId: 'prop-rover-accepted-00',
    memberIds: ['maker-adithya', 'maker-elena'],
    memberRoles: {
      'maker-adithya': 'Sensors & ultrasonic radar turret code',
      'maker-elena': 'Motor driver wiring & chassis mechanical drive',
    },
    status: 'active',
    createdAt: '2026-10-02T15:00:00Z',
    reservations: [
      {
        id: 'res-adithya-uno',
        workspaceId: 'ws-rover-elena-adithya',
        inventoryItemId: 'inv-ard-01',
        ownerId: 'maker-adithya',
        catalogId: 'arduino-uno',
        name: 'Arduino Uno Rev3 (ATmega328P)',
        quantity: 1,
        reservedAt: '2026-10-02T15:00:00Z',
        status: 'active',
      },
      {
        id: 'res-adithya-sonar',
        workspaceId: 'ws-rover-elena-adithya',
        inventoryItemId: 'inv-hcsr04-01',
        ownerId: 'maker-adithya',
        catalogId: 'hc-sr04',
        name: 'HC-SR04 Ultrasonic Distance Sensor',
        quantity: 1,
        reservedAt: '2026-10-02T15:00:00Z',
        status: 'active',
      },
      {
        id: 'res-adithya-servo',
        workspaceId: 'ws-rover-elena-adithya',
        inventoryItemId: 'inv-sg90-01',
        ownerId: 'maker-adithya',
        catalogId: 'sg90-servo',
        name: 'TowerPro SG90 9g Micro Servo',
        quantity: 1,
        reservedAt: '2026-10-02T15:00:00Z',
        status: 'active',
      },
      {
        id: 'res-elena-motors',
        workspaceId: 'ws-rover-elena-adithya',
        inventoryItemId: 'inv-elena-motor-01',
        ownerId: 'maker-elena',
        catalogId: 'dc-motor-toy',
        name: '3V-6V Dual Shaft TT Gearbox Motor',
        quantity: 2,
        reservedAt: '2026-10-02T15:00:00Z',
        status: 'active',
      },
      {
        id: 'res-elena-driver',
        workspaceId: 'ws-rover-elena-adithya',
        inventoryItemId: 'inv-elena-driver-01',
        ownerId: 'maker-elena',
        catalogId: 'l298n-driver',
        name: 'L298N Dual H-Bridge Motor Driver Module',
        quantity: 1,
        reservedAt: '2026-10-02T15:00:00Z',
        status: 'active',
      },
    ],
    tasks: [
      {
        id: 'task-rover-01',
        workspaceId: 'ws-rover-elena-adithya',
        title: 'Verify H-Bridge dual motor polarity on test stand',
        description: 'Ensure Left and Right TT motors spin forward together when IN1/IN3 are pulled HIGH.',
        assigneeId: 'maker-elena',
        status: 'done',
        createdAt: '2026-10-02T15:10:00Z',
      },
      {
        id: 'task-rover-02',
        workspaceId: 'ws-rover-elena-adithya',
        title: 'Calibrate ultrasonic servo panning angles',
        description: 'Sweep servo between 45° (left scan), 90° (center), and 135° (right scan).',
        assigneeId: 'maker-adithya',
        status: 'in_progress',
        createdAt: '2026-10-02T15:15:00Z',
      },
      {
        id: 'task-rover-03',
        workspaceId: 'ws-rover-elena-adithya',
        title: 'Implement obstacle escape routine in C++',
        description: 'Halt if obstacle < 20cm, rotate sonar turret, choose direction with largest distance.',
        assigneeId: 'maker-adithya',
        status: 'todo',
        createdAt: '2026-10-02T15:20:00Z',
      },
    ],
    messages: [
      {
        id: 'msg-rover-01',
        workspaceId: 'ws-rover-elena-adithya',
        authorId: 'maker-elena',
        content:
          'Welcome to the rover workspace! I tested the two TT gearbox motors and the L298N driver yesterday—they run smoothly at 6V. Ready whenever you want to test the chassis integration.',
        createdAt: '2026-10-02T15:30:00Z',
      },
      {
        id: 'msg-rover-02',
        workspaceId: 'maker-adithya',
        authorId: 'maker-adithya',
        content:
          'Great! I have the Arduino Uno and HC-SR04 sonar sensor mounted on the SG90 micro servo. Working on the radar sweep sketch right now.',
        createdAt: '2026-10-02T16:00:00Z',
      },
    ],
    mentorRequestIds: ['req-mentor-rover-vance'],
  },
];

export const SEED_MENTOR_REQUESTS: MentorshipRequest[] = [
  {
    id: 'req-mentor-rover-vance',
    requesterId: 'maker-adithya',
    mentorId: 'maker-vance',
    projectId: 'proj-obstacle-robot',
    workspaceId: 'ws-rover-elena-adithya',
    helpCategory: 'understanding-circuit',
    question:
      'How should we isolate the 9V motor battery pack noise from resetting the Arduino Uno during sudden motor stalls?',
    currentStage:
      'Chassis wired; Arduino occasionally resets when motors spin up from standstill.',
    relevantComponents: [
      'Arduino Uno',
      'L298N Dual H-Bridge Motor Driver',
      '3V-6V Dual Shaft TT Gearbox Motor',
    ],
    notesOrCode:
      '// Both Arduino 5V and L298N 5V are currently shared. We suspect back-EMF voltage dip is triggering brownout reset.',
    status: 'accepted',
    createdAt: '2026-10-02T17:00:00Z',
    responses: [
      {
        id: 'resp-vance-01',
        authorId: 'maker-vance',
        content:
          'Classic motor brownout issue! Do not power the Arduino 5V pin from the motor battery directly. Connect your battery (7.2V–9V) to the L298N 12V terminal, keep the L298N 5V jumper ON to power the logic chips, and tie the motor GND to the Arduino GND. Place a 100µF or 220µF electrolytic capacitor across the motor driver input terminals to absorb inductive kickback.',
        createdAt: '2026-10-02T19:30:00Z',
      },
    ],
  },
];
