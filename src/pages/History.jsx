import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatIDR, formatDate, statusLabel } from '../utils/format';
import Skeleton from '../components/Skeleton';
import Toast from '../components/Toast';

export default function History() {
  const [items, setItems] = useState(null);
  const [toast, setToast] = useState({ msg: '', type: 'info' });

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getTransactions();
        setItems(data.items || []);
      } catch (err) {
        setToast({ msg: err.message, type: 'error' });
        setItems([]);
      }
    })();
  }, []);

  return (
    <div className="page">
      <h1>Riwayat Transaksi</h1>
      {!items ? (
        <>
          <Skeleton className="skeleton-card" />
          <Skeleton className="skeleton-card" />
        </>
      ) : items.length === 0 ? (
        <div className="empty-state">Belum ada transaksi.</div>
      ) : (
        <div className="list">
          {items.map((t) => (
            <Link to={`/payment/${t.order_id}`} key={t.order_id} className="list-item">
              <div>
                <div className="list-title">{t.order_id}</div>
                <div className="list-sub">{formatDate(t.created_at)} • {t.method}</div>
              </div>
              <div className="list-right">
                <div>{formatIDR(t.amount)}</div>
                <span className={`badge badge-${t.status}`}>{statusLabel(t.status)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'info' })} />
    </div>
  );
      }
