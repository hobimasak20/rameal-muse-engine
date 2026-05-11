ALTER TABLE public.hooks ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'id';
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'id';
CREATE INDEX IF NOT EXISTS hooks_language_idx ON public.hooks (language);
CREATE INDEX IF NOT EXISTS ideas_language_idx ON public.ideas (language);