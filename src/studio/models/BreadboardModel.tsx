/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as THREE from 'three';
import { PinEndpoint } from '../types';

interface BreadboardModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  isSelected?: boolean;
  isStepActive?: boolean;
  highlightPinIds?: string[];
  activePins?: PinEndpoint[];
  onSelectComponent?: () => void;
  onHoverPin?: (pin: PinEndpoint | null) => void;
  onSelectPin?: (pin: PinEndpoint) => void;
}

export function BreadboardModel({
  position = [0.2, 0, 0],
  rotation = [0, 0, 0],
  isSelected = false,
  isStepActive = true,
  highlightPinIds = [],
  activePins = [],
  onSelectComponent,
  onHoverPin,
  onSelectPin,
}: BreadboardModelProps) {
  const [hovered, setHovered] = useState(false);

  // Breadboard dimensions (~85mm x 55mm x 9mm)
  const bbWidth = 1.6;
  const bbHeight = 0.22;
  const bbLength = 5.2;

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
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[bbWidth * 1.15, bbLength * 1.05]} />
          <meshBasicMaterial
            color={isSelected ? '#087F83' : '#38BDF8'}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Main Off-White Breadboard Body */}
      <mesh position={[0, bbHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[bbWidth, bbHeight, bbLength]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* Center Dividing Valley Channel */}
      <mesh position={[0, bbHeight - 0.02, 0]}>
        <boxGeometry args={[0.15, 0.06, bbLength * 0.94]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
      </mesh>

      {/* Left Power Rail Red (+) Line */}
      <mesh position={[-bbWidth / 2 + 0.16, bbHeight + 0.005, 0]}>
        <planeGeometry args={[0.04, bbLength * 0.92]} />
        <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} />
      </mesh>

      {/* Left Ground Rail Blue (-) Line */}
      <mesh position={[-bbWidth / 2 + 0.28, bbHeight + 0.005, 0]}>
        <planeGeometry args={[0.04, bbLength * 0.92]} />
        <meshBasicMaterial color="#0284c7" side={THREE.DoubleSide} />
      </mesh>

      {/* Right Ground Rail Blue (-) Line */}
      <mesh position={[bbWidth / 2 - 0.28, bbHeight + 0.005, 0]}>
        <planeGeometry args={[0.04, bbLength * 0.92]} />
        <meshBasicMaterial color="#0284c7" side={THREE.DoubleSide} />
      </mesh>

      {/* Right Power Rail Red (+) Line */}
      <mesh position={[bbWidth / 2 - 0.16, bbHeight + 0.005, 0]}>
        <planeGeometry args={[0.04, bbLength * 0.92]} />
        <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} />
      </mesh>

      {/* Breadboard Row Pin Grid Texture Plates */}
      <mesh position={[-0.26, bbHeight + 0.004, 0]}>
        <planeGeometry args={[0.32, bbLength * 0.88]} />
        <meshBasicMaterial color="#e2e8f0" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.26, bbHeight + 0.004, 0]}>
        <planeGeometry args={[0.32, bbLength * 0.88]} />
        <meshBasicMaterial color="#e2e8f0" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Pin Endpoint Interactive Markers */}
      {activePins.map((pin) => {
        const isHighlighted = highlightPinIds.includes(pin.id);
        const pinX = pin.position[0] - position[0];
        const pinY = pin.position[1] - position[1];
        const pinZ = pin.position[2] - position[2];

        const pinColor =
          pin.signalType === 'power-5v' ? '#ef4444' : '#1e293b';

        return (
          <group
            key={pin.id}
            position={[pinX, pinY, pinZ]}
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
            {/* Terminal socket clip hole */}
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>

            {/* Glowing Interactive Endpoint Orb */}
            <mesh position={[0, 0.06, 0]}>
              <sphereGeometry args={[isHighlighted ? 0.09 : 0.06, 12, 12]} />
              <meshStandardMaterial
                color={pinColor}
                emissive={pinColor}
                emissiveIntensity={isHighlighted ? 1.0 : 0.4}
              />
            </mesh>

            {isHighlighted && (
              <mesh position={[0, 0.06, 0]}>
                <sphereGeometry args={[0.13, 12, 12]} />
                <meshBasicMaterial
                  color={pinColor}
                  transparent
                  opacity={0.35}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
