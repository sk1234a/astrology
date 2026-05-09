import { Link } from 'react-router-dom';

const cards = [
  { title: 'Manage Astrologers', desc: 'Add, edit and delete astrologer profiles', link: '/admin/astrologers', icon: 'Users' },
  { title: 'Manage Banners', desc: 'Upload and arrange banner images', link: '/admin/banners', icon: 'Images' },
  { title: 'Manage Live Shows', desc: 'Create and control live shows', link: '/admin/live-shows', icon: 'Live' },
  { title: 'Manage Services', desc: 'Control homepage service categories', link: '/admin/services', icon: 'Grid' },
  { title: 'Contact Queries', desc: 'View and resolve user enquiries', link: '/admin/contact-queries', icon: 'Inbox' },
];

export default function AdminOverview() {
  return (
    <div>
      <div className="mb-8 rounded-3xl border border-yellow-400/20 bg-[#0d0026] p-6 shadow-xl shadow-black/20">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">Overview</p>
        <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-white/60">Manage astrologers, homepage banners and live shows from one place.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(c => (
          <Link
            to={c.link}
            key={c.title}
            className="group rounded-2xl border border-purple-800 bg-[#0d0026] p-6 transition hover:-translate-y-1 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10"
          >
            <div className="mb-4 inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
              {c.icon}
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-yellow-300">{c.title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
