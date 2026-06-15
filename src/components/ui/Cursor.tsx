import { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor — a small ring that follows the mouse,
 * scales up on interactive elements, and shows context labels.
 * Hidden on touch devices.
 */
export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Detect touch device
    const mq = window.matchMedia('(pointer: coarse)');
    if (mq.matches) {
      setIsTouch(true);
      return;
    }

    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseEnterInteractive = (e: Event) => {
      const el = e.target as HTMLElement;
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      cursor.style.borderColor = 'var(--color-gold)';
      cursor.style.mixBlendMode = 'normal';

      // Check for data-cursor-label
      const cursorLabel = el.closest('[data-cursor-label]')?.getAttribute('data-cursor-label');
      if (cursorLabel) {
        label.textContent = cursorLabel;
        label.style.opacity = '1';
      }
    };

    const onMouseLeaveInteractive = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.borderColor = 'var(--color-paper)';
      cursor.style.mixBlendMode = 'difference';
      label.textContent = '';
      label.style.opacity = '0';
    };

    // Animation loop with lerp
    let rafId: number;
    const animate = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.15;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.15;
      cursor.style.left = `${posRef.current.x}px`;
      cursor.style.top = `${posRef.current.y}px`;
      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);

    // Attach to interactive elements
    const interactives = document.querySelectorAll('a, button, [data-cursor-label], input, select, textarea');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });

    rafId = requestAnimationFrame(animate);

    // Use MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      const newInteractives = document.querySelectorAll('a, button, [data-cursor-label], input, select, textarea');
      newInteractives.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterInteractive);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '1.5px solid var(--color-paper)',
        transform: 'translate(-50%, -50%) scale(1)',
        pointerEvents: 'none',
        zIndex: 99999,
        mixBlendMode: 'difference',
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease, mix-blend-mode 0.35s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        ref={labelRef}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '8px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--color-gold)',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          whiteSpace: 'nowrap',
          mixBlendMode: 'normal',
        }}
      />
    </div>
  );
}
