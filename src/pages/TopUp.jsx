import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { formatIDR } from '../utils/format';
import Toast from '../components/Toast';
import Skeleton from '../components/Skeleton';

export default function TopUp() {
  const nav = useNavigate();
  const [options, setOptions] = useState(null);
  const [amount, setAmount] = useState(0);
  const [adminFee, setAdminFee] = useState(0);
  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'info' });

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getTopupOptions();
        setOptions(data);
        setAmount(data.presets?.[1] || data.presets?.[0] || data.min);
        setAdminFee(data.adminFee || 0);
      } catch (err) {
        setToast({ msg: err.message, type: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setNominal = (val) => {
    const n = Number(val) || 0;
    if (options && (n < options.min || n > options.max)) {
      setToast({ msg: `Nominal harus antara ${formatIDR(options.min)} - ${formatIDR(options.max)}`, type: 'error' });
    }
    setAmount(n);
  };

  const total = amount + (adminFee || 0);

  const submit = async () => {
    if (!options) return;
    if (!method) return setToast({ msg: 'Pilih metode pembayaran.', type: 'error' });
    if (amount < options.min || amount > options.max) {
      return setToast({ msg: 'Nominal tidak valid.', type: 'error' });
    }
    setSubmitting(true);
    try {
      const data = await api.createTransaction({ amount, method });
      // Metode utama: redirect_url dari Snap
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
        return;
      }
      // Alternatif: Snap popup
      if (data.snap_token && window.snap) {
        window.snap.pay(data.snap_token, {
          onSuccess: () => nav(`/payment/${data.order_id}`),
          onPending: () => nav(`/payment/${data.order_id}`),
          onError: () => nav(`/payment/${data.order_id}`),
          onClose: () => setToast({ msg: 'Pembayaran dibatalkan.', type: 'error' }),
        });
        return;
      }
      nav(`/payment/${data.order_id}`);
    } catch (err) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Skeleton className="skeleton-title" />
        <Skeleton className="skeleton-card" />
        <Skeleton className="skeleton-card" />
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Top Up Saldo</h1>
      <p className="muted">Pilih nominal dan metode pembayaran yang Anda inginkan.</p>

      <section className="card">
        <h3>Pilih Nominal</h3>
        <div className="preset-grid">
          {options.presets.map((p) => (
            <button
              key={p}
              className={`preset-btn ${amount === p ? 'active' : ''}`}
              onClick={() => setNominal(p)}
            >
              {formatIDR(p)}
            </button>
          ))}
        </div>
        <label className="mt-16">
          Nominal Manual
          <input
            type="number"
            value={amount || ''}
            min={options.min}
            max={options.max}
            onChange={(e) => setNominal(e.target.value)}
            placeholder={`Min ${formatIDR(options.min)}`}
          />
        </label>
        <p className="muted small">
          Minimal {formatIDR(options.min)} • Maksimal {formatIDR(options.max)}
        </p>
      </section>

      <section className="card">
        <h3>Metode Pembayaran</h3>
        <div className="method-grid">
          {options.methods.map((m) => (
            <button
              key={m.id}
              className={`method-btn ${method === m.id ? 'active' : ''}`}
              onClick={() => setMethod(m.id)}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card summary">
        <div className="row"><span>Nominal Top Up</span><strong>{formatIDR(amount)}</strong></div>
        <div className="row"><span>Biaya Admin</span><strong>{formatIDR(adminFee)}</strong></div>
        <div className="row total"><span>Total Pembayaran</span><strong>{formatIDR(total)}</strong></div>
        <button
          className="btn btn-primary btn-block mt-16"
          disabled={submitting || !method || amount <= 0}
          onClick={submit}
        >
          {submitting ? 'Memproses…' : 'Bayar Sekarang'}
        </button>
      </section>

      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'info' })} />
    </div>
  );
                    }
