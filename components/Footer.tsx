import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiTwitter, FiPhone } from "react-icons/fi";

const SiteFooter = () => {
  return (
    <footer id="footer" className="">
      <div className="bg-brand-tealDark text-white">
        <div className="container-padding py-12">
          <div className="grid md:grid-cols-4 gap-10 items-start">
            <div className="w-[150px] h-auto relative">
              <Image
                src="https://ik.imagekit.io/pratik2002/LOGICOLOGY%20NEW%20LOGO%20WHITE%20COLOR%20VERSION%20VARIATION%202.png?updatedAt=1757216583562"
                alt="Logicology Logo"
                width={150}
                height={60} // Adjust height based on your logo's aspect ratio
                className="object-contain"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
              <div>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/" className="hover:underline">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:underline">
                      Shop
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
                <div className="flex items-center gap-3 mt-3 text-lg">
                  <Link
                    aria-label="Instagram"
                    href="#"
                    className="bg-white/10 rounded-full p-2"
                  >
                    <FiInstagram />
                  </Link>
                  <Link
                    aria-label="Facebook"
                    href="#"
                    className="bg-white/10 rounded-full p-2"
                  >
                    <FiFacebook />
                  </Link>
                  <Link
                    aria-label="Twitter"
                    href="#"
                    className="bg-white/10 rounded-full p-2"
                  >
                    <FiTwitter />
                  </Link>
                  <Link
                    aria-label="Phone"
                    href="#"
                    className="bg-white/10 rounded-full p-2"
                  >
                    <FiPhone />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-100 text-slate-600 text-center text-sm py-4">
        Copyright © by Logicology.com 2025. All rights reserved.
      </div>
    </footer>
  );
};

export default SiteFooter;
