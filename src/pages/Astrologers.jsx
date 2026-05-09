import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AstrologerCard from '../components/AstrologerCard';
import api from '../utils/api';

export default function Astrologers() {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/astrologers?active=true')
      .then(res => setAstrologers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setAstrologers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#07001a] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 rounded-3xl border border-yellow-400/20 bg-[#0d0026] p-6 shadow-xl shadow-black/20">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">Astrologers</p>
          <h1 className="text-3xl font-black md:text-5xl">Talk to online astrologers</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            Choose from verified astrologers for chat and call consultations.
          </p>
        </div>

        {loading ? (
          <p className="text-white/70">Loading astrologers...</p>
        ) : astrologers.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {astrologers.map(a => <AstrologerCard key={a.id} a={a} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/65">
            No astrologers available right now. Please check your backend API URL.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
