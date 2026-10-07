import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { filmData, heroMediaUrls, creators, whyPoints, ripReelData, scriptData } from '../data/auction';
import RevealText from '../components/ui/RevealText';
import RevealImage from '../components/ui/RevealImage';
import BidConsole from '../components/ui/BidConsole';
import { useReducedMotion } from '../hooks/useReducedMotion';
import Viewfinder from '../components/ui/Viewfinder';
import { useSeo } from '../lib/seo';

// Derive the YouTube video id from the configured embed URL
const YT_VIDEO_ID = ripReelData.videoUrl.split('/embed/')[1]?.split(/[?&]/)[0] ?? '';

gsap.registerPlugin(ScrollTrigger);

// Module scope keeps the object identity stable across renders
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://yorkscreenplay.com/#webpage',
  url: 'https://yorkscreenplay.com/',
  name: 'YORK — An Untold American Epic | Original Screenplay',
  description:
    'YORK: an original feature screenplay about the enslaved man who crossed America with Lewis & Clark. Read the script, watch the rip reel, and place a bid.',
  isPartOf: { '@id': 'https://yorkscreenplay.com/#website' },
  mainEntity: { '@id': 'https://yorkscreenplay.com/#screenplay' },
};

/**
 * PAGE 1 — THE BEGINNING (Landing Page)
 * Frontier Cinema redesign — York's story
 * Six sections: Hero, Narrative, Bid Console, Creators, Why This Story, Closing CTA
 */
export default function Hook() {
  useSeo({
    title: 'YORK — An Untold American Epic | Original Screenplay',
    description:
      'YORK: an original feature screenplay about the enslaved man who crossed America with Lewis & Clark and came home to chains. Read the script, watch the rip reel, place a bid.',
    path: '/',
    jsonLd: homeJsonLd,
  });

  const [heroIndex, setHeroIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
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
              fetchPriority={idx === 0 ? "high" : "low"}
              decoding={idx === 0 ? "sync" : "async"}
              // Only the first slide is the LCP element; the rest must not
              // compete for bandwidth during the initial paint.
              loading={idx === 0 ? "eager" : "lazy"}
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

      {/* ======== SECTION B — THE REEL (Video) ======== */}
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
        {/* Ambient warm glow behind the frame */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(1100px, 92%)',
          height: '80%',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Decorative compass rose SVG */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ marginBottom: '1.75rem', opacity: 0.25, position: 'relative', zIndex: 1 }}>
          <circle cx="20" cy="20" r="18" stroke="var(--color-gold)" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="12" stroke="var(--color-gold)" strokeWidth="0.5" />
          <path d="M20 2L20 38M2 20L38 20" stroke="var(--color-gold)" strokeWidth="0.5" />
          <path d="M7 7L33 33M33 7L7 33" stroke="var(--color-gold)" strokeWidth="0.3" />
          <circle cx="20" cy="20" r="2" fill="var(--color-gold)" fillOpacity="0.5" />
        </svg>

        <span className="eyebrow" style={{ display: 'block', marginBottom: '0.9rem', position: 'relative', zIndex: 1 }}>
          Sizzle Reel Below
        </span>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.9rem, 4vw, 3rem)',
          lineHeight: 1.1,
          textAlign: 'center',
          color: 'var(--color-paper)',
          marginBottom: '0.9rem',
          maxWidth: '720px',
          position: 'relative',
          zIndex: 1,
        }}>
          See the frontier before you read it.
        </h2>
        <p style={{
          color: 'var(--color-muted)',
          fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
          lineHeight: 1.75,
          textAlign: 'center',
          maxWidth: '560px',
          margin: '0 0 clamp(2rem, 4vh, 3rem)',
          position: 'relative',
          zIndex: 1,
        }}>
          {ripReelData.intro}
        </p>

        {/* Framed video */}
        <div
          className="hook-video-frame"
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '1180px',
            aspectRatio: '16 / 9',
            borderRadius: '4px',
            overflow: 'hidden',
            border: '1px solid rgba(212,168,67,0.22)',
            backgroundColor: '#000',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 50px rgba(212,168,67,0.05)',
          }}
        >
          {videoPlaying ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${YT_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="YORK — Sizzle Reel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setVideoPlaying(true)}
              aria-label="Play the YORK sizzle reel"
              className="hook-video-facade"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                padding: 0,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#000',
              }}
            >
              {/* Thumbnail — YouTube serves a grey 120x90 placeholder (HTTP 200)
                  when a size is missing, so step down by resolution on load. */}
              <img
                src={`https://i.ytimg.com/vi/${YT_VIDEO_ID}/maxresdefault.jpg`}
                alt=""
                loading="lazy"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth > 120) return; // real frame loaded
                  const fallbacks = ['sddefault', 'hqdefault'];
                  const current = img.src.split('/').pop()?.replace('.jpg', '');
                  const next = fallbacks[fallbacks.indexOf(current ?? '') + 1] ?? fallbacks[0];
                  if (current !== 'hqdefault') {
                    img.src = `https://i.ytimg.com/vi/${YT_VIDEO_ID}/${next}.jpg`;
                  }
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Cinematic dark + warm wash for legibility */}
              <span style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(11,10,8,0.25) 0%, rgba(11,10,8,0.15) 45%, rgba(11,10,8,0.55) 100%)',
              }} />
              {/* Play button */}
              <span className="hook-video-play" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(64px, 8vw, 88px)',
                height: 'clamp(64px, 8vw, 88px)',
                borderRadius: '50%',
                background: 'rgba(212,168,67,0.14)',
                border: '1px solid rgba(212,168,67,0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s ease, box-shadow 0.4s ease',
              }}>
                <span style={{
                  width: 0,
                  height: 0,
                  marginLeft: '4px',
                  borderTop: 'clamp(11px, 1.4vw, 15px) solid transparent',
                  borderBottom: 'clamp(11px, 1.4vw, 15px) solid transparent',
                  borderLeft: 'clamp(18px, 2.3vw, 24px) solid var(--color-gold)',
                }} />
              </span>
            </button>
          )}
        </div>

        {/* Caption beneath the frame */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          marginTop: 'clamp(1.75rem, 3.5vh, 2.75rem)',
          maxWidth: '640px',
          textAlign: 'center',
        }}>
          {/* Gold divider */}
          <div style={{
            width: '48px',
            height: '1px',
            margin: '0 auto 1.5rem',
            background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
          }} />

          {(() => {
            const [quote, source] = ripReelData.pullQuotes[0].split(' — ');
            return (
              <>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.25rem, 2.4vw, 1.75rem)',
                  lineHeight: 1.4,
                  color: 'var(--color-paper)',
                  marginBottom: '1.1rem',
                }}>
                  {quote}
                </p>
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.6rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  color: 'var(--color-gold)',
                  opacity: 0.75,
                }}>
                  {source}
                </p>
              </>
            );
          })()}

          {/* Meta row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.85rem',
            marginTop: '1.75rem',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'var(--color-muted)',
          }}>
            <span>Sizzle Reel</span>
            <span style={{ color: 'var(--color-gold)', opacity: 0.5 }}>·</span>
            <span>{filmData.genre}</span>
          </div>
        </div>
      </section>

      {/* ======== SECTION B2 — THE SCRIPT ======== */}
      <section
        style={{
          padding: 'var(--spacing-section) clamp(1.25rem, 4vw, 3rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient warm glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '65%',
          transform: 'translate(-50%, -50%)',
          width: 'min(700px, 80%)',
          height: '70%',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div className="hook-script-grid">
          {/* Left — Copy */}
          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
              The Manuscript
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.9rem, 4vw, 3rem)',
              lineHeight: 1.1,
              color: 'var(--color-paper)',
              marginBottom: '1.25rem',
            }}>
              The whole journey, on the page.
            </h2>
            <p style={{
              color: 'var(--color-muted)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
              lineHeight: 1.85,
              maxWidth: '520px',
              marginBottom: '2.25rem',
            }}>
              A {filmData.pageCount}-page {filmData.draftStatus.toLowerCase()}, written in the language of the
              frontier and formatted to industry-standard structure. From the tobacco fields of Virginia to
              the shores of the Pacific, every scene of York's journey — the wonder, the betrayal, the
              defiance — is here to read in full.
            </p>

            {/* Stat chips */}
            <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { k: 'Pages', v: filmData.pageCount },
                { k: 'Status', v: filmData.draftStatus },
                { k: 'Format', v: 'Screenplay' },
              ].map((s) => (
                <div key={s.k}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>{s.k}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-gold)' }}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Manuscript page preview */}
          <div className="hook-script-visual">
            <div className="hook-manuscript-shadow hook-manuscript-shadow--2" aria-hidden="true" />
            <div className="hook-manuscript-shadow" aria-hidden="true" />

            <div className="hook-flip">
              <div className="hook-flip-inner">
                <div className="hook-flip-face hook-flip-front">
              <div className="hook-manuscript-head">
                <span className="hook-manuscript-kicker">Screenplay · Excerpt</span>
                <span className="hook-manuscript-title">{filmData.title}</span>
              </div>
              <div className="hook-manuscript-lines">
                {scriptData.teaserLines.map((line, i) => (
                  <div key={i} style={{ minHeight: '1.35em', whiteSpace: 'pre' }}>{line || ' '}</div>
                ))}
              </div>
              <div className="hook-manuscript-fade" />
              <div className="hook-manuscript-sheen" aria-hidden="true" />
              <div className="hook-manuscript-stamp">
                {filmData.pageCount} PP · {filmData.draftStatus}
              </div>
                </div>

                {/* BACK — title cover */}
                <div className="hook-flip-face hook-flip-back">
                  <span className="eyebrow" style={{ marginBottom: '1.25rem' }}>The Screenplay</span>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                    letterSpacing: '0.1em',
                    color: 'var(--color-gold)',
                    lineHeight: 1,
                    marginBottom: '1.25rem',
                  }}>
                    {filmData.title}
                  </h3>
                  <div style={{ width: '50px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)', marginBottom: '1.25rem' }} />
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)',
                    color: 'var(--color-paper)',
                    lineHeight: 1.6,
                    maxWidth: '80%',
                    marginBottom: '1.75rem',
                  }}>
                    {filmData.tagline}
                  </p>
                  <a
                    href={scriptData.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hook-flip-cta"
                  >
                    Read the Complete Script ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
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
              className="focus-highlight-element storyteller-grid"
            >
              {/* Individual photo */}
              <div className="storyteller-photo">
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
              </div>

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

      <style>{`
        /* ── Script section layout ── */
        .hook-script-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(3rem, 6vw, 5rem);
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
        }
        @media (min-width: 900px) {
          .hook-script-grid {
            grid-template-columns: 1.05fr 0.95fr;
          }
        }

        .hook-script-visual {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1800px;
        }

        /* Stacked pages behind the card (straight, gently offset) */
        .hook-manuscript-shadow {
          position: absolute;
          width: min(370px, 84%);
          aspect-ratio: 8.5 / 11;
          border-radius: 8px;
          background: linear-gradient(180deg, #171412 0%, #100f0d 100%);
          border: 1px solid rgba(212,168,67,0.10);
          transform: translate(10px, 14px) rotate(1.5deg);
          box-shadow: 0 24px 60px rgba(0,0,0,0.55);
        }
        .hook-manuscript-shadow--2 {
          transform: translate(20px, 26px) rotate(3deg);
          opacity: 0.6;
        }

        /* Flip card */
        .hook-flip {
          position: relative;
          width: min(370px, 84%);
          aspect-ratio: 8.5 / 11;
          z-index: 1;
        }
        .hook-flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 1s cubic-bezier(0.16,1,0.3,1);
          animation: manuscriptFloat 7s ease-in-out infinite;
        }
        .hook-flip:hover .hook-flip-inner {
          transform: rotateY(180deg);
          animation: none;
        }
        .hook-flip-face {
          position: absolute;
          inset: 0;
          border-radius: 8px;
          overflow: hidden;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          background:
            radial-gradient(120% 60% at 50% -8%, rgba(212,168,67,0.10) 0%, transparent 55%),
            linear-gradient(180deg, #211d18 0%, #171410 62%, #131110 100%);
          border: 1px solid rgba(212,168,67,0.28);
          box-shadow:
            0 40px 90px rgba(0,0,0,0.7),
            0 0 50px rgba(212,168,67,0.06),
            inset 0 1px 0 rgba(255,240,210,0.06),
            inset 0 0 40px rgba(0,0,0,0.35);
        }
        .hook-flip-back {
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          background:
            radial-gradient(ellipse at 50% 32%, rgba(212,168,67,0.12) 0%, transparent 60%),
            linear-gradient(180deg, #211d18 0%, #131110 100%);
          border-color: rgba(212,168,67,0.42);
        }
        .hook-flip-cta {
          display: inline-block;
          font-family: var(--font-ui);
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: var(--color-gold);
          text-decoration: none;
          padding: 0.7rem 1.4rem;
          border: 1px solid rgba(212,168,67,0.5);
          border-radius: 2px;
          background: rgba(212,168,67,0.06);
          transition: background 0.35s ease, border-color 0.35s ease;
        }
        .hook-flip-cta:hover {
          background: rgba(212,168,67,0.14);
          border-color: rgba(212,168,67,0.85);
        }
        @keyframes manuscriptFloat {
          0%, 100% { transform: translateY(0) rotateX(0deg); }
          50%      { transform: translateY(-14px) rotateX(2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hook-flip-inner { animation: none; }
        }

        /* Letterhead */
        .hook-manuscript-head {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding: 1.5rem 1.75rem 1.1rem;
          border-bottom: 1px solid rgba(212,168,67,0.14);
        }
        .hook-manuscript-kicker {
          font-family: var(--font-ui);
          font-size: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--color-muted);
        }
        .hook-manuscript-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          letter-spacing: 0.28em;
          color: rgba(212,168,67,0.85);
          text-transform: uppercase;
        }

        .hook-manuscript-lines {
          padding: 1.5rem 1.75rem;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.7rem;
          line-height: 1.75;
          color: rgba(240,230,210,0.52);
        }
        .hook-manuscript-fade {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 42%;
          background: linear-gradient(180deg, transparent 0%, #131110 86%);
          pointer-events: none;
        }
        /* Soft moving light across the paper */
        .hook-manuscript-sheen {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(115deg, transparent 30%, rgba(255,240,210,0.06) 48%, transparent 62%);
          background-size: 250% 250%;
          animation: manuscriptSheen 7s ease-in-out infinite;
        }
        @keyframes manuscriptSheen {
          0%, 100% { background-position: 120% 0; }
          50%      { background-position: -20% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hook-manuscript-sheen { animation: none; }
        }
        .hook-manuscript-stamp {
          position: absolute;
          bottom: 1.25rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-ui);
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--color-gold);
          white-space: nowrap;
          padding: 0.55rem 1.1rem;
          border: 1px solid rgba(212,168,67,0.35);
          border-radius: 2px;
          background: rgba(11,10,8,0.65);
          backdrop-filter: blur(4px);
        }

        .hook-video-facade:hover .hook-video-play,
        .hook-video-facade:focus-visible .hook-video-play {
          transform: translate(-50%, -50%) scale(1.08);
          background: rgba(212,168,67,0.24);
          box-shadow: 0 0 40px rgba(212,168,67,0.25);
        }
        .hook-video-frame {
          transition: border-color 0.5s ease, box-shadow 0.5s ease;
        }
        .hook-video-frame:hover {
          border-color: rgba(212,168,67,0.4);
          box-shadow: 0 30px 90px rgba(0,0,0,0.8), 0 0 60px rgba(212,168,67,0.1);
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </main>
  );
}
