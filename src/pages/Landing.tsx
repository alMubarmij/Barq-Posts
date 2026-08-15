import { BackgroundFX } from "@/components/BackgroundFX";
import { Logo } from "@/components/Logo";
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

const STEPS = [
  {
    icon: Send,
    title: "Message the bot",
    text: "Open the chat with your bot and send anything — a link worth keeping, a thought, a snippet, or a note to yourself.",
  },
  {
    icon: Tags,
    title: "It gets classified",
    text: "Links are bookmarked with their domain, your #hashtags are kept, and a title is derived automatically — del.icio.us style.",
  },
  {
    icon: Bookmark,
    title: "Browse the archive",
    text: "The post lands in your catalog instantly. Search it, filter it by tag, or open its detail page — whenever you need it.",
  },
];

const FEATURES = [
  {
    icon: Link2,
    title: "Link bookmarks",
    text: "Every URL you send becomes a clean bookmark with its domain and title — the way del.icio.us intended, without the public noise.",
  },
  {
    icon: Hash,
    title: "Tag classification",
    text: "Explicit #tags and automatic domain tags keep everything organized, diigo-style. Filter by any tag in one click.",
  },
  {
    icon: Zap,
    title: "Instant publishing",
    text: "No dashboards, no forms. A message in Telegram is a post in the archive before the confirmation reply arrives.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "The archive sits behind your sign-in. No public profile, no algorithm, no noise — just your own annotated internet.",
  },
  {
    icon: Search,
    title: "Search everything",
    text: "Full-text search across titles, notes, URLs and tags, so last week's link is three keystrokes away.",
  },
  {
    icon: PenLine,
    title: "Post from the web",
    text: "Not near your phone? Paste a URL or write a note directly in the app — it's tagged and archived just like a Telegram message.",
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

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
        <div className="glass-strong flex items-center justify-between rounded-2xl px-4 py-2.5 sm:px-5">
          <Link to="/" aria-label="Barq home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {[
              ["How it works", "#how"],
              ["Features", "#features"],
              ["Tags", "#tags"],
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
            {isAuthenticated ? (
              <Button asChild className="cursor-pointer rounded-xl" size="sm">
                <Link to="/dashboard">
                  Open archive <ArrowRight className="size-4" />
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
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild className="cursor-pointer rounded-xl" size="sm">
                  <Link to="/auth">
                    Get started <ArrowRight className="size-4" />
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
                  Telegram → your personal archive
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={1}
                className="mt-5 text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.4rem]"
              >
                Send it once.
                <br />
                <span className="text-gradient-cool">Find it forever.</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={2}
                className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
              >
                منشورات برقية turns Telegram into a personal archive. DM your bot
                a link, a note, or a snippet with #tags — it&apos;s published to
                your catalog instantly, classified, searchable, and yours alone.
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
                    Open your archive <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="glass-chip cursor-pointer rounded-xl px-6 text-foreground"
                >
                  <a href="#how">See how it works</a>
                </Button>
              </motion.div>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={4}
                className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground"
              >
                {["No dashboard to fill", "Free hosting ready", "Set up in 3 steps"].map(
                  (t) => (
                    <span key={t} className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-primary/70" />
                      {t}
                    </span>
                  ),
                )}
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
                className="glass-panel absolute -left-6 -top-10 z-10 w-56 rounded-2xl rounded-bl-md p-4 sm:-left-12"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white">
                    <Send className="size-3.5 -rotate-12" />
                  </span>
                  <p className="text-[11px] font-semibold text-foreground">
                    Barq bot <span className="font-normal text-muted-foreground">· now</span>
                  </p>
                </div>
                <p className="mt-2.5 text-xs leading-5 text-foreground/90">
                  Great read on Postgres internals{" "}
                  <span className="text-cyan-300">https://github.com/…</span>{" "}
                  <span className="font-semibold text-sky-300">#dev #db</span>
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
                    <span className="font-mono text-[11px]">github.com</span>
                  </span>
                  <Badge variant="secondary" className="glass-chip rounded-full text-[10px]">
                    Archived just now
                  </Badge>
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-foreground">
                  Great read on Postgres internals
                </p>
                <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                  https://github.com/neondatabase/…
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["dev", "db", "github", "reading"].map((tag) => (
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
                className="glass-panel absolute -bottom-6 right-0 z-30 flex items-center gap-2 rounded-2xl px-3.5 py-2.5"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-400/90 text-white">
                  <CheckIcon />
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  #db → 12 posts
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
          <SectionHeading
            kicker="How it works"
            title="One message. One post. Done."
            text="Three steps between something you found and something you'll find again."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glass-panel group relative overflow-hidden rounded-3xl p-6 transition-colors hover:border-white/20"
              >
                <span className="absolute right-5 top-4 font-mono text-4xl font-black text-primary/10">
                  0{i + 1}
                </span>
                <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/90 via-sky-500/90 to-blue-600/90 text-white transition-transform group-hover:scale-105">
                  <step.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto w-[min(100%-2rem,72rem)] py-16 sm:py-20">
          <SectionHeading
            kicker="Features"
            title="Bookmarking, done right"
            text="The classification power of del.icio.us and diigo, rebuilt for how you actually save things today — inside Telegram."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
                className="glass-panel rounded-3xl p-6 transition-colors hover:border-white/20"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-bold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {feature.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tags showcase */}
        <section id="tags" className="mx-auto w-[min(100%-2rem,72rem)] py-16 sm:py-20">
          <div className="glass-strong overflow-hidden rounded-[2rem] p-8 sm:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <SectionHeading
                  align="left"
                  kicker="Tag cloud"
                  title="Your archive, classified like the classics"
                  text="Every post keeps its #tags, and every link earns a domain tag automatically. The result is a living tag cloud that makes last quarter's research one click away."
                />
                <Button asChild className="mt-8 cursor-pointer rounded-xl">
                  <Link to="/auth">
                    Start archiving <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap content-center items-center justify-center gap-3">
                {[
                  ["dev", 14],
                  ["postgres", 9],
                  ["reading", 6],
                  ["ai", 11],
                  ["ideas", 5],
                  ["rust", 7],
                  ["ux", 4],
                  ["notes", 3],
                  ["cli", 8],
                ].map(([tag, size], i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      fontSize: `${10 + (size as number) * 1.1}px`,
                      opacity: 0.55 + (size as number) * 0.035,
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
            <span className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
            <Badge variant="outline" className="glass-chip rounded-full px-3 py-1 text-xs font-medium text-primary">
              <Zap className="size-3.5" /> Free forever tier
            </Badge>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Your next useful link is{" "}
              <span className="text-gradient-cool">one DM away</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              Create a bot in two minutes, drop the token in, and start
              publishing. Every message you send to yourself is a bookmark
              you&apos;ll actually find later.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="cursor-pointer rounded-xl px-7">
                <Link to="/auth">
                  Get started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="glass-chip cursor-pointer rounded-xl px-7 text-foreground"
              >
                <Link to="/auth">Sign in to your archive</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-panel border-x-0 border-b-0 rounded-none">
        <div className="mx-auto flex w-[min(100%-2rem,72rem)] flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <Logo />
          <p className="text-xs text-muted-foreground">
            منشورات برقية — built on Telegram, Convex &amp; free hosting · Vercel · Netlify · Cloudflare Pages
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <Link to="/auth" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
            <a
              href="https://t.me/BotFather"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              BotFather
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
      className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
      <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">{kicker}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{text}</p>
    </motion.div>
  );
}
