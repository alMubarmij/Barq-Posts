import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Doc } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
import {
  Copy,
  ExternalLink,
  Hash,
  Link2,
  MessageSquare,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

export function PostDetailDialog({
  post,
  open,
  onOpenChange,
}: {
  post: Doc<"posts"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!post) return null;

  const isLink = post.type === "link";
  const authorName =
    post.author.username ?? post.author.firstName ?? "Team member";
  const authorLabel = post.author.username
    ? `@${post.author.username}`
    : authorName;

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`Copied ${label} to clipboard`);
    } catch {
      toast("Could not copy — clipboard blocked in this browser");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-h-[85vh] max-w-lg overflow-y-auto rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span
              className={
                isLink
                  ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-white"
                  : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
              }
            >
              {isLink ? <Link2 className="size-4" /> : <MessageSquare className="size-4" />}
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-left text-base">{post.title}</DialogTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {format(post.publishedAt, "MMM d, yyyy · HH:mm")} · {authorLabel}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
            {post.text}
          </p>

          {post.links.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Links
              </p>
              <div className="flex flex-col gap-2">
                {post.links.map((link) => (
                  <div
                    key={link.url}
                    className="glass-chip flex items-center gap-2 rounded-xl px-3 py-2.5"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-0 flex-1 items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="size-4 shrink-0" />
                      <span className="truncate">{link.url}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyText(link.url, "link")}
                      className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label="Copy link"
                    >
                      <Copy className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="glass-chip inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-primary"
                >
                  <Hash className="size-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
            <button
              type="button"
              onClick={() => copyText(post.text, "post text")}
              className="glass-chip inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <Copy className="size-3.5" /> Copy text
            </button>
            {post.links.length > 0 && (
              <button
                type="button"
                onClick={() => copyText(post.links[0].url, "link")}
                className="glass-chip inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <Link2 className="size-3.5" /> Copy first link
              </button>
            )}
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <UserRound className="size-3.5" />
              Published via Telegram
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
