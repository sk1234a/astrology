import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function ContactQueries() {
  const [queries, setQueries] = useState([]);

  const load = () => api.get('/contact-queries')
    .then(response => setQueries(Array.isArray(response.data) ? response.data : []))
    .catch(() => setQueries([]));

  useEffect(() => { load(); }, []);

  const setStatus = async (query, status) => {
    try {
      await api.patch(`/contact-queries/${query.id}`, { status });
      toast.success('Status updated');
      await load();
    } catch (error) {
      toast.error(error.message || 'Error updating status');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this query?')) return;
    try {
      await api.delete(`/contact-queries/${id}`);
      toast.success('Query deleted');
      await load();
    } catch (error) {
      toast.error(error.message || 'Error deleting query');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">Admin</p>
        <h1 className="text-2xl font-bold text-white">Contact Queries</h1>
      </div>

      {queries.length ? (
        <div className="grid gap-4">
          {queries.map(query => (
            <article key={query.id} className="rounded-2xl border border-purple-800 bg-[#0d0026] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">{query.name}</h2>
                  <p className="text-sm text-white/60">{query.phone || 'No phone'} | {query.email || 'No email'}</p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${query.status === 'resolved' ? 'bg-green-700' : 'bg-yellow-500 text-black'}`}>
                  {query.status}
                </span>
              </div>

              {query.message && <p className="mt-4 text-sm leading-6 text-white/75">{query.message}</p>}

              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setStatus(query, query.status === 'resolved' ? 'pending' : 'resolved')} className="rounded-full bg-purple-700 px-4 py-2 text-xs font-bold text-white">
                  Mark {query.status === 'resolved' ? 'Pending' : 'Resolved'}
                </button>
                <button onClick={() => del(query.id)} className="rounded-full bg-red-800 px-4 py-2 text-xs font-bold text-white">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">No contact queries found.</div>
      )}
    </div>
  );
}
