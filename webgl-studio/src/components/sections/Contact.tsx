'use client';

import { useState, type FormEvent } from 'react';
import Reveal from '@/components/ui/Reveal';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      eventDate: (form.elements.namedItem('eventDate') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? 'Une erreur est survenue.');
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  }

  return (
    <section id="contact" className="bg-cocoa2 px-6 py-28 md:py-36">
      <div className="mx-auto grid max-w-5xl gap-14 md:grid-cols-2">
        <Reveal>
          <div className="text-[0.72rem] uppercase tracking-[0.3em] text-goldLight">Travaillons Ensemble</div>
          <h2 className="mt-4 font-serif text-3xl italic text-cream md:text-5xl">
            Une pièce,<br />rien que pour vous.
          </h2>
          <p className="mt-5 max-w-sm text-sm font-light text-cream/60">
            Mariages, anniversaires, événements d&apos;entreprise — chaque création
            est pensée et réalisée sur mesure, à Perth. Comptez 2 à 4 semaines
            de délai pour les pièces montées.
          </p>
          <div className="mt-8 space-y-1 text-sm text-cream/70">
            <div>hello@celeste-patisserie.com.au</div>
            <div>+61 4 00 000 000</div>
            <div>Perth, Australie Occidentale</div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-cream/60">Nom</label>
              <input
                name="name"
                required
                className="w-full border-b border-cream/20 bg-transparent py-2 text-cream outline-none transition-colors focus:border-goldLight"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-cream/60">E-mail</label>
              <input
                type="email"
                name="email"
                required
                className="w-full border-b border-cream/20 bg-transparent py-2 text-cream outline-none transition-colors focus:border-goldLight"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-cream/60">Date de l&apos;événement</label>
              <input
                type="date"
                name="eventDate"
                className="w-full border-b border-cream/20 bg-transparent py-2 text-cream outline-none transition-colors focus:border-goldLight [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-cream/60">Votre projet</label>
              <textarea
                name="message"
                required
                rows={4}
                className="w-full resize-none border-b border-cream/20 bg-transparent py-2 text-cream outline-none transition-colors focus:border-goldLight"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-2 inline-flex items-center gap-2 bg-goldLight px-7 py-3 text-xs uppercase tracking-[0.14em] text-cocoa2 transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === 'loading' ? 'Envoi…' : 'Envoyer la demande'}
            </button>

            {status === 'success' && (
              <p className="pt-2 text-sm text-goldLight">Merci — nous revenons vers vous sous 48h.</p>
            )}
            {status === 'error' && <p className="pt-2 text-sm text-raspberry">{error}</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
