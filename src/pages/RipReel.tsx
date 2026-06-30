import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ripReelData, filmData, timelineEntries } from '../data/auction';
import ripReelBg from '../assets/ripreel_bg.png';
import MagneticButton from '../components/ui/MagneticButton';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Cast & crew data for the "movie credits" section
const castCredits = [
  { role: 'York', description: 'An enslaved man who becomes the first African American to cross the continent. Hunter, scout, diplomat—and the only member of the expedition who returned to chains.' },
  { role: 'William Clark', description: 'York\'s childhood companion turned master. A leader torn between loyalty to his friend and the world that tells him York is property.' },
  { role: 'Meriwether Lewis', description: 'The brilliant, tormented captain. His obsession with the mission blinds him to the injustice unfolding within his own ranks.' },
  { role: 'Sacagawea', description: 'A Shoshone woman whose presence challenges every man in the Corps. She and York share an unspoken understanding of what it means to be invisible.' },
];

const productionDetails = [
  { label: 'Written By', value: 'Award-Winning Screenwriters' },
  { label: 'Genre', value: filmData.genre },
  { label: 'Format', value: `${filmData.pageCount}-Page Feature Screenplay` },
  { label: 'Setting', value: 'American Frontier, 1770–1815' },
  { label: 'Tone', value: 'The Revenant meets 12 Years a Slave' },
  { label: 'Status', value: filmData.draftStatus },
];

/**
 * PAGE 2 — THE EXPEDITION (Rip Reel)
 * Cinematic showcase: Hero background, video player, expedition timeline,
 * cast/character cards, production details, and a closing CTA.
 */
export default function RipReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeEntry, setActiveEntry] = useState(-1);

  // Hero + Video entrance animations
  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero bg
      gsap.fromTo('.ripreel-hero-bg',
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 2.5, ease: 'power2.out' }
      );

      // Hero content stagger
      gsap.fromTo('.ripreel-hero-content > *',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.6 }
      );

      // Video frame reveal
      if (frameRef.current) {
        gsap.fromTo(frameRef.current,
          { clipPath: 'inset(8% 8% 8% 8%)', opacity: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 1.4,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: frameRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Timeline scroll animations
  useEffect(() => {
    if (prefersReducedMotion || !timelineRef.current) return;

    const entries = timelineRef.current.querySelectorAll('.timeline-entry');

    entries.forEach((entry, i) => {
      gsap.fromTo(entry,
        { opacity: 0.15, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: entry,
            start: 'top 75%',
            end: 'top 40%',
            scrub: 0.5,
            onEnter: () => setActiveEntry(i),
            onLeaveBack: () => setActiveEntry(i - 1),
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <main id="main-content" tabIndex={-1} ref={containerRef}>

      {/* Scoped styles */}
      <style>{`
        .ripreel-cast-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .ripreel-cast-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .ripreel-prod-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .ripreel-prod-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .ripreel-cast-card {
          border: 1px solid rgba(212,168,67,0.1);
          border-radius: 4px;
          padding: 2rem;
          background: rgba(22,20,18,0.6);
          transition: border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease;
          backdrop-filter: blur(4px);
        }
        .ripreel-cast-card:hover {
          border-color: rgba(212,168,67,0.35);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,168,67,0.05);
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — HERO: Full-viewport cinematic intro
          ════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Background */}
        <div className="ripreel-hero-bg" style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}>
          <img
            src={ripReelBg}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 35%',
              filter: 'brightness(0.35) contrast(1.15) saturate(0.85)',
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(180deg, rgba(11,10,8,0.5) 0%, rgba(11,10,8,0.2) 40%, rgba(11,10,8,0.85) 100%),
              radial-gradient(ellipse at 50% 80%, rgba(212,168,67,0.06) 0%, transparent 60%)
            `,
          }} />
        </div>

        {/* Hero Content */}
        <div className="ripreel-hero-content" style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '800px',
          textAlign: 'center',
          padding: 'clamp(6rem, 14vh, 10rem) clamp(1.5rem, 5vw, 3rem)',
        }}>
          <span className="eyebrow" style={{
            display: 'block',
            marginBottom: '1.5rem',
            color: 'var(--color-gold)',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
          }}>
            The Expedition
          </span>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 1.05,
            marginBottom: '1.5rem',
            color: 'var(--color-paper)',
          }}>
            Into the unknown. Into the unwritten.
          </h1>

          <p style={{
            color: 'var(--color-muted)',
            fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
            lineHeight: 1.8,
            maxWidth: '580px',
            margin: '0 auto 2.5rem',
          }}>
            {ripReelData.intro}
          </p>

          {/* Scroll cue */}
          <div style={{ marginTop: 'clamp(2rem, 4vh, 3rem)' }}>
            <span style={{
              fontSize: '0.55rem',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'var(--color-muted)',
              fontFamily: 'var(--font-ui)',
            }}>
              Watch below ↓
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 1.5 — FEATURED REELS (Two videos side by side)
          ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(4rem, 8vh, 7rem) clamp(1.25rem, 4vw, 3rem)',
        backgroundColor: 'var(--color-ink)',
        position: 'relative',
      }}>
        {/* Ambient warm glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.03) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vh, 3.5rem)', position: 'relative', zIndex: 1 }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
            Featured Reels
          </span>
          <p style={{
            color: 'var(--color-muted)',
            fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Two proof-of-tone films capturing the spirit and scope of York's journey.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          maxWidth: '1100px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Video 1 — York Rip Reel Final */}
          <div style={{
            border: '1px solid rgba(212,168,67,0.15)',
            borderRadius: '2px',
            overflow: 'hidden',
            backgroundColor: '#000',
            boxShadow: '0 0 60px rgba(0,0,0,0.4), 0 0 30px rgba(212,168,67,0.02)',
          }}>
            <video
              controls
              preload="auto"
              playsInline
              src="https://res.cloudinary.com/dmhabztbf/video/upload/v1782803449/2026_York_Ripreel_Final_cqyxox.mp4#t=0.1"
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div style={{
              padding: '1rem 1.25rem',
              borderTop: '1px solid rgba(212,168,67,0.1)',
            }}>
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'var(--color-gold)',
                marginBottom: '0.35rem',
              }}>
                Rip Reel
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                color: 'var(--color-paper)',
                fontStyle: 'italic',
              }}>
                York — Final Cut
              </p>
            </div>
          </div>

          {/* Video 2 — Private Viewing */}
          <div style={{
            border: '1px solid rgba(212,168,67,0.15)',
            borderRadius: '2px',
            overflow: 'hidden',
            backgroundColor: '#000',
            boxShadow: '0 0 60px rgba(0,0,0,0.4), 0 0 30px rgba(212,168,67,0.02)',
          }}>
            <video
              controls
              preload="auto"
              playsInline
              src="https://res.cloudinary.com/dmhabztbf/video/upload/v1782803479/2026PRIVATE_VIEWING_-__York__Rip_Reel_av6een.mp4#t=0.1"
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div style={{
              padding: '1rem 1.25rem',
              borderTop: '1px solid rgba(212,168,67,0.1)',
            }}>
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'var(--color-gold)',
                marginBottom: '0.35rem',
              }}>
                Private Viewing
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                color: 'var(--color-paper)',
                fontStyle: 'italic',
              }}>
                York — Rip Reel
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — VIDEO PLAYER
          ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(4rem, 8vh, 7rem) clamp(1.25rem, 4vw, 3rem)',
        backgroundColor: 'var(--color-ink)',
        position: 'relative',
      }}>
        {/* Ambient warm glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Video Player */}
          <div
            ref={frameRef}
            data-cursor-label="WATCH"
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              border: '1px solid rgba(212,168,67,0.2)',
              borderRadius: '2px',
              overflow: 'hidden',
              backgroundColor: '#000',
              position: 'relative',
              boxShadow: '0 0 80px rgba(0,0,0,0.5), 0 0 40px rgba(212,168,67,0.03)',
            }}
          >
            {ripReelData.videoType === 'youtube' ? (
              <iframe
                src={ripReelData.videoUrl}
                title={`${filmData.title} — Rip Reel`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            ) : (
              <video
                controls
                preload="none"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src={ripReelData.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Pull Quotes */}
          {ripReelData.pullQuotes.length > 0 && (
            <div style={{
              maxWidth: '700px',
              margin: 'clamp(2rem, 4vh, 4rem) auto 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              textAlign: 'center',
            }}>
              {ripReelData.pullQuotes.map((quote, i) => (
                <blockquote
                  key={i}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'var(--color-muted)',
                    lineHeight: 1.6,
                    borderLeft: '2px solid rgba(212,168,67,0.25)',
                    paddingLeft: '1.5rem',
                    textAlign: 'left',
                  }}
                >
                  {quote}
                </blockquote>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 — EXPEDITION TIMELINE
          ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'var(--spacing-section) clamp(1.25rem, 4vw, 3rem)',
        maxWidth: '700px',
        margin: '0 auto',
        position: 'relative',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vh, 4rem)' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
            The Narrative Arc
          </span>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            The story unfolds across the American frontier — from boyhood friendship to the expedition that changed everything.
          </p>
        </div>

        <div ref={timelineRef} className="expedition-timeline">
          {timelineEntries.map((entry, i) => (
            <div
              key={i}
              className={`timeline-entry ${i <= activeEntry ? 'active' : ''}`}
            >
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: i <= activeEntry ? 'var(--color-gold)' : 'var(--color-rawhide)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.5rem',
                  transition: 'color 0.4s ease',
                }}
              >
                {entry.timestamp}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: i <= activeEntry ? 'var(--color-paper)' : 'var(--color-muted)',
                  lineHeight: 1.5,
                  maxWidth: 'none',
                  transition: 'color 0.6s ease',
                }}
              >
                {entry.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4 — CHARACTERS (Movie-like cast cards)
          ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(4rem, 8vh, 7rem) clamp(1.25rem, 4vw, 3rem)',
        position: 'relative',
        background: 'linear-gradient(180deg, var(--color-bg) 0%, rgba(22,20,18,1) 50%, var(--color-bg) 100%)',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vh, 4rem)', position: 'relative', zIndex: 1 }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
            The Characters
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            lineHeight: 1.15,
            marginBottom: '1rem',
            color: 'var(--color-paper)',
          }}>
            Four lives. One expedition. A nation's reckoning.
          </h2>
          <p style={{
            color: 'var(--color-muted)',
            fontSize: '0.95rem',
            maxWidth: '550px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Every great film is built on the shoulders of unforgettable characters. These are the souls at the center of York.
          </p>
        </div>

        <div className="ripreel-cast-grid" style={{ position: 'relative', zIndex: 1 }}>
          {castCredits.map((cast, i) => (
            <div key={i} className="ripreel-cast-card">
              <p style={{
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-ui)',
                marginBottom: '0.5rem',
              }}>
                Character
              </p>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                color: 'var(--color-paper)',
                marginBottom: '0.75rem',
              }}>
                {cast.role}
              </h3>
              <p style={{
                color: 'var(--color-muted)',
                fontSize: '0.875rem',
                lineHeight: 1.7,
              }}>
                {cast.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5 — PRODUCTION DETAILS (Movie credits style)
          ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(4rem, 8vh, 7rem) clamp(1.25rem, 4vw, 3rem)',
        position: 'relative',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vh, 4rem)' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
            Production Notes
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            lineHeight: 1.15,
            color: 'var(--color-paper)',
            marginBottom: '1rem',
          }}>
            Built for the screen.
          </h2>
          <p style={{
            color: 'var(--color-muted)',
            fontSize: '0.95rem',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Every detail of this screenplay has been crafted to specification for prestige feature production.
          </p>
        </div>

        <div className="ripreel-prod-grid">
          {productionDetails.map((detail, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-muted)',
                fontFamily: 'var(--font-ui)',
                marginBottom: '0.5rem',
              }}>
                {detail.label}
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                color: 'var(--color-gold)',
              }}>
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 6 — CLOSING QUOTE + CTA
          ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.25rem, 4vw, 3rem)',
        textAlign: 'center',
        position: 'relative',
        background: 'linear-gradient(to bottom, var(--color-bg), rgba(22,20,18,1), var(--color-bg))',
      }}>
        {/* Decorative gold line */}
        <div style={{
          width: '60px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
          margin: '0 auto 2.5rem',
        }} />

        <blockquote style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--color-paper)',
          lineHeight: 1.4,
          maxWidth: '700px',
          margin: '0 auto 1rem',
        }}>
          "They called it the Corps of Discovery. But the greatest discovery was the man they refused to see."
        </blockquote>

        <p style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--color-muted)',
          fontFamily: 'var(--font-ui)',
          marginBottom: 'clamp(2.5rem, 5vh, 4rem)',
        }}>
          — From the screenplay, York
        </p>

        <p style={{
          color: 'var(--color-muted)',
          fontSize: '0.95rem',
          marginBottom: '1.5rem',
          fontStyle: 'italic',
        }}>
          Ready to read the pages?
        </p>
        <Link to="/script">
          <MagneticButton variant="secondary">Read the Manuscript</MagneticButton>
        </Link>
      </section>
    </main>
  );
}
