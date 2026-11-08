import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { formatIDR, formatDate, statusLabel } from '../utils/format';
import Skeleton from '../components/Skeleton';

export default function PaymentStatus() {
  const { orderId } = useParams();
  const [params] = useSearchParams();
  const [trx, setTrx] = useState(null);
  const [polling, setPolling] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const data = await api.getTransactionStatus(orderId);
        if (!mounted) return;
        setTrx(data);
        const st = data.status;
        if (st === 'success' || st === 'failed' || st === 'expired') {
          setPolling(false);
        }
      } catch {
        // biarkan polling berikutnya
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [orderId]);

  useEffect(() => {
    if (!polling) return;
    timerRef.current = setInterval(() => {
      api.getTransactionStatus(orderId).then(setTrx).catch(() => {});
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [polling, orderId]);

  if (!trx) {
    return <div className="page"><Skeleton className="skeleton-card" /></div>;
  }

  const status = params.get('status') || trx.status;
  const icon = {
    pending: '⏳', success: '✅', failed: '❌', expired: '⌛',
  }[status] || 'ℹ️';

  return (
    <div className="page payment-status">
      <div className={`status-card status-${status}`}>
        <div className="status-icon">{icon}</div>
        <h2>{statusLabel(status)}</h2>
        <p className="muted">
          {status === 'pending' && 'Selesaikan pembayaran Anda untuk menambah saldo.'}
          {status === 'success' && 'Pembayaran berhasil. Saldo telah ditambahkan.'}
          {status === 'failed' && 'Pembayaran gagal. Silakan coba lagi.'}
          {status === 'expired' && 'Waktu pembayaran telah habis.'}
        </p>

        <div className="card summary">
          <div className="row"><span>ID Transaksi</span><strong>{trx.order_id}</strong></div>
          <div className="row"><span>Nominal</span><strong>{formatIDR(trx.amount)}</strong></div>
          <div className="row"><span>Metode</span><strong>{trx.method}</strong></div>
          <div className="row"><span>Waktu</span><strong>{formatDate(trx.created_at)}</strong></div>
          <div className="row"><span>Status</span><strong>{statusLabel(status)}</strong></div>
        </div>

        <div className="actions">
          <Link to="/" className="btn btn-primary btn-block">Kembali ke Beranda</Link>
          {(status === 'failed' || status === 'expired') && (
            <Link to="/topup" className="btn btn-outline btn-block mt-16">Coba Lagi</Link>
          )}
        </div>
      </div>
    </div>
  );
}
