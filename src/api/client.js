import { auth } from '../firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request gagal (${res.status})`);
  }
  return data;
}

export const api = {
  // Profil
  getProfile: () => request('/profile'),
  updateProfile: (body) => request('/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Saldo
  getBalance: () => request('/balance'),
  getBalanceHistory: () => request('/balance/history'),

  // Top up
  getTopupOptions: () => request('/topup/options'),
  createTransaction: (body) =>
    request('/topup/create', { method: 'POST', body: JSON.stringify(body) }),
  getTransactionStatus: (orderId) => request(`/transactions/${orderId}`),
  getTransactions: () => request('/transactions'),

  // Bantuan
  getFaq: () => request('/help/faq'),
};
