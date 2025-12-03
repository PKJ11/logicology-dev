import React from 'react';
import Link from 'next/link';
import { CalendarDays, Trophy, Users, Award } from 'lucide-react';

export default function PrimetimeCompetitionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-brand-hero py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-brand-teal/10 text-brand-tealDark rounded-full mb-6">
              <Trophy className="w-5 h-5 mr-2" />
              <span className="font-semibold">Official Competition</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-heading text-brand-tealDark mb-6">
              Primetime Chess<br />Competition 2024
            </h1>
            
            <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
              Join the most prestigious chess competition in the region. 
              Open to both school and non-school participants. 
              Show your skills and win amazing prizes!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/primetime-competition/registration"
                className="bg-brand-maroon text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-maroonDark transition-all shadow-brand hover:shadow-xl transform hover:-translate-y-1"
              >
                Register Now
              </Link>
              
              <Link
                href="#details"
                className="bg-white text-brand-tealDark border-2 border-brand-teal px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-teal/5 transition-all"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div id="details" className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-4xl p-8 shadow-soft">
            <div className="w-14 h-14 bg-brand-teal/10 rounded-2xl flex items-center justify-center mb-6">
              <CalendarDays className="w-7 h-7 text-brand-teal" />
            </div>
            <h3 className="text-2xl font-bold text-brand-tealDark mb-4">Schedule</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-brand-coral rounded-full mr-3"></div>
                <span className="font-semibold">Saturday:</span>
                <span className="ml-2">11:30 AM - 1:30 PM</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                <span className="font-semibold">Sunday:</span>
                <span className="ml-2">2:30 PM - 4:30 PM</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-4xl p-8 shadow-soft">
            <div className="w-14 h-14 bg-brand-coral/10 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-brand-coral" />
            </div>
            <h3 className="text-2xl font-bold text-brand-tealDark mb-4">Participation</h3>
            <div className="space-y-4">
              <div className="p-4 bg-brand-grayBg rounded-xl">
                <h4 className="font-bold text-brand-teal mb-2">School Students</h4>
                <p className="text-sm text-gray-600">Free registration with valid school ID</p>
              </div>
              <div className="p-4 bg-brand-grayBg rounded-xl">
                <h4 className="font-bold text-brand-coral mb-2">Non-School</h4>
                <p className="text-sm text-gray-600">₹100 registration fee</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-4xl p-8 shadow-soft">
            <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6">
              <Award className="w-7 h-7 text-brand-gold" />
            </div>
            <h3 className="text-2xl font-bold text-brand-tealDark mb-4">Rules & Prizes</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-brand-gold font-bold mr-2">•</span>
                Only players allowed - Parents not permitted
              </li>
              <li className="flex items-start">
                <span className="text-brand-gold font-bold mr-2">•</span>
                School students must carry ID card
              </li>
              <li className="flex items-start">
                <span className="text-brand-gold font-bold mr-2">•</span>
                6 chess boards with balanced allocation
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-brand-teal to-brand-tealDark rounded-4xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold font-heading mb-6">Ready to Compete?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Secure your spot in the competition. Limited slots available across 6 boards.
          </p>
          <Link
            href="/primetime-competition/registration"
            className="inline-flex items-center bg-white text-brand-tealDark px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Register Now
            <Trophy className="ml-3 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}