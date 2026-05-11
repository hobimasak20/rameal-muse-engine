
create table public.persona (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Wandy POV',
  identity_md text not null default '',
  style_md text not null default '',
  do_md text not null default '',
  dont_md text not null default '',
  updated_at timestamptz not null default now()
);

create table public.ideas (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  tone text not null,
  viral_boost boolean not null default false,
  title text not null,
  hook text not null,
  foreshadow text not null,
  body text not null,
  ending text not null,
  caption text not null,
  hashtags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.hooks (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  category text not null default 'general',
  source text not null default 'user' check (source in ('seed','user','generated')),
  created_at timestamptz not null default now()
);

alter table public.persona enable row level security;
alter table public.ideas enable row level security;
alter table public.hooks enable row level security;

create policy "public all persona" on public.persona for all using (true) with check (true);
create policy "public all ideas" on public.ideas for all using (true) with check (true);
create policy "public all hooks" on public.hooks for all using (true) with check (true);

insert into public.persona (name, identity_md, style_md, do_md, dont_md) values (
  'Wandy POV',
  'Indonesian creator based in Sydney. Honest travel POV creator focused on cultural differences, food, public behavior, pricing, travel reality, and observational humor. Lens: Australia vs Indonesia.',
  'Emotionally fun, slightly provocative, relatable, informative, educative, insightful. Realism and tension over fake positivity. Casual Bahasa Indonesia with optional natural English mix. Short, punchy, spoken-rhythm sentences.',
  'Use curiosity gap, emotional tension, expectation vs reality, micro-details (prices, behaviors, systems, food, environment), "people don''t tell you..." angle, observational humor, subtle truth bombs.',
  'Avoid generic travel content, overly positive influencer tone, long explanations, corporate writing style, hashtags spam, fake hype.'
);
