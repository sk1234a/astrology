import { useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const EMPTY = { name: '', phone: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await api.post('/contact-queries', form);
      toast.success('Query submitted');
      setForm(EMPTY);
    } catch (error) {
      toast.error(error.message || 'Could not submit query');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07001a] text-white">
      <Navbar />

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-yellow-400/20 bg-[#0d0026] p-6 shadow-xl shadow-black/20">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">Contact</p>
          <h1 className="text-3xl font-black md:text-5xl">Send your query</h1>
          <p className="mt-4 text-sm leading-6 text-white/65">
            Share your question and the team can follow up from the admin dashboard.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-white/70">
            <p>Phone: +91 98765 43210</p>
            <p>Email: support@astroinchat.com</p>
            <p>Location: India</p>
          </div>
        </section>

        <form onSubmit={submit} className="grid gap-4 rounded-3xl border border-purple-800 bg-[#0d0026] p-6">
          {[
            ['name', 'Name', 'text'],
            ['phone', 'Phone', 'tel'],
            ['email', 'Email', 'email'],
          ].map(([key, label, type]) => (
            <label key={key} className="grid gap-2 text-sm text-white/70">
              {label}
              <input
                type={type}
                required={key === 'name'}
                className="rounded-xl border border-purple-700 bg-[#1a0040] px-4 py-3 text-white outline-none focus:border-yellow-400"
                value={form[key]}
                onChange={event => setForm({ ...form, [key]: event.target.value })}
              />
            </label>
          ))}

          <label className="grid gap-2 text-sm text-white/70">
            Message
            <textarea
              rows={5}
              className="rounded-xl border border-purple-700 bg-[#1a0040] px-4 py-3 text-white outline-none focus:border-yellow-400"
              value={form.message}
              onChange={event => setForm({ ...form, message: event.target.value })}
            />
          </label>

          <button disabled={saving} className="rounded-full bg-yellow-500 px-6 py-3 font-bold text-black transition hover:bg-yellow-400 disabled:opacity-60">
            {saving ? 'Submitting...' : 'Submit Query'}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
