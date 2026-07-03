import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { auctionConfig, bidAgreement } from '../../data/auction';
import { supabase, isSupabaseConfigured, type BidInsert } from '../../lib/supabase';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import MagneticButton from './MagneticButton';

interface BidModalProps {
  open: boolean;
  onClose: () => void;
  /** Minimum acceptable bid (currentBid + increment). */
  minimumBid: number;
  /** Fired after a bid is successfully stored (parent triggers particle burst). */
  onSuccess?: () => void;
}

interface FormState {
  name: string;
  jobTitle: string;
  company: string;
  phone: string;
  email: string;
  bidAmount: string;
}

type FieldErrors = Partial<Record<keyof FormState | 'agreed' | 'submit', string>>;

const EMPTY_FORM: FormState = {
  name: '',
  jobTitle: '',
  company: '',
  phone: '',
  email: '',
  bidAmount: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: auctionConfig.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Binding Bid modal — shows the legal agreement above the fields, collects the
 * bidder's identity + offer, requires explicit consent, and stores the offer in
 * Supabase. Accessible: role="dialog", ESC + backdrop close, focus trap,
 * body-scroll lock. Falls back gracefully when Supabase is not configured.
 */
export default function BidModal({ open, onClose, minimumBid, onSuccess }: BidModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset state whenever the modal is (re)opened.
  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY_FORM, bidAmount: String(minimumBid) });
      setAgreed(false);
      setErrors({});
      setSubmitting(false);
      setSuccess(false);
      // Focus the first field shortly after mount.
      const t = setTimeout(() => firstFieldRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open, minimumBid]);

  // Lock body scroll while open (mirrors the Nav mobile-menu pattern).
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ESC to close + simple focus trap.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.jobTitle.trim()) next.jobTitle = 'Job title is required';
    if (!form.company.trim()) next.company = 'Company is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.email.trim() || !EMAIL_RE.test(form.email)) next.email = 'Valid email is required';

    const amount = parseFloat(form.bidAmount);
    if (isNaN(amount) || amount < minimumBid) {
      next.bidAmount = `Minimum bid is ${formatCurrency(minimumBid)}`;
    }
    if (!agreed) next.agreed = 'You must agree to the Binding Bid Agreement';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validate()) return;

    if (!isSupabaseConfigured || !supabase) {
      setErrors({ submit: 'Bidding is not yet configured. Please contact us directly to place your offer.' });
      return;
    }

    setSubmitting(true);
    setErrors({});

    const payload: BidInsert = {
      name: form.name.trim(),
      job_title: form.jobTitle.trim(),
      company: form.company.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      bid_amount: parseFloat(form.bidAmount),
      agreed: true,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    const { error } = await supabase.from('bids').insert(payload);

    if (error) {
      setSubmitting(false);
      setErrors({ submit: 'Something went wrong submitting your bid. Please try again.' });
      return;
    }

    setSubmitting(false);
    setSuccess(true);
    onSuccess?.();
    // Auto-close after the confirmation has been read.
    setTimeout(() => onClose(), 3200);
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '0.7rem 0.9rem',
    backgroundColor: 'var(--color-ink)',
    border: '1px solid var(--color-line)',
    borderRadius: '2px',
    color: 'var(--color-paper)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };
  const errStyle = (f: keyof FormState): CSSProperties =>
    errors[f] ? { ...inputStyle, borderColor: 'var(--color-live)' } : inputStyle;

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--color-muted)',
    marginBottom: '0.4rem',
    fontFamily: 'var(--font-ui)',
    fontWeight: 500,
  };
  const errMsgStyle: CSSProperties = {
    color: 'var(--color-live)',
    fontSize: '0.7rem',
    marginTop: '0.3rem',
  };

  return (
    <div
      role="presentation"
      data-lenis-prevent
      onMouseDown={(e) => {
        // Close only when the backdrop itself (not the dialog) is clicked.
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vh, 3rem) 1rem',
        overflowY: 'auto',
        backgroundColor: 'rgba(6,5,4,0.82)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: prefersReducedMotion ? 'none' : 'bidModalFade 0.3s ease',
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bid-modal-title"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          margin: '0 auto',
          background: 'var(--color-surface)',
          border: '1px solid rgba(212,168,67,0.25)',
          borderRadius: '3px',
          boxShadow: '0 30px 90px rgba(0,0,0,0.7), inset 0 1px 30px rgba(212,168,67,0.03)',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          animation: prefersReducedMotion ? 'none' : 'bidModalRise 0.45s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close bid form"
          style={{
            position: 'absolute',
            top: '0.9rem',
            right: '0.9rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-muted)',
            padding: '0.4rem',
            lineHeight: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 4L14 14M14 4L4 14" />
          </svg>
        </button>

        {success ? (
          /* ---- Success state ---- */
          <div role="status" aria-live="polite" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }} aria-hidden="true">✦</div>
            <h2
              id="bid-modal-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                color: 'var(--color-gold)',
                fontStyle: 'italic',
                fontWeight: 400,
                marginBottom: '0.75rem',
              }}
            >
              Your binding offer has been received.
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto' }}>
              Thank you, {form.name.split(' ')[0] || 'bidder'}. The screenplay owner will review your offer and
              be in touch if it is accepted or requires discussion.
            </p>
          </div>
        ) : (
          <>
            {/* ---- Binding Bid Agreement (above the fields) ---- */}
            <span className="eyebrow" style={{ display: 'block', marginBottom: '0.6rem' }}>
              Place a Binding Bid
            </span>
            <h2
              id="bid-modal-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                color: 'var(--color-paper)',
                marginBottom: '1rem',
                fontWeight: 500,
              }}
            >
              {bidAgreement.title}
            </h2>

            <div
              data-lenis-prevent
              style={{
                maxHeight: '190px',
                overflowY: 'auto',
                padding: '1rem 1.1rem',
                marginBottom: '1.5rem',
                background: 'rgba(11,10,8,0.55)',
                border: '1px solid var(--color-line)',
                borderRadius: '2px',
                overscrollBehavior: 'contain',
              }}
            >
              {bidAgreement.paragraphs.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: '0.8125rem',
                    lineHeight: 1.7,
                    color: 'var(--color-muted)',
                    marginBottom: i === bidAgreement.paragraphs.length - 1 ? 0 : '0.75rem',
                    maxWidth: 'none',
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* ---- Fields ---- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="bid-name" style={labelStyle}>Full Name</label>
                <input
                  ref={firstFieldRef}
                  id="bid-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  style={errStyle('name')}
                  placeholder="Your full name"
                />
                {errors.name && <p role="alert" style={errMsgStyle}>{errors.name}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label htmlFor="bid-job" style={labelStyle}>Job Title</label>
                  <input
                    id="bid-job"
                    type="text"
                    autoComplete="organization-title"
                    value={form.jobTitle}
                    onChange={(e) => update('jobTitle', e.target.value)}
                    style={errStyle('jobTitle')}
                    placeholder="e.g. Producer"
                  />
                  {errors.jobTitle && <p role="alert" style={errMsgStyle}>{errors.jobTitle}</p>}
                </div>
                <div>
                  <label htmlFor="bid-company" style={labelStyle}>Company</label>
                  <input
                    id="bid-company"
                    type="text"
                    autoComplete="organization"
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                    style={errStyle('company')}
                    placeholder="Company you represent"
                  />
                  {errors.company && <p role="alert" style={errMsgStyle}>{errors.company}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label htmlFor="bid-phone" style={labelStyle}>Phone Number</label>
                  <input
                    id="bid-phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    style={errStyle('phone')}
                    placeholder="+1 (000) 000-0000"
                  />
                  {errors.phone && <p role="alert" style={errMsgStyle}>{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="bid-email" style={labelStyle}>Email</label>
                  <input
                    id="bid-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    style={errStyle('email')}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p role="alert" style={errMsgStyle}>{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="bid-amount-modal" style={labelStyle}>
                  Bid Amount (min. {formatCurrency(minimumBid)})
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-muted)',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {auctionConfig.currencySymbol}
                  </span>
                  <input
                    id="bid-amount-modal"
                    type="number"
                    className="tabular-nums"
                    value={form.bidAmount}
                    onChange={(e) => update('bidAmount', e.target.value)}
                    min={minimumBid}
                    step={auctionConfig.minimumIncrement}
                    style={{ ...errStyle('bidAmount'), paddingLeft: '1.9rem' }}
                    placeholder={String(minimumBid)}
                  />
                </div>
                {errors.bidAmount && <p role="alert" style={errMsgStyle}>{errors.bidAmount}</p>}
              </div>

              {/* ---- Consent checkbox ---- */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginTop: '0.25rem' }}>
                <input
                  id="bid-agree"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: undefined }));
                  }}
                  style={{
                    width: '15px',
                    height: '15px',
                    marginTop: '2px',
                    accentColor: 'var(--color-gold)',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
                <label
                  htmlFor="bid-agree"
                  style={{
                    fontSize: '0.78rem',
                    lineHeight: 1.5,
                    color: agreed ? 'var(--color-paper)' : 'var(--color-muted)',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {bidAgreement.consentLabel}
                </label>
              </div>
              {errors.agreed && <p role="alert" style={errMsgStyle}>{errors.agreed}</p>}

              {/* ---- Submit ---- */}
              <div style={{ marginTop: '0.5rem' }}>
                <MagneticButton
                  onClick={handleSubmit}
                  variant="primary"
                  disabled={submitting}
                  id="submit-binding-bid"
                >
                  {submitting ? 'Submitting…' : 'Submit Binding Bid'}
                </MagneticButton>
              </div>

              {errors.submit && (
                <p role="alert" style={{ ...errMsgStyle, fontSize: '0.8rem' }}>{errors.submit}</p>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes bidModalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bidModalRise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
