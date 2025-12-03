import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {  Home } from 'lucide-react';
import { FaChessBoard } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Primetime Chess Competition 2024',
  description: 'Official registration portal for Primetime Chess Competition 2024',
};

export default function PrimetimeCompetitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/primetime-competition" 
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-brand-teal rounded-xl flex items-center justify-center">
                <FaChessBoard className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-brand-tealDark">
                  Primetime Chess
                </div>
                <div className="text-sm text-gray-600">Competition 2024</div>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-brand-teal"
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Link>
              <Link
                href="/primetime-competition"
                className="text-gray-600 hover:text-brand-teal"
              >
                Competition
              </Link>
              <Link
                href="/primetime-competition/registration"
                className="bg-brand-maroon text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-maroonDark transition-colors"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {children}
      
      {/* Footer */}
      <footer className="bg-brand-tealDark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-teal rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaChessBoard className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold font-heading mb-4">
              Primetime Chess Competition
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              A premier chess competition bringing together talented players from across the region.
              Fair play, balanced boards, and exceptional sportsmanship.
            </p>
            <div className="text-gray-400 text-sm">
              <p>© 2024 Primetime Chess Competition. All rights reserved.</p>
              <p className="mt-2">Contact: info@primetimechess.com | +91 9876543210</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}