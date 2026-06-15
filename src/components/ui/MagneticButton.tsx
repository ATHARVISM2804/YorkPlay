import { useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: (e: ReactMouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  target?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  id?: string;
  'data-cursor-label'?: string;
}

/**
 * A button with a magnetic pull effect on hover and a clean fill sweep.
 * Falls back to static on reduced motion.
 */
export default function MagneticButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  href,
  target,
  type = 'button',
  disabled = false,
  id,
  ...rest
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (prefersReducedMotion || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btnRef.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = 'translate(0, 0)';
  };

  const baseStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--text-caption)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    padding: '0.875rem 2rem',
    borderRadius: '2px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    overflow: 'hidden',
    transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), color 0.4s ease, border-color 0.4s ease',
    opacity: disabled ? 0.5 : 1,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-gold)',
      color: 'var(--color-ink)',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--color-paper)',
      border: '1px solid var(--color-line)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-gold)',
      border: 'none',
      padding: '0.5rem 0',
    },
  };

  const styles = { ...baseStyles, ...variantStyles[variant] };

  const commonProps = {
    ref: btnRef as React.Ref<HTMLButtonElement & HTMLAnchorElement>,
    style: styles,
    className: `magnetic-btn ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    id,
    ...rest,
  };

  if (href) {
    return (
      <a
        {...commonProps}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      {...commonProps}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
