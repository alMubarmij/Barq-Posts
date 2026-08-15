import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useAction } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Copy,
  KeyRound,
  Loader2,
  RefreshCw,
  Send,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

type StatusResult = {
  configured: boolean;
  bot: { username?: string; first_name?: string } | null;
  webhook: {
    url?: string;
    pending_update_count?: number;
    last_error_message?: string;
  } | null;
  webhookUrl: string;
};

const STEPS = [
  {
    icon: Bot,
    title: "Create your bot",
    text: "Open @BotFather in Telegram and send /newbot. Copy the token it gives you.",
    action: { label: "Open BotFather", href: "https://t.me/BotFather" },
  },
  {
    icon: KeyRound,
    title: "Add the token",
    text: "Paste the token into the project Keys as TELEGRAM_BOT_TOKEN (TELEGRAM_WEBHOOK_SECRET is optional).",
  },
  {
    icon: Wrench,
    title: "Register the webhook",
    text: "Hit the button below and Barq connects Telegram to your archive. Then just DM your bot.",
  },
];

export function TelegramSetup() {
  const statusAction = useAction(api.telegram.status);
  const setWebhookAction = useAction(api.telegram.setWebhook);

  const [status, setStatus] = useState<StatusResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStatus(await statusAction());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach the bot");
    } finally {
      setLoading(false);
    }
  }, [statusAction]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const registerWebhook = async () => {
    setRegistering(true);
    try {
      const result = await setWebhookAction();
      toast("Webhook registered", {
        description: result.webhookUrl,
      });
      await refresh();
    } catch (err) {
      toast.error("Could not register webhook", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setRegistering(false);
    }
  };

  const copyUrl = async () => {
    if (!status?.webhookUrl) return;
    try {
      await navigator.clipboard.writeText(status.webhookUrl);
      toast("Webhook URL copied to clipboard");
    } catch {
      toast("Could not copy — clipboard blocked in this browser");
    }
  };

  return (
    <div className="space-y-5">
      {/* Status panel */}
      <div className="glass-panel rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold tracking-tight">Connection status</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Live check against Telegram
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="glass-chip cursor-pointer rounded-xl"
            onClick={() => void refresh()}
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {loading && !status ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Checking Telegram connection…
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 rounded-2xl bg-red-500/10 p-4 text-sm text-red-300 ring-1 ring-inset ring-red-400/25">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">Status check failed</p>
                <p className="mt-0.5 text-red-300/80">{error}</p>
              </div>
            </div>
          ) : status && !status.configured ? (
            <div className="flex items-start gap-3 rounded-2xl bg-amber-400/10 p-4 text-sm text-amber-200 ring-1 ring-inset ring-amber-400/25">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">Token not configured yet</p>
                <p className="mt-0.5">
                  Add <code className="rounded bg-amber-400/15 px-1.5 py-0.5 font-mono text-xs text-amber-100">TELEGRAM_BOT_TOKEN</code>{" "}
                  to the project keys, then hit refresh.
                </p>
              </div>
            </div>
          ) : status ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
                  <CheckCircle2 className="size-3.5" />
                  {status.bot?.username
                    ? `Connected as @${status.bot.username}`
                    : "Token accepted"}
                </span>
                <span
                  className={
                    status.webhook?.url
                      ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/30"
                      : "inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-200 ring-1 ring-inset ring-amber-400/30"
                  }
                >
                  <Wrench className="size-3.5" />
                  Webhook {status.webhook?.url ? "registered" : "not registered"}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-background/70 p-3">
                <code className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                  {status.webhookUrl}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 cursor-pointer rounded-lg"
                  onClick={copyUrl}
                  aria-label="Copy webhook URL"
                >
                  <Copy className="size-3.5" />
                </Button>
              </div>

              {typeof status.webhook?.pending_update_count === "number" &&
                status.webhook.pending_update_count > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {status.webhook.pending_update_count} pending update
                    {status.webhook.pending_update_count > 1 ? "s" : ""} queued
                    on Telegram.
                  </p>
                )}
              {status.webhook?.last_error_message && (
                <p className="text-xs text-red-500">
                  Last webhook error: {status.webhook.last_error_message}
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Steps */}
      <div className="glass-panel rounded-3xl p-6">
        <h3 className="text-base font-bold tracking-tight">Set up in 3 steps</h3>
        <div className="mt-5 space-y-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <step.icon className="size-4" />
                </span>
                {i < STEPS.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-border" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm font-bold text-foreground">
                  <span className="mr-1.5 text-primary">Step {i + 1}.</span>
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {step.text}
                </p>
                {step.action && (
                  <a
                    href={step.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <Bot className="size-3.5" />
                    {step.action.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          onClick={registerWebhook}
          disabled={registering || loading}
          className="w-full cursor-pointer rounded-xl sm:w-auto"
        >
          {registering ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Registering…
            </>
          ) : (
            <>
              <Send className="size-4" />
              Register webhook
            </>
          )}
        </Button>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          After registering, message your bot in Telegram — every link or note
          you send is published to your archive instantly.
        </p>
      </div>
    </div>
  );
}
