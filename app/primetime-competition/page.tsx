import React from "react";
import Link from "next/link";
import { CalendarDays, Trophy, Users, Award } from "lucide-react";

export default function PrimetimeCompetitionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-brand-hero py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-brand-teal/10 px-4 py-2 text-brand-tealDark">
              <Trophy className="mr-2 h-5 w-5" />
              <span className="font-semibold">Official Competition</span>
            </div>

            <h1 className="mb-6 font-heading text-5xl font-bold text-brand-tealDark md:text-7xl">
              Primetime
              <br />
              Competition 2025
            </h1>

            <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-700">
              Join the most prestigious competition in the region. Open to both school and
              non-school participants. Show your skills and win amazing prizes!
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/primetime-competition/registration"
                className="transform rounded-full bg-brand-maroon px-8 py-4 text-lg font-semibold text-white shadow-brand transition-all hover:-translate-y-1 hover:bg-brand-maroonDark hover:shadow-xl"
              >
                Register Now
              </Link>

              <Link
                href="#details"
                className="rounded-full border-2 border-brand-teal bg-white px-8 py-4 text-lg font-semibold text-brand-tealDark transition-all hover:bg-brand-teal/5"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div id="details" className="container mx-auto px-4 py-16">
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-4xl bg-white p-8 shadow-soft">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-teal/10">
              <CalendarDays className="h-7 w-7 text-brand-teal" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-brand-tealDark">Schedule</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="mr-3 h-2 w-2 rounded-full bg-brand-coral"></div>
                <span className="font-semibold">Saturday:</span>
                <span className="ml-2">11:30 AM - 1:30 PM</span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 h-2 w-2 rounded-full bg-brand-gold"></div>
                <span className="font-semibold">Sunday:</span>
                <span className="ml-2">2:30 PM - 4:30 PM</span>
              </li>
            </ul>
          </div>

          <div className="rounded-4xl bg-white p-8 shadow-soft">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-coral/10">
              <Users className="h-7 w-7 text-brand-coral" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-brand-tealDark">Participation</h3>
            <div className="space-y-4">
              <div className="rounded-xl bg-brand-grayBg p-4">
                <h4 className="mb-2 font-bold text-brand-teal">School Students</h4>
                <p className="text-sm text-gray-600">Free registration with valid school ID</p>
              </div>
              <div className="rounded-xl bg-brand-grayBg p-4">
                <h4 className="mb-2 font-bold text-brand-coral">Non-School</h4>
                <p className="text-sm text-gray-600">₹100 registration fee</p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl bg-white p-8 shadow-soft">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/10">
              <Award className="h-7 w-7 text-brand-gold" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-brand-tealDark">Rules & Prizes</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2 font-bold text-brand-gold">•</span>
                Only players allowed - Parents not permitted
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-brand-gold">•</span>
                School students must carry ID card
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-4xl bg-gradient-to-r from-brand-teal to-brand-tealDark p-12 text-center text-white">
          <h2 className="mb-6 font-heading text-4xl font-bold">Ready to Compete?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Secure your spot in the competition. Limited slots available across 6 boards.
          </p>
          <Link
            href="/primetime-competition/registration"
            className="inline-flex transform items-center rounded-full bg-white px-10 py-4 text-lg font-bold text-brand-tealDark shadow-lg transition-all hover:-translate-y-1 hover:bg-gray-100 hover:shadow-xl"
          >
            Register Now
            <Trophy className="ml-3 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
