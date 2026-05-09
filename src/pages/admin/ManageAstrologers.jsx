import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const EMPTY = {
  name: '', hindi_name: '', phone: '', experience_years: '',
  price_per_min: '', original_price_per_min: '', rating: '', total_reviews: '',
  profile_image_url: '', flat_deal: '', bio: '',
  specialization: '', languages: '', is_active: true, is_online: false
};

export default function ManageAstrologers() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/astrologers')
    .then(r => setList(Array.isArray(r.data) ? r.data : []))
    .catch(() => setList([]));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);

    try {
      if (editing) {
        await api.put(`/astrologers/${editing}`, fd);
        toast.success('Updated!');
      } else {
        await api.post('/astrologers', fd);
        toast.success('Created!');
      }
      setForm(EMPTY);
      setEditing(null);
      setImageFile(null);
      setShowForm(false);
      await load();
    } catch (error) {
      toast.error(error.message || 'Error saving');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this astrologer?')) return;
    try {
      await api.delete(`/astrologers/${id}`);
      toast.success('Deleted');
      await load();
    } catch (error) {
      toast.error(error.message || 'Error deleting');
    }
  };

  const edit = (a) => {
    setForm({
      ...a,
      specialization: Array.isArray(a.specialization) ? a.specialization.join(', ') : '',
      languages: Array.isArray(a.languages) ? a.languages.join(', ') : '',
    });
    setEditing(a.id);
    setShowForm(true);
  };

  const toggleActive = async (a) => {
    try {
      await api.patch(`/astrologers/${a.id}/status`, { is_active: !a.is_active });
      await load();
    } catch (error) {
      toast.error(error.message || 'Error updating status');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">Admin</p>
          <h1 className="text-2xl font-bold text-white">Manage Astrologers</h1>
        </div>
        <button
          onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm); }}
          className="w-fit rounded-full bg-yellow-500 px-4 py-2 font-bold text-black"
        >
          {showForm ? 'Cancel' : '+ Add New'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-purple-800 bg-[#0d0026] p-6 md:grid-cols-2">
          {[['name', 'Name'], ['hindi_name', 'Hindi Name'], ['phone', 'Phone'], ['experience_years', 'Experience (Years)'],
            ['price_per_min', 'Price/Min (Rs.)'], ['original_price_per_min', 'Original Price/Min'], ['rating', 'Rating'],
            ['total_reviews', 'Total Reviews'], ['flat_deal', 'Flat Deal'], ['profile_image_url', 'Profile Image URL'],
            ['specialization', 'Specialization (comma separated)'], ['languages', 'Languages (comma separated)']].map(([k, label]) => (
            <div key={k}>
              <label className="text-sm text-gray-400">{label}</label>
              <input className="mt-1 w-full rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
                value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-400">Bio</label>
            <textarea className="mt-1 w-full rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
              rows={3} value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-400">Profile Image</label>
            <input type="file" accept="image/*" className="mt-1 w-full text-white" onChange={e => setImageFile(e.target.files[0])} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_online} onChange={e => setForm({ ...form, is_online: e.target.checked })} /> Online</label>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-full bg-yellow-500 px-6 py-2 font-bold text-black">
              {editing ? 'Update' : 'Create'} Astrologer
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-purple-900 bg-[#0d0026]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-800 text-yellow-400">
              <th className="px-3 py-3 text-left">Name</th>
              <th>Phone</th>
              <th>Rating</th>
              <th>Price</th>
              <th>Status</th>
              <th>Online</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr key={a.id} className="border-b border-purple-900 last:border-0 hover:bg-[#16003f]">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <img src={a.profile_image_url || '/default-astro.png'} className="h-8 w-8 rounded-full object-cover" alt="" />
                    <div>
                      <p className="font-medium text-white">{a.name}</p>
                      <p className="text-xs text-yellow-400">{a.hindi_name}</p>
                    </div>
                  </div>
                </td>
                <td className="text-center text-gray-300">{a.phone}</td>
                <td className="text-center text-yellow-400">{a.rating}</td>
                <td className="text-center text-green-400">Rs. {a.price_per_min}</td>
                <td className="text-center">
                  <button onClick={() => toggleActive(a)} className={`rounded-full px-2 py-0.5 text-xs text-white ${a.is_active ? 'bg-green-700' : 'bg-red-800'}`}>
                    {a.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="text-center"><span className={`inline-block h-2 w-2 rounded-full ${a.is_online ? 'bg-green-400' : 'bg-gray-600'}`} /></td>
                <td className="text-center">
                  <button onClick={() => edit(a)} className="mx-2 text-blue-400 hover:underline">Edit</button>
                  <button onClick={() => del(a.id)} className="text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
