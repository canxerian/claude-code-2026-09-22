-- profiles: one row per authenticated user, decoupled from auth.users
-- so app-owned columns (and later subscription_status) don't require
-- touching the auth schema.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
  -- future: subscription_status text not null default 'free'
);

-- habits: the user's list of daily habits
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  color text,
  sort_order integer not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create index habits_user_id_idx on public.habits(user_id);
create index habits_user_active_idx on public.habits(user_id) where archived_at is null;

-- habit_logs: one row per (habit, calendar day) check-in
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_on date not null,
  created_at timestamptz not null default now(),
  unique (habit_id, completed_on)
);

create index habit_logs_habit_id_idx on public.habit_logs(habit_id);
create index habit_logs_user_date_idx on public.habit_logs(user_id, completed_on);

-- profiles auto-provisioned on signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);
-- no insert/delete policy: profile rows are created only by the trigger

create policy "habits: select own" on public.habits
  for select using (auth.uid() = user_id);
create policy "habits: insert own" on public.habits
  for insert with check (auth.uid() = user_id);
create policy "habits: update own" on public.habits
  for update using (auth.uid() = user_id);
create policy "habits: delete own" on public.habits
  for delete using (auth.uid() = user_id);

create policy "habit_logs: select own" on public.habit_logs
  for select using (auth.uid() = user_id);
create policy "habit_logs: insert own" on public.habit_logs
  for insert with check (auth.uid() = user_id);
create policy "habit_logs: delete own" on public.habit_logs
  for delete using (auth.uid() = user_id);
-- no update policy needed: a log row is either present (done) or absent
-- (not done) for a given day; toggling off is a delete, not an update
