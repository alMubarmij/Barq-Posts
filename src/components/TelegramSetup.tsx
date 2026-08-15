import { api } from "@/convex/_generated/api";
import { useI18n } from "@/components/Settings";
import { Button } from "@/components/ui/button";
import { fmt } from "@/lib/i18n";
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

export function TelegramSetup() {
  const statusAction = useAction(api.telegram.status);
  const setWebhookAction = useAction(api.telegram.setWebhook);
  const { dict } = useI18n();
  const ts = dict.telegramSetup;

  const stepIcons = [Bot, KeyRound, Wrench];

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
      setError(err instanceof Error ? err.message : ts.couldNotReach);
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
      toast(ts.toastRegistered, {
        description: result.webhookUrl,
      });
      await refresh();
    } catch (err) {
      toast.error(ts.toastFailed, {
        description: err instanceof Error ? err.message : dict.common.unknownError,
      });
    } finally {
      setRegistering(false);
    }
  };

  const copyUrl = async () => {
    if (!status?.webhookUrl) return;
    try {
      await navigator.clipboard.writeText(status.webhookUrl);
      toast(fmt(dict.common.copiedToClipboard, { what: ts.copyWebhookUrl }));
    } catch {
      toast(dict.common.copyFailed);
    }
  };

  return (
    <div className="space-y-5">
      {/* Status panel */}
      <div className="glass-panel rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold">{ts.connectionStatus}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{ts.liveCheck}</p>
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
            {dict.common.refresh}
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {loading && !status ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              {ts.checking}
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 rounded-2xl bg-red-500/10 p-4 text-sm text-red-600 ring-1 ring-inset ring-red-400/25 dark:text-red-300">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">{ts.statusFailed}</p>
                <p className="mt-0.5 opacity-80">{error}</p>
              </div>
            </div>
          ) : status && !status.configured ? (
            <div className="flex items-start gap-3 rounded-2xl bg-amber-400/10 p-4 text-sm text-amber-700 ring-1 ring-inset ring-amber-400/25 dark:text-amber-200">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">{ts.tokenNotConfigured}</p>
                <p className="mt-0.5">
                  {fmt(ts.addTokenHint, {
                    code: "TELEGRAM_BOT_TOKEN",
                  }).split("TELEGRAM_BOT_TOKEN")[0]}
                  <code className="rounded bg-amber-400/15 px-1.5 py-0.5 font-mono text-xs text-amber-800 dark:text-amber-100">
                    TELEGRAM_BOT_TOKEN
                  </code>
                  {fmt(ts.addTokenHint, {
                    code: "TELEGRAM_BOT_TOKEN",
                  }).split("TELEGRAM_BOT_TOKEN")[1]}
                </p>
              </div>
            </div>
          ) : status ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-400/30 dark:text-emerald-300">
                  <CheckCircle2 className="size-3.5" />
                  {status.bot?.username
                    ? fmt(ts.connectedAs, { username: status.bot.username })
                    : ts.tokenAccepted}
                </span>
                <span
                  className={
                    status.webhook?.url
                      ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-400/30 dark:text-emerald-300"
                      : "inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-400/30 dark:text-amber-200"
                  }
                >
                  <Wrench className="size-3.5" />
                  {status.webhook?.url
                    ? ts.webhookRegistered
                    : ts.webhookNotRegistered}
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
                  aria-label={ts.copyWebhookUrl}
                >
                  <Copy className="size-3.5" />
                </Button>
              </div>

              {typeof status.webhook?.pending_update_count === "number" &&
                status.webhook.pending_update_count > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {status.webhook.pending_update_count === 1
                      ? ts.pendingOne
                      : fmt(ts.pendingMany, {
                          n: status.webhook.pending_update_count,
                        })}
                  </p>
                )}
              {status.webhook?.last_error_message && (
                <p className="text-xs text-red-500">
                  {fmt(ts.lastError, { msg: status.webhook.last_error_message })}
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Steps */}
      <div className="glass-panel rounded-3xl p-6">
        <h3 className="text-base font-bold">{ts.setupTitle}</h3>
        <div className="mt-5 space-y-4">
          {ts.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="size-4" />
                  </span>
                  {i < ts.steps.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-border" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-bold text-foreground">
                    <span className="me-1.5 text-primary">
                      {i + 1}.
                    </span>
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {step.text}
                  </p>
                  {i === 0 && (
                    <a
                      href="https://t.me/BotFather"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <Bot className="size-3.5" />
                      {ts.openBotFather}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
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
              {ts.registering}
            </>
          ) : (
            <>
              <Send className="size-4" />
              {ts.register}
            </>
          )}
        </Button>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          {ts.afterRegister}
        </p>
      </div>
    </div>
  );
}
