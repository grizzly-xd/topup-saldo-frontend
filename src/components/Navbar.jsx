import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <header className="navbar">
      <Link to="/" className="brand">💳 TopUpKu</Link>
      <nav className="desktop-nav">
        <NavLink to="/">Beranda</NavLink>
        {user && <NavLink to="/topup">Top Up</NavLink>}
        {user && <NavLink to="/history">Riwayat</NavLink>}
        {user && <NavLink to="/balance">Saldo</NavLink>}
        <NavLink to="/help">Bantuan</NavLink>
      </nav>
      <div className="navbar-actions">
        <button className="icon-btn" onClick={toggle} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {user ? (
          <>
            <Link to="/profile" className="btn btn-ghost">{user.displayName || user.email}</Link>
            <button onClick={logout} className="btn btn-ghost">Keluar</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">Masuk</Link>
        )}
      </div>
    </header>
  );
}
