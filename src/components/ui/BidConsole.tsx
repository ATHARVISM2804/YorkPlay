import { useState, useRef } from 'react';
import { auctionConfig } from '../../data/auction';
import Countdown from './Countdown';
import MagneticButton from './MagneticButton';
import ParticleEmitter, { type ParticleEmitterRef } from './ParticleEmitter';
import BidModal from './BidModal';

/**
 * The Bid Console — the acquisition instrument.
 * Displays the reserve/starting figure and auction status, then opens the
 * Binding Bid modal where a real, legally-binding offer is collected and stored.
 */
export default function BidConsole() {
  const [modalOpen, setModalOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const particleEmitterRef = useRef<ParticleEmitterRef>(null);

  const currentBid = auctionConfig.currentBid;
  const minimumNextBid = currentBid + auctionConfig.minimumIncrement;

  // Fire the celebratory gold particle burst from the centre of the console.
  const burst = () => {
    const el = rootRef.current;
    if (!el || !particleEmitterRef.current) return;
    const rect = el.getBoundingClientRect();
    particleEmitterRef.current.emit(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  return (
    <div
      id="bid-console"
      ref={rootRef}
      data-cursor-label="BID"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid rgba(212,168,67,0.2)',
        borderRadius: '2px',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        maxWidth: '540px',
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        boxShadow: 'inset 0 1px 40px rgba(212,168,67,0.03), 0 0 80px rgba(0,0,0,0.4)',
      }}
    >
      {/* LIVE chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-live)',
            display: 'inline-block',
            animation: 'livePulse 2s ease-in-out infinite',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--color-live)',
          }}
        >
          Auction Live
        </span>
      </div>

      {/* Reserve / starting figure */}
      <div style={{ marginBottom: '0.25rem' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-muted)' }}>
          Current Reserve
        </span>
      </div>
      <div
        className="tabular-nums"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 400,
          color: 'var(--color-gold)',
          lineHeight: 1,
          marginBottom: '1.5rem',
          letterSpacing: '0.02em',
        }}
      >
        {formatCurrency(currentBid)}
      </div>

      {/* Countdown */}
      <div style={{ borderTop: '1px solid var(--color-line)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-muted)', display: 'block', marginBottom: '0.75rem', fontFamily: 'var(--font-ui)' }}>
          Auction Closes In
        </span>
        <Countdown targetDate={auctionConfig.auctionEndDate} />
      </div>

      {/* Place a Binding Bid */}
      <div style={{ borderTop: '1px solid var(--color-line)', paddingTop: '1.5rem' }}>
        <MagneticButton onClick={() => setModalOpen(true)} variant="primary" id="open-bid-modal-btn">
          Place a Binding Bid
        </MagneticButton>

        <p style={{ fontSize: '0.6875rem', color: 'var(--color-muted)', marginTop: '1rem', lineHeight: 1.5 }}>
          Minimum bid {formatCurrency(minimumNextBid)}. {auctionConfig.termsNote}
        </p>
      </div>

      {/* Floating golden particle emitter overlay */}
      <ParticleEmitter ref={particleEmitterRef} />

      {/* Binding Bid modal */}
      <BidModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        minimumBid={minimumNextBid}
        onSuccess={burst}
      />

      {/* Pulse animation */}
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
