import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { action, httpAction } from "./_generated/server";

const BOT_TOKEN_ENV = "TELEGRAM_BOT_TOKEN";
const WEBHOOK_SECRET_ENV = "TELEGRAM_WEBHOOK_SECRET";
const WEBHOOK_PATH = "/api/telegram/webhook";

const URL_REGEX = /https?:\/\/[^\s<>"')\]}>]+/gi;
const TAG_REGEX = /#([\p{L}\p{N}_-]+)/gu;

const COMMON_TLDS = new Set([
  "com", "org", "net", "io", "dev", "ai", "co", "app", "me", "xyz",
  "info", "gov", "edu", "us", "uk", "de", "fr", "ru", "jp", "cn", "in",
]);

function botToken(): string | undefined {
  return process.env[BOT_TOKEN_ENV];
}

function siteUrl(): string {
  const site = process.env.CONVEX_SITE_URL;
  if (site) return site.replace(/\/+$/, "");
  const url = process.env.CONVEX_URL;
  if (url) return url.replace(/\.convex\.cloud$/, ".convex.site");
  return "https://<deployment>.convex.site";
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

type TelegramResult = {
  ok?: boolean;
  result?: unknown;
  description?: string;
};

async function telegramApi(
  token: string,
  method: string,
  body?: Record<string, unknown>,
): Promise<TelegramResult> {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  return (await res.json().catch(() => ({}))) as TelegramResult;
}

export function cleanUrl(raw: string): string {
  return raw.replace(/[.,;:!?)\]}>]+$/g, "");
}

export function deriveDomain(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    const parts = host.split(".");
    if (parts.length > 1 && COMMON_TLDS.has(parts[parts.length - 1])) {
      return parts[parts.length - 2];
    }
    return parts[0];
  } catch {
    return "link";
  }
}

export function extractLinks(text: string): { url: string; domain: string }[] {
  const seen = new Set<string>();
  const links: { url: string; domain: string }[] = [];
  for (const match of text.match(URL_REGEX) ?? []) {
    const url = cleanUrl(match);
    if (!seen.has(url)) {
      seen.add(url);
      links.push({ url, domain: deriveDomain(url) });
    }
  }
  return links;
}

function extractTags(text: string): string[] {
  const tags: string[] = [];
  const seen = new Set<string>();
  for (const match of text.matchAll(TAG_REGEX)) {
    const tag = match[1].toLowerCase().slice(0, 24);
    if (tag && !seen.has(tag)) {
      seen.add(tag);
      tags.push(tag);
    }
  }
  return tags;
}

function deriveTitle(
  text: string,
  links: { url: string; domain: string }[],
  type: "link" | "message",
): string {
  const withoutTags = text.replace(TAG_REGEX, "").trim().replace(/\s+/g, " ");
  if (type === "link") {
    const withoutUrls = withoutTags.replace(URL_REGEX, "").trim();
    if (withoutUrls) return withoutUrls.slice(0, 140);
    return links[0]?.domain ?? "Shared link";
  }
  return withoutTags ? withoutTags.slice(0, 140) : "Untitled note";
}

/**
 * Telegram webhook: POST /api/telegram/webhook
 * Receives updates, parses message/link + #tags, publishes a post, and
 * replies to the sender with a confirmation.
 */
export const handleUpdate = httpAction(async (ctx, request) => {
  const token = botToken();
  if (!token) {
    return json({ ok: false, error: "TELEGRAM_BOT_TOKEN is not configured" }, 200);
  }

  const secret = process.env[WEBHOOK_SECRET_ENV];
  if (secret) {
    const header = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (header !== secret) {
      return json({ ok: false, error: "Invalid secret token" }, 401);
    }
  }

  let update: { message?: Record<string, unknown> };
  try {
    update = (await request.json()) as { message?: Record<string, unknown> };
  } catch {
    return json({ ok: false, error: "Invalid payload" }, 400);
  }

  const message = update?.message;
  if (!message || typeof message !== "object") {
    // Not a message update (edited_message, channel_post, ...). Ignore.
    return json({ ok: true, ignored: "not a message" }, 200);
  }

  const rawText =
    typeof message.text === "string"
      ? message.text
      : typeof message.caption === "string"
        ? message.caption
        : "";
  const text = rawText.trim();
  const chat = (message.chat as Record<string, unknown> | undefined) ?? {};
  const chatId = typeof chat.id === "number" ? chat.id : 0;
  const sourceMessageId = typeof message.message_id === "number" ? message.message_id : 0;

  if (!text) {
    await telegramApi(token, "sendMessage", {
      chat_id: chatId,
      text: "أرسل لي رسالة أو رابطًا وسأنشره في أرشيفك الشخصي. أضف #وسوم مثل #تصميم لتصنيفه.",
    });
    return json({ ok: true, ignored: "no text" }, 200);
  }

  const existing = await ctx.runQuery(internal.posts.findBySource, {
    chatId,
    sourceMessageId,
  });
  if (existing) {
    // Telegram retries webhook deliveries; never double-publish.
    return json({ ok: true, ignored: "duplicate" }, 200);
  }

  const links = extractLinks(text);
  const type = links.length > 0 ? "link" : "message";
  const tags = new Set(extractTags(text));
  for (const link of links) {
    tags.add(link.domain);
  }
  const title = deriveTitle(text, links, type);

  const from = (message.from as Record<string, unknown> | undefined) ?? {};
  const author = {
    telegramId: typeof from.id === "number" ? from.id : 0,
    username: typeof from.username === "string" ? from.username : undefined,
    firstName: typeof from.first_name === "string" ? from.first_name : undefined,
    lastName: typeof from.last_name === "string" ? from.last_name : undefined,
  };

  const publishedAt =
    (typeof message.date === "number"
      ? message.date
      : Math.floor(Date.now() / 1000)) * 1000;

  const id = await ctx.runMutation(internal.posts.insertPost, {
    type,
    title,
    text,
    links,
    tags: [...tags],
    author,
    chatId,
    sourceMessageId,
    publishedAt,
  });

  const tagLine = [...tags].map((t) => `#${t}`).join(" ");
  const reply = [
    "✅ تم النشر إلى أرشيفك",
    `«${title}»`,
    tagLine ? `الوسوم: ${tagLine}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  await telegramApi(token, "sendMessage", {
    chat_id: chatId,
    text: reply,
    disable_web_page_preview: true,
  });

  return json({ ok: true, id }, 200);
});

/** Connection status shown in the app's Telegram setup screen. */
export const status = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    const token = botToken();
    const webhookUrl = `${siteUrl()}${WEBHOOK_PATH}`;
    if (!token) {
      return { configured: false, bot: null, webhook: null, webhookUrl };
    }
    const me = await telegramApi(token, "getMe");
    const info = await telegramApi(token, "getWebhookInfo");
    return {
      configured: true,
      bot:
        me.ok && me.result
          ? (me.result as { username?: string; first_name?: string } | undefined) ?? null
          : null,
      webhook:
        info.ok && info.result
          ? (info.result as {
              url?: string;
              pending_update_count?: number;
              last_error_message?: string;
            } | undefined) ?? null
          : null,
      webhookUrl,
    };
  },
});

/** Registers the webhook URL with Telegram. Called from the setup screen. */
export const setWebhook = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    const token = botToken();
    if (!token) {
      throw new Error(
        "TELEGRAM_BOT_TOKEN is not configured. Add it in the project keys, then try again.",
      );
    }
    const body: Record<string, unknown> = {
      url: `${siteUrl()}${WEBHOOK_PATH}`,
      allowed_updates: ["message"],
      drop_pending_updates: true,
    };
    const secret = process.env[WEBHOOK_SECRET_ENV];
    if (secret) {
      body.secret_token = secret;
    }
    const result = await telegramApi(token, "setWebhook", body);
    if (!result.ok) {
      throw new Error(result.description ?? "Telegram rejected the webhook request");
    }
    return {
      ok: true,
      webhookUrl: body.url as string,
      description: result.description ?? "Webhook registered",
    };
  },
});
