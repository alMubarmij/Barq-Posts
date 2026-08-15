import { useI18n } from "@/components/Settings";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

export function Logo({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  const { dict } = useI18n();
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white shadow-[0_8px_20px_-8px_oklch(0.7_0.14_215/0.6)]">
        <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/40" />
        <Send className="size-4 -rotate-12" strokeWidth={2.4} />
      </span>
      {!iconOnly && (
        <span className="flex flex-col leading-none">
          <span className="font-heading text-[1.05rem] font-bold text-foreground">
            {dict.brand.name}
          </span>
          <span className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {dict.brand.tagline}
          </span>
        </span>
      )}
    </span>
  );
}
