import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface ViewfinderProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
}

export default function Viewfinder({ heroRef }: ViewfinderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [batteryState, setBatteryState] = useState(88);

  // Timecode animation loop (24 FPS)
  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsedMs = Date.now() - startTime;
      const totalFrames = Math.floor((elapsedMs * 24) / 1000);
      
      const frames = totalFrames % 24;
      const totalSeconds = Math.floor(totalFrames / 24);
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60) % 24;

      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimecode(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`);
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  // Battery drain simulation
  useEffect(() => {
    const batteryInterval = setInterval(() => {
      setBatteryState(prev => (prev > 1 ? prev - 1 : 99));
    }, 45000); // drain battery slowly

    return () => clearInterval(batteryInterval);
  }, []);

  // Mouse tilt parallax using GSAP
  useEffect(() => {
    const hero = heroRef.current;
    const container = containerRef.current;
    if (!hero || !container) return;

    // We tilt the viewfinder HUD slightly when the mouse moves over the hero
    const onMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xc = rect.width / 2;
      const yc = rect.height / 2;

      // Calculate relative delta (-1 to 1)
      const dx = (x - xc) / xc;
      const dy = (y - yc) / yc;

      // Target rotation values (mild 3D effect)
      gsap.to(container, {
        rotationY: dx * 8, // rotate up to 8 degrees horizontally
        rotationX: -dy * 8, // rotate up to 8 degrees vertically
        x: dx * 15, // slide slightly on x axis
        y: dy * 15, // slide slightly on y axis
        duration: 0.8,
        ease: 'power2.out',
      });
    };

    const onMouseLeave = () => {
      // Return to center
      gsap.to(container, {
        rotationY: 0,
        rotationX: 0,
        x: 0,
        y: 0,
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
  }, [heroRef]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '88%',
          height: '80%',
          border: '1px solid rgba(244, 241, 234, 0.08)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* VIEWPLAN VIEWFINDER CORNER BRACKETS */}
        {/* Top-Left Bracket */}
        <div style={{ position: 'absolute', top: '-1px', left: '-1px', width: '24px', height: '24px', borderTop: '2px solid var(--color-gold)', borderLeft: '2px solid var(--color-gold)' }} />
        {/* Top-Right Bracket */}
        <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '24px', height: '24px', borderTop: '2px solid var(--color-gold)', borderRight: '2px solid var(--color-gold)' }} />
        {/* Bottom-Left Bracket */}
        <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '24px', height: '24px', borderBottom: '2px solid var(--color-gold)', borderLeft: '2px solid var(--color-gold)' }} />
        {/* Bottom-Right Bracket */}
        <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '24px', height: '24px', borderBottom: '2px solid var(--color-gold)', borderRight: '2px solid var(--color-gold)' }} />

        {/* TOP ROW HUD */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.1em', color: 'var(--color-muted)' }}>
          {/* Left info: REC pulsing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-live)',
                display: 'inline-block',
                animation: 'recPulse 1s steps(2) infinite',
              }}
            />
            <span style={{ color: 'var(--color-paper)', fontWeight: 600 }}>REC</span>
          </div>

          {/* Center info: Timecode */}
          <div style={{ color: 'var(--color-paper)', fontSize: '11px', letterSpacing: '0.15em', fontWeight: 600 }}>
            TC {timecode}
          </div>

          {/* Right info: FPS / Shutter */}
          <div>
            24FPS &nbsp;&nbsp;&nbsp; SHUTTER 180°
          </div>
        </div>

        {/* CENTER CROSSHAIR / VIEW GRID */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.2,
          }}
        >
          {/* Small Cross */}
          <div style={{ position: 'absolute', width: '12px', height: '1px', backgroundColor: 'var(--color-paper)' }} />
          <div style={{ position: 'absolute', height: '12px', width: '1px', backgroundColor: 'var(--color-paper)' }} />
          {/* Target circle */}
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px dashed var(--color-paper)' }} />
        </div>

        {/* BOTTOM ROW HUD */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.1em', color: 'var(--color-muted)' }}>
          {/* Left info: Resolution / Codec */}
          <div>
            4K DCI &nbsp;&nbsp;&nbsp; PRORES 422 HQ
          </div>

          {/* Right info: ISO & Battery */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>ISO 800</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>BAT {batteryState}%</span>
              <div
                style={{
                  width: '18px',
                  height: '10px',
                  border: '1px solid var(--color-muted)',
                  padding: '1px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: `${(batteryState / 100) * 14}px`,
                    height: '100%',
                    backgroundColor: batteryState < 20 ? 'var(--color-live)' : 'var(--color-gold)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes recPulse {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
