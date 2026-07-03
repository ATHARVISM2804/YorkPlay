import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client — single instance for the whole app.
 *
 * Reads credentials from Vite env vars (see `.env.example`). The anon key is
 * safe to ship in the browser; data is protected by Row-Level Security.
 *
 * If env vars are missing, `supabase` is `null` and the app still renders —
 * bid submission and admin login surface a friendly "not configured" message
 * instead of crashing.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to .env.local and fill in your project credentials.',
  );
}

/** Shape of a bid row in the `bids` table. */
export interface BidRow {
  id: string;
  created_at: string;
  name: string;
  job_title: string;
  company: string;
  phone: string;
  email: string;
  bid_amount: number;
  agreed: boolean;
  user_agent: string | null;
}

/** Payload for inserting a new binding bid. */
export interface BidInsert {
  name: string;
  job_title: string;
  company: string;
  phone: string;
  email: string;
  bid_amount: number;
  agreed: boolean;
  user_agent?: string;
}
