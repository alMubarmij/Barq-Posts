import { BackgroundFX } from "@/components/BackgroundFX";
import { Logo } from "@/components/Logo";
import { PostCard } from "@/components/PostCard";
import { PostComposer } from "@/components/PostComposer";
import {
  LanguageToggle,
  TextSizeControls,
  ThemeToggle,
  useI18n,
} from "@/components/Settings";
import { TelegramSetup } from "@/components/TelegramSetup";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { arPlural, fmt, plural } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  ExternalLink,
  Globe,
  Inbox,
  Link2,
  Loader2,
  LogOut,
  Plus,
  Search,
  Send,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

type View = "feed" | "tags" | "telegram";
type TypeFilter = "all" | "link" | "message";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dict } = useI18n();
  const posts = useQuery(api.posts.list);

  const [view, setView] = useState<View>("feed");
  const [tagFilter, setTagFilter] = useState<string | null>(
    searchParams.get("tag"),
  );
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [search, setSearch] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Doc<"posts"> | null>(null);
  const [deletingPost, setDeletingPost] = useState<Doc<"posts"> | null>(null);
  const [deleting, setDeleting] = useState(false);
  const deletePost = useMutation(api.posts.remove);

  const confirmDelete = async () => {
    if (!deletingPost) return;
    setDeleting(true);
    try {
      await deletePost({ id: deletingPost._id });
      toast(dict.common.deleted);
      setDeletingPost(null);
    } catch (err) {
      toast.error(dict.common.deleteFailed, {
        description:
          err instanceof Error ? err.message : dict.common.unknownError,
      });
    } finally {
      setDeleting(false);
    }
  };

  const NAV: { id: View; label: string; icon: typeof Inbox }[] = [
    { id: "feed", label: dict.nav.archive, icon: Archive },
    { id: "tags", label: dict.nav.tags, icon: Tags },
    { id: "telegram", label: dict.nav.telegram, icon: Send },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const post of posts ?? []) {
      for (const tag of post.tags) {
        map.set(tag, (map.get(tag) ?? 0) + 1);
      }
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const filtered = useMemo(() => {
    let list = posts ?? [];
    if (typeFilter !== "all") {
      list = list.filter((p) => p.type === typeFilter);
    }
    if (tagFilter) {
      list = list.filter((p) => p.tags.includes(tagFilter));
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.text.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          p.links.some(
            (l) =>
              l.url.toLowerCase().includes(q) ||
              l.domain.toLowerCase().includes(q),
          ),
      );
    }
    return list;
  }, [posts, typeFilter, tagFilter, search]);

  const stats = useMemo(() => {
    const total = posts?.length ?? 0;
    const links = posts?.filter((p) => p.type === "link").length ?? 0;
    return { total, links, notes: total - links };
  }, [posts]);

  const topTags = tagCounts.slice(0, 8);
  const maxTagCount = Math.max(1, ...tagCounts.map(([, c]) => c));
  const initials = (user?.name ?? user?.email ?? "Y")
    .slice(0, 2)
    .toUpperCase();

  const clearFilters = () => {
    setTagFilter(null);
    setTypeFilter("all");
    setSearch("");
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundFX />

      <div className="mx-auto flex w-[min(100%-1.25rem,96rem)] flex-col gap-4 py-4 lg:flex-row lg:gap-5">
        {/* Desktop sidebar */}
        <aside className="glass-strong sticky top-4 hidden h-[calc(100vh-2rem)] w-60 shrink-0 flex-col rounded-3xl p-4 lg:flex">
          <Link to="/" aria-label={dict.brand.home}>
            <Logo />
          </Link>

          <nav className="mt-7 flex flex-col gap-1">
            {NAV.map((item) => {
              const active = view === item.id;
              const badge =
                item.id === "feed"
                  ? stats.total
                  : item.id === "tags"
                    ? tagCounts.length
                    : null;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={
                    active
                      ? "flex cursor-pointer items-center gap-2.5 rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
                      : "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground"
                  }
                >
                  <item.icon className="size-4" />
                  {item.label}
                  {badge !== null && (
                    <span
                      className={
                        active
                          ? "ms-auto rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold"
                          : "ms-auto rounded-full bg-background/70 px-2 py-0.5 text-[11px] font-bold text-muted-foreground"
                      }
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <Button
            type="button"
            className="mt-5 w-full cursor-pointer rounded-xl"
            onClick={() => setComposerOpen(true)}
          >
            <Plus className="size-4" />
            {dict.common.newPost}
          </Button>

          <div className="mt-4 flex items-center justify-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <div className="mt-auto space-y-3">
            <PublicToggle />
            <div className="glass-chip flex items-center gap-2.5 rounded-2xl p-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-xs font-bold text-white">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-foreground">
                  {user?.name ?? user?.email ?? dict.dashboard.you}
                </p>
                <p className="truncate font-mono text-[10px] text-muted-foreground">
                  {user?.email ?? dict.dashboard.privateOwner}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="glass-chip w-full cursor-pointer rounded-xl"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              {dict.common.signOut}
            </Button>
          </div>
        </aside>

        {/* Main column */}
        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="glass-strong sticky top-3 z-30 mb-4 rounded-2xl px-3 py-2 lg:hidden">
            <div className="flex items-center justify-between gap-2">
              <Link to="/" aria-label={dict.brand.home}>
                <Logo iconOnly />
              </Link>
              <div className="flex items-center gap-1.5">
                <LanguageToggle />
                <ThemeToggle />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 cursor-pointer rounded-lg"
                  onClick={() => setComposerOpen(true)}
                  aria-label={dict.common.newPost}
                >
                  <Plus className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 cursor-pointer rounded-lg"
                  onClick={handleSignOut}
                  aria-label={dict.common.signOut}
                >
                  <LogOut className="size-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 overflow-x-auto">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={
                    view === item.id
                      ? "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary"
                      : "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground"
                  }
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <PublicToggle />
            </div>
          </div>

          <main className="mx-auto w-full max-w-4xl pb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {view === "feed" && (
                  <FeedView
                    posts={filtered}
                    allCount={stats.total}
                    linkCount={stats.links}
                    noteCount={stats.notes}
                    typeFilter={typeFilter}
                    onTypeFilter={setTypeFilter}
                    tagFilter={tagFilter}
                    topTags={topTags}
                    onTagClick={(tag) => setTagFilter(tag)}
                    search={search}
                    onSearch={setSearch}
                    loading={posts === undefined}
                    hasAnyPosts={stats.total > 0}
                    onClearFilters={clearFilters}
                    onNewPost={() => setComposerOpen(true)}
                    onGoToTelegram={() => setView("telegram")}
                    onEditPost={(post) => {
                      setEditingPost(post);
                      setComposerOpen(true);
                    }}
                    onDeletePost={setDeletingPost}
                  />
                )}
                {view === "tags" && (
                  <TagsView
                    tagCounts={tagCounts}
                    maxCount={maxTagCount}
                    onTagClick={(tag) => {
                      setTagFilter(tag);
                      setView("feed");
                    }}
                  />
                )}
                {view === "telegram" && (
                  <div>
                    <Header
                      title={dict.nav.telegram}
                      subtitle={dict.dashboard.telegramSubtitle}
                    />
                    <TelegramSetup />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <PostComposer
        open={composerOpen}
        onOpenChange={(o) => {
          setComposerOpen(o);
          if (!o) setEditingPost(null);
        }}
        editing={editingPost}
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

/** Public archive toggle — appears in the sidebar and the mobile top bar. */
function PublicToggle() {
  const { dict } = useI18n();
  const { user } = useAuth();
  const setPublicProfile = useMutation(api.users.setPublicProfile);
  const [busy, setBusy] = useState(false);
  const isOn = user?.publicProfile === true;

  const toggle = async (on: boolean) => {
    setBusy(true);
    try {
      await setPublicProfile({ publicProfile: on });
      toast(on ? dict.common.publicProfile : dict.common.privateArchive);
    } catch {
      toast.error(dict.common.unknownError);
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/public`;
    try {
      await navigator.clipboard.writeText(url);
      toast(
        fmt(dict.common.copiedToClipboard, {
          what: dict.common.copyPublicLink,
        }),
      );
    } catch {
      toast(dict.common.copyFailed);
    }
  };

  return (
    <div className="glass-chip rounded-2xl p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
            <Globe className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-foreground">
              {dict.common.publicProfile}
            </p>
            <p className="truncate text-[10px] leading-4 text-muted-foreground">
              {dict.common.publicHint}
            </p>
          </div>
        </div>
        <Switch
          checked={isOn}
          onCheckedChange={(v) => void toggle(v)}
          disabled={busy}
          aria-label={dict.common.publicProfile}
          className={cn("shrink-0", busy && "opacity-60")}
        />
      </div>
      {isOn && (
        <div className="mt-2 flex items-center gap-1.5 border-t border-border/60 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 flex-1 cursor-pointer rounded-lg text-[11px]"
            onClick={copyLink}
          >
            <Link2 className="size-3" />
            {dict.common.copyPublicLink}
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-7 flex-1 cursor-pointer rounded-lg text-[11px]"
          >
            <Link to="/public" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3" />
              {dict.common.viewPublic}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function FeedView({
  posts,
  allCount,
  linkCount,
  noteCount,
  typeFilter,
  onTypeFilter,
  tagFilter,
  topTags,
  onTagClick,
  search,
  onSearch,
  loading,
  hasAnyPosts,
  onClearFilters,
  onNewPost,
  onGoToTelegram,
  onEditPost,
  onDeletePost,
}: {
  posts: Doc<"posts">[];
  allCount: number;
  linkCount: number;
  noteCount: number;
  typeFilter: TypeFilter;
  onTypeFilter: (t: TypeFilter) => void;
  tagFilter: string | null;
  topTags: [string, number][];
  onTagClick: (tag: string | null) => void;
  search: string;
  onSearch: (s: string) => void;
  loading: boolean;
  hasAnyPosts: boolean;
  onClearFilters: () => void;
  onNewPost: () => void;
  onGoToTelegram: () => void;
  onEditPost: (post: Doc<"posts">) => void;
  onDeletePost: (post: Doc<"posts">) => void;
}) {
  const { dict } = useI18n();
  const dd = dict.dashboard;
  const types: { id: TypeFilter; label: string; count: number }[] = [
    { id: "all", label: dd.types.all, count: allCount },
    { id: "link", label: dd.types.links, count: linkCount },
    { id: "message", label: dd.types.notes, count: noteCount },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{dd.feedTitle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{dd.feedSubtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TextSizeControls />
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={dict.common.searchPlaceholder}
              className="glass-chip rounded-xl ps-9"
            />
          </div>
          <Button
            type="button"
            className="hidden shrink-0 cursor-pointer rounded-xl sm:inline-flex"
            onClick={onNewPost}
          >
            <Plus className="size-4" />
            {dict.common.newPost}
          </Button>
        </div>
      </div>

      {/* Type filter */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {types.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTypeFilter(t.id)}
            className={
              typeFilter === t.id
                ? "inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground"
                : "glass-chip inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {t.label}
            <span
              className={
                typeFilter === t.id
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground/70"
              }
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tag filters */}
      {topTags.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          {topTags.map(([tag, count]) => {
            const active = tagFilter === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(active ? null : tag)}
                className={
                  active
                    ? "inline-flex cursor-pointer items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/30"
                    : "glass-chip inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                }
              >
                {tag}
                <span className="opacity-60">{count}</span>
              </button>
            );
          })}
          {tagFilter && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <X className="size-3" /> {dict.common.clearFilters}
            </button>
          )}
        </div>
      )}

      {/* Feed */}
      {loading ? (
        <div className="glass-panel flex items-center justify-center gap-2 rounded-3xl py-20 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {dd.loading}
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-panel rounded-3xl px-6 py-16 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white">
            <Archive className="size-6" />
          </span>
          <h3 className="mt-5 text-lg font-bold">
            {hasAnyPosts ? dd.emptyNoMatch : dd.emptyNothing}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {hasAnyPosts ? dd.emptyNoMatchText : dd.emptyText}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {hasAnyPosts ? (
              <Button
                type="button"
                variant="outline"
                className="glass-chip cursor-pointer rounded-xl"
                onClick={onClearFilters}
              >
                {dict.common.clearFilters}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  className="cursor-pointer rounded-xl"
                  onClick={onNewPost}
                >
                  <Plus className="size-4" />
                  {dict.common.newPost}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="glass-chip cursor-pointer rounded-xl"
                  onClick={onGoToTelegram}
                >
                  <Send className="size-4" />
                  {dict.common.connectTelegram}
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {posts.map((post, i) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
            >
              <PostCard
                post={post}
                onTagClick={onTagClick}
                onEdit={onEditPost}
                onDelete={onDeletePost}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function TagsView({
  tagCounts,
  maxCount,
  onTagClick,
}: {
  tagCounts: [string, number][];
  maxCount: number;
  onTagClick: (tag: string) => void;
}) {
  const { dict, isAr } = useI18n();
  const dd = dict.dashboard;
  return (
    <div>
      <Header
        title={dd.tagsTitle}
        subtitle={
          isAr
            ? arPlural(dd.tagsSubtitle, tagCounts.length)
            : plural(dd.tagsSubtitle.base, tagCounts.length)
        }
      />
      {tagCounts.length === 0 ? (
        <div className="glass-panel rounded-3xl px-6 py-16 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
            <Tags className="size-6" />
          </span>
          <h3 className="mt-5 text-lg font-bold">{dd.noTagsTitle}</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {dd.noTagsText}
          </p>
        </div>
      ) : (
        <div className="glass-panel flex flex-wrap items-center justify-center gap-2.5 rounded-3xl p-8 sm:p-10">
          {tagCounts.map(([tag, count], i) => (
            <motion.button
              key={tag}
              type="button"
              onClick={() => onTagClick(tag)}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              style={{
                fontSize: `${11 + (count / maxCount) * 9}px`,
              }}
              className="glass-chip inline-flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-1.5 font-semibold text-primary transition-all hover:bg-primary/10"
              title={`${count}`}
            >
              {tag}
              <span className="text-[10px] font-bold opacity-50">{count}</span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
