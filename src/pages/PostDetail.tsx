import { BackgroundFX } from "@/components/BackgroundFX";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Hash,
  Link2,
  Loader2,
  LogOut,
  MessageSquare,
  Send,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const post = useQuery(
    api.posts.get,
    id ? { id: id as Id<"posts"> } : "skip",
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`Copied ${label} to clipboard`);
    } catch {
      toast("Could not copy — clipboard blocked in this browser");
    }
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundFX />

      {/* Top bar */}
      <header className="sticky top-3 z-40 mx-auto mt-4 w-[min(100%-1.25rem,72rem)]">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-4 py-2.5 sm:px-5">
          <Link to="/" aria-label="Back to home">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden cursor-pointer rounded-xl text-muted-foreground sm:inline-flex"
            >
              <Link to="/dashboard">
                <ArrowLeft className="size-4" />
                Archive
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="cursor-pointer rounded-xl text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-[min(100%-1.25rem,48rem)] pb-24 pt-8">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to archive
        </Link>

        {post === undefined ? (
          <div className="glass-panel flex items-center justify-center gap-2 rounded-3xl py-24 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading post…
          </div>
        ) : post === null ? (
          <div className="glass-panel rounded-3xl px-6 py-16 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
              <Terminal className="size-6" />
            </span>
            <h1 className="mt-5 text-xl font-bold tracking-tight">
              Post not found
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              This post doesn&apos;t exist or was never published. Head back to
              your archive.
            </p>
            <Button asChild className="mt-6 cursor-pointer rounded-xl">
              <Link to="/dashboard">
                Back to archive <ArrowLeft className="size-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong rounded-3xl p-6 sm:p-9"
          >
            {/* Header */}
            <div className="flex items-start gap-4">
              <span
                className={
                  post.type === "link"
                    ? "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white shadow-[0_8px_20px_-8px_oklch(0.7_0.14_215/0.5)]"
                    : "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary"
                }
              >
                {post.type === "link" ? (
                  <Link2 className="size-5" />
                ) : (
                  <MessageSquare className="size-5" />
                )}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="glass-chip inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {post.type === "link" ? "Link bookmark" : "Note"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    <Send className="size-3" />
                    {post.source !== "web" ? "Via Telegram" : "Added manually"}
                  </span>
                </div>
                <h1 className="mt-2.5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                  {post.title}
                </h1>
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  {format(post.publishedAt, "MMMM d, yyyy · HH:mm")}
                </p>
              </div>
            </div>

            {/* Body */}
            {post.text && (
              <p className="mt-7 whitespace-pre-wrap text-[15px] leading-8 text-foreground/90">
                {post.text}
              </p>
            )}

            {/* Links */}
            {post.links.length > 0 && (
              <div className="mt-8">
                <p className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Links
                </p>
                <div className="flex flex-col gap-2">
                  {post.links.map((link) => (
                    <div
                      key={link.url}
                      className="glass-chip flex items-center gap-2 rounded-xl px-3.5 py-3"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-w-0 flex-1 items-center gap-2.5 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="size-4 shrink-0" />
                        <span className="truncate font-semibold">
                          {link.domain}
                        </span>
                        <span className="hidden truncate font-mono text-xs text-muted-foreground sm:inline">
                          {link.url}
                        </span>
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

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8">
                <p className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/dashboard?tag=${encodeURIComponent(tag)}`}
                      className="glass-chip inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      <Hash className="size-3" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-9 flex flex-wrap gap-2 border-t border-border/60 pt-5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="glass-chip cursor-pointer rounded-xl"
                onClick={() => copyText(post.text, "post text")}
              >
                <Copy className="size-3.5" />
                Copy text
              </Button>
              {post.links.length > 0 && (
                <>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="glass-chip cursor-pointer rounded-xl"
                  >
                    <a
                      href={post.links[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-3.5" />
                      Open link
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="glass-chip cursor-pointer rounded-xl"
                    onClick={() => copyText(post.links[0].url, "link")}
                  >
                    <Link2 className="size-3.5" />
                    Copy link
                  </Button>
                </>
              )}
            </div>
          </motion.article>
        )}
      </main>
    </div>
  );
}
