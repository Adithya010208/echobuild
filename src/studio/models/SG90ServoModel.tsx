/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { PinEndpoint } from '../types';

interface SG90ServoModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  servoAngleDegrees?: number; // 0 to 90 degrees
  isSelected?: boolean;
  isStepActive?: boolean;
  highlightPinIds?: string[];
  activePins?: PinEndpoint[];
  onSelectComponent?: () => void;
  onHoverPin?: (pin: PinEndpoint | null) => void;
  onSelectPin?: (pin: PinEndpoint) => void;
}

export function SG90ServoModel({
  position = [-3.8, 4.8, -1.5],
  rotation = [0, 0, 0],
  servoAngleDegrees = 0,
  isSelected = false,
  isStepActive = true,
  highlightPinIds = [],
  activePins = [],
  onSelectComponent,
  onHoverPin,
  onSelectPin,
}: SG90ServoModelProps) {
  const [hovered, setHovered] = useState(false);
  const hornGroupRef = useRef<THREE.Group>(null);

  // Convert degrees to radians for horn rotation
  const hornAngleRad = (servoAngleDegrees * Math.PI) / 180;

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelectComponent?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Selection Glow */}
      {(isSelected || hovered) && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.6, 1.4, 1.0]} />
          <meshBasicMaterial
            color={isSelected ? '#087F83' : '#38BDF8'}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Main Translucent Blue Plastic Body (~22mm x 12mm x 23mm) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.9, 0.55]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.25}
          metalness={0.1}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Internal Motor Cylindrical Core Visible through casing */}
      <mesh position={[-0.2, -0.05, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.75, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Side Mounting Tabs with Screw Holes */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.5, 0.1, 0.55]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.9} />
      </mesh>
      {/* Left mounting screw hole */}
      <mesh position={[-0.65, 0.15, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      {/* Right mounting screw hole */}
      <mesh position={[0.65, 0.15, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Top Gear Output Tower (stepped cylinder) */}
      <mesh position={[0.28, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.22, 20]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} />
      </mesh>
      {/* Brass Pinion Spline Shaft */}
      <mesh position={[0.28, 0.65, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rotating White Nylon Servo Horn / Arm */}
      <group
        ref={hornGroupRef}
        position={[0.28, 0.72, 0]}
        rotation={[0, hornAngleRad, 0]}
      >
        {/* Central horn collar */}
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Horn Arm Beam (pointing backward toward bin linkage) */}
        <mesh position={[0, 0, -0.42]} castShadow>
          <boxGeometry args={[0.12, 0.05, 0.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Linkage Eyelet Hole at tip of horn */}
        <mesh position={[0, 0.01, -0.76]}>
          <cylinderGeometry args={[0.04, 0.04, 0.07, 8]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {/* Center retaining screw */}
        <mesh position={[0, 0.035, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>

      {/* 3-Wire Ribbon Cable Exit from lower side */}
      <group position={[-0.56, -0.2, 0]}>
        {/* Brown GND Wire */}
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[0.12, 0.06, 0.06]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        {/* Red +5V Wire */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.12, 0.06, 0.06]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Orange PWM Wire */}
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.12, 0.06, 0.06]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      </group>

      {/* Pin Endpoint Interactive Markers */}
      {activePins.map((pin) => {
        const isHighlighted = highlightPinIds.includes(pin.id);
        const pinColor =
          pin.signalType === 'power-5v'
            ? '#ef4444'
            : pin.signalType === 'ground'
            ? '#78350F'
            : '#f97316';

        const offsetZ =
          pin.id === 'servo-vcc'
            ? 0
            : pin.id === 'servo-gnd'
            ? -0.08
            : 0.08;

        return (
          <group
            key={pin.id}
            position={[-0.7, -0.2, offsetZ]}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHoverPin?.(pin);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              onHoverPin?.(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPin?.(pin);
            }}
          >
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[isHighlighted ? 0.09 : 0.06, 12, 12]} />
              <meshStandardMaterial
                color={pinColor}
                emissive={pinColor}
                emissiveIntensity={isHighlighted ? 1.0 : 0.4}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
