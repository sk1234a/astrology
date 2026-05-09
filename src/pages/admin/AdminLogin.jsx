import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success('Login successful!');
      nav('/admin');
    } catch {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#07001a] flex items-center justify-center">
      <div className="bg-[#0d0026] border border-purple-800 rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email" placeholder="Email"
            className="bg-[#1a0040] text-white border border-purple-700 rounded-lg px-4 py-3 outline-none"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} placeholder="Password"
              className="bg-[#1a0040] text-white border border-purple-700 rounded-lg px-4 py-3 outline-none w-full"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button className="bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
