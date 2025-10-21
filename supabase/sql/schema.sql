-- ARC MVP schema (tables + RLS)
create extension if not exists postgis;
create extension if not exists pgcrypto;

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  phone text,
  default_settings jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  relationship text,
  consented_at timestamptz
);

create table adventures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text,
  activity_type text,
  trail_name text,
  parking_geo geography(Point,4326),
  vehicle_desc text,
  clothing_desc text,
  start_at timestamptz,
  eta_at timestamptz,
  notes text,
  status text check (status in ('draft','active','completed','overdue')) default 'draft',
  created_at timestamptz default now()
);

create table adventure_contacts (
  id uuid primary key default gen_random_uuid(),
  adventure_id uuid references adventures(id) on delete cascade,
  contact_id uuid references emergency_contacts(id) on delete cascade,
  role text check (role in ('notify','view')) default 'notify'
);

create table waypoints (
  id uuid primary key default gen_random_uuid(),
  adventure_id uuid references adventures(id) on delete cascade,
  seq int,
  geom geography(Point,4326),
  recorded_at timestamptz default now(),
  source text check (source in ('user','gps'))
);

create table checkins (
  id uuid primary key default gen_random_uuid(),
  adventure_id uuid references adventures(id) on delete cascade,
  kind text check (kind in ('start','safe','note','auto')),
  message text,
  created_at timestamptz default now()
);

create table escalation_rules (
  id uuid primary key default gen_random_uuid(),
  adventure_id uuid references adventures(id) on delete cascade,
  timer_deadline_at timestamptz not null,
  window_mins int default 15,
  level1 boolean default true,
  level2 boolean default true,
  created_at timestamptz default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  adventure_id uuid references adventures(id) on delete cascade,
  contact_id uuid references emergency_contacts(id) on delete cascade,
  channel text check (channel in ('push','sms','email')),
  payload jsonb,
  sent_at timestamptz,
  status text
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  adventure_id uuid references adventures(id) on delete cascade,
  actor_id uuid references profiles(id),
  action text,
  details jsonb,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "own profile" on profiles for all using (id = auth.uid());

alter table adventures enable row level security;
create policy "owner can select" on adventures for select using (user_id = auth.uid());
create policy "owner can mutate" on adventures for all using (user_id = auth.uid());

alter table emergency_contacts enable row level security;
create policy "owner contacts" on emergency_contacts for all using (user_id = auth.uid());
