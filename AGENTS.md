# AGENTS.md — منشورات برقية (Barq)

Guide for AI agents working in this repository. Read this before editing anything.

## 1. Project overview

منشورات برقية (working name **Barq** — "Barq · Telegram archive") is a personal
bookmarking / note-taking web app that turns Telegram into a personal archive:

- The user DMs a **Telegram bot** a link, a note, or a snippet with `#tags`.
- It is published instantly as a **post** in a private, searchable web catalog
  (del.icio.us / diigo-style classification: explicit `#tags` + automatic
  domain tags).
- Posts can also be published directly from the web app (composer dialog).

Product personality: **premium, serious, technical, developer-facing**. The UI
is Arabic-first (Standard Arabic / فصحى) with English as an opt-out.

## 2. Stack

- **Bun** — package manager and command runner (never use npm/pnpm/yarn here).
- **React 19 + TypeScript + Vite 7** (`@vitejs/plugin-react`).
- **Tailwind CSS v4** via `@tailwindcss/vite` (no `tailwind.config.js`; tokens
  live in `src/index.css`).
- **shadcn/ui** primitives in `src/components/ui/` (Radix-based).
- **Framer Motion** for micro-interactions and page motion.
- **react-router v7** (`BrowserRouter`, routes in `src/main.tsx`).
- **date-fns** with `ar` / `enUS` locales for localized dates.
- **Convex** — the only backend/database (queries, mutations, actions, HTTP
  routes). Do not add another backend or database.
- **Convex Auth** (`@convex-dev/auth`) — email OTP + guest sign-in, plus a
  Freebuff-signed federated JWT provider.

## 3. Commands

| Purpose | Command |
| --- | --- |
| Regenerate Convex types + push functions | `bun convex dev --once` |
| Typecheck | `bun tsc -b --noEmit` |
| Convex change + typecheck | `bun convex dev --once && bun tsc -b --noEmit` |
| Dev server / build / lint | `bun run dev` / `bun run build` / `bun run lint` |

Rules:

- **Never** run interactive `convex dev` — always `--once` (non-interactive
  terminal; without `--once` it hangs or fails auth).
- **Never** hand-edit `src/convex/_generated/*`. If types are stale, run
  `bun convex dev --once` and fix the real Convex source errors.
- **Never** start/stop/kill dev servers or run a full production build
  (`bun run build`) unless the user explicitly asks. The platform runs the dev
  server and Convex process; the platform also typechecks after every turn.

## 4. Project layout

```
AGENTS.md
index.html                 # html lang="ar" dir="rtl", pre-paint FOUC script
src/
  main.tsx                 # entry: providers + routes (edit routes here)
  index.css                # theme tokens (light + .dark), Tailwind, glass utils
  lib/
    i18n.ts                # EN/AR dictionary + fmt()/plural() helpers
    utils.ts               # cn() helper
  components/
    Settings.tsx           # SettingsProvider + useSettings/useI18n/useTheme/
                           #   useTextSize + ThemeToggle/LanguageToggle/
                           #   TextSizeControls + POST_TEXT size map
    RequireAuth.tsx        # route guard, preserves returnTo
    PostCard.tsx           # archive card (text-size aware)
    PostComposer.tsx       # "New post" dialog (web publishing)
    TelegramSetup.tsx      # bot token / webhook status UI
    Logo.tsx / LogoDropdown.tsx / BackgroundFX.tsx
    ui/                    # shadcn/ui primitives (don't hand-tune unless needed)
  pages/
    Landing.tsx            # public landing page
    Auth.tsx               # sign-in (email OTP / guest)
    Dashboard.tsx          # authenticated Archive (search, filters, tags)
    PostDetail.tsx         # /post/:id detail page
    NotFound.tsx
  convex/
    schema.ts              # posts + users + auth tables
    posts.ts               # posts queries + create mutation (source: "web")
    telegram.ts            # Telegram message parsing + tag/domain helpers
    http.ts                # HTTP routes incl. /api/telegram/webhook
    auth.ts, users.ts, auth/emailOtp.ts, auth.config.ts
public/
  barq/                    # standalone static marketing site (see §8)
  logo.svg, manifest.webmanifest
plans/telegram-post-board-v1/PLAN.md   # original plan — keep untouched
vly-toolbar-readonly.tsx   # READ-ONLY platform file — never modify
```

## 5. Data model (`src/convex/schema.ts`)

`posts` table:

- `source`: `"telegram"` | `"web"` — where the post came from
- `type`: `"link"` | `"message"`
- `title`, `text` (strings)
- `links`: `[{ url, domain }]`
- `tags`: `string[]`
- `author`: `{ telegramId, username?, firstName?, lastName? }`
- `chatId`, `sourceMessageId`, `publishedAt` (ms epoch)
- Indexed by `publishedAt`.

`users` + `authTables()` come from Convex Auth — do not remove or rename their
required fields.

## 6. Auth & routes

- `/` → Landing (public)
- `/auth` → Auth page with `redirectAfterAuth="/dashboard"`; `RequireAuth`
  redirects signed-out users to `/auth?returnTo=<path>`
- `/dashboard` and `/post/:id` → wrapped in `RequireAuth`
- `*` → NotFound

Do not convert the OIDC auth provider in `src/convex/auth.config.ts` to
`type: "customJwt"` — that path rejects the project's own tokens (no `kid`
header) and sign-in loops forever. Keep the Freebuff `customJwt` provider as-is.

## 7. i18n, theme, and text size (`src/components/Settings.tsx`)

- **Default language is Arabic (`ar`)**; `index.html` starts `lang="ar"
  dir="rtl"`. English is an opt-out via the EN / ع toggle. The pre-paint script
  in `index.html` restores `lang`/`dir`/theme before first paint.
- **All user-facing strings must come from the dictionary** in
  `src/lib/i18n.ts` (add keys to both `en` and `ar`; `ar` is the source of
  truth for content quality — use Standard Arabic). Never hardcode visible UI
  copy in components.
- Use `fmt(template, params)` for `{placeholders}` and `plural(template, n)`
  for `{n}` / `{s}` templates.
- Theme: `light` (default for new visitors per system preference) / `dark`,
  applied via `.dark` class on `<html>`. Tokens live in `src/index.css`.
- Text size: `s` / `m` / `l`, persisted; apply via the `POST_TEXT` map from
  `Settings.tsx` to post cards and the detail reading view.
- localStorage keys: `barq-lang`, `barq-theme`, `barq-text-size` (reads are
  wrapped in try/catch for private-browsing safety).
- **RTL**: use logical CSS utilities (`start/end`, `ps/ms`, `pe/me`,
  `text-start`) everywhere; keep letter-spacing off Arabic script
  (`html[lang="ar"] { letter-spacing: 0 }` lives in `index.css`).

## 8. Design system & typography spec

Visual language: **glassmorphism** — layered translucent panels, controlled
blur (`backdrop-filter`), subtle top-edge highlights, restrained cool
blue/ice accents, mono type for domains/tags/URLs. Both a light and a dark
palette exist via CSS variables in `src/index.css`; the same glass utilities
adapt because they read from variables.

### Typography (from Google Fonts) — apply everywhere

- **Headings → "Cairo" Bold** (weights 700–900).
- **Subheadings and links → "Cairo" Regular** (weight 400).
- **Body text → "Tajawal"** (400/500/700).
- Fonts are loaded with `preconnect` + `display=swap`; define
  `--font-heading` (Cairo) and `--font-body` (Tajawal) and reference those
  variables rather than repeating stacks.

### Static marketing site (`public/barq/`)

A framework-free static website (pure HTML/CSS/JS, preview at `/barq/`),
independent of the React app. Conventions:

- `dir="rtl" lang="ar"` on `<html>`; logical CSS properties for mirroring.
- Paragraphs and long text: `text-align: justify` with
  `text-align-last: right`; one-line section leads stay centered.
- Code snippets and CLI commands are **LTR**: wrap in
  `<pre dir="ltr"><code>` (terminal-window styling, copy buttons,
  horizontal scroll). Inline code uses `unicode-bidi: isolate` so tokens like
  `@BotFather` render correctly inside RTL sentences.
- Mobile-first responsive (base single column; breakpoints at 640/900/1100),
  with `prefers-reduced-motion` support and a no-JS fallback (content never
  hidden without JS).

## 9. Telegram integration

- Bot replies are **Arabic-only Standard Arabic** (e.g. `✅ نُشر إلى أرشيفك`).
- Secrets: `TELEGRAM_BOT_TOKEN` (+ optional `TELEGRAM_WEBHOOK_SECRET`). The
  user pastes them into the project **Keys/API keys UI** — never edit `.env`.
  Backend code reads them via `process.env` inside Convex actions in
  "use node" files.
- Webhook endpoint: `/api/telegram/webhook` (registered in `src/convex/http.ts`);
  message parsing/classification lives in `src/convex/telegram.ts`
  (exports helpers reused by the web composer).
- Telegram posts get `source: "telegram"`; web-composer posts get
  `source: "web"` (`posts.create` in `src/convex/posts.ts`).

## 10. Hard rules

1. Do not edit `.env` files.
2. Do not modify `vite.config.ts` or any Vite/HMR setting (`server.hmr: false`
   must stay; never add `hmr: true` or an `hmr: {}` object).
3. Do not modify `vly-toolbar-readonly.tsx`.
4. Do not hand-edit `src/convex/_generated/*`.
5. Do not run dev servers, `convex dev` without `--once`, or full production
   builds.
6. Use Bun for installs/scripts.
7. Prefer editing existing files; make the fewest changes that satisfy the
   request; reuse shadcn/ui components and existing conventions.
8. All UI copy goes through `src/lib/i18n.ts` (Arabic default).
9. Keep hooks rules (import from `react`, no conditional/looped calls), and
   don't duplicate React/Tailwind/shadcn installs.
10. After touching `src/convex/`, run `bun convex dev --once` (codegen), then
    `bun tsc -b --noEmit`. After frontend-only changes, run
    `bun tsc -b --noEmit`. Never claim it compiles without checking.
