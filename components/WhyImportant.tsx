import Link from "next/link";
import MediaLayout from "./MediaLayout";

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
                image="https://images.unsplash.com/photo-1543269664-76bc3997d9ea?q=80&w=1200&auto=format&fit=crop"
                videoSrc="https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_1.mp4?updatedAt=1756253537445"
              />
            </div>

            {/* Content on right for larger screens, bottom for mobile */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 order-2 md:order-2">
              <p className="heading-lg text-[#3F2F14] font-heading">Why is it</p>
              <h2 className="heading-lg text-[#3F2F14]">Important?</h2>
              <p className="mt-4 max-w-xl">
                Logical reasoning turns children from passive learners into
                active thinkers. In today's world where information is cheap,
                thinking is priceless! Logical skills are like the brain's
                muscles. Once strengthened, they support every other learning
                journey.
              </p>
              <div className="mt-6">
                <Link
                  href="#offerings"
                  className="btn bg-[#7E5C2E] text-white hover:bg-[#6f4f24]"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}