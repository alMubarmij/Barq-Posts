import { api } from "@/convex/_generated/api";
import { useI18n } from "@/components/Settings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fmt } from "@/lib/i18n";
import { useMutation } from "convex/react";
import { useState } from "react";
import {
  Hash,
  Link2,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";
import { toast } from "sonner";

const URL_REGEX = /https?:\/\/[^\s<>"')\]}]+/gi;
const TAG_REGEX = /#?([\p{L}\p{N}_-]+)/gu;
const COMMON_TLDS = new Set([
  "com", "org", "net", "io", "dev", "ai", "co", "app", "me", "xyz",
  "info", "gov", "edu", "us", "uk", "de", "fr", "ru", "jp", "cn", "in",
]);

function deriveDomain(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    const parts = host.split(".");
    if (parts.length > 1 && COMMON_TLDS.has(parts[parts.length - 1])) {
      return parts[parts.length - 2];
    }
    return parts[0];
  } catch {
    return "link";
  }
}

function cleanUrl(raw: string): string {
  return raw.replace(/[.,;:!?)\]}]+$/g, "");
}

function extractLinks(text: string): { url: string; domain: string }[] {
  const seen = new Set<string>();
  const links: { url: string; domain: string }[] = [];
  for (const match of text.match(URL_REGEX) ?? []) {
    const url = cleanUrl(match);
    if (!seen.has(url)) {
      seen.add(url);
      links.push({ url, domain: deriveDomain(url) });
    }
  }
  return links;
}

function parseTags(raw: string): string[] {
  const tags: string[] = [];
  const seen = new Set<string>();
  for (const match of raw.matchAll(TAG_REGEX)) {
    const tag = match[1].trim().toLowerCase().replace(/^#/, "").slice(0, 24);
    if (tag && !seen.has(tag)) {
      seen.add(tag);
      tags.push(tag);
    }
  }
  return tags.slice(0, 12);
}

export function PostComposer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createPost = useMutation(api.posts.create);
  const { dict } = useI18n();
  const c = dict.composer;
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [publishing, setPublishing] = useState(false);

  const links = extractLinks(url.trim() || text);
  const willBeLink = links.length > 0;

  const close = () => {
    if (publishing) return;
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = text.trim();
    const parsedTags = parseTags(tags);
    if (!body && links.length === 0) {
      toast.error(c.toastAddContent);
      return;
    }
    setPublishing(true);
    try {
      await createPost({
        title: title.trim(),
        text: body,
        links,
        tags: parsedTags,
      });
      toast(c.toastPublished, {
        description: willBeLink
          ? fmt(c.toastBookmarked, { domain: links[0].domain })
          : c.toastNote,
      });
      setTitle("");
      setText("");
      setUrl("");
      setTags("");
      onOpenChange(false);
    } catch (err) {
      toast.error(c.toastFailed, {
        description: err instanceof Error ? err.message : dict.common.unknownError,
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="glass-strong max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg">{c.title}</DialogTitle>
          <DialogDescription>{c.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="composer-title">{c.fieldTitle}</Label>
            <Input
              id="composer-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={c.titlePlaceholder}
              className="glass-chip rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="composer-text">{c.fieldText}</Label>
            <Textarea
              id="composer-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder={c.textPlaceholder}
              className="glass-chip rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="composer-url">{c.fieldUrl}</Label>
            <div className="relative">
              <Link2 className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="composer-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={c.urlPlaceholder}
                className="glass-chip rounded-xl ps-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="composer-tags">{c.fieldTags}</Label>
            <div className="relative">
              <Hash className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="composer-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={c.tagsPlaceholder}
                className="glass-chip rounded-xl ps-9"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">{c.tagsHint}</p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="glass-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              {willBeLink ? (
                <>
                  <Link2 className="size-3 text-primary" />
                  {c.willBeLink}
                </>
              ) : (
                <>
                  <MessageSquare className="size-3 text-primary" />
                  {c.willBeNote}
                </>
              )}
            </span>
            <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
              {fmt(c.chars, { n: text.length })}
            </span>
          </div>

          <DialogFooter className="pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={close}
              disabled={publishing}
              className="cursor-pointer rounded-xl"
            >
              {dict.common.cancel}
            </Button>
            <Button
              type="submit"
              disabled={publishing}
              className="cursor-pointer rounded-xl"
            >
              {publishing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {c.publishing}
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  {c.publish}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
