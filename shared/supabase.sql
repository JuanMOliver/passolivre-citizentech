-- Global Solution CitizenTech · PassoLivre
-- Banco público de demonstração. Execute no SQL Editor do Supabase.
-- NUNCA disponibilize a chave service_role em clientes mobile/web.
create extension if not exists pgcrypto;
create table if not exists public.reports (
 id uuid primary key default gen_random_uuid(),
 title text not null check(char_length(btrim(title)) between 5 and 100),
 category text not null check(category in ('Buraco','Degrau','Calçada obstruída','Rampa ausente','Piso irregular','Outro')),
 description text not null check(char_length(btrim(description)) between 10 and 1000),
 address text not null check(char_length(btrim(address)) between 5 and 160),
 neighborhood text not null check(char_length(btrim(neighborhood)) between 2 and 90),
 latitude double precision check(latitude between -90 and 90),
 longitude double precision check(longitude between -180 and 180),
 status text not null default 'recebido' check(status in ('recebido','em_acompanhamento','resolvido')),
 supports_count integer not null default 0 check(supports_count>=0),
 created_at timestamptz not null default now()
);
create table if not exists public.supports (
 id uuid primary key default gen_random_uuid(),
 report_id uuid not null references public.reports(id) on delete cascade,
 device_id text not null check(char_length(device_id) between 5 and 80),
 created_at timestamptz not null default now(),
 unique(report_id,device_id)
);
create index if not exists reports_created_idx on public.reports(created_at desc);
create index if not exists reports_neighborhood_idx on public.reports(neighborhood);
create index if not exists supports_report_idx on public.supports(report_id);
alter table public.reports enable row level security;
alter table public.supports enable row level security;
revoke all on public.reports from anon,authenticated;
revoke all on public.supports from anon,authenticated;
grant usage on schema public to anon,authenticated;
grant select,insert on public.reports to anon,authenticated;
grant insert on public.supports to anon,authenticated;
drop policy if exists "Leitura pública de relatos" on public.reports;
create policy "Leitura pública de relatos" on public.reports for select to anon,authenticated using(true);
drop policy if exists "Cidadão pode registrar relato" on public.reports;
create policy "Cidadão pode registrar relato" on public.reports for insert to anon,authenticated with check(status='recebido' and supports_count=0);
drop policy if exists "Cidadão pode apoiar" on public.supports;
create policy "Cidadão pode apoiar" on public.supports for insert to anon,authenticated with check(true);
-- Gatilho inacessível diretamente pela API pública
create schema if not exists internal;
revoke all on schema internal from public,anon,authenticated;
create or replace function internal.increment_report_supports()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 update public.reports set supports_count=supports_count+1 where id=new.report_id;
 return new;
end; $$;
revoke all on function internal.increment_report_supports() from public,anon,authenticated;
drop trigger if exists on_support_created on public.supports;
create trigger on_support_created after insert on public.supports
for each row execute function internal.increment_report_supports();
-- Aviso: proteção RLS não substitui moderação, CAPTCHA ou rate limiting.
