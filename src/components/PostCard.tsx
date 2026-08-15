import type { Doc } from "@/convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronRight,
  ExternalLink,
  Hash,
  Link2,
  MessageSquare,
  UserRound,
} from "lucide-react";

export function PostCard({
  post,
  onOpen,
  onTagClick,
}: {
  post: Doc<"posts">;
  onOpen: (post: Doc<"posts">) => void;
  onTagClick: (tag: string) => void;
}) {
  const isLink = post.type === "link";
  const authorName =
    post.author.username ?? post.author.firstName ?? "Team member";
  const authorLabel = post.author.username
    ? `@${post.author.username}`
    : authorName;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(post)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(post);
      }}
      className="glass-panel group w-full cursor-pointer rounded-2xl p-5 text-left transition-all duration-200 hover:border-white/90 hover:bg-white/75"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={
              isLink
                ? "flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-white"
                : "flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
            }
          >
            {isLink ? (
              <Link2 className="size-4" />
            ) : (
              <MessageSquare className="size-4" />
            )}
          </span>
          <h3 className="truncate text-sm font-bold tracking-tight text-foreground">
            {post.title}
          </h3>
        </div>
        <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
          {formatDistanceToNow(post.publishedAt, { addSuffix: true })}
        </span>
      </div>

      {post.text && (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {post.text}
        </p>
      )}

      {post.links.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          {post.links.slice(0, 2).map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="glass-chip inline-flex max-w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <ExternalLink className="size-3.5 shrink-0 text-primary/70" />
              <span className="truncate font-semibold">{link.domain}</span>
              <span className="truncate text-[11px]">{link.url}</span>
            </a>
          ))}
          {post.links.length > 2 && (
            <span className="px-1 text-[11px] font-medium text-muted-foreground">
              +{post.links.length - 2} more link{post.links.length - 2 > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {post.tags.slice(0, 6).map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTagClick(tag);
            }}
            className="glass-chip inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <Hash className="size-3" />
            {tag}
          </button>
        ))}
        {post.tags.length > 6 && (
          <span className="px-1 text-[11px] font-medium text-muted-foreground">
            +{post.tags.length - 6}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <UserRound className="size-3.5" />
          {authorLabel}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary/80 opacity-0 transition-opacity group-hover:opacity-100">
          Open post <ChevronRight className="size-3.5" />
        </span>
      </div>
    </div>
  );
}
