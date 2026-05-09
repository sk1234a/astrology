import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LiveShowCard from '../components/LiveShowCard';
import api from '../utils/api';

export default function Live() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/live-shows')
      .then(r => {
        const liveShows = Array.isArray(r.data) ? r.data.filter(show => show.is_live) : [];
        setShows(liveShows);
      })
      .catch(() => setShows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#07001a] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8 overflow-hidden rounded-3xl border border-red-500/20 bg-[#0d0026] p-6 shadow-xl shadow-black/20">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-red-300">Live Now</p>
          <h1 className="text-3xl font-black md:text-5xl">Watch live astrology sessions</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            Live profiles shown here are controlled from the admin dashboard. Turn a show live from Admin &gt; Live Shows and it will appear here.
          </p>
        </section>

        {loading ? (
          <p className="text-white/70">Loading live shows...</p>
        ) : shows.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {shows.map(show => <LiveShowCard key={show.id} show={show} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-lg font-bold text-white">No live shows right now</p>
            <p className="mt-2 text-sm text-white/60">Start one from the admin dashboard and it will show here.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
