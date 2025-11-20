import MediaLayout from "@/components/MediaLayout"; // Ensure this import path is correct
import NavBar from "./NavBar";
import SiteFooter from "./Footer";

function ContactUs() {
  return (
    <>
      <NavBar />
      <section className="w-full bg-[#642B3B]">
        {/* Deep maroon background */}
        <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Left: text & contact details */}
            <div className="text-white">
              <h2 className="headingstyle mb-10 font-extrabold">Contact Us</h2>

              <ul className="space-y-8">
                {/* Phone */}
                <li className="flex items-center gap-5">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M3 5a2 2 0 012-2h1.2a1 1 0 01.95.684l1.2 3.272a1 1 0 01-.27 1.07L7.9 9.93a14.5 14.5 0 006.17 6.17l1.905-1.18a1 1 0 011.07-.27l3.272 1.2A1 1 0 0121 17.8V19a2 2 0 01-2 2h-.5C9.492 21 3 14.508 3 6.5V6a2 2 0 010-1z"
                      />
                    </svg>
                  </span>
                  <p className="text-xl font-semibold leading-tight">+91 8446980747</p>
                </li>

                {/* Email */}
                <li className="flex items-center gap-5">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <p className="text-xl font-semibold leading-tight">learn@logicology.in</p>
                </li>

                {/* Address */}
                <li className="flex items-start gap-5">
                  <span className="mt-1 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M12 11a3 3 0 100-6 3 3 0 000 6zm0 0c4.418 0 8 3.134 8 7a1 1 0 01-1 1H5a1 1 0 01-1-1c0-3.866 3.582-7 8-7z"
                      />
                    </svg>
                  </span>
                  <p className="text-xl font-semibold leading-snug">
                    Regd Office: Ameya Towers, 25,
                    <br />
                    Humpyard Road, Dhantoli,
                    <br />
                    Nagpur, India - 440012
                  </p>
                </li>
              </ul>

              <p className="mt-10 max-w-xl text-sm text-white/85">
                Please note that we operate in a fully online mode. The registered office address is
                only for official communication.
              </p>
            </div>

            {/* Right: framed image */}
            <div className="flex items-center justify-center">
              <MediaLayout
                image="https://ik.imagekit.io/pratik11/CONTACT-US-IMAGE.png?updatedAt=1758544204579"
                videoSrc=""
              />
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

export default ContactUs;
