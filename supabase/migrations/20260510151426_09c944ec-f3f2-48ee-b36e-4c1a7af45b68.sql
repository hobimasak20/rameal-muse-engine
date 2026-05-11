
ALTER TABLE public.hooks
  ADD COLUMN IF NOT EXISTS emotion text NOT NULL DEFAULT 'Curiosity',
  ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'Reels',
  ADD COLUMN IF NOT EXISTS favorite boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS use_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_used_at timestamptz;

CREATE INDEX IF NOT EXISTS hooks_category_idx ON public.hooks (category);
CREATE INDEX IF NOT EXISTS hooks_use_count_idx ON public.hooks (use_count DESC);
CREATE INDEX IF NOT EXISTS hooks_last_used_idx ON public.hooks (last_used_at DESC NULLS LAST);

-- Seed 20 viral hooks (only if seed not present)
INSERT INTO public.hooks (text, category, source, emotion, content_type)
SELECT * FROM (VALUES
  ('POV: You found a place tourists don''t know about', 'POV', 'seed', 'Curiosity', 'Travel'),
  ('I wasn''t expecting this at all…', 'Storytelling', 'seed', 'Suspense', 'Vlog'),
  ('This changed my opinion instantly', 'Storytelling', 'seed', 'Shock', 'Vlog'),
  ('Come with me for a day in Tokyo', 'POV', 'seed', 'Immersion', 'Vlog'),
  ('Nobody talks about this place', 'Hidden spots', 'seed', 'Curiosity', 'Travel'),
  ('This might be the best food I''ve ever tried', 'Food', 'seed', 'Excitement', 'Food'),
  ('I tried the most overrated spot so you don''t have to', 'Travel', 'seed', 'Relatable', 'Vlog'),
  ('Things that just make sense in Japan', 'Comedy', 'seed', 'Relatable', 'Lifestyle'),
  ('You need to see this before visiting Korea', 'Educational', 'seed', 'Curiosity', 'Travel'),
  ('I accidentally found a hidden gem', 'Hidden spots', 'seed', 'Discovery', 'Travel'),
  ('I spent 24 hours doing this', 'Storytelling', 'seed', 'Immersion', 'Vlog'),
  ('This is your sign to visit here', 'Travel', 'seed', 'Inspiration', 'Cinematic vlog'),
  ('What $10 gets you in Bali', 'Comparison', 'seed', 'Curiosity', 'Travel'),
  ('I can''t believe this is real', 'Shock', 'seed', 'Shock', 'Vlog'),
  ('The internet was right about this place', 'Travel', 'seed', 'Validation', 'Vlog'),
  ('This feels illegal to know', 'Curiosity', 'seed', 'Curiosity', 'Educational'),
  ('I wish I knew this earlier', 'Educational', 'seed', 'Regret', 'Educational'),
  ('One thing nobody prepares you for', 'Storytelling', 'seed', 'Suspense', 'Storytime'),
  ('Watch this before you travel here', 'Educational', 'seed', 'Urgency', 'Travel'),
  ('Here''s why everyone is obsessed with this', 'Curiosity', 'seed', 'Curiosity', 'Lifestyle')
) AS v(text, category, source, emotion, content_type)
WHERE NOT EXISTS (SELECT 1 FROM public.hooks WHERE source = 'seed');
