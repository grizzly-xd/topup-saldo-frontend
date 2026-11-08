import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Login() {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'info' });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return setToast({ msg: 'Email dan password wajib diisi.', type: 'error' });
    }
    if (mode === 'register' && !form.name) {
      return setToast({ msg: 'Nama lengkap wajib diisi.', type: 'error' });
    }
    setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.email, form.password, form.name);
      nav('/');
    } catch (err) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>💳 TopUpKu</h1>
        <p className="muted">{mode === 'login' ? 'Masuk ke akun Anda' : 'Buat akun baru'}</p>
        <form onSubmit={submit}>
          {mode === 'register' && (
            <label>
              Nama Lengkap
              <input name="name" value={form.name} onChange={onChange} placeholder="John Doe" />
            </label>
          )}
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={onChange} placeholder="email@contoh.com" />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={onChange} placeholder="••••••••" />
          </label>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Memproses…' : mode === 'login' ? 'Masuk' : 'Daftar'}
          </button>
        </form>
        <button className="btn btn-link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
        </button>
      </div>
      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'info' })} />
    </div>
  );
}
