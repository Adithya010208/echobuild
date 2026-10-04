/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import * as THREE from 'three';

interface VirtualHandModelProps {
  distanceCm: number; // 5 to 50 cm
  isTriggered: boolean;
  onDistanceChange?: (newDist: number) => void;
}

export function VirtualHandModel({
  distanceCm,
  isTriggered,
  onDistanceChange,
}: VirtualHandModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Map 5cm - 50cm to scene coordinates:
  // Sensor front is located at [-3.8, 3.2, 3.7 + 0.35 = 4.05].
  // 5cm -> Z = 4.8
  // 50cm -> Z = 9.5
  const normalizedDist = Math.max(5, Math.min(50, distanceCm));
  const zPos = 4.4 + ((normalizedDist - 5) / 45) * 5.0;

  return (
    <group
      ref={groupRef}
      position={[-3.8, 3.2, zPos]}
      rotation={[0, 0, 0]}
    >
      {/* Hand / Obstacle Paddle Plate */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 2.0, 0.12]} />
        <meshStandardMaterial
          color={isTriggered ? '#10b981' : '#f59e0b'}
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Palm & Fingers outline */}
      <group position={[0, -0.2, 0.08]}>
        {/* Palm */}
        <mesh>
          <boxGeometry args={[1.0, 0.9, 0.04]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Thumb */}
        <mesh position={[-0.6, -0.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.22, 0.45, 0.04]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* 4 Fingers */}
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0.65, 0]}>
            <boxGeometry args={[0.16, 0.55, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Acoustic reflection wave rings on hand surface when triggered */}
      {isTriggered && (
        <mesh position={[0, 0, -0.08]}>
          <ringGeometry args={[0.3, 0.8, 24]} />
          <meshBasicMaterial
            color="#34d399"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Target Crosshair */}
      <mesh position={[0, 0, -0.07]}>
        <ringGeometry args={[0.08, 0.12, 16]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
