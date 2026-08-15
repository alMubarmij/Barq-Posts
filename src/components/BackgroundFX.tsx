import { motion } from "framer-motion";

/** Soft, slowly drifting cool light blobs behind the dark glass surfaces. */
export function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute -top-32 right-[8%] h-[26rem] w-[26rem] rounded-full bg-cyan-500/[0.13] blur-3xl"
        animate={{ y: [0, 24, 0], x: [0, -14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[32%] -left-40 h-[30rem] w-[30rem] rounded-full bg-blue-600/[0.12] blur-3xl"
        animate={{ y: [0, -26, 0], x: [0, 18, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-8rem] left-[32%] h-[24rem] w-[24rem] rounded-full bg-indigo-500/[0.1] blur-3xl"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
