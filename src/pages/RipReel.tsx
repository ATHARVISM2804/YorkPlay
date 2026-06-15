import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ripReelData, filmData, timelineEntries } from '../data/auction';
import MagneticButton from '../components/ui/MagneticButton';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * PAGE 2 — THE EXPEDITION (Rip Reel)
 * Immersive theater + expedition timeline showing the narrative beats.
 */
export default function RipReel() {
  const frameRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeEntry, setActiveEntry] = useState(-1);

  // Video frame reveal animation
  useEffect(() => {
    if (prefersReducedMotion || !frameRef.current) return;

    gsap.fromTo(
      frameRef.current,
      { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        duration: 1.2,
        ease: 'power3.inOut',
        delay: 0.3,
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [prefersReducedMotion]);

  // Timeline scroll animations
  useEffect(() => {
    if (prefersReducedMotion || !timelineRef.current) return;

    const entries = timelineRef.current.querySelectorAll('.timeline-entry');

    entries.forEach((entry, i) => {
      gsap.fromTo(
        entry,
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
    <main id="main-content" tabIndex={-1}>
      {/* ======== VIDEO SECTION ======== */}
      <section
        className="letterbox"
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-ink)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(6rem, 12vh, 10rem) clamp(1.25rem, 4vw, 3rem)',
          position: 'relative',
        }}
      >
        {/* Ambient warm glow behind video */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vh, 3rem)', maxWidth: '600px', position: 'relative', zIndex: 1 }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
            The Expedition
          </span>
          <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-muted)', lineHeight: 1.6 }}>
            {ripReelData.intro}
          </p>
        </div>

        {/* Video Player */}
        <div
          ref={frameRef}
          data-cursor-label="WATCH"
          style={{
            width: '100%',
            maxWidth: '960px',
            aspectRatio: '16 / 9',
            border: '1px solid rgba(212,168,67,0.2)',
            borderRadius: '2px',
            overflow: 'hidden',
            backgroundColor: '#000',
            position: 'relative',
            zIndex: 1,
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
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            >
              <source src={ripReelData.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Pull Quotes */}
        {ripReelData.pullQuotes.length > 0 && (
          <div
            style={{
              maxWidth: '700px',
              marginTop: 'clamp(2rem, 4vh, 4rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {ripReelData.pullQuotes.map((quote, i) => (
              <blockquote
                key={i}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-subheading)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--color-muted)',
                  lineHeight: 1.5,
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
      </section>

      {/* ======== EXPEDITION TIMELINE ======== */}
      <section
        style={{
          padding: 'var(--spacing-section) clamp(1.25rem, 4vw, 3rem)',
          maxWidth: '700px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vh, 4rem)' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
            The Narrative Arc
          </span>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', maxWidth: '500px', margin: '0 auto' }}>
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

      {/* ======== CTA ======== */}
      <section
        style={{
          padding: 'var(--spacing-section) clamp(1.25rem, 4vw, 3rem)',
          textAlign: 'center',
          background: 'linear-gradient(to bottom, var(--color-ink), var(--color-surface))',
        }}
      >
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
          Ready to read the pages?
        </p>
        <Link to="/script">
          <MagneticButton variant="secondary">Read the Manuscript</MagneticButton>
        </Link>
      </section>
    </main>
  );
}
