"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Users, Sparkles, Quote } from "lucide-react";
import React from "react";

// ------------------------------------------------------
// Data (paste/replace with your actual data source if needed)
// ------------------------------------------------------
const teamMembers = [
  {
    name: "Kartik Vyas",
    role: "Co-Founder",
    image:
      "https://ik.imagekit.io/pratik2002/kartik.jpg?updatedAt=1758090824010",
    bio: "Driving product strategy at Logicology with a focus on playful learning and measurable outcomes.",
  },
  {
    name: "Gayatri Phadnis",
    role: "Co-Founder",
    image: "https://ik.imagekit.io/pratik2002/team-gayatri.jpg",
    bio: "Leads curriculum and pedagogy. Ensures our content nurtures conceptual understanding and curiosity.",
  },
  {
    name: "Jasneet Singh",
    role: "Head of Design",
    image: "https://ik.imagekit.io/pratik2002/team-jasneet.jpg",
    bio: "Crafts the visual language of Logicology across games, books, and digital experiences.",
  },
  {
    name: "Pratik Kumar Jha",
    role: "Head of Technology",
    image: "https://ik.imagekit.io/pratik2002/team-pratik.jpg",
    bio: "Builds robust platforms and tools that power our learning ecosystem end‑to‑end.",
  },
  {
    name: "Simran Kaur",
    role: "Designer",
    image: "https://ik.imagekit.io/pratik2002/team-simran.jpg",
    bio: "Designs delightful interfaces and playful illustrations that make learning feel effortless.",
  },
  {
    name: "Gauri Bhopale",
    role: "Designer",
    image: "https://ik.imagekit.io/pratik2002/team-gauri.jpg",
    bio: "Explores color, form, and motion to communicate complex ideas simply and beautifully.",
  },
];

// ------------------------------------------------------
// Motion helpers
// ------------------------------------------------------
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

// ------------------------------------------------------
// Component
// ------------------------------------------------------
export default function TeamPage() {
  return (
    <main className="min-h-screen bg-brand-hero">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-brand-teal/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[26rem] w-[26rem] rounded-full bg-brand-coral/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={stagger}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              variants={fadeUp}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-white shadow-soft px-4 py-2"
            >
              <Users className="h-4 w-4 text-brand-teal" />
              <span className="text-sm font-medium text-brand-teal">
                Meet the Team
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight text-brand-tealDark"
            >
              The People Behind Logicology
            </motion.h1>
            <motion.p className="mt-4 max-w-2xl text-base sm:text-lg text-neutral-600">
              Builders, educators, and designers united by a simple belief:
              learning should feel like play.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Team listing – left image / right text */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="space-y-14 md:space-y-20">
            {teamMembers.map((m, idx) => (
              <motion.article
                key={m.name}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="rounded-4xl bg-white/70 backdrop-blur-sm shadow-soft ring-1 ring-black/5"
              >
                <div className="grid md:grid-cols-2 gap-0 md:gap-6 lg:gap-10">
                  {/* Image left */}
                  <div className="relative order-1 md:order-1">
                    <div className="group relative h-80 sm:h-96 md:h-full">
                      {/* Framed image card */}
                      <div className="absolute inset-4 rounded-4xl bg-gradient-to-br from-white to-white/70 shadow-soft" />
                      <motion.div
                        whileHover={{ scale: 1.015 }}
                        className="absolute inset-0 overflow-hidden rounded-4xl"
                      >
                        <Image
                          src={m.image}
                          alt={m.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover object-center"
                          priority={idx < 2}
                        />
                        {/* Subtle overlay for readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                      </motion.div>
                      {/* Glow */}
                      <div className="pointer-events-none absolute -inset-1 rounded-4xl bg-gradient-to-br from-brand-teal/0 via-brand-teal/10 to-brand-coral/10 blur-xl opacity-60" />
                    </div>
                  </div>

                  {/* Text right */}
                  <div className="relative order-2 px-6 sm:px-8 md:px-6 lg:px-10 py-8 md:py-10 flex items-center">
                    <div className="w-full">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="inline-flex items-center gap-2 rounded-full bg-brand-teal/10 text-brand-teal px-3 py-1 text-xs font-medium"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> Spotlight
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mt-4 font-heading text-2xl sm:text-3xl text-brand-tealDark"
                      >
                        {m.name}
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="mt-1 text-brand-coral font-medium"
                      >
                        {m.role}
                      </motion.p>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-4 text-neutral-700 leading-relaxed"
                      >
                        {m.bio}
                      </motion.p>

                      {/* Quote stripe */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="mt-6 flex items-center gap-3 rounded-4xl bg-brand-grayBg p-4 ring-1 ring-black/5"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
                          <Quote className="h-5 w-5 text-brand-gold" />
                        </div>
                        <p className="text-sm text-neutral-700">
                          "Great design is where curiosity meets clarity."
                        </p>
                      </motion.div>

                      {/* CTA row */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-6 flex flex-wrap items-center gap-3"
                      >
                        <a
                          href="#"
                          className="inline-flex items-center justify-center rounded-2xl bg-brand-teal px-5 py-2.5 text-white shadow-brand transition-transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Connect
                        </a>
                        <a
                          href="#"
                          className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-2.5 text-brand-teal ring-1 ring-brand-teal/20 shadow-soft hover:bg-brand-grayBg"
                        >
                          Portfolio
                        </a>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom mosaic (subtle motion on hover) */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl sm:text-3xl text-brand-tealDark"
          >
            We build with heart and craft
          </motion.h2>
          <p className="mt-2 text-neutral-600 max-w-2xl">
            A quick peek at our people—curious minds, playful thinkers, and
            meticulous makers.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {teamMembers.map((m, i) => (
              <div
                key={m.name}
                className="group relative aspect-square overflow-hidden rounded-3xl ring-1 ring-black/5"
              >
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute bottom-2 left-2 right-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-xl bg-white/95 px-3 py-1.5 text-xs font-medium text-brand-teal shadow-soft">
                    {m.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
