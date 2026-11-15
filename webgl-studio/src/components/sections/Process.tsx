import Reveal from '@/components/ui/Reveal';

const STEPS = [
  { n: '01', title: 'Entretien', desc: 'On parle de l’événement, des goûts, des contraintes — allergies, nombre de parts, style.' },
  { n: '02', title: 'Esquisse', desc: 'Une proposition visuelle sur mesure, avec saveurs et finitions adaptées à l’occasion.' },
  { n: '03', title: 'Création', desc: 'Chaque pièce est faite à la main, dans les 48h précédant la livraison, jamais à l’avance.' },
  { n: '04', title: 'Livraison', desc: 'Transport climatisé et montage sur place pour les pièces montées et wedding cakes.' },
];

export default function Process() {
  return (
    <section className="bg-cream px-6 py-28 md:py-36">
      <Reveal className="mx-auto max-w-3xl text-center">
        <div className="text-[0.72rem] uppercase tracking-[0.3em] text-raspberry">Le Processus</div>
        <h2 className="mt-4 font-serif text-3xl italic text-cocoa md:text-5xl">De l&apos;idée à l&apos;assiette</h2>
      </Reveal>

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1}>
            <div className="font-serif text-4xl text-raspberry/80">{s.n}</div>
            <h3 className="mt-3 text-lg text-cocoa">{s.title}</h3>
            <p className="mt-2 text-sm font-light leading-relaxed text-cocoa/60">{s.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
