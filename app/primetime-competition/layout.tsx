import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import { FaChessBoard } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Primetime Chess Competition 2024",
  description: "Official registration portal for Primetime Competition 2026",
};

export default function PrimetimeCompetitionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/primetime-competition" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal">
                <FaChessBoard className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-heading text-xl font-bold text-brand-tealDark">
                  Primetime 
                </div>
                <div className="text-sm text-gray-600">Competition 2025</div>
              </div>
            </Link>

            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center text-gray-600 hover:text-brand-teal">
                <Home className="mr-2 h-5 w-5" />
                Home
              </Link>
              <Link href="/primetime-competition" className="text-gray-600 hover:text-brand-teal">
                Competition
              </Link>
              <Link
                href="/primetime-competition/registration"
                className="rounded-full bg-brand-maroon px-6 py-2 font-semibold text-white transition-colors hover:bg-brand-maroonDark"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="bg-brand-tealDark py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-teal">
              <FaChessBoard className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-4 font-heading text-2xl font-bold">Primetime Competition</h3>
            <p className="mx-auto mb-8 max-w-2xl text-gray-300">
              A premier primetime competition bringing together talented players from across the region.
              Fair play, balanced boards, and exceptional sportsmanship.
            </p>
            <div className="text-sm text-gray-400">
              <p>© 2024 Primetime Competition. All rights reserved.</p>
              {/* <p className="mt-2">Contact: info@primetimechess.com | +91 9876543210</p> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
