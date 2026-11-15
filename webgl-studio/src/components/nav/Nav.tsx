'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#tour', label: 'La Pièce' },
  { href: '#atelier', label: 'Atelier' },
  { href: '#galerie', label: 'Galerie' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-300 md:px-10 ${
          scrolled ? 'bg-cocoa2/90 py-3 backdrop-blur-md' : ''
        }`}
      >
        <a href="#" className="font-serif text-xl italic tracking-wide text-cream">
          Céleste
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-[0.75rem] uppercase tracking-[0.18em] text-cream/75 transition-colors hover:text-goldLight"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="border border-goldLight/70 px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] text-goldLight transition-colors hover:bg-goldLight hover:text-cocoa2"
            >
              Commander
            </a>
          </li>
        </ul>
        <button
          aria-label="Menu"
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="h-px w-6 bg-cream" />
          <span className="h-px w-6 bg-cream" />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-cocoa2 transition-transform duration-500 md:hidden ${
          open ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="font-serif text-3xl italic text-cream"
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
