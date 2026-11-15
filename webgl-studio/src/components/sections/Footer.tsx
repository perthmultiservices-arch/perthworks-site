export default function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-cocoa2 px-6 py-8 text-center text-xs text-cream/40">
      <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-3 md:flex-row">
        <span>© {new Date().getFullYear()} Céleste Pâtisserie — Perth, WA</span>
        <span>
          Prototype WebGL &mdash; conçu par{' '}
          <a href="/" className="text-goldLight hover:underline">
            Perth Multiservices Web Studio
          </a>
        </span>
      </div>
    </footer>
  );
}
