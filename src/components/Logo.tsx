import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

export function Logo({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-indigo-400 to-indigo-600 text-white">
        <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/50" />
        <Send className="size-4 -rotate-12" strokeWidth={2.4} />
      </span>
      {!iconOnly && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Beam
        </span>
      )}
    </span>
  );
}
