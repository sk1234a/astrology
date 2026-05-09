import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const EMPTY = {
  name: '',
  hindi_name: '',
  icon_name: '',
  description: '',
  display_order: 0,
  is_active: true,
};

export default function ManageServices() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);

  const load = () => api.get('/services/admin/all')
    .then(response => setList(Array.isArray(response.data) ? response.data : []))
    .catch(() => setList([]));

  useEffect(() => { load(); }, []);

  const save = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...form,
        display_order: Number(form.display_order) || 0,
        is_active: Boolean(form.is_active),
      };

      if (editing) {
        await api.put(`/services/${editing}`, payload);
        toast.success('Service updated');
      } else {
        await api.post('/services', payload);
        toast.success('Service created');
      }

      setForm(EMPTY);
      setEditing(null);
      await load();
    } catch (error) {
      toast.error(error.message || 'Could not save service');
    }
  };

  const getServiceId = (service) => service.id || service.service_id || service._id;

  const edit = (service) => {
    setForm({
      name: service.name || '',
      hindi_name: service.hindi_name || '',
      icon_name: service.icon_name || '',
      description: service.description || '',
      display_order: service.display_order || 0,
      is_active: Boolean(service.is_active),
    });
    setEditing(getServiceId(service));
  };

  const del = async (service) => {
    const id = typeof service === 'object' ? getServiceId(service) : service;
    if (!id) return toast.error('Service id missing');
    if (!confirm('Delete this service?')) return;

    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted');
      await load();
    } catch (error) {
      toast.error(error.message || 'Could not delete service');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">Admin</p>
        <h1 className="text-2xl font-bold text-white">Manage Services</h1>
      </div>

      <form onSubmit={save} className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-purple-800 bg-[#0d0026] p-6 md:grid-cols-2">
        {[
          ['name', 'Service Name'],
          ['hindi_name', 'Hindi Name'],
          ['icon_name', 'Icon Name'],
          ['display_order', 'Display Order'],
        ].map(([key, label]) => (
          <label key={key} className="grid gap-1 text-sm text-gray-400">
            {label}
            <input
              type={key === 'display_order' ? 'number' : 'text'}
              required={key === 'name'}
              className="rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
              value={form[key]}
              onChange={event => setForm({
                ...form,
                [key]: key === 'display_order' ? Number(event.target.value) : event.target.value,
              })}
            />
          </label>
        ))}

        <label className="grid gap-1 text-sm text-gray-400 md:col-span-2">
          Description
          <textarea
            rows={3}
            className="rounded-lg border border-purple-700 bg-[#1a0040] px-3 py-2 text-white outline-none"
            value={form.description}
            onChange={event => setForm({ ...form, description: event.target.value })}
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-white">
          <input type="checkbox" checked={form.is_active} onChange={event => setForm({ ...form, is_active: event.target.checked })} />
          Active
        </label>

        <div className="flex gap-3 md:col-span-2">
          <button className="rounded-full bg-yellow-500 px-6 py-2 font-bold text-black">
            {editing ? 'Update' : 'Create'} Service
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="rounded-full border border-white/20 px-6 py-2 text-white">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-purple-900 bg-[#0d0026]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-800 text-yellow-400">
              <th className="px-3 py-3 text-left">Name</th>
              <th>Icon</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(service => {
              const id = getServiceId(service);
              return (
                <tr key={id || service.name} className="border-b border-purple-900 last:border-0 hover:bg-[#16003f]">
                  <td className="px-3 py-3">
                    <p className="font-medium text-white">{service.name}</p>
                    <p className="text-xs text-yellow-400">{service.hindi_name}</p>
                  </td>
                  <td className="text-center text-gray-300">{service.icon_name}</td>
                  <td className="text-center text-gray-300">{service.display_order}</td>
                  <td className="text-center text-gray-300">{service.is_active ? 'Active' : 'Inactive'}</td>
                  <td className="text-center">
                    <button onClick={() => edit(service)} className="mx-2 text-blue-400 hover:underline">Edit</button>
                    <button onClick={() => del(service)} className="text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
