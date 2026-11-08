import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="page home">
      <section className="hero">
        <div className="hero-content">
          <h1>Top Up Saldo Cepat, Aman & Terpercaya</h1>
          <p>Isi saldo digital Anda dalam hitungan detik dengan berbagai metode pembayaran resmi Midtrans.</p>
          <div className="hero-actions">
            {user ? (
              <Link to="/topup" className="btn btn-primary btn-lg">Mulai Top Up</Link>
            ) : (
              <Link to="/login" className="btn btn-primary btn-lg">Masuk Sekarang</Link>
            )}
            <Link to="/help" className="btn btn-outline btn-lg">Pelajari</Link>
          </div>
        </div>
        <div className="hero-illustration" aria-hidden="true">💳⚡</div>
      </section>

      <section className="features">
        <h2>Keunggulan Layanan</h2>
        <div className="feature-grid">
          {[
            { icon: '⚡', title: 'Instan', desc: 'Saldo bertambah otomatis setelah pembayaran terverifikasi.' },
            { icon: '🔒', title: 'Aman', desc: 'Transaksi terenkripsi & diproses oleh Midtrans resmi.' },
            { icon: '💳', title: 'Fleksibel', desc: 'Berbagai metode: VA, E-Wallet, Kartu, Gerai.' },
            { icon: '🕐', title: '24/7', desc: 'Layanan tersedia kapan saja tanpa henti.' },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
