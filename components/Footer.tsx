"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiTwitter, FiPhone, FiLinkedin, FiYoutube } from "react-icons/fi";
import ContactUs from "./ContactUs";

const SiteFooter = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  return (
    <>
      <footer id="footer">
        <div className="bg-brand-tealDark text-white">
          <div className="mx-auto max-w-[74vw] px-4 py-12 sm:px-6">
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
                      <Link href="/shipping" className="hover:underline">
                        Shipping Policy
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
                      <Link href="/about" className="hover:underline">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact-us" className="hover:underline">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold">Follow us</p>
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
                      <FiLinkedin />
                    </Link>
                    <Link
                      aria-label="Youtube"
                      href="https://www.youtube.com/c/logicology/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                    >
                      <FiYoutube />
                    </Link>
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
          <div className="relative h-[75vh] max-h-[80vh] w-[60vw] max-w-[60vw] overflow-hidden rounded-xl bg-white">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-md hover:text-gray-700"
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
          <div className="relative flex h-[40vh] w-[60vw] max-w-[60vw] flex-col items-center justify-center overflow-hidden rounded-xl bg-white px-6 text-center text-black">
            <button
              onClick={() => setIsPhoneModalOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-md hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="mb-2 text-2xl font-bold">Call Us</h2>
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
