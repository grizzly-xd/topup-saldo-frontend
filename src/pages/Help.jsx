import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Skeleton from '../components/Skeleton';

export default function Help() {
  const [faq, setFaq] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getFaq();
        setFaq(data.items || []);
      } catch {
        setFaq([]);
      }
    })();
  }, []);

  return (
    <div className="page">
      <h1>Bantuan</h1>

      <section className="card">
        <h3>FAQ</h3>
        {!faq ? (
          <Skeleton className="skeleton-card" />
        ) : faq.length === 0 ? (
          <p className="muted">FAQ belum tersedia.</p>
        ) : (
          faq.map((f, i) => (
            <div key={i} className="faq-item" onClick={() => setOpen(open === i ? null : i)}>
              <div className="faq-q">{f.q}<span>{open === i ? '−' : '+'}</span></div>
              {open === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))
        )}
      </section>

      <section className="card">
        <h3>Panduan Pembayaran</h3>
        <ol className="steps">
          <li>Pilih menu <b>Top Up Saldo</b>.</li>
          <li>Tentukan nominal top up.</li>
          <li>Pilih metode pembayaran yang tersedia.</li>
          <li>Klik <b>Bayar Sekarang</b>.</li>
          <li>Ikuti instruksi pada halaman Midtrans Snap.</li>
          <li>Saldo otomatis bertambah setelah pembayaran terverifikasi.</li>
        </ol>
      </section>

      <section className="card">
        <h3>Customer Service</h3>
        <p>Email: <a href="mailto:support@topupku.id">support@topupku.id</a></p>
        <p>WhatsApp: <a href="https://wa.me/628211360302">+62 8211-3603-02</a></p>
      </section>
    </div>
  );
}
