import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

/**
 * All published posts, newest first. The archive is private: requires a signed
 * in user. The client filters by tag / type / search text reactively.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    return ctx.db.query("posts").order("desc").collect();
  },
});

/** Single post, used by the detail page. */
export const get = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.get(args.id);
  },
});

/** Publish a post from the web app — a note, a link bookmark, or both. */
export const create = mutation({
  args: {
    title: v.string(),
    text: v.string(),
    links: v.array(
      v.object({
        url: v.string(),
        domain: v.string(),
      }),
    ),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    const user = await ctx.db.get(userId);
    const text = args.text.trim();
    const links = args.links.filter((l) => l.url.trim().length > 0);
    const type = links.length > 0 ? "link" : "message";
    const title =
      args.title.trim() ||
      text.split("\n")[0].slice(0, 140) ||
      links[0]?.domain ||
      "منشور بدون عنوان";

    // Auto-classify link domains as tags — same behavior as Telegram posts,
    // so web-published bookmarks are filtered/grouped identically.
    const tags = [...args.tags];
    for (const link of links) {
      const domainTag = link.domain.toLowerCase();
      if (domainTag && !tags.includes(domainTag)) {
        tags.push(domainTag);
      }
    }

    return ctx.db.insert("posts", {
      source: "web",
      type,
      title: title.slice(0, 200),
      text,
      links,
      tags,
      author: {
        telegramId: 0,
        username: undefined,
        firstName: user?.name ?? "أنت",
        lastName: undefined,
      },
      chatId: 0,
      sourceMessageId: 0,
      publishedAt: Date.now(),
    });
  },
});

/**
 * Internal: find an existing post for a Telegram (chat, message) pair so the
 * webhook can deduplicate Telegram's webhook retries.
 */
export const findBySource = internalQuery({
  args: {
    chatId: v.number(),
    sourceMessageId: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("posts")
      .filter((q) =>
        q.and(
          q.eq(q.field("chatId"), args.chatId),
          q.eq(q.field("sourceMessageId"), args.sourceMessageId),
        ),
      )
      .first();
    return existing ?? null;
  },
});

/** Internal: create a post. Called only from the Telegram webhook. */
export const insertPost = internalMutation({
  args: {
    type: v.union(v.literal("link"), v.literal("message")),
    title: v.string(),
    text: v.string(),
    links: v.array(
      v.object({
        url: v.string(),
        domain: v.string(),
      }),
    ),
    tags: v.array(v.string()),
    author: v.object({
      telegramId: v.number(),
      username: v.optional(v.string()),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
    }),
    chatId: v.number(),
    sourceMessageId: v.number(),
    publishedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("posts", {
      ...args,
      source: "telegram",
    });
    return id;
  },
});
