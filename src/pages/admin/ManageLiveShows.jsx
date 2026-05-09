import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ManageLiveShows() {
  const [shows, setShows] = useState([]);
  const [astros, setAstros] = useState([]);
  const [form, setForm] = useState({
    astrologer_id: '',
    title: '',
    topic: '',
    scheduled_at: '',
    stream_url: '',
    thumbnail_url: '',
    is_live: false,
  });
  const [editing, setEditing] = useState(null);

  const load = () => api.get('/live-shows')
    .then(r => setShows(Array.isArray(r.data) ? r.data : []))
    .catch(() => setShows([]));

  useEffect(() => {
    load();
    api.get('/astrologers?active=true')
      .then(r => setAstros(Array.isArray(r.data) ? r.data : []))
      .catch(() => setAstros([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/live-shows/${editing}`, form);
        toast.success('Show updated!');
      } else {
        await api.post('/live-shows', form);
        toast.success('Show created!');
      }
      setForm({ astrologer_id: '', title: '', topic: '', scheduled_at: '', stream_url: '', thumbnail_url: '', is_live: false });
      setEditing(null);
      await load();
    } catch (error) {
      toast.error(error.message || 'Error saving show');
    }
  };

  const toggleLive = async (s) => {
    try {
      await api.put(`/live-shows/${s.id}`, { is_live: !s.is_live });
      await load();
    } catch (error) {
      toast.error(error.message || 'Error updating live status');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this live show?')) return;
    try {
      await api.delete(`/live-shows/${id}`);
      toast.success('Show deleted');
      await load();
    } catch (error) {
      toast.error(error.message || 'Error deleting show');
    }
  };

  const edit = (show) => {
    setForm({
      astrologer_id: show.astrologer_id || '',
      title: show.title || '',
      topic: show.topic || '',
      scheduled_at: show.scheduled_at ? new Date(show.scheduled_at).toISOString().slice(0, 16) : '',
      stream_url: show.stream_url || '',
      thumbnail_url: show.thumbnail_url || '',
      is_live: Boolean(show.is_live),
    });
    setEditing(show.id);
  };

  const cancelEdit = () => {
    setForm({ astrologer_id: '', title: '', topic: '', scheduled_at: '', stream_url: '', thumbnail_url: '', is_live: false });
    setEditing(null);
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">Admin</p>
        <h1 className="text-2xl font-bold text-white">Manage Live Shows</h1>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-purple-800 bg-[#0d0026] p-6 md:grid-cols-2">
        <div>
          <label className="text-sm text-gray-400">Astrologer</label>
          <select className="mt-1 w-full rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
            value={form.astrologer_id} onChange={e => setForm({ ...form, astrologer_id: e.target.value })}>
            <option value="">Select Astrologer</option>
            {astros.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">Show Title</label>
          <input className="mt-1 w-full rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-400">Topic</label>
          <input className="mt-1 w-full rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
            value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-400">Scheduled At</label>
          <input type="datetime-local" className="mt-1 w-full rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
            value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-400">Stream URL</label>
          <input className="mt-1 w-full rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
            value={form.stream_url} onChange={e => setForm({ ...form, stream_url: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-400">Thumbnail URL</label>
          <input className="mt-1 w-full rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
            value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} />
        </div>
        <div className="flex items-center gap-3 md:mt-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_live} onChange={e => setForm({ ...form, is_live: e.target.checked })} />
            Mark as Live
          </label>
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" className="w-fit rounded-full bg-yellow-500 px-5 py-2 font-bold text-black">
            {editing ? 'Update' : 'Create'} Show
          </button>
          {editing && (
            <button type="button" onClick={cancelEdit} className="rounded-full border border-white/20 px-5 py-2 text-white">
              Cancel
            </button>
          )}
        </div>
      </form>

      {shows.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shows.map(s => (
            <div key={s.id} className="rounded-xl border border-purple-800 bg-[#0d0026] p-4">
              <div className="mb-2 flex justify-between gap-3">
                <span className="font-semibold text-white">{s.astrologers?.name || 'Astrologer'}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${s.is_live ? 'bg-red-600' : 'bg-gray-700'}`}>
                  {s.is_live ? 'LIVE' : 'Offline'}
                </span>
              </div>
              <p className="text-sm text-gray-300">{s.title}</p>
              <p className="mt-1 text-xs text-gray-400">{s.topic}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => edit(s)} className="flex-1 rounded-full bg-blue-700 py-1.5 text-xs text-white">Edit</button>
                <button onClick={() => toggleLive(s)} className="flex-1 rounded-full bg-purple-700 py-1.5 text-xs text-white">
                  {s.is_live ? 'Stop Live' : 'Go Live'}
                </button>
                <button onClick={() => del(s.id)} className="flex-1 rounded-full bg-red-800 py-1.5 text-xs text-white">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">No live shows found.</div>
      )}
    </div>
  );
}
