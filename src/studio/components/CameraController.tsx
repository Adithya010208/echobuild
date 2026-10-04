/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

interface CameraControllerProps {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
}

export function CameraController({
  targetPosition,
  targetLookAt,
}: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const desiredPos = useRef(new THREE.Vector3(...targetPosition));
  const desiredLook = useRef(new THREE.Vector3(...targetLookAt));
  const isTransitioning = useRef(true);

  useEffect(() => {
    desiredPos.current.set(...targetPosition);
    desiredLook.current.set(...targetLookAt);
    isTransitioning.current = true;
  }, [targetPosition, targetLookAt]);

  // Smooth camera interpolation towards desired viewpoint
  useFrame((_, delta) => {
    if (isTransitioning.current && controlsRef.current) {
      const step = Math.min(1, delta * 3.5);
      camera.position.lerp(desiredPos.current, step);
      controlsRef.current.target.lerp(desiredLook.current, step);
      controlsRef.current.update();

      if (
        camera.position.distanceTo(desiredPos.current) < 0.05 &&
        controlsRef.current.target.distanceTo(desiredLook.current) < 0.05
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={2.5}
      maxDistance={22}
      maxPolarAngle={Math.PI / 2 - 0.02} // Prevent camera dipping below the bench
      rotateSpeed={0.8}
      panSpeed={0.8}
      zoomSpeed={0.9}
    />
  );
}
