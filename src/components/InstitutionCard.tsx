import { useState } from "react";
import { motion } from "motion/react";
import { Institution } from "../lib/types";

export default function InstitutionCard({ institution }: { institution: Institution }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [
    institution.image_url || "/pix.png",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517486800575-0dd88c060810?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80",
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="group [perspective:1200px]"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <div className="relative h-[22rem] w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 [backface-visibility:hidden] [transform-style:preserve-3d]">
            <img src={images[0]} alt={institution.name} className="h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-300/80">
                {institution.type}
              </p>
              <h3 className="mt-3 font-mono text-2xl text-white">{institution.name}</h3>
              <p className="mt-2 font-mono text-xs text-white/70">
                {institution.location}, {institution.county}
              </p>
              <div className="mt-4">
                <span className="font-mono text-xs text-white/60">
                  KES {institution.fee_min.toLocaleString()} - {institution.fee_max.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-emerald-300/30 bg-[#07130f]/95 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] [transform-style:preserve-3d]">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-emerald-300/80">
                  School profile
                </p>
                <h3 className="mt-3 font-mono text-2xl text-white">{institution.name}</h3>
                <p className="mt-2 font-mono text-xs text-white/65">
                  {institution.type} · {institution.location}, {institution.county}
                </p>
                <p className="mt-3 font-mono text-xs text-white/70">
                  KES {institution.fee_min.toLocaleString()} – {institution.fee_max.toLocaleString()} / year
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {institution.facilities?.slice(0, 4).map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-white/15 bg-white/5 px-2 py-1 font-mono text-[10px] text-white/70"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {institution.description && (
                <p className="mt-4 line-clamp-4 font-mono text-[11px] leading-relaxed text-white/65">
                  {institution.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/15 bg-[#07130f] shadow-2xl shadow-black/40"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 font-mono text-lg text-white transition hover:bg-white hover:text-black"
              aria-label="Close details"
            >
              ×
            </button>

            <div className="grid md:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[18rem] border-b border-white/10 md:border-b-0 md:border-r">
                <img src={images[activeIndex]} alt={institution.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07130f] via-[#07130f]/20 to-transparent" />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 font-mono text-lg text-white hover:bg-white hover:text-black"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 font-mono text-lg text-white hover:bg-white hover:text-black"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={`${institution.id}-${idx}`}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2.5 rounded-full transition ${
                        idx === activeIndex ? "w-8 bg-white" : "w-2.5 bg-white/45"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-300/80">
                  {institution.type}
                </p>
                <h3 className="mt-3 font-mono text-3xl text-white md:text-4xl">{institution.name}</h3>
                <p className="mt-3 font-mono text-sm text-white/70">
                  {institution.location}, {institution.county}
                </p>

                <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300/80">
                    Tuition
                  </p>
                  <p className="mt-2 font-mono text-lg text-white">
                    KES {institution.fee_min.toLocaleString()} – {institution.fee_max.toLocaleString()} / year
                  </p>
                </div>

                <div className="mt-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
                    Facilities
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {institution.facilities?.map((facility) => (
                      <span
                        key={facility}
                        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-white/70"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>

                {institution.description && (
                  <div className="mt-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
                      About
                    </p>
                    <p className="mt-3 font-mono text-sm leading-7 text-white/75">
                      {institution.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
