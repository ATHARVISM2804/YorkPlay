import { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { contacts, auctionConfig, socialLinks } from '../data/auction';
import contactBg from '../assets/contact_bg.png';
import MagneticButton from '../components/ui/MagneticButton';
import Countdown from '../components/ui/Countdown';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ContactFormState {
  name: string;
  email: string;
  intent: string;
  message: string;
}

/**
 * PAGE 4 — CORRESPONDENCE
 * Cinematic contact page with hero background, form, and direct contacts.
 */
export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    intent: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<ContactFormState>>({});
  const [submitted, setSubmitted] = useState(false);

  // Entrance animation
  useLayoutEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-hero-bg',
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 2.5, ease: 'power2.out' }
      );
      gsap.fromTo('.contact-hero-content > *',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.6 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const validate = (): boolean => {
    const newErrors: Partial<ContactFormState> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!form.intent) newErrors.intent = 'Please select an intent';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitted(true);
  };

  const handleChange = (field: keyof ContactFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(11,10,8,0.8)',
    border: '1px solid rgba(212,168,67,0.15)',
    borderRadius: '2px',
    color: 'var(--color-paper)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  const errorInputStyles: React.CSSProperties = {
    ...inputStyles,
    borderColor: 'var(--color-live)',
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    fontSize: '0.6875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--color-muted)',
    marginBottom: '0.5rem',
    fontWeight: 500,
    fontFamily: 'var(--font-ui)',
  };

  return (
    <main id="main-content" tabIndex={-1} ref={containerRef}>

      {/* Scoped styles */}
      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr;
            gap: 5rem;
          }
        }
        .contact-card {
          padding: 1.25rem;
          background: rgba(22,20,18,0.6);
          border: 1px solid rgba(212,168,67,0.1);
          border-radius: 2px;
          transition: border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease;
          backdrop-filter: blur(4px);
        }
        .contact-card:hover {
          border-color: rgba(212,168,67,0.3);
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.4), 0 0 15px rgba(212,168,67,0.04);
        }
        .contact-form-panel {
          padding: 2rem;
          background: rgba(22,20,18,0.7);
          border: 1px solid rgba(212,168,67,0.12);
          border-radius: 2px;
          backdrop-filter: blur(6px);
        }
        .contact-form-panel input:focus,
        .contact-form-panel select:focus,
        .contact-form-panel textarea:focus {
          border-color: rgba(212,168,67,0.5) !important;
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — HERO
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
        <div className="contact-hero-bg" style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}>
          <img
            src={contactBg}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              filter: 'brightness(0.3) contrast(1.15) saturate(0.85)',
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(180deg, rgba(11,10,8,0.5) 0%, rgba(11,10,8,0.25) 40%, rgba(11,10,8,0.85) 100%),
              radial-gradient(ellipse at 50% 80%, rgba(212,168,67,0.06) 0%, transparent 60%)
            `,
          }} />
        </div>

        {/* Hero Content */}
        <div className="contact-hero-content" style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '750px',
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
            Correspondence
          </span>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 1.05,
            marginBottom: '1.5rem',
            color: 'var(--color-paper)',
          }}>
            Begin the conversation.
          </h1>

          <p style={{
            color: 'var(--color-muted)',
            fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
            lineHeight: 1.8,
            maxWidth: '550px',
            margin: '0 auto 2.5rem',
          }}>
            Whether you're a producer, studio executive, financier, or storyteller —
            every great film begins with a letter of intent. We'd like to hear from you.
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
              Write below ↓
            </span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — CONTACT FORM + DIRECT CONTACTS
          ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.25rem, 4vw, 3rem)',
        position: 'relative',
        background: 'linear-gradient(180deg, var(--color-bg) 0%, rgba(22,20,18,1) 50%, var(--color-bg) 100%)',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="contact-grid" style={{ position: 'relative', zIndex: 1 }}>

          {/* Left — Direct Contacts */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-muted)',
              marginBottom: '1.5rem',
            }}>
              Direct Contacts
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {contacts.map((contact) => (
                <div key={contact.name} className="contact-card">
                  <h4 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    color: 'var(--color-paper)',
                    fontWeight: 500,
                    marginBottom: '0.25rem',
                  }}>
                    {contact.name}
                  </h4>
                  <p style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--color-gold)',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-ui)',
                  }}>
                    {contact.role}
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-paper)',
                      display: 'block',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {contact.email}
                  </a>
                  {contact.phone && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>{contact.phone}</p>
                  )}
                  {contact.social && contact.social.length > 0 && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      {contact.social.map(s => (
                        <a
                          key={s.platform}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--color-muted)',
                            textDecoration: 'underline',
                            textUnderlineOffset: '3px',
                            textDecorationColor: 'rgba(212,168,67,0.3)',
                          }}
                        >
                          {s.platform}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Fallback email */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderTop: '1px solid rgba(212,168,67,0.1)',
            }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
                Prefer to write directly?
              </p>
              <a
                href={`mailto:${socialLinks.email}`}
                style={{ fontSize: '0.9375rem', color: 'var(--color-gold)', fontWeight: 600 }}
              >
                {socialLinks.email}
              </a>
            </div>

            {/* Decorative quote */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              borderLeft: '2px solid rgba(212,168,67,0.2)',
            }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontStyle: 'italic',
                color: 'rgba(212,168,67,0.5)',
                lineHeight: 1.6,
              }}>
                "A letter is the most intimate form of conversation. It demands patience, honesty, and intention."
              </p>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-muted)',
              marginBottom: '1.5rem',
            }}>
              Send a Letter
            </h3>

            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="contact-form-panel"
                style={{ textAlign: 'center' }}
              >
                <h4 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  color: 'var(--color-gold)',
                  marginBottom: '0.75rem',
                  fontWeight: 400,
                  fontStyle: 'italic',
                }}>
                  Letter Received
                </h4>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                  Thank you for your interest in York's story. We'll respond within 24 hours.
                </p>
              </div>
            ) : (
              <div className="contact-form-panel" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}>
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" style={labelStyles}>Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    style={errors.name ? errorInputStyles : inputStyles}
                    autoComplete="name"
                    placeholder="Your full name"
                  />
                  {errors.name && <p role="alert" style={{ color: 'var(--color-live)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" style={labelStyles}>Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    style={errors.email ? errorInputStyles : inputStyles}
                    autoComplete="email"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p role="alert" style={{ color: 'var(--color-live)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>}
                </div>

                {/* Intent */}
                <div>
                  <label htmlFor="contact-intent" style={labelStyles}>Intent</label>
                  <select
                    id="contact-intent"
                    value={form.intent}
                    onChange={(e) => handleChange('intent', e.target.value)}
                    style={{
                      ...(errors.intent ? errorInputStyles : inputStyles),
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%237A6A52' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="" style={{ backgroundColor: 'var(--color-ink)' }}>Select one</option>
                    <option value="acquire" style={{ backgroundColor: 'var(--color-ink)' }}>Acquire the screenplay</option>
                    <option value="produce" style={{ backgroundColor: 'var(--color-ink)' }}>Production inquiry</option>
                    <option value="access" style={{ backgroundColor: 'var(--color-ink)' }}>Request script access</option>
                    <option value="press" style={{ backgroundColor: 'var(--color-ink)' }}>Press</option>
                    <option value="other" style={{ backgroundColor: 'var(--color-ink)' }}>Other</option>
                  </select>
                  {errors.intent && <p role="alert" style={{ color: 'var(--color-live)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.intent}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" style={labelStyles}>Message</label>
                  <textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={5}
                    style={{
                      ...(errors.message ? errorInputStyles : inputStyles),
                      resize: 'vertical',
                    }}
                    placeholder="Tell us about your interest in York's story..."
                  />
                  {errors.message && <p role="alert" style={{ color: 'var(--color-live)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.message}</p>}
                </div>

                {/* Submit */}
                <MagneticButton
                  onClick={handleSubmit}
                  variant="primary"
                  id="contact-submit-btn"
                  type="button"
                >
                  Send Letter
                </MagneticButton>
              </div>
            )}

            {/* Auction Countdown */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'rgba(22,20,18,0.6)',
              border: '1px solid rgba(212,168,67,0.1)',
              borderRadius: '2px',
              backdropFilter: 'blur(4px)',
            }}>
              <span style={{
                display: 'block',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--color-muted)',
                marginBottom: '0.75rem',
                fontFamily: 'var(--font-ui)',
              }}>
                Auction Closes In
              </span>
              <Countdown targetDate={auctionConfig.auctionEndDate} />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 — CLOSING QUOTE
          ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(4rem, 8vh, 6rem) clamp(1.25rem, 4vw, 3rem)',
        textAlign: 'center',
        position: 'relative',
        background: 'linear-gradient(to bottom, var(--color-bg), rgba(22,20,18,1), var(--color-bg))',
      }}>
        {/* Gold line */}
        <div style={{
          width: '60px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
          margin: '0 auto 2.5rem',
        }} />

        <blockquote style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--color-paper)',
          lineHeight: 1.4,
          maxWidth: '650px',
          margin: '0 auto 1rem',
        }}>
          "Some stories wait centuries for the right moment to be told. York's moment is now."
        </blockquote>

        <p style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--color-muted)',
          fontFamily: 'var(--font-ui)',
        }}>
          — The York Screenplay Team
        </p>
      </section>
    </main>
  );
}
