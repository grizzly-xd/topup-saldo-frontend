import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Toast from '../components/Toast';

export default function Profile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'info' });

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getProfile();
        setForm({
          fullName: data.fullName || user?.displayName || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
        });
      } catch {
        setForm({ fullName: user?.displayName || '', email: user?.email || '', phone: '' });
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({ fullName: form.fullName, phone: form.phone });
      setToast({ msg: 'Profil berhasil diperbarui.', type: 'success' });
    } catch (err) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page">Memuat profil…</div>;

  return (
    <div className="page">
      <h1>Profil</h1>
      <form className="card" onSubmit={save}>
        <label>
          Nama Lengkap
          <input name="fullName" value={form.fullName} onChange={onChange} />
        </label>
        <label>
          Email
          <input name="email" value={form.email} disabled />
        </label>
        <label>
          Nomor Telepon
          <input name="phone" value={form.phone} onChange={onChange} placeholder="08xxxxxxxxxx" />
        </label>
        <button className="btn btn-primary" disabled={saving}>
          {saving ? 'Menyimpan…' : 'Simpan Perubahan'}
        </button>
      </form>
      <button className="btn btn-outline btn-block mt-16" onClick={logout}>Keluar</button>
      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'info' })} />
    </div>
  );
      }
