import Link from "next/link";
import MediaLayout from "./MediaLayout";
import CTAButton from "./CTAButton";

export default function Benefit() {
  return (
    <section id="benefit" className="w-full bg-brand-coral">
      <div className="lg:max-w-[80vw] mx-auto">
        <div className="text-white overflow-hidden py-12">
          {/* Flex container */}
          <div className="flex flex-col md:flex-row items-center">
            {/* Content on left for larger screens, top for mobile */}
            <div className="flex flex-col w-full md:w-1/2 p-8 sm:p-12 order-2 md:order-1 justify-end ">
              <p className=" font-heading headingstyle">How we Help?</p>
              <p className="textstyles mt-4 max-w-xl text-white/90 font-sans">
                At Logicology we have a bouquet of products and subscriptions
                that help your child develop Logical Reasoning and Critical
                Thinking Skills. Choose from books, board games, online puzzles,
                worksheets or subscriptions.
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

            {/* MediaLayout on right for larger screens, bottom for mobile */}
            <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center items-center py-6 md:py-0">
              <MediaLayout
                image="https://ik.imagekit.io/pratik2002/benifit-img.png?updatedAt=1757216326535"
                videoSrc=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
