import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // posts published to the personal archive, from Telegram or the web app.
    posts: defineTable({
      source: v.union(v.literal("telegram"), v.literal("web")),
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
    }).index("by_publishedAt", ["publishedAt"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
