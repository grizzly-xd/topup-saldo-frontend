import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import TopUp from './pages/TopUp';
import History from './pages/History';
import Balance from './pages/Balance';
import Profile from './pages/Profile';
import Help from './pages/Help';
import PaymentStatus from './pages/PaymentStatus';

export default function App() {
  const { loading } = useAuth();
  if (loading) return <div className="page-loader">Memuat…</div>;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/help" element={<Help />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/topup" element={<TopUp />} />
          <Route path="/history" element={<History />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment/:orderId" element={<PaymentStatus />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
