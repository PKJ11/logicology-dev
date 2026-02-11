'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Palette, ArrowRight, Route, CheckSquare, type LucideIcon } from 'lucide-react';

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
    name: 'Colour Crawl',
    icon: Palette,
    path: '/logicoland/volume-5/section/1',
    description: 'Follow color codes to find your way',
  },
  {
    id: 2,
    name: 'Arrows Address',
    icon: ArrowRight,
    path: '/logicoland/volume-5/section/2',
    description: 'Navigate numbered grids with arrows',
  },
  {
    id: 3,
    name: 'Right Route',
    icon: Route,
    path: '/logicoland/volume-5/section/3',
    description: 'Choose the correct path',
  },
  {
    id: 4,
    name: 'Knowing Knight',
    icon: CheckSquare,
    path: '/logicoland/volume-5/section/4',
    description: 'Master knight moves',
  },
];

interface SectionTabsProps {
  currentSection: number;
}

export default function SectionTabs({ currentSection }: SectionTabsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
      {sections.map((section) => {
        const isActive = section.id === currentSection;
        const Icon = section.icon;

        return (
          <motion.div key={section.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={section.path}
              className={`block rounded-2xl p-5 shadow-lg transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white transform -translate-y-1'
                  : 'bg-white hover:bg-orange-50 text-gray-800'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-2 rounded-xl ${
                    isActive ? 'bg-white/20' : 'bg-orange-100'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-orange-500'}`} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">Section {section.id}</span>
                    {isActive && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="text-sm bg-white/30 px-2 py-0.5 rounded-full"
                      >
                        Active
                      </motion.div>
                    )}
                  </div>

                  <h3 className={`font-black text-xl ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {section.name}
                  </h3>
                </div>
              </div>

              <p className={`text-sm ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
                {section.description}
              </p>

              {isActive && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                  className="h-1 bg-white/50 rounded-full mt-3"
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
