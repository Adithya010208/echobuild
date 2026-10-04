/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SignalType =
  | 'power-5v'
  | 'power-ext-5v'
  | 'ground'
  | 'pwm'
  | 'digital-out'
  | 'digital-in'
  | 'analog';

export interface PinEndpoint {
  id: string;
  componentId: string;
  name: string;
  label: string;
  signalType: SignalType;
  position: [number, number, number];
  direction?: [number, number, number];
  description: string;
  voltage: string;
}

export interface WireConnection {
  id: string;
  fromPinId: string;
  toPinId: string;
  fromComponentId: string;
  toComponentId: string;
  color: string;
  hexColor: string;
  signalName: string;
  wireGauge?: string;
  stepIntroduced: number;
  curvature?: number;
  midPoints?: [number, number, number][];
  description: string;
}

export interface ComponentElectricalSpecs {
  // Manufacturer-sourced datasheet specifications
  manufacturerSpecs: {
    operatingVoltage: string;
    quiescentCurrent: string;
    logicLevels: string;
    datasheetSource: string;
  };
  // Illustrative animation parameters in model
  animationParameters: {
    simulatedRangeOrAngle: string;
    timingOrPwmPulse: string;
    notes: string;
  };
  // Unknown or variant/clone-dependent values
  variantDependent: {
    stallCurrentRating: string;
    cloneVariations: string;
    unresolvedAssumptions: string;
  };
  cautions: string;
}

export interface StudioComponentSpec {
  id: string;
  catalogId: string;
  name: string;
  category: string;
  description: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
  pins: PinEndpoint[];
  electricalSpecs: ComponentElectricalSpecs;
}

export type CameraPreset =
  | 'overview'
  | 'power-rails'
  | 'servo-mount'
  | 'sensor-front'
  | 'linkage'
  | 'simulation'
  | 'top-down';

export interface AssemblyStep {
  stepNumber: number;
  id: string;
  title: string;
  shortName: string;
  summary: string;
  detailedInstructions: string[];
  activeComponentIds: string[];
  activeWireIds: string[];
  highlightPinIds: string[];
  cameraPreset: CameraPreset;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  safetyWarning?: string;
  checkpointTip?: string;
  powerDesignNote?: string;
  simulationDisclaimer?: string;
}

export interface BuildGuideProgress {
  makerId: string;
  projectId: string;
  recipeVersion: string;
  workspaceId?: string;
  currentStepIndex: number;
  completedStepIndices: number[];
  playbackSpeed: number;
  lastUpdated: string;
  isLearningCompleted?: boolean;
  notes?: string;
}

export interface BehaviorSimulationState {
  obstacleDistanceCm: number;
  isHandApproaching: boolean;
  lidState: 'closed' | 'opening' | 'open' | 'closing';
  lidOpenProgress: number; // 0 to 1
  servoAngleDegrees: number; // 0 to 90
  servoPwmMicroseconds: number;
  isTriggered: boolean;
  triggerTimerSeconds: number;
  sensorPingWave: number;
  isSimulating: boolean;
}
