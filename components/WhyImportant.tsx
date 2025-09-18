import Link from "next/link";
import MediaLayout from "./MediaLayout";
import CTAButton from "./CTAButton";

export default function WhyImportant() {
  return (
    <section id="why" className="mt-10 w-full bg-[#D8AE4F]">
      <div className="mx-auto lg:max-w-[80vw]">
        <div className="overflow-hidden py-12 text-[#3F2F14]">
          {/* Flex container replacing grid */}
          <div className="flex flex-col items-center md:flex-row">
            {/* MediaLayout on left for larger screens, top for mobile */}
            <div className="order-1 flex w-full items-center justify-center py-6 md:order-1 md:w-1/2 md:py-0">
              <MediaLayout
                image="https://ik.imagekit.io/pratik11/FOLD-1.1-IMAGE.png?updatedAt=1757749236600"
                videoSrc=""
              />
            </div>

            {/* Content on right for larger screens, bottom for mobile */}
            <div className="order-2 w-full p-8 sm:p-12 md:order-2 md:w-1/2">
              <p className="headingstyle font-heading text-[#3F2F14]">Why Logicology?</p>
              {/* <h2 className="heading-lg text-[#3F2F14]"></h2> */}
              <p className="textstyles mt-4 max-w-xl font-sans">
                Children learn the best when they are engaged. Our thoroughly researched and tested
                content is crafted to engage children. Gamification helps children learn in a fun
                way. At Logicology we want to make learning fun and engaging - that's why we exist.
              </p>
              <div className="mt-6">
                <CTAButton
                  text="Learn more"
                  href="#offerings"
                  bg="#FFFFFF"
                  color="#7E5C2E"
                  hoverBg="#7E5C2E"
                  hoverColor="#FFFFFF" // white text on hover
                  size="md"
                  rightIcon={
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
