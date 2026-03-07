import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-32 py-8 px-6 text-center">
      <p className="text-text-muted text-sm tracking-wider">
        © {new Date().getFullYear()} D-Armada Global. All rights reserved.
      </p>
      <div className="flex justify-center gap-6 mt-3">
        <Link href="/contact" className="text-text-muted text-xs hover:text-brand transition-colors">Contact</Link>
        <Link href="/about" className="text-text-muted text-xs hover:text-brand transition-colors">About</Link>
        <Link href="/investor" className="text-text-muted text-xs hover:text-brand transition-colors">Investor Relations</Link>
      </div>
    </footer>
  );
}
