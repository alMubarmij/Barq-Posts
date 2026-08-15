import { cn } from "@/lib/utils";
import { ar, en, translations, type Dict, type Lang } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";
export type TextSize = "s" | "m" | "l";

const THEME_KEY = "barq-theme";
const LANG_KEY = "barq-lang";
const TEXT_SIZE_KEY = "barq-text-size";

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function initialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = readStored(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "dark";
  }
}

function initialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = readStored(LANG_KEY);
  return stored === "ar" ? "ar" : "en";
}

function initialTextSize(): TextSize {
  if (typeof window === "undefined") return "m";
  const stored = readStored(TEXT_SIZE_KEY);
  return stored === "s" || stored === "l" ? stored : "m";
}

/** Typography classes applied to post cards and the reading view per size. */
export const POST_TEXT: Record<
  TextSize,
  {
    card: { title: string; body: string; link: string; tag: string };
    detail: { heading: string; body: string };
  }
> = {
  s: {
    card: { title: "text-xs", body: "text-xs leading-5", link: "text-[11px]", tag: "text-[10px]" },
    detail: { heading: "text-xl sm:text-2xl", body: "text-sm leading-7" },
  },
  m: {
    card: { title: "text-sm", body: "text-sm leading-6", link: "text-xs", tag: "text-[11px]" },
    detail: { heading: "text-2xl sm:text-3xl", body: "text-[15px] leading-8" },
  },
  l: {
    card: { title: "text-base", body: "text-[15px] leading-7", link: "text-[13px]", tag: "text-xs" },
    detail: { heading: "text-3xl sm:text-4xl", body: "text-lg leading-9" },
  },
};

type SettingsValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  dict: Dict;
  isAr: boolean;
  textSize: TextSize;
  setTextSize: (s: TextSize) => void;
};

const SettingsContext = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [lang, setLang] = useState<Lang>(initialLang);
  const [textSize, setTextSize] = useState<TextSize>(initialTextSize);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  useEffect(() => {
    try {
      window.localStorage.setItem(TEXT_SIZE_KEY, textSize);
    } catch {
      /* ignore */
    }
  }, [textSize]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  const value: SettingsValue = {
    theme,
    setTheme,
    toggleTheme,
    lang,
    setLang,
    dict: translations[lang],
    isAr: lang === "ar",
    textSize,
    setTextSize,
  };

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

export function useI18n() {
  const { lang, setLang, dict, isAr } = useSettings();
  return { lang, setLang, dict, isAr };
}

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useSettings();
  return { theme, setTheme, toggleTheme };
}

export function useTextSize() {
  const { textSize, setTextSize } = useSettings();
  return { textSize, setTextSize };
}

/** Dark / light switch with an animated icon swap. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { dict } = useI18n();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? dict.settings.lightTheme : dict.settings.darkTheme}
      title={isDark ? dict.settings.lightTheme : dict.settings.darkTheme}
      className={cn(
        "glass-chip inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.18 }}
          className="inline-flex"
        >
          {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/** EN / ع language switch. */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, dict } = useI18n();
  return (
    <div
      role="group"
      aria-label={dict.settings.language}
      className={cn("glass-chip flex items-center rounded-full p-0.5", className)}
    >
      {(["en", "ar"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={
            lang === l
              ? "inline-flex h-6 min-w-7 cursor-pointer items-center justify-center rounded-full bg-primary px-2 text-[11px] font-bold text-primary-foreground"
              : "inline-flex h-6 min-w-7 cursor-pointer items-center justify-center rounded-full px-2 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {l === "en" ? "EN" : "ع"}
        </button>
      ))}
    </div>
  );
}

/** A− / A / A+ controls for post reading size. */
export function TextSizeControls({ className }: { className?: string }) {
  const { textSize, setTextSize } = useTextSize();
  const { dict } = useI18n();
  const labels: Record<TextSize, { label: string; aria: string }> = {
    s: { label: "A−", aria: dict.settings.textSizeSmall },
    m: { label: "A", aria: dict.settings.textSizeDefault },
    l: { label: "A+", aria: dict.settings.textSizeLarge },
  };
  return (
    <div
      role="group"
      aria-label={dict.settings.textSize}
      className={cn("glass-chip flex items-center rounded-full p-0.5", className)}
    >
      {(["s", "m", "l"] as const).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => setTextSize(s)}
          aria-pressed={textSize === s}
          aria-label={labels[s].aria}
          title={labels[s].aria}
          className={
            textSize === s
              ? "inline-flex h-6 min-w-7 cursor-pointer items-center justify-center rounded-full bg-primary px-2 text-[11px] font-bold text-primary-foreground"
              : "inline-flex h-6 min-w-7 cursor-pointer items-center justify-center rounded-full px-2 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {labels[s].label}
        </button>
      ))}
    </div>
  );
}

export { en, ar };
