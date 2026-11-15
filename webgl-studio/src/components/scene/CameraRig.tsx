'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getCameraState } from '@/lib/cameraPath';

type CameraRigProps = {
  progressRef: React.MutableRefObject<number>;
  mobileScale?: number;
  fov?: number;
};

export default function CameraRig({ progressRef, mobileScale = 1, fov = 38 }: CameraRigProps) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0.35, 0));
  const currentPos = useRef(new THREE.Vector3(0, 1.05 * mobileScale, 7.0 * mobileScale));

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera && camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, fov]);

  useFrame((_, delta) => {
    const { pos, look } = getCameraState(progressRef.current, mobileScale);
    currentPos.current.set(pos[0], pos[1], pos[2]);
    lookTarget.current.lerp(new THREE.Vector3(look[0], look[1], look[2]), Math.min(1, delta * 4));
    camera.position.lerp(currentPos.current, Math.min(1, delta * 3.2));
    camera.lookAt(lookTarget.current);
  });

  return null;
}
