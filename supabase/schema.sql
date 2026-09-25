-- ============================================================
-- YORK SCREENPLAY — Binding Bid schema
-- Run this in the Supabase dashboard → SQL Editor → New query.
-- Safe to re-run (idempotent).
-- ============================================================

-- 1) Table --------------------------------------------------
create table if not exists public.bids (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text        not null,
  job_title   text        not null,
  company     text        not null,
  phone       text        not null,
  email       text        not null,
  bid_amount  numeric     not null check (bid_amount > 0),
  agreed      boolean     not null default false,
  user_agent  text
);

-- Helpful index for the admin dashboard (sort by highest offer / newest)
create index if not exists bids_amount_idx  on public.bids (bid_amount desc);
create index if not exists bids_created_idx on public.bids (created_at desc);

-- 2) Row Level Security -------------------------------------
alter table public.bids enable row level security;

-- Anonymous visitors may ONLY insert a bid, and only a valid one.
-- They can never read any bids back.
drop policy if exists insert_public on public.bids;
create policy insert_public
  on public.bids
  for insert
  to anon, authenticated
  with check (agreed = true and bid_amount > 0);

-- Only authenticated users (the owner, signed in via Supabase Auth)
-- may read the bids for the admin dashboard.
drop policy if exists select_admin on public.bids;
create policy select_admin
  on public.bids
  for select
  to authenticated
  using (true);

-- NOTE: no UPDATE or DELETE policies are defined, so those actions are
-- denied for everyone through the API. Manage/remove rows (if ever needed)
-- from the Supabase Table Editor, which uses the service role.

-- ============================================================
-- After running this:
--   • Authentication → Users → Add user  (owner's email + password)
--   • Copy Project URL + anon public key into .env.local
-- ============================================================

-- ============================================================
-- Script access requests
-- The screenplay is not published publicly; interested parties
-- request it here and the owner sends it manually.
-- ============================================================

create table if not exists public.script_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text        not null,
  company     text        not null,
  role        text        not null,
  email       text        not null,
  message     text,
  user_agent  text
);

create index if not exists script_requests_created_idx
  on public.script_requests (created_at desc);

alter table public.script_requests enable row level security;

-- Anonymous visitors may only submit a request; they can never read them back.
drop policy if exists script_requests_insert_public on public.script_requests;
create policy script_requests_insert_public
  on public.script_requests
  for insert
  to anon, authenticated
  with check (length(name) > 0 and length(email) > 0);

-- Only the signed-in owner may read requests.
drop policy if exists script_requests_select_admin on public.script_requests;
create policy script_requests_select_admin
  on public.script_requests
  for select
  to authenticated
  using (true);
