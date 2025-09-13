import Link from "next/link";
import MediaLayout from "./MediaLayout";
import CTAButton from "./CTAButton";

export default function WhyImportant() {
  return (
    <section id="why" className="w-full bg-[#D8AE4F] mt-10">
      <div className="lg:max-w-[80vw] mx-auto">
        <div className="text-[#3F2F14] overflow-hidden py-12">
          {/* Flex container replacing grid */}
          <div className="flex flex-col md:flex-row items-center">
            {/* MediaLayout on left for larger screens, top for mobile */}
            <div className="w-full md:w-1/2 order-1 md:order-1 flex justify-center items-center py-6 md:py-0">
              <MediaLayout
                image="https://ik.imagekit.io/pratik11/FOLD-1.1-IMAGE.png?updatedAt=1757749236600"
                videoSrc=""
              />
            </div>

            {/* Content on right for larger screens, bottom for mobile */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 order-2 md:order-2">
              <p className="headingstyle text-[#3F2F14] font-heading">
                Why is it Important?
              </p>
              {/* <h2 className="heading-lg text-[#3F2F14]"></h2> */}
              <p className="textstyles mt-4 max-w-xl font-sans">
                Logical reasoning turns children from passive learners into
                active thinkers. In today's world where information is cheap,
                thinking is priceless! Logical skills are like the brain's
                muscles. Once strengthened, they support every other learning
                journey.
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
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
