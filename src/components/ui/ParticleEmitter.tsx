import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ParticleEmitterRef {
  emit: (x: number, y: number) => void;
}

const ParticleEmitter = forwardRef<ParticleEmitterRef, {}>((_props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);

  useImperativeHandle(ref, () => ({
    emit(x: number, y: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const relativeX = x - rect.left;
      const relativeY = y - rect.top;

      // Spawn 50 luxury gold particles
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4.5;
        particlesRef.current.push({
          x: relativeX,
          y: relativeY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.0, // bias upward float
          size: 1 + Math.random() * 3,
          alpha: 1.0,
          color: `rgba(200, 165, 91, ${0.7 + Math.random() * 0.3})`, // gold tone #C8A55B
          decay: 0.012 + Math.random() * 0.015,
          friction: 0.98,
        });
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Physics update
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += 0.06; // slight gravity
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        
        // Draw standard blur-glow effect for large gold particles
        if (p.size > 2.5) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'var(--color-gold)';
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        width: '100%',
        height: '100%',
      }}
    />
  );
});

ParticleEmitter.displayName = 'ParticleEmitter';
export default ParticleEmitter;
