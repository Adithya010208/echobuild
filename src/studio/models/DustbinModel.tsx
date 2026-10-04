/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import * as THREE from 'three';

interface DustbinModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  lidOpenProgress?: number; // 0 (closed) to 1 (fully open)
  isSelected?: boolean;
  onSelectComponent?: () => void;
}

export function DustbinModel({
  position = [-4.2, 0, 0],
  rotation = [0, 0, 0],
  lidOpenProgress = 0,
  isSelected = false,
  onSelectComponent,
}: DustbinModelProps) {
  const [hovered, setHovered] = useState(false);
  const lidGroupRef = useRef<THREE.Group>(null);

  // Maximum lid opening angle: 75 degrees in radians (~1.31 rad)
  const maxLidAngleRad = (75 * Math.PI) / 180;
  const currentLidAngleRad = lidOpenProgress * maxLidAngleRad;

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
      {/* Selection Glow Cylinder */}
      {(isSelected || hovered) && (
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[2.25, 2.05, 5.2, 24]} />
          <meshBasicMaterial
            color={isSelected ? '#087F83' : '#38BDF8'}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Main Bin Cylinder Body (Tapered countertop waste container) */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 1.8, 4.8, 32, 1, true]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.4}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bin Interior Bottom Floor */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.78, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Modern Top Rim Collar */}
      <mesh position={[0, 4.8, 0]} castShadow>
        <cylinderGeometry args={[2.08, 2.02, 0.35, 32]} />
        <meshStandardMaterial
          color="#087F83"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Front Collar Sensor Aperture Bracket (Houses HC-SR04 at Z = +2.0) */}
      <group position={[0, 3.2, 1.95]}>
        {/* Bracket bezel frame */}
        <mesh castShadow>
          <boxGeometry args={[1.9, 1.0, 0.25]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Left transducer circular cutout hole */}
        <mesh position={[-0.45, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {/* Right transducer circular cutout hole */}
        <mesh position={[0.45, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Front EcoBuild Recycling Leaf / Touchless Emblem */}
      <mesh position={[0, 1.8, 1.88]}>
        <circleGeometry args={[0.45, 24]} />
        <meshBasicMaterial color="#087F83" />
      </mesh>

      {/* Rear Servo Mounting Cradle Bracket (Behind bin lid hinge at Z = -1.95) */}
      <group position={[0, 4.8, -1.95]}>
        {/* Sturdy cradle clip */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.2, 0.35]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Hinge Pivot Block Left */}
        <mesh position={[-0.85, 0.2, 0.15]}>
          <boxGeometry args={[0.2, 0.3, 0.3]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Hinge Pivot Block Right */}
        <mesh position={[0.85, 0.2, 0.15]}>
          <boxGeometry args={[0.2, 0.3, 0.3]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Hinge Stainless Steel Pivot Axle Pin */}
        <mesh position={[0, 0.25, 0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.9, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      </group>

      {/* Hinged Flap Lid (Rotates on rear pivot axle) */}
      <group
        ref={lidGroupRef}
        position={[0, 5.0, -1.8]}
        rotation={[-currentLidAngleRad, 0, 0]}
      >
        {/* Lid Flap Plate (Spans forward from hinge to front rim) */}
        <mesh position={[0, 0.05, 1.8]} castShadow>
          <cylinderGeometry args={[2.02, 2.02, 0.12, 32]} />
          <meshStandardMaterial
            color="#475569"
            roughness={0.35}
            metalness={0.15}
          />
        </mesh>

        {/* Lid Top Bevel Ring & Handle Grip */}
        <mesh position={[0, 0.15, 1.8]}>
          <cylinderGeometry args={[1.8, 1.9, 0.08, 32]} />
          <meshStandardMaterial color="#087F83" roughness={0.4} />
        </mesh>

        {/* Linkage Horn Receiver Tab on underside of lid */}
        <mesh position={[0.28, -0.15, 0.3]}>
          <boxGeometry args={[0.08, 0.25, 0.15]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
        {/* Eyelet hole */}
        <mesh position={[0.28, -0.22, 0.3]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Mechanical Wire Linkage Pushrod (From SG90 Horn to Lid Eyelet) */}
      {/* Dynamic line connecting servo horn at ~[-3.8+4.2, 4.8+0.72, -1.5-0.42] to lid eyelet */}
      <mesh
        position={[
          0.28,
          4.8 + 0.36 + (lidOpenProgress * 0.4),
          -1.7 + (lidOpenProgress * 0.2),
        ]}
        rotation={[
          -Math.PI / 6 + (lidOpenProgress * 0.35),
          0,
          0,
        ]}
      >
        <cylinderGeometry args={[0.02, 0.02, 0.75, 8]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
