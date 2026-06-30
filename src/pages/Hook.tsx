import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { filmData, heroMediaUrls, creators, whyPoints } from '../data/auction';
import RevealText from '../components/ui/RevealText';
import RevealImage from '../components/ui/RevealImage';
import BidConsole from '../components/ui/BidConsole';
import MagneticButton from '../components/ui/MagneticButton';
import { useReducedMotion } from '../hooks/useReducedMotion';
import Viewfinder from '../components/ui/Viewfinder';
import ScrollHighlightText from '../components/ui/ScrollHighlightText';

gsap.registerPlugin(ScrollTrigger);

/**
 * PAGE 1 — THE BEGINNING (Landing Page)
 * Frontier Cinema redesign — York's story
 * Six sections: Hero, Narrative, Bid Console, Creators, Why This Story, Closing CTA
 */
export default function Hook() {
  const [heroIndex, setHeroIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();

  // Hero parallax on scroll
  useEffect(() => {
    if (prefersReducedMotion || !heroImgRef.current || !heroRef.current) return;

    const anim = gsap.to(heroImgRef.current, {
      y: '25%',
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [prefersReducedMotion]);

  // 3D mouse tilt for Hero Image
  useEffect(() => {
    const hero = heroRef.current;
    const img = heroImgRef.current;
    if (!hero || !img || prefersReducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const dx = (x - xc) / xc;
      const dy = (y - yc) / yc;

      gsap.to(img, {
        rotationY: dx * 2.5,
        rotationX: -dy * 2.5,
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.out',
      });
    };

    const onMouseLeave = () => {
      gsap.to(img, {
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
      });
    };

    hero.addEventListener('mousemove', onMouseMove);
    hero.addEventListener('mouseleave', onMouseLeave);

    return () => {
      hero.removeEventListener('mousemove', onMouseMove);
      hero.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [prefersReducedMotion]);

  // Scroll staggered animations for Why points
  useEffect(() => {
    if (prefersReducedMotion) return;
    const whyItems = document.querySelectorAll('.why-point-item');
    
    whyItems.forEach((item) => {
      gsap.fromTo(
        item,
        {
          opacity: 0,
          y: 40,
          rotationX: -12,
          rotationY: 3,
          transformOrigin: 'top center',
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger && (st.trigger as HTMLElement).classList.contains('why-point-item')) {
          st.kill();
        }
      });
    };
  }, [prefersReducedMotion]);

  // Automated background carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroMediaUrls.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);



  // Scroll to content
  const scrollToContent = () => {
    const target = document.getElementById('logline-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main id="main-content" tabIndex={-1}>

      {/* ======== SECTION A — HERO ======== */}
      <section
        ref={heroRef}
        className="letterbox vignette"
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '600px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: 'clamp(2rem, 6vw, 5rem)',
        }}
      >
        {/* Cinematic camera viewfinder overlay */}
        <Viewfinder heroRef={heroRef} />

        {/* Background Image Carousel Container for Parallax */}
        <div 
          ref={heroImgRef}
          style={{
            position: 'absolute',
            inset: '-10% 0',
            width: '100%',
            height: '120%',
            zIndex: 0,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {heroMediaUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt=""
              fetchPriority={idx === 0 ? "high" : "auto"}
              decoding={idx === 0 ? "sync" : "async"}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 40%',
                filter: 'brightness(0.6) contrast(1.1) saturate(0.9)',
                opacity: idx === heroIndex ? 1 : 0,
                transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>

        {/* Warm gradient overlay — amber/campfire feel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(to top, rgba(11,10,8,0.98) 0%, rgba(11,10,8,0.3) 40%, rgba(11,10,8,0.4) 70%, rgba(11,10,8,0.7) 100%),
              radial-gradient(ellipse at 50% 80%, rgba(212,168,67,0.08) 0%, transparent 60%)
            `,
            zIndex: 1,
          }}
        />

        {/* Hero Content — Centered, monumental */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '2rem', fontSize: '0.7rem', letterSpacing: '0.3em' }}>
            An Original Screenplay · An Untold American Story
          </span>

          <div className="focus-highlight-element">
            <RevealText as="h1" immediate delay={0.3}>
              {filmData.title}
            </RevealText>
          </div>

          {/* Decorative gold line under title */}
          <div style={{
            width: '80px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
            margin: '1.5rem auto',
            opacity: 0.6,
          }} />

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-subheading)',
              color: 'var(--color-paper)',
              lineHeight: 1.7,
              maxWidth: '680px',
              margin: '0.5rem auto 0',
              opacity: 0.88,
              fontStyle: 'italic',
            }}
          >
            Born into opposite worlds, two men form an unbreakable bond that transcends slavery and freedom. Bound by loyalty and tested by history, their journey across the American wilderness becomes one that will alter the course of a nation and reshape both of their destinies.
          </p>
        </div>

        {/* Scroll Cue — Compass-inspired */}
        <button
          onClick={scrollToContent}
          aria-label="Scroll down to content"
          style={{
            position: 'absolute',
            bottom: 'clamp(3rem, 6vh, 5rem)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--color-muted)', fontFamily: 'var(--font-ui)' }}>
            Begin the Journey
          </span>
          {/* Compass needle icon */}
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none" style={{ animation: 'scrollBounce 2.5s ease-in-out infinite' }}>
            <circle cx="10" cy="8" r="7" stroke="var(--color-gold)" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <path d="M10 4L10 12" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10 18V26M10 26L5 21M10 26L15 21" stroke="var(--color-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      {/* ======== SECTION B — THE NARRATIVE (Scroll Highlight) ======== */}
      <section
        id="logline-section"
        style={{
          padding: 'var(--spacing-section) clamp(1.25rem, 4vw, 3rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Decorative compass rose SVG */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ marginBottom: '2rem', opacity: 0.25 }}>
          <circle cx="20" cy="20" r="18" stroke="var(--color-gold)" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="12" stroke="var(--color-gold)" strokeWidth="0.5" />
          <path d="M20 2L20 38M2 20L38 20" stroke="var(--color-gold)" strokeWidth="0.5" />
          <path d="M7 7L33 33M33 7L7 33" stroke="var(--color-gold)" strokeWidth="0.3" />
          <circle cx="20" cy="20" r="2" fill="var(--color-gold)" fillOpacity="0.5" />
        </svg>

        <div style={{ maxWidth: '860px' }}>
          <ScrollHighlightText className="editorial-pitch focus-highlight-element">
            {filmData.expandedPitch}
          </ScrollHighlightText>
        </div>
      </section>

      {/* ======== SECTION C — BID CONSOLE (Acquire This Story) ======== */}
      <section
        style={{
          padding: 'var(--spacing-section) clamp(1.25rem, 4vw, 3rem)',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="eyebrow">Secure This Story</span>
          </div>
          <BidConsole />
        </div>
      </section>

      {/* ======== SECTION D — THE STORYTELLERS ======== */}
      <section
        style={{
          padding: 'var(--spacing-section) clamp(1.25rem, 4vw, 3rem)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <span className="eyebrow" style={{ display: 'block', marginBottom: '2rem' }}>
          The Storytellers
        </span>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(3rem, 6vw, 5rem)',
          }}
        >
          {creators.map((creator, idx) => (
            <div
              key={creator.name}
              className="focus-highlight-element"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(200px, 280px) 1fr',
                gap: 'clamp(1.5rem, 3vw, 3rem)',
                alignItems: 'start',
              }}
            >
              {/* Individual photo */}
              <RevealImage direction={idx === 0 ? 'left' : 'right'}>
                <img
                  src={creator.photoUrl}
                  alt={`${creator.name} — ${creator.role}`}
                  loading="lazy"
                  width="280"
                  height="350"
                  style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '4 / 5',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    borderRadius: '2px',
                    filter: 'contrast(1.05) saturate(0.9)',
                    border: '1px solid rgba(212,168,67,0.15)',
                  }}
                />
              </RevealImage>

              {/* Bio */}
              <div style={{ paddingTop: '0.5rem' }}>
                <RevealText as="h3">
                  {creator.name}
                </RevealText>
                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'var(--text-caption)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--color-gold)',
                    marginTop: '0.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  {creator.credit}
                </p>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-muted)' }}>
                  {creator.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======== SECTION E — WHY THIS STORY ======== */}
      <section
        style={{
          padding: 'var(--spacing-section) clamp(1.25rem, 4vw, 3rem)',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <span className="eyebrow" style={{ display: 'block', marginBottom: '3rem', textAlign: 'center' }}>
          Why This Story Matters
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2rem, 4vh, 3.5rem)' }}>
          {whyPoints.map((point) => (
            <div
              key={point.number}
              className="why-point-item focus-highlight-element"
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '1.5rem',
                alignItems: 'start',
                willChange: 'transform, opacity',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: 300,
                  color: 'rgba(212,168,67,0.2)',
                  lineHeight: 1,
                }}
              >
                {point.number}
              </span>
              <div>
                <RevealText as="h4">
                  {point.title}
                </RevealText>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9375rem', color: 'var(--color-muted)', lineHeight: 1.7 }}>
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======== SECTION F — CLOSING CTA ======== */}
      <section
        style={{
          padding: 'var(--spacing-section) clamp(1.25rem, 4vw, 3rem)',
          background: 'linear-gradient(to bottom, var(--color-ink), var(--color-surface))',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Subtle warm glow at top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <span className="eyebrow" style={{ display: 'block', marginBottom: '1.5rem' }}>
          The Journey Continues
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-display)',
            color: 'var(--color-paper)',
            marginBottom: '1rem',
            fontWeight: 400,
            fontStyle: 'italic',
          }}
        >
          He returned West and became a hero.
        </h2>
        <p style={{ color: 'var(--color-muted)', marginBottom: '2.5rem', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
          Watch the proof-of-tone rip reel, then dive into the full screenplay. This is a story that demands to be told.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/rip-reel">
            <MagneticButton variant="primary">Watch the Rip Reel</MagneticButton>
          </Link>
          <Link to="/script">
            <MagneticButton variant="secondary">Read the Manuscript</MagneticButton>
          </Link>
        </div>
      </section>

      <style>{`
        .editorial-pitch {
          font-family: var(--font-display) !important;
          font-size: var(--text-heading) !important;
          color: var(--color-paper) !important;
          line-height: 1.4 !important;
          font-weight: 400 !important;
          max-width: none !important;
          font-style: italic !important;
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </main>
  );
}
