'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export default function PostFX() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom luminanceThreshold={0.88} luminanceSmoothing={0.25} intensity={0.18} mipmapBlur />
      <Vignette eskil={false} offset={0.2} darkness={0.55} />
    </EffectComposer>
  );
}
