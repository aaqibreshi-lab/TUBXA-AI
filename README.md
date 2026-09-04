# TUBXA AI

A premium, mobile-first AI workspace built for TUBXA.

## Current stack
- Vanilla HTML/CSS/JavaScript frontend
- Supabase Auth + Postgres for accounts, conversations and messages
- Secure server-side Gemini integration through a Supabase Edge Function

## Supabase setup
1. Open your Supabase project.
2. Go to SQL Editor.
3. Run `supabase/schema.sql`.
4. Add your Supabase project URL and publishable/anon key to the client configuration.

## Security
Only the Supabase publishable/anon key belongs in browser code. Never commit service-role keys, AI API keys, passwords, or other secrets.

## AI backend
The browser calls the server-side Supabase Edge Function at `/functions/v1/chat`. The Gemini API key must stay in Supabase server-side secrets, never in `index.html` or `app.js`.

## Project structure
- `index.html` — application shell
- `style.css` — visual system and responsive layout
- `app.js` — chat UI behavior and conversation history
- `supabase/schema.sql` — database tables and row-level security
- `config.example.js` — safe client configuration template

TUBXA AI © 2026
