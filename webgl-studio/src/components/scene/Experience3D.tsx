'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Html } from '@react-three/drei';
import dynamic from 'next/dynamic';
import Cake from './Cake';
import CameraRig from './CameraRig';
import { ensureGsap } from '@/lib/gsapConfig';
import { getActiveHotspot } from '@/lib/cameraPath';
import { useIsMobile } from '@/lib/useIsMobile';

const PostFX = dynamic(() => import('./PostFX'), { ssr: false });

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function rangeOpacity(p: number, start: number, peakStart: number, peakEnd: number, end: number) {
  if (p <= start || p >= end) return 0;
  if (p >= peakStart && p <= peakEnd) return 1;
  if (p < peakStart) return clamp01((p - start) / (peakStart - start || 1));
  return clamp01((end - p) / (end - peakEnd || 1));
}

export default function Experience3D() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const stepRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const railRefs = [useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null)];

  const progressRef = useRef(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const activeHotspotRef = useRef<number | null>(null);
  const [isHeroPhase, setIsHeroPhase] = useState(true);
  const isHeroPhaseRef = useRef(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    if (!wrapperRef.current || !stickyRef.current) return;

    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      pin: stickyRef.current,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;

        if (heroTextRef.current) heroTextRef.current.style.opacity = String(rangeOpacity(p, 0, 0, 0.05, 0.14));
        if (hintRef.current) hintRef.current.style.opacity = String(rangeOpacity(p, 0, 0, 0.04, 0.1));

        const ranges: [number, number, number, number][] = [
          [0.17, 0.23, 0.39, 0.45],
          [0.47, 0.53, 0.63, 0.69],
          [0.69, 0.75, 0.85, 0.91],
        ];
        ranges.forEach(([s, ps, pe, e], i) => {
          const el = stepRefs[i].current;
          if (el) el.style.opacity = String(rangeOpacity(p, s, ps, pe, e));
        });

        const idx = p < 0.15 ? -1 : getActiveHotspot(p) ?? -1;
        railRefs.forEach((r, i) => {
          if (r.current) r.current.style.backgroundColor = i === idx + 1 ? '#D8B35E' : 'rgba(255,255,255,0.25)';
        });

        const hs = getActiveHotspot(p);
        if (hs !== activeHotspotRef.current) {
          activeHotspotRef.current = hs;
          setActiveHotspot(hs);
        }

        const heroPhase = p < 0.12;
        if (heroPhase !== isHeroPhaseRef.current) {
          isHeroPhaseRef.current = heroPhase;
          setIsHeroPhase(heroPhase);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[520vh] bg-cocoa2">
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas
          shadows={!isMobile}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          camera={{ position: [0, 1.05, 7.0], fov: 38 }}
          className="absolute inset-0"
        >
          <color attach="background" args={['#1C110F']} />
          <fog attach="fog" args={['#1C110F', 8, 16]} />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[3, 5, 3]}
            intensity={1.1}
            castShadow={!isMobile}
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#E6C878" />
          <pointLight position={[0, 2.4, 2.4]} intensity={0.25} color="#fff2e0" />

          <Suspense fallback={null}>
            <Environment preset="apartment" environmentIntensity={0.18} />
            <Cake
              interactive={isHeroPhase}
              activeHotspot={activeHotspot}
              position={[0, -0.6, 0]}
            />
            <ContactShadows position={[0, -0.62, 0]} opacity={0.55} scale={6} blur={2.4} far={2} />
          </Suspense>

          <CameraRig progressRef={progressRef} mobileScale={isMobile ? 1.5 : 1} fov={isMobile ? 50 : 38} />
          {!isMobile && <PostFX />}
        </Canvas>

        {/* Hero overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-cocoa2/85 via-cocoa2/35 to-transparent" />
        <div
          ref={heroTextRef}
          className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center pt-28 text-center transition-opacity md:pt-32"
        >
          <div className="text-[0.72rem] tracking-[0.35em] uppercase text-goldLight/90">Création Signature</div>
          <h1 className="mt-4 max-w-3xl px-6 font-serif text-[2.1rem] italic leading-[1.1] text-cream md:text-[3.4rem]">
            Une pâtisserie qu&apos;on tourne,<br />qu&apos;on explore.
          </h1>
          <p className="mt-5 max-w-md px-6 text-sm font-light text-cream/65 md:text-base">
            Faites pivoter la pièce signature de Céleste à 360°, puis laissez le défilement vous emmener au cœur de chaque détail.
          </p>
        </div>

        <div ref={hintRef} className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center transition-opacity">
          <div className="text-[0.65rem] tracking-[0.25em] uppercase text-cream/50">Glissez pour tourner · Scrollez pour explorer</div>
        </div>

        {/* Tour step captions */}
        <div ref={stepRefs[0]} className="pointer-events-none absolute left-6 top-1/2 max-w-[260px] -translate-y-1/2 opacity-0 transition-opacity md:left-14">
          <div className="text-[0.68rem] tracking-[0.3em] uppercase text-goldLight/80">01 — La Base</div>
          <h3 className="mt-2 font-serif text-2xl italic text-cream md:text-3xl">Le biscuit croustillant</h3>
          <p className="mt-2 text-sm font-light text-cream/60">Dacquoise noisette et praliné croustillant, pour une texture qui résiste au cœur fondant.</p>
        </div>
        <div ref={stepRefs[1]} className="pointer-events-none absolute right-6 top-1/2 max-w-[260px] -translate-y-1/2 text-right opacity-0 transition-opacity md:right-14">
          <div className="text-[0.68rem] tracking-[0.3em] uppercase text-goldLight/80">02 — Le Cœur</div>
          <h3 className="mt-2 font-serif text-2xl italic text-cream md:text-3xl">Framboise fraîche</h3>
          <p className="mt-2 text-sm font-light text-cream/60">Un insert de framboise entière, enrobé d&apos;une mousse légère à peine sucrée.</p>
        </div>
        <div ref={stepRefs[2]} className="pointer-events-none absolute left-6 top-1/4 max-w-[260px] opacity-0 transition-opacity md:left-14">
          <div className="text-[0.68rem] tracking-[0.3em] uppercase text-goldLight/80">03 — La Finition</div>
          <h3 className="mt-2 font-serif text-2xl italic text-cream md:text-3xl">Glaçage miroir &amp; or</h3>
          <p className="mt-2 text-sm font-light text-cream/60">Un glaçage brillant comme du verre, posé à la feuille d&apos;or véritable.</p>
        </div>

        {/* Progress rail */}
        <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
          {railRefs.map((r, i) => (
            <span key={i} ref={r} className="h-2 w-2 rounded-full transition-colors" style={{ backgroundColor: i === 0 ? '#D8B35E' : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
