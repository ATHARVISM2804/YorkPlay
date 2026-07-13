import { Link } from 'react-router-dom';
import { filmData, navLinks, socialLinks, auctionConfig, logoUrl } from '../../data/auction';
import Countdown from '../ui/Countdown';

/**
 * Premium cinematic footer — balanced size, creative, themed.
 */
export default function Footer() {
  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.7rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    color: 'var(--color-muted)',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  };

  return (
    <footer style={{
      backgroundColor: '#050403',
      position: 'relative',
      borderTop: '1px solid rgba(212,168,67,0.15)',
    }}>
      {/* Gold glow edge */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '50%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.5), transparent)',
        boxShadow: '0 0 20px rgba(212,168,67,0.3)',
      }} />

      {/* ── Top Band: Logo Centered ── */}
      <div style={{
        padding: '3.5rem 2rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <img
          src={logoUrl}
          alt={filmData.title}
          style={{ height: '130px', width: 'auto', objectFit: 'contain', marginBottom: '1rem' }}
        />
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          color: 'rgba(212,168,67,0.45)',
          fontStyle: 'italic',
          letterSpacing: '0.05em',
        }}>
          {filmData.tagline}
        </p>
      </div>

      {/* ── Middle Band: 3-Column Grid ── */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '3rem clamp(1.5rem, 4vw, 3rem)',
      }}>
        <style>{`
          .footer-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }
          @media (min-width: 700px) {
            .footer-grid {
              grid-template-columns: 1fr auto 1fr;
              text-align: left;
            }
            .footer-grid > *:last-child {
              text-align: right;
            }
            .footer-grid > *:nth-child(2) {
              text-align: center;
            }
          }
        `}</style>

        <div className="footer-grid">
          {/* Col 1: Navigate */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'var(--color-gold)',
              marginBottom: '1.25rem',
            }}>
              Navigate
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {navLinks.map(link =>
                link.external ? (
                  <a
                    key={link.path}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-gold)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={linkStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-gold)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; }}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Col 2: Auction Countdown */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'var(--color-gold)',
              marginBottom: '1rem',
            }}>
              Auction Closes In
            </h4>
            <div style={{
              padding: '1.25rem 2rem',
              background: 'linear-gradient(180deg, rgba(212,168,67,0.04) 0%, transparent 100%)',
              border: '1px solid rgba(212,168,67,0.1)',
              borderRadius: '2px',
            }}>
              <Countdown targetDate={auctionConfig.auctionEndDate} />
            </div>
          </div>

          {/* Col 3: Connect */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'var(--color-gold)',
              marginBottom: '1.25rem',
            }}>
              Connect
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <a
                href={`mailto:${socialLinks.email}`}
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-gold)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; }}
              >
                {socialLinks.email}
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-gold)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; }}
              >
                Twitter / X
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '1rem clamp(1.5rem, 4vw, 3rem)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <p style={{
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.2)',
          fontFamily: 'var(--font-ui)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          © {new Date().getFullYear()} {filmData.title}. All rights reserved.
        </p>
        <p style={{
          fontSize: '0.6rem',
          color: 'rgba(212,168,67,0.4)',
          fontStyle: 'italic',
          letterSpacing: '0.08em',
        }}>
          Private auction · Invitation only
        </p>
      </div>
    </footer>
  );
}
