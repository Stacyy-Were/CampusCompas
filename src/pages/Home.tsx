import { motion } from "motion/react";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="relative h-screen min-h-screen w-full overflow-hidden bg-black">
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 1.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/redturtle004.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-black/30" />

      <Navbar />

      <div className="absolute bottom-8 left-8 z-10 md:bottom-12 md:left-12 lg:bottom-16 lg:left-16">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-mono text-4xl font-medium tracking-tight text-white md:text-6xl lg:text-8xl"
        >
          CAMPUS <br />COMPAS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1,
          }}
          className="mt-3 max-w-md font-mono text-xs text-white/70 md:text-sm"
        >
          Find the institution that fits you.
        </motion.p>
      </div>
    </main>
  );
}
