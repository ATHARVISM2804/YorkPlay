import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { logoUrl, filmData } from '../../data/auction';
import MagneticButton from '../ui/MagneticButton';

/**
 * Owner sign-in for the admin dashboard (Supabase Auth, email + password).
 * On success, the parent Admin page picks up the session via onAuthStateChange.
 */
export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!isSupabaseConfigured || !supabase) {
      setError('Admin access is not configured. Set your Supabase environment variables.');
      return;
    }

    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (authError) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--color-ink)',
    border: '1px solid var(--color-line)',
    borderRadius: '2px',
    color: 'var(--color-paper)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    outline: 'none',
  };
  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--color-muted)',
    marginBottom: '0.4rem',
    fontFamily: 'var(--font-ui)',
    fontWeight: 500,
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '4rem 1.5rem 3rem',
      }}
    >
      {/* Logo */}
      <Link to="/" aria-label={`${filmData.title} — Home`} style={{ display: 'inline-flex' }}>
        <img
          src={logoUrl}
          alt={filmData.title}
          style={{ height: '84px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 14px rgba(212,168,67,0.3))' }}
        />
      </Link>

      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '380px',
          background: 'var(--color-surface)',
          border: '1px solid rgba(212,168,67,0.2)',
          borderRadius: '3px',
          padding: 'clamp(1.75rem, 4vw, 2.5rem)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        <span className="eyebrow" style={{ display: 'block', marginBottom: '0.6rem' }}>
          Owner Access
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            color: 'var(--color-paper)',
            marginBottom: '1.75rem',
            fontWeight: 500,
          }}
        >
          Bid Dashboard
        </h1>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="admin-email" style={labelStyle}>Email</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="admin-password" style={labelStyle}>Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <MagneticButton type="submit" variant="primary" disabled={loading} id="admin-login-btn">
          {loading ? 'Signing in…' : 'Sign In'}
        </MagneticButton>

        {error && (
          <p role="alert" style={{ color: 'var(--color-live)', fontSize: '0.8rem', marginTop: '1rem' }}>
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
