import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, type BidRow } from '../lib/supabase';
import { logoUrl, filmData } from '../data/auction';
import AdminLogin from '../components/admin/AdminLogin';
import { useSeo } from '../lib/seo';

type SortKey = 'bid_amount' | 'created_at';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * PROTECTED — Owner-only bid dashboard.
 * Renders the login form until a Supabase Auth session exists; then lists every
 * binding bid in one view. Row-Level Security ensures bids are only readable by
 * an authenticated user, so the data is protected even if this route is reached
 * directly.
 */
export default function Admin() {
  useSeo({
    title: 'Bid Dashboard — York Screenplay',
    description: 'Owner-only bid dashboard.',
    path: '/admin',
    noindex: true,
  });

  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [bids, setBids] = useState<BidRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('bid_amount');

  // Track auth session.
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setCheckingSession(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadBids = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError('');
    const { data, error: qErr } = await supabase
      .from('bids')
      .select('*')
      .order(sortKey, { ascending: false });
    setLoading(false);
    if (qErr) {
      setError('Could not load bids. ' + qErr.message);
      return;
    }
    setBids((data as BidRow[]) ?? []);
  }, [sortKey]);

  // Load (and reload on sort change) once authenticated.
  useEffect(() => {
    if (session) loadBids();
  }, [session, loadBids]);

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setBids([]);
  };

  if (!isSupabaseConfigured) {
    return (
      <main id="main-content" tabIndex={-1} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem' }}>
        <p style={{ color: 'var(--color-muted)', maxWidth: '420px', textAlign: 'center', lineHeight: 1.7 }}>
          The admin dashboard is not configured. Add <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, then restart the dev server.
        </p>
      </main>
    );
  }

  if (checkingSession) {
    return (
      <main id="main-content" tabIndex={-1} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 24, height: 24, border: '1.5px solid var(--color-line)', borderTopColor: 'var(--color-gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  if (!session) return <AdminLogin />;

  const highest = bids.reduce((max, b) => Math.max(max, b.bid_amount), 0);

  const th: CSSProperties = {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--color-muted)',
    borderBottom: '1px solid var(--color-line)',
    whiteSpace: 'nowrap',
  };
  const td: CSSProperties = {
    padding: '0.85rem 1rem',
    fontSize: '0.85rem',
    color: 'var(--color-paper)',
    borderBottom: '1px solid rgba(240,230,210,0.05)',
    verticalAlign: 'top',
  };
  const sortBtn = (key: SortKey, label: string) => (
    <button
      onClick={() => setSortKey(key)}
      style={{
        background: sortKey === key ? 'rgba(212,168,67,0.12)' : 'none',
        border: '1px solid ' + (sortKey === key ? 'rgba(212,168,67,0.4)' : 'var(--color-line)'),
        color: sortKey === key ? 'var(--color-gold)' : 'var(--color-muted)',
        borderRadius: '2px',
        padding: '0.4rem 0.9rem',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  return (
    <main id="main-content" tabIndex={-1} style={{ minHeight: '100vh', padding: 'clamp(1.75rem, 5vh, 3rem) clamp(1.25rem, 4vw, 3rem) 4rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Logo bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(212,168,67,0.15)' }}>
          <Link
            to="/"
            aria-label={`${filmData.title} — Home`}
            data-cursor-label="HOME"
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <img
              src={logoUrl}
              alt={filmData.title}
              style={{ height: '72px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 12px rgba(212,168,67,0.25))' }}
            />
          </Link>
          <button
            onClick={signOut}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,168,67,0.14)'; e.currentTarget.style.borderColor = 'rgba(212,168,67,0.6)'; e.currentTarget.style.color = 'var(--color-gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212,168,67,0.06)'; e.currentTarget.style.borderColor = 'rgba(212,168,67,0.35)'; e.currentTarget.style.color = 'var(--color-paper)'; }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(212,168,67,0.06)',
              border: '1px solid rgba(212,168,67,0.35)',
              color: 'var(--color-paper)',
              borderRadius: '2px',
              padding: '0.6rem 1.15rem',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.62rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Sign Out
          </button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '0.5rem' }}>Owner Dashboard</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--color-paper)', fontWeight: 500 }}>
            Binding Bids
          </h1>
        </div>

        {/* Summary + controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            <div>
              <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-muted)', fontFamily: 'var(--font-ui)', marginBottom: '0.3rem' }}>Total Bids</div>
              <div className="tabular-nums" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--color-paper)' }}>{bids.length}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-muted)', fontFamily: 'var(--font-ui)', marginBottom: '0.3rem' }}>Highest Offer</div>
              <div className="tabular-nums" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--color-gold)' }}>{highest ? formatCurrency(highest) : '—'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-muted)', fontFamily: 'var(--font-ui)' }}>Sort</span>
            {sortBtn('bid_amount', 'Amount')}
            {sortBtn('created_at', 'Newest')}
            <button
              onClick={loadBids}
              style={{ background: 'none', border: '1px solid var(--color-line)', color: 'var(--color-muted)', borderRadius: '2px', padding: '0.4rem 0.9rem', fontFamily: 'var(--font-ui)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer' }}
            >
              Refresh
            </button>
          </div>
        </div>

        {error && <p role="alert" style={{ color: 'var(--color-live)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

        {/* Table */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-line)', borderRadius: '3px', background: 'var(--color-surface)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '860px' }}>
            <thead>
              <tr>
                <th style={th}>Bid</th>
                <th style={th}>Name</th>
                <th style={th}>Job Title</th>
                <th style={th}>Company</th>
                <th style={th}>Phone</th>
                <th style={th}>Email</th>
                <th style={th}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td style={td} colSpan={7}>Loading…</td></tr>
              ) : bids.length === 0 ? (
                <tr><td style={{ ...td, color: 'var(--color-muted)' }} colSpan={7}>No bids yet.</td></tr>
              ) : (
                bids.map((b) => (
                  <tr key={b.id}>
                    <td style={{ ...td, color: 'var(--color-gold)', fontWeight: 600, whiteSpace: 'nowrap' }} className="tabular-nums">{formatCurrency(b.bid_amount)}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{b.name}</td>
                    <td style={td}>{b.job_title}</td>
                    <td style={td}>{b.company}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}><a href={`tel:${b.phone}`} style={{ color: 'var(--color-paper)' }}>{b.phone}</a></td>
                    <td style={td}><a href={`mailto:${b.email}`} style={{ color: 'var(--color-paper)', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'rgba(212,168,67,0.3)' }}>{b.email}</a></td>
                    <td style={{ ...td, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{formatDate(b.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
