import { useEffect, useState } from 'react';
import { auctionConfig } from '../../data/auction';

interface BidEvent {
  id: string;
  time: string;
  bidder: string;
  amount: number;
}

interface SimulatedBidsProps {
  currentBid: number;
  onBidSimulated?: (newAmount: number) => void;
}

export default function SimulatedBids({ currentBid, onBidSimulated }: SimulatedBidsProps) {
  const [bids, setBids] = useState<BidEvent[]>([]);

  // Initialize with some historical bids below current bid
  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const minutesAgo = (m: number) => {
      const d = new Date(now.getTime() - m * 60000);
      return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const initialBids: BidEvent[] = [
      {
        id: '1',
        time: minutesAgo(24),
        bidder: 'Chicago Media Capital',
        amount: Math.max(auctionConfig.startingBid, currentBid - 45000),
      },
      {
        id: '2',
        time: minutesAgo(12),
        bidder: 'Anonymous (Gold Coast)',
        amount: Math.max(auctionConfig.startingBid, currentBid - 20000),
      },
      {
        id: '3',
        time: minutesAgo(3),
        bidder: 'Wicker Park Studios',
        amount: Math.max(auctionConfig.startingBid, currentBid - 5000),
      },
    ];

    setBids(initialBids);
  }, []); // Run once on mount

  // Simulate new bids in the background
  useEffect(() => {
    const intervals = [16000, 22000, 30000]; // random tick times
    let timeoutId: number;

    const addNewBid = () => {
      // Don't add if window isn't active (save CPU/memory)
      if (document.hidden) return;

      const lastBid = bids.length > 0 ? bids[bids.length - 1].amount : currentBid;
      const nextIncrement = auctionConfig.minimumIncrement + (Math.floor(Math.random() * 3) * 5000);
      const newAmount = lastBid + nextIncrement;

      // Don't let simulation jump ahead of a high user bid too aggressively
      if (newAmount > currentBid + 80000) return;

      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeString = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      const bidders = [
        'Anonymous (Lincoln Park)',
        'River North Production Co',
        'Independent Producer (Loop)',
        'Hyde Park Creative Fund',
        'Chicago Film Syndicate',
        'Anonymous (Gold Coast)',
      ];
      const randomBidder = bidders[Math.floor(Math.random() * bidders.length)];

      const newBid: BidEvent = {
        id: Date.now().toString(),
        time: timeString,
        bidder: randomBidder,
        amount: newAmount,
      };

      setBids(prev => [...prev.slice(-3), newBid]); // Keep last 4 bids
      
      // Notify parent console to update state
      if (onBidSimulated) {
        onBidSimulated(newAmount);
      }
    };

    const scheduleNext = () => {
      const nextTime = intervals[Math.floor(Math.random() * intervals.length)];
      timeoutId = setTimeout(() => {
        addNewBid();
        scheduleNext();
      }, nextTime) as any;
    };

    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, [bids, currentBid, onBidSimulated]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--color-line)', paddingTop: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-muted)' }}>
          Live Bidding Feed
        </span>
        <span style={{ fontSize: '0.5625rem', textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '0.1em', animation: 'simulcastPulse 2s infinite' }}>
          ● SIMULCAST ACTIVE
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {bids.slice().reverse().map((bid) => (
          <div
            key={bid.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-body)',
              padding: '0.4rem 0.6rem',
              backgroundColor: 'rgba(244, 241, 234, 0.01)',
              border: '1px solid rgba(244, 241, 234, 0.03)',
              borderRadius: '2px',
              animation: 'bidSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-muted)' }}>
              <span style={{ fontFamily: 'monospace' }}>[{bid.time}]</span>
              <span style={{ color: 'var(--color-paper)' }}>{bid.bidder}</span>
            </div>
            <div style={{ color: 'var(--color-gold)', fontWeight: 600 }} className="tabular-nums">
              {formatCurrency(bid.amount)}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes simulcastPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes bidSlideIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
