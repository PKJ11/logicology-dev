import Link from "next/link";
import MediaLayout from "./MediaLayout";
import CTAButton from "./CTAButton";

export default function Benefit() {
  return (
    <section id="benefit" className="w-full bg-brand-coral">
      <div className="mx-auto lg:max-w-[80vw]">
        <div className="overflow-hidden py-12 text-white">
          {/* Flex container */}
          <div className="flex flex-col items-center md:flex-row">
            {/* Content on left for larger screens, top for mobile */}
            <div className="order-2 flex w-full flex-col justify-end p-8 sm:p-12 md:order-1 md:w-1/2">
              <p className="headingstyle font-heading">How we Help?</p>
              <p className="textstyles mt-4 max-w-xl font-sans text-white/90">
                At Logicology we have a bouquet of products and subscriptions that help your child
                develop Logical Reasoning and Critical Thinking Skills. You can choose from our
                offerings (see below) to choose the one that suits you the best.
              </p>
              <div className="mt-6">
                <CTAButton
                  text="Learn more"
                  href="#offerings"
                  bg="#FFFFFF"
                  color="#AB4637" // brand teal text
                  hoverBg="#AB4637" // brand teal bg on hover
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

            {/* MediaLayout on right for larger screens, bottom for mobile */}
            <div className="order-1 flex w-full items-center justify-center md:order-2 md:w-1/2 md:py-0">
              <MediaLayout
                image="https://ik.imagekit.io/pratik11/HOW-WE-HELP.png?updatedAt=1758439842222"
                videoSrc=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
