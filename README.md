# BUNVIX AI

A premium, mobile-first AI workspace built for BUNVIX.

## Current stack
- Vanilla HTML/CSS/JavaScript frontend
- Supabase Auth + Postgres for accounts, conversations and messages
- Secure server-side AI integration planned for `/api/chat`

## Supabase setup
1. Open your Supabase project.
2. Go to SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy `config.example.js` to `config.js`.
5. Add your Supabase project URL and publishable/anon key to `config.js`.
6. Keep `config.js` out of Git; `.gitignore` excludes it.

## Security
Only the Supabase publishable/anon key belongs in browser code. Never commit service-role keys, AI API keys, passwords, or other secrets.

## AI backend
The browser will call a server-side endpoint for model responses. The model API key must stay in that server environment, never in `index.html` or `app.js`.

## Project structure
- `index.html` — application shell
- `style.css` — visual system and responsive layout
- `app.js` — chat UI behavior
- `supabase/schema.sql` — database tables and row-level security
- `config.example.js` — safe client configuration template

BUNVIX AI © 2026
