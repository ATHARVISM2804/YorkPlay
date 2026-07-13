import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks, filmData, auctionConfig, logoUrl, audioUrl } from '../../data/auction';
import Countdown from '../ui/Countdown';

/**
 * Fixed navigation bar — frontier-styled.
 * Transparent over hero, gains blur on scroll.
 * Period-appropriate language, compass motif.
 */
export default function Nav() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);



  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);



  // Attempt autoplay on mount, handle browser block
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Browser blocked autoplay — start on first user interaction
          setIsPlaying(false);
          const startAudio = () => {
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
            document.removeEventListener('click', startAudio);
            document.removeEventListener('touchstart', startAudio);
            document.removeEventListener('keydown', startAudio);
          };
          document.addEventListener('click', startAudio, { once: true });
          document.addEventListener('touchstart', startAudio, { once: true });
          document.addEventListener('keydown', startAudio, { once: true });
        });
      }
    }
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop />
      {/* Skip link */}
      <a href="#main-content" className="visually-hidden" style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 100001, background: 'var(--color-gold)', color: 'var(--color-ink)', padding: '0.5rem 1rem', borderRadius: '2px' }}>
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '0 clamp(1.25rem, 4vw, 3rem)',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        maxWidth: '100vw',
          overflow: 'hidden',
          transition: 'background-color 0.5s ease, backdrop-filter 0.5s ease',
          backgroundColor: scrolled ? 'rgba(11,10,8,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-line)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
          aria-label={`${filmData.title} — Home`}
        >
          <img
            src={logoUrl}
            alt={filmData.title}
            style={{
              height: '64px',
              width: 'auto',
              objectFit: 'contain',
              transform: 'translateY(2px)', // Optical alignment
            }}
          />
        </Link>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="nav-desktop"
        >
          {navLinks.map(link => {
            const isActive = !link.external && location.pathname === link.path;
            const sharedStyle = {
              fontFamily: 'var(--font-ui)',
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.18em',
              color: isActive ? 'var(--color-paper)' : 'var(--color-muted)',
              textDecoration: 'none',
              position: 'relative' as const,
              paddingBottom: '4px',
              transition: 'color 0.3s ease',
            };
            const children = (
              <>
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      backgroundColor: 'var(--color-gold)',
                      borderRadius: '1px',
                    }}
                  />
                )}
              </>
            );
            if (link.external) {
              return (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={sharedStyle}
                >
                  {children}
                </a>
              );
            }
            return (
              <Link
                key={link.path}
                to={link.path}
                style={sharedStyle}
              >
                {children}
              </Link>
            );
          })}

          {/* Live Status Chip */}
          {auctionConfig.isLive && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '100px',
                backgroundColor: 'rgba(196,75,47,0.08)',
                border: '1px solid rgba(196,75,47,0.15)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-live)',
                  animation: 'livePulse 2s ease-in-out infinite',
                }}
              />
              <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-live)', fontFamily: 'var(--font-ui)' }}>
                Live
              </span>
              <Countdown targetDate={auctionConfig.auctionEndDate} compact />
            </div>
          )}
        </div>

        {/* Right Action Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)', zIndex: 1003 }}>
          {/* Audio Toggle Button - Creative Waveform */}
          <button
            onClick={toggleAudio}
            data-cursor-label={isPlaying ? "MUTE" : "PLAY"}
            style={{
              background: isPlaying ? 'rgba(212,168,67,0.05)' : 'none',
              border: isPlaying ? '1px solid rgba(212,168,67,0.4)' : '1px solid var(--color-line)',
              color: isPlaying ? 'var(--color-gold)' : 'var(--color-muted)',
              borderRadius: '20px',
              padding: '0.4rem 0.5rem',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              flexShrink: 0,
              boxShadow: isPlaying ? '0 0 15px rgba(212,168,67,0.15)' : 'none',
            }}
            aria-label={isPlaying ? "Mute Background Audio" : "Play Background Audio"}
          >
            {/* Animated Waveform Icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '12px' }}>
              <div style={{
                width: '2px',
                height: isPlaying ? '12px' : '3px',
                backgroundColor: 'currentColor',
                borderRadius: '1px',
                transition: 'height 0.2s ease',
                animation: isPlaying ? 'wave 1s ease-in-out infinite' : 'none',
                animationDelay: '0s'
              }} />
              <div style={{
                width: '2px',
                height: isPlaying ? '12px' : '3px',
                backgroundColor: 'currentColor',
                borderRadius: '1px',
                transition: 'height 0.2s ease',
                animation: isPlaying ? 'wave 1s ease-in-out infinite' : 'none',
                animationDelay: '0.2s'
              }} />
              <div style={{
                width: '2px',
                height: isPlaying ? '12px' : '3px',
                backgroundColor: 'currentColor',
                borderRadius: '1px',
                transition: 'height 0.2s ease',
                animation: isPlaying ? 'wave 1s ease-in-out infinite' : 'none',
                animationDelay: '0.4s'
              }} />
            </div>
            
            <span 
              className="hide-on-mobile" 
              style={{ 
                fontFamily: 'var(--font-ui)', 
                fontSize: '0.6rem', 
                fontWeight: 600, 
                letterSpacing: '0.15em',
                paddingLeft: '2px'
              }}
            >
              {isPlaying ? 'AUDIO ON' : 'AUDIO OFF'}
            </span>
          </button>
          
          {/* Waveform Keyframes */}
          <style>{`
            @keyframes wave {
              0%, 100% { height: 4px; }
              50% { height: 12px; }
            }
          `}</style>

          {/* Place Bid Button */}
          <Link
            to="/#bid-console"
            onClick={() => {
              // If already on homepage, scroll to bid console
              if (location.pathname === '/') {
                const el = document.getElementById('bid-console');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{
              background: 'linear-gradient(135deg, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.05) 100%)',
              border: '1px solid rgba(212,168,67,0.5)',
              borderRadius: '20px',
              padding: '0.4rem clamp(0.5rem, 2vw, 1rem)',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--color-gold)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 15px rgba(212,168,67,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212,168,67,0.3) 0%, rgba(212,168,67,0.1) 100%)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(212,168,67,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.05) 100%)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(212,168,67,0.1)';
            }}
          >
            {/* Gavel icon */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 3.5L20.5 9.5" />
              <path d="M11.5 6.5L17.5 12.5" />
              <path d="M8 10L16 2" />
              <path d="M2 22L10 14" />
              <path d="M2 22H8V16" />
            </svg>
            <span>Place Bid</span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              zIndex: 1002,
            }}
          >
            <div style={{ width: '24px', height: '16px', position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 0, right: 0, height: '1.5px', backgroundColor: 'var(--color-paper)',
                top: menuOpen ? '7px' : '0', transform: menuOpen ? 'rotate(45deg)' : 'none',
                transition: 'all 0.3s ease',
              }} />
              <span style={{
                position: 'absolute', left: 0, right: 0, height: '1.5px', backgroundColor: 'var(--color-paper)',
                top: '7px', opacity: menuOpen ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }} />
              <span style={{
                position: 'absolute', left: 0, right: 0, height: '1.5px', backgroundColor: 'var(--color-paper)',
                top: menuOpen ? '7px' : '14px', transform: menuOpen ? 'rotate(-45deg)' : 'none',
                transition: 'all 0.3s ease',
              }} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          backgroundColor: 'var(--color-ink)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
        }}
      >
        {navLinks.map((link, i) => {
          const sharedStyle = {
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 400,
            fontStyle: 'italic' as const,
            color: (!link.external && location.pathname === link.path) ? 'var(--color-gold)' : 'var(--color-paper)',
            textDecoration: 'none',
            transform: menuOpen ? 'translateY(0)' : 'translateY(30px)',
            opacity: menuOpen ? 1 : 0,
            transition: `transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s, opacity 0.4s ease ${i * 0.08}s, color 0.3s ease`,
          };
          if (link.external) {
            return (
              <a
                key={link.path}
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={menuOpen ? 0 : -1}
                style={sharedStyle}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            );
          }
          return (
            <Link
              key={link.path}
              to={link.path}
              tabIndex={menuOpen ? 0 : -1}
              style={sharedStyle}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}

        {auctionConfig.isLive && (
          <div style={{ marginTop: '1rem' }}>
            <Countdown targetDate={auctionConfig.auctionEndDate} compact />
          </div>
        )}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
        @media (max-width: 480px) {
          .focus-btn-text { display: none !important; }
          .hide-on-mobile { display: none !important; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
      `}</style>
    </>
  );
}
