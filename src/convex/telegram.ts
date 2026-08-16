"use node";

import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import { action, internalAction, type ActionCtx } from "./_generated/server";

const BOT_TOKEN_ENV = "TELEGRAM_BOT_TOKEN";
const WEBHOOK_SECRET_ENV = "TELEGRAM_WEBHOOK_SECRET";
const WEBHOOK_PATH = "/api/telegram/webhook";

const URL_REGEX = /https?:\/\/[^\s<>"')\]}]+/gi;
const TAG_REGEX = /#([\p{L}\p{N}_-]+)/gu;

const COMMON_TLDS = new Set([
  "com", "org", "net", "io", "dev", "ai", "co", "app", "me", "xyz",
  "info", "gov", "edu", "us", "uk", "de", "fr", "ru", "jp", "cn", "in",
]);

// This file runs in the Node.js runtime ("use node"), which is the only
// runtime where Convex exposes deployment environment variables via
// process.env (queries/mutations and HTTP actions run in the V8 isolate and
// cannot read them). The webhook HTTP action in ./telegramWebhook delegates
// here through ctx.runAction.
function botToken(): string | undefined {
  return process.env[BOT_TOKEN_ENV];
}

/**
 * ALLOWED_CHAT_IDS — optional comma- or space-separated list of Telegram
 * user / chat IDs that are allowed to publish. A message is accepted when
 * either the sender's user ID or the chat ID appears in the list (in private
 * chats they're the same number; in groups, list your user ID to allow only
 * yourself, or list the group ID to allow the whole group).
 * Returns null when the variable is not configured (everyone allowed).
 */
function allowedChatIds(): Set<number> | null {
  const raw = process.env.ALLOWED_CHAT_IDS;
  if (!raw || !raw.trim()) return null;
  const ids = new Set<number>();
  for (const part of raw.split(/[\s,]+/)) {
    const id = Number(part);
    if (Number.isFinite(id) && id !== 0) ids.add(id);
  }
  return ids.size > 0 ? ids : null;
}

function siteUrl(): string {
  const site = process.env.CONVEX_SITE_URL;
  if (site) return site.replace(/\/+$/, "");
  const url = process.env.CONVEX_URL;
  if (url) return url.replace(/\.convex\.cloud$/, ".convex.site");
  return "https://<deployment>.convex.site";
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
  return raw.replace(/[.,;:!?)\]}]+$/g, "");
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
    return links[0]?.domain ?? "رابط مشترك";
  }
  return withoutTags ? withoutTags.slice(0, 140) : "ملاحظة بدون عنوان";
}

type TelegramUpdate = {
  message?: Record<string, unknown> | null;
};

type BotCommand = { name: string; arg: string };

/** Parses "/command@botname arg" style Telegram commands. */
function parseCommand(text: string): BotCommand | null {
  const match = text.match(
    /^\/([A-Za-z][A-Za-z0-9_]*)(?:@[A-Za-z0-9_]+)?(?:\s+([\s\S]*))?$/,
  );
  if (!match) return null;
  return { name: match[1].toLowerCase(), arg: (match[2] ?? "").trim() };
}

function formatPost(post: Doc<"posts">): string {
  const lines = [
    `«${post.title}»`,
    post.type === "link" ? "🔗 رابط" : "📝 ملاحظة",
    new Date(post.publishedAt).toLocaleString("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  ];
  if (post.links.length > 0) {
    lines.push("", ...post.links.map((l) => `• ${l.url}`));
  }
  if (post.tags.length > 0) {
    lines.push("", `الوسوم: ${post.tags.map((t) => `#${t}`).join(" ")}`);
  }
  return lines.join("\n");
}

const HELP_TEXT = [
  "📚 أوامر بوت الأرشيف:",
  "/list — أحدث المنشورات",
  "/get 3 — عرض منشور برقمه",
  "/edit 3 نص جديد — تعديل منشور",
  "/delete 3 — حذف منشور",
  "/help — عرض هذه الأوامر",
  "",
  "أرسل رابطًا أو ملاحظة مع #وسوم لنشرها في أرشيفك.",
  "يعمل البوت في المحادثات الخاصة والمجموعات معًا.",
].join("\n");

async function handleCommand(
  ctx: ActionCtx,
  token: string,
  chatId: number,
  command: BotCommand,
): Promise<string | null> {
  switch (command.name) {
    case "help":
    case "start":
      return HELP_TEXT;
    case "list": {
      const posts = await ctx.runQuery(internal.posts.listRecent, { limit: 10 });
      if (posts.length === 0) {
        return "📭 أرشيفك فارغ بعد. أرسل رابطًا أو ملاحظة مع #وسوم.";
      }
      const lines = posts.map((p, i) => `${i + 1}. ${p.title}`);
      return ["📚 أحدث المنشورات:", ...lines, "", "/get 3 لعرض التفاصيل."].join(
        "\n",
      );
    }
    case "get": {
      const idx = parseInt(command.arg, 10);
      if (!Number.isInteger(idx) || idx < 1) {
        return "الاستخدام: /get 3 (رقم المنشور من قائمة /list)";
      }
      const posts = await ctx.runQuery(internal.posts.listRecent, { limit: 20 });
      const post = posts[idx - 1];
      if (!post) {
        return `لا يوجد منشور رقم ${idx}. جرّب /list.`;
      }
      return formatPost(post);
    }
    case "edit": {
      const [numStr, ...rest] = command.arg.split(/\s+/);
      const idx = parseInt(numStr ?? "", 10);
      const newText = rest.join(" ").trim();
      if (!Number.isInteger(idx) || idx < 1 || !newText) {
        return "الاستخدام: /edit 3 النص الجديد للمنشور";
      }
      const posts = await ctx.runQuery(internal.posts.listRecent, { limit: 20 });
      const post = posts[idx - 1];
      if (!post) {
        return `لا يوجد منشور رقم ${idx}. جرّب /list.`;
      }
      const links = extractLinks(newText);
      const type = links.length > 0 ? "link" : "message";
      const tags = Array.from(
        new Set([...extractTags(newText), ...links.map((l) => l.domain)]),
      );
      const title = deriveTitle(newText, links, type);
      await ctx.runMutation(internal.posts.updatePost, {
        id: post._id,
        type,
        title,
        text: newText,
        links,
        tags,
      });
      return `✅ حُدّث المنشور رقم ${idx}:\n«${title}»`;
    }
    case "delete": {
      const idx = parseInt(command.arg, 10);
      if (!Number.isInteger(idx) || idx < 1) {
        return "الاستخدام: /delete 3 (رقم المنشور من قائمة /list)";
      }
      const posts = await ctx.runQuery(internal.posts.listRecent, { limit: 20 });
      const post = posts[idx - 1];
      if (!post) {
        return `لا يوجد منشور رقم ${idx}. جرّب /list.`;
      }
      await ctx.runMutation(internal.posts.deletePost, { id: post._id });
      return `🗑️ حُذف المنشور رقم ${idx}.`;
    }
    default:
      return HELP_TEXT;
  }
}

/**
 * Processes a Telegram update: verifies the secret token, parses the message
 * or link + #tags, publishes a post, and replies to the sender with a
 * confirmation. Runs in the Node.js runtime so it can read the bot token and
 * webhook secret from the environment; the webhook HTTP action in
 * ./telegramWebhook delegates here via ctx.runAction.
 */
export const processUpdate = internalAction({
  args: {
    update: v.any(),
    secretHeader: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { update, secretHeader },
  ): Promise<{ status: number; body: unknown }> => {
    const token = botToken();
    if (!token) {
      return {
        status: 200,
        body: { ok: false, error: "TELEGRAM_BOT_TOKEN is not configured" },
      };
    }

    const secret = process.env[WEBHOOK_SECRET_ENV];
    if (secret && secretHeader !== secret) {
      return { status: 401, body: { ok: false, error: "Invalid secret token" } };
    }

    const message = (update as TelegramUpdate | null | undefined)?.message;
    if (!message || typeof message !== "object") {
      // Not a message update (edited_message, channel_post, ...). Ignore.
      return { status: 200, body: { ok: true, ignored: "not a message" } };
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
    const chatType = typeof chat.type === "string" ? chat.type : "private";
    const inGroup =
      chatType === "group" ||
      chatType === "supergroup" ||
      chatType === "channel";
    const sourceMessageId =
      typeof message.message_id === "number" ? message.message_id : 0;
    const from = (message.from as Record<string, unknown> | undefined) ?? {};
    const isBot = from.is_bot === true;

    if (isBot) {
      // Never archive (or echo) messages sent by other bots.
      return { status: 200, body: { ok: true, ignored: "bot message" } };
    }

    // Restrict publishing to the configured Telegram user / chat IDs.
    const allowed = allowedChatIds();
    if (allowed) {
      const senderId = typeof from.id === "number" ? from.id : 0;
      if (!allowed.has(senderId) && !allowed.has(chatId)) {
        if (!inGroup) {
          await telegramApi(token, "sendMessage", {
            chat_id: chatId,
            text: "⛔ هذا البوت مخصص لمستخدمين محددين فقط، ولا يمكنك النشر هنا.",
          });
        }
        return { status: 200, body: { ok: true, ignored: "not allowed" } };
      }
    }

    // Commands (/help, /list, /get, /edit, /delete) work in private chats and
    // in groups alike.
    const command = text ? parseCommand(text) : null;
    if (command) {
      const replyText = await handleCommand(ctx, token, chatId, command);
      if (replyText) {
        await telegramApi(token, "sendMessage", {
          chat_id: chatId,
          text: replyText,
          disable_web_page_preview: true,
        });
      }
      return { status: 200, body: { ok: true, command: command.name } };
    }

    if (!text) {
      if (!inGroup) {
        await telegramApi(token, "sendMessage", {
          chat_id: chatId,
          text: "أرسل لي رابطًا أو ملاحظة، وسأنشرها في أرشيفك الشخصي. أضف #وسوم مثل #تصميم لتصنيفها.",
        });
      }
      return { status: 200, body: { ok: true, ignored: "no text" } };
    }

    const existing = await ctx.runQuery(internal.posts.findBySource, {
      chatId,
      sourceMessageId,
    });
    if (existing) {
      // Telegram retries webhook deliveries; never double-publish.
      return { status: 200, body: { ok: true, ignored: "duplicate" } };
    }

    const explicitTags = extractTags(text);
    const links = extractLinks(text);
    // In groups, only archive intentional bookmarks (a link or #tags) so
    // everyday group chat stays out of the archive.
    if (inGroup && links.length === 0 && explicitTags.length === 0) {
      return { status: 200, body: { ok: true, ignored: "group chat noise" } };
    }

    const type = links.length > 0 ? "link" : "message";
    const tags = new Set(explicitTags);
    for (const link of links) {
      tags.add(link.domain);
    }
    const title = deriveTitle(text, links, type);

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

    const id: string = await ctx.runMutation(internal.posts.insertPost, {
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
      "✅ نُشر إلى أرشيفك",
      `«${title}»`,
      tagLine ? `الوسوم: ${tagLine}` : "",
      "/help للاطلاع على الأوامر",
    ]
      .filter(Boolean)
      .join("\n");
    await telegramApi(token, "sendMessage", {
      chat_id: chatId,
      text: reply,
      disable_web_page_preview: true,
    });

    return { status: 200, body: { ok: true, id } };
  },
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
      // Telegram only accepts secret tokens made of A-Z, a-z, 0-9, _ and -
      // (up to 256 chars). Surface a clear error instead of Telegram's own
      // "wrong secret_token" rejection.
      if (secret.length > 256 || !/^[A-Za-z0-9_-]+$/.test(secret)) {
        throw new Error(
          "TELEGRAM_WEBHOOK_SECRET must contain only letters, numbers, underscores and dashes (Telegram requirement). Update it in the project keys, then try again.",
        );
      }
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
