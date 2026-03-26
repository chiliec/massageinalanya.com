-- Run this in your Supabase project SQL editor
-- Dashboard → SQL Editor → New query → paste & run

create table if not exists members (
  id            uuid        default gen_random_uuid() primary key,
  name          text        not null,
  contact_type  text        not null default 'phone',  -- phone | telegram | whatsapp | instagram | other
  contact_value text        not null default '',
  notes         text        not null default '',
  created_at    timestamptz default now()
);

create table if not exists appointments (
  id            uuid        default gen_random_uuid() primary key,
  member_id     uuid        references members(id) on delete set null,
  date          date        not null,
  start_time    time        not null,
  duration      int         not null default 60,   -- 60 or 90 minutes
  skip_cleanup  boolean     not null default false, -- skip 15-min buffer after session
  notes         text        not null default '',
  created_at    timestamptz default now()
);

-- Row Level Security: only authenticated users (the admin) can access
alter table members      enable row level security;
alter table appointments enable row level security;

create policy "Auth users can manage members"
  on members for all to authenticated
  using (true) with check (true);

create policy "Auth users can manage appointments"
  on appointments for all to authenticated
  using (true) with check (true);
