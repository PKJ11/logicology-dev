import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiTwitter, FiPhone } from "react-icons/fi";

const SiteFooter = () => {
  return (
    <footer id="footer" className="">
      <div className="bg-brand-tealDark text-white">
        <div className="container-padding py-12">
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
                  <li>
                    <Link href="/" className="hover:underline">
                      Collections
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/" className="hover:underline">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:underline">
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
                    href="#"
                    className="rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                  >
                    <FiInstagram />
                  </Link>
                  <Link
                    aria-label="Facebook"
                    href="#"
                    className="rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                  >
                    <FiFacebook />
                  </Link>
                  <Link
                    aria-label="Twitter"
                    href="#"
                    className="rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                  >
                    <FiTwitter />
                  </Link>
                  <Link
                    aria-label="Phone"
                    href="#"
                    className="rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                  >
                    <FiPhone />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-100 py-4 text-center text-sm text-slate-600">
        Copyright © by Logicology.com 2025. All rights reserved.
      </div>
    </footer>
  );
};

export default SiteFooter;
