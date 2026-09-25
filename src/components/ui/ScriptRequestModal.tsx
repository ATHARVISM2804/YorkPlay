import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { socialLinks } from '../../data/auction';
import { supabase, isSupabaseConfigured, type ScriptRequestInsert } from '../../lib/supabase';
import MagneticButton from './MagneticButton';

interface ScriptRequestModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  company: string;
  role: string;
  email: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof FormState | 'submit', string>>;

const EMPTY_FORM: FormState = { name: '', company: '', role: '', email: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Script access request.
 *
 * The screenplay is deliberately not published as a public download — that
 * would surrender all control over who holds the material. Interested parties
 * identify themselves here and the owner sends the script manually.
 */
export default function ScriptRequestModal({ open, onClose }: ScriptRequestModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset each time the dialog opens, and focus the first field.
  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    setErrors({});
    setSuccess(false);
    const t = setTimeout(() => firstFieldRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [open]);

  // ESC to close + lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!form.name.trim()) next.name = 'Required';
    if (!form.company.trim()) next.company = 'Required';
    if (!form.role.trim()) next.role = 'Required';
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (submitting || !validate()) return;

    if (!isSupabaseConfigured || !supabase) {
      setErrors({ submit: `Requests are not yet configured. Please email ${socialLinks.email} directly.` });
      return;
    }

    setSubmitting(true);
    setErrors({});

    const payload: ScriptRequestInsert = {
      name: form.name.trim(),
      company: form.company.trim(),
      role: form.role.trim(),
      email: form.email.trim(),
      message: form.message.trim() || undefined,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    const { error } = await supabase.from('script_requests').insert(payload);
    setSubmitting(false);

    if (error) {
      setErrors({ submit: `Something went wrong. Please email ${socialLinks.email} directly.` });
      return;
    }
    setSuccess(true);
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
  };
  const fieldStyle = (f: keyof FormState): CSSProperties =>
    errors[f] ? { ...inputStyle, borderColor: 'var(--color-live)' } : inputStyle;

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--color-muted)',
    marginBottom: '0.4rem',
    fontFamily: 'var(--font-ui)',
  };
  const errText = (f: keyof FormState) =>
    errors[f] ? <p style={{ color: 'var(--color-live)', fontSize: '0.7rem', marginTop: '0.3rem' }}>{errors[f]}</p> : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: 'rgba(5,4,3,0.88)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto',
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Request the screenplay"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--color-surface)',
          border: '1px solid rgba(212,168,67,0.25)',
          borderRadius: '3px',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          boxShadow: '0 40px 90px rgba(0,0,0,0.7)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {success ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-gold)', marginBottom: '1rem' }}>
              Request received
            </h2>
            <p style={{ color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '1.75rem' }}>
              Thank you for your interest in YORK. The screenplay will be sent to{' '}
              <span style={{ color: 'var(--color-paper)' }}>{form.email.trim()}</span> once your request
              has been reviewed. All serious inquiries are answered as promptly as possible.
            </p>
            <MagneticButton onClick={onClose} variant="primary">Close</MagneticButton>
          </div>
        ) : (
          <>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '0.75rem' }}>The Manuscript</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--color-paper)', marginBottom: '0.75rem' }}>
              Request the complete script
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              The full 132-page screenplay is shared privately with producers, financiers and
              representation. Tell us who you are and we will send it to you directly.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle} htmlFor="sr-name">Name</label>
                <input id="sr-name" ref={firstFieldRef} value={form.name} onChange={set('name')} style={fieldStyle('name')} />
                {errText('name')}
              </div>
              <div>
                <label style={labelStyle} htmlFor="sr-company">Company / Affiliation</label>
                <input id="sr-company" value={form.company} onChange={set('company')} style={fieldStyle('company')} />
                {errText('company')}
              </div>
              <div>
                <label style={labelStyle} htmlFor="sr-role">Role</label>
                <input id="sr-role" placeholder="Producer, Executive, Agent…" value={form.role} onChange={set('role')} style={fieldStyle('role')} />
                {errText('role')}
              </div>
              <div>
                <label style={labelStyle} htmlFor="sr-email">Email</label>
                <input id="sr-email" type="email" value={form.email} onChange={set('email')} style={fieldStyle('email')} />
                {errText('email')}
              </div>
              <div>
                <label style={labelStyle} htmlFor="sr-message">Message (optional)</label>
                <textarea id="sr-message" rows={3} value={form.message} onChange={set('message')} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>

            {errors.submit && (
              <p style={{ color: 'var(--color-live)', fontSize: '0.8rem', marginTop: '1rem' }}>{errors.submit}</p>
            )}

            <div style={{ marginTop: '1.75rem' }}>
              <MagneticButton onClick={handleSubmit} variant="primary">
                {submitting ? 'Sending…' : 'Request the Script'}
              </MagneticButton>
            </div>

            <button
              onClick={onClose}
              style={{
                marginTop: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--color-muted)',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
