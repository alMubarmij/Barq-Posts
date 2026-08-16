import { BackgroundFX } from "@/components/BackgroundFX";
import { Logo } from "@/components/Logo";
import { PostCard } from "@/components/PostCard";
import {
  LanguageToggle,
  ThemeToggle,
  useI18n,
} from "@/components/Settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Archive,
  ArrowRight,
  Globe,
  Inbox,
  Loader2,
  Lock,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

type TypeFilter = "all" | "link" | "message";

export default function PublicPage() {
  const { dict } = useI18n();
  const { isAuthenticated } = useAuth();
  const d = dict.public;
  const posts = useQuery(api.posts.publicList);

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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

  const types: { id: TypeFilter; label: string; count: number }[] = [
    { id: "all", label: dict.dashboard.types.all, count: posts?.length ?? 0 },
    {
      id: "link",
      label: dict.dashboard.types.links,
      count: posts?.filter((p) => p.type === "link").length ?? 0,
    },
    {
      id: "message",
      label: dict.dashboard.types.notes,
      count: posts?.filter((p) => p.type === "message").length ?? 0,
    },
  ];

  const topTags = tagCounts.slice(0, 8);

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
            {isAuthenticated ? (
              <Button asChild size="sm" className="cursor-pointer rounded-xl">
                <Link to="/dashboard">
                  {dict.common.openArchive}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="cursor-pointer rounded-xl">
                <Link to="/auth">{dict.common.signIn}</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl pb-20 pt-8 sm:pt-10">
        <div className="mb-6 text-center">
          <Badge
            variant="outline"
            className="glass-chip gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-primary"
          >
            <Globe className="size-3.5" />
            {d.badge}
          </Badge>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{d.title}</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            {d.subtitle}
          </p>
        </div>

        {posts === undefined ? (
          <div className="glass-panel flex items-center justify-center gap-2 rounded-3xl py-20 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {dict.common.loading}
          </div>
        ) : posts === null ? (
          <div className="glass-panel mx-auto max-w-md rounded-3xl px-6 py-16 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
              <Lock className="size-6" />
            </span>
            <h2 className="mt-5 text-lg font-bold">{d.privateTitle}</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {d.privateText}
            </p>
            <Button asChild className="mt-6 cursor-pointer rounded-xl">
              <Link to="/auth">
                {dict.common.signIn} <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-panel mx-auto max-w-md rounded-3xl px-6 py-16 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
              <Inbox className="size-6" />
            </span>
            <h2 className="mt-5 text-lg font-bold">{d.emptyTitle}</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {d.emptyText}
            </p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-1.5">
                {types.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTypeFilter(t.id)}
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
              <div className="relative w-full sm:w-64">
                <Search className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={dict.common.searchPlaceholder}
                  className="glass-chip rounded-xl ps-9"
                />
              </div>
            </div>

            {topTags.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-1.5">
                {topTags.map(([tag, count]) => {
                  const active = tagFilter === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setTagFilter(active ? null : tag)}
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
              </div>
            )}

            {/* Feed */}
            {filtered.length === 0 ? (
              <div className="glass-panel rounded-3xl px-6 py-14 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Archive className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-bold">
                  {dict.dashboard.emptyNoMatch}
                </h3>
                <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">
                  {dict.dashboard.emptyNoMatchText}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {filtered.map((post: Doc<"posts">, i) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                  >
                    <PostCard
                      post={post}
                      readOnly
                      onTagClick={(tag) => setTagFilter(tag)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="glass-panel rounded-none border-x-0 border-b-0">
        <div className="mx-auto flex w-[min(100%-1.25rem,72rem)] flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <Logo />
          <p className="text-xs text-muted-foreground">{d.footer}</p>
          <p className="text-xs text-muted-foreground">{d.ownerCta}</p>
        </div>
      </footer>
    </div>
  );
}
