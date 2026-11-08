export const formatIDR = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);

export const formatDate = (ts) => {
  if (!ts) return '-';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export const statusLabel = (s) => ({
  pending: 'Menunggu Pembayaran',
  success: 'Berhasil',
  failed: 'Gagal',
  expired: 'Kedaluwarsa',
}[s] || s);
