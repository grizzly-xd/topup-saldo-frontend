import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { formatIDR, formatDate } from '../utils/format';
import Skeleton from '../components/Skeleton';
import Toast from '../components/Toast';

export default function Balance() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState(null);
  const [toast, setToast] = useState({ msg: '', type: 'info' });

  useEffect(() => {
    (async () => {
      try {
        const [bal, hist] = await Promise.all([api.getBalance(), api.getBalanceHistory()]);
        setData(bal);
        setHistory(hist.items || []);
      } catch (err) {
        setToast({ msg: err.message, type: 'error' });
      }
    })();
  }, []);

  return (
    <div className="page">
      <h1>Saldo Saya</h1>
      {!data ? (
        <Skeleton className="skeleton-card" />
      ) : (
        <div className="card balance-card">
          <div className="muted">Saldo Tersedia</div>
          <h2 className="balance-amount">{formatIDR(data.balance)}</h2>
          <div className="muted">Total Masuk: {formatIDR(data.total_in)}</div>
        </div>
      )}

      <h3 className="mt-24">Riwayat Perubahan Saldo</h3>
      {!history ? (
        <Skeleton className="skeleton-card" />
      ) : history.length === 0 ? (
        <div className="empty-state">Belum ada riwayat.</div>
      ) : (
        <div className="list">
          {history.map((h) => (
            <div key={h.id} className="list-item">
              <div>
                <div className="list-title">{h.description}</div>
                <div className="list-sub">{formatDate(h.created_at)}</div>
              </div>
              <div className={`list-right ${h.amount > 0 ? 'positive' : 'negative'}`}>
                {h.amount > 0 ? '+' : ''}{formatIDR(h.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'info' })} />
    </div>
  );
}
