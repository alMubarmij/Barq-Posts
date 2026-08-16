import { POST_TEXT, useI18n, useTextSize } from "@/components/Settings";
import type { Doc } from "@/convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { arPlural } from "@/lib/i18n";
import {
  ChevronRight,
  ExternalLink,
  Link2,
  MessageSquare,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router";

export function PostCard({
  post,
  onTagClick,
  onEdit,
  onDelete,
  readOnly = false,
}: {
  post: Doc<"posts">;
  onTagClick: (tag: string) => void;
  onEdit?: (post: Doc<"posts">) => void;
  onDelete?: (post: Doc<"posts">) => void;
  readOnly?: boolean;
}) {
  const navigate = useNavigate();
  const { dict, isAr } = useI18n();
  const { textSize } = useTextSize();
  const pc = dict.postCard;
  const tx = POST_TEXT[textSize].card;
  const isLink = post.type === "link";
  const actions = onEdit || onDelete;

  const open = () => {
    if (!readOnly) navigate(`/post/${post._id}`);
  };

  return (
    <div
      role={readOnly ? undefined : "button"}
      tabIndex={readOnly ? undefined : 0}
      onClick={open}
      onKeyDown={(e) => {
        if (readOnly) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className="glass-panel group w-full cursor-pointer rounded-2xl p-4 text-start transition-all duration-200 hover:border-white/90 hover:bg-white/75 sm:p-5 dark:hover:border-white/20 dark:hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={
              isLink
                ? "flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white"
                : "flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
            }
          >
            {isLink ? (
              <Link2 className="size-4" />
            ) : (
              <MessageSquare className="size-4" />
            )}
          </span>
          <h3 className={`truncate font-bold text-foreground ${tx.title}`}>
            {post.title}
          </h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
            {formatDistanceToNow(post.publishedAt, {
              addSuffix: true,
              locale: isAr ? ar : enUS,
            })}
          </span>
          {actions && (
            <span
              className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(post)}
                  aria-label={dict.common.edit}
                  title={dict.common.edit}
                  className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <Pencil className="size-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(post)}
                  aria-label={dict.common.delete}
                  title={dict.common.delete}
                  className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </span>
          )}
        </div>
      </div>

      {post.text && (
        <p className={`mt-3 line-clamp-3 text-muted-foreground ${tx.body}`}>
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
              className={`glass-chip inline-flex max-w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-primary ${tx.link}`}
            >
              <ExternalLink className="size-3.5 shrink-0 text-primary/70" />
              <span className="truncate font-semibold">{link.domain}</span>
              <span className="truncate font-mono">{link.url}</span>
            </a>
          ))}
          {post.links.length > 2 && (
            <span className={`px-1 font-medium text-muted-foreground ${tx.tag}`}>
              {post.links.length - 2 > 1
                ? isAr
                  ? arPlural(pc.moreLinks, post.links.length - 2)
                  : pc.moreLinks.base.replace(
                      "{n}",
                      String(post.links.length - 2),
                    )
                : pc.moreLink}
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
            className={`glass-chip inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 font-medium text-primary transition-colors hover:bg-primary/10 ${tx.tag}`}
          >
            {tag}
          </button>
        ))}
        {post.tags.length > 6 && (
          <span className={`px-1 font-medium text-muted-foreground ${tx.tag}`}>
            +{post.tags.length - 6}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-medium text-muted-foreground ${tx.tag}`}
        >
          <Send className="size-3.5 text-primary/70" />
          {post.source !== "web" ? pc.viaTelegram : pc.addedManually}
        </span>
        {!readOnly && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary/80 opacity-0 transition-opacity group-hover:opacity-100">
            <ChevronRight className="size-3.5 rtl:rotate-180" />
            {pc.openPost}
          </span>
        )}
      </div>
    </div>
  );
}
