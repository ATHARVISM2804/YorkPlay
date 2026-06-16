import { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { filmData, scriptData } from '../data/auction';
import scriptBgImage from '../assets/script_bg.png';
import MagneticButton from '../components/ui/MagneticButton';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * PAGE 3 — THE MANUSCRIPT
 * Cinematic, narrative-driven page with proper alignment.
 * Section 1: Full-viewport hero with headline + stats
 * Section 2: The vault card with context
 */
export default function Script() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Entrance Animation
  useLayoutEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.script-hero-bg',
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 2.5, ease: 'power2.out' }
      );

      gsap.fromTo('.script-hero-content > *',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.6 }
      );

      gsap.fromTo('.script-vault-section',
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.3 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <main id="main-content" tabIndex={-1} ref={containerRef}>

      {/* Scoped styles */}
      <style>{`
        .script-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          border-top: 1px solid rgba(212,168,67,0.15);
          padding-top: 2rem;
          margin-top: 2rem;
        }
        .script-vault-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          max-width: 1100px;
          margin: 0 auto;
          align-items: center;
        }
        @media (min-width: 768px) {
          .script-vault-grid {
            grid-template-columns: 1fr 1fr;
            gap: 5rem;
          }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — HERO: Full-viewport cinematic intro
          ════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background Image — fixed to this section only */}
        <div
          className="script-hero-bg"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <img
            src={scriptBgImage}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
              filter: 'brightness(0.3) contrast(1.15) saturate(0.85)',
            }}
          />
          {/* Dark overlay for text readability */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(180deg, rgba(11,10,8,0.6) 0%, rgba(11,10,8,0.3) 40%, rgba(11,10,8,0.8) 100%),
              radial-gradient(ellipse at 50% 80%, rgba(212,168,67,0.06) 0%, transparent 60%)
            `,
          }} />
        </div>

        {/* Hero Content — Centered */}
        <div
          className="script-hero-content"
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '800px',
            textAlign: 'center',
            padding: 'clamp(6rem, 12vh, 10rem) clamp(1.5rem, 5vw, 3rem)',
          }}
        >
          <span className="eyebrow" style={{
            display: 'block',
            marginBottom: '1.5rem',
            color: 'var(--color-gold)',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
          }}>
            The Manuscript
          </span>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 1.05,
            marginBottom: '1.5rem',
            color: 'var(--color-paper)',
          }}>
            Hidden in the margins of history.
          </h1>

          <p style={{
            color: 'var(--color-muted)',
            fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
            lineHeight: 1.8,
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
          }}>
            The untold truth of the Lewis &amp; Clark expedition, told through the eyes
            of the only man who wasn't free. This manuscript is more than a screenplay—it's
            a visceral, emotional journey into the heart of the American frontier.
          </p>

          {/* Stats Row */}
          <div className="script-stats-grid" style={{ maxWidth: '420px', margin: '0 auto' }}>
            <div>
              <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-muted)', marginBottom: '0.35rem', fontFamily: 'var(--font-ui)' }}>Genre</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-gold)' }}>{filmData.genre}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-muted)', marginBottom: '0.35rem', fontFamily: 'var(--font-ui)' }}>Length</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-gold)' }}>{filmData.pageCount} Pages</p>
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-muted)', marginBottom: '0.35rem', fontFamily: 'var(--font-ui)' }}>Status</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-gold)' }}>{filmData.draftStatus}</p>
            </div>
          </div>

          {/* Scroll cue */}
          <div style={{ marginTop: 'clamp(3rem, 6vh, 5rem)' }}>
            <span style={{
              fontSize: '0.55rem',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'var(--color-muted)',
              fontFamily: 'var(--font-ui)',
            }}>
              Read below ↓
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — THE VAULT: Context + Journal Card
          ════════════════════════════════════════════════════════════ */}
      <section
        className="script-vault-section"
        style={{
          position: 'relative',
          padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 5vw, 4rem)',
          background: 'linear-gradient(180deg, var(--color-bg) 0%, rgba(22,20,18,1) 50%, var(--color-bg) 100%)',
        }}
      >
        {/* Subtle ambient glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="script-vault-grid" style={{ position: 'relative', zIndex: 1 }}>

          {/* Left: Context & Narrative */}
          <div>
            <span className="eyebrow" style={{
              display: 'block',
              marginBottom: '1rem',
              color: 'var(--color-gold)',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
            }}>
              Open the Vault
            </span>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              color: 'var(--color-paper)',
            }}>
              A story erased from the ledgers. A voice silenced by history.
            </h2>

            <p style={{
              color: 'var(--color-muted)',
              fontSize: '0.95rem',
              lineHeight: 1.85,
              marginBottom: '1.5rem',
            }}>
              York was the first African American to cross the continent and reach the Pacific.
              He hunted, he scouted, he voted alongside the Corps of Discovery—the only expedition
              in U.S. history where a Black man was given an equal vote.
            </p>

            <p style={{
              color: 'var(--color-muted)',
              fontSize: '0.95rem',
              lineHeight: 1.85,
              marginBottom: '1.5rem',
            }}>
              And when the expedition ended, William Clark refused to free him. York spent years
              petitioning for the liberty he had earned with his own body. This screenplay captures
              every moment—the wonder, the betrayal, the defiance.
            </p>

            <p style={{
              color: 'var(--color-muted)',
              fontSize: '0.95rem',
              lineHeight: 1.85,
              marginBottom: '2rem',
            }}>
              132 pages. Written in the language of the frontier. Formatted in industry-standard
              screenplay structure. Ready for the screen.
            </p>

            {/* Decorative separator */}
            <div style={{
              width: '60px',
              height: '1px',
              background: 'linear-gradient(90deg, var(--color-gold), transparent)',
              marginBottom: '1.5rem',
            }} />

            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              color: 'rgba(212,168,67,0.6)',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}>
              "I walked where no man of my color had walked before. I will not be forgotten."
            </p>
          </div>

          {/* Right: The Vault Card */}
          <div ref={vaultRef}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '420px',
                margin: '0 auto',
                minHeight: '480px',
                backgroundColor: '#161412',
                border: '1px solid rgba(212,168,67,0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'default',
                transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.5s ease, box-shadow 0.5s ease',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 2px 20px rgba(212,168,67,0.05)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-8px) scale(1.01)';
                el.style.borderColor = 'rgba(212,168,67,0.45)';
                el.style.boxShadow = '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(212,168,67,0.08), inset 0 2px 30px rgba(212,168,67,0.08)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0) scale(1)';
                el.style.borderColor = 'rgba(212,168,67,0.2)';
                el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.6), inset 0 2px 20px rgba(212,168,67,0.05)';
              }}
            >
              {/* Embossed title */}
              <div style={{
                padding: '2rem 1.5rem 1.25rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: 'linear-gradient(180deg, rgba(212,168,67,0.05) 0%, transparent 100%)',
                textAlign: 'center',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.6rem',
                  fontWeight: 300,
                  color: 'rgba(212,168,67,0.75)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                }}>
                  {filmData.title}
                </h3>
                <p style={{
                  fontSize: '0.6rem',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontFamily: 'var(--font-ui)',
                }}>
                  {filmData.draftStatus} · {filmData.genre}
                </p>
              </div>

              {/* Teaser lines — screenplay format */}
              <div style={{
                flex: 1,
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: '0.75rem',
                lineHeight: 1.8,
                color: 'rgba(240,230,210,0.45)',
                textAlign: 'left',
              }}>
                {scriptData.teaserLines.map((line, i) => (
                  <div key={i} style={{ minHeight: '1.4em', marginBottom: '0.4em' }}>
                    {line}
                  </div>
                ))}
                {/* Fade overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '75%',
                  background: 'linear-gradient(to top, #161412 15%, transparent 100%)',
                  pointerEvents: 'none',
                }} />
              </div>

              {/* Terms checkbox */}
              <div style={{
                padding: '1rem 1.5rem',
                backgroundColor: 'rgba(0,0,0,0.25)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}>
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{
                    width: '14px',
                    height: '14px',
                    marginTop: '2px',
                    accentColor: 'var(--color-gold)',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
                <label
                  htmlFor="accept-terms"
                  style={{
                    fontSize: '0.7rem',
                    color: termsAccepted ? 'var(--color-gold)' : 'var(--color-muted)',
                    lineHeight: 1.5,
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {scriptData.viewingTerms}
                </label>
              </div>

              {/* Read Script Button */}
              <div style={{
                padding: '0 1.5rem 1.5rem',
                backgroundColor: 'rgba(0,0,0,0.25)',
                textAlign: 'center',
              }}>
                <MagneticButton
                  href={scriptData.googleDocsUrl}
                  target="_blank"
                  variant="primary"
                  disabled={!termsAccepted}
                  id="read-script-btn"
                >
                  Unlock Manuscript
                </MagneticButton>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
