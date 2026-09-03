# BUNVIX AI

A premium, mobile-first AI workspace built for BUNVIX.

## Current build
- Responsive AI chat UI
- New chat / clear chat controls
- Light/dark theme
- Prompt suggestions
- Clean frontend foundation

## Next integration
BUNVIX is designed to connect to Supabase for authentication and chat persistence, with AI requests sent through a secure server-side `/api/chat` endpoint.

### Important security rule
Never put an AI provider secret key in `index.html`, `app.js`, or any browser-side JavaScript. Store secrets only in server-side environment variables.

## Local development
This is a static frontend foundation and can be previewed with any static web server.

## Project structure
- `index.html` — application shell
- `style.css` — visual system and responsive layout
- `app.js` — chat UI behavior

BUNVIX AI © 2026