'use client';

import { useRef, useMemo, useCallback } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

type CakeProps = {
  /** Enable pointer drag-to-rotate + idle auto-spin. Disable while a scroll tour owns the camera. */
  interactive?: boolean;
  /** Fixed display rotation used when `interactive` is false (radians). */
  fixedRotationY?: number;
  position?: [number, number, number];
  /** Index of the hotspot currently highlighted by the scroll tour, or null. */
  activeHotspot?: number | null;
};

const HOTSPOTS: { pos: [number, number, number]; label: string; desc: string }[] = [
  { pos: [1.4, 0.3, 0.6], label: 'Biscuit croustillant', desc: 'Dacquoise noisette, croustillant praliné' },
  { pos: [-1.0, 0.88, 0.75], label: 'Cœur framboise', desc: 'Insert framboise fraîche, mousse légère' },
  { pos: [0.55, 1.62, 0.55], label: 'Glaçage miroir', desc: 'Glaçage brillant, feuille d’or véritable' },
];

const RASPBERRY = '#9C2E46';
const RASPBERRY_DEEP = '#6E1F33';
const CREAM = '#FBF3E4';
const GLAZE = '#5A1620';
const GOLD = '#D8B35E';
const STAND = '#EDEAE3';

export default function Cake({
  interactive = true,
  fixedRotationY = 0.5,
  position = [0, 0, 0],
  activeHotspot = null,
}: CakeProps) {
  const group = useRef<THREE.Group>(null);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const idleTimer = useRef(0);
  const rotationY = useRef(fixedRotationY);

  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    (e.target as unknown as { setPointerCapture: (id: number) => void })?.setPointerCapture?.(e.pointerId);
    dragging.current = true;
    lastX.current = e.clientX;
    idleTimer.current = 0;
  }, [interactive]);

  const onPointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!interactive || !dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    const delta = dx * 0.008;
    rotationY.current += delta;
    velocity.current = delta;
  }, [interactive]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;

    if (!interactive) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, fixedRotationY, 4, delta);
      return;
    }

    if (dragging.current) {
      group.current.rotation.y = rotationY.current;
      idleTimer.current = 0;
    } else {
      // momentum decay after release
      if (Math.abs(velocity.current) > 0.0001) {
        rotationY.current += velocity.current;
        velocity.current *= 0.92;
        group.current.rotation.y = rotationY.current;
      } else {
        idleTimer.current += delta;
        if (idleTimer.current > 1.2) {
          rotationY.current += delta * 0.12;
          group.current.rotation.y = rotationY.current;
        }
      }
    }
  });

  const driplets = useMemo(() => {
    const count = 14;
    return new Array(count).fill(0).map((_, i) => {
      const a = (i / count) * Math.PI * 2;
      const r = 0.74;
      const lenJitter = 0.1 + Math.sin(i * 12.9) * 0.05 + 0.08;
      return {
        pos: [Math.cos(a) * r, 1.18 - lenJitter / 2, Math.sin(a) * r] as [number, number, number],
        len: 0.16 + Math.abs(Math.sin(i * 7.3)) * 0.14,
      };
    });
  }, []);

  const berries = useMemo(() => {
    const count = 7;
    return new Array(count).fill(0).map((_, i) => {
      const a = (i / count) * Math.PI * 2 + 0.3;
      const r = 0.3 + (i % 2) * 0.08;
      return [Math.cos(a) * r, 1.62, Math.sin(a) * r] as [number, number, number];
    });
  }, []);

  return (
    <group
      ref={group}
      position={position}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
    >
      {/* Stand */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <cylinderGeometry args={[2.1, 2.3, 0.12, 64]} />
        <meshPhysicalMaterial color={STAND} roughness={0.55} metalness={0} clearcoat={0} />
      </mesh>

      {/* Base tier */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.55, 1.6, 0.6, 72]} />
        <meshStandardMaterial color={CREAM} roughness={0.55} metalness={0} />
      </mesh>
      <mesh position={[0, 0.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.56, 0.045, 12, 72]} />
        <meshStandardMaterial color={CREAM} roughness={0.5} />
      </mesh>

      {/* Middle tier */}
      <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.08, 1.14, 0.56, 64]} />
        <meshPhysicalMaterial color={RASPBERRY} roughness={0.35} clearcoat={0.4} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0, 1.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.09, 0.04, 12, 64]} />
        <meshStandardMaterial color={CREAM} roughness={0.5} />
      </mesh>

      {/* Top tier (mirror glaze) */}
      <mesh position={[0, 1.42, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.78, 0.82, 0.48, 64]} />
        <meshPhysicalMaterial
          color={GLAZE}
          roughness={0.38}
          metalness={0.02}
          clearcoat={0.35}
          clearcoatRoughness={0.4}
          reflectivity={0.3}
        />
      </mesh>
      <mesh position={[0, 1.655, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.02, 64]} />
        <meshPhysicalMaterial
          color={GLAZE}
          roughness={0.32}
          clearcoat={0.4}
          clearcoatRoughness={0.35}
        />
      </mesh>

      {/* Glaze driplets around top tier */}
      {driplets.map((d, i) => (
        <mesh key={i} position={d.pos} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.045, d.len, 10]} />
          <meshPhysicalMaterial color={GLAZE} roughness={0.35} clearcoat={0.35} clearcoatRoughness={0.4} />
        </mesh>
      ))}

      {/* Gold leaf accent */}
      <mesh position={[0.15, 1.7, -0.1]} rotation={[0.3, 0.6, 0.1]} scale={[1, 1, 0.08]}>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} />
      </mesh>

      {/* Berries */}
      {berries.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshPhysicalMaterial color={RASPBERRY_DEEP} roughness={0.25} clearcoat={0.8} />
        </mesh>
      ))}

      {/* Hotspots — follow the cake's own transform, so they stay pinned to the mesh */}
      {HOTSPOTS.map((h, i) => (
        <Html key={i} position={h.pos} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className="flex items-center gap-2 transition-opacity duration-500"
            style={{ opacity: activeHotspot === i ? 1 : 0 }}
          >
            <span className="hotspot-dot shrink-0" />
            <div className="w-[150px] rounded-sm bg-cocoa2/90 px-3 py-1.5 text-left backdrop-blur-sm sm:w-[190px]">
              <div className="font-serif text-[0.72rem] italic leading-tight text-goldLight sm:text-[0.78rem]">{h.label}</div>
              <div className="mt-0.5 text-[0.58rem] leading-snug tracking-wide text-cream/70 sm:text-[0.62rem]">{h.desc}</div>
            </div>
          </div>
        </Html>
      ))}
    </group>
  );
}
