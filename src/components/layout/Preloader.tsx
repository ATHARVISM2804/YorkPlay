import { useState, useEffect, useRef, useCallback } from 'react';
import { logoUrl } from '../../data/auction';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Preloader — Cinematic frontier opening sequence.
 * Ember particles rise, compass spins, logo reveals with dramatic flair.
 * ~3 seconds total. Skipped on reduced motion.
 */

// Ember particle type
interface Ember {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  glow: boolean;
}

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'done'>('loading');
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const embersRef = useRef<Ember[]>([]);

  // Generate embers once
  if (embersRef.current.length === 0) {
    embersRef.current = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4,
      drift: -30 + Math.random() * 60,
      glow: Math.random() > 0.5,
    }));
  }

  const finishPreloader = useCallback(() => {
    setPhase('reveal');
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1200);
  }, [onComplete]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase('done');
      onComplete();
      return;
    }

    const start = performance.now();
    const duration = 4000;

    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased * 100);

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        finishPreloader();
      }
    };

    requestAnimationFrame(tick);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'done') return null;

  const compassProgress = progress / 100;
  const showLogo = compassProgress > 0.25;
  const showTagline = compassProgress > 0.55;
  const showNarrative = compassProgress > 0.7;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        backgroundColor: '#0B0A08',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // Dramatic split-curtain exit
        clipPath: phase === 'reveal'
          ? 'polygon(0 0, 100% 0, 100% 0%, 0 0%)'
          : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        transition: phase === 'reveal'
          ? 'clip-path 0.9s cubic-bezier(0.85, 0, 0.15, 1)'
          : 'none',
      }}
    >
      {/* ---- Background: Warm radial glow ---- */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 600px 400px at 50% 55%, rgba(212,168,67,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 300px 300px at 50% 80%, rgba(224,123,58,0.04) 0%, transparent 60%)
          `,
          opacity: compassProgress > 0.1 ? 1 : 0,
          transition: 'opacity 0.8s ease',
          pointerEvents: 'none',
        }}
      />

      {/* ---- Background: Topographic lines ---- */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: compassProgress > 0.2 ? 0.03 : 0,
          transition: 'opacity 1s ease',
          pointerEvents: 'none',
          backgroundImage: `
            repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 40px, rgba(212,168,67,0.15) 41px, transparent 42px)
          `,
          backgroundSize: '100% 100%',
        }}
      />

      {/* ---- Ember Particles ---- */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {embersRef.current.map((ember) => (
          <div
            key={ember.id}
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: `${ember.x}%`,
              width: `${ember.size}px`,
              height: `${ember.size}px`,
              borderRadius: '50%',
              backgroundColor: ember.glow ? '#E07B3A' : '#D4A843',
              boxShadow: ember.glow
                ? '0 0 6px 2px rgba(224,123,58,0.5), 0 0 12px 4px rgba(212,168,67,0.2)'
                : '0 0 4px 1px rgba(212,168,67,0.3)',
              animation: `ember-rise ${ember.duration}s ease-in ${ember.delay}s infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* ---- Compass Rose (Large, Spinning) ---- */}
      <div
        style={{
          position: 'relative',
          width: '140px',
          height: '140px',
          marginBottom: '2.5rem',
        }}
      >
        {/* Outer ring — rotates slowly */}
        <svg
          viewBox="0 0 140 140"
          fill="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transform: `rotate(${compassProgress * 360}deg)`,
            transition: 'transform 0.1s linear',
          }}
        >
          {/* Outer circle — draws in */}
          <circle
            cx="70" cy="70" r="65"
            stroke="#D4A843"
            strokeWidth="0.5"
            strokeDasharray={`${408 * compassProgress} 408`}
            strokeOpacity="0.5"
            fill="none"
            style={{ transition: 'stroke-dasharray 0.2s ease' }}
          />
          {/* Tick marks around the edge */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 10) * (Math.PI / 180);
            const r1 = 60;
            const r2 = i % 9 === 0 ? 52 : 56;
            const opacity = compassProgress > (i / 36) ? 0.4 : 0;
            return (
              <line
                key={i}
                x1={70 + r1 * Math.cos(angle)}
                y1={70 + r1 * Math.sin(angle)}
                x2={70 + r2 * Math.cos(angle)}
                y2={70 + r2 * Math.sin(angle)}
                stroke="#D4A843"
                strokeWidth={i % 9 === 0 ? '1' : '0.5'}
                strokeOpacity={opacity}
                style={{ transition: 'stroke-opacity 0.3s ease' }}
              />
            );
          })}
        </svg>

        {/* Inner compass — static */}
        <svg
          viewBox="0 0 140 140"
          fill="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {/* Inner ring */}
          <circle
            cx="70" cy="70" r="40"
            stroke="#D4A843"
            strokeWidth="0.5"
            strokeOpacity={compassProgress > 0.3 ? 0.4 : 0}
            fill="none"
            style={{ transition: 'stroke-opacity 0.5s ease' }}
          />
          {/* Cross hairs */}
          <path
            d="M70 10 L70 130 M10 70 L130 70"
            stroke="#D4A843"
            strokeWidth="0.3"
            strokeOpacity={compassProgress > 0.15 ? 0.2 : 0}
            style={{ transition: 'stroke-opacity 0.5s ease' }}
          />
          {/* Diagonal lines */}
          <path
            d="M24 24 L116 116 M116 24 L24 116"
            stroke="#D4A843"
            strokeWidth="0.2"
            strokeOpacity={compassProgress > 0.4 ? 0.15 : 0}
            style={{ transition: 'stroke-opacity 0.5s ease' }}
          />
          {/* North pointer — dramatic gold triangle */}
          <path
            d="M70 20 L64 50 L70 45 L76 50 Z"
            fill="#D4A843"
            fillOpacity={compassProgress > 0.25 ? 0.8 : 0}
            style={{ transition: 'fill-opacity 0.6s ease' }}
          />
          {/* South pointer — muted */}
          <path
            d="M70 120 L64 90 L70 95 L76 90 Z"
            fill="#3A2E22"
            fillOpacity={compassProgress > 0.35 ? 0.6 : 0}
            style={{ transition: 'fill-opacity 0.6s ease' }}
          />
          {/* Center dot with rings */}
          <circle
            cx="70" cy="70" r="5"
            fill="#D4A843"
            fillOpacity={compassProgress > 0.3 ? 0.6 : 0}
            style={{ transition: 'fill-opacity 0.5s ease' }}
          />
          <circle
            cx="70" cy="70" r="2"
            fill="#0B0A08"
            fillOpacity={compassProgress > 0.3 ? 1 : 0}
            style={{ transition: 'fill-opacity 0.5s ease' }}
          />
          {/* Cardinal directions — appear sequentially */}
          {[
            { letter: 'N', x: 70, y: 18, threshold: 0.3 },
            { letter: 'E', x: 128, y: 73, threshold: 0.4 },
            { letter: 'S', x: 70, y: 135, threshold: 0.5 },
            { letter: 'W', x: 12, y: 73, threshold: 0.6 },
          ].map(({ letter, x, y, threshold }) => (
            <text
              key={letter}
              x={x} y={y}
              textAnchor="middle"
              fill="#D4A843"
              fontSize="8"
              fontFamily="'Satoshi', system-ui, sans-serif"
              fontWeight="700"
              letterSpacing="0.1em"
              style={{
                opacity: compassProgress > threshold ? 0.7 : 0,
                transition: 'opacity 0.4s ease',
              }}
            >
              {letter}
            </text>
          ))}
        </svg>
      </div>

      {/* ---- Logo Image ---- */}
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={logoUrl}
          alt="YORK"
          style={{
            height: 'clamp(60px, 10vw, 100px)',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            opacity: showLogo ? 1 : 0,
            transform: showLogo ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
            filter: showLogo ? 'none' : 'blur(4px)',
          }}
        />
      </div>

      {/* ---- Expanding Gold Line ---- */}
      <div
        style={{
          width: showLogo ? 'min(300px, 50vw)' : '0px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #D4A843, transparent)',
          margin: '1.5rem 0',
          transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* ---- Tagline ---- */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
          color: '#F0E6D2',
          fontStyle: 'italic',
          fontWeight: 300,
          letterSpacing: '0.05em',
          opacity: showTagline ? 0.7 : 0,
          transform: showTagline ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          marginBottom: '0.75rem',
        }}
      >
        An untold American story
      </p>

      {/* ---- Narrative Opening Line ---- */}
      <p
        style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: '0.75rem',
          color: '#7A6A52',
          letterSpacing: '0.08em',
          maxWidth: '400px',
          textAlign: 'center',
          lineHeight: 1.6,
          opacity: showNarrative ? 0.5 : 0,
          transform: showNarrative ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
        }}
      >
        Two boys — one free, one slave — would form a friendship that defied the rules.
      </p>

      {/* ---- Bottom Progress Bar ---- */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: 'rgba(212,168,67,0.08)',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, rgba(212,168,67,0.3), #D4A843, #E07B3A)',
            transition: 'width 0.1s linear',
            boxShadow: '0 0 12px rgba(212,168,67,0.3)',
          }}
        />
      </div>

      {/* ---- Bottom Corner Coordinates (cinematic detail) ---- */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '2rem',
          fontFamily: "'Satoshi', system-ui, sans-serif",
          fontSize: '0.55rem',
          fontWeight: 500,
          letterSpacing: '0.15em',
          color: '#7A6A52',
          textTransform: 'uppercase',
          opacity: compassProgress > 0.5 ? 0.4 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        38°53′N · 77°02′W
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '2rem',
          fontFamily: "'Satoshi', system-ui, sans-serif",
          fontSize: '0.55rem',
          fontWeight: 500,
          letterSpacing: '0.15em',
          color: '#7A6A52',
          textTransform: 'uppercase',
          opacity: compassProgress > 0.6 ? 0.4 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        May 14, 1804
      </div>

      {/* ---- Ember Rise Keyframes ---- */}
      <style>{`
        @keyframes ember-rise {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          8% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-105vh) translateX(var(--drift, 40px)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
