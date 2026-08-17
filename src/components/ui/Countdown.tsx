import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: string;
  compact?: boolean;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Live countdown timer updating every second.
 * Uses tabular figures for crisp alignment.
 */
export default function Countdown({ targetDate, compact = false, className = '' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (compact) {
    return (
      <span className={`tabular-nums ${className}`} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption)', color: 'var(--color-muted)', letterSpacing: '0.05em' }}>
        {pad(timeLeft.days)}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
      </span>
    );
  }

  return (
    <div className={`${className}`} style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 2.5rem)' }}>
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sec' },
      ].map(({ value, label }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div
            className="tabular-nums"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 300,
              color: 'var(--color-paper)',
              lineHeight: 1,
              fontVariationSettings: "'opsz' 72",
            }}
          >
            {pad(value)}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-muted)',
              marginTop: '0.4rem',
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

// Length of one auction cycle. When a deadline passes, the countdown rolls
// forward by whole cycles so it stays perpetually live and never sticks at zero.
const CYCLE_MS = 30 * 24 * 60 * 60 * 1000;

function calculateTimeLeft(targetDate: string): TimeLeft {
  const now = Date.now();
  let target = new Date(targetDate).getTime();
  if (target <= now) {
    // Advance by at least one full cycle so the target is always in the future.
    const cyclesPassed = Math.floor((now - target) / CYCLE_MS) + 1;
    target += cyclesPassed * CYCLE_MS;
  }
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}
