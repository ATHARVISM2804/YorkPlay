import { useState, useEffect, useRef } from 'react';
import { auctionConfig } from '../../data/auction';
import Countdown from './Countdown';
import MagneticButton from './MagneticButton';
import ParticleEmitter, { type ParticleEmitterRef } from './ParticleEmitter';
import SimulatedBids from './SimulatedBids';

/**
 * The Bid Console — centerpiece acquisition instrument.
 * Frontier Cinema styled — warm brass and leather feel.
 * TODO: wire to Supabase for real-time bid updates
 */
export default function BidConsole() {
  // TODO: wire to Supabase — replace with real-time state
  const [currentBid, setCurrentBid] = useState(auctionConfig.currentBid);
  const [bidsPlaced, setBidsPlaced] = useState(auctionConfig.bidsPlaced);
  const [leadingBidder, setLeadingBidder] = useState(auctionConfig.leadingBidder);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [displayBid, setDisplayBid] = useState(currentBid);
  const animRef = useRef<number | null>(null);
  const particleEmitterRef = useRef<ParticleEmitterRef>(null);

  const minimumNextBid = currentBid + auctionConfig.minimumIncrement;

  // Animate bid display count-up
  useEffect(() => {
    const start = displayBid;
    const end = currentBid;
    if (start === end) return;

    const duration = 800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayBid(Math.round(start + (end - start) * eased));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [currentBid]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBid = (e?: any) => {
    const amount = parseFloat(bidAmount);

    if (isNaN(amount) || amount < minimumNextBid) {
      setError(`Minimum bid is ${formatCurrency(minimumNextBid)}`);
      return;
    }

    setError('');
    // Trigger particle burst at mouse click coordinates
    if (particleEmitterRef.current && e && e.clientX && e.clientY) {
      particleEmitterRef.current.emit(e.clientX, e.clientY);
    }
    // TODO: wire to Supabase — submit bid to backend
    setCurrentBid(amount);
    setBidsPlaced(prev => prev + 1);
    setLeadingBidder('You');
    setBidAmount('');
    setConfirmed(true);

    setTimeout(() => setConfirmed(false), 4000);
  };

  return (
    <div
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

      {/* Current Bid */}
      <div style={{ marginBottom: '0.25rem' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-muted)' }}>
          Current Bid
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
          marginBottom: '1rem',
          letterSpacing: '0.02em',
        }}
      >
        {formatCurrency(displayBid)}
      </div>

      {/* Bids + Leading Bidder */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-muted)', display: 'block', marginBottom: '0.2rem', fontFamily: 'var(--font-ui)' }}>
            Bids Placed
          </span>
          <span className="tabular-nums" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-paper)', fontWeight: 400 }}>
            {bidsPlaced}
          </span>
        </div>
        <div>
          <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-muted)', display: 'block', marginBottom: '0.2rem', fontFamily: 'var(--font-ui)' }}>
            Leading Bidder
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-paper)', fontWeight: 500 }}>
            {leadingBidder}
          </span>
        </div>
      </div>

      {/* Countdown */}
      <div style={{ borderTop: '1px solid var(--color-line)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-muted)', display: 'block', marginBottom: '0.75rem', fontFamily: 'var(--font-ui)' }}>
          Auction Closes In
        </span>
        <Countdown targetDate={auctionConfig.auctionEndDate} />
      </div>

      {/* Bid Input */}
      <div style={{ borderTop: '1px solid var(--color-line)', paddingTop: '1.25rem' }}>
        <label
          htmlFor="bid-amount"
          style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-muted)', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-ui)' }}
        >
          Your Bid (min. {formatCurrency(minimumNextBid)})
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '1rem', fontWeight: 600 }}>
              {auctionConfig.currencySymbol}
            </span>
            <input
              id="bid-amount"
              type="number"
              value={bidAmount}
              onChange={(e) => {
                setBidAmount(e.target.value);
                setError('');
                setConfirmed(false);
              }}
              placeholder={minimumNextBid.toLocaleString()}
              className="tabular-nums"
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 1.75rem',
                backgroundColor: 'var(--color-ink)',
                border: error ? '1px solid var(--color-live)' : '1px solid var(--color-line)',
                borderRadius: '2px',
                color: 'var(--color-paper)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              min={minimumNextBid}
              step={auctionConfig.minimumIncrement}
            />
          </div>
          <MagneticButton
            onClick={handleBid}
            variant="primary"
            id="place-bid-btn"
          >
            Place Bid
          </MagneticButton>
        </div>

        {/* Error */}
        {error && (
          <p role="alert" style={{ color: 'var(--color-live)', fontSize: '0.8125rem', marginTop: '0.5rem' }}>
            {error}
          </p>
        )}

        {/* Confirmation */}
        {confirmed && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-gold-soft)',
              borderRadius: '2px',
              border: '1px solid rgba(212,168,67,0.2)',
            }}
          >
            <p style={{ color: 'var(--color-gold)', fontSize: '0.875rem', fontWeight: 600, margin: 0, maxWidth: 'none' }}>
              Bid placed successfully. Thank you.
            </p>
          </div>
        )}

        {/* Terms note */}
        <p style={{ fontSize: '0.6875rem', color: 'var(--color-muted)', marginTop: '1rem', lineHeight: 1.5 }}>
          {auctionConfig.termsNote}
        </p>

        {/* Live bidding updates feed */}
        <SimulatedBids
          currentBid={currentBid}
          onBidSimulated={(newAmount) => {
            setCurrentBid(newAmount);
            setBidsPlaced(prev => prev + 1);
            setLeadingBidder(prev => prev === 'You' ? 'You' : 'Anonymous Bidder');
          }}
        />
      </div>

      {/* Floating golden particle emitter overlay */}
      <ParticleEmitter ref={particleEmitterRef} />

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
