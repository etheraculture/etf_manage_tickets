import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Se già autenticato, vai alla dashboard
  const token = localStorage.getItem('ethera_admin_token');
  if (token) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Inserisci username e password');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/admin/login', { username, password });
      localStorage.setItem('ethera_admin_token', res.data.token);
      toast.success('Accesso effettuato');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Errore di login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(26,107,122,0.15)', border: '1px solid rgba(26,107,122,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: 'var(--color-teal-light)'
          }}>
            <Lock size={28} />
          </div>
          <h1 className="login-title">ACCESSO ADMIN</h1>
          <p className="login-subtitle">Ethera Future Talks — Seconda Edizione 2026</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="form-group">
              <label className="form-label" htmlFor="login-user">Username</label>
              <input
                id="login-user"
                type="text"
                className="form-input"
                placeholder="Inserisci username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-pass">Password</label>
              <input
                id="login-pass"
                type="password"
                className="form-input"
                placeholder="Inserisci password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? (
                <Loader size={20} className="spinner" style={{ border: 'none', width: 20, height: 20 }} />
              ) : (
                <>
                  <LogIn size={20} />
                  Accedi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
