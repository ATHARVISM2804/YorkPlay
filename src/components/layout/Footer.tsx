import { Link } from 'react-router-dom';
import { filmData, navLinks, socialLinks, auctionConfig, logoUrl } from '../../data/auction';
import Countdown from '../ui/Countdown';

/**
 * Frontier-styled footer — warm, dignified, period-appropriate.
 */
export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-line)',
        backgroundColor: 'var(--color-ink)',
        padding: 'clamp(3rem, 6vh, 6rem) clamp(1.25rem, 4vw, 3rem)',
        position: 'relative',
      }}
    >
      {/* Subtle warm glow at top border */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)',
      }} />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
        }}
      >
        {/* Brand */}
        <div>
          <img 
            src={logoUrl} 
            alt={filmData.title} 
            style={{ 
              height: '100px', 
              width: 'auto', 
              objectFit: 'contain', 
              marginBottom: '1rem',
              display: 'block'
            }} 
          />
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
            {filmData.tagline}
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-muted)',
              marginBottom: '1rem',
            }}
          >
            Navigate
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {navLinks.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--color-paper)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Auction Timer */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-muted)',
              marginBottom: '1rem',
            }}
          >
            Auction Closes In
          </h4>
          <Countdown targetDate={auctionConfig.auctionEndDate} />
        </div>

        {/* Social / Contact */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-muted)',
              marginBottom: '1rem',
            }}
          >
            Connect
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a
              href={`mailto:${socialLinks.email}`}
              style={{ fontSize: '0.875rem', color: 'var(--color-paper)', textDecoration: 'none' }}
            >
              {socialLinks.email}
            </a>
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.875rem', color: 'var(--color-muted)', textDecoration: 'none' }}
            >
              Twitter / X
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.875rem', color: 'var(--color-muted)', textDecoration: 'none' }}
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '3rem auto 0',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <p style={{ fontSize: '0.6875rem', color: 'var(--color-muted)', fontFamily: 'var(--font-ui)' }}>
          © {new Date().getFullYear()} {filmData.title}. All rights reserved.
        </p>
        <p style={{ fontSize: '0.6875rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>
          Private auction. Invitation only.
        </p>
      </div>
    </footer>
  );
}
