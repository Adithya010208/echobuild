/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import * as THREE from 'three';
import { WireConnection, PinEndpoint } from '../types';

interface ConnectionRendererProps {
  wires: WireConnection[];
  pins: PinEndpoint[];
  activeWireIds: string[];
  isSimulating?: boolean;
  highlightWireId?: string | null;
  onHoverWire?: (wire: WireConnection | null) => void;
  onSelectWire?: (wire: WireConnection) => void;
}

export function ConnectionRenderer({
  wires,
  pins,
  activeWireIds,
  isSimulating = false,
  highlightWireId = null,
  onHoverWire,
  onSelectWire,
}: ConnectionRendererProps) {
  const pinMap = useMemo(() => {
    const map = new Map<string, PinEndpoint>();
    pins.forEach((p) => map.set(p.id, p));
    return map;
  }, [pins]);

  return (
    <group>
      {wires.map((wire) => {
        const isActive = activeWireIds.includes(wire.id);
        if (!isActive) return null;

        const fromPin = pinMap.get(wire.fromPinId);
        const toPin = pinMap.get(wire.toPinId);
        if (!fromPin || !toPin) return null;

        return (
          <SingleWire
            key={wire.id}
            wire={wire}
            fromPin={fromPin}
            toPin={toPin}
            isHighlighted={highlightWireId === wire.id}
            isSimulating={isSimulating}
            onHoverWire={onHoverWire}
            onSelectWire={onSelectWire}
          />
        );
      })}
    </group>
  );
}

interface SingleWireProps {
  wire: WireConnection;
  fromPin: PinEndpoint;
  toPin: PinEndpoint;
  isHighlighted: boolean;
  isSimulating: boolean;
  onHoverWire?: (wire: WireConnection | null) => void;
  onSelectWire?: (wire: WireConnection) => void;
}

function SingleWire({
  wire,
  fromPin,
  toPin,
  isHighlighted,
  isSimulating,
  onHoverWire,
  onSelectWire,
}: SingleWireProps) {
  const [hovered, setHovered] = useState(false);

  // Generate smooth 3D Catmull-Rom curve between pins with graceful arching
  const { geometry, startPos, endPos } = useMemo(() => {
    const p1 = new THREE.Vector3(...fromPin.position);
    const p2 = new THREE.Vector3(...toPin.position);

    // Compute midpoint and add vertical natural wire arch
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const dist = p1.distanceTo(p2);
    const archHeight = Math.max(0.6, dist * 0.25 * (wire.curvature || 0.4));
    mid.y += archHeight;

    // Slight lateral bow for cable bundle realism
    const lateralDir = new THREE.Vector3()
      .crossVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(p2, p1))
      .normalize()
      .multiplyScalar(0.15);
    mid.add(lateralDir);

    const curve = new THREE.CatmullRomCurve3([
      p1,
      new THREE.Vector3(p1.x, p1.y + 0.3, p1.z),
      mid,
      new THREE.Vector3(p2.x, p2.y + 0.3, p2.z),
      p2,
    ]);

    const tubeGeom = new THREE.TubeGeometry(
      curve,
      32,
      isHighlighted || hovered ? 0.045 : 0.03,
      8,
      false
    );

    return { geometry: tubeGeom, startPos: p1, endPos: p2 };
  }, [fromPin.position, toPin.position, wire.curvature, isHighlighted, hovered]);

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHoverWire?.(wire);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHoverWire?.(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelectWire?.(wire);
      }}
    >
      {/* 3D Wire Tube */}
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          color={wire.hexColor}
          emissive={isHighlighted || hovered ? wire.hexColor : '#000000'}
          emissiveIntensity={isHighlighted || hovered ? 0.6 : 0.0}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Terminal Dupont Sleeves (Black connector boots at pin ends) */}
      <mesh position={[startPos.x, startPos.y + 0.15, startPos.z]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      <mesh position={[endPos.x, endPos.y + 0.15, endPos.z]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
    </group>
  );
}
