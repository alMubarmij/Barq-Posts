import { BackgroundFX } from "@/components/BackgroundFX";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/components/Settings";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  const { dict } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex min-h-screen flex-col"
    >
      <BackgroundFX />
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <Link to="/" aria-label={dict.brand.home}>
          <Logo />
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="glass-strong mt-8 w-full max-w-md rounded-3xl p-10 text-center"
        >
          <p className="text-6xl font-black text-gradient-cool">404</p>
          <h1 className="mt-3 text-xl font-bold">{dict.notFound.title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {dict.notFound.text}
          </p>
          <Button asChild className="mt-6 cursor-pointer rounded-xl">
            <Link to="/dashboard">
              {dict.notFound.back} <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
