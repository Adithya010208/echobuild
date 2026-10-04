/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PinEndpoint } from '../types';

interface HCSR04ModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  isSelected?: boolean;
  isStepActive?: boolean;
  isSimulating?: boolean;
  isTriggered?: boolean;
  obstacleDistanceCm?: number;
  highlightPinIds?: string[];
  activePins?: PinEndpoint[];
  onSelectComponent?: () => void;
  onHoverPin?: (pin: PinEndpoint | null) => void;
  onSelectPin?: (pin: PinEndpoint) => void;
}

export function HCSR04Model({
  position = [-3.8, 3.2, 3.7],
  rotation = [0, Math.PI / 2, 0],
  isSelected = false,
  isStepActive = true,
  isSimulating = false,
  isTriggered = false,
  obstacleDistanceCm = 25,
  highlightPinIds = [],
  activePins = [],
  onSelectComponent,
  onHoverPin,
  onSelectPin,
}: HCSR04ModelProps) {
  const [hovered, setHovered] = useState(false);
  const waveRef = useRef<THREE.Group>(null);
  const waveScaleRef = useRef(0.2);

  // Animated ultrasonic acoustic wave pulse
  useFrame((_, delta) => {
    if (waveRef.current && isSimulating) {
      waveScaleRef.current += delta * (isTriggered ? 2.5 : 1.2);
      if (waveScaleRef.current > 1.8) {
        waveScaleRef.current = 0.2;
      }
      waveRef.current.scale.set(
        waveScaleRef.current,
        waveScaleRef.current,
        waveScaleRef.current
      );
    }
  });

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
      {/* Selection Glow Indicator */}
      {(isSelected || hovered) && (
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[1.8, 1.0, 0.1]} />
          <meshBasicMaterial
            color={isSelected ? '#087F83' : '#38BDF8'}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Blue Sensor PCB (Approx 45mm x 20mm scale) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.7, 0.08]} />
        <meshStandardMaterial
          color={isSelected ? '#1d4ed8' : '#2563eb'}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Silkscreen text banner */}
      <mesh position={[0, 0.22, 0.045]}>
        <planeGeometry args={[1.3, 0.12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>

      {/* Left Ultrasonic Transducer Cylinder (Transmitter 'T') */}
      <group position={[-0.45, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Metal canister cylinder */}
        <mesh castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.65, 24]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
        {/* Front black grill ring */}
        <mesh position={[0, 0.33, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Center speaker cone */}
        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.08, 0.16, 0.03, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>

      {/* Right Ultrasonic Transducer Cylinder (Receiver 'R') */}
      <group position={[0.45, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.65, 24]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0, 0.33, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.08, 0.16, 0.03, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>

      {/* Central 10MHz oscillator crystal */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[0.15, 0.25, 0.06]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Acoustic Wave Visualizer (Active in simulation) */}
      {isSimulating && (
        <group ref={waveRef} position={[0, 0, 0.7]}>
          {/* Concentric spherical sonar sound wavefronts */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.58, 24]} />
            <meshBasicMaterial
              color={isTriggered ? '#10b981' : '#0ea5e9'}
              transparent
              opacity={isTriggered ? 0.7 : 0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 0.88, 24]} />
            <meshBasicMaterial
              color={isTriggered ? '#10b981' : '#0ea5e9'}
              transparent
              opacity={isTriggered ? 0.5 : 0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Downward 4-Pin Male Header (VCC, Trig, Echo, GND) */}
      <mesh position={[0, -0.38, 0]} castShadow>
        <boxGeometry args={[0.6, 0.08, 0.08]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Pin Endpoint Interactive Markers */}
      {activePins.map((pin) => {
        const isHighlighted = highlightPinIds.includes(pin.id);
        const pinColor =
          pin.signalType === 'power-5v'
            ? '#ef4444'
            : pin.signalType === 'ground'
            ? '#1e293b'
            : pin.signalType === 'digital-out'
            ? '#10b981'
            : '#0ea5e9';

        // Pin offset along X (-0.225 to +0.225)
        const localX =
          pin.id === 'sonar-vcc'
            ? -0.22
            : pin.id === 'sonar-trig'
            ? -0.07
            : pin.id === 'sonar-echo'
            ? 0.07
            : 0.22;

        return (
          <group
            key={pin.id}
            position={[localX, -0.48, 0]}
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
            {/* Gold pin lead */}
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} />
            </mesh>

            {/* Glowing endpoint marker */}
            <mesh position={[0, -0.04, 0]}>
              <sphereGeometry args={[isHighlighted ? 0.08 : 0.05, 12, 12]} />
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
