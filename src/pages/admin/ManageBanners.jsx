import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ManageBanners() {
  const [list, setList] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: '', image_url: '', link_url: '', display_order: 0, banner_type: 'main', is_active: true });
  const [editing, setEditing] = useState(null);

  const load = () => api.get('/banners/admin/all')
    .then(r => setList(Array.isArray(r.data) ? r.data : []))
    .catch(() => setList([]));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !form.image_url && !editing) return toast.error('Select an image or paste image URL');
    const fd = new FormData();
    if (file) fd.append('image', file);
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    try {
      if (editing) {
        await api.put(`/banners/${editing}`, fd);
        toast.success('Banner updated!');
      } else {
        await api.post('/banners', fd);
        toast.success('Banner added!');
      }
      setFile(null);
      setForm({ title: '', image_url: '', link_url: '', display_order: 0, banner_type: 'main', is_active: true });
      setEditing(null);
      await load();
    } catch (error) {
      toast.error(error.message || 'Error saving banner');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Deleted');
      await load();
    } catch (error) {
      toast.error(error.message || 'Error deleting');
    }
  };

  const edit = (banner) => {
    setForm({
      title: banner.title || '',
      image_url: banner.image_url || '',
      link_url: banner.link_url || '',
      display_order: banner.display_order || 0,
      banner_type: banner.banner_type || 'main',
      is_active: Boolean(banner.is_active),
    });
    setEditing(banner.id);
  };

  const cancelEdit = () => {
    setForm({ title: '', image_url: '', link_url: '', display_order: 0, banner_type: 'main', is_active: true });
    setEditing(null);
    setFile(null);
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">Admin</p>
        <h1 className="text-2xl font-bold text-white">Manage Banners</h1>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl border border-purple-800 bg-[#0d0026] p-6">
        <div>
          <label className="text-sm text-gray-400">Banner Title</label>
          <input className="mt-1 block rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-400">Order</label>
          <input type="number" className="mt-1 block w-24 rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
            value={form.display_order} onChange={e => setForm({ ...form, display_order: Number(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="text-sm text-gray-400">Type</label>
          <select className="mt-1 block rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
            value={form.banner_type} onChange={e => setForm({ ...form, banner_type: e.target.value })}>
            <option value="main">main</option>
            <option value="popup">popup</option>
            <option value="sidebar">sidebar</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">Image URL</label>
          <input className="mt-1 block rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
            value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-400">Link URL</label>
          <input className="mt-1 block rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
            value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-gray-400">Image</label>
          <input type="file" accept="image/*" className="mt-1 block text-white" onChange={e => setFile(e.target.files[0])} />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm text-white">
          <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
          Active
        </label>
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-yellow-500 px-5 py-2 font-bold text-black">
            {editing ? 'Update' : 'Upload'} Banner
          </button>
          {editing && (
            <button type="button" onClick={cancelEdit} className="rounded-full border border-white/20 px-5 py-2 text-white">
              Cancel
            </button>
          )}
        </div>
      </form>

      {list.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map(b => (
            <div key={b.id} className="relative overflow-hidden rounded-xl border border-purple-800 bg-[#0d0026]">
              <img src={b.image_url} alt={b.title || 'Banner'} className="h-40 w-full object-cover" />
              <div className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm text-white">{b.title || 'Banner'}</p>
                  <p className="text-xs text-gray-400">Order: {b.display_order}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => edit(b)} className="text-sm text-blue-400 hover:underline">Edit</button>
                  <button onClick={() => del(b.id)} className="text-sm text-red-400 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">No banners found.</div>
      )}
    </div>
  );
}
