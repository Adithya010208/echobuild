/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as THREE from 'three';

export function BenchLightingAndEnvironment() {
  return (
    <>
      {/* Lighting Rig */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={35}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-8, 10, -8]} intensity={0.5} />
      <hemisphereLight
        args={['#f8fafc', '#94a3b8', 0.4]}
      />

      {/* ESD Anti-Static Maker Workbench Surface */}
      <mesh
        position={[0, -0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Grid Helper (Subtle maker workbench scale grid) */}
      <gridHelper
        args={[24, 24, '#94a3b8', '#cbd5e1']}
        position={[0, 0.002, 0]}
      />
    </>
  );
}
