import { motion } from "motion/react";
import Navbar from "../components/Navbar";

const socialLinks = [
  { name: "GitHub", handle: "code & experiments", href: "https://github.com/Stacyy-were" },
  { name: "LinkedIn", handle: "professional notes", href: "https://www.linkedin.com/stacy-were" },
  { name: "TikTok", handle: "short-form ideas", href: "https://www.tiktok.com/gojossattorru" },
  { name: "Discord", handle: "join the conversation", href: "https://discord.com/000.idx" },
  { name: "Instagram", handle: "visual diary", href: "https://www.instagram.com/Stacy_.Were" },
  { name: "WhatsApp", handle: "say hello", href: "https://wa.me/+254115018697" },
];

export default function AboutUs() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07130f] px-6 py-24 text-white md:px-12 lg:px-20">
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: "url('/kazetachinu050.jpg')" }}
      />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(120deg,rgba(3,12,9,0.92),rgba(3,12,9,0.46),rgba(3,12,9,0.84))]" />

      <Navbar/>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid items-end gap-10 pt-10 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-emerald-300/80">
              About Us
            </p>
            <h1 className="max-w-4xl font-mono text-4xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-8xl">
              Curious mind.
              <br />
              Useful things.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
              I built this digital experience to make complicated
              choices feel a little more human: a practical tool for finding the right place to learn.
            </p>
          </div>

          <motion.div
            animate={{ y: [0, -12, 0], rotate: [2, 3.5, 2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto w-full max-w-sm rotate-2 rounded-[2rem] border border-white/30 bg-white/10 p-3 shadow-2xl backdrop-blur-md"
          >
            <div className="overflow-hidden rounded-[1.5rem]">
              <img
                src="/pix.png"
                alt="Portrait placeholder"
                className="aspect-[4/5] w-full object-cover grayscale-[20%] transition duration-700 hover:scale-105 hover:grayscale-0"
              />
            </div>
            <div className="flex items-center justify-between px-2 pb-1 pt-4 font-mono text-xs text-white/70">
              <span>currently learning...</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-28 grid gap-10 border-y border-white/20 py-12 lg:grid-cols-[0.7fr_1.3fr]"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-300/80">A little more</p>
            <h2 className="mt-4 font-mono text-3xl md:text-4xl">More projects.</h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-white/70 md:text-lg">
            {/* Replace ASAP - Placeholder*/}
            This is where I will share more about myself, what I have learned,
            and the kind of work I want to make next. For now, think of this as
            an open page: a small introduction before the bigger story arrives.
          </p>
        </motion.div>

        <section className="mt-24">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-300/80">Selected work</p>
              <h2 className="mt-3 font-mono text-3xl md:text-5xl">Things I'm working on.</h2>
            </div>
            <span className="hidden font-mono text-xs text-white/50 sm:block">scroll to explore / 01</span>
          </div>

          <motion.a
            href="https://stacy-weres-portfolio.vercel.app/"
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            className="group relative block overflow-hidden rounded-[2rem] border border-white/20 bg-black/35 p-3 backdrop-blur-sm"
          >
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <img
                src="/portfolio.png"
                alt="Nature scene representing Campus Compass"
                className="h-72 w-full object-cover transition duration-700 group-hover:scale-105 md:h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-5 p-6 md:flex-row md:items-end md:justify-between md:p-10">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-300"></p>
                  <h4 className="mt-2 font-mono text-3xl md:text-5xl">My Portfolio</h4>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-xl transition group-hover:rotate-45 group-hover:bg-white group-hover:text-black">-&gt;</span>
              </div>
            </div>
          </motion.a>

          {/* Future project section 02: add the next project card here. */}
          {/* Future project section 03: add another project card here. */}
        </section>

        <section className="mt-28 pb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-300/80">Find me around the internet</p>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="group rounded-2xl border border-white/20 bg-black/30 p-4 backdrop-blur-md transition-colors hover:border-emerald-300/70 hover:bg-emerald-300/10"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 font-mono text-xs transition group-hover:border-emerald-300 group-hover:bg-emerald-300 group-hover:text-black">
                  {social.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="mt-8 block font-mono text-sm">{social.name}</span>
                <span className="mt-1 block text-xs text-white/45">{social.handle}</span>
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
