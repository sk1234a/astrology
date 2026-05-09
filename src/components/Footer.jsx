import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-yellow-400/20 bg-[#0d0026] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Astro In Chat"
              className="h-12 w-12 rounded-full border border-yellow-400/40 object-cover"
            />
            <h2 className="text-2xl font-black text-yellow-300">Astro In Chat</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/65">
            Online astrology consultations for love, career, marriage, kundli, tarot and numerology.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-yellow-300">Quick Links</h3>
          <div className="grid gap-2 text-sm text-white/70">
            <Link to="/" className="transition hover:text-yellow-300">Home</Link>
            <Link to="/astrologers" className="transition hover:text-yellow-300">Astrologers</Link>
            <Link to="/live" className="transition hover:text-yellow-300">Live</Link>
            <Link to="/contact" className="transition hover:text-yellow-300">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-yellow-300">Contact</h3>
          <div className="grid gap-3 text-sm text-white/70">
            <p className="flex items-center gap-2"><Phone size={16} /> +91 98765 43210</p>
            <p className="flex items-center gap-2"><Mail size={16} /> support@astroinchat.com</p>
            <p className="flex items-center gap-2"><MapPin size={16} /> India</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/50">
        Copyright {year} Astro In Chat. All rights reserved.
      </div>
    </footer>
  );
}
