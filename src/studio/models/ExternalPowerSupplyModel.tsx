/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as THREE from 'three';
import { PinEndpoint } from '../types';

interface ExternalPowerSupplyModelProps {
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

export function ExternalPowerSupplyModel({
  position = [-0.6, 0, -2.2],
  rotation = [0, 0, 0],
  isSelected = false,
  isStepActive = true,
  highlightPinIds = [],
  activePins = [],
  onSelectComponent,
  onHoverPin,
  onSelectPin,
}: ExternalPowerSupplyModelProps) {
  const [hovered, setHovered] = useState(false);

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
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[1.4, 0.8, 1.2]} />
          <meshBasicMaterial
            color={isSelected ? '#087F83' : '#38BDF8'}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Main Power Supply Body (Matte Slate Gray Box) */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.5, 0.9]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Power Supply Label Banner */}
      <mesh position={[0, 0.505, 0]}>
        <planeGeometry args={[1.0, 0.6]} />
        <meshStandardMaterial color="#334155" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Green 5V Power Active LED */}
      <mesh position={[-0.4, 0.52, 0.25]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#15803d"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Screw Terminal Block (Dual terminal: Red +5V Ext and Black GND) */}
      <mesh position={[0.25, 0.4, 0]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.6]} />
        <meshStandardMaterial color="#047857" roughness={0.5} />
      </mesh>
      {/* Screw head 1 */}
      <mesh position={[0.25, 0.56, -0.15]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      {/* Screw head 2 */}
      <mesh position={[0.25, 0.56, 0.15]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>

      {/* Pin Endpoint Interactive Markers */}
      {activePins.map((pin) => {
        const isHighlighted = highlightPinIds.includes(pin.id);
        const pinColor =
          pin.signalType === 'power-ext-5v' ? '#ef4444' : '#1e293b';

        const offsetZ = pin.id === 'ext-pwr-vcc' ? -0.2 : 0.1;

        return (
          <group
            key={pin.id}
            position={[0, 0.45, offsetZ]}
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
            {/* Metal terminal lead */}
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
            </mesh>

            {/* Glowing endpoint marker */}
            <mesh position={[0, 0.05, 0]}>
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
