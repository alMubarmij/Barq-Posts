import { BackgroundFX } from "@/components/BackgroundFX";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex min-h-screen flex-col"
    >
      <BackgroundFX />
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <Link to="/" aria-label="Barq home">
          <Logo />
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="glass-strong mt-8 w-full max-w-md rounded-3xl p-10 text-center"
        >
          <p className="text-6xl font-black tracking-tight text-gradient-cool">404</p>
          <h1 className="mt-3 text-xl font-bold tracking-tight">Page not found</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This link didn&apos;t land in your archive. Head back to the catalog.
          </p>
          <Button asChild className="mt-6 cursor-pointer rounded-xl">
            <Link to="/dashboard">
              Back to the archive <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
