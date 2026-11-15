'use client';

import { useState } from 'react';
import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';

const PIECES = [
  { src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80', title: 'Éclipse', desc: 'Chocolat noir, caramel beurre salé' },
  { src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80', title: 'Jardin d’Été', desc: 'Assortiment signature, pièce de mariage' },
  { src: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', title: 'Opéra Doré', desc: 'Café, feuille d’or, amande' },
  { src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80', title: 'Pivoine', desc: 'Rose, litchi, framboise' },
  { src: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=900&q=80', title: 'Noisette Croquante', desc: 'Praliné maison, biscuit dacquoise' },
  { src: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80', title: 'Nuit d’Ébène', desc: 'Chocolat grand cru 72%' },
];

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="galerie" className="bg-cocoa2 px-6 py-28 md:py-36">
      <Reveal className="mx-auto max-w-3xl text-center">
        <div className="text-[0.72rem] uppercase tracking-[0.3em] text-goldLight">Pièces Récentes</div>
        <h2 className="mt-4 font-serif text-3xl italic text-cream md:text-5xl">La Galerie</h2>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {PIECES.map((p, i) => (
          <Reveal key={p.title} delay={(i % 3) * 0.08}>
            <button
              onClick={() => setActive(i)}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-sm text-left"
            >
              <Image
                src={p.src}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa2/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="font-serif text-lg italic text-cream">{p.title}</div>
                <div className="text-xs text-cream/60">{p.desc}</div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-cocoa2/95 p-6 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <button
            aria-label="Fermer"
            className="absolute right-6 top-6 text-sm uppercase tracking-widest text-cream/70 hover:text-goldLight"
            onClick={() => setActive(null)}
          >
            Fermer ✕
          </button>
          <div className="relative aspect-[4/5] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <Image
              src={PIECES[active].src.replace('w=900', 'w=1400')}
              alt={PIECES[active].title}
              fill
              sizes="500px"
              className="rounded-sm object-cover"
            />
          </div>
        </div>
      )}
    </section>
  );
}
