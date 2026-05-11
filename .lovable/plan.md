# RameAL — Wandy POV Content Generator

A mobile-first, dark-mode AI app that generates viral-ready Reels/TikTok scripts in the Wandy POV creator voice.

## Stack
- TanStack Start (React) + Tailwind, dark-mode first, mobile-first.
- Lovable Cloud (Supabase) for storage of saved ideas, hook library, and persona settings — single-user mode (no login).
- Lovable AI Gateway with `google/gemini-3-flash-preview` for generation. No API keys to manage.

## Pages (routes)
1. `/` — Dashboard: quick "Generate" CTA, recent ideas, hook of the day.
2. `/generate` — Main generator (topic input, tone, count, viral toggle, output cards).
3. `/saved` — Saved ideas list with filters and copy actions.
4. `/hooks` — Hook Library (pre-seeded + user saves).
5. `/persona` — Persona settings (editable Wandy POV profile fed into the system prompt).

Shared bottom tab nav for mobile, top nav on larger screens. Brand: **RameAL**, persona voice: **Wandy POV**.

## Generator flow
Inputs:
- Topic textarea (travel, food, cultural observation, country comparison, random thought).
- Tone selector chips: Honest, Sarcastic, Confused, Mindblown, Frustrated, Comedy.
- Count slider: 1–10 ideas.
- Viral Boost toggle.

Each generated idea card shows: Title, Hook, Foreshadow, Body, Ending, Caption, up to 5 hashtags. Per-card actions: Copy Full Script, Copy Caption, Copy Hooks, Save, Save Hook to Library.

## AI prompt system
Server function (`createServerFn`) calls Gemini via Vercel AI SDK + Lovable AI Gateway, returning structured JSON via `Output.object` (Zod schema mirroring the card fields).

System prompt is composed from:
- Persona block (loaded from DB so user can edit on `/persona`): identity, POV style, Australia↔Indonesia lens, food honesty, "people don't tell you…" angle.
- Thinking system: assumption → tension → relatability → story → payoff.
- Structure rules: Hook (0–3s) / Foreshadow (3–6s) / Body (6–20s) / Ending (20–30s).
- Voice rules: casual Bahasa with optional English mix, short punchy spoken rhythm; avoid generic/influencer/corporate tone.
- Tone modifier injected from selector.
- Viral Boost modifier when toggled (stronger curiosity, controversial edge, still SFW).

## Data model (Lovable Cloud)
- `persona` (single row): name, identity_md, style_md, do_md, dont_md, updated_at.
- `ideas`: id, topic, tone, viral_boost, title, hook, foreshadow, body, ending, caption, hashtags[], created_at.
- `hooks`: id, text, category, source ('seed' | 'user' | 'generated'), created_at.

Single-user mode: open RLS or service-role server-fn writes; no auth UI.

Pre-seed ~30 hooks in Wandy POV style across categories (Australia vs Indonesia, food, prices, public behavior, cultural shock).

## UI / UX
- Dark mode default, OLED-friendly background, single accent color, generous spacing.
- Inspirations: ChatGPT/Claude/Notion. Card-based outputs with collapsible sections on mobile.
- One-tap copy buttons with toast confirmation (sonner).
- Skeleton loaders during generation; streaming optional in v2.

## Build order
1. Enable Lovable Cloud + create tables, seed persona row and hook library.
2. Layout shell, dark theme tokens, bottom tab nav.
3. `/persona` page (edit + save) — needed to drive prompt.
4. Server function `generateIdeas` (Zod-structured output via Gemini 3 Flash).
5. `/generate` page with inputs, results, copy/save actions.
6. `/saved` and `/hooks` pages.
7. `/` dashboard pulling recent ideas and a random hook.

## Out of scope (v1)
- Multi-user accounts, sharing, scheduling, video rendering, trending audio lookup. Can be added later.
