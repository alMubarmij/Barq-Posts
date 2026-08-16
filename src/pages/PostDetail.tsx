import { BackgroundFX } from "@/components/BackgroundFX";
import { Logo } from "@/components/Logo";
import { PostComposer } from "@/components/PostComposer";
import {
  LanguageToggle,
  POST_TEXT,
  TextSizeControls,
  ThemeToggle,
  useI18n,
  useTextSize,
} from "@/components/Settings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { fmt } from "@/lib/i18n";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Link2,
  Loader2,
  LogOut,
  MessageSquare,
  Pencil,
  Send,
  Terminal,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { dict, isAr } = useI18n();
  const { textSize } = useTextSize();
  const pd = dict.postDetail;
  const post = useQuery(
    api.posts.get,
    id ? { id: id as Id<"posts"> } : "skip",
  );

  const [editingOpen, setEditingOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState<{
    _id: Id<"posts">;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const deletePost = useMutation(api.posts.remove);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const confirmDelete = async () => {
    if (!deletingPost) return;
    setDeleting(true);
    try {
      await deletePost({ id: deletingPost._id });
      toast(dict.common.deleted);
      navigate("/dashboard");
    } catch (err) {
      toast.error(dict.common.deleteFailed, {
        description:
          err instanceof Error ? err.message : dict.common.unknownError,
      });
    } finally {
      setDeleting(false);
    }
  };

  const copyText = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(fmt(dict.common.copiedToClipboard, { what }));
    } catch {
      toast(dict.common.copyFailed);
    }
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundFX />

      {/* Top bar */}
      <header className="sticky top-3 z-40 mx-auto mt-4 w-[min(100%-1.25rem,72rem)]">
        <div className="glass-strong flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl px-4 py-2.5 sm:px-5">
          <Link to="/" aria-label={dict.brand.home}>
            <Logo />
          </Link>
          <div className="ms-auto flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden cursor-pointer rounded-xl text-muted-foreground sm:inline-flex"
            >
              <Link to="/dashboard">
                <ArrowLeft className="size-4 rtl:rotate-180" />
                {dict.common.backToArchive}
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
              <span className="hidden sm:inline">{dict.common.signOut}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-[min(100%-1.25rem,48rem)] pb-24 pt-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {dict.common.backToArchive}
          </Link>
          <TextSizeControls />
        </div>

        {post === undefined ? (
          <div className="glass-panel flex items-center justify-center gap-2 rounded-3xl py-24 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {pd.loading}
          </div>
        ) : post === null ? (
          <div className="glass-panel rounded-3xl px-6 py-16 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
              <Terminal className="size-6" />
            </span>
            <h1 className="mt-5 text-xl font-bold">{pd.notFoundTitle}</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {pd.notFoundText}
            </p>
            <Button asChild className="mt-6 cursor-pointer rounded-xl">
              <Link to="/dashboard">
                {dict.common.backToArchive}{" "}
                <ArrowLeft className="size-4 rtl:rotate-180" />
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
                    {post.type === "link" ? pd.linkBookmark : pd.note}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    <Send className="size-3" />
                    {post.source !== "web" ? pd.viaTelegram : pd.addedManually}
                  </span>
                </div>
                <h1
                  className={`mt-2.5 font-bold leading-tight ${POST_TEXT[textSize].detail.heading}`}
                >
                  {post.title}
                </h1>
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  {format(post.publishedAt, "MMMM d, yyyy · HH:mm", {
                    locale: isAr ? ar : enUS,
                  })}
                </p>
              </div>
            </div>

            {/* Body */}
            {post.text && (
              <p
                className={`mt-7 whitespace-pre-wrap text-foreground/90 ${POST_TEXT[textSize].detail.body}`}
              >
                {post.text}
              </p>
            )}

            {/* Links */}
            {post.links.length > 0 && (
              <div className="mt-8">
                <p className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {pd.links}
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
                        onClick={() => copyText(link.url, pd.link)}
                        className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={pd.copyLink}
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
                  {pd.tags}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/dashboard?tag=${encodeURIComponent(tag)}`}
                      className="glass-chip inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-9 flex flex-wrap gap-2 border-t border-border/60 pt-5">
              {post.text && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="glass-chip cursor-pointer rounded-xl"
                  onClick={() => copyText(post.text, pd.text)}
                >
                  <Copy className="size-3.5" />
                  {pd.copyText}
                </Button>
              )}
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
                      {pd.openLink}
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="glass-chip cursor-pointer rounded-xl"
                    onClick={() => copyText(post.links[0].url, pd.link)}
                  >
                    <Link2 className="size-3.5" />
                    {pd.copyLink}
                  </Button>
                </>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="glass-chip cursor-pointer rounded-xl"
                onClick={() => setEditingOpen(true)}
              >
                <Pencil className="size-3.5" />
                {dict.common.edit}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="glass-chip cursor-pointer rounded-xl text-red-500 hover:text-red-500"
                onClick={() =>
                  setDeletingPost({ _id: post._id, title: post.title })
                }
              >
                <Trash2 className="size-3.5" />
                {dict.common.delete}
              </Button>
            </div>
          </motion.article>
        )}
      </main>

      <PostComposer
        open={editingOpen}
        onOpenChange={setEditingOpen}
        editing={post}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={deletingPost !== null}
        onOpenChange={(o) => {
          if (!o && !deleting) setDeletingPost(null);
        }}
      >
        <AlertDialogContent className="glass-strong rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{dict.common.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {dict.common.deleteText}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="glass-chip cursor-pointer rounded-xl"
              disabled={deleting}
            >
              {dict.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
              disabled={deleting}
              className="cursor-pointer rounded-xl bg-red-500 hover:bg-red-600"
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="size-4" />
                  {dict.common.delete}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
