import { useState } from 'react';
import { filmData, scriptData } from '../data/auction';
import MagneticButton from '../components/ui/MagneticButton';

/**
 * PAGE 3 — THE MANUSCRIPT
 * Leather journal vault card — York's story opening pages.
 * Clean, deliberate, premium. Presented like opening a frontier journal.
 */
export default function Script() {
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <main id="main-content" tabIndex={-1}>
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(8rem, 14vh, 12rem) clamp(1.25rem, 4vw, 3rem)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Subtle ambient glow */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Header */}
        <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
          The Manuscript
        </span>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
          {filmData.genre} · {filmData.pageCount} pages · {filmData.draftStatus}
        </p>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', maxWidth: '500px', lineHeight: 1.6, marginBottom: 'clamp(2rem, 4vh, 4rem)', fontStyle: 'italic' }}>
          {filmData.logline}
        </p>

        {/* Script Vault Card — Leather Journal */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            minHeight: '520px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid rgba(212,168,67,0.15)',
            borderRadius: '2px',
            overflow: 'hidden',
            cursor: 'default',
            transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.5s ease, box-shadow 0.5s ease',
            boxShadow: '0 0 60px rgba(0,0,0,0.4), inset 0 1px 30px rgba(212,168,67,0.02)',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.transform = 'translateY(-6px)';
            el.style.borderColor = 'rgba(212,168,67,0.3)';
            el.style.boxShadow = '0 10px 80px rgba(212,168,67,0.06), 0 0 60px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.transform = 'translateY(0)';
            el.style.borderColor = 'rgba(212,168,67,0.15)';
            el.style.boxShadow = '0 0 60px rgba(0,0,0,0.4), inset 0 1px 30px rgba(212,168,67,0.02)';
          }}
        >
          {/* Embossed title — leather journal cover */}
          <div
            style={{
              padding: '2rem 1.5rem 1rem',
              borderBottom: '1px solid var(--color-line)',
              background: 'linear-gradient(180deg, rgba(58,46,34,0.3) 0%, transparent 100%)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 300,
                color: 'rgba(240,230,210,0.12)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {filmData.title}
            </h3>
            <p style={{ fontSize: '0.6875rem', color: 'var(--color-muted)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'var(--font-ui)' }}>
              {filmData.draftStatus} · {filmData.genre}
            </p>
          </div>

          {/* Teaser lines — screenplay format */}
          <div
            style={{
              flex: 1,
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: '0.75rem',
              lineHeight: 1.8,
              color: 'rgba(240,230,210,0.35)',
              textAlign: 'left',
            }}
          >
            {scriptData.teaserLines.map((line, i) => (
              <div key={i} style={{ minHeight: '1.4em' }}>
                {line}
              </div>
            ))}

            {/* Burned paper edge gradient overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '70%',
                background: 'linear-gradient(to top, var(--color-surface) 20%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Bottom CTA area */}
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-line)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'var(--font-ui)' }}>
              Open the journal →
            </span>
          </div>
        </div>

        {/* Terms checkbox */}
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            maxWidth: '400px',
            textAlign: 'left',
          }}
        >
          <input
            type="checkbox"
            id="accept-terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            style={{
              width: '16px',
              height: '16px',
              marginTop: '2px',
              accentColor: 'var(--color-gold)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          />
          <label
            htmlFor="accept-terms"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-muted)',
              lineHeight: 1.5,
              cursor: 'pointer',
            }}
          >
            {scriptData.viewingTerms}
          </label>
        </div>

        {/* Read Script Button */}
        <div style={{ marginTop: '1.5rem' }}>
          <MagneticButton
            href={scriptData.googleDocsUrl}
            target="_blank"
            variant="primary"
            disabled={!termsAccepted}
            id="read-script-btn"
          >
            Read the Full Manuscript
          </MagneticButton>
        </div>
      </section>
    </main>
  );
}
