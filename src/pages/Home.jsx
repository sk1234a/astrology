import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BannerSlider from '../components/BannerSlider';
import AstrologerCard from '../components/AstrologerCard';
import LiveShowCard from '../components/LiveShowCard';
import api from '../utils/api';

export default function Home() {
  const [astrologers, setAstrologers] = useState([]);
  const [shows, setShows] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/astrologers?active=true')
      .then(r => setAstrologers(Array.isArray(r.data) ? r.data : []))
      .catch(() => setAstrologers([]));

    api.get('/live-shows')
      .then(r => {
        const liveShows = Array.isArray(r.data) ? r.data.filter(s => s.is_live) : [];
        setShows(liveShows);
      })
      .catch(() => setShows([]));

    api.get('/services')
      .then(r => setServices(Array.isArray(r.data) ? r.data : []))
      .catch(() => setServices([]));
  }, []);

  const fallbackServices = [
    'Love & Relationships',
    'Career & Business',
    'Marriage',
    'Kundli Analysis',
    'Finance & Wealth',
  ];
  const serviceItems = services.length ? services : fallbackServices.map((name, index) => ({ id: name, name, display_order: index + 1 }));

  return (
    <div className="min-h-screen bg-[#07001a] text-white">
      <Navbar />

      <BannerSlider />

      {shows.length > 0 && (
        <section className="px-6 py-8">
          <div className="mb-4 flex justify-between">
            <h2 className="text-xl font-bold text-white">Live Shows</h2>
            <button className="rounded-full border border-yellow-500 px-3 py-1 text-xs text-yellow-500">View All</button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {shows.map(s => <LiveShowCard key={s.id} show={s} />)}
          </div>
        </section>
      )}

      <section className="px-6 py-8">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-bold text-white">Top Online Astrologers</h2>
          <Link to="/astrologers" className="rounded-full border border-yellow-500 px-3 py-1 text-xs text-yellow-500">View All</Link>
        </div>
        {astrologers.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {astrologers.slice(0, 4).map(a => <AstrologerCard key={a.id} a={a} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/65">
            Connect your backend API to show astrologers here.
          </div>
        )}
      </section>

      <section className="bg-[#0d0026] px-6 py-8">
        <h2 className="mb-6 text-center text-xl font-bold text-yellow-400">Our Services</h2>
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-5">
          {serviceItems.slice(0, 10).map(s => (
            <div key={s.id || s.name} className="rounded-xl border border-purple-800 bg-[#1a0040] p-4">
              <p className="text-sm font-medium text-white">{s.name}</p>
              {s.hindi_name && <p className="mt-1 text-xs text-yellow-300">{s.hindi_name}</p>}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
