import { BackgroundFX } from "@/components/BackgroundFX";
import { Logo } from "@/components/Logo";
import { LanguageToggle, ThemeToggle, useI18n } from "@/components/Settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Hash,
  Link2,
  PenLine,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Tags,
  Zap,
} from "lucide-react";
import { Link } from "react-router";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const DEMO_TAGS = ["dev", "reading", "ideas", "ai", "links", "postgres", "rust", "ux", "notes", "cli"];

const CLOUD_TAGS: [string, number][] = [
  ["dev", 14],
  ["postgres", 9],
  ["reading", 6],
  ["ai", 11],
  ["ideas", 5],
  ["rust", 7],
  ["ux", 4],
  ["notes", 3],
  ["cli", 8],
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const { dict } = useI18n();
  const d = dict.landing;

  const stepIcons = [Send, Tags, Bookmark];
  const featureIcons = [Link2, Hash, Zap, ShieldCheck, Search, PenLine];

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <BackgroundFX />

      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-4 z-40 mx-auto mt-4 w-[min(100%-2rem,72rem)]"
      >
        <div className="glass-strong flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 sm:px-5">
          <Link to="/" aria-label={dict.brand.home}>
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {[
              [dict.nav.how, "#how"],
              [dict.nav.features, "#features"],
              [dict.nav.tags, "#tags"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            {isAuthenticated ? (
              <Button asChild className="cursor-pointer rounded-xl" size="sm">
                <Link to="/dashboard">
                  {dict.common.openArchive} <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden cursor-pointer rounded-xl text-foreground sm:inline-flex"
                >
                  <Link to="/auth">{dict.common.signIn}</Link>
                </Button>
                <Button asChild className="cursor-pointer rounded-xl" size="sm">
                  <Link to="/auth">
                    {dict.common.getStarted} <ArrowRight className="size-4 rtl:rotate-180" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.header>

      <main className="relative">
        {/* Hero */}
        <section className="mx-auto w-[min(100%-2rem,72rem)] pb-16 pt-20 sm:pt-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
                <Badge
                  variant="outline"
                  className="glass-chip gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-primary"
                >
                  <Sparkles className="size-3.5" />
                  {d.hero.badge}
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={1}
                className="mt-5 text-4xl font-bold leading-[1.12] sm:text-5xl lg:text-[3.4rem]"
              >
                {d.hero.title1}
                <br />
                <span className="text-gradient-cool">{d.hero.title2}</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={2}
                className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
              >
                {d.hero.sub}
              </motion.p>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={3}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Button asChild size="lg" className="cursor-pointer rounded-xl px-6">
                  <Link to="/auth">
                    {d.hero.ctaPrimary} <ArrowRight className="size-4 rtl:rotate-180" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="glass-chip cursor-pointer rounded-xl px-6 text-foreground"
                >
                  <a href="#how">{d.hero.ctaSecondary}</a>
                </Button>
              </motion.div>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={4}
                className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground"
              >
                {d.hero.bullets.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-primary/70" />
                    {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Floating mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-md"
            >
              {/* Telegram bubble */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="glass-panel absolute -top-10 z-10 w-56 rounded-2xl rounded-bs-md p-4 -start-6 sm:-start-12"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white">
                    <Send className="size-3.5 -rotate-12" />
                  </span>
                  <p className="text-[11px] font-semibold text-foreground">
                    Barq bot{" "}
                    <span className="font-normal text-muted-foreground">· {d.hero.mockupNow}</span>
                  </p>
                </div>
                <p className="mt-2.5 text-xs leading-5 text-foreground/90">
                  {d.hero.mockupTitle}{" "}
                  <span className="text-sky-600 dark:text-cyan-300">https://fs.blog/…</span>{" "}
                  <span className="font-semibold text-indigo-600 dark:text-sky-300">#reading #thinking</span>
                </p>
              </motion.div>

              {/* Published post card */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="glass-strong relative z-20 rounded-3xl p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white">
                      <Link2 className="size-4" />
                    </span>
                    <span className="font-mono text-[11px]">fs.blog</span>
                  </span>
                  <Badge variant="secondary" className="glass-chip rounded-full text-[10px]">
                    {d.hero.archived}
                  </Badge>
                </div>
                <p className="font-heading mt-4 text-sm font-semibold leading-6 text-foreground">
                  {d.hero.mockupTitle}
                </p>
                <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                  https://fs.blog/speed-reading-…
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["reading", "thinking", "speed", "learning"].map((tag) => (
                    <span
                      key={tag}
                      className="glass-chip inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-primary"
                    >
                      <Hash className="size-3" /> {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Small floating chip */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="glass-panel absolute -bottom-6 z-30 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 end-0"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-400/90 text-white">
                  <CheckIcon />
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {d.hero.mockupChip}
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Tag strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 flex flex-wrap items-center justify-center gap-2"
          >
            {DEMO_TAGS.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="glass-chip inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <Hash className="size-3" /> {tag}
              </motion.span>
            ))}
          </motion.div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto w-[min(100%-2rem,72rem)] py-16 sm:py-20">
          <SectionHeading kicker={d.steps.kicker} title={d.steps.title} text={d.steps.text} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {d.steps.items.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="glass-panel group relative overflow-hidden rounded-3xl p-6 transition-colors hover:border-white/90 dark:hover:border-white/20"
                >
                  <span className="absolute right-5 top-4 font-mono text-4xl font-black text-primary/10">
                    0{i + 1}
                  </span>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/90 to-indigo-500/90 text-white transition-transform group-hover:scale-105 dark:from-cyan-400/90 dark:via-sky-500/90 dark:to-blue-600/90">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto w-[min(100%-2rem,72rem)] py-16 sm:py-20">
          <SectionHeading kicker={d.features.kicker} title={d.features.title} text={d.features.text} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {d.features.items.map((feature, i) => {
              const Icon = featureIcons[i];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
                  className="glass-panel rounded-3xl p-6 transition-colors hover:border-white/90 dark:hover:border-white/20"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Tags showcase */}
        <section id="tags" className="mx-auto w-[min(100%-2rem,72rem)] py-16 sm:py-20">
          <div className="glass-strong overflow-hidden rounded-[2rem] p-8 sm:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <SectionHeading
                  align="left"
                  kicker={d.tagsShowcase.kicker}
                  title={d.tagsShowcase.title}
                  text={d.tagsShowcase.text}
                />
                <Button asChild className="mt-8 cursor-pointer rounded-xl">
                  <Link to="/auth">
                    {d.tagsShowcase.cta} <ArrowRight className="size-4 rtl:rotate-180" />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap content-center items-center justify-center gap-3">
                {CLOUD_TAGS.map(([tag, size], i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      fontSize: `${10 + size * 1.1}px`,
                      opacity: 0.55 + size * 0.035,
                    }}
                    className="glass-chip inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 font-mono font-semibold text-primary"
                  >
                    <Hash className="size-3.5" /> {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-[min(100%-2rem,72rem)] pb-24 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="glass-strong relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-16"
          >
            <span className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-sky-300/30 blur-3xl dark:bg-cyan-400/15" />
            <Badge variant="outline" className="glass-chip rounded-full px-3 py-1 text-xs font-medium text-primary">
              <Zap className="size-3.5" /> {d.cta.badge}
            </Badge>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
              {d.cta.title.split("{highlight}")[0]}
              <span className="text-gradient-cool">{d.cta.title.split("{highlight}")[1]}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">{d.cta.text}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="cursor-pointer rounded-xl px-7">
                <Link to="/auth">
                  {d.cta.primary} <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="glass-chip cursor-pointer rounded-xl px-7 text-foreground"
              >
                <Link to="/auth">{d.cta.secondary}</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-panel border-x-0 border-b-0 rounded-none">
        <div className="mx-auto flex w-[min(100%-2rem,72rem)] flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <Logo />
          <p className="text-xs text-muted-foreground">{d.footer.builtOn}</p>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <Link to="/auth" className="transition-colors hover:text-foreground">
              {dict.common.signIn}
            </Link>
            <a
              href="https://t.me/BotFather"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {d.footer.botFather}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className="size-3.5"
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHeading({
  kicker,
  title,
  text,
  align = "center",
}: {
  kicker: string;
  title: string;
  text: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-start"
      }
    >
      <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">{kicker}</p>
      <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{text}</p>
    </motion.div>
  );
}
