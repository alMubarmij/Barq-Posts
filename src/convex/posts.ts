import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";

/**
 * All published posts, newest first. The board is private: requires a signed
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

/** Single post, used by the detail dialog. */
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
    const id = await ctx.db.insert("posts", args);
    return id;
  },
});
