import Reveal from '@/components/ui/Reveal';

export default function Manifesto() {
  return (
    <section id="atelier" className="bg-cream px-6 py-28 text-center md:py-36">
      <Reveal className="mx-auto max-w-3xl">
        <div className="text-[0.72rem] uppercase tracking-[0.3em] text-raspberry">Notre Philosophie</div>
        <p className="mt-6 font-serif text-2xl italic leading-relaxed text-cocoa md:text-4xl">
          Une pièce de pâtisserie ne se mange pas seulement. Elle se regarde,
          se découvre sous tous les angles, et se raconte &mdash; couche après
          couche &mdash; avant la première bouchée.
        </p>
      </Reveal>

      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 border-t border-cocoa/10 pt-12 text-left md:grid-cols-4">
        {[
          { n: '12+', l: 'ans de métier' },
          { n: '340', l: 'pièces sur mesure / an' },
          { n: '48h', l: 'de préparation minimum' },
          { n: '100%', l: 'fait main, à Perth' },
        ].map((s, i) => (
          <Reveal key={s.l} delay={i * 0.08}>
            <div className="font-serif text-3xl text-raspberry md:text-4xl">{s.n}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.15em] text-cocoa/55">{s.l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
