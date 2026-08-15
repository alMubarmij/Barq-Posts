import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

type ProcessResult = {
  status: number;
  body: unknown;
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Telegram webhook: POST /api/telegram/webhook
 *
 * HTTP actions run in the V8 isolate runtime, which cannot read deployment
 * environment variables in Convex v1 — so this handler parses the request and
 * delegates the actual processing (secret check, parsing, publishing, reply)
 * to api.telegram.processUpdate, which runs in the Node.js runtime and reads
 * TELEGRAM_BOT_TOKEN / TELEGRAM_WEBHOOK_SECRET from process.env.
 */
export const handleUpdate = httpAction(async (ctx, request) => {
  let update: unknown;
  try {
    update = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid payload" }, 400);
  }

  const secretHeader =
    request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? undefined;

  const args: { update: unknown; secretHeader?: string } = { update };
  if (secretHeader) args.secretHeader = secretHeader;

  const result = (await ctx.runAction(
    internal.telegram.processUpdate,
    args,
  )) as ProcessResult;

  return json(result.body, result.status);
});
