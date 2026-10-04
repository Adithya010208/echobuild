/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { BenchLightingAndEnvironment } from './BenchLightingAndEnvironment';
import { CameraController } from './CameraController';
import { ArduinoUnoModel } from '../models/ArduinoUnoModel';
import { BreadboardModel } from '../models/BreadboardModel';
import { SG90ServoModel } from '../models/SG90ServoModel';
import { HCSR04Model } from '../models/HCSR04Model';
import { DustbinModel } from '../models/DustbinModel';
import { VirtualHandModel } from '../models/VirtualHandModel';
import { ExternalPowerSupplyModel } from '../models/ExternalPowerSupplyModel';
import { ConnectionRenderer } from '../models/ConnectionRenderer';
import {
  StudioComponentSpec,
  WireConnection,
  AssemblyStep,
  PinEndpoint,
  BehaviorSimulationState,
} from '../types';

interface StudioCanvasProps {
  currentStep: AssemblyStep;
  components: StudioComponentSpec[];
  wires: WireConnection[];
  pins: PinEndpoint[];
  simulationState: BehaviorSimulationState;
  selectedComponentId: string | null;
  highlightWireId: string | null;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  onSelectComponent: (componentId: string | null) => void;
  onHoverPin: (pin: PinEndpoint | null) => void;
  onSelectPin: (pin: PinEndpoint) => void;
  onHoverWire: (wire: WireConnection | null) => void;
  onSelectWire: (wire: WireConnection) => void;
  onDistanceChange?: (dist: number) => void;
}

export function StudioCanvas({
  currentStep,
  components,
  wires,
  pins,
  simulationState,
  selectedComponentId,
  highlightWireId,
  cameraPosition,
  cameraTarget,
  onSelectComponent,
  onHoverPin,
  onSelectPin,
  onHoverWire,
  onSelectWire,
  onDistanceChange,
}: StudioCanvasProps) {
  const isSimulationStep = currentStep.stepNumber === 6 || simulationState.isSimulating;

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        onPointerMissed={() => onSelectComponent(null)}
      >
        <Suspense fallback={null}>
          <BenchLightingAndEnvironment />
          <CameraController
            targetPosition={cameraPosition}
            targetLookAt={cameraTarget}
          />

          {/* Dustbin Model (with hinged lid synchronized to simulation state) */}
          <DustbinModel
            position={[-4.2, 0, 0]}
            lidOpenProgress={simulationState.lidOpenProgress}
            isSelected={selectedComponentId === 'comp-dustbin'}
            onSelectComponent={() => onSelectComponent('comp-dustbin')}
          />

          {/* Arduino Uno Board */}
          <ArduinoUnoModel
            position={[2.5, 0, 0]}
            isSelected={selectedComponentId === 'comp-arduino'}
            isStepActive={currentStep.activeComponentIds.includes('comp-arduino')}
            highlightPinIds={currentStep.highlightPinIds}
            activePins={pins.filter((p) => p.componentId === 'comp-arduino')}
            onSelectComponent={() => onSelectComponent('comp-arduino')}
            onHoverPin={onHoverPin}
            onSelectPin={onSelectPin}
          />

          {/* Half-Size Breadboard */}
          <BreadboardModel
            position={[0.2, 0, 0]}
            isSelected={selectedComponentId === 'comp-breadboard'}
            isStepActive={currentStep.activeComponentIds.includes('comp-breadboard')}
            highlightPinIds={currentStep.highlightPinIds}
            activePins={pins.filter((p) => p.componentId === 'comp-breadboard')}
            onSelectComponent={() => onSelectComponent('comp-breadboard')}
            onHoverPin={onHoverPin}
            onSelectPin={onSelectPin}
          />

          {/* Dedicated External Regulated 5V Servo Power Supply */}
          <ExternalPowerSupplyModel
            position={[-0.6, 0, -2.2]}
            isSelected={selectedComponentId === 'comp-ext-power'}
            isStepActive={currentStep.activeComponentIds.includes('comp-ext-power')}
            highlightPinIds={currentStep.highlightPinIds}
            activePins={pins.filter((p) => p.componentId === 'comp-ext-power')}
            onSelectComponent={() => onSelectComponent('comp-ext-power')}
            onHoverPin={onHoverPin}
            onSelectPin={onSelectPin}
          />

          {/* SG90 Micro Servo (with rotating horn synchronized to servoAngleDegrees) */}
          <SG90ServoModel
            position={[-3.8, 4.8, -1.5]}
            servoAngleDegrees={simulationState.servoAngleDegrees}
            isSelected={selectedComponentId === 'comp-servo'}
            isStepActive={currentStep.activeComponentIds.includes('comp-servo')}
            highlightPinIds={currentStep.highlightPinIds}
            activePins={pins.filter((p) => p.componentId === 'comp-servo')}
            onSelectComponent={() => onSelectComponent('comp-servo')}
            onHoverPin={onHoverPin}
            onSelectPin={onSelectPin}
          />

          {/* HC-SR04 Ultrasonic Distance Sensor */}
          <HCSR04Model
            position={[-3.8, 3.2, 3.7]}
            isSelected={selectedComponentId === 'comp-sonar'}
            isStepActive={currentStep.activeComponentIds.includes('comp-sonar')}
            isSimulating={isSimulationStep}
            isTriggered={simulationState.isTriggered}
            obstacleDistanceCm={simulationState.obstacleDistanceCm}
            highlightPinIds={currentStep.highlightPinIds}
            activePins={pins.filter((p) => p.componentId === 'comp-sonar')}
            onSelectComponent={() => onSelectComponent('comp-sonar')}
            onHoverPin={onHoverPin}
            onSelectPin={onSelectPin}
          />

          {/* Virtual Hand / Obstacle (Visible during live simulation step) */}
          {isSimulationStep && (
            <VirtualHandModel
              distanceCm={simulationState.obstacleDistanceCm}
              isTriggered={simulationState.isTriggered}
              onDistanceChange={onDistanceChange}
            />
          )}

          {/* 3D Catmull-Rom Curved Jumper Wires */}
          <ConnectionRenderer
            wires={wires}
            pins={pins}
            activeWireIds={currentStep.activeWireIds}
            isSimulating={isSimulationStep}
            highlightWireId={highlightWireId}
            onHoverWire={onHoverWire}
            onSelectWire={onSelectWire}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
