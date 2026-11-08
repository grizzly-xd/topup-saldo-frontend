import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const { user } = useAuth();
  return (
    <nav className="bottom-nav">
      <NavLink to="/">🏠<span>Beranda</span></NavLink>
      {user ? (
        <>
          <NavLink to="/topup">➕<span>Top Up</span></NavLink>
          <NavLink to="/history">📜<span>Riwayat</span></NavLink>
          <NavLink to="/balance">💰<span>Saldo</span></NavLink>
        </>
      ) : (
        <NavLink to="/login">🔐<span>Masuk</span></NavLink>
      )}
      <NavLink to="/help">❓<span>Bantuan</span></NavLink>
    </nav>
  );
}
