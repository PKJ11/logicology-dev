"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiTwitter, FiPhone } from "react-icons/fi";
import ContactUs from "./ContactUs";

const SiteFooter = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  return (
    <>
      <footer id="footer">
        <div className="bg-brand-tealDark text-white">
          <div className="max-w-[74vw] mx-auto px-4 sm:px-6 py-12">
            <div className="grid items-start gap-10 md:grid-cols-4">
              <div className="relative h-auto w-[200px]">
                <Image
                  src="https://ik.imagekit.io/pratik2002/LOGICOLOGY%20NEW%20LOGO%20WHITE%20COLOR%20VERSION%20VARIATION%201.png?updatedAt=1757316882239"
                  alt="Logicology Logo"
                  width={250}
                  height={160}
                  className="object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
                <div>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link href="/about" className="hover:underline">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy-policy" className="hover:underline">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/cancellation-refund-policy" className="hover:underline">
                        Refund Policy
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link href="/shipping" className="hover:underline">
                        Shipping Policy
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="hover:underline cursor-pointer bg-transparent text-white"
                      >
                        Contact Us
                      </button>
                    </li>
                    <li>
                      <Link href="/about" className="hover:underline">
                        Our Philosophy
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold">Follow us or contact</p>
                  <div className="mt-3 flex items-center gap-3 text-lg">
                    <Link
                      aria-label="Instagram"
                      href="https://www.instagram.com/logicology_/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                    >
                      <FiInstagram />
                    </Link>
                    <Link
                      aria-label="Facebook"
                      href="https://www.facebook.com/Logicology"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                    >
                      <FiFacebook />
                    </Link>
                    <Link
                      aria-label="LinkedIn"
                      href="https://www.linkedin.com/company/11215891/admin/dashboard/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                    >
                      <FiTwitter />
                    </Link>
                    <span
                      onClick={() => setIsPhoneModalOpen(true)}
                      className="cursor-pointer rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                    >
                      <FiPhone />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 py-4 text-center text-sm text-slate-600">
          Copyright © by Logicology 2025. All rights reserved.
        </div>
      </footer>

      {/* Contact Us Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="bg-white rounded-xl relative w-[60vw] h-[75vh] max-w-[60vw] max-h-[80vh] overflow-hidden"
          >
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
            >
              &times;
            </button>
            <div className="h-full overflow-y-auto">
              <ContactUs />
            </div>
          </div>
        </div>
      )}

      {/* Phone Only Modal */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="bg-white rounded-xl relative w-[60vw] h-[40vh] max-w-[60vw] overflow-hidden flex flex-col items-center justify-center text-center text-black px-6"
          >
            <button
              onClick={() => setIsPhoneModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">Call Us</h2>
            <p className="text-xl font-semibold">
              <a href="tel:+918446980747" className="text-brand-teal hover:underline">
                +91 8446980747
              </a>
            </p>
            <p className="mt-4 text-sm text-gray-600">We’re happy to assist you.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SiteFooter;
