import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Astrologers', path: '/astrologers' },
  { label: 'Live', path: '/live' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-yellow-400 text-[#12002f]'
        : 'text-white/85 hover:bg-white/10 hover:text-yellow-300'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-yellow-400/20 bg-[#0d0026]/95 px-4 py-3 text-white shadow-lg shadow-black/20 backdrop-blur md:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <img
            src="/logo.svg"
            alt="Astro In Chat"
            className="h-12 w-12 rounded-full border border-yellow-400/40 object-cover shadow-md shadow-yellow-500/20"
          />
          <div>
            <p className="text-lg font-black leading-tight text-yellow-300 md:text-2xl">Astro In Chat</p>
            <p className="hidden text-xs text-white/55 sm:block">Talk to trusted astrologers</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white md:hidden"
          aria-label="Toggle navigation menu"
          onClick={() => setIsOpen(open => !open)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isOpen && (
        <div className="mx-auto mt-4 grid max-w-7xl gap-2 rounded-3xl border border-white/10 bg-[#16003f] p-3 md:hidden">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} className={linkClass} onClick={() => setIsOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
