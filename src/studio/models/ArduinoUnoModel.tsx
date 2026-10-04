/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { PinEndpoint } from '../types';

interface ArduinoUnoModelProps {
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

export function ArduinoUnoModel({
  position = [2.5, 0, 0],
  rotation = [0, 0, 0],
  isSelected = false,
  isStepActive = true,
  highlightPinIds = [],
  activePins = [],
  onSelectComponent,
  onHoverPin,
  onSelectPin,
}: ArduinoUnoModelProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  // PCB Dimensions (Standard Arduino Uno: ~68.6mm x 53.4mm, scaled in scene)
  const pcbWidth = 2.4;
  const pcbHeight = 0.1;
  const pcbLength = 3.6;

  return (
    <group
      ref={groupRef}
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
      {/* Selection / Hover Glow Ring */}
      {(isSelected || hovered) && (
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.2, 32]} />
          <meshBasicMaterial
            color={isSelected ? '#087F83' : '#38BDF8'}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Main PCB Board (Authentic Arduino Cyan/Teal Blue) */}
      <mesh position={[0, pcbHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[pcbWidth, pcbHeight, pcbLength]} />
        <meshStandardMaterial
          color={isSelected ? '#0e7490' : '#0284c7'}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* Silkscreen decorative stripes & text plate */}
      <mesh position={[0, pcbHeight + 0.005, 0]}>
        <planeGeometry args={[pcbWidth * 0.9, pcbLength * 0.85]} />
        <meshBasicMaterial
          color="#0369a1"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* USB Type-B Female Connector (Silver metal box at rear left) */}
      <mesh position={[-0.7, 0.4, -1.5]} castShadow>
        <boxGeometry args={[0.55, 0.45, 0.7]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[-0.7, 0.4, -1.86]}>
        <boxGeometry args={[0.3, 0.25, 0.05]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* DC Power Barrel Jack (Black cylinder at rear right) */}
      <mesh position={[0.7, 0.4, -1.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.65, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[0.7, 0.4, -1.74]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>

      {/* ATmega328P DIP-28 Microcontroller IC Package */}
      <mesh position={[0.15, 0.2, 0.3]} castShadow>
        <boxGeometry args={[0.45, 0.18, 1.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      {/* IC Notch */}
      <mesh position={[0.15, 0.29, -0.38]}>
        <cylinderGeometry args={[0.06, 0.06, 0.05, 8]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* 16MHz Crystal Oscillator (Silver Oval Can) */}
      <mesh position={[-0.3, 0.18, -0.7]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.18, 0.15, 0.45]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Reset Push Button (Small red button) */}
      <mesh position={[-0.8, 0.18, -0.7]}>
        <boxGeometry args={[0.2, 0.14, 0.2]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[-0.8, 0.28, -0.7]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 12]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </mesh>

      {/* Voltage Linear Regulator (TO-220 style with silver tab) */}
      <mesh position={[0.1, 0.22, -1.3]}>
        <boxGeometry args={[0.3, 0.2, 0.25]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.1, 0.25, -1.45]}>
        <boxGeometry args={[0.28, 0.12, 0.05]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>

      {/* Status LEDs (ON, L, TX, RX) */}
      {/* ON LED (Green) */}
      <mesh position={[0.7, 0.12, 0.6]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#15803d" emissiveIntensity={0.6} />
      </mesh>
      {/* L Pin 13 LED (Amber) */}
      <mesh position={[-0.4, 0.12, 0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.4} />
      </mesh>

      {/* Top Digital Header Strip (Pins D0 - D13 + GND + AREF) */}
      <mesh position={[-0.95, 0.25, 0.5]} castShadow>
        <boxGeometry args={[0.25, 0.3, 2.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Bottom Power & Analog Header Strips */}
      <mesh position={[0.95, 0.25, -0.5]} castShadow>
        <boxGeometry args={[0.25, 0.3, 1.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      <mesh position={[0.95, 0.25, 1.1]} castShadow>
        <boxGeometry args={[0.25, 0.3, 1.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Pin Endpoint Interactive Markers */}
      {activePins.map((pin) => {
        const isHighlighted = highlightPinIds.includes(pin.id);
        const pinX = pin.position[0] - position[0];
        const pinY = pin.position[1] - position[1];
        const pinZ = pin.position[2] - position[2];

        const pinColor =
          pin.signalType === 'power-5v'
            ? '#ef4444'
            : pin.signalType === 'ground'
            ? '#1e293b'
            : pin.signalType === 'pwm'
            ? '#f97316'
            : '#10b981';

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
            {/* Metal header socket hole */}
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
            </mesh>

            {/* Glowing Interactive Endpoint Orb */}
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[isHighlighted ? 0.09 : 0.06, 12, 12]} />
              <meshStandardMaterial
                color={pinColor}
                emissive={pinColor}
                emissiveIntensity={isHighlighted ? 1.0 : 0.4}
                roughness={0.2}
              />
            </mesh>

            {/* Pulsing highlight aura if currently in active step */}
            {isHighlighted && (
              <mesh position={[0, 0.08, 0]}>
                <sphereGeometry args={[0.14, 12, 12]} />
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
