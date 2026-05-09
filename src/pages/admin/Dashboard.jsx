import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Astrologers', path: '/admin/astrologers' },
  { label: 'Banners', path: '/admin/banners' },
  { label: 'Live Shows', path: '/admin/live-shows' },
  { label: 'Services', path: '/admin/services' },
  { label: 'Contact Queries', path: '/admin/contact-queries' },
];

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const nav = useNavigate();
  const adminName = admin?.name || 'Admin';

  const navClass = ({ isActive }) =>
    `rounded-2xl px-4 py-3 text-sm font-bold transition ${
      isActive
        ? 'bg-yellow-400 text-[#12002f] shadow-lg shadow-yellow-500/20'
        : 'text-white/70 hover:bg-white/10 hover:text-yellow-300'
    }`;

  return (
    <div className="min-h-screen bg-[#07001a] text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-purple-900 bg-[#0d0026] p-5 lg:border-b-0 lg:border-r">
          <div className="mb-8">
            <p className="text-2xl font-black text-yellow-300">Astro Admin</p>
            <p className="mt-1 text-xs text-white/50">Welcome, {adminName}</p>
          </div>

          <nav className="grid gap-2">
            {navItems.map(item => (
              <NavLink key={item.path} to={item.path} end={item.path === '/admin'} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 border-t border-white/10 pt-4">
            <NavLink
              to="/"
              className="block rounded-2xl border border-yellow-400/30 px-4 py-3 text-sm font-bold text-yellow-300 transition hover:bg-yellow-400 hover:text-[#12002f]"
            >
              Back to Website
            </NavLink>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="flex flex-col gap-3 border-b border-purple-900 bg-[#0d0026]/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white/50">Control Panel</p>
              <h2 className="text-xl font-bold text-yellow-300">Admin Dashboard</h2>
            </div>
            <button
              onClick={() => { logout(); nav('/admin/login'); }}
              className="w-fit rounded-full bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </header>

          <main className="p-5 md:p-8">
            <Outlet />
          </main>
        </section>
      </div>
    </div>
  );
}
