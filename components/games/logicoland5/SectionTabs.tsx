"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Palette, ArrowRight, Route, CheckSquare, type LucideIcon } from "lucide-react";

interface SectionTab {
  id: number;
  name: string;
  icon: LucideIcon; // ✅ store the component type
  path: string;
  description: string;
}

const sections: SectionTab[] = [
  {
    id: 1,
    name: "Colour Crawl",
    icon: Palette,
    path: "/logicoland/volume-5/section/1",
    description: "Follow color codes to find your way",
  },
  {
    id: 2,
    name: "Arrows Address",
    icon: ArrowRight,
    path: "/logicoland/volume-5/section/2",
    description: "Navigate numbered grids with arrows",
  },
  {
    id: 3,
    name: "Right Route",
    icon: Route,
    path: "/logicoland/volume-5/section/3",
    description: "Choose the correct path",
  },
  {
    id: 4,
    name: "Knowing Knight",
    icon: CheckSquare,
    path: "/logicoland/volume-5/section/4",
    description: "Master knight moves",
  },
];

interface SectionTabsProps {
  currentSection: number;
}

export default function SectionTabs({ currentSection }: SectionTabsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sections.map((section) => {
        const isActive = section.id === currentSection;
        const Icon = section.icon;

        return (
          <motion.div key={section.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={section.path}
              className={`block rounded-2xl p-5 shadow-lg transition-all duration-300 ${
                isActive
                  ? "-translate-y-1 transform bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                  : "bg-white text-gray-800 hover:bg-orange-50"
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className={`rounded-xl p-2 ${isActive ? "bg-white/20" : "bg-orange-100"}`}>
                  <Icon className={`h-6 w-6 ${isActive ? "text-white" : "text-orange-500"}`} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">Section {section.id}</span>
                    {isActive && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="rounded-full bg-white/30 px-2 py-0.5 text-sm"
                      >
                        Active
                      </motion.div>
                    )}
                  </div>

                  <h3 className={`text-xl font-black ${isActive ? "text-white" : "text-gray-900"}`}>
                    {section.name}
                  </h3>
                </div>
              </div>

              <p className={`text-sm ${isActive ? "text-white/90" : "text-gray-600"}`}>
                {section.description}
              </p>

              {isActive && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                  className="mt-3 h-1 rounded-full bg-white/50"
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
