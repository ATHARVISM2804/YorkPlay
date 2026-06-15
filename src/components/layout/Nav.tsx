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
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Listen to focus mode class changes on body
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setFocusModeActive(document.body.classList.contains('focus-mode-active'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
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

  const toggleFocusMode = () => {
    window.dispatchEvent(new CustomEvent('toggle-focus-mode'));
  };

  // Attempt autoplay on mount, handle browser block
  useEffect(() => {
    if (audioRef.current) {
      // Set volume lower for ambient background
      audioRef.current.volume = 0.3;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented by browser
          setIsPlaying(false);
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
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: isActive ? 'var(--color-paper)' : 'var(--color-muted)',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px',
                  transition: 'color 0.3s ease',
                }}
              >
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1003 }}>
          {/* Audio Toggle Button - Creative Waveform */}
          <button
            onClick={toggleAudio}
            data-cursor-label={isPlaying ? "MUTE" : "PLAY"}
            style={{
              background: isPlaying ? 'rgba(212,168,67,0.05)' : 'none',
              border: isPlaying ? '1px solid rgba(212,168,67,0.4)' : '1px solid var(--color-line)',
              color: isPlaying ? 'var(--color-gold)' : 'var(--color-muted)',
              borderRadius: '20px',
              padding: '0.4rem 0.6rem',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
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

          {/* Cinematic Focus Mode Button */}
          <button
            onClick={toggleFocusMode}
            data-cursor-label={focusModeActive ? "EXIT" : "FOCUS"}
            style={{
              background: 'none',
              border: focusModeActive ? '1px solid var(--color-gold)' : '1px solid var(--color-line)',
              borderRadius: '20px',
              padding: '0.35rem 0.85rem',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: focusModeActive ? 'var(--color-gold)' : 'var(--color-paper)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
              pointerEvents: 'auto',
            }}
            className="focus-highlight-element"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              {focusModeActive ? (
                <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M3 1H1V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M7 1H9V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M3 9H1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M7 9H9V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="5" cy="5" r="1" fill="currentColor" />
                </>
              )}
            </svg>
            <span className="focus-btn-text">{focusModeActive ? 'Exit Cinema' : 'Cinema Mode'}</span>
          </button>

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
        {navLinks.map((link, i) => (
          <Link
            key={link.path}
            to={link.path}
            tabIndex={menuOpen ? 0 : -1}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: location.pathname === link.path ? 'var(--color-gold)' : 'var(--color-paper)',
              textDecoration: 'none',
              transform: menuOpen ? 'translateY(0)' : 'translateY(30px)',
              opacity: menuOpen ? 1 : 0,
              transition: `transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s, opacity 0.4s ease ${i * 0.08}s, color 0.3s ease`,
            }}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

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
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
      `}</style>
    </>
  );
}
