# Telegram Post Board — Version 1 Plan

> Single source of truth for v1. Ignore plans in any other folder.
> Last updated: August 15, 2026 — plan matches the code actually shipped.

## 1. Product

A private-team **link & message publishing board**. A team member DMs the team's
Telegram bot a message (plain note) or a link (with or without `#tags`). The bot
parses it, tags it, and publishes it as a post that the whole team can browse in
the web app — following the del.icio.us / diigo.com model: bookmarks with tags,
title + description, and a tag cloud for classification.

### Version 1 scope (build exactly this, nothing more)
- Publish **messages** and **links** from Telegram to the web app.
- Auto-tagging: explicit `#hashtags` + a domain-derived tag for links.
- Private team access: web app is behind auth; Telegram posts come only from
  people who talk to the bot.
- Browse the board: feed of posts, filter by tag, search text, open post detail.
- Telegram connection setup screen inside the app (status + one-click webhook).

### Explicitly out of scope for v1
Likes/comments, editing/deleting posts, per-user boards, Telegram reply-keyboard
commands, channel forwarding, image/media attachments, RSS, public sharing,
notifications, Telegram user allowlists, AI summarization.

## 2. Architecture

```
Telegram ──webhook POST──▶ Convex HTTP action (/api/telegram/webhook)
                                  │  parse text, URLs, #tags
                                  ▼
                          Convex posts table (database)
                                  │  reactive query (Convex subscriptions)
                                  ▼
                    React web app (auth-gated dashboard + landing)
```

- **Frontend**: Vite + React 19 + React Router 7 + Tailwind v4 + shadcn/ui +
  Framer Motion. Light **glassmorphism** theme (bright cool background,
  translucent blurred panels, subtle edge highlights, restrained cool accents).
- **Backend + DB**: Convex (actions for Telegram API, mutations/queries for
  posts). No other backend services.
- **Auth**: existing Convex Auth (email OTP / guest) — the app is private.

## 3. Telegram integration

| Item | Value |
|---|---|
| Bot token | `TELEGRAM_BOT_TOKEN` env var (Convex server env) |
| Webhook secret (optional) | `TELEGRAM_WEBHOOK_SECRET` env var |
| Webhook route | `POST /api/telegram/webhook` (Convex http action) |
| Webhook URL | `https://<deployment>.convex.site/api/telegram/webhook` |
| Update types | `message` only (text or caption) |

Flow per update:
1. Validate `X-Telegram-Bot-Api-Secret-Token` if secret env is set.
2. Ignore non-message updates; ignore messages without text.
3. Parse: extract URLs, extract `#tags`, derive title, author (id, username,
   first name), `publishedAt` from message date.
4. Deduplicate by `chatId + sourceMessageId` (Telegram retries webhooks).
5. Insert post (`type: "link"` if it has URLs, else `"message"`).
6. Reply to the sender with a publish confirmation listing the tags.

Helper actions (called from the authenticated app):
- `telegram.status` → bot username (`getMe`), webhook info (`getWebhookInfo`),
  whether the token env is configured.
- `telegram.setWebhook` → registers the webhook with Telegram
  (`setWebhook`, `allowed_updates=["message"]`, secret token if configured).

## 4. Data model (Convex schema)

`posts` table:
- `type`: `"link" | "message"`
- `title`: derived (link → text before the URL or the domain; message → first ~120 chars)
- `text`: full message text
- `links`: `[{ url, domain }]` (empty for messages)
- `tags`: `string[]` — normalized lowercase `#tags` + domain tag for links
- `author`: `{ telegramId, username?, firstName?, lastName? }`
- `chatId`, `sourceMessageId`: for dedupe
- `publishedAt`: unix ms (from Telegram message date)
- Index: `by_publishedAt`

No unique constraints available → dedupe by querying
`chatId + sourceMessageId` before insert.

## 5. Frontend routes

| Route | Page | Access |
|---|---|---|
| `/` | Landing (glass theme, hero, how-it-works, features, CTA) | public |
| `/auth` | Sign in / sign up (glass) — redirects to `/dashboard` | public |
| `/dashboard` | Board: sidebar nav, feed w/ tag filter + search, tag cloud, Telegram connect | authenticated (`RequireAuth`) |

Dashboard views (internal tabs in one protected page):
- **Feed**: post cards (type icon, title, text preview, link domain, tags,
  author, relative time); search box; type filter (All / Links / Notes);
  clicking a post opens a detail dialog with copy-link actions.
- **Tags**: del.icio.us-style tag cloud sized by popularity; click → filtered feed.
- **Telegram**: 3-step setup — create bot in BotFather → paste `TELEGRAM_BOT_TOKEN`
  into project keys → click "Register webhook"; shows live status
  (token set, bot username, webhook URL, last error).

## 6. Free hosting recommendation

All free tiers, zero cost for a small team:

1. **Frontend (Vite static build)** → **Vercel**, **Netlify**, or **Cloudflare
   Pages** (free tier, auto-deploy from Git, HTTPS, global CDN).
2. **Backend + database** → **Convex** (already used here; free tier includes
   serverless functions, realtime subscriptions, and a managed Postgres
   storage layer).
3. **Telegram bot** → **BotFather** (free; bot runs on Telegram's servers, our
   code only receives webhooks).

Env vars to set on the chosen host / Convex: `TELEGRAM_BOT_TOKEN` (required),
`TELEGRAM_WEBHOOK_SECRET` (recommended), and the frontend's
`VITE_CONVEX_URL` (already configured in this project).

## 7. Build order

1. Plan (this file)
2. Convex schema + posts queries + internal insert
3. Telegram webhook http action + status/setWebhook actions
4. Codegen (`bun convex dev --once`)
5. Light glass theme (`src/index.css`)
6. Landing page → Auth restyle → Dashboard (feed/tags/connect)
7. Typecheck (`bun tsc -b --noEmit`)
