import Reveal from '@/components/ui/Reveal';

export default function Testimonial() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center px-6 py-32 text-center md:py-44"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=2000&q=80')" }}
    >
      <div className="absolute inset-0 bg-cocoa2/80" />
      <Reveal className="relative z-10 mx-auto max-w-2xl">
        <blockquote className="font-serif text-2xl italic leading-relaxed text-cream md:text-4xl">
          &laquo; On a fait tourner la pièce sur le site pendant dix minutes avant
          même de commander. Le jour J, elle était encore plus belle en vrai. &raquo;
        </blockquote>
        <cite className="mt-6 block text-xs uppercase tracking-[0.2em] text-cream/50">
          — Mariage, Mars 2026
        </cite>
      </Reveal>
    </section>
  );
}
