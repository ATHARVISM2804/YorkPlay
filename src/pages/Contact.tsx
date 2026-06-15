import { useState } from 'react';
import { contacts, auctionConfig, socialLinks } from '../data/auction';
import MagneticButton from '../components/ui/MagneticButton';
import Countdown from '../components/ui/Countdown';
import RevealText from '../components/ui/RevealText';

interface ContactFormState {
  name: string;
  email: string;
  intent: string;
  message: string;
}

/**
 * PAGE 4 — CORRESPONDENCE
 * Contact form styled with frontier warmth.
 * TODO: wire to email service or Supabase
 */
export default function Contact() {
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    intent: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<ContactFormState>>({});
  const [submitted, setSubmitted] = useState(false);

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
    // TODO: wire to email service or Supabase
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
    backgroundColor: 'var(--color-ink)',
    border: '1px solid var(--color-line)',
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
    <main id="main-content" tabIndex={-1}>
      <section
        style={{
          padding: 'clamp(8rem, 14vh, 12rem) clamp(1.25rem, 4vw, 3rem) var(--spacing-section)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 'clamp(3rem, 6vh, 5rem)' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
            Correspondence
          </span>
          <RevealText as="h1">
            Begin the conversation.
          </RevealText>
          <p style={{ marginTop: '1rem', fontSize: '0.9375rem', color: 'var(--color-muted)', maxWidth: '500px', fontStyle: 'italic' }}>
            Whether you're a producer, studio, or storyteller — we'd like to hear from you.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(3rem, 6vw, 5rem)',
          }}
        >
          {/* Left — Contact Blocks */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-muted)',
                marginBottom: '1.5rem',
              }}
            >
              Direct Contacts
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {contacts.map((contact) => (
                <div
                  key={contact.name}
                  style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-line)',
                    borderRadius: '2px',
                    transition: 'border-color 0.4s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212,168,67,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-line)';
                  }}
                >
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--color-paper)', fontWeight: 500, marginBottom: '0.25rem' }}>
                    {contact.name}
                  </h4>
                  <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', marginBottom: '0.75rem', fontFamily: 'var(--font-ui)' }}>
                    {contact.role}
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    style={{ fontSize: '0.875rem', color: 'var(--color-paper)', display: 'block', marginBottom: '0.25rem' }}
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
                          style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'rgba(212,168,67,0.3)' }}
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
            <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid var(--color-line)' }}>
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
          </div>

          {/* Right — Contact Panel */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-muted)',
                marginBottom: '1.5rem',
              }}
            >
              Send a Letter
            </h3>

            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  padding: '2rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid rgba(212,168,67,0.2)',
                  borderRadius: '2px',
                  textAlign: 'center',
                }}
              >
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-gold)', marginBottom: '0.75rem', fontWeight: 400, fontStyle: 'italic' }}>
                  Letter Received
                </h4>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem' }}>
                  Thank you for your interest in York's story. We'll respond within 24 hours.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  padding: '2rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-line)',
                  borderRadius: '2px',
                }}
              >
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
            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-line)', borderRadius: '2px' }}>
              <span style={{ display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-muted)', marginBottom: '0.75rem', fontFamily: 'var(--font-ui)' }}>
                Auction Closes In
              </span>
              <Countdown targetDate={auctionConfig.auctionEndDate} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
